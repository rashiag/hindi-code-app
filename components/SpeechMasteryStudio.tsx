"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Volume2, Play, Sparkles, Award, ArrowRight, ArrowLeft, Star, Mic, CheckCircle2, RotateCcw } from "lucide-react";

interface PhonicsItem {
  id: string;
  letter: string;
  sound: string;
  word: string;
  hindiHint: string;
  audio: string;
  group: number;
  icon: string;
  acceptedEchoes: string[];
}

const PHONICS_DATA: PhonicsItem[] = [
  // Group 1
  { 
    id: "s", letter: "S s", sound: "/s/", word: "Sun", hindiHint: "स • सूरज", audio: "/audio/speak/p_s.mp3", group: 1, icon: "☀️",
    acceptedEchoes: ["s", "es", "is", "ss", "yes", "us", "ass", "see", "sea", "sir", "स", "स।"] 
  },
  { 
    id: "a", letter: "A a", sound: "/æ/", word: "Apple", hindiHint: "ऐ • सेब", audio: "/audio/speak/p_a.mp3", group: 1, icon: "🍎",
    acceptedEchoes: ["a", "ae", "eh", "ah", "at", "an", "app", "ऐ", "ए"] 
  },
  { 
    id: "t", letter: "T t", sound: "/t/", word: "Tap", hindiHint: "ट • नल", audio: "/audio/speak/p_t.mp3", group: 1, icon: "🚰",
    acceptedEchoes: ["t", "te", "tee", "tea", "it", "to", "at", "ta", "ट"] 
  },
  { 
    id: "p", letter: "P p", sound: "/p/", word: "Pan", hindiHint: "प • पैन", audio: "/audio/speak/p_p.mp3", group: 1, icon: "🍳",
    acceptedEchoes: ["p", "pe", "pee", "pea", "up", "pa", "प"] 
  },
  { 
    id: "i", letter: "I i", sound: "/ɪ/", word: "Ink", hindiHint: "इ • स्याही", audio: "/audio/speak/p_i.mp3", group: 1, icon: "🖋️",
    acceptedEchoes: ["i", "e", "ih", "it", "in", "ee", "eye", "इ"] 
  },
  { 
    id: "n", letter: "N n", sound: "/n/", word: "Net", hindiHint: "न • जाल", audio: "/audio/speak/p_n.mp3", group: 1, icon: "🥅",
    acceptedEchoes: ["n", "en", "an", "in", "un", "no", "na", "न"] 
  },

  // Group 2
  { 
    id: "c", letter: "C c", sound: "/k/", word: "Cat", hindiHint: "क • बिल्ली", audio: "/audio/speak/p_c.mp3", group: 2, icon: "🐱",
    acceptedEchoes: ["c", "k", "ka", "kay", "ke", "see", "क"] 
  },
  { 
    id: "k", letter: "K k", sound: "/k/", word: "Kite", hindiHint: "क • पतंग", audio: "/audio/speak/p_k.mp3", group: 2, icon: "🪁",
    acceptedEchoes: ["k", "c", "kay", "ka", "ke", "क"] 
  },
  { 
    id: "e", letter: "E e", sound: "/e/", word: "Egg", hindiHint: "ए • अंडा", audio: "/audio/speak/p_e.mp3", group: 2, icon: "🥚",
    acceptedEchoes: ["e", "eh", "ay", "egg", "ee", "ए"] 
  },
  { 
    id: "h", letter: "H h", sound: "/h/", word: "Hat", hindiHint: "ह • टोपी", audio: "/audio/speak/p_h.mp3", group: 2, icon: "🎩",
    acceptedEchoes: ["h", "ha", "huh", "he", "each", "ह"] 
  },
  { 
    id: "r", letter: "R r", sound: "/r/", word: "Rat", hindiHint: "र • चूहा", audio: "/audio/speak/p_r.mp3", group: 2, icon: "🐀",
    acceptedEchoes: ["r", "ar", "er", "ur", "are", "our", "र"] 
  },
  { 
    id: "m", letter: "M m", sound: "/m/", word: "Mug", hindiHint: "म • मग", audio: "/audio/speak/p_m.mp3", group: 2, icon: "☕",
    acceptedEchoes: ["m", "em", "um", "am", "hum", "ma", "म"] 
  },
  { 
    id: "d", letter: "D d", sound: "/d/", word: "Drum", hindiHint: "ड • ढोल", audio: "/audio/speak/p_d.mp3", group: 2, icon: "🥁",
    acceptedEchoes: ["d", "de", "dee", "duh", "the", "ड"] 
  },

  // Group 3
  { 
    id: "g", letter: "G g", sound: "/ɡ/", word: "Grapes", hindiHint: "ग • अंगूर", audio: "/audio/speak/p_g.mp3", group: 3, icon: "🍇",
    acceptedEchoes: ["g", "ge", "gee", "guh", "ga", "ग"] 
  },
  { 
    id: "o", letter: "O o", sound: "/ɒ/", word: "Orange", hindiHint: "ऑ • संतरा", audio: "/audio/speak/p_o.mp3", group: 3, icon: "🍊",
    acceptedEchoes: ["o", "oh", "aw", "or", "awe", "ऑ"] 
  },
  { 
    id: "u", letter: "U u", sound: "/ʌ/", word: "Umbrella", hindiHint: "अ • छाता", audio: "/audio/speak/p_u.mp3", group: 3, icon: "☂️",
    acceptedEchoes: ["u", "uh", "ah", "up", "you", "अ"] 
  },
  { 
    id: "l", letter: "L l", sound: "/l/", word: "Lollipop", hindiHint: "ल • लॉलीपॉप", audio: "/audio/speak/p_l.mp3", group: 3, icon: "🍭",
    acceptedEchoes: ["l", "el", "al", "ul", "la", "ल"] 
  },
  { 
    id: "f", letter: "F f", sound: "/f/", word: "Fan", hindiHint: "फ़ • पंखा", audio: "/audio/speak/p_f.mp3", group: 3, icon: "🪭",
    acceptedEchoes: ["f", "ef", "if", "ph", "fa", "फ़"] 
  },
  { 
    id: "b", letter: "B b", sound: "/b/", word: "Ball", hindiHint: "ब • गेंद", audio: "/audio/speak/p_b.mp3", group: 3, icon: "⚽",
    acceptedEchoes: ["b", "be", "bee", "buh", "ba", "ब"] 
  },

  // Group 4
  { 
    id: "j", letter: "J j", sound: "/dʒ/", word: "Jug", hindiHint: "ज • जग", audio: "/audio/speak/p_j.mp3", group: 4, icon: "🏺",
    acceptedEchoes: ["j", "jay", "je", "ja", "ज"] 
  },
  { 
    id: "v", letter: "V v", sound: "/v/", word: "Van", hindiHint: "व • गाड़ी", audio: "/audio/speak/p_v.mp3", group: 4, icon: "🚐",
    acceptedEchoes: ["v", "ve", "vee", "we", "va", "व"] 
  },
  { 
    id: "w", letter: "W w", sound: "/w/", word: "Watch", hindiHint: "व • घड़ी", audio: "/audio/speak/p_w.mp3", group: 4, icon: "⌚",
    acceptedEchoes: ["w", "wa", "double u", "waa", "व"] 
  },
  { 
    id: "x", letter: "X x", sound: "/ks/", word: "Box", hindiHint: "क्स • डिब्बा", audio: "/audio/speak/p_x.mp3", group: 4, icon: "📦",
    acceptedEchoes: ["x", "ex", "ks", "ax", "क्स"] 
  },
  { 
    id: "y", letter: "Y y", sound: "/j/", word: "Yak", hindiHint: "य • याक", audio: "/audio/speak/p_y.mp3", group: 4, icon: "🐂",
    acceptedEchoes: ["y", "ye", "ya", "why", "य"] 
  },
  { 
    id: "z", letter: "Z z", sound: "/z/", word: "Zebra", hindiHint: "ज़ • ज़ेबरा", audio: "/audio/speak/p_z.mp3", group: 4, icon: "🦓",
    acceptedEchoes: ["z", "zed", "zee", "za", "ज़"] 
  },
  { 
    id: "qu", letter: "Qu qu", sound: "/kw/", word: "Queen", hindiHint: "क्व • रानी", audio: "/audio/speak/p_qu.mp3", group: 4, icon: "👑",
    acceptedEchoes: ["qu", "q", "kwa", "cue", "क्व"] 
  },
];

