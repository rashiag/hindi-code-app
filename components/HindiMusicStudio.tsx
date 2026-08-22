'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Trophy, Star, Music2, Sparkles, CheckCircle2 } from 'lucide-react';

interface PianoKey {
  note: string;
  swar: string;
  western: string;
  freq: number;
  isBlack: boolean;
  offsetPercent?: number; // for positioning black keys
}

const PIANO_KEYS: PianoKey[] = [
  // White keys
  { note: 'C4', swar: 'सा', western: 'C', freq: 261.63, isBlack: false },
  { note: 'D4', swar: 'रे', western: 'D', freq: 293.66, isBlack: false },
  { note: 'E4', swar: 'ग', western: 'E', freq: 329.63, isBlack: false },
  { note: 'F4', swar: 'म', western: 'F', freq: 349.23, isBlack: false },
  { note: 'G4', swar: 'प', western: 'G', freq: 392.00, isBlack: false },
  { note: 'A4', swar: 'ध', western: 'A', freq: 440.00, isBlack: false },
  { note: 'B4', swar: 'नि', western: 'B', freq: 493.88, isBlack: false },
  { note: 'C5', swar: 'सां', western: 'C', freq: 523.25, isBlack: false },
];

const BLACK_KEYS: PianoKey[] = [
  { note: 'Db4', swar: 'रे॒', western: 'C#', freq: 277.18, isBlack: true, offsetPercent: 8.5 },
  { note: 'Eb4', swar: 'ग॒', western: 'D#', freq: 311.13, isBlack: true, offsetPercent: 21.0 },
  { note: 'Fs4', swar: 'म॑', western: 'F#', freq: 369.99, isBlack: true, offsetPercent: 46.0 },
  { note: 'Ab4', swar: 'ध॒', western: 'G#', freq: 415.30, isBlack: true, offsetPercent: 58.5 },
  { note: 'Bb4', swar: 'नि॒', western: 'A#', freq: 466.16, isBlack: true, offsetPercent: 71.0 },
];

interface SongTutorial {
  id: string;
  title: string;
  hindiTitle: string;
  emoji: string;
  sequence: string[]; // array of notes
}

const SONG_LIBRARY: SongTutorial[] = [
  {
    id: 'sargam',
    title: 'Sargam Scale (सा रे ग म)',
    hindiTitle: 'सा रे ग म प ध नि सां',
    emoji: '🎵',
    sequence: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
  },
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    hindiTitle: 'ट्विंकल ट्विंकल लिटिल स्टार',
    emoji: '⭐',
    sequence: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4']
  },
  {
    id: 'birthday',
    title: 'Happy Birthday to You',
    hindiTitle: 'जन्मदिन की बधाई धुन',
    emoji: '🎂',
    sequence: ['C4', 'C4', 'D4', 'C4', 'F4', 'E4', 'C4', 'C4', 'D4', 'C4', 'G4', 'F4']
  },
  {
    id: 'saare_jahan',
    title: 'Saare Jahan Se Achha',
    hindiTitle: 'सारे जहाँ से अच्छा',
    emoji: '🇮🇳',
    sequence: ['C4', 'D4', 'E4', 'C4', 'D4', 'E4', 'F4', 'E4', 'D4', 'C4']
  }
];

