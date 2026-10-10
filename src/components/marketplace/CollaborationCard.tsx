import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';

export const CollaborationCard: React.FC<{ title: string; partner: string; progress: number }> = ({ title, partner, progress }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-black/40 border border-white/10 p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden group shadow-lg cursor-pointer"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-violet-500" />

            <div className="flex justify-between items-start mb-6 pl-4">
                <div>
                    <h3 className="font-black text-xl text-white mb-1">{title}</h3>
                    <p className="text-slate-400 text-sm">with <span className="text-violet-400 font-bold">{partner}</span></p>
                </div>
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Activity className="w-5 h-5" />
                </div>
            </div>

            <div className="pl-4">
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-bold text-slate-300">Milestone Progress</span>
                    <span className="text-white font-black">{progress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" /> Next Review: 24 Hours
                </div>
            </div>
        </motion.div>
    );
};

export default CollaborationCard;