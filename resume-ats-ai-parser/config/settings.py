import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME = "Resume ATS AI Parser"
    VERSION = "1.0.0"
    DEBUG = os.getenv("DEBUG", "False") == "True"
    
    BASE_DIR = Path(__file__).resolve().parent.parent
    DATA_DIR = BASE_DIR / "data"
    MODELS_DIR = BASE_DIR / "models"
    LOGS_DIR = BASE_DIR / "logs"
    
    NER_MODEL = os.getenv("NER_MODEL", "bert-base-uncased")
    EMBEDDINGS_MODEL = os.getenv("EMBEDDINGS_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    CLASSIFIER_MODEL = os.getenv("CLASSIFIER_MODEL", "bert-base-uncased")
    
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 8000))
    API_WORKERS = int(os.getenv("API_WORKERS", 4))
    
    MAX_UPLOAD_SIZE = 50 * 1024 * 1024
    BATCH_SIZE = 32
    NUM_WORKERS = 4
    DEVICE = os.getenv("DEVICE", "cuda")
    
    CACHE_ENABLED = os.getenv("CACHE_ENABLED", "True") == "True"
    CACHE_TTL = 3600
    
    DB_URL = os.getenv("DB_URL", "sqlite:///./app.db")
    
    SKILL_SIMILARITY_THRESHOLD = 0.7
    EXPERIENCE_MATCH_THRESHOLD = 0.6
    SECTION_CONFIDENCE_THRESHOLD = 0.5

settings = Settings()
