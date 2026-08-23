'use client';

import React, { useState } from 'react';
import { HindiPhonicsStudio } from '@/components/HindiPhonicsStudio';
import { HindiSentenceBuilder } from '@/components/HindiSentenceBuilder';
import { HindiVocabMatch } from '@/components/HindiVocabMatch';

type EnglishTab = 'phonics' | 'syntax' | 'vocab';

export function EnglishLiteracyHub() {
  const [activeTab, setActiveTab] = useState<EnglishTab>('phonics');

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6 font-sans select-none w-full">
      
      {/* Top Banner */}
      <div className="bg-teal-50/80 p-4 md:p-6 rounded-3xl border border-teal-200 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
              🔤
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-teal-950">English Phonics &amp; Syntax Lab</h1>
              <p className="text-xs md:text-sm font-semibold text-teal-800">
                Devanagari-Anchored Bilingual Literacy for Ages 3–8 (NEP 2020)
              </p>
            </div>
          </div>

          <div className="bg-white px-3 py-1.5 rounded-xl border border-teal-300 text-xs font-bold text-teal-900 shadow-sm">
            <span>FLN NIPUN Bharat Aligned</span>
          </div>
        </div>

        {/* Tab Switcher for the 3 Components */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <button
            onClick={() => setActiveTab('phonics')}
            className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
              activeTab === 'phonics' ? 'bg-teal-600 border-teal-700 text-white shadow-md' : 'bg-white border-teal-100 hover:bg-teal-50 text-slate-800'
            }`}
          >
            <span className="text-xs md:text-sm font-black">🔤 फोनिक्स (CVC)</span>
          </button>

          <button
            onClick={() => setActiveTab('syntax')}
            className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
              activeTab === 'syntax' ? 'bg-teal-600 border-teal-700 text-white shadow-md' : 'bg-white border-teal-100 hover:bg-teal-50 text-slate-800'
            }`}
          >
            <span className="text-xs md:text-sm font-black">🧩 वाक्य बनाओ (Syntax)</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
              activeTab === 'vocab' ? 'bg-teal-600 border-teal-700 text-white shadow-md' : 'bg-white border-teal-100 hover:bg-teal-50 text-slate-800'
            }`}
          >
            <span className="text-xs md:text-sm font-black">🖼️ शब्द मिलाओ (200+ Words)</span>
          </button>
        </div>
      </div>

      {/* Render Active Component */}
      <div className="w-full">
        {activeTab === 'phonics' && <HindiPhonicsStudio />}
        {activeTab === 'syntax' && <HindiSentenceBuilder />}
        {activeTab === 'vocab' && <HindiVocabMatch />}
      </div>

    </div>
  );
}