'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, RotateCcw, Volume2, Globe2, Flame, 
  FlaskConical, Compass, ArrowRight, Droplets, CheckCircle2 
} from 'lucide-react';

type ScienceTab = 'density' | 'matter' | 'phlab' | 'solarsystem';

// -------------------------------------------------------------
// DATA DEFINITIONS
// -------------------------------------------------------------

interface LiquidItem {
  id: string;
  nameEn: string;
  nameHi: string;
  emoji: string;
  density: number; // g/cm3
  color: string;
  textColor: string;
}

const LIQUIDS: LiquidItem[] = [
  { id: 'honey', nameEn: 'Honey', nameHi: 'शहद', emoji: '🍯', density: 1.42, color: '#b45309', textColor: '#ffffff' },
  { id: 'coke', nameEn: 'Fanta / Soda', nameHi: 'सोडा / फैंटा', emoji: '🥤', density: 1.04, color: '#ea580c', textColor: '#ffffff' },
  { id: 'water', nameEn: 'Colored Water', nameHi: 'रंगीन जल', emoji: '💧', density: 1.00, color: '#38bdf8', textColor: '#0f172a' },
  { id: 'oil', nameEn: 'Cooking Oil', nameHi: 'खाद्य तेल', emoji: '🌻', density: 0.92, color: '#facc15', textColor: '#854d0e' },
  { id: 'spirit', nameEn: 'Spirit / Alcohol', nameHi: 'स्पिरिट / अल्कोहल', emoji: '🧪', density: 0.79, color: '#a855f7', textColor: '#ffffff' }
];

interface TestObject {
  id: string;
  nameEn: string;
  nameHi: string;
  emoji: string;
  density: number;
}

const DENSITY_OBJECTS: TestObject[] = [
  { id: 'bolt', nameEn: 'Iron Bolt', nameHi: 'लोहे का नट', emoji: '🔩', density: 7.85 },
  { id: 'grape', nameEn: 'Grape', nameHi: 'अंगूर', emoji: '🍇', density: 1.08 },
  { id: 'plastic', nameEn: 'Plastic Cap', nameHi: 'प्लास्टिक ढक्कन', emoji: '🔘', density: 0.95 },
  { id: 'cork', nameEn: 'Wood Cork', nameHi: 'लकड़ी का कॉर्क', emoji: '🪵', density: 0.24 }
];

// Matter Substances
interface Substance {
  id: string;
  nameEn: string;
  nameHi: string;
  emoji: string;
  sublimates?: boolean;
  meltTemp: number;
  boilTemp: number;
  funFactEn: string;
  funFactHi: string;
}

const SUBSTANCES: Substance[] = [
  { 
    id: 'water', 
    nameEn: 'Water (H₂O)', 
    nameHi: 'जल (पानी)', 
    emoji: '💧',
    meltTemp: 0, 
    boilTemp: 100,
    funFactEn: 'Water expands when it freezes into ice, making ice float!',
    funFactHi: 'बर्फ बनने पर पानी का घनत्व कम हो जाता है, इसलिए बर्फ तैरती है!'
  },
  { 
    id: 'camphor', 
    nameEn: 'Camphor (कपूर)', 
    nameHi: 'कपूर (Camphor)', 
    emoji: '⚪',
    sublimates: true,
    meltTemp: 175, 
    boilTemp: 204, // Sublimates directly at room temp / mild heat
    funFactEn: 'Sublimation! Camphor transforms directly from solid to aromatic gas without melting into liquid!',
    funFactHi: 'ऊर्ध्वपातन (Sublimation)! कपूर बिना द्रव बने सीधे ठोस से सुगन्धित गैस में बदल जाता है!'
  },
  { 
    id: 'chocolate', 
    nameEn: 'Chocolate', 
    nameHi: 'चॉकलेट', 
    emoji: '🍫',
    meltTemp: 34, 
    boilTemp: 120,
    funFactEn: 'Chocolate melts at 34°C—right below human body temperature (37°C), so it melts in your mouth!',
    funFactHi: 'चॉकलेट 34°C पर पिघलती है, जो हमारे शरीर के तापमान से ठीक कम है, इसलिए मुँह में घुल जाती है!'
  },
  { 
    id: 'iron', 
    nameEn: 'Iron Metal', 
    nameHi: 'लोहा (धातु)', 
    emoji: '⚔️',
    meltTemp: 1538, 
    boilTemp: 2862,
    funFactEn: 'Iron needs immense blast-furnace heat (1538°C) to melt into liquid magma!',
    funFactHi: 'लोहे को पिघलाने के लिए भट्ठी में 1538°C के प्रचंड तापमान की आवश्यकता होती है!'
  }
];

