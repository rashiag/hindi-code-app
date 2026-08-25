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
  items: { name: string; emoji: string }[];
}

const COLOR_DATABASE: ColorItem[] = [
  { id: 'red', nameEn: 'Red', nameHi: 'लाल', hex: '#EF4444', items: [{ name: 'Apple (सेब)', emoji: '🍎' }, { name: 'Tomato (टमाटर)', emoji: '🍅' }, { name: 'Strawberry (स्ट्रॉबेरी)', emoji: '🍓' }] },
  { id: 'yellow', nameEn: 'Yellow', nameHi: 'पीला', hex: '#FACC15', items: [{ name: 'Banana (केला)', emoji: '🍌' }, { name: 'Sun (सूरज)', emoji: '☀️' }, { name: 'Sunflower (सूरजमुखी)', emoji: '🌻' }] },
  { id: 'blue', nameEn: 'Blue', nameHi: 'नीला', hex: '#3B82F6', items: [{ name: 'Sky (आसमान)', emoji: '🌌' }, { name: 'Ocean (समुद्र)', emoji: '🌊' }, { name: 'Blueberry (ब्लूबेरी)', emoji: '🫐' }] },
  { id: 'green', nameEn: 'Green', nameHi: 'हरा', hex: '#22C55E', items: [{ name: 'Leaf (पत्ता)', emoji: '🍃' }, { name: 'Frog (मेंढक)', emoji: '🐸' }, { name: 'Broccoli (ब्रोकली)', emoji: '🥦' }] },
  { id: 'orange', nameEn: 'Orange', nameHi: 'नारंगी', hex: '#F97316', items: [{ name: 'Orange (संतरा)', emoji: '🍊' }, { name: 'Carrot (गाजर)', emoji: '🥕' }, { name: 'Pumpkin (कद्दू)', emoji: '🎃' }] },
  { id: 'purple', nameEn: 'Purple', nameHi: 'बैंगनी', hex: '#9333EA', items: [{ name: 'Brinjal (बैंगन)', emoji: '🍆' }, { name: 'Grapes (अंगूर)', emoji: '🍇' }] },
  { id: 'pink', nameEn: 'Pink', nameHi: 'गुलाबी', hex: '#EC4899', items: [{ name: 'Lotus (कमल)', emoji: '🪷' }, { name: 'Flamingo (राजहंस)', emoji: '🦩' }] },
  { id: 'brown', nameEn: 'Brown', nameHi: 'भूरा', hex: '#854D0E', items: [{ name: 'Coconut (नारियल)', emoji: '🥥' }, { name: 'Wood (लकड़ी)', emoji: '🪵' }, { name: 'Chocolate (चॉकलेट)', emoji: '🍫' }] },
  { id: 'black', nameEn: 'Black', nameHi: 'काला', hex: '#1E293B', items: [{ name: 'Crow (कौआ)', emoji: '🐦‍⬛' }, { name: 'Coal (कोयला)', emoji: '⚫' }] },
  { id: 'white', nameEn: 'White', nameHi: 'सफेद', hex: '#FFFFFF', items: [{ name: 'Milk (दूध)', emoji: '🥛' }, { name: 'Snow (बर्फ़)', emoji: '❄️' }, { name: 'Egg (अंडा)', emoji: '🥚' }] }
];

