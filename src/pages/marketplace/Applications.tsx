import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Check, X, Zap } from 'lucide-react';

const MOCK_APPS = [
    { id: 1, name: "Nova Sterling", score: 98, role: "Lead Generative Artist", text: "I have extensive experience generating cinematic sci-fi assets using Midjourney v6." },
    { id: 2, name: "Alex Vance", score: 85, role: "Prompt Architect", text: "I specialize in ControlNet for exact posing and structural consistency." }
];

export const Applications: React.FC = () => {
    const [apps, setApps] = useState(MOCK_APPS);

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
            <main className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8">
                    <div className="p-4 bg-violet-900/30 rounded-2xl border border-violet-500/20"><LayoutDashboard className="w-8 h-8 text-violet-400" /></div>
                    <div>
                        <h1 className="text-4xl font-black">Application Matrix</h1>
                        <p className="text-slate-400 mt-1">Reviewing candidates for "Cinematic Sci-Fi Trailer"</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <AnimatePresence>
                        {apps.map((app) => (
                            <motion.div key={app.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] flex flex-col md:flex-row gap-8 items-start md:items-center justify-between group hover:border-violet-500/50 transition-all shadow-xl">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <h3 className="text-3xl font-black text-white">{app.name}</h3>
                                        <span className="bg-emerald-900/40 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                                            <Zap className="w-3.5 h-3.5" /> {app.score}% Neural Match
                                        </span>
                                    </div>
                                    <p className="text-violet-400 text-sm font-bold uppercase tracking-widest mb-4">{app.role}</p>
                                    <p className="text-slate-300 text-lg bg-white/5 p-5 rounded-2xl border border-white/5 leading-relaxed">{app.text}</p>
                                </div>
                                <div className="flex w-full md:w-auto gap-4">
                                    <button onClick={() => setApps(apps.filter(a => a.id !== app.id))} className="flex-1 md:flex-none p-5 bg-red-950/30 text-red-500 hover:bg-red-900/50 hover:text-white border border-red-900/50 rounded-2xl transition-all flex items-center justify-center">
                                        <X className="w-6 h-6" />
                                    </button>
                                    <button onClick={() => setApps(apps.filter(a => a.id !== app.id))} className="flex-1 md:flex-none px-8 py-5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 rounded-2xl font-black transition-all flex items-center justify-center gap-3">
                                        <Check className="w-6 h-6" /> Accept
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default Applications;