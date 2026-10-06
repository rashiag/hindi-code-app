'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, RotateCcw, Trophy, CheckCircle2, XCircle, 
  Sparkles, Star, ArrowRight, Plus, Minus, Hash, Layers
} from 'lucide-react';

type MathMode = 'counting' | 'tenframe' | 'addition' | 'subtraction';

const STRINGS = {
  hi: {
    bannerTitle: "गणित वाटिका (Early Numeracy & Maths)",
    bannerSub: "चित्रों से गिनती • टेन-फ्रेम • जोड़ व घटाना (NEP 2020 Foundational)",
    tabCounting: "🔢 1. गिनती (Count)",
    tabTenFrame: "🧮 2. टेन-फ्रेम (Ten-Frame)",
    tabAddition: "➕ 3. जोड़ (Addition)",
    tabSubtraction: "➖ 4. घटाना (Subtract)",
    scoreLabel: "स्कोर",
    roundLabel: "सवाल",
    submitBtn: "जाँचें (Check)",
    nextBtn: "अगला सवाल ➔",
    playAgainBtn: "दोबारा खेलें",
    completedTitle: "शाबाश! राउंड पूरा हुआ",
    reportTitle: "गणित दक्षता रिपोर्ट कार्ड",
    accuracyLabel: "सटीकता",
    correctChime: "शाबाश! बिल्कुल सही उत्तर!",
    wrongChime: "गलत उत्तर, ध्यान से गिनें!",
    countingPrompt: (num: number, item: string) => `गिनकर बताओ: यहाँ कितने ${item} हैं?`,
    additionPrompt: (a: number, b: number) => `${a} और ${b} मिलकर कितने होते हैं?`,
    subtractionPrompt: (a: number, b: number) => `${a} में से ${b} घटाने पर क्या बचेगा?`,
  },
  en: {
    bannerTitle: "Early Numeracy & Math Playground",
    bannerSub: "Visual Counting • Ten-Frames • Addition & Subtraction (NEP 2020)",
    tabCounting: "🔢 1. Counting",
    tabTenFrame: "🧮 2. Ten-Frame",
    tabAddition: "➕ 3. Addition",
    tabSubtraction: "➖ 4. Subtraction",
    scoreLabel: "Score",
    roundLabel: "Question",
    submitBtn: "Check Answer",
    nextBtn: "Next Question ➔",
    playAgainBtn: "Play Again",
    completedTitle: "Well Done! Round Complete",
    reportTitle: "Foundational Numeracy Report Card",
    accuracyLabel: "Accuracy",
    correctChime: "Great job! That is correct!",
    wrongChime: "Try again! Count carefully.",
    countingPrompt: (num: number, item: string) => `Count and tell: How many ${item} are here?`,
    additionPrompt: (a: number, b: number) => `How much is ${a} plus ${b}?`,
    subtractionPrompt: (a: number, b: number) => `How much is ${a} minus ${b}?`,
  }
};

const COUNTING_ITEMS = [
  { nameHi: 'सेब', nameEn: 'apples', emoji: '🍎' },
  { nameHi: 'तारे', nameEn: 'stars', emoji: '⭐' },
  { nameHi: 'केले', nameEn: 'bananas', emoji: '🍌' },
  { nameHi: 'गुब्बारे', nameEn: 'balloons', emoji: '🎈' },
  { nameHi: 'कारें', nameEn: 'cars', emoji: '🚗' },
];

