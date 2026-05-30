import sys
from pathlib import Path

# Add project root directory to python path to prevent import ModuleNotFoundError
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import tempfile
from config.settings import settings
from src.ml.pipelines.extraction_pipeline import ExtractionPipeline

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Advanced Resume ATS Parser"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = ExtractionPipeline()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME, "version": settings.VERSION}

@app.post("/api/v1/resume/parse")
async def parse_resume(file: UploadFile = File(...)):
    try:
        if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        resume = pipeline.process(tmp_path)
        Path(tmp_path).unlink()
        
        return {
            "status": "success",
            "data": resume.to_dict(),
            "metadata": {"filename": file.filename, "file_size": len(content)}
        }
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.API_HOST, port=settings.API_PORT)
