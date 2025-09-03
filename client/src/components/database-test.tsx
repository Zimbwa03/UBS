import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

export const DatabaseTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (test: string, status: TestResult['status'], message: string, data?: any) => {
    setResults(prev => {
      const existing = prev.find(r => r.test === test);
      if (existing) {
        return prev.map(r => r.test === test ? { ...r, status, message, data } : r);
      }
      return [...prev, { test, status, message, data }];
    });
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // Test 1: Check campaign settings
      updateResult('campaign-settings', 'pending', 'Checking campaign settings...');
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaign_settings')
        .select('*')
        .limit(1);

      if (campaignError) {
        updateResult('campaign-settings', 'error', `Error: ${campaignError.message}`);
      } else {
        updateResult('campaign-settings', 'success', 'Campaign settings loaded successfully', campaignData);
      }

      // Test 2: Check donation stats
      updateResult('donation-stats', 'pending', 'Checking donation statistics...');
      const { data: statsData, error: statsError } = await supabase
        .from('donation_stats')
        .select('*');

      if (statsError) {
        updateResult('donation-stats', 'error', `Error: ${statsError.message}`);
      } else {
        updateResult('donation-stats', 'success', 'Donation stats loaded successfully', statsData);
      }

      // Test 3: Test donation insertion
      updateResult('donation-insert', 'pending', 'Testing donation insertion...');
      const { data: insertData, error: insertError } = await supabase
        .from('donations')
        .insert({
          donor_name: 'Test Donor',
          email: 'test@example.com',
          amount: '25.00',
          message: 'Test donation from React app',
          is_anonymous: false
        })
        .select()
        .single();

      if (insertError) {
        updateResult('donation-insert', 'error', `Error: ${insertError.message}`);
      } else {
        updateResult('donation-insert', 'success', 'Test donation inserted successfully', insertData);
      }

      // Test 4: Check recent donations
      updateResult('recent-donations', 'pending', 'Checking recent donations...');
      const { data: recentData, error: recentError } = await supabase
        .from('recent_donations')
        .select('*')
        .limit(3);

      if (recentError) {
        updateResult('recent-donations', 'error', `Error: ${recentError.message}`);
      } else {
        updateResult('recent-donations', 'success', 'Recent donations loaded successfully', recentData);
      }

      // Test 5: Test newsletter subscription
      updateResult('newsletter-sub', 'pending', 'Testing newsletter subscription...');
      const { data: newsletterData, error: newsletterError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: 'test@newsletter.com'
        })
        .select()
        .single();

      if (newsletterError) {
        updateResult('newsletter-sub', 'error', `Error: ${newsletterError.message}`);
      } else {
        updateResult('newsletter-sub', 'success', 'Newsletter subscription created successfully', newsletterData);
      }

      // Test 6: Test real-time subscription
      updateResult('realtime-test', 'pending', 'Testing real-time subscription...');
      const channel = supabase
        .channel('test-channel')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'donations' },
          (payload) => {
            updateResult('realtime-test', 'success', 'Real-time subscription working!', payload);
          }
        )
        .subscribe();

      // Wait a moment then unsubscribe
      setTimeout(() => {
        supabase.removeChannel(channel);
        if (!results.find(r => r.test === 'realtime-test' && r.status === 'success')) {
          updateResult('realtime-test', 'success', 'Real-time subscription setup successful');
        }
      }, 2000);

    } catch (error) {
      console.error('Test error:', error);
      updateResult('general', 'error', `General error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Database Connection Test</h2>
      
      <button
        onClick={runTests}
        disabled={isRunning}
        className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRunning ? 'Running Tests...' : 'Run Database Tests'}
      </button>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{getStatusIcon(result.status)}</span>
              <h3 className="font-semibold text-gray-800">{result.test.replace('-', ' ').toUpperCase()}</h3>
              <span className={`text-sm ${getStatusColor(result.status)}`}>
                {result.status.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{result.message}</p>
            {result.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                  View Data
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {results.length > 0 && !isRunning && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Test Summary:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-600">✅ Successful: </span>
              {results.filter(r => r.status === 'success').length}
            </div>
            <div>
              <span className="text-red-600">❌ Failed: </span>
              {results.filter(r => r.status === 'error').length}
            </div>
          </div>
        </div>
      )}
      
      {/* Attribution */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
          <span>Database test component by</span>
          <a 
            href="https://neuronetai.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
          >
            <img 
              src="https://sqbnzpwxbzlmjbqsclia.supabase.co/storage/v1/object/sign/Neuronet%20Ai%20Solutions/WhatsApp%20Image%202025-09-03%20at%2021.38.04_75dce74b.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzdhNTNjYS04ZGVjLTRlNjMtOWNkNi05NGJiMGNmNTEyYmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOZXVyb25ldCBBaSBTb2x1dGlvbnMvV2hhdHNBcHAgSW1hZ2UgMjAyNS0wOS0wMyBhdCAyMS4zOC4wNF83NWRjZTc0Yi5qcGciLCJpYXQiOjE3NTY5MjgzNTUsImV4cCI6NTI1NzQyNDM1NX0.07k7ZQMAkV5J2m5bBvz9mT5Qtz3lQDvST4_3p_KX7GU"
              alt="Neuronet AI Solutions"
              className="w-4 h-4 rounded object-cover"
            />
            <span>Neuronet AI Solutions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
