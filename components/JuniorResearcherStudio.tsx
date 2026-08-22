'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Volume2, Globe2, Flame, Sprout, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

type ScienceTab = 'matter' | 'gravity' | 'density' | 'plants';

export function JuniorResearcherStudio() {
  const [activeTab, setActiveTab] = useState<ScienceTab>('matter');

  // Module 1: States of Matter state
  const [temperature, setTemperature] = useState<number>(25);

  // Module 2: Gravity & Planets state
  const [selectedPlanet, setSelectedPlanet] = useState<string>('earth');
  const [earthWeight, setEarthWeight] = useState<number>(30); // kg

  // Module 3: Density Sink/Float state
  const [droppedItem, setDroppedItem] = useState<string | null>(null);

  // Module 4: Plant Lifecycle state
  const [sunlight, setSunlight] = useState<boolean>(true);
  const [watered, setWatered] = useState<boolean>(true);

  const playSpeech = (text: string, lang: 'hi-IN' | 'en-IN' = 'hi-IN') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.88;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  const getMatterState = (temp: number) => {
    if (temp <= 0) return { state: 'Solid (ठोस)', name: 'बर्फ़ (Ice)', emoji: '🧊', desc: 'अणु एक-दूसरे से कसकर जुड़े हुए हैं।' };
    if (temp < 100) return { state: 'Liquid (द्रव)', name: 'जल (Water)', emoji: '💧', desc: 'अणु स्वतंत्र रूप से बह सकते हैं।' };
    return { state: 'Gas (गैस)', name: 'भाप (Steam)', emoji: '♨️', desc: 'अणु अत्यधिक ऊर्जा के साथ दूर-दूर गति करते हैं।' };
  };

  const PLANETS = [
    { id: 'moon', name: 'Moon (चन्द्रमा)', emoji: '🌕', factor: 0.166, jump: '६ गुना ऊँची छलांग' },
    { id: 'earth', name: 'Earth (पृथ्वी)', emoji: '🌍', factor: 1.0, jump: 'सामान्य छलांग' },
    { id: 'mars', name: 'Mars (मंगल)', emoji: '🔴', factor: 0.38, jump: '२.५ गुना ऊँची छलांग' },
    { id: 'jupiter', name: 'Jupiter (बृहस्पति)', emoji: '🪐', factor: 2.53, jump: 'बहुत भारी / न्यूनतम छलांग' }
  ];

  const DENSITY_ITEMS = [
    { id: 'wood', name: 'लकड़ी (Wood Block)', emoji: '🪵', density: 0.6, floats: true, reason: 'पानी से कम घनत्व के कारण तैरती है।' },
    { id: 'iron', name: 'लोहे की कील (Iron Nail)', emoji: '🔩', density: 7.8, floats: false, reason: 'पानी से अधिक भारी घनत्व के कारण डूब जाती है।' },
    { id: 'apple', name: 'सेब (Apple)', emoji: '🍎', density: 0.85, floats: true, reason: '२५% हवा की मौजूदगी के कारण पानी पर तैरता है।' },
    { id: 'coin', name: 'सिक्का (Coin)', emoji: '🪙', density: 8.9, floats: false, reason: 'ठोस धातु का घनत्व जल से बहुत अधिक है।' }
  ];

  const currentPlanetObj = PLANETS.find((p) => p.id === selectedPlanet) || PLANETS[1];
  const matterInfo = getMatterState(temperature);

  return (
    <div className="max-w-5xl mx-auto p-3 md:p-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-purple-50/80 p-4 rounded-2xl border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center text-xl shadow-md">
            🔬
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-purple-950">Think Like a Researcher (नन्हे वैज्ञानिक)</h1>
            <p className="text-xs md:text-sm font-semibold text-purple-800">
              प्रत्यक्ष वैज्ञानिक प्रयोग, गुरुत्वाकर्षण, पदार्थ की अवस्थाएँ एवं प्रकृति अनुसंधान
            </p>
          </div>
        </div>

        {/* Experiment Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-purple-300 shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('matter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              activeTab === 'matter' ? 'bg-purple-600 text-white shadow' : 'text-purple-900 hover:bg-purple-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> पदार्थ व तापमान (States of Matter)
          </button>
          <button
            onClick={() => setActiveTab('gravity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              activeTab === 'gravity' ? 'bg-purple-600 text-white shadow' : 'text-purple-900 hover:bg-purple-50'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" /> सौरमंडल गुरुत्व (Gravity)
          </button>
          <button
            onClick={() => setActiveTab('density')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              activeTab === 'density' ? 'bg-purple-600 text-white shadow' : 'text-purple-900 hover:bg-purple-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> घनत्व (Density / Sink-Float)
          </button>
          <button
            onClick={() => setActiveTab('plants')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              activeTab === 'plants' ? 'bg-purple-600 text-white shadow' : 'text-purple-900 hover:bg-purple-50'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" /> प्रकाश संश्लेषण (Photosynthesis)
          </button>
        </div>
      </div>

      {/* Main Experiment Sandbox */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-purple-200 shadow-xl min-h-[460px] flex flex-col justify-center items-center">
        
        {/* MODULE 1: STATES OF MATTER */}
        {activeTab === 'matter' && (
          <div className="w-full max-w-xl flex flex-col items-center text-center">
            <button
              onClick={() => playSpeech(`तापमान ${temperature} डिग्री सेल्सियस पर जल की अवस्था ${matterInfo.state} है।`)}
              className="flex items-center gap-2 bg-purple-100 text-purple-900 font-bold px-4 py-1.5 rounded-full text-xs mb-6 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-purple-700" /> वैज्ञानिक तथ्य सुनें
            </button>

            {/* Visual Particle / Thermal Chamber */}
            <div className={`w-full h-52 rounded-3xl border-2 flex flex-col items-center justify-center transition-all p-6 mb-6 shadow-inner ${
              temperature <= 0 ? 'bg-sky-50 border-sky-300' : temperature < 100 ? 'bg-blue-50 border-blue-300' : 'bg-orange-50 border-orange-300'
            }`}>
              <span className="text-6xl md:text-7xl filter drop-shadow-md mb-2 animate-bounce">
                {matterInfo.emoji}
              </span>
              <h3 className="text-2xl font-black text-slate-800">{matterInfo.name}</h3>
              <span className="text-sm font-bold text-purple-900 mt-1">{matterInfo.state}</span>
              <p className="text-xs text-slate-600 mt-2 max-w-sm">{matterInfo.desc}</p>
            </div>

            {/* Thermal Slider */}
            <div className="w-full bg-purple-50/60 p-5 rounded-2xl border border-purple-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-purple-950">तापमान नियंत्रक (Temperature Slider):</span>
                <span className="text-lg font-black text-purple-900">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="-20"
                max="120"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-2">
                <span>-20°C (ठंडा/बर्फ)</span>
                <span>0°C (गलनांक)</span>
                <span>100°C (क्वथनांक/भाप)</span>
                <span>120°C</span>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: PLANETARY GRAVITY */}
        {activeTab === 'gravity' && (
          <div className="w-full max-w-xl flex flex-col items-center text-center">
            <button
              onClick={() => playSpeech(`पृथ्वी पर ३० किलो का भार ${currentPlanetObj.name} पर लगभग ${Math.round(earthWeight * currentPlanetObj.factor)} किलोग्राम होगा!`)}
              className="flex items-center gap-2 bg-purple-100 text-purple-900 font-bold px-4 py-1.5 rounded-full text-xs mb-6 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-purple-700" /> गुरुत्वाकर्षण नियम सुनें
            </button>

            {/* Planet Selector Grid */}
            <div className="grid grid-cols-4 gap-2 md:gap-3 w-full mb-6">
              {PLANETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlanet(p.id)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition cursor-pointer ${
                    selectedPlanet === p.id
                      ? 'bg-purple-600 border-purple-700 text-white shadow-md scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-3xl mb-1">{p.emoji}</span>
                  <span className="text-[11px] font-black">{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Gravity Calculator Display */}
            <div className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-3xl p-6 shadow-sm flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-1">
                यदि पृथ्वी पर आपका भार {earthWeight} kg है:
              </span>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-4xl md:text-5xl font-black text-purple-950">
                  {Math.round(earthWeight * currentPlanetObj.factor * 10) / 10}
                </span>
                <span className="text-lg font-bold text-purple-800">kg (किलोग्राम)</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border border-purple-200 text-xs font-bold text-purple-900 mt-2">
                🚀 आपकी छलांग क्षमता: {currentPlanetObj.jump}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 3: DENSITY & BUOYANCY */}
        {activeTab === 'density' && (
          <div className="w-full max-w-xl flex flex-col items-center text-center">
            <span className="text-xs font-black text-purple-900 mb-4">
              वस्तु चुनें और पानी के बीकर में डालकर घनत्व जांचें (Test Buoyancy):
            </span>

            {/* Item Chooser */}
            <div className="grid grid-cols-4 gap-2 md:gap-3 w-full mb-6">
              {DENSITY_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDroppedItem(item.id)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center transition cursor-pointer ${
                    droppedItem === item.id
                      ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-3xl mb-1">{item.emoji}</span>
                  <span className="text-[10px] font-black">{item.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Virtual Water Beaker */}
            <div className="relative w-full h-56 bg-gradient-to-b from-sky-100 to-blue-200 rounded-3xl border-4 border-blue-400 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
              <span className="text-[10px] font-extrabold text-blue-900 self-end bg-white/70 px-2 py-0.5 rounded">
                जल घनत्व = 1.0 g/cm³
              </span>

              {droppedItem ? (
                (() => {
                  const it = DENSITY_ITEMS.find((d) => d.id === droppedItem)!;
                  return (
                    <div className={`w-full flex flex-col items-center transition-all duration-700 ${
                      it.floats ? 'justify-start mt-2' : 'justify-end mb-2'
                    }`}>
                      <span className="text-5xl animate-bounce">{it.emoji}</span>
                      <span className="bg-white/90 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full shadow mt-2">
                        {it.floats ? '🟢 पानी पर तैर रही है (Floats)' : '🔴 तली में डूब गई (Sinks)'}
                      </span>
                      <p className="text-[11px] font-bold text-blue-950 mt-1 bg-white/60 px-2 py-0.5 rounded">
                        {it.reason}
                      </p>
                    </div>
                  );
                })()
              ) : (
                <div className="h-full flex items-center justify-center text-xs font-bold text-blue-800/70">
                  ऊपर से कोई वस्तु चुनकर पानी में डालें 🧪
                </div>
              )}

              <div className="w-full h-3 bg-blue-300/40 rounded-full" />
            </div>
          </div>
        )}

        {/* MODULE 4: PLANT LIFECYCLE & PHOTOSYNTHESIS */}
        {activeTab === 'plants' && (
          <div className="w-full max-w-xl flex flex-col items-center text-center">
            <span className="text-xs font-black text-purple-900 mb-4">
              सूर्य का प्रकाश और जल देकर नन्हे पौधे को बड़ा करें (Plant Growth Lab):
            </span>

            {/* Toggle Controls */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSunlight(!sunlight)}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border-2 transition cursor-pointer ${
                  sunlight ? 'bg-amber-400 border-amber-500 text-amber-950 shadow' : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}
              >
                ☀️ सूर्य का प्रकाश (Sunlight) {sunlight ? 'चालू' : 'बंद'}
              </button>
              <button
                onClick={() => setWatered(!watered)}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border-2 transition cursor-pointer ${
                  watered ? 'bg-blue-500 border-blue-600 text-white shadow' : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}
              >
                💧 जल (Water) {watered ? 'चालू' : 'बंद'}
              </button>
            </div>

            {/* Plant Stage Visualization */}
            <div className="w-full h-52 bg-gradient-to-b from-sky-50 to-emerald-100 rounded-3xl border-2 border-emerald-300 p-6 flex flex-col items-center justify-center shadow-inner">
              {sunlight && watered ? (
                <div className="flex flex-col items-center animate-in zoom-in duration-300">
                  <span className="text-6xl mb-2">🌸</span>
                  <span className="text-base font-black text-emerald-950">पूर्ण विकसित पुष्पित पौधा! (Healthy Flowering Plant)</span>
                  <span className="text-xs font-bold text-emerald-700 mt-1">प्रकाश संश्लेषण (Photosynthesis) पूर्ण हुआ!</span>
                </div>
              ) : sunlight && !watered ? (
                <div className="flex flex-col items-center">
                  <span className="text-5xl mb-2">🥀</span>
                  <span className="text-sm font-black text-amber-950">पौधा मुरझा रहा है (Needs Water)</span>
                  <span className="text-xs text-amber-800">विकास के लिए पानी अनिवार्य है।</span>
                </div>
              ) : !sunlight && watered ? (
                <div className="flex flex-col items-center">
                  <span className="text-5xl mb-2">🌱</span>
                  <span className="text-sm font-black text-slate-800">धीमी वृद्धि (Needs Sunlight)</span>
                  <span className="text-xs text-slate-600">भोजन बनाने के लिए धूप की आवश्यकता है।</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-2">🌰</span>
                  <span className="text-sm font-black text-stone-700">सुप्त बीज (Dormant Seed)</span>
                  <span className="text-xs text-stone-500">धूप और पानी दोनों चालू करें।</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}