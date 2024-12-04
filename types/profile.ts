export interface ProfileData {
  pii: {
    full_name: string;
    email: string;
    phone: string;
  };
  education: Array<{
    organization: string;
    degree: string;
    major: string | null;
    start_date: string | null;
    end_date: string;
    achievements: string[];
  }>;
  work_experience: Array<{
    job_title: string;
    company_name: string;
    location: string;
    start_date: string;
    end_date: string;
    bullet_points: string[];
  }>;
  skills: {
    'Programming Languages': string[];
    Tools: string[];
    Other: string[];
  };
}
