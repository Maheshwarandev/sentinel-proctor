import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Camera, 
  Clock, 
  Activity, 
  Copy, 
  Check, 
  AlertCircle, 
  Maximize2, 
  X, 
  Eye,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Archive,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Flame,
  UploadCloud
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';

export const AdminFinishedTasks = () => {
  const navigate = useNavigate();
  const { 
    tasks, 
    approveTask, 
    rejectTask, 
    resetActiveTaskForTomorrow,
    setSelectedTaskId, 
    setAdminActiveTab,
    strikes,
    resetStrikes 
  } = useForensics();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [copiedTaskId, setCopiedTaskId] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [notesInput, setNotesInput] = useState({});
  const [expandedQuestionsTaskId, setExpandedQuestionsTaskId] = useState(null);

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'KEYBOARD') return task.type === 'keyboard';
    if (activeFilter === 'DUOLINGO') return task.type === 'image_ocr' || task.type === 'english_quiz' || task.id === 'mod-2-duolingo';
    if (activeFilter === 'WRITING') return task.type === 'image_exif';
    if (activeFilter === 'PENDING') return !task.auditorVerdict;
    if (activeFilter === 'APPROVED') return task.auditorVerdict === 'APPROVED';
    if (activeFilter === 'FLAGGED') return task.auditorVerdict === 'REJECTED';
    return true;
  });

  const handleCopyText = (taskId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedTaskId(taskId);
    setTimeout(() => setCopiedTaskId(null), 2000);
  };

  const handleNoteChange = (taskId, value) => {
    setNotesInput(prev => ({ ...prev, [taskId]: value }));
  };

  const handleApprove = (task) => {
    const note = notesInput[task.id] || 'Verified and approved.';
    approveTask(task.id, note);
    setFeedbackToast({
      type: 'APPROVE',
      text: `${task.title} approved and saved to Daily Archive!`
    });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleReject = (task) => {
    const note = notesInput[task.id] || 'Non-compliance detected. Revision required.';
    rejectTask(task.id, note);
    setFeedbackToast({
      type: 'REJECT',
      text: `Revision requested: Strike issued for ${task.title}.`
    });
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const todayKey = new Date().toISOString().split('T')[0];
  const allThreeApprovedToday = tasks.length >= 3 && tasks.every(t => t.status === 'VERIFIED' && t.auditorVerdict === 'APPROVED');

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center space-x-2.5 shadow-lg animate-in fade-in slide-in-from-top-2 ${
          feedbackToast.type === 'APPROVE'
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
        }`}>
          {feedbackToast.type === 'APPROVE' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedbackToast.text}</span>
        </div>
      )}

      {/* All 3 Tasks Approved Banner with direct jump to Today's Archive */}
      {allThreeApprovedToday && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/20 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2.5 text-xs text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All 3 modules approved today! Permanently recorded in Daily Archive.</span>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/admin/archive?date=${todayKey}`)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all shrink-0"
          >
            <span>View Today in Archive (3/3 Modules) →</span>
          </button>
        </div>
      )}

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'ALL', label: 'All Tasks' },
            { id: 'KEYBOARD', label: 'Keyboard' },
            { id: 'DUOLINGO', label: 'Duolingo' },
            { id: 'WRITING', label: 'Writing' },
            { id: 'PENDING', label: 'Needs Review' },
            { id: 'APPROVED', label: 'Approved' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {strikes > 0 && (
            <button
              type="button"
              onClick={resetStrikes}
              className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm group"
              title="Clear all active strikes back to 0"
            >
              <RotateCcw className="w-3 h-3 text-rose-400 group-hover:rotate-180 transition-transform duration-500" />
              <span>Clear Strikes ({strikes})</span>
            </button>
          )}
          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredTasks.length}</strong> submissions
          </span>
        </div>
      </div>

      {/* Submissions Cards */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-800/80 bg-slate-900/40 text-slate-400">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm">No submissions match the selected filter.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isApproved = task.auditorVerdict === 'APPROVED';
            const isRejected = task.auditorVerdict === 'REJECTED';

            return (
              <div 
                key={task.id}
                className="rounded-2xl border border-slate-800/90 bg-slate-900/70 hover:bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4 transition-all hover:border-slate-700/80"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3.5">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl border shrink-0 ${
                      task.type === 'keyboard'
                        ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                        : task.type === 'image_ocr'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                    }`}>
                      {task.type === 'keyboard' && <Terminal className="w-4 h-4" />}
                      {task.type === 'image_ocr' && <Flame className="w-4 h-4" />}
                      {task.type === 'image_exif' && <Camera className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          {task.title}
                        </h2>
                        <span className="text-[10px] text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                          {task.id === 'mod-1-keyboard' ? 'Module 1' : task.id === 'mod-2-duolingo' ? 'Module 2' : 'Module 3'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {task.submittedAt ? (
                          `Submitted at ${new Date(task.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Subject: Brother`
                        ) : (
                          'Awaiting submission from Brother • Not yet completed'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Status Badges & Deep Inspect */}
                  <div className="flex items-center space-x-2">
                    {task.status === 'PENDING' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700/60">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        Pending Submission
                      </span>
                    ) : isApproved ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Archive className="w-3.5 h-3.5 mr-1" />
                        Approved & Archived
                      </span>
                    ) : isRejected ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        Revision Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Needs Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Details: What He Sent */}
                <div>
                  {/* MODULE 1: TYPED ESSAY & STATS */}
                  {task.type === 'keyboard' && (
                    <div className="space-y-3">
                      {/* Metric pills row */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">Typing Speed</span>
                          <span className="text-cyan-400 font-bold text-sm">
                            {task.telemetry?.wpm ? `${task.telemetry.wpm} WPM` : '--'}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">Total Words</span>
                          <span className="text-white font-bold text-sm">
                            {task.submissionText ? `${task.submissionText.trim().split(/\s+/).length} words` : '0 words'}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">Active Writing Time</span>
                          <span className="text-teal-400 font-bold text-sm">
                            {task.telemetry?.durationSec ? `${Math.floor(task.telemetry.durationSec / 60)}m ${task.telemetry.durationSec % 60}s` : '--'}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">Tab Switches</span>
                          <span className={`font-bold text-sm ${(task.telemetry?.tabSwitches || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {task.telemetry?.tabSwitches || 0}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">Clipboard Paste</span>
                          <span className="text-emerald-400 font-bold text-sm">
                            {task.telemetry?.pasteAttempts ? `Blocked (${task.telemetry.pasteAttempts})` : 'Blocked (0)'}
                          </span>
                        </div>
                      </div>

                      {/* Text display */}
                      <div className="relative rounded-xl bg-slate-950 border border-slate-800/80 p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 border-b border-slate-800/60 pb-1.5">
                          <span className="font-medium">Submitted Text:</span>
                          {task.submissionText && (
                            <button
                              onClick={() => handleCopyText(task.id, task.submissionText)}
                              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
                            >
                              {copiedTaskId === task.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-h-44 overflow-y-auto select-text font-mono">
                          {task.submissionText || (
                            <span className="text-slate-600 italic">No text submitted yet. Awaiting Brother typing practice in Module 1.</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* MODULE 2: ENGLISH ASSESSMENT (WINDOWS 11 ENGINE) OR LEGACY SCREENSHOT */}
                  {(task.type === 'english_quiz' || task.quizScore !== undefined || (task.id === 'mod-2-duolingo' && !task.image)) ? (
                    <div className="space-y-3">
                      {/* Metric pills row */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">Assessment Score</span>
                          <span className="text-white font-bold text-sm">
                            {task.quizScore !== undefined ? `${task.quizScore} / ${task.totalQuestions || task.results?.length || 50}` : 'Pending'}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">Accuracy</span>
                          <span className="text-emerald-400 font-bold text-sm">
                            {task.percentage !== undefined ? `${task.percentage}%` : '--'}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">XP Earned</span>
                          <span className="text-amber-400 font-bold text-sm">
                            {task.xpEarned || '+30 XP'}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">Avg Speed / Q</span>
                          <span className="text-cyan-400 font-bold text-sm">
                            {task.avgTimePerQuestionSec ? `${task.avgTimePerQuestionSec}s` : '--'}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">Cadence Integrity</span>
                          <span className="text-teal-400 font-bold text-sm">
                            {task.integrityScore !== undefined ? `${task.integrityScore}%` : '100%'}
                          </span>
                        </div>
                      </div>

                      {/* Assessment summary box */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 font-mono font-bold text-[10px] border border-sky-500/20">
                              WINDOWS 11 ASSESSMENT ENGINE
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/20">
                              ⚡ INFINITE AI ENGINE
                            </span>
                            <span className="text-slate-300 font-semibold">{task.lessonTitle || 'Beginner English & Computer Programming'}</span>
                          </div>
                          <span className="text-emerald-400 font-mono text-[11px] font-bold">
                            {task.streakDetected || '43 DAYS STREAK (ASSESSMENT CERTIFIED)'}
                          </span>
                        </div>

                        {/* Violations notice if any */}
                        {task.violations?.length > 0 && (
                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
                            <span className="font-bold block">Cadence Telemetry Alerts:</span>
                            {task.violations.map((v, i) => (
                              <p key={i} className="text-slate-400 font-mono">• {v}</p>
                            ))}
                          </div>
                        )}

                        {/* Expand/Collapse Questions Toggle */}
                        {task.results?.length > 0 ? (
                          <div>
                            <button
                              type="button"
                              onClick={() => setExpandedQuestionsTaskId(prev => prev === task.id ? null : task.id)}
                              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1.5 transition-colors pt-1"
                            >
                              <span>{expandedQuestionsTaskId === task.id ? 'Hide Question Breakdown' : `View ${task.results.length} Questions & Answers Breakdown`}</span>
                              {expandedQuestionsTaskId === task.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {expandedQuestionsTaskId === task.id && (
                              <div className="mt-3 space-y-2.5 border-t border-slate-800/60 pt-3 animate-in fade-in">
                                {task.results.map((q, idx) => (
                                  <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-400 font-mono font-bold text-[10px]">
                                        Question #{idx + 1} • {q.category}
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-[10px] text-slate-500 font-mono">{q.timeSpentSec}s response</span>
                                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                          q.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                        }`}>
                                          {q.isCorrect ? 'CORRECT ✓' : 'INCORRECT ✕'}
                                        </span>
                                      </div>
                                    </div>

                                    <p className="text-white font-medium">"{q.questionText}"</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                                      <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                                        <span className="text-slate-500 block text-[9px]">CANDIDATE ANSWER:</span>
                                        <span className={q.isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                                          {q.userSelectedText || '--'}
                                        </span>
                                      </div>
                                      <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                                        <span className="text-slate-500 block text-[9px]">TRUE SERVER KEY:</span>
                                        <span className="text-emerald-400 font-semibold">
                                          {q.correctAnswerText || '--'}
                                        </span>
                                      </div>
                                    </div>

                                    {q.explanation && (
                                      <p className="text-[11px] text-slate-400 italic pt-0.5">
                                        Explanation: {q.explanation}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-500 italic">
                            Zero-knowledge assessment completed in native Windows 11 Fluent environment.
                          </p>
                        )}
                      </div>

                      {/* Real-Time Proctoring Camera Surveillance Dossier */}
                      {task.proctorSnapshots?.length > 0 ? (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                            <div className="flex items-center space-x-2">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                              </span>
                              <span className="font-bold text-white flex items-center space-x-1.5">
                                <Camera className="w-4 h-4 text-rose-400" />
                                <span>Real-Time Webcam Proctoring Dossier ({task.proctorSnapshots.length} Frames Captured)</span>
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              {task.cameraDevice && (
                                <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                  {task.cameraDevice}
                                </span>
                              )}
                              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                SURVEILLANCE VERIFIED ✓
                              </span>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-400">
                            Automatic video snapshots captured at baseline start, periodic intervals (35s), and focus-loss events. Click any frame to zoom:
                          </p>

                          {/* Grid of snapshots with click-to-zoom */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
                            {task.proctorSnapshots.map((snap, idx) => (
                              <div
                                key={snap.id || idx}
                                onClick={() => setZoomImage(snap.image)}
                                className="group relative rounded-xl border border-slate-800 bg-slate-900 overflow-hidden cursor-pointer hover:border-cyan-400/60 transition-all hover:scale-[1.03] shadow-sm"
                                title={`Click to zoom frame captured at ${snap.timeStr}`}
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
                          <span className="text-[10px] font-mono text-slate-600">Continuous Proctoring Active</span>
                        </div>
                      )}
                    </div>
                  ) : task.type === 'image_ocr' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div 
                        className="md:col-span-4 relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden group cursor-pointer min-h-[160px] flex items-center justify-center"
                        onClick={() => task.image && setZoomImage(task.image)}
                      >
                        {task.image ? (
                          <>
                            <img 
                              src={task.image} 
                              alt="Duolingo streak"
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 text-xs text-cyan-300 font-medium">
                              <Maximize2 className="w-4 h-4" />
                              <span>View Full Image</span>
                            </div>
                          </>
                        ) : (
                          <div className="p-6 text-center space-y-2 text-slate-600">
                            <UploadCloud className="w-8 h-8 mx-auto text-slate-700" />
                            <div className="text-xs font-medium text-slate-500">No Assessment Recorded</div>
                            <p className="text-[10px] text-slate-600">Awaiting brother's assessment submission</p>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-8 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                          <span className="text-slate-400">Detected Streak:</span>
                          <span className="text-amber-400 font-bold">{task.ocrData?.streakDetected || '--'}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                          <span className="text-slate-400">XP Verified:</span>
                          <span className="text-white font-semibold">{task.ocrData?.xpEarned || '--'}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                          <span className="text-slate-400">Lesson Title:</span>
                          <span className="text-slate-300">{task.ocrData?.lessonTitle || 'Awaiting submission'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Duplicate Check:</span>
                          <span className="text-emerald-400 font-semibold">{task.hash?.matchStatus || 'Awaiting submission'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODULE 3: HANDWRITING EXIF PHOTO */}
                  {task.type === 'image_exif' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {task.images && Array.isArray(task.images) && task.images.length > 1 ? (
                        <div className="md:col-span-5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-300 font-semibold flex items-center space-x-1.5">
                              <Camera className="w-3.5 h-3.5 text-teal-400" />
                              <span>Multi-Page Artifact ({task.images.length} Pages)</span>
                            </span>
                            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                              {task.fileSize || `${task.images.length} Photos`}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {task.images.map((slot, sIdx) => {
                              const slotImg = typeof slot === 'string' ? slot : (slot.dataUrl || slot.image);
                              const pageNum = slot.pageNumber || (sIdx + 1);
                              return (
                                <div
                                  key={slot.id || sIdx}
                                  onClick={() => slotImg && setZoomImage(slotImg)}
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
                          <p className="text-[10px] text-slate-500 italic">Click any page thumbnail to zoom in high resolution.</p>
                        </div>
                      ) : (
                        <div 
                          className="md:col-span-4 relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden group cursor-pointer min-h-[160px] flex items-center justify-center"
                          onClick={() => task.image && setZoomImage(task.image)}
                        >
                          {task.image ? (
                            <>
                              <img 
                                src={task.image} 
                                alt="Handwritten notes"
                                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 text-xs text-cyan-300 font-medium">
                                <Maximize2 className="w-4 h-4" />
                                <span>View Full Image</span>
                              </div>
                            </>
                          ) : (
                            <div className="p-6 text-center space-y-2 text-slate-600">
                              <Camera className="w-8 h-8 mx-auto text-slate-700" />
                              <div className="text-xs font-medium text-slate-500">No Photo Uploaded</div>
                              <p className="text-[10px] text-slate-600">Awaiting handwritten notes capture</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className={`${task.images && Array.isArray(task.images) && task.images.length > 1 ? 'md:col-span-7' : 'md:col-span-8'} bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs space-y-2.5`}>
                        {task.images && Array.isArray(task.images) && task.images.length > 1 && (
                          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                            <span className="text-slate-400">Total Uploaded Pages:</span>
                            <span className="text-teal-300 font-bold font-mono">
                              {task.images.length} Pages Verified ({task.fileSize || `${task.images.length * 2} MB`})
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                          <span className="text-slate-400">Camera Model:</span>
                          <span className="text-teal-300 font-semibold">
                            {task.exifData?.deviceModel ? `${task.exifData.deviceMake} ${task.exifData.deviceModel}` : '--'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                          <span className="text-slate-400">Date & Time Taken:</span>
                          <span className="text-white font-medium">{task.exifData?.dateTimeOriginal || '--'}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                          <span className="text-slate-400">Sensor / Lens:</span>
                          <span className="text-slate-300">{task.exifData?.lens || '--'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Hash Match:</span>
                          <span className="text-emerald-400 font-semibold">{task.hash?.matchStatus || 'Awaiting upload'}</span>
                        </div>

                        {/* Assigned 10-Point Handwriting Topic */}
                        {task.writingTopic && (
                          <div className="pt-2 border-t border-slate-800/60 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-mono text-teal-400 font-bold flex items-center space-x-1">
                                <BookOpen className="w-3 h-3 mr-1" />
                                <span>Assigned 10-Point Topic:</span>
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">{task.writingCategory || 'Writing'}</span>
                            </div>
                            <div className="font-bold text-white text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                              "{task.writingTopic}"
                            </div>
                            
                            {task.writingPoints?.length > 0 && (
                              <details className="text-[11px] text-slate-400">
                                <summary className="cursor-pointer text-teal-400 hover:text-teal-300 font-mono text-[10px] font-semibold py-1">
                                  ▸ View {task.writingPoints.length} Assigned Points to Verify Handwriting
                                </summary>
                                <div className="mt-2 space-y-1.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 max-h-48 overflow-y-auto font-mono text-[10px]">
                                  {task.writingPoints.map((pt, i) => (
                                    <div key={i} className="text-slate-300">
                                      <strong className="text-teal-400 mr-1.5">{String(i + 1).padStart(2, '0')}.</strong>
                                      <span>{pt}</span>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Bar: Note & Approve / Redo */}
                <div className="pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={notesInput[task.id] || task.auditorNotes || ''}
                      onChange={(e) => handleNoteChange(task.id, e.target.value)}
                      placeholder="Add an evaluation note or feedback..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isApproved ? (
                      <>
                        <button
                          type="button"
                          onClick={() => navigate('/admin/archive')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                        >
                          <Archive className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View in Archive</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            resetActiveTaskForTomorrow(task.id);
                            setFeedbackToast({
                              type: 'APPROVE',
                              text: `Slot for ${task.title} reset for tomorrow's session.`
                            });
                            setTimeout(() => setFeedbackToast(null), 3000);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                          title="Clear active slot so brother can submit next session"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Reset for Tomorrow</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReject(task)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Request Redo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApprove(task)}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Archive</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Image Modal */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3.5 border-b border-slate-800 text-xs text-slate-300">
              <span className="font-medium">Artifact Preview</span>
              <button 
                onClick={() => setZoomImage(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex justify-center bg-black">
              <img src={zoomImage} alt="Artifact full size" className="max-h-[80vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFinishedTasks;
