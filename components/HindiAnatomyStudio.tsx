'use client';

import React, { useState, useEffect } from 'react';
import { 
  Volume2, Sparkles, Smile, Frown
} from 'lucide-react';

type SubModule = 'body' | 'teeth';

interface BodyPin {
  id: string;
  nameEn: string;
  nameHi: string;
  x: number; // exact % in relation to SVG height/width
  y: number;
  badgeBg: string;
  funFactEn: string;
  funFactHi: string;
  senseEn: string;
  senseHi: string;
}

// Exactly calibrated to the 200 x 320 SVG viewBox
const BODY_PINS: BodyPin[] = [
  { id: 'hair', nameEn: 'Hair & Head', nameHi: 'सिर और बाल', x: 50, y: 7, badgeBg: '#7c3aed', senseEn: 'Protects the brain helmet!', senseHi: 'मस्तिष्क को सुरक्षित रखता है!', funFactEn: 'Humans have around 100,000 hairs on their head.', funFactHi: 'हमारे सिर पर लगभग 1 लाख बाल होते हैं।' },
  { id: 'eyes', nameEn: 'Eyes', nameHi: 'आँखें', x: 44, y: 16.5, badgeBg: '#0284c7', senseEn: 'Sense of Sight (देखना)', senseHi: 'देखने की ज्ञानेंद्रिय', funFactEn: 'Your eyes blink about 20,000 times a day!', funFactHi: 'आँखें दिन भर में लगभग 20,000 बार झपकती हैं!' },
  { id: 'ears', nameEn: 'Ears', nameHi: 'कान', x: 67, y: 17.5, badgeBg: '#d97706', senseEn: 'Sense of Hearing (सुनना)', senseHi: 'सुनने की ज्ञानेंद्रिय', funFactEn: 'Ears also keep your body balanced so you don’t fall.', funFactHi: 'कान हमारे शरीर का संतुलन बनाए रखने में भी मदद करते हैं।' },
  { id: 'nose', nameEn: 'Nose', nameHi: 'नाक', x: 50, y: 20, badgeBg: '#059669', senseEn: 'Sense of Smell (सूँघना)', senseHi: 'सूँघने की ज्ञानेंद्रिय', funFactEn: 'Your nose can recognize up to 50,000 distinct smells.', funFactHi: 'नाक 50,000 अलग-अलग तरह की गंध पहचान सकती है।' },
  { id: 'mouth', nameEn: 'Teeth & Tongue', nameHi: 'दाँत और मुँह', x: 50, y: 24, badgeBg: '#e11d48', senseEn: 'Sense of Taste (स्वाद व चबाना)', senseHi: 'स्वाद व भोजन चबाना', funFactEn: 'Enamel on your teeth is harder than your bones!', funFactHi: 'दाँतों का एनामेल हमारी हड्डियों से भी ज्यादा कठोर होता है।' },
  { id: 'chest', nameEn: 'Chest & Heart', nameHi: 'छाती और हृदय', x: 50, y: 36, badgeBg: '#e11d48', senseEn: 'Pumps blood day and night', senseHi: 'दिन-रात रक्त पंप करता है', funFactEn: 'Your heart beats around 100,000 times every day!', funFactHi: 'हमारा दिल हर रोज़ लगभग 1 लाख बार धड़कता है!' },
  { id: 'hands', nameEn: 'Hands & Fingers', nameHi: 'हाथ और उँगलियाँ', x: 19, y: 47, badgeBg: '#ea580c', senseEn: 'Sense of Touch (स्पर्श)', senseHi: 'स्पर्श और चीज़ें पकड़ना', funFactEn: 'Each hand has 27 small bones working together.', funFactHi: 'प्रत्येक हाथ में 27 छोटी हड्डियाँ मिलकर काम करती हैं।' },
  { id: 'stomach', nameEn: 'Stomach (Abdomen)', nameHi: 'पेट (आमाशय)', x: 50, y: 47, badgeBg: '#8b5cf6', senseEn: 'Food Digestion Center', senseHi: 'भोजन पाचन केंद्र', funFactEn: 'The stomach digests food using natural juices.', funFactHi: 'पेट भोजन को पाचक रसों से ऊर्जा में बदलता है।' },
  { id: 'knees', nameEn: 'Knees & Legs', nameHi: 'घुटने और पैर', x: 40, y: 77, badgeBg: '#0284c7', senseEn: 'Mobility & Jump (चलना-दौड़ना)', senseHi: 'दौड़ना और कूदना', funFactEn: 'The femur (thigh bone) is the strongest bone in the body.', funFactHi: 'जांघ की फीमर हड्डी शरीर की सबसे मजबूत हड्डी है।' },
  { id: 'feet', nameEn: 'Feet & Toes', nameHi: 'पंजे और पैर', x: 38, y: 89, badgeBg: '#10b981', senseEn: 'Body Balance & Support', senseHi: 'शरीर का आधार व संतुलन', funFactEn: 'One quarter of all your bones are in your feet.', funFactHi: 'शरीर की एक-चौथाई हड्डियाँ हमारे पंजों में होती हैं।' }
];

