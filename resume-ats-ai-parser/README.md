# Advanced Resume ATS Parser with AI Models

An enterprise-grade resume parsing system using advanced transformer models and NLP.

## Features
- Multi-format support (PDF & DOCX)
- BERT-based NER extraction
- Zero-shot section classification
- Skill taxonomy extraction
- Semantic resume-job matching
- ATS optimization
- REST API
- Docker support

## Quick Start

### Local Setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm

### Run CLI
python src/main.py resume.pdf -o output.json

### Run API
python -m uvicorn src.api.app:app --reload

Visit http://localhost:8000/docs for API documentation.

### Docker
docker-compose up -d

## Architecture
- Extraction Layer: PDF/DOCX parsing
- Parsing Layer: NER, Classification, Skill extraction
- Matching Layer: Semantic similarity
- Formatting: ATS-optimized output
