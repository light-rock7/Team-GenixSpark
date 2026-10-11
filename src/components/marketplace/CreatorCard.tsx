import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Zap } from 'lucide-react';

export const CreatorCard: React.FC<{ name: string, role: string, tools: string[], matchScore: number, imageUrl: string }> = ({ name, role, tools, matchScore, imageUrl }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className="relative w-full h-[450px] rounded-3xl bg-black border border-white/10 p-6 flex flex-col justify-end cursor-crosshair overflow-hidden group shadow-2xl"
        >
            <motion.div style={{ transform: "translateZ(30px)" }} className="absolute inset-0 z-0">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
            </motion.div>

            <motion.div style={{ transform: "translateZ(80px)" }} className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md">
                        <Zap className="w-3.5 h-3.5" /> {matchScore}% Synced
                    </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-1 group-hover:text-violet-300 transition-colors">{name}</h3>
                <p className="text-violet-400/80 text-sm font-semibold tracking-wide mb-5 uppercase">{role}</p>
                <div className="flex flex-wrap gap-2">
                    {tools.map(tool => (
                        <span key={tool} className="text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-300 backdrop-blur-md">
                            {tool}
                        </span>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CreatorCard;