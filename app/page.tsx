'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LEVELS, Level, AgeGroup } from '../lib/levels';
import { speakHindi, playStepSound, playCollectSound, playWinSound, playBumpSound } from '../lib/audio';
import { ActionItem } from '../components/BlocklyWorkspace';
import { supabase } from '../lib/supabaseClient';

const GameCanvas = dynamic(() => import('../components/GameCanvas'), { ssr: false });
const BlocklyWorkspace = dynamic(() => import('../components/BlocklyWorkspace'), { ssr: false });

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('junior');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState<{ [key: string]: number }>({
    junior: 0,
    intermediate: 0,
    senior: 0,
  });
  const [levelStars, setLevelStars] = useState<{ [key: number]: number }>({});
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  // Filter levels according to selected age track
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
  const [showHint, setShowHint] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Authentication & Progress Hydration
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });

    const savedProgress = localStorage.getItem('yr_unlocked_tracks');
    const savedStars = localStorage.getItem('yr_level_stars');
    if (savedProgress) setUnlockedLevels(JSON.parse(savedProgress));
    if (savedStars) setLevelStars(JSON.parse(savedStars));
  }, []);

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetGameState = () => {
    setPlayerPos({
      x: currentLevel.startPos.x,
      y: currentLevel.startPos.y,
      dir: currentLevel.startDir,
    });
    setCollectedTargets([]);
    setIsVictory(false);
    setShowHint(false);
    setMessage(currentLevel.instruction);
  };

  useEffect(() => {
    resetGameState();
    if (isAudioEnabled) {
      speakHindi(currentLevel.voiceText);
    }
  }, [currentLevelIndex, selectedAge, isAudioEnabled]);

  const handleRunCode = async (actions: ActionItem[], blockCount: number) => {
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
      if (curDir === 'WEST') lookX -= 1;
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
          if (curDir === 'WEST') nextX -= 1;

          if (nextX < 0 || nextX >= currentLevel.gridSize || nextY < 0 || nextY >= currentLevel.gridSize) {
            playBumpSound();
            setMessage('अरे! आप ग्रिड से बाहर चले गए!');
            if (isAudioEnabled) speakHindi('अरे! आप ग्रिड से बाहर चले गए!');
            hasCollided = true;
            return false;
          }

          const hitObs = currentLevel.obstacles.some((obs) => obs.x === nextX && obs.y === nextY);
          if (hitObs) {
            playBumpSound();
            setMessage('अरे! रास्ते में पत्थर 🪨 है!');
            if (isAudioEnabled) speakHindi('अरे! आगे पत्थर है!');
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
      if (isAudioEnabled) speakHindi('शाबाश! आपने यह स्तर पूरा कर लिया!');
    }
    setIsRunning(false);
  };

  // 1. Social Login Screen if Not Signed In
  if (!user) {
    return (
      <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-200">
          <div className="text-5xl mb-3">🐵 💻 🚀</div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Young Researcher</h1>
          <p className="text-slate-600 text-sm mb-6">हिंदी कोडिंग खेल में आपका स्वागत है! शुरू करने के लिए लॉगिन करें।</p>

          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <span>🌐</span> Google से लॉगिन करें
            </button>
            <button
              onClick={() => handleSocialLogin('github')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-sm"
            >
              <span>🐙</span> GitHub से लॉगिन करें
            </button>
            <button
              onClick={() => setUser({ email: 'guest@youngresearcher.in', user_metadata: { full_name: 'अतिथि छात्र' } })}
              className="w-full py-2.5 text-xs text-slate-500 font-semibold hover:underline"
            >
              अतिथि के रूप में जारी रखें (Guest Mode) ➔
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 2. Main Game Interface with Age Filters
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-3 md:p-6">
      <header className="w-full max-w-6xl flex flex-wrap items-center justify-between bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 mb-4 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐵</span>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-800 leading-tight">Young Researcher कोडिंग</h1>
            <p className="text-xs text-green-700 font-medium">{currentLevel.concept}</p>
          </div>
        </div>

        {/* Age Track Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold gap-1">
          <button
            onClick={() => { setSelectedAge('junior'); setCurrentLevelIndex(0); }}
            className={`px-3 py-1.5 rounded-lg transition ${selectedAge === 'junior' ? 'bg-green-600 text-white shadow' : 'text-slate-600'}`}
          >
            आयु 5-7 (Junior)
          </button>
          <button
            onClick={() => { setSelectedAge('intermediate'); setCurrentLevelIndex(0); }}
            className={`px-3 py-1.5 rounded-lg transition ${selectedAge === 'intermediate' ? 'bg-green-600 text-white shadow' : 'text-slate-600'}`}
          >
            आयु 8-10 (Explorer)
          </button>
          <button
            onClick={() => { setSelectedAge('senior'); setCurrentLevelIndex(0); }}
            className={`px-3 py-1.5 rounded-lg transition ${selectedAge === 'senior' ? 'bg-green-600 text-white shadow' : 'text-slate-600'}`}
          >
            आयु 11+ (Researcher)
          </button>
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`px-2.5 py-1 rounded-lg text-xs md:text-sm font-semibold transition ${
              isAudioEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {isAudioEnabled ? '🔊 आवाज़' : '🔇 बंद'}
          </button>
          <button
            onClick={handleLogout}
            className="text-xs text-red-600 bg-red-50 hover:bg-red-100 font-bold px-2.5 py-1 rounded-lg border border-red-200"
          >
            लॉगआउट
          </button>
        </div>
      </header>

      {/* Level Selection Bar */}
      <section className="w-full max-w-6xl mb-4 bg-white border border-slate-200 p-3.5 rounded-xl flex flex-wrap justify-between items-center gap-2 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs md:text-sm font-bold text-slate-700">स्तर चुनें:</label>
          <select
            value={currentLevelIndex}
            onChange={(e) => setCurrentLevelIndex(Number(e.target.value))}
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
        </div>
        <div className="text-xs text-slate-600 font-medium">
          {currentLevel.instruction}
        </div>
      </section>

      {/* Main Canvas & Blockly Grid */}
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
    </main>
  );
}