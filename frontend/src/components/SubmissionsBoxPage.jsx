import React from 'react';
import { useForensics } from '../context/ForensicContext';
import { AdminFinishedTasks } from './AdminFinishedTasks';
import { CyberNotificationPopup } from './CyberNotificationPopup';

export const SubmissionsBoxPage = () => {
  const { tasks } = useForensics();

  const completedCount = tasks.filter(t => t.status === 'SUBMITTED' || t.status === 'VERIFIED').length;
  const pendingCount = tasks.filter(t => !t.auditorVerdict).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Real-time floating popup */}
      <CyberNotificationPopup />

      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Admin</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400 font-semibold">Submissions Box</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
                Dedicated Review Center
              </span>
              <span className="text-xs text-slate-400">Subject: Brother</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Submissions Box
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              All finished tasks submitted by your brother are gathered here. Inspect his typed text, typing speed, and photo proofs, then approve or request a redo.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs shrink-0">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[95px]">
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Total Received</div>
              <div className="text-xl font-bold text-cyan-400 mt-0.5">{completedCount} / {tasks.length}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[95px]">
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Needs Review</div>
              <div className="text-xl font-bold text-amber-400 mt-0.5">{pendingCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Submissions List */}
      <AdminFinishedTasks />

    </div>
  );
};

export default SubmissionsBoxPage;
