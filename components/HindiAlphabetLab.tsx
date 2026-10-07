'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, RotateCcw, Sparkles, Pencil, Eraser, CheckCircle2, ChevronRight } from 'lucide-react';

interface LetterItem {
  char: string;
  word: string;
  emoji: string;
  sentence: string;
  type: 'swar' | 'vyanjan';
}

// 1. स्वर (अ से अः)
const SWAR_DATA: LetterItem[] = [
  { char: 'अ', word: 'अनार', emoji: '🍎', sentence: 'अ से अनार, मीठा और लाल!', type: 'swar' },
  { char: 'आ', word: 'आम', emoji: '🥭', sentence: 'आ से आम, फलों का राजा!', type: 'swar' },
  { char: 'इ', word: 'इमली', emoji: '🟤', sentence: 'इ से इमली, खट्टी-मीठी!', type: 'swar' },
  { char: 'ई', word: 'ईख', emoji: '🎋', sentence: 'ई से ईख, मीठा गन्ना!', type: 'swar' },
  { char: 'उ', word: 'उल्लू', emoji: '🦉', sentence: 'उ से उल्लू, रात में जागे!', type: 'swar' },
  { char: 'ऊ', word: 'ऊन', emoji: '🧶', sentence: 'ऊ से ऊन, गरम स्वेटर बने!', type: 'swar' },
  { char: 'ऋ', word: 'ऋषि', emoji: '🧘', sentence: 'ऋ से ऋषि, ज्ञान का सागर!', type: 'swar' },
  { char: 'ए', word: 'एड़ी', emoji: '🦶', sentence: 'ए से एड़ी, कदम बढ़ाओ!', type: 'swar' },
  { char: 'ऐ', word: 'ऐनक', emoji: '👓', sentence: 'ऐ से ऐनक, साफ़ दिखाए!', type: 'swar' },
  { char: 'ओ', word: 'ओखली', emoji: '🥣', sentence: 'ओ से ओखली, अनाज कूटे!', type: 'swar' },
  { char: 'औ', word: 'औरत', emoji: '👩', sentence: 'औ से औरत, ममता की मूरत!', type: 'swar' },
  { char: 'अं', word: 'अंगूर', emoji: '🍇', sentence: 'अं से अंगूर, रसीले गुच्छे!', type: 'swar' },
  { char: 'अः', word: 'अहा (खाली)', emoji: '😄', sentence: 'अः से खाली, बजाओ ताली!', type: 'swar' }
];

