import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  ExternalLink, 
  RotateCcw, 
  Sliders, 
  ShieldCheck, 
  Type, 
  ArrowRight,
  FileCheck2,
  XCircle,
  Eye
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';
import { PageHeader, StatCard, Card, CardHeader, CardBody, Badge, Button } from './ui';
import { CyberNotificationPopup } from './CyberNotificationPopup';

export const AdminModule1Page = () => {
  const { 
    tasks, 
    strikes, 
    resetStrikes, 
    approveTask, 
    flagTask, 
    notifications, 
    checkTaskFromNotification 
  } = useForensics();

  const keyboardTask = tasks.find(t => t.id === 'mod-1-keyboard') || {
    id: 'mod-1-keyboard',
    title: 'Keyboard Practice',
    status: 'PENDING',
    content: ''
  };

  // Word target configuration
  const [wordTarget, setWordTarget] = useState(() => {
    const saved = localStorage.getItem('module1_word_target');
    return saved ? parseInt(saved, 10) : 300;
  });
  const [inputVal, setInputVal] = useState(wordTarget);
  const [feedback, setFeedback] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync to localStorage
  const handleSaveWordTarget = (val) => {
    const num = Math.max(50, Math.min(2000, parseInt(val, 10) || 300));
    setWordTarget(num);
    setInputVal(num);
    localStorage.setItem('module1_word_target', num.toString());
    setFeedback(`Target updated to ${num} words.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/test`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const currentWords = (keyboardTask.content || '').trim().split(/\s+/).filter(Boolean).length;
  const progressPct = Math.min(100, Math.round((currentWords / wordTarget) * 100));

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
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-xs font-mono font-bold">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>MODULE 01 CONTROL CONSOLE</span>
            </span>
          </div>
        }
        title="Module 1: Keyboard Typing Practice"
        subtitle="Configure target word limits, monitor keystroke cadence telemetry, inspect typed drafts, and record supervisor verdicts."
        actions={
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copiedLink ? 'Copied Link!' : 'Copy Candidate Link'}</span>
            </button>
            <a
              href="/test"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <span>Test Terminal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Target Word Quota"
          value={`${wordTarget} Words`}
          subtext="Configurable minimum words"
          icon={<Type className="w-4 h-4 text-cyan-400" />}
        />
        <StatCard
          label="Current Candidate Words"
          value={`${currentWords} / ${wordTarget}`}
          subtext={`${progressPct}% of required quota`}
          progress={progressPct}
          progressColor="bg-cyan-500"
          icon={<Activity className="w-4 h-4 text-emerald-400" />}
        />
        <StatCard
          label="Typing Cadence (Live)"
          value={`${keyboardTask.liveWpm || keyboardTask.wpm || 0} WPM`}
          subtext="Net speed with keystroke cadence"
          icon={<Clock className="w-4 h-4 text-amber-400" />}
        />
        <StatCard
          label="Module Status"
          value={keyboardTask.status || 'PENDING'}
          subtext={keyboardTask.auditorVerdict ? `Verdict: ${keyboardTask.auditorVerdict}` : 'Pending supervisor audit'}
          variant={keyboardTask.status === 'VERIFIED' ? 'success' : keyboardTask.status === 'FLAGGED' ? 'danger' : 'warning'}
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Two Column Layout: Word Quota Controls & Submission Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Configuration & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Word Target Configuration Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Target Word Quota Control</h3>
              </div>
              <Badge variant="info">Real-Time Sync</Badge>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Set the required word count for Module 1. The candidate typing terminal will display this counter (e.g. 0 / {wordTarget} words) and enforce quota completion before submission.
            </p>

            {/* Quick Preset Buttons */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Quick Presets:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[150, 300, 500, 1000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSaveWordTarget(val)}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                      wordTarget === val
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-800/80 text-slate-300 border-white/[0.08] hover:bg-slate-700'
                    }`}
                  >
                    {val} w
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Field */}
            <div className="pt-2">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                Custom Word Target:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="50"
                  max="2000"
                  step="25"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="flex-1 bg-slate-950 border border-white/[0.12] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="300"
                />
                <button
                  type="button"
                  onClick={() => handleSaveWordTarget(inputVal)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>

            {feedback && (
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{feedback}</span>
              </div>
            )}
          </Card>

          {/* Telemetry Rules & Safeguards */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center space-x-2 border-b border-white/[0.06] pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Active Anti-Cheat Safeguards</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Paste Interception:</strong> Automatic strike triggered if text is pasted into the terminal.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Keystroke Telemetry:</strong> Verifies human typing intervals and flags non-human typing speeds (&gt;160 WPM).</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Window Blur Lock:</strong> Tracks tab switches and application blurs during the typing session.</span>
              </li>
            </ul>
          </Card>

        </div>

        {/* Right Column: Typed Content Draft & Verdict (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Candidate Typed Submission</h3>
                <p className="text-xs text-slate-400 mt-0.5">Live content typed in fullscreen terminal</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-cyan-400">
                  {currentWords} Words
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-slate-400">
                  {(keyboardTask.content || '').length} Characters
                </span>
              </div>
            </div>

            {/* Typed Text Preview Box */}
            <div className="rounded-xl bg-slate-950 border border-white/[0.08] p-4 min-h-[220px] max-h-[380px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500 selection:text-slate-950">
              {keyboardTask.content ? (
                keyboardTask.content
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                  <Terminal className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="font-semibold text-slate-400">No typed content submitted yet</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                    When the candidate opens the Keyboard Practice terminal, typed sentences appear here live.
                  </p>
                </div>
              )}
            </div>

            {/* Auditor Verdict Controls */}
            <div className="pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Auditor Action: Record your supervisory decision.
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => approveTask('mod-1-keyboard', 'Verified typing quota & human keystroke telemetry.')}
                  disabled={!keyboardTask.content}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Task</span>
                </button>

                <button
                  type="button"
                  onClick={() => flagTask('mod-1-keyboard', 'Typing cadence irregular or insufficient word length.')}
                  disabled={!keyboardTask.content}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 disabled:opacity-40 disabled:cursor-not-allowed text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Flag Violation</span>
                </button>
              </div>
            </div>

          </Card>

        </div>

      </div>

    </div>
  );
};

export default AdminModule1Page;
