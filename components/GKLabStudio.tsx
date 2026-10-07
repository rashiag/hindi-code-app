'use client';

import React, { useState, useEffect } from 'react';
import { 
  Volume2, ArrowRight, RotateCcw, XCircle, 
  HelpCircle, CheckCircle2, Trophy, Eye, BookOpen, Star 
} from 'lucide-react';

interface GKQuestion {
  id: number;
  question: string;
  answer: string;
  category: 'India' | 'Science' | 'World' | 'Tech & AI' | 'Nature' | 'Civics' | 'Sports';
  icon: string;
  accent: string;
}

// -------------------------------------------------------------
// QUESTION BANK (Directly from K5_GK_Question_Bank.pdf)
// -------------------------------------------------------------
const GK_DATABASE: Record<string, GKQuestion[]> = {
  kg: [
    { id: 1, question: "What is the name of our country?", answer: "India", category: "India", icon: "🇮🇳", accent: "#f59e0b" },
    { id: 2, question: "What is the capital of India?", answer: "New Delhi", category: "India", icon: "🏛️", accent: "#ea580c" },
    { id: 3, question: "What is the colour of the sky on a clear day?", answer: "Blue", category: "Nature", icon: "☀️", accent: "#0284c7" },
    { id: 4, question: "How many legs does a dog have?", answer: "Four", category: "Nature", icon: "🐕", accent: "#16a34a" },
    { id: 5, question: "Which animal says 'meow'?", answer: "Cat", category: "Nature", icon: "🐱", accent: "#d97706" },
    { id: 6, question: "Which animal gives us milk?", answer: "Cow", category: "Nature", icon: "🐄", accent: "#059669" },
    { id: 7, question: "Which bird can say 'quack'?", answer: "Duck", category: "Nature", icon: "🦆", accent: "#0284c7" },
    { id: 8, question: "How many days are there in a week?", answer: "Seven", category: "Science", icon: "📅", accent: "#7c3aed" },
    { id: 9, question: "How many months are there in a year?", answer: "Twelve", category: "Science", icon: "🗓️", accent: "#9333ea" },
    { id: 10, question: "How many fingers are on one hand?", answer: "Five", category: "Science", icon: "🖐️", accent: "#ea580c" },
    { id: 11, question: "Which shape has three sides?", answer: "Triangle", category: "Science", icon: "📐", accent: "#2563eb" },
    { id: 12, question: "Which shape is round?", answer: "Circle", category: "Science", icon: "⭕", accent: "#ef4444" },
    { id: 13, question: "What do we use to see?", answer: "Eyes", category: "Science", icon: "👀", accent: "#0284c7" },
    { id: 14, question: "What do we use to hear?", answer: "Ears", category: "Science", icon: "👂", accent: "#16a34a" },
    { id: 15, question: "What do we use to smell?", answer: "Nose", category: "Science", icon: "👃", accent: "#d97706" },
    { id: 16, question: "What do we use to walk?", answer: "Feet", category: "Science", icon: "🦶", accent: "#475569" },
    { id: 17, question: "Which fruit is yellow and curved?", answer: "Banana", category: "Nature", icon: "🍌", accent: "#eab308" },
    { id: 18, question: "Which vegetable is orange and grows underground?", answer: "Carrot", category: "Nature", icon: "🥕", accent: "#ea580c" },
    { id: 19, question: "What is the name of our planet?", answer: "Earth", category: "World", icon: "🌍", accent: "#2563eb" },
    { id: 20, question: "Which animal is called the king of the jungle?", answer: "Lion", category: "Nature", icon: "🦁", accent: "#d97706" },
    { id: 21, question: "Which animal has a long trunk?", answer: "Elephant", category: "Nature", icon: "🐘", accent: "#64748b" },
    { id: 22, question: "What is our national bird?", answer: "Peacock", category: "India", icon: "🦚", accent: "#0284c7" },
    { id: 23, question: "What is our national flower?", answer: "Lotus", category: "India", icon: "🪷", accent: "#ec4899" },
    { id: 24, question: "What is our national fruit?", answer: "Mango", category: "India", icon: "🥭", accent: "#f59e0b" },
    { id: 25, question: "What does a red traffic light mean?", answer: "Stop", category: "Civics", icon: "🚦", accent: "#ef4444" }
  ],
  g1: [
    { id: 1, question: "What is the capital of India?", answer: "New Delhi", category: "India", icon: "🏛️", accent: "#f59e0b" },
    { id: 2, question: "What is India's national animal?", answer: "Bengal Tiger", category: "India", icon: "🐅", accent: "#ea580c" },
    { id: 3, question: "How many colours are in the Indian national flag?", answer: "Three", category: "India", icon: "🇮🇳", accent: "#16a34a" },
    { id: 4, question: "Who wrote Jana Gana Mana?", answer: "Rabindranath Tagore", category: "India", icon: "📜", accent: "#7c3aed" },
    { id: 5, question: "How many continents are there?", answer: "Seven", category: "World", icon: "🗺️", accent: "#0284c7" },
    { id: 6, question: "Which is the largest continent?", answer: "Asia", category: "World", icon: "🌏", accent: "#2563eb" },
    { id: 7, question: "Which is the largest ocean?", answer: "Pacific Ocean", category: "World", icon: "🌊", accent: "#0284c7" },
    { id: 8, question: "Which planet is called the Red Planet?", answer: "Mars", category: "Science", icon: "🔴", accent: "#ef4444" },
    { id: 9, question: "Which is the largest planet in our Solar System?", answer: "Jupiter", category: "Science", icon: "🪐", accent: "#ea580c" },
    { id: 10, question: "What organ pumps blood around the body?", answer: "Heart", category: "Science", icon: "🫀", accent: "#dc2626" },
    { id: 11, question: "What is H2O commonly called?", answer: "Water", category: "Science", icon: "💧", accent: "#0284c7" },
    { id: 12, question: "Which animal is the fastest on land?", answer: "Cheetah", category: "Nature", icon: "🐆", accent: "#d97706" },
    { id: 13, question: "Which is the largest animal in the world?", answer: "Blue whale", category: "Nature", icon: "🐋", accent: "#0284c7" },
    { id: 14, question: "Which animal is called the ship of the desert?", answer: "Camel", category: "Nature", icon: "🐪", accent: "#b45309" },
    { id: 15, question: "What are the three Rs of conservation?", answer: "Reduce, Reuse, Recycle", category: "Science", icon: "♻️", accent: "#16a34a" },
    { id: 16, question: "Who is known as the Father of the Nation in India?", answer: "Mahatma Gandhi", category: "India", icon: "👓", accent: "#64748b" },
    { id: 17, question: "When is India's Independence Day?", answer: "15 August", category: "India", icon: "🇮🇳", accent: "#ea580c" },
    { id: 18, question: "When is India's Republic Day?", answer: "26 January", category: "India", icon: "🇮🇳", accent: "#2563eb" },
    { id: 19, question: "Who was the first Prime Minister of India?", answer: "Jawaharlal Nehru", category: "India", icon: "🌹", accent: "#dc2626" },
    { id: 20, question: "What do we call a person who travels into space?", answer: "Astronaut", category: "Tech & AI", icon: "🧑‍🚀", accent: "#7c3aed" }
  ],
  g2: [
    { id: 1, question: "How many states and Union Territories does India have?", answer: "28 states and 8 Union Territories", category: "India", icon: "🗺️", accent: "#f59e0b" },
    { id: 2, question: "Which is the largest Indian state by area?", answer: "Rajasthan", category: "India", icon: "🏰", accent: "#ea580c" },
    { id: 3, question: "Which river is often called the lifeline of India?", answer: "Ganga", category: "India", icon: "🌊", accent: "#0284c7" },
    { id: 4, question: "Who is known as the Missile Man of India?", answer: "Dr. A. P. J. Abdul Kalam", category: "India", icon: "🚀", accent: "#7c3aed" },
    { id: 5, question: "Which is the highest mountain in the world?", answer: "Mount Everest", category: "World", icon: "🏔️", accent: "#059669" },
    { id: 6, question: "Which is the longest river in the world traditionally listed in GK?", answer: "Nile", category: "World", icon: "🏜️", accent: "#0284c7" },
    { id: 7, question: "What force pulls objects toward Earth?", answer: "Gravity", category: "Science", icon: "🍎", accent: "#dc2626" },
    { id: 8, question: "What is the boiling point of water at sea level?", answer: "100°C", category: "Science", icon: "♨️", accent: "#ea580c" },
    { id: 9, question: "What is the hardest natural substance?", answer: "Diamond", category: "Science", icon: "💎", accent: "#0284c7" },
    { id: 10, question: "How many bones does an adult human have approximately?", answer: "206", category: "Science", icon: "🦴", accent: "#64748b" },
    { id: 11, question: "What does CPU stand for?", answer: "Central Processing Unit", category: "Tech & AI", icon: "💻", accent: "#2563eb" },
    { id: 12, question: "What is coding?", answer: "Writing instructions for a computer", category: "Tech & AI", icon: "⌨️", accent: "#7c3aed" },
    { id: 13, question: "What is a robot?", answer: "A machine that can perform programmed or controlled tasks", category: "Tech & AI", icon: "🤖", accent: "#9333ea" },
    { id: 14, question: "How many rings are on the Olympic symbol?", answer: "Five", category: "Sports", icon: "🏅", accent: "#059669" }
  ],
  g3: [
    { id: 1, question: "What are the three branches of the Government of India?", answer: "Legislature, Executive and Judiciary", category: "Civics", icon: "⚖️", accent: "#475569" },
    { id: 2, question: "What is the supreme law of India?", answer: "The Constitution", category: "Civics", icon: "📜", accent: "#b45309" },
    { id: 3, question: "Which city is known as the Pink City?", answer: "Jaipur", category: "India", icon: "🌸", accent: "#ec4899" },
    { id: 4, question: "Which Indian state has the largest coastline?", answer: "Gujarat", category: "India", icon: "⛵", accent: "#0284c7" },
    { id: 5, question: "What causes day and night on Earth?", answer: "Earth's rotation", category: "Science", icon: "🌏", accent: "#2563eb" },
    { id: 6, question: "What is the continuous movement of water through evaporation, condensation, and precipitation called?", answer: "The Water Cycle", category: "Science", icon: "🌧️", accent: "#0284c7" },
    { id: 7, question: "What does WWW stand for?", answer: "World Wide Web", category: "Tech & AI", icon: "🌐", accent: "#2563eb" },
    { id: 8, question: "What is an algorithm?", answer: "A step-by-step method for solving a problem", category: "Tech & AI", icon: "🧩", accent: "#7c3aed" },
    { id: 9, question: "Who was the first person on the Moon?", answer: "Neil Armstrong", category: "World", icon: "🌕", accent: "#f59e0b" },
    { id: 10, question: "Who was the first Indian citizen in space?", answer: "Rakesh Sharma", category: "India", icon: "🚀", accent: "#ea580c" },
    { id: 11, question: "What is the largest rainforest in the world?", answer: "Amazon Rainforest", category: "Nature", icon: "🌴", accent: "#16a34a" }
  ],
  g4: [
    { id: 1, question: "When did the Constitution of India come into effect?", answer: "26 January 1950", category: "Civics", icon: "🇮🇳", accent: "#ea580c" },
    { id: 2, question: "Who chaired the Drafting Committee of the Constituent Assembly?", answer: "Dr. B. R. Ambedkar", category: "Civics", icon: "📖", accent: "#2563eb" },
    { id: 3, question: "What is the deepest ocean trench on Earth?", answer: "Mariana Trench", category: "World", icon: "🌊", accent: "#0284c7" },
    { id: 4, question: "What is the greenhouse effect?", answer: "Warming caused when certain gases trap heat in Earth's atmosphere", category: "Science", icon: "🌡️", accent: "#dc2626" },
    { id: 5, question: "What is the basic structural and functional unit of life?", answer: "A cell", category: "Science", icon: "🔬", accent: "#16a34a" },
    { id: 6, question: "What is machine learning?", answer: "A method where computers learn patterns from data", category: "Tech & AI", icon: "🤖", accent: "#7c3aed" },
    { id: 7, question: "What is generative AI?", answer: "AI that can create new content such as text, images or audio", category: "Tech & AI", icon: "✨", accent: "#9333ea" },
    { id: 8, question: "What is phishing in cybersecurity?", answer: "A deceptive attempt to steal information by pretending to be trustworthy", category: "Tech & AI", icon: "🎣", accent: "#ef4444" },
    { id: 9, question: "Who was the first woman to win a Nobel Prize?", answer: "Marie Curie", category: "Science", icon: "🧪", accent: "#059669" },
    { id: 10, question: "What is a light-year?", answer: "A unit of distance: the distance light travels in one year", category: "Science", icon: "✨", accent: "#f59e0b" },
    { id: 11, question: "Which planet is famous for the Great Red Spot?", answer: "Jupiter", category: "Science", icon: "🪐", accent: "#ea580c" }
  ],
  g5: [
    { id: 1, question: "What is the Preamble to the Indian Constitution?", answer: "The introductory statement describing the Constitution's ideals and purposes", category: "Civics", icon: "📜", accent: "#b45309" },
    { id: 2, question: "What causes seasons on Earth?", answer: "Earth's axial tilt combined with its revolution around the Sun", category: "Science", icon: "🍂", accent: "#ea580c" },
    { id: 3, question: "What is sustainable development?", answer: "Meeting present needs without undermining future generations' ability to meet theirs", category: "Nature", icon: "🌱", accent: "#16a34a" },
    { id: 4, question: "What is supervised learning in AI?", answer: "Machine learning using labelled examples", category: "Tech & AI", icon: "🏷️", accent: "#7c3aed" },
    { id: 5, question: "What is computer vision in AI?", answer: "AI methods that enable computers to interpret images or video", category: "Tech & AI", icon: "👁️", accent: "#2563eb" },
    { id: 6, question: "What is a large language model (LLM)?", answer: "An AI model trained on large amounts of text to process and generate language", category: "Tech & AI", icon: "🧠", accent: "#9333ea" },
    { id: 7, question: "What is a deepfake?", answer: "Synthetic or manipulated media made to appear authentic", category: "Tech & AI", icon: "🎭", accent: "#ef4444" },
    { id: 8, question: "Why should we verify information generated by AI?", answer: "AI can produce inaccurate, incomplete or misleading information (hallucinations)", category: "Tech & AI", icon: "🛡️", accent: "#059669" },
    { id: 9, question: "What is the galaxy containing our Solar System called?", answer: "The Milky Way", category: "Science", icon: "🌌", accent: "#6366f1" },
    { id: 10, question: "What is an exoplanet?", answer: "A planet orbiting a star outside our Solar System", category: "Science", icon: "🪐", accent: "#0284c7" }
  ]
};

