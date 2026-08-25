'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Trophy, Star, ArrowRight, RotateCcw, 
  MapPin, Compass, Search, CheckCircle2, XCircle, Eye, Sparkles
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

          {/* Authentic Topographic Map Container */}
          <div className="w-full flex items-center justify-center relative p-3 bg-[#f8f5ea] rounded-2xl border-2 border-amber-300 shadow-inner overflow-hidden">
            
            <div className="relative w-full max-w-[420px] aspect-[4/5] select-none rounded-xl overflow-hidden shadow-md">
              
              {/* Genuine India Vector Map Graphic */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/India_states_and_union_territories_map.svg/800px-India_states_and_union_territories_map.svg.png"
                alt="Real Map of India"
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Interactive State Hotspot Pins Placed on Real Map */}
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
                भारत का राजनीतिक मानचित्र (Political Map of India)
              </h3>
              <button
                onClick={() => setShowFullMapModal(false)}
                className="p-1.5 bg-slate-100 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs cursor-pointer"
              >
                ✕ बंद करें (Close)
              </button>
            </div>
            
            <div className="max-h-[70vh] overflow-auto rounded-2xl border border-slate-200">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/India_states_and_union_territories_map.svg/800px-India_states_and_union_territories_map.svg.png"
                alt="Political Map of India"
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}