'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Award, Star, Music2, Sparkles, CheckCircle2, ListMusic } from 'lucide-react';

interface KeyConfig {
  id: string;
  swar: string;
  hindiLabel: string;
  subText: string;
  freq: number;
  isBlack: boolean;
  leftPercent?: number;
}

// 9 White Keys spanning Mandra Ni to Taar Komal Re
const WHITE_KEYS: KeyConfig[] = [
  { id: 'C4', swar: 'Ni', hindiLabel: 'नि', subText: '', freq: 261.63, isBlack: false },
  { id: 'D4', swar: 'Re_', hindiLabel: 'रे॒', subText: '(komal)', freq: 293.66, isBlack: false },
  { id: 'E4', swar: 'Ga_', hindiLabel: 'ग॒', subText: '(komal)', freq: 329.63, isBlack: false },
  { id: 'F4', swar: 'Ga', hindiLabel: 'ग', subText: '', freq: 349.23, isBlack: false },
  { id: 'G4', swar: 'Ma', hindiLabel: 'म॑', subText: '(Tivra)', freq: 392.00, isBlack: false },
  { id: 'A4', swar: 'Da_', hindiLabel: 'ध॒', subText: '(komal)', freq: 440.00, isBlack: false },
  { id: 'B4', swar: 'Ni_', hindiLabel: 'नि॒', subText: '(komal)', freq: 493.88, isBlack: false },
  { id: 'C5', swar: 'Ni', hindiLabel: 'नि', subText: '', freq: 523.25, isBlack: false },
  { id: 'D5', swar: 'Re', hindiLabel: 'रें॒', subText: '(komal)', freq: 587.33, isBlack: false }
];

// 7 Black Keys spanning Sa to Taar Re
const BLACK_KEYS: KeyConfig[] = [
  { id: 'Db4', swar: 'Sa', hindiLabel: 'सा', subText: 'सा', freq: 277.18, isBlack: true, leftPercent: 6.8 },
  { id: 'Eb4', swar: 'Re', hindiLabel: 'रे', subText: 'रे', freq: 311.13, isBlack: true, leftPercent: 18.0 },
  { id: 'Fs4', swar: 'Ma', hindiLabel: 'म', subText: 'म', freq: 369.99, isBlack: true, leftPercent: 40.2 },
  { id: 'Ab4', swar: 'Pa', hindiLabel: 'प', subText: 'प', freq: 415.30, isBlack: true, leftPercent: 51.3 },
  { id: 'Bb4', swar: 'Da', hindiLabel: 'ध', subText: 'ध', freq: 466.16, isBlack: true, leftPercent: 62.4 },
  { id: 'Db5', swar: 'Sa.', hindiLabel: 'सां', subText: 'सां', freq: 554.37, isBlack: true, leftPercent: 84.6 },
  { id: 'Eb5', swar: 'Re.', hindiLabel: 'रें', subText: 'रें', freq: 622.25, isBlack: true, leftPercent: 95.8 }
];

interface SongTutorial {
  id: string;
  title: string;
  hindiTitle: string;
  emoji: string;
  sequence: string[];
  lyrics: string[];
}

