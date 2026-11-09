import React from "react";
import PrayerRequestsTable from "@/components/admin/prayer-requests/PrayerRequestsTable";

export default function AdminPrayerRequestsPage() {
  return (
    <div className="p-8 pb-20">
      <div className="max-w-[1400px] mx-auto">
        <PrayerRequestsTable />
      </div>
    </div>
  );
}

