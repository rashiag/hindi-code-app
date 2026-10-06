'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { HindiMathStudio } from '@/components/HindiMathStudio';
import { HindiNumberBonds } from '@/components/HindiNumberBonds';
import { HindiSubtraction } from '@/components/HindiSubtraction';

type MathTab = 'counting' | 'bonds' | 'subtraction' | 'vedic';

const PORTAL_STRINGS = {
  hi: {
    title: "Young Researcher • प्रारंभिक गणित (Early Numeracy Lab)",
    subtitle: "NEP 2020 अनुरूप संख्या ज्ञान, दृश्य गणित एवं वैदिक अभ्यास",
    tabCounting: "🍎 गिनती मिलाओ",
    tabBonds: "➕ अंक जोड़",
    tabSubtraction: "➖ अंक घटाव",
    tabVedic: "✨ वैदिक गणित",
    vedicTitle: "वैदिक गणित (Visual Pattern Lab)",
    vedicSubtitle: "आगामी मॉड्यूल — जल्द उपलब्ध होगा",
    loading: "लोड हो रहा है...",
  },
  en: {
    title: "Young Researcher • Early Numeracy Lab",
    subtitle: "NEP 2020 Aligned Number Sense, Visual Math & Vedic Practice",
    tabCounting: "🍎 Counting Match",
    tabBonds: "➕ Number Addition",
    tabSubtraction: "➖ Subtraction",
    tabVedic: "✨ Vedic Math",
    vedicTitle: "Vedic Math (Visual Pattern Lab)",
    vedicSubtitle: "Upcoming Module — Coming Soon",
    loading: "Loading...",
  }
};

function MathsPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const t = PORTAL_STRINGS[lang];

  const tabParam = searchParams.get('tab');
  const validTabs: MathTab[] = ['counting', 'bonds', 'subtraction', 'vedic'];
  const activeTab: MathTab = validTabs.includes(tabParam as MathTab) ? (tabParam as MathTab) : 'counting';

  const handleTabChange = (newTab: MathTab) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    router.push(`/maths?tab=${newTab}`, { scroll: false });
  };

  const handleToggleLang = (newLang: 'hi' | 'en') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setLang(newLang);
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
              {t.title}
            </h1>
            <p className="text-xs text-amber-800/80 font-medium">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-wrap">
          {/* Bilingual Language Switcher */}
          <div className="flex bg-amber-100/70 p-1 rounded-xl border border-amber-300 gap-1 shadow-xs">
            <button
              onClick={() => handleToggleLang('hi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'hi' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-950 hover:bg-amber-200/60'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => handleToggleLang('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'en' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-950 hover:bg-amber-200/60'
              }`}
            >
              English
            </button>
          </div>

          {/* Maths Navigation Tabs */}
          <div className="flex items-center bg-amber-100/60 p-1 rounded-xl border border-amber-200 text-xs font-bold gap-1 overflow-x-auto">
            <button
              onClick={() => handleTabChange('counting')}
              className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
                activeTab === 'counting'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-900 hover:bg-amber-200/50'
              }`}
            >
              {t.tabCounting}
            </button>
            <button
              onClick={() => handleTabChange('bonds')}
              className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
                activeTab === 'bonds'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-900 hover:bg-amber-200/50'
              }`}
            >
              {t.tabBonds}
            </button>
            <button
              onClick={() => handleTabChange('subtraction')}
              className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
                activeTab === 'subtraction'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-900 hover:bg-amber-200/50'
              }`}
            >
              {t.tabSubtraction}
            </button>
            <button
              onClick={() => handleTabChange('vedic')}
              className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
                activeTab === 'vedic'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-900 hover:bg-amber-200/50'
              }`}
            >
              {t.tabVedic}
            </button>
          </div>
        </div>
      </header>

      {/* Render Active Tool */}
      <div className="w-full max-w-5xl">
        {activeTab === 'counting' && <HindiMathStudio lang={lang} />}
        {activeTab === 'bonds' && <HindiNumberBonds lang={lang} />}
        {activeTab === 'subtraction' && <HindiSubtraction lang={lang} />}
        {activeTab === 'vedic' && (
          <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-amber-300 text-center text-amber-900">
            <span className="text-4xl block mb-3">✨</span>
            <h3 className="text-xl font-black mb-1">{t.vedicTitle}</h3>
            <p className="text-xs text-slate-500 font-semibold">{t.vedicSubtitle}</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function MathsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-amber-900 font-bold">Loading...</div>}>
      <MathsPortalContent />
    </Suspense>
  );
}