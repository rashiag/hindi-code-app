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

const SHEETDB_URL = 'https://sheetdb.io/api/v1/ap1nemn50td2f';

function StudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const tabParam = searchParams.get('tab');
  const activeTab = (['coding', 'scratch', 'ml', 'draw'].includes(tabParam || '')
    ? tabParam
    : 'coding') as 'coding' | 'scratch' | 'ml' | 'draw';

  const handleTabChange = (newTab: 'coding' | 'scratch' | 'ml' | 'draw') => {
    unlockAudio();
    router.push(`/?tab=${newTab}`, { scroll: false });
  };

  const [studentProfile, setStudentProfile] = useState<{
    name: string;
    ageGroup: AgeGroup;
    school: string;
    email: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    ageGroup: 'junior' as AgeGroup,
    school: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState<{ [key: string]: number }>({
    junior: 0,
    intermediate: 0,
    senior: 0,
  });
  const [levelStars, setLevelStars] = useState<{ [key: number]: number }>({});
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  const selectedAge = studentProfile?.ageGroup || 'junior';
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
    const savedProfile = localStorage.getItem('yr_student_profile');
    const savedProgress = localStorage.getItem('yr_unlocked_tracks');
    const savedStars = localStorage.getItem('yr_level_stars');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setStudentProfile(parsed);
      setFormData(parsed);
    }
    if (savedProgress) setUnlockedLevels(JSON.parse(savedProgress));
    if (savedStars) setLevelStars(JSON.parse(savedStars));
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    unlockAudio();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    const record = {
      Timestamp: new Date().toLocaleString('en-IN'),
      Name: formData.name.trim(),
      'Age Group':
        formData.ageGroup === 'junior'
          ? 'Junior (5-7)'
          : formData.ageGroup === 'intermediate'
          ? 'Explorer (8-10)'
          : 'Researcher (11+)',
      School: formData.school.trim() || 'Not specified',
      Email: formData.email.trim() || 'Not specified',
    };

    setStudentProfile(formData);
    localStorage.setItem('yr_student_profile', JSON.stringify(formData));

    try {
      await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [record] }),
      });
    } catch (err) {
      console.warn(err);
    }
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('yr_student_profile');
    setStudentProfile(null);
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
    if (activeTab === 'coding' && studentProfile) {
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

  if (!studentProfile) {
    return (
      <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🐵 🐱 🧠 🎨</div>
            <h1 className="text-2xl font-black text-slate-800">Young Researcher</h1>
            <p className="text-slate-500 text-xs mt-1">कोडिंग और AI यात्रा शुरू करने के लिए छात्र विवरण भरें</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">विद्यार्थी का नाम (Full Name) *</label>
              <input
                type="text"
                required
                placeholder="उदा. आरव शर्मा"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">आयु वर्ग (Age Bracket) *</label>
              <select
                value={formData.ageGroup}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as AgeGroup })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-800 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="junior">आयु 5–7 वर्ष (Junior Track)</option>
                <option value="intermediate">आयु 8–10 वर्ष (Explorer Track)</option>
                <option value="senior">आयु 11+ वर्ष (Researcher Track)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">विद्यालय का नाम (School Name)</label>
              <input
                type="text"
                placeholder="उदा. Campus School"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ईमेल या अभिभावक संपर्क (Email / Phone)</label>
              <input
                type="text"
                placeholder="उदा. parent@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold rounded-xl transition shadow-lg shadow-green-600/30 text-sm mt-4"
            >
              {isSubmitting ? 'पंजीकरण हो रहा है...' : 'शुरू करें ➔'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-3 md:p-6">
      {/* Top Header */}
      <header className="w-full max-w-6xl flex flex-wrap items-center justify-between bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 mb-4 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚀</span>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-800 leading-tight">Young Researcher AI & Code</h1>
            <p className="text-xs text-slate-600">
              छात्र: <strong className="text-green-700">{studentProfile.name}</strong>
            </p>
          </div>
        </div>

        {/* 4-Way Studio Module Switcher with Address Bar Routing */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold gap-1">
          <button
            onClick={() => handleTabChange('coding')}
            className={`px-3 py-2 rounded-lg transition ${
              activeTab === 'coding' ? 'bg-green-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎮 मेज़ कोडिंग
          </button>
          <button
            onClick={() => handleTabChange('scratch')}
            className={`px-3 py-2 rounded-lg transition ${
              activeTab === 'scratch' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🐱 स्क्रैच स्टूडियो
          </button>
          <button
            onClick={() => handleTabChange('ml')}
            className={`px-3 py-2 rounded-lg transition ${
              activeTab === 'ml' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧠 AI मशीन ट्रेनर
          </button>
          <button
            onClick={() => handleTabChange('draw')}
            className={`px-3 py-2 rounded-lg transition ${
              activeTab === 'draw' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎨 जल्दी बनाओ AI
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs text-slate-500 hover:text-red-600 font-semibold px-2 py-1"
        >
          प्रोफ़ाइल बदलें
        </button>
      </header>

      {/* Render Active Studio */}
      {activeTab === 'scratch' ? (
        <HindiScratchStudio />
      ) : activeTab === 'draw' ? (
        <HindiQuickDraw />
      ) : activeTab === 'ml' ? (
        <HindiMLStudio />
      ) : (
        <>
          {/* Level Selection Bar with Explicit Hindi Audio Button */}
          <section className="w-full max-w-6xl mb-4 bg-white border border-slate-200 p-3.5 rounded-xl flex flex-wrap justify-between items-center gap-2 shadow-sm">
            <div className="flex items-center gap-3">
              <label className="text-xs md:text-sm font-bold text-slate-700">स्तर चुनें:</label>
              <select
                value={currentLevelIndex}
                onChange={(e) => {
                  unlockAudio();
                  setCurrentLevelIndex(Number(e.target.value));
                }}
                className="bg-slate-100 text-slate-800 font-medium py-1 px-2.5 rounded-lg border border-slate-300 text-xs md:text-sm"
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

              {/* Hindi Voice Instruction Trigger */}
              <button
                onClick={handlePlayVoiceInstruction}
                className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                title="निर्देश हिंदी में सुनें"
              >
                <span>🔊</span> निर्देश सुनें
              </button>
            </div>
            <div className="text-xs text-slate-600 font-medium">{currentLevel.instruction}</div>
          </section>

          {/* Blockly & Canvas */}
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            <div className="lg:col-span-5 flex flex-col items-center">
              <GameCanvas level={currentLevel} playerPos={playerPos} collectedTargets={collectedTargets} />
              {message && (
                <div className="mt-3 text-center text-sm font-semibold px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm w-full">
                  {message}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
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