# Setup Guide

## Installation

### Prerequisites
- Python 3.11+
- pip or conda
- CUDA 11.8+ (optional)

### Local Installation

1. Clone repository:
python -m venv venv
source venv/bin/activate

2. Install dependencies:
pip install -r requirements.txt

3. Download spacy model:
python -m spacy download en_core_web_sm

4. Create .env:
cp .env.example .env

## Running

### CLI
python src/main.py resume.pdf -o output.json

### API
python -m uvicorn src.api.app:app --reload

### Docker
docker-compose up -d

## Testing
pytest tests/ -v
