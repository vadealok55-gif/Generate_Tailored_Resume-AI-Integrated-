import logging
import re
from typing import Dict, List
from src.core.extractors.pdf_extractor import AdvancedPDFExtractor
from src.core.extractors.docx_extractor import AdvancedDOCXExtractor
from src.core.parsers.ner_parser import TransformerNERParser
from src.core.parsers.section_classifier import SectionClassifier
from src.core.parsers.skill_extractor import SkillExtractor
from src.core.models.resume_model import Resume, ContactInfo, Skill, Experience, Education

logger = logging.getLogger(__name__)

class ExtractionPipeline:
    def __init__(self):
        self.pdf_extractor = AdvancedPDFExtractor()
        self.docx_extractor = AdvancedDOCXExtractor()
        self.ner_parser = TransformerNERParser()
        self.section_classifier = SectionClassifier()
        self.skill_extractor = SkillExtractor()
    
    def process(self, file_path: str) -> Resume:
        logger.info(f"Processing file: {file_path}")
        
        extracted_data = self._extract_text(file_path)
        text = extracted_data["text"]
        
        sections = self.section_classifier.identify_sections(text)
        entities = self.ner_parser.extract_entities(text)
        skills = self.skill_extractor.extract_skills(text)
        
        resume = self._build_resume_object(text, sections, entities, skills)
        return resume
    
    def _extract_text(self, file_path: str) -> Dict:
        if file_path.endswith(".pdf"):
            return self.pdf_extractor.extract_with_layout(file_path)
        elif file_path.endswith(".docx"):
            return self.docx_extractor.extract_with_formatting(file_path)
        else:
            raise ValueError(f"Unsupported file format")
    
    def _build_resume_object(self, text: str, sections: Dict, entities: list, skills: list) -> Resume:
        # 1. Contact Information Extraction
        contact_text = ""
        if "contact information" in sections and sections["contact information"]:
            contact_text = "\n".join(sections["contact information"])
        else:
            # Fallback to the first 10 lines of the full text
            contact_text = "\n".join(text.split("\n")[:10])
            
        # Parse Email
        email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', contact_text)
        email = email_match.group(0) if email_match else "email@example.com"
        
        # Parse Phone
        phone_match = re.search(r'\+?\d[\d-\s()]{8,}\d', contact_text)
        phone = phone_match.group(0) if phone_match else None
        
        # Parse LinkedIn
        linkedin_match = re.search(r'linkedin\.com\/in\/[a-zA-Z0-9_-]+', contact_text, re.IGNORECASE)
        linkedin = linkedin_match.group(0) if linkedin_match else None
        
        # Parse Location (typically City, ST or City, Country)
        loc_match = re.search(r'([A-Z][a-zA-Z\s]+),\s*([A-Z]{2}|[A-Z][a-zA-Z\s]+)', contact_text)
        location = loc_match.group(0) if loc_match else None
        
        # Parse Name: First line that is not a phone/email/link
        name = "Name"
        for line in contact_text.split("\n"):
            line_clean = line.strip()
            if line_clean and "@" not in line_clean and "linkedin.com" not in line_clean and "github.com" not in line_clean and not re.search(r'\d{5}', line_clean):
                if len(line_clean) < 40 and not any(kw in line_clean.lower() for kw in ["phone", "email", "resum"]):
                    name = line_clean
                    break
                    
        contact_info = ContactInfo(
            name=name,
            email=email,
            phone=phone,
            linkedin=linkedin,
            location=location
        )

        # 2. Professional Summary Extraction
        summary = ""
        if "professional summary" in sections and sections["professional summary"]:
            summary = "\n".join(sections["professional summary"])

        # 3. Work Experience Extraction
        experience_items = []
        if "work experience" in sections and sections["work experience"]:
            exp_text = "\n".join(sections["work experience"])
            job_blocks = exp_text.split("\n\n")
            for block in job_blocks:
                block_clean = block.strip()
                if not block_clean:
                    continue
                
                lines = [l.strip() for l in block_clean.split("\n") if l.strip()]
                if not lines:
                    continue
                
                header = lines[0]
                role = "Software Engineer"
                company = "Tech Corp"
                start_date = None
                end_date = None
                
                if " at " in header:
                    parts = header.split(" at ")
                    role = parts[0].strip()
                    rest = parts[1]
                    if "(" in rest:
                        comp_parts = rest.split("(")
                        company = comp_parts[0].strip()
                        date_str = comp_parts[1].replace(")", "")
                        if "-" in date_str:
                            d_parts = date_str.split("-")
                            start_date = d_parts[0].strip()
                            end_date = d_parts[1].strip()
                    else:
                        company = rest.strip()
                
                bullets = []
                for line in lines[1:]:
                    if line.startswith("-") or line.startswith("*") or line.startswith("•"):
                        bullets.append(line.replace("-", "").replace("*", "").replace("•", "").strip())
                
                exp_item = Experience(
                    job_title=role,
                    company=company,
                    start_date=start_date,
                    end_date=end_date,
                    responsibilities=bullets,
                    achievements=[]
                )
                experience_items.append(exp_item)

        # 4. Education Extraction
        education_items = []
        if "education" in sections and sections["education"]:
            edu_text = "\n".join(sections["education"])
            edu_blocks = edu_text.split("\n\n")
            for block in edu_blocks:
                block_clean = block.strip()
                if not block_clean:
                    continue
                lines = [l.strip() for l in block_clean.split("\n") if l.strip()]
                if not lines:
                    continue
                
                header = lines[0]
                degree = header
                institution = "State University"
                grad_date = None
                
                if "," in header:
                    parts = header.split(",")
                    degree = parts[0].strip()
                    rest = parts[1]
                    if "(" in rest:
                        inst_parts = rest.split("(")
                        institution = inst_parts[0].strip()
                        grad_date = inst_parts[1].replace(")", "").strip()
                    else:
                        institution = rest.strip()
                
                edu_item = Education(
                    degree=degree,
                    institution=institution,
                    graduation_date=grad_date
                )
                education_items.append(edu_item)

        # 5. Skills mapping
        skill_objects = [Skill(name=s["name"], category=s.get("category")) for s in skills]

        resume = Resume(
            contact_info=contact_info,
            professional_summary=summary if summary else None,
            experience=experience_items,
            education=education_items,
            skills=skill_objects,
            extraction_metadata={"sections": list(sections.keys()), "entities": len(entities)}
        )
        return resume
