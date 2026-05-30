import pdfplumber
from typing import Dict, Any
import logging
from src.core.extractors.base_extractor import BaseExtractor

logger = logging.getLogger(__name__)

class AdvancedPDFExtractor(BaseExtractor):
    def extract_text(self, file_path: str) -> str:
        try:
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""
                    text += "\n"
            return text
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            raise
    
    def extract_with_layout(self, file_path: str) -> Dict[str, Any]:
        try:
            result = {
                "text": "",
                "pages": [],
                "tables": [],
                "metadata": {}
            }
            
            with pdfplumber.open(file_path) as pdf:
                result["metadata"] = pdf.metadata or {}
                
                for page_num, page in enumerate(pdf.pages):
                    page_data = {
                        "page_number": page_num + 1,
                        "text": page.extract_text() or "",
                        "height": page.height,
                        "width": page.width,
                        "tables": page.extract_tables() or []
                    }
                    result["pages"].append(page_data)
                    result["text"] += page_data["text"] + "\n"
            
            return result
        except Exception as e:
            logger.error(f"Error extracting layout: {e}")
            raise
    
    def extract_structured_data(self, file_path: str) -> Dict[str, Any]:
        return self.extract_with_layout(file_path)