const PRESET_OUTLINES = [
  {
    id: 'apple',
    title: 'रसीला सेब (Apple)',
    paths: [
      { id: 'bg-apple', isBg: true, label: 'पृष्ठभूमि (Background)' },
      { id: 'leaf', d: 'M 190 70 C 230 40, 260 60, 240 90 C 210 100, 190 70, 190 70 Z', label: 'पत्ता (Leaf)' },
      { id: 'stem', d: 'M 195 75 Q 190 120 200 130', strokeOnly: true },
      { id: 'body', d: 'M 200 130 C 130 90, 80 160, 90 240 C 100 320, 160 350, 200 330 C 240 350, 300 320, 310 240 C 320 160, 270 90, 200 130 Z', label: 'सेब (Apple Body)' }
    ]
  },
  {
    id: 'butterfly',
    title: 'तितली (Butterfly)',
    paths: [
      { id: 'bg-butterfly', isBg: true, label: 'पृष्ठभूमि (Background)' },
      { id: 'left-wing-top', d: 'M 200 170 C 140 100, 70 120, 80 190 C 90 240, 170 230, 200 210 Z', label: 'बायां पंख ऊपर' },
      { id: 'left-wing-bottom', d: 'M 200 210 C 130 230, 90 310, 130 330 C 170 340, 190 280, 200 250 Z', label: 'बायां पंख नीचे' },
      { id: 'right-wing-top', d: 'M 200 170 C 260 100, 330 120, 320 190 C 310 240, 230 230, 200 210 Z', label: 'दायां पंख ऊपर' },
      { id: 'right-wing-bottom', d: 'M 200 210 C 270 230, 310 310, 270 330 C 230 340, 210 280, 200 250 Z', label: 'दायां पंख नीचे' },
      { id: 'body', d: 'M 192 150 Q 200 130 208 150 L 208 300 Q 200 320 192 300 Z', label: 'तितली धड़' }
    ]
  },
  {
    id: 'house',
    title: 'सुंदर घर (House)',
    paths: [
      { id: 'bg-house', isBg: true, label: 'पृष्ठभूमि (Background)' },
      { id: 'roof', d: 'M 80 180 L 200 80 L 320 180 Z', label: 'छत (Roof)' },
      { id: 'walls', d: 'M 100 180 L 300 180 L 300 320 L 100 320 Z', label: 'दीवार (Walls)' },
      { id: 'door', d: 'M 170 240 L 230 240 L 230 320 L 170 320 Z', label: 'दरवाज़ा (Door)' },
      { id: 'window', d: 'M 120 205 L 150 205 L 150 235 L 120 235 Z', label: 'खिड़की (Window)' }
    ]
  },
  {
    id: 'fish',
    title: 'मछली (Fish)',
    paths: [
      { id: 'bg-fish', isBg: true, label: 'पृष्ठभूमि (Background)' },
      { id: 'body', d: 'M 100 200 C 140 120, 270 120, 300 200 C 270 280, 140 280, 100 200 Z', label: 'मछली का शरीर' },
      { id: 'tail', d: 'M 295 200 L 350 140 L 330 200 L 350 260 Z', label: 'पूँछ (Tail)' },
      { id: 'fin', d: 'M 190 150 C 210 110, 230 110, 240 150 Z', label: 'फिन (Fin)' }
    ]
  }
];

