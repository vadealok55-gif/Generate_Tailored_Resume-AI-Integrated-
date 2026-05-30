'use client';

import React, { useState, useRef } from 'react';

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (content: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || disabled) return;
    onSend(content.trim());
    setContent('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter, allow Shift+Enter for newlines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-grow the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2">
      <div className="flex-grow relative">
        <textarea
          ref={textareaRef}
          rows={1}
          disabled={disabled}
          value={content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a command... (Enter to send, Shift+Enter for newline)"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-50 text-xs transition-colors resize-none leading-relaxed overflow-hidden"
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
      </div>
      <button
        type="submit"
        disabled={!content.trim() || disabled}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all flex-shrink-0 shadow-md shadow-blue-600/20"
      >
        Send
      </button>
    </form>
  );
}
