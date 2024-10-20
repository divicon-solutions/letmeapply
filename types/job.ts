export interface Job {
  job_id: number;
  title: string;
  job_type: string;
  location: string;
  description: string;
  company: string;
  company_logo: string;
  posted_at: Date;
  link: string;
  is_active: boolean;
  created_at: Date;
}
