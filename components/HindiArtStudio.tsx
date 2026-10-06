'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, RotateCcw, Trophy, Star, 
  ArrowRight, Download, Undo2, Eraser, Paintbrush, PaintBucket, RefreshCw
} from 'lucide-react';

interface ColorItem {
  id: string;
  nameEn: string;
  nameHi: string;
  hex: string;
  items: { nameEn: string; nameHi: string; emoji: string }[];
}

const COLOR_DATABASE: ColorItem[] = [
  { id: 'red', nameEn: 'Red', nameHi: 'लाल', hex: '#EF4444', items: [{ nameEn: 'Apple', nameHi: 'सेब', emoji: '🍎' }, { nameEn: 'Tomato', nameHi: 'टमाटर', emoji: '🍅' }, { nameEn: 'Strawberry', nameHi: 'स्ट्रॉबेरी', emoji: '🍓' }] },
  { id: 'yellow', nameEn: 'Yellow', nameHi: 'पीला', hex: '#FACC15', items: [{ nameEn: 'Banana', nameHi: 'केला', emoji: '🍌' }, { nameEn: 'Sun', nameHi: 'सूरज', emoji: '☀️' }, { nameEn: 'Sunflower', nameHi: 'सूरजमुखी', emoji: '🌻' }] },
  { id: 'blue', nameEn: 'Blue', nameHi: 'नीला', hex: '#3B82F6', items: [{ nameEn: 'Sky', nameHi: 'आसमान', emoji: '🌌' }, { nameEn: 'Ocean', nameHi: 'समुद्र', emoji: '🌊' }, { nameEn: 'Blueberry', nameHi: 'ब्लूबेरी', emoji: '🫐' }] },
  { id: 'green', nameEn: 'Green', nameHi: 'हरा', hex: '#22C55E', items: [{ nameEn: 'Leaf', nameHi: 'पत्ता', emoji: '🍃' }, { nameEn: 'Frog', nameHi: 'मेंढक', emoji: '🐸' }, { nameEn: 'Broccoli', nameHi: 'ब्रोकली', emoji: '🥦' }] },
  { id: 'orange', nameEn: 'Orange', nameHi: 'नारंगी', hex: '#F97316', items: [{ nameEn: 'Orange', nameHi: 'संतरा', emoji: '🍊' }, { nameEn: 'Carrot', nameHi: 'गाजर', emoji: '🥕' }, { nameEn: 'Pumpkin', nameHi: 'कद्दू', emoji: '🎃' }] },
  { id: 'purple', nameEn: 'Purple', nameHi: 'बैंगनी', hex: '#9333EA', items: [{ nameEn: 'Brinjal', nameHi: 'बैंगन', emoji: '🍆' }, { nameEn: 'Grapes', nameHi: 'अंगूर', emoji: '🍇' }] },
  { id: 'pink', nameEn: 'Pink', nameHi: 'गुलाबी', hex: '#EC4899', items: [{ nameEn: 'Lotus', nameHi: 'कमल', emoji: '🪷' }, { nameEn: 'Flamingo', nameHi: 'राजहंस', emoji: '🦩' }] },
  { id: 'brown', nameEn: 'Brown', nameHi: 'भूरा', hex: '#854D0E', items: [{ nameEn: 'Coconut', nameHi: 'नारियल', emoji: '🥥' }, { nameEn: 'Wood', nameHi: 'लकड़ी', emoji: '🪵' }, { nameEn: 'Chocolate', nameHi: 'चॉकलेट', emoji: '🍫' }] },
  { id: 'black', nameEn: 'Black', nameHi: 'काला', hex: '#1E293B', items: [{ nameEn: 'Crow', nameHi: 'कौआ', emoji: '🐦‍⬛' }, { nameEn: 'Coal', nameHi: 'कोयला', emoji: '⚫' }] },
  { id: 'white', nameEn: 'White', nameHi: 'सफेद', hex: '#FFFFFF', items: [{ nameEn: 'Milk', nameHi: 'दूध', emoji: '🥛' }, { nameEn: 'Snow', nameHi: 'बर्फ़', emoji: '❄️' }, { nameEn: 'Egg', nameHi: 'अंडा', emoji: '🥚' }] }
];