const SONG_LIBRARY: SongTutorial[] = [
  {
    id: 'jana_gana_mana',
    title: 'Jana Gana Mana (National Anthem)',
    hindiTitle: '🇮🇳 जन गण मन (राष्ट्रगान)',
    emoji: '🇮🇳',
    sequence: [
      // जन गण मन अधिनायक जय हे
      'Db4', 'Eb4', 'F4', 'F4', 'F4', 'F4', 'F4', 'F4', 'F4', 'F4', 'Eb4', 'F4', 'Fs4',
      // भारत भाग्य विधाता
      'F4', 'F4', 'F4', 'Eb4', 'Eb4', 'Eb4', 'C4', 'Eb4', 'Db4',
      // पंजाब सिन्धु गुजरात मराठा
      'Db4', 'Ab4', 'Ab4', 'Ab4', 'Ab4', 'Ab4', 'Ab4', 'G4', 'Ab4', 'Fs4',
      // द्राविड़ उत्कल बंग
      'F4', 'F4', 'F4', 'Eb4', 'Fs4', 'F4',
      // जय हे, जय हे, जय हे
      'Db5', 'Db5', 'C5', 'Bb4', 'C5',
      // जय जय जय जय हे
      'Db4', 'Eb4', 'F4', 'F4', 'Eb4', 'F4', 'Fs4'
    ],
    lyrics: [
      'ज', 'न', 'ग', 'ण', 'म', 'न', 'अ', 'धि', 'ना', 'य', 'क', 'ज', 'य',
      'भा', 'र', 'त', 'भा', 'ग्य', 'वि', 'धा', 'ता',
      'पं', 'जा', 'ब', 'सि', 'न्धु', 'गु', 'ज', 'रा', 'त', 'म',
      'द्रा', 'वि', 'ड़', 'उ', 'त्क', 'ल',
      'ज', 'य', 'हे', 'ज', 'य',
      'ज', 'य', 'ज', 'य', 'ज', 'य', 'हे'
    ]
  },
  {
    id: 'lakdi_ki_kathi',
    title: 'Lakdi Ki Kaathi (Full Melody)',
    hindiTitle: '🐎 लकड़ी की काठी',
    emoji: '🪵',
    sequence: [
      // लकड़ी की काठी
      'F4', 'F4', 'F4', 'Eb4', 'Db4',
      // काठी पे घोड़ा
      'F4', 'F4', 'F4', 'Eb4', 'Db4',
      // घोड़े की दुम पे जो मारा हथौड़ा
      'Fs4', 'Fs4', 'Fs4', 'Fs4', 'Fs4', 'F4', 'Eb4', 'Db4', 'Eb4', 'F4',
      // दौड़ा दौड़ा दौड़ा घोड़ा दुम उठा के दौड़ा
      'Ab4', 'Ab4', 'Ab4', 'Ab4', 'Fs4', 'F4', 'Eb4', 'Db4', 'Eb4', 'Db4'
    ],
    lyrics: [
      'लक', 'ड़ी', 'की', 'का', 'ठी',
      'का', 'ठी', 'पे', 'घो', 'ड़ा',
      'घो', 'ड़े', 'की', 'दुम', 'पे', 'जो', 'मा', 'रा', 'ह', 'थौड़ा',
      'दौ', 'ड़ा', 'दौ', 'ड़ा', 'घो', 'ड़ा', 'दुम', 'उ', 'ठा', 'के'
    ]
  },
  {
    id: 'saare_jahan',
    title: 'Saare Jahan Se Achha (Extended)',
    hindiTitle: '🕊️ सारे जहाँ से अच्छा',
    emoji: '🇮🇳',
    sequence: [
      // सारे जहाँ से अच्छा
      'Db4', 'Eb4', 'F4', 'Db4', 'Eb4', 'F4', 'Fs4', 'F4',
      // हिन्दोस्ताँ हमारा
      'Eb4', 'Db4', 'Eb4', 'Db4', 'C4', 'Db4',
      // हम बुलबुलें हैं इसकी
      'F4', 'Fs4', 'Ab4', 'Ab4', 'Bb4', 'Ab4', 'Fs4', 'F4',
      // ये गुलसितां हमारा हमारा
      'Fs4', 'F4', 'Eb4', 'Db4', 'Eb4', 'Db4'
    ],
    lyrics: [
      'सा', 'रे', 'ज', 'हाँ', 'से', 'अ', 'च्छा', '...',
      'हि', 'न्दो', 'स्ताँ', 'ह', 'मा', 'रा',
      'हम', 'बुल', 'बु', 'लें', 'हैं', 'इस', 'की', '...',
      'ये', 'गुल', 'सि', 'तां', 'ह', 'मा', 'रा'
    ]
  },
  {
    id: 'birthday',
    title: 'Happy Birthday To You (Full Song)',
    hindiTitle: '🎂 जन्मदिन की बधाई',
    emoji: '🎉',
    sequence: [
      // Happy birthday to you
      'Db4', 'Db4', 'Eb4', 'Db4', 'Fs4', 'F4',
      // Happy birthday to you
      'Db4', 'Db4', 'Eb4', 'Db4', 'Ab4', 'Fs4',
      // Happy birthday dear child
      'Db4', 'Db4', 'Db5', 'Bb4', 'Fs4', 'F4', 'Eb4',
      // Happy birthday to you
      'B4', 'B4', 'Bb4', 'Fs4', 'Ab4', 'Fs4'
    ],
    lyrics: [
      'Hap-', 'py', 'birth-', 'day', 'to', 'you',
      'Hap-', 'py', 'birth-', 'day', 'to', 'you',
      'Hap-', 'py', 'birth-', 'day', 'dear', 'one', '...',
      'Hap-', 'py', 'birth-', 'day', 'to', 'you'
    ]
  },
  {
    id: 'sargam_aaroh_avroh',
    title: 'Sargam Aaroh & Avroh (आरोह-अवरोह)',
    hindiTitle: '🎵 संपूर्ण सरगम अभ्यास',
    emoji: '🎼',
    sequence: [
      'Db4', 'Eb4', 'F4', 'Fs4', 'Ab4', 'Bb4', 'C5', 'Db5',
      'Db5', 'C5', 'Bb4', 'Ab4', 'Fs4', 'F4', 'Eb4', 'Db4'
    ],
    lyrics: [
      'सा', 'रे', 'ग', 'म', 'प', 'ध', 'नि', 'सां',
      'सां', 'नि', 'ध', 'प', 'म', 'ग', 'रे', 'सा'
    ]
  }
];

