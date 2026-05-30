import pytest
from src.core.extractors.pdf_extractor import AdvancedPDFExtractor
from src.core.extractors.docx_extractor import AdvancedDOCXExtractor

def test_pdf_extractor():
    extractor = AdvancedPDFExtractor()
    assert extractor is not None

def test_docx_extractor():
    extractor = AdvancedDOCXExtractor()
    assert extractor is not None