// pH Lab Items
interface PHSample {
  id: string;
  nameEn: string;
  nameHi: string;
  emoji: string;
  ph: number;
  typeEn: 'Strong Acid' | 'Mild Acid' | 'Neutral' | 'Mild Base' | 'Strong Base';
  typeHi: 'प्रबल अम्ल' | 'दुर्बल अम्ल' | 'उदासीन (Neutral)' | 'दुर्बल क्षार' | 'प्रबल क्षार';
  color: string;
}

const PH_SAMPLES: PHSample[] = [
  { id: 'lemon', nameEn: 'Lemon Juice', nameHi: 'नींबू का रस', emoji: '🍋', ph: 2.2, typeEn: 'Strong Acid', typeHi: 'प्रबल अम्ल', color: '#ef4444' },
  { id: 'soda', nameEn: 'Cola / Fizzy Soda', nameHi: 'कोल्ड ड्रिंक / सोडा', emoji: '🥤', ph: 3.0, typeEn: 'Mild Acid', typeHi: 'दुर्बल अम्ल', color: '#f97316' },
  { id: 'water', nameEn: 'Pure Distilled Water', nameHi: 'शुद्ध जल (Water)', emoji: '💧', ph: 7.0, typeEn: 'Neutral', typeHi: 'उदासीन (Neutral)', color: '#22c55e' },
  { id: 'baking_soda', nameEn: 'Baking Soda Solution', nameHi: 'मीठा सोडा (Baking Soda)', emoji: '🧁', ph: 9.0, typeEn: 'Mild Base', typeHi: 'दुर्बल क्षार', color: '#06b6d4' },
  { id: 'soap', nameEn: 'Soap & Detergent', nameHi: 'साबुन का घोल (Soap)', emoji: '🧼', ph: 11.5, typeEn: 'Strong Base', typeHi: 'प्रबल क्षार', color: '#3b82f6' }
];

// Solar System Data
interface PlanetItem {
  id: string;
  nameEn: string;
  nameHi: string;
  emoji: string;
  distance: string;
  size: string;
  funFactEn: string;
  funFactHi: string;
  color: string;
}

const SOLAR_SYSTEM: PlanetItem[] = [
  { id: 'mercury', nameEn: 'Mercury', nameHi: 'बुध ग्रह', emoji: '⚪', distance: '58M km', size: 'Smallest', color: '#94a3b8', funFactEn: 'Mercury is the smallest planet and closest to the Sun. It has no atmosphere!', funFactHi: 'बुध सूर्य का सबसे नजदीकी और सौरमंडल का सबसे छोटा ग्रह है!' },
  { id: 'venus', nameEn: 'Venus', nameHi: 'शुक्र ग्रह', emoji: '🟡', distance: '108M km', size: 'Earth-sized', color: '#facc15', funFactEn: 'Venus is the hottest planet because of thick runaway greenhouse gases!', funFactHi: 'शुक्र हमारे सौरमंडल का सबसे गर्म ग्रह है क्योंकि यहाँ घने तेजाबी बादल हैं!' },
  { id: 'earth', nameEn: 'Earth', nameHi: 'पृथ्वी (हमारा घर)', emoji: '🌍', distance: '150M km', size: 'Life Haven', color: '#38bdf8', funFactEn: 'Earth is our home—the only known planet with liquid water, oxygen, and life!', funFactHi: 'पृथ्वी हमारा घर है—एकमात्र ऐसा ग्रह जहाँ जीवन, जल और ऑक्सीजन मौजूद है!' },
  { id: 'mars', nameEn: 'Mars', nameHi: 'मंगल ग्रह', emoji: '🔴', distance: '228M km', size: 'Red Planet', color: '#ef4444', funFactEn: 'Mars is red because of rusted iron soil. It has the tallest volcano: Olympus Mons!', funFactHi: 'मंगल ग्रह पर लोहे की जंग वाली लाल मिट्टी है और सौरमंडल का सबसे ऊँचा पर्वत भी!' },
  { id: 'jupiter', nameEn: 'Jupiter', nameHi: 'बृहस्पति ग्रह', emoji: '🪐', distance: '778M km', size: 'Giant Gas King', color: '#ea580c', funFactEn: 'Jupiter is the largest planet—so massive that over 1,300 Earths could fit inside!', funFactHi: 'बृहस्पति सबसे बड़ा ग्रह है—इसके अंदर 1300 पृथ्वी समा सकती हैं!' },
  { id: 'saturn', nameEn: 'Saturn', nameHi: 'शनि ग्रह', emoji: '🪐', distance: '1.4B km', size: 'Ringed Beauty', color: '#eab308', funFactEn: 'Saturn is famous for its majestic sparkling rings made of ice chunks and dust!', funFactHi: 'शनि अपने विशाल और सुंदर बर्फीले छल्लों (वलयों) के लिए प्रसिद्ध है!' },
  { id: 'uranus', nameEn: 'Uranus', nameHi: 'अरुण ग्रह', emoji: '🧊', distance: '2.8B km', size: 'Ice Giant', color: '#06b6d4', funFactEn: 'Uranus rotates tilted on its side like a rolling bowling ball!', funFactHi: 'अरुण ग्रह अपनी धुरी पर 98 डिग्री झुका हुआ है और लुढ़कती गेंद की तरह घूमता है!' },
  { id: 'neptune', nameEn: 'Neptune', nameHi: 'वरुण ग्रह', emoji: '🌀', distance: '4.5B km', size: 'Deep Blue', color: '#2563eb', funFactEn: 'Neptune has supersonic storms and wind speeds exceeding 2,000 km per hour!', funFactHi: 'वरुण गहरे नीले रंग का बर्फीला ग्रह है जहाँ 2000 किमी/घंटे की गति से बर्फीली हवाएं चलती हैं!' }
];

