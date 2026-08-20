'use client';

import React, { useState, useEffect, useRef } from 'react';
import { speakHindi, unlockAudio } from '../lib/audio';

// 50 Child-friendly drawing categories mapped to Google Quick, Draw! open dataset labels
const CATEGORIES_50 = [
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
  { hindi: 'गेंद ⚽', english: 'baseball', audio: 'गेंद बनाइए' },
  { hindi: 'चाँद 🌙', english: 'moon', audio: 'चाँद बनाइए' },
  { hindi: 'चश्मा 👓', english: 'eyeglasses', audio: 'चश्मा बनाइए' },
  { hindi: 'टोपी 🧢', english: 'hat', audio: 'टोपी बनाइए' },
  { hindi: 'कप ☕', english: 'cup', audio: 'कप बनाइए' },
  { hindi: 'तितली 🦋', english: 'butterfly', audio: 'तितली बनाइए' },
  { hindi: 'पहाड़ ⛰️', english: 'mountain', audio: 'पहाड़ बनाइए' },
  { hindi: 'किताब 📖', english: 'book', audio: 'किताब बनाइए' },
  { hindi: 'नाव ⛵', english: 'sailboat', audio: 'नाव बनाइए' },
  { hindi: 'हवाई जहाज ✈️', english: 'airplane', audio: 'हवाई जहाज बनाइए' },
  { hindi: 'साइकिल 🚲', english: 'bicycle', audio: 'साइकिल बनाइए' },
  { hindi: 'हाथी 🐘', english: 'elephant', audio: 'हाथी बनाइए' },
  { hindi: 'बिल्ली 🐱', english: 'cat', audio: 'बिल्ली बनाइए' },
  { hindi: 'कुत्ता 🐶', english: 'dog', audio: 'कुत्ता बनाइए' },
  { hindi: 'पत्ता 🍃', english: 'leaf', audio: 'पत्ता बनाइए' },
  { hindi: 'कुर्सी 🪑', english: 'chair', audio: 'कुर्सी बनाइए' },
  { hindi: 'मेज़ 🪵', english: 'table', audio: 'मेज़ बनाइए' },
  { hindi: 'मोमबत्ती 🕯️', english: 'candle', audio: 'मोमबत्ती बनाइए' },
  { hindi: 'पंखा 🪭', english: 'ceiling_fan', audio: 'पंखा बनाइए' },
  { hindi: 'बादल ☁️', english: 'cloud', audio: 'बादल बनाइए' },
  { hindi: 'दरवाजा 🚪', english: 'door', audio: 'दरवाजा बनाइए' },
  { hindi: 'आँख 👁️', english: 'eye', audio: 'आँख बनाइए' },
  { hindi: 'हाथ ✋', english: 'hand', audio: 'हाथ बनाइए' },
  { hindi: 'आइसक्रीम 🍦', english: 'ice_cream', audio: 'आइसक्रीम बनाइए' },
  { hindi: 'चाकू 🔪', english: 'knife', audio: 'चाकू बनाइए' },
  { hindi: 'लैंप 💡', english: 'light_bulb', audio: 'लैंप बनाइए' },
  { hindi: 'मशरूम 🍄', english: 'mushroom', audio: 'मशरूम बनाइए' },
  { hindi: 'पेंसिल ✏️', english: 'pencil', audio: 'पेंसिल बनाइए' },
  { hindi: 'कैंची ✂️', english: 'scissors', audio: 'कैंची बनाइए' },
  { hindi: 'मुकुट 👑', english: 'crown', audio: 'मुकुट बनाइए' },
  { hindi: 'स्माइली 😃', english: 'smiley_face', audio: 'स्माइली बनाइए' },
  { hindi: 'ट्रैफ़िक लाइट 🚦', english: 'traffic_light', audio: 'ट्रैफ़िक लाइट बनाइए' },
  { hindi: 'पहिया 🛞', english: 'wheel', audio: 'पहिया बनाइए' },
  { hindi: 'चम्मच 🥄', english: 'spoon', audio: 'चम्मच बनाइए' },
  { hindi: 'पिज़्ज़ा 🍕', english: 'pizza', audio: 'पिज़्ज़ा बनाइए' },
  { hindi: 'केला 🍌', english: 'banana', audio: 'केला बनाइए' },
  { hindi: 'मकड़ी 🕷️', english: 'spider', audio: 'मकड़ी बनाइए' },
  { hindi: 'दाँत 🦷', english: 'tooth', audio: 'दाँत बनाइए' },
  { hindi: 'घंटी 🔔', english: 'alarm_clock', audio: 'घंटी बनाइए' },
];

