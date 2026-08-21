'use client';

import React, { useState } from 'react';
import { unlockAudio } from '../lib/audio';

interface LetterSound {
  letter: string;
  hindiSound: string;
  hindiPhoneme: string;
  exampleEmoji: string;
  exampleWord: string;
}

const LETTER_SOUNDS_26: LetterSound[] = [
  { letter: 'A', hindiSound: 'ऐ', hindiPhoneme: 'ऐ', exampleEmoji: '🍎', exampleWord: 'Apple (ऐपल)' },
  { letter: 'B', hindiSound: 'ब', hindiPhoneme: 'ब', exampleEmoji: '⚽', exampleWord: 'Ball (बॉल)' },
  { letter: 'C', hindiSound: 'क', hindiPhoneme: 'क', exampleEmoji: '🐱', exampleWord: 'Cat (कैट)' },
  { letter: 'D', hindiSound: 'ड', hindiPhoneme: 'ड', exampleEmoji: '🐶', exampleWord: 'Dog (डॉग)' },
  { letter: 'E', hindiSound: 'ए', hindiPhoneme: 'ए', exampleEmoji: '🥚', exampleWord: 'Egg (एग)' },
  { letter: 'F', hindiSound: 'फ़', hindiPhoneme: 'फ़', exampleEmoji: '🐟', exampleWord: 'Fish (फिश)' },
  { letter: 'G', hindiSound: 'ग', hindiPhoneme: 'ग', exampleEmoji: '🍇', exampleWord: 'Grapes (ग्रेप्स)' },
  { letter: 'H', hindiSound: 'ह', hindiPhoneme: 'ह', exampleEmoji: '🏠', exampleWord: 'House (हाउस)' },
  { letter: 'I', hindiSound: 'इ', hindiPhoneme: 'इ', exampleEmoji: '🦎', exampleWord: 'Iguana (इगुआना)' },
  { letter: 'J', hindiSound: 'ज', hindiPhoneme: 'ज', exampleEmoji: '🧃', exampleWord: 'Juice (जूस)' },
  { letter: 'K', hindiSound: 'क', hindiPhoneme: 'क', exampleEmoji: '🪁', exampleWord: 'Kite (काइट)' },
  { letter: 'L', hindiSound: 'ल', hindiPhoneme: 'ल', exampleEmoji: '🦁', exampleWord: 'Lion (लायन)' },
  { letter: 'M', hindiSound: 'म', hindiPhoneme: 'म', exampleEmoji: '🥭', exampleWord: 'Mango (मैंगो)' },
  { letter: 'N', hindiSound: 'न', hindiPhoneme: 'न', exampleEmoji: '🪺', exampleWord: 'Nest (नेस्ट)' },
  { letter: 'O', hindiSound: 'ऑ', hindiPhoneme: 'ऑ', exampleEmoji: '🍊', exampleWord: 'Orange (ऑरेंज)' },
  { letter: 'P', hindiSound: 'प', hindiPhoneme: 'प', exampleEmoji: '✏️', exampleWord: 'Pencil (पेंसिल)' },
  { letter: 'Q', hindiSound: 'क्व', hindiPhoneme: 'क्व', exampleEmoji: '👑', exampleWord: 'Queen (क्वीन)' },
  { letter: 'R', hindiSound: 'र', hindiPhoneme: 'र', exampleEmoji: '🌹', exampleWord: 'Rose (रोज़)' },
  { letter: 'S', hindiSound: 'स', hindiPhoneme: 'स', exampleEmoji: '☀️', exampleWord: 'Sun (सन)' },
  { letter: 'T', hindiSound: 'ट', hindiPhoneme: 'ट', exampleEmoji: '🌳', exampleWord: 'Tree (ट्री)' },
  { letter: 'U', hindiSound: 'अ', hindiPhoneme: 'अ', exampleEmoji: '☂️', exampleWord: 'Umbrella (अम्ब्रेला)' },
  { letter: 'V', hindiSound: 'व', hindiPhoneme: 'व', exampleEmoji: '🚐', exampleWord: 'Van (वैन)' },
  { letter: 'W', hindiSound: 'व', hindiPhoneme: 'व', exampleEmoji: '⌚', exampleWord: 'Watch (वॉच)' },
  { letter: 'X', hindiSound: 'क्स', hindiPhoneme: 'क्स', exampleEmoji: '📦', exampleWord: 'Box (बॉक्स)' },
  { letter: 'Y', hindiSound: 'य', hindiPhoneme: 'य', exampleEmoji: '🪀', exampleWord: 'Yo-yo (यो-यो)' },
  { letter: 'Z', hindiSound: 'ज़', hindiPhoneme: 'ज़', exampleEmoji: '🦓', exampleWord: 'Zebra (ज़ेब्रा)' },
];

