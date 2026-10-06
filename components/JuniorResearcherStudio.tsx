'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Volume2, Globe2, Flame, Sprout, Compass } from 'lucide-react';

type ScienceTab = 'matter' | 'gravity' | 'density' | 'plants';

const LAB_STRINGS = {
  hi: {
    bannerTitle: "Think Like a Researcher (नन्हे वैज्ञानिक)",
    bannerSub: "प्रत्यक्ष वैज्ञानिक प्रयोग, गुरुत्वाकर्षण, पदार्थ की अवस्थाएँ एवं प्रकृति अनुसंधान",
    tabMatter: "पदार्थ व तापमान (States of Matter)",
    tabGravity: "सौरमंडल गुरुत्व (Gravity)",
    tabDensity: "घनत्व (Density / Sink-Float)",
    tabPlants: "प्रकाश संश्लेषण (Photosynthesis)",
    listenFact: "वैज्ञानिक तथ्य सुनें",
    listenGravity: "गुरुत्वाकर्षण नियम सुनें",
    tempSliderLabel: "तापमान नियंत्रक (Temperature Slider):",
    gravityCalcPrefix: "यदि पृथ्वी पर आपका भार",
    gravityCalcSuffix: "है:",
    gravityJump: "आपकी छलांग क्षमता:",
    densityPrompt: "वस्तु चुनें और पानी के बीकर में डालकर घनत्व जांचें (Test Buoyancy):",
    waterDensity: "जल घनत्व = 1.0 g/cm³",
    dropPrompt: "ऊपर से कोई वस्तु चुनकर पानी में डालें 🧪",
    densityFloats: "🟢 पानी पर तैर रही है (Floats)",
    densitySinks: "🔴 तली में डूब गई (Sinks)",
    plantPrompt: "सूर्य का प्रकाश और जल देकर नन्हे पौधे को बड़ा करें (Plant Growth Lab):",
    sunlightBtn: "☀️ सूर्य का प्रकाश (Sunlight)",
    waterBtn: "💧 जल (Water)",
    onLabel: "चालू",
    offLabel: "बंद"
  },
  en: {
    bannerTitle: "Junior Science Lab & Simulator",
    bannerSub: "Interactive Physics, Planetary Gravity, States of Matter & Nature Lab (NEP 2020)",
    tabMatter: "States of Matter",
    tabGravity: "Planetary Gravity",
    tabDensity: "Density & Buoyancy",
    tabPlants: "Photosynthesis Lab",
    listenFact: "Listen to Scientific Fact",
    listenGravity: "Listen to Gravity Rule",
    tempSliderLabel: "Temperature Controller (Slider):",
    gravityCalcPrefix: "If your weight on Earth is",
    gravityCalcSuffix: ":",
    gravityJump: "Your jumping ability:",
    densityPrompt: "Select an object and drop it into the water beaker to test buoyancy:",
    waterDensity: "Water Density = 1.0 g/cm³",
    dropPrompt: "Select an item above to test in water 🧪",
    densityFloats: "🟢 Floats on water surface",
    densitySinks: "🔴 Sinks to the bottom",
    plantPrompt: "Provide sunlight and water to grow the seedling (Plant Growth Lab):",
    sunlightBtn: "☀️ Sunlight",
    waterBtn: "💧 Water",
    onLabel: "ON",
    offLabel: "OFF"
  }
};

