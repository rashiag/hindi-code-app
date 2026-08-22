'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Award, Sparkles, CheckCircle2, Trophy, Star } from 'lucide-react';

const NUMBER_MAP: { [key: number]: { hi: string; word: string; eng: string } } = {
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
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [baseNum, setBaseNum] = useState<number>(2);
  const [targetSum, setTargetSum] = useState<number>(5);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showBeadVisual, setShowBeadVisual] = useState<boolean>(false);
  const [animatedBeadCount, setAnimatedBeadCount] = useState<number>(0);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const missingCorrect = targetSum - baseNum;

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
      console.log('Audio error:', e);
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

  const generateQuestion = () => {
    // Generate dynamic target sum between 4 and 10
    const sum = Math.floor(Math.random() * 7) + 4; // 4 to 10
    const base = Math.floor(Math.random() * (sum - 2)) + 1; // 1 to sum-2
    const correct = sum - base;

    // Safe option generation without while-loop freeze
    const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      (n) => n !== correct && n < 10
    );
    candidates.sort(() => Math.random() - 0.5);

    const generatedOpts = [correct, candidates[0], candidates[1]].sort(
      () => Math.random() - 0.5
    );

    setTargetSum(sum);
    setBaseNum(base);
    setOptions(generatedOpts);
    setSelectedNum(null);
    setIsCorrect(null);
    setShowBeadVisual(false);
    setAnimatedBeadCount(0);
    setIsBusy(false);
  };

  const startNewGame = () => {
    clearActiveTimeout();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setScore(0);
    setStreak(0);
    setCurrentRound(1);
    setIsGameOver(false);
    setFinalScore(0);
    generateQuestion();
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleGameOver = async (achievedScore: number) => {
    setIsGameOver(true);
    setFinalScore(achievedScore);
    setIsBusy(false);

    if (achievedScore >= 4) {
      await speakAudio(`शानदार प्रदर्शन! आपने पाँच में से ${achievedScore} अंक प्राप्त किए हैं!`, 'hi-IN');
      await new Promise((r) => setTimeout(r, 200));
      await speakAudio(`Outstanding! You scored ${achievedScore} out of 5!`, 'en-IN', 0.9);
    } else {
      await speakAudio(`शाबाश प्रयास! आपने पाँच में से ${achievedScore} अंक प्राप्त किए।`, 'hi-IN');
      await new Promise((r) => setTimeout(r, 200));
      await speakAudio(`Good job! You scored ${achievedScore} out of 5. Keep practicing!`, 'en-IN', 0.9);
    }
  };

  const handleSelect = async (num: number) => {
    if (isBusy || isGameOver || isCorrect !== null) return;
    setIsBusy(true);
    setSelectedNum(num);

    const isAnswerCorrect = num === missingCorrect;

    if (isAnswerCorrect) {
      setIsCorrect(true);
      const nextScore = score + 1;
      setScore(nextScore);
      setStreak((prev) => prev + 1);
      playSuccessChime();

      await speakAudio(
        `शाबाश! ${NUMBER_MAP[baseNum].word} और ${NUMBER_MAP[num].word} मिलकर बनते हैं ${NUMBER_MAP[targetSum].word}!`,
        'hi-IN'
      );
      await new Promise((r) => setTimeout(r, 120));
      await speakAudio(
        `Great! ${NUMBER_MAP[baseNum].eng} plus ${NUMBER_MAP[num].eng} equals ${NUMBER_MAP[targetSum].eng}!`,
        'en-IN',
        0.9
      );

      timeoutRef.current = setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          handleGameOver(nextScore);
        } else {
          setCurrentRound((prev) => prev + 1);
          generateQuestion();
        }
      }, 1000);

    } else {
      setIsCorrect(false);
      setStreak(0);
      setShowBeadVisual(true);

      await speakAudio(
        `आइए देखें: ${NUMBER_MAP[baseNum].word} में कितने जोड़ने पर ${NUMBER_MAP[targetSum].word} बनेगा?`,
        'hi-IN'
      );

      for (let i = 1; i <= missingCorrect; i++) {
        setAnimatedBeadCount(i);
        await speakAudio(NUMBER_MAP[i].word, 'hi-IN', 0.9);
        await new Promise((r) => setTimeout(r, 200));
      }

      await speakAudio(
        `यहाँ हमें ${NUMBER_MAP[missingCorrect].word} और मनके चाहिए! ${NUMBER_MAP[baseNum].eng} plus ${NUMBER_MAP[missingCorrect].eng} equals ${NUMBER_MAP[targetSum].eng}!`,
        'hi-IN'
      );

      timeoutRef.current = setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          handleGameOver(score);
        } else {
          setCurrentRound((prev) => prev + 1);
          generateQuestion();
        }
      }, 1200);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans select-none">
      {/* Top Header & Turn Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h1 className="text-xl md:text-2xl font-black text-amber-950">अंक जोड़ (Missing Number Bond)</h1>
          </div>
          <p className="text-xs md:text-sm font-semibold text-amber-800">
            समीकरण को पूरा करने के लिए सही संख्या चुनें • Complete the equation
          </p>
        </div>

        {/* Round Indicators */}
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

        {/* Live Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-black border border-amber-200">
            <Award className="w-4 h-4 text-amber-600" /> सही: {score}/{TOTAL_ROUNDS}
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" /> {streak} लगातार!
            </div>
          )}
        </div>
      </div>

      {/* Main Play Area */}
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
                ? '🌟 Excellent! All equations solved!'
                : finalScore >= 3
                ? '👏 Great math skills! बहुत बढ़िया!'
                : '💪 Keep practicing! अभ्यास जारी रखें!'}
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
                <span className="block text-xs font-bold text-slate-500">कुल प्रश्न</span>
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
              onClick={startNewGame}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> पुनः खेलें (Play Again)
            </button>
          </div>
        ) : (
          /* Active Gameplay Screen */
          <>
            {/* Audio Prompt Button */}
            <button
              onClick={() =>
                speakAudio(
                  `${NUMBER_MAP[baseNum].word} में कितना जोड़ें कि ${NUMBER_MAP[targetSum].word} बन जाए? ${NUMBER_MAP[baseNum].eng} plus what equals ${NUMBER_MAP[targetSum].eng}?`,
                  'hi-IN'
                )
              }
              className="flex items-center gap-2 bg-amber-100/70 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-full text-xs md:text-sm mb-6 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-700" /> प्रश्न सुनें (Audio Prompt)
            </button>

            {/* Equation Display Box */}
            <div className="flex items-center justify-center gap-3 md:gap-5 bg-gradient-to-r from-amber-50 to-orange-50/50 border-2 border-amber-200 px-8 py-5 rounded-3xl mb-8 shadow-sm">
              <div className="flex flex-col items-center bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-md min-w-[70px]">
                <span className="text-3xl md:text-4xl font-black">{baseNum}</span>
                <span className="text-[11px] font-bold opacity-90">{NUMBER_MAP[baseNum].hi} ({NUMBER_MAP[baseNum].word})</span>
              </div>

              <span className="text-3xl md:text-4xl font-black text-amber-900">+</span>

              <div
                className={`flex flex-col items-center justify-center px-5 py-3 rounded-2xl border-2 min-w-[80px] transition-all ${
                  isCorrect === true
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-105'
                    : isCorrect === false
                    ? 'bg-amber-100 border-amber-400 text-amber-900'
                    : 'bg-white border-dashed border-amber-400 text-amber-600'
                }`}
              >
                <span className="text-3xl md:text-4xl font-black">
                  {selectedNum !== null ? selectedNum : '?'}
                </span>
                <span className="text-[11px] font-bold">
                  {selectedNum !== null
                    ? `${NUMBER_MAP[selectedNum].hi} (${NUMBER_MAP[selectedNum].word})`
                    : 'खाली स्थान'}
                </span>
              </div>

              <span className="text-3xl md:text-4xl font-black text-amber-900">=</span>

              <div className="flex flex-col items-center bg-amber-700 text-white px-5 py-3 rounded-2xl shadow-md min-w-[70px]">
                <span className="text-3xl md:text-4xl font-black">{targetSum}</span>
                <span className="text-[11px] font-bold opacity-90">{NUMBER_MAP[targetSum].hi} ({NUMBER_MAP[targetSum].word})</span>
              </div>
            </div>

            {/* Visual Bead Clarification on Incorrect Choice */}
            {showBeadVisual && (
              <div className="w-full max-w-md bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 mb-6 flex flex-col items-center animate-in fade-in zoom-in duration-150">
                <span className="text-xs font-black text-amber-900 mb-2">मनके जोड़कर देखें (Visual Clarification):</span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: baseNum }).map((_, i) => (
                    <span key={`b-${i}`} className="text-3xl filter drop-shadow">🔵</span>
                  ))}
                  <span className="text-xl font-black text-amber-800 mx-1">+</span>
                  {Array.from({ length: missingCorrect }).map((_, i) => (
                    <span
                      key={`a-${i}`}
                      className={`text-3xl filter drop-shadow transition-all ${
                        i < animatedBeadCount ? 'scale-110 opacity-100' : 'scale-75 opacity-30'
                      }`}
                    >
                      🟡
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Numeral Selection Buttons */}
            <div className="w-full max-w-lg">
              <p className="text-center text-xs md:text-sm font-bold text-slate-500 mb-3">
                समीकरण पूरा करने के लिए सही संख्या चुनें (Choose missing number):
              </p>
              <div className="grid grid-cols-3 gap-4">
                {options.map((num) => {
                  const isSelected = selectedNum === num;
                  const isRight = isSelected && isCorrect === true;
                  const isWrong = isSelected && isCorrect === false;

                  return (
                    <button
                      key={num}
                      disabled={isBusy}
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
                        {NUMBER_MAP[num].hi} • {NUMBER_MAP[num].eng}
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