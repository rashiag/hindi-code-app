'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { LEVELS, Level, AgeGroup } from '../lib/levels';
import { speakHindi, unlockAudio, playStepSound, playCollectSound, playWinSound, playBumpSound } from '../lib/audio';
import { ActionItem } from '../components/BlocklyWorkspace';

const GameCanvas = dynamic(() => import('../components/GameCanvas'), { ssr: false });
const BlocklyWorkspace = dynamic(() => import('../components/BlocklyWorkspace'), { ssr: false });
const HindiMLStudio = dynamic(() => import('../components/HindiMLStudio'), { ssr: false });
const HindiQuickDraw = dynamic(() => import('../components/HindiQuickDraw'), { ssr: false });
const HindiScratchStudio = dynamic(() => import('../components/HindiScratchStudio'), { ssr: false });
const HindiVocabMatch = dynamic(() => import('../components/HindiVocabMatch'), { ssr: false });
const HindiSentenceBuilder = dynamic(() => import('../components/HindiSentenceBuilder'), { ssr: false });
const HindiPhonicsStudio = dynamic(() => import('../components/HindiPhonicsStudio'), { ssr: false });

type TabType = 'coding' | 'scratch' | 'ml' | 'draw' | 'vocab' | 'sentence' | 'phonics';

function StudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get('tab');
  const validTabs: TabType[] = ['coding', 'scratch', 'ml', 'draw', 'vocab', 'sentence', 'phonics'];
  const activeTab: TabType = validTabs.includes(tabParam as TabType) ? (tabParam as TabType) : 'coding';

  const handleTabChange = (newTab: TabType) => {
    unlockAudio();
    router.push(`/?tab=${newTab}`, { scroll: false });
  };

  const [selectedAge, setSelectedAge] = useState<AgeGroup>('junior');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState<{ [key: string]: number }>({
    junior: 0,
    intermediate: 0,
    senior: 0,
  });
  const [levelStars, setLevelStars] = useState<{ [key: number]: number }>({});
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  const filteredLevels = LEVELS.filter((lvl) => lvl.ageGroup === selectedAge);
  const currentLevel: Level = filteredLevels[currentLevelIndex] || filteredLevels[0] || LEVELS[0];

  const [playerPos, setPlayerPos] = useState({
    x: currentLevel.startPos.x,
    y: currentLevel.startPos.y,
    dir: currentLevel.startDir,
  });
  const [collectedTargets, setCollectedTargets] = useState<{ x: number; y: number }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedAge = localStorage.getItem('yr_selected_age') as AgeGroup | null;
    const savedProgress = localStorage.getItem('yr_unlocked_tracks');
    const savedStars = localStorage.getItem('yr_level_stars');

    if (savedAge) setSelectedAge(savedAge);
    if (savedProgress) setUnlockedLevels(JSON.parse(savedProgress));
    if (savedStars) setLevelStars(JSON.parse(savedStars));
  }, []);

  const handleAgeChange = (age: AgeGroup) => {
    setSelectedAge(age);
    setCurrentLevelIndex(0);
    localStorage.setItem('yr_selected_age', age);
  };

  const resetGameState = () => {
    setPlayerPos({
      x: currentLevel.startPos.x,
      y: currentLevel.startPos.y,
      dir: currentLevel.startDir,
    });
    setCollectedTargets([]);
    setIsVictory(false);
    setMessage(currentLevel.instruction);
  };

  useEffect(() => {
    resetGameState();
    if (activeTab === 'coding') {
      speakHindi(currentLevel.voiceText);
    }
  }, [currentLevelIndex, selectedAge, activeTab]);

  const handlePlayVoiceInstruction = () => {
    unlockAudio();
    speakHindi(currentLevel.voiceText, true);
  };

  const handleRunCode = async (actions: ActionItem[], blockCount: number) => {
    unlockAudio();
    if (isRunning || actions.length === 0) return;
    setIsRunning(true);
    setMessage('कोड चल रहा है...');

    let curX = currentLevel.startPos.x;
    let curY = currentLevel.startPos.y;
    let curDir = currentLevel.startDir;
    let collected: { x: number; y: number }[] = [];

    setPlayerPos({ x: curX, y: curY, dir: curDir });
    setCollectedTargets([]);

    const directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'] as const;
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const delay = speed === 'slow' ? 650 : speed === 'fast' ? 200 : 400;

    let hasCollided = false;

    const isObstacleAhead = () => {
      let lookX = curX;
      let lookY = curY;
      if (curDir === 'NORTH') lookY -= 1;
      if (curDir === 'EAST') lookX += 1;
      if (curDir === 'SOUTH') lookY += 1;
      if (curDir === 'WEST') lookX += 1;
      return currentLevel.obstacles.some((obs) => obs.x === lookX && obs.y === lookY);
    };

    const executeActionList = async (items: ActionItem[]): Promise<boolean> => {
      for (const item of items) {
        if (hasCollided) return false;

        if (item.type === 'MOVE_FORWARD') {
          let nextX = curX;
          let nextY = curY;
          if (curDir === 'NORTH') nextY -= 1;
          if (curDir === 'EAST') nextX += 1;
          if (curDir === 'SOUTH') nextY += 1;
          if (curDir === 'WEST') nextX += 1;

          if (nextX < 0 || nextX >= currentLevel.gridSize || nextY < 0 || nextY >= currentLevel.gridSize) {
            playBumpSound();
            setMessage('अरे! आप ग्रिड से बाहर चले गए!');
            hasCollided = true;
            return false;
          }

          const hitObs = currentLevel.obstacles.some((obs) => obs.x === nextX && obs.y === nextY);
          if (hitObs) {
            playBumpSound();
            setMessage('अरे! रास्ते में पत्थर 🪨 है!');
            hasCollided = true;
            return false;
          }

          curX = nextX;
          curY = nextY;
          setPlayerPos({ x: curX, y: curY, dir: curDir });
          playStepSound();
          await sleep(delay);
        } else if (item.type === 'TURN_RIGHT') {
          const idx = directions.indexOf(curDir);
          curDir = directions[(idx + 1) % 4];
          setPlayerPos({ x: curX, y: curY, dir: curDir });
          await sleep(delay * 0.7);
        } else if (item.type === 'TURN_LEFT') {
          const idx = directions.indexOf(curDir);
          curDir = directions[(idx + 3) % 4];
          setPlayerPos({ x: curX, y: curY, dir: curDir });
          await sleep(delay * 0.7);
        } else if (item.type === 'COLLECT_ITEM') {
          const found = currentLevel.targets.find(
            (t) => t.x === curX && t.y === curY && !collected.some((c) => c.x === t.x && c.y === t.y)
          );
          if (found) {
            collected = [...collected, found];
            setCollectedTargets([...collected]);
            playCollectSound();
            await sleep(delay * 0.7);
            if (collected.length === currentLevel.targets.length) return true;
          }
        } else if (item.type === 'IF_OBSTACLE') {
          if (isObstacleAhead()) {
            const finished = await executeActionList(item.branch);
            if (finished) return true;
          }
        }
      }
      return false;
    };

    await executeActionList(actions);

    if (hasCollided) {
      await sleep(1000);
      resetGameState();
    } else if (collected.length === currentLevel.targets.length) {
      let stars = 3;
      if (blockCount > currentLevel.optimalBlocks + 2) stars = 1;
      else if (blockCount > currentLevel.optimalBlocks) stars = 2;

      setEarnedStars(stars);
      const nextTrackUnlocked = Math.max(unlockedLevels[selectedAge] || 0, currentLevelIndex + 1);
      const updatedTracks = { ...unlockedLevels, [selectedAge]: nextTrackUnlocked };
      setUnlockedLevels(updatedTracks);
      localStorage.setItem('yr_unlocked_tracks', JSON.stringify(updatedTracks));

      const updatedStars = { ...levelStars, [currentLevel.id]: Math.max(levelStars[currentLevel.id] || 0, stars) };
      setLevelStars(updatedStars);
      localStorage.setItem('yr_level_stars', JSON.stringify(updatedStars));

      playWinSound();
      setIsVictory(true);
      speakHindi('शाबाश! आपने यह स्तर पूरा कर लिया!', true);
    }
    setIsRunning(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-2.5 md:p-6 w-full overflow-x-hidden">
      {/* Top Header */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between bg-white px-3.5 py-3 md:px-5 md:py-3.5 rounded-2xl shadow-sm border border-slate-200 mb-3 gap-2.5">
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="text-2xl">🚀</span>
          <div>
            <h1 className="text-sm md:text-lg font-black text-slate-800 leading-tight">Young Researcher AI &amp; Code</h1>
            <p className="text-[11px] md:text-xs text-slate-500">ओपन-एक्सेस कंप्यूटर विज़न व कोडिंग लैब (NEP 2020)</p>
          </div>
        </div>

        {/* Navigation Switcher */}
        <div className="w-full md:w-auto flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold gap-1 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => handleTabChange('phonics')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'phonics' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔊 फोनिक्स (CVC)
          </button>
          <button
            onClick={() => handleTabChange('sentence')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'sentence' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧩 वाक्य बनाओ
          </button>
          <button
            onClick={() => handleTabChange('vocab')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'vocab' ? 'bg-pink-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔤 शब्द मिलाओ
          </button>
          <button
            onClick={() => handleTabChange('coding')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'coding' ? 'bg-green-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎮 मेज़ कोडिंग
          </button>
          <button
            onClick={() => handleTabChange('scratch')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'scratch' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🐱 स्क्रैच स्टूडियो
          </button>
          <button
            onClick={() => handleTabChange('ml')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'ml' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧠 AI मशीन ट्रेनर
          </button>
          <button
            onClick={() => handleTabChange('draw')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'draw' ? 'bg-orange-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎨 जल्दी बनाओ AI
          </button>
        </div>
      </header>

      {/* Render Active Studio */}
      {activeTab === 'phonics' ? (
        <HindiPhonicsStudio />
      ) : activeTab === 'sentence' ? (
        <HindiSentenceBuilder />
      ) : activeTab === 'vocab' ? (
        <HindiVocabMatch />
      ) : activeTab === 'scratch' ? (
        <HindiScratchStudio />
      ) : activeTab === 'draw' ? (
        <HindiQuickDraw />
      ) : activeTab === 'ml' ? (
        <HindiMLStudio />
      ) : (
        <>
          {/* Level & Age Bracket Selection Bar */}
          <section className="w-full max-w-6xl mb-3 bg-white border border-slate-200 p-3 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1">
                <label className="text-xs font-bold text-slate-700">आयु:</label>
                <select
                  value={selectedAge}
                  onChange={(e) => handleAgeChange(e.target.value as AgeGroup)}
                  className="bg-slate-100 text-slate-800 font-semibold py-1 px-2 rounded-lg border border-slate-300 text-xs"
                >
                  <option value="junior">5–7 (Junior)</option>
                  <option value="intermediate">8–10 (Explorer)</option>
                  <option value="senior">11+ (Researcher)</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <label className="text-xs font-bold text-slate-700">स्तर:</label>
                <select
                  value={currentLevelIndex}
                  onChange={(e) => {
                    unlockAudio();
                    setCurrentLevelIndex(Number(e.target.value));
                  }}
                  className="bg-slate-100 text-slate-800 font-medium py-1 px-2 rounded-lg border border-slate-300 text-xs"
                >
                  {filteredLevels.map((lvl, i) => {
                    const isLocked = i > (unlockedLevels[selectedAge] || 0);
                    const stars = levelStars[lvl.id] ? '⭐'.repeat(levelStars[lvl.id]) : '';
                    return (
                      <option key={lvl.id} value={i} disabled={isLocked}>
                        {isLocked ? `🔒 ${lvl.title}` : `${lvl.title} ${stars}`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                onClick={handlePlayVoiceInstruction}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition active:scale-95 shadow-sm cursor-pointer"
              >
                <span>🔊</span> सुनें
              </button>
            </div>

            <div className="text-xs text-slate-600 font-medium">{currentLevel.instruction}</div>
          </section>

          {/* Blockly & Canvas */}
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1">
            <div className="lg:col-span-5 flex flex-col items-center">
              <GameCanvas level={currentLevel} playerPos={playerPos} collectedTargets={collectedTargets} />
              {message && (
                <div className="mt-2.5 text-center text-xs md:text-sm font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm w-full">
                  {message}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-slate-200">
              <BlocklyWorkspace
                onRunCode={handleRunCode}
                onReset={resetGameState}
                isRunning={isRunning}
                allowedBlocks={currentLevel.allowedBlocks}
              />
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">लोड हो रहा है...</div>}>
      <StudioContent />
    </Suspense>
  );
}