'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, RotateCcw, Trophy, CheckCircle2, XCircle, 
  Clock, Play, Sparkles, HelpCircle
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

// Standard QWERTY Layout Rows
const QWERTY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function EnglishAlphabetLab() {
  const [mode, setMode] = useState<GameMode>('capital');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | 'hint'; text: string } | null>(null);
  const [wrongPressKey, setWrongPressKey] = useState<string | null>(null);
  const [attemptsOnCurrent, setAttemptsOnCurrent] = useState<number>(0);
  const [showHintKey, setShowHintKey] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeakingRef = useRef<boolean>(false);

  // Play pleasant musical feedback sounds
  const playSoundEffect = (type: 'correct' | 'wrong' | 'fanfare') => {
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
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.22);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.12);
        osc.frequency.setValueAtTime(659.25, now + 0.24);
        osc.frequency.setValueAtTime(880, now + 0.36);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      }
    } catch (e) {}
  };

  // Robust Speech Synthesizer that works reliably on Chromium
  const speakText = (text: string, lang = 'hi-IN', rate = 0.85): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      try {
        // Resume in case Chrome paused speech
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        activeUtteranceRef.current = utterance; // Prevent Chrome GC bug
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = 1.06;

        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang === 'hi-IN' || v.lang === 'en-IN');
        if (preferred) utterance.voice = preferred;

        let finished = false;
        const done = () => {
          if (!finished) {
            finished = true;
            isSpeakingRef.current = false;
            resolve();
          }
        };

        utterance.onend = done;
        utterance.onerror = done;

        // Safety timeout so browser never hangs
        setTimeout(done, Math.max(1600, text.length * 110));

        isSpeakingRef.current = true;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        isSpeakingRef.current = false;
        resolve();
      }
    });
  };

  // Announce the target letter
  const promptTargetLetter = async (index: number, currentMode: GameMode) => {
    const item = ALPHABETS[index];
    if (!item || !isMountedRef.current) return;

    setShowHintKey(false);
    setWrongPressKey(null);

    if (currentMode === 'capital') {
      await speakText(`कीबोर्ड पर ${item.char} दबाइए`, 'hi-IN', 0.82);
    } else {
      await speakText(`${item.hindiAnchor}, जैसे ${item.wordHindi}। कीबोर्ड पर ${item.char} दबाइए`, 'hi-IN', 0.82);
    }
  };

  // Start or restart session
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
    setFeedback(null);
    setWrongPressKey(null);
    setAttemptsOnCurrent(0);
    setShowHintKey(false);
    setIsPlaying(true);

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    await new Promise(r => setTimeout(r, 200));
    await promptTargetLetter(0, selectedMode);
  };

  // Key press evaluation logic: stays on current letter if wrong!
  const handleLetterPress = async (pressedKey: string) => {
    if (!isPlaying || isFinished || isSpeakingRef.current) return;

    const currentTarget = ALPHABETS[currentIndex];
    const normalizedPress = pressedKey.toUpperCase();
    const isCorrect = normalizedPress === currentTarget.char;

    if (isCorrect) {
      // Correct answer
      playSoundEffect('correct');
      setWrongPressKey(null);
      setShowHintKey(false);

      if (attemptsOnCurrent === 0) {
        setScore((prev) => prev + 1);
      }

      setFeedback({
        type: 'correct',
        text: `बहुत बढ़िया! शाबाश (${mode === 'capital' ? currentTarget.char : currentTarget.lower})`
      });

      await speakText(`बहुत बढ़िया! शाबाश!`, 'hi-IN', 0.9);
      await new Promise(r => setTimeout(r, 450));

      if (!isMountedRef.current) return;

      if (currentIndex + 1 >= 26) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsPlaying(false);
        setIsFinished(true);
        playSoundEffect('fanfare');

        const finalScore = score + (attemptsOnCurrent === 0 ? 1 : 0);
        await speakText(`वाह! टेस्ट पूरा हुआ। आपने 26 में से ${finalScore} अंक प्राप्त किए।`, 'hi-IN', 0.85);
      } else {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setAttemptsOnCurrent(0);
        setFeedback(null);
        await promptTargetLetter(nextIdx, mode);
      }

    } else {
      // Wrong answer - DO NOT ADVANCE! Guide the preschooler gently
      playSoundEffect('wrong');
      setWrongPressKey(normalizedPress);
      setAttemptsOnCurrent((prev) => prev + 1);

      // Record as missed for final report card
      const record = mode === 'capital' ? currentTarget.char : `${currentTarget.char} (${currentTarget.hindiAnchor})`;
      if (!wrongLetters.includes(record)) {
        setWrongLetters((prev) => [...prev, record]);
      }

      setFeedback({
        type: 'wrong',
        text: `अरे नहीं! आपने ${normalizedPress} दबाया। कीबोर्ड पर ${currentTarget.char} खोजिए!`
      });

      // Show glowing hint on the keyboard if they miss it twice
      if (attemptsOnCurrent >= 1) {
        setShowHintKey(true);
      }

      await speakText(`अरे नहीं! यह गलत है। कीबोर्ड पर ${currentTarget.char} दबाइए।`, 'hi-IN', 0.85);
    }
  };

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (!isPlaying || isFinished) return;

      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleLetterPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFinished, currentIndex, mode, attemptsOnCurrent, score]);

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

  const currentTarget = ALPHABETS[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 select-none font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-5 rounded-3xl shadow-lg mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔤</span>
            <h1 className="text-xl md:text-2xl font-black">नन्हे वैज्ञानिक QWERTY टाइपिंग व फोनिक्स लैब</h1>
          </div>
          <p className="text-xs md:text-sm text-indigo-100 font-semibold">
            आवाज़ सुनो • असली कीबोर्ड पर बटन खोजो • शाबाशी पाओ
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

      {/* Start Welcome Screen */}
      {!isPlaying && !isFinished && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-inner">
            ⌨️
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {mode === 'capital' ? 'Capital Letters (A to Z) QWERTY पहचान' : 'Small Letters & Phonics ध्वनि खेल'}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
            सिस्टम आपको बोलेगा <strong>"कीबोर्ड पर [अक्षर] दबाइए"</strong>। बच्चों को लैपटॉप/कंप्यूटर कीबोर्ड पर वह अक्षर पहचान कर दबाना है।
          </p>
          <button
            onClick={() => handleStartGame(mode)}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> खेल शुरू करें ➔
          </button>
        </div>
      )}

      {/* Active Game Stage */}
      {isPlaying && currentTarget && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col items-center">
          
          {/* Top Info Bar */}
          <div className="w-full flex justify-between items-center mb-4 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
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

          {/* Big Visual Prompt Card */}
          <div className="w-full max-w-md bg-gradient-to-b from-indigo-50/70 to-purple-50/70 border-2 border-indigo-300 rounded-3xl p-5 text-center shadow-inner mb-4 flex flex-col items-center">
            
            <button
              onClick={() => promptTargetLetter(currentIndex, mode)}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition cursor-pointer shadow-md mb-2 flex items-center gap-2"
              title="फिर से सुनें"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
            </button>

            <span className="text-xs font-bold text-indigo-900 block">
              {mode === 'capital' ? 'इस अक्षर को कीबोर्ड पर खोजें:' : 'इस ध्वनि का अक्षर खोजें:'}
            </span>

            <div className="text-5xl md:text-6xl font-black text-indigo-950 my-1 tracking-wider">
              {mode === 'capital' ? currentTarget.char : currentTarget.hindiAnchor}
            </div>

            <div className="text-xs font-black text-purple-800 mt-1 flex items-center gap-1">
              <span>{currentTarget.char} for {currentTarget.phonicHint} ({currentTarget.wordHindi})</span>
            </div>
          </div>

          {/* Real-time Feedback Banner */}
          {feedback && (
            <div className={`w-full max-w-xl p-3 rounded-2xl border-2 text-center text-xs md:text-sm font-black mb-4 animate-in fade-in flex items-center justify-center gap-2 ${
              feedback.type === 'correct' 
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950' 
                : 'bg-rose-50 border-rose-400 text-rose-950 animate-shake'
            }`}>
              {feedback.type === 'correct' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Realistic Physical QWERTY Keyboard Display */}
          <div className="w-full max-w-2xl bg-slate-100 border-2 border-slate-300 rounded-3xl p-3 md:p-5 shadow-inner">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                ⌨️ QWERTY कीबोर्ड लेआउट (नीचे छुएं या लैपटॉप कीबोर्ड दबाएं)
              </span>
              {showHintKey && (
                <span className="text-[11px] font-black text-amber-600 animate-pulse flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> हिंट: चमकता हुआ बटन देखें!
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 items-center">
              {QWERTY_ROWS.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1.5 md:gap-2 justify-center w-full">
                  {row.map((letter) => {
                    const isTarget = letter === currentTarget.char;
                    const isWrongJustPressed = letter === wrongPressKey;
                    const isGlowHint = isTarget && showHintKey;

                    return (
                      <button
                        key={letter}
                        onClick={() => handleLetterPress(letter)}
                        className={`
                          h-11 md:h-13 w-8 sm:w-11 md:w-14 rounded-xl font-black text-base md:text-lg transition-all active:scale-95 shadow-sm cursor-pointer flex flex-col items-center justify-center
                          ${isWrongJustPressed 
                            ? 'bg-rose-500 text-white border-2 border-rose-700 animate-shake' 
                            : isGlowHint 
                              ? 'bg-amber-300 text-amber-950 border-3 border-amber-500 animate-bounce ring-4 ring-amber-200' 
                              : 'bg-white hover:bg-indigo-600 hover:text-white border-2 border-slate-200 text-slate-800'
                          }
                        `}
                      >
                        <span>{mode === 'capital' ? letter : letter.toLowerCase()}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Assessment Final Report */}
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
              <span className="text-[11px] font-bold text-slate-500 block">पहली बार में सही</span>
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
                <span>अद्भुत! आपने सभी 26 अक्षरों को पहली बार में सही पहचाना।</span>
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