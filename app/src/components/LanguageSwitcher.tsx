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
    <select
      value={current}
      onChange={(e) => switchLang(e.target.value as Lang)}
      className="bg-gray-800 text-on-surface border border-gray-700 rounded-lg px-2 py-1 text-sm cursor-pointer hover:border-gray-600 transition-colors"
    >
      {LANGS.map((lang) => (
        <option key={lang} value={lang}>
          {LANG_LABELS[lang]}
        </option>
      ))}
    </select>
  );
}
