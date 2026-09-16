import React, { useState, useEffect } from 'react';
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
  FileCheck2,
  Copy,
  ExternalLink,
  Share2,
  Laptop,
  Flame,
  Radio,
  SlidersHorizontal,
  ChevronUp
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
  const [copiedTestLink, setCopiedTestLink] = useState(false);
  const [copiedHubLink, setCopiedHubLink] = useState(false);

  useEffect(() => {
    setCustomLimitInput(module2QuestionLimit);
  }, [module2QuestionLimit]);

  const candidateTestUrl = `${window.location.origin}/test`;
  const candidateHubUrl = `${window.location.origin}/candidate`;

  const handleCopyLink = (type) => {
    const url = type === 'hub' ? candidateHubUrl : candidateTestUrl;
    navigator.clipboard.writeText(url);
    if (type === 'hub') {
      setCopiedHubLink(true);
      setTimeout(() => setCopiedHubLink(false), 2400);
    } else {
      setCopiedTestLink(true);
      setTimeout(() => setCopiedTestLink(false), 2400);
    }
  };

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
  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const presets = [10, 25, 50, 75, 100];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 relative font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Dynamic Ambient Background Aura */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Real-time floating SaaS notification toast */}
      <CyberNotificationPopup />

      {/* Top Executive Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className={`px-3 py-1 rounded-full border text-[11px] font-bold tracking-wide flex items-center space-x-1.5 ${
              isRedLockdownActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isRedLockdownActive ? 'bg-rose-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <span>{isRedLockdownActive ? 'CRITICAL LOCKDOWN' : 'SUPERVISOR COMMAND DESK'}</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">Candidate: Brother</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5">
            Compliance & Assessment Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time proctor surveillance, AI-powered evaluation, and candidate link dispatcher.
          </p>
        </div>

        {/* Quick Nav Actions */}
        <div className="flex items-center space-x-3">

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/40 text-slate-200 text-xs font-semibold flex items-center space-x-2.5 transition-all shadow-sm cursor-pointer"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>Alerts Feed</span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black font-mono shadow-[0_0_10px_rgba(6,182,212,0.4)] animate-pulse">
                  {unreadCount}
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-600" />
              )}
            </button>

            {/* Dropdown Menu */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-3xl bg-slate-950/95 border border-white/[0.1] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
                  <span className="text-xs font-bold text-white tracking-tight">Recent Submissions</span>
                  <span className="text-[10px] text-cyan-400 font-mono font-semibold">{notifications.length} logged</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      No notifications logged yet.
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
                        className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-cyan-500/40 transition-all cursor-pointer space-y-1.5 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {n.taskTitle}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {n.snippet || n.message}
                        </p>
                        <div className="text-[10px] text-cyan-400 group-hover:underline flex items-center space-x-1 pt-0.5 font-semibold">
                          <span>Inspect in Submissions Box</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.08] text-center">
                  <button
                    onClick={() => {
                      navigate('/admin/submissions');
                      setShowNotificationsDropdown(false);
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    Open All Submissions →
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ============================================================= */}
      {/* CANDIDATE ACCESS & ASSESSMENT DISPATCHER                      */}
      {/* ============================================================= */}
      <div className="rounded-3xl border border-white/[0.09] bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-indigo-950/30 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden">
        
        {/* Subtle top light bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div className="space-y-1.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Share2 className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Candidate Assessment Dispatcher
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                ROOT (/) IS ADMIN PROTECTED
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Default Render URL navigates to Admin Enclave. Dispatch the dedicated test link below to your brother's device to initiate his proctored workstation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0">
            {/* Direct Brother Assessment Test Link */}
            <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-950/80 border border-cyan-500/40 shadow-inner">
              <span className="text-[11px] font-mono text-cyan-300 px-3 truncate max-w-[200px] sm:max-w-[260px]">
                {candidateTestUrl}
              </span>
              <button
                type="button"
                onClick={() => handleCopyLink('test')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.25)] active:scale-95"
              >
                {copiedTestLink ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTestLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <a
                href={candidateTestUrl}
                target="_blank"
                rel="noreferrer"
                title="Launch Candidate Assessment View in new window"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================= */}
      {/* EXECUTIVE KPI STAT CARDS (GRID OF 4 LUXURY GLASS TILES)       */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Daily Completion */}
        <div className="rounded-3xl border border-white/[0.08] bg-slate-900/50 p-6 shadow-xl backdrop-blur-2xl space-y-3 relative overflow-hidden group hover:border-cyan-500/40 hover:bg-slate-900/70 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold tracking-wide">Daily Task Completion</span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight flex items-baseline space-x-2">
            <span>{completedCount}</span>
            <span className="text-base text-slate-500 font-normal">/ {tasks.length} tasks</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Progress</span>
              <span className="font-mono font-bold text-cyan-400">{completionPercent}%</span>
            </div>
            <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/[0.06]">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Pending Reviews (Clickable) */}
        <div 
          onClick={() => navigate('/admin/submissions')}
          className="rounded-3xl border border-white/[0.08] bg-slate-900/50 p-6 shadow-xl backdrop-blur-2xl space-y-3 cursor-pointer hover:border-amber-500/40 hover:bg-slate-900/70 hover:-translate-y-0.5 transition-all group"
          title="Click to open Submissions Box"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold tracking-wide group-hover:text-amber-300 transition-colors">Needs Review</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-between">
            <span>{pendingCount}</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-400">
            {pendingCount > 0 ? (
              <span className="text-amber-400 font-semibold">● Awaiting supervisor sign-off</span>
            ) : (
              'All submissions up to date'
            )}
          </p>
        </div>

        {/* Metric 3: Avg Typing Speed (Clickable to Anti-Cheat) */}
        <div 
          onClick={() => navigate('/admin/anti-cheat')}
          className="rounded-3xl border border-white/[0.08] bg-slate-900/50 p-6 shadow-xl backdrop-blur-2xl space-y-3 cursor-pointer hover:border-teal-500/40 hover:bg-slate-900/70 hover:-translate-y-0.5 transition-all group"
          title="Click to open Anti-Cheat Telemetry"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold tracking-wide group-hover:text-teal-300 transition-colors">Typing Cadence</span>
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-teal-300 tracking-tight flex items-center justify-between">
            <span>{liveWpm ? `${liveWpm} WPM` : '-- WPM'}</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>{liveWpm ? 'Organic human typing cadence' : 'Awaiting typing module launch'}</span>
          </p>
        </div>

        {/* Metric 4: Compliance Health & Strikes */}
        <div 
          onClick={() => navigate('/admin/anti-cheat')}
          className={`rounded-3xl border p-6 shadow-xl backdrop-blur-2xl space-y-3 cursor-pointer transition-all hover:-translate-y-0.5 group ${
            strikes > 0 
              ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-500/60' 
              : 'border-white/[0.08] bg-slate-900/50 hover:border-emerald-500/40 hover:bg-slate-900/70'
          }`}
          title="Click to view strikes in Anti-Cheat"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold tracking-wide group-hover:text-white transition-colors">Integrity Health</span>
            <span className={`p-2 rounded-xl border group-hover:scale-110 transition-transform ${
              strikes > 0 
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className={`text-3xl font-extrabold tracking-tight flex items-center justify-between ${
            strikes > 0 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            <span>{strikes === 0 ? 'Clean Record' : `${strikes} Strikes`}</span>
            {strikes > 0 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetStrikes();
                }}
                className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                title="Clear all active strikes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            ) : (
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            )}
          </div>
          <p className="text-xs text-slate-400">
            {strikes === 0 ? 'Zero security breaches detected' : 'Violations recorded • Click to inspect'}
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
      <div className="rounded-3xl border border-white/[0.09] bg-gradient-to-r from-slate-900/70 via-slate-900/60 to-sky-950/30 p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Module 2: Question Pool Engine & Pass Mark
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 font-mono text-[10px] font-bold border border-sky-500/30">
                  REAL-TIME SYNC
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize how many questions Brother receives. Dynamically recalibrates the 70% pass mark.
              </p>
            </div>
          </div>

          {/* Stepper + Pass Mark Badges */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Pass Mark (70%) Badge */}
            <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-center font-mono shadow-inner">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Pass Mark (70%)</span>
              <span className="text-sm font-black text-emerald-400">
                {Math.ceil(module2QuestionLimit * 0.7)} / {module2QuestionLimit} Qs
              </span>
            </div>

            {/* Custom Question Stepper */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center rounded-2xl bg-slate-950/80 border border-white/[0.09] p-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    const current = parseInt(customLimitInput, 10) || module2QuestionLimit || 50;
                    handleSetQuestionLimit(Math.max(3, current - 5));
                  }}
                  className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
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
                  onClick={() => {
                    const current = parseInt(customLimitInput, 10) || module2QuestionLimit || 50;
                    handleSetQuestionLimit(Math.min(100, current + 5));
                  }}
                  className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Increase by 5 questions"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSetQuestionLimit(customLimitInput)}
                className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs font-mono flex items-center space-x-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Apply Limit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Presets Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Presets:</span>
          {presets.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => handleSetQuestionLimit(p)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                module2QuestionLimit === p
                  ? 'bg-sky-500 text-slate-950 shadow-[0_0_10px_rgba(14,165,233,0.4)]'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06]'
              }`}
            >
              {p} Qs {p === 50 && '(Default)'}
            </button>
          ))}
        </div>

        {/* Feedback alert toast */}
        {limitFeedback && (
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-semibold flex items-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{limitFeedback}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminIntelligenceBoard;
