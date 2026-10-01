import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Zap, 
  Trophy, 
  ChevronRight, 
  Play, 
  RotateCcw,
  Compass,
  Star,
  RefreshCw,
  Sliders,
  Calendar,
  Layers,
  Clock,
  AlertTriangle,
  ShieldCheck,
  X
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';

// The 3 Daily Core Disciplines (Pillars)
const CODING_PILLARS = [
  "Variables & Data Storage (let, const)",
  "Conditionals & Decisions (if, else)",
  "Loops & Repetitive Code (for, while)",
  "Functions & Reusable Logic",
  "Arrays & Data Lists ([0, 1, 2])",
  "String Manipulation & Quotes",
  "Boolean Flags & Comparison (true/false)",
  "Array Methods (.push, .length)",
  "Debugging & Console Messages (console.log)",
  "Simple Object Properties ({ key: val })"
];

const GRAMMAR_PILLARS = [
  "Present Simple & Daily Routines",
  "Past Simple & Yesterday's Tasks",
  "Future Intentions (will & going to)",
  "Present Continuous (am/is/are + ing)",
  "Prepositions of Place (in, on, at)",
  "Helping Verbs & Questions (do, does, did)",
  "Modal Verbs of Ability (can, could, should)",
  "Subject-Verb Agreement (is vs are)",
  "Articles & References (a, an, the)",
  "Sentence Conjunctions (and, but, because)"
];

const FLUENCY_PILLARS = [
  "Workplace Greetings & Introductions",
  "Asking for Help & Technical Support",
  "Confirming Deadlines & Task Schedules",
  "Explaining How Your Code Works",
  "Active Listening & Polite Agreement",
  "Professional Video Meeting Communication",
  "Reporting Completed Bug Fixes",
  "Handling Technical Clarification",
  "Writing Polite Email Closings",
  "Expressing Clear Professional Opinions"
];

// Generate 30 structured 3-Pillar Daily Sessions
export const MODULE_2_SESSIONS = Array.from({ length: 30 }, (_, idx) => {
  const day = idx + 1;
  const coding = CODING_PILLARS[(day - 1) % CODING_PILLARS.length];
  const grammar = GRAMMAR_PILLARS[(day - 1) % GRAMMAR_PILLARS.length];
  const fluency = FLUENCY_PILLARS[(day - 1) % FLUENCY_PILLARS.length];

  return {
    day,
    title: `Day ${day}: 3-Pillar Daily Practice`,
    category: "Daily Core",
    coding,
    grammar,
    fluency,
    focus: `Daily 3-Pillar Routine: Basic Coding (${coding}) • English Grammar (${grammar}) • Spoken Fluency (${fluency}).`,
    difficulty: day <= 10 ? "Beginner" : day <= 20 ? "Intermediate" : "Advanced",
    xp: 30 + day * 2
  };
});

