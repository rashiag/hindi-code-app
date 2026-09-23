'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, RotateCcw, Trophy, CheckCircle2, XCircle, 
  Clock, Play, Award, Loader2
} from 'lucide-react';

type GameMode = 'capital' | 'phonic_small';

interface LetterItem {
  char: string;
  lower: string;
  wordHindi: string;
  phonicHint: string;
  hindiAnchor: string;
}

const ALPHABETS: LetterItem[] = [
  { char: 'A', lower: 'a', wordHindi: 'ऐप्पल', phonicHint: 'Apple', hindiAnchor: 'ऐ' },
  { char: 'B', lower: 'b', wordHindi: 'बॉल', phonicHint: 'Ball', hindiAnchor: 'ब' },
  { char: 'C', lower: 'c', wordHindi: 'कैट', phonicHint: 'Cat', hindiAnchor: 'क' },
  { char: 'D', lower: 'd', wordHindi: 'डॉग', phonicHint: 'Dog', hindiAnchor: 'ड' },
  { char: 'E', lower: 'e', wordHindi: 'एलिफेंट', phonicHint: 'Elephant', hindiAnchor: 'ए' },
  { char: 'F', lower: 'f', wordHindi: 'फ़िश', phonicHint: 'Fish', hindiAnchor: 'फ़' },
  { char: 'G', lower: 'g', wordHindi: 'ग्रेप्स', phonicHint: 'Grapes', hindiAnchor: 'ग' },
  { char: 'H', lower: 'h', wordHindi: 'हैट', phonicHint: 'Hat', hindiAnchor: 'ह' },
  { char: 'I', lower: 'i', wordHindi: 'इग्लू', phonicHint: 'Igloo', hindiAnchor: 'इ' },
  { char: 'J', lower: 'j', wordHindi: 'जग', phonicHint: 'Jug', hindiAnchor: 'ज' },
  { char: 'K', lower: 'k', wordHindi: 'काइट', phonicHint: 'Kite', hindiAnchor: 'क' },
  { char: 'L', lower: 'l', wordHindi: 'लायन', phonicHint: 'Lion', hindiAnchor: 'ल' },
  { char: 'M', lower: 'm', wordHindi: 'मैंगो', phonicHint: 'Mango', hindiAnchor: 'म' },
  { char: 'N', lower: 'n', wordHindi: 'नेस्ट', phonicHint: 'Nest', hindiAnchor: 'न' },
  { char: 'O', lower: 'o', wordHindi: 'ऑरेंज', phonicHint: 'Orange', hindiAnchor: 'ऑ' },
  { char: 'P', lower: 'p', wordHindi: 'पेन', phonicHint: 'Pen', hindiAnchor: 'प' },
  { char: 'Q', lower: 'q', wordHindi: 'क्वीन', phonicHint: 'Queen', hindiAnchor: 'क्व' },
  { char: 'R', lower: 'r', wordHindi: 'रिंग', phonicHint: 'Ring', hindiAnchor: 'र' },
  { char: 'S', lower: 's', wordHindi: 'सन', phonicHint: 'Sun', hindiAnchor: 'स' },
  { char: 'T', lower: 't', wordHindi: 'ट्री', phonicHint: 'Tree', hindiAnchor: 'ट' },
  { char: 'U', lower: 'u', wordHindi: 'अम्ब्रेला', phonicHint: 'Umbrella', hindiAnchor: 'अ' },
  { char: 'V', lower: 'v', wordHindi: 'वैन', phonicHint: 'Van', hindiAnchor: 'व' },
  { char: 'W', lower: 'w', wordHindi: 'वॉच', phonicHint: 'Watch', hindiAnchor: 'व' },
  { char: 'X', lower: 'x', wordHindi: 'ज़ाइलोफ़ोन', phonicHint: 'Xylophone', hindiAnchor: 'क्स' },
  { char: 'Y', lower: 'y', wordHindi: 'याक', phonicHint: 'Yak', hindiAnchor: 'य' },
  { char: 'Z', lower: 'z', wordHindi: 'ज़ेब्रा', phonicHint: 'Zebra', hindiAnchor: 'ज़' },
];

