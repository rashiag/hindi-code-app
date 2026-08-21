'use client';

import React, { useState, useEffect, useRef } from 'react';
import { unlockAudio } from '../lib/audio';

interface SentenceItem {
  id: number;
  hindiSentence: string;
  hindiPhonetic: string;
  englishWords: string[]; // Correct sequential order
  category: string;
}

// 40 Foundational 2-to-5 word sentences tailored for early learners (Ages 4-8)
const SENTENCES_DATABASE: SentenceItem[] = [
  // 2-Word Sentences
  { id: 1, hindiSentence: 'यहाँ आओ।', hindiPhonetic: 'Yahan aao.', englishWords: ['Come', 'here.'], category: 'दैनिक निर्देश' },
  { id: 2, hindiSentence: 'वहाँ जाओ।', hindiPhonetic: 'Vahan jaao.', englishWords: ['Go', 'there.'], category: 'दैनिक निर्देश' },
  { id: 3, hindiSentence: 'खड़े हो जाओ।', hindiPhonetic: 'Khade ho jaao.', englishWords: ['Stand', 'up.'], category: 'दैनिक निर्देश' },
  { id: 4, hindiSentence: 'बैठ जाओ।', hindiPhonetic: 'Baith jaao.', englishWords: ['Sit', 'down.'], category: 'दैनिक निर्देश' },
  { id: 5, hindiSentence: 'पानी पियो।', hindiPhonetic: 'Paani piyo.', englishWords: ['Drink', 'water.'], category: 'दैनिक निर्देश' },
  { id: 6, hindiSentence: 'किताब पढ़ो।', hindiPhonetic: 'Kitaab padho.', englishWords: ['Read', 'book.'], category: 'स्कूल' },
  { id: 7, hindiSentence: 'मुस्कुराओ।', hindiPhonetic: 'Muskurao.', englishWords: ['Keep', 'smiling.'], category: 'भावनाएं' },
  { id: 8, hindiSentence: 'नमस्ते बोलो।', hindiPhonetic: 'Namaste bolo.', englishWords: ['Say', 'hello.'], category: 'शिष्टाचार' },

  // 3-Word Sentences
  { id: 9, hindiSentence: 'यह एक सेब है।', hindiPhonetic: 'Yeh ek seb hai.', englishWords: ['This', 'is', 'apple.'], category: 'पहचान' },
  { id: 10, hindiSentence: 'वह एक बिल्ली है।', hindiPhonetic: 'Vah ek billi hai.', englishWords: ['That', 'is', 'cat.'], category: 'पहचान' },
  { id: 11, hindiSentence: 'मैं खेल रहा हूँ।', hindiPhonetic: 'Main khel raha hoon.', englishWords: ['I', 'am', 'playing.'], category: 'क्रियाएं' },
  { id: 12, hindiSentence: 'सूरज चमक रहा है।', hindiPhonetic: 'Sooraj chamak raha hai.', englishWords: ['Sun', 'is', 'shining.'], category: 'प्रकृति' },
  { id: 13, hindiSentence: 'पंछी उड़ते हैं।', hindiPhonetic: 'Panchhi udte hain.', englishWords: ['Birds', 'can', 'fly.'], category: 'जानवर' },
  { id: 14, hindiSentence: 'मुझे दूध पसंद है।', hindiPhonetic: 'Mujhe doodh pasand hai.', englishWords: ['I', 'like', 'milk.'], category: 'पसंद' },
  { id: 15, hindiSentence: 'यह मेरी गेंद है।', hindiPhonetic: 'Yeh meri gend hai.', englishWords: ['This', 'is', 'ball.'], category: 'खेल' },
  { id: 16, hindiSentence: 'हाथी बड़ा है।', hindiPhonetic: 'Haathi bada hai.', englishWords: ['Elephant', 'is', 'big.'], category: 'विवरण' },

  // 4-Word Sentences
  { id: 17, hindiSentence: 'मुझे एक सेब खाना है।', hindiPhonetic: 'Mujhe ek seb khaana hai.', englishWords: ['I', 'want', 'an', 'apple.'], category: 'दैनिक संवाद' },
  { id: 18, hindiSentence: 'यह मेरा प्यारा घर है।', hindiPhonetic: 'Yeh mera pyaara ghar hai.', englishWords: ['This', 'is', 'my', 'home.'], category: 'घर' },
  { id: 19, hindiSentence: 'कुत्ता तेज़ी से दौड़ता है।', hindiPhonetic: 'Kutta tezi se daudta hai.', englishWords: ['Dog', 'runs', 'very', 'fast.'], category: 'जानवर' },
  { id: 20, hindiSentence: 'आसमान में बादल हैं।', hindiPhonetic: 'Aasman mein baadal hain.', englishWords: ['Clouds', 'are', 'in', 'sky.'], category: 'प्रकृति' },
  { id: 21, hindiSentence: 'हम सब स्कूल जाते हैं।', hindiPhonetic: 'Hum sab school jaate hain.', englishWords: ['We', 'go', 'to', 'school.'], category: 'स्कूल' },
  { id: 22, hindiSentence: 'गुलाब एक सुंदर फूल है।', hindiPhonetic: 'Gulaab ek sundar phool hai.', englishWords: ['Rose', 'is', 'pretty', 'flower.'], category: 'प्रकृति' },
  { id: 23, hindiSentence: 'मेरे पास लाल कार है।', hindiPhonetic: 'Mere paas laal car hai.', englishWords: ['I', 'have', 'red', 'car.'], category: 'चीजें' },

  // 5-Word Sentences
  { id: 24, hindiSentence: 'बंदर पेड़ पर कूद रहा है।', hindiPhonetic: 'Bandar ped par kood raha hai.', englishWords: ['Monkey', 'is', 'jumping', 'on', 'tree.'], category: 'जानवर' },
  { id: 25, hindiSentence: 'मोर बारिश में नाच रहा है।', hindiPhonetic: 'Mor baarish mein naach raha hai.', englishWords: ['Peacock', 'is', 'dancing', 'in', 'rain.'], category: 'प्रकृति' },
  { id: 26, hindiSentence: 'मैं रोज़ाना अपना पाठ पढ़ता हूँ।', hindiPhonetic: 'Main rozana apna paath padhta hoon.', englishWords: ['I', 'read', 'my', 'book', 'daily.'], category: 'आदतें' },
  { id: 27, hindiSentence: 'मछली साफ पानी में तैरती है।', hindiPhonetic: 'Machhli saaf paani mein tairti hai.', englishWords: ['Fish', 'swims', 'in', 'clean', 'water.'], category: 'जानवर' },
  { id: 28, hindiSentence: 'तारे रात में सुंदर चमकते हैं।', hindiPhonetic: 'Taare raat mein sundar chamakte hain.', englishWords: ['Stars', 'shine', 'bright', 'at', 'night.'], category: 'अंतरिक्ष' },
];