type VowelKey = "A" | "E" | "I" | "O";

interface VowelLabInfo {
  label: string;
  sound: string;
  hindiHint: string;
  defaultWord: string;
  families: Record<string, string[]>;
}

const CVC_VOWEL_LABS: Record<VowelKey, VowelLabInfo> = {
  A: {
    label: "Short A",
    sound: "/æ/",
    hindiHint: "ऐ • सेब",
    defaultWord: "cat",
    families: {
      "-at": ["bat", "cat", "fat", "hat", "mat", "pat", "rat", "sat", "vat"],
      "-an": ["ban", "can", "fan", "man", "pan", "ran", "tan", "van"],
      "-ap": ["cap", "gap", "lap", "map", "nap", "rap", "sap", "tap", "yap", "zap"],
      "-ag": ["bag", "gag", "lag", "nag", "rag", "sag", "tag", "wag"],
      "-am": ["bam", "dam", "ham", "jam", "ram", "yam"],
      "-ad": ["bad", "dad", "had", "lad", "mad", "pad", "sad", "tad"],
      "-ab": ["cab", "dab", "jab", "lab", "tab"],
      "specials": ["tax", "wax", "gas"],
    }
  },
  E: {
    label: "Short E",
    sound: "/e/",
    hindiHint: "ए • अंडा",
    defaultWord: "bed",
    families: {
      "-et": ["bet", "get", "jet", "let", "met", "net", "pet", "set", "vet", "wet", "yet"],
      "-en": ["ben", "den", "hen", "men", "pen", "ten", "yen", "zen"],
      "-ed": ["bed", "fed", "led", "red", "ted", "wed", "zed"],
      "-eg": ["beg", "keg", "leg", "peg", "meg"],
      "-em / -eb / specials": ["hem", "rem", "deb", "web", "yes", "pep", "rep", "rex", "dex", "tex"],
    }
  },
  I: {
    label: "Short I",
    sound: "/ɪ/",
    hindiHint: "इ • स्याही",
    defaultWord: "bin",
    families: {
      "-ib": ["bib", "fib", "rib", "nib"],
      "-id": ["bid", "did", "hid", "kid", "lid", "rid", "mid"],
      "-ig": ["big", "dig", "fig", "gig", "jig", "pig", "rig", "wig"],
      "-im": ["dim", "him", "rim", "vim"],
      "-in": ["bin", "din", "fin", "kin", "pin", "sin", "tin", "win"],
      "-ip": ["dip", "hip", "lip", "nip", "rip", "sip", "tip", "zip"],
      "-it": ["bit", "fit", "hit", "kit", "lit", "pit", "sit", "wit"],
      "-ix / -iz": ["fix", "mix", "six", "biz", "fizz"],
      "-ill / -iss": ["bill", "fill", "hill", "mill", "pill", "will", "hiss", "miss"],
    }
  },
  O: {
    label: "Short O",
    sound: "/ɒ/",
    hindiHint: "ऑ • संतरा",
    defaultWord: "dog",
    families: {
      "-ob": ["bob", "cob", "gob", "job", "mob", "rob", "sob"],
      "-od": ["cod", "god", "nod", "pod", "rod", "sod"],
      "-og": ["bog", "cog", "dog", "fog", "hog", "jog", "log"],
      "-om": ["mom", "pom"],
      "-op": ["bop", "cop", "hop", "mop", "pop", "top"],
      "-ot": ["cot", "dot", "got", "hot", "jot", "lot", "not", "pot", "rot", "tot"],
      "-ox": ["box", "fox", "pox"],
      "-ock": ["dock", "lock", "mock", "rock", "sock"],
      "-oss / -off": ["boss", "loss", "moss", "toss", "doff"],
    }
  }
};

