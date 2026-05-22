'use client';

import { useState, useCallback } from 'react';
import type { Question, Lang } from '@/lib/types';
import { UI as SHARED_UI } from '@/lib/ui';
import { TOPIC_DISPLAY } from '@/lib/topicMeta';

type Phase = 'idle' | 'active' | 'done';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DEFAULT_SIZE = 10;
const PRESETS = [10, 25, 50];

export default function Quiz({
  allQuestions,
  lang,
}: {
  allQuestions: Question[];
  lang: Lang;
}) {
  const maxQuestions = allQuestions.length;
  const [phase, setPhase] = useState<Phase>('idle');
  const [quizSize, setQuizSize] = useState(DEFAULT_SIZE);
  const [inputStr, setInputStr] = useState(String(DEFAULT_SIZE));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const passMark = Math.round(quizSize * 0.8);

  function applySize(n: number) {
    const clamped = Math.min(Math.max(1, n), maxQuestions);
    setQuizSize(clamped);
    setInputStr(String(clamped));
  }

  const startQuiz = useCallback(() => {
    const picked = shuffle(allQuestions).slice(0, quizSize);
    setQuestions(picked);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setPhase('active');
  }, [allQuestions, quizSize]);

  function selectAnswer(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
  }

  function next() {
    const newAnswers = [...answers, selected];
    if (current + 1 >= questions.length) {
      setAnswers(newAnswers);
      setPhase('done');
    } else {
      setAnswers(newAnswers);
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  const score = answers.filter((a, i) => a === questions[i]?.correct).length;

  const UI = {
    nl: {
      start: 'Start oefentoets',
      startSub: `${quizSize} willekeurige vragen uit alle onderwerpen`,
      sizeLabel: 'Aantal vragen',
      question: 'Vraag',
      of: 'van',
      next: 'Volgende',
      finish: 'Bekijk resultaat',
      correct: 'Correct!',
      wrong: 'Fout.',
      yourScore: 'Jouw score',
      passed: 'Geslaagd! 🎉',
      failed: 'Niet geslaagd',
      passNote: `Slaaggrens: ${passMark}/${quizSize}`,
      tryAgain: 'Opnieuw proberen',
      review: 'Overzicht',
    },
    en: {
      start: 'Start practice test',
      startSub: `${quizSize} random questions from all topics`,
      sizeLabel: 'Number of questions',
      question: 'Question',
      of: 'of',
      next: 'Next',
      finish: 'See results',
      correct: 'Correct!',
      wrong: 'Wrong.',
      yourScore: 'Your score',
      passed: 'Passed! 🎉',
      failed: 'Not passed',
      passNote: `Pass mark: ${passMark}/${quizSize}`,
      tryAgain: 'Try again',
      review: 'Review',
    },
    fr: {
      start: 'Commencer le test',
      startSub: `${quizSize} questions aléatoires de tous les sujets`,
      sizeLabel: 'Nombre de questions',
      question: 'Question',
      of: 'sur',
      next: 'Suivant',
      finish: 'Voir les résultats',
      correct: 'Correct !',
      wrong: 'Incorrect.',
      yourScore: 'Votre score',
      passed: 'Réussi ! 🎉',
      failed: 'Non réussi',
      passNote: `Note de passage : ${passMark}/${quizSize}`,
      tryAgain: 'Réessayer',
      review: 'Révision',
    },
    de: {
      start: 'Test starten',
      startSub: `${quizSize} zufällige Fragen aus allen Themen`,
      sizeLabel: 'Anzahl der Fragen',
      question: 'Frage',
      of: 'von',
      next: 'Weiter',
      finish: 'Ergebnisse sehen',
      correct: 'Richtig!',
      wrong: 'Falsch.',
      yourScore: 'Ihr Ergebnis',
      passed: 'Bestanden! 🎉',
      failed: 'Nicht bestanden',
      passNote: `Bestehensgrenze: ${passMark}/${quizSize}`,
      tryAgain: 'Erneut versuchen',
      review: 'Überprüfung',
    },
  };

  const t = UI[lang];

  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-20 text-center">
        <div className="text-5xl mb-6">📝</div>
        <h1 className="text-3xl font-bold text-on-surface mb-3">{t.start}</h1>
        <p className="text-gray-400 mb-8">{t.startSub}</p>

        <div className="mb-8 space-y-3">
          <p className="text-sm text-gray-400 font-medium">{t.sizeLabel}</p>
          <div className="flex gap-2 justify-center">
            {PRESETS.filter((n) => n <= maxQuestions).map((n) => (
              <button
                key={n}
                onClick={() => applySize(n)}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  quizSize === n
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            max={maxQuestions}
            value={inputStr}
            onChange={(e) => {
              setInputStr(e.target.value);
              const parsed = parseInt(e.target.value, 10);
              if (!isNaN(parsed)) setQuizSize(Math.min(Math.max(1, parsed), maxQuestions));
            }}
            onBlur={() => setInputStr(String(quizSize))}
            className="w-24 text-center px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-on-surface text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={startQuiz}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-lg transition-colors"
        >
          {t.start} →
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const passed = score >= passMark;
    return (
      <div className="max-w-2xl mx-auto w-full px-4 py-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-5xl mb-4">{passed ? '🎉' : '😔'}</div>
          <h1 className="text-3xl font-bold text-on-surface">
            {passed ? t.passed : t.failed}
          </h1>
          <p className="text-4xl font-mono font-bold mt-2">
            <span className={passed ? 'text-green-400' : 'text-red-400'}>
              {score}
            </span>
            <span className="text-gray-600">/{questions.length}</span>
          </p>
          <p className="text-gray-500 text-sm">{t.passNote}</p>
        </div>

        <button
          onClick={startQuiz}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
        >
          {t.tryAgain}
        </button>

        <div className="space-y-3">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">
            {t.review}
          </h2>
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correct;
            const display = TOPIC_DISPLAY[q.topic];
            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border ${
                  isCorrect
                    ? 'border-green-700 bg-green-900/20'
                    : 'border-red-800 bg-red-900/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{isCorrect ? '✅' : '❌'}</span>
                  <div className="space-y-1 min-w-0">
                    <p className="text-on-surface text-sm font-medium leading-snug">
                      {q.question[lang]}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-300 text-sm">
                        ✓ {q.options[lang][q.correct]}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs">
                      {display?.emoji} {display?.label[lang]} · {q.legal_ref}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = questions[current];
  const opts = q.options[lang];
  const answered = selected !== null;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">
          {t.question} {current + 1} {t.of} {questions.length}
        </span>
        {questions.length <= 20 ? (
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  i < current
                    ? answers[i] === questions[i].correct
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : i === current
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(current / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{current + 1}/{questions.length}</span>
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
        <p className="text-on-surface font-medium text-lg leading-snug">
          {q.question[lang]}
        </p>

        {q.image && (
          <div className="pl-1">
            <img
              src={q.image}
              alt={q.question[lang]}
              className="h-28 w-auto object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        <ol className="space-y-2">
          {opts.map((opt, i) => {
            const isCorrect = i === q.correct;
            const isSelected = i === selected;
            let cls =
              'w-full text-left px-4 py-3 rounded-lg text-sm border transition-colors flex items-start gap-3 ';

            if (!answered) {
              cls += 'border-gray-700 text-gray-300 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 cursor-pointer';
            } else if (isCorrect) {
              cls += 'border-green-600 bg-green-900/40 text-green-200 cursor-default';
            } else if (isSelected) {
              cls += 'border-red-700 bg-red-900/30 text-red-300 cursor-default';
            } else {
              cls += 'border-gray-800 bg-gray-900/50 text-gray-600 cursor-default';
            }

            return (
              <li key={i}>
                <button className={cls} onClick={() => selectAnswer(i)} disabled={answered}>
                  <span className="font-mono text-xs opacity-50 shrink-0 pt-0.5">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span>{opt}</span>
                </button>
              </li>
            );
          })}
        </ol>

        {answered && (
          <div className="pt-1 space-y-3">
            <p
              className={`font-semibold ${
                selected === q.correct ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {selected === q.correct ? t.correct : t.wrong}
            </p>
            <p className="text-blue-200 text-sm leading-relaxed">
              {q.explanation[lang]}
            </p>
            <p className="text-blue-500 text-xs font-mono">{q.legal_ref}</p>
            {!q.verified && (
              <p className="text-yellow-600 text-xs">
                {SHARED_UI[lang].aiWarning}
              </p>
            )}
          </div>
        )}
      </div>

      {answered && (
        <button
          onClick={next}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
        >
          {current + 1 === questions.length ? t.finish : t.next} →
        </button>
      )}
    </div>
  );
}
