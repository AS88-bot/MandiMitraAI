/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth, signInWithGoogle } from './lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { 
  Home, 
  Camera, 
  Mic, 
  TrendingUp, 
  BookOpen, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  Languages,
  Sprout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Sub-components (to be moved to separate files later for modularity)
import HomeView from './components/HomeView';
import AnalysisView from './components/AnalysisView';
import AssistantView from './components/AssistantView';
import MarketView from './components/MarketView';
import SchemesView from './components/SchemesView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Telugu' | 'Hindi'>('English');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sprout className="w-16 h-16 text-emerald-600" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md bg-white p-8 rounded-3xl shadow-xl border border-emerald-100"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sprout className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-2 font-sans tracking-tight">MandiMitra AI</h1>
          <p className="text-emerald-700 mb-8 font-sans">
            Your personal digital helper for farming and market insights.
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
          >
            <UserIcon className="w-5 h-5" />
            Continue with Google
          </button>
          <p className="mt-6 text-xs text-emerald-500">
            Secure login for Indian Farmers
          </p>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'analysis', icon: Camera, label: 'Scan Label' },
    { id: 'assistant', icon: Mic, label: 'Voice Help' },
    { id: 'market', icon: TrendingUp, label: 'Mandi Prices' },
    { id: 'schemes', icon: BookOpen, label: 'Schemes' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView language={language} onNavigate={setActiveTab} />;
      case 'analysis': return <AnalysisView language={language} />;
      case 'assistant': return <AssistantView language={language} />;
      case 'market': return <MarketView language={language} />;
      case 'schemes': return <SchemesView language={language} />;
      default: return <HomeView language={language} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans text-neutral-900">
      {/* Mobile Header */}
      <header className="md:hidden bg-emerald-700 text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-emerald-200" />
          <span className="font-bold text-lg">MandiMitra AI</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <nav className={`
        fixed inset-0 z-40 bg-white transform transition-transform duration-300 md:relative md:translate-x-0 md:w-64 md:flex md:flex-col md:shadow-lg
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-2 mb-8">
          <Sprout className="w-8 h-8 text-emerald-600" />
          <span className="font-bold text-xl text-emerald-900">MandiMitra AI</span>
        </div>

        <div className="flex-1 px-4 space-y-2 mt-20 md:mt-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 py-3 px-4 rounded-xl transition-all font-medium
                ${activeTab === item.id 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-neutral-500 hover:bg-neutral-100'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-neutral-100 flex flex-col gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-neutral-50 p-2 rounded-xl">
            <Languages className="w-4 h-4 text-emerald-600" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-sm font-medium focus:outline-none w-full cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <div className="flex items-center gap-3 px-4 py-2">
            {user.photoURL ? (
              <img src={user.photoURL} className="w-8 h-8 rounded-full shadow-sm" alt="User" />
            ) : (
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-emerald-600" />
              </div>
            )}
            <div className="flex-1 truncate">
              <p className="text-sm font-bold truncate">{user.displayName}</p>
              <button 
                onClick={handleLogout}
                className="text-xs text-emerald-600 flex items-center gap-1 hover:underline"
              >
                <LogOut className="w-3 h-3" /> Log out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-6 py-3 flex justify-between items-center z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-emerald-600' : 'text-neutral-400'}`}
          >
            <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

