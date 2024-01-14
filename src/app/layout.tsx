import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import ThemeRegistry from '@/src/components/ThemeRegistry/ThemeRegistry';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
