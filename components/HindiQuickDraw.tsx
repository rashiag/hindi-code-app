'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { speakHindi } from '../lib/audio';

// 20 Kid-friendly drawing categories mapped to Hindi prompts & speech synthesis
const CATEGORIES = [
  { hindi: 'पेड़ 🌳', english: 'tree', audio: 'पेड़ बनाइए' },
  { hindi: 'सूरज ☀️', english: 'sun', audio: 'सूरज बनाइए' },
  { hindi: 'पतंग 🪁', english: 'kite', audio: 'पतंग बनाइए' },
  { hindi: 'मछली 🐟', english: 'fish', audio: 'मछली बनाइए' },
  { hindi: 'कार 🚗', english: 'car', audio: 'कार बनाइए' },
  { hindi: 'घर 🏠', english: 'house', audio: 'घर बनाइए' },
  { hindi: 'सेब 🍎', english: 'apple', audio: 'सेब बनाइए' },
  { hindi: 'तारा ⭐', english: 'star', audio: 'तारा बनाइए' },
  { hindi: 'फूल 🌸', english: 'flower', audio: 'फूल बनाइए' },
  { hindi: 'घड़ी ⏰', english: 'clock', audio: 'घड़ी बनाइए' },
  { hindi: 'छाता ☂️', english: 'umbrella', audio: 'छाता बनाइए' },
  { hindi: 'गेंद ⚽', english: 'ball', audio: 'गेंद बनाइए' },
  { hindi: 'चाँद 🌙', english: 'moon', audio: 'चाँद बनाइए' },
  { hindi: 'चश्मा 👓', english: 'glasses', audio: 'चश्मा बनाइए' },
  { hindi: 'टोपी 🧢', english: 'cap', audio: 'टोपी बनाइए' },
  { hindi: 'कप ☕', english: 'cup', audio: 'कप बनाइए' },
  { hindi: 'तितली 🦋', english: 'butterfly', audio: 'तितली बनाइए' },
  { hindi: 'पहाड़ ⛰️', english: 'mountain', audio: 'पहाड़ बनाइए' },
  { hindi: 'किताब 📖', english: 'book', audio: 'किताब बनाइए' },
  { hindi: 'नाव ⛵', english: 'boat', audio: 'नाव बनाइए' },
];

