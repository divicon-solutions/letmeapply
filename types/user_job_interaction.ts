export interface UserJobInteraction {
  interaction_id: string;
  user_id: string;
  job_id: string;
  external_job_id: string;
  status: "clicked" | "applied" | "under_consideration";
  created_at: string;
  updated_at: string;
  notes?: string;
}
