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
    projectName?: string;
    bulletPoints: string[];
    dates: {
      startDate: string;
      completionDate: string;
      isCurrent: boolean;
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
    location?: string;
    dates?: {
      startDate?: string;
      completionDate?: string;
      isCurrent?: boolean;
    };
    courses?: Array<string>;
    achievements?: Array<string>;
  };
  newWorkExperience: {
    jobTitle: string;
    organization: string;
    location?: string;
    dates?: {
      startDate?: string;
      completionDate?: string;
      isCurrent?: boolean;
    };
    bulletPoints?: Array<string>;
    achievements?: Array<string>;
  };
  newSkill: {
    category: string;
    skills: string;
  };
  newProject: {
    name: string;
    projectName?: string;
    bulletPoints: string | string[];
    dates: {
      startDate: string;
      completionDate: string;
      isCurrent: boolean;
    };
    organization: string;
    location: string;
  };
  newCertification?: {
    name: string;
    description: string;
  };
  newAchievement?: {
    name: string;
    description: string;
  };
  newLanguage?: {
    name: string;
    description: string;
  };
  newPublication?: {
    title: string;
    description: string;
    authors: string | string[];
  };
}
