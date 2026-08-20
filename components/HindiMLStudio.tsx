'use client';

import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import { speakHindi } from '../lib/audio';

interface ClassItem {
  id: number;
  name: string;
  count: number;
  color: string;
}

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: 'user',
};

export default function HindiMLStudio() {
  const webcamRef = useRef<Webcam>(null);
  const classifierRef = useRef<knnClassifier.KNNClassifier | null>(null);
  const mobilenetRef = useRef<mobilenet.MobileNet | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState<ClassItem[]>([
    { id: 1, name: 'खुश चेहरा 😃', count: 0, color: 'bg-green-500' },
    { id: 2, name: 'हाथ ऊपर ✋', count: 0, color: 'bg-blue-500' },
  ]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [topPrediction, setTopPrediction] = useState<{ label: string; conf: number } | null>(null);
  const [capturingIdx, setCapturingIdx] = useState<number | null>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize TensorFlow and Pretrained MobileNet
  useEffect(() => {
    let mounted = true;
    async function initModel() {
      try {
        await tf.ready();
        const classifier = knnClassifier.create();
        const model = await mobilenet.load({ version: 2, alpha: 0.5 }); // lightweight, instant load
        if (mounted) {
          classifierRef.current = classifier;
          mobilenetRef.current = model;
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load TensorFlow model:', err);
        alert('AI मॉडल लोड करने में समस्या आई। कृपया पेज रिफ्रेश करें।');
      }
    }
    initModel();
    return () => {
      mounted = false;
    };
  }, []);

  // Capture single frame
  const captureFrame = (classIndex: number) => {
    if (!webcamRef.current || !classifierRef.current || !mobilenetRef.current) return;
    
    const video = webcamRef.current.video;
    if (!video || video.readyState < 2) return;

    try {
      tf.tidy(() => {
        const imageTensor = tf.browser.fromPixels(video);
        const logits = mobilenetRef.current!.infer(imageTensor, true);
        classifierRef.current!.addExample(logits, classIndex);
      });

      setClasses((prev) =>
        prev.map((cls, idx) => (idx === classIndex ? { ...cls, count: cls.count + 1 } : cls))
      );
    } catch (error) {
      console.error('Capture error:', error);
    }
  };

  // Start continuous capture while holding button
  const startCapturing = (classIndex: number) => {
    captureFrame(classIndex);
    setCapturingIdx(classIndex);
    if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
    captureIntervalRef.current = setInterval(() => {
      captureFrame(classIndex);
    }, 150);
  };

  // Stop capturing
  const stopCapturing = () => {
    setCapturingIdx(null);
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  };

  // Continuous prediction loop
  useEffect(() => {
    let animId: number;

    const predictLoop = async () => {
      if (
        isPredicting &&
        webcamRef.current &&
        classifierRef.current &&
        mobilenetRef.current &&
        classifierRef.current.getNumClasses() > 0
      ) {
        const video = webcamRef.current.video;
        if (video && video.readyState >= 2) {
          try {
            const logits = tf.tidy(() => {
              const imageTensor = tf.browser.fromPixels(video);
              return mobilenetRef.current!.infer(imageTensor, true);
            });

            const result = await classifierRef.current.predictClass(logits);
            logits.dispose();

            if (result && result.label !== undefined) {
              const classIdx = parseInt(result.label, 10);
              const conf = Math.round((result.confidences[result.label] || 0) * 100);
              const matchedClass = classes[classIdx];
              if (matchedClass) {
                setTopPrediction({ label: matchedClass.name, conf });
              }
            }
          } catch (err) {
            console.error('Prediction error:', err);
          }
        }
      }
      if (isPredicting) {
        animId = requestAnimationFrame(predictLoop);
      }
    };

    if (isPredicting) {
      predictLoop();
    }

    return () => cancelAnimationFrame(animId);
  }, [isPredicting, classes]);

  const handleStartPredicting = () => {
    const totalSamples = classes.reduce((sum, c) => sum + c.count, 0);
    if (totalSamples === 0 || !classifierRef.current || classifierRef.current.getNumClasses() < 2) {
      alert('कृपया दोनों वर्गों में कम से कम 5-10 फोटो नमूने जोड़ें!');
      return;
    }
    setIsPredicting(true);
    speakHindi('मशीन अब लाइव पहचान कर रही है!');
  };

  const handleAddNewClass = () => {
    const newId = classes.length + 1;
    const colors = ['bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500'];
    const assignedColor = colors[newId % colors.length];
    setClasses([...classes, { id: newId, name: `वर्ग ${newId} 🏷️`, count: 0, color: assignedColor }]);
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6 p-2 md:p-4">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🧠</span> हिंदी AI मशीन ट्रेनर (Teachable Machine)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            वेबकैम से कंप्यूटर को वस्तुएं, चेहरे और हाथ के इशारे पहचानना सिखाएं!
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddNewClass}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            + नया वर्ग जोड़ें
          </button>
          {!isPredicting ? (
            <button
              onClick={handleStartPredicting}
              disabled={isLoading}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-xs md:text-sm font-bold rounded-xl shadow-md transition disabled:bg-gray-400"
            >
              🚀 लाइव पहचान शुरू करें
            </button>
          ) : (
            <button
              onClick={() => setIsPredicting(false)}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs md:text-sm font-bold rounded-xl shadow-md transition"
            >
              ⏹️ पहचान रोकें
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="text-4xl animate-spin mb-3">⚙️</div>
          <p className="text-slate-600 font-bold text-sm">AI मॉडल लोड हो रहा है... कृपया 5 सेकंड प्रतीक्षा करें</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Webcam View */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-full rounded-xl overflow-hidden bg-black aspect-video relative border border-slate-300">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  mirrored={true}
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Realtime Prediction Bar */}
              {isPredicting && topPrediction && (
                <div className="w-full mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                  <span className="text-xs font-bold text-green-700 uppercase">AI की लाइव पहचान:</span>
                  <div className="text-xl font-black text-slate-800 my-1">{topPrediction.label}</div>
                  <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-green-600 h-full transition-all duration-100"
                      style={{ width: `${topPrediction.conf}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 mt-1.5 block">
                    सटीकता (Confidence): {topPrediction.conf}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Classes & Capture Buttons */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 text-sm md:text-base border-b border-slate-100 pb-2">
                📸 नमूने इकट्ठा करें (Click or Hold to Capture)
              </h3>

              <div className="space-y-4">
                {classes.map((cls, idx) => (
                  <div key={cls.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={cls.name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setClasses((prev) =>
                            prev.map((c, i) => (i === idx ? { ...c, name: newName } : c))
                          );
                        }}
                        className="font-bold text-slate-800 bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200">
                        {cls.count} नमूने
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => captureFrame(idx)}
                      onMouseDown={() => startCapturing(idx)}
                      onMouseUp={stopCapturing}
                      onMouseLeave={stopCapturing}
                      onTouchStart={() => startCapturing(idx)}
                      onTouchEnd={stopCapturing}
                      className={`w-full py-3 text-white font-bold text-sm rounded-xl transition shadow flex items-center justify-center gap-2 select-none ${
                        capturingIdx === idx
                          ? 'bg-amber-600 scale-[0.98]'
                          : 'bg-slate-800 hover:bg-slate-900 active:scale-95'
                      }`}
                    >
                      <span>📷</span>
                      {capturingIdx === idx ? 'नमूना ले रहे हैं...' : 'फोटो लें (क्लिक करें या दबाए रखें)'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}