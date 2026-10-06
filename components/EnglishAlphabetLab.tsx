'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, RotateCcw, Trophy, CheckCircle2, XCircle, 
  Play, ArrowRight, ArrowLeft, Pencil, Key, BookOpen, Home
} from 'lucide-react';

type LabSection = 'phonic_game' | 'tracing' | 'cvc';

const LAB_STRINGS = {
  hi: {
    bannerTitle: "नन्हे वैज्ञानिक प्रीस्कूल लैब (Preschool Lab)",
    bannerSub: "ध्वनि पहचान (ब → b) • ✏️ पेंसिल ट्रेसिंग • 📖 सचित्र CVC शब्दकोश",
    tabPhonic: "🔊 फोनिक साउंड गेम (10 राउंड)",
    tabTracing: "✏️ अक्षर ट्रेसिंग (A–Z)",
    tabCvc: "📖 सचित्र CVC शब्दकोश",
    introTitle: "फोनिक साउंड गेम (10 प्रश्न)",
    introDesc: "केवल अक्षर की ध्वनि (जैसे 'ब') सुनाई देगी। ध्वनि को पहचानकर कीबोर्ड या स्क्रीन पर उसका छोटा अक्षर (b) दबाएं!",
    startBtn: "10-प्रश्नों का खेल शुरू करें ➔",
    soundPromptLabel: "इस ध्वनि का अंग्रेजी अक्षर दबाएं:",
    soundHint: "(ध्वनि सुनें और कीबोर्ड पर सही छोटा अक्षर चुनें)",
    keyboardTitle: "⌨️ QWERTY कीबोर्ड (टच करें या कीबोर्ड दबाएं)",
    questionCount: "सवाल",
    scoreLabel: "स्कोर",
    completedTitle: "खेल पूरा हुआ!",
    reportTitle: "फोनिक ध्वनि पहचान रिपोर्ट कार्ड (10 प्रश्न)",
    accuracyLabel: "सटीकता",
    totalScoreLabel: "कुल स्कोर",
    reviewTitle: "जिन ध्वनियों का पुनः अभ्यास करना है:",
    playAgainBtn: "नया 10-प्रश्नों का गेम खेलें",
    tracingHint: "हरे बिंदु से शुरू करके डॉटेड लाइन पर चलाएं",
    tracingSuccess: "शानदार! आपने अक्षर बिल्कुल सही ट्रेस किया 🏆",
    tracingFail: "थोड़ा भटक गए। 'मिटाएं' दबाकर पुनः प्रयास करें 🔄",
    clearBtn: "मिटाएं",
    resetBtn: "रीसेट",
    nextPatternBtn: "अगला अक्षर"
  },
  en: {
    bannerTitle: "Little Researcher Preschool Lab",
    bannerSub: "Phonics Sounds (ब → b) • ✏️ Letter Tracing (A–Z) • 📖 Illustrated CVC Words",
    tabPhonic: "🔊 Phonics Sound Game (10 Rounds)",
    tabTracing: "✏️ Alphabet Tracing (A–Z)",
    tabCvc: "📖 Illustrated CVC Dictionary",
    introTitle: "Phonics Sound Challenge (10 Questions)",
    introDesc: "You will hear the pure phonics sound (like 'ब'). Listen carefully and press the matching lowercase English letter (b) on the keyboard!",
    startBtn: "Start 10-Question Challenge ➔",
    soundPromptLabel: "Press the English letter for this sound:",
    soundHint: "(Listen to the phonics sound and press the matching lowercase letter)",
    keyboardTitle: "⌨️ QWERTY Keyboard (Tap or press keys)",
    questionCount: "Question",
    scoreLabel: "Score",
    completedTitle: "Challenge Complete!",
    reportTitle: "Phonics Sound Identification Report (10 Questions)",
    accuracyLabel: "Accuracy",
    totalScoreLabel: "Total Score",
    reviewTitle: "Sounds to practice again:",
    playAgainBtn: "Play 10-Question Game Again",
    tracingHint: "Start from the green dot and follow the dashed line",
    tracingSuccess: "Fantastic! You traced the letter accurately 🏆",
    tracingFail: "Slightly off track. Click 'Clear' and try once more 🔄",
    clearBtn: "Clear",
    resetBtn: "Reset",
    nextPatternBtn: "Next Letter"
  }
};

interface PhonicQuestion {
  char: string;
  lower: string;
  hindiSound: string;
  spokenSound: string;
  exampleWord: string;
}

const PHONIC_BANK: PhonicQuestion[] = [
  { char: 'A', lower: 'a', hindiSound: 'ऐ', spokenSound: 'ऐ', exampleWord: 'Apple' },
  { char: 'B', lower: 'b', hindiSound: 'ब', spokenSound: 'ब', exampleWord: 'Bat' },
  { char: 'C', lower: 'c', hindiSound: 'क', spokenSound: 'क', exampleWord: 'Cat' },
  { char: 'D', lower: 'd', hindiSound: 'ड', spokenSound: 'ड', exampleWord: 'Dog' },
  { char: 'E', lower: 'e', hindiSound: 'ए', spokenSound: 'ए', exampleWord: 'Elephant' },
  { char: 'F', lower: 'f', hindiSound: 'फ़', spokenSound: 'फ़', exampleWord: 'Fish' },
  { char: 'G', lower: 'g', hindiSound: 'ग', spokenSound: 'ग', exampleWord: 'Grapes' },
  { char: 'H', lower: 'h', hindiSound: 'ह', spokenSound: 'ह', exampleWord: 'Hat' },
  { char: 'I', lower: 'i', hindiSound: 'इ', spokenSound: 'इ', exampleWord: 'Igloo' },
  { char: 'J', lower: 'j', hindiSound: 'ज', spokenSound: 'ज', exampleWord: 'Jug' },
  { char: 'K', lower: 'k', hindiSound: 'क', spokenSound: 'क', exampleWord: 'Kite' },
  { char: 'L', lower: 'l', hindiSound: 'ल', spokenSound: 'ल', exampleWord: 'Lion' },
  { char: 'M', lower: 'm', hindiSound: 'म', spokenSound: 'म', exampleWord: 'Mango' },
  { char: 'N', lower: 'n', hindiSound: 'न', spokenSound: 'न', exampleWord: 'Nest' },
  { char: 'O', lower: 'o', hindiSound: 'ओ', spokenSound: 'ओ', exampleWord: 'Orange' },
  { char: 'P', lower: 'p', hindiSound: 'प', spokenSound: 'प', exampleWord: 'Pen' },
  { char: 'Q', lower: 'q', hindiSound: 'क्व', spokenSound: 'क्व', exampleWord: 'Queen' },
  { char: 'R', lower: 'r', hindiSound: 'र', spokenSound: 'र', exampleWord: 'Ring' },
  { char: 'S', lower: 's', hindiSound: 'स', spokenSound: 'स', exampleWord: 'Sun' },
  { char: 'T', lower: 't', hindiSound: 'ट', spokenSound: 'ट', exampleWord: 'Tree' },
  { char: 'U', lower: 'u', hindiSound: 'अ', spokenSound: 'अ', exampleWord: 'Umbrella' },
  { char: 'V', lower: 'v', hindiSound: 'व', spokenSound: 'व', exampleWord: 'Van' },
  { char: 'W', lower: 'w', hindiSound: 'वॉ', spokenSound: 'वॉ', exampleWord: 'Watch' },
  { char: 'X', lower: 'x', hindiSound: 'क्स', spokenSound: 'क्स', exampleWord: 'Xylophone' },
  { char: 'Y', lower: 'y', hindiSound: 'य', spokenSound: 'य', exampleWord: 'Yak' },
  { char: 'Z', lower: 'z', hindiSound: 'ज़', spokenSound: 'ज़', exampleWord: 'Zebra' },
];

const QWERTY_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export interface CvcWordItem {
  id: string;
  word: string;
  vowel: 'A' | 'E' | 'I' | 'O' | 'U';
  hindiMeaning: string;
  phonics: string;
  phonicSoundsHindi: string; // e.g. "क ... ऐ ... ट"
  article: 'a' | 'an';
  emoji: string;
  badgeBg: string;
}

