import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Filter, Download } from 'lucide-react';

interface Donation {
  id: string;
  donor_name: string | null;
  email: string | null;
  amount: string;
  message: string | null;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}

export const AdminDonationsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'amount' | 'donor_name'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterAnonymous, setFilterAnonymous] = useState<'all' | 'anonymous' | 'named'>('all');

  const { data: donations, isLoading, error } = useQuery({
    queryKey: ['admin-donations', sortBy, sortOrder, filterAnonymous],
    queryFn: async () => {
      let query = supabase
        .from('donations')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' });

      if (filterAnonymous === 'anonymous') {
        query = query.eq('is_anonymous', true);
      } else if (filterAnonymous === 'named') {
        query = query.eq('is_anonymous', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Donation[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const filteredDonations = donations?.filter(donation => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (donation.donor_name?.toLowerCase().includes(searchLower)) ||
      (donation.email?.toLowerCase().includes(searchLower)) ||
      (donation.message?.toLowerCase().includes(searchLower)) ||
      (donation.amount.includes(searchTerm))
    );
  }) || [];

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    if (!filteredDonations.length) return;

    const headers = ['Date', 'Donor Name', 'Email', 'Amount', 'Message', 'Anonymous'];
    const csvContent = [
      headers.join(','),
      ...filteredDonations.map(donation => [
        formatDate(donation.created_at),
        donation.is_anonymous ? 'Anonymous' : (donation.donor_name || ''),
        donation.email || '',
        donation.amount,
        `"${(donation.message || '').replace(/"/g, '""')}"`,
        donation.is_anonymous ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const totalAmount = filteredDonations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading donations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          Error loading donations: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredDonations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAmount.toString())}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency((totalAmount / Math.max(filteredDonations.length, 1)).toString())}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, amount, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterAnonymous} onValueChange={(value: any) => setFilterAnonymous(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Donations</SelectItem>
                <SelectItem value="named">Named Only</SelectItem>
                <SelectItem value="anonymous">Anonymous Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Newest First</SelectItem>
                <SelectItem value="created_at-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Highest Amount</SelectItem>
                <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                <SelectItem value="donor_name-asc">Name A-Z</SelectItem>
                <SelectItem value="donor_name-desc">Name Z-A</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportToCSV} variant="outline" className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Donations List</CardTitle>
          <CardDescription>
            Showing {filteredDonations.length} of {donations?.length || 0} donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDonations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No donations found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="text-sm">
                        {formatDate(donation.created_at)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {donation.is_anonymous ? (
                          <span className="text-gray-500 italic">Anonymous</span>
                        ) : (
                          donation.donor_name || 'Unknown'
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {donation.email || '-'}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(donation.amount)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {donation.message || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={donation.is_anonymous ? 'secondary' : 'default'}>
                          {donation.is_anonymous ? 'Anonymous' : 'Named'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