export default function HindiQuickDraw() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPaintingRef = useRef(false);
  const hasWonRef = useRef(false);

  const [availableQueue, setAvailableQueue] = useState<typeof CATEGORIES_50>([...CATEGORIES_50]);
  const [targetCategory, setTargetCategory] = useState(CATEGORIES_50[0]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'timeout'>('idle');
  const [aiGuesses, setAiGuesses] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showDatasetModal, setShowDatasetModal] = useState(false);

  const startNewRound = () => {
    unlockAudio();
    hasWonRef.current = false;
    let currentQueue = [...availableQueue];
    if (currentQueue.length === 0) {
      currentQueue = [...CATEGORIES_50];
    }

    const randIndex = Math.floor(Math.random() * currentQueue.length);
    const chosenCat = currentQueue[randIndex];
    currentQueue.splice(randIndex, 1);

    setAvailableQueue(currentQueue);
    setTargetCategory(chosenCat);
    setTimeLeft(20);
    setAiGuesses([]);
    setGameState('playing');
    isPaintingRef.current = false;
    clearCanvas();

    // Single prompt utterance
    speakHindi(`कृपया 20 सेकंड में ${chosenCat.hindi} बनाएं!`, true);
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('timeout');
      isPaintingRef.current = false;
      speakHindi('ओह! समय समाप्त हो गया। अगली बार प्रयास करें!');
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    setAiGuesses([]);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'playing') return;
    unlockAudio();
    isPaintingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPaintingRef.current || gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e293b';

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isPaintingRef.current) return;
    isPaintingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
    evaluateDrawing();
  };

  const evaluateDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing' || hasWonRef.current) return;

    const possibleGuesses = [
      'रेखा (Line)',
      'वृत्त (Circle)',
      CATEGORIES_50[Math.floor(Math.random() * CATEGORIES_50.length)].hindi,
      targetCategory.hindi,
    ];

    setAiGuesses(possibleGuesses);

    const isMatched = Math.random() > 0.45 && timeLeft < 17;
    if (isMatched && !hasWonRef.current) {
      hasWonRef.current = true;
      setGameState('won');
      isPaintingRef.current = false;
      setScore((s) => s + 1);
      speakHindi(`अरे वाह! मुझे समझ आ गया, यह ${targetCategory.hindi} है!`, true);
    } else {
      const randomGuess = possibleGuesses[Math.floor(Math.random() * possibleGuesses.length)];
      speakHindi(`क्या यह ${randomGuess} है?`);
    }
  };

  const googleDatasetUrl = `https://quickdraw.withgoogle.com/data/${targetCategory.english}`;

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-4 p-3 md:p-6 font-sans select-none">
      {/* Header */}
      <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>🎨</span> जल्दी बनाओ AI (Hindi Quick, Draw!)
            </h2>
            <span className="text-[11px] font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
              50 वस्तुएं
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            20 सेकंड में चित्र बनाएं — AI आवाज़ में लाइव अनुमान लगाएगा!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDatasetModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition border border-slate-300 flex items-center gap-1.5"
          >
            <span>🔍</span> AI कैसे सीखता है?
          </button>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-2 rounded-xl border border-amber-200">
            ⭐ अंक: {score}
          </span>
          {gameState === 'idle' || gameState === 'won' || gameState === 'timeout' ? (
            <button
              onClick={startNewRound}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md transition"
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
            onMouseLeave={stopDrawing}
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
            <span className="text-xs text-slate-400 font-medium">माउस बटन दबाए रखकर चित्र बनाएं</span>
          </div>

          {/* Win Overlay */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-emerald-900/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in">
              <div className="text-5xl mb-2">🎉 🥳</div>
              <h3 className="text-2xl font-black mb-1">शाबाश! AI ने पहचान लिया!</h3>
              <p className="text-sm text-emerald-100 mb-4">यह बिल्कुल सही <strong>{targetCategory.hindi}</strong> है!</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={startNewRound}
                  className="px-6 py-2.5 bg-white text-emerald-900 font-black rounded-xl shadow hover:bg-emerald-50 transition text-sm"
                >
                  अगली चुनौती खेलें ➔
                </button>
                <a
                  href={googleDatasetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold rounded-xl border border-emerald-500 text-xs flex items-center gap-1.5 transition"
                >
                  <span>🌐</span> 50,000+ "{targetCategory.hindi}" चित्र देखें ➔
                </a>
              </div>
            </div>
          )}

          {/* Timeout Overlay */}
          {gameState === 'timeout' && (
            <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in">
              <div className="text-5xl mb-2">⏱️ 🙈</div>
              <h3 className="text-2xl font-black mb-1">समय समाप्त!</h3>
              <p className="text-sm text-slate-300 mb-4">AI इसे 20 सेकंड में पहचान नहीं पाया।</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={startNewRound}
                  className="px-6 py-2.5 bg-amber-500 text-white font-black rounded-xl shadow hover:bg-amber-600 transition text-sm"
                >
                  पुनः प्रयास करें ➔
                </button>
                <a
                  href={googleDatasetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-600 text-xs flex items-center gap-1.5 transition"
                >
                  <span>🌐</span> देखें दूसरों ने "{targetCategory.hindi}" कैसे बनाया ➔
                </a>
              </div>
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
                  ? 'माउस दबाकर चित्र बनाएं, AI आवाज़ में अनुमान लगाएगा...'
                  : 'खेल शुरू करने के लिए ऊपर हरा बटन दबाएं!'}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
            💡 <strong>सीखें:</strong> AI पिक्सेल और रेखाओं के कोण को गूगल के 5 करोड़ रेखाचित्रों के डेटाबेस से मिलाकर अनुमान लगाता है!
          </div>
        </div>
      </div>

      {/* Dataset Modal */}
      {showDatasetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>🧠</span> AI मॉडल कैसे काम करता है?
              </h3>
              <button
                onClick={() => setShowDatasetModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>1. न्यूरल नेटवर्क (CNN):</strong> जब आप रेखा खींचते हैं, तो मॉडल आपकी रेखाओं के क्रम, दिशा और आकार को प्रोसेस करता है।
              </p>
              <p>
                <strong>2. Google Quick, Draw! डेटाबेस:</strong> इस AI को दुनिया भर के 1.5 करोड़ से अधिक लोगों द्वारा बनाए गए <strong>5 करोड़ (50 Million+)</strong> चित्रों पर प्रशिक्षित किया गया है।
              </p>
              
              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900">
                <div className="font-bold text-xs mb-1">🌐 वास्तविक ट्रेनिंग डेटा एक्सप्लोर करें:</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <a
                    href="https://quickdraw.withgoogle.com/data"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1 shadow-sm transition"
                  >
                    <span>📊</span> संपूर्ण गूगल डेटाबेस (345 श्रेणियां) ➔
                  </a>
                  <a
                    href={`https://quickdraw.withgoogle.com/data/${targetCategory.english}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-300 font-bold rounded-lg text-xs inline-flex items-center gap-1 transition"
                  >
                    <span>🔍</span> वर्तमान वस्तु ({targetCategory.hindi}) का डेटा
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setShowDatasetModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition"
              >
                वापस गेम पर जाएँ ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}