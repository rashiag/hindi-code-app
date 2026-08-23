'use client';

import React, { Suspense } from 'react';
import { PhonicsStudio } from '@/components/PhonicsStudio';

export default function EnglishPage() {
  return (
    <main className="min-h-screen bg-pink-50/30 flex flex-col items-center p-3 md:p-6 w-full overflow-x-hidden font-sans">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-pink-900 font-bold">English Lab लोड हो रहा है...</div>}>
        <PhonicsStudio />
      </Suspense>
    </main>
  );
}