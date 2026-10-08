'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, Heart, Smile, Frown, Trophy } from 'lucide-react';

type SubModule = 'body' | 'teeth';

interface BodyPart {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  descEn: string;
  descHi: string;
  factEn: string;
  factHi: string;
}

const BODY_PARTS: BodyPart[] = [
  { id: 'head', nameEn: 'Head & Hair', nameHi: 'सिर और बाल', icon: '👦', descEn: 'Houses the brain and thinking center!', descHi: 'यहाँ हमारा मस्तिष्क होता है जो सोचता है!', factEn: 'Your skull protects your brain like a sturdy natural helmet.', factHi: 'खोपड़ी हमारे मस्तिष्क को प्राकृतिक हेलमेट की तरह सुरक्षित रखती है।' },
  { id: 'eyes', nameEn: 'Eyes', nameHi: 'आँखें', icon: '👀', descEn: 'Help us see colors, shapes, and the world!', descHi: 'रंग, आकार व सुंदर संसार देखने में मदद करती हैं!', factEn: 'Humans blink about 15 to 20 times every single minute!', factHi: 'हम एक मिनट में लगभग 15 से 20 बार पलकें झपकाते हैं!' },
  { id: 'ears', nameEn: 'Ears', nameHi: 'कान', icon: '👂', descEn: 'Help us hear music, birds, and voices!', descHi: 'संगीत, चिड़ियों की चहचहाहट व आवाज़ें सुनते हैं!', factEn: 'The smallest bone in your body (stapes) is inside the ear.', factHi: 'शरीर की सबसे छोटी हड्डी (स्टेप्स) कान के अंदर होती है।' },
  { id: 'nose', nameEn: 'Nose', nameHi: 'नाक', icon: '👃', descEn: 'Helps us smell delicious food and breathe air!', descHi: 'खुशबू सूंघने और साँस लेने का काम करती है!', factEn: 'Your nose can remember up to 50,000 different scents.', factHi: 'हमारी नाक 50,000 अलग-अलग गंधों को याद रख सकती है।' },
  { id: 'mouth', nameEn: 'Mouth & Teeth', nameHi: 'मुँह और दाँत', icon: '👄', descEn: 'Helps us speak, taste, and chew food!', descHi: 'बोलने, स्वाद लेने और भोजन चबाने के काम आता है!', factEn: 'Teeth are covered in enamel, the hardest substance in your body.', factHi: 'दाँतों पर एनामेल की परत होती है जो शरीर का सबसे कठोर हिस्सा है।' },
  { id: 'hands', nameEn: 'Hands & Fingers', nameHi: 'हाथ और उँगलियाँ', icon: '🖐️', descEn: 'Used to write, draw, hold, and play!', descHi: 'लिखने, चित्र बनाने और चीज़ें पकड़ने में मदद करते हैं!', factEn: 'Each hand has 27 separate bones and 5 agile fingers.', factHi: 'प्रत्येक हाथ में 27 हड्डियाँ और 5 फुर्तीली उँगलियाँ होती हैं।' },
  { id: 'stomach', nameEn: 'Stomach', nameHi: 'पेट (आमाशय)', icon: '🥣', descEn: 'J-shaped organ that digests the food we eat!', descHi: 'J-आकार का अंग जो खाए हुए भोजन को पचाता है!', factEn: 'The stomach breaks down food using specialized enzymes.', factHi: 'पेट पाचक रसों से भोजन को छोटे-छोटे टुकड़ों में घोलता है।' },
  { id: 'legs', nameEn: 'Legs & Knees', nameHi: 'पैर और घुटने', icon: '🦵', descEn: 'Help us stand, run, jump, and dance!', descHi: 'दौड़ने, कूदने, नाचने और खड़े रहने में मदद करते हैं!', factEn: 'The femur in your thigh is the longest and strongest bone.', factHi: 'जांघ की हड्डी (फीमर) शरीर की सबसे लंबी और मजबूत हड्डी है।' },
  { id: 'feet', nameEn: 'Feet & Toes', nameHi: 'पंजे और पैर', icon: '🦶', descEn: 'Keep us balanced and propel our steps!', descHi: 'शरीर का संतुलन बनाए रखते हैं और चलने में मदद करते हैं!', factEn: 'Both feet together contain about 25% of all bones in your body.', factHi: 'हमारे दोनों पैरों में शरीर की कुल हड्डियों का 25% हिस्सा होता है।' }
];

