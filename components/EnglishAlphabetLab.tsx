'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, RotateCcw, Trophy, CheckCircle2, XCircle, 
  Clock, Play, Sparkles, ArrowRight, Pencil, Key
} from 'lucide-react';

type LabSection = 'recognition' | 'tracing';
type GameMode = 'phonic_sound' | 'capital';

interface PhonicItem {
  char: string;
  lower: string;
  hindiSound: string;
  spokenCue: string;
  exampleWord: string;
}

const NOTEBOOK_PHONICS: PhonicItem[] = [
  { char: 'A', lower: 'a', hindiSound: 'ऐ', spokenCue: 'ऐ की ध्वनि', exampleWord: 'Apple' },
  { char: 'B', lower: 'b', hindiSound: 'ब', spokenCue: 'ब की ध्वनि', exampleWord: 'Ball' },
  { char: 'C', lower: 'c', hindiSound: 'क', spokenCue: 'क की ध्वनि', exampleWord: 'Cat' },
  { char: 'D', lower: 'd', hindiSound: 'ड', spokenCue: 'ड की ध्वनि', exampleWord: 'Dog' },
  { char: 'E', lower: 'e', hindiSound: 'ए', spokenCue: 'ए की ध्वनि', exampleWord: 'Elephant' },
  { char: 'F', lower: 'f', hindiSound: 'फ़', spokenCue: 'फ़ की ध्वनि', exampleWord: 'Fish' },
  { char: 'G', lower: 'g', hindiSound: 'ग', spokenCue: 'ग की ध्वनि', exampleWord: 'Grapes' },
  { char: 'H', lower: 'h', hindiSound: 'ह', spokenCue: 'ह की ध्वनि', exampleWord: 'Hat' },
  { char: 'I', lower: 'i', hindiSound: 'इ', spokenCue: 'इ की ध्वनि', exampleWord: 'Igloo' },
  { char: 'J', lower: 'j', hindiSound: 'ज', spokenCue: 'ज की ध्वनि', exampleWord: 'Jug' },
  { char: 'K', lower: 'k', hindiSound: 'क', spokenCue: 'क की ध्वनि', exampleWord: 'Kite' },
  { char: 'L', lower: 'l', hindiSound: 'ल', spokenCue: 'ल की ध्वनि', exampleWord: 'Lion' },
  { char: 'M', lower: 'm', hindiSound: 'म', spokenCue: 'म की ध्वनि', exampleWord: 'Mango' },
  { char: 'N', lower: 'n', hindiSound: 'न', spokenCue: 'न की ध्वनि', exampleWord: 'Nest' },
  { char: 'O', lower: 'o', hindiSound: 'ओ', spokenCue: 'ओ की ध्वनि', exampleWord: 'Orange' },
  { char: 'P', lower: 'p', hindiSound: 'प', spokenCue: 'प की ध्वनि', exampleWord: 'Pen' },
  { char: 'Q', lower: 'q', hindiSound: 'क्व', spokenCue: 'क्व की ध्वनि', exampleWord: 'Queen' },
  { char: 'R', lower: 'r', hindiSound: 'र', spokenCue: 'र की ध्वनि', exampleWord: 'Ring' },
  { char: 'S', lower: 's', hindiSound: 'स', spokenCue: 'स की ध्वनि', exampleWord: 'Sun' },
  { char: 'T', lower: 't', hindiSound: 'ट', spokenCue: 'ट की ध्वनि', exampleWord: 'Tree' },
  { char: 'U', lower: 'u', hindiSound: 'अ', spokenCue: 'अ की ध्वनि', exampleWord: 'Umbrella' },
  { char: 'V', lower: 'v', hindiSound: 'व', spokenCue: 'व की ध्वनि', exampleWord: 'Van' },
  { char: 'W', lower: 'w', hindiSound: 'वॉ', spokenCue: 'वॉ की ध्वनि', exampleWord: 'Watch' },
  { char: 'X', lower: 'x', hindiSound: 'क्स', spokenCue: 'क्स की ध्वनि', exampleWord: 'Xylophone' },
  { char: 'Y', lower: 'y', hindiSound: 'य', spokenCue: 'य की ध्वनि', exampleWord: 'Yak' },
  { char: 'Z', lower: 'z', hindiSound: 'ज़', spokenCue: 'ज़ की ध्वनि', exampleWord: 'Zebra' },
];

const QWERTY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

interface PatternDefinition {
  id: string;
  name: string;
  hindiName: string;
  segments: Array<Array<[number, number]>>;
}

