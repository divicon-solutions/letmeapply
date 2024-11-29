import { useQuery } from "@tanstack/react-query";
import { fetchTabCounts } from "../api/jobInteractions";

export const useTabCounts = () => {
  return useQuery({
    queryKey: ["tabCounts"],
    queryFn: fetchTabCounts,
    refetchOnWindowFocus: false,
  });
};
