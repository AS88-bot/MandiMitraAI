import { motion } from 'motion/react';
import { Camera, Mic, TrendingUp, BookOpen, ChevronRight, Sprout, ShieldCheck, Sun } from 'lucide-react';

interface HomeViewProps {
  language: string;
  onNavigate: (tab: string) => void;
}

export default function HomeView({ language, onNavigate }: HomeViewProps) {
  const features = [
    { 
      id: 'analysis', 
      title: 'Scan Labels', 
      desc: 'Understand pesticide and fertilizer instructions instantly.', 
      icon: Camera, 
      color: 'bg-blue-500' 
    },
    { 
      id: 'assistant', 
      title: 'Voice Help', 
      desc: 'Ask anything about farming in your language.', 
      icon: Mic, 
      color: 'bg-purple-500' 
    },
    { 
      id: 'market', 
      title: 'Market Prices', 
      desc: 'Latest mandi rates and profit analysis.', 
      icon: TrendingUp, 
      color: 'bg-orange-500' 
    },
    { 
      id: 'schemes', 
      title: 'Govt Schemes', 
      desc: 'Discover benefits and subsidies for your crops.', 
      icon: BookOpen, 
      color: 'bg-emerald-500' 
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            Namaste Farmer Mitra! <Sun className="text-orange-400 w-8 h-8" />
          </h2>
          <p className="text-neutral-500 mt-2">Checking MandiMitra AI for {new Date().toLocaleDateString()} updates.</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-2xl border border-emerald-100 shadow-sm">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-semibold text-sm">Real-time AI Active</span>
        </div>
      </section>

      {/* Hero Banner (Mocked Illustration with text) */}
      <section className="relative h-48 md:h-64 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 shadow-xl group">
        <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/5" />
        <div className="relative h-full flex flex-col justify-center p-8 md:p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">Grow More. <br /> Earn Better.</h3>
            <p className="text-emerald-100 max-w-sm text-sm md:text-base">MandiMitra AI uses Google Gemini to simplify farming for everyone.</p>
          </motion.div>
          <div className="absolute top-1/2 -right-8 -translate-y-1/2 opacity-20 hidden md:block">
            <Sprout size={240} />
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section>
        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
          What would you like to do?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.button
              key={feature.id}
              onClick={() => onNavigate(feature.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all text-left flex flex-col h-full"
            >
              <div className={`${feature.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-lg text-neutral-900 mb-2">{feature.title}</h5>
              <p className="text-sm text-neutral-500 flex-1 leading-relaxed">{feature.desc}</p>
              <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                Open Utility <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Recent Activity Mockup */}
      <section className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
        <h4 className="text-lg font-bold mb-6">Latest Updates</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Tomato prices are up by 15%</p>
              <p className="text-xs text-neutral-500">Checking mandi rates in Kurnool vs Guntur</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl opacity-60">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Scanning History</p>
              <p className="text-xs text-neutral-500">Viewed Urea label analysis yesterday</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
