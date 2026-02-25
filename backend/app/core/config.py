from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    UPSTASH_REDIS_REST_URL: str
    UPSTASH_REDIS_REST_TOKEN: str
    AI_PROVIDER: str
    AI_API_KEY: str
    ENCRYPTION_SECRET: str
    KIMI_API_KEY: str | None = None
    GROQ_API_KEY: str | None = None
    REDIS_URL: str = "redis://localhost:6379/0"
    ENVIRONMENT: str = "development"
    # Comma-separated list of allowed CORS origins, e.g. "http://localhost:3000,https://app.example.com"
    ALLOWED_ORIGINS: str = "http://localhost:3000"
    
    model_config = SettingsConfigDict(env_file=".env")
    
settings = Settings()
