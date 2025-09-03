import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Donation, type InsertDonation } from "@shared/schema";

export function useDonations() {
  return useQuery<Donation[]>({
    queryKey: ["/api/donations"],
  });
}

export function useDonationStats() {
  return useQuery<{
    totalRaised: number;
    donorCount: number;
    averageDonation: number;
  }>({
    queryKey: ["/api/donations/stats"],
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
}

export function useCreateDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donation: InsertDonation) => {
      const response = await apiRequest("POST", "/api/donations", donation);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/donations/stats"] });
    },
  });
}
