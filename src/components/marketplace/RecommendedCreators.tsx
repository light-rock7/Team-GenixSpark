import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import MatchScore from './MatchScore';

const RECOMMENDATIONS = [
    { id: 1, name: "Nova Sterling", role: "Cinematic AI Artist", score: 98, metrics: { tools: 100, style: 95, availability: 100 } },
    { id: 2, name: "Elena Rostova", role: "Concept Illustrator", score: 92, metrics: { tools: 90, style: 98, availability: 85 } }
];

export const RecommendedCreators: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {RECOMMENDATIONS.map((rec, index) => (
                <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-8 hover:border-violet-500/40 transition-colors group relative overflow-hidden shadow-2xl"
                >
                    {/* Subtle Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-emerald-600/0 group-hover:from-violet-600/10 group-hover:to-emerald-600/10 transition-colors duration-500 pointer-events-none" />

                    <MatchScore score={rec.score} />

                    <div className="flex-1 w-full relative z-10">
                        <h3 className="text-3xl font-black text-white mb-1">{rec.name}</h3>
                        <p className="text-violet-400 font-bold uppercase tracking-widest text-sm mb-6">{rec.role}</p>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Toolchain Mastery</span>
                                <span className="text-white font-bold">{rec.metrics.tools}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${rec.metrics.tools}%` }} /></div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Style Adherence</span>
                                <span className="text-white font-bold">{rec.metrics.style}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-fuchsia-500 h-1.5 rounded-full" style={{ width: `${rec.metrics.style}%` }} /></div>
                        </div>

                        <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Auto-Invite to Brief
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default RecommendedCreators;