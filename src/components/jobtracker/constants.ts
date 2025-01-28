export const statusOptions = [
  'APPLIED',
  'INTERVIEWING',
  'OFFER_RECEIVED',
  'REJECTED',
  'ARCHIVED',
] as const;

export type JobStatus = typeof statusOptions[number];

export interface JobData {
  id: number;
  extraction_id: number;
  status: JobStatus;
  is_favorite: boolean;
  notes: string;
  clerk_id: string;
  created_at: string;
  updated_at: string;
  extraction: {
    id: number;
    job_title: string;
    job_description: string;
    company: string;
    location: string;
    page_url: string;
    created_at: string;
  };
}

export const statusColorMap = {
  APPLIED: 'bg-gray-100 text-gray-800',
  INTERVIEWING: 'bg-blue-100 text-blue-800',
  OFFER_RECEIVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
} as const;

export const locationColorMap = {
  'Remote': 'bg-gray-600 text-white',
  'Hybrid': 'bg-pink-500 text-white',
  'On-site': 'bg-blue-500 text-white',
} as const;

export const tabStatusColorMap = {
  APPLIED: {
    active: 'bg-gray-100 text-gray-800 border-gray-200',
    inactive: 'hover:bg-gray-50',
  },
  INTERVIEWING: {
    active: 'bg-blue-50 text-blue-700 border-blue-200',
    inactive: 'hover:bg-blue-50',
  },
  OFFER_RECEIVED: {
    active: 'bg-green-50 text-green-700 border-green-200',
    inactive: 'hover:bg-green-50',
  },
  REJECTED: {
    active: 'bg-red-50 text-red-700 border-red-200',
    inactive: 'hover:bg-red-50',
  },
  ARCHIVED: {
    active: 'bg-gray-100 text-gray-800 border-gray-200',
    inactive: 'hover:bg-gray-50',
  },
} as const; 