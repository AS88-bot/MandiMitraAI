import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, Info, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { MarketPrice } from '../types';

interface MarketViewProps {
  language: string;
}

export default function MarketView({ language }: MarketViewProps) {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [cropSearch, setCropSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<MarketPrice | null>(null);

  useEffect(() => {
    fetch('/api/market-prices')
      .then(res => res.json())
      .then(data => {
        setPrices(data);
        setLoading(false);
      });
  }, []);

  const filteredPrices = prices.filter(p => 
    p.crop.toLowerCase().includes(cropSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <section>
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Market Prices</h2>
        <p className="text-neutral-500 mt-2">Latest mandi rates and AI risk detector.</p>
      </section>

      {/* Search and Filters */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search crop name (e.g. Tomato, Paddy)..."
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-neutral-100 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
          value={cropSearch}
          onChange={(e) => setCropSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Price List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-50 flex items-center justify-between">
              <h4 className="font-bold">Nearby Mandis</h4>
              <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Live Updates</span>
            </div>
            
            {loading ? (
              <div className="p-10 space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-neutral-50 rounded-2xl animate-pulse" />)}
              </div>
            ) : filteredPrices.length > 0 ? (
              <div className="divide-y divide-neutral-50">
                {filteredPrices.map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => setSelectedCrop(p)}
                    className={`w-full group p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left ${selectedCrop?.id === p.id ? 'bg-emerald-50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                        {p.crop[0]}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{p.crop}</p>
                        <p className="text-sm text-neutral-500">{p.mandi} Mandi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold flex items-center justify-end gap-2 text-neutral-900">
                        ₹{p.price.toLocaleString()}
                        {p.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                        {p.trend === 'down' && <TrendingDown className="w-4 h-4 text-rose-500" />}
                        {p.trend === 'stable' && <Minus className="w-4 h-4 text-neutral-300" />}
                      </p>
                      <p className="text-xs text-neutral-400 uppercase font-bold tracking-widest">per {p.unit}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-neutral-400">
                No prices found for "{cropSearch}"
              </div>
            )}
          </div>
        </div>

        {/* Middleman Risk Detector / Side Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedCrop ? (
              <motion.div
                key={selectedCrop.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xl">Risk Analysis</h4>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-neutral-50 rounded-2xl">
                    <p className="text-xs text-neutral-500 font-bold uppercase mb-2">Fair Market Rate</p>
                    <p className="text-3xl font-bold text-emerald-700">₹{selectedCrop.referencePrice.toLocaleString()}</p>
                    <p className="text-sm text-neutral-500 mt-1">Estimated average in nearby regions.</p>
                  </div>

                  <div className={`p-6 rounded-2xl border ${selectedCrop.price >= selectedCrop.referencePrice ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                       {selectedCrop.price >= selectedCrop.referencePrice ? (
                         <CheckCircle className="w-5 h-5 text-emerald-600" />
                       ) : (
                         <AlertTriangle className="w-5 h-5 text-orange-600" />
                       )}
                       <p className={`font-bold ${selectedCrop.price >= selectedCrop.referencePrice ? 'text-emerald-700' : 'text-orange-700'}`}>
                         {selectedCrop.price >= selectedCrop.referencePrice ? 'Profitable Offer' : 'Low Offer Risk'}
                       </p>
                    </div>
                    <p className="text-sm leading-relaxed">
                      {selectedCrop.price >= selectedCrop.referencePrice 
                        ? 'The current mandi price is above or equal to the fair price. Highly recommended to sell here.'
                        : 'Wait! The offer is lower than the reference price. Try negotiating or waiting for prices to stabilize.'}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-1" />
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                      AI Tip: Tomato prices frequently rise in {selectedCrop.mandi} on Tuesday mornings.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl flex flex-col items-center text-center">
                <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
                <h4 className="font-bold text-xl mb-2">Analysis Tool</h4>
                <p className="text-emerald-100 text-sm">Select a crop from the list to see detailed AI price analysis and risk detection.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
