from typing import Protocol, Dict, Any
import asyncio
import logging
import json
from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIProvider(Protocol):
    async def generate_summary(self, text: str) -> str:
        ...
        
    async def extract_meeting_actions(self, transcript: str) -> dict:
        ...

    async def generate_draft(self, context: Dict[str, Any]) -> str:
        ...


class MockProvider(AIProvider):
    async def generate_summary(self, text: str) -> str:
        await asyncio.sleep(1) # Simulate network call
        logging.info("MockProvider generated a summary.")
        return f"This is a mock summary of {len(text)} characters."
        
    async def extract_meeting_actions(self, transcript: str) -> dict:
        await asyncio.sleep(2) # Simulate processing
        logging.info("MockProvider extracted meeting actions.")
        return {
            "decisions": ["Proceed with the new UI design.", "Use PostgreSQL for the backend."],
            "questions": ["When is the hard deadline?", "Who is handling the deployment?"],
            "tasks": [
                {"title": "Implement auth styling", "assignee": "Design Team", "due_date": "Next Tuesday"},
                {"title": "Setup CI/CD pipeline", "assignee": "DevOps", "due_date": "EOD Friday"}
            ]
        }

    async def generate_draft(self, context: Dict[str, Any]) -> str:
        await asyncio.sleep(2) # Simulate processing
        logging.info(f"MockProvider generated a draft based on context: {context.keys()}")
        return "This is a comprehensive mock draft generated from the project's notes and sources."


class KimiProvider(AIProvider):
    def __init__(self):
        # Kimi (Moonshot) is compatible with the OpenAI SDK
        api_key = settings.KIMI_API_KEY or settings.AI_API_KEY
        if not api_key:
            raise ValueError("KIMI_API_KEY must be set to use KimiProvider")
            
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url="https://api.moonshot.cn/v1"
        )
        # Using the standard 8k model
        self.model = "moonshot-v1-8k"

    async def generate_summary(self, text: str) -> str:
        prompt = f"Summarize the following text concisely:\n\n{text}"
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a precise and helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content

    async def extract_meeting_actions(self, transcript: str) -> dict:
        prompt = f"""
Extract action items, decisions, and questions from the following meeting transcript.
Format the output EXACTLY as a JSON object with this structure:
{{
    "decisions": ["string"],
    "questions": ["string"],
    "tasks": [
        {{"title": "string", "assignee": "string or null", "due_date": "string or null"}}
    ]
}}

Transcript:
{transcript}
"""
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an assistant that extracts structured JSON data from meeting transcripts. Output raw JSON only, without markdown blocks."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )
        
        content = response.choices[0].message.content.strip()
        # Clean potential markdown block formatting
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
            
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            logger.error(
                f"Failed to parse Kimi output as JSON. Raw response: {content!r}",
                exc_info=True
            )
            raise ValueError(
                f"AI provider returned malformed JSON that could not be parsed: {e}"
            ) from e

    async def generate_draft(self, context: Dict[str, Any]) -> str:
        prompt = f"Write a comprehensive research draft utilizing the following project context:\n\n{json.dumps(context, indent=2)}"
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert technical writer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        return response.choices[0].message.content


class GroqProvider(AIProvider):
    def __init__(self):
        api_key = settings.GROQ_API_KEY or settings.AI_API_KEY
        if not api_key:
            raise ValueError("GROQ_API_KEY must be set to use GroqProvider")
            
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1"
        )
        self.model = "llama-3.3-70b-versatile"

    async def generate_summary(self, text: str) -> str:
        prompt = f"Summarize the following text concisely:\n\n{text}"
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a precise and helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content

    async def extract_meeting_actions(self, transcript: str) -> dict:
        prompt = f"""
Extract action items, decisions, and questions from the following meeting transcript.
Format the output EXACTLY as a JSON object with this structure:
{{
    "decisions": ["string"],
    "questions": ["string"],
    "tasks": [
        {{"title": "string", "assignee": "string or null", "due_date": "string or null"}}
    ]
}}

Transcript:
{transcript}
"""
        response = await self.client.chat.completions.create(
            model=self.model,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are an assistant that extracts structured JSON data from meeting transcripts. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )
        
        content = response.choices[0].message.content
        return json.loads(content)

    async def generate_draft(self, context: Dict[str, Any]) -> str:
        prompt = f"Write a comprehensive research draft utilizing the following project context:\n\n{json.dumps(context, indent=2)}"
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert technical writer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        return response.choices[0].message.content


def get_ai_provider(provider_type: str = "mock") -> AIProvider:
    if provider_type.lower() == "kimi":
        return KimiProvider()
    if provider_type.lower() == "groq":
        return GroqProvider()
    if provider_type.lower() == "mock":
        return MockProvider()
    raise ValueError(f"Unknown AI Provider: {provider_type}")