export type VowelCategory = 'ALL' | 'A' | 'E' | 'I' | 'O' | 'U';

interface CVCItem {
  word: string;
  vowelGroup: 'A' | 'E' | 'I' | 'O' | 'U';
  c1: string;
  c1Sound: string;
  v: string;
  vSound: string;
  c2: string;
  c2Sound: string;
  hindiBreakdown: string;
  meaningHindi: string;
  emoji: string;
  family: string;
}

const CVC_DATABASE: CVCItem[] = [
  // Short A (-at, -an, -ap, -ag, -am)
  { word: 'CAT', vowelGroup: 'A', c1: 'C', c1Sound: 'क', v: 'A', vSound: 'ऐ', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'क, ऐ, ट', meaningHindi: 'कैट यानी बिल्ली', emoji: '🐱', family: '-at' },
  { word: 'BAT', vowelGroup: 'A', c1: 'B', c1Sound: 'ब', v: 'A', vSound: 'ऐ', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'ब, ऐ, ट', meaningHindi: 'बैट यानी बल्ला', emoji: '🏏', family: '-at' },
  { word: 'RAT', vowelGroup: 'A', c1: 'R', c1Sound: 'र', v: 'A', vSound: 'ऐ', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'र, ऐ, ट', meaningHindi: 'रैट यानी चूहा', emoji: '🐀', family: '-at' },
  { word: 'MAT', vowelGroup: 'A', c1: 'M', c1Sound: 'म', v: 'A', vSound: 'ऐ', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'म, ऐ, ट', meaningHindi: 'मैट यानी चटाई', emoji: '🧘', family: '-at' },
  { word: 'FAN', vowelGroup: 'A', c1: 'F', c1Sound: 'फ़', v: 'A', vSound: 'ऐ', c2: 'N', c2Sound: 'न', hindiBreakdown: 'फ़, ऐ, न', meaningHindi: 'फैन यानी पंखा', emoji: '🪭', family: '-an' },
  { word: 'VAN', vowelGroup: 'A', c1: 'V', c1Sound: 'व', v: 'A', vSound: 'ऐ', c2: 'N', c2Sound: 'न', hindiBreakdown: 'व, ऐ, न', meaningHindi: 'वैन यानी गाड़ी', emoji: '🚐', family: '-an' },
  { word: 'MAN', vowelGroup: 'A', c1: 'M', c1Sound: 'म', v: 'A', vSound: 'ऐ', c2: 'N', c2Sound: 'न', hindiBreakdown: 'म, ऐ, न', meaningHindi: 'मैन यानी आदमी', emoji: '👨', family: '-an' },
  { word: 'PAN', vowelGroup: 'A', c1: 'P', c1Sound: 'प', v: 'A', vSound: 'ऐ', c2: 'N', c2Sound: 'न', hindiBreakdown: 'प, ऐ, न', meaningHindi: 'पैन यानी कड़ाही', emoji: '🍳', family: '-an' },
  { word: 'CAP', vowelGroup: 'A', c1: 'C', c1Sound: 'क', v: 'A', vSound: 'ऐ', c2: 'P', c2Sound: 'प', hindiBreakdown: 'क, ऐ, प', meaningHindi: 'कैप यानी टोपी', emoji: '🧢', family: '-ap' },
  { word: 'TAP', vowelGroup: 'A', c1: 'T', c1Sound: 'ट', v: 'A', vSound: 'ऐ', c2: 'P', c2Sound: 'प', hindiBreakdown: 'ट, ऐ, प', meaningHindi: 'टैप यानी नल', emoji: '🚰', family: '-ap' },
  { word: 'BAG', vowelGroup: 'A', c1: 'B', c1Sound: 'ब', v: 'A', vSound: 'ऐ', c2: 'G', c2Sound: 'ग', hindiBreakdown: 'ब, ऐ, ग', meaningHindi: 'बैग यानी बस्ता', emoji: '🎒', family: '-ag' },
  { word: 'JAM', vowelGroup: 'A', c1: 'J', c1Sound: 'ज', v: 'A', vSound: 'ऐ', c2: 'M', c2Sound: 'म', hindiBreakdown: 'ज, ऐ, म', meaningHindi: 'जैम यानी मुरब्बा', emoji: '🍓', family: '-am' },

  // Short E (-en, -et, -ed, -eg)
  { word: 'HEN', vowelGroup: 'E', c1: 'H', c1Sound: 'ह', v: 'E', vSound: 'ए', c2: 'N', c2Sound: 'न', hindiBreakdown: 'ह, ए, न', meaningHindi: 'हेन यानी मुर्गी', emoji: '🐔', family: '-en' },
  { word: 'PEN', vowelGroup: 'E', c1: 'P', c1Sound: 'प', v: 'E', vSound: 'ए', c2: 'N', c2Sound: 'न', hindiBreakdown: 'प, ए, न', meaningHindi: 'पेन यानी कलम', emoji: '🖊️', family: '-en' },
  { word: 'TEN', vowelGroup: 'E', c1: 'T', c1Sound: 'ट', v: 'E', vSound: 'ए', c2: 'N', c2Sound: 'न', hindiBreakdown: 'ट, ए, न', meaningHindi: 'टेन यानी दस', emoji: '🔟', family: '-en' },
  { word: 'DEN', vowelGroup: 'E', c1: 'D', c1Sound: 'ड', v: 'E', vSound: 'ए', c2: 'N', c2Sound: 'न', hindiBreakdown: 'ड, ए, न', meaningHindi: 'डेन यानी गुफा', emoji: '🦁', family: '-en' },
  { word: 'BED', vowelGroup: 'E', c1: 'B', c1Sound: 'ब', v: 'E', vSound: 'ए', c2: 'D', c2Sound: 'ड', hindiBreakdown: 'ब, ए, ड', meaningHindi: 'बेड यानी बिस्तर', emoji: '🛏️', family: '-ed' },
  { word: 'RED', vowelGroup: 'E', c1: 'R', c1Sound: 'र', v: 'E', vSound: 'ए', c2: 'D', c2Sound: 'ड', hindiBreakdown: 'र, ए, ड', meaningHindi: 'रेड यानी लाल', emoji: '🔴', family: '-ed' },
  { word: 'NET', vowelGroup: 'E', c1: 'N', c1Sound: 'न', v: 'E', vSound: 'ए', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'न, ए, ट', meaningHindi: 'नेट यानी जाल', emoji: '🕸️', family: '-et' },
  { word: 'JET', vowelGroup: 'E', c1: 'J', c1Sound: 'ज', v: 'E', vSound: 'ए', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'ज, ए, ट', meaningHindi: 'जेट यानी विमान', emoji: '✈️', family: '-et' },
  { word: 'LEG', vowelGroup: 'E', c1: 'L', c1Sound: 'ल', v: 'E', vSound: 'ए', c2: 'G', c2Sound: 'ग', hindiBreakdown: 'ल, ए, ग', meaningHindi: 'लेग यानी टांग', emoji: '🦵', family: '-eg' },

  // Short I (-in, -ip, -ig, -it)
  { word: 'PIN', vowelGroup: 'I', c1: 'P', c1Sound: 'प', v: 'I', vSound: 'इ', c2: 'N', c2Sound: 'न', hindiBreakdown: 'प, इ, न', meaningHindi: 'पिन यानी आलपिन', emoji: '📌', family: '-in' },
  { word: 'BIN', vowelGroup: 'I', c1: 'B', c1Sound: 'ब', v: 'I', vSound: 'इ', c2: 'N', c2Sound: 'न', hindiBreakdown: 'ब, इ, न', meaningHindi: 'बिन यानी कूड़ेदान', emoji: '🗑️', family: '-in' },
  { word: 'WIN', vowelGroup: 'I', c1: 'W', c1Sound: 'व', v: 'I', vSound: 'इ', c2: 'N', c2Sound: 'न', hindiBreakdown: 'व, इ, न', meaningHindi: 'विन यानी जीतना', emoji: '🏆', family: '-in' },
  { word: 'LIP', vowelGroup: 'I', c1: 'L', c1Sound: 'ल', v: 'I', vSound: 'इ', c2: 'P', c2Sound: 'प', hindiBreakdown: 'ल, इ, प', meaningHindi: 'लिप यानी होंठ', emoji: '👄', family: '-ip' },
  { word: 'ZIP', vowelGroup: 'I', c1: 'Z', c1Sound: 'ज़', v: 'I', vSound: 'इ', c2: 'P', c2Sound: 'प', hindiBreakdown: 'ज़, इ, प', meaningHindi: 'ज़िप यानी चेन', emoji: '🤐', family: '-ip' },
  { word: 'PIG', vowelGroup: 'I', c1: 'P', c1Sound: 'प', v: 'I', vSound: 'इ', c2: 'G', c2Sound: 'ग', hindiBreakdown: 'प, इ, ग', meaningHindi: 'पिग यानी सुअर', emoji: '🐷', family: '-ig' },
  { word: 'BIG', vowelGroup: 'I', c1: 'B', c1Sound: 'ब', v: 'I', vSound: 'इ', c2: 'G', c2Sound: 'ग', hindiBreakdown: 'ब, इ, ग', meaningHindi: 'बिग यानी बड़ा', emoji: '🐘', family: '-ig' },
  { word: 'SIT', vowelGroup: 'I', c1: 'S', c1Sound: 'स', v: 'I', vSound: 'इ', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'स, इ, ट', meaningHindi: 'सिट यानी बैठना', emoji: '🪑', family: '-it' },

  // Short O (-ot, -op, -ox, -og)
  { word: 'POT', vowelGroup: 'O', c1: 'P', c1Sound: 'प', v: 'O', vSound: 'ऑ', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'प, ऑ, ट', meaningHindi: 'पॉट यानी मटका', emoji: '🏺', family: '-ot' },
  { word: 'HOT', vowelGroup: 'O', c1: 'H', c1Sound: 'ह', v: 'O', vSound: 'ऑ', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'ह, ऑ, ट', meaningHindi: 'हॉट यानी गरम', emoji: '🔥', family: '-ot' },
  { word: 'COT', vowelGroup: 'O', c1: 'C', c1Sound: 'क', v: 'O', vSound: 'ऑ', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'क, ऑ, ट', meaningHindi: 'कॉट यानी चारपाई', emoji: '🛏️', family: '-ot' },
  { word: 'DOT', vowelGroup: 'O', c1: 'D', c1Sound: 'ड', v: 'O', vSound: 'ऑ', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'ड, ऑ, ट', meaningHindi: 'डॉट यानी बिंदु', emoji: '⚫', family: '-ot' },
  { word: 'TOP', vowelGroup: 'O', c1: 'T', c1Sound: 'ट', v: 'O', vSound: 'ऑ', c2: 'P', c2Sound: 'प', hindiBreakdown: 'ट, ऑ, प', meaningHindi: 'टॉप यानी लट्टू', emoji: '🪀', family: '-op' },
  { word: 'MOP', vowelGroup: 'O', c1: 'M', c1Sound: 'म', v: 'O', vSound: 'ऑ', c2: 'P', c2Sound: 'प', hindiBreakdown: 'म, ऑ, प', meaningHindi: 'मॉप यानी पोछा', emoji: '🧹', family: '-op' },
  { word: 'BOX', vowelGroup: 'O', c1: 'B', c1Sound: 'ब', v: 'O', vSound: 'ऑ', c2: 'X', c2Sound: 'क्स', hindiBreakdown: 'ब, ऑ, क्स', meaningHindi: 'बॉक्स यानी डिब्बा', emoji: '📦', family: '-ox' },
  { word: 'FOX', vowelGroup: 'O', c1: 'F', c1Sound: 'फ़', v: 'O', vSound: 'ऑ', c2: 'X', c2Sound: 'क्स', hindiBreakdown: 'फ़, ऑ, क्स', meaningHindi: 'फॉक्स यानी लोमड़ी', emoji: '🦊', family: '-ox' },
  { word: 'DOG', vowelGroup: 'O', c1: 'D', c1Sound: 'ड', v: 'O', vSound: 'ऑ', c2: 'G', c2Sound: 'ग', hindiBreakdown: 'ड, ऑ, ग', meaningHindi: 'डॉग यानी कुत्ता', emoji: '🐶', family: '-og' },

  // Short U (-ug, -un, -ut, -ub)
  { word: 'MUG', vowelGroup: 'U', c1: 'M', c1Sound: 'म', v: 'U', vSound: 'अ', c2: 'G', c2Sound: 'ग', hindiBreakdown: 'म, अ, ग', meaningHindi: 'मग यानी मग', emoji: '🍺', family: '-ug' },
  { word: 'JUG', vowelGroup: 'U', c1: 'J', c1Sound: 'ज', v: 'U', vSound: 'अ', c2: 'G', c2Sound: 'ग', hindiBreakdown: 'ज, अ, ग', meaningHindi: 'जग यानी सुराही', emoji: '🫗', family: '-ug' },
  { word: 'BUG', vowelGroup: 'U', c1: 'B', c1Sound: 'ब', v: 'U', vSound: 'अ', c2: 'G', c2Sound: 'ग', hindiBreakdown: 'ब, अ, ग', meaningHindi: 'बग यानी कीड़ा', emoji: '🪲', family: '-ug' },
  { word: 'SUN', vowelGroup: 'U', c1: 'S', c1Sound: 'स', v: 'U', vSound: 'अ', c2: 'N', c2Sound: 'न', hindiBreakdown: 'स, अ, न', meaningHindi: 'सन यानी सूरज', emoji: '☀️', family: '-un' },
  { word: 'RUN', vowelGroup: 'U', c1: 'R', c1Sound: 'र', v: 'U', vSound: 'अ', c2: 'N', c2Sound: 'न', hindiBreakdown: 'र, अ, न', meaningHindi: 'रन यानी दौड़ना', emoji: '🏃', family: '-un' },
  { word: 'BUN', vowelGroup: 'U', c1: 'B', c1Sound: 'ब', v: 'U', vSound: 'अ', c2: 'N', c2Sound: 'न', hindiBreakdown: 'ब, अ, न', meaningHindi: 'बन यानी पाव', emoji: '🍞', family: '-un' },
  { word: 'NUT', vowelGroup: 'U', c1: 'N', c1Sound: 'न', v: 'U', vSound: 'अ', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'न, अ, ट', meaningHindi: 'नट यानी अखरोट', emoji: '🥜', family: '-ut' },
  { word: 'HUT', vowelGroup: 'U', c1: 'H', c1Sound: 'ह', v: 'U', vSound: 'अ', c2: 'T', c2Sound: 'ट', hindiBreakdown: 'ह, अ, ट', meaningHindi: 'हट यानी झोपड़ी', emoji: '🛖', family: '-ut' },
  { word: 'TUB', vowelGroup: 'U', c1: 'T', c1Sound: 'ट', v: 'U', vSound: 'अ', c2: 'B', c2Sound: 'ब', hindiBreakdown: 'ट, अ, ब', meaningHindi: 'टब यानी टब', emoji: '🛁', family: '-ub' },
];