interface FoodItem {
  id: string;
  nameEn: string;
  nameHi: string;
  emoji: string;
  type: 'healthy' | 'junk';
  reasonEn: string;
  reasonHi: string;
}

const FOOD_ITEMS: FoodItem[] = [
  { id: 'milk', nameEn: 'Fresh Milk', nameHi: 'दूध', emoji: '🥛', type: 'healthy', reasonEn: 'Rich in Calcium! Makes teeth enamel strong.', reasonHi: 'कैल्शियम से भरपूर! दाँतों को मजबूत बनाता है।' },
  { id: 'apple', nameEn: 'Crisp Apple', nameHi: 'सेब', emoji: '🍎', type: 'healthy', reasonEn: 'Natural crunchy fiber cleans teeth naturally.', reasonHi: 'प्राकृतिक रेशे दाँतों की प्राकृतिक सफाई करते हैं।' },
  { id: 'cheese', nameEn: 'Cheese', nameHi: 'पनीर', emoji: '🧀', type: 'healthy', reasonEn: 'Fights acid and rebuilds mineral protection.', reasonHi: 'एसिड को रोकता है और सुरक्षा परत बनाता है।' },
  { id: 'broccoli', nameEn: 'Broccoli', nameHi: 'हरी ब्रोकली', emoji: '🥦', type: 'healthy', reasonEn: 'Packed with vitamins for healthy gums.', reasonHi: 'मसूड़ों को स्वस्थ रखने वाले विटामिन से भरपूर।' },
  { id: 'cola', nameEn: 'Fizzy Soda', nameHi: 'कोल्ड ड्रिंक', emoji: '🥤', type: 'junk', reasonEn: 'High sugar and acid wear down protective enamel.', reasonHi: 'ज्यादा चीनी और एसिड दाँतों की परत को नुकसान पहुंचाते हैं।' },
  { id: 'candy', nameEn: 'Sticky Candies', nameHi: 'मीठी टॉफी', emoji: '🍬', type: 'junk', reasonEn: 'Sticks between teeth and invites cavity germs.', reasonHi: 'दाँतों के बीच चिपकती है जिससे कीड़े (कैविटी) बनते हैं।' },
  { id: 'donut', nameEn: 'Glazed Donut', nameHi: 'डोनट', emoji: '🍩', type: 'junk', reasonEn: 'Sticky refined sugars feed bacteria.', reasonHi: 'मीठा दाँतों पर चिपककर बैक्टीरिया को बढ़ावा देता है।' },
  { id: 'chocolate', nameEn: 'Chocolate Bar', nameHi: 'चॉकलेट', emoji: '🍫', type: 'junk', reasonEn: 'Sweet residue stays on teeth if not rinsed.', reasonHi: 'बिना कुल्ला किए दाँतों में फंसा रहकर सड़न पैदा करता है।' }
];

