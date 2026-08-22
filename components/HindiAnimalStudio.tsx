'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Award, Sparkles, CheckCircle2, Trophy, Star, ArrowRight, Home, Baby, Music } from 'lucide-react';

interface AnimalData {
  id: string;
  name: string;
  hindiName: string;
  emoji: string;
  baby: string;
  hindiBaby: string;
  babyEmoji: string;
  home: string;
  hindiHome: string;
  homeEmoji: string;
  sound: string;
  hindiSound: string;
  soundCue: string;
}

// Full 14-animal repository aligned directly with Indian Early Primary EVS
const ANIMAL_REPOSITORY: AnimalData[] = [
  {
    id: 'cow',
    name: 'Cow',
    hindiName: 'गाय',
    emoji: '🐄',
    baby: 'Calf',
    hindiBaby: 'बछड़ा',
    babyEmoji: '🐮',
    home: 'Shed',
    hindiHome: 'गौशाला (Shed)',
    homeEmoji: '🛖',
    sound: 'Moos',
    hindiSound: 'रंभाना (Moo)',
    soundCue: 'हम्भा-हम्भा (Mooo)'
  },
  {
    id: 'dog',
    name: 'Dog',
    hindiName: 'कुत्ता',
    emoji: '🐕',
    baby: 'Puppy',
    hindiBaby: 'पिल्ला',
    babyEmoji: '🐶',
    home: 'Kennel',
    hindiHome: 'केनेल (Kennel)',
    homeEmoji: '🏠',
    sound: 'Barks',
    hindiSound: 'भौंकना (Bark)',
    soundCue: 'भौ-भौ (Woof)'
  },
  {
    id: 'lion',
    name: 'Lion',
    hindiName: 'शेर',
    emoji: '🦁',
    baby: 'Cub',
    hindiBaby: 'शावक (Cub)',
    babyEmoji: '🐱',
    home: 'Den',
    hindiHome: 'गुफा (Den)',
    homeEmoji: '⛰️',
    sound: 'Roars',
    hindiSound: 'दहाड़ना (Roar)',
    soundCue: 'ग्र्र्र (Roaaar)'
  },
  {
    id: 'horse',
    name: 'Horse',
    hindiName: 'घोड़ा',
    emoji: '🐎',
    baby: 'Colt / Foal',
    hindiBaby: 'बछेड़ा (Colt)',
    babyEmoji: '🐴',
    home: 'Stable',
    hindiHome: 'अस्तबल (Stable)',
    homeEmoji: '🏡',
    sound: 'Neighs',
    hindiSound: 'हिनहिनाना (Neigh)',
    soundCue: 'ही-ही-हीन (Neigh)'
  },
  {
    id: 'hen',
    name: 'Hen',
    hindiName: 'मुर्गी',
    emoji: '🐔',
    baby: 'Chick',
    hindiBaby: 'चूजा (Chick)',
    babyEmoji: '🐥',
    home: 'Coop',
    hindiHome: 'दड़बा (Coop)',
    homeEmoji: '📦',
    sound: 'Clucks',
    hindiSound: 'कुकड़ू-कूँ / क्लक',
    soundCue: 'कुड़-कुड़ (Cluck)'
  },
  {
    id: 'duck',
    name: 'Duck',
    hindiName: 'बतख',
    emoji: '🦆',
    baby: 'Duckling',
    hindiBaby: 'बतख का बच्चा',
    babyEmoji: '🐤',
    home: 'Pond',
    hindiHome: 'तालाब (Pond)',
    homeEmoji: '🌊',
    sound: 'Quacks',
    hindiSound: 'क्वै-क्वै करना',
    soundCue: 'क्वैक-क्वैक (Quack)'
  },
  {
    id: 'sheep',
    name: 'Sheep',
    hindiName: 'भेड़',
    emoji: '🐑',
    baby: 'Lamb',
    hindiBaby: 'मेमना (Lamb)',
    babyEmoji: '🐑',
    home: 'Pen',
    hindiHome: 'बाड़ा (Pen)',
    homeEmoji: '🪵',
    sound: 'Bleats',
    hindiSound: 'मिमियाना (Bleat)',
    soundCue: 'मैं-मैं (Baaa)'
  },
  {
    id: 'goat',
    name: 'Goat',
    hindiName: 'बकरी',
    emoji: '🐐',
    baby: 'Kid',
    hindiBaby: 'बकरी का बच्चा (Kid)',
    babyEmoji: '🐐',
    home: 'Pen',
    hindiHome: 'बाड़ा (Pen)',
    homeEmoji: '🪵',
    sound: 'Bleats',
    hindiSound: 'मिमियाना (Bleat)',
    soundCue: 'में-में (Mee-Mee)'
  },
  {
    id: 'bird',
    name: 'Bird',
    hindiName: 'चिड़िया',
    emoji: '🐦',
    baby: 'Chick',
    hindiBaby: 'छोटा बच्चा',
    babyEmoji: '🐣',
    home: 'Nest',
    hindiHome: 'घोंसला (Nest)',
    homeEmoji: '🪺',
    sound: 'Chirps',
    hindiSound: 'चहचहाना (Chirp)',
    soundCue: 'चीं-चीं (Chirp)'
  },
  {
    id: 'pig',
    name: 'Pig',
    hindiName: 'सुअर',
    emoji: '🐖',
    baby: 'Piglet',
    hindiBaby: 'सुअर का बच्चा',
    babyEmoji: '🐷',
    home: 'Sty',
    hindiHome: 'सुअरबाड़ा (Sty)',
    homeEmoji: '🛖',
    sound: 'Grunts',
    hindiSound: 'घुरघुराना (Grunt)',
    soundCue: 'ओइंक-ओइंक (Oink)'
  },
  {
    id: 'elephant',
    name: 'Elephant',
    hindiName: 'हाथी',
    emoji: '🐘',
    baby: 'Calf',
    hindiBaby: 'हाथी का बच्चा',
    babyEmoji: '🐘',
    home: 'Jungle',
    hindiHome: 'जंगल (Jungle)',
    homeEmoji: '🌴',
    sound: 'Trumpets',
    hindiSound: 'चिंघाड़ना (Trumpet)',
    soundCue: 'पाउउऊ (Trumpet)'
  },
  {
    id: 'monkey',
    name: 'Monkey',
    hindiName: 'बंदर',
    emoji: '🐒',
    baby: 'Infant',
    hindiBaby: 'बंदर का बच्चा',
    babyEmoji: '🐵',
    home: 'Tree',
    hindiHome: 'पेड़ (Tree)',
    homeEmoji: '🌳',
    sound: 'Chatters',
    hindiSound: 'चीखना (Chatter)',
    soundCue: 'खी-खी (Chatter)'
  },
  {
    id: 'cat',
    name: 'Cat',
    hindiName: 'बिल्ली',
    emoji: '🐈',
    baby: 'Kitten',
    hindiBaby: 'बिलौटा (Kitten)',
    babyEmoji: '🐱',
    home: 'House',
    hindiHome: 'घर (House)',
    homeEmoji: '🏡',
    sound: 'Mews',
    hindiSound: 'म्याऊँ करना',
    soundCue: 'म्याऊँ-म्याऊँ (Meow)'
  },
  {
    id: 'honeybee',
    name: 'Honeybee',
    hindiName: 'मधुमक्खी',
    emoji: '🐝',
    baby: 'Larva',
    hindiBaby: 'लार्वा (Larva)',
    babyEmoji: '🐛',
    home: 'Beehive',
    hindiHome: 'छत्ता (Beehive)',
    homeEmoji: '🍯',
    sound: 'Buzzes',
    hindiSound: 'भिनभिनाना (Buzz)',
    soundCue: 'ज़ज़ज़ (Buzzz)'
  }
];

