import React from 'react';
import { motion } from 'framer-motion';
import CreatorCard from './CreatorCard';

const MOCK_CREATORS = [
    { id: 1, name: "Nova Sterling", role: "Lead Generative Artist", tools: ["Midjourney v6", "Runway Gen-2"], matchScore: 98, imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Alex Vance", role: "Prompt Architect", tools: ["Stable Diffusion", "ControlNet"], matchScore: 95, imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Elena Rostova", role: "AI Concept Designer", tools: ["DALL-E 3", "ComfyUI"], matchScore: 91, imageUrl: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=800&auto=format&fit=crop" }
];

export const CreatorGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {MOCK_CREATORS.map((creator, index) => (
                <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: index * 0.15 }}
                >
                    <CreatorCard {...creator} />
                </motion.div>
            ))}
        </div>
    );
};

export default CreatorGrid;