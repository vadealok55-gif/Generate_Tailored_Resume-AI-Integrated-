'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { UploadedFile } from '@/hooks/useResume';

interface ChatPanelProps {
  projectId: string;
  uploads: UploadedFile[];
}

export default function ChatPanel({ projectId, uploads }: ChatPanelProps) {
  const { messages, sendMessage } = useChat(projectId);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'files'>('chat');
  const [viewingFile, setViewingFile] = useState<UploadedFile | null>(null);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change or while sending
  useEffect(() => {
    if (scrollRef.current && activeTab === 'chat') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending, activeTab]);

  const handleSend = async (content: string) => {
    setIsSending(true);
    try {
      await sendMessage.mutateAsync(content);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950 font-sans border-l border-slate-900">
      {/* Tab Navigation Headers */}
      <div className="flex border-b border-slate-900 flex-shrink-0 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
        <button
          onClick={() => {
            setActiveTab('chat');
            setViewingFile(null);
          }}
          className={`flex-1 py-4 text-center text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'chat'
              ? 'text-blue-400 border-blue-500 bg-blue-500/5'
              : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900/20'
          }`}
        >
          <span className="flex items-center justify-center space-x-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>AI Assistant</span>
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab('files');
            setViewingFile(null);
          }}
          className={`flex-1 py-4 text-center text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'files'
              ? 'text-blue-400 border-blue-500 bg-blue-500/5'
              : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900/20'
          }`}
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Uploaded Files</span>
            {uploads.length > 0 && (
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {uploads.length}
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'chat' ? (
        <>
          {/* Chat Messages Panel */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4">
            <MessageList messages={messages} />
            {isSending && (
              <div className="flex items-center space-x-2 pl-1 animate-pulse">
                <span className="text-slate-500 text-xs italic">Claude is thinking</span>
                <span className="flex space-x-0.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Input Panel */}
          <div className="p-4 border-t border-slate-900 bg-slate-950/60 backdrop-blur-md flex-shrink-0">
            <ChatInput onSend={handleSend} disabled={isSending} />
          </div>
        </>
      ) : (
        /* Uploaded Files Content */
        <div className="flex-grow overflow-y-auto p-4 flex flex-col">
          {viewingFile ? (
            /* Inside File Text Preview Screen */
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setViewingFile(null)}
                  className="flex items-center text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to files
                </button>
                <button
                  onClick={() => handleCopyToClipboard(viewingFile.parsedText)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center space-x-1"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white truncate">{viewingFile.fileName}</h4>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-wider">
                  Uploaded {new Date(viewingFile.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex-grow bg-slate-900/30 border border-slate-900/60 rounded-xl p-4 overflow-y-auto max-h-[calc(100vh-220px)] shadow-inner">
                <pre className="text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-text">
                  {viewingFile.parsedText}
                </pre>
              </div>
            </div>
          ) : uploads.length === 0 ? (
            /* Empty State */
            <div className="flex-grow flex flex-col items-center justify-center text-center py-20 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-slate-300 font-semibold text-sm mb-1">No uploads found</h4>
              <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
                This project has no active uploads. Uploaded files from the resume creator wizard will appear here.
              </p>
            </div>
          ) : (
            /* Uploaded Files List */
            <div className="space-y-3">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 pl-0.5">
                Saved Files ({uploads.length})
              </div>
              {uploads.map((file) => {
                const isPdf = file.fileName.toLowerCase().endsWith('.pdf');
                return (
                  <div
                    key={file.id}
                    onClick={() => setViewingFile(file)}
                    className="border border-slate-900 hover:border-slate-800/80 bg-slate-950 hover:bg-slate-900/30 transition-all rounded-xl p-3.5 cursor-pointer group flex items-start space-x-3.5 shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                      isPdf ? 'bg-red-500/10 text-red-400 group-hover:bg-red-500/15' : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/15'
                    }`}>
                      {isPdf ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-slate-200 group-hover:text-white font-medium text-xs truncate transition-colors">
                        {file.fileName}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {new Date(file.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="self-center text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