// 2. व्यंजन (क से ज्ञ)
const VYANJAN_DATA: LetterItem[] = [
  { char: 'क', word: 'कमल', emoji: '🪷', sentence: 'क से कमल, भारत का राष्ट्रीय फूल!', type: 'vyanjan' },
  { char: 'ख', word: 'खरगोश', emoji: '🐇', sentence: 'ख से खरगोश, दौड़े तेज़!', type: 'vyanjan' },
  { char: 'ग', word: 'गमला', emoji: '🪴', sentence: 'ग से गमला, फूल खिलाएं!', type: 'vyanjan' },
  { char: 'घ', word: 'घड़ी', emoji: '⏰', sentence: 'घ से घड़ी, समय बताए!', type: 'vyanjan' },
  { char: 'ङ', word: 'खाली', emoji: '⚪', sentence: 'ङ से खाली, कुछ नहीं!', type: 'vyanjan' },
  { char: 'च', word: 'चम्मच', emoji: '🥄', sentence: 'च से चम्मच, खीर खाओ!', type: 'vyanjan' },
  { char: 'छ', word: 'छाता', emoji: '☂️', sentence: 'छ से छाता, बारिश से बचाए!', type: 'vyanjan' },
  { char: 'ज', word: 'जहाज', emoji: '🚢', sentence: 'ज से जहाज, पानी पर चले!', type: 'vyanjan' },
  { char: 'झ', word: 'झंडा', emoji: '🇮🇳', sentence: 'झ से झंडा, तिरंगा प्यारा!', type: 'vyanjan' },
  { char: 'ञ', word: 'खाली', emoji: '⚪', sentence: 'ञ से खाली, बजाओ ताली!', type: 'vyanjan' },
  { char: 'ट', word: 'टमाटर', emoji: '🍅', sentence: 'ट से टमाटर, लाल-लाल गोल!', type: 'vyanjan' },
  { char: 'ठ', word: 'ठठेरा', emoji: '🔨', sentence: 'ठ से ठठेरा, बर्तन बनाए!', type: 'vyanjan' },
  { char: 'ड', word: 'डमरू', emoji: '🪘', sentence: 'ड से डमरू, बाजे डम-डम!', type: 'vyanjan' },
  { char: 'ढ', word: 'ढोलक', emoji: '🥁', sentence: 'ढ से ढोलक, ताल बजाए!', type: 'vyanjan' },
  { char: 'ण', word: 'खाली', emoji: '⚪', sentence: 'ण से खाली, कुछ नहीं!', type: 'vyanjan' },
  { char: 'त', word: 'तोता', emoji: '🦜', sentence: 'त से तोता, हरे पंखों वाला!', type: 'vyanjan' },
  { char: 'थ', word: 'थाली', emoji: '🍽️', sentence: 'थ से थाली, खाना खाओ!', type: 'vyanjan' },
  { char: 'द', word: 'दवात', emoji: '🖋️', sentence: 'द से दवात, स्याही भरी!', type: 'vyanjan' },
  { char: 'ध', word: 'धनुष', emoji: '🏹', sentence: 'ध से धनुष, बाण चलाओ!', type: 'vyanjan' },
  { char: 'न', word: 'नल', emoji: '🚰', sentence: 'न से नल, पानी बहता!', type: 'vyanjan' },
  { char: 'प', word: 'पतंग', emoji: '🪁', sentence: 'प से पतंग, उड़े गगन में!', type: 'vyanjan' },
  { char: 'फ', word: 'फल', emoji: '🍎', sentence: 'फ से फल, सेहत बनाएं!', type: 'vyanjan' },
  { char: 'ब', word: 'बत्तख', emoji: '🦆', sentence: 'ब से बत्तख, पानी में तैरे!', type: 'vyanjan' },
  { char: 'भ', word: 'भालू', emoji: '🐻', sentence: 'भ से भालू, नाचे झूमकर!', type: 'vyanjan' },
  { char: 'म', word: 'मछली', emoji: '🐟', sentence: 'म से मछली, जल की रानी!', type: 'vyanjan' },
  { char: 'य', word: 'यज्ञ', emoji: '🔥', sentence: 'य से यज्ञ, पावन हवन!', type: 'vyanjan' },
  { char: 'र', word: 'रथ', emoji: '🛞', sentence: 'र से रथ, राजा की सवारी!', type: 'vyanjan' },
  { char: 'ल', word: 'लड्डू', emoji: '🟡', sentence: 'ल से लड्डू, मीठा गोल!', type: 'vyanjan' },
  { char: 'व', word: 'वक', emoji: '🦢', sentence: 'व से वक, बगुला प्यारा!', type: 'vyanjan' },
  { char: 'श', word: 'शलजम', emoji: '🥬', sentence: 'श से शलजम, पौष्टिक सब्जी!', type: 'vyanjan' },
  { char: 'ष', word: 'षट्कोण', emoji: '🔷', sentence: 'ष से षट्कोण, छह कोनों वाला!', type: 'vyanjan' },
  { char: 'स', word: 'सेब', emoji: '🍎', sentence: 'स से सेब, मीठा और लाल!', type: 'vyanjan' },
  { char: 'ह', word: 'हाथी', emoji: '🐘', sentence: 'ह से हाथी, सूंड हिलाता!', type: 'vyanjan' },
  { char: 'क्ष', word: 'क्षत्रिय', emoji: '🛡️', sentence: 'क्ष से क्षत्रिय, वीर योद्धा!', type: 'vyanjan' },
  { char: 'त्र', word: 'त्रिशूल', emoji: '🔱', sentence: 'त्र से त्रिशूल, तीन नोक वाला!', type: 'vyanjan' },
  { char: 'ज्ञ', word: 'ज्ञानी', emoji: '📖', sentence: 'ज्ञ से ज्ञानी, सब कुछ जाने!', type: 'vyanjan' }
];