const TOTAL_ROUNDS = 5;

const speakVoice = (text: string, lang: 'hi-IN' | 'en-US') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
  if (matchedVoice) utterance.voice = matchedVoice;

  setTimeout(() => window.speechSynthesis.speak(utterance), 50);
};

export default function HindiSentenceBuilder() {
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [currentSentence, setCurrentSentence] = useState<SentenceItem>(SENTENCES_DATABASE[0]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'game_over'>('playing');

  const poolRef = useRef<SentenceItem[]>([]);

  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const startNewGame = () => {
    setScore(0);
    setGameState('playing');
    poolRef.current = shuffle(SENTENCES_DATABASE);
    loadQuestion(1);
  };

  const loadQuestion = (roundNum: number) => {
    unlockAudio();
    if (poolRef.current.length === 0) poolRef.current = shuffle(SENTENCES_DATABASE);
    const item = poolRef.current.pop()!;

    setCurrentSentence(item);
    setAvailableWords(shuffle(item.englishWords));
    setSelectedWords([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setCurrentRound(roundNum);

    // Speak the target Hindi sentence
    speakVoice(item.hindiSentence, 'hi-IN');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handlePickWord = (word: string, index: number) => {
    if (isAnswerChecked) return;
    unlockAudio();
    setSelectedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
    speakVoice(word, 'en-US');
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (isAnswerChecked) return;
    unlockAudio();
    setSelectedWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableWords((prev) => [...prev, word]);
  };

  const handleCheckSentence = () => {
    unlockAudio();
    setIsAnswerChecked(true);
    const formed = selectedWords.join(' ');
    const target = currentSentence.englishWords.join(' ');

    if (formed === target) {
      setIsCorrect(true);
      setScore((s) => s + 1);
      speakVoice(`Very good! ${target}`, 'en-US');
    } else {
      setIsCorrect(false);
      speakVoice(`Try again! The correct sentence is: ${target}`, 'en-US');
    }
  };

  const handleNextRound = () => {
    if (currentRound >= TOTAL_ROUNDS) {
      setGameState('game_over');
      if (score >= 4) {
        speakVoice('शाबाश! आपने बहुत सुंदर वाक्य बनाए!', 'hi-IN');
      } else {
        speakVoice('अच्छा प्रयास! अभ्यास से आप और तेज़ वाक्य बना सकेंगे!', 'hi-IN');
      }
      return;
    }
    loadQuestion(currentRound + 1);
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-4 p-3 md:p-6 font-sans select-none">
      {/* Header */}
      <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
              <span>🧩</span> वाक्य बनाओ (Sentence Builder)
            </h2>
            <span className="text-[11px] font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
              Hindi to English Syntax
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">हिंदी वाक्य सुनें और सही अंग्रेजी शब्दों को क्रम से जोड़ें</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200">
            ⭐ अंक: {score}/{TOTAL_ROUNDS}
          </span>
          <span className="text-xs font-bold bg-teal-50 text-teal-700 px-2.5 py-1.5 rounded-xl border border-teal-200">
            दौर: {currentRound}/{TOTAL_ROUNDS}
          </span>
        </div>
      </div>

      {gameState === 'playing' ? (
        <div className="w-full bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md flex flex-col items-center">
          
          {/* Target Hindi Sentence Card */}
          <div className="w-full bg-teal-50 border-2 border-teal-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
            <div className="text-center md:text-left">
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
                हिंदी वाक्य ({currentSentence.category}):
              </span>
              <div className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">
                {currentSentence.hindiSentence}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {currentSentence.hindiPhonetic}
              </div>
            </div>

            <button
              onClick={() => speakVoice(currentSentence.hindiSentence, 'hi-IN')}
              className="px-4 py-2 bg-white hover:bg-teal-100 text-teal-800 border border-teal-300 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition whitespace-nowrap"
            >
              <span>🔊</span> वाक्य सुनें
            </button>
          </div>

          {/* Formed Sentence Workspace */}
          <div className="w-full mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-600">आपका अंग्रेजी वाक्य (Your Sentence):</span>
              <span className="text-[11px] text-slate-400 font-medium">शब्द हटाने के लिए उस पर क्लिक करें</span>
            </div>

            <div className="min-h-[64px] w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-2.5 flex flex-wrap items-center gap-2">
              {selectedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveWord(word, idx)}
                  disabled={isAnswerChecked}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-rose-500 text-white font-black text-sm md:text-base rounded-xl shadow-sm active:scale-95 transition flex items-center gap-1 group"
                >
                  <span>{word}</span>
                  <span className="text-xs opacity-60 group-hover:opacity-100">✕</span>
                </button>
              ))}

              {selectedWords.length === 0 && (
                <span className="text-xs text-slate-400 italic px-2">
                  नीचे दिए गए शब्दों पर क्लिक करके यहाँ वाक्य बनाएं...
                </span>
              )}
            </div>
          </div>

          {/* Jumbled Available Words */}
          <div className="w-full mb-6">
            <span className="text-xs font-bold text-slate-600 block mb-2">उपलब्ध शब्द (Tap words in order):</span>
            <div className="flex flex-wrap gap-2.5 min-h-[50px] p-2 bg-slate-100 rounded-2xl border border-slate-200">
              {availableWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickWord(word, idx)}
                  disabled={isAnswerChecked}
                  className="px-4 py-2.5 bg-white hover:bg-teal-50 border-2 border-slate-300 hover:border-teal-400 text-slate-800 font-black text-sm md:text-base rounded-xl shadow-sm active:scale-95 transition"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Action Check & Feedback */}
          {!isAnswerChecked ? (
            <button
              onClick={handleCheckSentence}
              disabled={selectedWords.length === 0}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-98 disabled:opacity-40 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>✓</span> वाक्य जांचें (Check Answer)
            </button>
          ) : (
            <div className="w-full flex flex-col md:flex-row justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 gap-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{isCorrect ? '🎉' : '💡'}</span>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {isCorrect ? 'शाबाश! सही वाक्य!' : 'सही क्रम यह है:'}
                  </div>
                  <div className="text-xs font-black text-teal-800">
                    {currentSentence.englishWords.join(' ')}
                  </div>
                </div>
              </div>
              <button
                onClick={handleNextRound}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs md:text-sm rounded-xl shadow transition"
              >
                {currentRound >= TOTAL_ROUNDS ? 'परिणाम देखें ➔' : 'अगला वाक्य ➔'}
              </button>
            </div>
          )}

        </div>
      ) : (
        /* End of Game Scorecard */
        <div className="w-full bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-xl flex flex-col items-center text-center animate-fade-in">
          <div className="text-6xl mb-2">{score >= 4 ? '🏆' : score >= 2 ? '🌟' : '💡'}</div>
          <h3 className="text-2xl font-black text-slate-800 mb-1">
            {score >= 4 ? 'अद्भुत वाक्य निर्माता! (Sentence Master)' : 'बहुत अच्छा प्रयास!'}
          </h3>
          <div className="text-sm font-bold text-teal-800 bg-teal-100 px-4 py-1.5 rounded-full border border-teal-300 my-3">
            कुल अंक: {score} / {TOTAL_ROUNDS} सही वाक्य
          </div>
          <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
            आपने हिंदी से अंग्रेजी में शब्दों का सही क्रम बनाना सीखा। जितना अधिक अभ्यास करेंगे, अंग्रेजी बोलना उतना ही सहज होगा!
          </p>
          <button
            onClick={startNewGame}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg transition"
          >
            🔄 दोबारा 5 नए वाक्य बनाएं (Play Again)
          </button>
        </div>
      )}
    </div>
  );
}