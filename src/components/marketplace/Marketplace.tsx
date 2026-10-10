import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Filter } from 'lucide-react';
import CreatorGrid from './CreatorGrid';

export const Marketplace: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#030014] text-white overflow-hidden relative">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/30 blur-[120px]" />
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16">
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-medium text-violet-100">AI Creator Ecosystem</span>
                    </div>
                    <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-fuchsia-300">
                        Discover Master Prompt Engineers
                    </h1>
                </motion.div>

                <div className="flex gap-4 max-w-3xl mx-auto mb-16">
                    <div className="relative flex-1 flex items-center bg-black/50 border border-white/10 rounded-xl px-4 py-3">
                        <Search className="w-5 h-5 text-slate-400 mr-3" />
                        <input type="text" placeholder="Search by tool or style..." className="bg-transparent outline-none text-white w-full" />
                    </div>
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                        <Filter className="w-5 h-5" /> Filters
                    </button>
                </div>

                <CreatorGrid />
            </main>
        </div>
    );
};

export default Marketplace;