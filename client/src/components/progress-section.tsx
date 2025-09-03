import { Card, CardContent } from "@/components/ui/card";
import { useDonationStats } from "@/hooks/use-donations";
import { useCampaignSettings } from "@/hooks/use-campaign-stats";
import { Users, Clock, Heart } from "lucide-react";

export default function ProgressSection() {
  const { data: stats } = useDonationStats();
  const { data: campaign } = useCampaignSettings();

  const targetAmount = parseFloat(campaign?.targetAmount || "4000");
  const currentAmount = stats?.totalRaised || 0;
  const progressPercentage = Math.min((currentAmount / targetAmount) * 100, 100);
  const remaining = Math.max(targetAmount - currentAmount, 0);

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-progress-title">Our Progress</h2>
          <p className="text-xl text-muted-foreground">Together, we're making a real difference</p>
        </div>

        {/* Main Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-primary" data-testid="text-progress-current">
              ${currentAmount.toLocaleString()}
            </span>
            <span className="text-lg text-muted-foreground">
              Goal: <span className="font-semibold text-foreground" data-testid="text-progress-target">
                ${targetAmount.toLocaleString()}
              </span>
            </span>
          </div>
          
          <div className="relative">
            {/* Progress Bar Background */}
            <div className="w-full bg-border rounded-full h-6 shadow-inner">
              {/* Animated Progress Fill */}
              <div 
                className="progress-bar h-6 rounded-full shadow-md transition-all duration-1000" 
                style={{ width: `${progressPercentage}%` }}
                data-testid="progress-bar"
              />
            </div>
            
            {/* Milestone Markers */}
            <div className="absolute top-0 left-1/4 transform -translate-x-1/2">
              <div className={`w-3 h-3 ${progressPercentage >= 25 ? 'bg-secondary' : 'bg-border'} rounded-full -mt-1 shadow-md`} />
              <div className="text-xs text-muted-foreground mt-2 whitespace-nowrap">25%</div>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              <div className={`w-3 h-3 ${progressPercentage >= 50 ? 'bg-secondary' : 'bg-border'} rounded-full -mt-1 shadow-md`} />
              <div className="text-xs text-muted-foreground mt-2 whitespace-nowrap">50%</div>
            </div>
            <div className="absolute top-0 left-3/4 transform -translate-x-1/2">
              <div className={`w-3 h-3 ${progressPercentage >= 75 ? 'bg-secondary' : 'bg-border'} rounded-full -mt-1 shadow-md`} />
              <div className="text-xs text-muted-foreground mt-2 whitespace-nowrap">75%</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-lg font-medium text-secondary" data-testid="text-progress-percentage">
              {Math.round(progressPercentage)}% Complete
            </span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-lg text-muted-foreground" data-testid="text-progress-remaining">
              ${remaining.toLocaleString()} remaining
            </span>
          </div>
        </div>

        {/* Impact Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="rounded-xl shadow-lg donation-card">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary" data-testid="text-kids-count">30</div>
                  <div className="text-sm text-muted-foreground">Kids to Help</div>
                </div>
              </div>
              <p className="text-muted-foreground">Providing essential support to underprivileged children in Guruve</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-lg donation-card">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary" data-testid="text-donor-count">
                    {stats?.donorCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Generous Donors</div>
                </div>
              </div>
              <p className="text-muted-foreground">Amazing community members supporting this cause</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-lg donation-card">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary" data-testid="text-days-remaining">23</div>
                  <div className="text-sm text-muted-foreground">Days Remaining</div>
                </div>
              </div>
              <p className="text-muted-foreground">Time left to reach our fundraising goal</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
