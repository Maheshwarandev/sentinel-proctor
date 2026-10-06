import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { RedLockdownBanner } from './RedLockdownBanner';
import { useForensics } from '../context/ForensicContext';

export const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isRedLockdownActive } = useForensics();

  return (
    <div className={`admin-layout font-sans ${
      isRedLockdownActive
        ? 'bg-[#150205] text-rose-100 selection:bg-rose-600 selection:text-white'
        : 'bg-surface-base text-content-primary selection:bg-accent selection:text-surface-base'
    }`}>
      {/* Emergency lockdown border overlay */}
      {isRedLockdownActive && (
        <div className="fixed inset-0 pointer-events-none z-40 border-[5px] border-rose-600/70 shadow-[inset_0_0_120px_rgba(244,63,94,0.4)] animate-pulse" />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="admin-main flex flex-col min-h-screen">
        {/* Lockdown banner — sticky at top of main column */}
        <RedLockdownBanner />

        {/* Top bar (visible on all screens, adjusting for mobile) */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 h-16 bg-surface-base border-b border-surface-border">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-content-muted hover:text-content-primary hover:bg-surface-raised transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-raised border border-surface-border">
              <span className="text-sm text-content-muted">Search...</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">System Online</span>
            </div>
            <button className="p-2 rounded-xl text-content-muted hover:text-content-primary hover:bg-surface-raised transition-colors">
              <div className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
              </div>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-surface-border">
              <div className="w-8 h-8 rounded-full bg-surface-raised border border-surface-border flex items-center justify-center text-sm font-medium text-content-primary">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-content-primary">Admin</p>
                <p className="text-xs text-content-muted">Supervisor</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-surface-base">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
