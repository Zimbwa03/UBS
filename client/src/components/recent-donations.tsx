import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDonations } from "@/hooks/use-donations";
import { Heart, User, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function RecentDonations() {
  const { data: donations, isLoading } = useDonations();

  const recentDonations = donations?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Heart className="w-5 h-5 text-accent mr-2" />
            Recent Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-20 mb-1" />
                      <div className="h-3 bg-gray-300 rounded w-16" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center" data-testid="text-recent-donations-title">
          <Heart className="w-5 h-5 text-accent mr-2" />
          Recent Donations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentDonations.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No donations yet. Be the first to contribute!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentDonations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                data-testid={`donation-item-${donation.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium" data-testid={`donation-name-${donation.id}`}>
                      {donation.isAnonymous ? "Anonymous" : donation.donorName || "Anonymous"}
                    </div>
                    <div className="text-xs text-muted-foreground" data-testid={`donation-time-${donation.id}`}>
                      {donation.createdAt ? formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true }) : ""}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-secondary" data-testid={`donation-amount-${donation.id}`}>
                  ${parseFloat(donation.amount).toLocaleString()}
                </div>
              </div>
            ))}

            {donations && donations.length > 5 && (
              <div className="mt-4 pt-4 border-t border-border text-center">
                <Button variant="ghost" className="text-primary hover:text-primary/80" data-testid="button-view-all-donations">
                  View All Donations <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
