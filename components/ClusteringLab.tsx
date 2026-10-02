'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, RotateCcw, Volume2, Sparkles, HelpCircle, 
  Layers, ChevronRight, CheckCircle2, ArrowRight
} from 'lucide-react';

interface DataPoint {
  id: number;
  x: number;
  y: number;
  cluster: number | null; // 0, 1, or 2
}

interface Centroid {
  id: number;
  x: number;
  y: number;
  color: string;
  nameEn: string;
  nameHi: string;
}

const CLUSTER_COLORS = [
  { fill: '#ef4444', ring: 'border-red-500', bg: 'bg-red-50', nameEn: 'Red Cluster (Group 1)', nameHi: 'लाल समूह (ग्रुप १)' },
  { fill: '#3b82f6', ring: 'border-blue-500', bg: 'bg-blue-50', nameEn: 'Blue Cluster (Group 2)', nameHi: 'नीला समूह (ग्रुप २)' },
  { fill: '#10b981', ring: 'border-emerald-500', bg: 'bg-emerald-50', nameEn: 'Green Cluster (Group 3)', nameHi: 'हरा समूह (ग्रुप ३)' },
];

export default function ClusteringLab() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [kCount, setKCount] = useState<number>(3); // 2 or 3 clusters
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [stepPhase, setStepPhase] = useState<'idle' | 'assigned' | 'moved'>('idle');
  const [iterationCount, setIterationCount] = useState<number>(0);
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('hi');
  const [explanationText, setExplanationText] = useState<{ en: string; hi: string }>({
    en: 'Click anywhere on the grid to place data dots, or click "Load Preset"!',
    hi: 'ग्रिड पर कहीं भी क्लिक करके बिंदु (Data Dots) बनाएं, या "प्रारूप लोड करें" दबाएं!'
  });

  // --- Voice Synthesis Assistant ---
  const speakVoice = (text: string, lang: 'en' | 'hi') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  // --- Preset Scenarios (Apples, Cups, Leaves) ---
  const loadPresetData = (scenario: 'apples' | 'colors') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    let newPts: DataPoint[] = [];
    if (scenario === 'apples') {
      // 3 natural clusters: Small sweet apples, Big green apples, Rotten apples
      const centers = [
        { x: w * 0.25, y: h * 0.35, count: 14 },
        { x: w * 0.75, y: h * 0.3, count: 16 },
        { x: w * 0.5, y: h * 0.78, count: 15 }
      ];

      let id = 1;
      centers.forEach(c => {
        for (let i = 0; i < c.count; i++) {
          newPts.push({
            id: id++,
            x: Math.min(w - 20, Math.max(20, c.x + (Math.random() - 0.5) * 120)),
            y: Math.min(h - 20, Math.max(20, c.y + (Math.random() - 0.5) * 100)),
            cluster: null
          });
        }
      });
      setExplanationText({
        en: 'Loaded Apple Orchard Data! Notice how dots naturally clump together without any labels.',
        hi: 'सेब के बाग का डेटा तैयार है! बिना किसी लेबल के देखें कि बिंदु कैसे अपने आप झुंड बना रहे हैं।'
      });
    } else {
      // 2 clusters: Sweet Cider vs Sour Cider features
      const centers = [
        { x: w * 0.3, y: h * 0.5, count: 18 },
        { x: w * 0.7, y: h * 0.5, count: 18 }
      ];
      let id = 1;
      centers.forEach(c => {
        for (let i = 0; i < c.count; i++) {
          newPts.push({
            id: id++,
            x: Math.min(w - 20, Math.max(20, c.x + (Math.random() - 0.5) * 140)),
            y: Math.min(h - 20, Math.max(20, c.y + (Math.random() - 0.5) * 140)),
            cluster: null
          });
        }
      });
      setExplanationText({
        en: 'Loaded 2 Taste Profile Groups! Let AI find the natural boundary.',
        hi: '२ स्वाद प्रोफाइल लोड हो गए! अब AI बिना लेबल के खुद अंतर खोजेगा।'
      });
    }

    setDataPoints(newPts);
    setCentroids([]);
    setStepPhase('idle');
    setIterationCount(0);
  };

  // --- Step 1: Initialize Centroids Randomly ---
  const initializeCentroids = () => {
    if (dataPoints.length < kCount) {
      alert(currentLang === 'hi' ? 'कम से कम ६-८ बिंदु बनाएं!' : 'Please place at least 6-8 dots first!');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    const initialCentroids: Centroid[] = [];
    for (let i = 0; i < kCount; i++) {
      // Pick random point from canvas
      const randPt = dataPoints[Math.floor(Math.random() * dataPoints.length)];
      initialCentroids.push({
        id: i,
        x: randPt.x + (Math.random() - 0.5) * 30,
        y: randPt.y + (Math.random() - 0.5) * 30,
        color: CLUSTER_COLORS[i].fill,
        nameEn: CLUSTER_COLORS[i].nameEn,
        nameHi: CLUSTER_COLORS[i].nameHi,
      });
    }

    setCentroids(initialCentroids);
    setStepPhase('idle');
    setIterationCount(1);

    const msg = {
      en: `Step 1: Placed ${kCount} Center Magnets (Centroids) randomly. Next: Click "Assign Dots to Closest Center"!`,
      hi: `पहला कदम: हमने यादृच्छिक रूप से ${kCount} केंद्रक (Centroid) स्थापित किए। अब "निकटतम केंद्र से जोड़ें" दबाएं!`
    };
    setExplanationText(msg);
    speakVoice(msg[currentLang], currentLang);
  };

  // --- Step 2: Assign Dots to Nearest Centroid ---
  const assignPointsToCentroids = () => {
    if (centroids.length === 0) return;

    const updated = dataPoints.map(pt => {
      let minDist = Infinity;
      let closestClusterIndex = 0;

      centroids.forEach((c, idx) => {
        const dist = Math.hypot(pt.x - c.x, pt.y - c.y);
        if (dist < minDist) {
          minDist = dist;
          closestClusterIndex = idx;
        }
      });

      return { ...pt, cluster: closestClusterIndex };
    });

    setDataPoints(updated);
    setStepPhase('assigned');

    const msg = {
      en: 'Step 2: Every dot joined the nearest magnet! Colors show which group they belong to.',
      hi: 'दूसरा कदम: हर बिंदु अपने सबसे करीबी केंद्रक से जुड़ गया! रंगों से उनके समूह का पता चलता है।'
    };
    setExplanationText(msg);
    speakVoice(msg[currentLang], currentLang);
  };

  // --- Step 3: Move Centroids to the Mean of Their Points ---
  const updateCentroidPositions = () => {
    if (centroids.length === 0) return;

    let hasShifted = false;
    const updatedCentroids = centroids.map((c, cIdx) => {
      const assignedPts = dataPoints.filter(p => p.cluster === cIdx);
      if (assignedPts.length === 0) return c;

      const avgX = assignedPts.reduce((sum, p) => sum + p.x, 0) / assignedPts.length;
      const avgY = assignedPts.reduce((sum, p) => sum + p.y, 0) / assignedPts.length;

      if (Math.hypot(c.x - avgX, c.y - avgY) > 1.5) {
        hasShifted = true;
      }

      return { ...c, x: avgX, y: avgY };
    });

    setCentroids(updatedCentroids);
    setStepPhase('moved');
    setIterationCount(prev => prev + 1);

    if (!hasShifted) {
      const msg = {
        en: '🎉 Convergence Reached! The magnets stopped moving. AI has successfully grouped your data without any teacher!',
        hi: '🎉 संतुलन मिल गया! केंद्रकों ने हिलना बंद कर दिया है। AI ने बिना किसी लेबल के समूहों को पूरी तरह पहचान लिया!'
      };
      setExplanationText(msg);
      speakVoice(msg[currentLang], currentLang);
    } else {
      const msg = {
        en: 'Step 3: Centers slid to the exact middle of their groups. Repeat Steps 2 & 3 until they stop moving!',
        hi: 'तीसरा कदम: केंद्रक अपने समूह के ठीक मध्य में खिसक गए। जब तक ये स्थिर न हों, यही दोहराएं!'
      };
      setExplanationText(msg);
      speakVoice(msg[currentLang], currentLang);
    }
  };

  // --- Canvas Click to Add Data ---
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    setDataPoints(prev => [...prev, { id: Date.now() + Math.random(), x, y, cluster: null }]);
    if (centroids.length > 0) {
      setStepPhase('idle');
    }
  };

  // --- Canvas Rendering Loop ---
  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Subtle Grid Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Connect points to centroids if assigned
    if (centroids.length > 0 && (stepPhase === 'assigned' || stepPhase === 'moved')) {
      dataPoints.forEach(pt => {
        if (pt.cluster !== null && centroids[pt.cluster]) {
          const c = centroids[pt.cluster];
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(c.x, c.y);
          ctx.strokeStyle = `${c.color}25`; // semi-transparent line
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });
    }

    // Draw Data Points
    dataPoints.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
      if (pt.cluster !== null && centroids[pt.cluster]) {
        ctx.fillStyle = centroids[pt.cluster].color;
      } else {
        ctx.fillStyle = '#64748b'; // unassigned neutral slate
      }
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw Centroids (Magnets / Stars)
    centroids.forEach((c, idx) => {
      // Glow Ring
      ctx.beginPath();
      ctx.arc(c.x, c.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = `${c.color}30`;
      ctx.fill();

      // Outer Ring
      ctx.beginPath();
      ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner Marker Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`K${idx + 1}`, c.x, c.y);
    });
  }, [dataPoints, centroids, stepPhase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 700;
      canvas.height = 420;
      drawScene();
    }
  }, [drawScene]);

  // Reset Everything
  const handleReset = () => {
    setDataPoints([]);
    setCentroids([]);
    setStepPhase('idle');
    setIterationCount(0);
    setExplanationText({
      en: 'Grid cleared! Click anywhere to make dots or choose a preset.',
      hi: 'ग्रिड खाली कर दिया गया है! कहीं भी बिंदु बनाएं या प्रारूप चुनें।'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 font-sans select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-4 md:p-5 rounded-3xl shadow-lg mb-5 flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🤖</span>
            <h1 className="text-lg md:text-xl font-black">
              {currentLang === 'hi' ? 'अनसुपरवाइज्ड लर्निंग लैब (K-Means Clustering)' : 'Unsupervised AI Lab: K-Means Clustering'}
            </h1>
          </div>
          <p className="text-[11px] md:text-xs text-teal-100 font-semibold">
            {currentLang === 'hi' 
              ? 'कंप्यूटर बिना किसी शिक्षक/लेबल के डेटा में छुपे पैटर्न कैसे ढूंढता है?' 
              : 'How does AI discover hidden patterns without any human teacher or labels?'}
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex bg-white/20 p-1 rounded-2xl backdrop-blur-md gap-1">
          <button
            onClick={() => {
              setCurrentLang('hi');
              speakVoice(explanationText.hi, 'hi');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
              currentLang === 'hi' ? 'bg-white text-teal-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => {
              setCurrentLang('en');
              speakVoice(explanationText.en, 'en');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
              currentLang === 'en' ? 'bg-white text-teal-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white border-2 border-teal-200 rounded-3xl p-4 md:p-5 shadow-xl flex flex-col items-center">
        
        {/* Controls Toolbar */}
        <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-3 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              {currentLang === 'hi' ? 'समूह संख्या (K):' : 'Clusters (K):'}
            </span>
            <button
              onClick={() => { setKCount(2); setCentroids([]); setStepPhase('idle'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                kCount === 2 ? 'bg-teal-600 text-white shadow-sm' : 'bg-white border border-slate-300 text-slate-700'
              }`}
            >
              K = 2
            </button>
            <button
              onClick={() => { setKCount(3); setCentroids([]); setStepPhase('idle'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                kCount === 3 ? 'bg-teal-600 text-white shadow-sm' : 'bg-white border border-slate-300 text-slate-700'
              }`}
            >
              K = 3
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => loadPresetData('apples')}
              className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              🍎 {currentLang === 'hi' ? 'सेब का बाग' : 'Apple Orchard'}
            </button>
            <button
              onClick={() => loadPresetData('colors')}
              className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              🍹 {currentLang === 'hi' ? 'साइ़डर स्वाद' : 'Taste Profiles'}
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> {currentLang === 'hi' ? 'खाली करें' : 'Clear'}
            </button>
          </div>
        </div>

        {/* Canvas Frame */}
        <div className="w-full bg-slate-50 border-2 border-teal-300 rounded-3xl overflow-hidden shadow-inner relative flex justify-center items-center">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="cursor-crosshair w-full block"
          />

          {dataPoints.length === 0 && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs">
              <Sparkles className="w-10 h-10 text-teal-600 animate-bounce mb-2" />
              <p className="text-sm font-black text-slate-800">
                {currentLang === 'hi' ? 'कैनवास पर क्लिक करके डेटा बिंदु बनाएं!' : 'Click anywhere on canvas to drop data points!'}
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {currentLang === 'hi' ? 'या ऊपर से "सेब का बाग" प्रारूप लोड करें।' : 'Or load the Apple Orchard preset above.'}
              </p>
            </div>
          )}

          {/* Floating Stats */}
          <div className="absolute top-2 left-3 pointer-events-none bg-white/90 border border-slate-200 px-3 py-1 rounded-full text-[11px] font-black text-slate-700 shadow-sm flex items-center gap-2">
            <span>📊 {currentLang === 'hi' ? 'कुल बिंदु:' : 'Total Points:'} {dataPoints.length}</span>
            <span>•</span>
            <span>🔄 {currentLang === 'hi' ? 'चक्र (Rounds):' : 'Rounds:'} {iterationCount}</span>
          </div>
        </div>

        {/* Live Tara & Bittu Voice / Explanation Card */}
        <div className="w-full mt-4 bg-teal-50 border-2 border-teal-300 rounded-2xl p-3.5 flex items-start justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <span className="text-2xl mt-0.5">🤖</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-teal-950 uppercase tracking-wider">
                  {currentLang === 'hi' ? 'बिट्टू रोबोट की व्याख्या (AI Insight)' : 'Bittu Robot Insight'}
                </span>
                <button
                  onClick={() => speakVoice(explanationText[currentLang], currentLang)}
                  className="p-1 hover:bg-teal-200 rounded-full transition cursor-pointer text-teal-800"
                  title="सुने"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-bold text-slate-800 mt-0.5 leading-relaxed">
                {explanationText[currentLang]}
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Execution Buttons */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
          
          <button
            onClick={initializeCentroids}
            disabled={dataPoints.length < 4}
            className={`py-3 px-3 rounded-2xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              centroids.length === 0 && dataPoints.length >= 4
                ? 'bg-amber-500 hover:bg-amber-600 text-white ring-4 ring-amber-200 animate-pulse'
                : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50'
            }`}
          >
            <span>1️⃣ {currentLang === 'hi' ? 'केंद्रक रखो' : 'Place Centroids'}</span>
          </button>

          <button
            onClick={assignPointsToCentroids}
            disabled={centroids.length === 0}
            className={`py-3 px-3 rounded-2xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              stepPhase === 'idle' || stepPhase === 'moved'
                ? 'bg-blue-600 hover:bg-blue-700 text-white ring-4 ring-blue-200'
                : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50'
            }`}
          >
            <span>2️⃣ {currentLang === 'hi' ? 'रंग बांटो (निकटतम)' : 'Assign Points'}</span>
          </button>

          <button
            onClick={updateCentroidPositions}
            disabled={stepPhase !== 'assigned'}
            className={`py-3 px-3 rounded-2xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              stepPhase === 'assigned'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-200 animate-bounce'
                : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50'
            }`}
          >
            <span>3️⃣ {currentLang === 'hi' ? 'मध्य में खिसकाओ' : 'Update Centers'}</span>
          </button>

        </div>

      </div>

      {/* Classroom Pedagogical Callout: Unsupervised Learning Concept Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-xl mb-1">🔍</div>
          <h4 className="text-xs font-black text-slate-900 mb-0.5">
            {currentLang === 'hi' ? 'कोई शिक्षक नहीं (No Labels)' : 'No Teacher Needed'}
          </h4>
          <p className="text-[11px] text-slate-600 leading-snug">
            {currentLang === 'hi'
              ? 'सुपरवाइज्ड लर्निंग में हम बताते हैं "यह बिल्ली है, यह कुत्ता है"। अनसुपरवाइज्ड में AI खुद दूरियों को नापकर ग्रुप बनाता है!'
              : 'In supervised learning we provide labels. Here, the machine simply groups similar things using geometric distance.'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-xl mb-1">🧲</div>
          <h4 className="text-xs font-black text-slate-900 mb-0.5">
            {currentLang === 'hi' ? 'केंद्रक क्या है? (Centroid)' : 'What is a Centroid?'}
          </h4>
          <p className="text-[11px] text-slate-600 leading-snug">
            {currentLang === 'hi'
              ? 'यह एक चुंबक की तरह है। अपने आसपास के बिंदुओं को अपनी ओर आकर्षित करता है और फिर ठीक उनके बीच में जाकर बैठ जाता है।'
              : 'Like a magnet that gathers nearby dots, then slides to the exact mathematical average (center) of its cluster.'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-xl mb-1">🎯</div>
          <h4 className="text-xs font-black text-slate-900 mb-0.5">
            {currentLang === 'hi' ? 'असली दुनिया में प्रयोग' : 'Real-World Uses'}
          </h4>
          <p className="text-[11px] text-slate-600 leading-snug">
            {currentLang === 'hi'
              ? 'Netflix या YouTube यह देखकर कि आप क्या देखते हैं, ऐसे ही समूहों (Clusters) में आपकी पसंद ढूंढते हैं!'
              : 'Recommendation engines (like Spotify or Netflix) use clustering to group users with similar tastes automatically.'}
          </p>
        </div>
      </div>

    </div>
  );
}