export function HindiMusicStudio() {
  const [activeNote, setActiveNote] = useState<string | null>(null);
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

      // Triangle wave replicates warm piano/harmonium acoustic tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  const handleKeyPress = (key: PianoKey) => {
    playTone(key.freq);
    setActiveNote(key.note);
    setTimeout(() => setActiveNote(null), 200);

    // Follow-the-light tutorial matching
    if (selectedSong && !isCompleted) {
      const targetNote = selectedSong.sequence[tutorialIndex];
      if (key.note === targetNote) {
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

  const currentTargetNote = selectedSong && !isCompleted ? selectedSong.sequence[tutorialIndex] : null;
  const currentTargetObj = [...PIANO_KEYS, ...BLACK_KEYS].find((k) => k.note === currentTargetNote);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-purple-50/80 p-4 rounded-2xl border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center text-xl shadow-md">
            🎹
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-purple-950">स्वर पियानो (Acoustic Piano &amp; Swar Studio)</h1>
            <p className="text-xs md:text-sm font-semibold text-purple-800">
              वास्तविक पियानो की-बोर्ड पर सा रे ग म व सरल धुनें बजाएँ • Real Piano Key Layout
            </p>
          </div>
        </div>

        {selectedSong && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-purple-300 shadow-sm">
            <span className="text-xs font-black text-purple-900">प्रगति:</span>
            <span className="text-xs font-extrabold text-purple-700">
              {tutorialIndex}/{selectedSong.sequence.length}
            </span>
          </div>
        )}
      </div>

      {/* Main Studio Frame */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-purple-200 shadow-xl flex flex-col items-center">
        
        {/* Song Selector */}
        <div className="w-full mb-8">
          <p className="text-center text-xs font-bold text-slate-500 mb-3">
            धुन चुनें या स्वतंत्रता से बजाएँ (Select a melody to learn):
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

        {/* Next Note Guidance Bar */}
        {selectedSong && !isCompleted && currentTargetObj && (
          <div className="w-full max-w-lg bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mb-8 text-center flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3 text-left">
              <span className="text-2xl">{selectedSong.emoji}</span>
              <div>
                <span className="block text-xs font-extrabold text-amber-950">अगली कुंजी दबाएँ (Press Next Key):</span>
                <span className="text-xl font-black text-amber-900">
                  {currentTargetObj.swar} • {currentTargetObj.western} ({currentTargetObj.note})
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

        {/* Completion Card */}
        {isCompleted && (
          <div className="w-full max-w-md bg-gradient-to-b from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-300 p-6 mb-8 text-center shadow-md animate-in zoom-in-95">
            <span className="text-4xl block mb-2">🎉</span>
            <h3 className="text-lg font-black text-purple-950 mb-1">शानदार! आपने पूरी धुन बजा ली!</h3>
            <p className="text-xs font-bold text-purple-800 mb-4">You successfully performed {selectedSong?.title}!</p>
            <button
              onClick={handleReset}
              className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
            >
              पुनः अभ्यास करें (Practice Again)
            </button>
          </div>
        )}

        {/* Realistic Piano Keyboard Container */}
        <div className="relative bg-slate-900 p-4 md:p-6 rounded-3xl shadow-2xl border-4 border-slate-800 max-w-2xl w-full select-none overflow-hidden">
          
          {/* Top Wooden / Acoustic Felt Rail */}
          <div className="w-full h-4 bg-red-950 rounded-t-md mb-2 border-b-2 border-red-900 shadow-inner flex items-center justify-center">
            <div className="w-full h-1 bg-red-800 opacity-60" />
          </div>

          {/* Key Deck */}
          <div className="relative flex w-full h-56 md:h-64 justify-between bg-slate-950 p-1 rounded-b-xl">
            
            {/* White Keys */}
            {PIANO_KEYS.map((key) => {
              const isTarget = currentTargetNote === key.note;
              const isPressed = activeNote === key.note;

              return (
                <button
                  key={key.note}
                  onClick={() => handleKeyPress(key)}
                  className={`relative flex-1 h-full mx-0.5 rounded-b-lg flex flex-col justify-end items-center pb-4 transition-all duration-75 cursor-pointer border-t border-slate-200 ${
                    isPressed
                      ? 'bg-amber-100 shadow-inner translate-y-1'
                      : isTarget
                      ? 'bg-amber-100 ring-4 ring-amber-400 animate-pulse'
                      : 'bg-white hover:bg-slate-50 shadow-[0_6px_0_#94a3b8,0_10px_10px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  {/* Western Note */}
                  <span className="text-[10px] md:text-xs font-black text-slate-400 mb-1">{key.western}</span>
                  {/* Indian Swar */}
                  <span className="text-xl md:text-2xl font-black text-slate-800">{key.swar}</span>
                  {/* Key Accent */}
                  <span className="w-2 h-2 rounded-full bg-slate-200 mt-1" />
                </button>
              );
            })}

            {/* Realistic Black Keys (Overlaid) */}
            {BLACK_KEYS.map((key) => {
              const isTarget = currentTargetNote === key.note;
              const isPressed = activeNote === key.note;

              return (
                <button
                  key={key.note}
                  onClick={() => handleKeyPress(key)}
                  style={{ left: `${key.offsetPercent}%` }}
                  className={`absolute top-0 w-8 md:w-11 h-34 md:h-38 rounded-b-md flex flex-col justify-end items-center pb-3 z-20 transition-all duration-75 cursor-pointer border-t border-slate-700 ${
                    isPressed
                      ? 'bg-slate-800 translate-y-1 shadow-inner'
                      : isTarget
                      ? 'bg-amber-500 ring-4 ring-amber-300 animate-pulse text-slate-950'
                      : 'bg-gradient-to-b from-slate-900 via-slate-800 to-black shadow-[0_4px_0_#0f172a,0_8px_12px_rgba(0,0,0,0.6)] text-white'
                  }`}
                >
                  <span className="text-[9px] font-extrabold opacity-70 mb-0.5">{key.western}</span>
                  <span className="text-xs md:text-sm font-black">{key.swar}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Felt Strip */}
          <div className="w-full h-1 bg-slate-800 rounded-b mt-1" />
        </div>

        {/* Musical Harmony Explainer Footer */}
        <div className="w-full max-w-2xl mt-6 bg-purple-50/50 rounded-2xl p-4 border border-purple-200 flex items-center justify-around text-center text-xs font-bold text-purple-900">
          <div>
            <span className="block text-slate-500">शुद्ध स्वर (Natural Keys)</span>
            <span className="text-base text-purple-950">सा रे ग म प ध नि</span>
          </div>
          <div className="w-px h-8 bg-purple-200" />
          <div>
            <span className="block text-slate-500">विकृत स्वर (Accidentals)</span>
            <span className="text-base text-purple-950">रे॒ ग॒ म॑ ध॒ नि॒</span>
          </div>
          <div className="w-px h-8 bg-purple-200" />
          <div>
            <span className="block text-slate-500">Western Octave</span>
            <span className="text-base text-purple-950">C D E F G A B C</span>
          </div>
        </div>

      </div>
    </div>
  );
}