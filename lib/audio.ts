// Web Speech API for Hindi voiceover and Web Audio API for sound effects

export function speakHindi(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  
  // Cancel previous speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'hi-IN';
  utterance.rate = 0.9; // Slightly slower for clear instruction
  utterance.pitch = 1.0;

  // Select a Hindi voice if available
  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
  if (hindiVoice) {
    utterance.voice = hindiVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Lightweight synthesized sound effects using AudioContext
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return AudioCtx ? new AudioCtx() : null;
}

export function playStepSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

export function playCollectSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
  osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
  osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.35);
}

export function playWinSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
    gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.25);
  });
}

export function playBumpSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.18);
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.18);
}