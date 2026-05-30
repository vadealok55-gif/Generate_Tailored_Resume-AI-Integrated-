import { Resume } from '../schema/resume';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { SYSTEM_PROMPT } from './prompts';
import { parseResumeText } from './parser';

export async function tailorResume(
  projectId: string,
  structuredResume: any,
  rawText: string,
  jobTitle: string,
  jobDescription: string
): Promise<Resume> {
  // If Model 1's structured resume was not passed, execute Model 1 parsing now
  let baseResume = structuredResume;
  if (!baseResume) {
    baseResume = await parseResumeText(rawText);
  }

  try {
    const prompt = `
      You are an expert resume optimizer (Model 2). Your task is to take the structured resume JSON (Model 1 output) and customize it to align precisely with the target role and description.
      
      TARGET JOB ROLE: ${jobTitle}
      TARGET JOB DESCRIPTION: ${jobDescription}
      
      STRUCTURED RESUME BASE (Model 1 Output):
      ${JSON.stringify(baseResume)}
      
      INSTRUCTIONS FOR ATS OPTIMIZATION AND INTEGRITY:
      1. COPY ALL candidate metadata (Full Name, Email, Phone, Location, Social Handles) directly to the new resume.
      2. COPY ALL extracted experience items (Company Names, Job Roles, Start/End Dates) and education records (Institution Names, Degrees, Dates) exactly as they are without inventing new history.
      3. For the PROFESSIONAL SUMMARY: Rewrite it into a high-impact, ATS-optimized summary that directly aligns the candidate's actual background with the requirements of the "${jobTitle}" role.
      4. For the WORK EXPERIENCE BULLETS:
         - Go through each bullet point achievement in the structured base.
         - Optimize and rewrite each bullet point to emphasize matching skills, methodologies, and core competencies mentioned in the target Job Description.
         - Incorporate exact keyword spelling from the Job Description (e.g. if the JD asks for "React.js", ensure you use "React.js" in place of "React" or "ReactJS").
      5. For the SKILLS section:
         - Retain the candidate's actual skills.
         - Categorize and prioritize skills to highlight technologies, frameworks, and tools specifically listed in the target Job Description first.
      
      Output ONLY valid JSON matching the identical schema structure as the input, with optimized summaries and experience bullets.
      Do not include markdown code block ticks (\`\`\`json), explanations, or notes. Output raw JSON.
    `;

    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'), // Using Claude Sonnet as the dedicated, deep tailoring optimizer (Model 2)
      system: SYSTEM_PROMPT,
      prompt: prompt,
    });

    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonString);

    return {
      id: 'resume-' + Math.random().toString(36).substr(2, 9),
      projectId,
      version: 1,
      meta: result.meta,
      sections: result.sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Model 2 tailoring failed, returning Model 1 parsed base directly:', error);
    return {
      id: 'resume-placeholder-id',
      projectId,
      version: 1,
      meta: baseResume.meta,
      sections: baseResume.sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}
