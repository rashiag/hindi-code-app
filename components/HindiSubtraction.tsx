'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Award, Sparkles, CheckCircle2, Trophy, Star, ArrowRight } from 'lucide-react';

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

// Deterministic question pool (0-10) with safe, non-locking options
const QUESTION_POOL = [
  { start: 6, sub: 2, correct: 4, opts: [4, 3, 5] },
  { start: 5, sub: 3, correct: 2, opts: [2, 1, 3] },
  { start: 7, sub: 4, correct: 3, opts: [3, 2, 4] },
  { start: 8, sub: 5, correct: 3, opts: [3, 4, 2] },
  { start: 9, sub: 3, correct: 6, opts: [6, 5, 7] },
  { start: 10, sub: 4, correct: 6, opts: [6, 7, 5] },
  { start: 4, sub: 1, correct: 3, opts: [3, 2, 4] },
  { start: 7, sub: 2, correct: 5, opts: [5, 4, 6] },
  { start: 8, sub: 3, correct: 5, opts: [5, 6, 4] },
  { start: 10, sub: 7, correct: 3, opts: [3, 2, 4] }
];

export function HindiSubtraction() {
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showBeadVisual, setShowBeadVisual] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  const currentQ = QUESTION_POOL[questionIndex % QUESTION_POOL.length];

  const clearTimer = () => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playSpeech = (text: string, lang: 'hi-IN' | 'en-IN' = 'hi-IN') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

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
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  };

  const startNewGame = () => {
    clearTimer();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setScore(0);
    setStreak(0);
    setCurrentRound(1);
    setQuestionIndex(Math.floor(Math.random() * QUESTION_POOL.length));
    setSelectedNum(null);
    setIsCorrect(null);
    setShowBeadVisual(false);
    setIsGameOver(false);
    setFinalScore(0);
    setIsBusy(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleNextQuestion = () => {
    clearTimer();
    if (currentRound >= TOTAL_ROUNDS) {
      setIsGameOver(true);
      setFinalScore(score);
      setIsBusy(false);
    } else {
      setCurrentRound((prev) => prev + 1);
      setQuestionIndex((prev) => (prev + 1) % QUESTION_POOL.length);
      setSelectedNum(null);
      setIsCorrect(null);
      setShowBeadVisual(false);
      setIsBusy(false);
    }
  };

  const handleSelect = (num: number) => {
    if (isBusy || isGameOver || isCorrect !== null) return;
    setIsBusy(true);
    setSelectedNum(num);

    const isAnswerCorrect = num === currentQ.correct;

    if (isAnswerCorrect) {
      setIsCorrect(true);
      const nextScore = score + 1;
      setScore(nextScore);
      setStreak((prev) => prev + 1);
      playSuccessChime();
      playSpeech(`शाबाश! ${NUMBER_MAP[currentQ.start].word} में से ${NUMBER_MAP[currentQ.sub].word} घटाने पर बचते हैं ${NUMBER_MAP[num].word}!`);

      autoAdvanceTimer.current = setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          setIsGameOver(true);
          setFinalScore(nextScore);
          setIsBusy(false);
        } else {
          setCurrentRound((prev) => prev + 1);
          setQuestionIndex((prev) => (prev + 1) % QUESTION_POOL.length);
          setSelectedNum(null);
          setIsCorrect(null);
          setShowBeadVisual(false);
          setIsBusy(false);
        }
      }, 1600);

    } else {
      setIsCorrect(false);
      setStreak(0);
      setShowBeadVisual(true);
      playSpeech(`यहाँ ${NUMBER_MAP[currentQ.start].word} में से ${NUMBER_MAP[currentQ.sub].word} हटाने पर ${NUMBER_MAP[currentQ.correct].word} बचते हैं! ${NUMBER_MAP[currentQ.start].eng} minus ${NUMBER_MAP[currentQ.sub].eng} equals ${NUMBER_MAP[currentQ.correct].eng}!`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans select-none">
      {/* Top Header & Turn Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">➖</span>
            <h1 className="text-xl md:text-2xl font-black text-amber-950">अंक घटाव (Visual Subtraction)</h1>
          </div>
          <p className="text-xs md:text-sm font-semibold text-amber-800">
            घटाने के बाद बची हुई संख्या चुनें • Subtract &amp; Choose Answer
          </p>
        </div>

        {/* Round Progress */}
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
          <div className="w-full max-w-md bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-3xl border-2 border-amber-300 p-8 text-center flex flex-col items-center shadow-lg">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-600 shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-amber-950 mb-1">खेल संपन्न! (Game Complete)</h2>
            <p className="text-sm font-bold text-amber-800 mb-5">
              {finalScore === 5
                ? '🌟 Excellent! All subtractions correct!'
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
                playSpeech(
                  `${NUMBER_MAP[currentQ.start].word} में से ${NUMBER_MAP[currentQ.sub].word} घटाने पर कितने बचेंगे?`
                )
              }
              className="flex items-center gap-2 bg-amber-100/70 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-full text-xs md:text-sm mb-6 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-700" /> प्रश्न सुनें (Audio Prompt)
            </button>

            {/* Subtraction Equation Box */}
            <div className="flex items-center justify-center gap-3 md:gap-5 bg-gradient-to-r from-amber-50 to-orange-50/50 border-2 border-amber-200 px-8 py-5 rounded-3xl mb-6 shadow-sm">
              <div className="flex flex-col items-center bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-md min-w-[70px]">
                <span className="text-3xl md:text-4xl font-black">{currentQ.start}</span>
                <span className="text-[11px] font-bold opacity-90">{NUMBER_MAP[currentQ.start].hi} ({NUMBER_MAP[currentQ.start].word})</span>
              </div>

              <span className="text-3xl md:text-4xl font-black text-amber-900">−</span>

              <div className="flex flex-col items-center bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-md min-w-[70px]">
                <span className="text-3xl md:text-4xl font-black">{currentQ.sub}</span>
                <span className="text-[11px] font-bold opacity-90">{NUMBER_MAP[currentQ.sub].hi} ({NUMBER_MAP[currentQ.sub].word})</span>
              </div>

              <span className="text-3xl md:text-4xl font-black text-amber-900">=</span>

              <div
                className={`flex flex-col items-center justify-center px-5 py-3 rounded-2xl border-2 min-w-[80px] transition-all ${
                  isCorrect === true
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-105'
                    : isCorrect === false
                    ? 'bg-rose-100 border-rose-400 text-rose-900'
                    : 'bg-white border-dashed border-amber-400 text-amber-600'
                }`}
              >
                <span className="text-3xl md:text-4xl font-black">
                  {selectedNum !== null ? selectedNum : '?'}
                </span>
                <span className="text-[11px] font-bold">
                  {selectedNum !== null
                    ? `${NUMBER_MAP[selectedNum].hi} (${NUMBER_MAP[selectedNum].word})`
                    : 'बचे हुए'}
                </span>
              </div>
            </div>

            {/* Bead Removal / Cross-out Visual Explanation on Error */}
            {showBeadVisual && (
              <div className="w-full max-w-md bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 mb-6 flex flex-col items-center animate-in fade-in zoom-in duration-150">
                <span className="text-xs font-black text-amber-900 mb-3 text-center">
                  💡 समझिए: कुल {NUMBER_MAP[currentQ.start].word} मनकों में से {NUMBER_MAP[currentQ.sub].word} हटाने पर बचे = {NUMBER_MAP[currentQ.correct].word} मनके
                </span>
                
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4 bg-white px-4 py-3 rounded-xl border border-amber-200">
                  {/* Remaining Beads */}
                  {Array.from({ length: currentQ.correct }).map((_, i) => (
                    <div key={`rem-${i}`} className="flex flex-col items-center">
                      <span className="text-3xl filter drop-shadow">🔵</span>
                    </div>
                  ))}
                  {/* Subtracted / Crossed Out Beads */}
                  {Array.from({ length: currentQ.sub }).map((_, i) => (
                    <div key={`sub-${i}`} className="relative flex flex-col items-center opacity-40">
                      <span className="text-3xl">🔵</span>
                      <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-rose-600">✕</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>आगे बढ़ें (Next Question)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Numeral Options */}
            {!showBeadVisual && (
              <div className="w-full max-w-lg">
                <p className="text-center text-xs md:text-sm font-bold text-slate-500 mb-3">
                  घटाने के बाद सही संख्या चुनें (Choose remaining count):
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {currentQ.opts.map((num) => {
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
                            ? 'bg-rose-100 border-rose-400 text-rose-900'
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
            )}
          </>
        )}
      </div>
    </div>
  );
}