export type BriefStatus = 'draft' | 'open' | 'closed' | 'awarded';

export interface CreativeBrief {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  category: string | null;
  required_tools: string[];
  required_skills: string[];
  deliverables: string | null;
  aspect_ratio: string | null;
  usage_rights: string | null;
  budget_min: number | null;
  budget_max: number | null;
  currency: string;
  deadline: string | null;
  reference_notes: string | null;
  status: BriefStatus;
  created_at: string;
  updated_at: string;
}

export interface CreativeBriefCreate {
  title: string;
  description: string;
  category: string | null;
  required_tools: string[];
  required_skills: string[];
  deliverables: string | null;
  aspect_ratio: string | null;
  usage_rights: string | null;
  budget_min: number | null;
  budget_max: number | null;
  currency: string;
  deadline: string | null;
  reference_notes: string | null;
  status: 'draft' | 'open';
}

export interface BriefReadiness {
  percent: number;
  completed: number;
  total: number;
  missing: string[];
}
