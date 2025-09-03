import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type CampaignSettings } from "@shared/schema";

export function useCampaignSettings() {
  return useQuery<CampaignSettings>({
    queryKey: ["/api/campaign"],
  });
}

export function useNewsletterSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/newsletter/subscribe", { email });
      return response.json();
    },
  });
}

export function useCountdown(endDate?: Date) {
  const calculateTimeRemaining = () => {
    if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const distance = end - now;

    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  return calculateTimeRemaining();
}