interface DentalFood {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  type: 'sparkle' | 'cavity';
  color: string;
  tipEn: string;
  tipHi: string;
}

const DENTAL_FOODS: DentalFood[] = [
  { id: 'milk', nameEn: 'Pure Milk', nameHi: 'ताज़ा दूध', icon: '🥛', type: 'sparkle', color: '#38bdf8', tipEn: 'Calcium builds gleaming white tooth enamel!', tipHi: 'कैल्शियम दाँतों की रक्षा परत को मजबूत बनाता है!' },
  { id: 'apple', nameEn: 'Crisp Apple', nameHi: 'लाल सेब', icon: '🍎', type: 'sparkle', color: '#ef4444', tipEn: 'Crunchy fiber washes away sticky particles!', tipHi: 'सेब के प्राकृतिक रेशे दाँतों की सफाई करते हैं!' },
  { id: 'cheese', nameEn: 'Cheddar Cheese', nameHi: 'पनीर (चीज़)', icon: '🧀', type: 'sparkle', color: '#f59e0b', tipEn: 'Neutralizes harmful mouth acids after meals.', tipHi: 'मुँह में बनने वाले हानिकारक एसिड को खत्म करता है।' },
  { id: 'carrot', nameEn: 'Crunchy Carrot', nameHi: 'गाजर', icon: '🥕', type: 'sparkle', color: '#ea580c', tipEn: 'Chewing raw carrots massages gums naturally.', tipHi: 'कच्ची गाजर चबाने से मसूड़े स्वस्थ रहते हैं।' },
  { id: 'cola', nameEn: 'Fizzy Soda', nameHi: 'कोला / सोडा', icon: '🥤', type: 'cavity', color: '#991b1b', tipEn: 'High sugar and acid strip enamel shields!', tipHi: 'अम्ल और अधिक चीनी दाँतों के कवच को गला देते हैं!' },
  { id: 'candy', nameEn: 'Sticky Candy', nameHi: 'चिपचिपी टॉफ़ी', icon: '🍬', type: 'cavity', color: '#db2777', tipEn: 'Sticks between teeth and feeds cavity bacteria.', tipHi: 'दाँतों में फंसकर कीड़ों (कैविटी) को न्योता देती है।' },
  { id: 'donut', nameEn: 'Glazed Donut', nameHi: 'मीठा डोनट', icon: '🍩', type: 'cavity', color: '#b45309', tipEn: 'Refined sugar sticks in molars for hours.', tipHi: 'रिफाइंड चीनी दाँतों के कोनों में चिपकी रहती है।' },
  { id: 'choc', nameEn: 'Sweet Chocolate', nameHi: 'चॉकलेट', icon: '🍫', type: 'cavity', color: '#78350f', tipEn: 'Sweet residues cause tooth decay if unbrushed.', tipHi: 'बिना कुल्ला किए दाँत में सड़न पैदा करती है।' }
];

