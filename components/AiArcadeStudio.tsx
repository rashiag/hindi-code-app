'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Brain, CheckCircle2, XCircle, RotateCcw, ArrowRight, Eye, Lightbulb, ShieldAlert, Award, Bot, Cpu, Volume2, Trophy, Star } from 'lucide-react';
import { MachineLearningStudio } from '@/components/MachineLearningStudio';

type AiLevel = 'level1' | 'level2_tray' | 'level2_trainer' | 'level3_draw' | 'level4_fact';

interface QuizQuestion {
  id: string;
  name: string;
  emoji: string;
  isAi: boolean;
  onCorrectText: string;
  onWrongText: string;
  audioPrompt: string;
}

// STRICTLY 5 QUESTIONS ONLY
const FIVE_QUESTIONS: QuizQuestion[] = [
  { 
    id: 'maps', 
    name: 'Google Maps (रास्ता व ट्रैफिक)', 
    emoji: '🗺️', 
    isAi: true, 
    onCorrectText: 'सही उत्तर! Maps लाइव ट्रैफिक डेटा और AI से सबसे तेज़ रास्ता खोजता है।',
    onWrongText: 'गलत उत्तर! Google Maps में AI का इस्तेमाल होता है। यह डेटा सीखकर रास्ता तय करता है।',
    audioPrompt: 'गूगल मैप्स। क्या यह काम करने के लिए ए आई का इस्तेमाल करता है?'
  },
  { 
    id: 'washing', 
    name: 'वाशिंग मशीन (Washing Machine)', 
    emoji: '🧺', 
    isAi: false, 
    onCorrectText: 'सही उत्तर! इसमें पहले से तय मोटर टाइमर होते हैं। यह खुद सोचकर नया निर्णय नहीं लेती।',
    onWrongText: 'गलत उत्तर! साधारण वाशिंग मशीन में AI नहीं होता। यह सिर्फ पहले से तय टाइमर और मोटर से चलती है।',
    audioPrompt: 'वाशिंग मशीन। क्या इसमें ए आई है?'
  },
  { 
    id: 'youtube', 
    name: 'YouTube वीडियो सुझाव (Recommendations)', 
    emoji: '📺', 
    isAi: true, 
    onCorrectText: 'सही उत्तर! YouTube AI आपकी पसंद को समझकर वैसे ही नए वीडियो खोजकर सुझाता है।',
    onWrongText: 'गलत उत्तर! YouTube में AI होता है। यह आपकी पुरानी पसंद को देखकर नए वीडियो सुझाता है।',
    audioPrompt: 'यूट्यूब वीडियो सुझाव। क्या यह ए आई है?'
  },
  { 
    id: 'lift', 
    name: 'लिफ्ट का बटन (Elevator / Lift)', 
    emoji: '🛗', 
    isAi: false, 
    onCorrectText: 'सही उत्तर! लिफ्ट साधारण इलेक्ट्रिक स्विच और तय नियमों पर चलती है। इसमें AI नहीं होता।',
    onWrongText: 'गलत उत्तर! लिफ्ट में AI नहीं होता। यह साधारण स्विच और मोटर से काम करती है।',
    audioPrompt: 'लिफ्ट का बटन। क्या इसमें ए आई है?'
  },
  { 
    id: 'faceunlock', 
    name: 'फोन का Face Unlock', 
    emoji: '📱', 
    isAi: true, 
    onCorrectText: 'सही उत्तर! कैमरा आपके चेहरे के खास पैटर्न्स को AI कंप्यूटर विज़न से पहचानता है।',
    onWrongText: 'गलत उत्तर! Face Unlock में AI विज़न का इस्तेमाल होता है ताकि आपका चेहरा पहचाना जा सके।',
    audioPrompt: 'फोन का फेस अनलॉक। क्या यह ए आई है?'
  }
];

interface AnimalItem {
  id: string;
  name: string;
  emoji: string;
  isDomestic: boolean;
}

const ALL_ANIMALS: AnimalItem[] = [
  { id: 'dog', name: 'कुत्ता (Dog)', emoji: '🐶', isDomestic: true },
  { id: 'cat', name: 'बिल्ली (Cat)', emoji: '🐱', isDomestic: true },
  { id: 'cow', name: 'गाय (Cow)', emoji: '🐄', isDomestic: true },
  { id: 'tiger', name: 'बाघ (Tiger)', emoji: '🐯', isDomestic: false },
  { id: 'lion', name: 'शेर (Lion)', emoji: '🦁', isDomestic: false }
];

