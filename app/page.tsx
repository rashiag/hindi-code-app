'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HindiPhonicsStudio from '@/components/HindiPhonicsStudio';
import { AiArcadeStudio } from '@/components/AiArcadeStudio';
import BlocklyWorkspace from '@/components/BlocklyWorkspace';
import HindiMusicStudio from '@/components/HindiMusicStudio';
import HindiAnimalStudio from '@/components/HindiAnimalStudio';
import JuniorResearcherStudio from '@/components/JuniorResearcherStudio';
import HindiMathStudio from '@/components/HindiMathStudio';

function MainRouter() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'coding';

  switch (tab) {
    case 'phonics':
    case 'english':
      return <HindiPhonicsStudio />;
    case 'ai':
    case 'ml':
      return <AiArcadeStudio />;
    case 'maths':
    case 'math':
      return <HindiMathStudio />;
    case 'evs':
      return <HindiAnimalStudio />;
    case 'music':
      return <HindiMusicStudio />;
    case 'researcher':
    case 'science':
      return <JuniorResearcherStudio />;
    case 'coding':
    default:
      return <BlocklyWorkspace />;
  }
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">लोड हो रहा है...</div>}>
      <MainRouter />
    </Suspense>
  );
}