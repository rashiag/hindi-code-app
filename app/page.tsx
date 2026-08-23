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
import { LEVELS, Level } from '@/lib/levels';
import { Trophy, HelpCircle, Volume2, RotateCcw } from 'lucide-react';

type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

function CodingAppInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab') || 'coding';
  const [activeTab, setActiveTab] = useState<string>(tabParam);
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isLevelSuccess, setIsLevelSuccess] = useState<boolean>(false);

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

  // Native Hindi Speech Engine
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

  // Sound effects
  const playSound = (type: 'step' | 'turn' | 'collect' | 'success' | 'fail') => {
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
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.12);
        osc.frequency.setValueAtTime(659.25, now + 0.24);
        osc.frequency.setValueAtTime(880, now + 0.36);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
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

  // Voice narration on level change
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
    if (pos.dir === 'WEST') nextX -= 1;

    if (nextX < 0 || nextX >= gridSize || nextY < 0 || nextY >= gridSize) {
      return null;
    }
    return { x: nextX, y: nextY, dir: pos.dir };
  };

  // Robustly extract all action types from whatever format BlocklyWorkspace provides
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

  // Complete Code Execution Runner
  const handleRunCode = async (actionPlan: any, totalBlocks: number) => {
    if (isRunning || isLevelSuccess) return;
    setIsRunning(true);

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
        // Collect banana if standing on a target cell
        const targetAtPos = targets.find((tg) => tg.x === currentPos.x && tg.y === currentPos.y);
        if (targetAtPos && !collected.some((c) => c.x === targetAtPos.x && c.y === targetAtPos.y)) {
          collected = [...collected, { x: targetAtPos.x, y: targetAtPos.y }];
          setCollectedTargets([...collected]);
          playSound('collect');
        }
      }

      await new Promise((res) => setTimeout(res, 450));
    }

    // Auto-collect target if standing directly on it at end of run
    const finalTarget = targets.find((tg) => tg.x === currentPos.x && tg.y === currentPos.y);
    if (finalTarget && !collected.some((c) => c.x === finalTarget.x && c.y === finalTarget.y)) {
      collected = [...collected, { x: finalTarget.x, y: finalTarget.y }];
      setCollectedTargets([...collected]);
    }

    // Check completion
    const allTargetsCollected = targets.every((tg) =>
      collected.some((c) => c.x === tg.x && c.y === tg.y)
    );

    if (allTargetsCollected && targets.length > 0) {
      playSound('success');
      setIsLevelSuccess(true);
      speakHindi('शाबाश! आपने केला उठा लिया और स्तर पूरा कर लिया!');
    } else {
      playSound('fail');
      speakHindi('रोबोट केला नहीं उठा पाया, पुनः प्रयास करें।');
      alert('रोबोट लक्ष्य तक नहीं पहुँचा। पुनः प्रयास करें!');
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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      
      {/* Universal Navigation Header */}
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
              onClick={() => switchTab('coding')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'coding' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🎮 मेज़ कोडिंग (Logic)
            </button>

            <button
              onClick={() => switchTab('english')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'english' || activeTab === 'phonics' ? 'bg-teal-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🔤 English Lab
            </button>

            <button
              onClick={() => switchTab('ai')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'ai' || activeTab === 'ml' ? 'bg-purple-600 text-white shadow' : 'bg-purple-100 hover:bg-purple-200 text-purple-900'
              }`}
            >
              🤖 AI खेलघर (Arcade)
            </button>

            <button
              onClick={() => switchTab('maths')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'maths' ? 'bg-amber-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🔢 गणित (Maths)
            </button>

            <button
              onClick={() => switchTab('music')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'music' ? 'bg-orange-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🎹 संगीत (Music)
            </button>

            <button
              onClick={() => switchTab('researcher')}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shrink-0 cursor-pointer transition ${
                activeTab === 'researcher' ? 'bg-violet-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🔬 विज्ञान (Science)
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
      <main className="flex-1 p-3 md:p-6 max-w-7xl mx-auto w-full">
        
        {/* CODING LOGIC MAZE */}
        {activeTab === 'coding' && (
          <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] min-h-[620px]">
            
            {/* Left Column: Visual Game Canvas */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3">
              
              {/* Level Selector Bar with Audio Button */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
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

                <div className="flex gap-1 overflow-x-auto py-1">
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

              {/* Game Viewport Canvas */}
              <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col justify-center items-center relative overflow-hidden">
                {currentLevel && (
                  <GameCanvas
                    level={currentLevel}
                    playerPos={playerPos}
                    collectedTargets={collectedTargets}
                  />
                )}

                {/* Level Success Overlay */}
                {isLevelSuccess && (
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 z-20">
                    <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-lg">
                      🏆
                    </div>
                    <h3 className="text-xl font-black text-white mb-1">शाबाश! स्तर पार हुआ</h3>
                    <p className="text-xs font-bold text-emerald-300 mb-4">रोबोट ने सफलतापूर्वक केला उठा लिया!</p>
                    <button
                      onClick={handleNextLevel}
                      className="py-2.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer"
                    >
                      अगला स्तर (Next Level) ➔
                    </button>
                  </div>
                )}
              </div>

              {/* Instruction / Hint Card with Audio Prompt */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs font-bold text-emerald-950 flex items-center justify-between gap-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0 text-emerald-700" />
                  <span>💡 {(currentLevel as any)?.instruction || (currentLevel as any)?.hint || 'ब्लॉक जोड़कर कोड चलाएं!'}</span>
                </div>
                <button
                  onClick={() => speakHindi((currentLevel as any)?.instruction || (currentLevel as any)?.hint || 'ब्लॉक जोड़कर कोड चलाएं!')}
                  className="p-1 text-emerald-800 hover:bg-emerald-200 rounded transition cursor-pointer shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Blockly Workspace */}
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

        {/* OTHER MODULE TABS */}
        {(activeTab === 'english' || activeTab === 'phonics' || activeTab === 'syntax' || activeTab === 'vocab') && <EnglishLiteracyHub />}
        {(activeTab === 'ai' || activeTab === 'ml') && <AiArcadeStudio />}
        {activeTab === 'maths' && <HindiMathStudio />}
        {activeTab === 'music' && <HindiMusicStudio />}
        {activeTab === 'researcher' && <JuniorResearcherStudio />}
        {activeTab === 'evs' && <HindiAnimalStudio />}

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