export function HindiAnatomyStudio() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [subModule, setSubModule] = useState<SubModule>('body');

  // Audio utility
  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakText = (text: string) => {
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

  // GAME 1: BODY PARTS STATE
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>(BODY_PARTS[1]); // Default: Eyes
  const [quizTarget, setQuizTarget] = useState<BodyPart | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const startBodyQuiz = () => {
    const randomPart = BODY_PARTS[Math.floor(Math.random() * BODY_PARTS.length)];
    setQuizTarget(randomPart);
    setQuizFeedback(null);
    speakText(lang === 'hi' ? `ढूंढो: ${randomPart.nameHi} कहाँ है?` : `Find: Where is the ${randomPart.nameEn}?`);
  };

  const handleBodyPartClick = (part: BodyPart) => {
    setSelectedBodyPart(part);
    if (quizTarget) {
      if (part.id === quizTarget.id) {
        setQuizScore(prev => prev + 1);
        setQuizFeedback(lang === 'hi' ? 'शाबाश! सही पहचाना! 🎉' : 'Awesome! Correct! 🎉');
        speakText(lang === 'hi' ? `शाबाश! यह ${part.nameHi} है।` : `Great! That is ${part.nameEn}!`);
        setTimeout(() => startBodyQuiz(), 1600);
      } else {
        setQuizFeedback(lang === 'hi' ? `यह ${part.nameHi} है। दोबारा प्रयास करें!` : `That is ${part.nameEn}. Try again!`);
        speakText(lang === 'hi' ? `यह ${part.nameHi} है।` : `That is ${part.nameEn}.`);
      }
    } else {
      speakText(lang === 'hi' ? `${part.nameHi}। ${part.descHi}` : `${part.nameEn}. ${part.descEn}`);
    }
  };

  // GAME 2: TOOTH DEFENDER STATE
  const [foodPool, setFoodPool] = useState<FoodItem[]>(FOOD_ITEMS);
  const [currentFoodIdx, setCurrentFoodIdx] = useState(0);
  const [toothScore, setToothScore] = useState(0);
  const [toothFeedback, setToothFeedback] = useState<string | null>(null);
  const [brushingStep, setBrushingStep] = useState(0);

  const currentFood = foodPool[currentFoodIdx];

  const handleSortFood = (destination: 'healthy' | 'junk') => {
    if (!currentFood) return;
    const isCorrect = (destination === 'healthy' && currentFood.type === 'healthy') ||
                      (destination === 'junk' && currentFood.type === 'junk');

    if (isCorrect) {
      setToothScore(prev => prev + 1);
      const msg = destination === 'healthy'
        ? (lang === 'hi' ? `बिल्कुल सही! ${currentFood.nameHi} दाँतों को मजबूत बनाता है! 🦷✨` : `Spot on! ${currentFood.nameEn} protects enamel! 🦷✨`)
        : (lang === 'hi' ? `शाबाश! ${currentFood.nameHi} से दाँतों में कीड़ा लग सकता है! 🚫👾` : `Good job! ${currentFood.nameEn} can cause cavities! 🚫👾`);
      setToothFeedback(msg);
      speakText(msg);
    } else {
      const msg = lang === 'hi' ? 'ओह! दोबारा सोचें कि यह दाँतों के लिए अच्छा है या बुरा।' : 'Oops! Think again whether this is tooth-friendly.';
      setToothFeedback(msg);
      speakText(msg);
    }

    setTimeout(() => {
      setToothFeedback(null);
      if (currentFoodIdx + 1 < foodPool.length) {
        setCurrentFoodIdx(prev => prev + 1);
      } else {
        setCurrentFoodIdx(0); // Loop or finish
      }
    }, 1800);
  };

  const brushingSteps = [
    { titleEn: '1. Toothpaste', titleHi: '१. टूथपेस्ट', textEn: 'Apply pea-sized toothpaste on soft brush.', textHi: 'ब्रश पर मटर के दाने जितना टूथपेस्ट लगाएं।', icon: '🪥' },
    { titleEn: '2. Circles', titleHi: '२. गोलाकार गति', textEn: 'Brush gently in circular motions for 2 minutes.', textHi: 'हल्के हाथों से २ मिनट तक गोल-गोल ब्रश करें।', icon: '🔄' },
    { titleEn: '3. Rinse', titleHi: '३. कुल्ला करें', textEn: 'Rinse mouth thoroughly with clean water.', textHi: 'साफ पानी से अच्छी तरह कुल्ला करें।', icon: '💧' },
    { titleEn: '4. Twice a Day', titleHi: '४. दिन में दो बार', textEn: 'Morning and before bed for a sparkling smile!', textHi: 'सुबह और रात सोने से पहले—चमकती मुस्कान के लिए!', icon: '✨' }
  ];

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-emerald-200 shadow-sm p-4 md:p-7 select-none">
      
      {/* Top Banner with Module Switcher & Bilingual Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
            👦
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-emerald-950 leading-tight">
              {lang === 'hi' ? 'हमारा शरीर व स्वास्थ्य (Human Anatomy & Health)' : 'Human Anatomy & Dental Health Lab'}
            </h2>
            <p className="text-xs text-emerald-800/80 font-bold">
              {lang === 'hi' ? 'शरीर के मुख्य अंग, ज्ञानेंद्रियाँ और दाँतों की सुरक्षा' : 'Body Parts, Senses & Healthy Teeth Sorting Game'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Sub-game toggles */}
          <div className="flex bg-emerald-50 p-1 rounded-xl border border-emerald-200 gap-1 text-xs font-bold">
            <button
              onClick={() => { stopAudio(); setSubModule('body'); }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                subModule === 'body' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              👦 {lang === 'hi' ? 'शरीर के अंग' : 'My Body'}
            </button>
            <button
              onClick={() => { stopAudio(); setSubModule('teeth'); }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                subModule === 'teeth' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              🦷 {lang === 'hi' ? 'दाँतों की रक्षा' : 'Tooth Defender'}
            </button>
          </div>

          {/* Bilingual Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 text-xs font-black">
            <button
              onClick={() => { stopAudio(); setLang('hi'); }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                lang === 'hi' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => { stopAudio(); setLang('en'); }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                lang === 'en' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODULE 1: MY BODY & SENSES                              */}
      {/* ======================================================== */}
      {subModule === 'body' && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Body Parts Selection Tray */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                {lang === 'hi' ? 'अंग चुनें या पहचानें:' : 'Select Body Part:'}
              </span>
              
              {quizTarget ? (
                <span className="text-xs font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full animate-pulse">
                  🎯 {lang === 'hi' ? `ढूंढो: ${quizTarget.nameHi}` : `Find: ${quizTarget.nameEn}`}
                </span>
              ) : (
                <button
                  onClick={startBodyQuiz}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === 'hi' ? 'पहचान क्विज़ खेलें' : 'Play Quiz'}
                </button>
              )}
            </div>

            {quizFeedback && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-black text-emerald-900 text-center animate-in fade-in">
                {quizFeedback}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {BODY_PARTS.map((part) => {
                const isSelected = selectedBodyPart.id === part.id;
                return (
                  <button
                    key={part.id}
                    onClick={() => handleBodyPartClick(part)}
                    className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center transition cursor-pointer text-center ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 shadow-sm scale-102 font-black'
                        : 'bg-slate-50 border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{part.icon}</span>
                    <span className="text-[11px] font-bold text-slate-900 leading-tight">
                      {lang === 'hi' ? part.nameHi : part.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {quizTarget && (
              <div className="mt-2 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-600">
                  {lang === 'hi' ? 'स्कोर:' : 'Score:'} <strong>{quizScore}</strong>
                </span>
                <button
                  onClick={() => { setQuizTarget(null); setQuizFeedback(null); }}
                  className="text-rose-600 font-bold hover:underline"
                >
                  {lang === 'hi' ? 'क्विज़ समाप्त करें' : 'Exit Quiz'}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Detail Card */}
          <div className="lg:col-span-7 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white rounded-3xl border-2 border-emerald-200 p-6 flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {lang === 'hi' ? 'अंग जानकारी' : 'Organ Detail'}
                </span>
                <button
                  onClick={() => speakText(lang === 'hi' ? `${selectedBodyPart.nameHi}। ${selectedBodyPart.descHi} ${selectedBodyPart.factHi}` : `${selectedBodyPart.nameEn}. ${selectedBodyPart.descEn} ${selectedBodyPart.factEn}`)}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-black shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  {lang === 'hi' ? 'सुनें' : 'Listen'}
                </button>
              </div>

              <div className="flex flex-col items-center text-center my-4">
                <div className="w-24 h-24 rounded-3xl bg-white border-2 border-emerald-200 shadow-md flex items-center justify-center text-5xl mb-3">
                  {selectedBodyPart.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  {lang === 'hi' ? selectedBodyPart.nameHi : selectedBodyPart.nameEn}
                </h3>
                <p className="text-sm font-bold text-emerald-900 mt-1 max-w-md">
                  {lang === 'hi' ? selectedBodyPart.descHi : selectedBodyPart.descEn}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-amber-700 block mb-1">
                💡 {lang === 'hi' ? 'रोचक तथ्य (Fun Fact):' : 'Did You Know?'}
              </span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                {lang === 'hi' ? selectedBodyPart.factHi : selectedBodyPart.factEn}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 2: TOOTH DEFENDER & FOOD SORTING                 */}
      {/* ======================================================== */}
      {subModule === 'teeth' && (
        <div className="mt-5 flex flex-col gap-6">
          
          {/* Top Instruction & Audio Tip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200">
            <div>
              <h3 className="text-sm font-black text-amber-950">
                {lang === 'hi' ? 'दाँतों की सुरक्षा: अच्छा खाना बनाम नुकसानदेह खाना' : 'Tooth Defender: Cavity Fighter Sorting Challenge'}
              </h3>
              <p className="text-xs text-amber-800 font-semibold">
                {lang === 'hi' ? 'नीचे दिए गए भोजन को छांटें—स्वस्थ दाँत को खिलाएं या कचरा टोकरी में डालें!' : 'Sort each food: Feed the Sparkling Tooth or trash the sticky junk food!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-white px-3 py-1 rounded-xl border border-amber-200 text-amber-900">
                ⭐ {lang === 'hi' ? 'स्कोर:' : 'Score:'} {toothScore}
              </span>
              <button
                onClick={() => speakText(lang === 'hi' ? 'स्वस्थ दाँतों के लिए फल, सब्जियाँ और दूध खाएं। अधिक मीठा और सोडा दाँतों में कीड़ा लगाते हैं।' : 'Eat milk, fruit, and crunchy vegetables for strong teeth. Avoid sticky candy and sugary sodas.')}
                className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'दाँतों का नियम' : 'Tooth Rule'}
              </button>
            </div>
          </div>

          {/* Feedback Toast */}
          {toothFeedback && (
            <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-xs font-black text-emerald-950 text-center animate-in zoom-in-95">
              {toothFeedback}
            </div>
          )}

          {/* Central Arena: 2 Teeth & Middle Conveyor */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Left: Happy Sparkling Tooth */}
            <div className="md:col-span-4 bg-gradient-to-b from-sky-50 to-blue-50 border-2 border-blue-200 rounded-3xl p-5 flex flex-col items-center text-center shadow-xs">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-md border border-blue-100 mb-2">
                🦷✨
              </div>
              <h4 className="text-base font-black text-blue-950">
                {lang === 'hi' ? 'स्वस्थ चमकता दाँत' : 'Happy Healthy Tooth'}
              </h4>
              <p className="text-[11px] text-blue-800 font-bold mb-3">
                {lang === 'hi' ? 'कैल्शियम, फल व हरी सब्जियाँ पसंद हैं!' : 'Loves milk, apples & calcium!'}
              </p>
              <button
                onClick={() => handleSortFood('healthy')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Smile className="w-4 h-4" />
                {lang === 'hi' ? 'दाँत को खिलाएं (स्वस्थ)' : 'Feed Tooth (Healthy)'}
              </button>
            </div>

            {/* Center: Current Inspected Food Item */}
            <div className="md:col-span-4 bg-white border-2 border-dashed border-slate-300 rounded-3xl p-5 flex flex-col items-center text-center shadow-md">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
                {lang === 'hi' ? 'यह भोजन चुनें:' : 'Inspect This Food:'}
              </span>
              <div className="w-24 h-24 bg-amber-50 rounded-3xl border border-amber-200 flex items-center justify-center text-6xl shadow-inner mb-2 animate-bounce">
                {currentFood.emoji}
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                {lang === 'hi' ? currentFood.nameHi : currentFood.nameEn}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                {lang === 'hi' ? currentFood.reasonHi : currentFood.reasonEn}
              </p>
            </div>

            {/* Right: Sad Cavity Tooth / Trash */}
            <div className="md:col-span-4 bg-gradient-to-b from-rose-50 to-amber-50 border-2 border-rose-200 rounded-3xl p-5 flex flex-col items-center text-center shadow-xs">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-md border border-rose-100 mb-2">
                🦷👾
              </div>
              <h4 className="text-base font-black text-rose-950">
                {lang === 'hi' ? 'कैविटी / कीड़े का खतरा' : 'Cavity & Decay Risk'}
              </h4>
              <p className="text-[11px] text-rose-800 font-bold mb-3">
                {lang === 'hi' ? 'चिपचिपा मीठा व सोडा नुकसान पहुंचाते हैं!' : 'Sugary, sticky foods create decay!'}
              </p>
              <button
                onClick={() => handleSortFood('junk')}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Frown className="w-4 h-4" />
                {lang === 'hi' ? 'कूड़े में डालें (हानिकारक)' : 'Avoid / Discard (Junk)'}
              </button>
            </div>

          </div>

          {/* Bottom Guide: 4-Step Proper Brushing Guide (from Book) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider block mb-2">
              🪥 {lang === 'hi' ? 'सही तरीके से ब्रश करने के ४ कदम (Dental Care):' : '4 Easy Steps to Proper Brushing:'}
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {brushingSteps.map((step, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{step.icon}</span>
                    <span className="text-xs font-black text-slate-900 leading-tight">
                      {lang === 'hi' ? step.titleHi : step.titleEn}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    {lang === 'hi' ? step.textHi : step.textEn}
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