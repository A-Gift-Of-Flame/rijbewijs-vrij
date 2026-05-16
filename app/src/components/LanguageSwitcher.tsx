'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LANGS, type Lang } from '@/lib/types';

const LANG_LABELS: Record<Lang, string> = {
  nl: 'NL',
  en: 'EN',
  fr: 'FR',
  de: 'DE',
};

export default function LanguageSwitcher({ current }: { current: Lang }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchLang(lang: Lang) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-1">
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => switchLang(lang)}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            lang === current
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          {LANG_LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
