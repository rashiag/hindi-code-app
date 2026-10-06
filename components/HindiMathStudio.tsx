'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, RotateCcw, Trophy, CheckCircle2, XCircle, 
  Sparkles, Star, ArrowRight, Plus, Minus, Hash, Layers
} from 'lucide-react';

type MathMode = 'counting' | 'tenframe' | 'addition' | 'subtraction';

const STRINGS = {
  hi: {
    bannerTitle: "गिनती मिलाओ (Counting Match)",
    bannerSub: "चित्रों को गिनें और सही संख्या चुनें • Count & Match",
    tabCounting: "🔢 1. गिनती (Count)",
    tabTenFrame: "🧮 2. टेन-फ्रेम (Ten-Frame)",
    tabAddition: "➕ 3. जोड़ (Addition)",
    tabSubtraction: "➖ 4. घटाना (Subtract)",
    scoreLabel: "सही",
    roundLabel: "राउंड",
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
    bannerTitle: "Counting Match",
    bannerSub: "Count the pictures and select the correct number",
    tabCounting: "🔢 1. Counting",
    tabTenFrame: "🧮 2. Ten-Frame",
    tabAddition: "➕ 3. Addition",
    tabSubtraction: "➖ 4. Subtraction",
    scoreLabel: "Score",
    roundLabel: "Round",
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
  { nameHi: 'दिए', nameEn: 'diyas', emoji: '🪔' },
  { nameHi: 'सेब', nameEn: 'apples', emoji: '🍎' },
  { nameHi: 'तारे', nameEn: 'stars', emoji: '⭐' },
  { nameHi: 'केले', nameEn: 'bananas', emoji: '🍌' },
  { nameHi: 'गुब्बारे', nameEn: 'balloons', emoji: '🎈' },
  { nameHi: 'कारें', nameEn: 'cars', emoji: '🚗' },
];

export function HindiMathStudio({ lang: externalLang }: { lang?: 'hi' | 'en' } = {}) {
  const [lang, setLang] = useState<'hi' | 'en'>(externalLang || 'hi');
  const [mode, setMode] = useState<MathMode>('counting');
  const [tier, setTier] = useState<1 | 2>(1); // Tier 1: 1-5, Tier 2: 1-10
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Question parameters
  const [countTarget, setCountTarget] = useState(1);
  const [activeItem, setActiveItem] = useState(COUNTING_ITEMS[0]);
  const [numA, setNumA] = useState(2);
  const [numB, setNumB] = useState(1);
  const [userSelected, setUserSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [tenFrameCount, setTenFrameCount] = useState(3);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (externalLang) {
      setLang(externalLang);
    }
  }, [externalLang]);

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

    const maxCount = tier === 1 ? 5 : 10;

    if (mode === 'counting') {
      const target = Math.floor(Math.random() * maxCount) + 1;
      setCountTarget(target);
      setTimeout(() => {
        speakAudio(t.countingPrompt(target, lang === 'hi' ? randomItem.nameHi : randomItem.nameEn));
      }, 150);
    } else if (mode === 'tenframe') {
      const target = Math.floor(Math.random() * maxCount) + 1;
      setTenFrameCount(target);
      setTimeout(() => {
        speakAudio(lang === 'hi' ? `टेन-फ्रेम में ${target} बिंदु गिनें!` : `Count the ${target} dots!`);
      }, 150);
    } else if (mode === 'addition') {
      const a = Math.floor(Math.random() * 4) + 1;
      const b = Math.floor(Math.random() * 3) + 1;
      setNumA(a);
      setNumB(b);
      setTimeout(() => {
        speakAudio(t.additionPrompt(a, b));
      }, 150);
    } else {
      const a = Math.floor(Math.random() * 4) + 3;
      const b = Math.floor(Math.random() * (a - 1)) + 1;
      setNumA(a);
      setNumB(b);
      setTimeout(() => {
        speakAudio(t.subtractionPrompt(a, b));
      }, 150);
    }
  };

  const startNewGame = (newMode = mode, newTier = tier) => {
    setQIndex(0);
    setScore(0);
    setIsGameOver(false);
    setMode(newMode);
    setTier(newTier);
    generateNewQuestion();
  };

  useEffect(() => {
    startNewGame(mode, tier);
    return () => truncateAudio();
  }, [mode, tier, lang]);

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
    <div className="w-full flex flex-col gap-4 font-sans select-none">
      
      {/* Sub Header Card */}
      <div className="bg-amber-50/70 p-4 md:p-5 rounded-3xl border border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔢</span>
            <h2 className="text-xl md:text-2xl font-black text-amber-950">
              {t.bannerTitle}
            </h2>
          </div>
          <p className="text-xs md:text-sm font-semibold text-amber-800">
            {t.bannerSub}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-lg text-xs font-black border border-amber-200">
            <span>{t.scoreLabel}: {score}/5</span>
          </div>
        </div>

        {/* Turn Progress & Tier Selection */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-sm text-xs font-bold">
            <span className="text-amber-900">{t.roundLabel}:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < qIndex + 1 ? 'bg-amber-500' : 'bg-slate-200'
                }`}
              />
            ))}
            <span className="text-amber-900 ml-1">{qIndex + 1}/5</span>
          </div>

          <div className="flex bg-white p-1 rounded-xl border border-amber-300 shadow-sm gap-1 text-xs font-bold">
            <button
              onClick={() => startNewGame(mode, 1)}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                tier === 1 ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-900 hover:bg-amber-50'
              }`}
            >
              Tier 1 (1–5)
            </button>
            <button
              onClick={() => startNewGame(mode, 2)}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                tier === 2 ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-900 hover:bg-amber-50'
              }`}
            >
              Tier 2 (1–10)
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Play Screen */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-xl flex flex-col items-center justify-between min-h-[460px]">
        {!isGameOver ? (
          <div className="w-full flex flex-col items-center text-center">
            
            {/* Audio Button */}
            <button
              onClick={() => {
                truncateAudio();
                if (mode === 'counting') speakAudio(t.countingPrompt(countTarget, lang === 'hi' ? activeItem.nameHi : activeItem.nameEn));
                if (mode === 'tenframe') speakAudio(lang === 'hi' ? `टेन-फ्रेम में ${tenFrameCount} बिंदु गिनें!` : `Count the dots!`);
                if (mode === 'addition') speakAudio(t.additionPrompt(numA, numB));
                if (mode === 'subtraction') speakAudio(t.subtractionPrompt(numA, numB));
              }}
              className="flex items-center gap-2 bg-amber-100/70 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-full text-xs md:text-sm mb-6 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>{lang === 'hi' ? 'प्रश्न सुनें (Audio Prompt)' : 'Listen to Prompt'}</span>
            </button>

            {/* Visual Canvas Display Area */}
            <div className="w-full max-w-2xl bg-amber-50/40 border-2 border-dashed border-amber-300 rounded-3xl p-8 mb-6 min-h-[180px] flex items-center justify-center">
              <div className="flex flex-wrap justify-center gap-4 py-2">
                {Array.from({ length: countTarget }).map((_, i) => (
                  <span key={i} className="text-6xl animate-bounce filter drop-shadow" style={{ animationDelay: `${i * 90}ms` }}>
                    {activeItem.emoji}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs md:text-sm font-bold text-slate-600 mb-4">
              {lang === 'hi' ? 'सही संख्या का चयन करें (Choose the correct numeral):' : 'Choose the correct numeral:'}
            </p>

            {/* Feedback Alert */}
            {feedback && (
              <div className={`w-full max-w-md p-3 rounded-2xl border-2 text-center text-xs md:text-sm font-black mb-4 flex items-center justify-center gap-2 animate-in fade-in ${
                feedback.isCorrect ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-rose-50 border-rose-400 text-rose-950'
              }`}>
                {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Answer Options Grid */}
            <div className="grid grid-cols-5 gap-3 max-w-lg w-full mb-6">
              {(tier === 1 ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map((num) => {
                const isSelected = userSelected === num;
                return (
                  <button
                    key={num}
                    onClick={() => handleSelectOption(num)}
                    disabled={feedback !== null}
                    className={`py-3.5 rounded-2xl font-black text-2xl transition-all cursor-pointer font-mono ${
                      isSelected
                        ? feedback?.isCorrect
                          ? 'bg-emerald-600 text-white shadow-lg scale-105'
                          : 'bg-rose-500 text-white shadow-lg'
                        : 'bg-amber-50/50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 shadow-sm active:scale-95'
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
                <span className="block text-xs font-bold text-slate-500">{t.accuracyLabel}</span>
                <span className="text-2xl font-black text-amber-600">
                  {Math.round((score / 5) * 100)}%
                </span>
              </div>
            </div>

            <button
              onClick={() => startNewGame(mode, tier)}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> {t.playAgainBtn}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}