const PATTERNS: PatternDefinition[] = [
  {
    id: 'standing-line',
    name: 'Standing Line',
    hindiName: 'सीधी खड़ी रेखा (|)',
    segments: [[[0.5, 0.15], [0.5, 0.85]]]
  },
  {
    id: 'sleeping-line',
    name: 'Sleeping Line',
    hindiName: 'सीधी लेटी रेखा (—)',
    segments: [[[0.15, 0.5], [0.85, 0.5]]]
  },
  {
    id: 'slanting-line',
    name: 'Slanting Line',
    hindiName: 'तिरछी रेखा (/)',
    segments: [[[0.2, 0.2], [0.8, 0.8]]]
  },
  {
    id: 'zigzag',
    name: 'Zig-Zag Waves',
    hindiName: 'टेढ़ी-मेढ़ी लहरें (Zig-Zag)',
    segments: [[[0.15, 0.7], [0.35, 0.3], [0.5, 0.7], [0.65, 0.3], [0.85, 0.7]]]
  },
  {
    id: 'circle',
    name: 'Circle',
    hindiName: 'गोल चक्र (Circle)',
    segments: [
      Array.from({ length: 33 }, (_, i) => {
        const theta = (i / 32) * Math.PI * 2;
        return [0.5 + 0.35 * Math.cos(theta), 0.5 + 0.35 * Math.sin(theta)] as [number, number];
      })
    ]
  },
  {
    id: 'letter-a',
    name: 'Letter A',
    hindiName: 'अक्षर A ट्रेसिंग',
    segments: [
      [[0.5, 0.15], [0.2, 0.85]],
      [[0.5, 0.15], [0.8, 0.85]],
      [[0.32, 0.55], [0.68, 0.55]]
    ]
  },
  {
    id: 'letter-b',
    name: 'Letter B',
    hindiName: 'अक्षर B ट्रेसिंग',
    segments: [
      [[0.25, 0.15], [0.25, 0.85]],
      [[0.25, 0.15], [0.55, 0.15], [0.68, 0.25], [0.68, 0.4], [0.55, 0.5], [0.25, 0.5]],
      [[0.25, 0.5], [0.6, 0.5], [0.72, 0.62], [0.72, 0.75], [0.6, 0.85], [0.25, 0.85]]
    ]
  },
  {
    id: 'letter-c',
    name: 'Letter C',
    hindiName: 'अक्षर C ट्रेसिंग',
    segments: [
      Array.from({ length: 24 }, (_, i) => {
        const angle = (0.75 * Math.PI) + (i / 23) * (1.5 * Math.PI);
        return [0.55 + 0.32 * Math.cos(angle), 0.5 + 0.35 * Math.sin(angle)] as [number, number];
      })
    ]
  }
];

