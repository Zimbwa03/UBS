import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDonationStats } from "@/hooks/use-donations";
import { useCampaignSettings } from "@/hooks/use-campaign-stats";
import { useCountdown } from "@/hooks/use-campaign-stats";
import { Calendar, Heart, Share2 } from "lucide-react";
import HeroSlider from "./hero-slider";

interface HeroSectionProps {
  onDonateClick: () => void;
}

export default function HeroSection({ onDonateClick }: HeroSectionProps) {
  const { data: stats } = useDonationStats();
  const { data: campaign } = useCampaignSettings();
  const countdown = useCountdown(campaign?.endDate);

  const targetAmount = parseFloat(campaign?.targetAmount || "1000");
  const currentAmount = stats?.totalRaised || 0;
  const remaining = Math.max(targetAmount - currentAmount, 0);

  // Background images for the slider
  const backgroundImages = [
    "https://sqbnzpwxbzlmjbqsclia.supabase.co/storage/v1/object/sign/Neuronet%20Ai%20Solutions/WhatsApp%20Image%202025-09-03%20at%2022.11.21_51960aa2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzdhNTNjYS04ZGVjLTRlNjMtOWNkNi05NGJiMGNmNTEyYmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOZXVyb25ldCBBaSBTb2x1dGlvbnMvV2hhdHNBcHAgSW1hZ2UgMjAyNS0wOS0wMyBhdCAyMi4xMS4yMV81MTk2MGFhMi5qcGciLCJpYXQiOjE3NTY5MzEwODcsImV4cCI6NTI1NzQyNzA4N30.Wq9pIwl-kLc396JfpHvlC7z3ETntu_zhEGzBOwy2-0E",
    "https://sqbnzpwxbzlmjbqsclia.supabase.co/storage/v1/object/sign/Neuronet%20Ai%20Solutions/WhatsApp%20Image%202025-09-03%20at%2022.18.29_b5e54ac4.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzdhNTNjYS04ZGVjLTRlNjMtOWNkNi05NGJiMGNmNTEyYmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOZXVyb25ldCBBaSBTb2x1dGlvbnMvV2hhdHNBcHAgSW1hZ2UgMjAyNS0wOS0wMyBhdCAyMi4xOC4yOV9iNWU1NGFjNC5qcGciLCJpYXQiOjE3NTY5MzExMDcsImV4cCI6NTI1NzQyNzEwN30.XrYFc2XhtsV3zR3e-dUj89TbHJ_wdJqvj0mNGQyi7ik"
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-20">
      {/* Image Slider Background */}
      <HeroSlider images={backgroundImages} interval={6000} />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      {/* Subtle gradient overlay for visual enhancement */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="mb-6">
          <Badge className="inline-flex items-center px-3 py-1 bg-accent text-accent-foreground" data-testid="badge-event-date">
            <Calendar className="w-4 h-4 mr-2" />
            26 September 2025 • 12PM - 4PM
          </Badge>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl px-4" data-testid="text-hero-title">
          Chipangura<br />
          <span className="gradient-text drop-shadow-lg">Outreach</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-95 drop-shadow-lg px-4" data-testid="text-hero-subtitle">
          Extending a helping hand to <strong className="text-yellow-300">30 underprivileged kids</strong> in Guruve
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4">
          <Button 
            onClick={onDonateClick}
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg transform hover:scale-105 transition-all w-full sm:w-auto"
            data-testid="button-hero-donate"
          >
            <Heart className="w-5 h-5 mr-2" />
            Donate Now
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-white/30 hover:bg-white/10 text-white px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg w-full sm:w-auto"
            data-testid="button-hero-share"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Event
          </Button>
        </div>
        
        {/* Live Stats Bar */}
        <Card className="bg-white/95 backdrop-blur-md rounded-2xl max-w-4xl mx-auto shadow-2xl border border-white/20 mx-4">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary" data-testid="text-stats-raised">
                  ${currentAmount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Raised</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-secondary" data-testid="text-stats-donors">
                  {stats?.donorCount || 0}
                </div>
                <div className="text-sm text-muted-foreground">Donors</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-accent" data-testid="text-stats-remaining">
                  ${remaining.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">To Go</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary" data-testid="text-countdown-days">
                  {countdown.days}
                </div>
                <div className="text-sm text-muted-foreground">Days Left</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
