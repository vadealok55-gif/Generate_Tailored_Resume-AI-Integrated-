import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { parsePDF } from '@/lib/parsers/parsePDF';
import { parseDOCX } from '@/lib/parsers/parseDOCX';
import { parseResumeText } from '@/lib/ai/parser';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = file.name;
    const fileType = file.type || fileName.split('.').pop() || '';

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let parsedText = '';
    if (fileName.toLowerCase().endsWith('.pdf')) {
      parsedText = await parsePDF(buffer);
    } else if (fileName.toLowerCase().endsWith('.docx')) {
      parsedText = await parseDOCX(buffer);
    } else {
      parsedText = buffer.toString('utf-8');
    }

    // Try to parse using the companion Python FastAPI NLP microservice first
    let structuredResume = null;
    try {
      const pythonFormData = new FormData();
      // Re-package the file buffer back into a File/Blob payload for the Python POST request
      const fileBlob = new Blob([buffer], { type: file.type });
      pythonFormData.append('file', fileBlob, fileName);
      
      const pythonResponse = await fetch('http://127.0.0.1:8000/api/v1/resume/parse', {
        method: 'POST',
        body: pythonFormData,
        signal: AbortSignal.timeout(30000), // 30-second timeout for CPU-intensive NLP processing
      });
      
      if (pythonResponse.ok) {
        const pythonResult = await pythonResponse.json();
        if (pythonResult.status === 'success' && pythonResult.data) {
          const pyData = pythonResult.data;
          
          const mappedMeta = {
            fullName: pyData.contact_info?.name || 'Candidate Name',
            email: pyData.contact_info?.email || 'candidate@example.com',
            phone: pyData.contact_info?.phone || '',
            location: pyData.contact_info?.location || '',
            linkedin: pyData.contact_info?.linkedin || '',
            github: '',
            website: '',
            jobTitle: pyData.experience?.[0]?.job_title || ''
          };
          
          const mappedExperience = (pyData.experience || []).map((exp: any, idx: number) => ({
            id: `exp-item-${idx + 1}`,
            role: exp.job_title || 'Software Engineer',
            company: exp.company || 'Tech Corp',
            startDate: exp.start_date || '',
            endDate: exp.end_date || 'Present',
            bullets: (exp.responsibilities || []).map((resp: string, bidx: number) => ({
              id: `exp-bullet-${idx + 1}-${bidx + 1}`,
              text: resp,
              highlighted: false
            }))
          }));
          
          const mappedEducation = (pyData.education || []).map((edu: any, idx: number) => ({
            id: `edu-item-${idx + 1}`,
            degree: edu.degree || 'Degree',
            institution: edu.institution || 'State University',
            endDate: edu.graduation_date || ''
          }));
          
          const skillsByCategory: Record<string, string[]> = {};
          (pyData.skills || []).forEach((sk: any) => {
            const cat = sk.category || 'Core Technologies';
            if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
            skillsByCategory[cat].push(sk.name);
          });
          
          const mappedSkills = Object.entries(skillsByCategory).map(([cat, list], idx) => ({
            id: `skill-group-${idx + 1}`,
            category: cat,
            skills: list
          }));
          
          structuredResume = {
            meta: mappedMeta,
            sections: [
              {
                id: 'summary-sec-id',
                type: 'summary',
                title: 'Professional Summary',
                order: 0,
                visible: true,
                content: pyData.professional_summary || 'Experienced professional specializing in scalable software architectures.'
              },
              {
                id: 'experience-sec-id',
                type: 'experience',
                title: 'Work Experience',
                order: 1,
                visible: true,
                content: mappedExperience
              },
              {
                id: 'skills-sec-id',
                type: 'skills',
                title: 'Skills',
                order: 2,
                visible: true,
                content: mappedSkills
              },
              {
                id: 'education-sec-id',
                type: 'education',
                title: 'Education',
                order: 3,
                visible: true,
                content: mappedEducation
              }
            ]
          };
          
          console.log('Successfully parsed resume using Python FastAPI NLP microservice!');
        }
      } else {
        console.error('Python microservice returned an error response:', pythonResponse.status, await pythonResponse.text());
      }
    } catch (err: any) {
      console.warn('Python microservice not available, timed out, or encountered an error:', err.message || err);
    }

    // Fallback: If Python microservice is offline, execute native high-fidelity Claude Haiku extractor
    if (!structuredResume) {
      structuredResume = await parseResumeText(parsedText);
    }

    return NextResponse.json({
      fileName,
      fileType,
      parsedText: parsedText.trim(),
      structuredResume,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error parsing file' }, { status: 500 });
  }
}
