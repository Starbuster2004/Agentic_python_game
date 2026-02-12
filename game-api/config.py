from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file = ".env",
        extra = "ignore",
        env_file_encoding = "utf-8"
    )

    GROQ_API_KEY: str
    LLM_MODEL: str = "llama-3.3-70b-versatile"
    LLM_TEMPERATURE: float = 0.7
    LLM_MAX_TOKENS: int = 200
    
    API_HOST:str = "0.0.0.0"
    API_PORT:int = 8000
    
    MAX_CONVERSATION_HISTORY:int = 20
    INTERACTION_DISTANCE:float = 55.0

settings = Settings()