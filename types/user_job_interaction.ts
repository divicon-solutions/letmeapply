export interface UserJobInteraction {
  interaction_id: number;
  user_id: number;
  job_id: number;
  interaction_type: string; // 'marked', 'applied', 'matched'
  status: string | null;
  score: number | null;
  resume_id: number;
  is_tailored: boolean;
  created_at: Date;
  updated_at: Date;
}
