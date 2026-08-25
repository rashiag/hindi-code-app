'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Trophy, Star, ArrowRight, RotateCcw, 
  MapPin, Compass, Search, CheckCircle2, XCircle
} from 'lucide-react';

interface StateData {
  id: string;
  nameEn: string;
  nameHi: string;
  capitalEn: string;
  capitalHi: string;
  landmark: string;
  landmarkEmoji: string;
  d: string; // SVG path coordinate
  labelX: number;
  labelY: number;
}

// 28 States & Major UTs of India with Topographic Coordinates
const INDIA_STATES: StateData[] = [
  {
    id: 'UP',
    nameEn: 'Uttar Pradesh',
    nameHi: 'उत्तर प्रदेश',
    capitalEn: 'Lucknow',
    capitalHi: 'लखनऊ',
    landmark: 'Taj Mahal (ताजमहल)',
    landmarkEmoji: '🕌',
    d: 'M 210 170 L 290 160 L 325 210 L 285 240 L 210 220 Z',
    labelX: 255,
    labelY: 195
  },
  {
    id: 'MP',
    nameEn: 'Madhya Pradesh',
    nameHi: 'मध्य प्रदेश',
    capitalEn: 'Bhopal',
    capitalHi: 'भोपाल',
    landmark: 'Sanchi Stupa (सांची स्तूप)',
    landmarkEmoji: '🏛️',
    d: 'M 190 220 L 285 240 L 280 290 L 195 285 L 175 250 Z',
    labelX: 235,
    labelY: 260
  },
  {
    id: 'RJ',
    nameEn: 'Rajasthan',
    nameHi: 'राजस्थान',
    capitalEn: 'Jaipur',
    capitalHi: 'जयपुर',
    landmark: 'Hawa Mahal (हवा महल)',
    landmarkEmoji: '🏰',
    d: 'M 130 150 L 210 170 L 190 220 L 140 240 L 110 190 Z',
    labelX: 160,
    labelY: 195
  },
  {
    id: 'MH',
    nameEn: 'Maharashtra',
    nameHi: 'महाराष्ट्र',
    capitalEn: 'Mumbai',
    capitalHi: 'मुंबई',
    landmark: 'Gateway of India (गेटवे ऑफ इंडिया)',
    landmarkEmoji: '⛵',
    d: 'M 160 270 L 235 270 L 250 340 L 180 355 L 145 305 Z',
    labelX: 195,
    labelY: 310
  },
  {
    id: 'GJ',
    nameEn: 'Gujarat',
    nameHi: 'गुजरात',
    capitalEn: 'Gandhinagar',
    capitalHi: 'गांधीनगर',
    landmark: 'Statue of Unity (स्टैच्यू ऑफ यूनिटी)',
    landmarkEmoji: '🗿',
    d: 'M 95 210 L 160 220 L 170 270 L 120 280 L 80 250 Z',
    labelX: 125,
    labelY: 245
  },
  {
    id: 'KA',
    nameEn: 'Karnataka',
    nameHi: 'कर्नाटक',
    capitalEn: 'Bengaluru',
    capitalHi: 'बेंगलुरु',
    landmark: 'Mysore Palace (मैसूर महल)',
    landmarkEmoji: '👑',
    d: 'M 175 355 L 225 355 L 220 435 L 170 420 Z',
    labelX: 195,
    labelY: 395
  },
  {
    id: 'TN',
    nameEn: 'Tamil Nadu',
    nameHi: 'तमिलनाडु',
    capitalEn: 'Chennai',
    capitalHi: 'चेन्नई',
    landmark: 'Meenakshi Temple (मीनाक्षी मंदिर)',
    landmarkEmoji: '🛕',
    d: 'M 200 425 L 255 425 L 235 505 L 195 490 Z',
    labelX: 225,
    labelY: 460
  },
  {
    id: 'KL',
    nameEn: 'Kerala',
    nameHi: 'केरल',
    capitalEn: 'Thiruvananthapuram',
    capitalHi: 'तिरुवनंतपुरम',
    landmark: 'Backwaters & Houseboat (केरल बैकवाटर्स)',
    landmarkEmoji: '🛶',
    d: 'M 175 435 L 200 435 L 190 505 L 170 480 Z',
    labelX: 182,
    labelY: 470
  },
  {
    id: 'AP',
    nameEn: 'Andhra Pradesh',
    nameHi: 'आंध्र प्रदेश',
    capitalEn: 'Amaravati',
    capitalHi: 'अमरावती',
    landmark: 'Tirupati Balaji (तिरुपति देवस्थानम)',
    landmarkEmoji: '🔔',
    d: 'M 235 340 L 285 320 L 260 425 L 220 420 Z',
    labelX: 250,
    labelY: 380
  },
  {
    id: 'TG',
    nameEn: 'Telangana',
    nameHi: 'तेलंगाना',
    capitalEn: 'Hyderabad',
    capitalHi: 'हैदराबाद',
    landmark: 'Charminar (चारमीनार)',
    landmarkEmoji: '🕌',
    d: 'M 220 300 L 275 300 L 265 355 L 220 345 Z',
    labelX: 245,
    labelY: 325
  },
  {
    id: 'BR',
    nameEn: 'Bihar',
    nameHi: 'बिहार',
    capitalEn: 'Patna',
    capitalHi: 'पटना',
    landmark: 'Mahabodhi Temple (महाबोधि मंदिर)',
    landmarkEmoji: '🪷',
    d: 'M 315 180 L 375 185 L 365 230 L 310 220 Z',
    labelX: 340,
    labelY: 205
  },
  {
    id: 'WB',
    nameEn: 'West Bengal',
    nameHi: 'पश्चिम बंगाल',
    capitalEn: 'Kolkata',
    capitalHi: 'कोलकाता',
    landmark: 'Howrah Bridge (हावड़ा ब्रिज)',
    landmarkEmoji: '🌉',
    d: 'M 355 210 L 395 215 L 380 290 L 345 270 Z',
    labelX: 365,
    labelY: 250
  },
  {
    id: 'OD',
    nameEn: 'Odisha',
    nameHi: 'ओडिशा',
    capitalEn: 'Bhubaneswar',
    capitalHi: 'भुवनेश्वर',
    landmark: 'Konark Sun Temple (कोणार्क सूर्य मंदिर)',
    landmarkEmoji: '☀️',
    d: 'M 285 260 L 350 250 L 330 330 L 275 300 Z',
    labelX: 310,
    labelY: 290
  },
  {
    id: 'PB',
    nameEn: 'Punjab',
    nameHi: 'पंजाब',
    capitalEn: 'Chandigarh',
    capitalHi: 'चंडीगढ़',
    landmark: 'Golden Temple (स्वर्ण मंदिर)',
    landmarkEmoji: '✨',
    d: 'M 160 100 L 205 105 L 195 145 L 150 140 Z',
    labelX: 178,
    labelY: 122
  },
  {
    id: 'HR',
    nameEn: 'Haryana',
    nameHi: 'हरियाणा',
    capitalEn: 'Chandigarh',
    capitalHi: 'चंडीगढ़',
    landmark: 'Kurukshetra (कुरुक्षेत्र)',
    landmarkEmoji: '🏹',
    d: 'M 175 130 L 215 130 L 205 170 L 165 160 Z',
    labelX: 190,
    labelY: 150
  },
  {
    id: 'UK',
    nameEn: 'Uttarakhand',
    nameHi: 'उत्तराखंड',
    capitalEn: 'Dehradun',
    capitalHi: 'देहरादून',
    landmark: 'Valley of Flowers (फूलों की घाटी)',
    landmarkEmoji: '🏔️',
    d: 'M 215 110 L 260 115 L 245 160 L 205 150 Z',
    labelX: 232,
    labelY: 135
  },
  {
    id: 'HP',
    nameEn: 'Himachal Pradesh',
    nameHi: 'हिमाचल प्रदेश',
    capitalEn: 'Shimla',
    capitalHi: 'शिमला',
    landmark: 'Snow Peaks (हिमाच्छादित पर्वत)',
    landmarkEmoji: '❄️',
    d: 'M 180 75 L 225 80 L 215 115 L 175 110 Z',
    labelX: 200,
    labelY: 95
  },
  {
    id: 'JK',
    nameEn: 'Jammu & Kashmir',
    nameHi: 'जम्मू और कश्मीर',
    capitalEn: 'Srinagar / Jammu',
    capitalHi: 'श्रीनगर / जम्मू',
    landmark: 'Dal Lake & Shikara (डल झील)',
    landmarkEmoji: '⛵',
    d: 'M 160 30 L 220 30 L 200 80 L 145 75 Z',
    labelX: 180,
    labelY: 55
  },
  {
    id: 'AS',
    nameEn: 'Assam',
    nameHi: 'असम',
    capitalEn: 'Dispur',
    capitalHi: 'दिसपुर',
    landmark: 'Kaziranga Rhino (काजीरंगा गैंडा)',
    landmarkEmoji: '🦏',
    d: 'M 410 170 L 475 160 L 465 200 L 415 200 Z',
    labelX: 440,
    labelY: 180
  },
  {
    id: 'NE',
    nameEn: 'Northeast States',
    nameHi: 'पूर्वोत्तर भारत',
    capitalEn: 'Regional Capitals',
    capitalHi: 'क्षेत्रीय राजधानियाँ',
    landmark: 'Living Root Bridges (जीवंत जड़ पुल)',
    landmarkEmoji: '🌿',
    d: 'M 445 130 L 490 140 L 485 220 L 440 210 Z',
    labelX: 465,
    labelY: 175
  }
];