export function HindiAnatomyStudio() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [subModule, setSubModule] = useState<SubModule>('body');

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      stopAudio();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      u.rate = 0.88;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  // TAB 1: BODY ANATOMY
  const [selectedPin, setSelectedPin] = useState<BodyPin>(BODY_PINS[7]); // Default Stomach
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizTarget, setQuizTarget] = useState<BodyPin>(BODY_PINS[3]);
  const [quizScore, setQuizScore] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const startQuiz = () => {
    setIsQuizMode(true);
    const nextPin = BODY_PINS[Math.floor(Math.random() * BODY_PINS.length)];
    setQuizTarget(nextPin);
    setFeedbackMsg(null);
    playSpeech(lang === 'hi' ? `ढूंढो: ${nextPin.nameHi} कहाँ है? उस पर टैप करो!` : `Can you locate the ${nextPin.nameEn}? Tap it!`);
  };

  const handlePinClick = (pin: BodyPin) => {
    setSelectedPin(pin);
    if (isQuizMode) {
      if (pin.id === quizTarget.id) {
        setQuizScore(s => s + 1);
        setFeedbackMsg(lang === 'hi' ? `शाबाश! आपने ${pin.nameHi} सही पहचाना! ⭐` : `Spot on! You found the ${pin.nameEn}! ⭐`);
        playSpeech(lang === 'hi' ? `शाबाश! बिल्कुल सही!` : `Spot on! Great work!`);
        setTimeout(() => {
          const rand = BODY_PINS[Math.floor(Math.random() * BODY_PINS.length)];
          setQuizTarget(rand);
          setFeedbackMsg(null);
          playSpeech(lang === 'hi' ? `अब ढूंढो: ${rand.nameHi}` : `Now find: ${rand.nameEn}`);
        }, 1500);
      } else {
        setFeedbackMsg(lang === 'hi' ? `यह ${pin.nameHi} है। दोबारा प्रयास करो!` : `That is the ${pin.nameEn}. Try again!`);
        playSpeech(lang === 'hi' ? `यह ${pin.nameHi} है।` : `That is ${pin.nameEn}.`);
      }
    } else {
      playSpeech(lang === 'hi' ? `${pin.nameHi}। ${pin.senseHi}। ${pin.funFactHi}` : `${pin.nameEn}. ${pin.senseEn}. ${pin.funFactEn}`);
    }
  };

  // TAB 2: TOOTH DEFENDER
  const [foodIndex, setFoodIndex] = useState(0);
  const [defenderScore, setDefenderScore] = useState(0);
  const [defenderStatus, setDefenderStatus] = useState<string | null>(null);
  const [sparkleAnim, setSparkleAnim] = useState(false);
  const [cavityAnim, setCavityAnim] = useState(false);

  const activeFood = DENTAL_FOODS[foodIndex];

  const sortFood = (choice: 'sparkle' | 'cavity') => {
    if (!activeFood) return;
    const isCorrect = choice === activeFood.type;

    if (isCorrect) {
      setDefenderScore(s => s + 1);
      if (choice === 'sparkle') {
        setSparkleAnim(true);
        setTimeout(() => setSparkleAnim(false), 1200);
        setDefenderStatus(lang === 'hi' ? `शानदार! ${activeFood.nameHi} से दाँत चमक उठे! 🦷✨` : `Great choice! ${activeFood.nameEn} guards your smile! 🦷✨`);
        playSpeech(lang === 'hi' ? `${activeFood.nameHi} दाँतों के लिए बहुत अच्छा है!` : `${activeFood.nameEn} makes teeth gleam!`);
      } else {
        setCavityAnim(true);
        setTimeout(() => setCavityAnim(false), 1200);
        setDefenderStatus(lang === 'hi' ? `बहुत खूब! ${activeFood.nameHi} से दाँत बचा लिए! 🛡️` : `Smart shield! Saved teeth from ${activeFood.nameEn}! 🛡️`);
        playSpeech(lang === 'hi' ? `शाबाश! यह कीड़ा पैदा करता है।` : `Good save! Avoid sugary decay.`);
      }
    } else {
      setDefenderStatus(lang === 'hi' ? `ओह! दोबारा सोचें कि यह दाँतों को चमकाता है या कीड़ा लगाता है।` : `Oops! Rethink if this feeds sparkle or cavities.`);
      playSpeech(lang === 'hi' ? `दोबारा सोचें!` : `Think again!`);
    }

    setTimeout(() => {
      setDefenderStatus(null);
      setFoodIndex((foodIndex + 1) % DENTAL_FOODS.length);
    }, 1600);
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-emerald-50/40 rounded-3xl border-2 border-emerald-200 shadow-xl p-4 md:p-7 select-none overflow-hidden font-sans">
      
      {/* Top Studio Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-600/20">
            🧬
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-emerald-950 tracking-tight flex items-center gap-2">
              {lang === 'hi' ? 'हमारा शरीर व दाँतों की रक्षा' : 'Human Anatomy & Tooth Defender'}
              <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                NEP 2020 EVS
              </span>
            </h2>
            <p className="text-xs text-emerald-800/80 font-bold">
              {lang === 'hi' 
                ? 'सचित्र ज्ञानेंद्रियाँ, शरीर रचना और स्वस्थ दाँतों का खेल' 
                : 'Interactive anatomical pointer, sense organs & dental care playground'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-emerald-100/70 p-1 rounded-2xl border border-emerald-200 gap-1 text-xs font-black">
            <button
              onClick={() => { stopAudio(); setSubModule('body'); }}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                subModule === 'body' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-emerald-900 hover:bg-emerald-200/60'
              }`}
            >
              👦 {lang === 'hi' ? 'शरीर के अंग व ज्ञानेंद्रियाँ' : 'Body & Senses'}
            </button>
            <button
              onClick={() => { stopAudio(); setSubModule('teeth'); }}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                subModule === 'teeth' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-emerald-900 hover:bg-emerald-200/60'
              }`}
            >
              🦷 {lang === 'hi' ? 'दाँतों की रक्षा (Defender)' : 'Tooth Defender'}
            </button>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-emerald-200 shadow-xs gap-1 text-xs font-black">
            <button
              onClick={() => { stopAudio(); setLang('hi'); }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                lang === 'hi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => { stopAudio(); setLang('en'); }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* GAME 1: PRECISE ANATOMICAL AVATAR WITH CLEAN PIN MARKERS  */}
      {/* ========================================================= */}
      {subModule === 'body' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Avatar Canvas */}
          <div className="lg:col-span-6 bg-gradient-to-b from-sky-50 via-emerald-50/40 to-amber-50/20 rounded-3xl border-2 border-emerald-200 p-4 flex flex-col items-center justify-center relative shadow-inner min-h-[460px]">
            
            <div className="w-full flex items-center justify-between mb-2 px-2 z-10">
              <span className="text-[11px] font-black text-emerald-900 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
                {isQuizMode 
                  ? (lang === 'hi' ? `🎯 ढूंढो: ${quizTarget.nameHi}` : `🎯 Find: ${quizTarget.nameEn}`)
                  : (lang === 'hi' ? '👉 किसी भी अंग के पिन पर टैप करें' : '👉 Tap any landmark pin')}
              </span>

              {isQuizMode ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    ⭐ {quizScore}
                  </span>
                  <button
                    onClick={() => { setIsQuizMode(false); setFeedbackMsg(null); }}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    {lang === 'hi' ? 'बंद करें' : 'Stop'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={startQuiz}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === 'hi' ? 'क्विज़ खेलें' : 'Play Quiz'}
                </button>
              )}
            </div>

            {feedbackMsg && (
              <div className="absolute top-14 inset-x-4 z-20 p-2.5 bg-white/95 backdrop-blur-md border-2 border-amber-300 rounded-2xl text-xs font-black text-amber-950 text-center shadow-lg animate-in fade-in zoom-in-95">
                {feedbackMsg}
              </div>
            )}

            {/* Child Avatar SVG */}
            <div className="relative w-64 h-[380px] flex items-center justify-center">
              
              <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-md">
                <defs>
                  <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fed7aa" />
                    <stop offset="100%" stopColor="#fdba74" />
                  </linearGradient>
                  <linearGradient id="shirt" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <linearGradient id="shorts" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>

                {/* Hair */}
                <path d="M 68 45 C 60 15, 140 15, 132 45 C 145 35, 130 18, 100 18 C 70 18, 55 35, 68 45 Z" fill="#451a03" />
                
                {/* Ears */}
                <circle cx="68" cy="55" r="9" fill="url(#skin)" stroke="#fb923c" strokeWidth="1.5" />
                <circle cx="132" cy="55" r="9" fill="url(#skin)" stroke="#fb923c" strokeWidth="1.5" />

                {/* Head */}
                <ellipse cx="100" cy="56" rx="32" ry="34" fill="url(#skin)" stroke="#fb923c" strokeWidth="1.5" />

                {/* Eyes */}
                <ellipse cx="88" cy="52" rx="4.5" ry="6" fill="#0f172a" />
                <ellipse cx="112" cy="52" rx="4.5" ry="6" fill="#0f172a" />
                <circle cx="90" cy="50" r="1.5" fill="#ffffff" />
                <circle cx="114" cy="50" r="1.5" fill="#ffffff" />

                {/* Cheeks */}
                <circle cx="80" cy="62" r="5" fill="#f43f5e" opacity="0.3" />
                <circle cx="120" cy="62" r="5" fill="#f43f5e" opacity="0.3" />

                {/* Nose & Smile */}
                <path d="M 100 56 L 98 62 L 102 62" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 91 69 Q 100 78 109 69" fill="#ffffff" stroke="#991b1b" strokeWidth="1.5" />

                {/* Neck */}
                <rect x="93" y="87" width="14" height="12" fill="url(#skin)" />

                {/* T-Shirt (y: 98 to 168) */}
                <path d="M 72 98 L 128 98 L 136 168 L 64 168 Z" fill="url(#shirt)" rx="8" />

                {/* Arms */}
                <path d="M 72 100 L 40 145 L 48 152 L 76 115 Z" fill="url(#skin)" stroke="#fb923c" strokeWidth="1" />
                <path d="M 128 100 L 160 145 L 152 152 L 124 115 Z" fill="url(#skin)" stroke="#fb923c" strokeWidth="1" />

                {/* Hands */}
                <circle cx="38" cy="150" r="8" fill="url(#skin)" stroke="#fb923c" strokeWidth="1" />
                <circle cx="162" cy="150" r="8" fill="url(#skin)" stroke="#fb923c" strokeWidth="1" />

                {/* Shorts (y: 168 to 215) */}
                <path d="M 64 168 L 136 168 L 140 215 L 105 215 L 100 185 L 95 215 L 60 215 Z" fill="url(#shorts)" />

                {/* Legs (y: 215 to 280) */}
                <rect x="72" y="215" width="16" height="65" rx="7" fill="url(#skin)" stroke="#fb923c" strokeWidth="1" />
                <rect x="112" y="215" width="16" height="65" rx="7" fill="url(#skin)" stroke="#fb923c" strokeWidth="1" />

                {/* Knee joints */}
                <circle cx="80" cy="245" r="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
                <circle cx="120" cy="245" r="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />

                {/* Shoes */}
                <ellipse cx="76" cy="285" rx="15" ry="8" fill="#e11d48" />
                <ellipse cx="124" cy="285" rx="15" ry="8" fill="#e11d48" />
              </svg>

              {/* Precise Clean Landmark Pins */}
              {BODY_PINS.map((pin) => {
                const isSelected = selectedPin.id === pin.id;
                const isTarget = isQuizMode && quizTarget.id === pin.id;

                return (
                  <button
                    key={pin.id}
                    onClick={() => handlePinClick(pin)}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition z-20 group"
                    title={pin.nameEn}
                  >
                    {/* Active pulse ring ONLY for the selected/target item */}
                    {(isSelected || isTarget) && (
                      <span 
                        style={{ backgroundColor: pin.badgeBg }} 
                        className="absolute inset-0 rounded-full animate-ping opacity-50 scale-140" 
                      />
                    )}

                    {/* Small clean badge disc */}
                    <div 
                      style={{ backgroundColor: pin.badgeBg }}
                      className={`w-5 h-5 md:w-6 md:h-6 rounded-full text-white flex items-center justify-center font-black text-[10px] shadow-md border-2 border-white transition-transform ${
                        isSelected 
                          ? 'scale-125 ring-2 ring-emerald-500 shadow-lg' 
                          : 'opacity-85 hover:scale-120 hover:opacity-100'
                      }`}
                    >
                      ✓
                    </div>
                  </button>
                );
              })}
            </div>

            <span className="text-[10px] font-bold text-slate-400 mt-2">
              {lang === 'hi' ? 'मानव शरीर रचना गाइड (NEP 2020)' : 'NEP 2020 Interactive Anatomical Avatar'}
            </span>
          </div>

          {/* Right Column: Detailed Info Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-emerald-200 p-6 flex flex-col justify-between shadow-sm min-h-[460px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span 
                  style={{ backgroundColor: `${selectedPin.badgeBg}15`, color: selectedPin.badgeBg }}
                  className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider"
                >
                  {lang === 'hi' ? 'अंग का विवरण' : 'Organ Detail'}
                </span>

                <button
                  onClick={() => playSpeech(lang === 'hi' ? `${selectedPin.nameHi}। ${selectedPin.senseHi}। ${selectedPin.funFactHi}` : `${selectedPin.nameEn}. ${selectedPin.senseEn}. ${selectedPin.funFactEn}`)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  {lang === 'hi' ? 'उच्चारण व तथ्य सुनें' : 'Listen Fact'}
                </button>
              </div>

              <div className="my-5 flex items-center gap-4 bg-emerald-50/50 p-4 rounded-3xl border border-emerald-200">
                <div 
                  style={{ backgroundColor: selectedPin.badgeBg }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white shadow-md shadow-emerald-900/10 shrink-0"
                >
                  ✨
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {lang === 'hi' ? selectedPin.nameHi : selectedPin.nameEn}
                  </h3>
                  <span className="text-xs font-black text-emerald-800 block mt-0.5">
                    {lang === 'hi' ? selectedPin.senseHi : selectedPin.senseEn}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50/80 border-2 border-amber-200/80 p-4 rounded-2xl mb-4">
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-1">
                  💡 {lang === 'hi' ? 'रोचक वैज्ञानिक तथ्य (Scientific Fact):' : 'Anatomy Busy Book Fun Fact:'}
                </span>
                <p className="text-xs font-bold text-slate-800 leading-relaxed">
                  {lang === 'hi' ? selectedPin.funFactHi : selectedPin.funFactEn}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                {lang === 'hi' ? 'सीधे अंग चुनें:' : 'Jump to Body Part:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {BODY_PINS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handlePinClick(p)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedPin.id === p.id 
                        ? 'bg-slate-900 text-white font-black' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {lang === 'hi' ? p.nameHi.split(' ')[0] : p.nameEn.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* GAME 2: GLOSSY 3D TOOTH DEFENDER ARENA                   */}
      {/* ========================================================= */}
      {subModule === 'teeth' && (
        <div className="flex flex-col gap-6">
          
          <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/70 p-4 rounded-3xl border-2 border-blue-200">
            <div>
              <h3 className="text-base font-black text-blue-950">
                {lang === 'hi' ? 'दाँतों की रक्षा: मोती जैसे चमकते दाँत बनाम कैविटी कीड़ा' : 'Tooth Defender: Sparkling Tooth vs. Cavity Bug'}
              </h3>
              <p className="text-xs text-blue-800 font-bold">
                {lang === 'hi' 
                  ? 'सामने आए भोजन को छांटें—स्वस्थ दाँत को खिलाएं या कीड़े से दूर रखें!' 
                  : 'Sort the food on the table—nourish the Sparkle Tooth or discard cavity-causing sweets!'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-white px-3.5 py-1.5 rounded-xl border border-blue-200 text-blue-950 shadow-xs">
                ⭐ {lang === 'hi' ? 'स्कोर:' : 'Score:'} {defenderScore}
              </span>
              <button
                onClick={() => playSpeech(lang === 'hi'
                  ? 'कैल्शियम, दूध और फल दाँतों को मजबूत बनाते हैं। टॉफी, कोल्ड ड्रिंक और अधिक मीठा दाँतों में कीड़ा लगाते हैं।'
                  : 'Milk, apples, and cheese build strong teeth. Sticky candies and sodas feed cavity bacteria.')}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'नियम सुनें' : 'Listen Rule'}
              </button>
            </div>
          </div>

          {defenderStatus && (
            <div className="p-3 bg-white border-2 border-blue-400 rounded-2xl text-xs font-black text-slate-900 text-center shadow-md animate-in zoom-in-95">
              {defenderStatus}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Happy Tooth */}
            <div className={`md:col-span-4 bg-gradient-to-b from-sky-50 to-blue-100/70 border-3 border-blue-300 rounded-3xl p-5 flex flex-col items-center justify-between text-center shadow-lg transition-transform ${
              sparkleAnim ? 'scale-105 ring-4 ring-sky-400' : ''
            }`}>
              
              <div className="relative w-32 h-36 flex items-center justify-center">
                <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-lg">
                  <path 
                    d="M 25 15 C 40 10, 60 10, 75 15 C 90 20, 95 45, 90 75 C 85 95, 75 105, 65 95 C 55 85, 45 85, 35 95 C 25 105, 15 95, 10 75 C 5 45, 10 20, 25 15 Z" 
                    fill="#ffffff" 
                    stroke="#38bdf8" 
                    strokeWidth="3"
                  />
                  <path 
                    d="M 22 25 C 28 20, 42 20, 42 25 C 42 35, 20 40, 22 25 Z" 
                    fill="#e0f2fe" 
                    opacity="0.8" 
                  />
                  <circle cx="38" cy="45" r="4.5" fill="#0f172a" />
                  <circle cx="62" cy="45" r="4.5" fill="#0f172a" />
                  <circle cx="40" cy="43" r="1.5" fill="#ffffff" />
                  <circle cx="64" cy="43" r="1.5" fill="#ffffff" />
                  <circle cx="30" cy="53" r="4" fill="#f43f5e" opacity="0.4" />
                  <circle cx="70" cy="53" r="4" fill="#f43f5e" opacity="0.4" />
                  <path d="M 40 58 Q 50 68 60 58" fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
                </svg>

                <div className="absolute -top-1 -right-1 text-2xl animate-spin [animation-duration:6s]">
                  ✨
                </div>
              </div>

              <div className="my-2">
                <h4 className="text-base font-black text-blue-950">
                  {lang === 'hi' ? 'मोती जैसा चमकता दाँत' : 'Happy Sparkle Tooth'}
                </h4>
                <p className="text-[11px] font-bold text-blue-800">
                  {lang === 'hi' ? 'दूध, फल व हरी सब्जियाँ पसंद हैं!' : 'Thrives on milk, fruit & calcium!'}
                </p>
              </div>

              <button
                onClick={() => sortFood('sparkle')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Smile className="w-4 h-4" />
                {lang === 'hi' ? 'दाँत को खिलाएं (स्वस्थ भोजन)' : 'Feed Sparkle Tooth (Healthy)'}
              </button>
            </div>

            {/* Center Food Plate */}
            <div className="md:col-span-4 bg-white border-2 border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-between text-center shadow-lg min-h-[300px]">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {lang === 'hi' ? 'इस भोजन की पहचान करें:' : 'Inspect This Plate:'}
              </span>

              <div className="my-auto flex flex-col items-center">
                <div 
                  style={{ backgroundColor: `${activeFood.color}15`, borderColor: `${activeFood.color}40` }}
                  className="w-28 h-28 rounded-3xl border-3 flex items-center justify-center text-6xl shadow-inner mb-3 transition-transform hover:scale-105"
                >
                  {activeFood.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  {lang === 'hi' ? activeFood.nameHi : activeFood.nameEn}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1 max-w-[220px]">
                  {lang === 'hi' ? activeFood.tipHi : activeFood.tipEn}
                </p>
              </div>

              <span className="text-[10px] font-extrabold text-slate-400">
                {lang === 'hi' ? 'बाएं या दाएं बटन दबाकर सही दाँत चुनें' : 'Choose left or right button'}
              </span>
            </div>

            {/* Cavity Tooth */}
            <div className={`md:col-span-4 bg-gradient-to-b from-rose-50 to-amber-100/70 border-3 border-rose-300 rounded-3xl p-5 flex flex-col items-center justify-between text-center shadow-lg transition-transform ${
              cavityAnim ? 'scale-105 ring-4 ring-rose-400' : ''
            }`}>
              
              <div className="relative w-32 h-36 flex items-center justify-center">
                <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-lg">
                  <path 
                    d="M 25 15 C 40 10, 60 10, 75 15 C 90 20, 95 45, 90 75 C 85 95, 75 105, 65 95 C 55 85, 45 85, 35 95 C 25 105, 15 95, 10 75 C 5 45, 10 20, 25 15 Z" 
                    fill="#fef2f2" 
                    stroke="#f43f5e" 
                    strokeWidth="3"
                  />
                  <path d="M 68 18 C 76 16, 84 25, 78 30 C 72 32, 65 24, 68 18 Z" fill="#78350f" />
                  <circle cx="28" cy="30" r="3" fill="#78350f" opacity="0.6" />
                  <ellipse cx="38" cy="48" rx="4" ry="5" fill="#451a03" />
                  <ellipse cx="62" cy="48" rx="4" ry="5" fill="#451a03" />
                  <path d="M 40 68 Q 50 58 60 68" fill="none" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" />
                </svg>

                <div className="absolute top-2 left-2 text-xl">
                  👾
                </div>
              </div>

              <div className="my-2">
                <h4 className="text-base font-black text-rose-950">
                  {lang === 'hi' ? 'कीड़ा / कैविटी का खतरा' : 'Cavity Bug Risk'}
                </h4>
                <p className="text-[11px] font-bold text-rose-800">
                  {lang === 'hi' ? 'चिपचिपा मीठा व सोडा नुकसान पहुंचाते हैं!' : 'Sugars and sodas invite decay!'}
                </p>
              </div>

              <button
                onClick={() => sortFood('cavity')}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Frown className="w-4 h-4" />
                {lang === 'hi' ? 'रोकें / कूड़े में डालें (हानिकारक)' : 'Avoid / Junk Food Shield'}
              </button>
            </div>

          </div>

          {/* Dental Care Steps */}
          <div className="bg-white rounded-3xl border-2 border-emerald-200 p-5 shadow-xs">
            <span className="text-xs font-black uppercase text-emerald-950 tracking-wider block mb-3">
              🪥 {lang === 'hi' ? 'सही तरीके से दाँत साफ़ करने के ४ नियम (Dental Hygiene):' : '4 Easy Steps to Proper Brushing (from Busy Book):'}
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { step: '1', titleEn: 'Pea-sized Paste', titleHi: 'मटर जितना पेस्ट', icon: '🪥', descEn: 'Apply soft fluoridated toothpaste.', descHi: 'ब्रश पर थोड़ा सा पेस्ट लगाएं।' },
                { step: '2', titleEn: 'Circular Scrub', titleHi: 'गोल-गोल ब्रश', icon: '🔄', descEn: 'Brush outer and inner surfaces in circles.', descHi: 'हल्के हाथों से २ मिनट गोल-गोल घुमाएं।' },
                { step: '3', titleEn: 'Clean Water Rinse', titleHi: 'अच्छी तरह कुल्ला', icon: '💧', descEn: 'Rinse mouth thoroughly with water.', descHi: 'साफ पानी से मुँह धोएं।' },
                { step: '4', titleEn: 'Twice Every Day', titleHi: 'दिन में दो बार', icon: '✨', descEn: 'Morning and before bedtime for sparkle!', descHi: 'सुबह और रात को सोने से पहले!' }
              ].map(s => (
                <div key={s.step} className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-xs font-black text-slate-900 leading-tight">
                      {lang === 'hi' ? s.titleHi : s.titleEn}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600">
                    {lang === 'hi' ? s.descHi : s.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}