export function HindiArtStudio() {
  const [subTab, setSubTab] = useState<'quiz' | 'paint' | 'coloring'>('quiz');

  // Audio helper with guaranteed flush & cancellation
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
  };

  const playBilingualSpeech = (hindiText: string, englishText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      stopAllAudio();

      const hiUtterance = new SpeechSynthesisUtterance(hindiText);
      hiUtterance.lang = 'hi-IN';
      hiUtterance.rate = 0.85;

      hiUtterance.onend = () => {
        speechTimeoutRef.current = setTimeout(() => {
          const enUtterance = new SpeechSynthesisUtterance(englishText);
          enUtterance.lang = 'en-US';
          enUtterance.rate = 0.85;
          window.speechSynthesis.speak(enUtterance);
        }, 550);
      };

      window.speechSynthesis.speak(hiUtterance);
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
      const cleanItemNameHi = q.item.name.includes('(') ? q.item.name.split('(')[1].replace(')', '') : q.item.name;
      const cleanItemNameEn = q.item.name.includes('(') ? q.item.name.split('(')[0].trim() : q.item.name;

      playBilingualSpeech(
        `यह क्या है? ${cleanItemNameHi}। इसका सही रंग चुनो।`,
        `What is the color of ${cleanItemNameEn}?`
      );
    }
  }, [qIndex, subTab, quizQuestions, quizFinished]);

  const handleSelectOption = (opt: ColorItem) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt.id);

    const isCorrect = opt.id === quizQuestions[qIndex].correctColor.id;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playBilingualSpeech(`शाबाश! सही उत्तर है ${opt.nameHi}`, `Correct! It is ${opt.nameEn}`);
    } else {
      playBilingualSpeech(
        `यह गलत है। सही रंग है ${quizQuestions[qIndex].correctColor.nameHi}`,
        `Incorrect. The correct color is ${quizQuestions[qIndex].correctColor.nameEn}`
      );
    }
  };

  const handleNextQuestion = () => {
    stopAllAudio();
    if (qIndex + 1 < quizQuestions.length) {
      setQIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      playBilingualSpeech(
        `बधाई हो! आपने 5 में से ${score + (selectedOption === quizQuestions[qIndex].correctColor.id ? 1 : 0)} सही उत्तर दिए!`,
        `Great job! You finished the quiz!`
      );
    }
  };

  // -------------------------------------------------------------
  // ACTIVITY 2: KIDS MS PAINT CANVAS (WITH 4-WAY FLOOD FILL)
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

  // Parse Hex to RGBA
  const hexToRgba = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
  };

  // True 4-Way BFS Flood Fill for Paint Bucket
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

    // Already the same color
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
    
    // Scale coordinates accurately
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
  // ACTIVITY 3: TAP-TO-FILL COLORING BOOK
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
    <div className="flex flex-col gap-4 max-w-6xl mx-auto">
      
      {/* Top Activity Mode Selector */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          <div>
            <h2 className="text-sm md:text-base font-black text-slate-900 leading-tight">
              कला व रंग वाटिका (Art &amp; Colors)
            </h2>
            <span className="text-[11px] font-bold text-pink-600">NEP 2020 Foundational Creativity</span>
          </div>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => { stopAllAudio(); setSubTab('quiz'); }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition ${
              subTab === 'quiz' ? 'bg-pink-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🎯 1. रंग पहचानो (Quiz)
          </button>
          <button
            onClick={() => { stopAllAudio(); setSubTab('paint'); }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition ${
              subTab === 'paint' ? 'bg-purple-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🖌️ 2. मेरा कैनवास (MS Paint)
          </button>
          <button
            onClick={() => { stopAllAudio(); setSubTab('coloring'); }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition ${
              subTab === 'coloring' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🖍️ 3. रंग भरो (Coloring Book)
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------- */}
      {/* 1. COLOR IDENTIFICATION QUIZ                             */}
      {/* -------------------------------------------------------- */}
      {subTab === 'quiz' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-8 min-h-[500px] flex flex-col justify-between">
          {!quizFinished && quizQuestions.length > 0 ? (
            <div>
              {/* Header Progress */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  प्रश्न {qIndex + 1} / 5
                </span>
                <button
                  onClick={() => {
                    const q = quizQuestions[qIndex];
                    const cleanItemNameHi = q.item.name.includes('(') ? q.item.name.split('(')[1].replace(')', '') : q.item.name;
                    const cleanItemNameEn = q.item.name.includes('(') ? q.item.name.split('(')[0].trim() : q.item.name;
                    playBilingualSpeech(
                      `यह ${cleanItemNameHi} है। इसका सही रंग क्या है?`,
                      `What is the color of ${cleanItemNameEn}?`
                    );
                  }}
                  className="p-2 bg-pink-50 text-pink-700 hover:bg-pink-100 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  <Volume2 className="w-4 h-4" /> आवाज़ सुनें
                </button>
              </div>

              {/* Central Target Object */}
              <div className="text-center my-6">
                <div className="w-28 h-28 mx-auto bg-slate-50 border-2 border-slate-200 rounded-3xl flex items-center justify-center text-6xl shadow-inner mb-3">
                  {quizQuestions[qIndex].item.emoji}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">
                  {quizQuestions[qIndex].item.name}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  इस वस्तु का स्वाभाविक रंग क्या होता है?
                </p>
              </div>

              {/* 3 Color Options */}
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
                      <span className="font-black text-base text-slate-900">{opt.nameHi}</span>
                      <span className="text-xs font-bold text-slate-500">{opt.nameEn}</span>
                    </button>
                  );
                })}
              </div>

              {/* Next Question Bar */}
              {selectedOption !== null && (
                <div className="text-center animate-in fade-in">
                  <button
                    onClick={handleNextQuestion}
                    className="py-3 px-8 bg-pink-600 hover:bg-pink-700 text-white font-black text-sm rounded-xl shadow-lg transition cursor-pointer inline-flex items-center gap-2"
                  >
                    अगला प्रश्न (Next) <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completion Card */
            <div className="text-center my-auto p-6 max-w-md mx-auto animate-in zoom-in-95">
              <div className="w-20 h-20 bg-pink-500 text-white rounded-3xl flex items-center justify-center text-4xl mx-auto mb-3 shadow-lg">
                🏆
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">अद्भुत प्रदर्शन!</h2>
              <p className="text-xs font-bold text-pink-700 mb-4">रंग पहचान रिपोर्ट कार्ड (Color Report)</p>
              
              <div className="flex justify-center gap-2 mb-4">
                <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
                <span className="text-xs text-slate-500 block">कुल स्कोर (Total Score)</span>
                <span className="text-2xl font-black text-slate-900">{score} / 5</span>
              </div>

              <button
                onClick={initQuiz}
                className="py-3 px-8 bg-pink-600 hover:bg-pink-700 text-white font-black text-sm rounded-xl shadow-lg transition cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> दोबारा खेलें (Play Again)
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
          
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-200 pb-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTool('brush')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  tool === 'brush' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Paintbrush className="w-4 h-4" /> ब्रश (Brush)
              </button>
              <button
                onClick={() => setTool('bucket')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  tool === 'bucket' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <PaintBucket className="w-4 h-4" /> बाल्टी रंग (Fill)
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  tool === 'eraser' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Eraser className="w-4 h-4" /> मिटाओ (Eraser)
              </button>
            </div>

            {/* Brush Size */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">आकार:</span>
              <input
                type="range"
                min="2"
                max="30"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 cursor-pointer"
              />
            </div>

            {/* Actions */}
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
                <RefreshCw className="w-4 h-4" /> साफ करें
              </button>
              <button
                onClick={downloadCanvas}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow"
              >
                <Download className="w-4 h-4" /> सहेजें (Save)
              </button>
            </div>
          </div>

          {/* Color Palette */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-black text-slate-600 shrink-0">रंग:</span>
            {COLOR_DATABASE.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setPaintColor(c.hex);
                  if (tool === 'eraser') setTool('brush');
                  playBilingualSpeech(c.nameHi, c.nameEn);
                }}
                className={`w-7 h-7 rounded-full border-2 shrink-0 transition-transform cursor-pointer ${
                  paintColor === c.hex && tool !== 'eraser' ? 'scale-125 border-slate-900 shadow' : 'border-slate-300'
                }`}
                style={{ backgroundColor: c.hex }}
                title={`${c.nameHi} / ${c.nameEn}`}
              />
            ))}
          </div>

          {/* Canvas */}
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
      {/* 3. TAP-TO-FILL COLORING BOOK                             */}
      {/* -------------------------------------------------------- */}
      {subTab === 'coloring' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4">
          
          {/* Top Outlines Selector */}
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700">चित्र चुनें:</span>
              <div className="flex gap-1.5 flex-wrap">
                {PRESET_OUTLINES.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedOutlineIdx(idx);
                      setColorBookFills({});
                      setColorBookHistory([]);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition ${
                      selectedOutlineIdx === idx ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.title}
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
                <Download className="w-4 h-4" /> सहेजें (Save)
              </button>
            </div>
          </div>

          {/* Color Palette */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-black text-slate-600 shrink-0">रंग चुनें और भाग पर टैप करें:</span>
            {COLOR_DATABASE.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedBookColor(c.hex);
                  playBilingualSpeech(c.nameHi, c.nameEn);
                }}
                className={`w-8 h-8 rounded-full border-2 shrink-0 transition-transform cursor-pointer ${
                  selectedBookColor === c.hex ? 'scale-125 border-slate-900 shadow-md' : 'border-slate-300'
                }`}
                style={{ backgroundColor: c.hex }}
                title={`${c.nameHi} / ${c.nameEn}`}
              />
            ))}
          </div>

          {/* SVG Coloring Canvas with Background Area */}
          <div className="w-full flex justify-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <svg
              id="coloring-svg-canvas"
              viewBox="0 0 400 400"
              className="w-full max-w-[420px] aspect-square rounded-2xl shadow border border-slate-200 select-none"
            >
              {/* Clickable Background Rect */}
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
            💡 किसी भी रंग को चुनें और चित्र के भाग (या पृष्ठभूमि) पर टैप करें!
          </div>

        </div>
      )}

    </div>
  );
}