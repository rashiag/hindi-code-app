'use client';

import React, { Suspense } from 'react';
import { JuniorResearcherStudio } from '@/components/JuniorResearcherStudio';

export default function ResearcherPage() {
  return (
    <main className="min-h-screen bg-purple-50/30 flex flex-col items-center p-3 md:p-6 w-full overflow-x-hidden font-sans">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-purple-900 font-bold">लोड हो रहा है...</div>}>
        <JuniorResearcherStudio />
      </Suspense>
    </main>
  );
}