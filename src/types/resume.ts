export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phoneNumber: string;
    location?: string;
    linkedin?: string;
    githubUrl?: string;
  };
  summary?: string;
  education?: Array<{
    organization: string;
    accreditation: string;
    location: string;
    dates: {
      startDate: string;
      completionDate?: string;
      isCurrent: boolean;
    };
    courses?: string[];
    achievements?: string[];
  }>;
  workExperience?: Array<{
    jobTitle: string;
    organization: string;
    location?: string;
    dates: {
      startDate: string;
      completionDate?: string;
      isCurrent: boolean;
    };
    bulletPoints?: string[];
    achievements?: string[];
  }>;
  skills?: Record<string, string[]>;
  projects?: Array<{
    projectName: string;
    bulletPoints?: string[];
    dates?: {
      startDate: string;
      completionDate?: string;
      isCurrent: boolean;
    };
    organization?: string;
    location?: string;
  }>;
  certifications?: Array<{
    name: string;
    description: string;
  }>;
  achievements?: Array<{
    name: string;
    description: string;
  }>;
  languages?: Array<{
    name: string;
    description: string;
  }>;
  publications?: Array<{
    title: string;
    description: string;
    authors: string[];
  }>;
}