export function JuniorResearcherStudio() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [activeTab, setActiveTab] = useState<ScienceTab>('density');

  // AUDIO UTILITY
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

  // -------------------------------------------------------------
  // TAB 1: DENSITY TOWER STATE
  // -------------------------------------------------------------
  const [pouredLiquids, setPouredLiquids] = useState<LiquidItem[]>([LIQUIDS[0], LIQUIDS[2], LIQUIDS[3]]); // Default: Honey, Water, Oil
  const [droppedObject, setDroppedObject] = useState<TestObject | null>(DENSITY_OBJECTS[1]); // Default: Grape

  const toggleLiquid = (liq: LiquidItem) => {
    stopAudio();
    if (pouredLiquids.some(l => l.id === liq.id)) {
      setPouredLiquids(prev => prev.filter(l => l.id !== liq.id));
    } else {
      // Add and auto-sort descending by density (densest sinks to bottom)
      const next = [...pouredLiquids, liq].sort((a, b) => b.density - a.density);
      setPouredLiquids(next);
      playSpeech(lang === 'hi' 
        ? `${liq.nameHi} डाला गया। घनत्व है ${liq.density} ग्राम प्रति घन सेमी।` 
        : `Added ${liq.nameEn}. Density is ${liq.density} grams per cubic centimeter.`
      );
    }
  };

  const selectObject = (obj: TestObject) => {
    stopAudio();
    setDroppedObject(obj);
    playSpeech(lang === 'hi'
      ? `${obj.nameHi} बीकर में डाला गया। घनत्व ${obj.density} है।`
      : `Dropped ${obj.nameEn}. Density is ${obj.density} grams per cubic centimeter.`
    );
  };

  // -------------------------------------------------------------
  // TAB 2: STATES OF MATTER STATE
  // -------------------------------------------------------------
  const [selectedSubstance, setSelectedSubstance] = useState<Substance>(SUBSTANCES[0]);
  const [currentTemp, setCurrentTemp] = useState<number>(25);

  const getSubstancePhase = () => {
    if (selectedSubstance.sublimates) {
      if (currentTemp < 40) return { phaseEn: 'Solid Crystal', phaseHi: 'ठोस (क्रिस्टल)', emoji: '⚪', stateColor: 'bg-sky-100 text-sky-900 border-sky-300' };
      return { phaseEn: 'Sublimated Gas (No Liquid!)', phaseHi: 'सीधे वाष्प / गैस (ऊर्ध्वपातन)', emoji: '♨️', stateColor: 'bg-purple-100 text-purple-900 border-purple-300' };
    }
    if (currentTemp < selectedSubstance.meltTemp) {
      return { phaseEn: 'Solid State', phaseHi: 'ठोस अवस्था (Solid)', emoji: '🧊', stateColor: 'bg-sky-100 text-sky-900 border-sky-300' };
    }
    if (currentTemp < selectedSubstance.boilTemp) {
      return { phaseEn: 'Liquid State', phaseHi: 'द्रव अवस्था (Liquid)', emoji: '💧', stateColor: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
    return { phaseEn: 'Gaseous Vapor', phaseHi: 'गैस / वाष्प (Gas)', emoji: '♨️', stateColor: 'bg-rose-100 text-rose-900 border-rose-300' };
  };

  // -------------------------------------------------------------
  // TAB 3: ACID / BASE pH LAB STATE
  // -------------------------------------------------------------
  const [selectedSample, setSelectedSample] = useState<PHSample>(PH_SAMPLES[0]);
  const [indicatorType, setIndicatorType] = useState<'universal' | 'red_litmus' | 'blue_litmus'>('universal');

  const getIndicatorResult = () => {
    if (indicatorType === 'universal') {
      return {
        labelEn: `Universal pH Paper turned ${selectedSample.ph < 4 ? 'Red/Orange' : selectedSample.ph === 7 ? 'Green' : 'Dark Blue'} (pH ${selectedSample.ph})`,
        labelHi: `यूनिवर्सल इंडिकेटर का रंग ${selectedSample.ph < 4 ? 'लाल/नारंगी' : selectedSample.ph === 7 ? 'हरा' : 'गहरा नीला'} हुआ (pH ${selectedSample.ph})`,
        colorBg: selectedSample.color
      };
    }
    if (indicatorType === 'red_litmus') {
      const turnsBlue = selectedSample.ph > 7.5;
      return {
        labelEn: turnsBlue ? 'Red Litmus turned BLUE (Shows Base!)' : 'Red Litmus stayed RED (Acid / Neutral)',
        labelHi: turnsBlue ? 'लाल लिटमस नीला हो गया (क्षार की पहचान!)' : 'लाल लिटमस लाल ही रहा (अम्ल / उदासीन)',
        colorBg: turnsBlue ? '#2563eb' : '#ef4444'
      };
    }
    // Blue litmus
    const turnsRed = selectedSample.ph < 6.5;
    return {
      labelEn: turnsRed ? 'Blue Litmus turned RED (Shows Acid!)' : 'Blue Litmus stayed BLUE (Base / Neutral)',
      labelHi: turnsRed ? 'नीला लिटमस लाल हो गया (अम्ल की पहचान!)' : 'नीला लिटमस नीला ही रहा (क्षार / उदासीन)',
      colorBg: turnsRed ? '#ef4444' : '#2563eb'
    };
  };

  // -------------------------------------------------------------
  // TAB 4: SOLAR SYSTEM STATE
  // -------------------------------------------------------------
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetItem>(SOLAR_SYSTEM[2]); // Earth default

  return (
    <div className="max-w-5xl mx-auto p-3 md:p-6 font-sans select-none">
      
      {/* Top Banner with Bilingual Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-purple-50/90 p-4 rounded-3xl border-2 border-purple-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
            🔬
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-purple-950">
              {lang === 'hi' ? 'नन्हे वैज्ञानिक: इंटरएक्टिव साइंस लैब' : 'Junior Science Lab & Interactive Simulator'}
            </h1>
            <p className="text-xs md:text-sm font-bold text-purple-800">
              {lang === 'hi' 
                ? 'घनत्व टॉवर, अम्ल-क्षार परीक्षण, पदार्थ रूपांतरण व सौरमंडल अन्वेषण' 
                : 'Density Tower, Acid-Base Lab, States of Matter & Solar System (NEP 2020)'}
            </p>
          </div>
        </div>

        {/* Controls: Bilingual Toggle */}
        <div className="flex bg-white p-1 rounded-2xl border border-purple-300 shadow-sm gap-1">
          <button
            onClick={() => { stopAudio(); setLang('hi'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              lang === 'hi' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-950 hover:bg-purple-100'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => { stopAudio(); setLang('en'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              lang === 'en' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-950 hover:bg-purple-100'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Lab Navigation Switcher */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => { stopAudio(); setActiveTab('density'); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs ${
            activeTab === 'density' ? 'bg-purple-600 text-white shadow-md' : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-50'
          }`}
        >
          <Droplets className="w-4 h-4" />
          {lang === 'hi' ? '1. घनत्व टॉवर (Liquid Density)' : '1. Liquid Density Tower'}
        </button>

        <button
          onClick={() => { stopAudio(); setActiveTab('matter'); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs ${
            activeTab === 'matter' ? 'bg-purple-600 text-white shadow-md' : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-50'
          }`}
        >
          <Flame className="w-4 h-4" />
          {lang === 'hi' ? '2. पदार्थ व ऊर्ध्वपातन (States of Matter)' : '2. States & Sublimation'}
        </button>

        <button
          onClick={() => { stopAudio(); setActiveTab('phlab'); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs ${
            activeTab === 'phlab' ? 'bg-purple-600 text-white shadow-md' : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-50'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          {lang === 'hi' ? '3. अम्ल व क्षार (Acid, Base & pH)' : '3. Acid, Base & pH Lab'}
        </button>

        <button
          onClick={() => { stopAudio(); setActiveTab('solarsystem'); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs ${
            activeTab === 'solarsystem' ? 'bg-purple-600 text-white shadow-md' : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-50'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          {lang === 'hi' ? '4. सौरमंडल यात्रा (Solar System)' : '4. Solar System'}
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-3xl p-5 md:p-8 border-2 border-purple-200 shadow-xl min-h-[480px]">

        {/* ========================================================= */}
        {/* TAB 1: INTERACTIVE MULTI-LIQUID DENSITY TOWER             */}
        {/* ========================================================= */}
        {activeTab === 'density' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'hi' ? 'तरल पदार्थों का घनत्व टॉवर (Density Tower)' : 'Rainbow Liquid Density Tower'}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {lang === 'hi' 
                    ? 'द्रवों पर क्लिक करके बीकर में डालें। भारी द्रव नीचे बैठेंगे, हल्के ऊपर तैरेंगे!' 
                    : 'Click liquids to pour into the glass cylinder. Higher density settles at the bottom!'}
                </p>
              </div>
              <button
                onClick={() => playSpeech(lang === 'hi'
                  ? 'भारी घनत्व वाले तरल हमेशा नीचे बैठते हैं और कम घनत्व वाले ऊपर तैरते हैं।'
                  : 'Liquids with higher density sink to the bottom, while lighter liquids float on top.')}
                className="p-2 bg-purple-50 text-purple-800 hover:bg-purple-100 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                <Volume2 className="w-4 h-4 text-purple-600" />
                {lang === 'hi' ? 'नियम सुनें' : 'Listen Fact'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Selector: Liquids & Droppable Objects */}
              <div className="md:col-span-6 flex flex-col gap-4">
                
                {/* 1. Choose Liquids */}
                <div>
                  <span className="text-xs font-black text-purple-950 uppercase tracking-wide block mb-2">
                    {lang === 'hi' ? '१. तरल चुनें (Click to Add / Remove):' : '1. Click to Pour / Remove Liquids:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {LIQUIDS.map(liq => {
                      const isPoured = pouredLiquids.some(l => l.id === liq.id);
                      return (
                        <button
                          key={liq.id}
                          onClick={() => toggleLiquid(liq)}
                          className={`p-2.5 rounded-2xl border-2 flex items-center justify-between transition cursor-pointer text-left ${
                            isPoured 
                              ? 'bg-purple-50 border-purple-600 shadow-xs' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{liq.emoji}</span>
                            <div>
                              <span className="text-xs font-black block text-slate-900 leading-tight">
                                {lang === 'hi' ? liq.nameHi : liq.nameEn}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500">
                                {liq.density} g/cm³
                              </span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isPoured ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {isPoured ? (lang === 'hi' ? 'शामिल' : 'Poured') : '+'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Choose Floating / Sinking Objects */}
                <div>
                  <span className="text-xs font-black text-purple-950 uppercase tracking-wide block mb-2">
                    {lang === 'hi' ? '२. कोई वस्तु बीकर में डालकर देखें (Drop Item):' : '2. Drop an Object to Test Floating Level:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {DENSITY_OBJECTS.map(obj => (
                      <button
                        key={obj.id}
                        onClick={() => selectObject(obj)}
                        className={`p-2 rounded-xl border-2 flex items-center gap-2 transition cursor-pointer ${
                          droppedObject?.id === obj.id
                            ? 'bg-amber-100 border-amber-500 text-amber-950 shadow-xs font-black'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50'
                        }`}
                      >
                        <span className="text-xl">{obj.emoji}</span>
                        <div>
                          <span className="text-xs font-bold block">{lang === 'hi' ? obj.nameHi : obj.nameEn}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{obj.density} g/cm³</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right: The Virtual Glass Cylinder Tower */}
              <div className="md:col-span-6 flex flex-col items-center">
                <div className="relative w-48 h-80 bg-slate-100/60 rounded-b-3xl rounded-t-lg border-4 border-slate-400 border-t-0 p-2 flex flex-col-reverse justify-start overflow-hidden shadow-2xl backdrop-blur-xs">
                  
                  {pouredLiquids.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-3 text-xs font-bold text-slate-400">
                      {lang === 'hi' ? 'बाएं से कोई तरल चुनें' : 'Choose liquids to pour into cylinder'}
                    </div>
                  ) : (
                    pouredLiquids.map((liq, idx) => {
                      const layerHeightPercent = 100 / pouredLiquids.length;
                      return (
                        <div
                          key={liq.id}
                          style={{
                            height: `${layerHeightPercent}%`,
                            backgroundColor: liq.color
                          }}
                          className="w-full flex items-center justify-between px-2 text-[10px] font-black transition-all duration-500 shadow-inner"
                        >
                          <span style={{ color: liq.textColor }}>{liq.emoji} {lang === 'hi' ? liq.nameHi : liq.nameEn}</span>
                          <span style={{ color: liq.textColor }} className="font-mono">{liq.density} g/cm³</span>
                        </div>
                      );
                    })
                  )}

                  {/* Settled Test Object Indicator */}
                  {droppedObject && pouredLiquids.length > 0 && (
                    <div className="absolute inset-x-0 flex justify-center items-center pointer-events-none transition-all duration-700"
                      style={{
                        // Determine resting height: sinks below all liquids lighter than it
                        bottom: `${Math.min(
                          90,
                          Math.max(
                            8,
                            (pouredLiquids.filter(l => l.density > droppedObject.density).length / pouredLiquids.length) * 100
                          )
                        )}%`
                      }}
                    >
                      <div className="bg-white/95 px-2.5 py-1 rounded-full shadow-lg border border-slate-300 flex items-center gap-1.5 animate-bounce">
                        <span className="text-xl">{droppedObject.emoji}</span>
                        <span className="text-[10px] font-black text-slate-800">
                          {lang === 'hi' ? droppedObject.nameHi : droppedObject.nameEn} ({droppedObject.density} g/cm³)
                        </span>
                      </div>
                    </div>
                  )}

                </div>

                <span className="text-[11px] font-bold text-slate-500 mt-2">
                  🧪 {lang === 'hi' ? 'कांच का बीकर (Graduated Cylinder)' : 'Liquid Layering Column'}
                </span>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: STATES OF MATTER WITH SUBSTANCES & SUBLIMATION      */}
        {/* ========================================================= */}
        {activeTab === 'matter' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'hi' ? 'पदार्थ की अवस्थाएँ व ऊर्ध्वपातन' : 'States of Matter & Phase Changes'}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {lang === 'hi' 
                    ? 'तत्व चुनें और तापमान स्लाइडर को खिसकाकर ठोस, द्रव व गैस में परिवर्तन देखें!' 
                    : 'Select a substance and slide temperature to observe melting, boiling, and camphor sublimation!'}
                </p>
              </div>
              <button
                onClick={() => playSpeech(lang === 'hi' ? selectedSubstance.funFactHi : selectedSubstance.funFactEn)}
                className="p-2 bg-purple-50 text-purple-800 hover:bg-purple-100 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                <Volume2 className="w-4 h-4 text-purple-600" />
                {lang === 'hi' ? 'तथ्य सुनें' : 'Listen Fact'}
              </button>
            </div>

            {/* Substance Switcher */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SUBSTANCES.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    stopAudio();
                    setSelectedSubstance(s);
                    setCurrentTemp(25);
                  }}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition cursor-pointer ${
                    selectedSubstance.id === s.id
                      ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-102 font-black'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-purple-50'
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <div className="text-left">
                    <span className="text-xs font-black block leading-tight">{lang === 'hi' ? s.nameHi : s.nameEn}</span>
                    <span className="text-[10px] opacity-80 block">{s.sublimates ? (lang === 'hi' ? 'ऊर्ध्वपातन' : 'Sublimates') : (lang === 'hi' ? 'सामान्य' : 'Standard')}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Thermal Reaction Chamber */}
            {(() => {
              const phase = getSubstancePhase();
              return (
                <div className="bg-slate-50 rounded-3xl border-2 border-slate-200 p-6 flex flex-col items-center text-center">
                  
                  <div className="w-32 h-32 rounded-3xl bg-white border-2 border-slate-200 flex flex-col items-center justify-center shadow-inner mb-3">
                    <span className="text-6xl animate-pulse">{phase.emoji}</span>
                  </div>

                  <span className={`px-4 py-1 rounded-full text-xs font-black border mb-2 ${phase.stateColor}`}>
                    {lang === 'hi' ? phase.phaseHi : phase.phaseEn}
                  </span>

                  <p className="text-xs font-bold text-slate-600 max-w-md mb-6">
                    {lang === 'hi' ? selectedSubstance.funFactHi : selectedSubstance.funFactEn}
                  </p>

                  {/* Temperature Range Slider */}
                  <div className="w-full max-w-lg bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-slate-800">
                        🌡️ {lang === 'hi' ? 'तापमान नियंत्रक (Temperature):' : 'Thermal Controller:'}
                      </span>
                      <span className="text-xl font-black text-purple-700 font-mono">
                        {currentTemp}°C
                      </span>
                    </div>

                    <input
                      type="range"
                      min={selectedSubstance.id === 'iron' ? 0 : -20}
                      max={selectedSubstance.id === 'iron' ? 3000 : 250}
                      value={currentTemp}
                      onChange={(e) => {
                        stopAudio();
                        setCurrentTemp(Number(e.target.value));
                      }}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />

                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                      <span>{selectedSubstance.id === 'iron' ? '0°C' : '-20°C'}</span>
                      <span>
                        {selectedSubstance.sublimates 
                          ? (lang === 'hi' ? 'ऊर्ध्वपातन (>40°C)' : 'Sublimates (>40°C)') 
                          : `${selectedSubstance.meltTemp}°C (${lang === 'hi' ? 'गलनांक' : 'Melt'})`}
                      </span>
                      <span>{selectedSubstance.id === 'iron' ? '3000°C' : '250°C'}</span>
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ACID / BASE & pH TESTING LAB                       */}
        {/* ========================================================= */}
        {activeTab === 'phlab' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'hi' ? 'अम्ल, क्षार व pH परीक्षण प्रयोगशाला' : 'Acid, Base & pH Testing Chamber'}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {lang === 'hi' 
                    ? 'घरेलू वस्तु चुनें और लिटमस या pH पेपर से जाँचें कि वह अम्ल (Acid) है या क्षार (Base)!' 
                    : 'Choose household items and test with Litmus or Universal pH strip!'}
                </p>
              </div>
              <button
                onClick={() => playSpeech(lang === 'hi'
                  ? `pH 7 से कम अम्ल होता है, 7 उदासीन होता है, और 7 से अधिक क्षार कहलाता है।`
                  : `pH below 7 is acidic, exactly 7 is neutral, and pH above 7 is alkaline or base.`)}
                className="p-2 bg-purple-50 text-purple-800 hover:bg-purple-100 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                <Volume2 className="w-4 h-4 text-purple-600" />
                {lang === 'hi' ? 'pH नियम सुनें' : 'Listen pH Rule'}
              </button>
            </div>

            {/* Sample Chooser */}
            <div>
              <span className="text-xs font-black text-purple-950 uppercase tracking-wide block mb-2">
                {lang === 'hi' ? 'परीक्षण हेतु वस्तु चुनें (Choose Sample):' : 'Select a Test Sample:'}
              </span>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {PH_SAMPLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      stopAudio();
                      setSelectedSample(s);
                      playSpeech(lang === 'hi'
                        ? `${s.nameHi} का pH लगभग ${s.ph} है। यह ${s.typeHi} है।`
                        : `${s.nameEn} has a pH of ${s.ph}. It is a ${s.typeEn}.`
                      );
                    }}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition cursor-pointer ${
                      selectedSample.id === s.id
                        ? 'bg-purple-600 text-white border-purple-700 shadow-md font-black scale-102'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-purple-50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{s.emoji}</span>
                    <span className="text-xs font-bold block">{lang === 'hi' ? s.nameHi : s.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Indicator Strips */}
            <div>
              <span className="text-xs font-black text-purple-950 uppercase tracking-wide block mb-2">
                {lang === 'hi' ? 'सूचक (Indicator) चुनें:' : 'Select Testing Method / Indicator:'}
              </span>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setIndicatorType('universal')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    indicatorType === 'universal' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  🌈 {lang === 'hi' ? 'यूनिवर्सल pH पेपर' : 'Universal pH Strip'}
                </button>
                <button
                  onClick={() => setIndicatorType('red_litmus')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    indicatorType === 'red_litmus' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  🟥 {lang === 'hi' ? 'लाल लिटमस पेपर' : 'Red Litmus Paper'}
                </button>
                <button
                  onClick={() => setIndicatorType('blue_litmus')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    indicatorType === 'blue_litmus' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  🟦 {lang === 'hi' ? 'नीला लिटमस पेपर' : 'Blue Litmus Paper'}
                </button>
              </div>
            </div>

            {/* Test Strip Visual Result Card */}
            {(() => {
              const res = getIndicatorResult();
              return (
                <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
                  
                  <div className="flex items-center gap-4">
                    {/* Visual Color Strip */}
                    <div 
                      style={{ backgroundColor: res.colorBg }}
                      className="w-10 h-28 rounded-lg border-2 border-slate-400 shadow-md flex items-center justify-center font-black text-white text-xs rotate-6"
                    >
                      pH
                    </div>

                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                        {lang === 'hi' ? 'परीक्षण परिणाम (Observation):' : 'Chemical Observation:'}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-0.5">
                        {lang === 'hi' ? res.labelHi : res.labelEn}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-purple-100 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-md">
                          pH: {selectedSample.ph}
                        </span>
                        <span className="bg-slate-200 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-md">
                          {lang === 'hi' ? selectedSample.typeHi : selectedSample.typeEn}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 max-w-xs text-center">
                    💡 {selectedSample.ph < 7 
                      ? (lang === 'hi' ? 'अम्ल (Acid) स्वाद में खट्टे होते हैं और नीले लिटमस को लाल करते हैं।' : 'Acids taste sour and turn blue litmus paper RED.')
                      : selectedSample.ph === 7 
                      ? (lang === 'hi' ? 'उदासीन (Neutral) न अम्ल होते हैं न क्षार।' : 'Neutral substances have balanced pH 7 (like pure water).')
                      : (lang === 'hi' ? 'क्षार (Base) स्पर्श में चिकने होते हैं और लाल लिटमस को नीला करते हैं।' : 'Bases feel slippery and turn red litmus paper BLUE.')}
                  </div>

                </div>
              );
            })()}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: INTERACTIVE SOLAR SYSTEM EXPLORER                  */}
        {/* ========================================================= */}
        {activeTab === 'solarsystem' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'hi' ? 'हमारा सौरमंडल (Solar System Explorer)' : 'Interactive Solar System Explorer'}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {lang === 'hi' 
                    ? 'सूर्य व ग्रहों पर टैप करें। उनकी आवाज़, दूरी और रोचक वैज्ञानिक तथ्य जानें!' 
                    : 'Click any planet to hear its name pronounced and discover cosmic facts!'}
                </p>
              </div>
              <button
                onClick={() => playSpeech(lang === 'hi' ? selectedPlanet.funFactHi : selectedPlanet.funFactEn)}
                className="p-2 bg-purple-50 text-purple-800 hover:bg-purple-100 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                <Volume2 className="w-4 h-4 text-purple-600" />
                {lang === 'hi' ? 'ग्रह तथ्य सुनें' : 'Listen Planet Fact'}
              </button>
            </div>

            {/* Orbit / Planet Selection Deck */}
            <div className="bg-slate-950 p-4 md:p-6 rounded-3xl border-4 border-slate-800 flex items-center gap-2 overflow-x-auto shadow-2xl">
              {/* The Sun */}
              <div className="shrink-0 flex flex-col items-center mr-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-orange-500/50 shadow-lg flex items-center justify-center text-2xl animate-pulse">
                  ☀️
                </div>
                <span className="text-[10px] font-black text-amber-300 mt-1">Sun</span>
              </div>

              {/* 8 Planets */}
              {SOLAR_SYSTEM.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    stopAudio();
                    setSelectedPlanet(p);
                    playSpeech(lang === 'hi' 
                      ? `${p.nameHi}। ${p.funFactHi}` 
                      : `${p.nameEn}. ${p.funFactEn}`
                    );
                  }}
                  className={`shrink-0 p-3 rounded-2xl transition cursor-pointer flex flex-col items-center ${
                    selectedPlanet.id === p.id 
                      ? 'bg-slate-800 ring-2 ring-purple-400 scale-110 shadow-lg' 
                      : 'hover:bg-slate-900 opacity-80'
                  }`}
                >
                  <span className="text-3xl mb-1">{p.emoji}</span>
                  <span className="text-xs font-black text-white">{lang === 'hi' ? p.nameHi.split(' ')[0] : p.nameEn}</span>
                  <span className="text-[9px] font-bold text-slate-400 mt-0.5">{p.distance}</span>
                </button>
              ))}
            </div>

            {/* Planet Spotlight Card */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div 
                  style={{ backgroundColor: selectedPlanet.color }}
                  className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-md text-white"
                >
                  {selectedPlanet.emoji}
                </div>
                <div>
                  <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider block">
                    {lang === 'hi' ? 'ग्रह विवरण (Planet Details)' : 'Planet Profile'}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {lang === 'hi' ? selectedPlanet.nameHi : selectedPlanet.nameEn}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-white px-2.5 py-0.5 rounded-md text-xs font-bold text-slate-700 border border-purple-100">
                      📏 {lang === 'hi' ? 'सूर्य से दूरी:' : 'Distance:'} {selectedPlanet.distance}
                    </span>
                    <span className="bg-white px-2.5 py-0.5 rounded-md text-xs font-bold text-slate-700 border border-purple-100">
                      ⭐ {selectedPlanet.size}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-purple-200 max-w-sm text-xs font-bold text-purple-950 leading-relaxed shadow-xs">
                💡 {lang === 'hi' ? selectedPlanet.funFactHi : selectedPlanet.funFactEn}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}