export function JuniorResearcherStudio() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
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

  const t = LAB_STRINGS[lang];

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

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

  const getMatterState = (temp: number) => {
    if (temp <= 0) {
      return {
        state: lang === 'hi' ? 'Solid (ठोस)' : 'Solid State',
        name: lang === 'hi' ? 'बर्फ़ (Ice)' : 'Ice',
        emoji: '🧊',
        desc: lang === 'hi'
          ? 'अणु एक-दूसरे से कसकर जुड़े हुए हैं और कंपन करते हैं।'
          : 'Molecules are tightly packed in a rigid fixed lattice.'
      };
    }
    if (temp < 100) {
      return {
        state: lang === 'hi' ? 'Liquid (द्रव)' : 'Liquid State',
        name: lang === 'hi' ? 'जल (Water)' : 'Water',
        emoji: '💧',
        desc: lang === 'hi'
          ? 'अणु स्वतंत्र रूप से बह सकते हैं और पात्र का आकार ले लेते हैं।'
          : 'Molecules flow past one another freely taking the container shape.'
      };
    }
    return {
      state: lang === 'hi' ? 'Gas (गैस)' : 'Gas State',
      name: lang === 'hi' ? 'भाप (Steam)' : 'Steam / Vapor',
      emoji: '♨️',
      desc: lang === 'hi'
        ? 'अणु अत्यधिक ऊर्जा के साथ दूर-दूर तीव्र गति करते हैं।'
        : 'Molecules move rapidly with high energy filling the whole volume.'
    };
  };

  const PLANETS = [
    {
      id: 'moon',
      nameHi: 'चन्द्रमा (Moon)',
      nameEn: 'Moon',
      emoji: '🌕',
      factor: 0.166,
      jumpHi: '६ गुना ऊँची छलांग',
      jumpEn: '6x higher jumps'
    },
    {
      id: 'earth',
      nameHi: 'पृथ्वी (Earth)',
      nameEn: 'Earth',
      emoji: '🌍',
      factor: 1.0,
      jumpHi: 'सामान्य छलांग (1x)',
      jumpEn: 'Standard baseline jump (1x)'
    },
    {
      id: 'mars',
      nameHi: 'मंगल (Mars)',
      nameEn: 'Mars',
      emoji: '🔴',
      factor: 0.38,
      jumpHi: '२.५ गुना ऊँची छलांग',
      jumpEn: '2.5x higher jumps'
    },
    {
      id: 'jupiter',
      nameHi: 'बृहस्पति (Jupiter)',
      nameEn: 'Jupiter',
      emoji: '🪐',
      factor: 2.53,
      jumpHi: 'अत्यधिक भारी / न्यूनतम छलांग',
      jumpEn: 'Heavy gravity / minimal jump'
    }
  ];

  const DENSITY_ITEMS = [
    {
      id: 'wood',
      nameHi: 'लकड़ी (Wood Block)',
      nameEn: 'Wood Block',
      emoji: '🪵',
      density: 0.6,
      floats: true,
      reasonHi: 'पानी से कम घनत्व (0.6 g/cm³) होने के कारण तैरती है।',
      reasonEn: 'Density (0.6 g/cm³) is lower than water (1.0 g/cm³), so it floats.'
    },
    {
      id: 'iron',
      nameHi: 'लोहे की कील (Iron Nail)',
      nameEn: 'Iron Nail',
      emoji: '🔩',
      density: 7.8,
      floats: false,
      reasonHi: 'पानी से अधिक भारी घनत्व (7.8 g/cm³) के कारण डूब जाती है।',
      reasonEn: 'Density (7.8 g/cm³) is much higher than water, so it sinks.'
    },
    {
      id: 'apple',
      nameHi: 'सेब (Apple)',
      nameEn: 'Apple',
      emoji: '🍎',
      density: 0.85,
      floats: true,
      reasonHi: '२५% हवा की मौजूदगी के कारण पानी पर तैरता है।',
      reasonEn: 'Contains trapped air pockets (density 0.85 g/cm³), so it floats.'
    },
    {
      id: 'coin',
      nameHi: 'सिक्का (Coin)',
      nameEn: 'Metal Coin',
      emoji: '🪙',
      density: 8.9,
      floats: false,
      reasonHi: 'ठोस धातु का घनत्व जल से बहुत अधिक है, इसलिए डूब जाता है।',
      reasonEn: 'Dense metal composition causes it to sink directly to the bottom.'
    }
  ];

  const currentPlanetObj = PLANETS.find((p) => p.id === selectedPlanet) || PLANETS[1];
  const matterInfo = getMatterState(temperature);

  return (
    <div className="max-w-5xl mx-auto p-3 md:p-6 font-sans select-none">
      
      {/* Header Banner with Bilingual Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-purple-50/80 p-4 rounded-2xl border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center text-xl shadow-md">
            🔬
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-purple-950">{t.bannerTitle}</h1>
            <p className="text-xs md:text-sm font-semibold text-purple-800">
              {t.bannerSub}
            </p>
          </div>
        </div>

        {/* Controls: Language Switcher & Experiment Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* BILINGUAL LANGUAGE SWITCHER */}
          <div className="flex bg-white p-1 rounded-xl border border-purple-300 shadow-sm gap-1">
            <button
              onClick={() => {
                stopAudio();
                setLang('hi');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'hi' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-950 hover:bg-purple-100'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => {
                stopAudio();
                setLang('en');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'en' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-950 hover:bg-purple-100'
              }`}
            >
              English
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-purple-300 shadow-sm overflow-x-auto">
            <button
              onClick={() => { stopAudio(); setActiveTab('matter'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'matter' ? 'bg-purple-600 text-white shadow' : 'text-purple-900 hover:bg-purple-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> {t.tabMatter}
            </button>
            <button
              onClick={() => { stopAudio(); setActiveTab('gravity'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'gravity' ? 'bg-purple-600 text-white shadow' : 'text-purple-900 hover:bg-purple-50'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" /> {t.tabGravity}
            </button>
            <button
              onClick={() => { stopAudio(); setActiveTab('density'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'density' ? 'bg-purple-600 text-white shadow' : 'text-purple-900 hover:bg-purple-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> {t.tabDensity}
            </button>
            <button
              onClick={() => { stopAudio(); setActiveTab('plants'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'plants' ? 'bg-purple-600 text-white shadow' : 'text-purple-900 hover:bg-purple-50'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" /> {t.tabPlants}
            </button>
          </div>
        </div>
      </div>

      {/* Main Experiment Sandbox */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-purple-200 shadow-xl min-h-[460px] flex flex-col justify-center items-center">
        
        {/* MODULE 1: STATES OF MATTER */}
        {activeTab === 'matter' && (
          <div className="w-full max-w-xl flex flex-col items-center text-center">
            <button
              onClick={() => {
                if (lang === 'hi') {
                  playSpeech(`तापमान ${temperature} डिग्री सेल्सियस पर जल की अवस्था ${matterInfo.state} है।`);
                } else {
                  playSpeech(`At ${temperature} degrees Celsius, water is in the ${matterInfo.state}.`);
                }
              }}
              className="flex items-center gap-2 bg-purple-100 text-purple-900 font-bold px-4 py-1.5 rounded-full text-xs mb-6 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-purple-700" /> {t.listenFact}
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
                <span className="text-xs font-black text-purple-950">{t.tempSliderLabel}</span>
                <span className="text-lg font-black text-purple-900">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="-20"
                max="120"
                value={temperature}
                onChange={(e) => {
                  stopAudio();
                  setTemperature(Number(e.target.value));
                }}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-2">
                <span>-20°C ({lang === 'hi' ? 'ठंडा/बर्फ' : 'Freeze'})</span>
                <span>0°C ({lang === 'hi' ? 'गलनांक' : 'Melting'})</span>
                <span>100°C ({lang === 'hi' ? 'क्वथनांक/भाप' : 'Boiling'})</span>
                <span>120°C</span>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: PLANETARY GRAVITY */}
        {activeTab === 'gravity' && (
          <div className="w-full max-w-xl flex flex-col items-center text-center">
            <button
              onClick={() => {
                const targetName = lang === 'hi' ? currentPlanetObj.nameHi : currentPlanetObj.nameEn;
                const calcWeight = Math.round(earthWeight * currentPlanetObj.factor * 10) / 10;
                if (lang === 'hi') {
                  playSpeech(`पृथ्वी पर ३० किलो का भार ${targetName} पर लगभग ${calcWeight} किलोग्राम होगा!`);
                } else {
                  playSpeech(`A 30 kilogram weight on Earth would weigh approximately ${calcWeight} kilograms on ${targetName}!`);
                }
              }}
              className="flex items-center gap-2 bg-purple-100 text-purple-900 font-bold px-4 py-1.5 rounded-full text-xs mb-6 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-purple-700" /> {t.listenGravity}
            </button>

            {/* Planet Selector Grid */}
            <div className="grid grid-cols-4 gap-2 md:gap-3 w-full mb-6">
              {PLANETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    stopAudio();
                    setSelectedPlanet(p.id);
                  }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition cursor-pointer ${
                    selectedPlanet === p.id
                      ? 'bg-purple-600 border-purple-700 text-white shadow-md scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-3xl mb-1">{p.emoji}</span>
                  <span className="text-[11px] font-black">
                    {lang === 'hi' ? p.nameHi.split(' ')[0] : p.nameEn}
                  </span>
                </button>
              ))}
            </div>

            {/* Gravity Calculator Display */}
            <div className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-3xl p-6 shadow-sm flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-1">
                {t.gravityCalcPrefix} {earthWeight} kg{t.gravityCalcSuffix}
              </span>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-4xl md:text-5xl font-black text-purple-950">
                  {Math.round(earthWeight * currentPlanetObj.factor * 10) / 10}
                </span>
                <span className="text-lg font-bold text-purple-800">
                  kg ({lang === 'hi' ? 'किलोग्राम' : 'Kilograms'})
                </span>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border border-purple-200 text-xs font-bold text-purple-900 mt-2">
                🚀 {t.gravityJump} {lang === 'hi' ? currentPlanetObj.jumpHi : currentPlanetObj.jumpEn}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 3: DENSITY & BUOYANCY */}
        {activeTab === 'density' && (
          <div className="w-full max-w-xl flex flex-col items-center text-center">
            <span className="text-xs font-black text-purple-900 mb-4">
              {t.densityPrompt}
            </span>

            {/* Item Chooser */}
            <div className="grid grid-cols-4 gap-2 md:gap-3 w-full mb-6">
              {DENSITY_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    stopAudio();
                    setDroppedItem(item.id);
                  }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center transition cursor-pointer ${
                    droppedItem === item.id
                      ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-3xl mb-1">{item.emoji}</span>
                  <span className="text-[10px] font-black">
                    {lang === 'hi' ? item.nameHi.split(' ')[0] : item.nameEn}
                  </span>
                </button>
              ))}
            </div>

            {/* Virtual Water Beaker */}
            <div className="relative w-full h-56 bg-gradient-to-b from-sky-100 to-blue-200 rounded-3xl border-4 border-blue-400 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
              <span className="text-[10px] font-extrabold text-blue-900 self-end bg-white/70 px-2 py-0.5 rounded">
                {t.waterDensity}
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
                        {it.floats ? t.densityFloats : t.densitySinks}
                      </span>
                      <p className="text-[11px] font-bold text-blue-950 mt-1 bg-white/60 px-2 py-0.5 rounded">
                        {lang === 'hi' ? it.reasonHi : it.reasonEn}
                      </p>
                    </div>
                  );
                })()
              ) : (
                <div className="h-full flex items-center justify-center text-xs font-bold text-blue-800/70">
                  {t.dropPrompt}
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
              {t.plantPrompt}
            </span>

            {/* Toggle Controls */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => {
                  stopAudio();
                  setSunlight(!sunlight);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border-2 transition cursor-pointer ${
                  sunlight ? 'bg-amber-400 border-amber-500 text-amber-950 shadow' : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}
              >
                {t.sunlightBtn} {sunlight ? t.onLabel : t.offLabel}
              </button>
              <button
                onClick={() => {
                  stopAudio();
                  setWatered(!watered);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border-2 transition cursor-pointer ${
                  watered ? 'bg-blue-500 border-blue-600 text-white shadow' : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}
              >
                {t.waterBtn} {watered ? t.onLabel : t.offLabel}
              </button>
            </div>

            {/* Plant Stage Visualization */}
            <div className="w-full h-52 bg-gradient-to-b from-sky-50 to-emerald-100 rounded-3xl border-2 border-emerald-300 p-6 flex flex-col items-center justify-center shadow-inner">
              {sunlight && watered ? (
                <div className="flex flex-col items-center animate-in zoom-in duration-300">
                  <span className="text-6xl mb-2">🌸</span>
                  <span className="text-base font-black text-emerald-950">
                    {lang === 'hi' ? 'पूर्ण विकसित पुष्पित पौधा!' : 'Healthy Flowering Plant!'}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 mt-1">
                    {lang === 'hi' ? 'प्रकाश संश्लेषण पूर्ण हुआ!' : 'Photosynthesis Successful!'}
                  </span>
                </div>
              ) : sunlight && !watered ? (
                <div className="flex flex-col items-center">
                  <span className="text-5xl mb-2">🥀</span>
                  <span className="text-sm font-black text-amber-950">
                    {lang === 'hi' ? 'पौधा मुरझा रहा है' : 'Wilting Seedling (Needs Water)'}
                  </span>
                  <span className="text-xs text-amber-800">
                    {lang === 'hi' ? 'विकास के लिए पानी अनिवार्य है।' : 'Water is vital for cell hydration.'}
                  </span>
                </div>
              ) : !sunlight && watered ? (
                <div className="flex flex-col items-center">
                  <span className="text-5xl mb-2">🌱</span>
                  <span className="text-sm font-black text-slate-800">
                    {lang === 'hi' ? 'धीमी वृद्धि' : 'Slow Growth (Needs Sunlight)'}
                  </span>
                  <span className="text-xs text-slate-600">
                    {lang === 'hi' ? 'भोजन बनाने के लिए धूप की आवश्यकता है।' : 'Chlorophyll requires sunlight to make food.'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-2">🌰</span>
                  <span className="text-sm font-black text-stone-700">
                    {lang === 'hi' ? 'सुप्त बीज' : 'Dormant Seed'}
                  </span>
                  <span className="text-xs text-stone-500">
                    {lang === 'hi' ? 'धूप और पानी दोनों चालू करें।' : 'Enable both sunlight and water to sprout.'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}