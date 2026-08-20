'use client';

import React, { useState, useEffect, useRef } from 'react';
import { speakHindi } from '../lib/audio';

interface Sprite {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  sayText: string;
}

export default function HindiScratchStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sprite, setSprite] = useState<Sprite>({
    id: 'sprite1',
    name: 'बंदर (Monkey)',
    emoji: '🐵',
    x: 200,
    y: 150,
    size: 44,
    rotation: 0,
    sayText: '',
  });

  const [backdrop, setBackdrop] = useState<'plain' | 'forest' | 'space'>('forest');
  const [codeScript, setCodeScript] = useState<string[]>([
    'MOVE_10',
    'TURN_RIGHT_15',
    'SAY_HELLO',
  ]);
  const [isRunning, setIsRunning] = useState(false);

  // Available Hindi Blocks Palette
  const AVAILABLE_BLOCKS = [
    { id: 'MOVE_10', label: '🚶 १० कदम आगे बढ़ो', type: 'motion', color: 'bg-blue-600' },
    { id: 'MOVE_BACK_10', label: '🔙 १० कदम पीछे हटो', type: 'motion', color: 'bg-blue-600' },
    { id: 'TURN_RIGHT_15', label: '↻ १५° दाएँ घूमो', type: 'motion', color: 'bg-blue-600' },
    { id: 'TURN_LEFT_15', label: '↺ १५° बाएँ घूमो', type: 'motion', color: 'bg-blue-600' },
    { id: 'GO_CENTER', label: '🎯 केंद्र (Center) में आओ', type: 'motion', color: 'bg-blue-600' },
    { id: 'SAY_HELLO', label: '💬 बोलो "नमस्ते दोस्तों!"', type: 'looks', color: 'bg-purple-600' },
    { id: 'GROW', label: '🔍 आकार बड़ा करो', type: 'looks', color: 'bg-purple-600' },
    { id: 'SHRINK', label: '🔎 आकार छोटा करो', type: 'looks', color: 'bg-purple-600' },
  ];

  // Render Canvas Stage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Stage Backdrop
    if (backdrop === 'forest') {
      ctx.fillStyle = '#ecfdf5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, canvas.height - 35, canvas.width, 35);
    } else if (backdrop === 'space') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 20; i++) {
        ctx.fillRect((i * 47) % canvas.width, (i * 31) % canvas.height, 2, 2);
      }
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw Grid Coordinates Reference
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Draw Sprite
    ctx.save();
    ctx.translate(sprite.x, sprite.y);
    ctx.rotate((sprite.rotation * Math.PI) / 180);
    ctx.font = `${sprite.size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sprite.emoji, 0, 0);
    ctx.restore();

    // Draw Speech Bubble if sprite is speaking
    if (sprite.sayText) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      const bubbleX = Math.min(Math.max(sprite.x + 20, 20), canvas.width - 150);
      const bubbleY = Math.max(sprite.y - 45, 20);

      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, 140, 32, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(sprite.sayText, bubbleX + 8, bubbleY + 20);
    }
  }, [sprite, backdrop]);

  // Execute the visual Scratch blocks sequentially
  const handleRunProgram = async () => {
    if (isRunning || codeScript.length === 0) return;
    setIsRunning(true);

    let curX = sprite.x;
    let curY = sprite.y;
    let curRot = sprite.rotation;
    let curSize = sprite.size;
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (const blockId of codeScript) {
      if (blockId === 'MOVE_10') {
        const rad = (curRot * Math.PI) / 180;
        curX = Math.min(Math.max(curX + Math.cos(rad) * 25, 30), 370);
        curY = Math.min(Math.max(curY + Math.sin(rad) * 25, 30), 270);
        setSprite((s) => ({ ...s, x: curX, y: curY }));
        await sleep(350);
      } else if (blockId === 'MOVE_BACK_10') {
        const rad = (curRot * Math.PI) / 180;
        curX = Math.min(Math.max(curX - Math.cos(rad) * 25, 30), 370);
        curY = Math.min(Math.max(curY - Math.sin(rad) * 25, 30), 270);
        setSprite((s) => ({ ...s, x: curX, y: curY }));
        await sleep(350);
      } else if (blockId === 'TURN_RIGHT_15') {
        curRot = (curRot + 25) % 360;
        setSprite((s) => ({ ...s, rotation: curRot }));
        await sleep(300);
      } else if (blockId === 'TURN_LEFT_15') {
        curRot = (curRot - 25 + 360) % 360;
        setSprite((s) => ({ ...s, rotation: curRot }));
        await sleep(300);
      } else if (blockId === 'GO_CENTER') {
        curX = 200;
        curY = 150;
        curRot = 0;
        setSprite((s) => ({ ...s, x: curX, y: curY, rotation: 0 }));
        await sleep(350);
      } else if (blockId === 'SAY_HELLO') {
        setSprite((s) => ({ ...s, sayText: 'नमस्ते दोस्तों!' }));
        speakHindi('नमस्ते दोस्तों! मैं स्क्रैच रोबोट हूँ!');
        await sleep(1500);
        setSprite((s) => ({ ...s, sayText: '' }));
      } else if (blockId === 'GROW') {
        curSize = Math.min(curSize + 12, 80);
        setSprite((s) => ({ ...s, size: curSize }));
        await sleep(300);
      } else if (blockId === 'SHRINK') {
        curSize = Math.max(curSize - 12, 24);
        setSprite((s) => ({ ...s, size: curSize }));
        await sleep(300);
      }
    }

    setIsRunning(false);
  };

  const addBlockToScript = (blockId: string) => {
    setCodeScript((prev) => [...prev, blockId]);
  };

  const removeBlockFromScript = (index: number) => {
    setCodeScript((prev) => prev.filter((_, i) => i !== index));
  };

  const resetStage = () => {
    setSprite({
      id: 'sprite1',
      name: 'बंदर (Monkey)',
      emoji: sprite.emoji,
      x: 200,
      y: 150,
      size: 44,
      rotation: 0,
      sayText: '',
    });
  };

  return (
    <div className="w-full max-w-6xl flex flex-col items-center gap-4 p-3 md:p-6 font-sans">
      {/* Studio Header */}
      <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🐱</span> हिंदी स्क्रैच स्टूडियो (Hindi Scratch Studio)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            पात्र (Sprite) चुनें, हिंदी ब्लॉक जोड़ें और एनिमेशन बनाएं!
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunProgram}
            disabled={isRunning || codeScript.length === 0}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-95 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
          >
            <span>🚩</span> प्रोग्राम चलाएं (Run)
          </button>
          <button
            onClick={resetStage}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            🔄 रीसेट
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Workspace */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Column 1: Hindi Blocks Toolbox */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
            <span>🧩</span> ब्लॉक पैलेट (Block Palette)
          </h3>
          <p className="text-[11px] text-slate-500 mb-3">
            स्क्रिप्ट में जोड़ने के लिए ब्लॉक पर क्लिक करें:
          </p>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[380px] pr-1">
            {AVAILABLE_BLOCKS.map((block) => (
              <button
                key={block.id}
                onClick={() => addBlockToScript(block.id)}
                className={`${block.color} text-white font-bold text-xs py-2 px-3 rounded-lg text-left shadow hover:brightness-110 active:scale-98 transition flex justify-between items-center`}
              >
                <span>{block.label}</span>
                <span className="text-[11px] opacity-75">+ जोड़ें</span>
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Code Workspace (Active Script) */}
        <div className="lg:col-span-4 bg-slate-100 p-4 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <span>📜</span> आपकी स्क्रिप्ट (Active Script)
              </h3>
              <span className="text-xs text-slate-500 font-semibold">{codeScript.length} ब्लॉक</span>
            </div>

            <div className="space-y-2">
              <div className="bg-amber-500 text-white text-xs font-black py-2 px-3 rounded-lg shadow-sm flex items-center gap-2">
                <span>🚩</span> जब हरा झंडा क्लिक हो:
              </div>

              {codeScript.map((blockId, idx) => {
                const blockInfo = AVAILABLE_BLOCKS.find((b) => b.id === blockId);
                return (
                  <div
                    key={idx}
                    className={`${blockInfo?.color || 'bg-blue-600'} text-white text-xs font-bold py-2 px-3 rounded-lg shadow-sm flex items-center justify-between group`}
                  >
                    <span>{blockInfo?.label || blockId}</span>
                    <button
                      onClick={() => removeBlockFromScript(idx)}
                      className="text-white/70 hover:text-white text-xs font-black px-1.5 py-0.5 rounded bg-black/20"
                      title="हटाएं"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              {codeScript.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  बाईं ओर से ब्लॉक चुनकर यहाँ स्क्रिप्ट बनाएं!
                </div>
              )}
            </div>
          </div>

          {codeScript.length > 0 && (
            <button
              onClick={() => setCodeScript([])}
              className="text-xs text-rose-600 hover:underline font-bold mt-4 self-center"
            >
              🗑️ सारी स्क्रिप्ट खाली करें
            </button>
          )}
        </div>

        {/* Column 3: 2D Stage & Sprite Settings */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Stage Canvas */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="border border-slate-200 rounded-xl w-full aspect-[4/3]"
            />
          </div>

          {/* Sprite & Backdrop Selectors */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center text-xs">
            {/* Sprite Selector */}
            <div>
              <span className="font-bold text-slate-700 block mb-1">पात्र (Sprite):</span>
              <div className="flex gap-1">
                {['🐵', '🦜', '🚀', '🐱', '🤖'].map((e) => (
                  <button
                    key={e}
                    onClick={() => setSprite((s) => ({ ...s, emoji: e }))}
                    className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center border transition ${
                      sprite.emoji === e ? 'bg-indigo-100 border-indigo-500 scale-110' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Backdrop Selector */}
            <div>
              <span className="font-bold text-slate-700 block mb-1">पृष्ठभूमि (Backdrop):</span>
              <div className="flex gap-1 font-bold">
                <button
                  onClick={() => setBackdrop('forest')}
                  className={`px-2 py-1 rounded text-[11px] border ${
                    backdrop === 'forest' ? 'bg-green-600 text-white' : 'bg-slate-100'
                  }`}
                >
                  🌲 जंगल
                </button>
                <button
                  onClick={() => setBackdrop('space')}
                  className={`px-2 py-1 rounded text-[11px] border ${
                    backdrop === 'space' ? 'bg-slate-900 text-white' : 'bg-slate-100'
                  }`}
                >
                  🌌 अंतरिक्ष
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}