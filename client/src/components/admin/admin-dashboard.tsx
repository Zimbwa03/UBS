import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminStats } from './admin-stats';
import { AdminDonationForm } from './admin-donation-form';
import { AdminCampaignSettings } from './admin-campaign-settings';
import { AdminDonationsList } from './admin-donations-list';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your fundraising campaign</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="add-donation">Add Donation</TabsTrigger>
            <TabsTrigger value="settings">Campaign Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
          </TabsContent>

          <TabsContent value="donations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Donations</CardTitle>
                <CardDescription>
                  View and manage all donations received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminDonationsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-donation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Donation</CardTitle>
                <CardDescription>
                  Manually add a donation to the campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminDonationForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Settings</CardTitle>
                <CardDescription>
                  Update campaign target, title, and end date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCampaignSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Admin Footer with Attribution */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
            <span>Admin Dashboard built by</span>
            <a 
              href="https://neuronetai.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
            >
              <img 
                src="https://sqbnzpwxbzlmjbqsclia.supabase.co/storage/v1/object/sign/Neuronet%20Ai%20Solutions/WhatsApp%20Image%202025-09-03%20at%2021.38.04_75dce74b.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzdhNTNjYS04ZGVjLTRlNjMtOWNkNi05NGJiMGNmNTEyYmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOZXVyb25ldCBBaSBTb2x1dGlvbnMvV2hhdHNBcHAgSW1hZ2UgMjAyNS0wOS0wMyBhdCAyMS4zOC4wNF83NWRjZTc0Yi5qcGciLCJpYXQiOjE3NTY5MjgzNTUsImV4cCI6NTI1NzQyNDM1NX0.07k7ZQMAkV5J2m5bBvz9mT5Qtz3lQDvST4_3p_KX7GU"
                alt="Neuronet AI Solutions Logo"
                className="w-5 h-5 rounded-sm object-cover"
              />
              <span className="font-medium">Neuronet AI Solutions Pvt.</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
