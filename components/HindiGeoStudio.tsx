'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Trophy, Star, ArrowRight, RotateCcw, 
  MapPin, Compass, Search, CheckCircle2, XCircle, Eye
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
  topPercent: number;
  leftPercent: number;
  color: string;
}

const INDIA_STATES_DATA: StateData[] = [
  {
    id: 'JK',
    nameEn: 'Jammu & Kashmir / Ladakh',
    nameHi: 'जम्मू और कश्मीर व लद्दाख',
    capitalEn: 'Srinagar / Jammu / Leh',
    capitalHi: 'श्रीनगर / जम्मू / लेह',
    landmark: 'Dal Lake & Pangong Tso (डल झील)',
    landmarkEmoji: '⛵',
    zone: 'North',
    topPercent: 12,
    leftPercent: 32,
    color: '#EA580C'
  },
  {
    id: 'HP',
    nameEn: 'Himachal Pradesh',
    nameHi: 'हिमाचल प्रदेश',
    capitalEn: 'Shimla',
    capitalHi: 'शिमला',
    landmark: 'Rohtang Pass & Apple Valleys (रोहतांग दर्रा)',
    landmarkEmoji: '🍎',
    zone: 'North',
    topPercent: 19,
    leftPercent: 35,
    color: '#DB2777'
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
    topPercent: 23,
    leftPercent: 29,
    color: '#4F46E5'
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
    topPercent: 25,
    leftPercent: 40,
    color: '#16A34A'
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
    topPercent: 29,
    leftPercent: 34,
    color: '#E11D48'
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
    topPercent: 35,
    leftPercent: 24,
    color: '#EA580C'
  },
  {
    id: 'UP',
    nameEn: 'Uttar Pradesh',
    nameHi: 'उत्तर प्रदेश',
    capitalEn: 'Lucknow',
    capitalHi: 'लखनऊ',
    landmark: 'Taj Mahal & Varanasi Ghats (ताजमहल)',
    landmarkEmoji: '🕌',
    zone: 'North',
    topPercent: 36,
    leftPercent: 46,
    color: '#CA8A04'
  },
  {
    id: 'BR',
    nameEn: 'Bihar',
    nameHi: 'बिहार',
    capitalEn: 'Patna',
    capitalHi: 'पटना',
    landmark: 'Mahabodhi Temple & Nalanda (महाबोधि मंदिर)',
    landmarkEmoji: '🪷',
    zone: 'East',
    topPercent: 39,
    leftPercent: 60,
    color: '#9333EA'
  },
  {
    id: 'GJ',
    nameEn: 'Gujarat',
    nameHi: 'गुजरात',
    capitalEn: 'Gandhinagar',
    capitalHi: 'गांधीनगर',
    landmark: 'Statue of Unity & Gir Forest (स्टैच्यू ऑफ यूनिटी)',
    landmarkEmoji: '🦁',
    zone: 'West',
    topPercent: 47,
    leftPercent: 18,
    color: '#7E22CE'
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
    topPercent: 47,
    leftPercent: 38,
    color: '#0284C7'
  },
  {
    id: 'JH',
    nameEn: 'Jharkhand',
    nameHi: 'झारखंड',
    capitalEn: 'Ranchi',
    capitalHi: 'राँची',
    landmark: 'Betla National Park & Waterfalls (हुंडरू जलप्रपात)',
    landmarkEmoji: '🌊',
    zone: 'East',
    topPercent: 46,
    leftPercent: 58,
    color: '#EAB308'
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
    topPercent: 47,
    leftPercent: 66,
    color: '#15803D'
  },
  {
    id: 'OD',
    nameEn: 'Odisha',
    nameHi: 'ओडिशा',
    capitalEn: 'Bhubaneswar',
    capitalHi: 'भुवनेश्वर',
    landmark: 'Konark Sun Temple & Puri Beach (सूर्य मंदिर)',
    landmarkEmoji: '☀️',
    zone: 'East',
    topPercent: 57,
    leftPercent: 55,
    color: '#DC2626'
  },
  {
    id: 'CG',
    nameEn: 'Chhattisgarh',
    nameHi: 'छत्तीसगढ़',
    capitalEn: 'Raipur',
    capitalHi: 'रायपुर',
    landmark: 'Chitrakote Falls (चित्रकूट जलप्रपात)',
    landmarkEmoji: '🏞️',
    zone: 'Central',
    topPercent: 55,
    leftPercent: 48,
    color: '#A21CAF'
  },
  {
    id: 'MH',
    nameEn: 'Maharashtra',
    nameHi: 'महाराष्ट्र',
    capitalEn: 'Mumbai',
    capitalHi: 'मुंबई',
    landmark: 'Gateway of India & Ajanta (गेटवे ऑफ इंडिया)',
    landmarkEmoji: '⛵',
    zone: 'West',
    topPercent: 60,
    leftPercent: 28,
    color: '#EAB308'
  },
  {
    id: 'TG',
    nameEn: 'Telangana',
    nameHi: 'तेलंगाना',
    capitalEn: 'Hyderabad',
    capitalHi: 'हैदराबाद',
    landmark: 'Charminar & Golconda (चारमीनार)',
    landmarkEmoji: '🕌',
    zone: 'South',
    topPercent: 64,
    leftPercent: 41,
    color: '#EA580C'
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
    topPercent: 73,
    leftPercent: 38,
    color: '#16A34A'
  },
  {
    id: 'KA',
    nameEn: 'Karnataka',
    nameHi: 'कर्नाटक',
    capitalEn: 'Bengaluru',
    capitalHi: 'बेंगलुरु',
    landmark: 'Mysore Palace & Hampi (मैसूर महल)',
    landmarkEmoji: '👑',
    zone: 'South',
    topPercent: 76,
    leftPercent: 29,
    color: '#B91C1C'
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
    topPercent: 86,
    leftPercent: 36,
    color: '#EF4444'
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
    topPercent: 87,
    leftPercent: 29,
    color: '#15803D'
  },
  {
    id: 'AS',
    nameEn: 'Assam & Northeast',
    nameHi: 'असम व पूर्वोत्तर भारत',
    capitalEn: 'Dispur / Guwahati',
    capitalHi: 'दिसपुर / गुवाहाटी',
    landmark: 'Kaziranga Rhino & Tea Gardens (काजीरंगा गैंडा)',
    landmarkEmoji: '🦏',
    zone: 'Northeast',
    topPercent: 38,
    leftPercent: 80,
    color: '#2563EB'
  },
  {
    id: 'AR',
    nameEn: 'Arunachal Pradesh',
    nameHi: 'अरुणाचल प्रदेश',
    capitalEn: 'Itanagar',
    capitalHi: 'ईटानगर',
    landmark: 'Tawang Monastery (तवांग मठ)',
    landmarkEmoji: '⛩️',
    zone: 'Northeast',
    topPercent: 31,
    leftPercent: 86,
    color: '#C2410C'
  }
];