export const Module2RoadmapLanding = ({ 
  onBack, 
  onStartSession, 
  duolingoTask,
  questionLimit = 50 
}) => {
  const { 
    module2UnlockedDay = 1,
    getModule2TimeStatus,
    module2WindowEnabled = true,
    module2AdminBypass = false,
    updateModule2AdminBypass
  } = useForensics();
  const unlockedDay = Math.max(1, module2UnlockedDay);

  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const saved = localStorage.getItem('module2_completed_days');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Practice mode: allow opening any lesson freely for review
  const [practiceMode, setPracticeMode] = useState(false);
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'UNLOCKED'
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [selectedLockedSession, setSelectedLockedSession] = useState(null);

  // 1-second live clock ticker for real-time countdown to 7:00 PM / 10:00 PM
  const [, setTimeTick] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setTimeTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStatus = typeof getModule2TimeStatus === 'function' 
    ? getModule2TimeStatus() 
    : { isActive: true, isBypassed: false, isEnabled: false, formattedWindow: "7:00 PM – 10:00 PM", statusLabel: "ACTIVE", countdownOpen: "00:00:00", countdownClose: "00:00:00" };

  const isWindowActive = timeStatus.isActive || practiceMode;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('module2_completed_days');
      if (saved) setCompletedDays(JSON.parse(saved));
    } catch (e) {}
  }, [module2UnlockedDay]);

  const handleLaunchSession = (session) => {
    const isCompleted = isSessionCompleted(session.day);
    // If completed or practice mode is on, candidate can always review
    if (isCompleted || practiceMode) {
      onStartSession?.(session);
      return;
    }

    // Check if the current time window is active (7:00 PM – 10:00 PM)
    if (!isWindowActive) {
      setSelectedLockedSession(session);
      setShowLockedModal(true);
      return;
    }

    onStartSession?.(session);
  };

  const isSessionUnlocked = (day) => {
    if (practiceMode) return true;
    return day <= unlockedDay;
  };

  const isSessionCompleted = (day) => {
    return completedDays.includes(day);
  };

  const filteredSessions = MODULE_2_SESSIONS.filter(session => {
    if (filterMode === 'UNLOCKED') {
      return isSessionUnlocked(session.day);
    }
    return true;
  });

  const totalCompleted = completedDays.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#080c14] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] select-none">
      {/* Dynamic Background Grid & Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(rgba(14,165,233,0.06)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Fixed Command Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer text-xs font-bold shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Back to Workstation</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Center Brand / Module identity */}
          <div className="flex items-center space-x-2 text-center">
            <span className="p-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-white tracking-tight flex items-center space-x-1.5">
                <span>Module 2: Daily 3-Pillar Learning Quest</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                  ACTIVE: DAY {unlockedDay}
                </span>
              </div>
            </div>
          </div>

          {/* Candidate Quest Stats */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              <span>{totalCompleted}/30 COMPLETED</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6 relative z-10">

        {/* ============================================================= */}
        {/* CANDIDATE QUEST BANNER: 3-PILLAR STRUCTURE & TODAY'S MISSION  */}
        {/* ============================================================= */}
        <div className="rounded-2xl border border-sky-500/25 bg-slate-900/80 p-4 sm:p-5 shadow-lg backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Daily Pillars Explanation */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-mono font-bold">
                  <Layers className="w-3 h-3 text-sky-400" />
                  <span>DAILY 3-DISCIPLINE STRUCTURE</span>
                </span>

                {/* 7 PM - 10 PM Schedule Window Status Indicator */}
                {timeStatus.isActive ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 text-[11px] font-mono font-bold animate-pulse">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>7:00 PM – 10:00 PM WINDOW ACTIVE • CLOSES IN {timeStatus.countdownClose}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/35 text-[11px] font-mono font-bold">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>DAILY ACCESS: 7:00 PM – 10:00 PM • OPENS IN {timeStatus.countdownOpen}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400">
                Every daily lesson evaluates 3 foundational areas: Basic Coding, English Grammar, and Spoken Fluency.
              </p>

              {/* 3 Pillars Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <span>💻</span>
                  <span>Basic Coding</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  <span>📖</span>
                  <span>English Grammar</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-sky-950/50 border border-sky-500/30 text-sky-300 text-xs font-semibold">
                  <span>🗣️</span>
                  <span>Spoken Fluency</span>
                </span>
              </div>
            </div>

            {/* Candidate Today Launch CTA */}
            <div className="flex items-center gap-3 shrink-0 bg-slate-950/90 p-3 rounded-xl border border-sky-500/30">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Today's Assigned Session</p>
                <p className="text-xs font-bold text-white">Day {unlockedDay} Curriculum</p>
              </div>
              {isWindowActive ? (
                <button
                  type="button"
                  onClick={() => handleLaunchSession(MODULE_2_SESSIONS.find(s => s.day === unlockedDay) || MODULE_2_SESSIONS[0])}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-300 hover:to-cyan-400 text-slate-950 text-xs font-black flex items-center space-x-1.5 cursor-pointer shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Start Day {unlockedDay} Quest</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleLaunchSession(MODULE_2_SESSIONS.find(s => s.day === unlockedDay) || MODULE_2_SESSIONS[0])}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-95"
                  title="Session is locked outside 7:00 PM – 10:00 PM"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Locked until 7 PM ({timeStatus.countdownOpen})</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ============================================================= */}
        {/* ROADMAP TOOLBAR: FILTERS & FRIENDLY PRACTICE MODE TOGGLE     */}
        {/* ============================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Sequential 30-Day Path (3-Pillar Everyday)
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              ({filteredSessions.length} visible)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Pills */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/[0.08] text-xs">
              <button
                type="button"
                onClick={() => setFilterMode('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterMode === 'ALL'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All 30 Days
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('UNLOCKED')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterMode === 'UNLOCKED'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unlocked Only ({unlockedDay})
              </button>
            </div>

            {/* User-Friendly Practice Mode Override Switch */}
            <button
              type="button"
              onClick={() => setPracticeMode(!practiceMode)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                practiceMode
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200'
              }`}
              title="Practice any day freely without waiting"
            >
              {practiceMode ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
              <span>{practiceMode ? 'Practice Mode: All Unlocked ✓' : 'Practice Any Day'}</span>
            </button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* SEQUENTIAL DAY-BY-DAY ROADMAP GRID (1 TO 30)                 */}
        {/* ============================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => {
            const unlocked = isSessionUnlocked(session.day);
            const completed = isSessionCompleted(session.day);
            const isCurrentToday = session.day === unlockedDay && !completed;

            return (
              <div
                key={session.day}
                className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
                  isCurrentToday
                    ? 'bg-gradient-to-b from-sky-950/40 via-slate-900/80 to-slate-900/60 border-sky-500/60 shadow-[0_0_25px_rgba(14,165,233,0.2)] ring-1 ring-sky-500/40'
                    : completed
                    ? 'bg-slate-900/50 border-emerald-500/30 hover:border-emerald-500/50'
                    : unlocked
                    ? 'bg-slate-900/60 border-white/[0.08] hover:border-sky-500/40'
                    : 'bg-slate-950/40 border-white/[0.04] opacity-60'
                }`}
              >
                {/* Top status & day counter */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center border shadow-sm ${
                        isCurrentToday
                          ? 'bg-sky-500 text-slate-950 border-sky-400'
                          : completed
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : unlocked
                          ? 'bg-slate-800 text-slate-200 border-white/[0.08]'
                          : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}>
                        {String(session.day).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {session.difficulty}
                      </span>
                    </div>

                    {/* Status Pill */}
                    {completed ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold font-mono">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>COMPLETED</span>
                      </span>
                    ) : isCurrentToday ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-black font-mono animate-pulse">
                        <Star className="w-3 h-3 text-sky-400 fill-sky-400" />
                        <span>READY TODAY</span>
                      </span>
                    ) : unlocked ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300 text-[10px] font-bold font-mono">
                        <Unlock className="w-3 h-3 text-cyan-400" />
                        <span>UNLOCKED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900 text-slate-500 text-[10px] font-mono border border-slate-800">
                        <Lock className="w-3 h-3 text-slate-600" />
                        <span>LOCKED</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`text-base font-bold tracking-tight mb-2 transition-colors ${
                    isCurrentToday 
                      ? 'text-white group-hover:text-sky-300' 
                      : completed 
                      ? 'text-slate-200 group-hover:text-emerald-300'
                      : unlocked 
                      ? 'text-white group-hover:text-sky-300' 
                      : 'text-slate-500'
                  }`}>
                    {session.title}
                  </h3>

                  {/* 3 Pillars Breakdown per Day Card */}
                  <div className="space-y-1.5 my-3 text-[11px]">
                    <div className="flex items-center space-x-1.5 bg-emerald-950/30 px-2 py-1 rounded-lg border border-emerald-500/20 text-emerald-300">
                      <span>💻</span>
                      <span className="font-bold text-slate-300">Coding:</span>
                      <span className="truncate">{session.coding}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-purple-950/30 px-2 py-1 rounded-lg border border-purple-500/20 text-purple-300">
                      <span>📖</span>
                      <span className="font-bold text-slate-300">Grammar:</span>
                      <span className="truncate">{session.grammar}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-sky-950/30 px-2 py-1 rounded-lg border border-sky-500/20 text-sky-300">
                      <span>🗣️</span>
                      <span className="font-bold text-slate-300">Fluency:</span>
                      <span className="truncate">{session.fluency}</span>
                    </div>
                  </div>

                </div>

                {/* Footer Action */}
                <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-slate-500">
                    +{session.xp} XP
                  </span>

                  {unlocked ? (
                    <button
                      type="button"
                      onClick={() => handleLaunchSession(session)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                        isCurrentToday && !completed && !isWindowActive
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-sm'
                          : isCurrentToday
                          ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/25 active:scale-95'
                          : completed
                          ? 'bg-white/[0.04] hover:bg-white/[0.08] text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1]'
                      }`}
                    >
                      {completed ? (
                        <RotateCcw className="w-3 h-3" />
                      ) : isCurrentToday && !isWindowActive ? (
                        <Lock className="w-3 h-3 text-amber-400" />
                      ) : (
                        <Play className="w-3 h-3 fill-current" />
                      )}
                      <span>
                        {completed 
                          ? 'Review' 
                          : isCurrentToday && !isWindowActive 
                          ? 'Opens 7 PM' 
                          : isCurrentToday 
                          ? 'Start Lesson' 
                          : 'Practice'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-600 flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Unlocks Day {session.day}</span>
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </main>

      {/* 7:00 PM – 10:00 PM SCHEDULE WINDOW LOCK MODAL */}
      {showLockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowLockedModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Daily Session Opens at 7:00 PM</h3>
              <p className="text-xs text-amber-300 font-mono font-semibold">
                Scheduled Daily Window: 7:00 PM – 10:00 PM (19:00 – 22:00)
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/[0.08] text-center space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Countdown to 7:00 PM Access
              </div>
              <div className="text-2xl font-black font-mono text-amber-400">
                {timeStatus.countdownOpen}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Module 2 daily curriculum is strictly scheduled between 7:00 PM and 10:00 PM. Please return tonight during the active window to complete Day {selectedLockedSession?.day || unlockedDay}!
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLockedModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Understood, I'll Return at 7:00 PM
              </button>

              <button
                type="button"
                onClick={() => {
                  setPracticeMode(true);
                  setShowLockedModal(false);
                  if (selectedLockedSession) {
                    onStartSession?.(selectedLockedSession);
                  }
                }}
                className="w-full py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer"
              >
                Preview in Practice Mode (All Unlocked)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Module2RoadmapLanding;
