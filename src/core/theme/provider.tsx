'use client';

import { ReactNode, useEffect } from 'react';
import { useLocale } from 'next-intl';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    if (typeof document !== 'undefined' && locale) {
      document.documentElement.lang = locale;
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [locale]);

  return <>{children}</>;
}
