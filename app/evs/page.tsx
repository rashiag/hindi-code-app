'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { HindiAnimalStudio } from '@/components/HindiAnimalStudio';
import { HindiPlantStudio } from '@/components/HindiPlantStudio';

type EvsTab = 'animals' | 'plants' | 'seasons' | 'transport';

function EvsPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get('tab');
  const validTabs: EvsTab[] = ['animals', 'plants', 'seasons', 'transport'];
  const activeTab: EvsTab = validTabs.includes(tabParam as EvsTab) ? (tabParam as EvsTab) : 'animals';

  const handleTabChange = (newTab: EvsTab) => {
    router.push(`/evs?tab=${newTab}`, { scroll: false });
  };

  return (
    <main className="min-h-screen bg-emerald-50/30 flex flex-col items-center p-3 md:p-6 w-full overflow-x-hidden font-sans">
      {/* Dedicated EVS Header */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between bg-white px-4 py-3.5 rounded-2xl shadow-sm border border-emerald-200 mb-4 gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-xl shadow-md">
            🌿
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-emerald-950 leading-tight">
              Young Researcher • पर्यावरण अध्ययन (EVS &amp; Nature Lab)
            </h1>
            <p className="text-xs text-emerald-800/80 font-medium">
              NEP 2020 अनुरूप प्रकृति, जीव-जंतु, ऋतु चक्र एवं हमारा परिवेश
            </p>
          </div>
        </div>

        {/* EVS Navigation Tabs */}
        <div className="w-full md:w-auto flex items-center bg-emerald-100/60 p-1 rounded-xl border border-emerald-200 text-xs font-bold gap-1 overflow-x-auto">
          <button
            onClick={() => handleTabChange('animals')}
            className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'animals'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-200/50'
            }`}
          >
            🦁 पशु-पक्षी संसार (Animals)
          </button>
          <button
            onClick={() => handleTabChange('plants')}
            className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'plants'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-200/50'
            }`}
          >
            🍎 फल व सब्जियाँ (Flora &amp; Taste)
          </button>
          <button
            onClick={() => handleTabChange('seasons')}
            className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'seasons'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-200/50'
            }`}
          >
            🌦️ ऋतु चक्र (Seasons)
          </button>
          <button
            onClick={() => handleTabChange('transport')}
            className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'transport'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-200/50'
            }`}
          >
            🚗 यातायात के साधन (Transport)
          </button>
        </div>
      </header>

      {/* Render Active Module */}
      <div className="w-full max-w-5xl">
        {activeTab === 'animals' && <HindiAnimalStudio />}
        {activeTab === 'plants' && <HindiPlantStudio />}
        {activeTab === 'seasons' && (
          <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-emerald-300 text-center text-emerald-900">
            <span className="text-4xl block mb-3">🌦️</span>
            <h3 className="text-xl font-black mb-1">ऋतु चक्र (Seasons &amp; Weather)</h3>
            <p className="text-xs text-slate-500 font-semibold">आगामी मॉड्यूल — जल्द उपलब्ध होगा</p>
          </div>
        )}
        {activeTab === 'transport' && (
          <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-emerald-300 text-center text-emerald-900">
            <span className="text-4xl block mb-3">🚗</span>
            <h3 className="text-xl font-black mb-1">यातायात के साधन (Means of Transport)</h3>
            <p className="text-xs text-slate-500 font-semibold">आगामी मॉड्यूल — जल्द उपलब्ध होगा</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function EvsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-emerald-900 font-bold">लोड हो रहा है...</div>}>
      <EvsPortalContent />
    </Suspense>
  );
}