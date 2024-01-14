'use client';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';

import NextAppDirEmotionCacheProvider from './EmotionCache';
import theme from './theme';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        {/*<CssBaseline />*/}
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
