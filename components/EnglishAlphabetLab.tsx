'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, RotateCcw, Trophy, CheckCircle2, XCircle, 
  Clock, Play, Sparkles
} from 'lucide-react';

type GameMode = 'capital' | 'phonic_sound';

interface PhonicItem {
  char: string;
  lower: string;
  hindiSound: string;      // Exact Hindi sound from the notebook
  spokenSound: string;     // Phonetic pronunciation for TTS
  exampleWord: string;
}

// Exactly mapped from your handwritten notebook
const NOTEBOOK_PHONICS: PhonicItem[] = [
  { char: 'A', lower: 'a', hindiSound: 'ऐ', spokenSound: 'ऐ', exampleWord: 'Apple' },
  { char: 'B', lower: 'b', hindiSound: 'ब', spokenSound: 'ब', exampleWord: 'Ball' },
  { char: 'C', lower: 'c', hindiSound: 'क', spokenSound: 'क', exampleWord: 'Cat' },
  { char: 'D', lower: 'd', hindiSound: 'ड', spokenSound: 'ड', exampleWord: 'Dog' },
  { char: 'E', lower: 'e', hindiSound: 'ए', spokenSound: 'ए', exampleWord: 'Elephant' },
  { char: 'F', lower: 'f', hindiSound: 'फ़', spokenSound: 'फ़', exampleWord: 'Fish' },
  { char: 'G', lower: 'g', hindiSound: 'ग', spokenSound: 'ग', exampleWord: 'Grapes' },
  { char: 'H', lower: 'h', hindiSound: 'ह', spokenSound: 'ह', exampleWord: 'Hat' },
  { char: 'I', lower: 'i', hindiSound: 'इ', spokenSound: 'इ', exampleWord: 'Igloo' },
  { char: 'J', lower: 'j', hindiSound: 'ज', spokenSound: 'ज', exampleWord: 'Jug' },
  { char: 'K', lower: 'k', hindiSound: 'क', spokenSound: 'क', exampleWord: 'Kite' },
  { char: 'L', lower: 'l', hindiSound: 'ल', spokenSound: 'ल', exampleWord: 'Lion' },
  { char: 'M', lower: 'm', hindiSound: 'म', spokenSound: 'म', exampleWord: 'Mango' },
  { char: 'N', lower: 'n', hindiSound: 'न', spokenSound: 'न', exampleWord: 'Nest' },
  { char: 'O', lower: 'o', hindiSound: 'ओ', spokenSound: 'ओ', exampleWord: 'Orange' },
  { char: 'P', lower: 'p', hindiSound: 'प', spokenSound: 'प', exampleWord: 'Pen' },
  { char: 'Q', lower: 'q', hindiSound: 'क्व', spokenSound: 'क्व', exampleWord: 'Queen' },
  { char: 'R', lower: 'r', hindiSound: 'र', spokenSound: 'र', exampleWord: 'Ring' },
  { char: 'S', lower: 's', hindiSound: 'स', spokenSound: 'स', exampleWord: 'Sun' },
  { char: 'T', lower: 't', hindiSound: 'ट', spokenSound: 'ट', exampleWord: 'Tree' },
  { char: 'U', lower: 'u', hindiSound: 'अ', spokenSound: 'अ', exampleWord: 'Umbrella' },
  { char: 'V', lower: 'v', hindiSound: 'व', spokenSound: 'व', exampleWord: 'Van' },
  { char: 'W', lower: 'w', hindiSound: 'वॉ', spokenSound: 'वॉ', exampleWord: 'Watch' },
  { char: 'X', lower: 'x', hindiSound: 'क्स', spokenSound: 'क्स', exampleWord: 'Xylophone' },
  { char: 'Y', lower: 'y', hindiSound: 'य', spokenSound: 'य', exampleWord: 'Yak' },
  { char: 'Z', lower: 'z', hindiSound: 'ज़', spokenSound: 'ज़', exampleWord: 'Zebra' },
];

