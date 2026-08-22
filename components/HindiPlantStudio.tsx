'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Award, Sparkles, CheckCircle2, Trophy, Star, ArrowRight, Apple, Sparkle } from 'lucide-react';

interface FloraItem {
  id: string;
  name: string;
  hindiName: string;
  type: 'fruit' | 'vegetable';
  taste?: 'sweet' | 'sour' | 'bitter' | 'pungent';
  hindiTaste?: string;
  emoji: string;
}

// Full syllabus repository
const FULL_FLORA_REPOSITORY: FloraItem[] = [
  // Fruits
  { id: 'mango', name: 'Mango', hindiName: 'आम', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🥭' },
  { id: 'apple', name: 'Apple', hindiName: 'सेब', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍎' },
  { id: 'banana', name: 'Banana', hindiName: 'केला', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍌' },
  { id: 'custard_apple', name: 'Custard Apple', hindiName: 'सीताफल', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍈' },
  { id: 'date', name: 'Date', hindiName: 'खजूर', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🌴' },
  { id: 'fig', name: 'Fig', hindiName: 'अंजीर', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🟣' },
  { id: 'grape', name: 'Grape', hindiName: 'अंगूर', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा व खट्टा', emoji: '🍇' },
  { id: 'guava', name: 'Guava', hindiName: 'अमरूद', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍏' },
  { id: 'jackfruit', name: 'Jack-fruit', hindiName: 'कटहल', type: 'fruit', emoji: '🍈' },
  { id: 'lemon', name: 'Lemon', hindiName: 'नींबू', type: 'fruit', taste: 'sour', hindiTaste: 'खट्टा (Sour)', emoji: '🍋' },
  { id: 'orange', name: 'Orange', hindiName: 'संतरा', type: 'fruit', taste: 'sour', hindiTaste: 'खट्टा-मीठा', emoji: '🍊' },
  { id: 'papaya', name: 'Papaya', hindiName: 'पपीता', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍈' },
  { id: 'pomegranate', name: 'Pomegranate', hindiName: 'अनार', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍎' },
  { id: 'sugarcane', name: 'Sugar-cane', hindiName: 'गन्ना', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🎋' },
  { id: 'sweet_lime', name: 'Sweet Lime', hindiName: 'मोसंबी', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍈' },
  { id: 'tamarind', name: 'Tamarind', hindiName: 'इमली', type: 'fruit', taste: 'sour', hindiTaste: 'खट्टा (Sour)', emoji: '🟤' },
  { id: 'watermelon', name: 'Watermelon', hindiName: 'तरबूज', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍉' },
  { id: 'musk_melon', name: 'Musk-melon', hindiName: 'खरबूजा', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍈' },
  { id: 'peach', name: 'Peach', hindiName: 'सतालू (पीच)', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍑' },
  { id: 'pear', name: 'Pear', hindiName: 'नाशपाती', type: 'fruit', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍐' },
  { id: 'pineapple', name: 'Pineapple', hindiName: 'अनन्नास', type: 'fruit', taste: 'sweet', hindiTaste: 'खट्टा-मीठा', emoji: '🍍' },

  // Vegetables
  { id: 'bitter_gourd', name: 'Bitter Gourd', hindiName: 'करेला', type: 'vegetable', taste: 'bitter', hindiTaste: 'कड़वा (Bitter)', emoji: '🥒' },
  { id: 'brinjal', name: 'Brinjal', hindiName: 'बैंगन', type: 'vegetable', emoji: '🍆' },
  { id: 'cabbage', name: 'Cabbage', hindiName: 'पत्तागोभी', type: 'vegetable', emoji: '🥬' },
  { id: 'carrot', name: 'Carrot', hindiName: 'गाजर', type: 'vegetable', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🥕' },
  { id: 'cauliflower', name: 'Cauliflower', hindiName: 'फूलगोभी', type: 'vegetable', emoji: '🥦' },
  { id: 'coriander', name: 'Coriander', hindiName: 'धनिया', type: 'vegetable', emoji: '🌿' },
  { id: 'garlic', name: 'Garlic', hindiName: 'लहसुन', type: 'vegetable', taste: 'pungent', hindiTaste: 'तीखा (Pungent)', emoji: '🧄' },
  { id: 'ginger', name: 'Ginger', hindiName: 'अदरक', type: 'vegetable', taste: 'pungent', hindiTaste: 'तीखा (Pungent)', emoji: '🫚' },
  { id: 'green_chilli', name: 'Green Chilli', hindiName: 'हरी मिर्च', type: 'vegetable', taste: 'pungent', hindiTaste: 'तीखा (Spicy)', emoji: '🌶️' },
  { id: 'green_pea', name: 'Green Pea', hindiName: 'हरा मटर', type: 'vegetable', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🫛' },
  { id: 'ladys_finger', name: "Lady's Finger", hindiName: 'भिंडी', type: 'vegetable', emoji: '🥒' },
  { id: 'mint', name: 'Mint', hindiName: 'पुदीना', type: 'vegetable', emoji: '🍃' },
  { id: 'onion', name: 'Onion', hindiName: 'प्याज', type: 'vegetable', taste: 'pungent', hindiTaste: 'तीखा (Pungent)', emoji: '🧅' },
  { id: 'potato', name: 'Potato', hindiName: 'आलू', type: 'vegetable', emoji: '🥔' },
  { id: 'pumpkin', name: 'Pumpkin', hindiName: 'कद्दू', type: 'vegetable', emoji: '🎃' },
  { id: 'radish', name: 'Radish', hindiName: 'मूली', type: 'vegetable', taste: 'pungent', hindiTaste: 'तीखा (Pungent)', emoji: '🥕' },
  { id: 'spinach', name: 'Spinach', hindiName: 'पालक', type: 'vegetable', emoji: '🥬' },
  { id: 'sweet_potato', name: 'Sweet Potato', hindiName: 'शकरकंद', type: 'vegetable', taste: 'sweet', hindiTaste: 'मीठा (Sweet)', emoji: '🍠' },
  { id: 'tomato', name: 'Tomato', hindiName: 'टमाटर', type: 'vegetable', taste: 'sour', hindiTaste: 'खट्टा (Sour)', emoji: '🍅' }
];

// Distinct items with clear, unambiguous natural taste profiles
const DISTINCT_TASTE_ITEMS: FloraItem[] = FULL_FLORA_REPOSITORY.filter((item) => item.taste !== undefined);

type GameMode = 'classify' | 'taste';
const TOTAL_ROUNDS = 5;

export function HindiPlantStudio() {
  const [mode, setMode] = useState<GameMode>('classify');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [quizQueue, setQuizQueue] = useState<FloraItem[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  const currentItem = quizQueue[currentRound - 1] || FULL_FLORA_REPOSITORY[0];

  const clearTimer = () => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playSpeech = (text: string, lang: 'hi-IN' | 'en-IN' = 'hi-IN') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  const playSuccessChime = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  };

  // Generate 5 completely unique questions without duplicates
  const startNewGame = (newMode: GameMode = mode) => {
    clearTimer();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const sourcePool = newMode === 'taste' ? [...DISTINCT_TASTE_ITEMS] : [...FULL_FLORA_REPOSITORY];
    sourcePool.sort(() => Math.random() - 0.5);

    const fiveUniqueItems = sourcePool.slice(0, TOTAL_ROUNDS);

    setQuizQueue(fiveUniqueItems);
    setScore(0);
    setStreak(0);
    setCurrentRound(1);
    setIsGameOver(false);
    setFinalScore(0);
    setSelectedChoice(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setIsBusy(false);
  };

  useEffect(() => {
    startNewGame(mode);
  }, [mode]);

  const handleNextQuestion = () => {
    clearTimer();
    if (currentRound >= TOTAL_ROUNDS) {
      setIsGameOver(true);
      setFinalScore(score);
      setIsBusy(false);
    } else {
      setCurrentRound((prev) => prev + 1);
      setSelectedChoice(null);
      setIsCorrect(null);
      setShowExplanation(false);
      setIsBusy(false);
    }
  };

  const handleChoice = (choice: string) => {
    if (isBusy || isGameOver || isCorrect !== null) return;
    setIsBusy(true);
    setSelectedChoice(choice);

    let isAnswerRight = false;
    if (mode === 'classify') {
      isAnswerRight = choice === currentItem.type;
    } else {
      isAnswerRight = choice === currentItem.taste;
    }

    if (isAnswerRight) {
      setIsCorrect(true);
      const nextScore = score + 1;
      setScore(nextScore);
      setStreak((prev) => prev + 1);
      playSuccessChime();

      if (mode === 'classify') {
        const typeLabel = currentItem.type === 'fruit' ? 'एक मीठा फल (Fruit)' : 'एक पौष्टिक सब्जी (Vegetable)';
        playSpeech(`शाबाश! ${currentItem.hindiName} ${typeLabel} है! ${currentItem.name} is a ${currentItem.type}!`);
      } else {
        playSpeech(`शाबाश! ${currentItem.hindiName} का स्वाद ${currentItem.hindiTaste} होता है!`);
      }

      autoAdvanceTimer.current = setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          setIsGameOver(true);
          setFinalScore(nextScore);
          setIsBusy(false);
        } else {
          setCurrentRound((prev) => prev + 1);
          setSelectedChoice(null);
          setIsCorrect(null);
          setShowExplanation(false);
          setIsBusy(false);
        }
      }, 1600);

    } else {
      setIsCorrect(false);
      setStreak(0);
      setShowExplanation(true);

      if (mode === 'classify') {
        const correctType = currentItem.type === 'fruit' ? 'फल (Fruit)' : 'सब्जी (Vegetable)';
        playSpeech(`सही उत्तर: ${currentItem.hindiName} एक ${correctType} है। ${currentItem.name} is a ${currentItem.type}.`);
      } else {
        playSpeech(`सही उत्तर: ${currentItem.hindiName} का स्वाद ${currentItem.hindiTaste} होता है।`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans select-none">
      {/* Top Header & Turn Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍎</span>
            <h1 className="text-xl md:text-2xl font-black text-emerald-950">फल, सब्जियाँ व स्वाद (Flora &amp; Taste)</h1>
          </div>
          <p className="text-xs md:text-sm font-semibold text-emerald-800">
            फल/सब्जी का वर्गीकरण एवं विशिष्ट स्वाद पहचानें • Identify &amp; Sort
          </p>
        </div>

        {/* Round Progress */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-sm">
          <span className="text-xs font-black text-emerald-900 mr-1">राउंड:</span>
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i + 1 === currentRound && !isGameOver
                  ? 'bg-emerald-600 ring-2 ring-emerald-300 scale-110'
                  : i + 1 < currentRound || isGameOver
                  ? 'bg-teal-500'
                  : 'bg-slate-200'
              }`}
            />
          ))}
          <span className="text-xs font-extrabold text-emerald-800 ml-1">
            {Math.min(currentRound, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
          </span>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-emerald-300 shadow-sm">
          <button
            onClick={() => setMode('classify')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              mode === 'classify' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Apple className="w-3.5 h-3.5" /> फल या सब्जी? (Classify)
          </button>
          <button
            onClick={() => setMode('taste')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              mode === 'taste' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Sparkle className="w-3.5 h-3.5" /> स्वाद पहचानें (Distinct Tastes)
          </button>
        </div>

        {/* Live Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-lg text-xs font-black border border-emerald-200">
            <Award className="w-4 h-4 text-emerald-600" /> सही: {score}/{TOTAL_ROUNDS}
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-teal-100 text-teal-800 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" /> {streak} लगातार!
            </div>
          )}
        </div>
      </div>

      {/* Main Play Container */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-emerald-200 shadow-xl flex flex-col items-center min-h-[460px] justify-center">
        {isGameOver ? (
          /* End Game Card */
          <div className="w-full max-w-md bg-gradient-to-b from-emerald-50 to-teal-50/50 rounded-3xl border-2 border-emerald-300 p-8 text-center flex flex-col items-center shadow-lg">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600 shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-emerald-950 mb-1">खेल संपन्न! (Game Complete)</h2>
            <p className="text-sm font-bold text-emerald-800 mb-5">
              {finalScore === 5
                ? '🌟 Excellent Explorer! All identifications correct!'
                : finalScore >= 3
                ? '👏 Great botany skills! बहुत बढ़िया!'
                : '💪 Keep learning nature! अभ्यास जारी रखें!'}
            </p>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: TOTAL_ROUNDS }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-7 h-7 ${
                    idx < finalScore
                      ? 'text-amber-500 fill-amber-400 drop-shadow'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              ))}
            </div>

            {/* Score Summary */}
            <div className="w-full bg-white rounded-2xl p-4 border border-emerald-200 mb-6 flex justify-around shadow-sm">
              <div>
                <span className="block text-xs font-bold text-slate-500">कुल प्रश्न</span>
                <span className="text-xl font-black text-slate-800">{TOTAL_ROUNDS}</span>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <span className="block text-xs font-bold text-slate-500">सही उत्तर</span>
                <span className="text-xl font-black text-emerald-600">{finalScore}</span>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <span className="block text-xs font-bold text-slate-500">सटीकता</span>
                <span className="text-xl font-black text-emerald-600">
                  {Math.round((finalScore / TOTAL_ROUNDS) * 100)}%
                </span>
              </div>
            </div>

            <button
              onClick={() => startNewGame(mode)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> पुनः खेलें (Play Again)
            </button>
          </div>
        ) : (
          /* Active Gameplay Screen */
          <>
            {/* Audio Prompt */}
            <button
              onClick={() => {
                if (mode === 'classify') {
                  playSpeech(`${currentItem.hindiName} फल है या सब्जी? Is ${currentItem.name} a fruit or a vegetable?`);
                } else {
                  playSpeech(`${currentItem.hindiName} का प्राकृतिक स्वाद कैसा होता है? How does ${currentItem.name} taste?`);
                }
              }}
              className="flex items-center gap-2 bg-emerald-100/70 hover:bg-emerald-200 text-emerald-950 font-bold px-4 py-2 rounded-full text-xs md:text-sm mb-6 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" /> प्रश्न सुनें (Audio Prompt)
            </button>

            {/* Target Item Showcase */}
            <div className="flex flex-col items-center bg-gradient-to-b from-emerald-50 to-teal-50/40 border-2 border-emerald-200 px-10 py-6 rounded-3xl mb-6 shadow-sm">
              <span className="text-6xl md:text-7xl filter drop-shadow-md mb-2">{currentItem.emoji}</span>
              <h3 className="text-xl md:text-2xl font-black text-emerald-950">
                {currentItem.hindiName} ({currentItem.name})
              </h3>
              <p className="text-xs font-bold text-emerald-700 mt-1">
                {mode === 'classify'
                  ? 'यह क्या है? (Is it a fruit or vegetable?)'
                  : 'इसका प्राकृतिक स्वाद क्या है? (What is the taste?)'}
              </p>
            </div>

            {/* Explanation Card on Error */}
            {showExplanation && (
              <div className="w-full max-w-md bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 mb-6 flex flex-col items-center animate-in fade-in zoom-in duration-150">
                <span className="text-xs font-black text-emerald-950 mb-3 text-center">
                  💡 समझिए: {currentItem.hindiName} ({currentItem.name})
                </span>
                
                <div className="flex items-center justify-center gap-4 mb-4 bg-white px-5 py-3 rounded-2xl border border-emerald-200 shadow-sm">
                  <span className="text-4xl">{currentItem.emoji}</span>
                  <span className="text-xl font-black text-emerald-800">➔</span>
                  {mode === 'classify' ? (
                    <div className="text-left">
                      <span className="block text-sm font-black text-emerald-950">
                        {currentItem.type === 'fruit' ? '🍎 फल (Fruit)' : '🥕 सब्जी (Vegetable)'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-left">
                      <span className="block text-sm font-black text-emerald-950">{currentItem.hindiTaste}</span>
                      <span className="block text-xs font-bold text-emerald-700">प्राकृतिक स्वाद (Natural Taste)</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>आगे बढ़ें (Next Question)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Classify Mode Choices */}
            {!showExplanation && mode === 'classify' && (
              <div className="w-full max-w-md grid grid-cols-2 gap-4">
                <button
                  disabled={isBusy}
                  onClick={() => handleChoice('fruit')}
                  className={`py-5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                    selectedChoice === 'fruit' && isCorrect === true
                      ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-emerald-200'
                      : selectedChoice === 'fruit' && isCorrect === false
                      ? 'bg-rose-100 border-rose-400 text-rose-900'
                      : 'bg-emerald-50/50 hover:bg-emerald-100 border-emerald-200 text-slate-800 hover:border-emerald-400 hover:scale-102 active:scale-95'
                  }`}
                >
                  <span className="text-4xl mb-2">🍎</span>
                  <span className="text-base font-black">फल (Fruit)</span>
                  {selectedChoice === 'fruit' && isCorrect === true && (
                    <CheckCircle2 className="w-5 h-5 text-white absolute top-2 right-2" />
                  )}
                </button>

                <button
                  disabled={isBusy}
                  onClick={() => handleChoice('vegetable')}
                  className={`py-5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                    selectedChoice === 'vegetable' && isCorrect === true
                      ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-emerald-200'
                      : selectedChoice === 'vegetable' && isCorrect === false
                      ? 'bg-rose-100 border-rose-400 text-rose-900'
                      : 'bg-emerald-50/50 hover:bg-emerald-100 border-emerald-200 text-slate-800 hover:border-emerald-400 hover:scale-102 active:scale-95'
                  }`}
                >
                  <span className="text-4xl mb-2">🥕</span>
                  <span className="text-base font-black">सब्जी (Vegetable)</span>
                  {selectedChoice === 'vegetable' && isCorrect === true && (
                    <CheckCircle2 className="w-5 h-5 text-white absolute top-2 right-2" />
                  )}
                </button>
              </div>
            )}

            {/* Distinct Taste Mode Choices */}
            {!showExplanation && mode === 'taste' && (
              <div className="w-full max-w-md grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: 'sweet', label: 'मीठा', eng: 'Sweet', icon: '🍯' },
                  { key: 'sour', label: 'खट्टा', eng: 'Sour', icon: '🍋' },
                  { key: 'bitter', label: 'कड़वा', eng: 'Bitter', icon: '🥒' },
                  { key: 'pungent', label: 'तीखा', eng: 'Pungent', icon: '🌶️' }
                ].map((t) => {
                  const isSelected = selectedChoice === t.key;
                  const isRight = isSelected && isCorrect === true;
                  const isWrong = isSelected && isCorrect === false;

                  return (
                    <button
                      key={t.key}
                      disabled={isBusy}
                      onClick={() => handleChoice(t.key)}
                      className={`relative py-4 px-2 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                        isRight
                          ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-emerald-200'
                          : isWrong
                          ? 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-emerald-50/50 hover:bg-emerald-100 border-emerald-200 text-slate-800 hover:border-emerald-400 hover:scale-102 active:scale-95'
                      }`}
                    >
                      <span className="text-3xl mb-1">{t.icon}</span>
                      <span className={`text-xs font-black ${isRight ? 'text-white' : 'text-emerald-950'}`}>
                        {t.label}
                      </span>
                      <span className={`text-[10px] font-bold ${isRight ? 'text-emerald-100' : 'text-emerald-700'}`}>
                        {t.eng}
                      </span>
                      {isRight && <CheckCircle2 className="w-4 h-4 text-white absolute top-1.5 right-1.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}