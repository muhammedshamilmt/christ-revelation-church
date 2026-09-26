import Sidebar from "@/components/admin/shared/Sidebar";
import AdminHeader from "@/components/admin/shared/AdminHeader";
import { AdminAuthProvider } from "@/components/admin/shared/AdminAuthProvider";
import { ConfirmDialogProvider } from "@/components/ui/ConfirmDialogProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ConfirmDialogProvider>
        <div className="flex h-screen bg-white overflow-hidden text-gray-900 font-sans">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto flex flex-col relative bg-white">
            <AdminHeader />
            <div className="max-w-[1600px] mx-auto w-full flex-1">
              {children}
            </div>
          </main>
        </div>
      </ConfirmDialogProvider>
    </AdminAuthProvider>
  );
}
