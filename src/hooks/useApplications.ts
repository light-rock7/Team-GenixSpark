import { useState, useEffect } from 'react';
import type { Application, ApplicationStatus } from '../types/application';
import { applicationService } from '../services/applicationService';

export const useApplications = (briefId?: string) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchApplications = async () => {
            setIsLoading(true);
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (isMounted) {
                setApplications([
                    { id: 1, briefId: 'brief-1', creatorId: 'c1', creatorName: "Nova Sterling", matchScore: 98, role: "Lead Generative Artist", coverLetter: "I have extensive experience generating cinematic sci-fi assets using Midjourney v6. Attached is my portfolio of similar concept art.", status: "pending", submittedAt: new Date().toISOString() },
                    { id: 2, briefId: 'brief-1', creatorId: 'c2', creatorName: "Alex Vance", matchScore: 85, role: "Prompt Architect", coverLetter: "I specialize in ControlNet for exact posing and structural consistency. I can deliver these assets in 10 days.", status: "pending", submittedAt: new Date().toISOString() }
                ]);
                setIsLoading(false);
            }
        };

        fetchApplications();
        return () => { isMounted = false; };
    }, [briefId]);

    const updateApplicationStatus = async (id: string | number, status: ApplicationStatus) => {
        // Optimistic UI update
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));

        // Fire off to the service in the background
        await applicationService.updateApplicationStatus(id, status);
    };

    return { applications, isLoading, updateApplicationStatus };
};