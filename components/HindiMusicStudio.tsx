'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, RotateCcw, Trophy, Sparkles, Star, 
  Music, Play, CheckCircle2, Award
} from 'lucide-react';

interface SwarKey {
  id: string;
  swarHi: string;
  noteEn: string;
  freq: number;
  type: 'white' | 'black';
  keyLabel: string;
}

const SWAR_KEYS: SwarKey[] = [
  { id: 'sa', swarHi: 'सा', noteEn: 'C4', freq: 261.63, type: 'white', keyLabel: 'A' },
  { id: 're_k', swarHi: 'रे॒', noteEn: 'C#4', freq: 277.18, type: 'black', keyLabel: 'W' },
  { id: 're', swarHi: 'रे', noteEn: 'D4', freq: 293.66, type: 'white', keyLabel: 'S' },
  { id: 'ga_k', swarHi: 'ग॒', noteEn: 'D#4', freq: 311.13, type: 'black', keyLabel: 'E' },
  { id: 'ga', swarHi: 'ग', noteEn: 'E4', freq: 329.63, type: 'white', keyLabel: 'D' },
  { id: 'ma', swarHi: 'म', noteEn: 'F4', freq: 349.23, type: 'white', keyLabel: 'F' },
  { id: 'ma_t', swarHi: 'म॑', noteEn: 'F#4', freq: 369.99, type: 'black', keyLabel: 'T' },
  { id: 'pa', swarHi: 'प', noteEn: 'G4', freq: 392.00, type: 'white', keyLabel: 'G' },
  { id: 'dha_k', swarHi: 'ध॒', noteEn: 'G#4', freq: 415.30, type: 'black', keyLabel: 'Y' },
  { id: 'dha', swarHi: 'ध', noteEn: 'A4', freq: 440.00, type: 'white', keyLabel: 'H' },
  { id: 'ni_k', swarHi: 'नि॒', noteEn: 'A#4', freq: 466.16, type: 'black', keyLabel: 'U' },
  { id: 'ni', swarHi: 'नि', noteEn: 'B4', freq: 493.88, type: 'white', keyLabel: 'J' },
  { id: 'sa_high', swarHi: 'सां', noteEn: 'C5', freq: 523.25, type: 'white', keyLabel: 'K' }
];

interface SongPattern {
  id: string;
  titleHi: string;
  titleEn: string;
  notes: string[];
}

const PRESET_SONGS: SongPattern[] = [
  {
    id: 'alankar1',
    titleHi: 'सरल अलंकार (Basic Scale)',
    titleEn: 'Ascending Scale (C-Major)',
    notes: ['sa', 're', 'ga', 'ma', 'pa', 'dha', 'ni', 'sa_high']
  },
  {
    id: 'twinkle',
    titleHi: 'ट्विंकल ट्विंकल (Twinkle Twinkle)',
    titleEn: 'Twinkle Twinkle Little Star',
    notes: ['sa', 'sa', 'pa', 'pa', 'dha', 'dha', 'pa']
  },
  {
    id: 'kathi',
    titleHi: 'लकड़ी की काठी (Lakdi Ki Kathi)',
    titleEn: 'Folk Rhythm (Lakdi Ki Kathi)',
    notes: ['sa', 're', 'ga', 'ga', 're', 'ga', 'ma']
  }
];

