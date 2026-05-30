from src.core.models.resume_model import Resume
from typing import Dict

class ATSFormatter:
    def format_to_ats(self, resume: Resume) -> str:
        output = []
        output.append(f"{resume.contact_info.name}")
        output.append(f"{resume.contact_info.email}")
        output.append("")
        
        if resume.professional_summary:
            output.append("PROFESSIONAL SUMMARY")
            output.append(resume.professional_summary)
            output.append("")
        
        if resume.skills:
            output.append("SKILLS")
            for skill in resume.skills:
                output.append(f"- {skill.name}")
            output.append("")
        
        if resume.experience:
            output.append("WORK EXPERIENCE")
            for exp in resume.experience:
                output.append(f"{exp.job_title} - {exp.company}")
                for resp in exp.responsibilities:
                    output.append(f"- {resp}")
                output.append("")
        
        return "\n".join(output)
    
    def format_to_json(self, resume: Resume) -> Dict:
        return resume.to_dict()
