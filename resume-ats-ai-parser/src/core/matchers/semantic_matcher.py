import torch
from sentence_transformers import SentenceTransformer, util
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

class SemanticMatcher:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        try:
            self.model = SentenceTransformer(model_name, device=self.device)
        except Exception as e:
            logger.error(f"Error loading semantic model: {e}")
            raise
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        embeddings1 = self.model.encode(text1, convert_to_tensor=True)
        embeddings2 = self.model.encode(text2, convert_to_tensor=True)
        similarity = util.pytorch_cos_sim(embeddings1, embeddings2)
        return similarity.item()
    
    def find_similar_skills(self, resume_skills: List[str], job_skills: List[str]) -> List[Dict]:
        resume_embeddings = self.model.encode(resume_skills, convert_to_tensor=True)
        job_embeddings = self.model.encode(job_skills, convert_to_tensor=True)
        cos_sim = util.pytorch_cos_sim(resume_embeddings, job_embeddings)
        
        matches = []
        for i, resume_skill in enumerate(resume_skills):
            for j, job_skill in enumerate(job_skills):
                similarity = cos_sim[i][j].item()
                if similarity > 0.7:
                    matches.append({
                        "resume_skill": resume_skill,
                        "job_skill": job_skill,
                        "similarity": similarity
                    })
        return matches
