'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LEVELS, Level } from '../lib/levels';
import { speakHindi, playStepSound, playCollectSound, playWinSound, playBumpSound } from '../lib/audio';

const GameCanvas = dynamic(() => import('../components/GameCanvas'), { ssr: false });
const BlocklyWorkspace = dynamic(() => import('../components/BlocklyWorkspace'), { ssr: false });

export default function HomePage() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevel: Level = LEVELS[currentLevelIndex];

  const [playerPos, setPlayerPos] = useState({
    x: currentLevel.startPos.x,
    y: currentLevel.startPos.y,
    dir: currentLevel.startDir,
  });
  const [collectedTargets, setCollectedTargets] = useState<{ x: number; y: number }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

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
  }, [currentLevelIndex, isAudioEnabled]);

  const handleHintClick = () => {
    setShowHint(true);
    if (isAudioEnabled) {
      speakHindi(`संकेत: ${currentLevel.hint}`);
    }
  };

  const handleRunCode = async (actions: string[]) => {
    if (isRunning || actions.length === 0) return;
    setIsRunning(true);
    setMessage('कोड चल रहा है...');

    let curX = currentLevel.startPos.x;
    let curY = currentLevel.startPos.y;
    let curDir = currentLevel.startDir;
    let collected: { x: number; y: number }[] = [];

    // Ensure clean start
    setPlayerPos({ x: curX, y: curY, dir: curDir });
    setCollectedTargets([]);

    const directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'] as const;
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await sleep(200);

    let hasCollided = false;

    for (let i = 0; i < actions.length; i++) {
      const act = actions[i];

      if (act === 'MOVE_FORWARD') {
        let nextX = curX;
        let nextY = curY;

        if (curDir === 'NORTH') nextY -= 1;
        if (curDir === 'EAST') nextX += 1;
        if (curDir === 'SOUTH') nextY += 1;
        if (curDir === 'WEST') nextX -= 1;

        // Grid boundary check
        if (nextX < 0 || nextX >= currentLevel.gridSize || nextY < 0 || nextY >= currentLevel.gridSize) {
          playBumpSound();
          setMessage('अरे! आप ग्रिड से बाहर चले गए! वापस शुरुआत पर जा रहे हैं...');
          if (isAudioEnabled) speakHindi('अरे! आप ग्रिड से बाहर चले गए!');
          hasCollided = true;
          break;
        }

        // Obstacle check
        const hitObs = currentLevel.obstacles.some((obs) => obs.x === nextX && obs.y === nextY);
        if (hitObs) {
          playBumpSound();
          setMessage('अरे! रास्ते में पत्थर 🪨 है! वापस शुरुआत पर जा रहे हैं...');
          if (isAudioEnabled) speakHindi('अरे! आगे पत्थर है!');
          hasCollided = true;
          break;
        }

        curX = nextX;
        curY = nextY;
        const newPos = { x: curX, y: curY, dir: curDir };
        setPlayerPos(() => newPos);
        playStepSound();
        await sleep(500);

      } else if (act === 'TURN_RIGHT') {
        const idx = directions.indexOf(curDir);
        curDir = directions[(idx + 1) % 4];
        const newPos = { x: curX, y: curY, dir: curDir };
        setPlayerPos(() => newPos);
        await sleep(350);

      } else if (act === 'TURN_LEFT') {
        const idx = directions.indexOf(curDir);
        curDir = directions[(idx + 3) % 4];
        const newPos = { x: curX, y: curY, dir: curDir };
        setPlayerPos(() => newPos);
        await sleep(350);

      } else if (act === 'COLLECT_ITEM') {
        const found = currentLevel.targets.find(
          (t) => t.x === curX && t.y === curY && !collected.some((c) => c.x === t.x && c.y === t.y)
        );

        if (found) {
          collected = [...collected, found];
          const newCollected = [...collected];
          setCollectedTargets(() => newCollected);
          playCollectSound();
          await sleep(350);

          if (collected.length === currentLevel.targets.length) {
            break;
          }
        } else {
          setMessage('यहाँ कोई फल नहीं है!');
          await sleep(350);
        }
      }
    }

    // Auto-reset position back to start on collision error
    if (hasCollided) {
      await sleep(1000);
      setPlayerPos({
        x: currentLevel.startPos.x,
        y: currentLevel.startPos.y,
        dir: currentLevel.startDir,
      });
      setCollectedTargets([]);
      setMessage('फिर से प्रयास करें!');
    } else if (collected.length === currentLevel.targets.length) {
      playWinSound();
      setIsVictory(true);
      setMessage('🎉 शाबाश! आपने यह स्तर पूरा कर लिया!');
      if (isAudioEnabled) {
        speakHindi('शाबाश! आपने यह स्तर पूरा कर लिया!');
      }
    } else {
      setMessage('प्रयास अच्छा था! एक बार फिर कोड जांचें।');
    }

    setIsRunning(false);
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-4">
      <header className="w-full max-w-6xl flex flex-wrap items-center justify-between bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 mb-4 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐵</span>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Young Researcher - कोडिंग खेल</h1>
            <p className="text-xs text-green-700 font-medium">{currentLevel.concept}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-600">स्तर चुनें:</label>
          <select
            value={currentLevelIndex}
            onChange={(e) => setCurrentLevelIndex(Number(e.target.value))}
            className="bg-slate-100 text-slate-800 font-medium py-1.5 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            {LEVELS.map((lvl, i) => (
              <option key={lvl.id} value={i}>
                {lvl.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
              isAudioEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {isAudioEnabled ? '🔊 आवाज़ ऑन' : '🔇 आवाज़ बंद'}
          </button>
          <button
            onClick={handleHintClick}
            className="bg-amber-100 text-amber-900 hover:bg-amber-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1"
          >
            💡 संकेत
          </button>
        </div>
      </header>

      <section className="w-full max-w-6xl mb-4 bg-white border border-slate-200 p-3.5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2 shadow-sm">
        <div>
          <span className="font-bold text-slate-800 text-sm mr-2">{currentLevel.title}:</span>
          <span className="text-slate-700 text-sm">{currentLevel.instruction}</span>
        </div>
        {showHint && (
          <div className="text-xs bg-amber-50 text-amber-800 border border-amber-300 rounded px-2.5 py-1">
            💡 {currentLevel.hint}
          </div>
        )}
      </section>

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
            hasRepeat={currentLevel.hasRepeatBlock}
          />
        </div>
      </div>

      {isVictory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-6xl mb-3">🎉 🌟 🍌</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">शानदार! स्तर पूरा हुआ!</h2>
            <p className="text-slate-600 text-sm mb-6">आपने सफलतापूर्वक सभी लक्ष्य प्राप्त कर लिए हैं।</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={resetGameState}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 font-bold rounded-xl text-slate-700 transition text-sm"
              >
                फिर से खेलें
              </button>
              {currentLevelIndex < LEVELS.length - 1 && (
                <button
                  onClick={handleNextLevel}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 font-bold rounded-xl text-white shadow-lg shadow-green-600/30 transition text-sm"
                >
                  अगला स्तर ➔
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}