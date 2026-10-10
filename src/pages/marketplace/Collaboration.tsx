import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, UploadCloud, Hexagon } from 'lucide-react';

export const Collaboration: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
            <main className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a] border border-white/10 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="flex justify-between items-start mb-16 relative z-10">
                        <div>
                            <h1 className="text-4xl font-black mb-3">Cinematic Sci-Fi Trailer Assets</h1>
                            <p className="text-slate-400 text-lg">Synchronized with <span className="text-violet-400 font-bold">Nova Sterling</span></p>
                        </div>
                        <div className="px-5 py-2.5 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-2.5 font-bold shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            <Activity className="w-4 h-4 animate-pulse" /> Active Pipeline
                        </div>
                    </div>

                    <div className="relative border-l-2 border-white/10 ml-6 space-y-12 pb-6 z-10">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative pl-12">
                            <div className="absolute -left-[17px] top-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                                <CheckCircle2 className="w-5 h-5 text-black" />
                            </div>
                            <h3 className="font-black text-2xl text-white mb-1">Contract Established</h3>
                            <p className="text-slate-400">Smart contract signed. Escrow funded.</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative pl-12">
                            <div className="absolute -left-[17px] top-1 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.6)] animate-pulse">
                                <Hexagon className="w-4 h-4 text-white animate-spin" />
                            </div>
                            <h3 className="font-black text-2xl text-white mb-2">Synthesis Phase</h3>
                            <p className="text-slate-400 mb-6">Creator is routing prompts through Midjourney v6.</p>
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/20 rounded-xl"><UploadCloud className="w-6 h-6 text-blue-400" /></div>
                                    <span className="font-bold text-white">12 Checkpoints Uploaded</span>
                                </div>
                                <button className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors">Inspect</button>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="relative pl-12">
                            <div className="absolute -left-[17px] top-1 w-8 h-8 bg-[#050505] border-2 border-slate-700 rounded-full" />
                            <h3 className="font-black text-2xl text-slate-600 mb-1">Final Rendering</h3>
                            <p className="text-slate-700">Awaiting checkpoint approval.</p>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Collaboration;