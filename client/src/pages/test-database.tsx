import React from 'react';
import { DatabaseTest } from '../components/database-test';

export const TestDatabasePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <DatabaseTest />
      </div>
    </div>
  );
};
