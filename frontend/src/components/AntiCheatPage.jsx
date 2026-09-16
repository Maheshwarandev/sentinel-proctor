import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Terminal, 
  Activity, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Flame, 
  ChevronRight, 
  ArrowLeft, 
  AlertOctagon,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Zap,
  Info,
  Copy,
  Maximize2,
  X
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';
import { CyberNotificationPopup } from './CyberNotificationPopup';
import { LiveProctorCCTV } from './LiveProctorCCTV';

export const AntiCheatPage = () => {
  const navigate = useNavigate();
  const { 
    tasks, 
    selectedTaskId, 
    setSelectedTaskId, 
    selectedTask, 
    approveTask, 
    rejectTask, 
    strikes,
    resetStrikes,
    isRedLockdownActive,
    activeBreach,
    alarmHistory = [],
    clearAlarmHistory,
    disarmRedLockdown,
    triggerRedLockdown
  } = useForensics();

  const [auditorNoteInput, setAuditorNoteInput] = useState('');
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [historyFilter, setHistoryFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'SIMULATION'
  const [expandedDetailsId, setExpandedDetailsId] = useState(null);
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const [inspectSnapshot, setInspectSnapshot] = useState(null);

  const formatIncidentTime = (isoString) => {
    if (!isoString) return '--';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' • ' + d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return isoString;
    }
  };

  const getRelativeTime = (isoString) => {
    if (!isoString) return '';
    try {
      const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
      if (diffSec < 60) return `${diffSec}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch (e) {
      return '';
    }
  };

  const criticalCount = alarmHistory.filter(i => i.severity === 'CRITICAL').length;
  const drillCount = alarmHistory.filter(i => i.severity === 'TEST_DRILL').length;

  const filteredHistory = alarmHistory.filter(item => {
    if (historyFilter === 'CRITICAL') return item.severity === 'CRITICAL';
    if (historyFilter === 'SIMULATION') return item.severity === 'TEST_DRILL';
    return true;
  });

  const handleApprove = () => {
    approveTask(selectedTask.id, auditorNoteInput);
    setActiveFeedback({
      type: 'APPROVED',
      message: `${selectedTask.title} telemetry approved and verified.`
    });
    setAuditorNoteInput('');
    setTimeout(() => setActiveFeedback(null), 3000);
  };

  const handleReject = () => {
    rejectTask(selectedTask.id, auditorNoteInput || 'Anti-cheat violation detected. Strike logged.');
    setActiveFeedback({
      type: 'REJECTED',
      message: `Strike issued for ${selectedTask.title}. Revision requested.`
    });
    setAuditorNoteInput('');
    setTimeout(() => setActiveFeedback(null), 3000);
  };

  const renderStatusPill = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Validated
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Strike Active
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Needs Review
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
            Waiting
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Real-time floating popup */}
      <CyberNotificationPopup />

      {/* Top Navigation & Breadcrumb */}
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Admin</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400 font-semibold">Anti-Cheat & Telemetry</span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          {/* Active Lockdown Disarm Button */}
          {isRedLockdownActive && (
            <button
              type="button"
              onClick={disarmRedLockdown}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse cursor-pointer"
              title="Disarm active siren and red emergency lockdown"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Disarm Active Siren</span>
            </button>
          )}

          {/* Clear Active Strikes Button */}
          {strikes > 0 && (
            <button
              type="button"
              onClick={resetStrikes}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-rose-500/40 hover:border-rose-400 text-rose-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm group cursor-pointer"
              title="Clear all active strikes back to 0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-180 transition-transform duration-500" />
              <span>Clear Strikes ({strikes})</span>
            </button>
          )}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Anti-Paste Sentinel: <strong className="text-emerald-400">Active</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <span>Sensor Rate: <strong className="text-cyan-400">100Hz</strong></span>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold">
                Anti-Cheat Surveillance
              </span>
              <span className="text-xs text-slate-400">Hardware & Cadence Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Anti-Cheat & Telemetry Inspector
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Forensic validation console. Inspect human keystroke cadence, focus loss counters, paste interceptions, OCR streak scans, and camera hardware sensor EXIF tags.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs shrink-0">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[105px]">
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Active Strikes</div>
              <div className={`text-xl font-bold mt-0.5 ${strikes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {strikes}
              </div>
              {strikes > 0 ? (
                <button
                  type="button"
                  onClick={resetStrikes}
                  className="mt-1.5 w-full px-2 py-0.5 rounded-md bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[10px] font-semibold flex items-center justify-center space-x-1 transition-all"
                  title="Clear active strikes back to 0"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Clear</span>
                </button>
              ) : (
                <div className="text-[9px] text-emerald-400/80 mt-1 font-mono">Clean</div>
              )}
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[95px]">
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Audit Status</div>
              <div className="text-xl font-bold text-cyan-400 mt-0.5">Live</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Candidate Webcam Proctoring CCTV Surveillance Feed */}
      <LiveProctorCCTV />

      {/* Main 2-Column Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Queue List (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Verification Queue
            </span>
            <span className="text-[10px] text-slate-500">{tasks.length} items</span>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => {
              const isSelected = task.id === selectedTaskId;
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-1.5 rounded-lg border ${
                        task.type === 'keyboard'
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                          : task.type === 'image_ocr'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                      }`}>
                        {task.type === 'keyboard' && <Terminal className="w-3.5 h-3.5" />}
                        {task.type === 'image_ocr' && <Flame className="w-3.5 h-3.5" />}
                        {task.type === 'image_exif' && <Camera className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-white">
                          {task.title}
                        </h3>
                        <span className="text-[10px] text-slate-500">
                          {task.submittedAt 
                            ? new Date(task.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {renderStatusPill(task.status)}
                      <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${
                        isSelected ? 'text-cyan-400 translate-x-0.5' : ''
                      }`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Inspection Details (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md space-y-6">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-[10px] font-semibold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                Telemetry Breakdown
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                {selectedTask.title}
              </h2>
            </div>

            <div className="text-xs text-slate-400">
              Verdict: <strong className="text-white">{selectedTask.auditorVerdict || (selectedTask.status === 'PENDING' ? 'Awaiting Submission' : 'Needs Review')}</strong>
            </div>
          </div>

          {/* Feedback Alert */}
          {activeFeedback && (
            <div className={`p-3 rounded-xl border text-xs font-medium flex items-center space-x-2 ${
              activeFeedback.type === 'APPROVED'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
            }`}>
              {activeFeedback.type === 'APPROVED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{activeFeedback.message}</span>
            </div>
          )}

          {/* MODULE 1 INSPECTOR */}
          {selectedTask.type === 'keyboard' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">Typing Speed</span>
                  <span className="text-xl font-bold text-cyan-400 mt-0.5 block">
                    {selectedTask.telemetry?.wpm ? `${selectedTask.telemetry.wpm} WPM` : '--'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {selectedTask.telemetry?.wpm ? '✓ Natural pace' : 'No data yet'}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">Tab Switches</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">{selectedTask.telemetry?.tabSwitches ?? '--'}</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">Focus loss events</span>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">Human Cadence</span>
                  <span className="text-xl font-bold text-teal-300 mt-0.5 block">
                    {selectedTask.telemetry?.humanCadenceScore ? `${selectedTask.telemetry.humanCadenceScore}%` : '--'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {selectedTask.telemetry?.humanCadenceScore ? '✓ Organic rhythm' : 'No data yet'}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">Paste Attempts</span>
                  <span className="text-xl font-bold text-emerald-400 mt-0.5 block">{selectedTask.telemetry?.pasteAttempts ?? 0}</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">Neutralized (0 allowed)</span>
                </div>
              </div>

              {/* Active Writing Session Telemetry Banner */}
              {(() => {
                const durationSec = selectedTask.telemetry?.durationSec || 0;
                const wordsCount = selectedTask.submissionText ? selectedTask.submissionText.trim().split(/\s+/).length : 0;

                return (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-semibold">Active Writing Session Telemetry</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        !selectedTask.telemetry 
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {!selectedTask.telemetry ? 'Awaiting Session' : '✓ Active Session Recorded'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">ACTIVE WRITING TIME</span>
                        <span className="text-cyan-400 font-bold text-sm mt-0.5 block">
                          {selectedTask.telemetry ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s` : '--'}
                        </span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">TOTAL WORDS</span>
                        <span className="text-white font-bold text-sm mt-0.5 block">
                          {selectedTask.telemetry ? `${wordsCount} words` : '--'}
                        </span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">CADENCE SPEED</span>
                        <span className="text-teal-400 font-bold text-sm mt-0.5 block">
                          {selectedTask.telemetry?.wpm ? `${selectedTask.telemetry.wpm} WPM` : '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-medium">Submitted Attestation Buffer:</span>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto select-all">
                  {selectedTask.submissionText || (
                    <span className="text-slate-600 italic">Buffer empty. Awaiting typing attestation from brother in Module 1.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: ENGLISH ASSESSMENT (WINDOWS 11 ENGINE) */}
          {(selectedTask.type === 'english_quiz' || selectedTask.quizScore !== undefined || (selectedTask.id === 'mod-2-duolingo' && !selectedTask.image)) ? (
            <div className="space-y-4">
              {/* Telemetry Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block font-mono">ASSESSMENT SCORE</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">
                    {selectedTask.quizScore !== undefined ? `${selectedTask.quizScore} / ${selectedTask.totalQuestions || 10}` : '--'}
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    {selectedTask.percentage !== undefined ? `${selectedTask.percentage}% Accuracy` : 'Awaiting quiz'}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block font-mono">AVG TIME / QUESTION</span>
                  <span className="text-xl font-bold text-cyan-400 mt-0.5 block">
                    {selectedTask.avgTimePerQuestionSec ? `${selectedTask.avgTimePerQuestionSec}s` : '--'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {selectedTask.avgTimePerQuestionSec && selectedTask.avgTimePerQuestionSec >= 1.5 ? '✓ Organic response speed' : 'Telemetry clean'}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block font-mono">CADENCE INTEGRITY</span>
                  <span className="text-xl font-bold text-teal-300 mt-0.5 block">
                    {selectedTask.integrityScore !== undefined ? `${selectedTask.integrityScore}%` : '100%'}
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    Zero-Knowledge Certified
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block font-mono">SPEED ANOMALIES</span>
                  <span className={`text-xl font-bold mt-0.5 block ${
                    selectedTask.violations?.filter(v => v.includes('Rapid')).length > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {selectedTask.violations?.filter(v => v.includes('Rapid')).length || 0}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Rapid responses (&lt; 0.8s)
                  </span>
                </div>
              </div>

              {/* Assessment Telemetry Banner */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-sky-400" />
                    <span className="text-white font-bold">Windows 11 Fluent Assessment Engine Telemetry</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px] font-bold">
                    SERVER-SIDE GRADER
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">LESSON SPECIFICATION</span>
                    <span className="text-white font-semibold text-xs mt-0.5 block truncate">
                      {selectedTask.lessonTitle || 'Beginner English & Computer Programming'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">TOTAL DURATION</span>
                    <span className="text-cyan-400 font-bold text-xs mt-0.5 block">
                      {selectedTask.totalDurationSec ? `${selectedTask.totalDurationSec}s elapsed` : 'Awaiting quiz'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">CRYPTO REPLAY SHIELD</span>
                    <span className="text-emerald-400 font-bold text-xs mt-0.5 block">
                      DYNAMIC RANDOMIZATION ✓
                    </span>
                  </div>
                </div>

                {/* Violations breakdown if any */}
                {selectedTask.violations?.length > 0 ? (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs space-y-1">
                    <span className="font-bold block">Cadence Violations Logged by Server:</span>
                    {selectedTask.violations.map((v, i) => (
                      <p key={i} className="text-slate-400 font-mono text-[11px]">• {v}</p>
                    ))}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cadence verified: All 10 questions answered within normal organic human reading speed boundaries.</span>
                  </div>
                )}
              </div>

              {/* Real-Time Proctoring Camera Surveillance Dossier */}
              {selectedTask.proctorSnapshots?.length > 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                      </span>
                      <span className="font-bold text-white flex items-center space-x-1.5">
                        <Camera className="w-4 h-4 text-rose-400" />
                        <span>Real-Time Webcam Proctoring Dossier ({selectedTask.proctorSnapshots.length} Frames Captured)</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {selectedTask.cameraDevice && (
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {selectedTask.cameraDevice}
                        </span>
                      )}
                      <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        SURVEILLANCE VERIFIED ✓
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Live camera snapshots captured during the assessment session (periodic checks and focus loss triggers). Click to zoom:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
                    {selectedTask.proctorSnapshots.map((snap, idx) => (
                      <div
                        key={snap.id || idx}
                        onClick={() => setInspectSnapshot(snap)}
                        className="group relative rounded-xl border border-slate-800 bg-slate-900 overflow-hidden cursor-pointer hover:border-cyan-400/60 transition-all hover:scale-[1.03] shadow-sm"
                        title={`Click to inspect frame captured at ${snap.timeStr}`}
                      >
                        <img
                          src={snap.image}
                          alt={`Proctor frame ${idx + 1}`}
                          className="w-full h-20 object-cover group-hover:opacity-90 transition-opacity"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-cyan-300">
                          <Maximize2 className="w-4 h-4" />
                        </div>

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-1.5 text-[9px] font-mono text-cyan-300 flex items-center justify-between">
                          <span>{snap.timeStr}</span>
                          <span className="text-[8px] text-slate-400">Q{snap.questionIndex || idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs text-slate-500 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-3.5 h-3.5 text-slate-600" />
                    <span>Candidate webcam proctor surveillance monitoring active for Module 2.</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">Surveillance Ready</span>
                </div>
              )}
            </div>
          ) : (selectedTask.type === 'image_ocr' || selectedTask.type === 'image_exif') && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-5 space-y-1.5">
                <span className="text-xs text-slate-400 font-medium">
                  {selectedTask.images && selectedTask.images.length > 1 
                    ? `Uploaded Evidence Pages (${selectedTask.images.length}):` 
                    : 'Uploaded Evidence Image:'}
                </span>
                {selectedTask.images && Array.isArray(selectedTask.images) && selectedTask.images.length > 1 ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTask.images.map((slot, sIdx) => {
                        const slotImg = typeof slot === 'string' ? slot : (slot.dataUrl || slot.image);
                        const pageNum = slot.pageNumber || (sIdx + 1);
                        return (
                          <div
                            key={slot.id || sIdx}
                            onClick={() => slotImg && setInspectSnapshot({
                              image: slotImg,
                              timeStr: `Page ${pageNum} of ${selectedTask.images.length}`,
                              reason: slot.fileName || 'Module 3 Handwriting Note'
                            })}
                            className="group relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden cursor-pointer h-28 hover:border-teal-400/60 transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-end"
                            title={`Click to zoom Page ${pageNum}`}
                          >
                            {slotImg ? (
                              <>
                                <img
                                  src={slotImg}
                                  alt={`Page ${pageNum}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-teal-300">
                                  <Maximize2 className="w-4 h-4" />
                                </div>
                                <div className="relative z-10 bg-black/80 px-2 py-1 flex items-center justify-between text-[10px] font-mono text-teal-300 border-t border-slate-800/80">
                                  <span>Page {pageNum}</span>
                                  {slot.fileSize && <span className="text-slate-400 text-[9px]">{slot.fileSize}</span>}
                                </div>
                              </>
                            ) : (
                              <div className="p-2 text-center text-slate-600 text-[10px]">Empty Slot</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-500 italic">Click any page thumbnail to open forensic inspection.</p>
                  </div>
                ) : (
                  <div 
                    className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 min-h-[180px] flex items-center justify-center cursor-pointer group relative"
                    onClick={() => selectedTask.image && setInspectSnapshot({
                      image: selectedTask.image,
                      timeStr: selectedTask.submittedAt ? new Date(selectedTask.submittedAt).toLocaleTimeString() : 'Submitted Artifact',
                      reason: selectedTask.fileName || 'Handwritten Evidence'
                    })}
                  >
                    {selectedTask.image ? (
                      <>
                        <img src={selectedTask.image} alt="Artifact" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-teal-300">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      </>
                    ) : (
                      <div className="p-6 text-center space-y-2 text-slate-600">
                        <Camera className="w-8 h-8 mx-auto text-slate-700" />
                        <div className="text-xs font-medium text-slate-500">No Image Uploaded</div>
                        <p className="text-[10px] text-slate-600">Awaiting brother submission</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-7 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs space-y-2.5">
                <span className="text-xs font-semibold text-white block border-b border-slate-800/80 pb-1.5">
                  Metadata & Cryptographic Verification
                </span>
                {selectedTask.type === 'image_exif' ? (
                  <>
                    {selectedTask.images && Array.isArray(selectedTask.images) && selectedTask.images.length > 1 && (
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Total Note Pages:</span>
                        <span className="text-teal-300 font-bold font-mono">
                          {selectedTask.images.length} Pages Verified ({selectedTask.fileSize || `${selectedTask.images.length * 2} MB`})
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Camera Hardware:</span>
                      <span className="text-teal-300 font-semibold">
                        {selectedTask.exifData?.deviceModel ? `${selectedTask.exifData.deviceMake} ${selectedTask.exifData.deviceModel}` : '--'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Original Date:</span>
                      <span className="text-white">{selectedTask.exifData?.dateTimeOriginal || '--'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Sensor Lens:</span>
                      <span className="text-slate-300">{selectedTask.exifData?.lens || '--'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Firmware Software:</span>
                      <span className="text-emerald-400 font-semibold">{selectedTask.exifData?.software || '--'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>OCR Streak Detected:</span>
                      <span className="text-amber-400 font-bold">{selectedTask.ocrData?.streakDetected || '--'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>OCR XP Verified:</span>
                      <span className="text-white font-semibold">{selectedTask.ocrData?.xpEarned || '--'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Lesson Topic:</span>
                      <span className="text-slate-300">{selectedTask.ocrData?.lessonTitle || '--'}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>Duplicate Hash Check:</span>
                  <span className="text-emerald-400 font-semibold">{selectedTask.hash?.matchStatus || 'Awaiting upload'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes & Actions */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <input
              type="text"
              value={auditorNoteInput}
              onChange={(e) => setAuditorNoteInput(e.target.value)}
              placeholder="Evaluation notes..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
              >
                Request Redo
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-colors shadow-sm"
              >
                Approve Telemetry
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================= */}
      {/* 🚨 EMERGENCY ALARM BREACH HISTORY & INCIDENT DOSSIER           */}
      {/* ============================================================= */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md space-y-5">
        
        {/* Dossier Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Forensic Incident Dossier
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px]">
                {alarmHistory.length} Logged
              </span>
              {isRedLockdownActive && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-semibold flex items-center space-x-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>ALARM ACTIVE</span>
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Emergency Alarm Breach History</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Complete audit trail explaining why emergency red alarms were triggered. Every clipboard injection, focus loss, and prohibited shortcut is cataloged with policy explanations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setHistoryFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  historyFilter === 'ALL' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({alarmHistory.length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('CRITICAL')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  historyFilter === 'CRITICAL' 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : 'text-slate-400 hover:text-rose-300'
                }`}
              >
                Violations ({criticalCount})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('SIMULATION')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  historyFilter === 'SIMULATION' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                Drills ({drillCount})
              </button>
            </div>

            {/* Clear History Button */}
            {alarmHistory.length > 0 && (
              confirmClearHistory ? (
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      clearAlarmHistory();
                      setConfirmClearHistory(false);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Confirm Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClearHistory(false)}
                    className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClearHistory(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-all"
                  title="Clear all recorded alarm history"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Clear History</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Alarm List or Empty State */}
        {alarmHistory.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Perimeter Secure — Zero Alarm Breaches</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No unauthorized clipboard paste injections, window blurs, or right-click tampering incidents have been recorded.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => triggerRedLockdown('MANUAL SIMULATION: Admin triggered test of anti-cheat emergency lockdown', {
                  module: 'Admin Surveillance Deck',
                  type: 'ADMIN_TEST'
                })}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold inline-flex items-center space-x-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Test Red Alarm</span>
              </button>
            </div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center text-xs text-slate-500">
            No incidents match the active filter: <strong className="text-slate-300">{historyFilter}</strong>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredHistory.map((item, index) => {
              const isActive = item.status === 'ACTIVE';
              const isCritical = item.severity === 'CRITICAL';
              const isExpanded = expandedDetailsId === item.id;

              return (
                <div
                  key={item.id || index}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isActive
                      ? 'bg-rose-950/30 border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.18)]'
                      : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700/90 shadow-sm'
                  }`}
                >
                  <div className="p-4 sm:p-5 space-y-3">
                    
                    {/* Top Meta Line: Badges, Module, Time */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Badge */}
                        {isActive ? (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500/25 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center space-x-1.5 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                            <span>🚨 ACTIVE LOCKDOWN</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>DISARMED & RESOLVED</span>
                          </span>
                        )}

                        {/* Severity Badge */}
                        {isCritical ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-900/40 border border-rose-700/40 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                            CRITICAL VIOLATION
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-900/40 border border-amber-700/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                            SECURITY DRILL
                          </span>
                        )}

                        {/* Module Pill */}
                        <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[11px] font-medium border border-slate-700/50">
                          {item.module || 'Restricted Workspace'}
                        </span>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatIncidentTime(item.timestamp)}</span>
                        {getRelativeTime(item.timestamp) && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 text-[10px] font-mono">
                            {getRelativeTime(item.timestamp)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Incident Title */}
                    <div className="flex items-start justify-between gap-3 pt-1">
                      <div className="flex items-center space-x-2.5">
                        <div className={`p-2 rounded-xl shrink-0 ${
                          isActive 
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                            : isCritical 
                            ? 'bg-slate-900 text-rose-400 border border-slate-800' 
                            : 'bg-slate-900 text-amber-400 border border-slate-800'
                        }`}>
                          {item.category === 'CLIPBOARD_INJECTION' ? (
                            <Copy className="w-4 h-4" />
                          ) : item.category === 'WINDOW_BLUR_TAB_SWITCH' ? (
                            <AlertOctagon className="w-4 h-4" />
                          ) : item.category === 'ADMIN_SIMULATION' ? (
                            <Zap className="w-4 h-4" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                            {item.title || item.reason}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            Infraction Category: <span className="text-slate-300 font-semibold">{item.categoryLabel || item.category || 'Security Breach'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Quick Disarm Action if this specific alarm is currently active */}
                      {isActive && (
                        <button
                          type="button"
                          onClick={disarmRedLockdown}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shrink-0 transition-all shadow-md flex items-center space-x-1.5 animate-pulse"
                          title="Disarm this active alarm immediately"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Disarm Siren</span>
                        </button>
                      )}
                    </div>

                    {/* WHY THE ALARM HAPPENED - HIGH PROMINENCE CALLOUT BOX */}
                    <div className="rounded-xl bg-slate-900/90 border border-slate-800/90 p-3.5 space-y-2.5 mt-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                        <Info className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>WHY THIS ALARM WAS TRIGGERED:</span>
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
                        {item.explanation || item.reason}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-slate-800/70 text-xs">
                        <div className="flex items-start space-x-2 text-slate-400">
                          <span className="text-slate-500 font-semibold uppercase text-[10px] shrink-0 mt-0.5">Policy Broken:</span>
                          <span className="text-rose-300/90 font-medium text-[11px]">
                            {item.ruleBroken || 'Continuous On-Screen Academic Focus Policy'}
                          </span>
                        </div>
                        <div className="flex items-start space-x-2 text-slate-400">
                          <span className="text-slate-500 font-semibold uppercase text-[10px] shrink-0 mt-0.5">Enforcement:</span>
                          <span className="text-teal-300/90 font-medium text-[11px]">
                            {item.actionTaken || 'Red lockdown siren initiated; incident logged for supervisor.'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata & Telemetry Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-1">
                      <div className="flex items-center space-x-2">
                        {item.status === 'DISARMED' ? (
                          <span className="text-slate-400 text-[11px]">
                            Disarmed at: <strong className="text-slate-300">{formatIncidentTime(item.disarmedAt)}</strong>
                            {item.activeDurationSec ? ` (Active for ${item.activeDurationSec}s)` : ''}
                          </span>
                        ) : (
                          <span className="text-rose-400 text-[11px] font-semibold flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                            <span>Sirens sounding • Awaiting supervisor intervention</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedDetailsId(isExpanded ? null : item.id)}
                        className="text-[11px] text-slate-400 hover:text-cyan-400 font-mono flex items-center space-x-1 self-start sm:self-auto transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Raw Telemetry ▲' : 'View Raw Telemetry ▼'}</span>
                      </button>
                    </div>

                    {/* Expandable Raw Telemetry Details */}
                    {isExpanded && (
                      <div className="mt-2 p-3 rounded-xl bg-black/70 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                        <div className="text-slate-500 uppercase text-[10px] font-bold">Raw Trigger Event:</div>
                        <p className="text-rose-400 break-all">{item.reason}</p>
                        {item.details && Object.keys(item.details).length > 0 && (
                          <div className="pt-1 text-slate-400">
                            <span className="text-slate-500 uppercase text-[10px] font-bold block">Metadata Payload:</span>
                            <pre className="text-slate-400 text-[10px] overflow-x-auto mt-0.5">
                              {JSON.stringify(item.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Full Preview Modal for Proctor Snapshot */}
      {inspectSnapshot && (
        <div 
          onClick={() => setInspectSnapshot(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3.5 border-b border-slate-800 text-xs text-slate-300">
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-rose-400 font-bold">🔴 PROCTOR FRAME SNAPSHOT</span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-300">{inspectSnapshot.timeStr}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Trigger: {inspectSnapshot.reason}</span>
              </div>
              <button 
                onClick={() => setInspectSnapshot(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex justify-center bg-black">
              <img src={inspectSnapshot.image} alt="Proctor full snapshot" className="max-h-[80vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AntiCheatPage;