// Expanded to 8 early-learning coloring sheets with full SVG paths
const PRESET_OUTLINES = [
  {
    id: 'apple',
    titleHi: '🍎 रसीला सेब',
    titleEn: 'Apple',
    paths: [
      { id: 'bg-apple', isBg: true },
      { id: 'leaf', d: 'M 190 70 C 230 40, 260 60, 240 90 C 210 100, 190 70, 190 70 Z' },
      { id: 'stem', d: 'M 195 75 Q 190 120 200 130', strokeOnly: true },
      { id: 'body', d: 'M 200 130 C 130 90, 80 160, 90 240 C 100 320, 160 350, 200 330 C 240 350, 300 320, 310 240 C 320 160, 270 90, 200 130 Z' }
    ]
  },
  {
    id: 'butterfly',
    titleHi: '🦋 तितली',
    titleEn: 'Butterfly',
    paths: [
      { id: 'bg-butterfly', isBg: true },
      { id: 'left-wing-top', d: 'M 200 170 C 140 100, 70 120, 80 190 C 90 240, 170 230, 200 210 Z' },
      { id: 'left-wing-bottom', d: 'M 200 210 C 130 230, 90 310, 130 330 C 170 340, 190 280, 200 250 Z' },
      { id: 'right-wing-top', d: 'M 200 170 C 260 100, 330 120, 320 190 C 310 240, 230 230, 200 210 Z' },
      { id: 'right-wing-bottom', d: 'M 200 210 C 270 230, 310 310, 270 330 C 230 340, 210 280, 200 250 Z' },
      { id: 'body', d: 'M 192 150 Q 200 130 208 150 L 208 300 Q 200 320 192 300 Z' }
    ]
  },
  {
    id: 'flower',
    titleHi: '🌸 सुंदर फूल',
    titleEn: 'Flower',
    paths: [
      { id: 'bg-flower', isBg: true },
      { id: 'fl-stem', d: 'M 195 240 L 195 340 L 205 340 L 205 240 Z' },
      { id: 'fl-leaf', d: 'M 205 280 Q 260 260 250 300 Q 220 310 205 285 Z' },
      { id: 'fl-top', d: 'M 200 160 C 180 80, 220 80, 200 160 Z' },
      { id: 'fl-bottom', d: 'M 200 240 C 180 320, 220 320, 200 240 Z' },
      { id: 'fl-left', d: 'M 160 200 C 80 180, 80 220, 160 200 Z' },
      { id: 'fl-right', d: 'M 240 200 C 320 180, 320 220, 240 200 Z' },
      { id: 'fl-center', d: 'M 200 165 A 35 35 0 1 0 200 235 A 35 35 0 1 0 200 165 Z' }
    ]
  },
  {
    id: 'sun',
    titleHi: '☀️ मुस्कुराता सूरज',
    titleEn: 'Sun',
    paths: [
      { id: 'bg-sun', isBg: true },
      { id: 'ray-top', d: 'M 188 60 L 212 60 L 200 100 Z' },
      { id: 'ray-bottom', d: 'M 188 340 L 212 340 L 200 300 Z' },
      { id: 'ray-left', d: 'M 60 188 L 60 212 L 100 200 Z' },
      { id: 'ray-right', d: 'M 340 188 L 340 212 L 300 200 Z' },
      { id: 'ray-tl', d: 'M 95 95 L 115 80 L 130 115 Z' },
      { id: 'ray-tr', d: 'M 305 95 L 285 80 L 270 115 Z' },
      { id: 'ray-bl', d: 'M 95 305 L 115 320 L 130 285 Z' },
      { id: 'ray-br', d: 'M 305 305 L 285 320 L 270 285 Z' },
      { id: 'sun-center', d: 'M 200 120 A 80 80 0 1 0 200 280 A 80 80 0 1 0 200 120 Z' }
    ]
  },
  {
    id: 'house',
    titleHi: '🏡 प्यारा घर',
    titleEn: 'House',
    paths: [
      { id: 'bg-house', isBg: true },
      { id: 'roof', d: 'M 70 180 L 200 75 L 330 180 Z' },
      { id: 'walls', d: 'M 95 180 L 305 180 L 305 330 L 95 330 Z' },
      { id: 'door', d: 'M 165 240 L 235 240 L 235 330 L 165 330 Z' },
      { id: 'window-l', d: 'M 115 205 L 145 205 L 145 235 L 115 235 Z' },
      { id: 'window-r', d: 'M 255 205 L 285 205 L 285 235 L 255 235 Z' }
    ]
  },
  {
    id: 'fish',
    titleHi: '🐟 नन्हीं मछली',
    titleEn: 'Fish',
    paths: [
      { id: 'bg-fish', isBg: true },
      { id: 'fish-body', d: 'M 100 200 C 140 115, 270 115, 300 200 C 270 285, 140 285, 100 200 Z' },
      { id: 'fish-tail', d: 'M 295 200 L 355 135 L 330 200 L 355 265 Z' },
      { id: 'fish-top-fin', d: 'M 180 145 C 210 95, 240 105, 245 155 Z' },
      { id: 'fish-bottom-fin', d: 'M 185 255 C 210 295, 235 285, 240 248 Z' }
    ]
  },
  {
    id: 'car',
    titleHi: '🚗 छोटी कार',
    titleEn: 'Car',
    paths: [
      { id: 'bg-car', isBg: true },
      { id: 'car-top', d: 'M 140 200 L 175 140 L 265 140 L 295 200 Z' },
      { id: 'car-body', d: 'M 80 200 L 340 200 Q 355 200 355 220 L 355 260 L 65 260 L 65 220 Q 65 200 80 200 Z' },
      { id: 'wheel-left', d: 'M 125 240 A 25 25 0 1 0 125 290 A 25 25 0 1 0 125 240 Z' },
      { id: 'wheel-right', d: 'M 285 240 A 25 25 0 1 0 285 290 A 25 25 0 1 0 285 240 Z' }
    ]
  },
  {
    id: 'boat',
    titleHi: '⛵ कागज़ की नाव',
    titleEn: 'Boat',
    paths: [
      { id: 'bg-boat', isBg: true },
      { id: 'boat-hull', d: 'M 85 245 L 315 245 L 285 295 L 120 295 Z' },
      { id: 'mast', d: 'M 197 90 L 203 90 L 203 245 L 197 245 Z' },
      { id: 'sail-left', d: 'M 192 105 L 192 235 L 110 235 Z' },
      { id: 'sail-right', d: 'M 208 120 L 285 235 L 208 235 Z' },
      { id: 'water-wave', d: 'M 50 310 Q 100 295 150 310 Q 200 325 250 310 Q 300 295 350 310 L 350 330 L 50 330 Z' }
    ]
  }
];

