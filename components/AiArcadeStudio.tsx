'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Brain, CheckCircle2, XCircle, RotateCcw, ArrowRight, 
  Eye, Lightbulb, ShieldAlert, Award, Bot, Cpu, Volume2, Trophy, 
  Star, Camera, Play, Check, Upload, Layers, Image as ImageIcon, 
  RefreshCw, Scan, Loader2, Plus, Trash2, Edit3, X, Globe
} from 'lucide-react';
import HindiQuickDraw from '@/components/HindiQuickDraw';
import ClusteringLab from '@/components/ClusteringLab';
import TaraBittuDoctorLab from '@/components/TaraBittuDoctorLab';

// TensorFlow.js & Official MobileNet + KNN stack
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

type AiLevel = 'level1' | 'level2_tray' | 'level2_trainer' | 'level3_draw' | 'level4_fact' | 'level5_cluster' | 'level6_doctor';

interface QuizQuestion {
  id: string;
  nameHi: string;
  nameEn: string;
  emoji: string;
  isAi: boolean;
  onCorrectTextHi: string;
  onCorrectTextEn: string;
  onWrongTextHi: string;
  onWrongTextEn: string;
  audioPromptHi: string;
  audioPromptEn: string;
}

const FIVE_QUESTIONS: QuizQuestion[] = [
  { 
    id: 'maps', 
    nameHi: 'Google Maps (रास्ता व ट्रैफिक)', 
    nameEn: 'Google Maps (Route & Traffic)',
    emoji: '🗺️', 
    isAi: true, 
    onCorrectTextHi: 'सही उत्तर! Maps लाइव ट्रैफिक डेटा और AI से सबसे तेज़ रास्ता खोजता है।', 
    onCorrectTextEn: 'Correct! Maps uses live traffic data and AI algorithms to find the fastest route.',
    onWrongTextHi: 'गलत उत्तर! Google Maps में AI का इस्तेमाल होता है। यह डेटा सीखकर रास्ता तय करता है।', 
    onWrongTextEn: 'Wrong! Google Maps does use AI to calculate the optimal route dynamically.',
    audioPromptHi: 'गूगल मैप्स। क्या यह काम करने के लिए ए आई का इस्तेमाल करता है?',
    audioPromptEn: 'Google Maps. Does it use AI to recommend routes?'
  },
  { 
    id: 'washing', 
    nameHi: 'वाशिंग मशीन (Washing Machine)', 
    nameEn: 'Washing Machine',
    emoji: '🧺', 
    isAi: false, 
    onCorrectTextHi: 'सही उत्तर! इसमें पहले से तय मोटर टाइमर होते हैं। यह खुद सोचकर नया निर्णय नहीं लेती।', 
    onCorrectTextEn: 'Correct! It operates on pre-programmed electromechanical timers without AI learning.',
    onWrongTextHi: 'गलत उत्तर! साधारण वाशिंग मशीन में AI नहीं होता। यह सिर्फ पहले से तय टाइमर और मोटर से चलती है।', 
    onWrongTextEn: 'Wrong! Standard washing machines do not learn from experience; they run fixed programs.',
    audioPromptHi: 'वाशिंग मशीन। क्या इसमें ए आई है?',
    audioPromptEn: 'Washing machine. Does this standard appliance use AI?'
  },
  { 
    id: 'youtube', 
    nameHi: 'YouTube वीडियो सुझाव (Recommendations)', 
    nameEn: 'YouTube Recommendations',
    emoji: '📺', 
    isAi: true, 
    onCorrectTextHi: 'सही उत्तर! YouTube AI आपकी पसंद को समझकर वैसे ही नए वीडियो खोजकर सुझाता है।', 
    onCorrectTextEn: 'Correct! YouTube recommender systems use deep neural networks to match your taste.',
    onWrongTextHi: 'गलत उत्तर! YouTube में AI होता है। यह आपकी पुरानी पसंद को देखकर नए वीडियो सुझाता है।', 
    onWrongTextEn: 'Wrong! YouTube heavily relies on machine learning models to suggest videos.',
    audioPromptHi: 'यूट्यूब वीडियो सुझाव। क्या यह ए आई है?',
    audioPromptEn: 'YouTube video recommendation. Is this powered by AI?'
  },
  { 
    id: 'lift', 
    nameHi: 'लिफ्ट का बटन (Elevator / Lift)', 
    nameEn: 'Elevator Button (Lift)',
    emoji: '🛗', 
    isAi: false, 
    onCorrectTextHi: 'सही उत्तर! लिफ्ट साधारण इलेक्ट्रिक स्विच और तय नियमों पर चलती है। इसमें AI नहीं होता।', 
    onCorrectTextEn: 'Correct! Elevators run on rule-based electrical relay and logic circuits without AI.',
    onWrongTextHi: 'गलत उत्तर! लिफ्ट में AI नहीं होता। यह साधारण स्विच और मोटर से काम करती है।', 
    onWrongTextEn: 'Wrong! Elevators simply follow programmed rules; they do not learn or adapt.',
    audioPromptHi: 'लिफ्ट का बटन। क्या इसमें ए आई है?',
    audioPromptEn: 'Elevator call button. Does this involve AI?'
  },
  { 
    id: 'faceunlock', 
    nameHi: 'फोन का Face Unlock', 
    nameEn: 'Smartphone Face Unlock',
    emoji: '📱', 
    isAi: true, 
    onCorrectTextHi: 'सही उत्तर! कैमरा आपके चेहरे के खास पैटर्न्स को AI कंप्यूटर विज़न से पहचानता है।', 
    onCorrectTextEn: 'Correct! Face unlock relies on computer vision and neural networks for recognition.',
    onWrongTextHi: 'गलत उत्तर! Face Unlock में AI विज़न का इस्तेमाल होता है ताकि आपका चेहरा पहचाना जा सके।', 
    onWrongTextEn: 'Wrong! Facial recognition is a classic machine learning computer vision application.',
    audioPromptHi: 'फोन का फेस अनलॉक। क्या यह ए आई है?',
    audioPromptEn: 'Phone Face Unlock. Is this computer vision AI?'
  }
];

