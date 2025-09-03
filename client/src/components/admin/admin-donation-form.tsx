import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

const donationSchema = z.object({
  donorName: z.string().min(1, 'Donor name is required'),
  email: z.string().email('Valid email is required'),
  amount: z.string().min(1, 'Amount is required').refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Amount must be a positive number'),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

type DonationFormData = z.infer<typeof donationSchema>;

export const AdminDonationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      isAnonymous: false,
    }
  });

  const isAnonymous = watch('isAnonymous');

  const onSubmit = async (data: DonationFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase
        .from('donations')
        .insert({
          donor_name: data.donorName,
          email: data.email,
          amount: data.amount,
          message: data.message || null,
          is_anonymous: data.isAnonymous,
        });

      if (error) {
        throw error;
      }

      setSubmitStatus({
        type: 'success',
        message: 'Donation added successfully!'
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donation-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });

      // Reset form
      reset();

    } catch (error: any) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to add donation'
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="donorName">Donor Name *</Label>
            <Input
              id="donorName"
              {...register('donorName')}
              placeholder="Enter donor name"
              disabled={isAnonymous}
            />
            {errors.donorName && (
              <p className="text-sm text-red-600">{errors.donorName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Donation Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            {...register('amount')}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            {...register('message')}
            placeholder="Enter a message from the donor"
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isAnonymous"
            checked={isAnonymous}
            onCheckedChange={(checked) => setValue('isAnonymous', !!checked)}
          />
          <Label htmlFor="isAnonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Anonymous donation
          </Label>
        </div>

        {isAnonymous && (
          <Alert>
            <AlertDescription>
              Anonymous donations will not display the donor's name publicly.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Adding Donation...' : 'Add Donation'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Clear Form
          </Button>
        </div>
      </form>

      {/* Quick Amount Buttons */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Amounts</CardTitle>
          <CardDescription>Click to quickly set common donation amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[25, 50, 100, 250, 500, 1000].map((amount) => (
              <Button
                key={amount}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue('amount', amount.toString())}
                disabled={isSubmitting}
              >
                ${amount}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
