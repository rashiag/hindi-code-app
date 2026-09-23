'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, RotateCcw, Trophy, CheckCircle2, XCircle, 
  Clock, Sparkles, ArrowRight, Play, Award, Zap
} from 'lucide-react';

type GameMode = 'capital' | 'phonic_small';

interface LetterItem {
  char: string;
  lower: string;
  phonicHint: string;
  hindiAnchor: string;
}

const ALPHABETS: LetterItem[] = [
  { char: 'A', lower: 'a', phonicHint: 'ऐ (æ) as in Apple', hindiAnchor: 'ऐ' },
  { char: 'B', lower: 'b', phonicHint: 'ब (b) as in Ball', hindiAnchor: 'ब' },
  { char: 'C', lower: 'c', phonicHint: 'क (k) as in Cat', hindiAnchor: 'क' },
  { char: 'D', lower: 'd', phonicHint: 'ड (d) as in Dog', hindiAnchor: 'ड' },
  { char: 'E', lower: 'e', phonicHint: 'ए (e) as in Elephant', hindiAnchor: 'ए' },
  { char: 'F', lower: 'f', phonicHint: 'फ़ (f) as in Fish', hindiAnchor: 'फ़' },
  { char: 'G', lower: 'g', phonicHint: 'ग (g) as in Grapes', hindiAnchor: 'ग' },
  { char: 'H', lower: 'h', phonicHint: 'ह (h) as in Hat', hindiAnchor: 'ह' },
  { char: 'I', lower: 'i', phonicHint: 'इ (i) as in Igloo', hindiAnchor: 'इ' },
  { char: 'J', lower: 'j', phonicHint: 'ज (j) as in Jug', hindiAnchor: 'ज' },
  { char: 'K', lower: 'k', phonicHint: 'क (k) as in Kite', hindiAnchor: 'क' },
  { char: 'L', lower: 'l', phonicHint: 'ल (l) as in Lion', hindiAnchor: 'ल' },
  { char: 'M', lower: 'm', phonicHint: 'म (m) as in Mango', hindiAnchor: 'म' },
  { char: 'N', lower: 'n', phonicHint: 'न (n) as in Nest', hindiAnchor: 'न' },
  { char: 'O', lower: 'o', phonicHint: 'ऑ (ɒ) as in Orange', hindiAnchor: 'ऑ' },
  { char: 'P', lower: 'p', phonicHint: 'प (p) as in Pen', hindiAnchor: 'प' },
  { char: 'Q', lower: 'q', phonicHint: 'क्व (kw) as in Queen', hindiAnchor: 'क्व' },
  { char: 'R', lower: 'r', phonicHint: 'र (r) as in Ring', hindiAnchor: 'र' },
  { char: 'S', lower: 's', phonicHint: 'स (s) as in Sun', hindiAnchor: 'स' },
  { char: 'T', lower: 't', phonicHint: 'ट (t) as in Tree', hindiAnchor: 'ट' },
  { char: 'U', lower: 'u', phonicHint: 'अ (ʌ) as in Umbrella', hindiAnchor: 'अ' },
  { char: 'V', lower: 'v', phonicHint: 'व (v) as in Van', hindiAnchor: 'व' },
  { char: 'W', lower: 'w', phonicHint: 'व (w) as in Watch', hindiAnchor: 'व' },
  { char: 'X', lower: 'x', phonicHint: 'क्स (ks) as in Xylophone', hindiAnchor: 'क्स' },
  { char: 'Y', lower: 'y', phonicHint: 'य (j) as in Yak', hindiAnchor: 'य' },
  { char: 'Z', lower: 'z', phonicHint: 'ज़ (z) as in Zebra', hindiAnchor: 'ज़' },
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

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play browser Web Audio tone for instant feedback
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
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
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

  // Indian Accent Speech Synthesis Callout
  const speakIndianVoice = (text: string, lang = 'hi-IN') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.82; // Calibrated slower pace so preschoolers can understand clearly
      u.pitch = 1.05;

      // Prioritize en-IN or hi-IN voices
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang === 'en-IN' || v.lang === 'hi-IN');
      if (indianVoice) u.voice = indianVoice;

      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  // Prompt the current target letter
  const promptTargetLetter = (index: number, currentMode: GameMode) => {
    const item = ALPHABETS[index];
    if (!item) return;

    if (currentMode === 'capital') {
      speakIndianVoice(`${item.char}. कीबोर्ड पर ${item.char} दबाएं!`);
    } else {
      speakIndianVoice(`फोनिक साउंड: ${item.hindiAnchor}. ${item.char} as in ${item.phonicHint.split('as in ')[1] || item.char}`);
    }
  };

  // Start / Restart the 26-Letter Recognition Assessment
  const handleStartGame = (selectedMode = mode) => {
    if (timerRef.current) clearInterval(timerRef.current);

    setMode(selectedMode);
    setCurrentIndex(0);
    setScore(0);
    setWrongLetters([]);
    setTimerSeconds(0);
    setIsFinished(false);
    setLastFeedback(null);
    setIsPlaying(true);

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    setTimeout(() => {
      promptTargetLetter(0, selectedMode);
    }, 300);
  };

  // Handle letter input (from keyboard or virtual on-screen keypad)
  const handleLetterPress = (pressedKey: string) => {
    if (!isPlaying || isFinished) return;

    const currentTarget = ALPHABETS[currentIndex];
    const normalizedPress = pressedKey.toUpperCase();
    const isCorrect = normalizedPress === currentTarget.char;

    if (isCorrect) {
      playBeep('correct');
      setScore((prev) => prev + 1);
      setLastFeedback({
        isCorrect: true,
        text: `शाबाश! बिल्कुल सही — यह ${mode === 'capital' ? currentTarget.char : currentTarget.lower} है।`
      });
    } else {
      playBeep('wrong');
      const letterRecord = mode === 'capital' ? currentTarget.char : `${currentTarget.char} (${currentTarget.hindiAnchor})`;
      setWrongLetters((prev) => [...prev, letterRecord]);
      setLastFeedback({
        isCorrect: false,
        text: `गलत! आपने ${normalizedPress} दबाया, सही अक्षर ${currentTarget.char} था।`
      });
    }

    // Advance to next letter or finish test
    if (currentIndex + 1 >= 26) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
      setIsFinished(true);
      playBeep('fanfare');

      setTimeout(() => {
        speakIndianVoice(`टेस्ट पूरा हुआ! आपने छब्बीस में से ${score + (isCorrect ? 1 : 0)} अंक प्राप्त किए हैं।`);
      }, 500);
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeout(() => {
        promptTargetLetter(nextIdx, mode);
      }, 700);
    }
  };

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isFinished) return;
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleLetterPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFinished, currentIndex, mode]);

  useEffect(() => {
    return () => {
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
            <h1 className="text-xl md:text-2xl font-black">प्रीस्कूल इंग्लिश व फोनिक्स लैब (A–Z Recognition)</h1>
          </div>
          <p className="text-xs md:text-sm text-indigo-100 font-semibold">
            ध्वनि सुनो • कीबोर्ड दबाओ • स्पीड व एक्यूरेसी टाइमर से परखो
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
            Capital A–Z (पहचान)
          </button>
          <button
            onClick={() => handleStartGame('phonic_small')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              mode === 'phonic_small' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            Small a–z (Phonics)
          </button>
        </div>
      </div>

      {/* Main Game Interface */}
      {!isPlaying && !isFinished && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-inner">
            ⌨️
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {mode === 'capital' ? 'Capital Letters (A to Z) स्पीड टेस्ट' : 'Small Letters & Phonics ध्वनि टेस्ट'}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
            सिस्टम आपको एक अक्षर या फोनिक ध्वनि बोलेगा। बच्चों को कीबोर्ड पर या नीचे दिए गए बटनों पर वह अक्षर दबाना है।
          </p>
          <button
            onClick={() => handleStartGame(mode)}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> 26 अक्षरों का टेस्ट शुरू करें ➔
          </button>
        </div>
      )}

      {/* Active Question Session */}
      {isPlaying && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 shadow-xl flex flex-col items-center">
          
          {/* Progress Tracker Bar */}
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

          {/* Central Callout Prompter */}
          <div className="w-full max-w-md bg-gradient-to-b from-indigo-50/70 to-purple-50/70 border-2 border-indigo-300 rounded-3xl p-6 text-center shadow-inner mb-6 flex flex-col items-center">
            
            <button
              onClick={() => promptTargetLetter(currentIndex, mode)}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition cursor-pointer shadow-md mb-3 flex items-center gap-2"
              title="फिर से सुनें"
            >
              <Volume2 className="w-6 h-6 animate-pulse" />
            </button>

            <span className="text-xs font-bold text-indigo-900 block mb-1">
              {mode === 'capital' ? 'सिस्टम ने यह अक्षर बोला:' : 'इस फोनिक ध्वनि का अक्षर दबाएं:'}
            </span>

            <div className="text-4xl md:text-5xl font-black text-indigo-950 my-1">
              {mode === 'capital' 
                ? `"${ALPHABETS[currentIndex].char}"` 
                : `"${ALPHABETS[currentIndex].hindiAnchor}"`}
            </div>

            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              (कीबोर्ड पर दबाएं या नीचे दिए बटन छुएं)
            </p>
          </div>

          {/* Feedback Display */}
          {lastFeedback && (
            <div className={`w-full max-w-md p-3 rounded-xl border text-center text-xs font-bold mb-5 animate-in fade-in flex items-center justify-center gap-2 ${
              lastFeedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              {lastFeedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
              <span>{lastFeedback.text}</span>
            </div>
          )}

          {/* On-Screen Touch Keypad (For Tablets, Phones & Smartboards) */}
          <div className="w-full max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1.5">
              {ALPHABETS.map((a) => (
                <button
                  key={a.char}
                  onClick={() => handleLetterPress(a.char)}
                  className="py-2.5 bg-white hover:bg-indigo-600 hover:text-white border border-slate-300 hover:border-indigo-600 rounded-xl font-black text-sm md:text-base text-slate-800 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  {mode === 'capital' ? a.char : a.lower}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* End Assessment Report Card */}
      {isFinished && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 text-center shadow-xl flex flex-col items-center animate-in zoom-in-95">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-3">
            🏆
          </div>

          <h2 className="text-2xl font-black text-indigo-950 mb-1">इंग्लिश अल्फाबेट स्पीड रिपोर्ट कार्ड</h2>
          <p className="text-xs text-slate-600 font-semibold mb-6">
            NEP 2020 Foundational Literacy Assessment
          </p>

          {/* Core Metrics Table */}
          <div className="w-full max-w-md grid grid-cols-3 gap-3 bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 mb-6">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">स्कोर</span>
              <span className="text-2xl font-black text-emerald-600">{score} / 26</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">सटीकता (Accuracy)</span>
              <span className="text-2xl font-black text-indigo-900">{Math.round((score / 26) * 100)}%</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">समय (Time)</span>
              <span className="text-2xl font-black text-purple-900">{timerSeconds}s</span>
            </div>
          </div>

          {/* Wrong Letters Breakdown */}
          <div className="w-full max-w-md text-left mb-6">
            <h4 className="text-xs font-black text-slate-800 mb-2">गलत हुए अक्षरों का विवरण (Letters to Revise):</h4>
            {wrongLetters.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>अद्भुत! आपने सभी 26 अक्षरों को पहली बार में सही पहचाना।</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                {wrongLetters.map((l, i) => (
                  <span key={i} className="bg-white border border-rose-300 px-2.5 py-1 rounded-lg text-xs font-black text-rose-800 shadow-sm">
                    {l}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleStartGame(mode)}
              className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> पुनः टेस्ट दें
            </button>
            <button
              onClick={() => handleStartGame(mode === 'capital' ? 'phonic_small' : 'capital')}
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
            >
              {mode === 'capital' ? 'Small a–z Phonics मोड पर जाएं ➔' : 'Capital A–Z मोड पर जाएं ➔'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}