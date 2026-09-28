'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, RotateCcw, Trophy, CheckCircle2, XCircle, 
  Clock, Play, Sparkles, ArrowRight, ArrowLeft, Pencil, Key, BookOpen, Home
} from 'lucide-react';

type LabSection = 'phonic_game' | 'tracing' | 'cvc';

// --- DATA: PHONIC SOUND CHALLENGE ---
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
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

// --- DATA: CVC DICTIONARY ---
export interface CvcWordItem {
  id: string;
  word: string;
  vowel: 'A' | 'E' | 'I' | 'O' | 'U';
  hindiMeaning: string;
  phonics: string;
  article: 'a' | 'an';
  emoji: string;
  imageUrl: string;
}

const CVC_DICTIONARY: CvcWordItem[] = [
  // Vowel A
  { id: 'cat', word: 'cat', vowel: 'A', hindiMeaning: 'बिल्ली', phonics: 'c - a - t', article: 'a', emoji: '🐱', imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80' },
  { id: 'bat', word: 'bat', vowel: 'A', hindiMeaning: 'बल्ला', phonics: 'b - a - t', article: 'a', emoji: '🏏', imageUrl: 'https://images.unsplash.com/photo-1593786481097-cf281dd12e9e?w=400&auto=format&fit=crop&q=80' },
  { id: 'hat', word: 'hat', vowel: 'A', hindiMeaning: 'टोपी', phonics: 'h - a - t', article: 'a', emoji: '👒', imageUrl: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400&auto=format&fit=crop&q=80' },
  { id: 'mat', word: 'mat', vowel: 'A', hindiMeaning: 'चटाई', phonics: 'm - a - t', article: 'a', emoji: '🧘', imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&auto=format&fit=crop&q=80' },
  { id: 'fan', word: 'fan', vowel: 'A', hindiMeaning: 'पंखा', phonics: 'f - a - n', article: 'a', emoji: '🪭', imageUrl: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=400&auto=format&fit=crop&q=80' },
  { id: 'pan', word: 'pan', vowel: 'A', hindiMeaning: 'तवा / पैन', phonics: 'p - a - n', article: 'a', emoji: '🍳', imageUrl: 'https://images.unsplash.com/photo-1584990347449-399a0a03006d?w=400&auto=format&fit=crop&q=80' },
  { id: 'van', word: 'van', vowel: 'A', hindiMeaning: 'वैन गाड़ी', phonics: 'v - a - n', article: 'a', emoji: '🚐', imageUrl: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?w=400&auto=format&fit=crop&q=80' },
  { id: 'cap', word: 'cap', vowel: 'A', hindiMeaning: 'कैप', phonics: 'c - a - p', article: 'a', emoji: '🧢', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop&q=80' },
  { id: 'map', word: 'map', vowel: 'A', hindiMeaning: 'नक्शा', phonics: 'm - a - p', article: 'a', emoji: '🗺️', imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop&q=80' },
  { id: 'bag', word: 'bag', vowel: 'A', hindiMeaning: 'बस्ता', phonics: 'b - a - g', article: 'a', emoji: '🎒', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80' },

  // Vowel E
  { id: 'bed', word: 'bed', vowel: 'E', hindiMeaning: 'बिस्तर', phonics: 'b - e - d', article: 'a', emoji: '🛏️', imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&auto=format&fit=crop&q=80' },
  { id: 'red', word: 'red', vowel: 'E', hindiMeaning: 'लाल रंग', phonics: 'r - e - d', article: 'a', emoji: '🔴', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&auto=format&fit=crop&q=80' },
  { id: 'pen', word: 'pen', vowel: 'E', hindiMeaning: 'कलम', phonics: 'p - e - n', article: 'a', emoji: '🖊️', imageUrl: 'https://images.unsplash.com/photo-1585336261026-77cc7c44415e?w=400&auto=format&fit=crop&q=80' },
  { id: 'hen', word: 'hen', vowel: 'E', hindiMeaning: 'मुर्गी', phonics: 'h - e - n', article: 'a', emoji: '🐔', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&auto=format&fit=crop&q=80' },
  { id: 'net', word: 'net', vowel: 'E', hindiMeaning: 'जाल', phonics: 'n - e - t', article: 'a', emoji: '🥅', imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=400&auto=format&fit=crop&q=80' },
  { id: 'jet', word: 'jet', vowel: 'E', hindiMeaning: 'जेट विमान', phonics: 'j - e - t', article: 'a', emoji: '✈️', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&auto=format&fit=crop&q=80' },
  { id: 'leg', word: 'leg', vowel: 'E', hindiMeaning: 'टांग / पैर', phonics: 'l - e - g', article: 'a', emoji: '🦵', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80' },
  { id: 'web', word: 'web', vowel: 'E', hindiMeaning: 'मकड़ी का जाला', phonics: 'w - e - b', article: 'a', emoji: '🕸️', imageUrl: 'https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?w=400&auto=format&fit=crop&q=80' },

  // Vowel I
  { id: 'bin', word: 'bin', vowel: 'I', hindiMeaning: 'कूड़ेदान', phonics: 'b - i - n', article: 'a', emoji: '🗑️', imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop&q=80' },
  { id: 'pin', word: 'pin', vowel: 'I', hindiMeaning: 'पिन', phonics: 'p - i - n', article: 'a', emoji: '📍', imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80' },
  { id: 'tin', word: 'tin', vowel: 'I', hindiMeaning: 'टिन का डिब्बा', phonics: 't - i - n', article: 'a', emoji: '🥫', imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?w=400&auto=format&fit=crop&q=80' },
  { id: 'lip', word: 'lip', vowel: 'I', hindiMeaning: 'होंठ', phonics: 'l - i - p', article: 'a', emoji: '👄', imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80' },
  { id: 'zip', word: 'zip', vowel: 'I', hindiMeaning: 'चेन / ज़िप', phonics: 'z - i - p', article: 'a', emoji: '🤐', imageUrl: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?w=400&auto=format&fit=crop&q=80' },
  { id: 'pig', word: 'pig', vowel: 'I', hindiMeaning: 'सुअर', phonics: 'p - i - g', article: 'a', emoji: '🐷', imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&auto=format&fit=crop&q=80' },
  { id: 'wig', word: 'wig', vowel: 'I', hindiMeaning: 'नकली बाल', phonics: 'w - i - g', article: 'a', emoji: '💇', imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop&q=80' },
  { id: 'lid', word: 'lid', vowel: 'I', hindiMeaning: 'ढक्कन', phonics: 'l - i - d', article: 'a', emoji: '🫙', imageUrl: 'https://images.unsplash.com/photo-1584990347449-399a0a03006d?w=400&auto=format&fit=crop&q=80' },
  { id: 'six', word: 'six', vowel: 'I', hindiMeaning: 'छह (६)', phonics: 's - i - x', article: 'a', emoji: '6️⃣', imageUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=400&auto=format&fit=crop&q=80' },

  // Vowel O
  { id: 'dog', word: 'dog', vowel: 'O', hindiMeaning: 'कुत्ता', phonics: 'd - o - g', article: 'a', emoji: '🐶', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80' },
  { id: 'log', word: 'log', vowel: 'O', hindiMeaning: 'लकड़ी का लट्ठा', phonics: 'l - o - g', article: 'a', emoji: '🪵', imageUrl: 'https://images.unsplash.com/photo-1520114878144-6123749968dd?w=400&auto=format&fit=crop&q=80' },
  { id: 'pot', word: 'pot', vowel: 'O', hindiMeaning: 'गमला / बर्तन', phonics: 'p - o - t', article: 'a', emoji: '🪴', imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format&fit=crop&q=80' },
  { id: 'cot', word: 'cot', vowel: 'O', hindiMeaning: 'खटिया / पालना', phonics: 'c - o - t', article: 'a', emoji: '🛏️', imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=400&auto=format&fit=crop&q=80' },
  { id: 'box', word: 'box', vowel: 'O', hindiMeaning: 'डिब्बा', phonics: 'b - o - x', article: 'a', emoji: '📦', imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=80' },
  { id: 'fox', word: 'fox', vowel: 'O', hindiMeaning: 'लोमड़ी', phonics: 'f - o - x', article: 'a', emoji: '🦊', imageUrl: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=400&auto=format&fit=crop&q=80' },
  { id: 'top', word: 'top', vowel: 'O', hindiMeaning: 'लट्टू', phonics: 't - o - p', article: 'a', emoji: '🪀', imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&auto=format&fit=crop&q=80' },
  { id: 'mop', word: 'mop', vowel: 'O', hindiMeaning: 'पोछा', phonics: 'm - o - p', article: 'a', emoji: '🧹', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80' },
  { id: 'toy', word: 'toy', vowel: 'O', hindiMeaning: 'खिलौना', phonics: 't - o - y', article: 'a', emoji: '🧸', imageUrl: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=400&auto=format&fit=crop&q=80' },

  // Vowel U
  { id: 'sun', word: 'sun', vowel: 'U', hindiMeaning: 'सूरज', phonics: 's - u - n', article: 'a', emoji: '☀️', imageUrl: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=400&auto=format&fit=crop&q=80' },
  { id: 'bun', word: 'bun', vowel: 'U', hindiMeaning: 'बन रोटी', phonics: 'b - u - n', article: 'a', emoji: '🍔', imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&auto=format&fit=crop&q=80' },
  { id: 'cup', word: 'cup', vowel: 'U', hindiMeaning: 'प्याला / कप', phonics: 'c - u - p', article: 'a', emoji: '☕', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' },
  { id: 'pup', word: 'pup', vowel: 'U', hindiMeaning: 'कुत्ते का पिल्ला', phonics: 'p - u - p', article: 'a', emoji: '🐶', imageUrl: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=400&auto=format&fit=crop&q=80' },
  { id: 'tub', word: 'tub', vowel: 'U', hindiMeaning: 'टब', phonics: 't - u - b', article: 'a', emoji: '🛁', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80' },
  { id: 'bus', word: 'bus', vowel: 'U', hindiMeaning: 'बस', phonics: 'b - u - s', article: 'a', emoji: '🚌', imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&auto=format&fit=crop&q=80' },
  { id: 'hut', word: 'hut', vowel: 'U', hindiMeaning: 'झोपड़ी', phonics: 'h - u - t', article: 'a', emoji: '🛖', imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&auto=format&fit=crop&q=80' },
  { id: 'nut', word: 'nut', vowel: 'U', hindiMeaning: 'अखरोट / मूंगफली', phonics: 'n - u - t', article: 'a', emoji: '🥜', imageUrl: 'https://images.unsplash.com/photo-1508736705847-9ca397ce7a40?w=400&auto=format&fit=crop&q=80' },
  { id: 'bug', word: 'bug', vowel: 'U', hindiMeaning: 'कीड़ा', phonics: 'b - u - g', article: 'a', emoji: '🐞', imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=400&auto=format&fit=crop&q=80' },
  { id: 'jug', word: 'jug', vowel: 'U', hindiMeaning: 'जग', phonics: 'j - u - g', article: 'a', emoji: '🫖', imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&auto=format&fit=crop&q=80' },
  { id: 'mug', word: 'mug', vowel: 'U', hindiMeaning: 'मग / प्याला', phonics: 'm - u - g', article: 'a', emoji: '☕', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' }
];

const VOWEL_OPTIONS: Array<'A' | 'E' | 'I' | 'O' | 'U'> = ['A', 'E', 'I', 'O', 'U'];

// --- DATA: TRACING PATTERNS ---
interface PatternDefinition {
  id: string;
  name: string;
  hindiName: string;
  segments: Array<Array<[number, number]>>;
}

const PATTERNS: PatternDefinition[] = [
  { id: 'standing-line', name: 'Standing Line', hindiName: 'सीधी खड़ी रेखा (|)', segments: [[[0.5, 0.15], [0.5, 0.85]]] },
  { id: 'sleeping-line', name: 'Sleeping Line', hindiName: 'सीधी लेटी रेखा (—)', segments: [[[0.15, 0.5], [0.85, 0.5]]] },
  { id: 'slanting-line', name: 'Slanting Line', hindiName: 'तिरछी रेखा (/)', segments: [[[0.2, 0.2], [0.8, 0.8]]] },
  { id: 'zigzag', name: 'Zig-Zag Waves', hindiName: 'टेढ़ी-मेढ़ी लहरें (Zig-Zag)', segments: [[[0.15, 0.7], [0.35, 0.3], [0.5, 0.7], [0.65, 0.3], [0.85, 0.7]]] },
  {
    id: 'circle',
    name: 'Circle',
    hindiName: 'गोल चक्र (Circle)',
    segments: [
      Array.from({ length: 33 }, (_, i) => {
        const theta = (i / 32) * Math.PI * 2;
        return [0.5 + 0.35 * Math.cos(theta), 0.5 + 0.35 * Math.sin(theta)] as [number, number];
      })
    ]
  },
  {
    id: 'letter-a',
    name: 'Letter A',
    hindiName: 'अक्षर A ट्रेसिंग',
    segments: [[[0.5, 0.15], [0.2, 0.85]], [[0.5, 0.15], [0.8, 0.85]], [[0.32, 0.55], [0.68, 0.55]]]
  },
  {
    id: 'letter-b',
    name: 'Letter B',
    hindiName: 'अक्षर B ट्रेसिंग',
    segments: [
      [[0.25, 0.15], [0.25, 0.85]],
      [[0.25, 0.15], [0.55, 0.15], [0.68, 0.25], [0.68, 0.4], [0.55, 0.5], [0.25, 0.5]],
      [[0.25, 0.5], [0.6, 0.5], [0.72, 0.62], [0.72, 0.75], [0.6, 0.85], [0.25, 0.85]]
    ]
  }
];

export default function EnglishAlphabetLab() {
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

  // Audio & Async Locks
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isAudioLockedRef = useRef<boolean>(false);

  // Sound Synth Generator
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

  // Web Speech Promise with Timeout Guarantee
  const speakVoice = (text: string, lang = 'hi-IN', rate = 0.85): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }
      try {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = 1.05;

        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang === lang || (lang === 'en-US' && v.lang.startsWith('en')));
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
        setTimeout(done, Math.max(1200, text.length * 110));

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        resolve();
      }
    });
  };

  // --- 1. PHONIC SOUND GAME HANDLERS ---
  const calloutCurrentPhonic = async (item: PhonicQuestion) => {
    if (!item || !isMountedRef.current) return;
    setWrongPressKey(null);
    await speakVoice(`ध्वनि सुनो: ${item.spokenSound}... कीबोर्ड पर सही बटन दबाओ`, 'hi-IN', 0.84);
  };

  const startPhonicGame = () => {
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

    const normalized = pressedChar.toUpperCase();
    const isCorrect = normalized === currentPhonicItem.char;

    setPressedAnimationKey(normalized);
    setTimeout(() => setPressedAnimationKey(null), 180);

    if (isCorrect) {
      playSoundEffect('correct');
      setScore(prev => prev + 1);
      setPhonicFeedback({
        type: 'correct',
        text: `सही जवाब, ${currentPhonicItem.lower} ${currentPhonicItem.hindiSound} for ${currentPhonicItem.exampleWord}`
      });

      await speakVoice(`सही जवाब! ${currentPhonicItem.lower} ${currentPhonicItem.spokenSound} for ${currentPhonicItem.exampleWord}`, 'hi-IN', 0.9);
      await new Promise(r => setTimeout(r, 350));
    } else {
      playSoundEffect('wrong');
      setWrongPressKey(normalized);
      setMissedPhonics(prev => [...prev, { sound: currentPhonicItem.hindiSound, char: currentPhonicItem.lower, word: currentPhonicItem.exampleWord }]);
      setPhonicFeedback({
        type: 'wrong',
        text: `नहीं! यह ${currentPhonicItem.lower} ${currentPhonicItem.hindiSound} है`
      });

      await speakVoice(`नहीं! यह ${currentPhonicItem.lower} ${currentPhonicItem.spokenSound} है`, 'hi-IN', 0.88);
      await new Promise(r => setTimeout(r, 350));
    }

    if (!isMountedRef.current) return;

    if (currentRoundIndex + 1 >= 10) {
      setIsPhonicPlaying(false);
      setIsPhonicFinished(true);
      playSoundEffect('victory');

      const finalScore = score + (isCorrect ? 1 : 0);
      await speakVoice(`वाह! खेल पूरा हुआ। आपने 10 में से ${finalScore} सही किए।`, 'hi-IN', 0.86);
      isAudioLockedRef.current = false;
    } else {
      const nextIdx = currentRoundIndex + 1;
      setCurrentRoundIndex(nextIdx);
      setPhonicFeedback(null);
      isAudioLockedRef.current = false;
      calloutCurrentPhonic(gameQuestions[nextIdx]);
    }
  };

  // Keyboard capture for Phonic Game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || section !== 'phonic_game' || !isPhonicPlaying || isPhonicFinished) return;
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        e.stopPropagation();
        handlePhonicKeyAnswer(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isPhonicPlaying, isPhonicFinished, currentRoundIndex, gameQuestions, section, score]);

  // --- 2. CVC WORDS HANDLERS ---
  const filteredCvcWords = CVC_DICTIONARY.filter(w => w.vowel === selectedVowel);
  const currentCvcWord = filteredCvcWords[carouselIndex] || filteredCvcWords[0];

  const startCvcPlayGame = () => {
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

    const currentQ = cvcQuizList[cvcQuizIndex];
    const isCorrect = selectedWord === currentQ.target.word;

    if (isCorrect) {
      playSoundEffect('correct');
      setCvcQuizScore(prev => prev + 1);
      setCvcFeedback({
        isCorrect: true,
        text: `Correct! This is ${currentQ.target.article} '${currentQ.target.word}'.`
      });

      await speakVoice(`Correct! This is ${currentQ.target.article} ${currentQ.target.word}.`, 'en-US');
      await new Promise(r => setTimeout(r, 400));
    } else {
      playSoundEffect('wrong');
      setMissedCvcWords(prev => [...prev, currentQ.target]);
      setCvcFeedback({
        isCorrect: false,
        text: `Try again! This is ${currentQ.target.article} '${currentQ.target.word}'.`
      });

      await speakVoice(`Try again! This is ${currentQ.target.article} ${currentQ.target.word}.`, 'en-US');
      await new Promise(r => setTimeout(r, 400));
    }

    if (cvcQuizIndex + 1 >= 10) {
      setIsCvcQuizFinished(true);
      playSoundEffect('victory');
      await speakVoice(`Great job! You scored ${cvcQuizScore + (isCorrect ? 1 : 0)} out of 10!`, 'en-US');
      isAudioLockedRef.current = false;
    } else {
      setCvcQuizIndex(prev => prev + 1);
      setCvcFeedback(null);
      isAudioLockedRef.current = false;
    }
  };

  // --- 3. TRACING LOGIC ---
  const currentPattern = PATTERNS[patternIndex];

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

    if (matchRatio >= 0.60) {
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
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 select-none font-sans">
      
      {/* Universal Preschool Lab Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 md:p-5 rounded-3xl shadow-lg mb-5 flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-2xl">🧸</span>
            <h1 className="text-lg md:text-xl font-black">नन्हे वैज्ञानिक प्रीस्कूल लैब (Preschool Lab)</h1>
          </div>
          <p className="text-[11px] md:text-xs text-indigo-100 font-semibold">
            ध्वनि पहचान (ब $\rightarrow$ b) • ✏️ पेंसिल ट्रेसिंग • 📖 सचित्र CVC शब्दकोश
          </p>
        </div>

        {/* 3 Main Functional Sections */}
        <div className="flex bg-white/20 p-1 rounded-2xl backdrop-blur-md gap-1 flex-wrap">
          <button
            onClick={() => setSection('phonic_game')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              section === 'phonic_game' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <Key className="w-3.5 h-3.5" /> 🔊 फोनिक साउंड गेम (10 राउंड)
          </button>
          <button
            onClick={() => setSection('tracing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              section === 'tracing' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" /> ✏️ पेंसिल ट्रेसिंग
          </button>
          <button
            onClick={() => {
              setSection('cvc');
              setCvcSubTab('menu');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              section === 'cvc' ? 'bg-white text-indigo-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> 📖 सचित्र CVC शब्दकोश
          </button>
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
                फोनिक साउंड गेम (10 प्रश्न)
              </h2>
              <p className="text-xs text-slate-600 max-w-md mb-6 leading-relaxed">
                स्क्रीन पर केवल हिंदी ध्वनि (जैसे <strong>"ब"</strong>) दिखेगी और सुनाई देगी। बिना किसी चित्र के, बच्चे को कीबोर्ड पर सही अक्षर (<strong>b</strong>) दबाना है!
              </p>
              <button
                onClick={startPhonicGame}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" /> 10-प्रश्नों का खेल शुरू करें ➔
              </button>
            </div>
          )}

          {isPhonicPlaying && currentPhonicItem && (
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-4 md:p-5 shadow-xl flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
                <span className="text-xs font-black text-indigo-950 bg-indigo-100 px-3 py-1 rounded-full">
                  सवाल: {currentRoundIndex + 1} / 10
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  स्कोर: {score} / 10
                </span>
              </div>

              <div className="w-full max-w-md bg-gradient-to-b from-indigo-50/70 to-purple-50/70 border-2 border-indigo-300 rounded-3xl p-5 text-center shadow-inner mb-4 flex flex-col items-center">
                <button
                  onClick={() => calloutCurrentPhonic(currentPhonicItem)}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition cursor-pointer shadow-md mb-2 flex items-center gap-2"
                  title="फिर से ध्वनि सुनें"
                >
                  <Volume2 className="w-6 h-6 animate-pulse" />
                </button>

                <span className="text-xs font-bold text-indigo-900 block">
                  इस ध्वनि का अक्षर कीबोर्ड पर दबाएं:
                </span>

                <div className="text-6xl md:text-7xl font-black text-indigo-950 my-1 font-mono tracking-wider">
                  {currentPhonicItem.hindiSound}
                </div>

                <span className="text-[11px] text-slate-500 font-semibold mt-1">
                  (आवाज़ सुनें और लैपटॉप या स्क्रीन पर सही बटन दबाएं)
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

              <div className="w-full max-w-2xl bg-slate-100 border-2 border-slate-300 rounded-3xl p-3 shadow-inner">
                <div className="text-center mb-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    ⌨️ QWERTY कीबोर्ड (टच करें या लैपटॉप की दबाएं)
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
                              h-11 md:h-13 w-8 sm:w-11 md:w-13 rounded-xl font-black text-base md:text-lg transition-transform shadow-sm cursor-pointer flex flex-col items-center justify-center
                              ${isCurrentlyPressed ? 'scale-90 ring-4 ring-indigo-300' : 'active:scale-95'}
                              ${isWrongJustPressed 
                                ? 'bg-rose-500 text-white border-2 border-rose-700 animate-shake' 
                                : 'bg-white hover:bg-indigo-600 hover:text-white border-2 border-slate-200 text-slate-800'
                              }
                            `}
                          >
                            <span>{letter.toLowerCase()}</span>
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

              <h2 className="text-2xl font-black text-indigo-950 mb-1">खेल पूरा हुआ!</h2>
              <p className="text-xs text-slate-600 font-semibold mb-5">
                फोनिक ध्वनि पहचान रिपोर्ट कार्ड (10 प्रश्न)
              </p>

              <div className="w-full max-w-sm bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 mb-5 flex justify-around items-center">
                <div>
                  <span className="text-xs font-bold text-slate-500 block">कुल स्कोर</span>
                  <span className="text-3xl font-black text-emerald-600">{score} / 10</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">सटीकता</span>
                  <span className="text-3xl font-black text-indigo-950">{Math.round((score / 10) * 100)}%</span>
                </div>
              </div>

              {missedPhonics.length > 0 && (
                <div className="w-full max-w-md text-left mb-6 bg-rose-50 border border-rose-200 p-3 rounded-2xl">
                  <h4 className="text-xs font-black text-rose-900 mb-2">जिन अक्षरों का पुनः अभ्यास करना है:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {missedPhonics.map((item, idx) => (
                      <span key={idx} className="bg-white border border-rose-300 px-2.5 py-1 rounded-lg text-xs font-black text-rose-800 shadow-sm">
                        {item.sound} $\rightarrow$ {item.char} ({item.word})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={startPhonicGame}
                className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> नया 10-प्रश्नों का गेम खेलें
              </button>
            </div>
          )}
        </>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: DOTTED PATTERN TRACING                              */}
      {/* ============================================================== */}
      {section === 'tracing' && (
        <div className="bg-white border-2 border-teal-200 rounded-3xl p-4 md:p-5 shadow-xl flex flex-col items-center">
          <div className="flex gap-1.5 overflow-x-auto w-full no-scrollbar pb-2 mb-3">
            {PATTERNS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setPatternIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                  patternIndex === idx ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {idx + 1}. {p.name}
              </button>
            ))}
          </div>

          <div className="w-full flex justify-between items-center mb-3 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-2xl">
            <span className="text-xs font-black text-teal-950">
              लक्ष्य: {currentPattern.hindiName}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                सफल: {traceScore}
              </span>
              <button
                onClick={() => {
                  userDrawnPointsRef.current = [];
                  setTraceResult(null);
                  drawGuide();
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> मिटाएं
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
              <span>हरे बिंदु से शुरू करके डॉटेड लाइन पर चलाएं</span>
            </div>
          </div>

          {traceResult === 'success' && (
            <div className="w-full max-w-md mt-3 p-2.5 bg-emerald-50 border-2 border-emerald-400 text-emerald-950 rounded-2xl text-center font-black text-xs flex items-center justify-center gap-1.5 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>शानदार! आपने पैटर्न बिल्कुल सही ट्रेस किया 🏆</span>
            </div>
          )}

          {traceResult === 'fail' && (
            <div className="w-full max-w-md mt-3 p-2.5 bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-2xl text-center font-black text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>थोड़ा भटक गए। "मिटाएं" दबाकर पुनः प्रयास करें 🔄</span>
            </div>
          )}

          <div className="w-full flex justify-between items-center mt-3 pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                userDrawnPointsRef.current = [];
                setTraceResult(null);
                drawGuide();
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> रीसेट
            </button>
            <button
              onClick={() => {
                if (patternIndex + 1 < PATTERNS.length) setPatternIndex(prev => prev + 1);
                else setPatternIndex(0);
              }}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1"
            >
              अगला पैटर्न <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: CVC WORDS (LEARN & PLAY GAME)                       */}
      {/* ============================================================== */}
      {section === 'cvc' && (
        <div className="space-y-4">
          
          {/* CVC Sub-Menu Choice */}
          {cvcSubTab === 'menu' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option 1: Learn */}
              <div className="bg-white border-2 border-teal-200 rounded-3xl p-6 text-center shadow-lg flex flex-col justify-between items-center">
                <div>
                  <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner mx-auto">
                    📚
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">शब्द सीखो (Learn CVC)</h3>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    स्वर (Vowel) चुनें: <strong>A, E, I, O, U</strong>। हर शब्द की असली तस्वीर, फोनिक्स स्पेलिंग व उच्चारण एक-एक करके देखें।
                  </p>
                </div>

                <div className="w-full">
                  <span className="text-[11px] font-bold text-slate-500 mb-2 block">स्वर चुनें (Select Vowel):</span>
                  <div className="flex justify-center gap-1.5 mb-4">
                    {VOWEL_OPTIONS.map(v => (
                      <button
                        key={v}
                        onClick={() => {
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
                      setSelectedVowel('A');
                      setCarouselIndex(0);
                      setCvcSubTab('learn');
                    }}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" /> सचित्र शब्दकोश खोलें ➔
                  </button>
                </div>
              </div>

              {/* Option 2: Play */}
              <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 text-center shadow-lg flex flex-col justify-between items-center">
                <div>
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner mx-auto">
                    🎮
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">क्विज़ खेलो (Play Quiz)</h3>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    सभी स्वरों से 10 बिना दोहराव वाले सचित्र सवाल आएंगे। सही 3-अक्षर शब्द चुनें और 10 में से अपना स्कोर देखें!
                  </p>
                </div>

                <div className="w-full">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4 text-left text-xs font-semibold text-indigo-900 space-y-1">
                    <div>🏆 सही उत्तर: विजय धुन + <strong>"This is a/an [word]"</strong></div>
                    <div>🔔 गलत उत्तर: कोमल बीप + सही उत्तर का ऑडियो उच्चारण</div>
                  </div>

                  <button
                    onClick={startCvcPlayGame}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-white" /> 10-प्रश्नों का गेम शुरू करें ➔
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
                  onClick={() => setCvcSubTab('menu')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> मुख्य मेन्यू (Menu)
                </button>

                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {VOWEL_OPTIONS.map(v => (
                    <button
                      key={v}
                      onClick={() => {
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
                  शब्द: {carouselIndex + 1} / {filteredCvcWords.length}
                </span>
              </div>

              <div className="w-full max-w-md bg-stone-50 border-2 border-teal-300 rounded-3xl p-4 text-center shadow-inner flex flex-col items-center mb-5">
                <div className="w-full h-52 md:h-56 rounded-2xl overflow-hidden mb-3 border border-teal-200 shadow relative bg-white flex items-center justify-center">
                  <img
                    src={currentCvcWord.imageUrl}
                    alt={currentCvcWord.word}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-2xl bg-white/85 p-1 rounded-xl shadow-sm">
                    {currentCvcWord.emoji}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 my-1">
                  <span className="text-5xl md:text-6xl font-black text-teal-950 font-mono tracking-wider">
                    {currentCvcWord.word}
                  </span>
                  <button
                    onClick={() => speakVoice(`This is ${currentCvcWord.article} ${currentCvcWord.word}. ${currentCvcWord.phonics}.`, 'en-US')}
                    className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition cursor-pointer shadow-md"
                    title="आवाज़ सुनें"
                  >
                    <Volume2 className="w-5 h-5 animate-pulse" />
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <span className="text-xs font-extrabold text-teal-800 bg-teal-100 px-3 py-0.5 rounded-full">
                    फोनिक्स: {currentCvcWord.phonics}
                  </span>
                  <span className="text-xs font-extrabold text-slate-800 bg-amber-100 px-3 py-0.5 rounded-full">
                    अर्थ: {currentCvcWord.hindiMeaning}
                  </span>
                </div>
              </div>

              <div className="w-full max-w-md flex justify-between items-center gap-3">
                <button
                  onClick={() => setCarouselIndex(prev => (prev > 0 ? prev - 1 : filteredCvcWords.length - 1))}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> पिछला शब्द
                </button>

                <button
                  onClick={() => speakVoice(`This is ${currentCvcWord.article} ${currentCvcWord.word}`, 'en-US')}
                  className="py-2.5 px-4 bg-teal-100 hover:bg-teal-200 text-teal-900 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> दोहराएं
                </button>

                <button
                  onClick={() => setCarouselIndex(prev => (prev < filteredCvcWords.length - 1 ? prev + 1 : 0))}
                  className="flex-1 py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1"
                >
                  अगला शब्द <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Sub-View: Play Quiz Mode */}
          {cvcSubTab === 'play' && cvcQuizList.length > 0 && !isCvcQuizFinished && (
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-4 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-2xl">
                <button
                  onClick={() => setCvcSubTab('menu')}
                  className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> मेन्यू
                </button>
                <span className="text-xs font-black text-indigo-950 bg-white border border-indigo-200 px-3 py-1 rounded-full shadow-sm">
                  प्रश्न: {cvcQuizIndex + 1} / 10
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  स्कोर: {cvcQuizScore} / 10
                </span>
              </div>

              <div className="w-full max-w-md bg-stone-50 border-2 border-indigo-200 rounded-3xl p-4 text-center shadow-inner flex flex-col items-center mb-4">
                <div className="w-full h-52 md:h-56 rounded-2xl overflow-hidden mb-3 border border-indigo-200 shadow relative bg-white flex items-center justify-center">
                  <img
                    src={cvcQuizList[cvcQuizIndex].target.imageUrl}
                    alt="Identify CVC"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-2xl bg-white/80 p-1.5 rounded-xl shadow-sm">
                    {cvcQuizList[cvcQuizIndex].target.emoji}
                  </span>
                </div>

                <span className="text-xs font-black text-indigo-900 block mb-0.5">
                  चित्र देखकर सही 3-अक्षर शब्द (CVC) चुनें:
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  (संकेत: {cvcQuizList[cvcQuizIndex].target.hindiMeaning})
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

              <h2 className="text-2xl font-black text-indigo-950 mb-1">खेल पूरा हुआ! (Quiz Completed)</h2>
              <p className="text-xs text-slate-600 font-semibold mb-5">
                NEP 2020 CVC Foundational Word Mastery
              </p>

              <div className="w-full max-w-sm bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 mb-5 flex justify-around items-center">
                <div>
                  <span className="text-xs font-bold text-slate-500 block">कुल स्कोर</span>
                  <span className="text-3xl font-black text-emerald-600">{cvcQuizScore} / 10</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">सटीकता</span>
                  <span className="text-3xl font-black text-indigo-950">{Math.round((cvcQuizScore / 10) * 100)}%</span>
                </div>
              </div>

              {missedCvcWords.length > 0 && (
                <div className="w-full max-w-md text-left mb-6 bg-rose-50 border border-rose-200 p-4 rounded-2xl">
                  <h4 className="text-xs font-black text-rose-900 mb-2">जिन शब्दों का पुनः अभ्यास करना है:</h4>
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
                  <RotateCcw className="w-4 h-4" /> पुनः नया गेम खेलें
                </button>
                <button
                  onClick={() => setCvcSubTab('menu')}
                  className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Home className="w-4 h-4" /> मुख्य मेन्यू
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}