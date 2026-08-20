// Audio synthesis & sound effects helper

let isAudioUnlocked = false;

// Unlock browser audio context on first interaction
export const unlockAudio = () => {
  if (typeof window === 'undefined' || isAudioUnlocked) return;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isAudioUnlocked = true;
};

// Global queue manager to prevent overlapping or repeating speech
let lastSpokenText = '';
let speechTimer: NodeJS.Timeout | null = null;

export const speakHindi = (text: string, force: boolean = false) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text) return;

  // Prevent repeating the exact same utterance within 1.5 seconds unless forced
  if (!force && lastSpokenText === text) return;
  lastSpokenText = text;

  if (speechTimer) clearTimeout(speechTimer);
  speechTimer = setTimeout(() => {
    lastSpokenText = '';
  }, 1500);

  // Cancel any currently playing speech to avoid echo/overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'hi-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Find a Hindi voice if available, fallback gracefully
  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = voices.find((v) => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
  if (hindiVoice) {
    utterance.voice = hindiVoice;
  }

  // Brief delay ensures speech engine has cleanly cleared previous utterances
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 50);
};

// Lightweight Web Audio API synthesized sound effects
export const playStepSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {}
};

export const playCollectSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {}
};

export const playWinSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.2);
    });
  } catch {}
};

export const playBumpSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
};