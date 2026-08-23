'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BlocklyWorkspace from '@/components/BlocklyWorkspace';
import GameCanvas from '@/components/GameCanvas';
import HindiScratchStudio from '@/components/HindiScratchStudio';
import HindiPhonicsStudio from '@/components/HindiPhonicsStudio';
import HindiSentenceBuilder from '@/components/HindiSentenceBuilder';
import HindiVocabMatch from '@/components/HindiVocabMatch';
import { AiArcadeStudio } from '@/components/AiArcadeStudio';
import { HindiMusicStudio } from '@/components/HindiMusicStudio';
import { HindiAnimalStudio } from '@/components/HindiAnimalStudio';
import { JuniorResearcherStudio } from '@/components/JuniorResearcherStudio';
import { HindiMathStudio } from '@/components/HindiMathStudio';
import { LEVELS, Level } from '@/lib/levels';
import { HelpCircle } from 'lucide-react';

type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

function CodingAppInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab') || 'coding';
  const [activeTab, setActiveTab] = useState<string>(tabParam);
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const levelList = Array.isArray(LEVELS) && LEVELS.length > 0 ? LEVELS : [];
  const currentLevel: Level = (levelList[currentLevelIndex] || levelList[0]) as Level;

  const defaultPos: { x: number; y: number; dir: Direction } = {
    x: (currentLevel as any)?.playerStart?.x ?? (currentLevel as any)?.startPos?.x ?? 0,
    y: (currentLevel as any)?.playerStart?.y ?? (currentLevel as any)?.startPos?.y ?? 2,
    dir: ((currentLevel as any)?.playerStart?.dir ?? (currentLevel as any)?.startPos?.dir ?? 'EAST') as Direction,
  };

  const [playerPos, setPlayerPos] = useState<{ x: number; y: number; dir: Direction }>(defaultPos);
  const [collectedTargets, setCollectedTargets] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    if (currentLevel) {
      setPlayerPos({
        x: (currentLevel as any)?.playerStart?.x ?? (currentLevel as any)?.startPos?.x ?? 0,
        y: (currentLevel as any)?.playerStart?.y ?? (currentLevel as any)?.startPos?.y ?? 2,
        dir: ((currentLevel as any)?.playerStart?.dir ?? (currentLevel as any)?.startPos?.dir ?? 'EAST') as Direction,
      });
    }
    setCollectedTargets([]);
    setIsRunning(false);
  }, [currentLevelIndex, currentLevel]);

  const handleRunCode = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (currentLevel) {
      setPlayerPos({
        x: (currentLevel as any)?.playerStart?.x ?? (currentLevel as any)?.startPos?.x ?? 0,
        y: (currentLevel as any)?.playerStart?.y ?? (currentLevel as any)?.startPos?.y ?? 2,
        dir: ((currentLevel as any)?.playerStart?.dir ?? (currentLevel as any)?.startPos?.dir ?? 'EAST') as Direction,
      });
    }
    setCollectedTargets([]);
  };

  const switchTab = (tabKey: string) => {
    setActiveTab(tabKey);
    router.push(`/?tab=${tabKey}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      
      {/* Universal Header with Navigation Tabs */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => switchTab('coding')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-md text-white">
              🚀
            </div>
            <div>
              <h1 className="text-base md:text-lg font-black text-slate-900 leading-tight">
                Young Researcher AI &amp; Code
              </h1>
              <p className="text-[11px] font-bold text-purple-700">
                ओपन-एक्सेस कंप्यूटर विज़न व कोडिंग लैब (NEP 2020)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            <button
              onClick={() => switchTab('phonics')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'phonics' ? 'bg-teal-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🔤 फोनिक्स (CVC)
            </button>

            <button
              onClick={() => switchTab('syntax')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'syntax' ? 'bg-teal-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🧩 वाक्य बनाओ
            </button>

            <button
              onClick={() => switchTab('vocab')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'vocab' ? 'bg-teal-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🖼️ शब्द मिलाओ
            </button>

            <button
              onClick={() => switchTab('coding')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'coding' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🎮 मेज़ कोडिंग
            </button>

            <button
              onClick={() => switchTab('scratch')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'scratch' ? 'bg-amber-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🐱 स्क्रैच स्टूडियो
            </button>

            <button
              onClick={() => switchTab('ai')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'ai' || activeTab === 'ml' ? 'bg-purple-600 text-white shadow' : 'bg-purple-100 hover:bg-purple-200 text-purple-900'
              }`}
            >
              🤖 AI खेलघर (Arcade)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-3 md:p-6 max-w-7xl mx-auto w-full">
        
        {/* CODING TAB */}
        {activeTab === 'coding' && (
          <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] min-h-[620px]">
            
            <div className="w-full lg:w-1/3 flex flex-col gap-3">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <span className="text-xs font-black text-slate-700">
                  स्तर {currentLevel?.id ?? 1}: {currentLevel?.title ?? 'मेज़'}
                </span>
                <div className="flex gap-1">
                  {levelList.map((lvl: Level, i: number) => (
                    <button
                      key={lvl.id}
                      onClick={() => setCurrentLevelIndex(i)}
                      className={`w-7 h-7 rounded-lg font-black text-xs cursor-pointer ${
                        currentLevelIndex === i ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {lvl.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col justify-center items-center relative overflow-hidden">
                {currentLevel && (
                  <GameCanvas
                    level={currentLevel}
                    playerPos={playerPos}
                    collectedTargets={collectedTargets}
                  />
                )}
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs font-bold text-emerald-950 flex items-center gap-2 shadow-sm">
                <HelpCircle className="w-4 h-4 shrink-0 text-emerald-700" />
                <span>💡 {(currentLevel as any)?.hint || (currentLevel as any)?.instruction || 'ब्लॉक जोड़ें!'}</span>
              </div>
            </div>

            <div className="w-full lg:w-2/3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <BlocklyWorkspace
                onRunCode={handleRunCode}
                onReset={handleReset}
                isRunning={isRunning}
                allowedBlocks={currentLevel?.allowedBlocks}
              />
            </div>
          </div>
        )}

        {activeTab === 'scratch' && <HindiScratchStudio />}
        {activeTab === 'phonics' && <HindiPhonicsStudio />}
        {activeTab === 'syntax' && <HindiSentenceBuilder />}
        {activeTab === 'vocab' && <HindiVocabMatch />}
        {(activeTab === 'ai' || activeTab === 'ml') && <AiArcadeStudio />}

        {activeTab === 'maths' && <HindiMathStudio />}
        {activeTab === 'evs' && <HindiAnimalStudio />}
        {activeTab === 'music' && <HindiMusicStudio />}
        {activeTab === 'researcher' && <JuniorResearcherStudio />}

      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-slate-700">लोड हो रहा है...</div>}>
      <CodingAppInner />
    </Suspense>
  );
}