type GameMode = 'homes' | 'babies' | 'sounds';
const TOTAL_ROUNDS = 5;

export function HindiAnimalStudio() {
  const [mode, setMode] = useState<GameMode>('homes');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentAnimal, setCurrentAnimal] = useState<AnimalData>(ANIMAL_REPOSITORY[0]);
  const [options, setOptions] = useState<AnimalData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

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

  const generateQuestion = (currentMode: GameMode = mode) => {
    // Pick random target animal
    const target = ANIMAL_REPOSITORY[Math.floor(Math.random() * ANIMAL_REPOSITORY.length)];
    
    // Pick 2 other distinct animals for wrong options
    const others = ANIMAL_REPOSITORY.filter((a) => a.id !== target.id);
    others.sort(() => Math.random() - 0.5);

    const generatedOpts = [target, others[0], others[1]].sort(() => Math.random() - 0.5);

    setCurrentAnimal(target);
    setOptions(generatedOpts);
    setSelectedId(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setIsBusy(false);
  };

  const startNewGame = (newMode: GameMode = mode) => {
    clearTimer();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setScore(0);
    setStreak(0);
    setCurrentRound(1);
    setIsGameOver(false);
    setFinalScore(0);
    generateQuestion(newMode);
  };

  useEffect(() => {
    startNewGame(mode);
  }, [mode]);

  const handleModeChange = (newMode: GameMode) => {
    if (mode === newMode) return;
    setMode(newMode);
  };

  const handleNextQuestion = () => {
    clearTimer();
    if (currentRound >= TOTAL_ROUNDS) {
      setIsGameOver(true);
      setFinalScore(score);
      setIsBusy(false);
    } else {
      setCurrentRound((prev) => prev + 1);
      generateQuestion(mode);
    }
  };

  const handleSelect = (selectedAnimal: AnimalData) => {
    if (isBusy || isGameOver || isCorrect !== null) return;
    setIsBusy(true);
    setSelectedId(selectedAnimal.id);

    const isAnswerCorrect = selectedAnimal.id === currentAnimal.id;

    if (isAnswerCorrect) {
      setIsCorrect(true);
      const nextScore = score + 1;
      setScore(nextScore);
      setStreak((prev) => prev + 1);
      playSuccessChime();

      if (mode === 'homes') {
        playSpeech(`शाबाश! ${currentAnimal.hindiName} का घर ${currentAnimal.hindiHome} है! ${currentAnimal.name} lives in a ${currentAnimal.home}!`);
      } else if (mode === 'babies') {
        playSpeech(`शाबाश! ${currentAnimal.hindiName} के बच्चे को ${currentAnimal.hindiBaby} कहते हैं! A baby ${currentAnimal.name} is a ${currentAnimal.baby}!`);
      } else {
        playSpeech(`शाबाश! ${currentAnimal.hindiName} की आवाज़: ${currentAnimal.soundCue}! A ${currentAnimal.name} ${currentAnimal.sound}!`);
      }

      autoAdvanceTimer.current = setTimeout(() => {
        if (currentRound >= TOTAL_ROUNDS) {
          setIsGameOver(true);
          setFinalScore(nextScore);
          setIsBusy(false);
        } else {
          setCurrentRound((prev) => prev + 1);
          generateQuestion(mode);
        }
      }, 1600);

    } else {
      setIsCorrect(false);
      setStreak(0);
      setShowExplanation(true);

      if (mode === 'homes') {
        playSpeech(`सही उत्तर: ${currentAnimal.hindiName} का घर ${currentAnimal.hindiHome} है। ${currentAnimal.name} lives in a ${currentAnimal.home}.`);
      } else if (mode === 'babies') {
        playSpeech(`सही उत्तर: ${currentAnimal.hindiName} के बच्चे को ${currentAnimal.hindiBaby} कहते हैं। Baby of a ${currentAnimal.name} is a ${currentAnimal.baby}.`);
      } else {
        playSpeech(`सही उत्तर: ${currentAnimal.hindiName} की आवाज़ ${currentAnimal.hindiSound} है।`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans select-none">
      {/* Top Header & Turn Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦁</span>
            <h1 className="text-xl md:text-2xl font-black text-emerald-950">पशु-पक्षी संसार (Animal World)</h1>
          </div>
          <p className="text-xs md:text-sm font-semibold text-emerald-800">
            घर, बच्चे और ध्वनियाँ पहचानें • Homes, Babies &amp; Sounds
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

        {/* 3 Sub-Modes Selector */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-emerald-300 shadow-sm">
          <button
            onClick={() => handleModeChange('homes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              mode === 'homes' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Home className="w-3.5 h-3.5" /> घर (Homes)
          </button>
          <button
            onClick={() => handleModeChange('babies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              mode === 'babies' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Baby className="w-3.5 h-3.5" /> बच्चे (Babies)
          </button>
          <button
            onClick={() => handleModeChange('sounds')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              mode === 'sounds' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Music className="w-3.5 h-3.5" /> आवाज़ (Sounds)
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
          /* End Game Performance Card */
          <div className="w-full max-w-md bg-gradient-to-b from-emerald-50 to-teal-50/50 rounded-3xl border-2 border-emerald-300 p-8 text-center flex flex-col items-center shadow-lg">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600 shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-emerald-950 mb-1">खेल संपन्न! (Game Complete)</h2>
            <p className="text-sm font-bold text-emerald-800 mb-5">
              {finalScore === 5
                ? '🌟 Fantastic Naturalist! All answers correct!'
                : finalScore >= 3
                ? '👏 Great knowledge! बहुत बढ़िया प्रयास!'
                : '💪 Keep exploring nature! अभ्यास जारी रखें!'}
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
          /* Active Interactive Screen */
          <>
            {/* Audio Prompt */}
            <button
              onClick={() => {
                if (mode === 'homes') {
                  playSpeech(`${currentAnimal.hindiName} कहाँ रहती है? Where does a ${currentAnimal.name} live?`);
                } else if (mode === 'babies') {
                  playSpeech(`${currentAnimal.hindiName} के बच्चे को क्या कहते हैं? What is a baby ${currentAnimal.name} called?`);
                } else {
                  playSpeech(`${currentAnimal.hindiName} की आवाज़ क्या है? What sound does a ${currentAnimal.name} make?`);
                }
              }}
              className="flex items-center gap-2 bg-emerald-100/70 hover:bg-emerald-200 text-emerald-950 font-bold px-4 py-2 rounded-full text-xs md:text-sm mb-6 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" /> प्रश्न सुनें (Audio Prompt)
            </button>

            {/* Target Animal Showcase */}
            <div className="flex flex-col items-center bg-gradient-to-b from-emerald-50 to-teal-50/40 border-2 border-emerald-200 px-10 py-6 rounded-3xl mb-6 shadow-sm">
              <span className="text-6xl md:text-7xl filter drop-shadow-md mb-2">{currentAnimal.emoji}</span>
              <h3 className="text-xl md:text-2xl font-black text-emerald-950">
                {currentAnimal.hindiName} ({currentAnimal.name})
              </h3>
              <p className="text-xs font-bold text-emerald-700 mt-1">
                {mode === 'homes'
                  ? 'का घर कौन सा है? (Where is the home?)'
                  : mode === 'babies'
                  ? 'का बच्चा कौन सा है? (Which is the baby?)'
                  : 'की आवाज़ कौन सी है? (Which is the sound?)'}
              </p>
            </div>

            {/* Visual Explanation on Error */}
            {showExplanation && (
              <div className="w-full max-w-md bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 mb-6 flex flex-col items-center animate-in fade-in zoom-in duration-150">
                <span className="text-xs font-black text-emerald-950 mb-3 text-center">
                  💡 समझिए: {currentAnimal.hindiName} ({currentAnimal.name})
                </span>
                
                <div className="flex items-center justify-center gap-4 mb-4 bg-white px-5 py-3 rounded-2xl border border-emerald-200 shadow-sm">
                  <span className="text-4xl">{currentAnimal.emoji}</span>
                  <span className="text-xl font-black text-emerald-800">➔</span>
                  {mode === 'homes' && (
                    <div className="flex items-center gap-2">
                      <span className="text-4xl">{currentAnimal.homeEmoji}</span>
                      <div className="text-left">
                        <span className="block text-xs font-black text-emerald-950">{currentAnimal.hindiHome}</span>
                        <span className="block text-[11px] font-bold text-emerald-700">{currentAnimal.home}</span>
                      </div>
                    </div>
                  )}
                  {mode === 'babies' && (
                    <div className="flex items-center gap-2">
                      <span className="text-4xl">{currentAnimal.babyEmoji}</span>
                      <div className="text-left">
                        <span className="block text-xs font-black text-emerald-950">{currentAnimal.hindiBaby}</span>
                        <span className="block text-[11px] font-bold text-emerald-700">{currentAnimal.baby}</span>
                      </div>
                    </div>
                  )}
                  {mode === 'sounds' && (
                    <div className="text-left">
                      <span className="block text-sm font-black text-emerald-950">{currentAnimal.soundCue}</span>
                      <span className="block text-xs font-bold text-emerald-700">{currentAnimal.sound} ({currentAnimal.hindiSound})</span>
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

            {/* 3 Large Option Cards */}
            {!showExplanation && (
              <div className="w-full max-w-lg">
                <p className="text-center text-xs md:text-sm font-bold text-slate-500 mb-3">
                  सही विकल्प पर स्पर्श करें (Tap the correct match):
                </p>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {options.map((opt) => {
                    const isSelected = selectedId === opt.id;
                    const isRight = isSelected && isCorrect === true;
                    const isWrong = isSelected && isCorrect === false;

                    return (
                      <button
                        key={opt.id}
                        disabled={isBusy}
                        onClick={() => handleSelect(opt)}
                        className={`relative py-4 px-2 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                          isRight
                            ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-emerald-200'
                            : isWrong
                            ? 'bg-rose-100 border-rose-400 text-rose-900'
                            : 'bg-emerald-50/50 hover:bg-emerald-100 border-emerald-200 text-slate-800 hover:border-emerald-400 hover:scale-102 active:scale-95'
                        }`}
                      >
                        {mode === 'homes' && (
                          <>
                            <span className="text-4xl mb-1.5">{opt.homeEmoji}</span>
                            <span className={`text-xs font-black text-center ${isRight ? 'text-white' : 'text-emerald-950'}`}>
                              {opt.hindiHome}
                            </span>
                            <span className={`text-[10px] font-bold ${isRight ? 'text-emerald-100' : 'text-emerald-700'}`}>
                              {opt.home}
                            </span>
                          </>
                        )}

                        {mode === 'babies' && (
                          <>
                            <span className="text-4xl mb-1.5">{opt.babyEmoji}</span>
                            <span className={`text-xs font-black text-center ${isRight ? 'text-white' : 'text-emerald-950'}`}>
                              {opt.hindiBaby}
                            </span>
                            <span className={`text-[10px] font-bold ${isRight ? 'text-emerald-100' : 'text-emerald-700'}`}>
                              {opt.baby}
                            </span>
                          </>
                        )}

                        {mode === 'sounds' && (
                          <>
                            <span className="text-3xl mb-1.5">🔊</span>
                            <span className={`text-xs font-black text-center ${isRight ? 'text-white' : 'text-emerald-950'}`}>
                              {opt.soundCue}
                            </span>
                            <span className={`text-[10px] font-bold ${isRight ? 'text-emerald-100' : 'text-emerald-700'}`}>
                              {opt.sound}
                            </span>
                          </>
                        )}

                        {isRight && <CheckCircle2 className="w-5 h-5 text-white absolute top-2 right-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}