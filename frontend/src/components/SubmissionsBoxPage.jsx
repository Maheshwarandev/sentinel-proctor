import React from 'react';
import { useForensics } from '../context/ForensicContext';
import { AdminFinishedTasks } from './AdminFinishedTasks';
import { CyberNotificationPopup } from './CyberNotificationPopup';
import { Inbox, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const SubmissionsBoxPage = () => {
  const { tasks } = useForensics();

  const completedCount = tasks.filter(t => t.status === 'SUBMITTED' || t.status === 'VERIFIED').length;
  const pendingCount = tasks.filter(t => !t.auditorVerdict).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 font-['Plus_Jakarta_Sans',sans-serif] relative">
      
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/3 w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Real-time floating popup */}
      <CyberNotificationPopup />

      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Supervisor Command</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400 font-bold">Submissions Box</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-white/[0.09] bg-gradient-to-r from-slate-900/70 via-slate-900/60 to-cyan-950/30 p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl relative overflow-hidden">
        {/* Subtle top light bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold tracking-wide flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>SUPERVISOR AUDIT CENTER</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">Subject: Brother</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Candidate Submissions Box
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Verify typed sentences, inspect camera forensics, review handwritten answer sheets, and record audit verdicts.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs shrink-0">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.09] text-center min-w-[105px] shadow-inner">
              <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Total Received</div>
              <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">{completedCount} / {tasks.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.09] text-center min-w-[105px] shadow-inner">
              <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Needs Review</div>
              <div className="text-2xl font-black text-amber-400 mt-1 font-mono">{pendingCount}</div>
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