// Asynchronous Speech Function that resolves only after finishing utterance
const speakAsync = (text: string, lang: 'hi-IN' | 'en-US', rate: number = 0.85): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.05;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    // Fallback safety timeout if browser fails to trigger onend
    const safetyTimeout = setTimeout(() => resolve(), 3500);

    utterance.addEventListener('end', () => clearTimeout(safetyTimeout));
    window.speechSynthesis.speak(utterance);
  });
};

const delayMs = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function HindiPhonicsStudio() {
  const [activeSubTab, setActiveSubTab] = useState<'cvc' | 'letters'>('cvc');
  const [selectedVowel, setSelectedVowel] = useState<VowelCategory>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blendStep, setBlendStep] = useState<number>(0);
  const [isBlending, setIsBlending] = useState(false);

  const filteredWords = selectedVowel === 'ALL'
    ? CVC_DATABASE
    : CVC_DATABASE.filter((w) => w.vowelGroup === selectedVowel);

  const safeIndex = currentIndex >= filteredWords.length ? 0 : currentIndex;
  const currentCVC = filteredWords[safeIndex] || CVC_DATABASE[0];

  const handleVowelChange = (v: VowelCategory) => {
    window.speechSynthesis.cancel();
    setSelectedVowel(v);
    setCurrentIndex(0);
    setBlendStep(0);
    setIsBlending(false);
  };

  // Level 1: Letter Sound + Hindi Equivalent Playback
  const handlePlayLetterSound = async (item: LetterSound) => {
    unlockAudio();
    // 1. Speak pure Hindi phonetic sound clearly
    await speakAsync(item.hindiPhoneme, 'hi-IN', 0.8);
    await delayMs(400);

    // 2. Speak full letter identity & Hindi example
    await speakAsync(`${item.letter} से ${item.exampleWord}, ध्वनि है ${item.hindiSound}`, 'hi-IN', 0.85);
  };

  // Single Block Click Playback
  const handlePlaySingleBlock = async (soundHindi: string, stepNumber: number) => {
    if (isBlending) return;
    unlockAudio();
    setBlendStep(stepNumber);
    await speakAsync(soundHindi, 'hi-IN', 0.8);
  };

  // Level 2: Controlled Sequential Blending with Generous Deliberate Pauses
  const handleBlendWord = async () => {
    if (isBlending) return;
    setIsBlending(true);
    unlockAudio();

    // 1. Initial Consonant Sound (e.g. 'क')
    setBlendStep(1);
    await speakAsync(currentCVC.c1Sound, 'hi-IN', 0.8);
    await delayMs(750); // Clear gap so sounds never blur

    // 2. Middle Vowel Sound (e.g. 'ऐ')
    setBlendStep(2);
    await speakAsync(currentCVC.vSound, 'hi-IN', 0.8);
    await delayMs(750); // Clear gap

    // 3. Final Consonant Sound (e.g. 'ट')
    setBlendStep(3);
    await speakAsync(currentCVC.c2Sound, 'hi-IN', 0.8);
    await delayMs(900); // Distinct pause before synthesis

    // 4. Combined Whole Word in English
    setBlendStep(4);
    await speakAsync(currentCVC.word, 'en-US', 0.85);
    await delayMs(600);

    // 5. Full Hindi Meaning & Breakdown
    await speakAsync(`${currentCVC.hindiBreakdown}, मिलकर बना ${currentCVC.meaningHindi}`, 'hi-IN', 0.85);

    setIsBlending(false);
  };

  const nextCVCWord = () => {
    window.speechSynthesis.cancel();
    setBlendStep(0);
    setIsBlending(false);
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const prevCVCWord = () => {
    window.speechSynthesis.cancel();
    setBlendStep(0);
    setIsBlending(false);
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
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
            हिंदी के शुद्ध उच्चारण से A, E, I, O, U परिवारों के 3-अक्षर शब्दों (CVC) को अलग-अलग व जोड़कर पढ़ना सीखें
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold gap-1">
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              setActiveSubTab('cvc');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeSubTab === 'cvc' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧩 CVC शब्द जोड़ो (Slider)
          </button>
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              setActiveSubTab('letters');
            }}
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
          
          {/* Vowel Family Selector */}
          <div className="flex flex-wrap items-center justify-between w-full gap-3 pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <label className="text-xs font-black text-slate-700">स्वर परिवार (Vowel Family):</label>
              <select
                value={selectedVowel}
                onChange={(e) => handleVowelChange(e.target.value as VowelCategory)}
                className="bg-indigo-50 border-2 border-indigo-200 text-indigo-900 font-black text-xs py-1.5 px-3 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="ALL">✨ सभी स्वर (All A, E, I, O, U - {CVC_DATABASE.length} Words)</option>
                <option value="A">🔴 Short A (-at, -an, -ap, -ag, -am)</option>
                <option value="E">🟢 Short E (-en, -et, -ed, -eg)</option>
                <option value="I">🔵 Short I (-in, -ip, -ig, -it)</option>
                <option value="O">🟠 Short O (-ot, -op, -ox, -og)</option>
                <option value="U">🟣 Short U (-ug, -un, -ut, -ub)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                ध्वनि परिवार: {currentCVC.family}
              </span>
              <span className="text-xs font-bold text-slate-400">
                शब्द {safeIndex + 1} / {filteredWords.length}
              </span>
            </div>
          </div>

          {/* Picture Box */}
          <div className="w-36 h-36 bg-indigo-50/60 border-4 border-indigo-200 rounded-3xl flex flex-col items-center justify-center shadow-inner mb-6">
            <span className="text-7xl filter drop-shadow-md">{currentCVC.emoji}</span>
          </div>

          {/* Interactive Sound Blocks with Hindi Sound Tags */}
          <div className="flex items-center justify-center gap-2.5 md:gap-4 mb-6">
            {/* Consonant 1 */}
            <button
              onClick={() => handlePlaySingleBlock(currentCVC.c1Sound, 1)}
              className={`w-20 h-24 md:w-24 md:h-28 rounded-2xl border-4 flex flex-col items-center justify-center font-black transition-all duration-300 shadow-sm active:scale-95 ${
                blendStep === 1 || blendStep === 4
                  ? 'bg-indigo-600 border-indigo-700 text-white scale-105 shadow-md'
                  : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-indigo-400'
              }`}
            >
              <span className="text-3xl md:text-4xl">{currentCVC.c1}</span>
              <span className={`text-sm font-black mt-0.5 ${blendStep === 1 || blendStep === 4 ? 'text-amber-200' : 'text-amber-600'}`}>
                {currentCVC.c1Sound}
              </span>
              <span className="text-[10px] opacity-70">पहला अक्षर</span>
            </button>

            <span className="text-2xl font-black text-slate-400">+</span>

            {/* Vowel */}
            <button
              onClick={() => handlePlaySingleBlock(currentCVC.vSound, 2)}
              className={`w-20 h-24 md:w-24 md:h-28 rounded-2xl border-4 flex flex-col items-center justify-center font-black transition-all duration-300 shadow-sm active:scale-95 ${
                blendStep === 2 || blendStep === 4
                  ? 'bg-rose-500 border-rose-600 text-white scale-105 shadow-md'
                  : 'bg-rose-50 border-rose-200 text-rose-800 hover:border-rose-400'
              }`}
            >
              <span className="text-3xl md:text-4xl">{currentCVC.v}</span>
              <span className={`text-sm font-black mt-0.5 ${blendStep === 2 || blendStep === 4 ? 'text-yellow-100' : 'text-rose-600'}`}>
                {currentCVC.vSound}
              </span>
              <span className="text-[10px] opacity-70">स्वर (Vowel)</span>
            </button>

            <span className="text-2xl font-black text-slate-400">+</span>

            {/* Consonant 2 */}
            <button
              onClick={() => handlePlaySingleBlock(currentCVC.c2Sound, 3)}
              className={`w-20 h-24 md:w-24 md:h-28 rounded-2xl border-4 flex flex-col items-center justify-center font-black transition-all duration-300 shadow-sm active:scale-95 ${
                blendStep === 3 || blendStep === 4
                  ? 'bg-indigo-600 border-indigo-700 text-white scale-105 shadow-md'
                  : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-indigo-400'
              }`}
            >
              <span className="text-3xl md:text-4xl">{currentCVC.c2}</span>
              <span className={`text-sm font-black mt-0.5 ${blendStep === 3 || blendStep === 4 ? 'text-amber-200' : 'text-amber-600'}`}>
                {currentCVC.c2Sound}
              </span>
              <span className="text-[10px] opacity-70">अंतिम अक्षर</span>
            </button>
          </div>

          {/* Hindi Sound Guide */}
          <div className="bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-2xl mb-6 text-center">
            <span className="text-xs text-slate-500 font-bold block mb-0.5">ध्वनि विखंडन व अर्थ (Phonetic Blend):</span>
            <span className="text-base font-black text-slate-800">
              {currentCVC.hindiBreakdown} ➔ {currentCVC.meaningHindi}
            </span>
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