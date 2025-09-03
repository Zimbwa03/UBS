import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type Donation, type InsertDonation } from "@shared/schema";

export function useDonations() {
  return useQuery<Donation[]>({
    queryKey: ["donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Donation[];
    },
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });
}

export function useDonationStats() {
  return useQuery<{
    totalRaised: number;
    donorCount: number;
    averageDonation: number;
  }>({
    queryKey: ["donation-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donation_stats')
        .select('*')
        .single();
      
      if (error) throw error;
      
      return {
        totalRaised: parseFloat(data.total_amount || '0'),
        donorCount: data.total_donations || 0,
        averageDonation: parseFloat(data.average_donation || '0'),
      };
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
}

export function useCreateDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donation: InsertDonation) => {
      const { data, error } = await supabase
        .from('donations')
        .insert({
          donor_name: donation.donorName,
          email: donation.email,
          amount: donation.amount,
          message: donation.message,
          is_anonymous: donation.isAnonymous,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["donation-stats"] });
    },
  });
}
