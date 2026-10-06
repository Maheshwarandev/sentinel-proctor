import React, { useState, useEffect, useRef } from 'react';
import { 
  Keyboard, Terminal, FileCode, Activity, GitBranch, 
  CheckCircle2, XCircle, AlertTriangle, ShieldAlert, Cpu, 
  Play, Check, ChevronRight, Lock, ChevronLeft, Calendar,
  Zap, Trophy, Star, Target, Shield, ArrowRight
} from 'lucide-react';
import { 
  track1_days, track2_days, track3_days, 
  track4_days, track5_days 
} from '../data/devSurvivalData';

const usePersisted = (key, initial) => {
  const [val, setVal] = useState(() => {
    const saved = localStorage.getItem(key);
    if (saved === null) return initial;
    try { return JSON.parse(saved); } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(val)); }, [val]);
  return [val, setVal];
};

// ─── Track metadata for consistent theming ───
const TRACK_META = {
  1: { icon: Keyboard, label: 'Keyboard Ninja', color: 'cyan', gradient: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/10', badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25' },
  2: { icon: Terminal, label: 'Terminal Rookie', color: 'emerald', gradient: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  3: { icon: FileCode, label: 'File Architect', color: 'violet', gradient: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-500/30', text: 'text-violet-400', bg: 'bg-violet-500/10', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
  4: { icon: Activity, label: 'Crash Doctor', color: 'rose', gradient: 'from-rose-500/20 to-red-500/10', border: 'border-rose-500/30', text: 'text-rose-400', bg: 'bg-rose-500/10', badge: 'bg-rose-500/15 text-rose-300 border-rose-500/25' },
  5: { icon: GitBranch, label: 'Git Factory', color: 'amber', gradient: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
};

// ─── Reusable: Track Complete celebration ───
const TrackComplete = ({ trackId, onNext, nextLabel }) => {
  const meta = TRACK_META[trackId];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className={`w-20 h-20 rounded-2xl ${meta.bg} border ${meta.border} flex items-center justify-center mb-6 shadow-lg`}>
        <Trophy className={`w-10 h-10 ${meta.text}`} />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Track Mastered!</h2>
      <p className="text-content-secondary text-sm max-w-md mb-1">
        You've completed all days of <span className={`font-bold ${meta.text}`}>{meta.label}</span>.
      </p>
      <div className="flex items-center gap-1.5 mt-2 mb-8">
        {[1,2,3].map(i => <Star key={i} className={`w-5 h-5 ${meta.text} fill-current`} />)}
      </div>
      {nextLabel && (
        <button onClick={onNext} className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer">
          {nextLabel} <ChevronRight className="w-4 h-4" />
        </button>
      )}
      {!nextLabel && <p className="text-emerald-400 font-bold text-sm animate-pulse">All 5 disciplines complete — click COMPLETE DISCIPLINE above</p>}
    </div>
  );
};

// ─── Reusable: Day card for day maps ───
const DayCard = ({ dayData, isCleared, isCurrent, isLocked: isLockedDay, currentDay, onSelect, trackMeta }) => (
  <div 
    onClick={() => isCurrent && onSelect?.()}
    className={`group p-4 rounded-xl flex items-center gap-4 transition-all ${
      isCleared ? `bg-gradient-to-r ${trackMeta.gradient} border ${trackMeta.border}` :
      isCurrent ? `bg-gradient-to-r ${trackMeta.gradient} border ${trackMeta.border} cursor-pointer hover:shadow-lg hover:-translate-y-0.5` :
      'bg-surface-card/50 border border-surface-border/50 opacity-40'
    }`}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-base border ${
      isCleared ? `${trackMeta.bg} ${trackMeta.border} ${trackMeta.text}` :
      isCurrent ? `${trackMeta.bg} ${trackMeta.border} ${trackMeta.text}` :
      'bg-surface-base border-surface-border text-content-muted'
    }`}>
      {isCleared ? <CheckCircle2 className="w-5 h-5" /> : isLockedDay ? <Lock className="w-4 h-4" /> : dayData.day}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className={`font-bold text-sm ${isCleared ? trackMeta.text : isCurrent ? 'text-white' : 'text-content-muted'}`}>
        Day {dayData.day} — {dayData.title}
      </h3>
      <p className="text-xs text-content-secondary mt-0.5">
        {isCleared ? 'All sessions completed' : isLockedDay ? `Complete Day ${currentDay} first` : isCurrent ? 'Tap to begin sessions →' : ''}
      </p>
    </div>
    {isCurrent && <ChevronRight className={`w-5 h-5 ${trackMeta.text} group-hover:translate-x-1 transition-transform shrink-0`} />}
  </div>
);

// ─── Reusable: Section header inside tracks ───
const TrackHeader = ({ trackId, title, subtitle, backAction, backLabel }) => {
  const meta = TRACK_META[trackId];
  const Icon = meta.icon;
  return (
    <div className="mb-6">
      {backAction && (
        <button onClick={backAction} className="flex items-center gap-1.5 text-xs font-semibold text-content-muted hover:text-content-primary mb-3 cursor-pointer transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> {backLabel || 'Back'}
        </button>
      )}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4.5 h-4.5 ${meta.text}`} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-content-secondary mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

const DailyLock = ({ onNext, nextLabel }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-surface-card/20 rounded-2xl border border-surface-border">
    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
    </div>
    <h3 className="text-2xl font-bold text-content-primary mb-2">Daily Session Complete</h3>
    <p className="text-content-secondary max-w-md mb-8">
      Excellent work. Your progress has been saved. The next session will unlock tomorrow at 7:00 PM.
    </p>
    {nextLabel && (
      <button onClick={onNext} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
        {nextLabel} <ChevronRight className="w-5 h-5" />
      </button>
    )}
  </div>
);

export function Module4DeveloperSkills({ onClose, onComplete }) {
  const [t1Day, setT1Day] = usePersisted('mod4_t1Day', 1);
  const [t2Day, setT2Day] = usePersisted('mod4_t2Day', 1);
  const [t3Day, setT3Day] = usePersisted('mod4_t3Day', 1);
  const [t4Day, setT4Day] = usePersisted('mod4_t4Day', 1);
  const [t5Day, setT5Day] = usePersisted('mod4_t5Day', 1);

  const [t1Date, setT1Date] = usePersisted('mod4_t1Date', '');
  const [t2Date, setT2Date] = usePersisted('mod4_t2Date', '');
  const [t3Date, setT3Date] = usePersisted('mod4_t3Date', '');
  const [t4Date, setT4Date] = usePersisted('mod4_t4Date', '');
  const [t5Date, setT5Date] = usePersisted('mod4_t5Date', '');

  const todayStr = new Date().toISOString().split('T')[0];

  const [t1Index, setT1Index] = usePersisted('mod4_t1Index', 0);
  const [t1ChallengeActive, setT1ChallengeActive] = useState(false);
  const [t1PressedKeys, setT1PressedKeys] = useState({});
  const [t1View, setT1View] = useState('sessionMap');

  const [t2Index, setT2Index] = usePersisted('mod4_t2Index', 0);
  const [t2View, setT2View] = useState('challenge');
  const [t2History, setT2History] = useState([]);
  const [t2Input, setT2Input] = useState('');
  const terminalEndRef = useRef(null);
  useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [t2History]);

  const [t3Solved, setT3Solved] = usePersisted('mod4_t3Solved', []);
  const [t3SelectedFile, setT3SelectedFile] = useState(null);
  const [t3Error, setT3Error] = useState('');
  const [t3View, setT3View] = useState('challenge');

  const [t4Killed, setT4Killed] = usePersisted('mod4_t4Killed', []);
  const [t4Error, setT4Error] = useState('');
  const [t4View, setT4View] = useState('challenge');

  const [t5Step, setT5Step] = usePersisted('mod4_t5Step', 0);
  const [t5Error, setT5Error] = useState('');
  const [t5View, setT5View] = useState('challenge');

  const [activeTab, setActiveTab] = usePersisted('mod4_activeTab', 1);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const checkLock = () => {
      if (localStorage.getItem('mod4_override_time') === 'true') { setIsLocked(false); return; }
      const hour = new Date().getHours();
      setIsLocked(hour < 19 || hour >= 23);
    };
    checkLock();
    const interval = setInterval(checkLock, 60000);
    return () => clearInterval(interval);
  }, []);

  const completedTracks = [
    t1Day > track1_days.length ? 1 : null,
    t2Day > track2_days.length ? 2 : null,
    t3Day > track3_days.length ? 3 : null,
    t4Day > track4_days.length ? 4 : null,
    t5Day > track5_days.length ? 5 : null,
  ].filter(Boolean);
  const isAllComplete = completedTracks.length === 5;

  const t1CurrentDayData = track1_days[Math.min(t1Day - 1, track1_days.length - 1)];
  const t2CurrentDayData = track2_days[Math.min(t2Day - 1, track2_days.length - 1)];
  const t3CurrentDayData = track3_days[Math.min(t3Day - 1, track3_days.length - 1)];
  const t4CurrentDayData = track4_days[Math.min(t4Day - 1, track4_days.length - 1)];
  const t5CurrentDayData = track5_days[Math.min(t5Day - 1, track5_days.length - 1)];

  // Mastery progress
  const totalItems = track1_days.length + track2_days.length + track3_days.length + track4_days.length + track5_days.length;
  const doneItems = Math.min(t1Day - 1, track1_days.length) + Math.min(t2Day - 1, track2_days.length) + Math.min(t3Day - 1, track3_days.length) + Math.min(t4Day - 1, track4_days.length) + Math.min(t5Day - 1, track5_days.length);
  const masteryPercent = Math.round((doneItems / totalItems) * 100);

  // ═══ Track 1: Keyboard Ninja Logic ═══
  useEffect(() => {
    if (!t1ChallengeActive || t1View !== 'challenge') return;
    const challenge = t1CurrentDayData.shortcuts[t1Index];
    const handleKeyDown = (e) => {
      const keysToBlock = ['c','v','z','f','s','a','x','y','h','b','i','u','p','d','g','e','/','home','end','arrowleft','arrowright','backspace','delete','f4','=','-'];
      const k = e.key.toLowerCase();
      if (keysToBlock.includes(k) || ((e.ctrlKey || e.altKey || e.shiftKey) && k !== 'control' && k !== 'alt' && k !== 'shift')) e.preventDefault();
      setT1PressedKeys(prev => ({ ...prev, [k]: true, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey }));
      if (k === challenge.targetKey.toLowerCase() && !!challenge.ctrlKey === e.ctrlKey && !!challenge.shiftKey === e.shiftKey && !!challenge.altKey === e.altKey) {
        setTimeout(() => {
          if (t1Index + 1 >= t1CurrentDayData.shortcuts.length) { setT1Day(d => d + 1); setT1Index(0); setT1Date(todayStr); setT1ChallengeActive(false); setT1View('sessionMap'); }
          else { setT1Index(i => i + 1); setT1ChallengeActive(false); setT1View('sessionMap'); }
          setT1PressedKeys({});
        }, 500);
      }
    };
    const handleKeyUp = (e) => { const k = e.key.toLowerCase(); setT1PressedKeys(prev => ({ ...prev, [k]: false, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey })); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [t1ChallengeActive, t1View, t1Index, t1CurrentDayData, setT1Day, setT1Index]);

  // ═══ Track 2: Terminal Logic ═══
  const handleT2Submit = (e) => {
    e.preventDefault();
    if (!t2Input.trim()) return;
    const challenge = t2CurrentDayData.challenges[t2Index];
    let newHistory = [...t2History, { type: 'input', text: `${challenge.prompt} ${t2Input}` }];
    if (challenge.validRegex.test(t2Input.trim())) {
      newHistory.push({ type: 'success', text: challenge.outputSuccess });
      if (t2Index + 1 >= t2CurrentDayData.challenges.length) {
        newHistory.push({ type: 'info', text: '✓ Day complete! Loading next day...' });
        setTimeout(() => { setT2Day(d => d + 1); setT2Index(0); setT2Date(todayStr); setT2History([]); }, 1500);
      } else { setT2Index(i => i + 1); }
    } else { newHistory.push({ type: 'error', text: `Command not recognized. Hint: ${challenge.hint}` }); }
    setT2History(newHistory); setT2Input('');
  };

  // ═══ Track 3: File Architect Logic ═══
  const handleT3Action = (action) => {
    if (!t3SelectedFile) return;
    if (t3SelectedFile.actionNeeded.toLowerCase() === action.toLowerCase()) {
      const newSolved = [...t3Solved, t3SelectedFile.id]; setT3Solved(newSolved); setT3SelectedFile(null); setT3Error('');
      if (newSolved.length >= t3CurrentDayData.files.length) setTimeout(() => { setT3Day(d => d + 1); setT3Solved([]); setT3Date(todayStr); }, 1000);
    } else { setT3Error(`Incorrect action for ${t3SelectedFile.fileName}. Read the file details carefully.`); }
  };

  // ═══ Track 4: Crash Doctor Logic ═══
  const handleT4Kill = (pid) => {
    const proc = t4CurrentDayData.processes.find(p => p.pid === pid); if (!proc) return;
    if (proc.isHung) {
      const newKilled = [...t4Killed, pid]; setT4Killed(newKilled); setT4Error('');
      if (newKilled.length >= t4CurrentDayData.processes.filter(p => p.isHung).length) setTimeout(() => { setT4Day(d => d + 1); setT4Killed([]); setT4Date(todayStr); }, 1000);
    } else { setT4Error(`⚠ Don't kill ${proc.name}! It's a critical system process.`); }
  };

  // ═══ Track 5: Git Factory Logic ═══
  const handleT5Step = (stepIndex) => {
    if (stepIndex === t5Step) {
      setT5Error('');
      if (t5Step + 1 >= t5CurrentDayData.steps.length) setTimeout(() => { setT5Day(d => d + 1); setT5Step(0); setT5Date(todayStr); }, 1000);
      else setT5Step(s => s + 1);
    } else if (stepIndex > t5Step) setT5Error('Complete previous steps in order!');
  };

  // ═══ Render ═══
  const tabs = [
    { id: 1, day: t1Day, maxDay: track1_days.length },
    { id: 2, day: t2Day, maxDay: track2_days.length },
    { id: 3, day: t3Day, maxDay: track3_days.length },
    { id: 4, day: t4Day, maxDay: track4_days.length },
    { id: 5, day: t5Day, maxDay: track5_days.length },
  ];

  return (
    <div className="w-full min-h-screen bg-[#060a12] text-content-primary font-sans overflow-y-auto">
      {/* Subtle grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(6,182,212,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="relative max-w-6xl mx-auto p-4 sm:p-6 space-y-5">
        
        {/* ═══ HEADER ═══ */}
        <div className="bg-gradient-to-r from-surface-raised via-surface-raised to-cyan-950/20 rounded-2xl border border-surface-border p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full -translate-y-32 translate-x-32 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Developer Survival</h1>
                <p className="text-xs text-content-secondary mt-0.5">{completedTracks.length}/5 disciplines mastered · {masteryPercent}% total mastery</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Mastery bar */}
              <div className="hidden sm:block w-32">
                <div className="w-full bg-surface-base rounded-full h-2 overflow-hidden border border-surface-border">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-700" style={{ width: `${masteryPercent}%` }} />
                </div>
              </div>
              {isAllComplete && (
                <button onClick={onComplete} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer text-sm flex items-center gap-2 animate-pulse">
                  <Trophy className="w-4 h-4" /> COMPLETE DISCIPLINE
                </button>
              )}
              <button onClick={onClose} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-xl transition-colors cursor-pointer text-sm font-semibold text-content-secondary hover:text-white">
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Time lock banner */}
        {isLocked && (
          <div className="bg-amber-500/10 text-amber-400 px-5 py-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-amber-500/25">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm">Training Facility Locked</span>
                <span className="text-xs text-amber-500/80 ml-2">Available 7:00 PM – 11:00 PM</span>
              </div>
            </div>
            <button onClick={() => { localStorage.setItem('mod4_override_time', 'true'); setIsLocked(false); }}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/25 transition-colors shrink-0 cursor-pointer">
              Dev: Bypass
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* ═══ SIDEBAR ═══ */}
          <div className="w-full md:w-60 space-y-1.5 shrink-0">
            {tabs.map(tab => {
              const meta = TRACK_META[tab.id];
              const Icon = meta.icon;
              const isDone = tab.day > tab.maxDay;
              const isActive = activeTab === tab.id;
              const progress = Math.min(tab.day - 1, tab.maxDay);
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group ${
                    isActive ? `bg-gradient-to-r ${meta.gradient} border ${meta.border} shadow-sm` : 'bg-surface-raised/50 hover:bg-surface-raised border border-transparent hover:border-surface-border'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                    isDone ? `${meta.bg} ${meta.border}` :
                    isActive ? `${meta.bg} ${meta.border}` :
                    'bg-surface-base border-surface-border group-hover:border-white/10'
                  }`}>
                    <Icon className={`w-4 h-4 ${isDone || isActive ? meta.text : 'text-content-muted group-hover:text-content-secondary'}`} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <span className={`text-xs font-semibold block truncate ${isActive ? 'text-white' : 'text-content-secondary'}`}>{meta.label}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 h-1 rounded-full bg-surface-base overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : `bg-gradient-to-r from-${meta.color}-500 to-${meta.color}-400`}`}
                          style={{ width: `${(progress / tab.maxDay) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-content-muted font-mono shrink-0">{progress}/{tab.maxDay}</span>
                    </div>
                  </div>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* ═══ MAIN CONTENT ═══ */}
          <div className="flex-1 w-full bg-surface-raised/60 backdrop-blur-sm rounded-2xl border border-surface-border p-5 sm:p-6 min-h-[550px] overflow-y-auto flex flex-col">

            {/* ─── TRACK 1: KEYBOARD NINJA ─── */}
            {activeTab === 1 && (
              <div>
                {t1Day > track1_days.length ? (
                  <TrackComplete trackId={1} onNext={() => setActiveTab(2)} nextLabel="Proceed to Terminal Rookie" />
                ) : (
                  <>
                    {t1Date === todayStr && (
                      <DailyLock onNext={() => setActiveTab(2)} nextLabel="Proceed to Terminal Rookie" />
                    )}
                    {t1Date !== todayStr && t1View === 'sessionMap' && (
                      <>
                        <TrackHeader trackId={1} title={`Day ${t1Day} — ${t1CurrentDayData?.title}`} subtitle={`${t1Index}/${t1CurrentDayData?.shortcuts?.length || 5} sessions completed`} />
                        <div className="grid gap-2.5">
                          {t1CurrentDayData?.shortcuts?.map((sc, idx) => {
                            const isCleared = t1Index > idx, isCurrent = t1Index === idx, isLockedSess = t1Index < idx;
                            return (
                              <div key={sc.id} className={`p-4 rounded-xl flex items-center gap-4 transition-all ${
                                isCleared ? 'bg-cyan-500/5 border border-cyan-500/20' :
                                isCurrent ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-sm shadow-cyan-500/10' :
                                'bg-surface-card/30 border border-surface-border/50 opacity-40'
                              }`}>
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold border ${
                                  isCleared ? 'bg-cyan-500/15 border-cyan-500/25 text-cyan-400' :
                                  isCurrent ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300' :
                                  'bg-surface-base border-surface-border text-content-muted'
                                }`}>
                                  {isCleared ? <Check className="w-4 h-4" /> : isLockedSess ? <Lock className="w-3.5 h-3.5" /> : idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className={`font-semibold text-sm ${isCleared ? 'text-cyan-400' : isCurrent ? 'text-white' : 'text-content-muted'}`}>{sc.title}</span>
                                  {isCurrent && <p className="text-xs text-content-secondary mt-0.5 truncate">{sc.scenario}</p>}
                                </div>
                                {isCurrent && (
                                  <button disabled={isLocked} onClick={() => { setT1View('challenge'); setT1ChallengeActive(true); }}
                                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs cursor-pointer disabled:opacity-40 transition-all shadow-sm shadow-cyan-500/20 flex items-center gap-1.5">
                                    <Play className="w-3.5 h-3.5 fill-current" /> START
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {t1Date !== todayStr && t1View === 'challenge' && (
                      <>
                        <TrackHeader trackId={1} title={t1CurrentDayData?.shortcuts?.[t1Index]?.title}
                          subtitle={`Session ${t1Index + 1} of ${t1CurrentDayData?.shortcuts?.length}`}
                          backAction={() => { setT1View('sessionMap'); setT1ChallengeActive(false); }} backLabel="Sessions" />
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                          <div className="lg:col-span-3 bg-gradient-to-br from-surface-card to-cyan-950/10 p-8 rounded-2xl flex flex-col justify-center items-center text-center border border-cyan-500/15 min-h-[280px]">
                            <Target className="w-6 h-6 text-cyan-500/40 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2 max-w-md">{t1CurrentDayData?.shortcuts?.[t1Index]?.scenario}</h3>
                            <p className="text-cyan-400 mb-8 text-sm font-medium bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
                              Hint: {t1CurrentDayData?.shortcuts?.[t1Index]?.hint}
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                              {t1CurrentDayData?.shortcuts?.[t1Index]?.ctrlKey && (
                                <kbd className={`px-5 py-3 rounded-xl text-lg font-mono font-bold border-b-4 transition-all duration-150 ${t1PressedKeys.ctrl ? 'bg-cyan-400 text-slate-900 border-cyan-600 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-95' : 'bg-surface-raised border-surface-border text-content-secondary hover:bg-surface-card'}`}>Ctrl</kbd>
                              )}
                              {t1CurrentDayData?.shortcuts?.[t1Index]?.shiftKey && (
                                <kbd className={`px-5 py-3 rounded-xl text-lg font-mono font-bold border-b-4 transition-all duration-150 ${t1PressedKeys.shift ? 'bg-cyan-400 text-slate-900 border-cyan-600 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-95' : 'bg-surface-raised border-surface-border text-content-secondary hover:bg-surface-card'}`}>Shift</kbd>
                              )}
                              {t1CurrentDayData?.shortcuts?.[t1Index]?.altKey && (
                                <kbd className={`px-5 py-3 rounded-xl text-lg font-mono font-bold border-b-4 transition-all duration-150 ${t1PressedKeys.alt ? 'bg-cyan-400 text-slate-900 border-cyan-600 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-95' : 'bg-surface-raised border-surface-border text-content-secondary hover:bg-surface-card'}`}>Alt</kbd>
                              )}
                              <span className="text-content-muted text-2xl mx-1 self-center">+</span>
                              <kbd className={`px-6 py-3 rounded-xl text-2xl font-mono font-bold border-b-4 uppercase transition-all duration-150 ${
                                t1PressedKeys[t1CurrentDayData?.shortcuts?.[t1Index]?.targetKey?.toLowerCase()] ? 'bg-amber-400 text-slate-900 border-amber-600 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-95' : 'bg-surface-raised border-surface-border text-content-secondary hover:bg-surface-card'
                              }`}>
                                {t1CurrentDayData?.shortcuts?.[t1Index]?.targetKey?.toUpperCase()}
                              </kbd>
                            </div>
                            <p className="text-content-muted text-[11px] mt-6 font-mono uppercase tracking-widest">Press the shortcut on your keyboard</p>
                          </div>
                          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-950/30 to-surface-card p-5 rounded-2xl border border-indigo-500/20 flex flex-col">
                            <div className="flex items-center gap-2.5 mb-4">
                              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                              </div>
                              <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">Behind The Scenes</h4>
                            </div>
                            <p className="text-content-secondary text-sm leading-relaxed flex-1">{t1CurrentDayData?.shortcuts?.[t1Index]?.explanation}</p>
                            <div className="mt-4 p-4 rounded-xl bg-surface-base/80 border border-surface-border relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-50" />
                              <div className="flex items-center justify-center gap-3 py-3">
                                <div className="w-3 h-3 rounded-full bg-indigo-500/40 animate-ping" />
                                <span className="text-xs text-content-muted font-mono">Awaiting input...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ─── TRACK 2: TERMINAL ROOKIE ─── */}
            {activeTab === 2 && (
              <div className="flex flex-col h-full">
                {t2Day > track2_days.length ? (
                  <TrackComplete trackId={2} onNext={() => setActiveTab(3)} nextLabel="Proceed to File Architect" />
                ) : (
                  <>
                    {t2Date === todayStr && (
                      <DailyLock onNext={() => setActiveTab(3)} nextLabel="Proceed to File Architect" />
                    )}
                    {t2Date !== todayStr && t2View === 'challenge' && (
                      <div className="flex flex-col h-full">
                        <TrackHeader trackId={2} title={`Day ${t2Day}: ${t2CurrentDayData?.title}`}
                          subtitle={`Task ${(t2Index || 0) + 1} of ${t2CurrentDayData?.challenges?.length || 4} — ${t2CurrentDayData?.challenges?.[t2Index]?.task}`} />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">
                          {/* Terminal window chrome */}
                          <div className="lg:col-span-2 rounded-xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5 flex flex-col h-full min-h-[350px]">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a2e] border-b border-white/[0.06] shrink-0">
                              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" /><div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" /><div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" /></div>
                              <span className="text-[10px] text-content-muted font-mono ml-2">sentinel-terminal — bash</span>
                            </div>
                            <div className="flex-1 bg-[#0d0d1a] p-4 font-mono text-sm overflow-y-auto">
                              <div className="text-emerald-500/40 mb-3 text-xs">Sentinel OS [v10.0.22621] — Type commands to complete the task.</div>
                              {t2History.map((h, i) => (
                                <div key={i} className={`mb-1.5 ${h.type === 'error' ? 'text-rose-400' : h.type === 'success' ? 'text-emerald-400' : h.type === 'info' ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}>
                                  {h.text}
                                </div>
                              ))}
                              <form onSubmit={handleT2Submit} className="flex items-center gap-2 mt-2">
                                <span className="text-emerald-400 shrink-0">{t2CurrentDayData?.challenges?.[t2Index]?.prompt || 'C:\\>'}</span>
                                <input type="text" value={t2Input} onChange={e => setT2Input(e.target.value)} disabled={isLocked}
                                  className="flex-1 bg-transparent outline-none text-white caret-emerald-400" autoFocus spellCheck={false} autoComplete="off" />
                                <div className="w-2 h-4 bg-emerald-400/70 animate-pulse rounded-sm" />
                              </form>
                              <div ref={terminalEndRef} />
                            </div>
                          </div>
                          
                          {/* Tutorial/Command Manual */}
                          <div className="lg:col-span-1 bg-gradient-to-br from-emerald-950/30 to-surface-card p-5 rounded-2xl border border-emerald-500/20 flex flex-col h-full overflow-hidden">
                            <div className="flex items-center gap-2.5 mb-4 shrink-0">
                              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                              </div>
                              <h4 className="font-bold text-emerald-300 text-xs uppercase tracking-wider">Command Manual</h4>
                            </div>
                            <p className="text-content-secondary text-[11px] mb-4 shrink-0">Use the following command structures to solve today's objectives:</p>
                            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                              {t2CurrentDayData?.challenges?.map((c, i) => (
                                <div key={i} className={`p-3 rounded-xl border transition-colors ${i === t2Index ? 'bg-emerald-500/10 border-emerald-500/30 shadow-sm' : 'bg-surface-base/50 border-surface-border'}`}>
                                  <code className={`font-mono text-xs font-bold ${i === t2Index ? 'text-emerald-400' : 'text-content-secondary'}`}>{c.hint}</code>
                                  <p className="text-content-muted text-[10px] mt-1.5 leading-relaxed">{c.task}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ─── TRACK 3: FILE ARCHITECT ─── */}
            {activeTab === 3 && (
              <div className="flex flex-col h-full">
                {t3Day > track3_days.length ? (
                  <TrackComplete trackId={3} onNext={() => setActiveTab(4)} nextLabel="Proceed to Crash Doctor" />
                ) : (
                  <>
                    {t3Date === todayStr && (
                      <DailyLock onNext={() => setActiveTab(4)} nextLabel="Proceed to Crash Doctor" />
                    )}
                    {t3Date !== todayStr && t3View === 'challenge' && (
                      <div className="flex flex-col h-full">
                        <TrackHeader trackId={3} title={`Day ${t3Day}: ${t3CurrentDayData?.title}`}
                          subtitle={`${t3Solved.length}/${t3CurrentDayData?.files?.length || 0} files inspected`} />
                        
                        {t3Error && (
                          <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-rose-500/20">
                            <AlertTriangle className="w-4 h-4 shrink-0" />{t3Error}
                          </div>
                        )}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 min-h-0">
                          <div className="space-y-2.5 overflow-y-auto pr-1">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-content-muted mb-3 flex items-center gap-2">
                              <Shield className="w-3.5 h-3.5" /> Incoming Files
                            </h3>
                            {t3CurrentDayData?.files?.map(file => {
                              const solved = t3Solved.includes(file.id);
                              return (
                                <div key={file.id} onClick={() => !solved && !isLocked && setT3SelectedFile(file)}
                                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                                    solved ? 'bg-violet-500/5 border-violet-500/20 opacity-60' : 
                                    t3SelectedFile?.id === file.id ? 'bg-violet-500/10 border-violet-500/30 shadow-sm' : 
                                    'bg-surface-card/40 border-surface-border/50 hover:border-violet-500/20 hover:bg-surface-card/60'
                                  }`}>
                                  <FileCode className={`w-5 h-5 shrink-0 ${solved ? 'text-violet-400' : 'text-content-muted'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-mono text-sm font-semibold truncate">{file.fileName}</p>
                                    <p className="text-[11px] text-content-muted mt-0.5">{file.fileType}</p>
                                  </div>
                                  {solved && <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                          <div className="bg-gradient-to-br from-surface-card to-violet-950/10 p-5 rounded-2xl border border-violet-500/15 overflow-y-auto">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-content-muted mb-4 flex items-center gap-2 shrink-0">
                              <ShieldAlert className="w-3.5 h-3.5" /> Security Inspector
                            </h3>
                            {t3SelectedFile ? (
                              <div className="space-y-4">
                                <div className="p-4 bg-surface-base/60 rounded-xl border border-surface-border">
                                  <p className="font-mono text-sm font-bold text-violet-300">{t3SelectedFile.fileName}</p>
                                  <p className="text-xs text-content-secondary mt-2 leading-relaxed">{t3SelectedFile.explanation}</p>
                                </div>
                                <div className="grid grid-cols-1 gap-1.5">
                                  {['open normally', 'flag as malware', 'delete immediately', 'extract before running', 'verify publisher first', 'disable macros before opening', 'delete and scan system', 'open in editor'].map(action => (
                                    <button key={action} onClick={() => handleT3Action(action)}
                                      className={`p-2.5 text-sm rounded-xl text-left transition-all font-medium cursor-pointer flex items-center gap-2 ${
                                        action.includes('delete') || action.includes('malware') ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/15' :
                                        action.includes('verify') || action.includes('disable') ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/15' :
                                        'bg-surface-raised hover:bg-surface-border text-content-secondary border border-transparent'
                                      }`}>
                                      {action.charAt(0).toUpperCase() + action.slice(1)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-12 text-content-muted h-full">
                                <FileCode className="w-10 h-10 mb-3 opacity-30" />
                                <p className="text-sm">Select a file to inspect</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ─── TRACK 4: CRASH DOCTOR ─── */}
            {activeTab === 4 && (
              <div className="flex flex-col h-full">
                {t4Day > track4_days.length ? (
                  <TrackComplete trackId={4} onNext={() => setActiveTab(5)} nextLabel="Proceed to Git Factory" />
                ) : (
                  <>
                    {t4Date === todayStr && (
                      <DailyLock onNext={() => setActiveTab(5)} nextLabel="Proceed to Git Factory" />
                    )}
                    {t4Date !== todayStr && t4View === 'challenge' && (
                      <div className="flex flex-col h-full">
                        <TrackHeader trackId={4} title={`Day ${t4Day}: ${t4CurrentDayData?.title}`} subtitle={t4CurrentDayData?.scenario} />
                        {t4Error && (
                          <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-rose-500/20 animate-shake">
                            <AlertTriangle className="w-4 h-4 shrink-0" />{t4Error}
                          </div>
                        )}
                        {/* Task Manager chrome */}
                        <div className="rounded-xl overflow-hidden border border-rose-500/15 shadow-lg shadow-rose-500/5 flex flex-col flex-1 min-h-0">
                          <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1020] border-b border-white/[0.06] shrink-0">
                            <span className="text-[10px] text-content-muted font-mono flex items-center gap-2">
                              <Activity className="w-3 h-3 text-rose-400" /> Task Manager — {t4CurrentDayData?.processes?.length} processes
                            </span>
                            <span className="text-[10px] text-rose-400 font-mono">
                              {t4CurrentDayData?.processes?.filter(p => p.isHung).length - t4Killed.length} threats remaining
                            </span>
                          </div>
                          <div className="overflow-auto flex-1 bg-[#0a050d]">
                            <table className="w-full text-left text-sm min-w-[580px]">
                              <thead className="bg-[#120a18] text-content-muted text-[11px] uppercase tracking-wider sticky top-0 z-10">
                                <tr>
                                  <th className="px-4 py-3">Process</th>
                                  <th className="px-4 py-3 w-20">PID</th>
                                  <th className="px-4 py-3 w-24">CPU</th>
                                  <th className="px-4 py-3 w-24">Memory</th>
                                  <th className="px-4 py-3 w-28">Status</th>
                                  <th className="px-4 py-3 w-24"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {t4CurrentDayData?.processes?.map(proc => {
                                  const killed = t4Killed.includes(proc.pid);
                                  return (
                                    <tr key={proc.pid} className={`border-t border-white/[0.04] transition-colors ${killed ? 'opacity-30' : proc.isHung ? 'bg-rose-500/[0.03]' : 'hover:bg-white/[0.02]'}`}>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                          <Cpu className={`w-4 h-4 shrink-0 ${proc.isHung ? 'text-rose-400' : 'text-content-muted'}`} />
                                          <div>
                                            <span className="font-mono text-xs font-bold">{proc.name}</span>
                                            {proc.isHung && !killed && <span className="ml-2 text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded font-bold animate-pulse">HUNG</span>}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 font-mono text-[11px] text-content-muted">{proc.pid}</td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                          <div className="w-12 h-1.5 rounded-full bg-surface-base overflow-hidden">
                                            <div className={`h-full rounded-full ${proc.cpuPercent > 80 ? 'bg-rose-500' : proc.cpuPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                              style={{ width: `${Math.min(proc.cpuPercent, 100)}%` }} />
                                          </div>
                                          <span className={`text-[11px] font-mono font-bold ${proc.cpuPercent > 80 ? 'text-rose-400' : 'text-content-secondary'}`}>{proc.cpuPercent}%</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className={`text-[11px] font-mono font-bold ${proc.ramMB > 2000 ? 'text-rose-400' : 'text-content-secondary'}`}>{proc.ramMB} MB</span>
                                      </td>
                                      <td className="px-4 py-3">
                                        {killed ? <span className="text-[11px] text-content-muted line-through">Terminated</span> : 
                                         proc.isHung ? <span className="text-[11px] text-rose-400 font-bold">Not Responding</span> : 
                                         <span className="text-[11px] text-emerald-400">Running</span>}
                                      </td>
                                      <td className="px-4 py-3">
                                        <button disabled={killed || isLocked} onClick={() => handleT4Kill(proc.pid)}
                                          className="px-3 py-1.5 bg-rose-500/15 text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white disabled:opacity-20 transition-all cursor-pointer text-[11px] font-bold border border-rose-500/20">
                                          End Task
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ─── TRACK 5: GIT FACTORY ─── */}
            {activeTab === 5 && (
              <div className="flex flex-col h-full">
                {t5Day > track5_days.length ? (
                  <TrackComplete trackId={5} nextLabel={null} />
                ) : (
                  <>
                    {t5Date === todayStr && (
                      <DailyLock onNext={null} nextLabel={null} />
                    )}
                    {t5Date !== todayStr && t5View === 'challenge' && (
                      <div className="flex flex-col h-full">
                        <TrackHeader trackId={5} title={`Day ${t5Day}: ${t5CurrentDayData?.title}`} subtitle={t5CurrentDayData?.description} />
                        {t5Error && (
                          <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-rose-500/20">
                            <AlertTriangle className="w-4 h-4 shrink-0" />{t5Error}
                          </div>
                        )}
                        {/* Pipeline visualization */}
                        <div className="relative bg-gradient-to-br from-surface-card to-amber-950/5 rounded-2xl border border-amber-500/15 p-6 overflow-x-auto min-h-[300px] flex items-center">
                          {/* Conveyor belt line */}
                          <div className="absolute top-1/2 left-0 right-0 h-1 bg-surface-border -translate-y-1/2 opacity-30" />
                          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                            {t5CurrentDayData?.steps?.map((step, idx) => {
                              const isDone = idx < t5Step, isCurrent = idx === t5Step;
                              return (
                                <div key={step.step} onClick={() => !isLocked && handleT5Step(idx)}
                                  className={`relative p-5 rounded-xl border flex flex-col cursor-pointer transition-all h-full ${
                                    isDone ? 'bg-emerald-500/10 border-emerald-500/25 shadow-sm shadow-emerald-500/10' :
                                    isCurrent ? 'bg-amber-500/10 border-amber-500/30 shadow-md shadow-amber-500/10 hover:bg-amber-500/20' :
                                    'bg-surface-card/30 border-surface-border/40 opacity-40 hover:opacity-100 hover:border-surface-border'
                                  }`}>
                                  {/* Connector arrow */}
                                  {idx < (t5CurrentDayData?.steps?.length || 0) - 1 && (
                                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                                      <ArrowRight className={`w-5 h-5 ${isDone ? 'text-emerald-500' : 'text-surface-border'}`} />
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between mb-3">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDone ? 'text-emerald-400' : isCurrent ? 'text-amber-400' : 'text-content-muted'}`}>
                                      Step {step.step}
                                    </span>
                                    {isDone && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                                    {isCurrent && <Play className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />}
                                    {!isDone && !isCurrent && <Lock className="w-3.5 h-3.5 text-content-muted" />}
                                  </div>
                                  <div className={`font-mono text-sm font-bold mb-2 ${isDone ? 'text-emerald-300' : isCurrent ? 'text-amber-300' : 'text-content-muted'}`}>
                                    {step.action}
                                  </div>
                                  <div className="text-[11px] text-content-secondary mt-auto leading-relaxed">{step.role}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