export default function EnglishAlphabetLab() {
  const [section, setSection] = useState<LabSection>('recognition');

  // --- RECOGNITION STATE ---
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

  // --- TRACING STATE ---
  const [patternIndex, setPatternIndex] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [traceResult, setTraceResult] = useState<'success' | 'fail' | null>(null);
  const [traceScore, setTraceScore] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const userDrawnPointsRef = useRef<Array<{ x: number; y: number }>>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);
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

      if (type === 'correct') {
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.22, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.3);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'fanfare') {
        const chord = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.25, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + 1.2);
        });
      }
    } catch (e) {}
  };

  const speakCleanPrompt = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.85;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang === 'hi-IN' || v.lang === 'en-IN');
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    } catch (err) {}
  };

  const promptTargetSound = (index: number, currentMode: GameMode) => {
    const item = NOTEBOOK_PHONICS[index];
    if (!item || !isMountedRef.current) return;

    setShowHintKey(false);
    setWrongPressKey(null);
    attemptsOnCurrentRef.current = 0;

    if (currentMode === 'capital') {
      speakCleanPrompt(`अक्षर ${item.char} दबाइए`);
    } else {
      speakCleanPrompt(`${item.spokenCue} दबाइए`);
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
    }, 150);
  };

  const handleLetterPress = (pressedKey: string) => {
    if (!isPlaying || isFinished || isAdvancingRef.current) return;

    const normalizedPress = pressedKey.toUpperCase();
    const expectedChar = currentTargetCharRef.current;
    const currentTarget = NOTEBOOK_PHONICS[currentIndex];

    setPressedAnimationKey(normalizedPress);
    setTimeout(() => setPressedAnimationKey(null), 150);

    if (normalizedPress === expectedChar) {
      playSoundEffect('correct');
      setWrongPressKey(null);
      setShowHintKey(false);
      isAdvancingRef.current = true;

      if (attemptsOnCurrentRef.current === 0) {
        setScore((prev) => prev + 1);
      }

      setFeedback({
        type: 'correct',
        text: `शाबाश! सही उत्तर: ${currentTarget.hindiSound} (${currentTarget.lower})`
      });

      setTimeout(() => {
        if (!isMountedRef.current) return;

        if (currentIndex + 1 >= 26) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsPlaying(false);
          setIsFinished(true);
          playSoundEffect('fanfare');
        } else {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          currentTargetCharRef.current = NOTEBOOK_PHONICS[nextIdx].char;
          setFeedback(null);
          isAdvancingRef.current = false;
          promptTargetSound(nextIdx, mode);
        }
      }, 550);
    } else {
      playSoundEffect('wrong');
      setWrongPressKey(normalizedPress);
      attemptsOnCurrentRef.current += 1;

      const record = `${currentTarget.char} (${currentTarget.hindiSound})`;
      setWrongLetters((prev) => (prev.includes(record) ? prev : [...prev, record]));

      setFeedback({
        type: 'wrong',
        text: `गलत बटन! ध्वनि '${currentTarget.hindiSound}' के लिए '${currentTarget.lower}' दबाइए`
      });

      if (attemptsOnCurrentRef.current >= 1) {
        setShowHintKey(true);
      }
    }
  };

  // Keyboard capture for Recognition mode only
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || section !== 'recognition') return;
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
  }, [isPlaying, isFinished, currentIndex, mode, score, section]);

  // --- TRACING LOGIC ---
  const currentPattern = PATTERNS[patternIndex];

  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 14;
    ctx.setLineDash([4, 18]);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    currentPattern.segments.forEach((seg) => {
      if (seg.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(seg[0][0] * w, seg[0][1] * h);
      for (let i = 1; i < seg.length; i++) {
        ctx.lineTo(seg[i][0] * w, seg[i][1] * h);
      }
      ctx.stroke();
    });

    currentPattern.segments.forEach((seg) => {
      const startPt = seg[0];
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.fillStyle = '#22c55e';
      ctx.arc(startPt[0] * w, startPt[1] * h, 9, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }, [currentPattern]);

  useEffect(() => {
    if (section === 'tracing') {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.parentElement?.clientWidth || 500;
        canvas.height = 340;
        drawGuide();
      }
      setTraceResult(null);
      userDrawnPointsRef.current = [];
    }
  }, [section, patternIndex, drawGuide]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    userDrawnPointsRef.current.push({ x, y });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const drawMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    userDrawnPointsRef.current.push({ x, y });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const verifyTracingMatch = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    const userPts = userDrawnPointsRef.current;
    if (userPts.length < 5) return;

    const checkpoints: Array<{ x: number; y: number }> = [];
    currentPattern.segments.forEach((seg) => {
      for (let i = 0; i < seg.length - 1; i++) {
        const p1 = seg[i];
        const p2 = seg[i + 1];
        const steps = 10;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          checkpoints.push({
            x: (p1[0] + (p2[0] - p1[0]) * t) * w,
            y: (p1[1] + (p2[1] - p1[1]) * t) * h
          });
        }
      }
    });

    const tolerance = 44;
    let hitCount = 0;
    checkpoints.forEach((cp) => {
      const isHit = userPts.some((up) => Math.hypot(up.x - cp.x, up.y - cp.y) <= tolerance);
      if (isHit) hitCount++;
    });

    const matchRatio = hitCount / checkpoints.length;

    if (matchRatio >= 0.60) {
      playSoundEffect('correct');
      setTraceResult('success');
      setTraceScore((prev) => prev + 1);
    } else {
      playSoundEffect('wrong');
      setTraceResult('fail');
    }
  };

  const handleClearTracing = () => {
    userDrawnPointsRef.current = [];
    setTraceResult(null);
    drawGuide();
  };

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
      
      {/* Preschool Main Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 md:p-5 rounded-3xl shadow-lg mb-4 flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-2xl">🧸</span>
            <h1 className="text-lg md:text-xl font-black">नन्हे वैज्ञानिक प्रीस्कूल लैब (Preschool Discovery Lab)</h1>
          </div>
          <p className="text-[11px] md:text-xs text-indigo-100 font-semibold">
            NEP 2020 Foundational Literacy • ध्वनि पहचान, कीबोर्ड टाइपिंग व पेंसिल ट्रेसिंग
          </p>
        </div>

        {/* Unified Sub-tab Switcher: Recognition vs Tracing */}
        <div className="flex bg-white/20 p-1 rounded-2xl backdrop-blur-md gap-1">
          <button
            onClick={() => setSection('recognition')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              section === 'recognition' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <Key className="w-3.5 h-3.5" /> 🔤 अक्षर व ध्वनि
          </button>
          <button
            onClick={() => setSection('tracing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              section === 'tracing' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" /> ✏️ पैटर्न ट्रेसिंग
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. RECOGNITION & PHONICS SECTION                                */}
      {/* ============================================================== */}
      {section === 'recognition' && (
        <>
          {/* Sub-modes for Recognition */}
          <div className="flex justify-end gap-2 mb-3">
            <button
              onClick={() => handleStartGame('phonic_sound')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                mode === 'phonic_sound' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-200 text-slate-700'
              }`}
            >
              🔊 Phonic Sound (ध्वनि से अक्षर)
            </button>
            <button
              onClick={() => handleStartGame('capital')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                mode === 'capital' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-200 text-slate-700'
              }`}
            >
              Capital A–Z (अक्षर पहचान)
            </button>
          </div>

          {!isPlaying && !isFinished && (
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-3xl flex items-center justify-center text-3xl mb-3 shadow-inner">
                🎵
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">
                {mode === 'phonic_sound' ? 'फोनिक ध्वनि सुनो और कीबोर्ड पर दबाओ' : 'Capital Letters स्पीड टेस्ट'}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mb-6 leading-relaxed">
                सिस्टम आपको ध्वनि बोलेगा (जैसे <strong>"ब की ध्वनि"</strong>)। सही बटन दबाने पर संगीतमय घंटी बजेगी और गलत बटन पर कोमल बीप।
              </p>
              <button
                onClick={() => handleStartGame(mode)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" /> टेस्ट शुरू करें ➔
              </button>
            </div>
          )}

          {isPlaying && currentTarget && (
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-4 md:p-5 shadow-xl flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-indigo-950 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                    अक्षर: {currentIndex + 1} / 26
                  </span>
                  <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    सही: {score}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-black text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>समय: {timerSeconds}s</span>
                </div>
              </div>

              <div className="w-full max-w-md bg-gradient-to-b from-indigo-50/70 to-purple-50/70 border-2 border-indigo-300 rounded-3xl p-4 text-center shadow-inner mb-3 flex flex-col items-center">
                <button
                  onClick={() => promptTargetSound(currentIndex, mode)}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition cursor-pointer shadow-md mb-1 flex items-center gap-2"
                  title="फिर से ध्वनि सुनें"
                >
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </button>
                <span className="text-xs font-bold text-indigo-900 block">
                  {mode === 'phonic_sound' ? 'इस ध्वनि का अक्षर दबाएं:' : 'यह अक्षर कीबोर्ड पर दबाएं:'}
                </span>
                <div className="text-5xl md:text-6xl font-black text-indigo-950 my-1 font-mono tracking-wider">
                  {mode === 'phonic_sound' ? currentTarget.hindiSound : currentTarget.char}
                </div>
                <div className="text-xs font-black text-purple-800 bg-purple-100 px-3 py-0.5 rounded-full">
                  <span>जैसे {currentTarget.exampleWord} ({currentTarget.lower})</span>
                </div>
              </div>

              {feedback && (
                <div className={`w-full max-w-xl p-2.5 rounded-2xl border-2 text-center text-xs font-black mb-3 flex items-center justify-center gap-2 ${
                  feedback.type === 'correct' ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-rose-50 border-rose-400 text-rose-950'
                }`}>
                  {feedback.type === 'correct' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span>{feedback.text}</span>
                </div>
              )}

              <div className="w-full max-w-2xl bg-slate-100 border-2 border-slate-300 rounded-3xl p-3 shadow-inner">
                <div className="flex justify-between items-center mb-1.5 px-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    ⌨️ QWERTY कीबोर्ड (टच करें या लैपटॉप की दबाएं)
                  </span>
                  {showHintKey && (
                    <span className="text-[10px] font-black text-amber-600 animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> हिंट: चमकता हुआ बटन दबाएं!
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 items-center">
                  {QWERTY_ROWS.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex gap-1.5 justify-center w-full">
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
                              h-10 md:h-12 w-8 sm:w-10 md:w-12 rounded-xl font-black text-sm md:text-base transition-transform shadow-sm cursor-pointer flex flex-col items-center justify-center
                              ${isCurrentlyPressed ? 'scale-90 ring-4 ring-indigo-300' : 'active:scale-95'}
                              ${isWrongJustPressed 
                                ? 'bg-rose-500 text-white border-2 border-rose-700' 
                                : isGlowHint 
                                  ? 'bg-amber-300 text-amber-950 border-2 border-amber-500 animate-bounce ring-4 ring-amber-200' 
                                  : 'bg-white hover:bg-indigo-600 hover:text-white border-2 border-slate-200 text-slate-800'
                              }
                            `}
                          >
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

          {isFinished && (
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 text-center shadow-xl flex flex-col items-center">
              <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-2">
                🏆
              </div>
              <h2 className="text-xl font-black text-indigo-950 mb-1">फोनिक्स एक्यूरेसी रिपोर्ट</h2>
              <div className="w-full max-w-md grid grid-cols-3 gap-2 bg-indigo-50/60 border border-indigo-200 rounded-2xl p-3 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">सही</span>
                  <span className="text-xl font-black text-emerald-600">{score} / 26</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">सटीकता</span>
                  <span className="text-xl font-black text-indigo-900">{Math.round((score / 26) * 100)}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">समय</span>
                  <span className="text-xl font-black text-purple-900">{timerSeconds}s</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleStartGame(mode)}
                  className="py-2 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> पुनः खेलें
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================================== */}
      {/* 2. DOTTED PATTERN TRACING SECTION                              */}
      {/* ============================================================== */}
      {section === 'tracing' && (
        <div className="bg-white border-2 border-teal-200 rounded-3xl p-4 md:p-5 shadow-xl flex flex-col items-center">
          
          {/* Pattern Carousel Buttons */}
          <div className="flex gap-1.5 overflow-x-auto w-full no-scrollbar pb-2 mb-3">
            {PATTERNS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setPatternIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                  patternIndex === idx ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {idx + 1}. {p.name}
              </button>
            ))}
          </div>

          {/* Top Tracing Info Bar */}
          <div className="w-full flex justify-between items-center mb-3 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-2xl">
            <span className="text-xs font-black text-teal-950">
              लक्ष्य: {currentPattern.hindiName}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                सफल: {traceScore}
              </span>
              <button
                onClick={handleClearTracing}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> मिटाएं
              </button>
            </div>
          </div>

          {/* Interactive Dotted Canvas */}
          <div className="w-full bg-slate-50 border-4 border-dashed border-teal-300 rounded-3xl overflow-hidden shadow-inner relative flex justify-center items-center touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={drawMove}
              onMouseUp={verifyTracingMatch}
              onMouseLeave={() => isDrawing && verifyTracingMatch()}
              onTouchStart={startDrawing}
              onTouchMove={drawMove}
              onTouchEnd={verifyTracingMatch}
              className="cursor-crosshair w-full block"
            />
            <div className="absolute top-2 left-3 pointer-events-none bg-white/90 border border-teal-300 px-2.5 py-0.5 rounded-full text-[10px] font-black text-teal-800 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>हरे बिंदु से शुरू करके डॉटेड लाइन पर चलाएं</span>
            </div>
          </div>

          {/* Result Banner */}
          {traceResult === 'success' && (
            <div className="w-full max-w-md mt-3 p-2.5 bg-emerald-50 border-2 border-emerald-400 text-emerald-950 rounded-2xl text-center font-black text-xs flex items-center justify-center gap-1.5 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>शानदार! आपने पैटर्न बिल्कुल सही ट्रेस किया 🏆</span>
            </div>
          )}

          {traceResult === 'fail' && (
            <div className="w-full max-w-md mt-3 p-2.5 bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-2xl text-center font-black text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>थोड़ा भटक गए। "मिटाएं" दबाकर पुनः प्रयास करें 🔄</span>
            </div>
          )}

          {/* Footer Controls */}
          <div className="w-full flex justify-between items-center mt-3 pt-2 border-t border-slate-200">
            <button
              onClick={handleClearTracing}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> रीसेट
            </button>
            <button
              onClick={() => {
                if (patternIndex + 1 < PATTERNS.length) setPatternIndex(prev => prev + 1);
                else setPatternIndex(0);
              }}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1"
            >
              अगला पैटर्न <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}