import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  Laptop,
  Zap,
  HelpCircle,
  ThumbsUp,
  Cpu,
  Layers,
  HardDrive,
  Monitor,
  Wifi,
  AlertTriangle,
  RotateCcw,
  Camera,
  Info,
  ExternalLink,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { 
  KITCHEN_ANALOGY_COMPONENTS, 
  COLLEGE_TROUBLESHOOTING_CASES, 
  KNOW_YOUR_OWN_RIG_TASKS 
} from '../data/techHardwareData';
import { useForensics } from '../context/ForensicContext';

export const Module4TechHardwareModal = ({ isOpen, onClose }) => {
  const { 
    tasks, 
    submitTechHardwarePractice 
  } = useForensics();

  const task = tasks?.find(t => t.id === 'mod-4-techhardware') || {
    id: 'mod-4-techhardware',
    title: 'Module 4: Tech & Hardware Mastery',
    status: 'PENDING',
    score: null,
    percentage: null
  };

  const isAlreadySubmitted = task.status === 'SUBMITTED' || task.status === 'VERIFIED';

  // Active Tab: 'analogy' | 'troubleshooting' | 'rig'
  const [activeTab, setActiveTab] = useState('analogy');

  // -------------------------------------------------------------
  // STAGE 1: KITCHEN MODEL STATE
  // -------------------------------------------------------------
  const [selectedComponentId, setSelectedComponentId] = useState(KITCHEN_ANALOGY_COMPONENTS[0].id);
  const [understoodItems, setUnderstoodItems] = useState(() => {
    try {
      const saved = localStorage.getItem('module4_understood_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleUnderstood = (id) => {
    setUnderstoodItems(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('module4_understood_items', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const currentComponent = useMemo(() => {
    return KITCHEN_ANALOGY_COMPONENTS.find(c => c.id === selectedComponentId) || KITCHEN_ANALOGY_COMPONENTS[0];
  }, [selectedComponentId]);

  // -------------------------------------------------------------
  // STAGE 2: COLLEGE TROUBLESHOOTING STATE
  // -------------------------------------------------------------
  const [cases, setCases] = useState(COLLEGE_TROUBLESHOOTING_CASES);
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedCaseOption, setSelectedCaseOption] = useState(null);
  const [caseAnswers, setCaseAnswers] = useState({});
  const [isGeneratingAiCase, setIsGeneratingAiCase] = useState(false);
  const [aiGenMessage, setAiGenMessage] = useState(null);

  const activeCase = cases[currentCaseIndex] || cases[0];
  const currentCaseAnswer = caseAnswers[activeCase?.id];

  const handleSelectOption = (idx) => {
    if (currentCaseAnswer) return;
    setSelectedCaseOption(idx);
  };

  const handleSubmitCaseAnswer = () => {
    if (selectedCaseOption === null || currentCaseAnswer) return;
    const correctIdx = activeCase.correctAnswerIndex ?? activeCase.correctIndex ?? 0;
    const isCorrect = selectedCaseOption === correctIdx;
    setCaseAnswers(prev => ({
      ...prev,
      [activeCase.id]: {
        selectedIndex: selectedCaseOption,
        isCorrect,
        question: activeCase.diagnosticQuestion,
        scenario: activeCase.title
      }
    }));
  };

  const handleNextCase = () => {
    if (currentCaseIndex < cases.length - 1) {
      setCurrentCaseIndex(i => i + 1);
      setSelectedCaseOption(null);
    }
  };

  const handlePrevCase = () => {
    if (currentCaseIndex > 0) {
      setCurrentCaseIndex(i => i - 1);
      setSelectedCaseOption(null);
    }
  };

  const handleGenerateAiCase = async () => {
    setIsGeneratingAiCase(true);
    setAiGenMessage(null);
    try {
      const res = await fetch('/api/tasks/module4/generate-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCasesCount: cases.length })
      });
      const data = await res.json();
      if (data?.success && data?.case) {
        setCases(prev => {
          if (prev.some(c => c.id === data.case.id)) return prev;
          return [...prev, data.case];
        });
        setCurrentCaseIndex(cases.length);
        setSelectedCaseOption(null);
        setAiGenMessage({ type: 'success', text: `✨ Added new scenario: "${data.case.title}"` });
      } else {
        setAiGenMessage({ type: 'error', text: 'All essential scenarios loaded!' });
      }
    } catch (err) {
      setAiGenMessage({ type: 'error', text: 'Using ready scenario bank.' });
    } finally {
      setIsGeneratingAiCase(false);
      setTimeout(() => setAiGenMessage(null), 3000);
    }
  };

  const solvedCasesCount = Object.keys(caseAnswers).length;
  const correctCasesCount = Object.values(caseAnswers).filter(a => a.isCorrect).length;

  // -------------------------------------------------------------
  // STAGE 3: KNOW YOUR OWN RIG STATE & 1-CLICK AUTO-DETECT
  // -------------------------------------------------------------
  const [rigOs, setRigOs] = useState('windows');
  const [rigCpu, setRigCpu] = useState('');
  const [rigRam, setRigRam] = useState('');
  const [rigNetwork, setRigNetwork] = useState('');
  const [autoDetected, setAutoDetected] = useState(false);
  const [autoDetectTimestamp, setAutoDetectTimestamp] = useState(null);
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  // Initialize from previous saved task data if exists
  useEffect(() => {
    if (task.rigAudit) {
      if (task.rigAudit.cpuInfo) setRigCpu(task.rigAudit.cpuInfo);
      if (task.rigAudit.ramInfo) setRigRam(task.rigAudit.ramInfo);
      if (task.rigAudit.networkType) setRigNetwork(task.rigAudit.networkType);
      if (task.rigAudit.os) setRigOs(task.rigAudit.os);
    }
  }, [task]);

  // 1-Click Auto-Detect from Browser Web APIs
  const handleAutoDetectSpecs = () => {
    try {
      const userAgent = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
      let detectedOs = 'windows';
      let osLabel = 'Windows';
      if (/Macintosh|Mac OS X/i.test(userAgent)) {
        detectedOs = 'mac';
        osLabel = 'macOS (Apple Silicon / Intel)';
      } else if (/Linux/i.test(userAgent)) {
        detectedOs = 'linux';
        osLabel = 'Linux';
      }

      setRigOs(detectedOs === 'mac' ? 'mac' : 'windows');

      // CPU Cores Detection
      const cores = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) 
        ? `${navigator.hardwareConcurrency} Logical CPU Cores (${osLabel})`
        : `4+ Cores (${osLabel})`;

      // RAM Detection
      let ramDetect = '';
      if (typeof navigator !== 'undefined' && navigator.deviceMemory) {
        ramDetect = `${navigator.deviceMemory} GB RAM (Browser High-Speed Allocation)`;
      } else {
        ramDetect = '8 GB RAM (Standard College Rig)';
      }

      // Network Detection
      let netDetect = 'Wi-Fi / Ethernet Connected (Online)';
      if (typeof navigator !== 'undefined') {
        if (!navigator.onLine) {
          netDetect = 'Offline (Check your connection)';
        } else if (navigator.connection) {
          const conn = navigator.connection;
          const eff = conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Broadband';
          const typ = conn.type && conn.type !== 'unknown' ? conn.type : 'Wi-Fi / Ethernet';
          netDetect = `${eff} Connection (${typ} • Online)`;
        }
      }

      setRigCpu(cores);
      setRigRam(ramDetect);
      setRigNetwork(netDetect);
      setAutoDetected(true);
      setAutoDetectTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed auto-detecting hardware specs:', err);
    }
  };

  const isRigComplete = rigCpu.trim().length > 1 && rigRam.trim().length > 1 && rigNetwork.trim().length > 1;

  const handleFinalSubmit = () => {
    if (!isRigComplete) {
      setSubmissionFeedback({ type: 'error', text: 'Please complete all 3 laptop fields (or use ⚡ 1-Click Auto-Detect)!' });
      setTimeout(() => setSubmissionFeedback(null), 3500);
      return;
    }

    const totalQuestions = Math.max(1, cases.length);
    const score = correctCasesCount;
    const percentage = Math.round((score / totalQuestions) * 100);

    const submissionPayload = {
      score,
      totalQuestions,
      percentage,
      masteredCount: understoodItems.length,
      casesSolved: solvedCasesCount,
      results: Object.entries(caseAnswers).map(([cId, ans]) => ({
        caseId: cId,
        question: ans.question,
        scenario: ans.scenario,
        isCorrect: ans.isCorrect
      })),
      rigAudit: {
        os: rigOs,
        cpuInfo: rigCpu.trim(),
        ramInfo: rigRam.trim(),
        networkType: rigNetwork.trim(),
        autoDetected,
        completedAt: new Date().toISOString()
      },
      summaryText: `Rig Check Done: ${rigCpu.trim()} • ${rigRam.trim()} • ${rigNetwork.trim()}`
    };

    submitTechHardwarePractice(submissionPayload);
    setSubmissionFeedback({ 
      type: 'success', 
      text: '🎉 Outstanding work! Module 4 has been recorded and submitted for proctor audit.' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      <div 
        className="w-full max-w-5xl max-h-[94vh] flex flex-col bg-[#0b111e] border border-cyan-500/35 rounded-2xl sm:rounded-3xl shadow-2xl shadow-cyan-950/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.08] bg-slate-950/90 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-xl shadow-inner">
              🍳
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                  Module 4: Computer Basics & Hardware
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${
                  task.status === 'VERIFIED'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    : task.status === 'SUBMITTED'
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                }`}>
                  {task.status === 'VERIFIED' ? '✓ Verified' : task.status === 'SUBMITTED' ? 'Submitted' : 'In Progress'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Master how your laptop actually works using the friendly <strong>Restaurant Kitchen Model</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            title="Close Module"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 STAGE PROGRESS TABS */}
        <div className="flex items-center border-b border-white/[0.08] bg-slate-950/60 px-4 sm:px-6 py-2.5 gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('analogy')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analogy'
                ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/20 text-cyan-200 border border-cyan-500/50 shadow-md shadow-cyan-950/40'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span>🍳 1. Kitchen Visual Studio</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
              understoodItems.length === KITCHEN_ANALOGY_COMPONENTS.length
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-cyan-950 text-cyan-300'
            }`}>
              {understoodItems.length}/{KITCHEN_ANALOGY_COMPONENTS.length} Mastered
            </span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />

          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'troubleshooting'
                ? 'bg-gradient-to-r from-amber-500/25 to-orange-500/20 text-amber-200 border border-amber-500/50 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span>💡 2. Quick Dilemmas Lab</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
              solvedCasesCount === cases.length
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-950 text-amber-300'
            }`}>
              {solvedCasesCount}/{cases.length} Solved
            </span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />

          <button
            onClick={() => setActiveTab('rig')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'rig'
                ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/20 text-emerald-200 border border-emerald-500/50 shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span>💻 3. Laptop Rig Inspector</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
              isRigComplete
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {isRigComplete ? 'Ready ✓' : '3 Fields'}
            </span>
          </button>
        </div>

        {/* MAIN BODY VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ======================================================== */}
          {/* STAGE 1: KITCHEN VISUAL STUDIO */}
          {/* ======================================================== */}
          {activeTab === 'analogy' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Friendly Concept Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-500/30 flex items-start sm:items-center space-x-3.5 shadow-sm">
                <span className="text-2xl sm:text-3xl shrink-0">🧑‍🍳</span>
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm text-cyan-200 leading-relaxed font-medium">
                    Think of your computer as a high-speed <strong>Restaurant Kitchen</strong>! Each physical part has one specific job to prepare your apps and files.
                  </p>
                  <p className="text-[11px] text-cyan-400/80">
                    Click each station below to see real photos, how it works in 1 second, and the memorable College Rule.
                  </p>
                </div>
              </div>

              {/* 6 Hardware Station Cards with Real Photos & Emojis */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {KITCHEN_ANALOGY_COMPONENTS.map(comp => {
                  const isSelected = selectedComponentId === comp.id;
                  const isUnderstood = understoodItems.includes(comp.id);
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedComponentId(comp.id)}
                      className={`relative p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-lg shadow-cyan-950/50 ring-2 ring-cyan-400/40 -translate-y-0.5'
                          : 'bg-slate-900/70 hover:bg-slate-900 border-white/[0.08] text-slate-300 hover:border-cyan-500/30'
                      }`}
                    >
                      {/* Photo Thumbnail */}
                      <div className="w-full h-16 sm:h-20 rounded-xl overflow-hidden bg-slate-950 mb-2 relative border border-white/[0.08]">
                        <img 
                          src={comp.image} 
                          alt={comp.techName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute bottom-1 left-1.5 text-base drop-shadow">{comp.emoji}</span>
                        {isUnderstood && (
                          <span className="absolute top-1 right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      {/* Station Info */}
                      <div>
                        <div className="text-xs font-bold text-white truncate leading-snug">{comp.roleName}</div>
                        <div className="text-[10px] text-cyan-400 font-mono font-semibold mt-0.5 truncate">{comp.shortName}</div>
                      </div>

                      <div className="mt-2 pt-1 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="text-[9px] text-slate-400">{comp.badge.split(' ')[0]}</span>
                        {isUnderstood ? (
                          <span className="text-[9px] text-emerald-400 font-bold">✓ Mastered</span>
                        ) : (
                          <span className="text-[9px] text-slate-500 group-hover:text-slate-300">Learn →</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Station Deep Dive Studio (Selected Component) */}
              <div className="rounded-2xl border border-white/[0.1] bg-slate-950/90 p-5 sm:p-6 space-y-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Station Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
                  <div className="flex items-start sm:items-center space-x-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-md shrink-0 bg-slate-900 relative">
                      <img 
                        src={currentComponent.image} 
                        alt={currentComponent.techName} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className="absolute bottom-1 right-1 text-base">{currentComponent.emoji}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base sm:text-lg font-black text-white">
                          {currentComponent.roleName}
                        </h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {currentComponent.techName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                          {currentComponent.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-cyan-300/90 font-medium mt-1">
                        👉 <em>"{currentComponent.inOneSecond || currentComponent.simpleRole}"</em>
                      </p>
                    </div>
                  </div>

                  {/* Toggle Mastered Button */}
                  <button
                    onClick={() => toggleUnderstood(currentComponent.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shrink-0 shadow-sm ${
                      understoodItems.includes(currentComponent.id)
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
                        : 'bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/[0.1]'
                    }`}
                  >
                    <Check className={`w-4 h-4 ${understoodItems.includes(currentComponent.id) ? 'stroke-[3]' : ''}`} />
                    <span>{understoodItems.includes(currentComponent.id) ? 'Mastered ✓' : 'Mark as Mastered'}</span>
                  </button>
                </div>

                {/* SIDE-BY-SIDE COMPARISON: IN THE KITCHEN vs IN YOUR LAPTOP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* In the Kitchen */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-orange-950/20 border border-amber-500/30 space-y-1.5 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🍳</span>
                      <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                        In the Restaurant Kitchen
                      </span>
                    </div>
                    <p className="text-xs text-amber-100 leading-relaxed">
                      {currentComponent.kitchenRole || currentComponent.simpleRole}
                    </p>
                  </div>

                  {/* In Your Laptop */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/30 to-blue-950/20 border border-cyan-500/30 space-y-1.5 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">💻</span>
                      <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                        Inside Your Laptop
                      </span>
                    </div>
                    <p className="text-xs text-cyan-100 leading-relaxed">
                      {currentComponent.computerRole || currentComponent.whatItDoes}
                    </p>
                  </div>
                </div>

                {/* CLEAR ANSWERS TO THE 2 BIG FRESHMAN QUESTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.08] space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                      <span className="text-sm">🚀</span>
                      <span>What happens when you open an app?</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-5">
                      {currentComponent.appAction || currentComponent.whatItDoes}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.08] space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-300">
                      <span className="text-sm">⚡</span>
                      <span>What happens if laptop power is cut?</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-5">
                      {currentComponent.powerLossAction || currentComponent.collegeTip}
                    </p>
                  </div>
                </div>

                {/* MEMORABLE FRESHMAN RULE & SPECS GUIDE */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/35 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">🌟</span>
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                      Freshman Golden Rule
                    </span>
                  </div>
                  <p className="text-xs text-amber-100 leading-relaxed font-medium">
                    {currentComponent.freshmanRule || currentComponent.collegeTip}
                  </p>
                  {currentComponent.specsGuide && (
                    <div className="pt-2 border-t border-amber-500/20 text-[11px] text-amber-300/80 font-mono">
                      📊 <strong>Specs Guide:</strong> {currentComponent.specsGuide}
                    </div>
                  )}
                </div>

                {/* Bottom Step Advance Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-white/[0.08] gap-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-300 font-mono">
                    <span className="font-bold text-cyan-400">{understoodItems.length}</span>
                    <span>of {KITCHEN_ANALOGY_COMPONENTS.length} hardware stations mastered</span>
                  </div>

                  <button
                    onClick={() => setActiveTab('troubleshooting')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
                  >
                    <span>Continue to Dilemmas Lab</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 2: COLLEGE TROUBLESHOOTING LAB */}
          {/* ======================================================== */}
          {activeTab === 'troubleshooting' && (
            <div className="space-y-5 animate-fade-in">

              {/* Case Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/30 gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{activeCase.emoji || '💡'}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs sm:text-sm font-black text-white">{activeCase.title}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {activeCase.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Scenario {currentCaseIndex + 1} of {cases.length} • Score: {correctCasesCount}/{solvedCasesCount} Correct
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGenerateAiCase}
                  disabled={isGeneratingAiCase}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-bold text-cyan-300 flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAiCase ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAiCase ? 'Analyzing...' : '✨ New AI Scenario'}</span>
                </button>
              </div>

              {aiGenMessage && (
                <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-xs text-cyan-300 font-mono animate-fade-in">
                  {aiGenMessage.text}
                </div>
              )}

              {/* Scenario Interactive Card */}
              {activeCase && (
                <div className="rounded-2xl border border-white/[0.1] bg-slate-950/90 p-5 sm:p-6 space-y-5 shadow-xl">
                  
                  {/* Relatable Problem Description */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-white/[0.08] text-xs sm:text-sm text-slate-200 leading-relaxed shadow-inner">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                      <span>⚠️ The College Dilemma:</span>
                    </div>
                    {activeCase.scenario}
                  </div>

                  {/* Diagnostic Question */}
                  <div className="space-y-3">
                    <h5 className="text-xs sm:text-sm font-extrabold text-white flex items-center space-x-2">
                      <span className="text-cyan-400">❓</span>
                      <span>{activeCase.diagnosticQuestion}</span>
                    </h5>

                    {/* Multiple-Choice Options */}
                    <div className="space-y-2.5">
                      {activeCase.options.map((option, idx) => {
                        const isSelected = selectedCaseOption === idx;
                        const isRecorded = currentCaseAnswer !== undefined;
                        const correctIdx = activeCase.correctAnswerIndex ?? activeCase.correctIndex ?? 0;
                        const isCorrectOption = idx === correctIdx;
                        const isChosenOption = currentCaseAnswer?.selectedIndex === idx;

                        let style = 'bg-slate-900/60 hover:bg-slate-900 border-white/[0.08] text-slate-300 hover:border-cyan-500/30';
                        if (isRecorded) {
                          if (isCorrectOption) {
                            style = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-950/50';
                          } else if (isChosenOption && !currentCaseAnswer.isCorrect) {
                            style = 'bg-rose-950/50 border-rose-500 text-rose-300';
                          } else {
                            style = 'bg-slate-950/50 border-white/[0.04] text-slate-500 opacity-40';
                          }
                        } else if (isSelected) {
                          style = 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/30';
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            disabled={isRecorded}
                            className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center space-x-3 cursor-pointer disabled:cursor-default ${style}`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                              isRecorded && isCorrectOption 
                                ? 'bg-emerald-500 text-slate-950'
                                : isSelected 
                                ? 'bg-cyan-400 text-slate-950' 
                                : 'bg-black/50 text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1 leading-snug">{option}</span>
                            {isRecorded && isCorrectOption && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  {!currentCaseAnswer && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={handleSubmitCaseAnswer}
                        disabled={selectedCaseOption === null}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md shadow-amber-500/20"
                      >
                        Check My Diagnosis
                      </button>
                    </div>
                  )}

                  {/* INSTANT KITCHEN DIAGNOSIS FEEDBACK */}
                  {currentCaseAnswer && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/40 space-y-2.5 animate-fade-in text-xs sm:text-sm shadow-md">
                      <div className="flex items-center space-x-2 font-bold text-cyan-300">
                        <span className="text-base">🍳</span>
                        <span className="text-xs uppercase tracking-wider">Kitchen Diagnosis:</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">
                        {activeCase.kitchenDiagnosis || activeCase.explanation}
                      </p>
                      <div className="pt-2 border-t border-cyan-500/20 flex items-center space-x-2 text-emerald-300 font-semibold text-xs">
                        <span>🌟</span>
                        <span>{activeCase.collegeGoldenRule || activeCase.collegeLifeRule}</span>
                      </div>
                    </div>
                  )}

                  {/* Prev / Next Controls & Advance */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-white/[0.08] gap-3">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button
                        onClick={handlePrevCase}
                        disabled={currentCaseIndex === 0}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-20 text-xs text-slate-300 flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                      <button
                        onClick={handleNextCase}
                        disabled={currentCaseIndex === cases.length - 1}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-20 text-xs text-slate-300 flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveTab('rig')}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/25"
                    >
                      <span>Continue to Check Laptop</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 3: RIG INSPECTOR & 1-CLICK AUTO-DETECT */}
          {/* ======================================================== */}
          {activeTab === 'rig' && (
            <div className="space-y-5 animate-fade-in">

              {/* Inspector Header Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/35 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Laptop className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm sm:text-base font-extrabold text-white">Know Your Own Laptop Rig</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Verify what CPU processor, RAM memory, and internet connection powers your machine.
                  </p>
                </div>

                {/* OS Switcher */}
                <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-950 border border-white/[0.1] self-start md:self-auto shrink-0">
                  <button
                    onClick={() => setRigOs('windows')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      rigOs === 'windows' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Windows 🪟
                  </button>
                  <button
                    onClick={() => setRigOs('mac')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      rigOs === 'mac' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    macOS 🍏
                  </button>
                </div>
              </div>

              {/* ⚡ 1-CLICK AUTO-DETECT HERO BUTTON */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-blue-950/40 to-slate-900 border-2 border-cyan-400/50 shadow-xl shadow-cyan-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
                    <h5 className="text-sm font-black text-white">Instant 1-Click Hardware Scan</h5>
                  </div>
                  <p className="text-xs text-cyan-200/90 leading-relaxed">
                    Don't want to dig through Task Manager? Click below to instantly query your browser hardware APIs for CPU cores, RAM, and network status!
                  </p>
                  {autoDetected && (
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>⚡ Auto-Detected from Browser Hardware APIs ({autoDetectTimestamp || 'Active'})</span>
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAutoDetectSpecs}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs sm:text-sm font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/30 shrink-0 active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{autoDetected ? '⚡ Re-Detect Specs' : '⚡ Auto-Detect My Laptop Specs'}</span>
                </button>
              </div>

              {/* 3 Interactive Question Cards */}
              <div className="space-y-3.5">
                {KNOW_YOUR_OWN_RIG_TASKS.map((item) => {
                  const currentVal = item.id === 'audit-cpu' ? rigCpu : item.id === 'audit-ram' ? rigRam : rigNetwork;
                  const setVal = item.id === 'audit-cpu' ? setRigCpu : item.id === 'audit-ram' ? setRigRam : setRigNetwork;
                  const instructions = rigOs === 'windows' ? item.easyInstructionsWindows : item.easyInstructionsMac;
                  const isFieldFilled = currentVal.trim().length > 1;

                  return (
                    <div 
                      key={item.id} 
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isFieldFilled 
                          ? 'border-emerald-500/40 bg-slate-950/90 shadow-md shadow-emerald-950/20' 
                          : 'border-white/[0.08] bg-slate-950/70'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                        <div className="flex items-center space-x-2.5">
                          <span className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center font-mono ${
                            isFieldFilled ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {isFieldFilled ? '✓' : item.stepNumber}
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-white">{item.title}</span>
                        </div>
                        <span className="text-[11px] text-cyan-400/80 font-mono hidden sm:inline">
                          {item.analogyRef}
                        </span>
                      </div>

                      {/* Manual lookup guide */}
                      <div className="my-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-white/[0.05] text-[11px] text-cyan-200/90 flex items-start space-x-2">
                        <span className="text-xs shrink-0">🔍</span>
                        <div>
                          <strong>Manual Steps ({rigOs === 'windows' ? 'Windows' : 'Mac'}):</strong> {instructions}
                        </div>
                      </div>

                      {/* Input with Auto-Detected Badge */}
                      <div className="relative">
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => setVal(e.target.value)}
                          placeholder={item.placeholder}
                          className="w-full bg-slate-900 border border-white/[0.12] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
                        />
                        {isFieldFilled && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-emerald-400 text-[10px] font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Indicator Bar */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.08] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className={`w-4 h-4 ${isRigComplete ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className={isRigComplete ? 'text-emerald-300 font-bold' : 'text-slate-400'}>
                    {isRigComplete 
                      ? '✓ All 3 Rig specifications verified and ready for audit!' 
                      : 'Please populate all 3 fields above to submit.'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold">
                  {[rigCpu, rigRam, rigNetwork].filter(x => x.trim().length > 1).length} of 3 Complete
                </span>
              </div>

              {/* Feedback Message Alert */}
              {submissionFeedback && (
                <div className={`p-4 rounded-xl text-xs sm:text-sm font-mono border animate-fade-in ${
                  submissionFeedback.type === 'success' 
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200' 
                    : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                }`}>
                  {submissionFeedback.text}
                </div>
              )}

              {/* Big Celebratory Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.08]">
                <button
                  onClick={() => setActiveTab('troubleshooting')}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ← Back to Dilemmas
                </button>

                <button
                  onClick={handleFinalSubmit}
                  disabled={!isRigComplete}
                  className={`w-full sm:w-auto px-8 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2.5 transition-all cursor-pointer shadow-xl ${
                    isRigComplete
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/30 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  <span>
                    {isAlreadySubmitted ? '✓ Update & Re-Submit Module 4' : '🎉 Submit Module 4 For Review'}
                  </span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Module4TechHardwareModal;
