import torch
from transformers import pipeline
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

class TransformerNERParser:
    def __init__(self, model_name: str = "bert-base-uncased"):
        self.model_name = model_name
        self.device = 0 if torch.cuda.is_available() else -1
        
        try:
            self.nlp = pipeline("ner", model=model_name, device=self.device)
            logger.info(f"Loaded NER model: {model_name}")
        except Exception as e:
            logger.error(f"Error loading NER model: {e}")
            raise
    
    def extract_entities(self, text: str) -> List[Dict]:
        try:
            chunks = self._chunk_text(text, chunk_size=512)
            all_entities = []
            
            for chunk in chunks:
                entities = self.nlp(chunk)
                all_entities.extend(entities)
            
            return self._process_entities(all_entities)
        except Exception as e:
            logger.error(f"Error extracting entities: {e}")
            return []
    
    def _chunk_text(self, text: str, chunk_size: int = 512) -> List[str]:
        words = text.split()
        chunks = []
        current_chunk = []
        current_size = 0
        
        for word in words:
            if current_size + len(word) > chunk_size:
                chunks.append(" ".join(current_chunk))
                current_chunk = [word]
                current_size = len(word)
            else:
                current_chunk.append(word)
                current_size += len(word)
        
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        
        return chunks
    
    def _process_entities(self, entities: List[Dict]) -> List[Dict]:
        processed = {}
        for entity in entities:
            key = entity["word"].lower()
            if key not in processed or entity["score"] > processed[key]["score"]:
                processed[key] = entity
        return list(processed.values())
