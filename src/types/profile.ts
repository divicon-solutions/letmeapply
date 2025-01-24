export interface ProfileData {
  personalInfo: {
    name: string;
    email: string;
    phoneNumber: string;
    location: string;
    linkedin: string;
    githubUrl: string;
  };
  summary: string;
  education: Array<{
    organization: string;
    accreditation: string;
    location: string;
    dates: {
      startDate: string;
      completionDate: string;
      isCurrent: boolean;
    };
    courses?: string[];
    achievements?: string[];
  }>;
  newEducation?: {
    organization?: string;
    accreditation?: string;
    location?: string;
    dates?: {
      startDate?: string;
      completionDate?: string;
      isCurrent?: boolean;
    };
    courses?: string[];
    achievements?: string[];
  };
  workExperience: Array<{
    organization: string;
    jobTitle: string;
    location: string;
    dates: {
      startDate: string;
      completionDate: string;
      isCurrent: boolean;
    };
    bulletPoints: string[];
    achievements?: string[];
  }>;
  newWorkExperience?: {
    organization?: string;
    jobTitle?: string;
    location?: string;
    dates?: {
      startDate?: string;
      completionDate?: string;
      isCurrent?: boolean;
    };
    bulletPoints?: string[];
    achievements?: string[];
  };
  skills: {
    [category: string]: string[];
  };
  newSkill?: {
    category?: string;
    skills?: string;
  };
  projects: Array<{
    projectName: string;
    organization: string;
    location: string;
    dates: {
      startDate: string;
      completionDate: string;
      isCurrent: boolean;
    };
    bulletPoints: string[];
  }>;
  newProject?: {
    projectName?: string;
    organization?: string;
    location?: string;
    dates?: {
      startDate?: string;
      completionDate?: string;
      isCurrent?: boolean;
    };
    bulletPoints?: string[];
  };
  certifications: Array<{
    name: string;
    description: string;
  }>;
  newCertification?: {
    name?: string;
    description?: string;
  };
  achievements: Array<{
    name: string;
    description: string;
  }>;
  newAchievement?: {
    name?: string;
    description?: string;
  };
  languages: Array<{
    name: string;
    description: string;
  }>;
  newLanguage?: {
    name?: string;
    description?: string;
  };
  publications: Array<{
    title: string;
    description: string;
    authors: string[];
  }>;
  newPublication?: {
    title?: string;
    description?: string;
    authors?: string[];
  };
}
