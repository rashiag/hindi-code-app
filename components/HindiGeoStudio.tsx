'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Trophy, Star, ArrowRight, RotateCcw, 
  MapPin, Compass, Search, CheckCircle2, XCircle, Sparkles
} from 'lucide-react';

interface StateData {
  id: string;
  nameEn: string;
  nameHi: string;
  capitalEn: string;
  capitalHi: string;
  landmark: string;
  landmarkEmoji: string;
  zone: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  d: string;
  labelX: number;
  labelY: number;
}

const INDIA_STATES: StateData[] = [
  // NORTH
  {
    id: 'JK',
    nameEn: 'Jammu & Kashmir / Ladakh',
    nameHi: 'जम्मू और कश्मीर / लद्दाख',
    capitalEn: 'Srinagar / Jammu',
    capitalHi: 'श्रीनगर / जम्मू',
    landmark: 'Dal Lake & Shikara (डल झील)',
    landmarkEmoji: '⛵',
    zone: 'North',
    d: 'M 190,30 C 230,20 280,35 295,75 C 275,100 240,115 210,115 C 185,115 165,85 165,65 C 165,45 180,35 190,30 Z',
    labelX: 230,
    labelY: 70
  },
  {
    id: 'HP',
    nameEn: 'Himachal Pradesh',
    nameHi: 'हिमाचल प्रदेश',
    capitalEn: 'Shimla',
    capitalHi: 'शिमला',
    landmark: 'Rohtang Pass & Apple Orchards (रोहतांग दर्रा)',
    landmarkEmoji: '🍎',
    zone: 'North',
    d: 'M 210,115 C 235,115 260,120 270,140 C 260,155 240,165 220,160 C 210,145 205,130 210,115 Z',
    labelX: 238,
    labelY: 140
  },
  {
    id: 'PB',
    nameEn: 'Punjab',
    nameHi: 'पंजाब',
    capitalEn: 'Chandigarh',
    capitalHi: 'चंडीगढ़',
    landmark: 'Golden Temple (स्वर्ण मंदिर)',
    landmarkEmoji: '✨',
    zone: 'North',
    d: 'M 175,120 C 205,120 210,135 210,160 C 190,175 170,175 160,150 C 160,135 168,125 175,120 Z',
    labelX: 185,
    labelY: 148
  },
  {
    id: 'UK',
    nameEn: 'Uttarakhand',
    nameHi: 'उत्तराखंड',
    capitalEn: 'Dehradun',
    capitalHi: 'देहरादून',
    landmark: 'Valley of Flowers & Badrinath (फूलों की घाटी)',
    landmarkEmoji: '🏔️',
    zone: 'North',
    d: 'M 245,145 C 275,145 295,160 290,185 C 270,195 250,185 240,170 C 240,155 242,148 245,145 Z',
    labelX: 265,
    labelY: 168
  },
  {
    id: 'HR',
    nameEn: 'Haryana & Delhi',
    nameHi: 'हरियाणा व दिल्ली',
    capitalEn: 'Chandigarh / New Delhi',
    capitalHi: 'चंडीगढ़ / नई दिल्ली',
    landmark: 'India Gate & Red Fort (इंडिया गेट)',
    landmarkEmoji: '🏛️',
    zone: 'North',
    d: 'M 195,160 C 225,160 235,175 235,195 C 215,210 195,205 185,190 C 185,175 190,165 195,160 Z',
    labelX: 210,
    labelY: 184
  },
  {
    id: 'RJ',
    nameEn: 'Rajasthan',
    nameHi: 'राजस्थान',
    capitalEn: 'Jaipur',
    capitalHi: 'जयपुर',
    landmark: 'Hawa Mahal & Thar Desert (हवा महल)',
    landmarkEmoji: '🏰',
    zone: 'West',
    d: 'M 130,170 C 185,165 195,190 190,240 C 150,270 120,250 105,220 C 105,190 115,175 130,170 Z',
    labelX: 150,
    labelY: 215
  },
  {
    id: 'UP',
    nameEn: 'Uttar Pradesh',
    nameHi: 'उत्तर प्रदेश',
    capitalEn: 'Lucknow',
    capitalHi: 'लखनऊ',
    landmark: 'Taj Mahal & Ganga Ghats (ताजमहल)',
    landmarkEmoji: '🕌',
    zone: 'North',
    d: 'M 225,185 C 290,175 340,200 350,230 C 315,260 260,265 220,240 C 210,215 215,195 225,185 Z',
    labelX: 280,
    labelY: 220
  },
  {
    id: 'BR',
    nameEn: 'Bihar',
    nameHi: 'बिहार',
    capitalEn: 'Patna',
    capitalHi: 'पटना',
    landmark: 'Nalanda & Mahabodhi Temple (महाबोधि मंदिर)',
    landmarkEmoji: '🪷',
    zone: 'East',
    d: 'M 350,215 C 400,215 415,235 410,260 C 385,275 355,270 340,255 C 340,235 345,220 350,215 Z',
    labelX: 375,
    labelY: 242
  },
  {
    id: 'GJ',
    nameEn: 'Gujarat',
    nameHi: 'गुजरात',
    capitalEn: 'Gandhinagar',
    capitalHi: 'गांधीनगर',
    landmark: 'Statue of Unity & Gir Lions (स्टैच्यू ऑफ यूनिटी)',
    landmarkEmoji: '🦁',
    zone: 'West',
    d: 'M 85,230 C 135,235 145,265 145,290 C 115,315 75,295 65,265 C 65,245 75,235 85,230 Z',
    labelX: 105,
    labelY: 268
  },
  {
    id: 'MP',
    nameEn: 'Madhya Pradesh',
    nameHi: 'मध्य प्रदेश',
    capitalEn: 'Bhopal',
    capitalHi: 'भोपाल',
    landmark: 'Sanchi Stupa & Khajuraho (सांची स्तूप)',
    landmarkEmoji: '🛕',
    zone: 'Central',
    d: 'M 165,245 C 265,240 295,270 280,310 C 230,330 170,320 155,285 C 150,265 155,250 165,245 Z',
    labelX: 220,
    labelY: 280
  },
  {
    id: 'WB',
    nameEn: 'West Bengal',
    nameHi: 'पश्चिम बंगाल',
    capitalEn: 'Kolkata',
    capitalHi: 'कोलकाता',
    landmark: 'Howrah Bridge & Sundarbans (हावड़ा ब्रिज)',
    landmarkEmoji: '🌉',
    zone: 'East',
    d: 'M 390,245 C 415,245 425,270 415,330 C 395,335 380,300 380,270 C 380,255 385,248 390,245 Z',
    labelX: 400,
    labelY: 285
  },
  {
    id: 'OD',
    nameEn: 'Odisha',
    nameHi: 'ओडिशा',
    capitalEn: 'Bhubaneswar',
    capitalHi: 'भुवनेश्वर',
    landmark: 'Konark Sun Temple & Puri Jagannath (कोणार्क सूर्य मंदिर)',
    landmarkEmoji: '☀️',
    zone: 'East',
    d: 'M 315,290 C 375,285 390,320 375,365 C 335,370 305,335 305,310 C 305,295 310,290 315,290 Z',
    labelX: 345,
    labelY: 330
  },
  {
    id: 'MH',
    nameEn: 'Maharashtra',
    nameHi: 'महाराष्ट्र',
    capitalEn: 'Mumbai',
    capitalHi: 'मुंबई',
    landmark: 'Gateway of India & Ajanta Ellora (गेटवे ऑफ इंडिया)',
    landmarkEmoji: '⛵',
    zone: 'West',
    d: 'M 140,295 C 230,300 245,340 240,390 C 185,410 145,375 130,340 C 130,315 135,300 140,295 Z',
    labelX: 185,
    labelY: 350
  },
  {
    id: 'TG',
    nameEn: 'Telangana',
    nameHi: 'तेलंगाना',
    capitalEn: 'Hyderabad',
    capitalHi: 'हैदराबाद',
    landmark: 'Charminar & Golconda Fort (चारमीनार)',
    landmarkEmoji: '🕌',
    zone: 'South',
    d: 'M 225,340 C 275,340 280,375 270,410 C 235,420 215,390 215,365 C 215,350 220,342 225,340 Z',
    labelX: 245,
    labelY: 375
  },
  {
    id: 'AP',
    nameEn: 'Andhra Pradesh',
    nameHi: 'आंध्र प्रदेश',
    capitalEn: 'Amaravati',
    capitalHi: 'अमरावती',
    landmark: 'Tirupati Balaji Temple (तिरुपति देवस्थानम)',
    landmarkEmoji: '🔔',
    zone: 'South',
    d: 'M 245,385 C 295,375 315,425 290,475 C 255,485 245,445 240,415 C 240,395 242,388 245,385 Z',
    labelX: 275,
    labelY: 430
  },
  {
    id: 'KA',
    nameEn: 'Karnataka',
    nameHi: 'कर्नाटक',
    capitalEn: 'Bengaluru',
    capitalHi: 'बेंगलुरु',
    landmark: 'Mysore Palace & Hampi Ruins (मैसूर महल)',
    landmarkEmoji: '👑',
    zone: 'South',
    d: 'M 160,390 C 220,395 230,440 220,490 C 180,500 160,455 150,425 C 150,405 155,395 160,390 Z',
    labelX: 190,
    labelY: 440
  },
  {
    id: 'TN',
    nameEn: 'Tamil Nadu',
    nameHi: 'तमिलनाडु',
    capitalEn: 'Chennai',
    capitalHi: 'चेन्नई',
    landmark: 'Meenakshi Amman Temple (मीनाक्षी मंदिर)',
    landmarkEmoji: '🛕',
    zone: 'South',
    d: 'M 200,480 C 265,475 260,545 225,580 C 195,570 190,520 195,495 C 195,485 198,482 200,480 Z',
    labelX: 230,
    labelY: 530
  },
  {
    id: 'KL',
    nameEn: 'Kerala',
    nameHi: 'केरल',
    capitalEn: 'Thiruvananthapuram',
    capitalHi: 'तिरुवनंतपुरम',
    landmark: 'Backwaters & Kathakali (केरल बैकवाटर्स)',
    landmarkEmoji: '🛶',
    zone: 'South',
    d: 'M 175,490 C 200,490 200,535 190,575 C 175,565 165,530 170,505 C 170,495 172,492 175,490 Z',
    labelX: 182,
    labelY: 535
  },
  {
    id: 'AS',
    nameEn: 'Assam & Northeast',
    nameHi: 'असम व पूर्वोत्तर भारत',
    capitalEn: 'Dispur / Guwahati',
    capitalHi: 'दिसपुर / गुवाहाटी',
    landmark: 'Kaziranga One-Horned Rhino & Tea Gardens (काजीरंगा गैंडा)',
    landmarkEmoji: '🦏',
    zone: 'Northeast',
    d: 'M 440,190 C 510,180 540,210 530,260 C 475,270 445,250 435,225 C 435,205 438,195 440,190 Z',
    labelX: 485,
    labelY: 225
  }
];

