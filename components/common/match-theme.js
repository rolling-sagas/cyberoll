'use client';

import { applyTheme, useThemeStore } from '@/components/tailwind/store';
import { light } from '@/components/tailwind/themeColors';
import { useEffect } from 'react';

export default function MatchTheme() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      // applyTheme(dark);
      // 暂时先强制 light ~ 后续做darkmod
      applyTheme(light);
    } else {
      applyTheme(light);
    }
  }, [theme]);

  return null;
}
