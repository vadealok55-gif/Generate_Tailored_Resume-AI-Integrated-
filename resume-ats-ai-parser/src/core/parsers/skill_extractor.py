import logging
from typing import List, Dict
from difflib import SequenceMatcher

logger = logging.getLogger(__name__)

class SkillExtractor:
    SKILL_TAXONOMY = {
        "programming_languages": [
            "python", "java", "javascript", "typescript", "c++", "c#",
            "ruby", "php", "swift", "kotlin", "go", "rust"
        ],
        "web_frameworks": [
            "react", "vue", "angular", "django", "flask", "spring",
            "nodejs", "express", "fastapi", "laravel"
        ],
        "databases": [
            "sql", "mysql", "postgresql", "mongodb", "redis",
            "cassandra", "dynamodb", "oracle"
        ],
        "cloud_platforms": [
            "aws", "azure", "gcp", "heroku", "digitalocean"
        ],
        "devops_tools": [
            "docker", "kubernetes", "jenkins", "gitlab ci",
            "terraform", "ansible", "prometheus"
        ]
    }
    
    def __init__(self):
        self.all_skills = self._flatten_taxonomy()
    
    def _flatten_taxonomy(self) -> Dict[str, str]:
        flat = {}
        for category, skills in self.SKILL_TAXONOMY.items():
            for skill in skills:
                flat[skill.lower()] = category
        return flat
    
    def extract_skills(self, text: str) -> List[Dict]:
        text_lower = text.lower()
        found_skills = {}
        
        for skill, category in self.all_skills.items():
            if self._find_skill_in_text(text_lower, skill):
                if skill not in found_skills:
                    found_skills[skill] = {"name": skill, "category": category}
        
        return list(found_skills.values())
    
    def _find_skill_in_text(self, text: str, skill: str) -> bool:
        words = text.split()
        for word in words:
            word_clean = word.strip('.,;:').lower()
            if word_clean == skill:
                return True
        return skill in text
