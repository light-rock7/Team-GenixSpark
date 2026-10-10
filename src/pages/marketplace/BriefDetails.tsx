import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Wallet, Orbit } from 'lucide-react';
import ApplicationForm from '../../components/marketplace/ApplicationForm';

export const BriefDetails: React.FC = () => {
    const [isApplying, setIsApplying] = useState(false);

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 relative">
            <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none" />

            <main className="max-w-4xl mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden">
                    {/* Internal Glow */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-6">
                        <Target className="w-4 h-4" /> Actively Seeking Creators
                    </div>
                    <h1 className="text-5xl font-black mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Cinematic Sci-Fi Trailer Assets</h1>
                    <p className="text-slate-400 text-xl leading-relaxed mb-12">Nova Labs Agency is seeking a Midjourney v6 architect to generate 50 high-resolution cinematic concept frames for an upcoming AAA indie game pitch. Output must follow strict node-based lighting constraints.</p>

                    <div className="grid grid-cols-2 gap-6 mb-12">
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-colors group">
                            <div className="p-4 bg-violet-500/10 w-fit rounded-2xl text-violet-400 mb-4 group-hover:scale-110 transition-transform"><Wallet className="w-8 h-8" /></div>
                            <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Budget Allocation</p>
                            <p className="text-3xl font-black text-white">$2,500 - $4,000</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-colors group">
                            <div className="p-4 bg-fuchsia-500/10 w-fit rounded-2xl text-fuchsia-400 mb-4 group-hover:scale-110 transition-transform"><Clock className="w-8 h-8" /></div>
                            <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Production Timeline</p>
                            <p className="text-3xl font-black text-white">14 Days</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsApplying(true)}
                        className="w-full py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-2xl font-black text-xl shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] transition-all flex justify-center items-center gap-3"
                    >
                        <Orbit className="w-6 h-6 animate-[spin_6s_linear_infinite]" /> Initiate Application Sync
                    </button>
                </motion.div>
            </main>
            {isApplying && <ApplicationForm onClose={() => setIsApplying(false)} />}
        </div>
    );
};

export default BriefDetails;