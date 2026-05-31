import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Loader2, CheckCircle, AlertCircle, FileText, Languages, ChevronRight, Save } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AnalysisViewProps {
  language: string;
}

export default function AnalysisView({ language }: AnalysisViewProps) {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeLabel = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/analyze-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, language }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);

      // Save to Firebase
      if (auth.currentUser) {
        await addDoc(collection(db, 'upload_results'), {
          userId: auth.currentUser.uid,
          imageUrl: '', // In a real app, upload to storage first
          extractedText: data.productName + ' ' + data.ingredients,
          summary: data.usageInstructions,
          translation: data.explanation,
          language: language,
          productName: data.productName,
          usageInstructions: data.usageInstructions,
          safetyWarnings: data.safetyWarnings,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze label. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <section>
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Scan Label</h2>
        <p className="text-neutral-500 mt-2">Upload fertilizer or pesticide labels for a simple explanation.</p>
      </section>

      {/* Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative h-80 rounded-3xl border-2 border-dashed border-neutral-200 bg-white flex flex-col items-center justify-center p-8 cursor-pointer transition-all hover:border-emerald-500 overflow-hidden
              ${image ? 'border-emerald-500 bg-emerald-50/10' : ''}
            `}
          >
            {image ? (
              <img src={image} className="absolute inset-0 w-full h-full object-contain p-4" alt="Uploaded label" />
            ) : (
              <div className="text-center group">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-neutral-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                  <Camera className="w-8 h-8" />
                </div>
                <p className="font-bold text-neutral-800">Tap to upload or take a photo</p>
                <p className="text-sm text-neutral-400 mt-1">Supports JPG, PNG (Max 5MB)</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              capture="environment"
              onChange={handleFileChange} 
            />
          </div>

          <button
            disabled={!image || analyzing}
            onClick={analyzeLabel}
            className={`
              w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95
              ${(!image || analyzing) 
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'}
            `}
          >
            {analyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <FileText className="w-6 h-6" />
                Explain this Label
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden"
              >
                <div className="bg-emerald-600 p-6 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-emerald-200" />
                    <span className="text-xs uppercase font-bold tracking-widest text-emerald-100">AI Analysis Ready</span>
                  </div>
                  <h3 className="text-2xl font-bold">{result.productName}</h3>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       Ingredients & Composition
                    </h4>
                    <p className="text-neutral-700 bg-neutral-50 p-4 rounded-2xl leading-relaxed">{result.ingredients}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       Simple Explanation ({language})
                    </h4>
                    <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-900 border border-emerald-100 leading-relaxed font-medium">
                      {result.explanation}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-50">
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Usage</p>
                        <p className="text-sm font-bold text-neutral-700">{result.usageInstructions}</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Safety Warning</p>
                        <p className="text-sm font-bold text-rose-700">{result.safetyWarnings}</p>
                     </div>
                  </div>
                </div>
              </motion.div>
            ) : !analyzing && (
              <div className="bg-neutral-100/50 border-2 border-dashed border-neutral-200 rounded-3xl p-12 text-center text-neutral-400">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-bold text-lg">Results will appear here</p>
                <p className="text-sm max-w-xs mx-auto mt-2">MandiMitra AI will translate complex instructions into easy-to-read farming tips.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
