'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Award, Sparkles, CheckCircle2, Trophy, Star } from 'lucide-react';

interface RuralObject {
  name: string;
  plural: string;
  hindi: string;
  emoji: string;
}

const RURAL_ITEMS: RuralObject[] = [
  { name: 'Mango', plural: 'Mangoes', hindi: 'आम', emoji: '🥭' },
  { name: 'Diya', plural: 'Diyas', hindi: 'दीया', emoji: '🪔' },
  { name: 'Kite', plural: 'Kites', hindi: 'पतंग', emoji: '🪁' },
  { name: 'Goat', plural: 'Goats', hindi: 'बकरी', emoji: '🐐' },
  { name: 'Lotus', plural: 'Lotuses', hindi: 'कमल', emoji: '🪷' },
  { name: 'Peacock', plural: 'Peacocks', hindi: 'मोर', emoji: '🦚' }
];

const NUMBER_MAP: { [key: number]: { hindiNum: string; hindiWord: string; engWord: string } } = {
  1: { hindiNum: '१', hindiWord: 'एक', engWord: 'One' },
  2: { hindiNum: '२', hindiWord: 'दो', engWord: 'Two' },
  3: { hindiNum: '३', hindiWord: 'तीन', engWord: 'Three' },
  4: { hindiNum: '४', hindiWord: 'चार', engWord: 'Four' },
  5: { hindiNum: '५', hindiWord: 'पाँच', engWord: 'Five' },
  6: { hindiNum: '६', hindiWord: 'छह', engWord: 'Six' },
  7: { hindiNum: '७', hindiWord: 'सात', engWord: 'Seven' },
  8: { hindiNum: '८', hindiWord: 'आठ', engWord: 'Eight' },
  9: { hindiNum: '९', hindiWord: 'नौ', engWord: 'Nine' },
  10: { hindiNum: '१०', hindiWord: 'दस', engWord: 'Ten' }
};

const TOTAL_ROUNDS = 5;

