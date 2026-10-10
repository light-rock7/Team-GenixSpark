export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
    id: string | number;
    briefId: string;
    creatorId: string;
    creatorName: string;
    role: string;
    matchScore: number;
    coverLetter: string;
    status: ApplicationStatus;
    submittedAt: string;
}