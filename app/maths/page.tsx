'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { HindiMathStudio } from '@/components/HindiMathStudio';

type MathTab = 'counting' | 'bonds' | 'vedic';

function MathsPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get('tab');
  const validTabs: MathTab[] = ['counting', 'bonds', 'vedic'];
  const activeTab: MathTab = validTabs.includes(tabParam as MathTab) ? (tabParam as MathTab) : 'counting';

  const handleTabChange = (newTab: MathTab) => {
    router.push(`/maths?tab=${newTab}`, { scroll: false });
  };

  return (
    <main className="min-h-screen bg-amber-50/30 flex flex-col items-center p-3 md:p-6 w-full overflow-x-hidden font-sans">
      {/* Dedicated Maths Header */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between bg-white px-4 py-3.5 rounded-2xl shadow-sm border border-amber-200 mb-4 gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center text-xl shadow-md">
            🔢
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-amber-950 leading-tight">
              Young Researcher • प्रारंभिक गणित (Early Numeracy Lab)
            </h1>
            <p className="text-xs text-amber-800/80 font-medium">
              NEP 2020 अनुरूप संख्या ज्ञान, दृश्य गणित एवं वैदिक अभ्यास
            </p>
          </div>
        </div>

        {/* Maths-Only Navigation Tabs */}
        <div className="w-full md:w-auto flex items-center bg-amber-100/60 p-1 rounded-xl border border-amber-200 text-xs font-bold gap-1 overflow-x-auto">
          <button
            onClick={() => handleTabChange('counting')}
            className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'counting'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            🍎 गिनती मिलाओ (Counting Match)
          </button>
          <button
            onClick={() => handleTabChange('bonds')}
            className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'bonds'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            🎯 अंक जोड़ (Number Bonds)
          </button>
          <button
            onClick={() => handleTabChange('vedic')}
            className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'vedic'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            ✨ वैदिक गणित (Visual Math)
          </button>
        </div>
      </header>

      {/* Render Active Math Tool */}
      <div className="w-full max-w-5xl">
        {activeTab === 'counting' && <HindiMathStudio />}
        
        {activeTab === 'bonds' && (
          <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-amber-300 text-center text-amber-900">
            <span className="text-4xl block mb-3">🎯</span>
            <h3 className="text-xl font-black mb-1">अंक जोड़ (Number Bonds Lab)</h3>
            <p className="text-xs text-slate-500 font-semibold">आगामी मॉड्यूल — जल्द उपलब्ध होगा</p>
          </div>
        )}

        {activeTab === 'vedic' && (
          <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-amber-300 text-center text-amber-900">
            <span className="text-4xl block mb-3">✨</span>
            <h3 className="text-xl font-black mb-1">वैदिक गणित (Visual Patterns)</h3>
            <p className="text-xs text-slate-500 font-semibold">आगामी मॉड्यूल — जल्द उपलब्ध होगा</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function MathsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-amber-900 font-bold">लोड हो रहा है...</div>}>
      <MathsPortalContent />
    </Suspense>
  );
}