import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useCampaignSettings } from '@/hooks/use-campaign-stats';

const campaignSchema = z.object({
  campaignTitle: z.string().min(1, 'Campaign title is required'),
  targetAmount: z.string().min(1, 'Target amount is required').refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Target amount must be a positive number'),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

export const AdminCampaignSettings: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  const queryClient = useQueryClient();
  const { data: currentSettings } = useCampaignSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      campaignTitle: currentSettings?.campaignTitle || '',
      targetAmount: currentSettings?.targetAmount || '',
      endDate: currentSettings?.endDate ? new Date(currentSettings.endDate).toISOString().split('T')[0] : '',
      isActive: currentSettings?.isActive ?? true,
    }
  });

  const isActive = watch('isActive');

  // Update form when current settings change
  React.useEffect(() => {
    if (currentSettings) {
      reset({
        campaignTitle: currentSettings.campaignTitle,
        targetAmount: currentSettings.targetAmount,
        endDate: currentSettings.endDate ? new Date(currentSettings.endDate).toISOString().split('T')[0] : '',
        isActive: currentSettings.isActive,
      });
    }
  }, [currentSettings, reset]);

  const onSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // If we have existing settings, update them; otherwise create new ones
      if (currentSettings?.id) {
        const { error } = await supabase
          .from('campaign_settings')
          .update({
            campaign_title: data.campaignTitle,
            target_amount: data.targetAmount,
            end_date: data.endDate ? new Date(data.endDate).toISOString() : null,
            is_active: data.isActive,
          })
          .eq('id', currentSettings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('campaign_settings')
          .insert({
            campaign_title: data.campaignTitle,
            target_amount: data.targetAmount,
            end_date: data.endDate ? new Date(data.endDate).toISOString() : null,
            is_active: data.isActive,
          });

        if (error) throw error;
      }

      setSubmitStatus({
        type: 'success',
        message: 'Campaign settings updated successfully!'
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['campaign-settings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });

    } catch (error: any) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to update campaign settings'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {submitStatus && (
          <Alert className={submitStatus.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            <AlertDescription className={submitStatus.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="campaignTitle">Campaign Title *</Label>
          <Input
            id="campaignTitle"
            {...register('campaignTitle')}
            placeholder="Enter campaign title"
          />
          {errors.campaignTitle && (
            <p className="text-sm text-red-600">{errors.campaignTitle.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAmount">Target Amount *</Label>
          <Input
            id="targetAmount"
            type="number"
            step="0.01"
            min="0"
            {...register('targetAmount')}
            placeholder="0.00"
          />
          {errors.targetAmount && (
            <p className="text-sm text-red-600">{errors.targetAmount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            type="date"
            {...register('endDate')}
          />
          <p className="text-sm text-gray-500">
            Leave empty for no end date
          </p>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="isActive" className="text-base">Campaign Active</Label>
            <p className="text-sm text-gray-500">
              Toggle campaign visibility and functionality
            </p>
          </div>
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setValue('isActive', checked)}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Updating...' : 'Update Settings'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (currentSettings) {
                reset({
                  campaignTitle: currentSettings.campaignTitle,
                  targetAmount: currentSettings.targetAmount,
                  endDate: currentSettings.endDate ? new Date(currentSettings.endDate).toISOString().split('T')[0] : '',
                  isActive: currentSettings.isActive,
                });
              }
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        </div>
      </form>

      {/* Current Settings Display */}
      {currentSettings && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Current Settings</CardTitle>
            <CardDescription>These are the currently active campaign settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Title:</span>
                <p className="text-gray-600">{currentSettings.campaignTitle}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Target:</span>
                <p className="text-gray-600">${parseFloat(currentSettings.targetAmount).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">End Date:</span>
                <p className="text-gray-600">
                  {currentSettings.endDate 
                    ? new Date(currentSettings.endDate).toLocaleDateString()
                    : 'No end date'
                  }
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <p className={`font-medium ${currentSettings.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {currentSettings.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
