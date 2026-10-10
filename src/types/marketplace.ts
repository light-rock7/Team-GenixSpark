export interface MatchMetrics {
    tools: number;
    style: number;
    availability: number;
}

export interface Creator {
    id: string | number;
    name: string;
    role: string;
    tools: string[];
    matchScore: number;
    imageUrl: string;
    metrics?: MatchMetrics;
}

export interface Brief {
    id: string;
    title: string;
    brandId: string;
    description: string;
    budget: { min: number; max: number };
    timelineDays: number;
    status: 'open' | 'in_progress' | 'completed';
}