// Common mishearings / homophones returned by Web Speech for CVC words
const CVC_ALIASES: Record<string, string[]> = {
  // Short A
  cat: ["cut", "kat", "cap"],
  bat: ["bad", "bet", "but"],
  hat: ["hot", "hut", "had"],
  mat: ["met", "mud", "mad"],

  // Short E
  bed: ["bad", "bid", "bet"],
  red: ["read", "rad", "rid"],
  pen: ["pan", "pin", "pun"],

  // Short I
  bin: ["been", "bean", "ben", "in", "pin", "din"],
  bib: ["bip", "big", "b"],
  bid: ["did", "bed", "bad", "bit"],
  did: ["dead", "deed", "bid", "dude"],
  hid: ["head", "hit", "heed", "it"],
  kid: ["kit", "kids", "ked"],
  lid: ["lead", "lit", "led"],
  rid: ["red", "read", "rit"],
  mid: ["made", "mud", "mit"],
  big: ["pig", "bag", "beg"],
  dig: ["dick", "deck", "duck"],
  fig: ["fake", "fix", "pig"],
  gig: ["gag", "keg", "get"],
  jig: ["jack", "jug", "zig"],
  pig: ["pick", "peg", "pug", "big"],
  rig: ["wreck", "rag", "rug"],
  wig: ["wick", "wag", "wake"],
  dim: ["them", "dam", "den"],
  him: ["hem", "ham", "hum"],
  rim: ["ram", "room", "ring"],
  fin: ["thin", "fan", "fen", "pin"],
  pin: ["pen", "pan", "pun", "bin"],
  sin: ["seen", "scene", "sun", "tin"],
  tin: ["ten", "tan", "thin", "din"],
  win: ["when", "one", "won", "wind"],
  dip: ["deep", "tip", "pip"],
  hip: ["heap", "hit", "hop"],
  lip: ["leap", "lap", "lit"],
  nip: ["nap", "net", "knee"],
  rip: ["reap", "rap", "rib"],
  sip: ["ship", "soup", "sap", "zip"],
  tip: ["tea", "tape", "top", "dip"],
  zip: ["sip", "zap", "zeep"],
  bit: ["beet", "beat", "bat", "bet", "fit"],
  fit: ["feet", "feat", "fat", "foot", "hit"],
  hit: ["heat", "hat", "hot", "hut", "it"],
  kit: ["kid", "cat", "cut", "kite"],
  lit: ["late", "let", "lot", "light"],
  pit: ["peat", "pet", "pat", "pot"],
  sit: ["seat", "set", "sat"],
  wit: ["wheat", "wet", "wait", "white"],
  fix: ["figs", "fox", "fax"],
  mix: ["max", "mex", "makes"],
  six: ["sex", "sax", "sicks"],
  biz: ["bees", "busy", "base"],
  fizz: ["fees", "phase", "face"],
  bill: ["build", "bell", "ball"],
  fill: ["feel", "fell", "full"],
  hill: ["heel", "heal", "hell"],
  mill: ["meal", "male", "melt"],
  pill: ["peel", "pool", "pale"],
  will: ["well", "wheel", "wool"],
  hiss: ["his", "he's", "has"],
  miss: ["ms", "mrs", "mess", "mass"],

  // Short O
  bob: ["bop", "bab", "bomb"],
  cob: ["cop", "cab", "cub"],
  gob: ["god", "gab", "job"],
  job: ["jab", "jaw", "jock"],
  mob: ["mop", "map", "mom"],
  rob: ["rub", "wrap", "rap"],
  sob: ["sub", "sap", "saw"],
  cod: ["card", "god", "cot"],
  god: ["guard", "gut", "got"],
  nod: ["not", "nut", "gnat"],
  pod: ["pot", "part", "pad"],
  rod: ["road", "rot", "rad"],
  sod: ["sawed", "sad", "sot"],
  bog: ["bag", "bug", "bark"],
  cog: ["cock", "cag", "keg"],
  dog: ["dock", "dark", "dug"],
  fog: ["frog", "folk", "fag"],
  hog: ["hug", "hawk", "hot"],
  jog: ["jug", "jag", "chalk"],
  log: ["lock", "lag", "lug"],
  mom: ["mum", "ma'am", "mam"],
  pom: ["palm", "pawn", "pan"],
  bop: ["pop", "bob", "bath"],
  cop: ["cup", "cap", "carp"],
  hop: ["hope", "heap", "hub"],
  mop: ["map", "mob", "mock"],
  pop: ["pap", "pup", "pipe"],
  top: ["tap", "tub", "tip"],
  cot: ["caught", "cut", "cat"],
  dot: ["dart", "dat", "dock"],
  got: ["gut", "gat", "god"],
  hot: ["hut", "hat", "heart"],
  jot: ["jet", "jut", "jolt"],
  lot: ["load", "lat", "light"],
  not: ["knot", "nut", "net"],
  pot: ["part", "pet", "pat"],
  rot: ["rat", "rut", "wrote"],
  tot: ["tart", "tat", "taught"],
  box: ["backs", "bucks", "barks"],
  fox: ["foxes", "fucks", "folks"],
  pox: ["packs", "pax", "parks"],
  dock: ["doc", "duck", "dark"],
  lock: ["lakh", "luck", "look"],
  mock: ["mark", "muck", "mak"],
  rock: ["rawk", "rack", "rug"],
  sock: ["suck", "sack", "shock"],
  boss: ["bus", "bass", "pause"],
  loss: ["lost", "laws", "less"],
  moss: ["mass", "muss", "mouse"],
  toss: ["task", "toes", "tax"],
  doff: ["dove", "duff", "deaf"]
};

