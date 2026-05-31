import { motion } from 'motion/react';
import { BookOpen, ExternalLink, Leaf, Landmark, CloudRain, PiggyBank, Info } from 'lucide-react';

interface SchemesViewProps {
  language: string;
}

export default function SchemesView({ language }: SchemesViewProps) {
  const schemes = [
    {
      title: "PM-Kisan Samman Nidhi",
      desc: "₹6,000 per year in three equal installments to small and marginal farmer families.",
      icon: PiggyBank,
      color: "bg-emerald-100 text-emerald-600",
      benefit: "Income Support",
      link: "https://pmkisan.gov.in/"
    },
    {
      title: "Pradhan Mantri Fasal Bima Yojana",
      desc: "Low-premium crop insurance against natural calamities and pests.",
      icon: CloudRain,
      color: "bg-blue-100 text-blue-600",
      benefit: "Insurance",
      link: "https://pmfby.gov.in/"
    },
    {
      title: "Soil Health Card Scheme",
      desc: "Get your soil tested and receive recommendations for fertilizers.",
      icon: Leaf,
      color: "bg-orange-100 text-orange-600",
      benefit: "Soil Analysis",
      link: "https://soilhealth.dac.gov.in/"
    },
    {
      title: "Kisan Credit Card (KCC)",
      desc: "Timely credit for cultivation and other needs at reasonable interest rates.",
      icon: Landmark,
      color: "bg-purple-100 text-purple-600",
      benefit: "Credit/Loan",
      link: "https://www.myscheme.gov.in/schemes/kcc"
    },
    {
      title: "Pradhan Mantri Krishi Sinchayee Yojana",
      desc: "Focuses on 'More Crop Per Drop' through efficient irrigation systems.",
      icon: CloudRain,
      color: "bg-teal-100 text-teal-600",
      benefit: "Irrigation",
      link: "https://pmksy.gov.in/"
    },
    {
      title: "Electronic National Agriculture Market (e-NAM)",
      desc: "A pan-India electronic trading portal for agricultural commodities.",
      icon: BookOpen,
      color: "bg-rose-100 text-rose-600",
      benefit: "E-Trading",
      link: "https://www.enam.gov.in/"
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      <section>
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Government Schemes</h2>
        <p className="text-neutral-500 mt-2">Simplified information about farming benefits and subsidies.</p>
      </section>

      <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
           <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Info className="w-8 h-8" />
           </div>
           <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Need help with eligibility?</h3>
              <p className="text-blue-100 text-sm max-w-xl">Ask our Voice Assistant "Am I eligible for PM-Kisan?" to get personalized advice based on your land holding information.</p>
           </div>
           <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-neutral-50 transition-colors">
              Ask AI Now
           </button>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
           <Landmark size={120} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme, i) => (
          <motion.div
            key={scheme.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`${scheme.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                <scheme.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-neutral-50 text-neutral-500 px-3 py-1 rounded-full border border-neutral-100">
                {scheme.benefit}
              </span>
            </div>
            <h4 className="font-bold text-lg text-neutral-900 mb-3">{scheme.title}</h4>
            <p className="text-sm text-neutral-500 leading-relaxed flex-1">{scheme.desc}</p>
            
            <a 
              href={scheme.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group"
            >
              Learn More at Official Website
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </motion.div>
        ))}
      </div>

      <div className="p-8 bg-neutral-900 rounded-3xl text-white">
        <h4 className="font-bold text-lg mb-4">Important Documents for Schemes</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Aadhar Card', 'Bank Account', 'Land Record', 'Pattadar Passbook'].map(doc => (
            <div key={doc} className="p-4 bg-neutral-800 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-sm font-medium">{doc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
