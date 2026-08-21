'use client';

import React, { useState } from 'react';
import { unlockAudio } from '../lib/audio';

interface LetterSound {
  letter: string;
  hindiSound: string;
  audioPhoneme: string;
  lang: 'hi-IN' | 'en-US';
  exampleEmoji: string;
  exampleWord: string;
}

// 26 Pure Letter Phonemes mapped to crisp phonetic audio tokens
const LETTER_SOUNDS_26: LetterSound[] = [
  { letter: 'A', hindiSound: 'ऐ (æ)', audioPhoneme: 'ऐ', lang: 'hi-IN', exampleEmoji: '🍎', exampleWord: 'Apple' },
  { letter: 'B', hindiSound: 'ब (b)', audioPhoneme: 'ब', lang: 'hi-IN', exampleEmoji: '⚽', exampleWord: 'Ball' },
  { letter: 'C', hindiSound: 'क (k)', audioPhoneme: 'क', lang: 'hi-IN', exampleEmoji: '🐱', exampleWord: 'Cat' },
  { letter: 'D', hindiSound: 'ड (d)', audioPhoneme: 'ड', lang: 'hi-IN', exampleEmoji: '🐶', exampleWord: 'Dog' },
  { letter: 'E', hindiSound: 'ए (e)', audioPhoneme: 'ए', lang: 'hi-IN', exampleEmoji: '🥚', exampleWord: 'Egg' },
  { letter: 'F', hindiSound: 'फ़ (f)', audioPhoneme: 'फ़', lang: 'hi-IN', exampleEmoji: '🐟', exampleWord: 'Fish' },
  { letter: 'G', hindiSound: 'ग (g)', audioPhoneme: 'ग', lang: 'hi-IN', exampleEmoji: '🍇', exampleWord: 'Grapes' },
  { letter: 'H', hindiSound: 'ह (h)', audioPhoneme: 'ह', lang: 'hi-IN', exampleEmoji: '🏠', exampleWord: 'House' },
  { letter: 'I', hindiSound: 'इ (i)', audioPhoneme: 'इ', lang: 'hi-IN', exampleEmoji: '🦎', exampleWord: 'Iguana' },
  { letter: 'J', hindiSound: 'ज (j)', audioPhoneme: 'ज', lang: 'hi-IN', exampleEmoji: '🧃', exampleWord: 'Juice' },
  { letter: 'K', hindiSound: 'क (k)', audioPhoneme: 'क', lang: 'hi-IN', exampleEmoji: '🪁', exampleWord: 'Kite' },
  { letter: 'L', hindiSound: 'ल (l)', audioPhoneme: 'ल', lang: 'hi-IN', exampleEmoji: '🦁', exampleWord: 'Lion' },
  { letter: 'M', hindiSound: 'म (m)', audioPhoneme: 'म', lang: 'hi-IN', exampleEmoji: '🥭', exampleWord: 'Mango' },
  { letter: 'N', hindiSound: 'न (n)', audioPhoneme: 'न', lang: 'hi-IN', exampleEmoji: '🪺', exampleWord: 'Nest' },
  { letter: 'O', hindiSound: 'ऑ (ɒ)', audioPhoneme: 'ऑ', lang: 'hi-IN', exampleEmoji: '🍊', exampleWord: 'Orange' },
  { letter: 'P', hindiSound: 'प (p)', audioPhoneme: 'प', lang: 'hi-IN', exampleEmoji: '✏️', exampleWord: 'Pencil' },
  { letter: 'Q', hindiSound: 'क्व (kw)', audioPhoneme: 'क्व', lang: 'hi-IN', exampleEmoji: '👑', exampleWord: 'Queen' },
  { letter: 'R', hindiSound: 'र (r)', audioPhoneme: 'र', lang: 'hi-IN', exampleEmoji: '🌹', exampleWord: 'Rose' },
  { letter: 'S', hindiSound: 'स (s)', audioPhoneme: 'स', lang: 'hi-IN', exampleEmoji: '☀️', exampleWord: 'Sun' },
  { letter: 'T', hindiSound: 'ट (t)', audioPhoneme: 'ट', lang: 'hi-IN', exampleEmoji: '🌳', exampleWord: 'Tree' },
  { letter: 'U', hindiSound: 'अ (ʌ)', audioPhoneme: 'अ', lang: 'hi-IN', exampleEmoji: '☂️', exampleWord: 'Umbrella' },
  { letter: 'V', hindiSound: 'व (v)', audioPhoneme: 'व', lang: 'hi-IN', exampleEmoji: '🚐', exampleWord: 'Van' },
  { letter: 'W', hindiSound: 'व (w)', audioPhoneme: 'व', lang: 'hi-IN', exampleEmoji: '⌚', exampleWord: 'Watch' },
  { letter: 'X', hindiSound: 'क्स (ks)', audioPhoneme: 'क्स', lang: 'hi-IN', exampleEmoji: '📦', exampleWord: 'Box' },
  { letter: 'Y', hindiSound: 'य (y)', audioPhoneme: 'य', lang: 'hi-IN', exampleEmoji: '🪀', exampleWord: 'Yo-yo' },
  { letter: 'Z', hindiSound: 'ज़ (z)', audioPhoneme: 'ज़', lang: 'hi-IN', exampleEmoji: '🦓', exampleWord: 'Zebra' },
];

