import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { RedLockdownBanner } from './RedLockdownBanner';
import { useForensics } from '../context/ForensicContext';

export const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isRedLockdownActive } = useForensics();

  return (
    <div className={`admin-layout font-['Plus_Jakarta_Sans',sans-serif] ${
      isRedLockdownActive
        ? 'bg-[#150205] text-rose-100 selection:bg-rose-600 selection:text-white'
        : 'bg-[#080c14] text-slate-100 selection:bg-cyan-500 selection:text-black'
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

        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 h-14 bg-slate-950/95 border-b border-white/[0.07] backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.07] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-white">
            Sentinel<span className="text-cyan-400">.</span>Proctor
          </span>
          <div className="w-9" />{/* Balance spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
