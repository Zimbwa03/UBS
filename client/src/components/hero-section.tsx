import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDonationStats } from "@/hooks/use-donations";
import { useCampaignSettings } from "@/hooks/use-campaign-stats";
import { useCountdown } from "@/hooks/use-campaign-stats";
import { Calendar, Heart, Share2 } from "lucide-react";

interface HeroSectionProps {
  onDonateClick: () => void;
}

export default function HeroSection({ onDonateClick }: HeroSectionProps) {
  const { data: stats } = useDonationStats();
  const { data: campaign } = useCampaignSettings();
  const countdown = useCountdown(campaign?.endDate);

  const targetAmount = parseFloat(campaign?.targetAmount || "4000");
  const currentAmount = stats?.totalRaised || 0;
  const remaining = Math.max(targetAmount - currentAmount, 0);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-20">
      <div className="absolute inset-0 bg-black/20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/attached_assets/WhatsApp Image 2025-09-03 at 09.16.08_b3e78996_1756898451830.jpg')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="mb-6">
          <Badge className="inline-flex items-center px-3 py-1 bg-accent text-accent-foreground" data-testid="badge-event-date">
            <Calendar className="w-4 h-4 mr-2" />
            26 September 2025 • 12PM - 4PM
          </Badge>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
          Chinpangura<br />
          <span className="gradient-text">Outreach</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90" data-testid="text-hero-subtitle">
          Extending a helping hand to <strong>30 underprivileged kids</strong> in Guruve
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            onClick={onDonateClick}
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg text-lg transform hover:scale-105 transition-all"
            data-testid="button-hero-donate"
          >
            <Heart className="w-5 h-5 mr-2" />
            Donate Now
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-lg text-lg"
            data-testid="button-hero-share"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Event
          </Button>
        </div>
        
        {/* Live Stats Bar */}
        <Card className="bg-card/95 backdrop-blur rounded-2xl max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
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
