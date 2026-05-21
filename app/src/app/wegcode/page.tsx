import Header from '@/components/Header';
import { parseLang } from '@/lib/questions';
import { getWegcode, flattenStructure, getOrderedArticles, type WegcodeSection } from '@/lib/wegcode';
import type { Lang } from '@/lib/types';
import WegcodeArticleView from './WegcodeArticleView';

export const metadata = { title: 'Wegcode — Rijbewijs Vrij' };

const LABELS: Record<Lang, { titel: string; hoofdstuk: string; source: string; fallbackNote: string }> = {
  nl: { titel: 'Titel', hoofdstuk: 'Hoofdstuk', source: 'Officiële bron', fallbackNote: '' },
  fr: { titel: 'Titre', hoofdstuk: 'Chapitre', source: 'Source officielle', fallbackNote: '' },
  de: { titel: 'Titel', hoofdstuk: 'Kapitel', source: 'Offizielle Quelle', fallbackNote: 'Geen officiële Duitse vertaling. Tekst in het Nederlands.' },
  en: { titel: 'Title', hoofdstuk: 'Chapter', source: 'Official source', fallbackNote: 'No official English translation. Showing Dutch text.' },
};

function TocSection({ section, lang, depth = 0 }: { section: WegcodeSection; lang: Lang; depth?: number }) {
  const lb = LABELS[lang];
  const typeLabel = section.type === 'titel' ? lb.titel : lb.hoofdstuk;
  return (
    <li>
      <a
        href={`#${section.lnkId}`}
        className={`block py-1 text-sm hover:text-blue-400 transition-colors leading-snug ${
          depth === 0 ? 'font-semibold text-gray-300' : 'pl-3 text-gray-400'
        }`}
      >
        {typeLabel} {section.number} — {section.title}
      </a>
      {section.children && section.children.length > 0 && (
        <ul>
          {section.children.map((child) => (
            <TocSection key={child.lnkId} section={child} lang={lang} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default async function WegcodePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang: langParam } = await searchParams;
  const lang = parseLang(langParam);
  const data = getWegcode(lang);
  const articles = getOrderedArticles(data);
  const flat = flattenStructure(data.structure);
  const lb = LABELS[lang];

  // Group articles by their section
  const sectionArticles: Record<string, typeof articles> = {};
  for (const section of flat) {
    sectionArticles[section.lnkId] = [];
  }
  for (const art of articles) {
    if (art.sectionIdx !== undefined) {
      const section = flat[art.sectionIdx];
      if (section) {
        (sectionArticles[section.lnkId] ??= []).push(art);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-on-surface flex flex-col">
      <Header lang={lang} />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 flex gap-6">

        {/* TOC sidebar — desktop only */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Inhoud
            </h2>
            <nav>
              <ul className="space-y-0.5">
                {data.structure.map((section) => (
                  <TocSection key={section.lnkId} section={section} lang={lang} />
                ))}
              </ul>
            </nav>
            <div className="mt-6 pt-4 border-t border-gray-800">
              <a
                href={data.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
              >
                {lb.source} ↗
              </a>
              <p className="text-xs text-gray-600 mt-1">{data.fetchedAt}</p>
            </div>
          </div>
        </aside>

        {/* Main article content */}
        <main className="flex-1 min-w-0">
          {lb.fallbackNote && (
            <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg text-yellow-400 text-sm">
              {lb.fallbackNote}
            </div>
          )}

          {data.structure.map((section) => (
            <div key={section.lnkId} className="mb-10">
              <h2
                id={section.lnkId}
                className="text-lg font-bold text-on-surface mb-1 pt-2 border-t border-gray-800 scroll-mt-20"
              >
                {lb.titel} {section.number}
              </h2>
              <p className="text-gray-400 text-sm mb-4">{section.title}</p>

              {(sectionArticles[section.lnkId] ?? []).map((art) => (
                <WegcodeArticleView key={art.id} article={art} />
              ))}

              {section.children?.map((chapter) => (
                <div key={chapter.lnkId} className="mt-6">
                  <h3
                    id={chapter.lnkId}
                    className="text-base font-semibold text-gray-300 mb-3 scroll-mt-20"
                  >
                    {lb.hoofdstuk} {chapter.number} — {chapter.title}
                  </h3>
                  {(sectionArticles[chapter.lnkId] ?? []).map((art) => (
                    <WegcodeArticleView key={art.id} article={art} />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
