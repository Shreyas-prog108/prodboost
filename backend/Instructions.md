## Backend Execution Guide — Future of Work & Productivity Platform

Stack: FastAPI + Neon + Upstash (Serverless Architecture)

---

# 1. Core Philosophy

Build a privacy-first, AI-augmented workflow engine for:

* Students
* Researchers
* Early professionals

System principles:

* Serverless-first
* Event-driven
* AI-augmented but not AI-dependent
* Private-by-default
* Modular but deployable as a single FastAPI app

The backend must be:

* Stateless
* Async-first
* Designed for serverless execution (Vercel, Railway, Fly, etc.)

---

# 2. Tech Stack

* Python 3.11+
* FastAPI
* Pydantic v2
* SQLAlchemy (async) OR SQLModel
* asyncpg
* Neon (PostgreSQL serverless)
* Upstash Redis (HTTP-based client)
* Background tasks via:

  * Upstash QStash OR
  * Serverless cron OR
  * FastAPI + Redis-based job queue

---

# 3. Architecture

Pattern:

* Modular monolith
* Domain-based folders
* Pure service layer (no business logic in routers)
* AI provider abstraction layer

Folder Structure:

```
app/
  main.py
  core/
    config.py
    security.py
    logging.py
    database.py
    redis.py
  modules/
    auth/
    users/
    research/
    meetings/
    tasks/
    automation/
    integrations/
    knowledge/
  services/
    ai_provider.py
  jobs/
    handlers.py
  schemas/
  models/
```

All endpoints must be async.

---

# 4. Database (Neon)

Use:

* Async engine
* Connection pooling
* Environment-driven config

Environment:

```
DATABASE_URL=
JWT_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
AI_PROVIDER=
AI_API_KEY=
ENCRYPTION_SECRET=
```

Use migrations:

* Alembic

---

# 5. Core Modules

---

## 5.1 Auth Module

Features:

* Register
* Login
* JWT access tokens
* Password hashing (bcrypt)

Entity: User

Fields:

* id
* email
* hashed_password
* role (USER | ADMIN | TEAM_LEAD)
* created_at

Routes:

POST /auth/register
POST /auth/login

Requirements:

* JWT expiration 15–30 min
* Refresh tokens optional for hackathon
* Rate limit login using Redis

---

## 5.2 Research Copilot Module

Entities:

ResearchProject

* id
* user_id
* title
* description
* created_at

Source

* id
* project_id
* url
* title
* metadata JSON
* extracted_text
* citation_data JSON

Note

* id
* project_id
* content
* tags JSON
* linked_source_id nullable

Draft

* id
* project_id
* content
* citations JSON
* version
* created_at

Routes:

POST /research/projects
GET /research/projects
POST /research/{id}/sources
POST /research/{id}/notes
POST /research/{id}/generate-draft

Draft generation:

* Push job to Redis queue
* Worker calls AI provider
* Save structured citations separately

Do not:

* Store raw AI prompts
* Store unnecessary scraped content

---

## 5.3 Meeting / Class Summarization

Entity: MeetingSession

Fields:

* id
* user_id
* title
* transcript
* summary nullable
* action_items JSON nullable
* status (PENDING | SUMMARIZED | FAILED)
* privacy_level (PRIVATE | TEAM | PUBLIC)

Routes:

POST /meetings/upload
POST /meetings/{id}/summarize
GET /meetings/{id}

Flow:

1. Store transcript
2. Push background job
3. Worker:

   * Extract decisions
   * Extract questions
   * Extract tasks
4. Save tasks in Task Module
5. Update status

Fallback:
If AI unavailable:

* Keep transcript
* Mark FAILED
* Retry using retry count

---

## 5.4 Task Module

Entity: Task

Fields:

* id
* user_id
* title
* description
* due_date
* status (TODO | IN_PROGRESS | DONE)
* source (MANUAL | MEETING | MAIL | AI)
* created_at

Routes:

POST /tasks
GET /tasks
PATCH /tasks/{id}

All extracted meeting actions auto-create tasks.

---

## 5.5 Automation Module

Entity: AutomationRule

Fields:

* id
* user_id
* trigger_type
* condition_json
* action_json
* is_active

Examples:

Trigger:

* NEW_MEETING_SUMMARY
* KEYWORD_IN_EVENT
* DAILY_DIGEST

Action:

* CREATE_TASK
* SEND_NOTIFICATION
* GENERATE_SUMMARY

Routes:

POST /automation/rules
GET /automation/rules
POST /automation/execute

Processing:

* Events pushed into Redis
* Worker processes rules
* Idempotent processing required

---

## 5.6 Integrations (Metadata Only)

Entity: Integration

Fields:

* id
* user_id
* type (GOOGLE_MAIL | CALENDAR | DRIVE | SLACK)
* access_token (encrypted)
* refresh_token (encrypted)
* expiry

Rules:

* Encrypt tokens using ENCRYPTION_SECRET
* Never log tokens
* Store metadata only unless user opts in

Route:

POST /integrations/connect
GET /orchestration/feed

OrchestrationEvent

* id
* user_id
* source
* type
* payload JSON
* processed boolean

---

## 5.7 Knowledge Hub

Entity: Team

* id
* name
* description

KnowledgeEntry

* id
* team_id
* title
* content
* tags JSON
* version
* created_at

Routes:

POST /teams
POST /knowledge
GET /knowledge/{team_id}

Version control required on update.

---

# 6. Background Jobs (Serverless Compatible)

Approach Options:

Option A: Upstash QStash (recommended)
Option B: Redis list-based queue
Option C: Serverless scheduled triggers

Jobs:

* generate_draft
* summarize_meeting
* execute_automation
* integration_sync
* daily_digest

Requirements:

* Retry up to 3 times
* Log failures in DB
* Idempotent execution
* Status tracking required

Redis Keys:

```
queue:research
queue:meetings
queue:automation
```

---

# 7. AI Provider Abstraction

Create:

```
class AIProvider:
    async def generate_summary(self, text: str) -> str:
        ...

    async def generate_draft(self, context: dict) -> str:
        ...
```

Implement:

* KimiProvider
* MockProvider

Select via:
AI_PROVIDER env variable

No module may directly call AI SDK.

---

# 8. API Standards

All responses must follow:

```
{
  "success": true,
  "data": {},
  "error": null
}
```

Use:

* Pydantic response models
* Dependency-based authentication
* Global exception handler
* Structured logging

---

# 9. Privacy & Security

Must implement:

* HTTPS in production
* Token encryption
* No logging of transcript or mail content
* Default privacy level: PRIVATE
* Data minimization principle

Redis must:

* Store temporary data only
* TTL applied to volatile data

---

# 10. Health & Observability

Endpoints:

GET /health

Must check:

* DB connectivity
* Redis connectivity

Logging:

* Structured JSON
* Request ID tracing
* Job tracing

---

# 11. Hackathon MVP Order

If time constrained:

1. Auth
2. Task module
3. Meeting summarization
4. Research copilot draft
5. Basic automation
6. Integrations metadata
7. Knowledge hub

---

# 12. Serverless Constraints Checklist

* No long blocking tasks
* Everything async
* No in-memory queues
* All background logic externalized
* Cold-start aware design

---

# 13. Deployment Strategy

Deployable on:

* Vercel (Edge Functions for API)
* Railway
* Fly.io
* Render

Must include:

* Dockerfile
* .env.example
* Alembic migrations
* README with setup steps