export function HindiArtStudio() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [subTab, setSubTab] = useState<'quiz' | 'paint' | 'coloring'>('quiz');

  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playSpeech = (text: string, voiceLang: 'hi-IN' | 'en-IN' = lang === 'hi' ? 'hi-IN' : 'en-IN') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = voiceLang;
      u.rate = 0.86;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  // -------------------------------------------------------------
  // ACTIVITY 1: COLOR IDENTIFICATION QUIZ
  // -------------------------------------------------------------
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const initQuiz = () => {
    stopAllAudio();
    const shuffledColors = [...COLOR_DATABASE].sort(() => 0.5 - Math.random());
    const selected5 = shuffledColors.slice(0, 5);

    const questions = selected5.map((correct) => {
      const randomItem = correct.items[Math.floor(Math.random() * correct.items.length)];
      const otherColors = COLOR_DATABASE.filter((c) => c.id !== correct.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      const options = [correct, ...otherColors].sort(() => 0.5 - Math.random());
      return {
        item: randomItem,
        correctColor: correct,
        options: options
      };
    });

    setQuizQuestions(questions);
    setQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setQuizFinished(false);
  };

  useEffect(() => {
    initQuiz();
    return () => stopAllAudio();
  }, []);

  useEffect(() => {
    if (subTab === 'quiz' && quizQuestions.length > 0 && !quizFinished) {
      const q = quizQuestions[qIndex];
      if (lang === 'hi') {
        playSpeech(`यह ${q.item.nameHi} है। इसका सही रंग चुनो।`, 'hi-IN');
      } else {
        playSpeech(`What is the color of this ${q.item.nameEn}?`, 'en-IN');
      }
    }
  }, [qIndex, subTab, quizQuestions, quizFinished, lang]);

  const handleSelectOption = (opt: ColorItem) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt.id);

    const isCorrect = opt.id === quizQuestions[qIndex].correctColor.id;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      if (lang === 'hi') {
        playSpeech(`शाबाश! सही उत्तर है ${opt.nameHi}!`, 'hi-IN');
      } else {
        playSpeech(`Correct! It is ${opt.nameEn}!`, 'en-IN');
      }
    } else {
      if (lang === 'hi') {
        playSpeech(`गलत। सही रंग है ${quizQuestions[qIndex].correctColor.nameHi}`, 'hi-IN');
      } else {
        playSpeech(`Check carefully! The correct color is ${quizQuestions[qIndex].correctColor.nameEn}`, 'en-IN');
      }
    }
  };

  const handleNextQuestion = () => {
    stopAllAudio();
    if (qIndex + 1 < quizQuestions.length) {
      setQIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      const finalS = score + (selectedOption === quizQuestions[qIndex].correctColor.id ? 1 : 0);
      if (lang === 'hi') {
        playSpeech(`बधाई हो! आपने 5 में से ${finalS} सही उत्तर दिए!`, 'hi-IN');
      } else {
        playSpeech(`Great job! You scored ${finalS} out of 5!`, 'en-IN');
      }
    }
  };

  // -------------------------------------------------------------
  // ACTIVITY 2: KIDS MS PAINT CANVAS
  // -------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paintColor, setPaintColor] = useState('#EF4444');
  const [brushSize, setBrushSize] = useState(8);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'bucket'>('brush');
  const [history, setHistory] = useState<ImageData[]>([]);
  const isDrawingRef = useRef(false);

  const saveCanvasState = () => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, cvs.width, cvs.height);
    setHistory((prev) => [...prev.slice(-15), data]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const prev = history[history.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory((h) => h.slice(0, -1));
  };

  const clearCanvas = () => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    saveCanvasState();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, cvs.width, cvs.height);
  };

  const downloadCanvas = () => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const link = document.createElement('a');
    link.download = 'young-researcher-art.png';
    link.href = cvs.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    if (subTab === 'paint') {
      const cvs = canvasRef.current;
      if (cvs) {
        const ctx = cvs.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, cvs.width, cvs.height);
        }
      }
    }
  }, [subTab]);

  const hexToRgba = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
  };

  const floodFill = (startX: number, startY: number, fillHex: string) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    saveCanvasState();
    const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    const data = imgData.data;
    const width = cvs.width;
    const height = cvs.height;

    const fillColor = hexToRgba(fillHex);
    const startIndex = (startY * width + startX) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];
    const targetA = data[startIndex + 3];

    if (
      Math.abs(targetR - fillColor[0]) < 10 &&
      Math.abs(targetG - fillColor[1]) < 10 &&
      Math.abs(targetB - fillColor[2]) < 10 &&
      Math.abs(targetA - fillColor[3]) < 10
    ) {
      return;
    }

    const colorMatch = (idx: number) => {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      return (
        Math.abs(r - targetR) <= 32 &&
        Math.abs(g - targetG) <= 32 &&
        Math.abs(b - targetB) <= 32 &&
        Math.abs(a - targetA) <= 32
      );
    };

    const queue: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(width * height);
    visited[startY * width + startX] = 1;

    while (queue.length > 0) {
      const [x, y] = queue.pop()!;
      const idx = (y * width + x) * 4;

      data[idx] = fillColor[0];
      data[idx + 1] = fillColor[1];
      data[idx + 2] = fillColor[2];
      data[idx + 3] = 255;

      const neighbors: [number, number][] = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const vIdx = ny * width + nx;
          if (!visited[vIdx]) {
            visited[vIdx] = 1;
            const nIdx = (ny * width + nx) * 4;
            if (colorMatch(nIdx)) {
              queue.push([nx, ny]);
            }
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  const handleCanvasInteractionStart = (e: any) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const rect = cvs.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    
    const scaleX = cvs.width / rect.width;
    const scaleY = cvs.height / rect.height;
    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);

    if (tool === 'bucket') {
      floodFill(x, y, paintColor);
      return;
    }

    saveCanvasState();
    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : paintColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: any) => {
    if (!isDrawingRef.current || tool === 'bucket') return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const rect = cvs.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const scaleX = cvs.width / rect.width;
    const scaleY = cvs.height / rect.height;
    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  // -------------------------------------------------------------
  // ACTIVITY 3: TAP-TO-FILL COLORING BOOK (8 EXPANDED SHEETS)
  // -------------------------------------------------------------
  const [selectedOutlineIdx, setSelectedOutlineIdx] = useState(0);
  const [colorBookFills, setColorBookFills] = useState<Record<string, string>>({});
  const [colorBookHistory, setColorBookHistory] = useState<Record<string, string>[]>([]);
  const [selectedBookColor, setSelectedBookColor] = useState('#EF4444');

  const handleFillSegment = (pathId: string) => {
    setColorBookHistory((prev) => [...prev, { ...colorBookFills }]);
    setColorBookFills((prev) => ({
      ...prev,
      [pathId]: selectedBookColor
    }));
  };

  const handleColorBookUndo = () => {
    if (colorBookHistory.length === 0) return;
    const prev = colorBookHistory[colorBookHistory.length - 1];
    setColorBookFills(prev);
    setColorBookHistory((h) => h.slice(0, -1));
  };

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById('coloring-svg-canvas');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${PRESET_OUTLINES[selectedOutlineIdx].id}-colored.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto font-sans select-none">
      
      {/* Top Banner with Bilingual Toggle */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl">🎨</span>
          <div>
            <h2 className="text-sm md:text-base font-black text-slate-900 leading-tight">
              {lang === 'hi' ? 'कला व रंग वाटिका (Art & Colors)' : 'Art & Colors Studio'}
            </h2>
            <span className="text-[11px] font-bold text-pink-600">NEP 2020 Foundational Creativity</span>
          </div>
        </div>

        {/* Controls: Language Toggle & Sub-Modes */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* BILINGUAL LANGUAGE SWITCHER */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
            <button
              onClick={() => {
                stopAllAudio();
                setLang('hi');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'hi' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => {
                stopAllAudio();
                setLang('en');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'en' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              English
            </button>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => { stopAllAudio(); setSubTab('quiz'); }}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition ${
                subTab === 'quiz' ? 'bg-pink-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🎯 {lang === 'hi' ? '1. रंग पहचानो (Quiz)' : '1. Color Quiz'}
            </button>
            <button
              onClick={() => { stopAllAudio(); setSubTab('paint'); }}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition ${
                subTab === 'paint' ? 'bg-purple-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🖌️ {lang === 'hi' ? '2. मेरा कैनवास (MS Paint)' : '2. Kids Canvas'}
            </button>
            <button
              onClick={() => { stopAllAudio(); setSubTab('coloring'); }}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition ${
                subTab === 'coloring' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🖍️ {lang === 'hi' ? '3. रंग भरो (Coloring)' : '3. Coloring Book'}
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- */}
      {/* 1. COLOR IDENTIFICATION QUIZ                             */}
      {/* -------------------------------------------------------- */}
      {subTab === 'quiz' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-8 min-h-[500px] flex flex-col justify-between">
          {!quizFinished && quizQuestions.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {lang === 'hi' ? `प्रश्न ${qIndex + 1} / 5` : `Question ${qIndex + 1} / 5`}
                </span>
                <button
                  onClick={() => {
                    const q = quizQuestions[qIndex];
                    if (lang === 'hi') {
                      playSpeech(`यह ${q.item.nameHi} है। इसका सही रंग क्या है?`, 'hi-IN');
                    } else {
                      playSpeech(`What is the color of this ${q.item.nameEn}?`, 'en-IN');
                    }
                  }}
                  className="p-2 bg-pink-50 text-pink-700 hover:bg-pink-100 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  <Volume2 className="w-4 h-4" /> {lang === 'hi' ? 'आवाज़ सुनें' : 'Listen'}
                </button>
              </div>

              <div className="text-center my-6">
                <div className="w-28 h-28 mx-auto bg-slate-50 border-2 border-slate-200 rounded-3xl flex items-center justify-center text-6xl shadow-inner mb-3">
                  {quizQuestions[qIndex].item.emoji}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">
                  {lang === 'hi' ? `${quizQuestions[qIndex].item.nameHi} (${quizQuestions[qIndex].item.nameEn})` : quizQuestions[qIndex].item.nameEn}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {lang === 'hi' ? 'इस वस्तु का स्वाभाविक रंग क्या होता है?' : 'What is the natural color of this object?'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto my-6">
                {quizQuestions[qIndex].options.map((opt: ColorItem) => {
                  const isChosen = selectedOption === opt.id;
                  const isTarget = opt.id === quizQuestions[qIndex].correctColor.id;

                  let cardStyle = 'bg-white border-2 border-slate-200 hover:border-pink-400 hover:shadow-md';
                  if (selectedOption !== null) {
                    if (isTarget) cardStyle = 'bg-emerald-50 border-2 border-emerald-500 shadow-md';
                    else if (isChosen) cardStyle = 'bg-rose-50 border-2 border-rose-500';
                    else cardStyle = 'opacity-50 border border-slate-200';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt)}
                      disabled={selectedOption !== null}
                      className={`p-4 rounded-2xl transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${cardStyle}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border border-black/10 shadow-sm"
                        style={{ backgroundColor: opt.hex }}
                      />
                      <span className="font-black text-base text-slate-900">
                        {lang === 'hi' ? opt.nameHi : opt.nameEn}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {lang === 'hi' ? opt.nameEn : opt.nameHi}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="text-center animate-in fade-in">
                  <button
                    onClick={handleNextQuestion}
                    className="py-3 px-8 bg-pink-600 hover:bg-pink-700 text-white font-black text-sm rounded-xl shadow-lg transition cursor-pointer inline-flex items-center gap-2"
                  >
                    {lang === 'hi' ? 'अगला प्रश्न (Next)' : 'Next Question'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center my-auto p-6 max-w-md mx-auto animate-in zoom-in-95">
              <div className="w-20 h-20 bg-pink-500 text-white rounded-3xl flex items-center justify-center text-4xl mx-auto mb-3 shadow-lg">
                🏆
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                {lang === 'hi' ? 'अद्भुत प्रदर्शन!' : 'Well Done!'}
              </h2>
              <p className="text-xs font-bold text-pink-700 mb-4">
                {lang === 'hi' ? 'रंग पहचान रिपोर्ट कार्ड' : 'Color Knowledge Report Card'}
              </p>
              
              <div className="flex justify-center gap-2 mb-4">
                <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
                <span className="text-xs text-slate-500 block">{lang === 'hi' ? 'कुल स्कोर' : 'Total Score'}</span>
                <span className="text-2xl font-black text-slate-900">{score} / 5</span>
              </div>

              <button
                onClick={initQuiz}
                className="py-3 px-8 bg-pink-600 hover:bg-pink-700 text-white font-black text-sm rounded-xl shadow-lg transition cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> {lang === 'hi' ? 'दोबारा खेलें' : 'Play Again'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* 2. KIDS MS PAINT CANVAS                                   */}
      {/* -------------------------------------------------------- */}
      {subTab === 'paint' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
          
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-200 pb-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTool('brush')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  tool === 'brush' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Paintbrush className="w-4 h-4" /> {lang === 'hi' ? 'ब्रश (Brush)' : 'Brush'}
              </button>
              <button
                onClick={() => setTool('bucket')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  tool === 'bucket' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <PaintBucket className="w-4 h-4" /> {lang === 'hi' ? 'बाल्टी रंग (Fill)' : 'Paint Bucket'}
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  tool === 'eraser' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Eraser className="w-4 h-4" /> {lang === 'hi' ? 'मिटाओ (Eraser)' : 'Eraser'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{lang === 'hi' ? 'आकार:' : 'Size:'}</span>
              <input
                type="range"
                min="2"
                max="30"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Undo2 className="w-4 h-4" /> Undo
              </button>
              <button
                onClick={clearCanvas}
                className="p-2 bg-slate-100 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> {lang === 'hi' ? 'साफ करें' : 'Clear'}
              </button>
              <button
                onClick={downloadCanvas}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow"
              >
                <Download className="w-4 h-4" /> {lang === 'hi' ? 'सहेजें (Save)' : 'Save Art'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-black text-slate-600 shrink-0">{lang === 'hi' ? 'रंग:' : 'Colors:'}</span>
            {COLOR_DATABASE.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setPaintColor(c.hex);
                  if (tool === 'eraser') setTool('brush');
                  if (lang === 'hi') playSpeech(c.nameHi, 'hi-IN');
                  else playSpeech(c.nameEn, 'en-IN');
                }}
                className={`w-7 h-7 rounded-full border-2 shrink-0 transition-transform cursor-pointer ${
                  paintColor === c.hex && tool !== 'eraser' ? 'scale-125 border-slate-900 shadow' : 'border-slate-300'
                }`}
                style={{ backgroundColor: c.hex }}
                title={`${c.nameHi} / ${c.nameEn}`}
              />
            ))}
          </div>

          <div className="w-full flex justify-center bg-slate-100 p-2 rounded-2xl border border-slate-200">
            <canvas
              ref={canvasRef}
              width={750}
              height={450}
              onMouseDown={handleCanvasInteractionStart}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={handleCanvasInteractionStart}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="bg-white rounded-xl shadow cursor-crosshair max-w-full touch-none"
            />
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* 3. TAP-TO-FILL COLORING BOOK (8 COLORING PAGES)          */}
      {/* -------------------------------------------------------- */}
      {subTab === 'coloring' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4">
          
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700 shrink-0">{lang === 'hi' ? 'चित्र चुनें:' : 'Select Picture:'}</span>
              {/* Horizontal Scrollable tray for all 8 pictures */}
              <div className="flex gap-1.5 overflow-x-auto max-w-xl pb-1">
                {PRESET_OUTLINES.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedOutlineIdx(idx);
                      setColorBookFills({});
                      setColorBookHistory([]);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition shrink-0 ${
                      selectedOutlineIdx === idx ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {lang === 'hi' ? item.titleHi : item.titleEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleColorBookUndo}
                disabled={colorBookHistory.length === 0}
                className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Undo2 className="w-4 h-4" /> Undo
              </button>
              <button
                onClick={handleDownloadSVG}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow"
              >
                <Download className="w-4 h-4" /> {lang === 'hi' ? 'सहेजें (Save)' : 'Save SVG'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-black text-slate-600 shrink-0">
              {lang === 'hi' ? 'रंग चुनें और भाग पर टैप करें:' : 'Pick a color and tap any section:'}
            </span>
            {COLOR_DATABASE.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedBookColor(c.hex);
                  if (lang === 'hi') playSpeech(c.nameHi, 'hi-IN');
                  else playSpeech(c.nameEn, 'en-IN');
                }}
                className={`w-8 h-8 rounded-full border-2 shrink-0 transition-transform cursor-pointer ${
                  selectedBookColor === c.hex ? 'scale-125 border-slate-900 shadow-md' : 'border-slate-300'
                }`}
                style={{ backgroundColor: c.hex }}
                title={`${c.nameHi} / ${c.nameEn}`}
              />
            ))}
          </div>

          {/* SVG Canvas for Coloring */}
          <div className="w-full flex justify-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <svg
              id="coloring-svg-canvas"
              viewBox="0 0 400 400"
              className="w-full max-w-[420px] aspect-square rounded-2xl shadow border border-slate-200 select-none bg-white"
            >
              {/* Background Rect */}
              <rect
                width="400"
                height="400"
                fill={colorBookFills[`bg-${PRESET_OUTLINES[selectedOutlineIdx].id}`] || '#FFFFFF'}
                onClick={() => handleFillSegment(`bg-${PRESET_OUTLINES[selectedOutlineIdx].id}`)}
                className="cursor-pointer"
              />

              {/* Segmented Shapes */}
              {PRESET_OUTLINES[selectedOutlineIdx].paths.map((p) => {
                if (p.isBg) return null;
                const fillColor = colorBookFills[p.id] || '#FFFFFF';
                return (
                  <path
                    key={p.id}
                    d={p.d}
                    fill={p.strokeOnly ? 'none' : fillColor}
                    stroke="#1E293B"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={() => !p.strokeOnly && handleFillSegment(p.id)}
                    className={p.strokeOnly ? '' : 'cursor-pointer hover:opacity-90 transition-colors'}
                  />
                );
              })}
            </svg>
          </div>

          <div className="text-center text-xs font-bold text-slate-500">
            💡 {lang === 'hi' 
              ? 'किसी भी रंग को चुनें और चित्र के भाग (या पृष्ठभूमि) पर टैप करें!' 
              : 'Pick any color and tap on the picture section or background to color it!'}
          </div>

        </div>
      )}

    </div>
  );
}