export function HindiMusicStudio() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [activeSongIdx, setActiveSongIdx] = useState<number>(0);
  const [targetStep, setTargetStep] = useState<number>(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [songComplete, setSongComplete] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const stopAllSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    return () => stopAllSpeech();
  }, []);

  const playSynthNote = (freq: number) => {
    if (typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Reed/Harmonium-like wave character
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {}
  };

  const speakVoice = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      stopAllSpeech();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      u.rate = 0.88;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  const handleKeyPress = (keyObj: SwarKey) => {
    stopAllSpeech();
    playSynthNote(keyObj.freq);
    setActiveKey(keyObj.id);
    setTimeout(() => setActiveKey(null), 180);

    // Interactive guide match
    const currentSong = PRESET_SONGS[activeSongIdx];
    const expectedKeyId = currentSong.notes[targetStep];

    if (keyObj.id === expectedKeyId) {
      if (targetStep + 1 >= currentSong.notes.length) {
        setSongComplete(true);
        setTargetStep(0);
        speakVoice(lang === 'hi' ? 'बहुत खूब! धुन पूरी हुई!' : 'Fantastic! Melody completed!');
      } else {
        setTargetStep(prev => prev + 1);
      }
    }
  };

  const resetMelody = (idx: number) => {
    stopAllSpeech();
    setActiveSongIdx(idx);
    setTargetStep(0);
    setSongComplete(false);
  };

  const currentSong = PRESET_SONGS[activeSongIdx];
  const targetNoteId = currentSong.notes[targetStep];

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 font-sans select-none">
      
      {/* Top Banner with Bilingual Switcher */}
      <div className="bg-amber-50/80 p-4 md:p-5 rounded-3xl border border-amber-200 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center text-xl shadow-md">
            🎹
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-amber-950">
              {lang === 'hi' ? 'स्वर सरगम व संगीत (Kids Harmonium)' : 'Kids Music & Harmonium Studio'}
            </h1>
            <p className="text-xs md:text-sm font-semibold text-amber-800">
              {lang === 'hi' 
                ? 'शास्त्रीय संगीत सरगम • वेस्टर्न नोट्स • धुन अभ्यास' 
                : 'Indian Classical Swaras, Western Pitch & Guided Melodies (NEP 2020)'}
            </p>
          </div>
        </div>

        {/* BILINGUAL LANGUAGE SWITCHER */}
        <div className="flex bg-white p-1 rounded-xl border border-amber-300 shadow-sm gap-1">
          <button
            onClick={() => {
              stopAllSpeech();
              setLang('hi');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
              lang === 'hi' ? 'bg-orange-600 text-white shadow-sm' : 'text-amber-950 hover:bg-amber-100'
            }`}
          >
            हिंदी (सा-रे-ग)
          </button>
          <button
            onClick={() => {
              stopAllSpeech();
              setLang('en');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
              lang === 'en' ? 'bg-orange-600 text-white shadow-sm' : 'text-amber-950 hover:bg-amber-100'
            }`}
          >
            English (C-D-E)
          </button>
        </div>
      </div>

      {/* Main Studio Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-xl flex flex-col items-center">
        
        {/* Guided Melody Selector */}
        <div className="w-full flex items-center justify-between mb-5 flex-wrap gap-2 pb-3 border-b border-slate-100">
          <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
            <Music className="w-4 h-4 text-orange-600" />
            {lang === 'hi' ? 'सिखाई जाने वाली धुन चुनें:' : 'Select a Guided Melody:'}
          </span>

          <div className="flex gap-1.5 flex-wrap">
            {PRESET_SONGS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => resetMelody(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeSongIdx === idx
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {lang === 'hi' ? s.titleHi : s.titleEn}
              </button>
            ))}
          </div>
        </div>

        {/* Guided Target Indicator */}
        <div className="w-full max-w-lg bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 text-center flex flex-col items-center shadow-inner">
          <span className="text-xs font-bold text-slate-500 mb-1">
            {lang === 'hi' ? 'अगला बजने वाला स्वर:' : 'Next Note to Play:'}
          </span>

          <div className="flex items-center gap-2 my-1">
            <span className="text-4xl font-black text-orange-600 font-mono">
              {lang === 'hi' 
                ? SWAR_KEYS.find(k => k.id === targetNoteId)?.swarHi 
                : SWAR_KEYS.find(k => k.id === targetNoteId)?.noteEn}
            </span>
            <span className="text-xs font-bold text-slate-400">
              ({lang === 'hi' 
                ? SWAR_KEYS.find(k => k.id === targetNoteId)?.noteEn 
                : SWAR_KEYS.find(k => k.id === targetNoteId)?.swarHi})
            </span>
          </div>

          <div className="flex gap-1.5 mt-2 flex-wrap justify-center">
            {currentSong.notes.map((noteId, i) => {
              const kObj = SWAR_KEYS.find(k => k.id === noteId);
              const isPlayed = i < targetStep;
              const isCurrent = i === targetStep;

              return (
                <span
                  key={i}
                  className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-orange-500 text-white scale-110 ring-2 ring-orange-300 shadow'
                      : isPlayed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {lang === 'hi' ? kObj?.swarHi : kObj?.noteEn}
                </span>
              );
            })}
          </div>

          {songComplete && (
            <div className="mt-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? 'शाबाश! आपने यह धुन सफलता से बजाई!' : 'Well done! You completed the melody!'}</span>
            </div>
          )}
        </div>

        {/* Harmonium / Piano Keyboard UI */}
        <div className="relative flex justify-center bg-slate-900 p-4 md:p-6 rounded-3xl shadow-2xl border-4 border-amber-900/60 overflow-x-auto max-w-full">
          <div className="flex relative select-none">
            {SWAR_KEYS.filter(k => k.type === 'white').map((k) => {
              const isTarget = targetNoteId === k.id;
              const isPressed = activeKey === k.id;

              return (
                <button
                  key={k.id}
                  onClick={() => handleKeyPress(k)}
                  className={`relative w-12 md:w-16 h-48 md:h-56 rounded-b-2xl border-2 border-slate-300 transition-all flex flex-col justify-end items-center pb-4 cursor-pointer ${
                    isPressed 
                      ? 'bg-orange-200 scale-98 shadow-inner' 
                      : isTarget 
                      ? 'bg-amber-100 ring-4 ring-orange-400' 
                      : 'bg-white hover:bg-slate-50 shadow-md'
                  }`}
                >
                  <span className="text-lg md:text-xl font-black text-slate-800">
                    {lang === 'hi' ? k.swarHi : k.noteEn}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {lang === 'hi' ? k.noteEn : k.swarHi}
                  </span>
                </button>
              );
            })}

            {/* Black Keys Layer */}
            {SWAR_KEYS.filter(k => k.type === 'black').map((k) => {
              const isTarget = targetNoteId === k.id;
              const isPressed = activeKey === k.id;

              // Absolute pixel positioning corresponding to black piano keys
              const leftOffsets: { [id: string]: string } = {
                re_k: '34px',
                ga_k: '84px',
                ma_t: '182px',
                dha_k: '232px',
                ni_k: '282px'
              };

              return (
                <button
                  key={k.id}
                  onClick={() => handleKeyPress(k)}
                  style={{ left: leftOffsets[k.id] || '0px' }}
                  className={`absolute top-0 w-8 md:w-10 h-28 md:h-34 rounded-b-xl border border-slate-700 transition-all flex flex-col justify-end items-center pb-2 z-20 cursor-pointer ${
                    isPressed 
                      ? 'bg-orange-700 scale-95 shadow-inner' 
                      : isTarget 
                      ? 'bg-orange-600 ring-2 ring-yellow-300' 
                      : 'bg-slate-900 hover:bg-slate-800 shadow-xl'
                  }`}
                >
                  <span className="text-xs font-black text-white">
                    {lang === 'hi' ? k.swarHi : k.noteEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 text-center text-xs font-bold text-slate-400">
          💡 {lang === 'hi' 
            ? 'सफेद व काले कीज़ को टैप करके संगीत बजाएं। पीले हाइलाइट वाले स्वर पर ध्यान दें!' 
            : 'Tap white and black keys to play music. Follow the highlighted notes to practice!'}
        </div>

      </div>
    </div>
  );
}