export function HindiMathStudio() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [mode, setMode] = useState<MathMode>('counting');
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Question parameters
  const [countTarget, setCountTarget] = useState(4);
  const [activeItem, setActiveItem] = useState(COUNTING_ITEMS[0]);
  const [numA, setNumA] = useState(3);
  const [numB, setNumB] = useState(2);
  const [userSelected, setUserSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [tenFrameCount, setTenFrameCount] = useState(4);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const t = STRINGS[lang];

  const truncateAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const playSoundEffect = (type: 'correct' | 'wrong' | 'victory') => {
    if (typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      if (type === 'correct') {
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.24, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.3);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      } else {
        [261.63, 329.63, 392.0, 523.25].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.25, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + 1.1);
        });
      }
    } catch (e) {}
  };

  const speakAudio = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      u.rate = 0.88;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  const generateNewQuestion = () => {
    truncateAudio();
    setUserSelected(null);
    setFeedback(null);

    const randomItem = COUNTING_ITEMS[Math.floor(Math.random() * COUNTING_ITEMS.length)];
    setActiveItem(randomItem);

    if (mode === 'counting') {
      const target = Math.floor(Math.random() * 8) + 2; // 2 to 9
      setCountTarget(target);
      setTimeout(() => {
        speakAudio(t.countingPrompt(target, lang === 'hi' ? randomItem.nameHi : randomItem.nameEn));
      }, 150);
    } else if (mode === 'tenframe') {
      const target = Math.floor(Math.random() * 10) + 1; // 1 to 10
      setTenFrameCount(target);
      setTimeout(() => {
        speakAudio(lang === 'hi' ? `टेन-फ्रेम में ${target} बिंदु गिनें!` : `Count the ${target} dots in the ten-frame!`);
      }, 150);
    } else if (mode === 'addition') {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 4) + 1;
      setNumA(a);
      setNumB(b);
      setTimeout(() => {
        speakAudio(t.additionPrompt(a, b));
      }, 150);
    } else {
      const a = Math.floor(Math.random() * 5) + 4; // 4 to 8
      const b = Math.floor(Math.random() * (a - 1)) + 1; // 1 to a-1
      setNumA(a);
      setNumB(b);
      setTimeout(() => {
        speakAudio(t.subtractionPrompt(a, b));
      }, 150);
    }
  };

  const startNewGame = (newMode = mode) => {
    setQIndex(0);
    setScore(0);
    setIsGameOver(false);
    setMode(newMode);
    generateNewQuestion();
  };

  useEffect(() => {
    startNewGame(mode);
    return () => truncateAudio();
  }, [mode, lang]);

  const handleSelectOption = (chosen: number) => {
    if (feedback !== null) return;
    setUserSelected(chosen);
    truncateAudio();

    let correctVal = countTarget;
    if (mode === 'tenframe') correctVal = tenFrameCount;
    if (mode === 'addition') correctVal = numA + numB;
    if (mode === 'subtraction') correctVal = numA - numB;

    const isRight = chosen === correctVal;

    if (isRight) {
      playSoundEffect('correct');
      setScore(prev => prev + 1);
      setFeedback({ isCorrect: true, text: t.correctChime });
      speakAudio(t.correctChime);
    } else {
      playSoundEffect('wrong');
      setFeedback({ isCorrect: false, text: `${t.wrongChime} (${correctVal})` });
      speakAudio(lang === 'hi' ? `सही उत्तर है: ${correctVal}` : `The correct answer is: ${correctVal}`);
    }
  };

  const handleNext = () => {
    truncateAudio();
    if (qIndex + 1 >= 5) {
      setIsGameOver(true);
      playSoundEffect('victory');
      speakAudio(lang === 'hi' ? `बधाई! आपने 5 में से ${score} सही किए!` : `Great job! You scored ${score} out of 5!`);
    } else {
      setQIndex(prev => prev + 1);
      generateNewQuestion();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 font-sans select-none">
      
      {/* Top Banner with Bilingual Toggle */}
      <div className="bg-amber-50/80 p-4 md:p-5 rounded-3xl border border-amber-200 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔢</span>
            <h1 className="text-xl md:text-2xl font-black text-amber-950">
              {t.bannerTitle}
            </h1>
          </div>
          <p className="text-xs md:text-sm font-semibold text-amber-800">
            {t.bannerSub}
          </p>
        </div>

        {/* Controls: Language Toggle & Live Score */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-white p-1 rounded-xl border border-amber-300 shadow-sm gap-1">
            <button
              onClick={() => {
                truncateAudio();
                setLang('hi');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'hi' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-950 hover:bg-amber-100'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => {
                truncateAudio();
                setLang('en');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'en' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-950 hover:bg-amber-100'
              }`}
            >
              English
            </button>
          </div>

          <div className="bg-amber-100 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-black">
            {t.scoreLabel}: {score} / 5
          </div>
        </div>

        {/* 4 Mode Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-2">
          <button
            onClick={() => setMode('counting')}
            className={`py-2 px-3 rounded-xl text-xs font-black cursor-pointer transition ${
              mode === 'counting' ? 'bg-amber-600 text-white shadow-md' : 'bg-white hover:bg-amber-100/70 border border-amber-200 text-amber-900'
            }`}
          >
            {t.tabCounting}
          </button>
          <button
            onClick={() => setMode('tenframe')}
            className={`py-2 px-3 rounded-xl text-xs font-black cursor-pointer transition ${
              mode === 'tenframe' ? 'bg-amber-600 text-white shadow-md' : 'bg-white hover:bg-amber-100/70 border border-amber-200 text-amber-900'
            }`}
          >
            {t.tabTenFrame}
          </button>
          <button
            onClick={() => setMode('addition')}
            className={`py-2 px-3 rounded-xl text-xs font-black cursor-pointer transition ${
              mode === 'addition' ? 'bg-amber-600 text-white shadow-md' : 'bg-white hover:bg-amber-100/70 border border-amber-200 text-amber-900'
            }`}
          >
            {t.tabAddition}
          </button>
          <button
            onClick={() => setMode('subtraction')}
            className={`py-2 px-3 rounded-xl text-xs font-black cursor-pointer transition ${
              mode === 'subtraction' ? 'bg-amber-600 text-white shadow-md' : 'bg-white hover:bg-amber-100/70 border border-amber-200 text-amber-900'
            }`}
          >
            {t.tabSubtraction}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-xl flex flex-col items-center justify-between min-h-[440px]">
        {!isGameOver ? (
          <div className="w-full flex flex-col items-center text-center">
            
            {/* Round info & Voice replay button */}
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                {t.roundLabel}: {qIndex + 1} / 5
              </span>
              <button
                onClick={() => {
                  truncateAudio();
                  if (mode === 'counting') speakAudio(t.countingPrompt(countTarget, lang === 'hi' ? activeItem.nameHi : activeItem.nameEn));
                  if (mode === 'tenframe') speakAudio(lang === 'hi' ? `टेन-फ्रेम में ${tenFrameCount} बिंदु गिनें!` : `Count the dots!`);
                  if (mode === 'addition') speakAudio(t.additionPrompt(numA, numB));
                  if (mode === 'subtraction') speakAudio(t.subtractionPrompt(numA, numB));
                }}
                className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                <Volume2 className="w-4 h-4" /> {lang === 'hi' ? 'आवाज़ सुनें' : 'Listen'}
              </button>
            </div>

            {/* Visual Canvas Display based on Mode */}
            {mode === 'counting' && (
              <div className="w-full max-w-lg bg-amber-50/60 border-2 border-amber-200 rounded-3xl p-6 mb-6 shadow-inner">
                <span className="text-xs font-bold text-amber-900 block mb-3">
                  {lang === 'hi' ? 'चित्रों को ध्यान से गिनें:' : 'Count the items on screen:'}
                </span>
                <div className="flex flex-wrap justify-center gap-4 py-2">
                  {Array.from({ length: countTarget }).map((_, i) => (
                    <span key={i} className="text-5xl animate-bounce" style={{ animationDelay: `${i * 90}ms` }}>
                      {activeItem.emoji}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {mode === 'tenframe' && (
              <div className="w-full max-w-md bg-amber-50/60 border-2 border-amber-200 rounded-3xl p-5 mb-6 shadow-inner">
                <span className="text-xs font-bold text-amber-900 block mb-3">
                  {lang === 'hi' ? 'टेन-फ्रेम में कितने भरे हुए खाने हैं?' : 'How many filled boxes are in the Ten-Frame?'}
                </span>
                <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto bg-white p-3 rounded-2xl border-2 border-amber-300 shadow-sm">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const isFilled = i < tenFrameCount;
                    return (
                      <div
                        key={i}
                        className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                          isFilled ? 'bg-amber-500 border-amber-600 shadow-sm' : 'bg-slate-50 border-dashed border-slate-300'
                        }`}
                      >
                        {isFilled && <span className="w-6 h-6 rounded-full bg-white shadow-inner" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {mode === 'addition' && (
              <div className="w-full max-w-lg bg-amber-50/60 border-2 border-amber-200 rounded-3xl p-6 mb-6 shadow-inner">
                <div className="flex items-center justify-center gap-4 md:gap-6">
                  {/* First group */}
                  <div className="flex flex-col items-center">
                    <div className="flex flex-wrap justify-center gap-1.5 max-w-[120px] mb-2">
                      {Array.from({ length: numA }).map((_, i) => (
                        <span key={i} className="text-3xl">🍎</span>
                      ))}
                    </div>
                    <span className="text-3xl font-black text-amber-950 font-mono">{numA}</span>
                  </div>

                  <span className="text-3xl font-black text-amber-700">➕</span>

                  {/* Second group */}
                  <div className="flex flex-col items-center">
                    <div className="flex flex-wrap justify-center gap-1.5 max-w-[120px] mb-2">
                      {Array.from({ length: numB }).map((_, i) => (
                        <span key={i} className="text-3xl">🍏</span>
                      ))}
                    </div>
                    <span className="text-3xl font-black text-amber-950 font-mono">{numB}</span>
                  </div>

                  <span className="text-3xl font-black text-amber-700">🟰</span>
                  <span className="text-4xl font-black text-amber-900">❓</span>
                </div>
              </div>
            )}

            {mode === 'subtraction' && (
              <div className="w-full max-w-lg bg-amber-50/60 border-2 border-amber-200 rounded-3xl p-6 mb-6 shadow-inner">
                <div className="flex items-center justify-center gap-4 md:gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex flex-wrap justify-center gap-1.5 max-w-[140px] mb-2">
                      {Array.from({ length: numA }).map((_, i) => (
                        <span key={i} className={`text-3xl ${i < numB ? 'opacity-30 line-through' : ''}`}>
                          🎈
                        </span>
                      ))}
                    </div>
                    <span className="text-3xl font-black text-amber-950 font-mono">{numA}</span>
                  </div>

                  <span className="text-3xl font-black text-rose-600">➖</span>

                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-black text-amber-950 font-mono mb-2">{numB}</span>
                    <span className="text-xs font-bold text-slate-500">
                      ({lang === 'hi' ? 'कम करें' : 'take away'})
                    </span>
                  </div>

                  <span className="text-3xl font-black text-amber-700">🟰</span>
                  <span className="text-4xl font-black text-amber-900">❓</span>
                </div>
              </div>
            )}

            {/* Feedback Alert */}
            {feedback && (
              <div className={`w-full max-w-md p-3 rounded-2xl border-2 text-center text-xs md:text-sm font-black mb-5 flex items-center justify-center gap-2 animate-in fade-in ${
                feedback.isCorrect ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-rose-50 border-rose-400 text-rose-950'
              }`}>
                {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Answer Options Grid (1 to 10) */}
            <div className="grid grid-cols-5 gap-2.5 max-w-md w-full mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = userSelected === num;
                return (
                  <button
                    key={num}
                    onClick={() => handleSelectOption(num)}
                    disabled={feedback !== null}
                    className={`py-3 rounded-2xl font-black text-xl transition-all cursor-pointer font-mono ${
                      isSelected
                        ? feedback?.isCorrect
                          ? 'bg-emerald-600 text-white shadow-lg scale-105'
                          : 'bg-rose-500 text-white shadow-lg'
                        : 'bg-white hover:bg-amber-100 border-2 border-amber-300 text-amber-950 shadow-sm active:scale-95'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {feedback !== null && (
              <button
                onClick={handleNext}
                className="py-3 px-8 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
              >
                <span>{t.nextBtn}</span>
              </button>
            )}

          </div>
        ) : (
          /* Final Report Card */
          <div className="w-full max-w-md bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-3xl border-2 border-amber-300 p-8 text-center flex flex-col items-center shadow-lg my-auto animate-in zoom-in-95">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-600 shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-amber-950 mb-1">{t.completedTitle}</h2>
            <p className="text-xs font-bold text-amber-800 mb-5">{t.reportTitle}</p>

            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-7 h-7 ${
                    idx < score
                      ? 'text-amber-500 fill-amber-400 drop-shadow'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              ))}
            </div>

            <div className="w-full bg-white rounded-2xl p-4 border border-amber-200 mb-6 flex justify-around shadow-sm">
              <div>
                <span className="block text-xs font-bold text-slate-500">{t.scoreLabel}</span>
                <span className="text-2xl font-black text-emerald-600">{score} / 5</span>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <span className="block text-Here is a foundational React/Next.js TypeScript template for **`HindiMathStudio.tsx`**. It provides an interactive interface for evaluating mathematical operations using Hindi/Devanagari numerals and keywords, complete with live translation between Devanagari and Western Arabic numerals:

```tsx
'use client';

import React, { useState } from 'react';

// Maps for numeral conversion
const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const ARABIC_TO_DEV: Record<string, string> = Object.fromEntries(
  DEVANAGARI_DIGITS.map((d, i) => [i.toString(), d])
);
const DEV_TO_ARABIC: Record<string, string> = Object.fromEntries(
  DEVANAGARI_DIGITS.map((d, i) => [d, i.toString()])
);

// Map common Hindi math terms to JavaScript operators/methods
const HINDI_OPERATORS: { regex: RegExp; replaceWith: string; label: string }[] = [
  { regex: /जोड़|धन|\+/gi, replaceWith: '+', label: 'जोड़ (+)' },
  { regex: /घटाव|ऋण|-/gi, replaceWith: '-', label: 'घटाव (-)' },
  { regex: /गुणा|\*|×/gi, replaceWith: '*', label: 'गुणा (×)' },
  { regex: /भाग|\/|÷/gi, replaceWith: '/', label: 'भाग (÷)' },
  { regex: /घात|\^/gi, replaceWith: '**', label: 'घात (^)' },
  { regex: /वर्गमूल/gi, replaceWith: 'Math.sqrt', label: 'वर्गमूल (√)' },
];

export const toDevanagari = (numStr: string | number): string => {
  return numStr
    .toString()
    .replace(/[0-9]/g, (digit) => ARABIC_TO_DEV[digit] ?? digit);
};

export const toArabic = (devStr: string): string => {
  return devStr.replace(/[०-९]/g, (char) => DEV_TO_ARABIC[char] ?? char);
};

export default function HindiMathStudio() {
  const [expression, setExpression] = useState<string>('२५ जोड़ ७५ गुणा २');
  const [result, setResult] = useState<{ dev: string; standard: string } | null>(null);
  const [parsedExpression, setParsedExpression] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const evaluateExpression = () => {
    try {
      setError(null);

      // 1. Convert Devanagari numerals to standard digits
      let sanitized = toArabic(expression);

      // 2. Replace Hindi keywords with valid math operators
      HINDI_OPERATORS.forEach(({ regex, replaceWith }) => {
        sanitized = sanitized.replace(regex, replaceWith);
      });

      // Simple safety check: allow only numbers, whitespace, and basic arithmetic
      if (!/^[0-9+\-*/().\s^]|Math\.sqrt/i.test(sanitized)) {
        throw new Error('अमान्य अभिव्यक्ति (Invalid expression syntax)');
      }

      setParsedExpression(sanitized);

      // 3. Compute result safely
      // Note: For production use with arbitrary user input, use a dedicated parser like mathjs
      const evalResult = Function(`'use strict'; return (${sanitized})`)();

      if (typeof evalResult !== 'number' || Number.isNaN(evalResult)) {
        throw new Error('गणना त्रुटि (Calculation Error)');
      }

      setResult({
        standard: evalResult.toString(),
        dev: toDevanagari(evalResult.toString()),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'त्रुटि (An error occurred)');
      setResult(null);
    }
  };

  const insertSymbol = (symbol: string) => {
    setExpression((prev) => `${prev} ${symbol} `);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
        हिंदी गणित स्टूडियो (Hindi Math Studio)
      </h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          समीकरण दर्ज करें (Enter Expression):
        </label>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="उदा. २५ जोड़ ७५"
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1.1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Quick Insertion Palette */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {DEVANAGARI_DIGITS.map((digit) => (
          <button
            key={digit}
            onClick={() => insertSymbol(digit)}
            type="button"
            style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            {digit}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {HINDI_OPERATORS.map((op) => (
          <button
            key={op.label}
            onClick={() => insertSymbol(op.label.split(' ')[0])}
            type="button"
            style={{
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              borderRadius: '4px',
              border: '1px solid #bbb',
              backgroundColor: '#f5f5f5',
            }}
          >
            {op.label}
          </button>
        ))}
      </div>

      <button
        onClick={evaluateExpression}
        type="button"
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        गणना करें (Calculate)
      </button>

      {error && (
        <div style={{ marginTop: '1rem', color: '#dc2626', fontWeight: 500 }}>
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '6px',
          }}
        >
          <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.25rem' }}>
            व्याख्यायित रूप (Parsed): <code>{parsedExpression}</code>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#166534' }}>
            उत्तर: {result.dev} ({result.standard})
          </div>
        </div>
      )}
    </div>
  );
}