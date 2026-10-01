import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  BookOpen, 
  Award, 
  Search, 
  Check, 
  XCircle, 
  Eye, 
  ArrowRight,
  Filter,
  ChefHat,
  Utensils,
  Laptop,
  Zap,
  Terminal,
  Sparkles
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';
import { PageHeader, StatCard, Card, Badge, Button } from './ui';
import { CyberNotificationPopup } from './CyberNotificationPopup';
import { 
  KITCHEN_ANALOGY_COMPONENTS, 
  COLLEGE_TROUBLESHOOTING_CASES, 
  KNOW_YOUR_OWN_RIG_TASKS 
} from '../data/techHardwareData';

export const AdminModule4Page = () => {
  const { 
    tasks, 
    approveTask, 
    rejectTask, 
    clearTask,
    notifications
  } = useForensics();

  const techTask = tasks?.find(t => t.id === 'mod-4-techhardware') || {
    id: 'mod-4-techhardware',
    title: 'Module 4: Tech & Hardware Mastery',
    status: 'PENDING',
    score: null,
    totalQuestions: null,
    percentage: null,
    results: [],
    rigAudit: null
  };

  // Pass threshold configuration (stored in localStorage)
  const [passThreshold, setPassThreshold] = useState(() => {
    const saved = localStorage.getItem('module4_pass_threshold');
    return saved ? parseInt(saved, 10) : 60;
  });
  const [thresholdFeedback, setThresholdFeedback] = useState(null);

  // Curriculum Inspector Tab: 'kitchen' | 'troubleshooting'
  const [curriculumTab, setCurriculumTab] = useState('kitchen');
  const [selectedKitchenId, setSelectedKitchenId] = useState(KITCHEN_ANALOGY_COMPONENTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveThreshold = (val) => {
    const num = Math.max(50, Math.min(100, parseInt(val, 10) || 60));
    setPassThreshold(num);
    localStorage.setItem('module4_pass_threshold', num.toString());
    setThresholdFeedback(`Passing threshold updated to ${num}%.`);
    setTimeout(() => setThresholdFeedback(null), 3500);
  };

  const handleApprove = () => {
    if (approveTask) {
      approveTask('mod-4-techhardware', 'Supervisor verified candidate rig audit and troubleshooting mastery.');
    }
  };

  const handleReject = () => {
    if (rejectTask) {
      rejectTask('mod-4-techhardware', 'Rig audit incomplete or troubleshooting diagnosis below standard.');
    }
  };

  const handleResetForCandidate = () => {
    if (window.confirm('Reset candidate Module 4 rig audit and cases for re-attempt?')) {
      clearTask('mod-4-techhardware');
    }
  };

  const selectedKitchenComp = useMemo(() => {
    return KITCHEN_ANALOGY_COMPONENTS.find(c => c.id === selectedKitchenId) || KITCHEN_ANALOGY_COMPONENTS[0];
  }, [selectedKitchenId]);

  const filteredCases = useMemo(() => {
    return COLLEGE_TROUBLESHOOTING_CASES.filter(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.scenario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.badge.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 relative font-['Plus_Jakarta_Sans',sans-serif]">
      <CyberNotificationPopup />

      {/* Page Header */}
      <PageHeader
        badge={
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-xs font-mono font-bold">
              <ChefHat className="w-3.5 h-3.5 text-cyan-400" />
              <span>MODULE 04 SUPERVISOR AUDIT DESK</span>
            </span>
          </div>
        }
        title="Module 4: Tech & Hardware (Kitchen Mental Model)"
        subtitle="Verify candidate machine rig audits, inspect troubleshooting case scores, and oversee the restaurant kitchen hardware curriculum."
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Mental Model"
          value="6 Kitchen Stations"
          subtext="Chef, Countertop, Pantry, Waiter, Sous-Chef, Mains"
          icon={<ChefHat className="w-4 h-4 text-cyan-400" />}
        />
        <StatCard
          label="Pass Threshold"
          value={`${passThreshold}%`}
          subtext="Troubleshooting accuracy standard"
          icon={<Sliders className="w-4 h-4 text-amber-400" />}
        />
        <StatCard
          label="Candidate Rig Audit"
          value={techTask.rigAudit ? 'Audit Logged' : 'Pending Audit'}
          subtext={techTask.rigAudit ? `${techTask.rigAudit.cpuInfo?.slice(0, 18)}...` : 'Candidate has not audited machine'}
          variant={techTask.rigAudit ? 'success' : 'default'}
          icon={<Laptop className="w-4 h-4 text-emerald-400" />}
        />
        <StatCard
          label="Compliance Verdict"
          value={techTask.status === 'VERIFIED' ? 'Approved' : techTask.status === 'SUBMITTED' ? 'Needs Review' : 'Pending'}
          subtext={techTask.submittedAt ? `Submitted ${new Date(techTask.submittedAt).toLocaleTimeString()}` : 'No submission recorded today'}
          variant={techTask.status === 'VERIFIED' ? 'success' : techTask.status === 'SUBMITTED' ? 'warning' : 'default'}
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Curriculum & Mental Model Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-6">

          {/* Pass Threshold Configuration */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Troubleshooting Pass Standard</h3>
              </div>
              <Badge variant="warning">{passThreshold}% Required</Badge>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Minimum diagnostic accuracy for the candidate's college troubleshooting cases to receive supervisor approval.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[50, 60, 70, 80, 100].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleSaveThreshold(pct)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    passThreshold === pct
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/[0.08]'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            {thresholdFeedback && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{thresholdFeedback}</span>
              </div>
            )}
          </Card>

          {/* Progressive Curriculum Inspector */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Curriculum Inspector</h3>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setCurriculumTab('kitchen')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    curriculumTab === 'kitchen'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kitchen Model ({KITCHEN_ANALOGY_COMPONENTS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCurriculumTab('troubleshooting')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    curriculumTab === 'troubleshooting'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dilemmas ({COLLEGE_TROUBLESHOOTING_CASES.length})
                </button>
              </div>
            </div>

            {/* TAB 1: KITCHEN MODEL VIEW */}
            {curriculumTab === 'kitchen' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {KITCHEN_ANALOGY_COMPONENTS.map(comp => (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedKitchenId(comp.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        selectedKitchenId === comp.id
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                          : 'bg-slate-950/60 border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-white truncate">{comp.roleName}</div>
                      <div className="text-[10px] text-cyan-400/80 font-mono truncate">{comp.shortName}</div>
                    </button>
                  ))}
                </div>

                {/* Selected Kitchen Component Details */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl">{selectedKitchenComp.emoji}</span>
                      <div>
                        <span className="text-sm font-bold text-white">{selectedKitchenComp.roleName}</span>
                        <span className="text-[11px] text-slate-400 block font-mono">{selectedKitchenComp.techName}</span>
                      </div>
                    </div>
                    <Badge variant="info">{selectedKitchenComp.badge}</Badge>
                  </div>

                  <p className="text-xs text-cyan-300 font-semibold">
                    {selectedKitchenComp.simpleRole}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/[0.06] text-xs text-slate-200">
                    <strong className="text-cyan-400 block mb-0.5">What it does:</strong>
                    {selectedKitchenComp.whatItDoes}
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/25 text-xs text-amber-200">
                    <strong className="text-amber-400 block mb-0.5">Student Rule:</strong>
                    {selectedKitchenComp.collegeTip}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TROUBLESHOOTING DILEMMAS */}
            {curriculumTab === 'troubleshooting' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search troubleshooting scenarios..."
                    className="w-full bg-slate-950 border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                  {filteredCases.map(item => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        <span className="text-[10px] text-amber-400 font-mono">{item.badge}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2">{item.scenario}</p>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        Rule: {item.collegeGoldenRule}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

        </div>

        {/* Right Column: Candidate Evaluation & Rig Audit Dossier (6 cols) */}
        <div className="lg:col-span-6 space-y-6">

          {/* Candidate Rig Audit & Case Evaluation */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Candidate Rig Audit & Diagnoses</h3>
              </div>
              <Badge variant={techTask.status === 'VERIFIED' ? 'success' : techTask.status === 'SUBMITTED' ? 'warning' : 'neutral'}>
                {techTask.status}
              </Badge>
            </div>

            {/* RIG AUDIT INSPECTION DOSSIER */}
            {techTask.rigAudit ? (
              <div className="space-y-4">
                
                {/* Hardware rig cards */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Candidate Inspected Hardware Rig:</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-950 border border-white/[0.07] space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Chef (CPU)</span>
                      <p className="text-xs font-mono font-bold text-white truncate" title={techTask.rigAudit.cpuInfo}>
                        {techTask.rigAudit.cpuInfo || 'Unspecified'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-white/[0.07] space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Countertop (RAM)</span>
                      <p className="text-xs font-mono font-bold text-white truncate" title={techTask.rigAudit.ramInfo}>
                        {techTask.rigAudit.ramInfo || 'Unspecified'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-white/[0.07] space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Waiter (Route)</span>
                      <p className="text-xs font-mono font-bold text-white truncate" title={techTask.rigAudit.networkType}>
                        {techTask.rigAudit.networkType || 'Unspecified'}
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 pt-0.5">
                    Audit OS: {techTask.rigAudit.os === 'mac' ? 'macOS 🍏' : 'Windows 🪟'} • Audited: {techTask.rigAudit.completedAt ? new Date(techTask.rigAudit.completedAt).toLocaleString() : 'Today'}
                  </div>
                </div>

                {/* Score summary banner */}
                <div className="p-4 rounded-xl bg-slate-950 border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Troubleshooting Diagnoses</span>
                    <p className="text-xl font-mono font-extrabold text-white mt-0.5">
                      {techTask.score !== null && techTask.score !== undefined ? `${techTask.score} / ${techTask.totalQuestions || 3} Correct` : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Diagnostic Standard</span>
                    <p className={`text-base font-bold font-mono mt-0.5 ${
                      techTask.percentage >= passThreshold ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {techTask.percentage !== null && techTask.percentage !== undefined 
                        ? `${techTask.percentage}% (${techTask.percentage >= passThreshold ? '✓ Standard Met' : 'Review Required'})` 
                        : 'Rig Complete'}
                    </p>
                  </div>
                </div>

                {/* Question-by-question breakdown */}
                {Array.isArray(techTask.results) && techTask.results.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Troubleshooting Case Telemetry:
                    </h4>
                    <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                      {techTask.results.map((res, i) => (
                        <div 
                          key={i} 
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            res.isCorrect 
                              ? 'bg-emerald-950/20 border-emerald-500/30' 
                              : 'bg-rose-950/20 border-rose-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{res.scenario || `Case ${i+1}`}</span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              res.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {res.isCorrect ? 'CORRECT' : 'MISDIAGNOSED'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-500 border border-dashed border-white/[0.08] rounded-xl space-y-2">
                <Laptop className="w-8 h-8 text-slate-600 mx-auto" />
                <p>No Module 4 rig audit or troubleshooting submission recorded yet today.</p>
              </div>
            )}

            {/* Auditor Actions */}
            <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetForCandidate}
                className="px-3 py-1.5 rounded-xl border border-white/[0.1] bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset for Candidate</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={techTask.status !== 'SUBMITTED'}
                  className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 disabled:opacity-30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                >
                  Flag / Reject
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={techTask.status !== 'SUBMITTED'}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-slate-950 text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                  <span>Approve & Archive</span>
                </button>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default AdminModule4Page;
