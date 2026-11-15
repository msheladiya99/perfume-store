import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'ZEVARO PERFUMES — Virtual Boutique', description: 'Explore the Zevaro Perfumes virtual boutique.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
