'use client';

import React from 'react';

export default function BeforeAfterDiff({
  sectionTitle,
  original,
  generated,
  onAccept,
  onDiscard,
}: {
  sectionTitle: string;
  original: any;
  generated: any;
  onAccept: () => void;
  onDiscard: () => void;
}) {
  const renderItem = (data: any) => {
    if (typeof data === 'string') {
      return <p className="text-xs leading-relaxed font-serif whitespace-pre-wrap">{data}</p>;
    }
    if (Array.isArray(data)) {
      return (
        <div className="space-y-3 font-serif">
          {data.map((item: any, i: number) => {
            // Derive a display label safely — fallback to "Item N"
            const primaryLabel =
              item.role ?? item.category ?? item.degree ?? item.title ?? `Item ${i + 1}`;
            const secondaryLabel =
              item.company ?? item.institution ?? null;

            return (
              <div key={item.id ?? i} className="text-[11px] leading-relaxed">
                <strong>{primaryLabel}</strong>
                {secondaryLabel && (
                  <span className="text-slate-400"> | {secondaryLabel}</span>
                )}
                {/* Date range */}
                {(item.startDate || item.endDate) && (
                  <span className="text-slate-500 ml-2">
                    {item.startDate} – {item.endDate}
                  </span>
                )}
                {/* Bullets */}
                {Array.isArray(item.bullets) && item.bullets.length > 0 && (
                  <ul className="list-disc pl-4 mt-1.5 space-y-1">
                    {item.bullets.map((b: any, j: number) => (
                      <li
                        key={b.id ?? j}
                        className={
                          b.highlighted
                            ? 'font-semibold font-sans bg-blue-50/10 px-0.5 rounded'
                            : ''
                        }
                      >
                        {b.text}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Skills list */}
                {Array.isArray(item.skills) && item.skills.length > 0 && (
                  <p className="mt-1 text-slate-300">{item.skills.join(', ')}</p>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    // Fallback for unknown shapes — show raw JSON in readable format
    return (
      <pre className="text-[10px] text-slate-500 whitespace-pre-wrap break-all">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Compare — <span className="text-slate-300">{sectionTitle}</span>
        </h4>
        <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase tracking-wide">
          Diff Preview
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before */}
        <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-4">
          <span className="text-[9px] uppercase font-bold tracking-widest text-red-400 block mb-2">
            Original
          </span>
          <div className="opacity-60 line-through text-red-200/80 space-y-1">
            {renderItem(original)}
          </div>
        </div>

        {/* After */}
        <div className="bg-green-950/10 border border-green-900/30 rounded-xl p-4 shadow-inner shadow-green-500/5">
          <span className="text-[9px] uppercase font-bold tracking-widest text-green-400 block mb-2">
            AI Generated
          </span>
          <div className="text-green-100 space-y-1">
            {renderItem(generated)}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end space-x-3 border-t border-slate-800 pt-4">
        <button
          onClick={onDiscard}
          className="text-xs font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-lg bg-slate-950/40 hover:bg-slate-950 border border-slate-800 transition-colors"
        >
          Discard
        </button>
        <button
          onClick={onAccept}
          className="text-xs font-semibold text-white px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 flex items-center space-x-1.5"
        >
          <span>✦</span>
          <span>Accept &amp; Apply</span>
        </button>
      </div>
    </div>
  );
}
