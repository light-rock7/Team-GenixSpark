import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, X } from 'lucide-react';

interface ApplicationCardProps {
    application: { id: number; creatorName: string; matchScore: number; role: string; coverLetter: string; status: string; };
    onAccept: () => void;
    onReject: () => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onAccept, onReject }) => {
    // Hide the card with an animation if it is no longer pending
    if (application.status !== 'pending') {
        return (
            <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0, height: 0 }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden" />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group hover:border-violet-500/30 transition-colors shadow-lg"
        >
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">{application.creatorName}</h3>
                    <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {application.matchScore}% Match
                    </span>
                </div>
                <p className="text-violet-400 text-sm font-medium mb-3 uppercase tracking-wider">{application.role}</p>
                <p className="text-slate-300 text-sm bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed">{application.coverLetter}</p>
            </div>

            <div className="flex w-full md:w-auto gap-3">
                <button
                    onClick={onReject}
                    className="flex-1 md:flex-none px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-xl font-bold transition flex items-center justify-center gap-2"
                >
                    <X className="w-5 h-5" /> Reject
                </button>
                <button
                    onClick={onAccept}
                    className="flex-1 md:flex-none px-6 py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                    <Check className="w-5 h-5" /> Accept
                </button>
            </div>
        </motion.div>
    );
};

export default ApplicationCard;