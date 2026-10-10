import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
import SearchFilters from '../../components/marketplace/SearchFilters';
import CreatorGrid from '../../components/marketplace/CreatorGrid';

export const Marketplace: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-violet-500/30">
            {/* Dynamic Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-violet-900/20 blur-[150px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] rounded-full bg-fuchsia-900/10 blur-[150px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_0_30px_rgba(139,92,246,0.15)] mb-8">
                        <Hexagon className="w-4 h-4 text-violet-400 animate-[spin_4s_linear_infinite]" />
                        <span className="text-sm font-semibold tracking-widest text-violet-200 uppercase">Neural Network Active</span>
                    </div>
                    <h1 className="text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
                        Curate the <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-400 via-fuchsia-300 to-white">Future of Media</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Interface with elite prompt architects and generative artists. Real-time workflow transparency powered by deep matching algorithms.
                    </p>
                </motion.div>

                <SearchFilters />
                <CreatorGrid />
            </main>
        </div>
    );
};

export default Marketplace;