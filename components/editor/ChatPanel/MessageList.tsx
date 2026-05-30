'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/hooks/useChat';

export default function MessageList({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        {/* Placeholder icon */}
        <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto text-lg">
          ✦
        </div>
        <p className="text-slate-500 text-xs font-medium">No messages yet.</p>
        <p className="text-slate-600 text-[11px] max-w-[200px] mx-auto leading-relaxed">
          Ask the assistant to customize tone, active voice, or ATS visibility of your resume.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex flex-col max-w-[88%] rounded-xl p-3.5 text-xs leading-relaxed ${
            msg.role === 'user'
              ? 'bg-blue-600 text-white ml-auto rounded-br-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-sm'
          }`}
        >
          <span
            className={`font-bold text-[10px] uppercase tracking-wider mb-1.5 ${
              msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'
            }`}
          >
            {msg.role === 'user' ? 'You' : 'Assistant'}
          </span>
          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
          <span className={`text-[9px] mt-2 self-end ${msg.role === 'user' ? 'text-blue-300/70' : 'text-slate-600'}`}>
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ))}
      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
