import React from 'react';
import { useForensics } from '../context/ForensicContext';
import { AdminFinishedTasks } from './AdminFinishedTasks';
import { CyberNotificationPopup } from './CyberNotificationPopup';
import { PageHeader, Badge } from './ui';

export const SubmissionsBoxPage = () => {
  const { tasks } = useForensics();

  const completedCount = tasks.filter(t => t.status === 'SUBMITTED' || t.status === 'VERIFIED').length;
  const pendingCount = tasks.filter(t => !t.auditorVerdict).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 font-['Plus_Jakarta_Sans',sans-serif] relative">
      {/* Real-time floating popup */}
      <CyberNotificationPopup />

      {/* Header Banner */}
      <PageHeader
        title="Candidate Submissions"
        subtitle="Verify typed sentences, inspect camera forensics, review handwritten answer sheets, and record audit verdicts."
        badge={
          <Badge variant="info" dot pulse>SUPERVISOR AUDIT CENTER</Badge>
        }
        actions={
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/[0.08] text-center min-w-[95px] shadow-sm">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Received</p>
              <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{completedCount} / {tasks.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/[0.08] text-center min-w-[95px] shadow-sm">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Needs Review</p>
              <p className="text-xl font-bold text-amber-400 font-mono mt-0.5">{pendingCount}</p>
            </div>
          </div>
        }
      />

      {/* Main Submissions List */}
      <AdminFinishedTasks />
    </div>
  );
};

export default SubmissionsBoxPage;
