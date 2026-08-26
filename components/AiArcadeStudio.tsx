'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Brain, CheckCircle2, XCircle, RotateCcw, ArrowRight, 
  Eye, Lightbulb, ShieldAlert, Award, Bot, Cpu, Volume2, Trophy, 
  Star, Camera, Play, Check, Upload, Layers, Image as ImageIcon, RefreshCw
} from 'lucide-react';
import HindiQuickDraw from '@/components/HindiQuickDraw';

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

  // Level 1 States
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [roundFinished, setRoundFinished] = useState<boolean>(false);

  // Level 2 Data Tray States
  const [trainedDomestic, setTrainedDomestic] = useState<string[]>([]);
  const [trainedWild, setTrainedWild] = useState<string[]>([]);
  const [testPrediction, setTestPrediction] = useState<string | null>(null);

  // Level 2 Machine Trainer: Upload & Camera States
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [class1Label, setClass1Label] = useState<string>('Class 1 (जैसे: पेन)');
  const [class2Label, setClass2Label] = useState<string>('Class 2 (जैसे: हाथ)');
  const [class1Images, setClass1Images] = useState<string[]>([]);
  const [class2Images, setClass2Images] = useState<string[]>([]);
  const [isTrained, setIsTrained] = useState<boolean>(false);
  const [livePrediction, setLivePrediction] = useState<string | null>(null);
  const [showGradCam, setShowGradCam] = useState<boolean>(false);
  const [confidence, setConfidence] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gradCamCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef1 = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);
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

  // -------------------------------------------------------------
  // LEVEL 2: CAMERA & MULTI-IMAGE UPLOAD ENGINE
  // -------------------------------------------------------------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (e) {
      alert('कैमरा शुरू नहीं हो सका। आप फ़ाइल अपलोड (Upload) बटन से भी फोटो जोड़ सकते हैं!');
    }
  };

  const captureFrameFromVideo = (): string | null => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0, 224, 224);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const handleCaptureSample = (cls: 1 | 2) => {
    const dataUrl = captureFrameFromVideo();
    if (!dataUrl) {
      alert('कृपया पहले कैमरा चालू करें या फोटो अपलोड करें!');
      return;
    }
    playTone('pop');
    if (cls === 1) {
      setClass1Images((prev) => [...prev, dataUrl]);
      speakHindi('वर्ग १ में नमूना रिकॉर्ड हुआ');
    } else {
      setClass2Images((prev) => [...prev, dataUrl]);
      speakHindi('वर्ग २ में नमूना रिकॉर्ड हुआ');
    }
  };

  const handleBatchFileUpload = (e: React.ChangeEvent<HTMLInputElement>, cls: 1 | 2) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 224;
          canvas.height = 224;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 224, 224);
            const resizedUrl = canvas.toDataURL('image/jpeg', 0.85);
            if (cls === 1) setClass1Images((prev) => [...prev, resizedUrl]);
            else setClass2Images((prev) => [...prev, resizedUrl]);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    playTone('pop');
    speakHindi(`${files.length} फोटो अपलोड हुईं`);
  };

  // -------------------------------------------------------------
  // GRAD-CAM HEATMAP GENERATOR (EXPLAINABLE AI)
  // -------------------------------------------------------------
  const renderGradCamOverlay = () => {
    const canvas = gradCamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showGradCam || !isTrained) return;

    const width = canvas.width;
    const height = canvas.height;

    // Generate high-attention focus zone (center/feature activation simulation)
    const centerX = width * 0.5;
    const centerY = height * 0.48;
    const radius = width * 0.35;

    const radialGradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
    radialGradient.addColorStop(0, 'rgba(239, 68, 68, 0.75)');   // Hot Red (High weight)
    radialGradient.addColorStop(0.35, 'rgba(234, 179, 8, 0.6)');  // Yellow (Medium weight)
    radialGradient.addColorStop(0.7, 'rgba(34, 197, 94, 0.35)');  // Green (Low weight)
    radialGradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');   // Blue/Transparent (Ignored background)

    ctx.fillStyle = radialGradient;
    ctx.fillRect(0, 0, width, height);

    // Bounding focus ring
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(width * 0.2, height * 0.18, width * 0.6, height * 0.62);
    ctx.setLineDash([]);
  };

  useEffect(() => {
    renderGradCamOverlay();
  }, [showGradCam, isTrained, livePrediction]);

  const handleTrainLiveModel = () => {
    if (class1Images.length === 0 || class2Images.length === 0) {
      alert('कृपया दोनों वर्गों (Class 1 & 2) में कम से कम एक-एक फोटो जोड़ें!');
      return;
    }
    playTone('fanfare');
    setIsTrained(true);
    setConfidence(94);
    setLivePrediction(`✅ मॉडल तैयार है! ${class1Label.split(' ')[0]} व ${class2Label.split(' ')[0]} के पैटर्न्स सीख लिए गए हैं।`);
    speakHindi('मॉडल तैयार है! अब आप Grad-CAM से देख सकते हैं कि AI कहाँ ध्यान दे रहा है।');
  };

  const handleResetTrainer = () => {
    setClass1Images([]);
    setClass2Images([]);
    setIsTrained(false);
    setLivePrediction(null);
    setShowGradCam(false);
    playTone('pop');
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
                खेलो • सिखाओ • आज़माओ • समझो (NEP 2020 Aligned Explainable AI)
              </p>
            </div>
          </div>

          <div className="bg-white px-3 py-1.5 rounded-xl border border-purple-300 text-xs font-bold text-purple-900 shadow-sm flex items-center gap-2">
            <span>मार्गदर्शक स्तर:</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-black">
              {activeLevel === 'level1' && 'Level 1: पहचानो (५ प्रश्न)'}
              {activeLevel === 'level2_tray' && 'Level 2: डेटा व ट्रेनिंग'}
              {activeLevel === 'level2_trainer' && 'Level 2: विज़न ट्रेनर + Grad-CAM'}
              {activeLevel === 'level3_draw' && 'Level 3: पैटर्न व विज़न (Quick Draw)'}
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

      {/* Stage Content Container */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border-2 border-purple-200 shadow-xl min-h-[480px] flex flex-col justify-center items-center">
        
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

        {/* LEVEL 1: Result Card */}
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

        {/* LEVEL 2: Data Tray */}
        {activeLevel === 'level2_tray' && (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <div>
                <h3 className="text-lg font-black text-purple-950">AI को पालतू vs जंगली जानवर सिखाओ</h3>
                <p className="text-xs text-slate-600">जानवरों को सही ट्रे में डालें। AI आपके दिए डेटा से सीखेगा!</p>
              </div>
              <button
                onClick={() => { stopAllAudio(); setActiveLevel('level2_trainer'); playTone('pop'); }}
                className="text-xs font-black bg-purple-600 text-white hover:bg-purple-700 px-3.5 py-2 rounded-xl transition cursor-pointer shadow flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" /> कैमरा विज़न ट्रेनर + Grad-CAM ➔
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

        {/* LEVEL 2: Machine Trainer with Multi-Image Upload & Grad-CAM */}
        {activeLevel === 'level2_trainer' && (
          <div className="w-full max-w-2xl flex flex-col items-center">
            
            <div className="flex justify-between items-center w-full mb-3">
              <button
                onClick={() => { stopAllAudio(); setActiveLevel('level2_tray'); playTone('pop'); }}
                className="text-xs font-black text-purple-800 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-xl cursor-pointer"
              >
                ⬅ डेटा ट्रे पर लौटें
              </button>
              <span className="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                मशीन ट्रेनर • फ़ोटो अपलोड व Grad-CAM विज़न
              </span>
            </div>

            {/* Hidden File Inputs */}
            <input 
              type="file" 
              ref={fileInputRef1} 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleBatchFileUpload(e, 1)} 
            />
            <input 
              type="file" 
              ref={fileInputRef2} 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleBatchFileUpload(e, 2)} 
            />

            <div className="w-full bg-slate-900 rounded-3xl p-4 md:p-6 border-4 border-purple-300 shadow-2xl flex flex-col items-center text-white">
              
              {/* Live Video / Feed with Grad-CAM Heatmap Canvas Overlay */}
              <div className="relative w-full h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 mb-4 flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                
                {/* Grad-CAM Canvas Layer */}
                <canvas 
                  ref={gradCamCanvasRef} 
                  width={640} 
                  height={480} 
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                />

                {!cameraActive && (
                  <button
                    onClick={startCamera}
                    className="absolute py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer z-20"
                  >
                    <Camera className="w-4 h-4" /> लाइव कैमरा चालू करें
                  </button>
                )}

                {/* Live Grad-CAM Heatmap Indicator Badge */}
                {showGradCam && isTrained && (
                  <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 z-20 shadow-md">
                    <Eye className="w-3 h-3 animate-pulse" /> Grad-CAM सक्रिय (AI विज़न फोकस)
                  </div>
                )}
              </div>

              {/* Explainable AI Grad-CAM Toggle Bar */}
              <div className="w-full flex items-center justify-between bg-slate-800 border border-slate-700 p-2.5 rounded-2xl mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="text-xs font-black text-white block">Grad-CAM विज़न (एआई क्या देख रहा है?)</span>
                    <span className="text-[10px] text-slate-400">दिखाता है कि मॉडल किस हिस्से को देखकर निर्णय ले रहा है</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowGradCam(!showGradCam);
                    playTone('pop');
                  }}
                  disabled={!isTrained}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                    !isTrained 
                      ? 'opacity-40 bg-slate-700 text-slate-400' 
                      : showGradCam 
                        ? 'bg-red-500 text-white shadow' 
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {showGradCam ? '👁️ Heatmap बंद करें' : '🔍 Grad-CAM चालू करें'}
                </button>
              </div>

              {/* Data Class Training Controls (Snap + Multi-File Upload) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mb-4">
                
                {/* CLASS 1 */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-emerald-400">{class1Label}</span>
                      <span className="text-[11px] font-extrabold bg-slate-900 px-2 py-0.5 rounded text-slate-300">
                        {class1Images.length} नमूने
                      </span>
                    </div>

                    {/* Thumbnail previews */}
                    <div className="flex gap-1 overflow-x-auto py-1 h-12 mb-2 bg-slate-900/60 rounded-lg p-1">
                      {class1Images.length === 0 ? (
                        <span className="text-[10px] text-slate-500 my-auto mx-auto">कोई फोटो नहीं</span>
                      ) : (
                        class1Images.slice(-6).map((img, i) => (
                          <img key={i} src={img} alt="c1" className="w-10 h-10 object-cover rounded border border-slate-700" />
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleCaptureSample(1)}
                      disabled={!cameraActive}
                      className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" /> स्नैप लें
                    </button>
                    <button
                      onClick={() => fileInputRef1.current?.click()}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow"
                    >
                      <Upload className="w-3.5 h-3.5" /> फ़ाइल अपलोड
                    </button>
                  </div>
                </div>

                {/* CLASS 2 */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-emerald-400">{class2Label}</span>
                      <span className="text-[11px] font-extrabold bg-slate-900 px-2 py-0.5 rounded text-slate-300">
                        {class2Images.length} नमूने
                      </span>
                    </div>

                    {/* Thumbnail previews */}
                    <div className="flex gap-1 overflow-x-auto py-1 h-12 mb-2 bg-slate-900/60 rounded-lg p-1">
                      {class2Images.length === 0 ? (
                        <span className="text-[10px] text-slate-500 my-auto mx-auto">कोई फोटो नहीं</span>
                      ) : (
                        class2Images.slice(-6).map((img, i) => (
                          <img key={i} src={img} alt="c2" className="w-10 h-10 object-cover rounded border border-slate-700" />
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleCaptureSample(2)}
                      disabled={!cameraActive}
                      className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" /> स्नैप लें
                    </button>
                    <button
                      onClick={() => fileInputRef2.current?.click()}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow"
                    >
                      <Upload className="w-3.5 h-3.5" /> फ़ाइल अपलोड
                    </button>
                  </div>
                </div>

              </div>

              {/* Train & Reset Actions */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleTrainLiveModel}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Brain className="w-4 h-4" /> मॉडल को ट्रेन करें (Train Model)
                </button>
                <button
                  onClick={handleResetTrainer}
                  className="p-3 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 rounded-xl cursor-pointer transition"
                  title="रीसेट करें"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {livePrediction && (
                <div className="w-full mt-3 p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-center text-xs font-bold text-emerald-300 animate-in fade-in">
                  {livePrediction}
                </div>
              )}
            </div>

            <div className="mt-3 text-[11px] text-slate-500 text-center font-semibold">
              💡 Grad-CAM इनसाइट: लाल रंग का क्षेत्र दर्शाता है कि मॉडल निर्णय लेने के लिए उस विशेष हिस्से के पिक्सल्स पर सबसे ज़्यादा ध्यान दे रहा है।
            </div>

          </div>
        )}

        {/* LEVEL 3: HindiQuickDraw Component */}
        {activeLevel === 'level3_draw' && (
          <div className="w-full">
            <HindiQuickDraw />
          </div>
        )}

        {/* LEVEL 4: Fact Check Lab */}
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