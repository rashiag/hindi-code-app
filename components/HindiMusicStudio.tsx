'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Music, Play, RotateCcw, Sparkles, Award, Star } from 'lucide-react';

interface NoteKey {
  note: string;
  swar: string;
  hindiName: string;
  freq: number;
  color: string;
  activeColor: string;
}

const PIANO_KEYS: NoteKey[] = [
  { note: 'C4', swar: 'सा', hindiName: 'Shadja (Sa)', freq: 261.63, color: 'bg-rose-500 hover:bg-rose-600 text-white', activeColor: 'bg-rose-400 scale-95 ring-4 ring-rose-300' },
  { note: 'D4', swar: 'रे', hindiName: 'Rishabh (Re)', freq: 293.66, color: 'bg-orange-500 hover:bg-orange-600 text-white', activeColor: 'bg-orange-400 scale-95 ring-4 ring-orange-300' },
  { note: 'E4', swar: 'ग', hindiName: 'Gandhar (Ga)', freq: 329.63, color: 'bg-amber-500 hover:bg-amber-600 text-white', activeColor: 'bg-amber-400 scale-95 ring-4 ring-amber-300' },
  { note: 'F4', swar: 'म', hindiName: 'Madhyam (Ma)', freq: 349.23, color: 'bg-emerald-500 hover:bg-emerald-600 text-white', activeColor: 'bg-emerald-400 scale-95 ring-4 ring-emerald-300' },
  { note: 'G4', swar: 'प', hindiName: 'Pancham (Pa)', freq: 392.00, color: 'bg-teal-500 hover:bg-teal-600 text-white', activeColor: 'bg-teal-400 scale-95 ring-4 ring-teal-300' },
  { note: 'A4', swar: 'ध', hindiName: 'Dhaivat (Dha)', freq: 440.00, color: 'bg-blue-500 hover:bg-blue-600 text-white', activeColor: 'bg-blue-400 scale-95 ring-4 ring-blue-300' },
  { note: 'B4', swar: 'नि', hindiName: 'Nishad (Ni)', freq: 493.88, color: 'bg-indigo-500 hover:bg-indigo-600 text-white', activeColor: 'bg-indigo-400 scale-95 ring-4 ring-indigo-300' },
  { note: 'C5', swar: 'सां', hindiName: 'Taar Sa', freq: 523.25, color: 'bg-purple-500 hover:bg-purple-600 text-white', activeColor: 'bg-purple-400 scale-95 ring-4 ring-purple-300' },
];

interface SongTutorial {
  id: string;
  title: string;
  hindiTitle: string;
  emoji: string;
  sequence: string[]; // notes
}

const SONG_LIBRARY: SongTutorial[] = [
  {
    id: 'sargam',
    title: 'Sargam Scale (आरोह)',
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
    hindiTitle: 'जन्मदिन की बधाई',
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
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongTutorial | null>(null);
  const [tutorialIndex, setTutorialIndex] = useState<number>(0);
  const [songCompleted, setSongCompleted] = useState<boolean>(false);

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

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // rich musical tone
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  const handleKeyPress = (key: NoteKey) => {
    playTone(key.freq);
    setActiveKey(key.note);
    setTimeout(() => setActiveKey(null), 250);

    // Tutorial tracking
    if (selectedSong && !songCompleted) {
      const targetNote = selectedSong.sequence[tutorialIndex];
      if (key.note === targetNote) {
        if (tutorialIndex + 1 >= selectedSong.sequence.length) {
          setSongCompleted(true);
        } else {
          setTutorialIndex((prev) => prev + 1);
        }
      }
    }
  };

  const handleSelectSong = (song: SongTutorial) => {
    setSelectedSong(song);
    setTutorialIndex(0);
    setSongCompleted(false);
  };

  const handleResetTutorial = () => {
    setTutorialIndex(0);
    setSongCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-purple-50/80 p-4 rounded-2xl border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center text-xl shadow-md">
            🎹
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-purple-950">संगीत व स्वर लैब (Kids Music Studio)</h1>
            <p className="text-xs md:text-sm font-semibold text-purple-800">
              सा रे ग म एवं सरल धुनें बजाना सीखें • Sargam &amp; Melody Trainer
            </p>
          </div>
        </div>

        {selectedSong && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-purple-300 shadow-sm">
            <span className="text-xs font-black text-purple-900">गीत प्रगति:</span>
            <span className="text-xs font-extrabold text-purple-700">
              {tutorialIndex}/{selectedSong.sequence.length}
            </span>
          </div>
        )}
      </div>

      {/* Main Piano Board */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-purple-200 shadow-xl flex flex-col items-center">
        
        {/* Song Selector Pills */}
        <div className="w-full mb-8">
          <p className="text-center text-xs font-bold text-slate-500 mb-3">
            धुन चुनें और रोशनी का अनुसरण करें (Select a song to practice):
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => { setSelectedSong(null); setSongCompleted(false); }}
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

        {/* Tutorial Guide Banner */}
        {selectedSong && !songCompleted && (
          <div className="w-full max-w-lg bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mb-8 text-center flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2 text-left">
              <span className="text-2xl">{selectedSong.emoji}</span>
              <div>
                <span className="block text-xs font-extrabold text-amber-950">अगला स्वर बजाएं (Play Next Note):</span>
                <span className="text-lg font-black text-amber-900">
                  {PIANO_KEYS.find((k) => k.note === selectedSong.sequence[tutorialIndex])?.swar} ({selectedSong.sequence[tutorialIndex]})
                </span>
              </div>
            </div>
            <button
              onClick={handleResetTutorial}
              className="p-2 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Song Complete Celebration Card */}
        {songCompleted && (
          <div className="w-full max-w-md bg-gradient-to-b from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-300 p-6 mb-8 text-center shadow-md animate-in zoom-in-95">
            <span className="text-4xl block mb-2">🎉</span>
            <h3 className="text-lg font-black text-purple-950 mb-1">अद्भुत! धुन पूरी हो गई!</h3>
            <p className="text-xs font-bold text-purple-800 mb-4">You successfully played {selectedSong?.title}!</p>
            <button
              onClick={handleResetTutorial}
              className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
            >
              पुनः बजाएं (Play Again)
            </button>
          </div>
        )}

        {/* 8-Key Swar Piano */}
        <div className="flex items-end justify-center gap-2 md:gap-3 p-4 bg-slate-900 rounded-3xl shadow-2xl border-4 border-slate-800 w-full max-w-2xl overflow-x-auto">
          {PIANO_KEYS.map((key) => {
            const isTarget = selectedSong && !songCompleted && selectedSong.sequence[tutorialIndex] === key.note;
            const isCurrentActive = activeKey === key.note;

            return (
              <button
                key={key.note}
                onClick={() => handleKeyPress(key)}
                className={`relative w-14 md:w-18 h-48 md:h-56 rounded-2xl flex flex-col justify-between items-center py-4 transition-all duration-150 shadow-lg cursor-pointer ${
                  isTarget ? 'ring-4 ring-amber-400 animate-bounce' : ''
                } ${isCurrentActive ? key.activeColor : key.color}`}
              >
                {/* Note Indicator */}
                <span className="text-xs font-extrabold opacity-80">{key.note}</span>

                {/* Main Swar Display */}
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-black">{key.swar}</span>
                  <span className="text-[10px] font-bold opacity-90 mt-1">{key.hindiName.split(' ')[0]}</span>
                </div>

                {/* Touch Indicator Dot */}
                <span className="w-2.5 h-2.5 rounded-full bg-white/50" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}