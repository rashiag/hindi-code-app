'use client';

import React from 'react';

export default function ActivitySheetPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 print:p-0 print:bg-white flex flex-col items-center select-none" translate="no">
      
      {/* Print Control Bar (Hidden when printing) */}
      <div className="w-full max-w-[190mm] mb-4 print:hidden flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-300 shadow-sm">
        <div>
          <h2 className="text-sm font-black text-slate-800">प्रिंटेबल एक्टिविटी शीट (A4 Printable Mission Sheet)</h2>
          <p className="text-[11px] font-semibold text-slate-500">प्रिन्ट करने के लिए दाईं ओर का बटन दबाएं (Background Graphics चालू रखें)।</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow cursor-pointer"
        >
          🖨️ अभी प्रिंट करें (Print Sheet)
        </button>
      </div>

      {/* A4 Sheet Container */}
      <div className="w-[190mm] min-h-[275mm] bg-white border-4 border-indigo-500 rounded-3xl p-3.5 print:border-2 print:rounded-2xl print:w-full print:p-2 shadow-xl flex flex-col justify-between">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-2.5 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              🚀
            </div>
            <div>
              <h1 className="text-base font-black tracking-wide">Young Researcher • बाल शोधकर्ता मिशन शीट</h1>
              <p className="text-[10px] font-bold text-pink-200">NEP 2020 Experiential Learning &amp; AI Discovery Lab</p>
            </div>
          </div>
          <div className="bg-white text-indigo-950 px-3 py-1 rounded-xl text-[10px] font-black border border-indigo-200 flex gap-2">
            <span>नाम: _______________</span>
            <span>कक्षा: _____</span>
          </div>
        </div>

        {/* 2x2 Mission Grid */}
        <div className="grid grid-cols-2 gap-2 my-2">
          
          {/* Mission 1: Phonics */}
          <div className="border-2 border-teal-500 bg-teal-50/50 rounded-2xl p-2.5 flex flex-col justify-between">
            <div className="text-xs font-black text-teal-900 border-b border-dashed border-teal-300 pb-1 mb-1.5 flex items-center gap-1">
              <span>🔤 मिशन १: फोनिक्स ध्वनि खोजो</span>
            </div>
            <p className="text-[9px] font-bold text-teal-800 mb-1.5">चित्र देखकर सही शुरुआती ध्वनि (Sound) पर ⭕ लगाएं:</p>
            
            <div className="flex justify-between items-center bg-white border border-teal-200 rounded-lg p-1.5 mb-1 text-xs font-bold">
              <span>🍎 Apple</span>
              <div className="flex gap-1 text-[10px]">
                <span className="border border-teal-600 px-1.5 py-0.5 rounded text-teal-800 font-black">A (ऐ)</span>
                <span className="border border-teal-600 px-1.5 py-0.5 rounded text-teal-800 font-black">B (ब)</span>
                <span className="border border-teal-600 px-1.5 py-0.5 rounded text-teal-800 font-black">C (क)</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white border border-teal-200 rounded-lg p-1.5 mb-1 text-xs font-bold">
              <span>🐱 Cat</span>
              <div className="flex gap-1 text-[10px]">
                <span className="border border-teal-600 px-1.5 py-0.5 rounded text-teal-800 font-black">P (प)</span>
                <span className="border border-teal-600 px-1.5 py-0.5 rounded text-teal-800 font-black">C (क)</span>
                <span className="border border-teal-600 px-1.5 py-0.5 rounded text-teal-800 font-black">M (म)</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white border border-teal-200 rounded-lg p-1.5 text-xs font-bold">
              <span>☀️ Sun</span>
              <div className="flex gap-1 text-[10px]">
                <span className="border border-teal-600 px-1.5 py-0.5 rounded text-teal-800 font-black">S (स)</span>
                <span className="border border-teal-600 px-1.5 py-0.5 rounded text-teal-800 font-black">T (ट)</span>
                <span className="border border-teal-600 px-1.5 py-0.5 rounded text-teal-800 font-black">R (र)</span>
              </div>
            </div>
          </div>

          {/* Mission 2: Maths */}
          <div className="border-2 border-amber-500 bg-amber-50/50 rounded-2xl p-2.5 flex flex-col justify-between">
            <div className="text-xs font-black text-amber-900 border-b border-dashed border-amber-300 pb-1 mb-1.5 flex items-center gap-1">
              <span>🔢 मिशन २: दस-फ्रेम जोड़ (Maths)</span>
            </div>
            <p className="text-[9px] font-bold text-amber-800 mb-1.5">भरे हुए बिंदु गिनें और जोड़ पूरा करें:</p>

            <div className="flex justify-between items-center bg-white border border-amber-200 rounded-lg p-1.5 mb-1 text-xs font-bold">
              <span className="font-mono text-amber-700 font-black text-[11px]">[ ⚫⚫⚫⚫⚫ | ⚪⚪⚪⚪⚪ ]</span>
              <span className="text-amber-900 font-black text-xs">5 + 0 = 5</span>
            </div>

            <div className="flex justify-between items-center bg-white border border-amber-200 rounded-lg p-1.5 mb-1 text-xs font-bold">
              <span className="font-mono text-amber-700 font-black text-[11px]">[ ⚫⚫⚫⚫⚫ | ⚫⚫⚫⚪⚪ ]</span>
              <span className="text-amber-900 font-black text-xs">5 + 3 = ___</span>
            </div>

            <div className="flex justify-between items-center bg-white border border-amber-200 rounded-lg p-1.5 text-xs font-bold">
              <span className="font-mono text-amber-700 font-black text-[11px]">[ ⚫⚫⚫⚫⚫ | ⚫⚫⚫⚫⚫ ]</span>
              <span className="text-amber-900 font-black text-xs">5 + 5 = ___</span>
            </div>
          </div>

          {/* Mission 3: Logic Maze */}
          <div className="border-2 border-emerald-500 bg-emerald-50/50 rounded-2xl p-2.5 flex flex-col justify-between">
            <div className="text-xs font-black text-emerald-900 border-b border-dashed border-emerald-300 pb-1 mb-1.5 flex items-center gap-1">
              <span>🎮 मिशन ३: रोबोट को केला खिलाओ</span>
            </div>
            <p className="text-[9px] font-bold text-emerald-800 mb-1.5">रोबोट को सही क्रम (Algorithm) में कोड करें:</p>

            <div className="bg-white border border-emerald-200 rounded-lg p-1.5 text-center mb-1.5 flex justify-around items-center">
              <span className="text-xl">🤖</span>
              <span className="text-xs font-black text-emerald-700 tracking-wider">➔ ➔ ⬇️</span>
              <span className="text-xl">🍌</span>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
              <span className="bg-white border border-emerald-300 p-1 rounded text-center">१. [ आगे बढ़ो ]</span>
              <span className="bg-white border border-emerald-300 p-1 rounded text-center">२. [ दाएँ मुड़ो ]</span>
              <span className="bg-white border-dashed border-2 border-emerald-400 p-1 rounded text-center">३. [ ________ ]</span>
              <span className="bg-emerald-600 text-white p-1 rounded text-center font-black">४. केला उठाओ</span>
            </div>
          </div>

          {/* Mission 4: Music Swar */}
          <div className="border-2 border-orange-500 bg-orange-50/50 rounded-2xl p-2.5 flex flex-col justify-between">
            <div className="text-xs font-black text-orange-900 border-b border-dashed border-orange-300 pb-1 mb-1.5 flex items-center gap-1">
              <span>🎹 मिशन ४: सा-रे-ग-म सुर मिलाओ</span>
            </div>
            <p className="text-[9px] font-bold text-orange-800 mb-1.5">हारमोनियम के छूटे सुर बॉक्स में भरें:</p>

            <div className="bg-white border border-orange-200 rounded-lg p-2 flex justify-between text-xs font-black text-orange-900">
              <div className="p-1 border border-slate-300 rounded bg-slate-50">सा</div>
              <div className="p-1 border border-slate-300 rounded bg-slate-50">रे</div>
              <div className="p-1 border-2 border-orange-500 rounded bg-orange-100 text-orange-800">?</div>
              <div className="p-1 border border-slate-300 rounded bg-slate-50">म</div>
              <div className="p-1 border border-slate-300 rounded bg-slate-50">प</div>
              <div className="p-1 border-2 border-orange-500 rounded bg-orange-100 text-orange-800">?</div>
              <div className="p-1 border border-slate-300 rounded bg-slate-50">नि</div>
            </div>
            <p className="text-[9px] font-black text-center text-orange-700 mt-1">छूटे सुर पहचानें: [ ग ] और [ ध ]</p>
          </div>

        </div>

        {/* Mission 5: Full Width AI Vision & Grad-CAM */}
        <div className="border-2 border-purple-500 bg-purple-50/60 rounded-2xl p-2.5 mb-2">
          <div className="text-xs font-black text-purple-900 border-b border-dashed border-purple-300 pb-1 mb-1.5 flex items-center gap-1">
            <span>🤖 मिशन ५: AI विज़न डिटेक्टिव (Grad-CAM X-Ray Heatmap)</span>
          </div>

          <div className="bg-white border border-purple-200 rounded-xl p-2.5 flex justify-between items-center gap-3">
            <div className="max-w-[72%]">
              <p className="text-[10px] font-black text-purple-950 mb-0.5">सवाल: AI ने लाल सेब को देखकर कैसे पहचाना?</p>
              <p className="text-[9px] font-bold text-purple-800 mb-1.5 leading-tight">
                दाहिनी ओर का लाल रंग (Grad-CAM) दर्शाता है कि मॉडल ने सेब के किनारों और रंग पर मुख्य ध्यान दिया।
              </p>
              <div className="flex gap-2">
                <span className="bg-purple-100 border border-purple-400 text-purple-950 text-[9px] font-black px-2 py-0.5 rounded">
                  ☑️ सही: लाल रंग सेब का है
                </span>
                <span className="bg-slate-100 border border-slate-300 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded">
                  ⬜ गलत: बैकग्राउंड
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-12 rounded-lg bg-gradient-to-tr from-blue-500 via-amber-400 to-red-500 border-2 border-purple-600 flex items-center justify-center text-xl shadow">
                🍎
              </div>
              <span className="text-[8px] font-black text-purple-800 mt-0.5">AI Heatmap</span>
            </div>
          </div>
        </div>

        {/* Footer Star Badge */}
        <div className="bg-slate-900 text-white rounded-2xl p-2.5 flex justify-between items-center">
          <div>
            <h3 className="text-xs font-black text-sky-400">🏆 युवा वैज्ञानिक बैज (Young Researcher Certified!)</h3>
            <p className="text-[9px] font-bold text-slate-300">ऑनलाइन लाइव लैब्स: code.youngresearcher.in</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold text-pink-300 block mb-0.5">शिक्षक हस्ताक्षर व रेटिंग:</span>
            <div className="text-sm tracking-wider text-amber-400">
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
