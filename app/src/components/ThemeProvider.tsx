'use client';

import { useEffect } from 'react';

type Theme = 'auto' | 'dark' | 'light';

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'auto' && prefersDark));
}

export { applyTheme };
export type { Theme };

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme) ?? 'auto';
    applyTheme(stored);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (((localStorage.getItem('theme') as Theme) ?? 'auto') === 'auto') applyTheme('auto');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return <>{children}</>;
}
