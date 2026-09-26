import React from 'react';
import SubadminsManager from '@/components/admin/subadmins/SubadminsManager';

export const metadata = {
  title: 'Subadmins Management | Admin',
};

export default function SubadminsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto h-screen flex flex-col">
      <SubadminsManager />
    </div>
  );
}
