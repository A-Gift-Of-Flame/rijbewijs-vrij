import Link from 'next/link';
import { Suspense } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import type { Lang } from '@/lib/types';

export default function Header({ lang }: { lang: Lang }) {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`/study?lang=${lang}`} className="font-bold text-white text-lg tracking-tight">
          Rijbewijs Vrij 🚦
        </Link>
        <Suspense fallback={null}>
          <LanguageSwitcher current={lang} />
        </Suspense>
      </div>
    </header>
  );
}
