import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Command, SlidersHorizontal } from 'lucide-react';

const FILTERS = ["All Neural Styles", "Midjourney v6", "Sora Video", "Stable Diffusion XL", "Audio Synthesis", "ControlNet Posing"];

export const SearchFilters: React.FC = () => {
    const [active, setActive] = useState("All Neural Styles");

    return (
        <div className="w-full max-w-5xl mx-auto mb-20 space-y-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="relative group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center bg-[#0a0a0a]/90 border border-white/10 rounded-2xl px-6 py-5 backdrop-blur-3xl shadow-2xl">
                    <Search className="w-6 h-6 text-violet-500 mr-4" />
                    <input
                        type="text"
                        placeholder="Search by cinematic style, node workflow, or AI toolchain..."
                        className="bg-transparent border-none outline-none text-white text-lg w-full placeholder-slate-600 font-medium"
                    />
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 mr-4">
                        <Command className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-400">K</span>
                    </div>
                    <button className="p-3 bg-violet-500/10 hover:bg-violet-500/20 rounded-xl transition-colors border border-violet-500/20 text-violet-400">
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-3">
                {FILTERS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActive(filter)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 border ${active === filter
                                ? "bg-violet-500/20 border-violet-400/50 text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-105"
                                : "bg-transparent border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </motion.div>
        </div>
    );
};

export default SearchFilters;