'use client';

import { ReactNode, useEffect } from 'react';
import { useLocale } from 'next-intl';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    if (typeof document !== 'undefined' && locale) {
      document.documentElement.lang = locale;
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }
  }, [locale]);

  return <>{children}</>;
}
