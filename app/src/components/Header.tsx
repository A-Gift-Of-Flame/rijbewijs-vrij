import Link from 'next/link';
import { Suspense } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import type { Lang } from '@/lib/types';

export default function Header({ lang }: { lang: Lang }) {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-x-4">
        <Link href={`/study?lang=${lang}`} className="font-bold text-on-surface text-lg tracking-tight shrink-0">
          Rijbewijs Vrij 🚦
        </Link>
        <div className="flex items-center gap-2 sm:order-3">
          <ThemeSwitcher />
          <Suspense fallback={null}>
            <LanguageSwitcher current={lang} />
          </Suspense>
        </div>
        <hr className="w-full border-gray-800 sm:hidden" />
        <nav className="flex items-center gap-1 w-full sm:w-auto sm:order-2">
          <Link
            href={`/study?lang=${lang}`}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-on-surface hover:bg-gray-800 rounded-lg transition-colors"
          >
            {lang === 'nl' ? 'Studeren' : lang === 'fr' ? 'Étudier' : lang === 'de' ? 'Lernen' : 'Study'}
          </Link>
          <Link
            href={`/practice?lang=${lang}`}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-on-surface hover:bg-gray-800 rounded-lg transition-colors"
          >
            {lang === 'nl' ? 'Oefentoets' : lang === 'fr' ? 'Test' : lang === 'de' ? 'Test' : 'Practice'}
          </Link>
          <Link
            href={`/wegcode?lang=${lang}`}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-on-surface hover:bg-gray-800 rounded-lg transition-colors"
          >
            Wegcode
          </Link>
        </nav>
      </div>
    </header>
  );
}
