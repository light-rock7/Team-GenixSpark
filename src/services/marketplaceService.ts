import type { Brief } from '../types/marketplace';

export const marketplaceService = {
    async getActiveBriefs(): Promise<Brief[]> {
        // Simulating database latency for the hackathon presentation
        await new Promise(resolve => setTimeout(resolve, 800));

        return [
            {
                id: 'brief-1',
                title: 'Cinematic Sci-Fi Trailer Assets',
                brandId: 'brand-nova-labs',
                description: 'Seeking a Midjourney v6 expert to generate 50 high-resolution cinematic concept frames for an upcoming AAA indie game pitch.',
                budget: { min: 2500, max: 4000 },
                timelineDays: 14,
                status: 'open'
            }
        ];
    }
};