const CVC_DICTIONARY: CvcWordItem[] = [
  // --- VOWEL A ---
  { id: 'cat', word: 'cat', vowel: 'A', hindiMeaning: 'बिल्ली', phonics: 'c - a - t', phonicSoundsHindi: 'क ... ऐ ... ट', article: 'a', emoji: '🐱', badgeBg: 'from-amber-100 to-orange-100 border-amber-300' },
  { id: 'bat', word: 'bat', vowel: 'A', hindiMeaning: 'बल्ला', phonics: 'b - a - t', phonicSoundsHindi: 'ब ... ऐ ... ट', article: 'a', emoji: '🏏', badgeBg: 'from-blue-100 to-cyan-100 border-blue-300' },
  { id: 'hat', word: 'hat', vowel: 'A', hindiMeaning: 'टोपी', phonics: 'h - a - t', phonicSoundsHindi: 'ह ... ऐ ... ट', article: 'a', emoji: '👒', badgeBg: 'from-emerald-100 to-teal-100 border-emerald-300' },
  { id: 'mat', word: 'mat', vowel: 'A', hindiMeaning: 'चटाई', phonics: 'm - a - t', phonicSoundsHindi: 'म ... ऐ ... ट', article: 'a', emoji: '🧘', badgeBg: 'from-purple-100 to-pink-100 border-purple-300' },
  { id: 'fan', word: 'fan', vowel: 'A', hindiMeaning: 'पंखा', phonics: 'f - a - n', phonicSoundsHindi: 'फ़ ... ऐ ... न', article: 'a', emoji: '🪭', badgeBg: 'from-sky-100 to-blue-100 border-sky-300' },
  { id: 'pan', word: 'pan', vowel: 'A', hindiMeaning: 'कड़ाही / पैन', phonics: 'p - a - n', phonicSoundsHindi: 'प ... ऐ ... न', article: 'a', emoji: '🍳', badgeBg: 'from-yellow-100 to-amber-100 border-yellow-300' },
  { id: 'van', word: 'van', vowel: 'A', hindiMeaning: 'वैन गाड़ी', phonics: 'v - a - n', phonicSoundsHindi: 'व ... ऐ ... न', article: 'a', emoji: '🚐', badgeBg: 'from-indigo-100 to-blue-100 border-indigo-300' },
  { id: 'cap', word: 'cap', vowel: 'A', hindiMeaning: 'कैप', phonics: 'c - a - p', phonicSoundsHindi: 'क ... ऐ ... प', article: 'a', emoji: '🧢', badgeBg: 'from-cyan-100 to-teal-100 border-cyan-300' },
  { id: 'map', word: 'map', vowel: 'A', hindiMeaning: 'नक्शा', phonics: 'm - a - p', phonicSoundsHindi: 'म ... ऐ ... प', article: 'a', emoji: '🗺️', badgeBg: 'from-emerald-100 to-green-100 border-emerald-300' },
  { id: 'bag', word: 'bag', vowel: 'A', hindiMeaning: 'बस्ता', phonics: 'b - a - g', phonicSoundsHindi: 'ब ... ऐ ... ग', article: 'a', emoji: '🎒', badgeBg: 'from-rose-100 to-pink-100 border-rose-300' },

  // --- VOWEL E ---
  { id: 'bed', word: 'bed', vowel: 'E', hindiMeaning: 'बिस्तर', phonics: 'b - e - d', phonicSoundsHindi: 'ब ... ए ... ड', article: 'a', emoji: '🛏️', badgeBg: 'from-indigo-100 to-blue-100 border-indigo-300' },
  { id: 'red', word: 'red', vowel: 'E', hindiMeaning: 'लाल रंग', phonics: 'r - e - d', phonicSoundsHindi: 'र ... ए ... ड', article: 'a', emoji: '🔴', badgeBg: 'from-red-100 to-rose-100 border-red-300' },
  { id: 'pen', word: 'pen', vowel: 'E', hindiMeaning: 'कलम', phonics: 'p - e - n', phonicSoundsHindi: 'प ... ए ... न', article: 'a', emoji: '🖊️', badgeBg: 'from-blue-100 to-cyan-100 border-blue-300' },
  { id: 'hen', word: 'hen', vowel: 'E', hindiMeaning: 'मुर्गी', phonics: 'h - e - n', phonicSoundsHindi: 'ह ... ए ... न', article: 'a', emoji: '🐔', badgeBg: 'from-amber-100 to-yellow-100 border-amber-300' },
  { id: 'net', word: 'net', vowel: 'E', hindiMeaning: 'जाल', phonics: 'n - e - t', phonicSoundsHindi: 'न ... ए ... ट', article: 'a', emoji: '🥅', badgeBg: 'from-teal-100 to-emerald-100 border-teal-300' },
  { id: 'jet', word: 'jet', vowel: 'E', hindiMeaning: 'जेट विमान', phonics: 'j - e - t', phonicSoundsHindi: 'ज ... ए ... ट', article: 'a', emoji: '✈️', badgeBg: 'from-sky-100 to-indigo-100 border-sky-300' },
  { id: 'leg', word: 'leg', vowel: 'E', hindiMeaning: 'टांग / पैर', phonics: 'l - e - g', phonicSoundsHindi: 'ल ... ए ... ग', article: 'a', emoji: '🦵', badgeBg: 'from-orange-100 to-amber-100 border-orange-300' },
  { id: 'web', word: 'web', vowel: 'E', hindiMeaning: 'मकड़ी का जाला', phonics: 'w - e - b', phonicSoundsHindi: 'व ... ए ... ब', article: 'a', emoji: '🕸️', badgeBg: 'from-slate-100 to-zinc-100 border-slate-300' },

  // --- VOWEL I ---
  { id: 'bin', word: 'bin', vowel: 'I', hindiMeaning: 'कूड़ेदान', phonics: 'b - i - n', phonicSoundsHindi: 'ब ... इ ... न', article: 'a', emoji: '🗑️', badgeBg: 'from-blue-100 to-indigo-100 border-blue-300' },
  { id: 'pin', word: 'pin', vowel: 'I', hindiMeaning: 'पिन', phonics: 'p - i - n', phonicSoundsHindi: 'प ... इ ... न', article: 'a', emoji: '📍', badgeBg: 'from-rose-100 to-red-100 border-rose-300' },
  { id: 'tin', word: 'tin', vowel: 'I', hindiMeaning: 'टिन का डिब्बा', phonics: 't - i - n', phonicSoundsHindi: 'ट ... इ ... न', article: 'a', emoji: '🥫', badgeBg: 'from-amber-100 to-orange-100 border-amber-300' },
  { id: 'lip', word: 'lip', vowel: 'I', hindiMeaning: 'होंठ', phonics: 'l - i - p', phonicSoundsHindi: 'ल ... इ ... प', article: 'a', emoji: '👄', badgeBg: 'from-pink-100 to-rose-100 border-pink-300' },
  { id: 'zip', word: 'zip', vowel: 'I', hindiMeaning: 'चेन / ज़िप', phonics: 'z - i - p', phonicSoundsHindi: 'ज़ ... इ ... प', article: 'a', emoji: '🤐', badgeBg: 'from-yellow-100 to-amber-100 border-yellow-300' },
  { id: 'pig', word: 'pig', vowel: 'I', hindiMeaning: 'सुअर', phonics: 'p - i - g', phonicSoundsHindi: 'प ... इ ... ग', article: 'a', emoji: '🐷', badgeBg: 'from-pink-100 to-purple-100 border-pink-300' },
  { id: 'wig', word: 'wig', vowel: 'I', hindiMeaning: 'नकली बाल', phonics: 'w - i - g', phonicSoundsHindi: 'व ... इ ... ग', article: 'a', emoji: '💇', badgeBg: 'from-purple-100 to-indigo-100 border-purple-300' },
  { id: 'lid', word: 'lid', vowel: 'I', hindiMeaning: 'ढक्कन', phonics: 'l - i - d', phonicSoundsHindi: 'ल ... इ ... ड', article: 'a', emoji: '🫙', badgeBg: 'from-teal-100 to-cyan-100 border-teal-300' },
  { id: 'six', word: 'six', vowel: 'I', hindiMeaning: 'छह (६)', phonics: 's - i - x', phonicSoundsHindi: 'स ... इ ... क्स', article: 'a', emoji: '6️⃣', badgeBg: 'from-blue-100 to-sky-100 border-blue-300' },

  // --- VOWEL O ---
  { id: 'dog', word: 'dog', vowel: 'O', hindiMeaning: 'कुत्ता', phonics: 'd - o - g', phonicSoundsHindi: 'ड ... ओ ... ग', article: 'a', emoji: '🐶', badgeBg: 'from-amber-100 to-yellow-100 border-amber-300' },
  { id: 'log', word: 'log', vowel: 'O', hindiMeaning: 'लकड़ी का लट्ठा', phonics: 'l - o - g', phonicSoundsHindi: 'ल ... ओ ... ग', article: 'a', emoji: '🪵', badgeBg: 'from-amber-100 to-stone-100 border-amber-300' },
  { id: 'pot', word: 'pot', vowel: 'O', hindiMeaning: 'गमला / बर्तन', phonics: 'p - o - t', phonicSoundsHindi: 'प ... ओ ... ट', article: 'a', emoji: '🪴', badgeBg: 'from-emerald-100 to-green-100 border-emerald-300' },
  { id: 'cot', word: 'cot', vowel: 'O', hindiMeaning: 'खटिया / पालना', phonics: 'c - o - t', phonicSoundsHindi: 'क ... ओ ... ट', article: 'a', emoji: '🛏️', badgeBg: 'from-indigo-100 to-blue-100 border-indigo-300' },
  { id: 'box', word: 'box', vowel: 'O', hindiMeaning: 'डिब्बा', phonics: 'b - o - x', phonicSoundsHindi: 'ब ... ओ ... क्स', article: 'a', emoji: '📦', badgeBg: 'from-yellow-100 to-amber-100 border-yellow-300' },
  { id: 'fox', word: 'fox', vowel: 'O', hindiMeaning: 'लोमड़ी', phonics: 'f - o - x', phonicSoundsHindi: 'फ़ ... ओ ... क्स', article: 'a', emoji: '🦊', badgeBg: 'from-orange-100 to-red-100 border-orange-300' },
  { id: 'top', word: 'top', vowel: 'O', hindiMeaning: 'लट्टू', phonics: 't - o - p', phonicSoundsHindi: 'ट ... ओ ... प', article: 'a', emoji: '🪀', badgeBg: 'from-purple-100 to-pink-100 border-purple-300' },
  { id: 'mop', word: 'mop', vowel: 'O', hindiMeaning: 'पोछा', phonics: 'm - o - p', phonicSoundsHindi: 'म ... ओ ... प', article: 'a', emoji: '🧹', badgeBg: 'from-cyan-100 to-blue-100 border-cyan-300' },
  { id: 'toy', word: 'toy', vowel: 'O', hindiMeaning: 'खिलौना', phonics: 't - o - y', phonicSoundsHindi: 'ट ... ओ ... य', article: 'a', emoji: '🧸', badgeBg: 'from-rose-100 to-amber-100 border-rose-300' },

  // --- VOWEL U ---
  { id: 'sun', word: 'sun', vowel: 'U', hindiMeaning: 'सूरज', phonics: 's - u - n', phonicSoundsHindi: 'स ... अ ... न', article: 'a', emoji: '☀️', badgeBg: 'from-yellow-100 to-amber-100 border-yellow-300' },
  { id: 'bun', word: 'bun', vowel: 'U', hindiMeaning: 'बन रोटी', phonics: 'b - u - n', phonicSoundsHindi: 'ब ... अ ... न', article: 'a', emoji: '🍔', badgeBg: 'from-amber-100 to-orange-100 border-amber-300' },
  { id: 'cup', word: 'cup', vowel: 'U', hindiMeaning: 'प्याला / कप', phonics: 'c - u - p', phonicSoundsHindi: 'क ... अ ... प', article: 'a', emoji: '☕', badgeBg: 'from-orange-100 to-yellow-100 border-orange-300' },
  { id: 'pup', word: 'pup', vowel: 'U', hindiMeaning: 'कुत्ते का पिल्ला', phonics: 'p - u - p', phonicSoundsHindi: 'प ... अ ... प', article: 'a', emoji: '🐶', badgeBg: 'from-yellow-100 to-amber-100 border-yellow-300' },
  { id: 'tub', word: 'tub', vowel: 'U', hindiMeaning: 'टब', phonics: 't - u - b', phonicSoundsHindi: 'ट ... अ ... ब', article: 'a', emoji: '🛁', badgeBg: 'from-sky-100 to-cyan-100 border-sky-300' },
  { id: 'bus', word: 'bus', vowel: 'U', hindiMeaning: 'बस', phonics: 'b - u - s', phonicSoundsHindi: 'ब ... अ ... स', article: 'a', emoji: '🚌', badgeBg: 'from-amber-100 to-yellow-100 border-amber-300' },
  { id: 'hut', word: 'hut', vowel: 'U', hindiMeaning: 'झोपड़ी', phonics: 'h - u - t', phonicSoundsHindi: 'ह ... अ ... ट', article: 'a', emoji: '🛖', badgeBg: 'from-stone-100 to-amber-100 border-stone-300' },
  { id: 'nut', word: 'nut', vowel: 'U', hindiMeaning: 'अखरोट / मूंगफली', phonics: 'n - u - t', phonicSoundsHindi: 'न ... अ ... ट', article: 'a', emoji: '🥜', badgeBg: 'from-amber-100 to-orange-100 border-amber-300' },
  { id: 'bug', word: 'bug', vowel: 'U', hindiMeaning: 'कीड़ा (लेडीबग)', phonics: 'b - u - g', phonicSoundsHindi: 'ब ... अ ... ग', article: 'a', emoji: '🐞', badgeBg: 'from-rose-100 to-red-100 border-rose-300' },
  { id: 'jug', word: 'jug', vowel: 'U', hindiMeaning: 'जग', phonics: 'j - u - g', phonicSoundsHindi: 'ज ... अ ... ग', article: 'a', emoji: '🫖', badgeBg: 'from-teal-100 to-cyan-100 border-teal-300' },
  { id: 'mug', word: 'mug', vowel: 'U', hindiMeaning: 'मग / प्याला', phonics: 'm - u - g', phonicSoundsHindi: 'म ... अ ... ग', article: 'a', emoji: '☕', badgeBg: 'from-blue-100 to-indigo-100 border-blue-300' }
];

