import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Link as LinkIcon } from 'lucide-react';

export const ApplicationForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => { setIsSubmitting(false); onClose(); }, 2000);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

                    <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white hover:rotate-90 transition-all">
                        <X className="w-7 h-7" />
                    </button>

                    <h2 className="text-4xl font-black text-white mb-2">Transmit Proposal</h2>
                    <p className="text-slate-400 mb-10 text-lg">Your GenixSpark telemetry and portfolio will be automatically encrypted and attached.</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-3">Neural Match Justification</label>
                            <textarea
                                required rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-lg resize-none"
                                placeholder="Detail your exact node-workflow and synthesis approach..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest font-bold text-slate-400 mb-3">Reference Checkpoint (URL)</label>
                            <div className="flex bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus-within:border-violet-500 transition-all">
                                <LinkIcon className="w-6 h-6 text-slate-500 mr-4" />
                                <input type="url" placeholder="https://..." className="bg-transparent border-none outline-none text-white w-full text-lg" />
                            </div>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-white text-black hover:bg-slate-200 rounded-2xl font-black text-xl transition-colors flex justify-center items-center gap-3">
                            {isSubmitting ? <Cpu className="w-6 h-6 animate-pulse" /> : "Initiate Transfer"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ApplicationForm;