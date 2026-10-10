import { useState, useEffect } from 'react';
import { matchingService } from '../services/matchingService';
import type { Creator } from '../types/marketplace';

export const useCreatorMatches = (briefId: string) => {
    const [matches, setMatches] = useState<Creator[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const analyzeMatches = async () => {
            setIsAnalyzing(true);
            try {
                const data = await matchingService.getRecommendedCreators(briefId);
                if (isMounted) setMatches(data);
            } catch (error) {
                console.error("Neural Match Engine Error:", error);
            } finally {
                if (isMounted) setIsAnalyzing(false);
            }
        };

        analyzeMatches();
        return () => { isMounted = false; };
    }, [briefId]);

    return { matches, isAnalyzing };
};