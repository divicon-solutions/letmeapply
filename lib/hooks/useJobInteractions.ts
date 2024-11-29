import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchJobInteractions,
  updateJobInteraction,
  deleteJobInteraction,
} from "../api/jobInteractions";

export const useJobInteractions = (status: string = "clicked") => {
  const queryClient = useQueryClient();

  const {
    data: interactions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobInteractions", status],
    queryFn: () => fetchJobInteractions(status),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      interactionId,
      newStatus,
    }: {
      interactionId: string;
      newStatus: "applied" | "under_consideration";
    }) => updateJobInteraction(interactionId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobInteractions"] });
      queryClient.invalidateQueries({ queryKey: ["tabCounts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (interactionId: string) => deleteJobInteraction(interactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobInteractions"] });
      queryClient.invalidateQueries({ queryKey: ["tabCounts"] });
    },
  });

  return {
    interactions,
    isLoading,
    error,
    updateInteraction: updateMutation.mutate,
    deleteInteraction: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch,
  };
};
