export interface ProfileData {
  personalInfo: {
    name: string;
    email: string;
    phoneNumber: string;
    location: string | null;
    linkedin: string;
    githubUrl: string;
  };
  summary: string;
  education: Array<{
    organization: string;
    accreditation: string;
    location: string;
    dates: {
      startDate: string; // YYYY-MM format
      completionDate: string; // YYYY-MM format
      isCurrent: boolean;
    };
    courses?: string[];
    achievements: string[];
  }>;
  workExperience: Array<{
    jobTitle: string;
    organization: string;
    location: string | null;
    dates: {
      startDate: string; // YYYY-MM format
      completionDate: string; // YYYY-MM format
      isCurrent: boolean;
    };
    bulletPoints: string[];
    achievements: string[];
  }>;
  skills: Record<string, string[]>;
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
  newEducation: {
    organization: string;
    accreditation: string;
    location?: string; // Optional if needed
    dates?: {
      startDate?: string; // Optional if needed
      completionDate?: string; // Optional if needed
      isCurrent?: boolean; // Optional if needed
    };
    courses?: Array<string>; // Optional if needed
    achievements?: Array<string>; // Optional if needed
  };
  newWorkExperience: {
    jobTitle: string;
    organization: string;
    location?: string; // Optional if needed
    dates?: {
      startDate?: string; // Optional if needed
      completionDate?: string; // Optional if needed
      isCurrent?: boolean; // Optional if needed
    };
    bulletPoints?: Array<string>; // Optional if needed
    achievements?: Array<string>; // Optional if needed
  };
  newSkill: {
    category: string;
    skills: string;
  };
  newProject: {
    name: string;
    bulletPoints: string;
    dates: {
      startDate: string;
      completionDate: string;
      isCurrent: boolean;
    };
    organization: string;
    location: string;
  };
}
