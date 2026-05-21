import 'server-only';
import fs from 'fs';
import path from 'path';
import type { Lang } from './types';

export interface WegcodeArticle {
  id: string;
  title: string | null;
  text: string;
  sectionIdx?: number;
}

export interface WegcodeSection {
  lnkId: string;
  type: 'titel' | 'hoofdstuk' | 'section';
  number: string;
  title: string;
  children?: WegcodeSection[];
}

export interface WegcodeData {
  lang: string;
  fetchedAt: string;
  source: string;
  structure: WegcodeSection[];
  articles: Record<string, WegcodeArticle>;
}

const WEGCODE_DIR = path.join(process.cwd(), 'wegcode');

function loadLang(lang: 'nl' | 'fr'): WegcodeData {
  const raw = fs.readFileSync(path.join(WEGCODE_DIR, `${lang}.json`), 'utf-8');
  return JSON.parse(raw);
}

// Cache to avoid re-reading on each request
const cache: Partial<Record<'nl' | 'fr', WegcodeData>> = {};

export function getWegcode(lang: Lang): WegcodeData {
  const file: 'nl' | 'fr' = lang === 'fr' ? 'fr' : 'nl';
  if (!cache[file]) {
    cache[file] = loadLang(file);
  }
  return cache[file]!;
}

/** Extract base article ID from a legal_ref string like "Wegcode art. 11.3" → "11" */
export function legalRefToArticleId(legalRef: string): string | null {
  const match = legalRef.match(/art\.\s*(\d+(?:\/\d+)?(?:bis|ter|quater|quinquies|sexies|septies|octies|novies|decies|undecies)?)/i);
  if (!match) return null;
  return match[1];
}

/** All section nodes in a flat list (titels + hoofdstukken) */
export function flattenStructure(sections: WegcodeSection[]): WegcodeSection[] {
  const result: WegcodeSection[] = [];
  for (const s of sections) {
    result.push(s);
    if (s.children) result.push(...s.children);
  }
  return result;
}

/** Articles in order of their sectionIdx, then by their position in the source */
export function getOrderedArticles(data: WegcodeData): WegcodeArticle[] {
  return Object.values(data.articles).sort((a, b) => {
    const si = (a.sectionIdx ?? 999) - (b.sectionIdx ?? 999);
    if (si !== 0) return si;
    // Within same section, sort by article ID numerically
    const ai = parseFloat(a.id.replace(/[^0-9.]/g, '') || '0');
    const bi = parseFloat(b.id.replace(/[^0-9.]/g, '') || '0');
    return ai - bi;
  });
}
