import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  ChefHat, 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  Laptop,
  Zap,
  HelpCircle,
  ThumbsUp
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
        setAiGenMessage({ type: 'error', text: 'Ready with current scenarios!' });
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
  // STAGE 3: KNOW YOUR OWN RIG STATE
  // -------------------------------------------------------------
  const [rigOs, setRigOs] = useState('windows');
  const [rigCpu, setRigCpu] = useState('');
  const [rigRam, setRigRam] = useState('');
  const [rigNetwork, setRigNetwork] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  useEffect(() => {
    if (task.rigAudit) {
      if (task.rigAudit.cpuInfo) setRigCpu(task.rigAudit.cpuInfo);
      if (task.rigAudit.ramInfo) setRigRam(task.rigAudit.ramInfo);
      if (task.rigAudit.networkType) setRigNetwork(task.rigAudit.networkType);
    }
  }, [task]);

  const isRigComplete = rigCpu.trim().length > 1 && rigRam.trim().length > 1 && rigNetwork.trim().length > 1;

  const handleFinalSubmit = () => {
    if (!isRigComplete) {
      setSubmissionFeedback({ type: 'error', text: 'Please answer all 3 quick questions about your laptop!' });
      setTimeout(() => setSubmissionFeedback(null), 3000);
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
        completedAt: new Date().toISOString()
      },
      summaryText: `Rig Check Done: ${rigCpu.trim()} • ${rigRam.trim()} RAM • ${rigNetwork.trim()}`
    };

    submitTechHardwarePractice(submissionPayload);
    setSubmissionFeedback({ type: 'success', text: '🎉 Awesome job! Your check has been submitted for review.' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0b111e] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-slate-950/80 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🍳</span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Module 4: Computer Basics Made Simple
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  task.status === 'VERIFIED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : task.status === 'SUBMITTED'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {task.status === 'VERIFIED' ? '✓ Verified' : task.status === 'SUBMITTED' ? 'Submitted' : 'In Progress'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Learn how a computer works using a simple kitchen model!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 STEPS TABS */}
        <div className="flex items-center border-b border-white/[0.07] bg-slate-950/40 px-5 py-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('analogy')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analogy'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🍳 1. The Kitchen Model</span>
            <span className="text-[10px] font-mono bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-400">
              {understoodItems.length}/6
            </span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'troubleshooting'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💡 2. Quick Dilemmas</span>
            <span className="text-[10px] font-mono bg-amber-950 px-1.5 py-0.5 rounded text-amber-400">
              {solvedCasesCount}/{cases.length}
            </span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

          <button
            onClick={() => setActiveTab('rig')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'rig'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💻 3. Check Your Laptop</span>
            <span className="text-[10px] font-mono bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-400">
              {isRigComplete ? 'Done ✓' : '3 Qs'}
            </span>
          </button>
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ======================================================== */}
          {/* TAB 1: THE KITCHEN ANALOGY */}
          {/* ======================================================== */}
          {activeTab === 'analogy' && (
            <div className="space-y-4">
              
              {/* Simple Banner */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/25 flex items-center space-x-3">
                <span className="text-xl">💡</span>
                <p className="text-xs text-cyan-200 leading-relaxed">
                  Think of your computer as a busy <strong>Restaurant Kitchen</strong>. Click each station below to see what it does in simple words!
                </p>
              </div>

              {/* 6 Kitchen Stations Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {KITCHEN_ANALOGY_COMPONENTS.map(comp => {
                  const isSelected = selectedComponentId === comp.id;
                  const isUnderstood = understoodItems.includes(comp.id);
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedComponentId(comp.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[90px] ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-white/[0.08] text-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{comp.emoji}</span>
                      <div className="text-xs font-bold text-white">{comp.roleName}</div>
                      <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{comp.shortName}</div>
                      {isUnderstood && (
                        <span className="text-[9px] text-emerald-400 font-bold mt-1">✓ Got it</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Current Station Details (Short & Simple) */}
              <div className="rounded-xl border border-white/[0.1] bg-slate-950/80 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{currentComponent.emoji}</span>
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {currentComponent.roleName} ({currentComponent.techName})
                      </h4>
                      <p className="text-xs text-cyan-400 font-medium">{currentComponent.simpleRole}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleUnderstood(currentComponent.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      understoodItems.includes(currentComponent.id)
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/[0.08] hover:bg-white/[0.14] text-slate-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{understoodItems.includes(currentComponent.id) ? 'Mastered ✓' : 'Mark as Understood'}</span>
                  </button>
                </div>

                {/* 2 Simple Cards instead of 4 dense boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/[0.06] space-y-1">
                    <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide">
                      What it does:
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {currentComponent.whatItDoes}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                      Student Rule:
                    </span>
                    <p className="text-xs text-amber-100 leading-relaxed">
                      {currentComponent.collegeTip}
                    </p>
                  </div>
                </div>

                {/* Bottom Step Advance */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400 font-mono">
                    {understoodItems.length} of 6 parts understood
                  </span>
                  <button
                    onClick={() => setActiveTab('troubleshooting')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <span>Next: Quick Dilemmas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: COLLEGE TROUBLESHOOTING */}
          {/* ======================================================== */}
          {activeTab === 'troubleshooting' && (
            <div className="space-y-4">

              {/* Case Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/25">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{activeCase.emoji || '💡'}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{activeCase.title}</h4>
                    <span className="text-[10px] text-amber-300 font-mono">Scenario {currentCaseIndex + 1} of {cases.length}</span>
                  </div>
                </div>

                <button
                  onClick={handleGenerateAiCase}
                  disabled={isGeneratingAiCase}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-bold text-cyan-300 flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAiCase ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAiCase ? 'Thinking...' : '✨ New AI Scenario'}</span>
                </button>
              </div>

              {aiGenMessage && (
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
                  {aiGenMessage.text}
                </div>
              )}

              {/* Case Box */}
              {activeCase && (
                <div className="rounded-xl border border-white/[0.08] bg-slate-950/80 p-5 space-y-4">
                  
                  {/* Short Scenario */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/[0.06] text-xs text-slate-200 leading-relaxed">
                    <strong className="text-amber-400 block mb-0.5">The Problem:</strong>
                    {activeCase.scenario}
                  </div>

                  {/* Question */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-white">
                      👉 {activeCase.diagnosticQuestion}
                    </h5>

                    {/* Short Options */}
                    <div className="space-y-2">
                      {activeCase.options.map((option, idx) => {
                        const isSelected = selectedCaseOption === idx;
                        const isRecorded = currentCaseAnswer !== undefined;
                        const correctIdx = activeCase.correctAnswerIndex ?? activeCase.correctIndex ?? 0;
                        const isCorrectOption = idx === correctIdx;
                        const isChosenOption = currentCaseAnswer?.selectedIndex === idx;

                        let style = 'bg-slate-900/60 hover:bg-slate-900 border-white/[0.08] text-slate-300';
                        if (isRecorded) {
                          if (isCorrectOption) {
                            style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                          } else if (isChosenOption && !currentCaseAnswer.isCorrect) {
                            style = 'bg-rose-950/40 border-rose-500 text-rose-300';
                          } else {
                            style = 'bg-slate-950/50 border-white/[0.04] text-slate-500 opacity-50';
                          }
                        } else if (isSelected) {
                          style = 'bg-amber-500/20 border-amber-400 text-amber-200';
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            disabled={isRecorded}
                            className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center space-x-2.5 cursor-pointer disabled:cursor-default ${style}`}
                          >
                            <span className="w-5 h-5 rounded-md bg-black/40 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
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
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                      >
                        Check Answer
                      </button>
                    </div>
                  )}

                  {/* Short 1-Line Explanation */}
                  {currentCaseAnswer && (
                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5 animate-fade-in text-xs">
                      <div className="flex items-center space-x-1.5 font-bold text-cyan-300">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Why this happens:</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">
                        {activeCase.kitchenDiagnosis || activeCase.explanation}
                      </p>
                      <p className="text-emerald-300 font-medium pt-1">
                        {activeCase.collegeGoldenRule || activeCase.collegeLifeRule}
                      </p>
                    </div>
                  )}

                  {/* Prev / Next Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevCase}
                        disabled={currentCaseIndex === 0}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-20 text-xs text-slate-300 cursor-pointer"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={handleNextCase}
                        disabled={currentCaseIndex === cases.length - 1}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-20 text-xs text-slate-300 cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveTab('rig')}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <span>Final Step: Check Laptop</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: KNOW YOUR OWN RIG (SIMPLE 3 QUESTIONS) */}
          {/* ======================================================== */}
          {activeTab === 'rig' && (
            <div className="space-y-4">

              {/* Simple Guide Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">Check Your Own Laptop (Super Easy 1-2-3)</h4>
                  <p className="text-[11px] text-slate-300">
                    Take 30 seconds to find out what CPU and RAM your machine has.
                  </p>
                </div>

                {/* OS Switcher */}
                <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-950 border border-white/[0.08] shrink-0">
                  <button
                    onClick={() => setRigOs('windows')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      rigOs === 'windows' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Windows 🪟
                  </button>
                  <button
                    onClick={() => setRigOs('mac')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      rigOs === 'mac' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    macOS 🍏
                  </button>
                </div>
              </div>

              {/* 3 Simple Questions */}
              <div className="space-y-3">
                {KNOW_YOUR_OWN_RIG_TASKS.map((item) => {
                  const currentVal = item.id === 'audit-cpu' ? rigCpu : item.id === 'audit-ram' ? rigRam : rigNetwork;
                  const setVal = item.id === 'audit-cpu' ? setRigCpu : item.id === 'audit-ram' ? setRigRam : setRigNetwork;
                  const instructions = rigOs === 'windows' ? item.easyInstructionsWindows : item.easyInstructionsMac;

                  return (
                    <div key={item.id} className="p-4 rounded-xl border border-white/[0.08] bg-slate-950/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center font-mono">
                            {item.stepNumber}
                          </span>
                          <span className="text-xs font-bold text-white">{item.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{item.analogyRef}</span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-900 border border-white/[0.05] text-[11px] text-cyan-200">
                        👉 <strong>How to look:</strong> {instructions}
                      </div>

                      <div className="pt-1">
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => setVal(e.target.value)}
                          placeholder={item.placeholder}
                          className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feedback Message */}
              {submissionFeedback && (
                <div className={`p-3 rounded-xl text-xs font-mono border ${
                  submissionFeedback.type === 'success' 
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}>
                  {submissionFeedback.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleFinalSubmit}
                  disabled={!isRigComplete}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all cursor-pointer ${
                    isRigComplete
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAlreadySubmitted ? 'Update & Re-Submit' : 'Submit Module 4'}</span>
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
