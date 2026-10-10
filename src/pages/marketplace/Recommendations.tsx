import React from 'react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import RecommendedCreators from '../../components/marketplace/RecommendedCreators';

export const Recommendations: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-600/15 blur-[150px] rounded-full pointer-events-none" />

            <main className="max-w-6xl mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-bold mb-6">
                        <Network className="w-4 h-4 animate-pulse" /> Neural Matching Complete
                    </div>
                    <h1 className="text-5xl font-black mb-4">Curated Creator Matrix</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Our AI has analyzed 1,400+ portfolios. Here are the elite prompt engineers perfectly synced to your "Cinematic Sci-Fi" brief.
                    </p>
                </motion.div>

                <RecommendedCreators />
            </main>
        </div>
    );
};

export default Recommendations;