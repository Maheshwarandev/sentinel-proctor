import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronUp,
  Type,
  Brain,
  Target,
  AlertTriangle,
  Terminal,
  Edit3,
  Cpu
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';
import { CyberNotificationPopup } from './CyberNotificationPopup';
import { LiveProctorCCTV } from './LiveProctorCCTV';
import { PageHeader, StatCard, Card, Badge } from './ui';

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
    module2UnlockedDay = 1,
    resetModule2ToDay1
  } = useForensics();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [copiedTestLink, setCopiedTestLink] = useState(false);
  const [copiedHubLink, setCopiedHubLink] = useState(false);
  const [module2ResetFeedback, setModule2ResetFeedback] = useState(null);

  // Module 1 word target
  const [module1WordTarget] = useState(() => {
    const saved = localStorage.getItem('module1_word_target');
    return saved ? parseInt(saved, 10) : 300;
  });

  // Weakness Heatmap & Session Log Querying
  const [sessionLogs, setSessionLogs] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchRecentLogs = async () => {
      try {
        const res = await fetch('/api/submissions');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.submissions)) {
          setSessionLogs(data.submissions);
        }
      } catch (err) {
        console.warn('[AdminIntelligenceBoard] Could not load submissions for heatmap:', err);
      }
    };

    fetchRecentLogs();
    const interval = setInterval(fetchRecentLogs, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Compute category accuracy & weakness diagnostics
  const weaknessStats = useMemo(() => {
    const categoryMap = {};

    // 1. Process from recent MongoDB SessionLogs
    sessionLogs.forEach(session => {
      const questions = session.module2Assessment || session.results || [];
      if (Array.isArray(questions)) {
        questions.forEach(q => {
          const category = q.category || 'General';
          if (!categoryMap[category]) {
            categoryMap[category] = { total: 0, correct: 0, incorrect: 0 };
          }
          categoryMap[category].total += 1;
          if (q.isCorrect) {
            categoryMap[category].correct += 1;
          } else {
            categoryMap[category].incorrect += 1;
          }
        });
      }
    });

    // 2. Also incorporate current active/submitted quiz task results from ForensicContext
    const duoTask = tasks.find(t => t.id === 'mod-2-duolingo');
    if (duoTask && Array.isArray(duoTask.results) && duoTask.results.length > 0) {
      duoTask.results.forEach(q => {
        const category = q.category || 'General';
        if (!categoryMap[category]) {
          categoryMap[category] = { total: 0, correct: 0, incorrect: 0 };
        }
        categoryMap[category].total += 1;
        if (q.isCorrect) {
          categoryMap[category].correct += 1;
        } else {
          categoryMap[category].incorrect += 1;
        }
      });
    }

    const categories = Object.entries(categoryMap).map(([category, stats]) => {
      const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      return {
        category,
        accuracy,
        total: stats.total,
        correct: stats.correct,
        incorrect: stats.incorrect
      };
    });

    // Sort ascending by accuracy: weakest categories appear first!
    categories.sort((a, b) => a.accuracy - b.accuracy);

    return categories;
  }, [sessionLogs, tasks]);

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

  const unreadCount = notifications.filter(n => !n.read).length;
  const completedCount = tasks.filter(t => t.status === 'SUBMITTED' || t.status === 'VERIFIED').length;
  const pendingCount = tasks.filter(t => t.status === 'SUBMITTED' && !t.auditorVerdict).length;
  const keyboardTask = tasks.find(t => t.id === 'mod-1-keyboard');
  const liveWpm = keyboardTask?.telemetry?.wpm;
  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 relative font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Real-time floating SaaS notification toast */}
      <CyberNotificationPopup />

      {/* Top Executive Header & Overview */}
      <PageHeader
        title="Compliance & Assessment Console"
        subtitle="Real-time proctor surveillance, AI-powered evaluation, and candidate link dispatcher."
        badge={
          <div className="flex items-center gap-2">
            <Badge 
              variant={isRedLockdownActive ? 'danger' : 'info'} 
              dot 
              pulse
            >
              {isRedLockdownActive ? 'CRITICAL LOCKDOWN' : 'SUPERVISOR COMMAND DESK'}
            </Badge>
            <span className="text-xs text-slate-400 font-medium">Candidate: Brother</span>
          </div>
        }
        actions={
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/40 text-slate-200 text-xs font-semibold flex items-center space-x-2.5 transition-all shadow-sm cursor-pointer"
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
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl bg-slate-950/95 border border-white/[0.1] p-4 shadow-xl z-50 animate-slide-up backdrop-blur-2xl">
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
                        className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-cyan-500/40 transition-all cursor-pointer space-y-1.5 group"
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
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                  >
                    Open All Submissions â†’
                  </button>
                </div>
              </div>
            )}
          </div>
        }
      />

      {/* ============================================================= */}
      {/* CANDIDATE ACCESS & ASSESSMENT DISPATCHER                      */}
      {/* ============================================================= */}
      <Card variant="accent" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm">
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
            <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 shadow-inner">
              <span className="text-[11px] font-mono text-cyan-300 px-3 truncate max-w-[200px] sm:max-w-[260px]">
                {candidateTestUrl}
              </span>
              <button
                type="button"
                onClick={() => handleCopyLink('test')}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
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
      </Card>

      {/* ============================================================= */}
      {/* EXECUTIVE KPI STAT CARDS (GRID OF 4 STAT CARDS)               */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Daily Completion */}
        <StatCard
          label="Daily Task Completion"
          value={`${completedCount} / ${tasks.length}`}
          progress={completionPercent}
          progressColor="bg-gradient-to-r from-cyan-500 to-teal-400"
          subtext={completedCount === tasks.length ? "All tasks completed âœ“" : "Tasks in progress"}
          icon={<FileCheck2 className="w-4 h-4" />}
          variant="default"
        />

        {/* Metric 2: Pending Reviews (Clickable) */}
        <StatCard
          label="Needs Review"
          value={pendingCount}
          subtext={pendingCount > 0 ? "Awaiting supervisor sign-off" : "All submissions up to date"}
          icon={<Clock className="w-4 h-4" />}
          variant={pendingCount > 0 ? "warning" : "default"}
          onClick={() => navigate('/admin/submissions')}
        />

        {/* Metric 3: Avg Typing Speed (Clickable) */}
        <StatCard
          label="Typing Cadence"
          value={liveWpm ? `${liveWpm} WPM` : "-- WPM"}
          subtext={liveWpm ? "Organic human typing cadence" : "Awaiting typing module launch"}
          icon={<Activity className="w-4 h-4" />}
          variant="default"
          onClick={() => navigate('/admin/anti-cheat')}
        />

        {/* Metric 4: Compliance Health & Strikes */}
        <StatCard
          label="Integrity Health"
          value={strikes === 0 ? "Clean Record" : `${strikes} Strikes`}
          subtext={strikes === 0 ? "Zero security breaches detected" : "Violations recorded â€¢ Click to inspect"}
          icon={<ShieldCheck className="w-4 h-4" />}
          variant={strikes > 0 ? "danger" : "success"}
          onClick={() => navigate('/admin/anti-cheat')}
        />
      </div>

      {/* ============================================================= */}
      {/* REAL-TIME CANDIDATE WEBCAM CCTV SURVEILLANCE FEED (MODULE 2) */}
      {/* ============================================================= */}
      <LiveProctorCCTV />

      {/* ============================================================= */}
      {/* WEAKNESS HEATMAP: TECHNICAL & LINGUISTIC ACCURACY MAPPING    */}
      {/* ============================================================= */}
      <Card className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Weakness Heatmap & Topic Diagnostics
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/30">
                  AI GEMINI TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregates candidate's correct and incorrect quiz answers grouped by technical and linguistic category tags.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto font-mono text-xs">
            <span className="text-slate-400">Total Evaluated:</span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-white/[0.08] text-cyan-400 font-bold">
              {weaknessStats.reduce((acc, c) => acc + c.total, 0)} Questions
            </span>
          </div>
        </div>

        {weaknessStats.length === 0 ? (
          <div className="py-8 text-center space-y-2 border border-dashed border-white/[0.08] rounded-2xl bg-white/[0.01]">
            <Target className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-300">
              No Module 2 assessment answers logged yet
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Once Brother completes his AI-deal English/Coding assessment, his accuracy percentage by category (e.g., JS-Loops, EN-Grammar) will populate here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weaknessStats.map(item => {
                const isWeak = item.accuracy < 50;
                const isModerate = item.accuracy >= 50 && item.accuracy < 75;
                const badgeColor = isWeak 
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                  : isModerate 
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                const barGradient = isWeak 
                  ? 'bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' 
                  : isModerate 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
                const statusLabel = isWeak ? 'Needs Practice' : isModerate ? 'Moderate' : 'Proficient';

                return (
                  <div 
                    key={item.category} 
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white font-mono">{item.category}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${badgeColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <div className="flex items-baseline space-x-1.5 font-mono">
                        <span className="text-sm font-black text-white">{item.accuracy}%</span>
                        <span className="text-[10px] text-slate-500">
                          ({item.incorrect} missed / {item.total})
                        </span>
                      </div>
                    </div>

                    {/* Heatmap Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/[0.06] p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out ${barGradient}`}
                        style={{ width: `${Math.max(4, Math.min(100, item.accuracy))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Diagnostic Alert if Weaknesses Exist */}
            {weaknessStats.some(w => w.accuracy < 50) && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 font-mono">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Critical Weakness Detected in: <strong>{weaknessStats.filter(w => w.accuracy < 50).map(w => w.category).join(', ')}</strong>. Recommend assigning targeted exercises.
                </span>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ============================================================= */}
      {/* 3-MODULE DEDICATED CONTROL HUBS                               */}
      {/* ============================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Dedicated Module Controls</h2>
            <p className="text-xs text-slate-400 mt-0.5">Individual dedicated consoles to configure and supervise each module</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Module 1 Hub Card */}
          <Card 
            onClick={() => navigate('/admin/module-1')}
            className="p-5 flex flex-col justify-between hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Terminal className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-cyan-300">
                  MODULE 01
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Keyboard Typing Practice
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Configure target word quotas ({module1WordTarget} words), inspect keystroke cadence, review live typed drafts, and record verdicts.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span>Open Module 1 Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* Module 2 Hub Card */}
          <Card 
            onClick={() => navigate('/admin/module-2')}
            className="p-5 flex flex-col justify-between hover:border-amber-500/50 hover:bg-slate-900/90 transition-all cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5" />
                </span>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    DAY {module2UnlockedDay || 1}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-amber-300">
                    MODULE 02
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  English & Coding 3-Pillar Quest
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Supervisor Day-by-Day unlock controller, 7 PM – 10 PM daily schedule window, question pool limit ({module2QuestionLimit} Qs), and weakness heatmaps.
                </p>
                {module2ResetFeedback && (
                  <p className="text-[11px] text-emerald-400 font-mono font-bold mt-2 animate-fade-in">
                    ✓ {module2ResetFeedback}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Reset Module 2 progress back to Day 1?")) {
                    resetModule2ToDay1();
                    setModule2ResetFeedback("Reset to Day 1!");
                    setTimeout(() => setModule2ResetFeedback(null), 3000);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Reset Module 2 quest back to Day 1"
              >
                <RotateCcw className="w-3 h-3 text-rose-400" />
                <span>Reset to Day 1</span>
              </button>

              <div className="flex items-center text-xs text-amber-400 font-semibold group-hover:text-amber-300 transition-colors">
                <span>Open Console</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>

          {/* Module 3 Hub Card */}
          <Card 
            onClick={() => navigate('/admin/module-3')}
            className="p-5 flex flex-col justify-between hover:border-teal-500/50 hover:bg-slate-900/90 transition-all cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                  <Edit3 className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-teal-300">
                  MODULE 03
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                  Handwritten Writing Practice
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Select active daily writing topics, inspect submitted handwritten notebook photos with zoom, and record auditor compliance verdicts.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-teal-400 font-semibold">
              <span>Open Module 3 Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* Module 4 Hub Card */}
          <Card 
            onClick={() => navigate('/admin/module-4')}
            className="p-5 flex flex-col justify-between hover:border-sky-500/50 hover:bg-slate-900/90 transition-all cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                  <Cpu className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-sky-300">
                  MODULE 04
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  Tech & Hardware Mastery
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Physical PC parts, hardware architecture, essential tech acronyms, and drill passing threshold.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-sky-400 font-semibold">
              <span>Open Module 4 Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

        </div>
      </div>

    </div>
  );
};

export default AdminIntelligenceBoard;
