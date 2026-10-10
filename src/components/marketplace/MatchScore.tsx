import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

export const MatchScore: React.FC<{ score: number; size?: number }> = ({ score, size = 120 }) => {
    const radius = (size - 20) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Track */}
            <svg className="absolute transform -rotate-90" width={size} height={size}>
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none"
                />
                {/* Animated Score Ring */}
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke="url(#gradient)" strokeWidth="8" fill="none" strokeLinecap="round"
                    initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Center Content */}
            <div className="absolute flex flex-col items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-violet-400 mb-1" />
                <span className="text-2xl font-black text-white leading-none">{score}<span className="text-sm">%</span></span>
            </div>
        </div>
    );
};

export default MatchScore;