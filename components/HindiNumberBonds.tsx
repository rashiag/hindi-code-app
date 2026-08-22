'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Award, CheckCircle2, Trophy, Star, Sparkles, Plus } from 'lucide-react';

const HINDI_DIGITS: { [key: number]: { hi: string; word: string; eng: string } } = {
  0: { hi: '०', word: 'शून्य', eng: 'Zero' },
  1: { hi: '१', word: 'एक', eng: 'One' },
  2: { hi: '२', word: 'दो', eng: 'Two' },
  3: { hi: '३', word: 'तीन', eng: 'Three' },
  4: { hi: '४', word: 'चार', eng: 'Four' },
  5: { hi: '५', word: 'पाँच', eng: 'Five' },
  6: { hi: '६', word: 'छह', eng: 'Six' },
  7: { hi: '७', word: 'सात', eng: 'Seven' },
  8: { hi: '८', word: 'आठ', eng: 'Eight' },
  9: { hi: '९', word: 'नौ', eng: 'Nine' },
  10: { hi: '१०', word: 'दस', eng: 'Ten' }
};

const TOTAL_ROUNDS = 5;

export function HindiNumberBonds() {
  const [targetSum, setTargetSum] = useState<5 | 10>(10); // Mode: 5-Frame or 10-Frame
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [baseCount, setBaseCount] = useState<number>(3);
  const [addedCount, setAddedCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const missingNeeded = targetSum - baseCount;

  const clearActiveTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearActiveTimeout();
  }, []);

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
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  const speakAudio = (text: string, lang: 'hi-IN' | 'en-IN' = 'hi-IN', rate: number = 0.85): Promise<void> => {
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

  const generateRound = (sumTarget: 5 | 10) => {
    const minBase = 1;
    const maxBase = sumTarget - 1;
    const base = Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase;
    setBaseCount(base);
    setAddedCount(0);
    setFeedbackState('idle');
    setIsEvaluating(false);
  };

  const startNewGame = (target: 5 | 10 = targetSum) => {
    clearActiveTimeout();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setScore(0);
    setCurrentRound(1);
    setIsGameOver(false);
    setFinalScore(0);
    generateRound(target);
  };

  useEffect(() => {
    startNewGame(targetSum);
  }, [targetSum]);

  const handleModeSwitch = (newTarget: 5 | 10) => {
    if (targetSum === newTarget) return;
    setTargetSum(newTarget);
  };

  const addCounter = () => {
    if (isEvaluating || isGameOver) return;
    if (baseCount + addedCount < targetSum) {
      setAddedCount((prev) => prev + 1);
    }
  };

  const removeCounter = () => {
    if (isEvaluating || isGameOver) return;
    if (addedCount > 0) {
      setAddedCount((prev) => prev - 1);
    }
  };

  const handleGameOver = async (achievedScore: number) => {
    setIsGameOver(true);
    setFinalScore(achievedScore);
    setIsEvaluating(false);

    if (achievedScore >= 4) {
      await speakAudio(`शानदार! आपने पाँच में से ${achievedScore} अंक प्राप्त किए हैं!`, 'hi-IN');
      await new Promise((r) => setTimeout(r, 200));
      await speakAudio(`Terrific! You scored ${achievedScore} out of 5!`, 'en-IN', 0.9);
    } else {
      await speakAudio(`अच्छा प्रयास! आपने पाँच में से ${achievedScore} अंक प्राप्त किए।`, 'hi-IN');
      await new Promise((r) => setTimeout(r, 200));
      await speakAudio(`Good effort! You scored ${achievedScore} out of 5.`, 'en-IN', 0.9);
    }
  };

  const handleCheckAnswer = async () => {
    if (isEvaluating || isGameOver) return;
    setIsEvaluating(true);

    const isCorrect = addedCount === missingNeeded;

    if (isCorrect) {
      setFeedbackState('correct');
      const nextScore = score + 1;
      setScore(nextScore);
      playSuccessChime();

      await speakAudio(
        `शाबाश! ${HINDI_DIGITS[baseCount].word} और ${HINDI_DIGITS[addedCount].word} मिलकर बनते हैं ${HINDI_DIGITS[targetSum].word}!`,
        'hi-IN'
      );
      await new Promise((r) => setTimeout(r, 150));
      await speakAudio(
        `Great! ${HINDI_DIGITS[baseCount].eng} plus ${HINDI_DIGITS[addedCount].eng} equals ${HINDI_DIGITS[targetSum].eng}!`,
        'en-IN',
        0.9
      );

      timeoutRef.current = setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          handleGameOver(nextScore);
        } else {
          setCurrentRound((prev) => prev + 1);
          generateRound(targetSum);
        }
      }, 1200);

    } else {
      setFeedbackState('wrong');

      await speakAudio(
        `यहाँ ${HINDI_DIGITS[targetSum].word} बनाने के लिए ${HINDI_DIGITS[missingNeeded].word} और मनकों की आवश्यकता है।`,
        'hi-IN'
      );
      await new Promise((r) => setTimeout(r, 150));
      await speakAudio(
        `We need ${HINDI_DIGITS[missingNeeded].eng} more counters to make ${HINDI_DIGITS[targetSum].eng}.`,
        'en-IN',
        0.9
      );

      timeoutRef.current = setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          handleGameOver(score);
        } else {
          setCurrentRound((prev) => prev + 1);
          generateRound(targetSum);
        }
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans select-none">
      {/* Top Header & Turn Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h1 className="text-xl md:text-2xl font-black text-amber-950">अंक जोड़ (Number Bonds Lab)</h1>
          </div>
          <p className="text-xs md:text-sm font-semibold text-amber-800">
            टेन-फ्रेम में मनके जोड़कर {targetSum} पूरा करें • Complete the {targetSum}-Frame
          </p>
        </div>

        {/* Turn Progress Pills */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-sm">
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

        {/* 5-Frame / 10-Frame Switcher */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-amber-300 shadow-sm">
          <button
            onClick={() => handleModeSwitch(5)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              targetSum === 5 ? 'bg-amber-600 text-white shadow' : 'text-amber-900 hover:bg-amber-50'
            }`}
          >
            ५ का जोड़ (5-Frame)
          </button>
          <button
            onClick={() => handleModeSwitch(10)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              targetSum === 10 ? 'bg-amber-600 text-white shadow' : 'text-amber-900 hover:bg-amber-50'
            }`}
          >
            १० का जोड़ (10-Frame)
          </button>
        </div>

        {/* Score Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-black border border-amber-200">
            <Award className="w-4 h-4 text-amber-600" /> सही: {score}/{TOTAL_ROUNDS}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-amber-200 shadow-xl flex flex-col items-center min-h-[460px] justify-center">
        {isGameOver ? (
          /* End Game Modal */
          <div className="w-full max-w-md bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-3xl border-2 border-amber-300 p-8 text-center flex flex-col items-center shadow-lg animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-600 shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-amber-950 mb-1">खेल संपन्न! (Game Complete)</h2>
            <p className="text-sm font-bold text-amber-800 mb-5">
              {finalScore === 5
                ? '🌟 Brilliant! All equations balanced!'
                : finalScore >= 3
                ? '👏 Great math work! बहुत बढ़िया!'
                : '💪 Keep exploring! अभ्यास करते रहें!'}
            </p>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: TOTAL_ROUNDS }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-7 h-7 ${
                    idx < finalScore
                      ? 'text-amber-500 fill-amber-400 drop-shadow'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              ))}
            </div>

            {/* Score Summary */}
            <div className="w-full bg-white rounded-2xl p-4 border border-amber-200 mb-6 flex justify-around shadow-sm">
              <div>
                <span className="block text-xs font-bold text-slate-500">कुल राउंड</span>
                <span className="text-xl font-black text-slate-800">{TOTAL_ROUNDS}</span>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <span className="block text-xs font-bold text-slate-500">सही उत्तर</span>
                <span className="text-xl font-black text-emerald-600">{finalScore}</span>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <span className="block text-xs font-bold text-slate-500">सटीकता</span>
                <span className="text-xl font-black text-amber-600">
                  {Math.round((finalScore / TOTAL_ROUNDS) * 100)}%
                </span>
              </div>
            </div>

            <button
              onClick={() => startNewGame(targetSum)}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> पुनः खेलें (Play Again)
            </button>
          </div>
        ) : (
          /* Active Gameplay Screen */
          <>
            {/* Audio Prompt */}
            <button
              onClick={() =>
                speakAudio(
                  `${HINDI_DIGITS[baseCount].word} में कितने और जोड़ें कि ${HINDI_DIGITS[targetSum].word} बन जाए? How many more to make ${HINDI_DIGITS[targetSum].eng}?`,
                  'hi-IN'
                )
              }
              className="flex items-center gap-2 bg-amber-100/70 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-full text-xs md:text-sm mb-6 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-700" /> प्रश्न सुनें (Audio Prompt)
            </button>

            {/* Visual Number Bond Equation Bar */}
            <div className="flex items-center justify-center gap-2 md:gap-4 bg-amber-50/60 border border-amber-200 px-6 py-3 rounded-2xl mb-8">
              <div className="flex items-center gap-1.5 bg-blue-100 text-blue-900 px-4 py-2 rounded-xl font-black text-xl md:text-2xl border border-blue-300">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block" />
                <span>{baseCount}</span>
                <span className="text-xs text-blue-700 font-bold">({HINDI_DIGITS[baseCount].hi})</span>
              </div>

              <span className="text-2xl font-black text-amber-800">+</span>

              <div
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xl md:text-2xl border transition-all ${
                  feedbackState === 'correct'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 scale-105'
                    : feedbackState === 'wrong'
                    ? 'bg-rose-100 text-rose-900 border-rose-400'
                    : 'bg-amber-100 text-amber-950 border-amber-300'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block" />
                <span>{addedCount}</span>
                <span className="text-xs text-amber-800 font-bold">({HINDI_DIGITS[addedCount].hi})</span>
              </div>

              <span className="text-2xl font-black text-amber-800">=</span>

              <div className="bg-amber-600 text-white px-4 py-2 rounded-xl font-black text-xl md:text-2xl shadow-sm">
                <span>{targetSum}</span>
                <span className="text-xs text-amber-100 font-bold ml-1">({HINDI_DIGITS[targetSum].hi})</span>
              </div>
            </div>

            {/* Ten-Frame Grid Display (2 rows x 5 columns) */}
            <div
              className={`grid gap-2 md:gap-3 p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl mb-8 shadow-inner ${
                targetSum === 5 ? 'grid-cols-5' : 'grid-cols-5'
              }`}
            >
              {Array.from({ length: targetSum }).map((_, idx) => {
                const isBase = idx < baseCount;
                const isAdded = idx >= baseCount && idx < baseCount + addedCount;

                return (
                  <div
                    key={idx}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      isBase
                        ? 'bg-blue-500 border-blue-600 shadow-md scale-95'
                        : isAdded
                        ? 'bg-amber-500 border-amber-600 shadow-md scale-95 animate-in zoom-in-50 duration-150'
                        : 'bg-white border-dashed border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {isBase && <span className="text-2xl filter drop-shadow">🔵</span>}
                    {isAdded && <span className="text-2xl filter drop-shadow">🟡</span>}
                    {!isBase && !isAdded && <span className="text-xs font-bold text-slate-300">{idx + 1}</span>}
                  </div>
                );
              })}
            </div>

            {/* Interactive Bead Tray & Control Buttons */}
            <div className="flex flex-col items-center gap-4 w-full max-w-md">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={addCounter}
                  disabled={isEvaluating || baseCount + addedCount >= targetSum}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> मनका जोड़ें (Add Bead) 🟡
                </button>

                <button
                  onClick={removeCounter}
                  disabled={isEvaluating || addedCount === 0}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-700 font-bold text-sm rounded-xl transition cursor-pointer"
                >
                  हटाएं (Remove)
                </button>
              </div>

              {/* Check Answer Button */}
              <button
                onClick={handleCheckAnswer}
                disabled={isEvaluating}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" /> उत्तर जांचें (Check Answer) ➔
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}