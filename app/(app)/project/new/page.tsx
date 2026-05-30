'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects } from '../../../../hooks/useProjects';

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject } = useProjects();
  const [step, setStep] = useState(1);

  // Form states
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState('');
  const [structuredResume, setStructuredResume] = useState<any>(null);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ fileName: string; fileType: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNextStep = () => setStep((s) => s + 1);
  const handlePrevStep = () => setStep((s) => s - 1);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.parsedText) {
        setParsedText(data.parsedText);
        setUploadedFileInfo({
          fileName: data.fileName,
          fileType: data.fileType,
        });
        if (data.structuredResume) {
          setStructuredResume(data.structuredResume);
        }
      }
    } catch (err) {
      console.error('File parsing failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateAndTailor = async () => {
    setIsGenerating(true);
    try {
      const project = await createProject.mutateAsync({
        jobTitle,
        companyName,
        jobDescription,
      });

      await fetch(`/api/projects/${project.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: parsedText,
          structuredResume: structuredResume,
          uploadedFile: uploadedFileInfo ? {
            fileName: uploadedFileInfo.fileName,
            fileType: uploadedFileInfo.fileType,
            filePath: `/uploads/${uploadedFileInfo.fileName}`,
            parsedText: parsedText,
          } : null,
        }),
      });

      router.push(`/project/${project.id}`);
    } catch (err) {
      console.error('AI Tailoring failed:', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl w-full mx-auto flex-grow flex flex-col justify-center">
      {/* Wizard Steps indicator */}
      <div className="flex items-center justify-between mb-12">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${step >= num ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-500'}`}>
              {num}
            </div>
            {num < 3 && <div className={`w-32 h-0.5 mx-4 ${step > num ? 'bg-blue-600' : 'bg-slate-900'}`} />}
          </div>
        ))}
      </div>

      <div className="border border-slate-900 bg-slate-950/50 rounded-xl p-8 shadow-xl backdrop-blur-md">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Job Information</h2>
            <p className="text-slate-400 text-sm mb-6">Describe the role you are targeting.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Company Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Job Description</label>
                <textarea
                  placeholder="Paste the job description here..."
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>

            <button
              disabled={!jobTitle || !jobDescription}
              onClick={handleNextStep}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-lg text-sm mt-8 transition-colors"
            >
              Continue to Resume
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Upload Existing Resume</h2>
            <p className="text-slate-400 text-sm mb-6">Upload your resume in PDF or DOCX format for parsing.</p>

            <div className="space-y-6">
              <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center bg-slate-950/20">
                <input
                  type="file"
                  id="resume-file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="resume-file" className="cursor-pointer group">
                  <span className="block text-slate-300 group-hover:text-blue-500 font-medium transition-colors mb-2">
                    {file ? file.name : 'Choose a PDF or DOCX file'}
                  </span>
                  <span className="text-xs text-slate-500 block">Click to select files from your computer</span>
                </label>
              </div>

              {isUploading && (
                <div className="text-center text-sm text-slate-400 animate-pulse">Parsing file content...</div>
              )}

              {parsedText && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Parsed Text Preview</label>
                  <textarea
                    rows={6}
                    value={parsedText}
                    onChange={(e) => setParsedText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none resize-none"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={handlePrevStep}
                className="w-1/2 border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 font-medium py-3 px-6 rounded-lg text-sm transition-colors"
              >
                Back
              </button>
              <button
                disabled={!parsedText}
                onClick={handleNextStep}
                className="w-1/2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-lg text-sm transition-colors"
              >
                Continue to Review
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to Tailor</h2>
            <p className="text-slate-400 text-sm mb-6">Verify details before launching the AI tailoring engine.</p>

            <div className="space-y-4 border border-slate-900 bg-slate-950/40 rounded-lg p-6">
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Target Role</span>
                <span className="font-semibold text-white">{jobTitle}</span>
              </div>
              {companyName && (
                <div>
                  <span className="text-slate-500 text-xs block mb-0.5">Company</span>
                  <span className="font-semibold text-white">{companyName}</span>
                </div>
              )}
              <div>
                <span className="text-slate-500 text-xs block mb-0.5">Resume File</span>
                <span className="text-slate-300 text-sm">{file?.name || 'Manual text input'}</span>
              </div>
            </div>

            {isGenerating ? (
              <div className="text-center text-sm py-6 animate-pulse text-blue-400 font-medium">
                AI is tailoring your resume... This may take up to a minute.
              </div>
            ) : (
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handlePrevStep}
                  className="w-1/2 border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 font-medium py-3 px-6 rounded-lg text-sm transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateAndTailor}
                  className="w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-6 rounded-lg text-sm transition-all shadow-lg shadow-blue-500/20"
                >
                  Generate Tailored Resume
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
