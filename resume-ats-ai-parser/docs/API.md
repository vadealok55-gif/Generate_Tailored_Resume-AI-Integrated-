# API Documentation

## Endpoints

### Health Check
GET /health

### Parse Resume
POST /api/v1/resume/parse
- Request: multipart/form-data with 'file' parameter
- Response: JSON with extracted resume data