// Simple Levenshtein distance check (tolerant to 1 char difference)
function isFuzzyMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let edits = 0;
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) {
      edits++;
      if (edits > 1) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else { i++; j++; }
    } else {
      i++; j++;
    }
  }
  return true;
}

// Browser Web-Audio FX
function playTriumphSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, now + 0.12); // G5
    gain2.gain.setValueAtTime(0.3, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    console.warn("AudioContext FX unavailable", e);
  }
}

function playRetrySound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.3);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    console.warn("AudioContext FX unavailable", e);
  }
}

export default function SpeechMasteryStudio() {
  const [currentStage, setCurrentStage] = useState<1 | 2>(1);

  // Stage 1 State
  const [selectedGroup, setSelectedGroup] = useState<number>(1);
  const [activePhonic, setActivePhonic] = useState<PhonicsItem>(PHONICS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Stage 2 State (Multi-Vowel)
  const [selectedVowel, setSelectedVowel] = useState<VowelKey>("A");
  const [selectedWord, setSelectedWord] = useState<string>("cat");
  const [activeLetterIdx, setActiveLetterIdx] = useState<number | null>(null);
  const [isBlending, setIsBlending] = useState<boolean>(false);

  // Speech Recognition & Sound Status
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechStatus, setSpeechStatus] = useState<"idle" | "listening" | "success" | "retry">("idle");
  const [heardText, setHeardText] = useState<string>("");

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasVocalizedRef = useRef<boolean>(false);
  const hasMatchedRef = useRef<boolean>(false);

  // Setup Web Speech Recognition with interim results
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechStatus("listening");
          hasVocalizedRef.current = false;
          hasMatchedRef.current = false;
        };

        recognition.onresult = (event: any) => {
          if (hasMatchedRef.current) return;

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const raw = event.results[i][0].transcript.trim().toLowerCase();
            setHeardText(raw);

            const matched = evaluateInput(raw);
            if (matched) {
              hasMatchedRef.current = true;
              setSpeechStatus("success");
              playTriumphSound();
              try { recognition.stop(); } catch {}
              return;
            }
          }
        };

        recognition.onerror = () => {
          if (!hasMatchedRef.current) {
            if (hasVocalizedRef.current) {
              setSpeechStatus("success");
              playTriumphSound();
            } else {
              setSpeechStatus("retry");
              playRetrySound();
            }
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          if (!hasMatchedRef.current) {
            if (hasVocalizedRef.current) {
              setSpeechStatus("success");
              playTriumphSound();
            } else if (speechStatus === "listening") {
              setSpeechStatus("retry");
              playRetrySound();
            }
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [activePhonic, selectedWord, currentStage, speechStatus]);

  const evaluateInput = (rawText: string): boolean => {
    const clean = rawText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim().toLowerCase();
    const tokens = clean.split(/\s+/);

    if (currentStage === 1) {
      const targetId = activePhonic.id.toLowerCase();
      const hasAccepted = activePhonic.acceptedEchoes.some(
        (e) => clean === e || tokens.includes(e) || isFuzzyMatch(clean, e)
      );
      return hasAccepted || clean.includes(targetId) || tokens.some(t => t.startsWith(targetId));
    } else {
      const target = selectedWord.toLowerCase();
      const aliases = CVC_ALIASES[target] || [];

      for (const token of tokens) {
        if (token === target) return true;
        if (aliases.includes(token)) return true;
        if (isFuzzyMatch(token, target)) return true;
        if (token.includes(target) || target.includes(token)) return true;
      }
      return isFuzzyMatch(clean, target) || aliases.includes(clean);
    }
  };

  const startListening = async () => {
    setSpeechStatus("listening");
    setHeardText("");
    hasVocalizedRef.current = false;
    hasMatchedRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;

        if (avg > 15) {
          hasVocalizedRef.current = true;
        }

        if (speechStatus === "listening") {
          requestAnimationFrame(checkVolume);
        }
      };

      requestAnimationFrame(checkVolume);
    } catch (e) {
      console.warn("Direct microphone metering unavailable", e);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
        setTimeout(() => {
          try { recognitionRef.current.start(); } catch {}
        }, 150);
      }
    }
  };

  const playAudioClip = (src: string): Promise<void> => {
    return new Promise((resolve) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  };

  const playSound = (item: PhonicsItem) => {
    setActivePhonic(item);
    setSpeechStatus("idle");
    setHeardText("");
    if (audioRef.current) {
      audioRef.current.src = item.audio;
      setIsPlaying(true);
      audioRef.current.play().catch((err) => console.error(err));
    }
  };

  const handleTapLetterSound = async (char: string, index: number) => {
    setActiveLetterIdx(index);
    await playAudioClip(`/audio/speak/p_${char.toLowerCase()}.mp3`);
    setActiveLetterIdx(null);
  };

  const handleSayBlendedWord = async () => {
    setIsBlending(true);
    await playAudioClip(`/audio/words/cvc_${selectedWord.toLowerCase()}.mp3`);
    setIsBlending(false);
  };

  const handleStepByStepBlend = async () => {
    setIsBlending(true);
    const chars = selectedWord.split("");
    for (let i = 0; i < chars.length; i++) {
      setActiveLetterIdx(i);
      await playAudioClip(`/audio/speak/p_${chars[i].toLowerCase()}.mp3`);
      await new Promise((r) => setTimeout(r, 140));
    }
    setActiveLetterIdx(null);
    await new Promise((r) => setTimeout(r, 220));
    await playAudioClip(`/audio/words/cvc_${selectedWord.toLowerCase()}.mp3`);
    setIsBlending(false);
  };

  const currentGroupItems = PHONICS_DATA.filter((item) => item.group === selectedGroup);
  const activeVowelData = CVC_VOWEL_LABS[selectedVowel];
  const allCurrentWords = Object.values(activeVowelData.families).flat();

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-zinc-900 p-4 md:p-8 font-sans selection:bg-amber-400 selection:text-zinc-950">
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      {/* Lab Header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
              Young Researcher • NEP 2020
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-950 mt-3 tracking-tight">
            Spoken Phonics & English Lab
          </h1>
          <p className="text-zinc-500 text-sm md:text-base mt-1">
            {currentStage === 1
              ? "Hear the pure letter sound, then repeat that exact sound into the mic!"
              : `Listen to the blended ${activeVowelData.label} word, then say the full word!`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentStage === 2 && (
            <button
              onClick={() => {
                setCurrentStage(1);
                setSpeechStatus("idle");
              }}
              className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-zinc-200 shadow-sm text-xs font-black text-zinc-800 hover:bg-zinc-50 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Stage 1: Letters</span>
            </button>
          )}
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-zinc-200 shadow-sm">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-black text-zinc-800 uppercase tracking-wide">
              {currentStage === 1 ? "Stage 1: Sound Echo" : `Stage 2: ${activeVowelData.label}`}
            </span>
          </div>
        </div>
      </header>

      {/* STAGE 1: SOUND ECHO */}
      {currentStage === 1 && (
        <>
          <div className="max-w-6xl mx-auto flex gap-2.5 mb-8 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedGroup(g);
                  const firstInGroup = PHONICS_DATA.find((item) => item.group === g);
                  if (firstInGroup) setActivePhonic(firstInGroup);
                  setSpeechStatus("idle");
                }}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  selectedGroup === g
                    ? "bg-zinc-950 text-white shadow-md scale-102"
                    : "bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200 shadow-sm"
                }`}
              >
                <span>Group {g}</span>
                {selectedGroup === g && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            ))}
          </div>

          <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 bg-white rounded-3xl p-6 md:p-8 border-2 border-zinc-200/90 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-full flex items-end gap-3 mb-4 px-1">
                <div className="relative w-20 h-28 flex-shrink-0 -mb-2">
                  <Image
                    src="/tara.png"
                    alt="Tara - Young Researcher Guide"
                    fill
                    sizes="80px"
                    className="object-contain object-bottom drop-shadow-md hover:scale-105 transition-transform"
                    priority
                  />
                </div>

                <div className="relative flex-1 bg-amber-50/90 border-2 border-amber-200/90 rounded-2xl rounded-bl-none p-3 shadow-sm text-left">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-950 block">
                    Tara says:
                  </span>
                  <span className="text-sm font-bold text-amber-900 leading-tight block mt-0.5">
                    {isPlaying
                      ? `Listen to "${activePhonic.sound}"!`
                      : speechStatus === "listening"
                      ? `Make the "${activePhonic.sound}" sound into the mic! 🎙️`
                      : speechStatus === "success"
                      ? `Shaabaash! Perfect "${activePhonic.sound}" sound! 🌟`
                      : speechStatus === "retry"
                      ? `Repeat just the sound: "${activePhonic.sound}"! 🔁`
                      : `Hear "${activePhonic.sound}", then repeat the sound!`}
                  </span>
                </div>
              </div>

              <div className="w-full bg-zinc-50 rounded-3xl border-2 border-zinc-200 p-6 flex flex-col items-center justify-center my-2 shadow-inner">
                <div className="text-7xl md:text-8xl font-black text-zinc-950 tracking-tight">
                  {activePhonic.letter}
                </div>

                <div className="flex items-center gap-3 mt-4 bg-white px-5 py-2.5 rounded-2xl border border-zinc-200 shadow-sm">
                  <span className="text-3xl">{activePhonic.icon}</span>
                  <div className="text-left">
                    <span className="text-base font-black text-zinc-900 block leading-tight">
                      {activePhonic.word}
                    </span>
                    <span className="text-xs font-semibold text-zinc-400">
                      Anchor: {activePhonic.word}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-3xl font-black text-zinc-950 mt-4 mb-0.5">
                {activePhonic.sound}
              </div>
              <div className="text-sm font-bold text-zinc-500 mb-6">
                {activePhonic.hindiHint}
              </div>

              <button
                onClick={() => playSound(activePhonic)}
                className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all cursor-pointer ${
                  isPlaying
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-400/30 scale-102 animate-pulse"
                    : "bg-zinc-950 hover:bg-zinc-800 text-white shadow-md hover:scale-[1.01] active:scale-[0.98]"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="w-6 h-6 animate-bounce" />
                    <span>Playing Sound: {activePhonic.sound}...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    <span>1. Hear Letter Sound ({activePhonic.sound})</span>
                  </>
                )}
              </button>

              <button
                onClick={startListening}
                disabled={isListening}
                className={`w-full mt-3 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse ring-4 ring-red-200"
                    : speechStatus === "success"
                    ? "bg-amber-400 hover:bg-amber-500 text-amber-950"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                <Mic className="w-5 h-5" />
                <span>
                  {isListening
                    ? "Listening... Make the sound! 🎙️"
                    : `2. Echo the Sound: "${activePhonic.sound}"`}
                </span>
              </button>

              {speechStatus === "success" && (
                <div className="mt-3 flex items-center gap-2 text-emerald-800 font-extrabold text-xs bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-xl animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Shaabaash! Tara heard the {activePhonic.sound} sound! 🔔✨</span>
                </div>
              )}

              {speechStatus === "retry" && (
                <div className="mt-3 flex items-center gap-2 text-amber-900 font-bold text-xs bg-amber-50 border border-amber-300 px-4 py-2 rounded-xl">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Make just the sound: "{activePhonic.sound}" — Try again! 🔁</span>
                </div>
              )}

              <div className="mt-5 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 text-left w-full flex items-center gap-2">
                <span className="text-base">💡</span>
                <span>
                  <b>NEP Rule:</b> Pure sound repeat. No extra schwa (e.g. say /t/, not "tuh").
                </span>
              </div>
            </div>

            {/* Stage 1 Grid */}
            <div className="md:col-span-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <span>Select Any Letter Card</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </h2>
                <span className="text-xs font-bold text-zinc-400">
                  {currentGroupItems.length} sounds
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {currentGroupItems.map((item) => {
                  const isSelected = activePhonic.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => playSound(item)}
                      className={`p-4 rounded-3xl border-2 text-left transition-all relative flex flex-col justify-between h-36 cursor-pointer ${
                        isSelected
                          ? "border-zinc-950 bg-white shadow-md ring-2 ring-zinc-950 scale-102"
                          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-3xl font-black text-zinc-950">{item.letter}</span>
                        <span className="text-2xl p-1 bg-zinc-50 rounded-xl border border-zinc-100">
                          {item.icon}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-black text-zinc-900 uppercase tracking-wide">
                          {item.word}
                        </div>
                        <div className="text-sm font-black text-zinc-700">{item.sound}</div>
                        <div className="text-[11px] text-zinc-400 font-semibold truncate">
                          {item.hindiHint}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setCurrentStage(2);
                  setSpeechStatus("idle");
                }}
                className="mt-6 w-full p-5 rounded-3xl bg-white hover:bg-zinc-50 border-2 border-zinc-200 hover:border-zinc-950 flex items-center justify-between shadow-sm transition-all group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🧩</span>
                  <div>
                    <h3 className="font-black text-zinc-950 text-sm">Next: CVC Word Blending</h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      Hear & speak blended words across Short A, E, I, and O
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-zinc-900 bg-zinc-100 group-hover:bg-amber-400 group-hover:text-amber-950 px-3.5 py-2 rounded-2xl border border-zinc-200 transition-colors">
                  <span>Stage 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </main>
        </>
      )}

      {/* STAGE 2: CVC WORD BLENDING */}
      {currentStage === 2 && (
        <main className="max-w-5xl mx-auto flex flex-col items-center">
          {/* Multi-Vowel Switcher Bar */}
          <div className="flex items-center justify-center gap-3 mb-8 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200">
            {(["A", "E", "I", "O"] as VowelKey[]).map((vowel) => {
              const vData = CVC_VOWEL_LABS[vowel];
              const isSelected = selectedVowel === vowel;
              return (
                <button
                  key={vowel}
                  onClick={() => {
                    setSelectedVowel(vowel);
                    setSelectedWord(vData.defaultWord);
                    setSpeechStatus("idle");
                    setHeardText("");
                  }}
                  className={`px-5 py-2 rounded-xl font-black text-sm transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-amber-400 text-amber-950 shadow-sm scale-102"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-white/60"
                  }`}
                >
                  <span>{vData.label}</span>
                  <span className="text-xs font-extrabold opacity-75">{vData.sound}</span>
                </button>
              );
            })}
          </div>

          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 border-2 border-zinc-200/90 shadow-sm flex flex-col items-center">
            {/* Mascot Banner */}
            <div className="w-full flex items-center gap-4 bg-amber-50/90 border-2 border-amber-200/90 rounded-2xl p-3.5 mb-8 shadow-sm">
              <div className="relative w-12 h-16 flex-shrink-0">
                <Image
                  src="/tara.png"
                  alt="Tara"
                  fill
                  sizes="48px"
                  className="object-contain object-bottom"
                />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-950 block">
                  Tara's Blending Studio ({activeVowelData.label}):
                </span>
                <span className="text-sm font-bold text-amber-900 leading-tight block mt-0.5">
                  {speechStatus === "listening"
                    ? `I'm listening! Say the full word "${selectedWord}"! 🎙️`
                    : speechStatus === "success"
                    ? `Shaabaash! You said the whole word "${selectedWord}"! 🎉`
                    : speechStatus === "retry"
                    ? `Try again! Say the whole word: "${selectedWord}" 🔁`
                    : `Blend the sounds together, then speak "${selectedWord}"!`}
                </span>
              </div>
            </div>

            {/* Letter Blocks */}
            <div className="flex gap-4 md:gap-6 mb-6">
              {selectedWord.split("").map((char, idx) => (
                <button
                  key={`${char}-${idx}`}
                  onClick={() => handleTapLetterSound(char, idx)}
                  className={`w-20 h-28 md:w-24 md:h-32 rounded-3xl flex flex-col items-center justify-center font-black transition-all transform active:scale-95 shadow-sm border-2 cursor-pointer ${
                    activeLetterIdx === idx
                      ? "bg-amber-400 text-amber-950 border-amber-500 scale-105 shadow-lg ring-4 ring-amber-200"
                      : "bg-zinc-50 hover:bg-zinc-100 text-zinc-950 border-zinc-200"
                  }`}
                >
                  <span className="text-5xl md:text-6xl uppercase tracking-tight">{char}</span>
                  <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mt-1">
                    /{char}/
                  </span>
                </button>
              ))}
            </div>

            {/* Blended Audio Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
              <button
                onClick={handleSayBlendedWord}
                disabled={isBlending}
                className="flex-1 py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-black text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Hear Word: "{selectedWord}"</span>
              </button>

              <button
                onClick={handleStepByStepBlend}
                disabled={isBlending}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Blend Step-by-Step</span>
              </button>
            </div>

            {/* Whole Word Speech Practice */}
            <div className="w-full bg-zinc-50 rounded-2xl border-2 border-zinc-200 p-5 flex flex-col items-center">
              <div className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
                <span>Kid's Word Practice (पूरा शब्द बोलो)</span>
              </div>

              <button
                onClick={startListening}
                disabled={isListening}
                className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse ring-4 ring-red-200 scale-102"
                    : speechStatus === "success"
                    ? "bg-amber-400 hover:bg-amber-500 text-amber-950"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.01]"
                }`}
              >
                {isListening ? (
                  <>
                    <Mic className="w-6 h-6 animate-bounce" />
                    <span>Listening... Say "{selectedWord}"! 🎙️</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6" />
                    <span>Say the Word: "{selectedWord}"</span>
                  </>
                )}
              </button>

              {speechStatus === "success" && (
                <div className="mt-3.5 flex items-center gap-2 text-emerald-800 font-extrabold text-sm bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-xl animate-bounce">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Shaabaash! Tara heard: <b>"{heardText || selectedWord}"</b> 🔔✨</span>
                </div>
              )}

              {speechStatus === "retry" && (
                <div className="mt-3.5 flex items-center gap-2 text-amber-900 font-bold text-sm bg-amber-50 border border-amber-300 px-4 py-2 rounded-xl">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Heard: "{heardText || '...'}" — Say "{selectedWord}" again! 🔁</span>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Word Selector Tray */}
          <section className="w-full max-w-4xl mt-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <span>Select {activeVowelData.label} Word</span>
                <span className="text-amber-500">•</span>
                <span>{allCurrentWords.length} Words Available</span>
              </h3>
            </div>

            <div className="bg-white rounded-3xl border-2 border-zinc-200 p-6 shadow-sm space-y-4">
              {Object.entries(activeVowelData.families).map(([family, words]) => (
                <div key={family} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-3 border-b border-zinc-100 last:border-b-0 last:pb-0">
                  <span className="w-28 text-xs font-black uppercase text-amber-950 bg-amber-100 px-3 py-1.5 rounded-xl text-center flex-shrink-0">
                    {family}
                  </span>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {words.map((w) => (
                      <button
                        key={w}
                        onClick={() => {
                          setSelectedWord(w);
                          setSpeechStatus("idle");
                          setHeardText("");
                        }}
                        className={`px-3.5 py-1.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
                          selectedWord === w
                            ? "bg-zinc-950 text-white shadow-md scale-105"
                            : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}