'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BlocklyWorkspace from '@/components/BlocklyWorkspace';
import GameCanvas from '@/components/GameCanvas';
import { EnglishLiteracyHub } from '@/components/EnglishLiteracyHub';
import { AiArcadeStudio } from '@/components/AiArcadeStudio';
import { HindiMusicStudio } from '@/components/HindiMusicStudio';
import { HindiAnimalStudio } from '@/components/HindiAnimalStudio';
import { JuniorResearcherStudio } from '@/components/JuniorResearcherStudio';
import { HindiMathStudio } from '@/components/HindiMathStudio';
import { HindiArtStudio } from '@/components/HindiArtStudio';
import { HindiGeoStudio } from '@/components/HindiGeoStudio';
import { LEVELS, Level } from '@/lib/levels';
import { Trophy, HelpCircle, Volume2, RotateCcw, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

function CodingAppInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab') || 'coding';
  const [activeTab, setActiveTab] = useState<string>(tabParam);
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isLevelSuccess, setIsLevelSuccess] = useState<boolean>(false);
  const [usedBlocksCount, setUsedBlocksCount] = useState<number>(0);

  const levelList = Array.isArray(LEVELS) && LEVELS.length > 0 ? LEVELS : [];
  const currentLevel: Level = (levelList[currentLevelIndex] || levelList[0]) as Level;

  const getInitialPos = (lvl: any) => ({
    x: lvl?.playerStart?.x ?? lvl?.startPos?.x ?? 0,
    y: lvl?.playerStart?.y ?? lvl?.startPos?.y ?? 2,
    dir: (lvl?.playerStart?.dir ?? lvl?.startPos?.dir ?? 'EAST') as Direction,
  });

  const [playerPos, setPlayerPos] = useState(getInitialPos(currentLevel));
  const [collectedTargets, setCollectedTargets] = useState<{ x: number; y: number }[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const speakHindi = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  const playSound = (type: 'step' | 'turn' | 'collect' | 'success' | 'fail' | 'fanfare') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'step') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'turn') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'collect') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'fanfare' || type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.12);
        osc.frequency.setValueAtTime(659.25, now + 0.24);
        osc.frequency.setValueAtTime(880, now + 0.36);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    if (currentLevel) {
      setPlayerPos(getInitialPos(currentLevel));
      setCollectedTargets([]);
      setIsRunning(false);
      setIsLevelSuccess(false);

      if (activeTab === 'coding') {
        const textToRead = (currentLevel as any)?.voiceText || (currentLevel as any)?.instruction || (currentLevel as any)?.hint;
        if (textToRead) {
          const timer = setTimeout(() => speakHindi(textToRead), 300);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [currentLevelIndex, currentLevel, activeTab]);

  const turn = (dir: Direction, turnTo: 'LEFT' | 'RIGHT'): Direction => {
    const dirs: Direction[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    const idx = dirs.indexOf(dir);
    return turnTo === 'LEFT' ? dirs[(idx + 3) % 4] : dirs[(idx + 1) % 4];
  };

  const stepForward = (pos: { x: number; y: number; dir: Direction }, gridSize: number) => {
    let nextX = pos.x;
    let nextY = pos.y;
    if (pos.dir === 'NORTH') nextY -= 1;
    if (pos.dir === 'SOUTH') nextY += 1;
    if (pos.dir === 'EAST') nextX += 1;
    if (pos.dir === 'WEST') nextX += 1;

    if (nextX < 0 || nextX >= gridSize || nextY < 0 || nextY >= gridSize) {
      return null;
    }
    return { x: nextX, y: nextY, dir: pos.dir };
  };

  const extractActions = (plan: any): string[] => {
    const res: string[] = [];
    if (!plan) return res;

    if (typeof plan === 'string') {
      return [plan];
    }

    if (Array.isArray(plan)) {
      for (const item of plan) {
        res.push(...extractActions(item));
      }
      return res;
    }

    if (typeof plan === 'object') {
      const type = plan.type || plan.action || plan.name;
      const times = Number(plan.times || plan.count || plan.repeatCount || 1);
      const inner = plan.children || plan.body || plan.blocks || plan.inner;

      if (type === 'repeat' || type === 'controls_repeat' || type === 'controls_repeat_ext') {
        const innerActions = extractActions(inner);
        for (let r = 0; r < times; r++) {
          res.push(...innerActions);
        }
      } else if (type) {
        res.push(type);
      }
    }

    return res;
  };

  const handleRunCode = async (actionPlan: any, totalBlocks: number) => {
    if (isRunning || isLevelSuccess) return;
    setIsRunning(true);
    setUsedBlocksCount(totalBlocks || 1);

    const flattenedActions = extractActions(actionPlan);
    let currentPos = { ...playerPos };
    let collected: { x: number; y: number }[] = [];
    const obstacles = currentLevel.obstacles || [];
    const targets = currentLevel.targets || [];
    const gridSize = currentLevel.gridSize || 5;

    for (let i = 0; i < flattenedActions.length; i++) {
      const rawAction = flattenedActions[i];
      const action = rawAction.toLowerCase().replace(/[^a-z_]/g, '');

      if (action.includes('forward') || action === 'move_forward') {
        const next = stepForward(currentPos, gridSize);
        if (!next) {
          playSound('fail');
          speakHindi('रोबोट ग्रिड से बाहर जा रहा है!');
          alert('⚠️ रोबोट ग्रिड से बाहर जा रहा है!');
          setIsRunning(false);
          return;
        }

        const hitObstacle = obstacles.some((ob) => ob.x === next.x && ob.y === next.y);
        if (hitObstacle) {
          playSound('fail');
          speakHindi('रोबोट रुकावट से टकरा गया!');
          alert('💥 रोबोट रुकावट से टकरा गया!');
          setIsRunning(false);
          return;
        }

        currentPos = next;
        setPlayerPos({ ...currentPos });
        playSound('step');
      } else if (action.includes('left')) {
        currentPos.dir = turn(currentPos.dir, 'LEFT');
        setPlayerPos({ ...currentPos });
        playSound('turn');
      } else if (action.includes('right')) {
        currentPos.dir = turn(currentPos.dir, 'RIGHT');
        setPlayerPos({ ...currentPos });
        playSound('turn');
      } else if (action.includes('collect') || action.includes('banana') || action.includes('target') || action.includes('kela')) {
        const targetAtPos = targets.find((tg) => tg.x === currentPos.x && tg.y === currentPos.y);
        if (targetAtPos && !collected.some((c) => c.x === targetAtPos.x && c.y === targetAtPos.y)) {
          collected = [...collected, { x: targetAtPos.x, y: targetAtPos.y }];
          setCollectedTargets([...collected]);
          playSound('collect');
        }
      }

      await new Promise((res) => setTimeout(res, 450));
    }

    const finalTarget = targets.find((tg) => tg.x === currentPos.x && tg.y === currentPos.y);
    if (finalTarget && !collected.some((c) => c.x === finalTarget.x && c.y === finalTarget.y)) {
      collected = [...collected, { x: finalTarget.x, y: finalTarget.y }];
      setCollectedTargets([...collected]);
    }

    const allTargetsCollected = targets.every((tg) =>
      collected.some((c) => c.x === tg.x && c.y === tg.y)
    );

    if (allTargetsCollected && targets.length > 0) {
      playSound('fanfare');
      setIsLevelSuccess(true);
      setTimeout(() => {
        speakHindi(`शाबाश! आपने स्तर ${currentLevel.id} सफलता से पूरा कर लिया है!`);
      }, 200);
    } else {
      playSound('fail');
      speakHindi('रोबोट केला नहीं उठा पाया, पुनः प्रयास करें।');
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsLevelSuccess(false);
    if (currentLevel) {
      setPlayerPos(getInitialPos(currentLevel));
      setCollectedTargets([]);
    }
  };

  const handleNextLevel = () => {
    setIsLevelSuccess(false);
    if (currentLevelIndex + 1 < levelList.length) {
      setCurrentLevelIndex((prev) => prev + 1);
    } else {
      setCurrentLevelIndex(0);
    }
  };

  const switchTab = (tabKey: string) => {
    setActiveTab(tabKey);
    router.push(`/?tab=${tabKey}`);
  };

  const displayTitle = (currentLevel?.title || 'पहला कदम').replace(/^स्तर\s*\d+\s*:\s*/i, '');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      
      {/* Universal Responsive Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm px-3 py-2 md:px-4 md:py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => switchTab('coding')}>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-md text-white">
                🚀
              </div>
              <div>
                <h1 className="text-sm md:text-lg font-black text-slate-900 leading-tight">
                  Young Researcher AI &amp; Code
                </h1>
                <p className="text-[10px] md:text-[11px] font-bold text-purple-700">
                  ओपन-एक्सेस कंप्यूटर विज़न व कोडिंग लैब (NEP 2020)
                </p>
              </div>
            </div>
          </div>

          {/* Smooth Horizontal Scrolling Tab Bar for Mobile & Desktop */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full md:w-auto shrink-0 touch-pan-x">
            <button
              onClick={() => switchTab('coding')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'coding' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🎮 मेज़ कोडिंग
            </button>

            <button
              onClick={() => switchTab('geo')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'geo' || activeTab === 'geography' ? 'bg-sky-600 text-white shadow' : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200'
              }`}
            >
              🗺️ भूगोल (Map)
            </button>

            <button
              onClick={() => switchTab('art')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'art' || activeTab === 'colors' ? 'bg-pink-600 text-white shadow' : 'bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200'
              }`}
            >
              🎨 कला (Art)
            </button>

            <button
              onClick={() => switchTab('english')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'english' || activeTab === 'phonics' ? 'bg-teal-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🔤 English
            </button>

            <button
              onClick={() => switchTab('ai')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'ai' || activeTab === 'ml' ? 'bg-purple-600 text-white shadow' : 'bg-purple-100 hover:bg-purple-200 text-purple-900'
              }`}
            >
              🤖 AI खेलघर
            </button>

            <button
              onClick={() => switchTab('maths')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'maths' ? 'bg-amber-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🔢 गणित
            </button>

            <button
              onClick={() => switchTab('music')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'music' ? 'bg-orange-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🎹 संगीत
            </button>

            <button
              onClick={() => switchTab('researcher')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'researcher' ? 'bg-violet-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🔬 विज्ञान
            </button>

            <button
              onClick={() => switchTab('evs')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'evs' ? 'bg-green-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🌍 EVS
            </button>
          </div>
        </div>
      </header>

      {/* Main Sandbox Area */}
      <main className="flex-1 p-2 md:p-6 max-w-7xl mx-auto w-full">
        
        {/* 1. CODING LOGIC MAZE (FULLY RESPONSIVE STACK ON PHONES) */}
        {activeTab === 'coding' && (
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 min-h-[auto] lg:h-[calc(100vh-140px)]">
            
            {/* Left/Top Panel: Game Grid & Level Selector */}
            <div className="w-full lg:w-1/3 flex flex-col gap-2.5">
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">
                      स्तर {currentLevel?.id ?? 1}: {displayTitle}
                    </span>
                    <button
                      onClick={() => speakHindi((currentLevel as any)?.voiceText || (currentLevel as any)?.instruction || displayTitle)}
                      className="p-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition cursor-pointer"
                      title="आवाज़ सुनें"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {currentLevel?.concept || 'Sequence'}
                  </span>
                </div>

                <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
                  {levelList.map((lvl: Level, i: number) => (
                    <button
                      key={lvl.id}
                      onClick={() => setCurrentLevelIndex(i)}
                      className={`w-7 h-7 rounded-lg font-black text-xs shrink-0 cursor-pointer ${
                        currentLevelIndex === i ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {lvl.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Board Canvas */}
              <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm p-2 md:p-4 flex flex-col justify-center items-center relative overflow-hidden aspect-square max-h-[340px] md:max-h-none">
                {currentLevel && (
                  <GameCanvas
                    level={currentLevel}
                    playerPos={playerPos}
                    collectedTargets={collectedTargets}
                  />
                )}
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 text-xs font-bold text-emerald-950 flex items-center justify-between gap-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0 text-emerald-700" />
                  <span className="text-[11px] leading-tight">💡 {(currentLevel as any)?.instruction || (currentLevel as any)?.hint || 'ब्लॉक जोड़कर कोड चलाएं!'}</span>
                </div>
                <button
                  onClick={() => speakHindi((currentLevel as any)?.instruction || (currentLevel as any)?.hint || 'ब्लॉक जोड़कर कोड चलाएं!')}
                  className="p-1 text-emerald-800 hover:bg-emerald-200 rounded transition cursor-pointer shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right/Bottom Panel: Blockly Drag & Drop Code Workspace */}
            <div className="w-full lg:w-2/3 bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px] lg:h-auto min-h-[480px]">
              <BlocklyWorkspace
                onRunCode={handleRunCode}
                onReset={handleReset}
                isRunning={isRunning}
                allowedBlocks={currentLevel?.allowedBlocks}
              />
            </div>
          </div>
        )}

        {/* 2. GEOGRAPHY & INDIA MAP */}
        {(activeTab === 'geo' || activeTab === 'geography') && <HindiGeoStudio />}

        {/* 3. ART & COLORS STUDIO */}
        {(activeTab === 'art' || activeTab === 'colors') && <HindiArtStudio />}

        {/* 4. OTHER MODULES */}
        {(activeTab === 'english' || activeTab === 'phonics' || activeTab === 'syntax' || activeTab === 'vocab') && <EnglishLiteracyHub />}
        {(activeTab === 'ai' || activeTab === 'ml') && <AiArcadeStudio />}
        {activeTab === 'maths' && <HindiMathStudio />}
        {activeTab === 'music' && <HindiMusicStudio />}
        {activeTab === 'researcher' && <JuniorResearcherStudio />}
        {activeTab === 'evs' && <HindiAnimalStudio />}

      </main>

      {/* LEVEL COMPLETION REPORT CARD MODAL */}
      {isLevelSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border-4 border-emerald-400 p-6 md:p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
            
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-3xl flex items-center justify-center text-4xl mx-auto mb-3 shadow-lg shadow-emerald-500/30">
              🏆
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-1">
              शाबाश! स्तर पार हुआ
            </h2>
            <p className="text-xs font-bold text-emerald-700 mb-4">
              स्तर {currentLevel.id}: {displayTitle}
            </p>

            <div className="flex justify-center gap-2 mb-5">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce" />
              <Star className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce [animation-delay:150ms]" />
              <Star className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce [animation-delay:300ms]" />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">अवधारणा (Concept)</span>
                <span className="text-xs font-black text-slate-800">{currentLevel.concept || 'Sequencing'}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">केला उठाया</span>
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> १००% सफल
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> पुनः खेलें
              </button>

              <button
                onClick={handleNextLevel}
                className="flex-1 py-3 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                अगला स्तर खेलें <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

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