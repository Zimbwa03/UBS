import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDonationStats } from '@/hooks/use-donations';
import { useCampaignSettings } from '@/hooks/use-campaign-stats';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export const AdminStats: React.FC = () => {
  const { data: campaignSettings } = useCampaignSettings();
  const { data: donationStats } = useDonationStats();

  // Fetch additional stats from Supabase
  const { data: detailedStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [donationsResult, newsletterResult] = await Promise.all([
        supabase.from('donation_stats').select('*').single(),
        supabase.from('newsletter_subscribers').select('count').single()
      ]);

      return {
        donationStats: donationsResult.data,
        newsletterCount: newsletterResult.data?.count || 0
      };
    },
    refetchInterval: 10000 // Refetch every 10 seconds
  });

  const targetAmount = campaignSettings?.targetAmount ? parseFloat(campaignSettings.targetAmount) : 0;
  const totalRaised = donationStats?.totalRaised || 0;
  const progressPercentage = targetAmount > 0 ? (totalRaised / targetAmount) * 100 : 0;
  const remainingAmount = Math.max(0, targetAmount - totalRaised);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Raised */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
          <span className="text-2xl">💰</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalRaised)}
          </div>
          <p className="text-xs text-muted-foreground">
            {detailedStats?.donationStats?.total_donations || 0} donations received
          </p>
        </CardContent>
      </Card>

      {/* Target Amount */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Target Goal</CardTitle>
          <span className="text-2xl">🎯</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(targetAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            Campaign target amount
          </p>
        </CardContent>
      </Card>

      {/* Progress Percentage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress</CardTitle>
          <span className="text-2xl">📊</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {progressPercentage.toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor(progressPercentage)}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Amount */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          <span className="text-2xl">⏰</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(remainingAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {remainingAmount > 0 ? 'To reach goal' : 'Goal achieved!'}
          </p>
        </CardContent>
      </Card>

      {/* Additional Stats Row */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
              <span className="text-2xl">📈</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {formatCurrency(detailedStats?.donationStats?.average_donation || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per donation average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Largest Donation</CardTitle>
              <span className="text-2xl">🏆</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(detailedStats?.donationStats?.largest_donation || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Highest single donation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
              <span className="text-2xl">📧</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">
                {detailedStats?.newsletterCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Email subscribers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Campaign Info */}
      {campaignSettings && (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Campaign Information</CardTitle>
            <CardDescription>Current campaign details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Campaign Title</h4>
                <p className="text-gray-600">{campaignSettings.campaignTitle}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">End Date</h4>
                <p className="text-gray-600">
                  {campaignSettings.endDate 
                    ? new Date(campaignSettings.endDate).toLocaleDateString()
                    : 'No end date set'
                  }
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Status</h4>
                <p className={`font-medium ${campaignSettings.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {campaignSettings.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Created</h4>
                <p className="text-gray-600">
                  {campaignSettings.createdAt 
                    ? new Date(campaignSettings.createdAt).toLocaleDateString()
                    : 'Unknown'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
