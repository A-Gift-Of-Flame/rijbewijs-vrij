'use client';

import { useState, useEffect } from 'react';
import { applyTheme, type Theme } from './ThemeProvider';

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

const OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <SunIcon /> },
  { value: 'auto', label: 'System', icon: <MonitorIcon /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('auto');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme((localStorage.getItem('theme') as Theme) ?? 'auto');
  }, []);

  function set(t: Theme) {
    localStorage.setItem('theme', t);
    setTheme(t);
    applyTheme(t);
  }

  if (!mounted) return <div className="w-[82px] h-[30px]" />;

  return (
    <div className="flex gap-0.5 bg-gray-800 rounded-lg p-0.5">
      {OPTIONS.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => set(value)}
          aria-label={label}
          className={`p-1.5 rounded-md transition-colors ${
            theme === value
              ? 'bg-gray-600 text-on-surface'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