export function HindiMathStudio() {
  const [tier, setTier] = useState<1 | 2>(1);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [targetCount, setTargetCount] = useState<number>(3);
  const [activeItem, setActiveItem] = useState<RuralObject>(RURAL_ITEMS[0]);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [countingIndex, setCountingIndex] = useState<number>(-1);
  const [isCountingAnimation, setIsCountingAnimation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSuccessChime = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  const speakAudio = (text: string, lang: 'hi-IN' | 'en-IN' | 'en-US' = 'hi-IN', rate: number = 0.85): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const generateQuestion = (roundNum: number = currentRound) => {
    if (roundNum > TOTAL_ROUNDS) {
      triggerGameOver();
      return;
    }

    const maxVal = tier === 1 ? 5 : 10;
    const minVal = 1;
    const count = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    const randomItem = RURAL_ITEMS[Math.floor(Math.random() * RURAL_ITEMS.length)];

    const opts = new Set<number>([count]);
    while (opts.size < 3) {
      const wrong = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      opts.add(wrong);
    }

    setTargetCount(count);
    setActiveItem(randomItem);
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    setSelectedNum(null);
    setIsCorrect(null);
    setCountingIndex(-1);
    setIsCountingAnimation(false);
  };

  const triggerGameOver = async () => {
    setIsGameOver(true);
    if (score >= 4) {
      await speakAudio(`अद्भुत प्रदर्शन! आपने पाँच में से ${score} अंक प्राप्त किए हैं!`, 'hi-IN');
      await new Promise((r) => setTimeout(r, 200));
      await speakAudio(`Outstanding! You scored ${score} out of 5!`, 'en-IN', 0.9);
    } else {
      await speakAudio(`शाबाश प्रयास! आपने पाँच में से ${score} अंक प्राप्त किए हैं। आइए फिर से अभ्यास करें!`, 'hi-IN');
      await new Promise((r) => setTimeout(r, 200));
      await speakAudio(`Good job! You scored ${score} out of 5. Let's practice again!`, 'en-IN', 0.9);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setCurrentRound(1);
    setIsGameOver(false);
    generateQuestion(1);
  };

  useEffect(() => {
    handleRestart();
  }, [tier]);

  const handleSelect = async (num: number) => {
    if (isCountingAnimation || isCorrect || isGameOver) return;

    setSelectedNum(num);
    const itemName = num === 1 ? activeItem.name : activeItem.plural;

    if (num === targetCount) {
      setIsCorrect(true);
      const newScore = score + 1;
      setScore(newScore);
      setStreak((prev) => prev + 1);
      playSuccessChime();

      // Hindi Praise
      await speakAudio(`शाबाश! ${NUMBER_MAP[num].hindiWord} ${activeItem.hindi}!`, 'hi-IN');
      await new Promise((r) => setTimeout(r, 150));
      
      // Dual-Language English Reinforcement
      await speakAudio(`Great! ${NUMBER_MAP[num].engWord} ${itemName}!`, 'en-IN', 0.9);

      setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          triggerGameOver();
        } else {
          const nextR = currentRound + 1;
          setCurrentRound(nextR);
          generateQuestion(nextR);
        }
      }, 1200);
    } else {
      setIsCorrect(false);
      setStreak(0);
      setIsCountingAnimation(true);

      await speakAudio(`आइए मिलकर गिनते हैं...`, 'hi-IN');

      // Sequential Counting Animation
      for (let i = 1; i <= targetCount; i++) {
        setCountingIndex(i - 1);
        await speakAudio(NUMBER_MAP[i].hindiWord, 'hi-IN', 0.9);
        await new Promise((r) => setTimeout(r, 250));
      }

      setCountingIndex(-1);
      
      // Hindi Final Count
      await speakAudio(`यहाँ कुल ${NUMBER_MAP[targetCount].hindiWord} ${activeItem.hindi} हैं।`, 'hi-IN');
      await new Promise((r) => setTimeout(r, 200));
      
      // English Final Count Reinforcement
      await speakAudio(`There are ${NUMBER_MAP[targetCount].engWord} ${itemName}.`, 'en-IN', 0.9);

      setIsCountingAnimation(false);

      setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          triggerGameOver();
        } else {
          const nextR = currentRound + 1;
          setCurrentRound(nextR);
          generateQuestion(nextR);
        }
      }, 800);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans select-none">
      {/* Top Header & Turn Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔢</span>
            <h1 className="text-xl md:text-2xl font-black text-amber-950">गिनती मिलाओ (Counting Match)</h1>
          </div>
          <p className="text-xs md:text-sm font-semibold text-amber-800">
            चित्रों को गिनें और सही संख्या चुनें • Count &amp; Match
          </p>
        </div>

        {/* Turn Progress Pills */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-amber-300">
          <span className="text-xs font-black text-amber-900 mr-1">राउंड:</span>
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i + 1 === currentRound && !isGameOver
                  ? 'bg-amber-600 ring-2 ring-amber-300 scale-110'
                  : i + 1 < currentRound || isGameOver
                  ? 'bg-emerald-500'
                  : 'bg-slate-200'
              }`}
            />
          ))}
          <span className="text-xs font-extrabold text-amber-800 ml-1">
            {Math.min(currentRound, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
          </span>
        </div>

        {/* Tier Switcher */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-amber-300">
          <button
            onClick={() => setTier(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tier === 1 ? 'bg-amber-600 text-white shadow' : 'text-amber-900 hover:bg-amber-50'
            }`}
          >
            Tier 1 (१–५)
          </button>
          <button
            onClick={() => setTier(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tier === 2 ? 'bg-amber-600 text-white shadow' : 'text-amber-900 hover:bg-amber-50'
            }`}
          >
            Tier 2 (१–१०)
          </button>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-lg text-xs font-black">
            <Award className="w-4 h-4 text-amber-600" /> सही: {score}/{TOTAL_ROUNDS}
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2.5 py-1 rounded-lg text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" /> {streak} लगातार!
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-amber-200 shadow-xl flex flex-col items-center min-h-[460px] justify-center">
        {isGameOver ? (
          /* End-of-Game Feedback Card */
          <div className="w-full max-w-md bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-3xl border-2 border-amber-300 p-8 text-center flex flex-col items-center shadow-lg">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-600 shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-amber-950 mb-1">खेल संपन्न! (Game Complete)</h2>
            <p className="text-sm font-bold text-amber-800 mb-5">
              {score === 5
                ? '🌟 Excellent! All answers correct!'
                : score >= 3
                ? '👏 Great effort! बहुत बढ़िया प्रयास!'
                : '💪 Keep practicing! अभ्यास जारी रखें!'}
            </p>

            {/* Stars Earned */}
            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-7 h-7 ${
                    idx < score ? 'text-amber-500 fill-amber-400 drop-shadow' : 'text-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Score Summary Box */}
            <div className="w-full bg-white rounded-2xl p-4 border border-amber-200 mb-6 flex justify-around">
              <div>
                <span className="block text-xs font-bold text-slate-500">कुल राउंड</span>
                <span className="text-xl font-black text-slate-800">5</span>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <span className="block text-xs font-bold text-slate-500">सही उत्तर</span>
                <span className="text-xl font-black text-emerald-600">{score}</span>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <span className="block text-xs font-bold text-slate-500">सटीकता (Accuracy)</span>
                <span className="text-xl font-black text-amber-600">{(score / 5) * 100}%</span>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> पुनः खेलें (Play Again)
            </button>
          </div>
        ) : (
          /* Active Round Screen */
          <>
            <button
              onClick={() => speakAudio(`चित्रों को गिनें: यहाँ कितने ${activeItem.hindi} हैं? How many ${activeItem.plural}?`, 'hi-IN')}
              className="flex items-center gap-2 bg-amber-100/70 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-full text-xs md:text-sm mb-6 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-700" /> प्रश्न सुनें (Audio Prompt)
            </button>

            {/* Object Cluster Box */}
            <div className="w-full min-h-[220px] bg-gradient-to-b from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-dashed border-amber-200 p-6 mb-8 flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {Array.from({ length: targetCount }).map((_, idx) => {
                const isHighlight = countingIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
                      isCorrect
                        ? 'animate-bounce scale-110'
                        : isHighlight
                        ? 'scale-125 bg-amber-200 border-2 border-amber-500 shadow-lg'
                        : 'hover:scale-105'
                    }`}
                  >
                    <span className="text-5xl md:text-6xl filter drop-shadow-md select-none">{activeItem.emoji}</span>
                    {isHighlight && (
                      <span className="absolute -top-3 bg-amber-600 text-white text-xs font-black px-2 py-0.5 rounded-full shadow">
                        {NUMBER_MAP[idx + 1].hindiWord} / {NUMBER_MAP[idx + 1].engWord}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Interactive Numeral Selection Buttons */}
            <div className="w-full max-w-lg">
              <p className="text-center text-xs md:text-sm font-bold text-slate-500 mb-3">
                सही संख्या का चयन करें (Choose the correct numeral):
              </p>
              <div className="grid grid-cols-3 gap-4">
                {options.map((num) => {
                  const isSelected = selectedNum === num;
                  const isRight = isSelected && isCorrect === true;
                  const isWrong = isSelected && isCorrect === false;

                  return (
                    <button
                      key={num}
                      disabled={isCountingAnimation || isCorrect === true}
                      onClick={() => handleSelect(num)}
                      className={`relative py-4 md:py-6 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                        isRight
                          ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-emerald-200'
                          : isWrong
                          ? 'bg-amber-100 border-amber-400 text-amber-900'
                          : 'bg-amber-50/50 hover:bg-amber-100 border-amber-200 text-slate-800 hover:border-amber-400 hover:scale-102 active:scale-95'
                      }`}
                    >
                      <span className="text-3xl md:text-4xl font-black">{num}</span>
                      <span
                        className={`text-xs md:text-sm font-extrabold mt-1 ${
                          isRight ? 'text-emerald-100' : 'text-amber-800'
                        }`}
                      >
                        {NUMBER_MAP[num].hindiNum} • {NUMBER_MAP[num].engWord}
                      </span>
                      {isRight && <CheckCircle2 className="w-5 h-5 text-white absolute top-2 right-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}