const VOWEL_OPTIONS: Array<'A' | 'E' | 'I' | 'O' | 'U'> = ['A', 'E', 'I', 'O', 'U'];

// --- COMPREHENSIVE 26-ALPHABET + 2-LINE TRACING DEFINITIONS ---
interface PatternDefinition {
  id: string;
  name: string;
  hindiName: string;
  segments: Array<Array<[number, number]>>;
}

const ALL_26_PATTERNS: PatternDefinition[] = [
  { id: 'letter-a', name: 'Letter A', hindiName: 'अक्षर A', segments: [[[0.5, 0.15], [0.2, 0.85]], [[0.5, 0.15], [0.8, 0.85]], [[0.32, 0.55], [0.68, 0.55]]] },
  { id: 'letter-b', name: 'Letter B', hindiName: 'अक्षर B', segments: [[[0.25, 0.15], [0.25, 0.85]], [[0.25, 0.15], [0.55, 0.15], [0.68, 0.25], [0.68, 0.4], [0.55, 0.5], [0.25, 0.5]], [[0.25, 0.5], [0.6, 0.5], [0.72, 0.62], [0.72, 0.75], [0.6, 0.85], [0.25, 0.85]]] },
  { id: 'letter-c', name: 'Letter C', hindiName: 'अक्षर C', segments: [[[0.75, 0.25], [0.5, 0.15], [0.25, 0.35], [0.25, 0.65], [0.5, 0.85], [0.75, 0.75]]] },
  { id: 'letter-d', name: 'Letter D', hindiName: 'अक्षर D', segments: [[[0.25, 0.15], [0.25, 0.85]], [[0.25, 0.15], [0.55, 0.15], [0.75, 0.35], [0.75, 0.65], [0.55, 0.85], [0.25, 0.85]]] },
  { id: 'letter-e', name: 'Letter E', hindiName: 'अक्षर E', segments: [[[0.25, 0.15], [0.25, 0.85]], [[0.25, 0.15], [0.75, 0.15]], [[0.25, 0.5], [0.65, 0.5]], [[0.25, 0.85], [0.75, 0.85]]] },
  { id: 'letter-f', name: 'Letter F', hindiName: 'अक्षर F', segments: [[[0.25, 0.15], [0.25, 0.85]], [[0.25, 0.15], [0.75, 0.15]], [[0.25, 0.5], [0.65, 0.5]]] },
  { id: 'letter-g', name: 'Letter G', hindiName: 'अक्षर G', segments: [[[0.75, 0.25], [0.5, 0.15], [0.25, 0.35], [0.25, 0.65], [0.5, 0.85], [0.75, 0.85], [0.75, 0.5], [0.55, 0.5]]] },
  { id: 'letter-h', name: 'Letter H', hindiName: 'अक्षर H', segments: [[[0.25, 0.15], [0.25, 0.85]], [[0.75, 0.15], [0.75, 0.85]], [[0.25, 0.5], [0.75, 0.5]]] },
  { id: 'letter-i', name: 'Letter I', hindiName: 'अक्षर I', segments: [[[0.5, 0.15], [0.5, 0.85]], [[0.3, 0.15], [0.7, 0.15]], [[0.3, 0.85], [0.7, 0.85]]] },
  { id: 'letter-j', name: 'Letter J', hindiName: 'अक्षर J', segments: [[[0.3, 0.15], [0.7, 0.15]], [[0.55, 0.15], [0.55, 0.7], [0.45, 0.85], [0.3, 0.8]]] },
  { id: 'letter-k', name: 'Letter K', hindiName: 'अक्षर K', segments: [[[0.25, 0.15], [0.25, 0.85]], [[0.75, 0.15], [0.25, 0.5], [0.75, 0.85]]] },
  { id: 'letter-l', name: 'Letter L', hindiName: 'अक्षर L', segments: [[[0.25, 0.15], [0.25, 0.85], [0.75, 0.85]]] },
  { id: 'letter-m', name: 'Letter M', hindiName: 'अक्षर M', segments: [[[0.2, 0.85], [0.2, 0.15], [0.5, 0.55], [0.8, 0.15], [0.8, 0.85]]] },
  { id: 'letter-n', name: 'Letter N', hindiName: 'अक्षर N', segments: [[[0.25, 0.85], [0.25, 0.15], [0.75, 0.85], [0.75, 0.15]]] },
  { id: 'letter-o', name: 'Letter O', hindiName: 'अक्षर O', segments: [Array.from({ length: 33 }, (_, i) => { const theta = (i / 32) * Math.PI * 2; return [0.5 + 0.3 * Math.cos(theta), 0.5 + 0.35 * Math.sin(theta)] as [number, number]; })] },
  { id: 'letter-p', name: 'Letter P', hindiName: 'अक्षर P', segments: [[[0.25, 0.15], [0.25, 0.85]], [[0.25, 0.15], [0.55, 0.15], [0.7, 0.28], [0.7, 0.42], [0.55, 0.55], [0.25, 0.55]]] },
  { id: 'letter-q', name: 'Letter Q', hindiName: 'अक्षर Q', segments: [Array.from({ length: 33 }, (_, i) => { const theta = (i / 32) * Math.PI * 2; return [0.5 + 0.3 * Math.cos(theta), 0.48 + 0.33 * Math.sin(theta)] as [number, number]; }), [[0.55, 0.65], [0.75, 0.85]]] },
  { id: 'letter-r', name: 'Letter R', hindiName: 'अक्षर R', segments: [[[0.25, 0.15], [0.25, 0.85]], [[0.25, 0.15], [0.55, 0.15], [0.7, 0.28], [0.7, 0.42], [0.55, 0.55], [0.25, 0.55]], [[0.45, 0.55], [0.75, 0.85]]] },
  { id: 'letter-s', name: 'Letter S', hindiName: 'अक्षर S', segments: [[[0.75, 0.25], [0.5, 0.15], [0.3, 0.28], [0.4, 0.45], [0.65, 0.55], [0.7, 0.72], [0.5, 0.85], [0.25, 0.75]]] },
  { id: 'letter-t', name: 'Letter T', hindiName: 'अक्षर T', segments: [[[0.2, 0.15], [0.8, 0.15]], [[0.5, 0.15], [0.5, 0.85]]] },
  { id: 'letter-u', name: 'Letter U', hindiName: 'अक्षर U', segments: [[[0.25, 0.15], [0.25, 0.65], [0.4, 0.85], [0.6, 0.85], [0.75, 0.65], [0.75, 0.15]]] },
  { id: 'letter-v', name: 'Letter V', hindiName: 'अक्षर V', segments: [[[0.2, 0.15], [0.5, 0.85], [0.8, 0.15]]] },
  { id: 'letter-w', name: 'Letter W', hindiName: 'अक्षर W', segments: [[[0.15, 0.15], [0.3, 0.85], [0.5, 0.4], [0.7, 0.85], [0.85, 0.15]]] },
  { id: 'letter-x', name: 'Letter X', hindiName: 'अक्षर X', segments: [[[0.2, 0.15], [0.8, 0.85]], [[0.8, 0.15], [0.2, 0.85]]] },
  { id: 'letter-y', name: 'Letter Y', hindiName: 'अक्षर Y', segments: [[[0.2, 0.15], [0.5, 0.5]], [[0.8, 0.15], [0.5, 0.5]], [[0.5, 0.5], [0.5, 0.85]]] },
  { id: 'letter-z', name: 'Letter Z', hindiName: 'अक्षर Z', segments: [[[0.2, 0.15], [0.8, 0.15], [0.2, 0.85], [0.8, 0.85]]] },
  { id: 'line-standing', name: 'Standing Line', hindiName: 'सीधी खड़ी रेखा (|)', segments: [[[0.5, 0.15], [0.5, 0.85]]] },
  { id: 'line-sleeping', name: 'Sleeping Line', hindiName: 'सीधी लेटी रेखा (—)', segments: [[[0.15, 0.5], [0.85, 0.5]]] }
];

