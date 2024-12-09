export interface ProfileData {
  personal_info: {
    name: string;
    email: string;
    phone_number: string;
    location: string;
    linkedin_url: string;
    github_url: string;
  };
  summary: string;
  education: Array<{
    school_name: string;
    degree: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
  }>;
  work_experience: Array<{
    job_title: string;
    company_name: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    bullet_points: string[];
  }>;
  skills: Array<{
    category: string;
    skills: string[];
  }>;
  projects: Array<{
    name: string;
    bulletPoints: string[];
    dates: {
      startDate: string;
      completionDate: string;
    };
    organization: string;
    location: string;
  }>;
  certifications: Array<{
    name: string;
    description: string;
  }>;
  achievements: Array<{
    name: string;
    description: string;
  }>;
  languages: Array<{
    name: string;
    description: string;
  }>;
  publications: Array<{
    title: string;
    description: string;
    authors: string[];
  }>;
}
