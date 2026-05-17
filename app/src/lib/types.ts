export type Lang = 'nl' | 'en' | 'fr' | 'de';
export const LANGS: Lang[] = ['nl', 'en', 'fr', 'de'];
export const DEFAULT_LANG: Lang = 'nl';

export type LocalizedText = Record<Lang, string>;
export type LocalizedOptions = Record<Lang, string[]>;

export interface Question {
  id: string;
  topic: string;
  verified: boolean;
  question: LocalizedText;
  options: LocalizedOptions;
  correct: number;
  explanation: LocalizedText;
  legal_ref: string;
  image?: string;
}

export interface TopicMeta {
  id: string;
  file: string;
  count: number;
}

export interface QuestionsIndex {
  version: string;
  license: string;
  topics: TopicMeta[];
  total: number;
}

export function isValidLang(lang: unknown): lang is Lang {
  return typeof lang === 'string' && (LANGS as string[]).includes(lang);
}

export function parseLang(value: string | string[] | undefined): Lang {
  const candidate = Array.isArray(value) ? value[0] : value;
  return isValidLang(candidate) ? candidate : DEFAULT_LANG;
}