export default function EnglishAlphabetLab() {
  const [mode, setMode] = useState<GameMode>('capital');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Friendly soft sound effects
  const playBeep = (type: 'correct' | 'wrong' | 'fanfare') => {
    if (typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.15);
        osc.frequency.setValueAtTime(659.25, now + 0.3);
        osc.frequency.setValueAtTime(880, now + 0.45);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      }
    } catch (e) {}
  };

  // Bulletproof voice synthesizer with timeout fallback
  const speakVoicePromise = (text: string, lang = 'hi-IN', rate = 0.85): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      let isResolved = false;
      const safeResolve = () => {
        if (!isResolved) {
          isResolved = true;
          resolve();
        }
      };

      // Fallback timer: Chromium sometimes hangs on utterance onend
      const maxWait = Math.max(1500, text.length * 90);
      const fallbackTimer = setTimeout(safeResolve, maxWait);

      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = rate;
        u.pitch = 1.08;

        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang === 'hi-IN' || v.lang === 'en-IN');
        if (preferred) u.voice = preferred;

        u.onend = () => {
          clearTimeout(fallbackTimer);
          safeResolve();
        };
        u.onerror = () => {
          clearTimeout(fallbackTimer);
          safeResolve();
        };

        window.speechSynthesis.speak(u);
      } catch (e) {
        clearTimeout(fallbackTimer);
        safeResolve();
      }
    });
  };

  // Prompt the target letter for 3-4 year olds
  const promptTargetLetter = async (index: number, currentMode: GameMode) => {
    const item = ALPHABETS[index];
    if (!item || !isMountedRef.current) return;

    if (currentMode === 'capital') {
      await speakVoicePromise(`कीबोर्ड पर ${item.char} दबाइए`, 'hi-IN', 0.82);
    } else {
      await speakVoicePromise(`${item.hindiAnchor}, जैसे ${item.wordHindi}। कीबोर्ड पर ${item.char} दबाइए`, 'hi-IN', 0.82);
    }
  };

  // Start / Restart game
  const handleStartGame = async (selectedMode = mode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setMode(selectedMode);
    setCurrentIndex(0);
    setScore(0);
    setWrongLetters([]);
    setTimerSeconds(0);
    setIsFinished(false);
    setLastFeedback(null);
    setIsPlaying(true);
    setIsProcessing(true);

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    await new Promise(r => setTimeout(r, 250));
    await promptTargetLetter(0, selectedMode);
    setIsProcessing(false);
  };

  // Handle letter press with explicit Hindi praise / correction
  const handleLetterPress = async (pressedKey: string) => {
    if (!isPlaying || isFinished || isProcessing) return;
    setIsProcessing(true); // Lock buttons while feedback is speaking

    const currentTarget = ALPHABETS[currentIndex];
    const normalizedPress = pressedKey.toUpperCase();
    const isCorrect = normalizedPress === currentTarget.char;

    let spokenFeedback = '';

    if (isCorrect) {
      playBeep('correct');
      setScore((prev) => prev + 1);
      setLastFeedback({
        isCorrect: true,
        text: `बहुत बढ़िया! बिल्कुल सही (${mode === 'capital' ? currentTarget.char : currentTarget.lower})`
      });
      spokenFeedback = `बहुत बढ़िया! शाबाश!`;
    } else {
      playBeep('wrong');
      const letterRecord = mode === 'capital' ? currentTarget.char : `${currentTarget.char} (${currentTarget.hindiAnchor})`;
      setWrongLetters((prev) => [...prev, letterRecord]);
      setLastFeedback({
        isCorrect: false,
        text: `अरे नहीं! सही अक्षर ${currentTarget.char} है।`
      });
      spokenFeedback = `अरे नहीं, यह गलत है। सही अक्षर ${currentTarget.char} है।`;
    }

    // Speak the spoken feedback completely
    await speakVoicePromise(spokenFeedback, 'hi-IN', 0.88);

    // Give 3-4 year olds 800ms of breathing room to see the visual card
    await new Promise(r => setTimeout(r, 800));

    if (!isMountedRef.current) return;

    if (currentIndex + 1 >= 26) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
      setIsFinished(true);
      playBeep('fanfare');

      const finalScore = score + (isCorrect ? 1 : 0);
      await speakVoicePromise(`वाह! टेस्ट पूरा हुआ। आपने छब्बीस में से ${finalScore} सही किए।`, 'hi-IN', 0.85);
      setIsProcessing(false);
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      // Speak next prompt clearly
      await promptTargetLetter(nextIdx, mode);
      setIsProcessing(false);
    }
  };

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (!isPlaying || isFinished || isProcessing) return;

      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleLetterPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFinished, isProcessing, currentIndex, mode]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 select-none font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-5 rounded-3xl shadow-lg mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔤</span>
            <h1 className="text-xl md:text-2xl font-black">नन्हे वैज्ञानिक इंग्लिश लैब (Preschool A–Z)</h1>
          </div>
          <p className="text-xs md:text-sm text-indigo-100 font-semibold">
            आवाज़ सुनो • कीबोर्ड पर बटन दबाओ • शाबाशी पाओ
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-white/20 p-1.5 rounded-2xl backdrop-blur-md gap-1">
          <button
            onClick={() => handleStartGame('capital')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              mode === 'capital' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            Capital A–Z (अक्षर)
          </button>
          <button
            onClick={() => handleStartGame('phonic_small')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              mode === 'phonic_small' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            Small a–z (ध्वनि / Phonics)
          </button>
        </div>
      </div>

      {/* Start Screen */}
      {!isPlaying && !isFinished && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-inner">
            ⌨️
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {mode === 'capital' ? 'Capital Letters (A to Z) स्पीड व पहचान' : 'Small Letters & Phonics ध्वनि खेल'}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
            सिस्टम बोलेगा <strong>"कीबोर्ड पर [अक्षर] दबाइए"</strong>। बच्चों को कीबोर्ड या नीचे दिए गए बटनों पर वह अक्षर दबाना है।
          </p>
          <button
            onClick={() => handleStartGame(mode)}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> खेल शुरू करें ➔
          </button>
        </div>
      )}

      {/* Active Question Session */}
      {isPlaying && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 shadow-xl flex flex-col items-center">
          
          {/* Top Info Bar */}
          <div className="w-full flex justify-between items-center mb-6 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-950 bg-indigo-100 px-3 py-1 rounded-full">
                अक्षर: {currentIndex + 1} / 26
              </span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                सही: {score}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>समय: {timerSeconds}s</span>
            </div>
          </div>

          {/* Big Interactive Prompt Center */}
          <div className="w-full max-w-md bg-gradient-to-b from-indigo-50/70 to-purple-50/70 border-2 border-indigo-300 rounded-3xl p-6 text-center shadow-inner mb-6 flex flex-col items-center">
            
            <button
              onClick={() => promptTargetLetter(currentIndex, mode)}
              disabled={isProcessing}
              className="p-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-full transition cursor-pointer shadow-md mb-3 flex items-center gap-2"
              title="फिर से सुनें"
            >
              <Volume2 className="w-6 h-6 animate-pulse" />
            </button>

            <span className="text-xs font-bold text-indigo-900 block mb-1">
              {mode === 'capital' ? 'सिस्टम की आवाज़ सुनें:' : 'इस ध्वनि का अक्षर खोजें:'}
            </span>

            <div className="text-5xl md:text-6xl font-black text-indigo-950 my-1 tracking-wider">
              {mode === 'capital' 
                ? `${ALPHABETS[currentIndex].char}` 
                : `${ALPHABETS[currentIndex].hindiAnchor}`}
            </div>

            <p className="text-xs font-bold text-indigo-800 mt-2">
              {isProcessing ? '⏳ आवाज़ सुनिए...' : 'कीबोर्ड पर दबाएं या नीचे दिए बटन छुएं'}
            </p>
          </div>

          {/* Visual Feedback Banner */}
          {lastFeedback && (
            <div className={`w-full max-w-md p-3.5 rounded-2xl border-2 text-center text-xs md:text-sm font-black mb-5 animate-in fade-in flex items-center justify-center gap-2 ${
              lastFeedback.isCorrect ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-rose-50 border-rose-400 text-rose-950'
            }`}>
              {lastFeedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              <span>{lastFeedback.text}</span>
            </div>
          )}

          {/* Preschool Friendly Keypad (Large, Touch-Friendly) */}
          <div className="w-full max-w-2xl bg-slate-50 border border-slate-200 rounded-3xl p-4">
            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1.5 md:gap-2">
              {ALPHABETS.map((a) => (
                <button
                  key={a.char}
                  onClick={() => handleLetterPress(a.char)}
                  disabled={isProcessing}
                  className="py-3 bg-white hover:bg-indigo-600 hover:text-white disabled:opacity-50 border-2 border-slate-200 hover:border-indigo-600 rounded-xl font-black text-base text-slate-800 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  {mode === 'capital' ? a.char : a.lower}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 26-Letter Summary Card */}
      {isFinished && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 text-center shadow-xl flex flex-col items-center animate-in zoom-in-95">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-3">
            🏆
          </div>

          <h2 className="text-2xl font-black text-indigo-950 mb-1">अल्फाबेट स्पीड व एक्यूरेसी रिपोर्ट</h2>
          <p className="text-xs text-slate-600 font-semibold mb-6">
            NEP 2020 Foundational Literacy Card
          </p>

          <div className="w-full max-w-md grid grid-cols-3 gap-3 bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 mb-6">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">कुल सही</span>
              <span className="text-2xl font-black text-emerald-600">{score} / 26</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">सटीकता</span>
              <span className="text-2xl font-black text-indigo-900">{Math.round((score / 26) * 100)}%</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">कुल समय</span>
              <span className="text-2xl font-black text-purple-900">{timerSeconds}s</span>
            </div>
          </div>

          <div className="w-full max-w-md text-left mb-6">
            <h4 className="text-xs font-black text-slate-800 mb-2">जिन अक्षरों का पुनः अभ्यास करना है:</h4>
            {wrongLetters.length === 0 ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>अद्भुत! आपने सभी 26 अक्षरों को बिना किसी गलती के पहचाना।</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                {wrongLetters.map((l, i) => (
                  <span key={i} className="bg-white border border-rose-300 px-2.5 py-1 rounded-lg text-xs font-black text-rose-800 shadow-sm">
                    {l}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleStartGame(mode)}
              className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> पुनः खेलें
            </button>
            <button
              onClick={() => handleStartGame(mode === 'capital' ? 'phonic_small' : 'capital')}
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
            >
              {mode === 'capital' ? 'Small a–z Phonics मोड ➔' : 'Capital A–Z मोड ➔'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}