export default function EnglishAlphabetLab() {
  const [currentLang, setCurrentLang] = useState<'hi' | 'en'>('hi');
  const [section, setSection] = useState<LabSection>('phonic_game');

  // --- PHONIC SOUND GAME STATE ---
  const [gameQuestions, setGameQuestions] = useState<PhonicQuestion[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isPhonicPlaying, setIsPhonicPlaying] = useState<boolean>(false);
  const [isPhonicFinished, setIsPhonicFinished] = useState<boolean>(false);
  const [phonicFeedback, setPhonicFeedback] = useState<{ type: 'correct' | 'wrong'; text: string } | null>(null);
  const [wrongPressKey, setWrongPressKey] = useState<string | null>(null);
  const [pressedAnimationKey, setPressedAnimationKey] = useState<string | null>(null);
  const [missedPhonics, setMissedPhonics] = useState<Array<{ sound: string; char: string; word: string }>>([]);

  // --- TRACING STATE ---
  const [patternIndex, setPatternIndex] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [traceResult, setTraceResult] = useState<'success' | 'fail' | null>(null);
  const [traceScore, setTraceScore] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const userDrawnPointsRef = useRef<Array<{ x: number; y: number }>>([]);

  // --- CVC DICTIONARY & PLAY STATE ---
  const [cvcSubTab, setCvcSubTab] = useState<'menu' | 'learn' | 'play'>('menu');
  const [selectedVowel, setSelectedVowel] = useState<'A' | 'E' | 'I' | 'O' | 'U'>('A');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [cvcQuizList, setCvcQuizList] = useState<Array<{ target: CvcWordItem; options: string[] }>>([]);
  const [cvcQuizIndex, setCvcQuizIndex] = useState<number>(0);
  const [cvcQuizScore, setCvcQuizScore] = useState<number>(0);
  const [isCvcQuizFinished, setIsCvcQuizFinished] = useState<boolean>(false);
  const [cvcFeedback, setCvcFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [missedCvcWords, setMissedCvcWords] = useState<CvcWordItem[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isAudioLockedRef = useRef<boolean>(false);

  const t = LAB_STRINGS[currentLang];

  // IMMEDIATE SOUND CANCELLATION HELPER
  const truncateAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isAudioLockedRef.current = false;
  };

  const playSoundEffect = (type: 'correct' | 'wrong' | 'victory') => {
    if (typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      if (type === 'correct') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.24, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.32);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.32);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      } else {
        [261.63, 329.63, 392.00, 523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.25, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + 1.2);
        });
      }
    } catch (e) {}
  };

  const speakVoice = (text: string, lang = 'hi-IN', rate = 0.82): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }
      try {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        window.speechSynthesis.cancel(); // Clears previous queue before playing

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = 1.05;

        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang === lang || (lang === 'en-IN' && v.lang.startsWith('en')));
        if (preferred) utterance.voice = preferred;

        let finished = false;
        const done = () => {
          if (!finished) {
            finished = true;
            resolve();
          }
        };

        utterance.onend = done;
        utterance.onerror = done;
        setTimeout(done, Math.max(1200, text.length * 120));

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        resolve();
      }
    });
  };

  // PHONICS BLENDING SPEAKER: First sounds out phonetic pieces, then says the whole word
  const speakCvcPhonicsBlend = async (item: CvcWordItem) => {
    truncateAudio();
    // 1. Speak acoustic sounds: "क ... ऐ ... ट"
    await speakVoice(item.phonicSoundsHindi, 'hi-IN', 0.8);
    await new Promise(r => setTimeout(r, 250));
    // 2. Speak whole blended word in English
    await speakVoice(`${item.word}!`, 'en-IN', 0.88);
  };

  // --- 1. PHONIC SOUND GAME HANDLERS ---
  const calloutCurrentPhonic = async (item: PhonicQuestion) => {
    if (!item || !isMountedRef.current) return;
    setWrongPressKey(null);
    truncateAudio();
    await speakVoice(`${item.spokenSound} ... ${item.spokenSound}`, 'hi-IN', 0.8);
  };

  const startPhonicGame = () => {
    truncateAudio();
    const shuffled = [...PHONIC_BANK].sort(() => 0.5 - Math.random()).slice(0, 10);
    setGameQuestions(shuffled);
    setCurrentRoundIndex(0);
    setScore(0);
    setMissedPhonics([]);
    setPhonicFeedback(null);
    setWrongPressKey(null);
    setIsPhonicFinished(false);
    setIsPhonicPlaying(true);
    isAudioLockedRef.current = false;

    setTimeout(() => {
      calloutCurrentPhonic(shuffled[0]);
    }, 200);
  };

  const currentPhonicItem = gameQuestions[currentRoundIndex];

  const handlePhonicKeyAnswer = async (pressedChar: string) => {
    if (!isPhonicPlaying || isPhonicFinished || isAudioLockedRef.current || !currentPhonicItem) return;
    isAudioLockedRef.current = true;

    const normalized = pressedChar.toLowerCase();
    const isCorrect = normalized === currentPhonicItem.lower;

    setPressedAnimationKey(normalized);
    setTimeout(() => setPressedAnimationKey(null), 180);

    if (isCorrect) {
      playSoundEffect('correct');
      setScore(prev => prev + 1);
      setPhonicFeedback({
        type: 'correct',
        text: currentLang === 'hi' 
          ? `शाबाश! '${currentPhonicItem.hindiSound}' ध्वनि है अक्षर '${currentPhonicItem.lower}' की!`
          : `Correct! Sound '${currentPhonicItem.hindiSound}' is for letter '${currentPhonicItem.lower}'!`
      });

      if (currentLang === 'hi') {
        await speakVoice(`शाबाश! ${currentPhonicItem.spokenSound} ... ${currentPhonicItem.lower}`, 'hi-IN', 0.86);
      } else {
        await speakVoice(`Correct! ${currentPhonicItem.spokenSound} is letter ${currentPhonicItem.lower}`, 'hi-IN', 0.86);
      }
      await new Promise(r => setTimeout(r, 350));
    } else {
      playSoundEffect('wrong');
      setWrongPressKey(normalized);
      setMissedPhonics(prev => [...prev, { sound: currentPhonicItem.hindiSound, char: currentPhonicItem.lower, word: currentPhonicItem.exampleWord }]);
      setPhonicFeedback({
        type: 'wrong',
        text: currentLang === 'hi'
          ? `गलत! '${currentPhonicItem.hindiSound}' ध्वनि के लिए '${currentPhonicItem.lower}' दबाएं`
          : `Oops! For '${currentPhonicItem.hindiSound}', press '${currentPhonicItem.lower}'`
      });

      await speakVoice(`नहीं! यह ध्वनि है ${currentPhonicItem.spokenSound}`, 'hi-IN', 0.85);
      await new Promise(r => setTimeout(r, 350));
    }

    if (!isMountedRef.current) return;

    if (currentRoundIndex + 1 >= 10) {
      setIsPhonicPlaying(false);
      setIsPhonicFinished(true);
      playSoundEffect('victory');

      const finalScore = score + (isCorrect ? 1 : 0);
      if (currentLang === 'hi') {
        await speakVoice(`वाह! खेल पूरा हुआ। आपने 10 में से ${finalScore} सही किए।`, 'hi-IN', 0.86);
      } else {
        await speakVoice(`Well done! You scored ${finalScore} out of 10!`, 'en-IN', 0.88);
      }
      isAudioLockedRef.current = false;
    } else {
      const nextIdx = currentRoundIndex + 1;
      setCurrentRoundIndex(nextIdx);
      setPhonicFeedback(null);
      isAudioLockedRef.current = false;
      calloutCurrentPhonic(gameQuestions[nextIdx]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || section !== 'phonic_game' || !isPhonicPlaying || isPhonicFinished) return;
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key)) {
        e.preventDefault();
        e.stopPropagation();
        handlePhonicKeyAnswer(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isPhonicPlaying, isPhonicFinished, currentRoundIndex, gameQuestions, section, score, currentLang]);

  // --- 2. CVC WORDS HANDLERS ---
  const filteredCvcWords = CVC_DICTIONARY.filter(w => w.vowel === selectedVowel);
  const currentCvcWord = filteredCvcWords[carouselIndex] || filteredCvcWords[0];

  const startCvcPlayGame = () => {
    truncateAudio();
    const shuffled = [...CVC_DICTIONARY].sort(() => 0.5 - Math.random()).slice(0, 10);
    const questions = shuffled.map((target) => {
      const distractors = CVC_DICTIONARY
        .filter(w => w.word !== target.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map(w => w.word);

      const options = [target.word, ...distractors].sort(() => 0.5 - Math.random());
      return { target, options };
    });

    setCvcQuizList(questions);
    setCvcQuizIndex(0);
    setCvcQuizScore(0);
    setMissedCvcWords([]);
    setCvcFeedback(null);
    setIsCvcQuizFinished(false);
    setCvcSubTab('play');
    isAudioLockedRef.current = false;
  };

  const handleCvcAnswer = async (selectedWord: string) => {
    if (isAudioLockedRef.current || isCvcQuizFinished) return;
    isAudioLockedRef.current = true;
    truncateAudio();

    const currentQ = cvcQuizList[cvcQuizIndex];
    const isCorrect = selectedWord === currentQ.target.word;

    if (isCorrect) {
      playSoundEffect('correct');
      setCvcQuizScore(prev => prev + 1);
      setCvcFeedback({
        isCorrect: true,
        text: `Correct! ${currentQ.target.phonicSoundsHindi} = ${currentQ.target.word}!`
      });

      // Sounds out phonetics then the word
      await speakVoice(currentQ.target.phonicSoundsHindi, 'hi-IN', 0.85);
      await speakVoice(`${currentQ.target.word}!`, 'en-IN', 0.88);
      await new Promise(r => setTimeout(r, 350));
    } else {
      playSoundEffect('wrong');
      setMissedCvcWords(prev => [...prev, currentQ.target]);
      setCvcFeedback({
        isCorrect: false,
        text: `Try again! ${currentQ.target.phonicSoundsHindi} = ${currentQ.target.word}`
      });

      await speakVoice(currentQ.target.phonicSoundsHindi, 'hi-IN', 0.85);
      await speakVoice(`${currentQ.target.word}`, 'en-IN', 0.88);
      await new Promise(r => setTimeout(r, 350));
    }

    if (cvcQuizIndex + 1 >= 10) {
      setIsCvcQuizFinished(true);
      playSoundEffect('victory');
      await speakVoice(`Great job! You scored ${cvcQuizScore + (isCorrect ? 1 : 0)} out of 10!`, 'en-IN', 0.88);
      isAudioLockedRef.current = false;
    } else {
      setCvcQuizIndex(prev => prev + 1);
      setCvcFeedback(null);
      isAudioLockedRef.current = false;
    }
  };

  // --- 3. TRACING LOGIC ---
  const currentPattern = ALL_26_PATTERNS[patternIndex];

  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 14;
    ctx.setLineDash([4, 18]);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    currentPattern.segments.forEach((seg) => {
      if (seg.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(seg[0][0] * w, seg[0][1] * h);
      for (let i = 1; i < seg.length; i++) {
        ctx.lineTo(seg[i][0] * w, seg[i][1] * h);
      }
      ctx.stroke();
    });

    currentPattern.segments.forEach((seg) => {
      const startPt = seg[0];
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.fillStyle = '#22c55e';
      ctx.arc(startPt[0] * w, startPt[1] * h, 9, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }, [currentPattern]);

  useEffect(() => {
    if (section === 'tracing') {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.parentElement?.clientWidth || 500;
        canvas.height = 340;
        drawGuide();
      }
      setTraceResult(null);
      userDrawnPointsRef.current = [];
    }
  }, [section, patternIndex, drawGuide]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    userDrawnPointsRef.current.push({ x, y });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const drawMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    userDrawnPointsRef.current.push({ x, y });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const verifyTracingMatch = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    const userPts = userDrawnPointsRef.current;
    if (userPts.length < 5) return;

    const checkpoints: Array<{ x: number; y: number }> = [];
    currentPattern.segments.forEach((seg) => {
      for (let i = 0; i < seg.length - 1; i++) {
        const p1 = seg[i];
        const p2 = seg[i + 1];
        const steps = 10;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          checkpoints.push({
            x: (p1[0] + (p2[0] - p1[0]) * t) * w,
            y: (p1[1] + (p2[1] - p1[1]) * t) * h
          });
        }
      }
    });

    const tolerance = 44;
    let hitCount = 0;
    checkpoints.forEach((cp) => {
      const isHit = userPts.some((up) => Math.hypot(up.x - cp.x, up.y - cp.y) <= tolerance);
      if (isHit) hitCount++;
    });

    const matchRatio = hitCount / checkpoints.length;

    if (matchRatio >= 0.58) {
      playSoundEffect('correct');
      setTraceResult('success');
      setTraceScore((prev) => prev + 1);
    } else {
      playSoundEffect('wrong');
      setTraceResult('fail');
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      truncateAudio();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 select-none font-sans">
      
      {/* Universal Preschool Lab Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 md:p-5 rounded-3xl shadow-lg mb-5 flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-2xl">🧸</span>
            <h1 className="text-lg md:text-xl font-black">{t.bannerTitle}</h1>
          </div>
          <p className="text-[11px] md:text-xs text-indigo-100 font-semibold">
            {t.bannerSub}
          </p>
        </div>

        {/* Controls: Language Toggle & Sections */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* BILINGUAL LANGUAGE SWITCHER */}
          <div className="flex bg-white/20 p-1 rounded-2xl backdrop-blur-md gap-1">
            <button
              onClick={() => {
                truncateAudio();
                setCurrentLang('hi');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                currentLang === 'hi' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => {
                truncateAudio();
                setCurrentLang('en');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                currentLang === 'en' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              English
            </button>
          </div>

          {/* 3 Main Functional Sections */}
          <div className="flex bg-white/20 p-1 rounded-2xl backdrop-blur-md gap-1 flex-wrap">
            <button
              onClick={() => {
                truncateAudio();
                setSection('phonic_game');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                section === 'phonic_game' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              <Key className="w-3.5 h-3.5" /> {t.tabPhonic}
            </button>
            <button
              onClick={() => {
                truncateAudio();
                setSection('tracing');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                section === 'tracing' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" /> {t.tabTracing}
            </button>
            <button
              onClick={() => {
                truncateAudio();
                setSection('cvc');
                setCvcSubTab('menu');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                section === 'cvc' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> {t.tabCvc}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: 10-QUESTION PHONIC GAME                             */}
      {/* ============================================================== */}
      {section === 'phonic_game' && (
        <>
          {!isPhonicPlaying && !isPhonicFinished && (
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-3xl flex items-center justify-center text-3xl mb-3 shadow-inner">
                🎯
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">
                {t.introTitle}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mb-6 leading-relaxed">
                {t.introDesc}
              </p>
              <button
                onClick={startPhonicGame}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" /> {t.startBtn}
              </button>
            </div>
          )}

          {isPhonicPlaying && currentPhonicItem && (
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-4 md:p-5 shadow-xl flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
                <span className="text-xs font-black text-indigo-950 bg-indigo-100 px-3 py-1 rounded-full">
                  {t.questionCount}: {currentRoundIndex + 1} / 10
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {t.scoreLabel}: {score} / 10
                </span>
              </div>

              {/* Central Phonics Card: Visual Devanagari Akshar & Repeat Button */}
              <div className="w-full max-w-md bg-gradient-to-b from-indigo-50/70 to-purple-50/70 border-2 border-indigo-300 rounded-3xl p-5 text-center shadow-inner mb-4 flex flex-col items-center">
                <button
                  onClick={() => calloutCurrentPhonic(currentPhonicItem)}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition cursor-pointer shadow-md mb-2 flex items-center gap-2"
                  title="ध्वनि दोबारा सुनें"
                >
                  <Volume2 className="w-6 h-6 animate-pulse" />
                </button>

                <span className="text-xs font-bold text-indigo-900 block">
                  {t.soundPromptLabel}
                </span>

                {/* Big Clean Devanagari Sound */}
                <div className="text-6xl md:text-7xl font-black text-indigo-950 my-1 font-mono tracking-wider">
                  {currentPhonicItem.hindiSound}
                </div>

                <span className="text-[11px] text-slate-500 font-semibold mt-1">
                  {t.soundHint}
                </span>
              </div>

              {phonicFeedback && (
                <div className={`w-full max-w-xl p-3 rounded-2xl border-2 text-center text-xs md:text-sm font-black mb-4 flex items-center justify-center gap-2 ${
                  phonicFeedback.type === 'correct' ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-rose-50 border-rose-400 text-rose-950'
                }`}>
                  {phonicFeedback.type === 'correct' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  <span>{phonicFeedback.text}</span>
                </div>
              )}

              {/* Lowercase QWERTY Keyboard */}
              <div className="w-full max-w-2xl bg-slate-100 border-2 border-slate-300 rounded-3xl p-3 shadow-inner">
                <div className="text-center mb-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    {t.keyboardTitle}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 items-center">
                  {QWERTY_ROWS.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex gap-1.5 justify-center w-full">
                      {row.map((letter) => {
                        const isWrongJustPressed = letter === wrongPressKey;
                        const isCurrentlyPressed = letter === pressedAnimationKey;

                        return (
                          <button
                            key={letter}
                            onClick={() => handlePhonicKeyAnswer(letter)}
                            className={`
                              h-11 md:h-13 w-8 sm:w-11 md:w-13 rounded-xl font-black text-base md:text-lg transition-transform shadow-sm cursor-pointer flex flex-col items-center justify-center font-mono
                              ${isCurrentlyPressed ? 'scale-90 ring-4 ring-indigo-300' : 'active:scale-95'}
                              ${isWrongJustPressed 
                                ? 'bg-rose-500 text-white border-2 border-rose-700 animate-shake' 
                                : 'bg-white hover:bg-indigo-600 hover:text-white border-2 border-slate-200 text-slate-800'
                              }
                            `}
                          >
                            <span>{letter}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isPhonicFinished && (
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 text-center shadow-xl flex flex-col items-center animate-in zoom-in-95">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-3">
                🏆
              </div>

              <h2 className="text-2xl font-black text-indigo-950 mb-1">{t.completedTitle}</h2>
              <p className="text-xs text-slate-600 font-semibold mb-5">
                {t.reportTitle}
              </p>

              <div className="w-full max-w-sm bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 mb-5 flex justify-around items-center">
                <div>
                  <span className="text-xs font-bold text-slate-500 block">{t.totalScoreLabel}</span>
                  <span className="text-3xl font-black text-emerald-600">{score} / 10</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">{t.accuracyLabel}</span>
                  <span className="text-3xl font-black text-indigo-950">{Math.round((score / 10) * 100)}%</span>
                </div>
              </div>

              {missedPhonics.length > 0 && (
                <div className="w-full max-w-md text-left mb-6 bg-rose-50 border border-rose-200 p-3 rounded-2xl">
                  <h4 className="text-xs font-black text-rose-900 mb-2">{t.reviewTitle}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {missedPhonics.map((item, idx) => (
                      <span key={idx} className="bg-white border border-rose-300 px-2.5 py-1 rounded-lg text-xs font-black text-rose-800 shadow-sm">
                        {item.sound} → {item.char} ({item.word})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={startPhonicGame}
                className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> {t.playAgainBtn}
              </button>
            </div>
          )}
        </>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: DOTTED ALPHABET & PATTERN TRACING (ALL 26 LETTERS)  */}
      {/* ============================================================== */}
      {section === 'tracing' && (
        <div className="bg-white border-2 border-teal-200 rounded-3xl p-4 md:p-5 shadow-xl flex flex-col items-center">
          {/* Scrollable Letters Tray (A through Z) */}
          <div className="flex gap-1.5 overflow-x-auto w-full no-scrollbar pb-2 mb-3">
            {ALL_26_PATTERNS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  truncateAudio();
                  setPatternIndex(idx);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                  patternIndex === idx ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="w-full flex justify-between items-center mb-3 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-2xl">
            <span className="text-xs font-black text-teal-950">
              {currentLang === 'hi' ? currentPattern.hindiName : currentPattern.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {currentLang === 'hi' ? `सफल: ${traceScore}` : `Solved: ${traceScore}`}
              </span>
              <button
                onClick={() => {
                  truncateAudio();
                  userDrawnPointsRef.current = [];
                  setTraceResult(null);
                  drawGuide();
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> {t.clearBtn}
              </button>
            </div>
          </div>

          <div className="w-full bg-slate-50 border-4 border-dashed border-teal-300 rounded-3xl overflow-hidden shadow-inner relative flex justify-center items-center touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={drawMove}
              onMouseUp={verifyTracingMatch}
              onMouseLeave={() => isDrawing && verifyTracingMatch()}
              onTouchStart={startDrawing}
              onTouchMove={drawMove}
              onTouchEnd={verifyTracingMatch}
              className="cursor-crosshair w-full block"
            />
            <div className="absolute top-2 left-3 pointer-events-none bg-white/90 border border-teal-300 px-2.5 py-0.5 rounded-full text-[10px] font-black text-teal-800 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t.tracingHint}</span>
            </div>
          </div>

          {traceResult === 'success' && (
            <div className="w-full max-w-md mt-3 p-2.5 bg-emerald-50 border-2 border-emerald-400 text-emerald-950 rounded-2xl text-center font-black text-xs flex items-center justify-center gap-1.5 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.tracingSuccess}</span>
            </div>
          )}

          {traceResult === 'fail' && (
            <div className="w-full max-w-md mt-3 p-2.5 bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-2xl text-center font-black text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{t.tracingFail}</span>
            </div>
          )}

          <div className="w-full flex justify-between items-center mt-3 pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                truncateAudio();
                userDrawnPointsRef.current = [];
                setTraceResult(null);
                drawGuide();
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> {t.resetBtn}
            </button>
            <button
              onClick={() => {
                truncateAudio();
                if (patternIndex + 1 < ALL_26_PATTERNS.length) setPatternIndex(prev => prev + 1);
                else setPatternIndex(0);
              }}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1"
            >
              {t.nextPatternBtn} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: CVC WORDS (PHONIC SOUND BLENDING: क ... ऐ ... ट = CAT) */}
      {/* ============================================================== */}
      {section === 'cvc' && (
        <div className="space-y-4">
          
          {cvcSubTab === 'menu' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border-2 border-teal-200 rounded-3xl p-6 text-center shadow-lg flex flex-col justify-between items-center">
                <div>
                  <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner mx-auto">
                    📚
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">
                    {currentLang === 'hi' ? 'शब्द सीखो (Learn CVC)' : 'Learn CVC Words'}
                  </h3>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    {currentLang === 'hi' 
                      ? 'स्वर चुनें: A, E, I, O, U। हर शब्द की ध्वनियाँ (जैसे: क ... ऐ ... ट = cat) फोनिक्स ध्वनि से अलग-अलग सीखें!' 
                      : 'Choose a vowel: A, E, I, O, U. Listen to each individual phonetic sound blend together to form 3-letter words!'}
                  </p>
                </div>

                <div className="w-full">
                  <span className="text-[11px] font-bold text-slate-500 mb-2 block">
                    {currentLang === 'hi' ? 'स्वर चुनें (Select Vowel):' : 'Select Vowel:'}
                  </span>
                  <div className="flex justify-center gap-1.5 mb-4">
                    {VOWEL_OPTIONS.map(v => (
                      <button
                        key={v}
                        onClick={() => {
                          truncateAudio();
                          setSelectedVowel(v);
                          setCarouselIndex(0);
                          setCvcSubTab('learn');
                        }}
                        className="w-10 h-10 bg-teal-50 hover:bg-teal-600 hover:text-white border-2 border-teal-300 rounded-xl font-black text-base text-teal-950 shadow-sm transition active:scale-95 cursor-pointer flex items-center justify-center"
                      >
                        {v}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      truncateAudio();
                      setSelectedVowel('A');
                      setCarouselIndex(0);
                      setCvcSubTab('learn');
                    }}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" /> {currentLang === 'hi' ? 'सचित्र शब्दकोश खोलें ➔' : 'Open Illustrated Dictionary ➔'}
                  </button>
                </div>
              </div>

              <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 text-center shadow-lg flex flex-col justify-between items-center">
                <div>
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner mx-auto">
                    🎮
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">
                    {currentLang === 'hi' ? 'क्विज़ खेलो (Play Quiz)' : 'Play 10-Picture Challenge'}
                  </h3>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    {currentLang === 'hi'
                      ? '10 सचित्र सवाल आएंगे। चित्र और फोनिक्स ध्वनि से सही शब्द पहचानें!'
                      : '10 unique illustrated questions. Listen to the phonics sound blend and pick the matching word!'}
                  </p>
                </div>

                <div className="w-full">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4 text-left text-xs font-semibold text-indigo-900 space-y-1">
                    <div>🏆 {currentLang === 'hi' ? 'फोनिक्स जोड़: क ... ऐ ... ट = cat!' : 'Phonics Blend: c - a - t = cat!'}</div>
                    <div>🔔 {currentLang === 'hi' ? 'गलत उत्तर पर सही फोनिक्स ब्लेंड का ऑडियो अभ्यास' : 'Immediate audio reinforcement on attempt'}</div>
                  </div>

                  <button
                    onClick={startCvcPlayGame}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-white" /> {currentLang === 'hi' ? '10-प्रश्नों का गेम शुरू करें ➔' : 'Start 10-Question Game ➔'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sub-View: Learn Mode Carousel */}
          {cvcSubTab === 'learn' && currentCvcWord && (
            <div className="bg-white border-2 border-teal-200 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-4 flex-wrap gap-2">
                <button
                  onClick={() => {
                    truncateAudio();
                    setCvcSubTab('menu');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> {currentLang === 'hi' ? 'मुख्य मेन्यू (Menu)' : 'Main Menu'}
                </button>

                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {VOWEL_OPTIONS.map(v => (
                    <button
                      key={v}
                      onClick={() => {
                        truncateAudio();
                        setSelectedVowel(v);
                        setCarouselIndex(0);
                      }}
                      className={`px-2.5 py-1 rounded-lg font-black text-xs transition cursor-pointer ${
                        selectedVowel === v ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-black text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                  {currentLang === 'hi' ? `शब्द: ${carouselIndex + 1} / ${filteredCvcWords.length}` : `Word: ${carouselIndex + 1} / ${filteredCvcWords.length}`}
                </span>
              </div>

              {/* High-Contrast Flashcard with Phonic Blend Speaker */}
              <div className="w-full max-w-md bg-stone-50 border-2 border-teal-300 rounded-3xl p-4 text-center shadow-inner flex flex-col items-center mb-5">
                
                <div className={`w-full h-56 md:h-64 rounded-2xl mb-3 border-2 shadow-sm bg-gradient-to-br ${currentCvcWord.badgeBg} flex flex-col items-center justify-center relative overflow-hidden`}>
                  <span className="text-8xl md:text-9xl drop-shadow-md select-none transform transition-transform hover:scale-110 duration-200">
                    {currentCvcWord.emoji}
                  </span>
                  <span className="mt-2 text-xs font-black uppercase tracking-wider text-slate-700/80 bg-white/70 px-3 py-0.5 rounded-full backdrop-blur-sm border border-slate-300/40">
                    {currentCvcWord.article} {currentCvcWord.word}
                  </span>
                </div>

                {/* Big word + Speaker Button for Phonics Sound Out */}
                <div className="flex items-center justify-center gap-3 my-1">
                  <span className="text-5xl md:text-6xl font-black text-teal-950 font-mono tracking-wider">
                    {currentCvcWord.word}
                  </span>
                  <button
                    onClick={() => speakCvcPhonicsBlend(currentCvcWord)}
                    className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition cursor-pointer shadow-md"
                    title="फोनिक्स ब्लेंड सुनें"
                  >
                    <Volume2 className="w-6 h-6 animate-pulse" />
                  </button>
                </div>

                {/* Phonics Acoustic Breakup & Meaning */}
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <span className="text-xs font-extrabold text-teal-900 bg-teal-100 px-3 py-1 rounded-full border border-teal-300">
                    ध्वनि: <strong>{currentCvcWord.phonicSoundsHindi}</strong>
                  </span>
                  <span className="text-xs font-extrabold text-slate-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                    अर्थ: {currentCvcWord.hindiMeaning}
                  </span>
                </div>
              </div>

              <div className="w-full max-w-md flex justify-between items-center gap-3">
                <button
                  onClick={() => {
                    truncateAudio();
                    setCarouselIndex(prev => (prev > 0 ? prev - 1 : filteredCvcWords.length - 1));
                  }}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> {currentLang === 'hi' ? 'पिछला शब्द' : 'Previous'}
                </button>

                <button
                  onClick={() => speakCvcPhonicsBlend(currentCvcWord)}
                  className="py-2.5 px-4 bg-teal-100 hover:bg-teal-200 text-teal-900 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> {currentLang === 'hi' ? 'फोनिक्स बोलें' : 'Sound Out'}
                </button>

                <button
                  onClick={() => {
                    truncateAudio();
                    setCarouselIndex(prev => (prev < filteredCvcWords.length - 1 ? prev + 1 : 0));
                  }}
                  className="flex-1 py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1"
                >
                  {currentLang === 'hi' ? 'अगला शब्द' : 'Next'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Sub-View: Play Quiz Mode */}
          {cvcSubTab === 'play' && cvcQuizList.length > 0 && !isCvcQuizFinished && (
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-4 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-2xl">
                <button
                  onClick={() => {
                    truncateAudio();
                    setCvcSubTab('menu');
                  }}
                  className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> {currentLang === 'hi' ? 'मेन्यू' : 'Menu'}
                </button>
                <span className="text-xs font-black text-indigo-950 bg-white border border-indigo-200 px-3 py-1 rounded-full shadow-sm">
                  {currentLang === 'hi' ? `प्रश्न: ${cvcQuizIndex + 1} / 10` : `Question: ${cvcQuizIndex + 1} / 10`}
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {currentLang === 'hi' ? `स्कोर: ${cvcQuizScore} / 10` : `Score: ${cvcQuizScore} / 10`}
                </span>
              </div>

              {/* Challenge Visual Card */}
              <div className="w-full max-w-md bg-stone-50 border-2 border-indigo-200 rounded-3xl p-4 text-center shadow-inner flex flex-col items-center mb-4">
                
                <div className={`w-full h-56 md:h-64 rounded-2xl mb-3 border-2 shadow-sm bg-gradient-to-br ${cvcQuizList[cvcQuizIndex].target.badgeBg} flex flex-col items-center justify-center relative overflow-hidden`}>
                  <span className="text-8xl md:text-9xl drop-shadow-md select-none animate-pulse">
                    {cvcQuizList[cvcQuizIndex].target.emoji}
                  </span>
                </div>

                <span className="text-xs font-black text-indigo-900 block mb-0.5">
                  {currentLang === 'hi' ? 'चित्र देखकर सही 3-अक्षर शब्द (CVC) चुनें:' : 'Identify the image and select the correct 3-letter CVC word:'}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  ({currentLang === 'hi' ? 'ध्वनि' : 'Phonics'}: <strong>{cvcQuizList[cvcQuizIndex].target.phonicSoundsHindi}</strong>)
                </span>
              </div>

              {cvcFeedback && (
                <div className={`w-full max-w-md p-2.5 rounded-2xl border-2 text-center text-xs md:text-sm font-black mb-4 flex items-center justify-center gap-2 animate-in fade-in ${
                  cvcFeedback.isCorrect ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-rose-50 border-rose-400 text-rose-950'
                }`}>
                  {cvcFeedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span>{cvcFeedback.text}</span>
                </div>
              )}

              <div className="w-full max-w-md grid grid-cols-3 gap-3">
                {cvcQuizList[cvcQuizIndex].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleCvcAnswer(opt)}
                    className="py-3.5 bg-white hover:bg-indigo-600 hover:text-white border-2 border-indigo-300 hover:border-indigo-600 rounded-2xl font-mono text-2xl font-black text-slate-800 shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sub-View: Play Quiz Final Scorecard */}
          {cvcSubTab === 'play' && isCvcQuizFinished && (
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 text-center shadow-xl flex flex-col items-center animate-in zoom-in-95">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-3">
                🏆
              </div>

              <h2 className="text-2xl font-black text-indigo-950 mb-1">
                {currentLang === 'hi' ? 'खेल पूरा हुआ! (Quiz Completed)' : 'Quiz Completed!'}
              </h2>
              <p className="text-xs text-slate-600 font-semibold mb-5">
                NEP 2020 CVC Foundational Word Mastery
              </p>

              <div className="w-full max-w-sm bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 mb-5 flex justify-around items-center">
                <div>
                  <span className="text-xs font-bold text-slate-500 block">
                    {currentLang === 'hi' ? 'कुल स्कोर' : 'Total Score'}
                  </span>
                  <span className="text-3xl font-black text-emerald-600">{cvcQuizScore} / 10</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">
                    {currentLang === 'hi' ? 'सटीकता' : 'Accuracy'}
                  </span>
                  <span className="text-3xl font-black text-indigo-950">{Math.round((cvcQuizScore / 10) * 100)}%</span>
                </div>
              </div>

              {missedCvcWords.length > 0 && (
                <div className="w-full max-w-md text-left mb-6 bg-rose-50 border border-rose-200 p-4 rounded-2xl">
                  <h4 className="text-xs font-black text-rose-900 mb-2">
                    {currentLang === 'hi' ? 'जिन शब्दों का पुनः अभ्यास करना है:' : 'Words to practice again:'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {missedCvcWords.map((item, idx) => (
                      <span key={idx} className="bg-white border border-rose-300 px-3 py-1 rounded-xl text-xs font-black text-rose-800 shadow-sm flex items-center gap-1.5">
                        <span>{item.emoji}</span>
                        <span>{item.word}</span>
                        <span className="text-[10px] text-slate-500">({item.hindiMeaning})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={startCvcPlayGame}
                  className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> {currentLang === 'hi' ? 'पुनः नया गेम खेलें' : 'Play Again'}
                </button>
                <button
                  onClick={() => {
                    truncateAudio();
                    setCvcSubTab('menu');
                  }}
                  className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Home className="w-4 h-4" /> {currentLang === 'hi' ? 'मुख्य मेन्यू' : 'Main Menu'}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}