const QWERTY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function EnglishAlphabetLab() {
  const [mode, setMode] = useState<GameMode>('phonic_sound');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; text: string } | null>(null);
  const [wrongPressKey, setWrongPressKey] = useState<string | null>(null);
  const [showHintKey, setShowHintKey] = useState<boolean>(false);
  const [pressedAnimationKey, setPressedAnimationKey] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentTargetCharRef = useRef<string>('A');
  const isAdvancingRef = useRef<boolean>(false);
  const attemptsOnCurrentRef = useRef<number>(0);

  useEffect(() => {
    if (NOTEBOOK_PHONICS[currentIndex]) {
      currentTargetCharRef.current = NOTEBOOK_PHONICS[currentIndex].char;
    }
  }, [currentIndex]);

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
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
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

  const speakText = (text: string, lang = 'hi-IN', rate = 0.84) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      activeUtteranceRef.current = utterance;
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang === 'hi-IN' || v.lang === 'en-IN');
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    } catch (err) {}
  };

  // Speaks ONLY the Hindi Phonic Sound so the child connects Sound -> Letter
  const promptTargetSound = (index: number, currentMode: GameMode) => {
    const item = NOTEBOOK_PHONICS[index];
    if (!item || !isMountedRef.current) return;

    setShowHintKey(false);
    setWrongPressKey(null);
    attemptsOnCurrentRef.current = 0;

    if (currentMode === 'capital') {
      speakText(`अक्षर पहचानिए: ${item.char}. कीबोर्ड पर बड़ा ${item.char} दबाइए!`, 'hi-IN', 0.82);
    } else {
      // Calls out the pure sound from your notebook
      speakText(`ध्वनि सुनो: ${item.spokenSound}. ${item.spokenSound}... कीबोर्ड पर सही अक्षर दबाइए!`, 'hi-IN', 0.82);
    }
  };

  const handleStartGame = (selectedMode = mode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setMode(selectedMode);
    setCurrentIndex(0);
    currentTargetCharRef.current = NOTEBOOK_PHONICS[0].char;
    setScore(0);
    setWrongLetters([]);
    setTimerSeconds(0);
    setIsFinished(false);
    setFeedback(null);
    setWrongPressKey(null);
    setShowHintKey(false);
    attemptsOnCurrentRef.current = 0;
    isAdvancingRef.current = false;
    setIsPlaying(true);

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    setTimeout(() => {
      promptTargetSound(0, selectedMode);
    }, 200);
  };

  const handleLetterPress = (pressedKey: string) => {
    if (!isPlaying || isFinished || isAdvancingRef.current) return;

    const normalizedPress = pressedKey.toUpperCase();
    const expectedChar = currentTargetCharRef.current;
    const currentTarget = NOTEBOOK_PHONICS[currentIndex];

    setPressedAnimationKey(normalizedPress);
    setTimeout(() => setPressedAnimationKey(null), 180);

    if (normalizedPress === expectedChar) {
      // 1. Correct Press
      playSoundEffect('correct');
      setWrongPressKey(null);
      setShowHintKey(false);
      isAdvancingRef.current = true;

      if (attemptsOnCurrentRef.current === 0) {
        setScore((prev) => prev + 1);
      }

      setFeedback({
        type: 'correct',
        text: `बहुत बढ़िया! शाबाश! (${currentTarget.hindiSound} = ${currentTarget.lower})`
      });

      speakText(`बहुत बढ़िया! शाबाश! '${currentTarget.spokenSound}' की ध्वनि है '${currentTarget.lower}'!`, 'hi-IN', 0.9);

      setTimeout(() => {
        if (!isMountedRef.current) return;

        if (currentIndex + 1 >= 26) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsPlaying(false);
          setIsFinished(true);
          playSoundEffect('fanfare');

          const finalScore = score + (attemptsOnCurrentRef.current === 0 ? 1 : 0);
          speakText(`वाह! टेस्ट पूरा हुआ। आपने 26 में से ${finalScore} सही किए।`, 'hi-IN', 0.85);
        } else {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          currentTargetCharRef.current = NOTEBOOK_PHONICS[nextIdx].char;
          setFeedback(null);
          isAdvancingRef.current = false;
          promptTargetSound(nextIdx, mode);
        }
      }, 850);

    } else {
      // 2. Wrong Press - Stays on current sound until they find it
      playSoundEffect('wrong');
      setWrongPressKey(normalizedPress);
      attemptsOnCurrentRef.current += 1;

      const record = `${currentTarget.char} (${currentTarget.hindiSound})`;
      setWrongLetters((prev) => (prev.includes(record) ? prev : [...prev, record]));

      setFeedback({
        type: 'wrong',
        text: `अरे नहीं! आपने '${normalizedPress.toLowerCase()}' दबाया। ध्वनि '${currentTarget.hindiSound}' के लिए '${currentTarget.lower}' खोजिए!`
      });

      // Show bouncing hint key if missed twice
      if (attemptsOnCurrentRef.current >= 1) {
        setShowHintKey(true);
      }

      speakText(`अरे नहीं! यह गलत है। ध्वनि '${currentTarget.spokenSound}' के लिए कीबोर्ड पर '${currentTarget.lower}' दबाइए।`, 'hi-IN', 0.86);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (!isPlaying || isFinished) return;

      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        e.stopPropagation();
        handleLetterPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isPlaying, isFinished, currentIndex, mode, score]);

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

  const currentTarget = NOTEBOOK_PHONICS[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 select-none font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-5 rounded-3xl shadow-lg mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔤</span>
            <h1 className="text-xl md:text-2xl font-black">नन्हे वैज्ञानिक फोनिक्स ध्वनि व टाइपिंग लैब</h1>
          </div>
          <p className="text-xs md:text-sm text-indigo-100 font-semibold">
            ध्वनि सुनो • कीबोर्ड पर अक्षर पहचानो • शाबाशी पाओ
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-white/20 p-1.5 rounded-2xl backdrop-blur-md gap-1">
          <button
            onClick={() => handleStartGame('phonic_sound')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              mode === 'phonic_sound' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            🔊 Phonic Sound (ध्वनि से अक्षर)
          </button>
          <button
            onClick={() => handleStartGame('capital')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              mode === 'capital' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            Capital A–Z (अक्षर से अक्षर)
          </button>
        </div>
      </div>

      {/* Start Welcome Screen */}
      {!isPlaying && !isFinished && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-inner">
            🔊
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {mode === 'phonic_sound' ? 'फोनिक ध्वनि सुनो और कीबोर्ड पर दबाओ' : 'Capital Letters (A to Z) स्पीड टेस्ट'}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
            {mode === 'phonic_sound'
              ? 'सिस्टम बोलेगा: "ध्वनि सुनो: \'ब\'... कीबोर्ड पर सही अक्षर दबाइए"। बच्चे को स्क्रीन पर ? देखकर कीबोर्ड पर \'b\' दबाना है!'
              : 'सिस्टम बोलेगा "बड़ा अक्षर A दबाइए"। कीबोर्ड पर वह बटन दबाएं।'}
          </p>
          <button
            onClick={() => handleStartGame(mode)}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> टेस्ट शुरू करें ➔
          </button>
        </div>
      )}

      {/* Active Game Stage */}
      {isPlaying && currentTarget && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col items-center">
          
          {/* Top Status Bar */}
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

          {/* Central Listening / Sound Challenge Card */}
          <div className="w-full max-w-md bg-gradient-to-b from-indigo-50/70 to-purple-50/70 border-2 border-indigo-300 rounded-3xl p-5 text-center shadow-inner mb-4 flex flex-col items-center">
            
            <button
              onClick={() => promptTargetSound(currentIndex, mode)}
              className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition cursor-pointer shadow-md mb-2 flex items-center gap-2"
              title="फिर से आवाज़ सुनें"
            >
              <Volume2 className="w-6 h-6 animate-pulse" />
            </button>

            <span className="text-xs font-bold text-indigo-900 block">
              {mode === 'phonic_sound' ? 'आवाज़ ध्यान से सुनिए:' : 'यह बड़ा अक्षर दबाएं:'}
            </span>

            {/* In Phonic Mode, show the sound anchor in quotes or a question mark to test them */}
            <div className="text-6xl md:text-7xl font-black text-indigo-950 my-1 font-mono tracking-wider">
              {mode === 'phonic_sound' ? `"${currentTarget.hindiSound}"` : currentTarget.char}
            </div>

            <div className="text-xs font-black text-purple-800 mt-1 bg-purple-100 px-4 py-1 rounded-full">
              <span>ध्वनि: {currentTarget.hindiSound} • जैसे {currentTarget.exampleWord}</span>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div className={`w-full max-w-xl p-3 rounded-2xl border-2 text-center text-xs md:text-sm font-black mb-4 animate-in fade-in flex items-center justify-center gap-2 ${
              feedback.type === 'correct' 
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950' 
                : 'bg-rose-50 border-rose-400 text-rose-950'
            }`}>
              {feedback.type === 'correct' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Physical QWERTY Keyboard Matching Layout */}
          <div className="w-full max-w-2xl bg-slate-100 border-2 border-slate-300 rounded-3xl p-3 md:p-5 shadow-inner">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                ⌨️ QWERTY कीबोर्ड (स्क्रीन पर छुएं या लैपटॉप की दबाएं)
              </span>
              {showHintKey && (
                <span className="text-[11px] font-black text-amber-600 animate-pulse flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> हिंट: चमकता हुआ बटन दबाएं!
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
                    const isCurrentlyPressed = letter === pressedAnimationKey;

                    return (
                      <button
                        key={letter}
                        onClick={() => handleLetterPress(letter)}
                        className={`
                          h-11 md:h-13 w-8 sm:w-11 md:w-14 rounded-xl font-black text-base md:text-lg transition-transform shadow-sm cursor-pointer flex flex-col items-center justify-center
                          ${isCurrentlyPressed ? 'scale-90 ring-4 ring-indigo-300' : 'active:scale-95'}
                          ${isWrongJustPressed 
                            ? 'bg-rose-500 text-white border-2 border-rose-700' 
                            : isGlowHint 
                              ? 'bg-amber-300 text-amber-950 border-3 border-amber-500 animate-bounce ring-4 ring-amber-200' 
                              : 'bg-white hover:bg-indigo-600 hover:text-white border-2 border-slate-200 text-slate-800'
                          }
                        `}
                      >
                        {/* Shows matching lower case letter on keyboard in phonic mode */}
                        <span>{mode === 'phonic_sound' ? letter.toLowerCase() : letter}</span>
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

          <h2 className="text-2xl font-black text-indigo-950 mb-1">फोनिक्स व ध्वनि एक्यूरेसी रिपोर्ट</h2>
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
            <h4 className="text-xs font-black text-slate-800 mb-2">जिन ध्वनियों का पुनः अभ्यास करना है:</h4>
            {wrongLetters.length === 0 ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>अद्भुत! आपने सभी 26 ध्वनियों को पहली बार में सही पहचाना।</span>
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
              onClick={() => handleStartGame(mode === 'phonic_sound' ? 'capital' : 'phonic_sound')}
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
            >
              {mode === 'phonic_sound' ? 'Capital A–Z मोड ➔' : '🔊 Phonic Sound मोड ➔'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}