import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  Calendar,
  Sparkles,
  Trophy,
  RefreshCw,
  Brain,
  Target,
  Play
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';
import { PageHeader, StatCard, Card, Badge, Button } from './ui';
import { CyberNotificationPopup } from './CyberNotificationPopup';

export const AdminModule2Page = () => {
  const { 
    tasks, 
    module2QuestionLimit = 50, 
    updateModule2QuestionLimit,
    module2UnlockedDay = 1,
    resetModule2ToDay1,
    updateModule2UnlockedDay,
    module2WindowEnabled = true,
    module2WindowStartHour = 19,
    module2WindowEndHour = 22,
    module2AdminBypass = false,
    updateModule2WindowEnabled,
    updateModule2AdminBypass,
    updateModule2WindowHours,
    getModule2TimeStatus,
    notifications,
    checkTaskFromNotification
  } = useForensics();

  const duoTask = tasks.find(t => t.id === 'mod-2-duolingo') || {
    id: 'mod-2-duolingo',
    title: 'English Assessment',
    status: 'PENDING',
    results: []
  };

  const unlockedDay = Math.max(1, module2UnlockedDay);

  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const saved = localStorage.getItem('module2_completed_days');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Question limit input
  const [customLimitInput, setCustomLimitInput] = useState(module2QuestionLimit);
  const [limitFeedback, setLimitFeedback] = useState(null);
  const [timeFeedback, setTimeFeedback] = useState(null);

  // 1-second live clock ticker
  const [, setTimeTick] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setTimeTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStatus = typeof getModule2TimeStatus === 'function' 
    ? getModule2TimeStatus() 
    : { isActive: true, isBypassed: false, isEnabled: false, formattedWindow: "7:00 PM – 10:00 PM", statusLabel: "ACTIVE", countdownOpen: "00:00:00", countdownClose: "00:00:00" };

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
        console.warn('[AdminModule2Page] Could not load submissions for heatmap:', err);
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

    categories.sort((a, b) => a.accuracy - b.accuracy);
    return categories;
  }, [sessionLogs, duoTask]);

  // Day Reset handler
  const handleResetToDay1 = () => {
    if (window.confirm("Reset Module 2 progress back to Day 1?")) {
      resetModule2ToDay1();
      setCompletedDays([]);
      setLimitFeedback("Day progress reset to Day 1 (broadcasted to candidate).");
      setTimeout(() => setLimitFeedback(null), 3500);
    }
  };

  const handleSelectActiveDay = (dayNum) => {
    const parsed = Math.max(1, Math.min(30, parseInt(dayNum, 10) || 1));
    updateModule2UnlockedDay(parsed);
    setLimitFeedback(`Active Day set to Day ${parsed} (broadcasted to candidate).`);
    setTimeout(() => setLimitFeedback(null), 3500);
  };

  const handleSaveQuestionLimit = async (limit) => {
    const success = await updateModule2QuestionLimit(limit);
    if (success) {
      setLimitFeedback(`Question limit updated to ${limit} questions.`);
      setTimeout(() => setLimitFeedback(null), 3500);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
      {notifications?.length > 0 && (
        <CyberNotificationPopup 
          notifications={notifications} 
          onCheckTask={checkTaskFromNotification} 
        />
      )}

      {/* Page Header */}
      <PageHeader
        badge={
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>MODULE 02 CONTROL CONSOLE</span>
            </span>
          </div>
        }
        title="Module 2: 3-Pillar Daily Learning Quest"
        subtitle="Manage the 30-day sequential unlocking curriculum, set question limits, and view category weakness heatmaps."
        actions={
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetToDay1}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
              title="Reset Module 2 progress to Day 1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset to Day 1</span>
            </button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Day (Supervisor Set)"
          value={`Day ${unlockedDay} / 30`}
          subtext="Standby until supervisor starts"
          icon={<Calendar className="w-4 h-4 text-amber-400" />}
        />
        <StatCard
          label="Completed Days"
          value={`${completedDays.length} / 30 Done`}
          subtext="Recorded passed sessions"
          progress={Math.round((completedDays.length / 30) * 100)}
          progressColor="bg-emerald-500"
          icon={<Trophy className="w-4 h-4 text-emerald-400" />}
        />
        <StatCard
          label="Question Limit per Session"
          value={`${module2QuestionLimit} Questions`}
          subtext="70% pass threshold required"
          icon={<Target className="w-4 h-4 text-cyan-400" />}
        />
        <StatCard
          label="Latest Quiz Score"
          value={duoTask.quizScore ? `${duoTask.quizScore} / ${duoTask.totalQuestions || module2QuestionLimit}` : 'Awaiting Test'}
          subtext={duoTask.percentage ? `${duoTask.percentage}% accuracy verified` : 'No score recorded yet'}
          variant={duoTask.status === 'VERIFIED' ? 'success' : 'default'}
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Main Grid: Controls & 4-Pillars / Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Supervisor Day Controller & Question Limit (6 cols) */}
        <div className="lg:col-span-6 space-y-6">

          {/* Supervisor Day Control Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Supervisor Day-by-Day Controller</h3>
              </div>
              <Badge variant="warning">Manual Command</Badge>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Control when each day starts. The candidate will remain on the commanded day until you choose to unlock the next session.
            </p>

            {/* Set Active Day Dropdown & Reset */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex-1 min-w-[160px]">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Select Active Day:
                </label>
                <select
                  value={unlockedDay}
                  onChange={(e) => handleSelectActiveDay(e.target.value)}
                  className="w-full bg-slate-950 border border-white/[0.12] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>
                      Day {d} {d === 1 ? '(Default Start)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="shrink-0 pt-5">
                <button
                  type="button"
                  onClick={handleResetToDay1}
                  className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reset to Day 1</span>
                </button>
              </div>
            </div>

            {limitFeedback && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{limitFeedback}</span>
              </div>
            )}
          </Card>

          {/* Question Limit Configuration Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Questions per Assessment</h3>
              </div>
              <Badge variant="info">Synced with Dealer API</Badge>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Configure how many questions Gemini AI deals for each assessment session. Default is 50, but you can set 5 or 10 for quick drills.
            </p>

            {/* Quick Limit Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Quick Presets:
              </span>
              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 15, 25, 50].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSaveQuestionLimit(val)}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                      module2QuestionLimit === val
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-800/80 text-slate-300 border-white/[0.08] hover:bg-slate-700'
                    }`}
                  >
                    {val} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="pt-1">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Custom Question Count:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="3"
                  max="100"
                  value={customLimitInput}
                  onChange={(e) => setCustomLimitInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-white/[0.12] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                  placeholder="50"
                />
                <button
                  type="button"
                  onClick={() => handleSaveQuestionLimit(customLimitInput)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </Card>

          {/* 7:00 PM – 10:00 PM Daily Schedule Access Window Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Daily 7:00 PM – 10:00 PM Schedule Window</h3>
              </div>
              {module2AdminBypass ? (
                <Badge variant="warning">Testing Bypass</Badge>
              ) : timeStatus.isActive ? (
                <Badge variant="success" dot pulse>Window Active</Badge>
              ) : (
                <Badge variant="neutral">Window Locked</Badge>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Enforce candidate access strictly between 7:00 PM and 10:00 PM daily. Outside of this window, the candidate roadmap displays a countdown lock.
            </p>

            {/* Current Real-Time Live Status */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/[0.08] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">
                  Live Status
                </div>
                <div className="text-sm font-bold flex items-center space-x-2">
                  <span className={timeStatus.isActive ? "text-emerald-400" : "text-amber-400"}>
                    {timeStatus.isBypassed 
                      ? "⚡ Testing Bypass Active (Anytime Allowed)" 
                      : timeStatus.isActive 
                      ? `🟢 Window Open • Closes in ${timeStatus.countdownClose}` 
                      : `🔒 Locked • Opens in ${timeStatus.countdownOpen}`}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">
                  Scheduled Window
                </div>
                <div className="text-xs font-mono font-bold text-cyan-400">
                  {timeStatus.formattedWindow}
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="space-y-3 pt-1">
              {/* Window Enforcement Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div>
                  <div className="text-xs font-bold text-white">Enforce 7 PM – 10 PM Schedule</div>
                  <div className="text-[11px] text-slate-400">Locks Module 2 outside of 7:00 PM to 10:00 PM</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !module2WindowEnabled;
                    updateModule2WindowEnabled(nextVal);
                    setTimeFeedback(nextVal ? "Window policy enabled!" : "Window policy disabled!");
                    setTimeout(() => setTimeFeedback(null), 3000);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    module2WindowEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {module2WindowEnabled ? 'Enforced ✓' : 'Disabled'}
                </button>
              </div>

              {/* Admin Instant Testing Bypass Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div>
                  <div className="text-xs font-bold text-white">Admin Testing Bypass</div>
                  <div className="text-[11px] text-slate-400">Bypass time restrictions right now to test candidate flow</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !module2AdminBypass;
                    updateModule2AdminBypass(nextVal);
                    setTimeFeedback(nextVal ? "Admin bypass enabled (testing allowed anytime)!" : "Admin bypass disabled (strict 7-10 PM enforced)!");
                    setTimeout(() => setTimeFeedback(null), 3000);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    module2AdminBypass
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                      : 'bg-white/[0.05] text-slate-300 border border-white/[0.1] hover:bg-white/[0.1]'
                  }`}
                >
                  {module2AdminBypass ? 'Bypass Active ⚡' : 'Strict 7-10 PM'}
                </button>
              </div>
            </div>

            {timeFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono flex items-center space-x-1.5 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{timeFeedback}</span>
              </div>
            )}
          </Card>

        </div>

        {/* Right Column: 3-Pillars & Student Weakness Heatmap (6 cols) */}
        <div className="lg:col-span-6 space-y-6">

          {/* 3 Pillars Overview Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">3 Essential Daily Disciplines</h3>
              </div>
              <Badge variant="success">Standardized</Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/25 flex items-start space-x-2.5">
                <span className="text-base">💻</span>
                <div>
                  <h4 className="font-bold text-emerald-300">Pillar 1: Basic Coding</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Variables, let/const, simple if-else, for loops, functions, array index, console.log.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/25 flex items-start space-x-2.5">
                <span className="text-base">📖</span>
                <div>
                  <h4 className="font-bold text-purple-300">Pillar 2: English Grammar</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Present/past/future tenses, prepositions, articles, and sentence construction.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-950/20 border border-sky-500/25 flex items-start space-x-2.5">
                <span className="text-base">🗣️</span>
                <div>
                  <h4 className="font-bold text-sky-300">Pillar 3: English Fluency & Spoken Practice</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Workplace greetings, video call dialogue, and native audio listen-and-repeat practice.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Student Category Weakness Heatmap */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Student Category Weakness Heatmap</h3>
              </div>
              <Badge variant="neutral">Auto-Evaluated</Badge>
            </div>

            {weaknessStats.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No session questions evaluated yet. Run a practice test to populate accuracy diagnostics.
              </p>
            ) : (
              <div className="space-y-3">
                {weaknessStats.map(stat => (
                  <div key={stat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{stat.category}</span>
                      <span className={`font-mono font-bold ${
                        stat.accuracy >= 75 ? 'text-emerald-400' : stat.accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {stat.accuracy}% ({stat.correct}/{stat.total})
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/[0.06]">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          stat.accuracy >= 75 ? 'bg-emerald-500' : stat.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${stat.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>

      </div>

    </div>
  );
};

export default AdminModule2Page;
