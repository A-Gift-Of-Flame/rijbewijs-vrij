import type { Lang } from './types';

export const UI = {
  nl: {
    showAnswer: 'Toon antwoord',
    aiWarning: '⚠ AI-gegenereerd — nog niet nagelezen.',
    aiWarningLong: '⚠ AI-gegenereerd — nog niet nagelezen. Controleer voor het examen.',
    get studySubtitle() {
      return `vragen — klik op een antwoord of "${this.showAnswer}" om de uitleg te zien`;
    },
  },
  en: {
    showAnswer: 'Show answer',
    aiWarning: '⚠ AI-generated — not yet peer-reviewed.',
    aiWarningLong: '⚠ AI-generated — not yet peer-reviewed. Verify before exam.',
    get studySubtitle() {
      return `questions — click an answer or "${this.showAnswer}" to reveal the explanation`;
    },
  },
  fr: {
    showAnswer: 'Voir la réponse',
    aiWarning: '⚠ Généré par IA — pas encore relu.',
    aiWarningLong: '⚠ Généré par IA — pas encore relu. Vérifiez avant l\'examen.',
    get studySubtitle() {
      return `questions — cliquez sur une réponse ou "${this.showAnswer}" pour voir l'explication`;
    },
  },
  de: {
    showAnswer: 'Antwort zeigen',
    aiWarning: '⚠ KI-generiert — noch nicht überprüft.',
    aiWarningLong: '⚠ KI-generiert — noch nicht überprüft. Vor der Prüfung nachschlagen.',
    get studySubtitle() {
      return `Fragen — klicken Sie auf eine Antwort oder "${this.showAnswer}" um die Erklärung zu sehen`;
    },
  },
} satisfies Record<Lang, { showAnswer: string; aiWarning: string; aiWarningLong: string; studySubtitle: string }>;
