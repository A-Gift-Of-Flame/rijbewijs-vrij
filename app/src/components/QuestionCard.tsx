'use client';

import { useState } from 'react';
import type { Question, Lang } from '@/lib/types';

export default function QuestionCard({
  question,
  lang,
  index,
}: {
  question: Question;
  lang: Lang;
  index: number;
}) {
  const [revealed, setRevealed] = useState(false);

  const q = question.question[lang];
  const opts = question.options[lang];
  const explanation = question.explanation[lang];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-gray-500 text-sm font-mono shrink-0 pt-0.5">
          {String(index + 1).padStart(2, '0')}
        </span>
        <p className="text-white font-medium leading-snug">{q}</p>
      </div>

      <ol className="space-y-2 pl-8">
        {opts.map((opt, i) => {
          const isCorrect = i === question.correct;
          let cls =
            'w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ';

          if (!revealed) {
            cls += 'border-gray-700 text-gray-300 bg-gray-800 hover:bg-gray-700 cursor-pointer';
          } else if (isCorrect) {
            cls += 'border-green-600 bg-green-900/40 text-green-200 cursor-default';
          } else {
            cls += 'border-gray-700 bg-gray-800/50 text-gray-500 cursor-default';
          }

          return (
            <li key={i}>
              <button className={cls} onClick={() => setRevealed(true)} disabled={revealed}>
                <span className="font-mono text-xs mr-2 opacity-60">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            </li>
          );
        })}
      </ol>

      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="ml-8 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Show answer →
        </button>
      )}

      {revealed && (
        <div className="ml-8 p-4 bg-blue-950/50 border border-blue-800 rounded-lg space-y-2">
          <p className="text-blue-100 text-sm leading-relaxed">{explanation}</p>
          <p className="text-blue-400 text-xs font-mono">{question.legal_ref}</p>
          {!question.verified && (
            <p className="text-yellow-500 text-xs">
              ⚠ AI-generated — not yet peer-reviewed. Verify before exam.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
