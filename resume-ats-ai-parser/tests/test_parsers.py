import pytest
from src.core.parsers.skill_extractor import SkillExtractor

def test_skill_extraction():
    extractor = SkillExtractor()
    text = "I have experience with Python, Java, and Docker"
    skills = extractor.extract_skills(text)
    assert len(skills) > 0
