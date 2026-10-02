'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, ChevronLeft, ChevronRight, Play, 
  RotateCcw, Award, CheckCircle2, AlertTriangle, ShieldCheck, HeartPulse
} from 'lucide-react';

interface CaseStudy {
  id: number;
  reportTypeEn: string;
  reportTypeHi: string;
  icon: string;
  bittuPrediction: boolean; // true = Medicine, false = Rest
  doctorDecision: boolean;  // true = Medicine, false = Rest
  classification: 'TP' | 'TN' | 'FP' | 'FN';
}

const TEN_PATIENT_CASES: CaseStudy[] = [
  { id: 1, reportTypeEn: 'Stomach Pain Report', reportTypeHi: 'पेट दर्द रिपोर्ट', icon: '🩺', bittuPrediction: true, doctorDecision: true, classification: 'TP' },
  { id: 2, reportTypeEn: 'Mild Cough Report', reportTypeHi: 'हल्की खांसी रिपोर्ट', icon: '🫁', bittuPrediction: false, doctorDecision: false, classification: 'TN' },
  { id: 3, reportTypeEn: 'Routine Health Checkup', reportTypeHi: 'नियमित स्वास्थ्य जांच', icon: '📋', bittuPrediction: true, doctorDecision: false, classification: 'FP' },
  { id: 4, reportTypeEn: 'High Fever Report', reportTypeHi: 'तेज बुखार रिपोर्ट', icon: '🌡️', bittuPrediction: true, doctorDecision: true, classification: 'TP' },
  { id: 5, reportTypeEn: 'Fatigue & Tiredness', reportTypeHi: 'थकान और कमजोरी', icon: '😴', bittuPrediction: false, doctorDecision: false, classification: 'TN' },
  { id: 6, reportTypeEn: 'Severe Chest Congestion', reportTypeHi: 'गंभीर सीने का संक्रमण', icon: '🫁', bittuPrediction: false, doctorDecision: true, classification: 'FN' },
  { id: 7, reportTypeEn: 'Normal Blood Pressure', reportTypeHi: 'सामान्य रक्तचाप', icon: '❤️', bittuPrediction: false, doctorDecision: false, classification: 'TN' },
  { id: 8, reportTypeEn: 'Allergic Rash Report', reportTypeHi: 'एलर्जी और दाने रिपोर्ट', icon: '💊', bittuPrediction: true, doctorDecision: true, classification: 'TP' },
  { id: 9, reportTypeEn: 'Dehydration Report', reportTypeHi: 'निर्जलीकरण (पानी की कमी)', icon: '💧', bittuPrediction: true, doctorDecision: false, classification: 'FP' },
  { id: 10, reportTypeEn: 'Bacterial Throat Infection', reportTypeHi: 'गले में जीवाणु संक्रमण', icon: '🔬', bittuPrediction: true, doctorDecision: true, classification: 'TP' },
];

