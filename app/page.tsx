'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => { void import('./experience'); }, []);
  return <main id="app" aria-label="Zevaro Perfumes virtual boutique" />;
}
