import 'server-only';
import fs from 'fs';
import path from 'path';
import type { Question, TopicMeta, QuestionsIndex } from './types';

export type { Lang, LocalizedText, LocalizedOptions, Question, TopicMeta, QuestionsIndex } from './types';
export { LANGS, DEFAULT_LANG, isValidLang, parseLang } from './types';

const QUESTIONS_DIR = path.join(process.cwd(), 'questions');

export function getIndex(): QuestionsIndex {
  const raw = fs.readFileSync(path.join(QUESTIONS_DIR, 'index.json'), 'utf-8');
  return JSON.parse(raw);
}

export function getTopics(): TopicMeta[] {
  return getIndex().topics;
}

export function getQuestionsByTopic(topicId: string): Question[] {
  const raw = fs.readFileSync(
    path.join(QUESTIONS_DIR, 'topics', `${topicId}.json`),
    'utf-8'
  );
  return JSON.parse(raw);
}