export function HindiGeoStudio() {
  const [activeMode, setActiveMode] = useState<'explore' | 'quiz'>('explore');
  const [selectedState, setSelectedState] = useState<StateData>(INDIA_STATES_DATA[6]); // UP default
  const [filterZone, setFilterZone] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFullMapModal, setShowFullMapModal] = useState<boolean>(false);
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
  // QUIZ ENGINE
  // -------------------------------------------------------------
  const [quizList, setQuizList] = useState<StateData[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);

  const initGeoQuiz = () => {
    stopAudio();
    const shuffled = [...INDIA_STATES_DATA].sort(() => 0.5 - Math.random()).slice(0, 5);
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
      speakIndianEnglish('Great job! You finished the geography challenge!', '');
    }
  };

  const filteredStates = INDIA_STATES_DATA.filter((s) => {
    const matchZone = filterZone === 'All' || s.zone === filterZone;
    const matchSearch = s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.capitalEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchZone && matchSearch;
  });

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto">
      
      {/* Top Header Mode Selector */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <div>
            <h2 className="text-sm md:text-base font-black text-slate-900 leading-tight">
              भारत दर्शन व भूगोल (Interactive India Map &amp; Capitals)
            </h2>
            <span className="text-[11px] font-bold text-sky-600">Indian English Voice • States, Capitals &amp; Heritage</span>
          </div>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setShowFullMapModal(true)}
            className="px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" /> पूरा नक्शा देखें (Full Map)
          </button>
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

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Interactive Map Canvas */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between min-h-[580px]">
          
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-600 animate-spin [animation-duration:8s]" />
              {activeMode === 'explore' ? 'नक्शे पर दिए गए पिन पर टैप करें (Tap any State Pin)' : `प्रश्न ${qIdx + 1} / 5`}
            </span>

            {/* Region Filter */}
            {activeMode === 'explore' && (
              <div className="flex gap-1 overflow-x-auto text-[10px] font-bold">
                {['All', 'North', 'South', 'West', 'East', 'Central', 'Northeast'].map((z) => (
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

          {/* Authentic Vector Map Canvas */}
          <div className="w-full flex items-center justify-center relative p-3 bg-[#faf7ee] rounded-2xl border-2 border-amber-300 shadow-inner overflow-hidden">
            
            <div className="relative w-full max-w-[420px] aspect-[4/5] select-none rounded-xl overflow-hidden shadow-md bg-white">
              
              {/* Standalone Vector Map of India */}
              <svg viewBox="0 0 400 500" className="w-full h-full">
                {/* Ocean Background */}
                <rect width="400" height="500" fill="#e0f2fe" />
                
                {/* Geographic Outlines */}
                <g stroke="#1e293b" strokeWidth="1.6" strokeLinejoin="round">
                  {/* Ladakh, J&K */}
                  <path d="M 120,40 C 140,15 185,20 195,50 C 190,85 155,95 130,95 C 110,85 105,55 120,40 Z" fill="#fb923c" />
                  <text x="145" y="65" fontSize="10" fontWeight="900" fill="#7c2d12">LADAKH</text>
                  <text x="125" y="80" fontSize="8" fontWeight="bold" fill="#7c2d12">J&amp;K</text>
                  
                  {/* Northern States */}
                  <path d="M 130,95 C 160,95 180,105 185,125 C 170,145 135,145 120,130 C 115,110 120,95 130,95 Z" fill="#86efac" />
                  <path d="M 105,120 L 130,120 L 125,145 L 100,140 Z" fill="#93c5fd" />
                  <path d="M 145,115 L 180,120 L 175,145 L 140,140 Z" fill="#f472b6" />
                  
                  {/* Rajasthan */}
                  <path d="M 115,130 C 145,135 145,175 135,210 C 95,235 60,205 50,175 C 65,140 95,130 115,130 Z" fill="#fdba74" />
                  <text x="80" y="175" fontSize="11" fontWeight="900" fill="#7c2d12">RAJASTHAN</text>
                  
                  {/* Gujarat */}
                  <path d="M 50,175 C 95,190 95,235 75,255 C 45,245 35,215 50,175 Z" fill="#d8b4fe" />
                  <text x="50" y="215" fontSize="10" fontWeight="900" fill="#581c87">GUJARAT</text>
                  
                  {/* Uttar Pradesh & Bihar */}
                  <path d="M 140,135 C 220,130 255,160 250,195 C 205,215 160,210 135,185 Z" fill="#fde047" />
                  <text x="160" y="170" fontSize="11" fontWeight="900" fill="#713f12">UTTAR PRADESH</text>
                  
                  <path d="M 235,165 C 275,165 285,195 270,215 C 245,220 230,200 235,165 Z" fill="#c084fc" />
                  <text x="240" y="195" fontSize="9" fontWeight="900" fill="#581c87">BIHAR</text>
                  
                  {/* Central India */}
                  <path d="M 110,210 C 195,200 225,230 215,265 C 155,275 105,255 110,210 Z" fill="#7dd3fc" />
                  <text x="135" y="240" fontSize="11" fontWeight="900" fill="#075985">MADHYA PRADESH</text>
                  
                  <path d="M 205,235 C 245,230 250,270 235,300 C 205,300 195,265 205,235 Z" fill="#f0abfc" />
                  <path d="M 230,200 L 265,200 L 260,240 L 225,235 Z" fill="#fde047" />
                  
                  {/* East Bengal & Odisha */}
                  <path d="M 260,195 C 285,200 285,255 265,270 C 250,250 250,215 260,195 Z" fill="#4ade80" />
                  <path d="M 225,265 C 275,260 270,315 240,335 C 215,320 215,285 225,265 Z" fill="#f87171" />
                  <text x="235" y="295" fontSize="10" fontWeight="900" fill="#7f1d1d">ODISHA</text>
                  
                  {/* Northeast */}
                  <path d="M 290,145 C 365,135 385,175 365,215 C 315,220 295,195 290,145 Z" fill="#93c5fd" />
                  <path d="M 320,130 C 375,120 385,150 365,165 Z" fill="#fb923c" />
                  <text x="315" y="175" fontSize="10" fontWeight="900" fill="#1e3a8a">ASSAM &amp; NE</text>
                  
                  {/* Maharashtra */}
                  <path d="M 95,245 C 175,245 185,295 170,340 C 115,350 85,310 95,245 Z" fill="#fde047" />
                  <text x="105" y="295" fontSize="11" fontWeight="900" fill="#713f12">MAHARASHTRA</text>
                  
                  {/* South: Telangana & AP */}
                  <path d="M 160,285 C 205,285 205,335 185,355 C 155,350 150,315 160,285 Z" fill="#fdba74" />
                  <path d="M 160,335 C 210,335 205,405 170,430 C 150,400 150,360 160,335 Z" fill="#86efac" />
                  <text x="175" y="375" fontSize="9" fontWeight="900" fill="#14532d">ANDHRA</text>
                  
                  {/* Karnataka, Kerala, Tamil Nadu */}
                  <path d="M 105,335 C 165,335 165,395 140,430 C 115,420 100,380 105,335 Z" fill="#fca5a5" />
                  <text x="110" y="380" fontSize="9" fontWeight="900" fill="#7f1d1d">KARNATAKA</text>
                  
                  <path d="M 115,415 C 130,415 130,470 120,475 C 110,465 110,435 115,415 Z" fill="#4ade80" />
                  <path d="M 125,410 C 175,410 165,475 145,480 C 125,470 120,435 125,410 Z" fill="#f87171" />
                  <text x="135" y="445" fontSize="9" fontWeight="900" fill="#7f1d1d">TAMIL NADU</text>
                  
                  {/* Islands */}
                  <ellipse cx="60" cy="435" rx="8" ry="18" fill="#fdba74" />
                  <ellipse cx="345" cy="410" rx="10" ry="32" fill="#fdba74" />
                </g>

                {/* Ocean Names */}
                <text x="25" y="320" fill="#0369a1" fontSize="9" fontWeight="900" opacity="0.8">ARABIAN SEA</text>
                <text x="275" y="320" fill="#0369a1" fontSize="9" fontWeight="900" opacity="0.8">BAY OF BENGAL</text>
                <text x="135" y="492" fill="#0369a1" fontSize="9" fontWeight="900" opacity="0.8">INDIAN OCEAN</text>
              </svg>

              {/* Clickable Hotspot Pins */}
              {INDIA_STATES_DATA.map((st) => {
                const isSelected = selectedState.id === st.id;
                const isQuizTarget = activeMode === 'quiz' && quizList[qIdx]?.id === st.id;

                let pinBg = st.color;
                if (isSelected && activeMode === 'explore') pinBg = '#0F172A';
                if (activeMode === 'quiz' && quizFeedback !== null && isQuizTarget) pinBg = '#16A34A';

                return (
                  <button
                    key={st.id}
                    onClick={() => activeMode === 'explore' ? handleStateSelect(st) : handleQuizAnswer(st)}
                    style={{
                      top: `${st.topPercent}%`,
                      left: `${st.leftPercent}%`
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 flex flex-col items-center group ${
                      isSelected && activeMode === 'explore' ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                    title={`${st.nameEn} (Capital: ${st.capitalEn})`}
                  >
                    <div
                      className="px-1.5 py-0.5 rounded-full text-[10px] font-black text-white shadow-lg border-2 border-white flex items-center gap-0.5"
                      style={{ backgroundColor: pinBg }}
                    >
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span>{st.id}</span>
                    </div>
                  </button>
                );
              })}

            </div>

          </div>

          {/* Quick Search & State Filter List */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search State or Capital (e.g. Uttar Pradesh, Jaipur, Lucknow)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-bold p-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex gap-1.5 flex-wrap max-h-20 overflow-y-auto p-1">
              {filteredStates.map((st) => (
                <button
                  key={st.id}
                  onClick={() => activeMode === 'explore' ? handleStateSelect(st) : handleQuizAnswer(st)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                    selectedState.id === st.id && activeMode === 'explore'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-sky-100 text-slate-700'
                  }`}
                >
                  <span className="font-black text-sky-700">{st.id}</span>
                  <span>{st.nameEn.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: High-Legibility Spelling & Audio Display */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          
          {activeMode === 'explore' ? (
            /* Clear Bilingual Card with Phonics Spelling */
            <div className="bg-white rounded-3xl border-2 border-sky-300 shadow-sm p-6 flex flex-col justify-between h-full animate-in fade-in">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-sky-100 text-sky-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                    {selectedState.zone} India • State Code {selectedState.id}
                  </span>
                  <button
                    onClick={() => speakIndianEnglish(selectedState.nameEn, selectedState.capitalEn)}
                    className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl shadow transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Volume2 className="w-4 h-4" /> Listen Audio
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

                {/* Capital City */}
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

                {/* Iconic Heritage & Landmark */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Famous Heritage &amp; Landmark (धरोहर)
                  </span>
                  <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                    <span className="text-3xl">{selectedState.landmarkEmoji}</span>
                    <div>
                      <span className="text-xs font-black text-amber-950 block">
                        {selectedState.landmark}
                      </span>
                      <span className="text-[10px] font-bold text-amber-800">
                        Pride of {selectedState.nameEn}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-center text-xs font-bold text-slate-600 mt-4 border border-slate-100">
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
                      👉 नक्शे पर उस राज्य के पिन पर टैप करें जिसकी राजधानी <strong>{quizList[qIdx].capitalEn}</strong> है!
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

      {/* FULL MAP MODAL POPUP */}
      {showFullMapModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 text-center relative shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                भारत का राजनीतिक व भौगोलिक मानचित्र (Map of India)
              </h3>
              <button
                onClick={() => setShowFullMapModal(false)}
                className="p-1.5 bg-slate-100 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs cursor-pointer"
              >
                ✕ बंद करें (Close)
              </button>
            </div>
            
            <div className="max-h-[70vh] overflow-auto rounded-2xl border border-slate-200 p-2 bg-[#f8f5ea]">
              <svg viewBox="0 0 400 500" className="w-full h-auto">
                <rect width="400" height="500" fill="#e0f2fe" />
                <g stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round">
                  <path d="M 120,40 C 140,15 185,20 195,50 C 190,85 155,95 130,95 C 110,85 105,55 120,40 Z" fill="#fb923c" />
                  <path d="M 130,95 C 160,95 180,105 185,125 C 170,145 135,145 120,130 C 115,110 120,95 130,95 Z" fill="#86efac" />
                  <path d="M 115,130 C 145,135 145,175 135,210 C 95,235 60,205 50,175 C 65,140 95,130 115,130 Z" fill="#fdba74" />
                  <path d="M 50,175 C 95,190 95,235 75,255 C 45,245 35,215 50,175 Z" fill="#d8b4fe" />
                  <path d="M 140,135 C 220,130 255,160 250,195 C 205,215 160,210 135,185 Z" fill="#fde047" />
                  <path d="M 235,165 C 275,165 285,195 270,215 C 245,220 230,200 235,165 Z" fill="#c084fc" />
                  <path d="M 110,210 C 195,200 225,230 215,265 C 155,275 105,255 110,210 Z" fill="#7dd3fc" />
                  <path d="M 205,235 C 245,230 250,270 235,300 C 205,300 195,265 205,235 Z" fill="#f0abfc" />
                  <path d="M 260,195 C 285,200 285,255 265,270 C 250,250 250,215 260,195 Z" fill="#4ade80" />
                  <path d="M 225,265 C 275,260 270,315 240,335 C 215,320 215,285 225,265 Z" fill="#f87171" />
                  <path d="M 290,145 C 365,135 385,175 365,215 C 315,220 295,195 290,145 Z" fill="#93c5fd" />
                  <path d="M 95,245 C 175,245 185,295 170,340 C 115,350 85,310 95,245 Z" fill="#fde047" />
                  <path d="M 160,285 C 205,285 205,335 185,355 C 155,350 150,315 160,285 Z" fill="#fdba74" />
                  <path d="M 160,335 C 210,335 205,405 170,430 C 150,400 150,360 160,335 Z" fill="#86efac" />
                  <path d="M 105,335 C 165,335 165,395 140,430 C 115,420 100,380 105,335 Z" fill="#fca5a5" />
                  <path d="M 115,415 C 130,415 130,470 120,475 C 110,465 110,435 115,415 Z" fill="#4ade80" />
                  <path d="M 125,410 C 175,410 165,475 145,480 C 125,470 120,435 125,410 Z" fill="#f87171" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}