import { UserJobInteraction } from "@/types/user_job_interaction";
import { Job } from "@/types/job";

interface JobWithInteraction extends UserJobInteraction {
  jobs: Job;
}

export const fetchJobInteractions = async (
  status: string
): Promise<JobWithInteraction[]> => {
  const response = await fetch(`/api/job-interaction?status=${status}`);
  if (!response.ok) {
    throw new Error("Failed to fetch job interactions");
  }
  return response.json();
};

export const updateJobInteraction = async (
  interactionId: string,
  status: "applied" | "under_consideration"
): Promise<JobWithInteraction> => {
  const response = await fetch("/api/job-interaction", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      interaction_id: interactionId,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update job interaction");
  }

  return response.json();
};

export const deleteJobInteraction = async (
  interactionId: string
): Promise<void> => {
  const response = await fetch("/api/job-interaction", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      interaction_id: interactionId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete job interaction");
  }
};

interface TabCounts {
  clicked: number;
  applied: number;
  under_consideration: number;
  total: number;
}

export const fetchTabCounts = async (): Promise<TabCounts> => {
  const response = await fetch("/api/job-interaction");
  if (!response.ok) {
    throw new Error("Failed to fetch tab counts");
  }
  const { data } = await response.json();
  return data;
};
