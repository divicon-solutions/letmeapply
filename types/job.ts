export interface Job {
  job_id: string;
  external_job_id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  posted_at: string;
  desc: string;
  company_logo?: string;
  platform_name: string;
}