export function HindiMusicStudio() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongTutorial | null>(null);
  const [tutorialIndex, setTutorialIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (freq: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch (e) {
      console.log('Audio tone error:', e);
    }
  };

  const handleKeyPress = (key: KeyConfig) => {
    playTone(key.freq);
    setActiveId(key.id);
    setTimeout(() => setActiveId(null), 200);

    if (selectedSong && !isCompleted) {
      const targetId = selectedSong.sequence[tutorialIndex];
      if (key.id === targetId) {
        if (tutorialIndex + 1 >= selectedSong.sequence.length) {
          setIsCompleted(true);
        } else {
          setTutorialIndex((prev) => prev + 1);
        }
      }
    }
  };

  const handleSelectSong = (song: SongTutorial) => {
    setSelectedSong(song);
    setTutorialIndex(0);
    setIsCompleted(false);
  };

  const handleReset = () => {
    setTutorialIndex(0);
    setIsCompleted(false);
  };

  const currentTargetId = selectedSong && !isCompleted ? selectedSong.sequence[tutorialIndex] : null;
  const currentTargetObj = [...WHITE_KEYS, ...BLACK_KEYS].find((k) => k.id === currentTargetId);
  const currentLyric = selectedSong && selectedSong.lyrics ? selectedSong.lyrics[tutorialIndex] : '';

  return (
    <div className="max-w-5xl mx-auto p-3 md:p-6 font-sans select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-purple-50/80 p-4 rounded-2xl border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center text-xl shadow-md">
            🎹
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-purple-950">स्वर हारमोनियम व पियानो (Kids Music &amp; Song Lab)</h1>
            <p className="text-xs md:text-sm font-semibold text-purple-800">
              राष्ट्रगान व बाल-गीतों का संपूर्ण स्वर अभ्यास • Complete Song Melodies
            </p>
          </div>
        </div>

        {selectedSong && (
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-purple-300 shadow-sm">
            <span className="text-xs font-black text-purple-900">स्वर प्रगति:</span>
            <span className="text-xs font-extrabold text-purple-700">
              {tutorialIndex}/{selectedSong.sequence.length}
            </span>
          </div>
        )}
      </div>

      {/* Main Studio Card */}
      <div className="bg-white rounded-3xl p-4 md:p-8 border-2 border-purple-200 shadow-xl flex flex-col items-center">
        
        {/* Song Selector */}
        <div className="w-full mb-6">
          <p className="text-center text-xs font-bold text-slate-500 mb-3">
            बजाने के लिए गीत या सरगम चुनें (Select a complete song):
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => { setSelectedSong(null); setIsCompleted(false); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                selectedSong === null ? 'bg-purple-600 text-white shadow' : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              🎹 स्वतंत्र वादन (Free Play)
            </button>
            {SONG_LIBRARY.map((song) => (
              <button
                key={song.id}
                onClick={() => handleSelectSong(song)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedSong?.id === song.id
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <span>{song.emoji}</span>
                <span>{song.hindiTitle}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Lyric & Note Guidance Prompt */}
        {selectedSong && !isCompleted && currentTargetObj && (
          <div className="w-full max-w-xl bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3 text-left">
              <span className="text-3xl">{selectedSong.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-amber-950">गीत के बोल (Lyrics):</span>
                  {currentLyric && (
                    <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md text-xs font-black">
                      "{currentLyric}"
                    </span>
                  )}
                </div>
                <span className="text-xl md:text-2xl font-black text-amber-900">
                  दबाएं: {currentTargetObj.swar} ({currentTargetObj.hindiLabel} {currentTargetObj.subText})
                </span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Completion Modal Card */}
        {isCompleted && (
          <div className="w-full max-w-md bg-gradient-to-b from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-300 p-6 mb-6 text-center shadow-md animate-in zoom-in-95">
            <span className="text-5xl block mb-2">🏆</span>
            <h3 className="text-xl font-black text-purple-950 mb-1">अद्भुत प्रदर्शन! पूरा गीत बजा लिया!</h3>
            <p className="text-xs font-bold text-purple-800 mb-4">
              You successfully mastered {selectedSong?.title}!
            </p>
            <button
              onClick={handleReset}
              className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
            >
              पुनः बजाएं (Play Again)
            </button>
          </div>
        )}

        {/* Exact Layout Harmonium & Piano Deck */}
        <div className="relative bg-gradient-to-b from-stone-900 to-stone-950 p-4 md:p-6 rounded-3xl shadow-2xl border-4 border-stone-800 w-full max-w-4xl select-none overflow-x-auto">
          
          {/* Top Bellow Strip */}
          <div className="w-full h-3.5 bg-amber-950 rounded-t-md mb-2 border-b border-amber-900/80 flex items-center justify-center">
            <div className="w-full h-0.5 bg-amber-600/40" />
          </div>

          {/* Key Deck */}
          <div className="relative flex w-full min-w-[620px] h-60 md:h-68 justify-between bg-stone-950 p-1 rounded-b-xl">
            
            {/* 9 White Keys */}
            {WHITE_KEYS.map((key) => {
              const isTarget = currentTargetId === key.id;
              const isPressed = activeId === key.id;

              return (
                <button
                  key={key.id}
                  onClick={() => handleKeyPress(key)}
                  className={`relative flex-1 h-full mx-0.5 rounded-b-lg flex flex-col justify-end items-center pb-3 transition-all duration-75 cursor-pointer border-t-2 border-stone-300 ${
                    isPressed
                      ? 'bg-amber-100 translate-y-1 shadow-inner'
                      : isTarget
                      ? 'bg-amber-100 ring-4 ring-amber-400 animate-pulse'
                      : 'bg-white hover:bg-stone-50 shadow-[0_5px_0_#cbd5e1,0_8px_10px_rgba(0,0,0,0.35)]'
                  }`}
                >
                  <span className="text-xl md:text-2xl font-black text-stone-900 leading-none">
                    {key.swar}
                  </span>
                  <span className="text-[11px] md:text-xs font-bold text-stone-600 mt-1">
                    {key.hindiLabel} {key.subText}
                  </span>
                </button>
              );
            })}

            {/* 7 Black Keys */}
            {BLACK_KEYS.map((key) => {
              const isTarget = currentTargetId === key.id;
              const isPressed = activeId === key.id;

              return (
                <button
                  key={key.id}
                  onClick={() => handleKeyPress(key)}
                  style={{ left: `${key.leftPercent}%` }}
                  className={`absolute top-0 w-10 md:w-13 h-36 md:h-42 rounded-b-md flex flex-col justify-end items-center pb-3 z-20 transition-all duration-75 cursor-pointer border-t border-stone-700 ${
                    isPressed
                      ? 'bg-stone-800 translate-y-1 shadow-inner'
                      : isTarget
                      ? 'bg-amber-500 ring-4 ring-amber-300 animate-pulse text-stone-950'
                      : 'bg-gradient-to-b from-stone-900 via-stone-950 to-black shadow-[0_4px_0_#0f172a,0_8px_12px_rgba(0,0,0,0.7)] text-white'
                  }`}
                >
                  <span className={`text-[11px] font-black ${key.swar.includes('.') ? 'text-red-400' : 'text-stone-300'}`}>
                    {key.hindiLabel}
                  </span>
                  <span className={`text-sm md:text-base font-black leading-tight mt-0.5 ${key.swar.includes('.') ? 'text-red-400' : 'text-white'}`}>
                    {key.swar}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="w-full h-1 bg-stone-800 rounded-b mt-1" />
        </div>

      </div>
    </div>
  );
}