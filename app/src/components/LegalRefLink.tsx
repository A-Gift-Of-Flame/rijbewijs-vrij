import Link from 'next/link';
import type { Lang } from '@/lib/types';

export function LegalRefLink({ legalRef, lang }: { legalRef: string; lang: Lang }) {
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