export function GKLabStudio() {
  const [selectedGrade, setSelectedGrade] = useState<string>('kg');
  const [quizStarted, setQuizStarted] = useState<boolean>(true);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      stopAudio();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-IN';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const activeQuestions = GK_DATABASE[selectedGrade] || GK_DATABASE.kg;
  const currentQ = activeQuestions[currentIdx];

  const handleGradeChange = (gradeKey: string) => {
    stopAudio();
    setSelectedGrade(gradeKey);
    setCurrentIdx(0);
    setShowAnswer(false);
    setScoreCount(0);
    setIsFinished(false);
    setQuizStarted(true);
  };

  const handleReveal = () => {
    setShowAnswer(true);
    speakText(`Answer: ${currentQ.answer}`);
  };

  const handleNext = (gotCorrect: boolean) => {
    stopAudio();
    if (gotCorrect) {
      setScoreCount(prev => prev + 1);
    }
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
      speakText("Congratulations! You have completed the General Knowledge challenge!");
    }
  };

  const handleQuit = () => {
    stopAudio();
    setQuizStarted(false);
    setIsFinished(true);
  };

  const handleRestart = () => {
    stopAudio();
    setCurrentIdx(0);
    setShowAnswer(false);
    setScoreCount(0);
    setIsFinished(false);
    setQuizStarted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 font-sans select-none">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-5 rounded-3xl shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-inner">
            🌍
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black leading-tight">
              Young Researcher GK Lab
            </h1>
            <p className="text-xs md:text-sm font-semibold opacity-90">
              India, World, Science, Environment, Tech &amp; AI (Kindergarten to Grade 5)
            </p>
          </div>
        </div>

        {/* Grade Dropdown Selector */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20">
          <label htmlFor="grade-select" className="text-xs font-black uppercase tracking-wider text-amber-100">
            Select Grade:
          </label>
          <select
            id="grade-select"
            value={selectedGrade}
            onChange={(e) => handleGradeChange(e.target.value)}
            className="bg-white text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow cursor-pointer outline-none border-none"
          >
            <option value="kg">Kindergarten (KG)</option>
            <option value="g1">Grade 1</option>
            <option value="g2">Grade 2</option>
            <option value="g3">Grade 3</option>
            <option value="g4">Grade 4</option>
            <option value="g5">Grade 5</option>
          </select>
        </div>
      </div>

      {/* Main Quiz Flow */}
      {!isFinished && quizStarted ? (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-6 md:p-8 flex flex-col justify-between min-h-[460px]">
          
          {/* Top Status & Controls Bar */}
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 flex-wrap">
            <div className="flex items-center gap-2">
              <span 
                style={{ backgroundColor: currentQ.accent }}
                className="text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-xs"
              >
                <span>{currentQ.icon}</span> {currentQ.category}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Question {currentIdx + 1} of {activeQuestions.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(`${currentQ.question}`)}
                className="p-2 bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-700 rounded-xl font-bold text-xs cursor-pointer transition flex items-center gap-1"
                title="Read question aloud"
              >
                <Volume2 className="w-4 h-4" /> Listen
              </button>
              
              <button
                onClick={handleQuit}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-black text-xs cursor-pointer transition flex items-center gap-1 border border-rose-200"
              >
                <XCircle className="w-4 h-4" /> Quit Lab
              </button>
            </div>
          </div>

          {/* Central Question & Graphic Showcase */}
          <div className="my-6 flex flex-col items-center text-center">
            
            {/* Thematic Graphic Avatar */}
            <div 
              style={{ backgroundColor: `${currentQ.accent}15`, borderColor: `${currentQ.accent}40` }}
              className="w-24 h-24 rounded-3xl border-2 flex items-center justify-center text-5xl mb-4 shadow-inner animate-in zoom-in-95"
            >
              {currentQ.icon}
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-900 max-w-xl leading-snug">
              {currentQ.question}
            </h2>

            {/* Answer Display Area */}
            {showAnswer ? (
              <div className="mt-6 w-full max-w-lg bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-sm animate-in fade-in zoom-in-95">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block mb-1">
                  Correct Answer:
                </span>
                <h3 className="text-xl md:text-2xl font-black text-emerald-950">
                  {currentQ.answer}
                </h3>
              </div>
            ) : (
              <div className="mt-6">
                <button
                  onClick={handleReveal}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 mx-auto"
                >
                  <Eye className="w-4 h-4" /> Reveal Answer
                </button>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Score: <strong>{scoreCount}</strong></span>
            </div>

            {showAnswer ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNext(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition cursor-pointer"
                >
                  I Didn&apos;t Know ➔
                </button>
                <button
                  onClick={() => handleNext(true)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> I Knew This! Next ➔
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNext(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                Skip Question <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Summary & Restart Screen (On Quit or Completion) */
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 text-center flex flex-col items-center justify-center min-h-[460px] animate-in zoom-in-95">
          <div className="w-20 h-20 bg-amber-500 text-white rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-lg">
            <Trophy className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-1">
            {quizStarted ? "Challenge Completed!" : "Quiz Session Ended"}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-4">
            Grade: {selectedGrade.toUpperCase()} General Knowledge
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-xs w-full mb-6">
            <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider block">
              Questions Explored
            </span>
            <span className="text-3xl font-black text-amber-950 block my-1">
              {currentIdx + (isFinished && showAnswer ? 1 : 0)} / {activeQuestions.length}
            </span>
            <span className="text-xs font-bold text-amber-700">
              Confident Answers: {scoreCount}
            </span>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={handleRestart}
              className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>

            <button
              onClick={() => handleGradeChange(selectedGrade === 'kg' ? 'g1' : selectedGrade === 'g1' ? 'g2' : 'g3')}
              className="py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer inline-flex items-center gap-2"
            >
              Try Next Grade <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}