export function HindiAlphabetLab() {
  const [activeTab, setActiveTab] = useState<'cards' | 'tracing'>('cards');
  const [activeCategory, setActiveCategory] = useState<'swar' | 'vyanjan'>('swar');
  const [selectedLetter, setSelectedLetter] = useState<LetterItem>(SWAR_DATA[0]);

  // Canvas Drawing State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#2563eb');
  const [penSize, setPenSize] = useState(8);
  const [isEraser, setIsEraser] = useState(false);
  const [traceComplete, setTraceComplete] = useState(false);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakHindi = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      stopAudio();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const handleSelectLetter = (item: LetterItem) => {
    setSelectedLetter(item);
    setTraceComplete(false);
    clearCanvas(item.char);
    speakHindi(`${item.char}... ${item.word}! ${item.sentence}`);
  };

  // Tracing Canvas Initialization
  const clearCanvas = (charToDraw = selectedLetter.char) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background guide grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Draw light grey dotted letter outline guide for tracing
    ctx.font = 'bold 180px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(charToDraw, canvas.width / 2, canvas.height / 2 + 10);

    // Draw top reference line (शिरोरेखा गाइड)
    ctx.strokeStyle = '#cbd5e1';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(40, 80);
    ctx.lineTo(canvas.width - 40, 80);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  useEffect(() => {
    if (activeTab === 'tracing') {
      clearCanvas();
    }
  }, [activeTab, selectedLetter]);

  // Touch & Mouse Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = isEraser ? '#ffffff' : penColor;
    ctx.lineWidth = isEraser ? penSize * 2 : penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setTraceComplete(true);
  };

  const activeLetters = activeCategory === 'swar' ? SWAR_DATA : VYANJAN_DATA;

  return (
    <div className="max-w-5xl mx-auto p-3 md:p-6 font-sans select-none">
      
      {/* शीर्ष शीर्षक (Header) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-amber-50/90 p-4 rounded-3xl border-2 border-amber-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md font-black">
            अ
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-amber-950">
              हिन्दी वर्णमाला शाला (Hindi Alphabet &amp; Tracing Lab)
            </h1>
            <p className="text-xs md:text-sm font-bold text-amber-800">
              स्वर (अ से अः) व व्यंजन (क से ज्ञ) ध्वनि कार्ड और उँगली से अनुरेखण (Tracing)
            </p>
          </div>
        </div>

        {/* मोड चयनकर्ता (Mode Switcher) */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-amber-300 shadow-sm">
          <button
            onClick={() => { stopAudio(); setActiveTab('cards'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'cards' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-950 hover:bg-amber-100'
            }`}
          >
            🔊 १. ध्वनि व चित्र कार्ड (Sound Cards)
          </button>
          <button
            onClick={() => { stopAudio(); setActiveTab('tracing'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'tracing' ? 'bg-orange-600 text-white shadow-sm' : 'text-amber-950 hover:bg-amber-100'
            }`}
          >
            ✏️ २. अक्षर लिखो व अनुरेखण (Tracing Pad)
          </button>
        </div>
      </div>

      {/* स्वर vs व्यंजन चयन (Category Switcher) */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex gap-2">
          <button
            onClick={() => {
              stopAudio();
              setActiveCategory('swar');
              setSelectedLetter(SWAR_DATA[0]);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'swar'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🍎 स्वर (अ से अः) • १३ अक्षर
          </button>
          <button
            onClick={() => {
              stopAudio();
              setActiveCategory('vyanjan');
              setSelectedLetter(VYANJAN_DATA[0]);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'vyanjan'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🪷 व्यंजन (क से ज्ञ) • ३६ अक्षर
          </button>
        </div>

        <span className="text-xs font-bold text-slate-500">
          👉 किसी भी अक्षर पर टैप करें
        </span>
      </div>

      {/* मुख्य कार्यक्षेत्र (Main Container) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* बायां कॉलम: अक्षर ग्रिड (Letter Selection Grid) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 border-2 border-slate-200 shadow-sm flex flex-col justify-between max-h-[560px]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <span className="text-xs font-black text-slate-800">
              {activeCategory === 'swar' ? 'स्वर सूची (Vowels):' : 'व्यंजन सूची (Consonants):'}
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              कुल {activeLetters.length} वर्ण
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 overflow-y-auto p-1 max-h-[460px]">
            {activeLetters.map((item) => {
              const isSelected = selectedLetter.char === item.char;
              return (
                <button
                  key={item.char}
                  onClick={() => handleSelectLetter(item)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white scale-105 shadow-md ring-2 ring-amber-300'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 hover:bg-amber-50 hover:border-amber-300'
                  }`}
                >
                  <span className="text-xl md:text-2xl font-black leading-none">{item.char}</span>
                  <span className="text-[10px] mt-0.5 opacity-80 truncate max-w-full font-bold">{item.word}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* दायां कॉलम: इंटरएक्टिव कार्ड अथवा अनुरेखण पैड */}
        <div className="lg:col-span-7">
          
          {/* मोड १: ध्वनि व सचित्र फ्लैशकार्ड (Sound Cards) */}
          {activeTab === 'cards' && (
            <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-lg flex flex-col items-center text-center justify-between min-h-[520px]">
              
              <div className="w-full flex items-center justify-between mb-4">
                <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full">
                  {selectedLetter.type === 'swar' ? 'स्वर (Swar)' : 'व्यंजन (Vyanjan)'}
                </span>

                <button
                  onClick={() => speakHindi(`${selectedLetter.char}... ${selectedLetter.word}!... ${selectedLetter.sentence}`)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 text-xs font-black"
                >
                  <Volume2 className="w-4 h-4" /> आवाज़ सुनें (Speak)
                </button>
              </div>

              {/* अक्षर व चित्र का बड़ा डिस्प्ले */}
              <div className="my-auto flex flex-col items-center">
                <div className="w-36 h-36 rounded-3xl bg-white border-4 border-amber-200 shadow-xl flex items-center justify-center mb-4">
                  <span className="text-7xl md:text-8xl font-black text-amber-700 leading-none">
                    {selectedLetter.char}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white/90 px-6 py-3 rounded-2xl border border-amber-200 shadow-sm mb-3">
                  <span className="text-4xl">{selectedLetter.emoji}</span>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-400 block">शब्द (Word):</span>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">
                      {selectedLetter.char} से {selectedLetter.word}
                    </h3>
                  </div>
                </div>

                <p className="text-base font-extrabold text-amber-950 bg-amber-100/70 px-4 py-2 rounded-xl border border-amber-200 max-w-md">
                  ✨ &quot;{selectedLetter.sentence}&quot;
                </p>
              </div>

              {/* अनुरेखण पर जाने का शॉर्टकट */}
              <button
                onClick={() => {
                  stopAudio();
                  setActiveTab('tracing');
                }}
                className="mt-6 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-md transition cursor-pointer"
              >
                <Pencil className="w-4 h-4" /> &apos;{selectedLetter.char}&apos; को लिखकर अभ्यास करें (Trace Letter)
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          )}

          {/* मोड २: इंटरएक्टिव अनुरेखण पैड (Canvas Tracing Pad) */}
          {activeTab === 'tracing' && (
            <div className="bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-lg flex flex-col justify-between min-h-[520px]">
              
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-lg">
                    {selectedLetter.char}
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-tight">
                      अक्षर अनुरेखण: &apos;{selectedLetter.char}&apos; ({selectedLetter.word})
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500">धूसर (Grey) रूपरेखा पर उँगली या माउस से लिखें</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => speakHindi(`${selectedLetter.char}`)}
                    className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> उच्चारण
                  </button>
                  <button
                    onClick={() => clearCanvas()}
                    className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> साफ़ करें
                  </button>
                </div>
              </div>

              {/* ड्राइंग कैनवस (Interactive HTML5 Canvas) */}
              <div className="relative w-full aspect-square max-w-[340px] mx-auto bg-slate-50 rounded-3xl border-4 border-dashed border-amber-300 shadow-inner flex items-center justify-center overflow-hidden touch-none">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={340}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="cursor-crosshair w-full h-full block"
                />

                {traceComplete && (
                  <div className="absolute bottom-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 pointer-events-none animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" /> शाबाश!
                  </div>
                )}
              </div>

              {/* टूलबार: रंग व पेंसिल मोटाई (Pen Controls) */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500 mr-1">रंग:</span>
                  {['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed'].map((c) => (
                    <button
                      key={c}
                      onClick={() => { setPenColor(c); setIsEraser(false); }}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full cursor-pointer transition ${
                        penColor === c && !isEraser ? 'ring-2 ring-slate-800 scale-110' : ''
                      }`}
                    />
                  ))}
                  <button
                    onClick={() => setIsEraser(!isEraser)}
                    className={`ml-2 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                      isEraser ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5" /> रबर (Eraser)
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-500">मोटाई:</span>
                  {[6, 10, 16].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setPenSize(sz)}
                      className={`w-6 h-6 rounded-lg text-xs font-black cursor-pointer flex items-center justify-center ${
                        penSize === sz ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {sz === 6 ? '•' : sz === 10 ? '●' : '⬤'}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}