export function HindiGeoStudio() {
  const [activeMode, setActiveMode] = useState<'explore' | 'quiz'>('explore');
  const [selectedState, setSelectedState] = useState<StateData>(INDIA_STATES[0]); // Default UP

  // Speech Helper with Instant Flush
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
  };

  const speakEnglishDetails = (stateName: string, capitalName: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      stopAudio();

      const u1 = new SpeechSynthesisUtterance(stateName);
      u1.lang = 'en-US';
      u1.rate = 0.85;

      u1.onend = () => {
        speechTimeoutRef.current = setTimeout(() => {
          const u2 = new SpeechSynthesisUtterance(`Capital is ${capitalName}`);
          u2.lang = 'en-US';
          u2.rate = 0.85;
          window.speechSynthesis.speak(u2);
        }, 400); // Clean audible gap
      };

      window.speechSynthesis.speak(u1);
    } catch (e) {}
  };

  const handleStateClick = (st: StateData) => {
    setSelectedState(st);
    speakEnglishDetails(st.nameEn, st.capitalEn);
  };

  // -------------------------------------------------------------
  // MAP QUIZ MODE (Find the State by Capital)
  // -------------------------------------------------------------
  const [quizList, setQuizList] = useState<StateData[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);

  const initGeoQuiz = () => {
    stopAudio();
    const shuffled = [...INDIA_STATES].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuizList(shuffled);
    setQIdx(0);
    setQuizScore(0);
    setQuizFeedback(null);
    setQuizComplete(false);
  };

  useEffect(() => {
    initGeoQuiz();
    return () => stopAudio();
  }, []);

  useEffect(() => {
    if (activeMode === 'quiz' && quizList.length > 0 && !quizComplete) {
      const currentTarget = quizList[qIdx];
      speakEnglishDetails(
        `Can you find the state with capital ${currentTarget.capitalEn}?`,
        currentTarget.capitalEn
      );
    }
  }, [activeMode, qIdx, quizList, quizComplete]);

  const handleQuizStateClick = (st: StateData) => {
    if (quizFeedback !== null) return;

    const target = quizList[qIdx];
    if (st.id === target.id) {
      setQuizFeedback('correct');
      setQuizScore((s) => s + 1);
      speakEnglishDetails(`Correct! ${st.nameEn}`, `Capital is ${st.capitalEn}`);
    } else {
      setQuizFeedback('wrong');
      speakEnglishDetails(`That is ${st.nameEn}`, `The correct state is ${target.nameEn}`);
    }
  };

  const nextQuizQuestion = () => {
    stopAudio();
    if (qIdx + 1 < quizList.length) {
      setQIdx((prev) => prev + 1);
      setQuizFeedback(null);
    } else {
      setQuizComplete(true);
      speakEnglishDetails('Great job! You finished the geography challenge!', '');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <div>
            <h2 className="text-sm md:text-base font-black text-slate-900 leading-tight">
              भारत दर्शन व भूगोल (Interactive India Map)
            </h2>
            <span className="text-[11px] font-bold text-sky-600">States, Capitals &amp; Heritage</span>
          </div>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => { stopAudio(); setActiveMode('explore'); }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition ${
              activeMode === 'explore' ? 'bg-sky-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🧭 1. भारत दर्शन (Explore Map)
          </button>
          <button
            onClick={() => { stopAudio(); setActiveMode('quiz'); initGeoQuiz(); }}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition ${
              activeMode === 'quiz' ? 'bg-amber-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🎯 2. राजधानी खोजो (Map Quiz)
          </button>
        </div>
      </div>

      {/* Main Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Interactive Vector Map */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col items-center justify-center relative min-h-[520px]">
          
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Compass className="w-4 h-4 text-sky-600 animate-spin [animation-duration:8s]" />
              {activeMode === 'explore' ? 'किसी भी राज्य पर टैप करें (Click any State)' : `प्रश्न ${qIdx + 1} / 5`}
            </span>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              India SVG Vector
            </span>
          </div>

          {/* SVG Map of India */}
          <div className="w-full max-w-[460px] aspect-[4/5] relative flex items-center justify-center">
            <svg
              viewBox="60 10 440 520"
              className="w-full h-full filter drop-shadow-md select-none"
            >
              {INDIA_STATES.map((st) => {
                const isSelected = selectedState.id === st.id;
                const isQuizTarget = activeMode === 'quiz' && quizList[qIdx]?.id === st.id;

                let fillColor = '#E0F2FE'; // light sky blue default
                let strokeColor = '#0284C7';

                if (activeMode === 'explore') {
                  if (isSelected) {
                    fillColor = '#0284C7';
                    strokeColor = '#0369A1';
                  }
                } else if (activeMode === 'quiz' && quizFeedback !== null) {
                  if (isQuizTarget) {
                    fillColor = '#22C55E';
                    strokeColor = '#15803D';
                  }
                }

                return (
                  <g key={st.id}>
                    <path
                      d={st.d}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      strokeLinejoin="round"
                      onClick={() => activeMode === 'explore' ? handleStateClick(st) : handleQuizStateClick(st)}
                      className="cursor-pointer hover:fill-sky-400 hover:opacity-90 transition-all duration-150"
                    />
                    <text
                      x={st.labelX}
                      y={st.labelY}
                      fontSize="9"
                      fontWeight="900"
                      textAnchor="middle"
                      fill={isSelected && activeMode === 'explore' ? '#FFFFFF' : '#0F172A'}
                      className="pointer-events-none select-none"
                    >
                      {st.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] font-bold text-slate-400 mt-2 text-center">
            💡 Tap on any territory to view state capital &amp; listen to English audio pronunciation.
          </div>
        </div>

        {/* Right Column: Information Display / Quiz Card */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          
          {activeMode === 'explore' ? (
            /* State Information Card */
            <div className="bg-white rounded-3xl border-2 border-sky-300 shadow-sm p-6 flex flex-col justify-between h-full animate-in fade-in">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-sky-100 text-sky-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                    State Code: {selectedState.id}
                  </span>
                  <button
                    onClick={() => speakEnglishDetails(selectedState.nameEn, selectedState.capitalEn)}
                    className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl shadow transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Volume2 className="w-4 h-4" /> Speak Audio
                  </button>
                </div>

                {/* State Name */}
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    State Name (राज्य का नाम)
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                    {selectedState.nameEn}
                  </h3>
                  <p className="text-base font-bold text-sky-700 mt-0.5">
                    {selectedState.nameHi}
                  </p>
                </div>

                {/* Capital Name */}
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Capital City (राजधानी)
                  </span>
                  <h4 className="text-xl md:text-2xl font-black text-emerald-700 leading-tight">
                    {selectedState.capitalEn}
                  </h4>
                  <p className="text-sm font-bold text-slate-600 mt-0.5">
                    {selectedState.capitalHi}
                  </p>
                </div>

                {/* Iconic Landmark */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Famous Heritage &amp; Landmark (धरोहर)
                  </span>
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                    <span className="text-3xl">{selectedState.landmarkEmoji}</span>
                    <span className="text-xs font-black text-amber-950">
                      {selectedState.landmark}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-center text-xs font-bold text-slate-500 mt-4">
                🔊 Audio: &quot;{selectedState.nameEn}. Capital is {selectedState.capitalEn}.&quot;
              </div>
            </div>
          ) : (
            /* Quiz Mode Card */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-full">
              {!quizComplete && quizList.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full">
                      Question {qIdx + 1} / 5
                    </span>
                    <button
                      onClick={() => speakEnglishDetails(
                        `Find the state with capital ${quizList[qIdx].capitalEn}`,
                        quizList[qIdx].capitalEn
                      )}
                      className="p-2 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Volume2 className="w-4 h-4" /> Listen
                    </button>
                  </div>

                  <div className="text-center my-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Capital to Find
                    </span>
                    <h3 className="text-3xl font-black text-amber-600 mb-1">
                      {quizList[qIdx].capitalEn}
                    </h3>
                    <p className="text-sm font-bold text-slate-500">
                      ({quizList[qIdx].capitalHi})
                    </p>
                    <p className="text-xs font-bold text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      👉 नक्शे पर उस राज्य को खोजें जिसकी राजधानी <strong>{quizList[qIdx].capitalEn}</strong> है!
                    </p>
                  </div>

                  {quizFeedback && (
                    <div className="text-center animate-in fade-in">
                      <div className={`p-3 rounded-2xl mb-4 text-xs font-black flex items-center justify-center gap-2 ${
                        quizFeedback === 'correct' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}>
                        {quizFeedback === 'correct' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Correct! It is {quizList[qIdx].nameEn}!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>Correct State is {quizList[qIdx].nameEn}!</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={nextQuizQuestion}
                        className="py-3 px-8 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer inline-flex items-center gap-2"
                      >
                        Next Question <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Quiz Complete Card */
                <div className="text-center my-auto p-4 animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-amber-500 text-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
                    🏆
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">Geography Quiz Finished!</h3>
                  <p className="text-xs font-bold text-amber-700 mb-3">Score: {quizScore} / 5 Correct</p>

                  <div className="flex justify-center gap-1.5 mb-4">
                    <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                    <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                    <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                  </div>

                  <button
                    onClick={initGeoQuiz}
                    className="py-2.5 px-6 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Play Again
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}