export function AiArcadeStudio() {
  const [activeLevel, setActiveLevel] = useState<AiLevel>('level1');

  // Level 1: 5 Questions Round State
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [roundFinished, setRoundFinished] = useState<boolean>(false);

  // Level 2 State: AI को सिखाओ
  const [trainedDomestic, setTrainedDomestic] = useState<string[]>([]);
  const [trainedWild, setTrainedWild] = useState<string[]>([]);
  const [testPrediction, setTestPrediction] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playTone = (type: 'correct' | 'wrong' | 'pop' | 'fanfare') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'fanfare') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.15);
        osc.frequency.setValueAtTime(659.25, now + 0.3);
        osc.frequency.setValueAtTime(880, now + 0.45);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {}
  };

  const speakHindi = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  // Play question audio prompt on each fresh question
  useEffect(() => {
    if (activeLevel === 'level1' && !feedback && !roundFinished) {
      speakHindi(FIVE_QUESTIONS[currentIdx].audioPrompt);
    }
  }, [currentIdx, activeLevel, roundFinished, feedback]);

  const handleSelectAnswer = (userChoseAi: boolean) => {
    stopAllAudio();
    const currentQ = FIVE_QUESTIONS[currentIdx];
    const isAnswerCorrect = (userChoseAi === currentQ.isAi);
    const feedbackString = isAnswerCorrect ? currentQ.onCorrectText : currentQ.onWrongText;

    if (isAnswerCorrect) {
      playTone('correct');
      setScore((prev) => prev + 1);
    } else {
      playTone('wrong');
    }

    setFeedback({
      isCorrect: isAnswerCorrect,
      message: feedbackString
    });

    setTimeout(() => {
      speakHindi(feedbackString);
    }, 150);
  };

  const handleNextStep = () => {
    stopAllAudio();
    playTone('pop');
    setFeedback(null);

    // Exactly 5 questions: indices 0, 1, 2, 3, 4
    if (currentIdx + 1 >= 5) {
      setRoundFinished(true);
      playTone('fanfare');
      setTimeout(() => {
        speakHindi(`राउंड पूरा हुआ! आपने पाँच में से ${score} अंक प्राप्त किए हैं।`);
      }, 250);
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handleRestartRound = () => {
    stopAllAudio();
    playTone('pop');
    setCurrentIdx(0);
    setScore(0);
    setFeedback(null);
    setRoundFinished(false);
  };

  const trainItem = (animal: AnimalItem, asDomestic: boolean) => {
    stopAllAudio();
    playTone('pop');
    if (asDomestic) {
      setTrainedDomestic((prev) => [...prev.filter((id) => id !== animal.id), animal.id]);
      setTrainedWild((prev) => prev.filter((id) => id !== animal.id));
      speakHindi(`${animal.name.split(' ')[0]} को पालतू श्रेणी में जोड़ा गया`);
    } else {
      setTrainedWild((prev) => [...prev.filter((id) => id !== animal.id), animal.id]);
      setTrainedDomestic((prev) => prev.filter((id) => id !== animal.id));
      speakHindi(`${animal.name.split(' ')[0]} को जंगली श्रेणी में जोड़ा गया`);
    }
    setTestPrediction(null);
  };

  const testNewAnimal = () => {
    stopAllAudio();
    const hasDomestic = trainedDomestic.length > 0;
    const hasWild = trainedWild.length > 0;

    if (!hasDomestic && !hasWild) {
      const msg = 'कृपया पहले AI को ऊपर उदाहरण देकर सिखाएं!';
      playTone('wrong');
      setTestPrediction(msg);
      speakHindi(msg);
      return;
    }

    if (trainedDomestic.includes('cow') || trainedDomestic.includes('dog')) {
      const msg = 'AI का अनुमान: बकरी एक पालतू जानवर है!';
      playTone('correct');
      setTestPrediction(`✅ ${msg} (क्योंकि आपने गाय/कुत्ते से सिखाया)`);
      speakHindi(msg);
    } else {
      const msg = 'AI का गलत अनुमान: बकरी जंगली जानवर है!';
      playTone('wrong');
      setTestPrediction(`❌ ${msg} (क्योंकि आपने इसे सिर्फ जंगली जानवरों का डेटा दिया था!)`);
      speakHindi(msg);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 md:p-6 font-sans select-none">
      
      {/* Top Banner */}
      <div className="bg-purple-50/80 p-4 md:p-6 rounded-3xl border border-purple-200 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
              🤖
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-purple-950">AI खेलघर (Desi AI Arcade)</h1>
              <p className="text-xs md:text-sm font-semibold text-purple-800">
                खेलो • सिखाओ • आज़माओ • सोचो (NEP 2020 Aligned AI Literacy)
              </p>
            </div>
          </div>

          <div className="bg-white px-3 py-1.5 rounded-xl border border-purple-300 text-xs font-bold text-purple-900 shadow-sm flex items-center gap-2">
            <span>मार्गदर्शक स्तर:</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-black">
              {activeLevel === 'level1' && 'Level 1: पहचानो (५ प्रश्न)'}
              {activeLevel === 'level2_tray' && 'Level 2: डेटा व ट्रेनिंग'}
              {activeLevel === 'level2_trainer' && 'Level 2: हिंदी मशीन ट्रेनर'}
              {activeLevel === 'level3_draw' && 'Level 3: पैटर्न व विज़न'}
              {activeLevel === 'level4_fact' && 'Level 4: सच या कल्पना?'}
            </span>
          </div>
        </div>

        {/* 4-Stage Roadmap */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
          <button
            onClick={() => { stopAllAudio(); setActiveLevel('level1'); playTone('pop'); }}
            className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
              activeLevel === 'level1' ? 'bg-purple-600 border-purple-700 text-white shadow-md' : 'bg-white border-purple-100 hover:bg-purple-50/60 text-slate-800'
            }`}
          >
            <span className="text-[10px] font-black opacity-80 block">चरण १ (LEVEL 1)</span>
            <span className="text-xs md:text-sm font-black flex items-center gap-1 mt-0.5">
              🔍 AI है या नहीं?
            </span>
          </button>

          <button
            onClick={() => { stopAllAudio(); setActiveLevel('level2_tray'); playTone('pop'); }}
            className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
              activeLevel === 'level2_tray' || activeLevel === 'level2_trainer'
                ? 'bg-purple-600 border-purple-700 text-white shadow-md'
                : 'bg-white border-purple-100 hover:bg-purple-50/60 text-slate-800'
            }`}
          >
            <span className="text-[10px] font-black opacity-80 block">चरण २ (LEVEL 2)</span>
            <span className="text-xs md:text-sm font-black flex items-center gap-1 mt-0.5">
              🧪 AI को सिखाओ
            </span>
          </button>

          <button
            onClick={() => { stopAllAudio(); setActiveLevel('level3_draw'); playTone('pop'); }}
            className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
              activeLevel === 'level3_draw' ? 'bg-purple-600 border-purple-700 text-white shadow-md' : 'bg-white border-purple-100 hover:bg-purple-50/60 text-slate-800'
            }`}
          >
            <span className="text-[10px] font-black opacity-80 block">चरण ३ (LEVEL 3)</span>
            <span className="text-xs md:text-sm font-black flex items-center gap-1 mt-0.5">
              🎨 जल्दी बनाओ AI
            </span>
          </button>

          <button
            onClick={() => { stopAllAudio(); setActiveLevel('level4_fact'); playTone('pop'); }}
            className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
              activeLevel === 'level4_fact' ? 'bg-purple-600 border-purple-700 text-white shadow-md' : 'bg-white border-purple-100 hover:bg-purple-50/60 text-slate-800'
            }`}
          >
            <span className="text-[10px] font-black opacity-80 block">चरण ४ (LEVEL 4)</span>
            <span className="text-xs md:text-sm font-black flex items-center gap-1 mt-0.5">
              🧐 सच या कल्पना?
            </span>
          </button>
        </div>
      </div>

      {/* Stage Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-purple-200 shadow-xl min-h-[460px] flex flex-col justify-center items-center">
        
        {/* LEVEL 1: Active 5-Question Flow */}
        {activeLevel === 'level1' && !roundFinished && (
          <div className="w-full max-w-lg flex flex-col items-center text-center">
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
                प्रश्न {currentIdx + 1} / 5 • स्कोर: {score}
              </span>
              <button
                onClick={() => speakHindi(FIVE_QUESTIONS[currentIdx].audioPrompt)}
                className="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full transition cursor-pointer"
                title="आवाज़ सुनें"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 mb-6 shadow-inner flex flex-col items-center">
              <span className="text-6xl md:text-7xl mb-3 animate-bounce">
                {FIVE_QUESTIONS[currentIdx].emoji}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1">
                {FIVE_QUESTIONS[currentIdx].name}
              </h2>
              <p className="text-xs text-slate-600">क्या यह काम करने के लिए AI (स्मार्ट लर्निंग) का इस्तेमाल करता है?</p>
            </div>

            {!feedback ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => handleSelectAnswer(true)}
                  className="py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-black text-base rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bot className="w-5 h-5" /> 🤖 AI है
                </button>
                <button
                  onClick={() => handleSelectAnswer(false)}
                  className="py-4 px-6 bg-stone-700 hover:bg-stone-800 text-white font-black text-base rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Cpu className="w-5 h-5" /> ⚙️ साधारण नियम है
                </button>
              </div>
            ) : (
              <div className="w-full bg-purple-50 border-2 border-purple-300 rounded-2xl p-5 text-center animate-in fade-in">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600" />
                  )}
                  <span className={`text-base font-black ${feedback.isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {feedback.isCorrect ? 'बिल्कुल सही!' : 'गलत उत्तर!'}
                  </span>
                </div>
                <p className="text-xs font-bold text-purple-950 mb-4 leading-relaxed">{feedback.message}</p>
                <button
                  onClick={handleNextStep}
                  className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer inline-flex items-center gap-1.5"
                >
                  {currentIdx + 1 === 5 ? 'रिजल्ट रिपोर्ट देखें ➔' : 'अगला सवाल ➔'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* LEVEL 1: Strict Termination Report Card for exactly 5 Questions */}
        {activeLevel === 'level1' && roundFinished && (
          <div className="w-full max-w-md bg-gradient-to-b from-purple-50 via-white to-pink-50 rounded-3xl border-2 border-purple-300 p-6 md:p-8 text-center shadow-xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
              🏆
            </div>
            
            <h2 className="text-2xl font-black text-purple-950 mb-1">राउंड पूरा हुआ!</h2>
            <p className="text-xs font-bold text-purple-800 mb-6">AI है या नहीं? - आपका रिपोर्ट कार्ड</p>

            <div className="bg-white border-2 border-purple-200 rounded-2xl p-4 shadow-sm mb-6 flex justify-around items-center">
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">कुल प्रश्न</span>
                <span className="text-2xl font-black text-slate-800">5</span>
              </div>
              <div className="w-px h-10 bg-purple-100" />
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">सही उत्तर</span>
                <span className="text-2xl font-black text-emerald-600">{score} / 5</span>
              </div>
              <div className="w-px h-10 bg-purple-100" />
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">सटीकता</span>
                <span className="text-2xl font-black text-purple-900">{Math.round((score / 5) * 100)}%</span>
              </div>
            </div>

            <div className="bg-purple-100/70 p-3.5 rounded-xl text-left text-xs font-bold text-purple-950 mb-6 leading-relaxed">
              💡 मुख्य निष्कर्ष: हर मशीन में AI नहीं होता! लिफ्ट और वॉशिंग मशीन तय कोड/सेंसर से चलती हैं, जबकि Maps व Face Unlock नए डेटा से सीखकर निर्णय लेते हैं।
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRestartRound}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> पुनः खेलें
              </button>
              <button
                onClick={() => { stopAllAudio(); setActiveLevel('level2_tray'); playTone('pop'); }}
                className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                लेवल २ पर आगे बढ़ें ➔
              </button>
            </div>
          </div>
        )}

        {/* LEVEL 2: AI को सिखाओ (Supervised Data Tray) */}
        {activeLevel === 'level2_tray' && (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <div>
                <h3 className="text-lg font-black text-purple-950">AI को पालतू vs जंगली जानवर सिखाओ</h3>
                <p className="text-xs text-slate-600">जानवरों को सही ट्रे में डालें। AI आपके दिए डेटा से सीखेगा!</p>
              </div>
              <button
                onClick={() => { stopAllAudio(); setActiveLevel('level2_trainer'); playTone('pop'); }}
                className="text-xs font-black bg-purple-100 text-purple-900 hover:bg-purple-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                हिंदी मशीन ट्रेनर खोलें ➔
              </button>
            </div>

            <div className="w-full bg-slate-50 border-2 border-dashed border-purple-300 rounded-2xl p-3 mb-4 flex flex-wrap justify-center gap-2">
              {ALL_ANIMALS.map((a) => (
                <div key={a.id} className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="text-xs font-bold text-slate-800">{a.name.split(' ')[0]}</span>
                  <div className="flex gap-1 ml-1">
                    <button
                      onClick={() => trainItem(a, true)}
                      className={`text-[10px] font-black px-2.5 py-1 rounded cursor-pointer ${
                        trainedDomestic.includes(a.id) ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      पालतू
                    </button>
                    <button
                      onClick={() => trainItem(a, false)}
                      className={`text-[10px] font-black px-2.5 py-1 rounded cursor-pointer ${
                        trainedWild.includes(a.id) ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      जंगली
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 text-center mb-4">
              <span className="text-xs font-bold text-purple-900 block mb-1">अब नए जानवर की परीक्षा लें:</span>
              <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-purple-300 shadow-sm mb-3">
                <span className="text-3xl">🐐</span>
                <span className="text-sm font-black text-slate-800">नया जानवर: बकरी (Goat)</span>
              </div>
              <div>
                <button
                  onClick={testNewAnimal}
                  className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer inline-flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" /> AI से पूछें: बकरी क्या है? ➔
                </button>
              </div>
              {testPrediction && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-purple-300 text-xs font-black text-purple-950 animate-in fade-in">
                  {testPrediction}
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 text-center font-semibold">
              💡 वैज्ञानिक सबक: गलत या अधूरा डेटा = AI का गलत अनुमान (Garbage In = Garbage Out).
            </div>
          </div>
        )}

        {/* LEVEL 2: Direct Native Hindi Machine Trainer Studio */}
        {activeLevel === 'level2_trainer' && (
          <div className="w-full flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-4">
              <button
                onClick={() => { stopAllAudio(); setActiveLevel('level2_tray'); playTone('pop'); }}
                className="text-xs font-black text-purple-800 bg-purple-100 hover:bg-purple-200 px-3.5 py-1.5 rounded-xl cursor-pointer"
              >
                ⬅ डेटा ट्रे पर लौटें
              </button>
              <span className="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                हिंदी AI मशीन ट्रेनर (Native Edge Vision)
              </span>
            </div>

            <div className="w-full">
              <MachineLearningStudio />
            </div>
          </div>
        )}

        {/* LEVEL 3: जल्दी बनाओ AI */}
        {activeLevel === 'level3_draw' && (
          <div className="w-full flex flex-col items-center text-center">
            <h3 className="text-lg font-black text-purple-950 mb-1">जल्दी बनाओ AI (Quick Draw Doodle Recognition)</h3>
            <p className="text-xs text-slate-600 mb-4 max-w-md">
              आप चित्र बनाएंगे और AI न्यूरल नेटवर्क लाइव गेस करेगा कि आप क्या बना रहे हैं!
            </p>
            <div className="w-full max-w-xl h-96 bg-white rounded-3xl overflow-hidden border-4 border-purple-300 shadow-xl">
              <iframe
                src="https://quickdraw.withgoogle.com/"
                className="w-full h-full border-0"
                title="Hindi Quick Draw"
              />
            </div>
          </div>
        )}

        {/* LEVEL 4: सच या कल्पना? */}
        {activeLevel === 'level4_fact' && (
          <div className="w-full max-w-lg text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center text-2xl mb-3">
              🧐
            </div>
            <h3 className="text-lg font-black text-purple-950 mb-1">AI ने कहा — सच या कल्पना? (Fact Check Lab)</h3>
            <p className="text-xs text-slate-600 mb-4">
              AI बहुत आत्मविश्वास से जवाब देता है, लेकिन क्या हर बात सच होती है?
            </p>
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-left mb-4 shadow-sm w-full">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-black text-amber-950">दावा / Statement:</span>
                <button
                  onClick={() => speakHindi("दावा: भारत में हाथी केवल पेड़ की पत्तियाँ खाकर उड़ सकते हैं। सबक: यह गलत है। AI कई बार गलत जानकारी बनाता है।")}
                  className="p-1 text-amber-900 hover:bg-amber-200 rounded cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-3">
                "भारत में हाथी केवल पेड़ की पत्तियाँ खाकर उड़ सकते हैं।"
              </p>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs font-bold text-purple-900">
                🔍 सबक: AI कई बार गलत जानकारियाँ भी आत्मविश्वास से बनाता है (Hallucination)। इसलिए हमेशा जाँच (Fact-Check) करें!
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}