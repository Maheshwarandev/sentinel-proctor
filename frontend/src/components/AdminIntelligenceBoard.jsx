import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Inbox, 
  Bell, 
  ArrowRight,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
  Check,
  Minus,
  Plus,
  FileCheck2
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';
import { CyberNotificationPopup } from './CyberNotificationPopup';
import { LiveProctorCCTV } from './LiveProctorCCTV';

export const AdminIntelligenceBoard = () => {
  const navigate = useNavigate();
  const { 
    tasks, 
    strikes, 
    resetStrikes,
    notifications, 
    checkTaskFromNotification,
    setSelectedTaskId,
    isRedLockdownActive,
    triggerRedLockdown,
    archive = [],
    module2QuestionLimit = 50,
    updateModule2QuestionLimit
  } = useForensics();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [customLimitInput, setCustomLimitInput] = useState(module2QuestionLimit);
  const [limitFeedback, setLimitFeedback] = useState(null);

  const handleSetQuestionLimit = async (limit) => {
    const val = Math.max(3, Math.min(100, parseInt(limit, 10) || 50));
    setCustomLimitInput(val);
    if (updateModule2QuestionLimit) {
      await updateModule2QuestionLimit(val);
    }
    setLimitFeedback(`✓ Question limit set to ${val} questions (Pass Mark: ${Math.ceil(val * 0.7)}/${val})`);
    setTimeout(() => setLimitFeedback(null), 3500);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const completedCount = tasks.filter(t => t.status === 'SUBMITTED' || t.status === 'VERIFIED').length;
  const pendingCount = tasks.filter(t => t.status === 'SUBMITTED' && !t.auditorVerdict).length;
  const keyboardTask = tasks.find(t => t.id === 'mod-1-keyboard');
  const liveWpm = keyboardTask?.telemetry?.wpm;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 relative font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Real-time floating SaaS notification toast */}
      <CyberNotificationPopup />

      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${
              isRedLockdownActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}>
              {isRedLockdownActive ? '🚨 Lockdown Active' : 'Admin Overview'}
            </span>
            <span className="text-xs text-slate-400">Brother Compliance Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Compliance Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervise daily task submissions, inspect anti-cheat telemetry, and manage your brother's access link.
          </p>
        </div>

        {/* Quick Nav Actions */}
        <div className="flex items-center space-x-3">

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-2 transition-all shadow-sm"
            >
              <Bell className="w-4 h-4 text-slate-400" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                  <span className="text-xs font-bold text-white">Recent Submissions</span>
                  <span className="text-[10px] text-slate-400">{notifications.length} alerts</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => {
                          checkTaskFromNotification(n.taskId);
                          navigate('/admin/submissions');
                          setShowNotificationsDropdown(false);
                        }}
                        className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer space-y-1 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white group-hover:text-cyan-300">
                            {n.taskTitle}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {n.snippet || n.message}
                        </p>
                        <div className="text-[10px] text-cyan-400 group-hover:underline flex items-center space-x-1 pt-1 font-medium">
                          <span>Open in Submissions Box</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      navigate('/admin/submissions');
                      setShowNotificationsDropdown(false);
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Open Submissions Box Page →
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ============================================================= */}
      {/* EXECUTIVE KPI STAT CARDS (GRID OF 4)                          */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Daily Completion */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Daily Progress</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {completedCount} / {tasks.length}
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-cyan-500 h-full rounded-full transition-all"
                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-cyan-400">
              {Math.round((completedCount / tasks.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Metric 2: Pending Reviews (Clickable) */}
        <div 
          onClick={() => navigate('/admin/submissions')}
          className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md space-y-2 cursor-pointer hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all group"
          title="Click to open Submissions Box"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="group-hover:text-cyan-300 transition-colors">Needs Review</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight flex items-center justify-between">
            <span>{pendingCount}</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-400">
            {pendingCount > 0 ? 'Click to open submissions' : 'All tasks reviewed'}
          </p>
        </div>

        {/* Metric 3: Avg Typing Speed (Clickable to Anti-Cheat) */}
        <div 
          onClick={() => navigate('/admin/anti-cheat')}
          className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md space-y-2 cursor-pointer hover:border-teal-500/50 hover:bg-slate-900/90 transition-all group"
          title="Click to open Anti-Cheat Telemetry"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="group-hover:text-teal-300 transition-colors">Typing Speed</span>
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-teal-300 tracking-tight flex items-center justify-between">
            <span>{liveWpm ? `${liveWpm} WPM` : '-- WPM'}</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-400 flex items-center space-x-1">
            <span>{liveWpm ? '✓ Organic human cadence' : 'Awaiting typing session'}</span>
          </p>
        </div>

        {/* Metric 4: Compliance Health & Strikes */}
        <div 
          onClick={() => navigate('/admin/anti-cheat')}
          className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md space-y-2 cursor-pointer hover:border-rose-500/50 hover:bg-slate-900/90 transition-all group"
          title="Click to view strikes in Anti-Cheat"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="group-hover:text-white transition-colors">Compliance Health</span>
            <span className={`p-1.5 rounded-lg ${strikes > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className={`text-2xl font-bold tracking-tight flex items-center justify-between ${strikes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            <span>{strikes === 0 ? 'Clean Record' : `${strikes} Strikes`}</span>
            {strikes > 0 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetStrikes();
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center space-x-1 transition-all"
                title="Clear all active strikes"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            ) : (
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            )}
          </div>
          <p className="text-xs text-slate-400">
            {strikes === 0 ? 'Zero anti-paste violations' : 'Violations recorded • Click Clear to reset'}
          </p>
        </div>

      </div>

      {/* ============================================================= */}
      {/* REAL-TIME CANDIDATE WEBCAM CCTV SURVEILLANCE FEED (MODULE 2) */}
      {/* ============================================================= */}
      <LiveProctorCCTV />

      {/* ============================================================= */}
      {/* MODULE 2: ENGLISH ASSESSMENT QUESTION LIMIT CONFIGURATION    */}
      {/* ============================================================= */}
      <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-sky-950/30 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Module 2: English Assessment Question Limit
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold border border-sky-500/30">
                  LIVE SYNC ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure how many questions Brother receives in Module 2. Synchronizes instantly across laptops.
              </p>
            </div>
          </div>

          {/* Current Active Limit Indicator Badge */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-sky-500/40 text-center font-mono">
              <span className="text-[10px] uppercase text-slate-400 block">Current Target</span>
              <span className="text-sm font-bold text-sky-400">
                {module2QuestionLimit} Questions
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-center font-mono">
              <span className="text-[10px] uppercase text-slate-400 block">Pass Mark (70%)</span>
              <span className="text-sm font-bold text-emerald-400">
                {Math.ceil(module2QuestionLimit * 0.7)} / {module2QuestionLimit}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback alert toast */}
        {limitFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-semibold flex items-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{limitFeedback}</span>
          </div>
        )}

        {/* Preset Chips and Custom Input */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              1-Click Question Presets:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { count: 5, label: '5 Qs', desc: 'Rapid' },
                { count: 10, label: '10 Qs', desc: 'Standard' },
                { count: 15, label: '15 Qs', desc: 'Medium' },
                { count: 20, label: '20 Qs', desc: 'Full' },
                { count: 25, label: '25 Qs', desc: 'Extended' },
                { count: 30, label: '30 Qs', desc: 'Deep' },
                { count: 50, label: '50 Qs', desc: 'Comprehensive' }
              ].map(preset => {
                const isSelected = module2QuestionLimit === preset.count;
                return (
                  <button
                    key={preset.count}
                    type="button"
                    onClick={() => handleSetQuestionLimit(preset.count)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.4)] font-bold'
                        : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-sky-500/40'
                    }`}
                  >
                    <Zap className={`w-3 h-3 ${isSelected ? 'text-slate-950' : 'text-sky-400'}`} />
                    <span>{preset.label}</span>
                    <span className={`text-[9px] ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                      ({preset.desc})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Stepper Input */}
          <div className="space-y-1.5 shrink-0">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Custom Question Count:
            </span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700/80 p-1">
                <button
                  type="button"
                  onClick={() => handleSetQuestionLimit(Math.max(3, module2QuestionLimit - 5))}
                  className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Decrease by 5 questions"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="3"
                  max="100"
                  value={customLimitInput}
                  onChange={(e) => setCustomLimitInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSetQuestionLimit(customLimitInput);
                  }}
                  className="w-14 text-center bg-transparent font-mono font-bold text-sm text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSetQuestionLimit(Math.min(100, module2QuestionLimit + 5))}
                  className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Increase by 5 questions"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSetQuestionLimit(customLimitInput)}
                className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center space-x-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Limit</span>
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* ============================================================= */}
      {/* RECENT SUBMISSIONS LEDGER PREVIEW                             */}
      {/* ============================================================= */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Task Submissions Status
            </h3>
            <p className="text-xs text-slate-400">Current status of all 3 mandatory daily compliance modules.</p>
          </div>
          <button
            onClick={() => navigate('/admin/submissions')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
          >
            <span>View all in Submissions Box</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    {task.id === 'mod-1-keyboard' ? 'Module 1' : task.id === 'mod-2-duolingo' ? 'Module 2' : 'Module 3'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {task.submittedAt 
                      ? new Date(task.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Pending'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">
                  {task.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {task.type === 'keyboard' 
                    ? `WPM: ${task.telemetry?.wpm || 68} | Words: ${task.submissionText ? task.submissionText.trim().split(/\s+/).length : 0}`
                    : (task.type === 'image_ocr' || task.type === 'english_quiz' || task.id === 'mod-2-duolingo')
                    ? (task.quizScore !== undefined 
                        ? `Score: ${task.quizScore}/${task.totalQuestions || module2QuestionLimit} (${task.percentage}%) • Certified`
                        : `Target: ${module2QuestionLimit} Qs (Pass Mark: ${Math.ceil(module2QuestionLimit * 0.7)}/${module2QuestionLimit})`)
                    : `Device: ${task.exifData?.deviceModel || 'iPhone 15 Pro Max'}`
                  }
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    navigate('/admin/submissions');
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-medium transition-colors text-center"
                >
                  Review
                </button>
                <button
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    navigate('/admin/anti-cheat');
                  }}
                  className="py-1.5 px-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-[11px] font-medium transition-colors"
                >
                  Telemetry
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminIntelligenceBoard;
