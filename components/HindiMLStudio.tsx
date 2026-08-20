'use client';

import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import { speakHindi } from '../lib/audio';

interface SampleItem {
  id: string;
  imageSrc: string;
}

interface ClassItem {
  id: number;
  name: string;
  samples: SampleItem[];
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
    { id: 1, name: 'खुश चेहरा 😃', samples: [], color: 'bg-green-500' },
    { id: 2, name: 'हाथ ऊपर ✋', samples: [], color: 'bg-blue-500' },
  ]);

  // Explicit training states
  const [isTrained, setIsTrained] = useState(false);
  const [isTrainingInProgress, setIsTrainingInProgress] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Live prediction states
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
        const model = await mobilenet.load({ version: 2, alpha: 0.5 });
        if (mounted) {
          classifierRef.current = classifier;
          mobilenetRef.current = model;
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load TensorFlow model:', err);
      }
    }
    initModel();
    return () => {
      mounted = false;
    };
  }, []);

  // Capture single frame (Stores visual photo only; tensor training happens upon clicking Train)
  const captureFrame = (classIndex: number) => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const newSample: SampleItem = {
      id: `${Date.now()}-${Math.random()}`,
      imageSrc,
    };

    setClasses((prev) =>
      prev.map((cls, idx) =>
        idx === classIndex ? { ...cls, samples: [...cls.samples, newSample] } : cls
      )
    );
    // Invalidate previous training when data changes
    setIsTrained(false);
    setIsPredicting(false);
  };

  // Delete a single bad thumbnail
  const handleDeleteSample = (classIndex: number, sampleId: string) => {
    const updated = classes.map((cls, idx) =>
      idx === classIndex
        ? { ...cls, samples: cls.samples.filter((s) => s.id !== sampleId) }
        : cls
    );
    setClasses(updated);
    setIsTrained(false);
    setIsPredicting(false);
  };

  // Clear all samples of a class
  const handleClearClass = (classIndex: number) => {
    const updated = classes.map((cls, idx) =>
      idx === classIndex ? { ...cls, samples: [] } : cls
    );
    setClasses(updated);
    setIsTrained(false);
    setIsPredicting(false);
  };

  // Explicit Train Model Action
  const handleTrainModel = async () => {
    const validClasses = classes.filter((c) => c.samples.length > 0);
    if (validClasses.length < 2) {
      alert('कृपया मॉडल को सिखाने से पहले कम से कम दो वर्गों में फोटो के नमूने जोड़ें!');
      return;
    }

    if (!mobilenetRef.current) return;

    setIsTrainingInProgress(true);
    setTrainingProgress(10);

    const newClassifier = knnClassifier.create();
    const totalSamples = classes.reduce((sum, c) => sum + c.samples.length, 0);
    let processed = 0;

    for (let cIdx = 0; cIdx < classes.length; cIdx++) {
      const cls = classes[cIdx];
      for (const sample of cls.samples) {
        const img = new Image();
        img.src = sample.imageSrc;
        await new Promise((res) => {
          img.onload = () => {
            tf.tidy(() => {
              const imageTensor = tf.browser.fromPixels(img);
              const logits = mobilenetRef.current!.infer(imageTensor, true);
              newClassifier.addExample(logits, cIdx);
            });
            processed++;
            setTrainingProgress(Math.round((processed / totalSamples) * 100));
            res(true);
          };
        });
      }
    }

    classifierRef.current = newClassifier;
    setIsTrainingInProgress(false);
    setIsTrained(true);
    speakHindi('मॉडल सफलतापूर्वक सीख चुका है! अब लाइव पहचान शुरू कर सकते हैं।');
  };

  // Start continuous capture while holding button
  const startCapturing = (classIndex: number) => {
    captureFrame(classIndex);
    setCapturingIdx(classIndex);
    if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
    captureIntervalRef.current = setInterval(() => {
      captureFrame(classIndex);
    }, 200);
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
        isTrained &&
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
  }, [isPredicting, isTrained, classes]);

  const handleStartPredicting = () => {
    if (!isTrained) {
      alert('कृपया पहले "मॉडल को सिखाएं (Train Model)" बटन दबाएं!');
      return;
    }
    setIsPredicting(true);
    speakHindi('मशीन अब लाइव पहचान कर रही है!');
  };

  const handleAddNewClass = () => {
    const newId = classes.length + 1;
    const colors = ['bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500'];
    const assignedColor = colors[newId % colors.length];
    setClasses([...classes, { id: newId, name: `वर्ग ${newId} 🏷️`, samples: [], color: assignedColor }]);
    setIsTrained(false);
    setIsPredicting(false);
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
            १. नमूने लें ➔ २. गलत फोटो हटाएं ➔ ३. <strong>मॉडल सिखाएं (Train)</strong> ➔ ४. लाइव पहचानें!
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAddNewClass}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            + नया वर्ग जोड़ें
          </button>

          {/* Explicit Train Model Button */}
          <button
            onClick={handleTrainModel}
            disabled={isLoading || isTrainingInProgress}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl shadow-md transition flex items-center gap-1.5 ${
              isTrained
                ? 'bg-emerald-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
            }`}
          >
            <span>⚡</span>
            {isTrainingInProgress
              ? `सिखा रहे हैं (${trainingProgress}%)...`
              : isTrained
              ? '✓ मॉडल प्रशिक्षित है (Re-Train)'
              : '२. मॉडल को सिखाएं (Train Model)'}
          </button>

          {/* Test / Predict Button */}
          {!isPredicting ? (
            <button
              onClick={handleStartPredicting}
              disabled={!isTrained}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl shadow-md transition ${
                isTrained
                  ? 'bg-green-600 hover:bg-green-700 active:scale-95 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🚀 ३. लाइव पहचानें
            </button>
          ) : (
            <button
              onClick={() => setIsPredicting(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs md:text-sm font-bold rounded-xl shadow-md transition"
            >
              ⏹️ पहचान रोकें
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="text-4xl animate-spin mb-3">⚙️</div>
          <p className="text-slate-600 font-bold text-sm">AI मॉडल लोड हो रहा है... कृपया प्रतीक्षा करें</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Webcam View & Realtime Prediction */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center sticky top-4">
              <div className="w-full rounded-xl overflow-hidden bg-black aspect-video relative border border-slate-300">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  mirrored={true}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status Note */}
              <div className="mt-3 text-xs text-center font-medium text-slate-500">
                {!isTrained
                  ? '⚠️ फोटो लेने के बाद "मॉडल को सिखाएं" बटन दबाएं'
                  : isPredicting
                  ? '🟢 लाइव पहचान सक्रिय है'
                  : '✅ मॉडल प्रशिक्षित है! "लाइव पहचानें" दबाएं'}
              </div>

              {/* Realtime Prediction Bar */}
              {isPredicting && topPrediction && (
                <div className="w-full mt-3 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
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

          {/* Right: Classes, Captures & Thumbnail Galleries */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-sm md:text-base">
                  📸 १. डेटा इकट्ठा करें (Capture & Clean)
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  कुल नमूने: {classes.reduce((sum, c) => sum + c.samples.length, 0)}
                </span>
              </div>

              <div className="space-y-6">
                {classes.map((cls, idx) => (
                  <div key={cls.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
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
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                          {cls.samples.length} फोटो
                        </span>
                        {cls.samples.length > 0 && (
                          <button
                            onClick={() => handleClearClass(idx)}
                            className="text-xs text-red-600 hover:text-red-800 font-semibold underline"
                          >
                            सभी हटाएं
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Capture Button */}
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
                      {capturingIdx === idx ? 'फोटो ले रहे हैं...' : 'फोटो लें (क्लिक करें या दबाए रखें)'}
                    </button>

                    {/* Captured Thumbnails Gallery */}
                    {cls.samples.length > 0 && (
                      <div className="mt-2 pt-3 border-t border-slate-200">
                        <div className="text-xs font-bold text-slate-500 mb-2">
                          संग्रहीत फोटो (गलत फोटो हटाने के लिए ❌ दबाएं):
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                          {cls.samples.map((sample) => (
                            <div
                              key={sample.id}
                              className="relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-300 shrink-0"
                            >
                              <img
                                src={sample.imageSrc}
                                alt="sample"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => handleDeleteSample(idx, sample.id)}
                                className="absolute inset-0 bg-red-600/80 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                title="यह फोटो हटाएं"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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