export default function TaraBittuDoctorLab() {
  const [mode, setMode] = useState<'story' | 'matrix' | 'game' | 'results'>('story');
  const [currentPage, setCurrentPage] = useState<number>(53); // 53 to 61
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('hi');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Game States
  const [caseIdx, setCaseIdx] = useState<number>(0);
  const [counts, setCounts] = useState({ TP: 0, TN: 0, FP: 0, FN: 0 });
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; textEn: string; textHi: string } | null>(null);

  // Audio Context for Sound Effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (type: 'correct' | 'wrong' | 'click' | 'fanfare') => {
    if (isMuted || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'fanfare') {
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'triangle';
          o.frequency.setValueAtTime(freq, now + i * 0.12);
          g.gain.setValueAtTime(0.2, now + i * 0.12);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
          o.start(now + i * 0.12);
          o.stop(now + i * 0.12 + 0.4);
        });
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  };

  const speak = (text: string, voiceType: 'doctor' | 'tara' | 'bittu' = 'doctor') => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
      if (voiceType === 'tara') {
        u.pitch = 1.3;
        u.rate = 0.95;
      } else if (voiceType === 'bittu') {
        u.pitch = 0.8;
        u.rate = 1.0;
      } else {
        u.pitch = 1.0;
        u.rate = 0.9;
      }
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  const PAGE_SCRIPTS: { [key: number]: { en: string; hi: string; speaker: 'doctor' | 'tara' | 'bittu' } } = {
    53: {
      en: "Bittu looked carefully at the report and made his prediction: Medicine may be needed!",
      hi: "बिट्टू ने रिपोर्ट को ध्यान से देखा और अनुमान लगाया: इस मामले में दवा की आवश्यकता हो सकती है!",
      speaker: 'bittu'
    },
    54: {
      en: "Doctor said: Well done Bittu! This time your prediction was correct. The doctor's decision matched Bittu's!",
      hi: "डॉक्टर ने कहा: शाबाश बिट्टू! इस बार तुम्हारा अनुमान बिल्कुल सही था। डॉक्टर का फैसला बिट्टू के अनुमान से मिल गया!",
      speaker: 'doctor'
    },
    55: {
      en: "Oh! This time I was wrong! Tara said: That's okay Bittu, we learn a lot from mistakes too!",
      hi: "ओह! इस बार मेरा अनुमान गलत था! तारा ने कहा: कोई बात नहीं बिट्टू, हम गलतियों से भी बहुत कुछ सीखते हैं!",
      speaker: 'tara'
    },
    56: {
      en: "Tara asked: Out of all the new reports you answered, how many times were you correct?",
      hi: "तारा ने पूछा: तुमने जितनी नई रिपोर्टों के उत्तर दिए, उनमें से तुम कितनी बार सही थे?",
      speaker: 'tara'
    },
    57: {
      en: "Doctor explained: Whenever you are correct, we get better Accuracy! Accuracy is the total correct answers during testing.",
      hi: "डॉक्टर ने समझाया: जब भी तुम सही होते हो, हमें बेहतर सटीकता मिलती है! टेस्टिंग के दौरान कुल सही उत्तरों से सटीकता तय होती है।",
      speaker: 'doctor'
    },
    58: {
      en: "Positive and Negative simply mean YES and NO answers. True means correct, False means wrong!",
      hi: "पॉजिटिव और नेगेटिव का अर्थ केवल हाँ और ना है। ट्रू का मतलब सही, और फॉल्स का मतलब गलत!",
      speaker: 'tara'
    },
    59: {
      en: "True Positive: Both said Medicine needed. True Negative: Both said No medicine needed. False Positive and False Negative are the two kinds of mistakes!",
      hi: "ट्रू पॉजिटिव: दोनों ने कहा दवा चाहिए। ट्रू नेगेटिव: दोनों ने कहा दवा नहीं चाहिए। फॉल्स पॉजिटिव और फॉल्स नेगेटिव दो प्रकार की गलतियां हैं!",
      speaker: 'doctor'
    },
    60: {
      en: "Look at the 4 outcomes: True Positive, True Negative, False Positive, and False Negative!",
      hi: "इन चार परिणामों को देखें: ट्रू पॉजिटिव, ट्रू नेगेटिव, फॉल्स पॉजिटिव और फॉल्स नेगेटिव!",
      speaker: 'doctor'
    },
    61: {
      en: "Summary: Training, Testing, Prediction, Accuracy, and Errors. Now let's test Dr. Bittu's clinic!",
      hi: "सारांश: ट्रेनिंग, टेस्टिंग, प्रिडिक्शन, सटीकता और गलतियां। अब चलिए डॉक्टर बिट्टू के क्लीनिक की परीक्षा लेते हैं!",
      speaker: 'doctor'
    }
  };

  useEffect(() => {
    if (mode === 'story' && PAGE_SCRIPTS[currentPage]) {
      const script = PAGE_SCRIPTS[currentPage];
      speak(currentLang === 'hi' ? script.hi : script.en, script.speaker);
    }
  }, [currentPage, mode, currentLang]);

  const handleNextPage = () => {
    playTone('click');
    if (currentPage < 61) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setMode('game');
    }
  };

  const handlePrevPage = () => {
    playTone('click');
    if (currentPage > 53) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Game Logic
  const handleAnswer = (chosen: 'TP' | 'TN' | 'FP' | 'FN') => {
    const currentCase = TEN_PATIENT_CASES[caseIdx];
    const isCorrect = chosen === currentCase.classification;

    if (isCorrect) {
      playTone('correct');
      setCounts((prev) => ({ ...prev, [chosen]: prev[chosen] + 1 }));
      setLastFeedback({
        isCorrect: true,
        textEn: `Correct! This is a ${chosen}!`,
        textHi: `बिल्कुल सही! यह ${chosen} है!`
      });
      speak(currentLang === 'hi' ? 'बिल्कुल सही!' : 'Correct!', 'tara');
    } else {
      playTone('wrong');
      setLastFeedback({
        isCorrect: false,
        textEn: `Not quite! It was actually ${currentCase.classification}.`,
        textHi: `ध्यान दें! यह वास्तव में ${currentCase.classification} था।`
      });
      speak(currentLang === 'hi' ? 'ध्यान से देखें!' : 'Check carefully!', 'doctor');
    }

    setTimeout(() => {
      setLastFeedback(null);
      if (caseIdx + 1 < TEN_PATIENT_CASES.length) {
        setCaseIdx((prev) => prev + 1);
      } else {
        setMode('results');
        playTone('fanfare');
        speak(currentLang === 'hi' ? 'शाबाश! आपने क्लीनिक का मूल्यांकन पूरा कर लिया।' : 'Congratulations! You evaluated the clinic.', 'doctor');
      }
    }, 1200);
  };

  const totalEvaluated = counts.TP + counts.TN + counts.FP + counts.FN;
  const correctPredictions = counts.TP + counts.TN;
  const accuracyPercent = totalEvaluated > 0 ? Math.round((correctPredictions / totalEvaluated) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 font-sans select-none">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 md:p-5 rounded-3xl shadow-lg mb-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl shadow">
            🩺
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black">
              {currentLang === 'hi' ? 'तारा और बिट्टू: डॉक्टर का क्लीनिक (Accuracy & Confusion Matrix)' : 'Tara & Bittu: Doctor\'s Clinic (Accuracy & Confusion Matrix)'}
            </h1>
            <p className="text-xs text-blue-100 font-medium">
              {currentLang === 'hi' ? 'सटीकता, ट्रू पॉजिटिव, ट्रू नेगेटिव, फॉल्स पॉजिटिव और फॉल्स नेगेटिव सीखें' : 'Learn Accuracy, True Positive, True Negative, False Positive & False Negative'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="flex bg-white/20 p-1 rounded-xl backdrop-blur gap-1">
            <button
              onClick={() => setCurrentLang('hi')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                currentLang === 'hi' ? 'bg-white text-blue-950 shadow' : 'text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setCurrentLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                currentLang === 'en' ? 'bg-white text-blue-950 shadow' : 'text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex gap-2 mb-4 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => { setMode('story'); playTone('click'); }}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            mode === 'story' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📖 {currentLang === 'hi' ? 'सचित्र कहानी (Storybook)' : 'Storybook'}
        </button>
        <button
          onClick={() => { setMode('matrix'); playTone('click'); }}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            mode === 'matrix' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🔲 {currentLang === 'hi' ? 'कंफ्यूजन मैट्रिक्स (4 खाने)' : 'Confusion Matrix'}
        </button>
        <button
          onClick={() => { setMode('game'); playTone('click'); }}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            mode === 'game' || mode === 'results' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🎮 {currentLang === 'hi' ? 'क्लीनिक गेम खेलें (Challenge)' : 'Play Clinic Game'}
        </button>
      </div>

      {/* VIEW 1: STORYBOOK VIEWER */}
      {mode === 'story' && (
        <div className="bg-white border-2 border-blue-200 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col items-center">
          
          <div className="flex justify-between items-center w-full mb-3">
            <span className="text-xs font-bold text-slate-500">
              {currentLang === 'hi' ? 'पृष्ठ संख्या' : 'Page'}: <strong className="text-blue-900 font-black">{currentPage} / 61</strong>
            </span>
            <button
              onClick={() => {
                const s = PAGE_SCRIPTS[currentPage];
                if (s) speak(currentLang === 'hi' ? s.hi : s.en, s.speaker);
              }}
              className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> {currentLang === 'hi' ? 'आवाज़ दोबारा सुनें' : 'Listen Again'}
            </button>
          </div>

          {/* Book Image -> Loads PNG files! */}
          <div className="w-full max-w-md aspect-[3/4] bg-slate-50 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md relative mb-4 flex items-center justify-center">
            <img 
              src={`/story/${currentPage}.png`} 
              alt={`Page ${currentPage}`} 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Audio Caption Text */}
          <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-2xl p-3.5 mb-4 text-center">
            <p className="text-xs md:text-sm font-black text-blue-950 leading-relaxed">
              {PAGE_SCRIPTS[currentPage] && (currentLang === 'hi' ? PAGE_SCRIPTS[currentPage].hi : PAGE_SCRIPTS[currentPage].en)}
            </p>
          </div>

          {/* Page Flip Buttons */}
          <div className="flex gap-3 w-full max-w-md justify-between">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 53}
              className="py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 disabled:opacity-30 hover:bg-slate-100 cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> {currentLang === 'hi' ? 'पिछला पृष्ठ' : 'Previous'}
            </button>

            <button
              onClick={handleNextPage}
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 font-black text-xs text-white shadow-md cursor-pointer flex items-center gap-1"
            >
              {currentPage === 61 
                ? (currentLang === 'hi' ? '🎮 खेल शुरू करें ➔' : '🎮 Start Game ➔')
                : (currentLang === 'hi' ? 'अगला पृष्ठ ➔' : 'Next ➔')
              }
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* VIEW 2: INTERACTIVE CONFUSION MATRIX */}
      {mode === 'matrix' && (
        <div className="bg-white border-2 border-blue-200 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col items-center">
          <h2 className="text-base md:text-lg font-black text-slate-900 mb-1">
            {currentLang === 'hi' ? 'कंफ्यूजन मैट्रिक्स के ४ मुख्य नतीजे' : 'The 4 Quadrants of the Confusion Matrix'}
          </h2>
          <p className="text-xs text-slate-600 text-center mb-5 max-w-md">
            {currentLang === 'hi' 
              ? 'किसी भी बॉक्स पर क्लिक करके समझें कि AI और डॉक्टर के फैसले कैसे मिलते हैं:' 
              : 'Click on any box to see how Bittu (AI) and the Doctor agreed or differed:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mb-5">
            <div 
              onClick={() => speak(currentLang === 'hi' ? "ट्रू पॉजिटिव: बिट्टू और डॉक्टर दोनों ने कहा दवा चाहिए!" : "True Positive: Both Bittu and Doctor agreed Medicine is needed!", 'doctor')}
              className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-sm cursor-pointer hover:scale-[1.02] transition"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-emerald-900">🟢 True Positive (TP)</span>
                <span className="text-xl">💊</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                {currentLang === 'hi' ? 'बिट्टू: दवा चाहिए ✅ | डॉक्टर: दवा चाहिए ✅' : 'Bittu: Yes Medicine | Doctor: Yes Medicine'}
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">
                {currentLang === 'hi' ? 'सही अनुमान! दोनों की सहमति।' : 'Correct prediction! Both agreed.'}
              </p>
            </div>

            <div 
              onClick={() => speak(currentLang === 'hi' ? "ट्रू नेगेटिव: बिट्टू और डॉक्टर दोनों ने कहा दवा नहीं चाहिए, सिर्फ आराम!" : "True Negative: Both agreed No Medicine needed, only rest!", 'doctor')}
              className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-300 shadow-sm cursor-pointer hover:scale-[1.02] transition"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-blue-900">🔵 True Negative (TN)</span>
                <span className="text-xl">😴</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                {currentLang === 'hi' ? 'बिट्टू: दवा नहीं ❌ | डॉक्टर: दवा नहीं ❌' : 'Bittu: No Medicine | Doctor: No Medicine'}
              </p>
              <p className="text-[11px] text-blue-700 mt-1">
                {currentLang === 'hi' ? 'सही अनुमान! दोनों ने मना किया।' : 'Correct rejection! Both said no.'}
              </p>
            </div>

            <div 
              onClick={() => speak(currentLang === 'hi' ? "फॉल्स पॉजिटिव: बिट्टू ने गलती से दवा बता दी, जबकि डॉक्टर ने कहा सिर्फ आराम चाहिए!" : "False Positive: Bittu wrongly suggested medicine, but Doctor said only rest is needed!", 'bittu')}
              className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm cursor-pointer hover:scale-[1.02] transition"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-amber-900">🟠 False Positive (FP)</span>
                <span className="text-xl">⚠️</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                {currentLang === 'hi' ? 'बिट्टू: दवा चाहिए 💊 | डॉक्टर: आराम चाहिए 🛌' : 'Bittu: Medicine | Doctor: Rest only'}
              </p>
              <p className="text-[11px] text-amber-800 mt-1">
                {currentLang === 'hi' ? 'गलत अलार्म! बिना ज़रूरत के दवा बताना।' : 'False Alarm! Unnecessary alert.'}
              </p>
            </div>

            <div 
              onClick={() => speak(currentLang === 'hi' ? "फॉल्स नेगेटिव: बिट्टू ने कहा आराम, लेकिन मरीज़ को असल में दवा चाहिए थी! यह सबसे गंभीर गलती है।" : "False Negative: Bittu said rest, but the patient urgently needed medicine! This is dangerous.", 'tara')}
              className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-sm cursor-pointer hover:scale-[1.02] transition"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-rose-900">🔴 False Negative (FN)</span>
                <span className="text-xl">🚨</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                {currentLang === 'hi' ? 'बिट्टू: आराम 🛌 | डॉक्टर: तुरंत दवा 💊' : 'Bittu: Rest | Doctor: Medicine needed'}
              </p>
              <p className="text-[11px] text-rose-800 mt-1">
                {currentLang === 'hi' ? 'खतरनाक चूक! बीमारी को अनदेखा करना।' : 'Dangerous Miss! Overlooked illness.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => { setMode('game'); playTone('click'); }}
            className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>🎮 {currentLang === 'hi' ? '१० मरीजों की परीक्षा लें (Start Game)' : 'Start 10 Patient Challenge'}</span>
          </button>
        </div>
      )}

      {/* VIEW 3: PLAYABLE CLINIC CHALLENGE */}
      {mode === 'game' && (
        <div className="bg-white border-2 border-blue-200 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col items-center">
          
          <div className="w-full max-w-lg flex justify-between items-center mb-4 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
            <span className="text-xs font-black text-blue-950">
              {currentLang === 'hi' ? 'मरीज रिपोर्ट:' : 'Patient Report:'} {caseIdx + 1} / 10
            </span>
            <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <span>{currentLang === 'hi' ? 'सटीक उत्तर:' : 'Correct:'}</span>
              <strong className="text-emerald-600 font-black">{correctPredictions}</strong>
            </div>
          </div>

          {caseIdx < TEN_PATIENT_CASES.length && (
            <div className="w-full max-w-lg bg-gradient-to-b from-blue-50/50 to-white border-2 border-blue-300 rounded-3xl p-6 text-center shadow-md mb-5 relative">
              <span className="text-5xl mb-2 block animate-pulse">
                {TEN_PATIENT_CASES[caseIdx].icon}
              </span>

              <h3 className="text-lg font-black text-slate-900 mb-1">
                {currentLang === 'hi' ? TEN_PATIENT_CASES[caseIdx].reportTypeHi : TEN_PATIENT_CASES[caseIdx].reportTypeEn}
              </h3>
              <span className="text-xs text-slate-500 font-bold block mb-4">
                {currentLang === 'hi' ? 'मरीज क्रमांक' : 'Patient ID'}: #{TEN_PATIENT_CASES[caseIdx].id}
              </span>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white border-2 border-purple-200 p-3 rounded-2xl shadow-sm">
                  <span className="text-[10px] font-black text-purple-700 block uppercase">
                    🤖 {currentLang === 'hi' ? 'बिट्टू (AI) का अनुमान' : 'Bittu (AI) Prediction'}
                  </span>
                  <span className="text-sm font-black text-slate-900 mt-1 block">
                    {TEN_PATIENT_CASES[caseIdx].bittuPrediction 
                      ? (currentLang === 'hi' ? 'दवा चाहिए 💊' : 'Medicine Needed 💊') 
                      : (currentLang === 'hi' ? 'दवा नहीं (आराम) 🛌' : 'No Medicine (Rest) 🛌')
                    }
                  </span>
                </div>

                <div className="bg-white border-2 border-blue-200 p-3 rounded-2xl shadow-sm">
                  <span className="text-[10px] font-black text-blue-700 block uppercase">
                    👨‍⚕️ {currentLang === 'hi' ? 'डॉक्टर का अंतिम फैसला' : 'Doctor\'s Verdict'}
                  </span>
                  <span className="text-sm font-black text-slate-900 mt-1 block">
                    {TEN_PATIENT_CASES[caseIdx].doctorDecision 
                      ? (currentLang === 'hi' ? 'दवा चाहिए 💊' : 'Medicine Needed 💊') 
                      : (currentLang === 'hi' ? 'दवा नहीं (आराम) 🛌' : 'No Medicine (Rest) 🛌')
                    }
                  </span>
                </div>
              </div>

              <p className="text-xs font-black text-slate-800 mb-3">
                {currentLang === 'hi' 
                  ? 'बताइए यह कौन सा परिणाम है?' 
                  : 'Which Confusion Matrix outcome is this?'}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleAnswer('TP')}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black cursor-pointer shadow transition"
                >
                  🟢 True Positive (TP)
                </button>
                <button
                  onClick={() => handleAnswer('TN')}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black cursor-pointer shadow transition"
                >
                  🔵 True Negative (TN)
                </button>
                <button
                  onClick={() => handleAnswer('FP')}
                  className="p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black cursor-pointer shadow transition"
                >
                  🟠 False Positive (FP)
                </button>
                <button
                  onClick={() => handleAnswer('FN')}
                  className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black cursor-pointer shadow transition"
                >
                  🔴 False Negative (FN)
                </button>
              </div>

              {lastFeedback && (
                <div className={`mt-3 p-2.5 rounded-xl text-xs font-black animate-in fade-in ${
                  lastFeedback.isCorrect ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-rose-100 text-rose-950 border border-rose-300'
                }`}>
                  {currentLang === 'hi' ? lastFeedback.textHi : lastFeedback.textEn}
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* VIEW 4: RESULTS REPORT CARD & ACCURACY CALCULATION */}
      {mode === 'results' && (
        <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl mb-3 shadow-lg">
            🏆
          </div>

          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1">
            {currentLang === 'hi' ? 'क्लीनिक मूल्यांकन पूरा हुआ!' : 'Clinic Evaluation Complete!'}
          </h2>
          <p className="text-xs text-slate-600 mb-6 font-semibold">
            {currentLang === 'hi' ? 'तारा और बिट्टू के १० मरीजों का रिपोर्ट कार्ड' : 'Tara & Bittu\'s 10 Patient Report Card'}
          </p>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-5 w-full mb-6 shadow-inner">
            <span className="text-[11px] font-black text-blue-900 uppercase block mb-1">
              {currentLang === 'hi' ? 'बिट्टू की कुल सटीकता (Accuracy)' : 'Bittu\'s Diagnostic Accuracy'}
            </span>
            <span className="text-5xl font-black text-blue-600 block">
              {accuracyPercent}%
            </span>
            <span className="text-xs font-bold text-slate-600 mt-1 block">
              ({counts.TP + counts.TN} / 10 {currentLang === 'hi' ? 'मरीज सही पहचाने गए' : 'correct cases'})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 w-full mb-6">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left">
              <span className="text-[10px] font-black text-emerald-800 block">🟢 True Positive (TP)</span>
              <strong className="text-lg font-black text-emerald-950">{counts.TP}</strong>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-left">
              <span className="text-[10px] font-black text-blue-800 block">🔵 True Negative (TN)</span>
              <strong className="text-lg font-black text-blue-950">{counts.TN}</strong>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left">
              <span className="text-[10px] font-black text-amber-800 block">🟠 False Positive (FP)</span>
              <strong className="text-lg font-black text-amber-950">{counts.FP}</strong>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-left">
              <span className="text-[10px] font-black text-rose-800 block">🔴 False Negative (FN)</span>
              <strong className="text-lg font-black text-rose-950">{counts.FN}</strong>
            </div>
          </div>

          <div className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-700 font-bold mb-6 text-left">
            📐 <strong>{currentLang === 'hi' ? 'सटीकता का सूत्र:' : 'Accuracy Formula:'}</strong>
            <p className="mt-0.5 font-mono text-[11px] text-blue-900">Accuracy = (TP + TN) ÷ Total = ({counts.TP} + {counts.TN}) ÷ 10 = {accuracyPercent}%</p>
          </div>

          <button
            onClick={() => {
              setCaseIdx(0);
              setCounts({ TP: 0, TN: 0, FP: 0, FN: 0 });
              setMode('story');
              setCurrentPage(53);
              playTone('click');
            }}
            className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{currentLang === 'hi' ? 'कहानी फिर से शुरू करें' : 'Play Story Again'}</span>
          </button>
        </div>
      )}

    </div>
  );
}