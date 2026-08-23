'use client';

import React, { Suspense } from 'react';
import { EnglishLiteracyHub } from '@/components/EnglishLiteracyHub';

export default function EnglishPage() {
  return (
    <main className="min-h-screen bg-teal-50/30 flex flex-col items-center p-3 md:p-6 w-full overflow-x-hidden font-sans">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-teal-900 font-bold">English Lab लोड हो रहा है...</div>}>
        <EnglishLiteracyHub />
      </Suspense>
    </main>
  );
}