interface CVCItem {
  word: string;
  c1: string;
  c1Sound: string;
  v: string;
  vSound: string;
  c2: string;
  c2Sound: string;
  hindiPronounce: string;
  emoji: string;
  family: string;
}

const CVC_DATABASE: CVCItem[] = [
  // Short A
  { word: 'CAT', c1: 'C', c1Sound: 'क', v: 'A', vSound: 'ऐ', c2: 'T', c2Sound: 'ट', hindiPronounce: 'क-ऐ-ट ➔ कैट (बिल्ली)', emoji: '🐱', family: '-at' },
  { word: 'BAT', c1: 'B', c1Sound: 'ब', v: 'A', vSound: 'ऐ', c2: 'T', c2Sound: 'ट', hindiPronounce: 'ब-ऐ-ट ➔ बैट (बल्ला)', emoji: '🏏', family: '-at' },
  { word: 'RAT', c1: 'R', c1Sound: 'र', v: 'A', vSound: 'ऐ', c2: 'T', c2Sound: 'ट', hindiPronounce: 'र-ऐ-ट ➔ रैट (चूहा)', emoji: '🐀', family: '-at' },
  { word: 'FAN', c1: 'F', c1Sound: 'फ़', v: 'A', vSound: 'ऐ', c2: 'N', c2Sound: 'न', hindiPronounce: 'फ-ऐ-न ➔ फैन (पंखा)', emoji: '🪭', family: '-an' },
  { word: 'VAN', c1: 'V', c1Sound: 'व', v: 'A', vSound: 'ऐ', c2: 'N', c2Sound: 'न', hindiPronounce: 'व-ऐ-न ➔ वैन (गाड़ी)', emoji: '🚐', family: '-an' },
  { word: 'CAP', c1: 'C', c1Sound: 'क', v: 'A', vSound: 'ऐ', c2: 'P', c2Sound: 'प', hindiPronounce: 'क-ऐ-प ➔ कैप (टोपी)', emoji: '🧢', family: '-ap' },

  // Short E
  { word: 'HEN', c1: 'H', c1Sound: 'ह', v: 'E', vSound: 'ए', c2: 'N', c2Sound: 'न', hindiPronounce: 'ह-ए-न ➔ हेन (मुर्गी)', emoji: '🐔', family: '-en' },
  { word: 'PEN', c1: 'P', c1Sound: 'प', v: 'E', vSound: 'ए', c2: 'N', c2Sound: 'न', hindiPronounce: 'प-ए-न ➔ पेन (कलम)', emoji: '🖊️', family: '-en' },
  { word: 'BED', c1: 'B', c1Sound: 'ब', v: 'E', vSound: 'ए', c2: 'D', c2Sound: 'ड', hindiPronounce: 'ब-ए-ड ➔ बेड (बिस्तर)', emoji: '🛏️', family: '-ed' },
  { word: 'NET', c1: 'N', c1Sound: 'न', v: 'E', vSound: 'ए', c2: 'T', c2Sound: 'ट', hindiPronounce: 'न-ए-ट ➔ नेट (जाल)', emoji: '🕸️', family: '-et' },

  // Short I
  { word: 'PIN', c1: 'P', c1Sound: 'प', v: 'I', vSound: 'इ', c2: 'N', c2Sound: 'न', hindiPronounce: 'प-इ-न ➔ पिन (आलपिन)', emoji: '📌', family: '-in' },
  { word: 'BIN', c1: 'B', c1Sound: 'ब', v: 'I', vSound: 'इ', c2: 'N', c2Sound: 'न', hindiPronounce: 'ब-इ-न ➔ बिन (कूड़ेदान)', emoji: '🗑️', family: '-in' },
  { word: 'LIP', c1: 'L', c1Sound: 'ल', v: 'I', vSound: 'इ', c2: 'P', c2Sound: 'प', hindiPronounce: 'ल-इ-प ➔ लिप (होंठ)', emoji: '👄', family: '-ip' },
  { word: 'PIG', c1: 'P', c1Sound: 'प', v: 'I', vSound: 'इ', c2: 'G', c2Sound: 'ग', hindiPronounce: 'प-इ-ग ➔ पिग (सुअर)', emoji: '🐷', family: '-ig' },

  // Short O
  { word: 'POT', c1: 'P', c1Sound: 'प', v: 'O', vSound: 'ऑ', c2: 'T', c2Sound: 'ट', hindiPronounce: 'प-ऑ-ट ➔ पॉट (मटका)', emoji: '🏺', family: '-ot' },
  { word: 'HOT', c1: 'H', c1Sound: 'ह', v: 'O', vSound: 'ऑ', c2: 'T', c2Sound: 'ट', hindiPronounce: 'ह-ऑ-ट ➔ हॉट (गरम)', emoji: '🔥', family: '-ot' },
  { word: 'TOP', c1: 'T', c1Sound: 'ट', v: 'O', vSound: 'ऑ', c2: 'P', c2Sound: 'प', hindiPronounce: 'ट-ऑ-प ➔ टॉप (लट्टू)', emoji: '🪀', family: '-op' },
  { word: 'BOX', c1: 'B', c1Sound: 'ब', v: 'O', vSound: 'ऑ', c2: 'X', c2Sound: 'क्स', hindiPronounce: 'ब-ऑ-क्स ➔ बॉक्स (डिब्बा)', emoji: '📦', family: '-ox' },

  // Short U
  { word: 'MUG', c1: 'M', c1Sound: 'म', v: 'U', vSound: 'अ', c2: 'G', c2Sound: 'ग', hindiPronounce: 'म-अ-ग ➔ मग (मग)', emoji: '🍺', family: '-ug' },
  { word: 'SUN', c1: 'S', c1Sound: 'स', v: 'U', vSound: 'अ', c2: 'N', c2Sound: 'न', hindiPronounce: 'स-अ-न ➔ सन (सूरज)', emoji: '☀️', family: '-un' },
  { word: 'RUN', c1: 'R', c1Sound: 'र', v: 'U', vSound: 'अ', c2: 'N', c2Sound: 'न', hindiPronounce: 'र-अ-न ➔ रन (दौड़ना)', emoji: '🏃', family: '-un' },
  { word: 'NUT', c1: 'N', c1Sound: 'न', v: 'U', vSound: 'अ', c2: 'T', c2Sound: 'ट', hindiPronounce: 'न-अ-ट ➔ नट (अखरोट)', emoji: '🥜', family: '-ut' },
];

