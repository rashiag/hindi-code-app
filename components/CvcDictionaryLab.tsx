'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Play, Volume2, ArrowLeft, ArrowRight, RotateCcw, 
  Trophy, CheckCircle2, XCircle, Sparkles, Home 
} from 'lucide-react';

export interface CvcWordItem {
  id: string;
  word: string;
  vowel: 'A' | 'E' | 'I' | 'O' | 'U';
  hindiMeaning: string;
  phonics: string; // e.g., "b-a-t"
  article: 'a' | 'an';
  emoji: string;
  imageUrl: string;
}

export const CVC_DICTIONARY: CvcWordItem[] = [
  // --- VOWEL A ---
  { id: 'cat', word: 'cat', vowel: 'A', hindiMeaning: 'बिल्ली', phonics: 'c - a - t', article: 'a', emoji: '🐱', imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80' },
  { id: 'bat', word: 'bat', vowel: 'A', hindiMeaning: 'बल्ला', phonics: 'b - a - t', article: 'a', emoji: '🏏', imageUrl: 'https://images.unsplash.com/photo-1593786481097-cf281dd12e9e?w=400&auto=format&fit=crop&q=80' },
  { id: 'hat', word: 'hat', vowel: 'A', hindiMeaning: 'टोपी', phonics: 'h - a - t', article: 'a', emoji: '👒', imageUrl: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400&auto=format&fit=crop&q=80' },
  { id: 'mat', word: 'mat', vowel: 'A', hindiMeaning: 'चटाई', phonics: 'm - a - t', article: 'a', emoji: '🧘', imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&auto=format&fit=crop&q=80' },
  { id: 'rat', word: 'rat', vowel: 'A', hindiMeaning: 'चूहा', phonics: 'r - a - t', article: 'a', emoji: '🐀', imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&auto=format&fit=crop&q=80' },
  { id: 'fan', word: 'fan', vowel: 'A', hindiMeaning: 'पंखा', phonics: 'f - a - n', article: 'a', emoji: '🪭', imageUrl: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=400&auto=format&fit=crop&q=80' },
  { id: 'man', word: 'man', vowel: 'A', hindiMeaning: 'आदमी', phonics: 'm - a - n', article: 'a', emoji: '👨', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { id: 'pan', word: 'pan', vowel: 'A', hindiMeaning: 'कड़ाही / तवा', phonics: 'p - a - n', article: 'a', emoji: '🍳', imageUrl: 'https://images.unsplash.com/photo-1584990347449-399a0a03006d?w=400&auto=format&fit=crop&q=80' },
  { id: 'van', word: 'van', vowel: 'A', hindiMeaning: 'वैन गाड़ी', phonics: 'v - a - n', article: 'a', emoji: '🚐', imageUrl: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?w=400&auto=format&fit=crop&q=80' },
  { id: 'can', word: 'can', vowel: 'A', hindiMeaning: 'डिब्बा', phonics: 'c - a - n', article: 'a', emoji: '🥫', imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?w=400&auto=format&fit=crop&q=80' },
  { id: 'cap', word: 'cap', vowel: 'A', hindiMeaning: 'कैप', phonics: 'c - a - p', article: 'a', emoji: '🧢', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop&q=80' },
  { id: 'map', word: 'map', vowel: 'A', hindiMeaning: 'नक्शा', phonics: 'm - a - p', article: 'a', emoji: '🗺️', imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop&q=80' },
  { id: 'tap', word: 'tap', vowel: 'A', hindiMeaning: 'नल', phonics: 't - a - p', article: 'a', emoji: '🚰', imageUrl: 'https://images.unsplash.com/photo-1585672840540-e4a4b277b022?w=400&auto=format&fit=crop&q=80' },
  { id: 'bag', word: 'bag', vowel: 'A', hindiMeaning: 'बस्ता / बैग', phonics: 'b - a - g', article: 'a', emoji: '🎒', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80' },
  { id: 'tag', word: 'tag', vowel: 'A', hindiMeaning: 'लेबल / टैग', phonics: 't - a - g', article: 'a', emoji: '🏷️', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80' },
  { id: 'jam', word: 'jam', vowel: 'A', hindiMeaning: 'जैम', phonics: 'j - a - m', article: 'a', emoji: '🍓', imageUrl: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400&auto=format&fit=crop&q=80' },

  // --- VOWEL E ---
  { id: 'bed', word: 'bed', vowel: 'E', hindiMeaning: 'बिस्तर', phonics: 'b - e - d', article: 'a', emoji: '🛏️', imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&auto=format&fit=crop&q=80' },
  { id: 'red', word: 'red', vowel: 'E', hindiMeaning: 'लाल रंग', phonics: 'r - e - d', article: 'a', emoji: '🔴', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&auto=format&fit=crop&q=80' },
  { id: 'pen', word: 'pen', vowel: 'E', hindiMeaning: 'कलम', phonics: 'p - e - n', article: 'a', emoji: '🖊️', imageUrl: 'https://images.unsplash.com/photo-1585336261026-77cc7c44415e?w=400&auto=format&fit=crop&q=80' },
  { id: 'hen', word: 'hen', vowel: 'E', hindiMeaning: 'मुर्गी', phonics: 'h - e - n', article: 'a', emoji: '🐔', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&auto=format&fit=crop&q=80' },
  { id: 'den', word: 'den', vowel: 'E', hindiMeaning: 'शेर की गुफा', phonics: 'd - e - n', article: 'a', emoji: '🦁', imageUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=400&auto=format&fit=crop&q=80' },
  { id: 'ten', word: 'ten', vowel: 'E', hindiMeaning: 'दस (१०)', phonics: 't - e - n', article: 'a', emoji: '🔟', imageUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=400&auto=format&fit=crop&q=80' },
  { id: 'net', word: 'net', vowel: 'E', hindiMeaning: 'जाल', phonics: 'n - e - t', article: 'a', emoji: '🥅', imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=400&auto=format&fit=crop&q=80' },
  { id: 'pet', word: 'pet', vowel: 'E', hindiMeaning: 'पालतू जानवर', phonics: 'p - e - t', article: 'a', emoji: '🐕', imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80' },
  { id: 'jet', word: 'jet', vowel: 'E', hindiMeaning: 'जेट विमान', phonics: 'j - e - t', article: 'a', emoji: '✈️', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&auto=format&fit=crop&q=80' },
  { id: 'wet', word: 'wet', vowel: 'E', hindiMeaning: 'गीला', phonics: 'w - e - t', article: 'a', emoji: '💧', imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&auto=format&fit=crop&q=80' },
  { id: 'leg', word: 'leg', vowel: 'E', hindiMeaning: 'टांग / पैर', phonics: 'l - e - g', article: 'a', emoji: '🦵', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80' },
  { id: 'peg', word: 'peg', vowel: 'E', hindiMeaning: 'खूंटी / क्लिप', phonics: 'p - e - g', article: 'a', emoji: '📎', imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&auto=format&fit=crop&q=80' },
  { id: 'web', word: 'web', vowel: 'E', hindiMeaning: 'मकड़ी का जाला', phonics: 'w - e - b', article: 'a', emoji: '🕸️', imageUrl: 'https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?w=400&auto=format&fit=crop&q=80' },

  // --- VOWEL I ---
  { id: 'bin', word: 'bin', vowel: 'I', hindiMeaning: 'कूड़ेदान', phonics: 'b - i - n', article: 'a', emoji: '🗑️', imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop&q=80' },
  { id: 'pin', word: 'pin', vowel: 'I', hindiMeaning: 'पिन', phonics: 'p - i - n', article: 'a', emoji: '📍', imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80' },
  { id: 'tin', word: 'tin', vowel: 'I', hindiMeaning: 'टिन का डिब्बा', phonics: 't - i - n', article: 'a', emoji: '🥫', imageUrl: 'https://images.unsplash.com/photo-1584559582128-b8be739912e1?w=400&auto=format&fit=crop&q=80' },
  { id: 'lip', word: 'lip', vowel: 'I', hindiMeaning: 'होंठ', phonics: 'l - i - p', article: 'a', emoji: '👄', imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80' },
  { id: 'zip', word: 'zip', vowel: 'I', hindiMeaning: 'चेन / ज़िप', phonics: 'z - i - p', article: 'a', emoji: '🤐', imageUrl: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?w=400&auto=format&fit=crop&q=80' },
  { id: 'dip', word: 'dip', vowel: 'I', hindiMeaning: 'डुबोना / सॉस', phonics: 'd - i - p', article: 'a', emoji: '🥣', imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=400&auto=format&fit=crop&q=80' },
  { id: 'pig', word: 'pig', vowel: 'I', hindiMeaning: 'सुअर', phonics: 'p - i - g', article: 'a', emoji: '🐷', imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&auto=format&fit=crop&q=80' },
  { id: 'wig', word: 'wig', vowel: 'I', hindiMeaning: 'नकली बाल', phonics: 'w - i - g', article: 'a', emoji: '💇', imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop&q=80' },
  { id: 'fig', word: 'fig', vowel: 'I', hindiMeaning: 'अंजीर फल', phonics: 'f - i - g', article: 'a', emoji: '🍈', imageUrl: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&auto=format&fit=crop&q=80' },
  { id: 'sit', word: 'sit', vowel: 'I', hindiMeaning: 'बैठना', phonics: 's - i - t', article: 'a', emoji: '🪑', imageUrl: 'https://images.unsplash.com/photo-1580481077195-c328a3727177?w=400&auto=format&fit=crop&q=80' },
  { id: 'hit', word: 'hit', vowel: 'I', hindiMeaning: 'मारना / चोट', phonics: 'h - i - t', article: 'a', emoji: '🎯', imageUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&auto=format&fit=crop&q=80' },
  { id: 'lid', word: 'lid', vowel: 'I', hindiMeaning: 'ढक्कन', phonics: 'l - i - d', article: 'a', emoji: '🫙', imageUrl: 'https://images.unsplash.com/photo-1584990347449-399a0a03006d?w=400&auto=format&fit=crop&q=80' },
  { id: 'kid', word: 'kid', vowel: 'I', hindiMeaning: 'बच्चा', phonics: 'k - i - d', article: 'a', emoji: '🧒', imageUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&auto=format&fit=crop&q=80' },
  { id: 'six', word: 'six', vowel: 'I', hindiMeaning: 'छह (६)', phonics: 's - i - x', article: 'a', emoji: '6️⃣', imageUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=400&auto=format&fit=crop&q=80' },

  // --- VOWEL O ---
  { id: 'dog', word: 'dog', vowel: 'O', hindiMeaning: 'कुत्ता', phonics: 'd - o - g', article: 'a', emoji: '🐶', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80' },
  { id: 'log', word: 'log', vowel: 'O', hindiMeaning: 'लकड़ी का लट्ठा', phonics: 'l - o - g', article: 'a', emoji: '🪵', imageUrl: 'https://images.unsplash.com/photo-1520114878144-6123749968dd?w=400&auto=format&fit=crop&q=80' },
  { id: 'fog', word: 'fog', vowel: 'O', hindiMeaning: 'कोहरा / धुंध', phonics: 'f - o - g', article: 'a', emoji: '🌫️', imageUrl: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=400&auto=format&fit=crop&q=80' },
  { id: 'pot', word: 'pot', vowel: 'O', hindiMeaning: 'मटका / बर्तन', phonics: 'p - o - t', article: 'a', emoji: '🪴', imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format&fit=crop&q=80' },
  { id: 'cot', word: 'cot', vowel: 'O', hindiMeaning: 'खटिया / पालना', phonics: 'c - o - t', article: 'a', emoji: '🛏️', imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=400&auto=format&fit=crop&q=80' },
  { id: 'hot', word: 'hot', vowel: 'O', hindiMeaning: 'गर्म (चाय/धूप)', phonics: 'h - o - t', article: 'a', emoji: '☕', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' },
  { id: 'dot', word: 'dot', vowel: 'O', hindiMeaning: 'बिंदु', phonics: 'd - o - t', article: 'a', emoji: '🔘', imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=80' },
  { id: 'box', word: 'box', vowel: 'O', hindiMeaning: 'डिब्बा', phonics: 'b - o - x', article: 'a', emoji: '📦', imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=80' },
  { id: 'fox', word: 'fox', vowel: 'O', hindiMeaning: 'लोमड़ी', phonics: 'f - o - x', article: 'a', emoji: '🦊', imageUrl: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=400&auto=format&fit=crop&q=80' },
  { id: 'top', word: 'top', vowel: 'O', hindiMeaning: 'लट्टू', phonics: 't - o - p', article: 'a', emoji: '🪀', imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&auto=format&fit=crop&q=80' },
  { id: 'mop', word: 'mop', vowel: 'O', hindiMeaning: 'पोछा', phonics: 'm - o - p', article: 'a', emoji: '🧹', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80' },
  { id: 'hop', word: 'hop', vowel: 'O', hindiMeaning: 'फुदकना', phonics: 'h - o - p', article: 'a', emoji: '🦘', imageUrl: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=400&auto=format&fit=crop&q=80' },
  { id: 'boy', word: 'boy', vowel: 'O', hindiMeaning: 'लड़का', phonics: 'b - o - y', article: 'a', emoji: '👦', imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&auto=format&fit=crop&q=80' },
  { id: 'toy', word: 'toy', vowel: 'O', hindiMeaning: 'खिलौना', phonics: 't - o - y', article: 'a', emoji: '🧸', imageUrl: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=400&auto=format&fit=crop&q=80' },

  // --- VOWEL U ---
  { id: 'sun', word: 'sun', vowel: 'U', hindiMeaning: 'सूरज', phonics: 's - u - n', article: 'a', emoji: '☀️', imageUrl: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=400&auto=format&fit=crop&q=80' },
  { id: 'bun', word: 'bun', vowel: 'U', hindiMeaning: 'मीठी रोटी / बन', phonics: 'b - u - n', article: 'a', emoji: '🍔', imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&auto=format&fit=crop&q=80' },
  { id: 'run', word: 'run', vowel: 'U', hindiMeaning: 'दौड़ना', phonics: 'r - u - n', article: 'a', emoji: '🏃', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&auto=format&fit=crop&q=80' },
  { id: 'gun', word: 'gun', vowel: 'U', hindiMeaning: 'खिलौना बंदूक', phonics: 'g - u - n', article: 'a', emoji: '🔫', imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80' },
  { id: 'cup', word: 'cup', vowel: 'U', hindiMeaning: 'प्याला / कप', phonics: 'c - u - p', article: 'a', emoji: '☕', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' },
  { id: 'pup', word: 'pup', vowel: 'U', hindiMeaning: 'कुत्ते का पिल्ला', phonics: 'p - u - p', article: 'a', emoji: '🐶', imageUrl: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=400&auto=format&fit=crop&q=80' },
  { id: 'tub', word: 'tub', vowel: 'U', hindiMeaning: 'टब', phonics: 't - u - b', article: 'a', emoji: '🛁', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80' },
  { id: 'sub', word: 'sub', vowel: 'U', hindiMeaning: 'पनडुब्बी / सैंडविच', phonics: 's - u - b', article: 'a', emoji: '🥪', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop&q=80' },
  { id: 'bus', word: 'bus', vowel: 'U', hindiMeaning: 'बस', phonics: 'b - u - s', article: 'a', emoji: '🚌', imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&auto=format&fit=crop&q=80' },
  { id: 'hut', word: 'hut', vowel: 'U', hindiMeaning: 'झोपड़ी', phonics: 'h - u - t', article: 'a', emoji: '🛖', imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&auto=format&fit=crop&q=80' },
  { id: 'nut', word: 'nut', vowel: 'U', hindiMeaning: 'अखरोट / बादाम', phonics: 'n - u - t', article: 'a', emoji: '🥜', imageUrl: 'https://images.unsplash.com/photo-1508736705847-9ca397ce7a40?w=400&auto=format&fit=crop&q=80' },
  { id: 'cut', word: 'cut', vowel: 'U', hindiMeaning: 'काटना', phonics: 'c - u - t', article: 'a', emoji: '✂️', imageUrl: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=400&auto=format&fit=crop&q=80' },
  { id: 'bug', word: 'bug', vowel: 'U', hindiMeaning: 'कीड़ा', phonics: 'b - u - g', article: 'a', emoji: '🐞', imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=400&auto=format&fit=crop&q=80' },
  { id: 'jug', word: 'jug', vowel: 'U', hindiMeaning: 'जग', phonics: 'j - u - g', article: 'a', emoji: '🫖', imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&auto=format&fit=crop&q=80' },
  { id: 'mug', word: 'mug', vowel: 'U', hindiMeaning: 'मग / प्याला', phonics: 'm - u - g', article: 'a', emoji: '☕', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' },
  { id: 'rug', word: 'rug', vowel: 'U', hindiMeaning: 'कालीन / दरी', phonics: 'r - u - g', article: 'a', emoji: '🧶', imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=400&auto=format&fit=crop&q=80' },
  { id: 'gum', word: 'gum', vowel: 'U', hindiMeaning: 'गोंद / च्युइंग गम', phonics: 'g - u - m', article: 'a', emoji: '🫧', imageUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&auto=format&fit=crop&q=80' },
];

const VOWELS: Array<'A' | 'E' | 'I' | 'O' | 'U'> = ['A', 'E', 'I', 'O', 'U'];

interface QuizQuestion {
  target: CvcWordItem;
  options: string[]; // 3 options: 1 correct, 2 distractors
}

export default function CvcDictionaryLab() {
  const [activeTab, setActiveTab] = useState<'menu' | 'learn' | 'play'>('menu');
  const [selectedVowel, setSelectedVowel] = useState<'A' | 'E' | 'I' | 'O' | 'U'>('A');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // Play Mode States
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [missedWords, setMissedWords] = useState<CvcWordItem[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isSpeakingRef = useRef<boolean>(false);

  // Filter words by selected vowel for Learn Mode
  const filteredWords = CVC_DICTIONARY.filter(w => w.vowel === selectedVowel);
  const currentWord = filteredWords[carouselIndex] || filteredWords[0];

  // Musical Web Audio Sounds
  const playSoundEffect = (type: 'victory' | 'error' | 'fanfare') => {
    if (typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      if (type === 'victory') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.25, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.28);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
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

  // English Speech Synthesis
  const speakEnglish = (text: string, rate = 0.85): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }
      try {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        utterance.pitch = 1.05;

        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang === 'en-US' || v.lang === 'en-IN');
        if (preferred) utterance.voice = preferred;

        let done = false;
        const finish = () => {
          if (!done) {
            done = true;
            resolve();
          }
        };

        utterance.onend = finish;
        utterance.onerror = finish;
        setTimeout(finish, Math.max(1200, text.length * 110));

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        resolve();
      }
    });
  };

  // Launch Play Game: Random 10 unique CVC words with 3 options each
  const startPlayGame = () => {
    // 1. Shuffle dictionary and pick 10 words
    const shuffled = [...CVC_DICTIONARY].sort(() => 0.5 - Math.random()).slice(0, 10);

    const questions: QuizQuestion[] = shuffled.map((target) => {
      // Pick 2 distractors from same or other vowels
      const distractors = CVC_DICTIONARY
        .filter(w => w.word !== target.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map(w => w.word);

      const options = [target.word, ...distractors].sort(() => 0.5 - Math.random());
      return { target, options };
    });

    setQuizQuestions(questions);
    setQuizIndex(0);
    setQuizScore(0);
    setMissedWords([]);
    setFeedback(null);
    setIsQuizFinished(false);
    setActiveTab('play');
    isSpeakingRef.current = false;
  };

  // Handle Option Click in Play Mode
  const handleAnswerSelect = async (selectedWord: string) => {
    if (isSpeakingRef.current || isQuizFinished) return;
    isSpeakingRef.current = true;

    const currentQ = quizQuestions[quizIndex];
    const isCorrect = selectedWord === currentQ.target.word;

    if (isCorrect) {
      playSoundEffect('victory');
      setQuizScore(prev => prev + 1);
      setFeedback({
        isCorrect: true,
        text: `Correct! This is ${currentQ.target.article} '${currentQ.target.word}'.`
      });

      await speakEnglish(`Correct! This is ${currentQ.target.article} ${currentQ.target.word}.`);
      await new Promise(r => setTimeout(r, 450));
    } else {
      playSoundEffect('error');
      setMissedWords(prev => [...prev, currentQ.target]);
      setFeedback({
        isCorrect: false,
        text: `Try again! This is ${currentQ.target.article} '${currentQ.target.word}'.`
      });

      await speakEnglish(`Try again! This is ${currentQ.target.article} ${currentQ.target.word}.`);
      await new Promise(r => setTimeout(r, 450));
    }

    if (quizIndex + 1 >= 10) {
      setIsQuizFinished(true);
      playSoundEffect('fanfare');
      await speakEnglish(`Great job! You scored ${quizScore + (isCorrect ? 1 : 0)} out of 10!`);
      isSpeakingRef.current = false;
    } else {
      setQuizIndex(prev => prev + 1);
      setFeedback(null);
      isSpeakingRef.current = false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 select-none font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-5 rounded-3xl shadow-lg mb-6 flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📖</span>
            <h1 className="text-xl md:text-2xl font-black">CVC सचित्र शब्दकोश व खेल (CVC Words Lab)</h1>
          </div>
          <p className="text-xs md:text-sm text-teal-100 font-semibold">
            Meaningful 3-Letter Words • Phonics Audio • 10-Question Picture Challenge
          </p>
        </div>

        {/* Global Action Selector */}
        <div className="flex bg-white/20 p-1.5 rounded-2xl backdrop-blur-md gap-1">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'menu' ? 'bg-white text-teal-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <Home className="w-3.5 h-3.5" /> मेन्यू (Menu)
          </button>
          <button
            onClick={() => {
              setSelectedVowel('A');
              setCarouselIndex(0);
              setActiveTab('learn');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'learn' ? 'bg-white text-teal-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> सीखो (Learn)
          </button>
          <button
            onClick={startPlayGame}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'play' ? 'bg-white text-teal-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <Play className="w-3.5 h-3.5" /> खेलो (Play Quiz)
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. MAIN CHOICE MENU (LEARN OR PLAY)                            */}
      {/* ============================================================== */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card: Learn Mode */}
          <div className="bg-white border-2 border-teal-200 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between items-center text-center">
            <div>
              <div className="w-20 h-20 bg-teal-100 text-teal-700 rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-inner mx-auto">
                📚
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">शब्द सीखो (Learn CVC Words)</h2>
              <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed">
                स्वर (Vowel) चुनें: <strong>A, E, I, O, U</strong>। हर शब्द की असली तस्वीर, हिंदी अर्थ और फोनिक्स ध्वनि एक-एक करके देखें।
              </p>
            </div>

            <div className="w-full">
              <span className="text-xs font-bold text-slate-500 mb-3 block">स्वर चुनें (Select Vowel):</span>
              <div className="flex justify-center gap-2 mb-5">
                {VOWELS.map(v => (
                  <button
                    key={v}
                    onClick={() => {
                      setSelectedVowel(v);
                      setCarouselIndex(0);
                      setActiveTab('learn');
                    }}
                    className="w-12 h-12 bg-teal-50 hover:bg-teal-600 hover:text-white border-2 border-teal-300 rounded-2xl font-black text-lg text-teal-900 shadow-sm transition active:scale-95 cursor-pointer flex items-center justify-center"
                  >
                    {v}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedVowel('A');
                  setCarouselIndex(0);
                  setActiveTab('learn');
                }}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> सचित्र शब्दकोश खोलें ➔
              </button>
            </div>
          </div>

          {/* Card: Play Quiz Mode */}
          <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between items-center text-center">
            <div>
              <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-inner mx-auto">
                🎮
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">क्विज़ खेलो (Play 10-Picture Game)</h2>
              <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed">
                सभी स्वरों से 10 बिना दोहराव वाले चित्र आएंगे। सही CVC स्पेलिंग पहचानें और 10 में से अपना स्कोर देखें!
              </p>
            </div>

            <div className="w-full">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-5 text-left text-xs font-semibold text-indigo-900 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>सही उत्तर पर विजय धुन: <strong>"This is a/an [word]"</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>गलत उत्तर पर कोमल टोन व सही उत्तर का उच्चारण</span>
                </div>
              </div>

              <button
                onClick={startPlayGame}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" /> 10-प्रश्नों का गेम शुरू करें ➔
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 2. LEARN MODE: VOWEL MENU & IMAGE CAROUSEL                     */}
      {/* ============================================================== */}
      {activeTab === 'learn' && currentWord && (
        <div className="bg-white border-2 border-teal-200 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col items-center">
          
          {/* Top Bar: Vowel Switcher & Back Button */}
          <div className="w-full flex justify-between items-center mb-5 flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('menu')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> मुख्य मेन्यू (Menu)
            </button>

            {/* Vowel Pills */}
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {VOWELS.map(v => (
                <button
                  key={v}
                  onClick={() => {
                    setSelectedVowel(v);
                    setCarouselIndex(0);
                  }}
                  className={`px-3 py-1 rounded-xl font-black text-xs transition cursor-pointer ${
                    selectedVowel === v ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  स्वर {v}
                </button>
              ))}
            </div>

            <span className="text-xs font-black text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
              शब्द: {carouselIndex + 1} / {filteredWords.length}
            </span>
          </div>

          {/* Flashcard Visual Frame */}
          <div className="w-full max-w-md bg-stone-50 border-2 border-teal-300 rounded-3xl p-5 text-center shadow-inner flex flex-col items-center mb-6">
            
            {/* Real Image of the CVC Meaning */}
            <div className="w-full h-52 md:h-60 rounded-2xl overflow-hidden mb-4 border border-teal-200 shadow relative bg-white flex items-center justify-center">
              <img
                src={currentWord.imageUrl}
                alt={currentWord.word}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <span className="absolute bottom-2 right-2 text-2xl bg-white/80 p-1 rounded-xl shadow-sm">
                {currentWord.emoji}
              </span>
            </div>

            {/* CVC Word in Big Lowercase Font */}
            <div className="flex items-center justify-center gap-3 my-1">
              <span className="text-5xl md:text-6xl font-black text-teal-950 font-mono tracking-wider">
                {currentWord.word}
              </span>
              <button
                onClick={() => speakEnglish(`This is ${currentWord.article} ${currentWord.word}. ${currentWord.phonics}.`)}
                className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition cursor-pointer shadow-md"
                title="आवाज़ सुनें"
              >
                <Volume2 className="w-6 h-6 animate-pulse" />
              </button>
            </div>

            {/* Phonics & Hindi Meaning Anchors */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="text-xs font-extrabold text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                फोनिक्स: {currentWord.phonics}
              </span>
              <span className="text-xs font-extrabold text-slate-800 bg-amber-100 px-3 py-1 rounded-full">
                अर्थ: {currentWord.hindiMeaning}
              </span>
            </div>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="w-full max-w-md flex justify-between items-center gap-3">
            <button
              onClick={() => setCarouselIndex(prev => (prev > 0 ? prev - 1 : filteredWords.length - 1))}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> पिछला शब्द
            </button>

            <button
              onClick={() => speakEnglish(`This is ${currentWord.article} ${currentWord.word}`)}
              className="py-3 px-5 bg-teal-100 hover:bg-teal-200 text-teal-900 font-extrabold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" /> दोहराएं
            </button>

            <button
              onClick={() => setCarouselIndex(prev => (prev < filteredWords.length - 1 ? prev + 1 : 0))}
              className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-2xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              अगला शब्द <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 3. PLAY MODE: 10-PICTURE QUIZ GAME                             */}
      {/* ============================================================== */}
      {activeTab === 'play' && quizQuestions.length > 0 && !isQuizFinished && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col items-center">
          
          {/* Quiz Top Status */}
          <div className="w-full flex justify-between items-center mb-4 bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> मेन्यू पर जाएं
            </button>
            <span className="text-xs font-black text-indigo-950 bg-white border border-indigo-200 px-3 py-1 rounded-full shadow-sm">
              प्रश्न: {quizIndex + 1} / 10
            </span>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              स्कोर: {quizScore} / 10
            </span>
          </div>

          {/* Picture Challenge Card */}
          <div className="w-full max-w-md bg-stone-50 border-2 border-indigo-200 rounded-3xl p-4 text-center shadow-inner flex flex-col items-center mb-5">
            <div className="w-full h-56 md:h-64 rounded-2xl overflow-hidden mb-3 border border-indigo-200 shadow relative bg-white flex items-center justify-center">
              <img
                src={quizQuestions[quizIndex].target.imageUrl}
                alt="Identify this CVC word"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 right-2 text-3xl bg-white/80 p-1.5 rounded-2xl shadow-sm">
                {quizQuestions[quizIndex].target.emoji}
              </span>
            </div>

            <span className="text-xs font-black text-indigo-900 block mb-0.5">
              चित्र देखकर सही 3-अक्षर शब्द (CVC) चुनें:
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              (संकेत: {quizQuestions[quizIndex].target.hindiMeaning})
            </span>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div className={`w-full max-w-md p-3 rounded-2xl border-2 text-center text-xs md:text-sm font-black mb-4 flex items-center justify-center gap-2 animate-in fade-in ${
              feedback.isCorrect ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-rose-50 border-rose-400 text-rose-950'
            }`}>
              {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* 3 Word Options */}
          <div className="w-full max-w-md grid grid-cols-3 gap-3">
            {quizQuestions[quizIndex].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswerSelect(opt)}
                className="py-4 bg-white hover:bg-indigo-600 hover:text-white border-2 border-indigo-300 hover:border-indigo-600 rounded-2xl font-mono text-2xl font-black text-slate-800 shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center"
              >
                {opt}
              </button>
            ))}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 4. FINAL SCORECARD (AFTER 10 QUESTIONS)                        */}
      {/* ============================================================== */}
      {activeTab === 'play' && isQuizFinished && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 text-center shadow-xl flex flex-col items-center animate-in zoom-in-95">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-3">
            🏆
          </div>

          <h2 className="text-2xl font-black text-indigo-950 mb-1">खेल पूरा हुआ! (Quiz Completed)</h2>
          <p className="text-xs text-slate-600 font-semibold mb-6">
            NEP 2020 CVC Foundational Word Mastery
          </p>

          {/* Score Snapshot */}
          <div className="w-full max-w-sm bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 mb-6 flex justify-around items-center">
            <div>
              <span className="text-xs font-bold text-slate-500 block">कुल स्कोर</span>
              <span className="text-3xl font-black text-emerald-600">{quizScore} / 10</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 block">सटीकता</span>
              <span className="text-3xl font-black text-indigo-950">{Math.round((quizScore / 10) * 100)}%</span>
            </div>
          </div>

          {/* Review of Missed Words */}
          {missedWords.length > 0 && (
            <div className="w-full max-w-md text-left mb-6 bg-rose-50 border border-rose-200 p-4 rounded-2xl">
              <h4 className="text-xs font-black text-rose-900 mb-2">जिन शब्दों का पुनः अभ्यास करना है:</h4>
              <div className="flex flex-wrap gap-2">
                {missedWords.map((item, idx) => (
                  <span key={idx} className="bg-white border border-rose-300 px-3 py-1 rounded-xl text-xs font-black text-rose-800 shadow-sm flex items-center gap-1.5">
                    <span>{item.emoji}</span>
                    <span>{item.word}</span>
                    <span className="text-[10px] text-slate-500">({item.hindiMeaning})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={startPlayGame}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> पुनः नया गेम खेलें
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" /> मुख्य मेन्यू
            </button>
          </div>

        </div>
      )}

    </div>
  );
}