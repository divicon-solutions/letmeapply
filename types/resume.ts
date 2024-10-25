export interface Resume {
  resume_id: number;
  user_id: number;
  label: string;
  file_name: string;
  file_path: string;
  file_size: number;
  created_at: Date;
  updated_at: Date;
  is_default: boolean;
}
