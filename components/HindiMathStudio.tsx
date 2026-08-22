'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface RuralObject {
  name: string;
  hindi: string;
  emoji: string;
}

const RURAL_ITEMS: RuralObject[] = [
  { name: 'Mango', hindi: 'आम', emoji: '🥭' },
  { name: 'Diya', hindi: 'दीया', emoji: '🪔' },
  { name: 'Kite', hindi: 'पतंग', emoji: '🪁' },
  { name: 'Goat', hindi: 'बकरी', emoji: '🐐' },
  { name: 'Lotus', hindi: 'कमल', emoji: '🪷' },
  { name: 'Peacock', hindi: 'मोर', emoji: '🦚' }
];

const HINDI_NUMBERS: { [key: number]: { hindiNum: string; hindiWord: string } } = {
  1: { hindiNum: '१', hindiWord: 'एक' },
  2: { hindiNum: '२', hindiWord: 'दो' },
  3: { hindiNum: '३', hindiWord: 'तीन' },
  4: { hindiNum: '४', hindiWord: 'चार' },
  5: { hindiNum: '५', hindiWord: 'पाँच' },
  6: { hindiNum: '६', hindiWord: 'छह' },
  7: { hindiNum: '७', hindiWord: 'सात' },
  8: { hindiNum: '८', hindiWord: 'आठ' },
  9: { hindiNum: '९', hindiWord: 'नौ' },
  10: { hindiNum: '१०', hindiWord: 'दस' }
};

export function HindiMathStudio() {
  const [tier, setTier] = useState<1 | 2>(1);
  const [targetCount, setTargetCount] = useState<number>(3);
  const [activeItem, setActiveItem] = useState<RuralObject>(RURAL_ITEMS[0]);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [countingIndex, setCountingIndex] = useState<number>(-1);
  const [isCountingAnimation, setIsCountingAnimation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

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

  const speakHindi = (text: string, rate: number = 0.85): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = rate;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const generateQuestion = () => {
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

  useEffect(() => {
    generateQuestion();
  }, [tier]);

  const handleSelect = async (num: number) => {
    if (isCountingAnimation || isCorrect) return;

    setSelectedNum(num);

    if (num === targetCount) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      playSuccessChime();

      if (tier === 1 && newStreak >= 4) {
        setTimeout(() => setTier(2), 1200);
      }

      await speakHindi(`शाबाश! ${HINDI_NUMBERS[num].hindiWord} ${activeItem.hindi}!`);
      setTimeout(() => {
        generateQuestion();
      }, 1400);
    } else {
      setIsCorrect(false);
      setStreak(0);
      setIsCountingAnimation(true);

      await speakHindi(`आइए मिलकर गिनते हैं...`);

      for (let i = 1; i <= targetCount; i++) {
        setCountingIndex(i - 1);
        await speakHindi(HINDI_NUMBERS[i].hindiWord, 0.9);
        await new Promise((r) => setTimeout(r, 250));
      }

      setCountingIndex(-1);
      await speakHindi(`यहाँ कुल ${HINDI_NUMBERS[targetCount].hindiWord} ${activeItem.hindi} हैं।`);
      setIsCountingAnimation(false);
      setIsCorrect(null);
      setSelectedNum(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans select-none">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔢</span>
            <h1 className="text-xl md:text-2xl font-black text-amber-950">गिनती मिलाओ (Counting Match)</h1>
          </div>
          <p className="text-xs md:text-sm font-semibold text-amber-800">
            चित्रों को गिनें और सही संख्या पर स्पर्श करें
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-amber-300">
          <button
            onClick={() => setTier(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              tier === 1 ? 'bg-amber-600 text-white shadow' : 'text-amber-900 hover:bg-amber-50'
            }`}
          >
            Tier 1 (१–५)
          </button>
          <button
            onClick={() => setTier(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              tier === 2 ? 'bg-amber-600 text-white shadow' : 'text-amber-900 hover:bg-amber-50'
            }`}
          >
            Tier 2 (१–१०)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-lg text-xs font-black">
            <Award className="w-4 h-4 text-amber-600" /> अंक: {score}
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2.5 py-1 rounded-lg text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" /> {streak} लगातार!
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-amber-200 shadow-xl flex flex-col items-center">
        <button
          onClick={() => speakHindi(`चित्रों को गिनें: यहाँ कितने ${activeItem.hindi} हैं?`)}
          className="flex items-center gap-2 bg-amber-100/70 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-full text-xs md:text-sm mb-6 transition cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-amber-700" /> प्रश्न सुनें (Audio Prompt)
        </button>

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
                    {HINDI_NUMBERS[idx + 1].hindiWord}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-lg">
          <p className="text-center text-xs md:text-sm font-bold text-slate-500 mb-3">
            सही संख्या का चयन करें (Choose the correct count):
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
                    {HINDI_NUMBERS[num].hindiNum} ({HINDI_NUMBERS[num].hindiWord})
                  </span>
                  {isRight && <CheckCircle2 className="w-5 h-5 text-white absolute top-2 right-2" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={generateQuestion}
            disabled={isCountingAnimation}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> नया प्रश्न (Skip/Next)
          </button>
        </div>
      </div>
    </div>
  );
}