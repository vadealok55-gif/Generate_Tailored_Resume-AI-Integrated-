import torch
from transformers import pipeline
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

class SectionClassifier:
    SECTION_LABELS = [
        "contact information", "professional summary", "work experience",
        "education", "skills", "certifications", "projects",
        "languages", "publications", "awards"
    ]
    
    def __init__(self):
        self.device = 0 if torch.cuda.is_available() else -1
        try:
            self.classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli",
                device=self.device
            )
        except Exception as e:
            logger.error(f"Error loading classifier: {e}")
            raise
    
    def classify_text_blocks(self, text_blocks: List[str]) -> List[Dict]:
        results = []
        for block in text_blocks:
            if len(block.strip()) < 10:
                continue
            try:
                classification = self.classifier(
                    block[:1000], self.SECTION_LABELS, multi_class=False
                )
                results.append({
                    "text": block,
                    "section": classification["labels"][0],
                    "confidence": classification["scores"][0]
                })
            except Exception as e:
                logger.warning(f"Error classifying: {e}")
                continue
        return results
    
    def identify_sections(self, text: str) -> Dict[str, List[str]]:
        blocks = [b.strip() for b in text.split("\n\n") if b.strip()]
        classified_blocks = self.classify_text_blocks(blocks)
        
        sections = {label: [] for label in self.SECTION_LABELS}
        for result in classified_blocks:
            if result["confidence"] > 0.3:
                sections[result["section"]].append(result["text"])
        
        return {k: v for k, v in sections.items() if v}