export function HindiGeoStudio() {
  const [activeMode, setActiveMode] = useState<'explore' | 'quiz'>('explore');
  const [selectedState, setSelectedState] = useState<StateData>(INDIA_STATES[6]); // UP default
  const [filterZone, setFilterZone] = useState<string>('All');
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

  // Indian English Accent Speech Synthesis
  const speakIndianEnglish = (stateName: string, capitalName: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      stopAudio();

      const voices = window.speechSynthesis.getVoices();
      const inVoice = voices.find(v => v.lang === 'en-IN' || v.lang.includes('hi') || v.name.includes('India'));

      const u1 = new SpeechSynthesisUtterance(stateName);
      u1.lang = 'en-IN';
      u1.rate = 0.88;
      if (inVoice) u1.voice = inVoice;

      u1.onend = () => {
        if (capitalName) {
          speechTimeoutRef.current = setTimeout(() => {
            const u2 = new SpeechSynthesisUtterance(`Capital is ${capitalName}`);
            u2.lang = 'en-IN';
            u2.rate = 0.88;
            if (inVoice) u2.voice = inVoice;
            window.speechSynthesis.speak(u2);
          }, 400);
        }
      };

      window.speechSynthesis.speak(u1);
    } catch (e) {}
  };

  const handleStateSelect = (st: StateData) => {
    setSelectedState(st);
    speakIndianEnglish(st.nameEn, st.capitalEn);
  };

  // -------------------------------------------------------------
  // QUIZ MODE (Find the State by Capital)
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
      speakIndianEnglish(`Find the state whose capital is ${currentTarget.capitalEn}`, '');
    }
  }, [activeMode, qIdx, quizList, quizComplete]);

  const handleQuizAnswer = (st: StateData) => {
    if (quizFeedback !== null) return;
    const target = quizList[qIdx];

    if (st.id === target.id) {
      setQuizFeedback('correct');
      setQuizScore((s) => s + 1);
      speakIndianEnglish(`Correct! It is ${st.nameEn}`, `Capital is ${st.capitalEn}`);
    } else {
      setQuizFeedback('wrong');
      speakIndianEnglish(`That is ${st.nameEn}`, `The correct answer is ${target.nameEn}`);
    }
  };

  const nextQuizQuestion = () => {
    stopAudio();
    if (qIdx + 1 < quizList.length) {
      setQIdx((prev) => prev + 1);
      setQuizFeedback(null);
    } else {
      setQuizComplete(true);
      speakIndianEnglish('Great job! You finished the quiz!', '');
    }
  };

  const filteredStates = filterZone === 'All' 
    ? INDIA_STATES 
    : INDIA_STATES.filter(s => s.zone === filterZone);

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto">
      
      {/* Mode Header Bar */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <div>
            <h2 className="text-sm md:text-base font-black text-slate-900 leading-tight">
              भारत दर्शन व भूगोल (Interactive India Map)
            </h2>
            <span className="text-[11px] font-bold text-sky-600">Indian English Voice • States, Capitals &amp; Heritage</span>
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

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Proportional India Map & Regional Selector */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between min-h-[540px]">
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-600 animate-spin [animation-duration:8s]" />
              {activeMode === 'explore' ? 'नक्शे या सूची से राज्य चुनें (Click State to Listen)' : `प्रश्न ${qIdx + 1} / 5`}
            </span>

            {/* Region Filter */}
            {activeMode === 'explore' && (
              <div className="flex gap-1 overflow-x-auto text-[10px] font-bold">
                {['All', 'North', 'South', 'West', 'East', 'Central'].map((z) => (
                  <button
                    key={z}
                    onClick={() => setFilterZone(z)}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition ${
                      filterZone === z ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SVG Map of India */}
          <div className="w-full flex items-center justify-center p-2">
            <svg
              viewBox="50 10 500 590"
              className="w-full max-w-[390px] aspect-[4/5] filter drop-shadow-md select-none"
            >
              {/* Surrounding Oceans */}
              <text x="75" y="460" fill="#94A3B8" fontSize="10" fontWeight="bold" opacity="0.7">Arabian Sea</text>
              <text x="360" y="460" fill="#94A3B8" fontSize="10" fontWeight="bold" opacity="0.7">Bay of Bengal</text>
              <text x="210" y="585" fill="#94A3B8" fontSize="10" fontWeight="bold" opacity="0.7">Indian Ocean</text>

              {INDIA_STATES.map((st) => {
                const isSelected = selectedState.id === st.id;
                const isQuizTarget = activeMode === 'quiz' && quizList[qIdx]?.id === st.id;

                let fillColor = '#E0F2FE';
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
                      onClick={() => activeMode === 'explore' ? handleStateSelect(st) : handleQuizAnswer(st)}
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

          {/* Quick-Click State Directory Grid */}
          <div className="border-t border-slate-100 pt-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick State List:
            </span>
            <div className="flex gap-1.5 flex-wrap max-h-24 overflow-y-auto p-1">
              {filteredStates.map((st) => (
                <button
                  key={st.id}
                  onClick={() => activeMode === 'explore' ? handleStateSelect(st) : handleQuizAnswer(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer transition flex items-center gap-1 ${
                    selectedState.id === st.id && activeMode === 'explore'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-sky-100 text-slate-700'
                  }`}
                >
                  <span>{st.id}</span>
                  <span className="text-[10px] font-medium opacity-80">{st.nameEn.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Information Display / Quiz Card */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          
          {activeMode === 'explore' ? (
            /* State Exploration Detail Card */
            <div className="bg-white rounded-3xl border-2 border-sky-300 shadow-sm p-6 flex flex-col justify-between h-full animate-in fade-in">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-sky-100 text-sky-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                    {selectedState.zone} India • {selectedState.id}
                  </span>
                  <button
                    onClick={() => speakIndianEnglish(selectedState.nameEn, selectedState.capitalEn)}
                    className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl shadow transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Volume2 className="w-4 h-4" /> Listen Again
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

                {/* Landmark */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Famous Heritage &amp; Landmark (धरोहर)
                  </span>
                  <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                    <span className="text-3xl">{selectedState.landmarkEmoji}</span>
                    <span className="text-xs font-black text-amber-950">
                      {selectedState.landmark}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-center text-xs font-bold text-slate-500 mt-4">
                🔊 Spoken: &quot;{selectedState.nameEn}. Capital is {selectedState.capitalEn}.&quot;
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
                      onClick={() => speakIndianEnglish(
                        `Find the state whose capital is ${quizList[qIdx].capitalEn}`,
                        ''
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
                      👉 नक्शे या सूची से वह राज्य चुनें जिसकी राजधानी <strong>{quizList[qIdx].capitalEn}</strong> है!
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
                  <h3 className="text-xl font-black text-slate-900 mb-1">Geography Challenge Finished!</h3>
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