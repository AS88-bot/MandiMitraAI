import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, Bot, User, Loader2, Volume2, Globe, Sparkles, MessageCircle } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AssistantViewProps {
  language: string;
}

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function AssistantView({ language }: AssistantViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      parts: [
        { text: `Namaste! I am MandiMitra AI. 👨‍🌾 How can I help you today? You can ask about crops, weather, or mandi prices.` }
      ] 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { 
      role: 'user', 
      parts: [{ text: input }] 
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: currentInput, 
          language,
          history: messages 
        }),
      });
      const data = await res.json();
      
      const modelMessage: Message = { 
        role: 'model', 
        parts: [{ text: data.text }] 
      };
      setMessages(prev => [...prev, modelMessage]);

      if (auth.currentUser) {
        await addDoc(collection(db, 'farmer_queries'), {
          userId: auth.currentUser.uid,
          query: currentInput,
          response: data.text,
          type: 'text',
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Maaf kijiye, I encountered an error. Please try again.' }] }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceCapture = () => {
    setIsRecording(true);
    // Simulate voice capture for demo since Web Speech API might be limited in iframe
    setTimeout(() => {
      setIsRecording(false);
      setInput("Today's tomato price in Guntur?");
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-neutral-100 bg-emerald-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold">Agricultural Assistant</h4>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-100 font-medium tracking-wide uppercase">AI Mitra Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-700/50 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <Globe className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase">{language}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-emerald-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-3xl leading-relaxed text-sm shadow-sm ${msg.role === 'user' ? 'bg-emerald-50 text-emerald-900 rounded-tr-none border border-emerald-100' : 'bg-neutral-50 text-neutral-800 rounded-tl-none border border-neutral-100'}`}>
                {msg.parts[0].text}
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="bg-neutral-50 p-4 rounded-3xl rounded-tl-none border border-neutral-100">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
        <form onSubmit={sendMessage} className="flex items-center gap-3 bg-white p-2 pl-4 rounded-2xl border border-neutral-200 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
          <input 
            type="text" 
            placeholder="Ask MandiMitra anything..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="button" 
            onClick={startVoiceCapture}
            className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-neutral-100 text-neutral-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className={`p-3 rounded-xl transition-all ${!input.trim() || loading ? 'bg-neutral-100 text-neutral-300' : 'bg-emerald-600 text-white shadow-lg active:scale-95'}`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-center text-neutral-400 mt-4 uppercase tracking-[0.2em] font-bold">
           AI Advisor • Multilingual Support 
        </p>
      </div>
    </div>
  );
}
