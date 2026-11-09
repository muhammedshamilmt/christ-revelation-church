import React from 'react';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';

export default function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8f9]">
      <div className="p-6 md:p-8 flex-1 max-w-[1600px] w-full mx-auto">
        <React.Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-3xl w-full" />}>
          <AnalyticsDashboard />
        </React.Suspense>
      </div>
    </div>
  );
}