const speakVoice = (text: string, lang: 'hi-IN' | 'en-US') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85;
  utterance.pitch = 1.05;
  setTimeout(() => window.speechSynthesis.speak(utterance), 30);
};

export default function HindiPhonicsStudio() {
  const [activeSubTab, setActiveSubTab] = useState<'cvc' | 'letters'>('cvc');
  const [selectedCVCIndex, setSelectedCVCIndex] = useState(0);
  const [blendStep, setBlendStep] = useState<number>(0);
  const [isBlending, setIsBlending] = useState(false);

  const currentCVC = CVC_DATABASE[selectedCVCIndex];

  const handlePlayLetterSound = (item: LetterSound) => {
    unlockAudio();
    speakVoice(item.audioPhoneme, 'hi-IN');
    setTimeout(() => {
      speakVoice(`${item.letter} से ${item.exampleWord}`, 'hi-IN');
    }, 550);
  };

  const handleBlendWord = async () => {
    if (isBlending) return;
    setIsBlending(true);
    unlockAudio();

    // 1. Initial Consonant Sound (e.g., 'क' for C)
    setBlendStep(1);
    speakVoice(currentCVC.c1Sound, 'hi-IN');
    await new Promise((r) => setTimeout(r, 650));

    // 2. Short Vowel Sound (e.g., 'ऐ' for A)
    setBlendStep(2);
    speakVoice(currentCVC.vSound, 'hi-IN');
    await new Promise((r) => setTimeout(r, 650));

    // 3. Final Consonant Sound (e.g., 'ट' for T)
    setBlendStep(3);
    speakVoice(currentCVC.c2Sound, 'hi-IN');
    await new Promise((r) => setTimeout(r, 650));

    // 4. Blended English Word
    setBlendStep(4);
    speakVoice(currentCVC.word, 'en-US');
    await new Promise((r) => setTimeout(r, 850));

    // 5. Hindi Synthesis Breakdown
    speakVoice(currentCVC.hindiPronounce, 'hi-IN');
    setIsBlending(false);
  };

  const nextCVCWord = () => {
    setBlendStep(0);
    setSelectedCVCIndex((prev) => (prev + 1) % CVC_DATABASE.length);
  };

  const prevCVCWord = () => {
    setBlendStep(0);
    setSelectedCVCIndex((prev) => (prev - 1 + CVC_DATABASE.length) % CVC_DATABASE.length);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-4 p-3 md:p-6 font-sans select-none">
      {/* Top Banner */}
      <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
              <span>🔊</span> फोनिक्स व ध्वनि प्रयोगशाला (Phonics Lab)
            </h2>
            <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Age 3–7
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            हिंदी के सहज उच्चारण से अंग्रेजी के अक्षरों व 3-अक्षर शब्दों (CVC) को पढ़ना सीखें
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold gap-1">
          <button
            onClick={() => setActiveSubTab('cvc')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeSubTab === 'cvc' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧩 CVC शब्द जोड़ो (Slider)
          </button>
          <button
            onClick={() => setActiveSubTab('letters')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeSubTab === 'letters' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔤 अक्षर ध्वनियाँ (A-Z)
          </button>
        </div>
      </div>

      {/* CVC Word Slider */}
      {activeSubTab === 'cvc' && (
        <div className="w-full bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-md flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              ध्वनि परिवार: {currentCVC.family}
            </span>
            <span className="text-xs font-bold text-slate-400">
              शब्द {selectedCVCIndex + 1} / {CVC_DATABASE.length}
            </span>
          </div>

          {/* Picture Box */}
          <div className="w-36 h-36 bg-indigo-50/60 border-4 border-indigo-200 rounded-3xl flex flex-col items-center justify-center shadow-inner mb-6">
            <span className="text-7xl filter drop-shadow-md">{currentCVC.emoji}</span>
          </div>

          {/* Interactive Sound Blocks */}
          <div className="flex items-center justify-center gap-2.5 md:gap-4 mb-6">
            {/* Consonant 1 */}
            <button
              onClick={() => {
                unlockAudio();
                setBlendStep(1);
                speakVoice(currentCVC.c1Sound, 'hi-IN');
              }}
              className={`w-20 h-24 md:w-24 md:h-28 rounded-2xl border-4 flex flex-col items-center justify-center font-black transition-all duration-300 shadow-sm active:scale-95 ${
                blendStep === 1 || blendStep === 4
                  ? 'bg-indigo-600 border-indigo-700 text-white scale-105 shadow-md'
                  : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-indigo-400'
              }`}
            >
              <span className="text-3xl md:text-4xl">{currentCVC.c1}</span>
              <span className="text-xs text-amber-500 font-bold mt-0.5">{currentCVC.c1Sound}</span>
              <span className="text-[10px] opacity-70">Consonant</span>
            </button>

            <span className="text-2xl font-black text-slate-400">+</span>

            {/* Vowel */}
            <button
              onClick={() => {
                unlockAudio();
                setBlendStep(2);
                speakVoice(currentCVC.vSound, 'hi-IN');
              }}
              className={`w-20 h-24 md:w-24 md:h-28 rounded-2xl border-4 flex flex-col items-center justify-center font-black transition-all duration-300 shadow-sm active:scale-95 ${
                blendStep === 2 || blendStep === 4
                  ? 'bg-rose-500 border-rose-600 text-white scale-105 shadow-md'
                  : 'bg-rose-50 border-rose-200 text-rose-800 hover:border-rose-400'
              }`}
            >
              <span className="text-3xl md:text-4xl">{currentCVC.v}</span>
              <span className="text-xs text-rose-600 font-bold mt-0.5">{currentCVC.vSound}</span>
              <span className="text-[10px] opacity-70">Vowel</span>
            </button>

            <span className="text-2xl font-black text-slate-400">+</span>

            {/* Consonant 2 */}
            <button
              onClick={() => {
                unlockAudio();
                setBlendStep(3);
                speakVoice(currentCVC.c2Sound, 'hi-IN');
              }}
              className={`w-20 h-24 md:w-24 md:h-28 rounded-2xl border-4 flex flex-col items-center justify-center font-black transition-all duration-300 shadow-sm active:scale-95 ${
                blendStep === 3 || blendStep === 4
                  ? 'bg-indigo-600 border-indigo-700 text-white scale-105 shadow-md'
                  : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-indigo-400'
              }`}
            >
              <span className="text-3xl md:text-4xl">{currentCVC.c2}</span>
              <span className="text-xs text-amber-500 font-bold mt-0.5">{currentCVC.c2Sound}</span>
              <span className="text-[10px] opacity-70">Consonant</span>
            </button>
          </div>

          {/* Hindi Sound Display */}
          <div className="bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-2xl mb-6 text-center">
            <span className="text-xs text-slate-500 font-bold block mb-0.5">ध्वनि विखंडन (Phonetic Blend):</span>
            <span className="text-base font-black text-slate-800">{currentCVC.hindiPronounce}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 items-center justify-center w-full">
            <button
              onClick={prevCVCWord}
              disabled={isBlending}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-black text-xs md:text-sm rounded-xl transition"
            >
              ◀ पिछला शब्द
            </button>

            <button
              onClick={handleBlendWord}
              disabled={isBlending}
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white font-black text-sm md:text-base rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <span>🔊</span> {isBlending ? 'ध्वनियाँ जुड़ रही हैं...' : 'ध्वनियाँ जोड़कर पढ़ें (Blend & Read)'}
            </button>

            <button
              onClick={nextCVCWord}
              disabled={isBlending}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-black text-xs md:text-sm rounded-xl transition"
            >
              अगला शब्द ➔
            </button>
          </div>
        </div>
      )}

      {/* A-Z Letter Sounds Grid */}
      {activeSubTab === 'letters' && (
        <div className="w-full bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-md">
          <div className="text-center mb-5">
            <h3 className="text-base font-black text-slate-800">26 वर्णमाला ध्वनियाँ (A to Z Phonics Grid)</h3>
            <p className="text-xs text-slate-500 font-medium">अक्षर पर क्लिक करके उसकी शुद्ध ध्वनि और हिंदी उच्चारण सुनें</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
            {LETTER_SOUNDS_26.map((item) => (
              <button
                key={item.letter}
                onClick={() => handlePlayLetterSound(item)}
                className="p-3 bg-slate-50 hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400 rounded-2xl flex flex-col items-center justify-center transition active:scale-95 shadow-sm group"
              >
                <div className="text-2xl font-black text-slate-800 group-hover:text-amber-700">
                  {item.letter}
                </div>
                <div className="text-xs font-bold text-amber-800 my-0.5">
                  {item.hindiSound}
                </div>
                <div className="text-base mt-1">{item.exampleEmoji}</div>
                <div className="text-[10px] text-slate-500 font-semibold">{item.exampleWord}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}