import React from 'react';
import SubscribersTable from '@/components/admin/subscribers/SubscribersTable';

export default function SubscribersPage() {
  return (
    <div className="p-8 pb-20">
      <div className="max-w-[1400px] mx-auto">
        <SubscribersTable />
      </div>
    </div>
  );
}