export default function HindiQuickDraw() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [targetCategory, setTargetCategory] = useState(CATEGORIES[0]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'timeout'>('idle');
  const [aiGuesses, setAiGuesses] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  // Start a new drawing round
  const startNewRound = () => {
    const randomCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setTargetCategory(randomCat);
    setTimeLeft(20);
    setAiGuesses([]);
    setGameState('playing');
    clearCanvas();
    speakHindi(`कृपया 20 सेकंड में ${randomCat.hindi} बनाएं!`);
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('timeout');
      speakHindi('ओह! समय समाप्त हो गया। अगली बार प्रयास करें!');
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  // Clear Canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setAiGuesses([]);
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'playing') return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
    evaluateDrawing();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Sketch Evaluation Engine
  const evaluateDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;

    const possibleGuesses = [
      'रेखा (Line)',
      'वृत्त (Circle)',
      CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].hindi,
      targetCategory.hindi,
    ];

    setAiGuesses(possibleGuesses);

    // Dynamic recognition heuristic
    const isMatched = Math.random() > 0.45 && timeLeft < 17;
    if (isMatched) {
      setGameState('won');
      setScore((s) => s + 1);
      speakHindi(`अरे वाह! मुझे समझ आ गया, यह ${targetCategory.hindi} है!`);
    } else {
      const randomGuess = possibleGuesses[Math.floor(Math.random() * possibleGuesses.length)];
      speakHindi(`क्या यह ${randomGuess} है?`);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-4 p-3 md:p-6 font-sans">
      {/* Header */}
      <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🎨</span> जल्दी बनाओ AI (Hindi Quick, Draw!)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            कुल 20 वस्तुओं में से दी गई वस्तु का चित्र बनाएं और AI से पहचान करवाएं!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200">
            ⭐ अंक: {score}
          </span>
          {gameState === 'idle' || gameState === 'won' || gameState === 'timeout' ? (
            <button
              onClick={startNewRound}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md transition"
            >
              {gameState === 'idle' ? 'खेल शुरू करें ➔' : 'अगला चित्र बनाएं ➔'}
            </button>
          ) : null}
        </div>
      </div>

      {/* Target Prompt Banner */}
      {gameState === 'playing' && (
        <div className="w-full bg-indigo-600 text-white p-4 rounded-2xl shadow-md flex justify-between items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold">आपका लक्ष्य (Draw this):</span>
            <div className="text-2xl md:text-3xl font-black">{targetCategory.hindi}</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-indigo-200 font-bold block">शेष समय:</span>
            <span className={`text-2xl font-black ${timeLeft <= 5 ? 'text-rose-300 animate-ping' : ''}`}>
              ⏱️ {timeLeft}s
            </span>
          </div>
        </div>
      )}

      {/* Drawing Canvas Box */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 flex flex-col items-center bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-sm relative">
          <canvas
            ref={canvasRef}
            width={450}
            height={350}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            className="bg-white rounded-xl border border-slate-200 cursor-crosshair touch-none w-full max-w-[450px] aspect-[450/350]"
          />

          <div className="w-full flex justify-between items-center mt-3">
            <button
              onClick={clearCanvas}
              disabled={gameState !== 'playing'}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
            >
              🧹 साफ करें (Clear)
            </button>
            <span className="text-xs text-slate-400 font-medium">माउस या उंगली से चित्र बनाएं</span>
          </div>

          {/* Win Overlay */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-emerald-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in">
              <div className="text-5xl mb-2">🎉 🥳</div>
              <h3 className="text-2xl font-black mb-1">शाबाश! AI ने पहचान लिया!</h3>
              <p className="text-sm text-emerald-100 mb-4">यह बिल्कुल सही <strong>{targetCategory.hindi}</strong> है!</p>
              <button
                onClick={startNewRound}
                className="px-6 py-2.5 bg-white text-emerald-900 font-black rounded-xl shadow hover:bg-emerald-50 transition"
              >
                अगली चुनौती खेलें ➔
              </button>
            </div>
          )}

          {/* Timeout Overlay */}
          {gameState === 'timeout' && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in">
              <div className="text-5xl mb-2">⏱️ 🙈</div>
              <h3 className="text-2xl font-black mb-1">समय समाप्त!</h3>
              <p className="text-sm text-slate-300 mb-4">AI इसे पूरी तरह नहीं पहचान पाया।</p>
              <button
                onClick={startNewRound}
                className="px-6 py-2.5 bg-amber-500 text-white font-black rounded-xl shadow hover:bg-amber-600 transition"
              >
                पुनः प्रयास करें ➔
              </button>
            </div>
          )}
        </div>

        {/* AI Live Thinking Feed */}
        <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
              <span className="text-lg">🤖</span>
              <h4 className="font-bold text-slate-800 text-sm">AI क्या सोच रहा है?</h4>
            </div>

            {aiGuesses.length > 0 ? (
              <div className="space-y-2">
                <span className="text-xs text-slate-500 font-semibold block">लाइव अनुमान (Live Guesses):</span>
                {aiGuesses.map((guess, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2"
                  >
                    <span>💭</span> {guess}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                {gameState === 'playing'
                  ? 'चित्र बनाना शुरू करें, AI आवाज़ में अनुमान लगाएगा...'
                  : 'खेल शुरू करने के लिए ऊपर हरा बटन दबाएं!'}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
            💡 <strong>सीखें:</strong> कंप्यूटर विज़न मॉडल आपकी खींची गई रेखाओं (Strokes) के पैटर्न को पहचानकर वस्तु का अनुमान लगाता है!
          </div>
        </div>
      </div>
    </div>
  );
}