interface AnimalItem {
  id: string;
  nameHi: string;
  nameEn: string;
  emoji: string;
  isDomestic: boolean;
}

const ALL_ANIMALS: AnimalItem[] = [
  { id: 'dog', nameHi: 'कुत्ता (Dog)', nameEn: 'Dog', emoji: '🐶', isDomestic: true },
  { id: 'cat', nameHi: 'बिल्ली (Cat)', nameEn: 'Cat', emoji: '🐱', isDomestic: true },
  { id: 'cow', nameHi: 'गाय (Cow)', nameEn: 'Cow', emoji: '🐄', isDomestic: true },
  { id: 'tiger', nameHi: 'बाघ (Tiger)', nameEn: 'Tiger', emoji: '🐯', isDomestic: false },
  { id: 'lion', nameHi: 'शेर (Lion)', nameEn: 'Lion', emoji: '🦁', isDomestic: false }
];

interface CustomClassItem {
  id: string;
  name: string;
  images: string[];
}

export function AiArcadeStudio() {
  const [activeLevel, setActiveLevel] = useState<AiLevel>('level1');
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  // Level 1 States
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [roundFinished, setRoundFinished] = useState<boolean>(false);

  // Level 2 Data Tray States
  const [trainedDomestic, setTrainedDomestic] = useState<string[]>([]);
  const [trainedWild, setTrainedWild] = useState<string[]>([]);
  const [testPrediction, setTestPrediction] = useState<string | null>(null);

  // Level 2 Dynamic Classes Engine
  const [modelLoading, setModelLoading] = useState<boolean>(true);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  
  const [classesList, setClassesList] = useState<CustomClassItem[]>([
    { id: 'c1', name: 'Class 1: Pen (पेन)', images: [] },
    { id: 'c2', name: 'Class 2: Hand (हाथ)', images: [] }
  ]);
  
  const [isTrained, setIsTrained] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<'camera' | 'upload'>('camera');
  const [uploadedTestSource, setUploadedTestSource] = useState<string | null>(null);
  
  const [classConfidences, setClassConfidences] = useState<{ [key: string]: number }>({});
  const [winningClassName, setWinningClassName] = useState<string | null>(null);
  const [showGradCam, setShowGradCam] = useState<boolean>(false);

  const mobilenetModelRef = useRef<mobilenet.MobileNet | null>(null);
  const classifierRef = useRef<knnClassifier.KNNClassifier | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const gradCamCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const testFileInputRef = useRef<HTMLInputElement | null>(null);
  const classFileInputsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const audioCtxRef = useRef<AudioContext | null>(null);

  const stopAllAudio = () => {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  };

  const playTone = (type: 'correct' | 'wrong' | 'pop' | 'fanfare') => {
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

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  useEffect(() => {
    async function loadGoogleEngine() {
      if (typeof window === 'undefined') return;
      try {
        await tf.ready();
        const loadedMobilenet = await mobilenet.load({ version: 2, alpha: 1.0 });
        const loadedClassifier = knnClassifier.create();
        mobilenetModelRef.current = loadedMobilenet;
        classifierRef.current = loadedClassifier;
        setModelLoading(false);
      } catch (err) {
        console.error("TensorFlow init error:", err);
        setModelLoading(false);
      }
    }
    loadGoogleEngine();
  }, []);

  useEffect(() => {
    if (activeLevel === 'level1' && !feedback && !roundFinished) {
      const q = FIVE_QUESTIONS[currentIdx];
      speak(lang === 'hi' ? q.audioPromptHi : q.audioPromptEn);
    }
  }, [currentIdx, activeLevel, roundFinished, feedback, lang]);

  const handleSelectAnswer = (userChoseAi: boolean) => {
    stopAllAudio();
    const currentQ = FIVE_QUESTIONS[currentIdx];
    const isAnswerCorrect = (userChoseAi === currentQ.isAi);
    const feedbackString = isAnswerCorrect 
      ? (lang === 'hi' ? currentQ.onCorrectTextHi : currentQ.onCorrectTextEn)
      : (lang === 'hi' ? currentQ.onWrongTextHi : currentQ.onWrongTextEn);

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
      speak(feedbackString);
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
        speak(lang === 'hi' ? `राउंड पूरा हुआ! आपने पाँच में से ${score} अंक प्राप्त किए हैं।` : `Round finished! You scored ${score} out of 5.`);
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
      speak(lang === 'hi' ? `${animal.nameHi.split(' ')[0]} को पालतू श्रेणी में जोड़ा गया` : `${animal.nameEn} added to Domestic`);
    } else {
      setTrainedWild((prev) => [...prev.filter((id) => id !== animal.id), animal.id]);
      setTrainedDomestic((prev) => prev.filter((id) => id !== animal.id));
      speak(lang === 'hi' ? `${animal.nameHi.split(' ')[0]} को जंगली श्रेणी में जोड़ा गया` : `${animal.nameEn} added to Wild`);
    }
    setTestPrediction(null);
  };

  const testNewAnimal = () => {
    stopAllAudio();
    const hasDomestic = trainedDomestic.length > 0;
    const hasWild = trainedWild.length > 0;

    if (!hasDomestic && !hasWild) {
      const msg = lang === 'hi' ? 'कृपया पहले AI को ऊपर उदाहरण देकर सिखाएं!' : 'Please train the model with examples first!';
      playTone('wrong');
      setTestPrediction(msg);
      speak(msg);
      return;
    }

    if (trainedDomestic.includes('cow') || trainedDomestic.includes('dog')) {
      const msg = lang === 'hi' ? 'AI का अनुमान: बकरी एक पालतू जानवर है!' : 'AI prediction: Goat is a Domestic animal!';
      playTone('correct');
      setTestPrediction(`✅ ${msg} (${lang === 'hi' ? 'गाय/कुत्ते के प्रशिक्षण डेटा के आधार पर' : 'based on cow/dog training data'})`);
      speak(msg);
    } else {
      const msg = lang === 'hi' ? 'AI का गलत अनुमान: बकरी जंगली जानवर है!' : 'AI incorrect prediction: Goat is a Wild animal!';
      playTone('wrong');
      setTestPrediction(`❌ ${msg} (${lang === 'hi' ? 'क्योंकि इसे केवल जंगली जानवरों का डेटा दिया गया था!' : 'because only wild animal data was provided!'})`);
      speak(msg);
    }
  };

  const handleAddClass = () => {
    const newIdx = classesList.length + 1;
    const newClass: CustomClassItem = {
      id: `c${Date.now()}`,
      name: `Class ${newIdx}: ${lang === 'hi' ? 'नई वस्तु' : 'New Object'}`,
      images: []
    };
    setClassesList((prev) => [...prev, newClass]);
    setIsTrained(false);
    playTone('pop');
  };

  const handleRemoveClass = (classId: string) => {
    if (classesList.length <= 2) {
      alert(lang === 'hi' ? 'कम से कम २ वर्ग (Classes) होना आवश्यक है!' : 'At least 2 classes are required!');
      return;
    }
    setClassesList((prev) => prev.filter((c) => c.id !== classId));
    setIsTrained(false);
    playTone('pop');
  };

  const handleUpdateClassName = (classId: string, newName: string) => {
    setClassesList((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, name: newName } : c))
    );
  };

  const handleDeleteImage = (classId: string, imgIndex: number) => {
    setClassesList((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          const updated = [...c.images];
          updated.splice(imgIndex, 1);
          return { ...c, images: updated };
        }
        return c;
      })
    );
    setIsTrained(false);
    playTone('pop');
  };

  const startCamera = async () => {
    if (typeof window === 'undefined') return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (e) {
      alert(lang === 'hi' ? 'कैमरा शुरू नहीं हो सका। आप फ़ाइल अपलोड से भी फोटो जोड़ सकते हैं!' : 'Could not access camera. You can also upload photos!');
    }
  };

  const handleCaptureSampleForClass = (classId: string) => {
    if (!videoRef.current || !cameraActive) return;

    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, 224, 224);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setClassesList((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, images: [...c.images, dataUrl] } : c))
    );
    setIsTrained(false);
    playTone('pop');
  };

  const handleBatchFileUploadForClass = (e: React.ChangeEvent<HTMLInputElement>, classId: string) => {
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
            setClassesList((prev) =>
              prev.map((c) => (c.id === classId ? { ...c, images: [...c.images, resizedUrl] } : c))
            );
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    setIsTrained(false);
    playTone('pop');
  };

  const handleTrainLiveModel = async () => {
    const emptyClass = classesList.find((c) => c.images.length === 0);
    if (emptyClass) {
      alert(lang === 'hi' ? `कृपया "${emptyClass.name}" में कम से कम १ फोटो जोड़ें!` : `Please add at least 1 image to "${emptyClass.name}"!`);
      return;
    }

    if (!mobilenetModelRef.current) {
      alert(lang === 'hi' ? 'MobileNet विज़न मॉडल लोड हो रहा है, कृपया २ सेकंड प्रतीक्षा करें...' : 'MobileNet vision model is still initializing, please wait...');
      return;
    }

    setIsTraining(true);
    playTone('pop');

    try {
      classifierRef.current = knnClassifier.create();

      for (let cIdx = 0; cIdx < classesList.length; cIdx++) {
        const classItem = classesList[cIdx];
        for (const imgUrl of classItem.images) {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              tf.tidy(() => {
                const activation = mobilenetModelRef.current!.infer(img, true);
                classifierRef.current!.addExample(activation, cIdx);
              });
              resolve();
            };
            img.onerror = () => resolve();
            img.src = imgUrl;
          });
        }
      }

      setIsTraining(false);
      setIsTrained(true);
      playTone('fanfare');
      speak(lang === 'hi' ? 'मॉडल तैयार है! अब लाइव डिटेक्शन चालू हो गया है।' : 'Model trained successfully! Live classification active.');
    } catch (err) {
      console.error(err);
      setIsTraining(false);
      alert('Training error. Please try again.');
    }
  };

  const runInference = async (element: HTMLVideoElement | HTMLImageElement) => {
    if (!mobilenetModelRef.current || !classifierRef.current || classifierRef.current.getNumClasses() < 2) return;

    try {
      const activation = mobilenetModelRef.current.infer(element, true);
      const result = await classifierRef.current.predictClass(activation);

      const confMap: { [key: string]: number } = {};
      let highestProb = -1;
      let winningName = '';

      classesList.forEach((c, idx) => {
        const prob = Math.round((result.confidences[idx] || 0) * 100);
        confMap[c.id] = prob;
        if (prob > highestProb) {
          highestProb = prob;
          winningName = c.name;
        }
      });

      setClassConfidences(confMap);
      setWinningClassName(winningName);
      activation.dispose();

      if (showGradCam) {
        computeAndDrawGradCam(element);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!isTrained || testMode !== 'camera' || !cameraActive || !videoRef.current) return;

    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        runInference(videoRef.current);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isTrained, testMode, cameraActive, showGradCam, classesList]);

  const handleUploadTestImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setUploadedTestSource(src);
      setTestMode('upload');

      const img = new Image();
      img.onload = () => {
        runInference(img);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const computeAndDrawGradCam = (source: HTMLVideoElement | HTMLImageElement) => {
    if (typeof window === 'undefined') return;
    const canvas = gradCamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 32;
    tempCanvas.height = 32;
    const tCtx = tempCanvas.getContext('2d');
    if (!tCtx) return;

    tCtx.drawImage(source, 0, 0, 32, 32);
    const imgData = tCtx.getImageData(0, 0, 32, 32).data;

    const cellW = canvas.width / 32;
    const cellH = canvas.height / 32;

    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const idx = (y * 32 + x) * 4;
        const r = imgData[idx] / 255;
        const g = imgData[idx + 1] / 255;
        const b = imgData[idx + 2] / 255;

        const brightness = (r + g + b) / 3;
        const contrast = Math.abs(r - g) + Math.abs(g - b);
        const weight = Math.min(1.0, contrast * 1.6 + (brightness > 0.35 ? 0.3 : 0));

        if (weight > 0.22) {
          if (weight > 0.65) {
            ctx.fillStyle = `rgba(239, 68, 68, ${Math.min(0.85, weight)})`;
          } else if (weight > 0.45) {
            ctx.fillStyle = `rgba(234, 179, 8, ${Math.min(0.65, weight)})`;
          } else {
            ctx.fillStyle = `rgba(34, 197, 94, ${Math.min(0.4, weight)})`;
          }
          ctx.fillRect(x * cellW, y * cellH, cellW + 1, cellH + 1);
        }
      }
    }
  };

  const handleResetTrainer = () => {
    if (classifierRef.current) {
      classifierRef.current.clearAllClasses();
    }
    setClassesList([
      { id: 'c1', name: `Class 1: ${lang === 'hi' ? 'पेन' : 'Pen'}`, images: [] },
      { id: 'c2', name: `Class 2: ${lang === 'hi' ? 'हाथ' : 'Hand'}`, images: [] }
    ]);
    setIsTrained(false);
    setWinningClassName(null);
    setShowGradCam(false);
    setUploadedTestSource(null);
    setClassConfidences({});
    playTone('pop');
  };

  return (
    <div className="max-w-5xl mx-auto p-3 md:p-6 font-sans select-none">
      
      {/* Top Banner with Bilingual Toggle */}
      <div className="bg-purple-50/80 p-4 md:p-6 rounded-3xl border border-purple-200 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
              🤖
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-purple-950">
                {lang === 'hi' ? 'AI खेलघर (Desi AI Arcade)' : 'AI Arcade (Desi AI Studio)'}
              </h1>
              <p className="text-xs md:text-sm font-semibold text-purple-800">
                Google MobileNet + Teachable Machine Engine (NEP 2020 Aligned)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex bg-purple-200/60 p-1 rounded-2xl border border-purple-300">
              <button
                onClick={() => { stopAllAudio(); setLang('hi'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  lang === 'hi' ? 'bg-purple-700 text-white shadow-sm' : 'text-purple-950 hover:bg-purple-200'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => { stopAllAudio(); setLang('en'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  lang === 'en' ? 'bg-purple-700 text-white shadow-sm' : 'text-purple-950 hover:bg-purple-200'
                }`}
              >
                English
              </button>
            </div>

            <div className="hidden sm:flex bg-white px-3 py-1.5 rounded-xl border border-purple-300 text-xs font-bold text-purple-900 shadow-sm items-center gap-1.5">
              <span>{lang === 'hi' ? 'स्तर:' : 'Level:'}</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-black">
                {activeLevel === 'level1' && (lang === 'hi' ? 'Level 1: पहचानो (५ प्रश्न)' : 'Level 1: Spot AI (5 Questions)')}
                {activeLevel === 'level2_tray' && (lang === 'hi' ? 'Level 2: डेटा व ट्रेनिंग' : 'Level 2: Data Tray')}
                {activeLevel === 'level2_trainer' && (lang === 'hi' ? 'Level 2: कस्टम विज़न' : 'Level 2: Custom Vision')}
                {activeLevel === 'level3_draw' && (lang === 'hi' ? 'Level 3: Quick Draw विज़न' : 'Level 3: Quick Draw Vision')}
                {activeLevel === 'level4_fact' && (lang === 'hi' ? 'Level 4: सच या कल्पना?' : 'Level 4: Fact or Fiction')}
                {activeLevel === 'level5_cluster' && (lang === 'hi' ? 'Level 5: अनसुपरवाइज्ड क्लस्टरिंग' : 'Level 5: K-Means Clustering')}
                {activeLevel === 'level6_doctor' && (lang === 'hi' ? 'Level 6: डॉक्टर क्लीनिक (Accuracy)' : 'Level 6: Doctor\'s Clinic (Accuracy)')}
              </span>
            </div>
          </div>
        </div>

        {/* 6-Stage Roadmap Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-5">
          <button
            onClick={() => { stopAllAudio(); setActiveLevel('level1'); playTone('pop'); }}
            className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
              activeLevel === 'level1' ? 'bg-purple-600 border-purple-700 text-white shadow-md' : 'bg-white border-purple-100 hover:bg-purple-50/60 text-slate-800'
            }`}
          >
            <span className="text-[10px] font-black opacity-80 block">{lang === 'hi' ? 'चरण १ (LEVEL 1)' : 'LEVEL 1'}</span>
            <span className="text-xs md:text-sm font-black flex items-center gap-1 mt-0.5">
              🔍 {lang === 'hi' ? 'AI है या नहीं?' : 'Is it AI?'}
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
            <span className="text-[10px] font-black opacity-80 block">{lang === 'hi' ? 'चरण २ (LEVEL 2)' : 'LEVEL 2'}</span>
            <span className="text-xs md:text-sm font-black flex items-center gap-1 mt-0.5">
              🧪 {lang === 'hi' ? 'AI को सिखाओ' : 'Train the AI'}
            </span>
          </button>

          <button
            onClick={() => { stopAllAudio(); setActiveLevel('level3_draw'); playTone('pop'); }}
            className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
              activeLevel === 'level3_draw' ? 'bg-purple-600 border-purple-700 text-white shadow-md' : 'bg-white border-purple-100 hover:bg-purple-50/60 text-slate-800'
            }`}
          >
            <span className="text-[10px] font-black opacity-80 block">{lang === 'hi' ? 'चरण ३ (LEVEL 3)' : 'LEVEL 3'}</span>
            <span className="text-xs md:text-sm font-black flex items-center gap-1 mt-0.5">
              🎨 {lang === 'hi' ? 'जल्दी बनाओ AI' : 'Quick Draw AI'}
            </span>
          </button>

          <button
            onClick={() => { stopAllAudio(); setActiveLevel('level4_fact'); playTone('pop'); }}
            className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
              activeLevel === 'level4_fact' ? 'bg-purple-600 border-purple-700 text-white shadow-md' : 'bg-white border-purple-100 hover:bg-purple-50/60 text-slate-800'
            }`}
          >
            <span className="text-[10px] font-black opacity-80 block">{lang === 'hi' ? 'चरण ४ (LEVEL 4)' : 'LEVEL 4'}</span>
            <span className="text-xs md:text-sm font-black flex items-center gap-1 mt-0.5">
              🧐 {lang === 'hi' ? 'सच या कल्पना?' : 'Fact or Fiction'}
            </span>
          </button>

          <button
            onClick={() => { stopAllAudio(); setActiveLevel('level5_cluster'); playTone('pop'); }}
            className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
              activeLevel === 'level5_cluster' ? 'bg-purple-600 border-purple-700 text-white shadow-md' : 'bg-white border-purple-100 hover:bg-purple-50/60 text-slate-800'
            }`}
          >
            <span className="text-[10px] font-black opacity-80 block">{lang === 'hi' ? 'चरण ५ (LEVEL 5)' : 'LEVEL 5'}</span>
            <span className="text-xs md:text-sm font-black flex items-center gap-1 mt-0.5">
              🧲 {lang === 'hi' ? 'क्लस्टरिंग' : 'Clustering'}
            </span>
          </button>

          <button
            onClick={() => { stopAllAudio(); setActiveLevel('level6_doctor'); playTone('pop'); }}
            className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
              activeLevel === 'level6_doctor' ? 'bg-purple-600 border-purple-700 text-white shadow-md' : 'bg-white border-purple-100 hover:bg-purple-50/60 text-slate-800'
            }`}
          >
            <span className="text-[10px] font-black opacity-80 block">{lang === 'hi' ? 'चरण ६ (LEVEL 6)' : 'LEVEL 6'}</span>
            <span className="text-xs md:text-sm font-black flex items-center gap-1 mt-0.5">
              🩺 {lang === 'hi' ? 'डॉक्टर क्लीनिक' : 'Doctor Clinic'}
            </span>
          </button>
        </div>
      </div>

      {/* Stage Container */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border-2 border-purple-200 shadow-xl min-h-[480px] flex flex-col justify-center items-center">
        
        {/* LEVEL 1: Active 5-Question Flow */}
        {activeLevel === 'level1' && !roundFinished && (
          <div className="w-full max-w-lg flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
                {lang === 'hi' ? `प्रश्न ${currentIdx + 1} / 5 • स्कोर: ${score}` : `Question ${currentIdx + 1} / 5 • Score: ${score}`}
              </span>
              <button
                onClick={() => {
                  const q = FIVE_QUESTIONS[currentIdx];
                  speak(lang === 'hi' ? q.audioPromptHi : q.audioPromptEn);
                }}
                className="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full transition cursor-pointer"
                title={lang === 'hi' ? 'आवाज़ सुनें' : 'Listen'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 mb-6 shadow-inner flex flex-col items-center">
              <span className="text-6xl md:text-7xl mb-3 animate-bounce">
                {FIVE_QUESTIONS[currentIdx].emoji}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1">
                {lang === 'hi' ? FIVE_QUESTIONS[currentIdx].nameHi : FIVE_QUESTIONS[currentIdx].nameEn}
              </h2>
              <p className="text-xs text-slate-600">
                {lang === 'hi' ? 'क्या यह काम करने के लिए AI (स्मार्ट लर्निंग) का इस्तेमाल करता है?' : 'Does this system use AI to learn and make decisions?'}
              </p>
            </div>

            {!feedback ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => handleSelectAnswer(true)}
                  className="py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-black text-base rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bot className="w-5 h-5" /> 🤖 {lang === 'hi' ? 'AI है' : 'It uses AI'}
                </button>
                <button
                  onClick={() => handleSelectAnswer(false)}
                  className="py-4 px-6 bg-stone-700 hover:bg-stone-800 text-white font-black text-base rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Cpu className="w-5 h-5" /> ⚙️ {lang === 'hi' ? 'साधारण नियम है' : 'Standard Rules'}
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
                    {feedback.isCorrect ? (lang === 'hi' ? 'बिल्कुल सही!' : 'Correct Answer!') : (lang === 'hi' ? 'गलत उत्तर!' : 'Incorrect Answer!')}
                  </span>
                </div>
                <p className="text-xs font-bold text-purple-950 mb-4 leading-relaxed">{feedback.message}</p>
                <button
                  onClick={handleNextStep}
                  className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer inline-flex items-center gap-1.5"
                >
                  {currentIdx + 1 === 5 ? (lang === 'hi' ? 'रिजल्ट रिपोर्ट देखें ➔' : 'View Report Card ➔') : (lang === 'hi' ? 'अगला सवाल ➔' : 'Next Question ➔')}
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
            
            <h2 className="text-2xl font-black text-purple-950 mb-1">
              {lang === 'hi' ? 'राउंड पूरा हुआ!' : 'Round Complete!'}
            </h2>
            <p className="text-xs font-bold text-purple-800 mb-6">
              {lang === 'hi' ? 'AI है या नहीं? - आपका रिपोर्ट कार्ड' : 'AI Detection - Report Card'}
            </p>

            <div className="bg-white border-2 border-purple-200 rounded-2xl p-4 shadow-sm mb-6 flex justify-around items-center">
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">{lang === 'hi' ? 'कुल प्रश्न' : 'Questions'}</span>
                <span className="text-2xl font-black text-slate-800">5</span>
              </div>
              <div className="w-px h-10 bg-purple-100" />
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">{lang === 'hi' ? 'सही उत्तर' : 'Correct'}</span>
                <span className="text-2xl font-black text-emerald-600">{score} / 5</span>
              </div>
              <div className="w-px h-10 bg-purple-100" />
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">{lang === 'hi' ? 'सटीकता' : 'Accuracy'}</span>
                <span className="text-2xl font-black text-purple-900">{Math.round((score / 5) * 100)}%</span>
              </div>
            </div>

            <div className="bg-purple-100/70 p-3.5 rounded-xl text-left text-xs font-bold text-purple-950 mb-6 leading-relaxed">
              💡 {lang === 'hi' 
                ? 'मुख्य निष्कर्ष: हर मशीन में AI नहीं होता! लिफ्ट और वॉशिंग मशीन तय कोड से चलती हैं, जबकि Maps व Face Unlock डेटा से सीखते हैं।'
                : 'Key Takeaway: Not every machine uses AI! Elevators and washers run on static code, whereas Maps and Face Unlock learn patterns from data.'
              }
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRestartRound}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> {lang === 'hi' ? 'पुनः खेलें' : 'Play Again'}
              </button>
              <button
                onClick={() => { stopAllAudio(); setActiveLevel('level2_tray'); playTone('pop'); }}
                className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                {lang === 'hi' ? 'लेवल २ पर आगे बढ़ें ➔' : 'Proceed to Level 2 ➔'}
              </button>
            </div>
          </div>
        )}

        {/* LEVEL 2: Data Tray */}
        {activeLevel === 'level2_tray' && (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <div>
                <h3 className="text-lg font-black text-purple-950">
                  {lang === 'hi' ? 'AI को पालतू vs जंगली जानवर सिखाओ' : 'Teach AI: Domestic vs. Wild Animals'}
                </h3>
                <p className="text-xs text-slate-600">
                  {lang === 'hi' ? 'जानवरों को सही ट्रे में डालें। AI आपके दिए डेटा से सीखेगा!' : 'Sort animals into trays. AI learns purely from the data you provide!'}
                </p>
              </div>
              <button
                onClick={() => { stopAllAudio(); setActiveLevel('level2_trainer'); playTone('pop'); }}
                className="text-xs font-black bg-purple-600 text-white hover:bg-purple-700 px-3.5 py-2 rounded-xl transition cursor-pointer shadow flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" /> {lang === 'hi' ? 'कस्टम विज़न ट्रेनर ➔' : 'Custom Vision Trainer ➔'}
              </button>
            </div>

            <div className="w-full bg-slate-50 border-2 border-dashed border-purple-300 rounded-2xl p-3 mb-4 flex flex-wrap justify-center gap-2">
              {ALL_ANIMALS.map((a) => (
                <div key={a.id} className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="text-xs font-bold text-slate-800">{lang === 'hi' ? a.nameHi.split(' ')[0] : a.nameEn}</span>
                  <div className="flex gap-1 ml-1">
                    <button
                      onClick={() => trainItem(a, true)}
                      className={`text-[10px] font-black px-2.5 py-1 rounded cursor-pointer ${
                        trainedDomestic.includes(a.id) ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {lang === 'hi' ? 'पालतू' : 'Domestic'}
                    </button>
                    <button
                      onClick={() => trainItem(a, false)}
                      className={`text-[10px] font-black px-2.5 py-1 rounded cursor-pointer ${
                        trainedWild.includes(a.id) ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {lang === 'hi' ? 'जंगली' : 'Wild'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 text-center mb-4">
              <span className="text-xs font-bold text-purple-900 block mb-1">
                {lang === 'hi' ? 'अब नए जानवर की परीक्षा लें:' : 'Now test with an unseen animal:'}
              </span>
              <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-purple-300 shadow-sm mb-3">
                <span className="text-3xl">🐐</span>
                <span className="text-sm font-black text-slate-800">{lang === 'hi' ? 'नया जानवर: बकरी (Goat)' : 'Unseen: Goat'}</span>
              </div>
              <div>
                <button
                  onClick={testNewAnimal}
                  className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer inline-flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" /> {lang === 'hi' ? 'AI से पूछें: बकरी क्या है? ➔' : 'Ask AI: What is a Goat? ➔'}
                </button>
              </div>
              {testPrediction && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-purple-300 text-xs font-black text-purple-950 animate-in fade-in">
                  {testPrediction}
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 text-center font-semibold">
              💡 {lang === 'hi' ? 'वैज्ञानिक सबक: गलत या अधूरा डेटा = AI का गलत अनुमान (Garbage In = Garbage Out).' : 'Principle: Incomplete training data leads to model bias (Garbage In = Garbage Out).'}
            </div>
          </div>
        )}

        {/* LEVEL 2: Dynamic Multi-Class Machine Trainer Studio */}
        {activeLevel === 'level2_trainer' && (
          <div className="w-full max-w-3xl flex flex-col items-center">
            
            <div className="flex justify-between items-center w-full mb-3">
              <button
                onClick={() => { stopAllAudio(); setActiveLevel('level2_tray'); playTone('pop'); }}
                className="text-xs font-black text-purple-800 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-xl cursor-pointer"
              >
                ⬅ {lang === 'hi' ? 'डेटा ट्रे पर लौटें' : 'Back to Data Tray'}
              </button>
              <span className="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                Google MobileNet • Grad-CAM X-Ray
              </span>
            </div>

            <input 
              type="file" 
              ref={testFileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleUploadTestImage} 
            />

            <div className="w-full bg-slate-900 rounded-3xl p-4 md:p-6 border-4 border-purple-300 shadow-2xl flex flex-col items-center text-white">
              
              {modelLoading ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  <span className="text-xs font-black text-slate-300">Google MobileNet model loading...</span>
                </div>
              ) : (
                <>
                  <div className="w-full flex justify-between items-center mb-3">
                    <div className="flex gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                      <button
                        onClick={() => setTestMode('camera')}
                        className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                          testMode === 'camera' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" /> {lang === 'hi' ? 'लाइव कैमरा' : 'Live Camera'}
                      </button>
                      <button
                        onClick={() => testFileInputRef.current?.click()}
                        className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                          testMode === 'upload' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" /> {lang === 'hi' ? 'फोटो अपलोड' : 'Upload Image'}
                      </button>
                    </div>

                    {isTrained && (
                      <span className="text-[11px] font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500 flex items-center gap-1">
                        <Scan className="w-3 h-3 animate-pulse" /> {lang === 'hi' ? 'लाइव मॉडल सक्रिय' : 'Model Active'}
                      </span>
                    )}
                  </div>

                  <div className="relative w-full h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 mb-4 flex items-center justify-center">
                    {testMode === 'camera' ? (
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    ) : (
                      <img src={uploadedTestSource || ''} alt="Test" className="w-full h-full object-contain bg-black" />
                    )}
                    
                    <canvas 
                      ref={gradCamCanvasRef} 
                      width={320} 
                      height={240} 
                      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-75 mix-blend-screen"
                    />

                    {testMode === 'camera' && !cameraActive && (
                      <button
                        onClick={startCamera}
                        className="absolute py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer z-20"
                      >
                        <Camera className="w-4 h-4" /> {lang === 'hi' ? 'लाइव कैमरा चालू करें' : 'Start Camera'}
                      </button>
                    )}

                    {showGradCam && isTrained && (
                      <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 z-20 shadow-md">
                        <Eye className="w-3 h-3 animate-pulse" /> Grad-CAM
                      </div>
                    )}
                  </div>

                  {isTrained && (
                    <div className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 mb-4 animate-in fade-in">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-purple-300">{lang === 'hi' ? 'डिटेक्शन परिणाम:' : 'Prediction:'}</span>
                        <span className="text-xs font-black text-emerald-400">
                          {winningClassName}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {classesList.map((c) => {
                          const prob = classConfidences[c.id] || 0;
                          return (
                            <div key={c.id}>
                              <div className="flex justify-between text-[11px] font-bold mb-0.5">
                                <span>{c.name}</span>
                                <span>{prob}%</span>
                              </div>
                              <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150 rounded-full" 
                                  style={{ width: `${prob}%` }} 
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="w-full flex items-center justify-between bg-slate-800 border border-slate-700 p-2.5 rounded-2xl mb-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <div>
                        <span className="text-xs font-black text-white block">{lang === 'hi' ? 'Grad-CAM X-Ray (AI क्या देख रहा है?)' : 'Grad-CAM Attention Heatmap'}</span>
                        <span className="text-[10px] text-slate-400">{lang === 'hi' ? 'निर्णय के लिए किन पिक्सल्स पर मॉडल ने ध्यान दिया' : 'Visualizes image regions influencing the prediction'}</span>
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
                      {showGradCam ? '👁️ Off' : '🔍 Grad-CAM'}
                    </button>
                  </div>

                  <div className="w-full flex flex-col gap-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-purple-300">{lang === 'hi' ? 'ट्रेनिंग डेटा क्लास:' : 'Training Classes:'}</span>
                      <button
                        onClick={handleAddClass}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-black rounded-lg transition cursor-pointer flex items-center gap-1 shadow"
                      >
                        <Plus className="w-3.5 h-3.5" /> {lang === 'hi' ? 'नया वर्ग जोड़ें' : 'Add Class'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                      {classesList.map((c) => (
                        <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-3 flex flex-col justify-between">
                          <input 
                            type="file" 
                            ref={(el) => { classFileInputsRef.current[c.id] = el; }} 
                            multiple 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleBatchFileUploadForClass(e, c.id)} 
                          />

                          <div>
                            <div className="flex justify-between items-center mb-2 gap-1.5">
                              <input
                                type="text"
                                value={c.name}
                                onChange={(e) => handleUpdateClassName(c.id, e.target.value)}
                                className="bg-slate-900 border border-slate-700 text-emerald-400 font-black text-xs px-2 py-1 rounded-lg w-full outline-none focus:border-purple-500"
                              />
                              <span className="text-[10px] font-extrabold bg-slate-950 px-2 py-1 rounded text-slate-400 shrink-0">
                                {c.images.length}
                              </span>
                              {classesList.length > 2 && (
                                <button
                                  onClick={() => handleRemoveClass(c.id)}
                                  className="p-1 text-slate-500 hover:text-rose-400 rounded transition cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="flex gap-1.5 overflow-x-auto py-1 h-14 mb-2 bg-slate-900/80 rounded-lg p-1.5">
                              {c.images.length === 0 ? (
                                <span className="text-[10px] text-slate-500 my-auto mx-auto">{lang === 'hi' ? 'कोई फोटो नहीं' : 'No images'}</span>
                              ) : (
                                c.images.map((img, i) => (
                                  <div key={i} className="relative group shrink-0 w-11 h-11 rounded overflow-hidden border border-slate-700">
                                    <img src={img} alt="sample" className="w-full h-full object-cover" />
                                    <button
                                      onClick={() => handleDeleteImage(c.id, i)}
                                      className="absolute inset-0 bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-black"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleCaptureSampleForClass(c.id)}
                              disabled={!cameraActive}
                              className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" /> {lang === 'hi' ? 'स्नैप लें' : 'Snap'}
                            </button>
                            <button
                              onClick={() => classFileInputsRef.current[c.id]?.click()}
                              className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow"
                            >
                              <Upload className="w-3.5 h-3.5" /> {lang === 'hi' ? 'अपलोड' : 'Upload'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 w-full">
                    <button
                      onClick={handleTrainLiveModel}
                      disabled={isTraining}
                      className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isTraining ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{lang === 'hi' ? 'फीचर्स सीख रहे हैं...' : 'Training features...'}</span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4" />
                          <span>{lang === 'hi' ? 'मॉडल ट्रेन करें' : 'Train Live Model'}</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleResetTrainer}
                      className="p-3 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 rounded-xl cursor-pointer transition"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}

        {/* LEVEL 3: Quick Draw */}
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
            <h3 className="text-lg font-black text-purple-950 mb-1">
              {lang === 'hi' ? 'AI ने कहा — सच या कल्पना? (Fact Check Lab)' : 'AI Fact Check Lab: Hallucinations'}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              {lang === 'hi' ? 'AI बहुत आत्मविश्वास से जवाब देता है, लेकिन क्या हर बात सच होती है?' : 'AI sounds confident, but can make up facts.'}
            </p>
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-left mb-4 shadow-sm w-full">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-black text-amber-950">{lang === 'hi' ? 'दावा / Statement:' : 'Statement:'}</span>
                <button
                  onClick={() => speak(lang === 'hi' ? "दावा: भारत में हाथी केवल पेड़ की पत्तियाँ खाकर उड़ सकते हैं।" : "Claim: Elephants in India can fly by eating tree leaves. This is false AI hallucination.")}
                  className="p-1 text-amber-900 hover:bg-amber-200 rounded cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-3">
                {lang === 'hi' ? '"भारत में हाथी केवल पेड़ की पत्तियाँ खाकर उड़ सकते हैं।"' : '"Elephants in India can fly by eating tree leaves."'}
              </p>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs font-bold text-purple-900">
                🔍 {lang === 'hi' ? 'सबक: AI कई बार गलत जानकारियाँ भी आत्मविश्वास से बनाता है (Hallucination)। हमेशा जाँच करें!' : 'Lesson: Large language models can hallucinate plausible-sounding falsehoods. Always verify!'}
              </div>
            </div>
          </div>
        )}

        {/* LEVEL 5: Unsupervised Clustering */}
        {activeLevel === 'level5_cluster' && (
          <div className="w-full">
            <ClusteringLab />
          </div>
        )}

        {/* LEVEL 6: Tara & Bittu Doctor Clinic */}
        {activeLevel === 'level6_doctor' && (
          <div className="w-full">
            <TaraBittuDoctorLab initialLang={lang} />
          </div>
        )}

      </div>
    </div>
  );
}