'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Question, Lang } from '@/lib/types';
import { UI } from '@/lib/ui';

function LegalRefLink({ legalRef, lang }: { legalRef: string; lang: Lang }) {
  const match = legalRef.match(/art\.\s*(\d+(?:\/\d+)?(?:bis|ter|quater|quinquies|sexies|septies|octies|novies|decies|undecies)?)/i);
  if (!match) {
    return <p className="text-blue-400 text-xs font-mono">{legalRef}</p>;
  }
  const articleId = match[1];
  return (
    <Link
      href={`/wegcode?lang=${lang}#Art.${articleId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 text-xs font-mono underline decoration-dotted transition-colors"
    >
      {legalRef} ↗
    </Link>
  );
}

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
  const t = UI[lang];

  const q = question.question[lang];
  const opts = question.options[lang];
  const explanation = question.explanation[lang];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-gray-500 text-sm font-mono shrink-0 pt-0.5">
          {String(index + 1).padStart(2, '0')}
        </span>
        <p className="text-on-surface font-medium leading-snug">{q}</p>
      </div>

      {(question.images ?? (question.image ? [question.image] : [])).length > 0 && (
        <div className="pl-8 flex flex-wrap gap-4">
          {(question.images ?? [question.image!]).map((src, i) => (
            <img
              key={i}
              src={src}
              alt={question.question[lang]}
              className="h-28 w-auto object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          ))}
        </div>
      )}

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
          {t.showAnswer} →
        </button>
      )}

      {revealed && (
        <div className="ml-8 p-4 bg-blue-950/50 border border-blue-800 rounded-lg space-y-2">
          <p className="text-blue-100 text-sm leading-relaxed">{explanation}</p>
          <LegalRefLink legalRef={question.legal_ref} lang={lang} />
          {!question.verified && (
            <p className="text-yellow-500 text-xs">
              {t.aiWarningLong}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
