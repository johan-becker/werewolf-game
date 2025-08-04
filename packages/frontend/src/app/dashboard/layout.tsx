import { Suspense } from 'react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-border bg-card">
          <Suspense fallback={<div className="h-16 loading-pulse" />}>
            <DashboardSidebar />
          </Suspense>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Suspense fallback={<div className="h-16 loading-pulse" />}>
          <DashboardHeader />
        </Suspense>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container-werewolf py-6">{children}</div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Suspense fallback={<div className="h-16 loading-pulse" />}>
          <DashboardNav />
        </Suspense>
      </div>
    </div>
  );
}
