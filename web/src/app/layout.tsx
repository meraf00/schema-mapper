import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/code-highlight/styles.css';

import { ColorSchemeScript } from '@mantine/core';
import Providers from './providers';

const poppins = Poppins({
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Schema Map',
  description: 'Generated typeorm from ER',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
