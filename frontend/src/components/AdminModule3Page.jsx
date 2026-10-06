import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  Image as ImageIcon,
  Check,
  XCircle,
  FileCheck2,
  Maximize2,
  Sparkles,
  Key,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';
import { PageHeader, StatCard, Card, CardHeader, CardBody, Badge, Button } from './ui';
import { CyberNotificationPopup } from './CyberNotificationPopup';
import { WRITING_TOPICS } from '../data/writingTopics';

export const AdminModule3Page = () => {
  const { 
    tasks, 
    approveTask, 
    flagTask, 
    notifications, 
    checkTaskFromNotification,
    getModule2TimeStatus
  } = useForensics();

  const timeStatus = typeof getModule2TimeStatus === 'function' ? getModule2TimeStatus() : null;

  const writingTask = tasks.find(t => t.id === 'mod-3-writing') || {
    id: 'mod-3-writing',
    title: 'Writing Practice',
    status: 'PENDING',
    photos: []
  };

  // Active topic management
  const [activeTopic, setActiveTopic] = useState(() => WRITING_TOPICS[0]);
  const [topicHistory, setTopicHistory] = useState(() => WRITING_TOPICS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topicFeedback, setTopicFeedback] = useState(null);
  const [zoomPhoto, setZoomPhoto] = useState(null);

  // Gemini Key status
  const [geminiStatus, setGeminiStatus] = useState(null);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keyUpdateFeedback, setKeyUpdateFeedback] = useState(null);

  // Fetch active topic from backend on mount
  useEffect(() => {
    const fetchActiveTopic = async () => {
      try {
        const res = await fetch('/api/tasks/daily-writing-topic');
        const data = await res.json();
        if (data.success && data.topic) {
          setActiveTopic(data.topic);
          setTopicHistory(prev => {
            const exists = prev.some(t => t.title === data.topic.title);
            return exists ? prev : [data.topic, ...prev];
          });
        }
      } catch (err) {
        console.warn('[AdminModule3Page] Failed to fetch active topic:', err);
      }
    };

    const fetchGeminiStatus = async () => {
      try {
        const res = await fetch('/api/tasks/daily-writing-topic/status');
        const data = await res.json();
        if (data.success) {
          setGeminiStatus(data);
        }
      } catch (e) {}
    };

    fetchActiveTopic();
    fetchGeminiStatus();
  }, []);

  // Handler to generate a brand-new, unique topic via Gemini AI
  const handleGenerateFreshTopic = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/tasks/daily-writing-topic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success && data.topic) {
        setActiveTopic(data.topic);
        setTopicHistory(prev => {
          const filtered = prev.filter(t => t.id !== data.topic.id && t.title !== data.topic.title);
          return [data.topic, ...filtered];
        });
        localStorage.setItem('active_writing_topic_id', data.topic.id);
        localStorage.setItem('active_writing_topic_title', data.topic.title);
        
        const sourceLabel = data.topic.source === 'gemini-ai' ? 'Google Gemini AI' : 'Unique Procedural Engine';
        setTopicFeedback(`✨ Fresh topic generated via ${sourceLabel}: "${data.topic.title}". Different from previous topics!`);
        setTimeout(() => setTopicFeedback(null), 4500);
      }
    } catch (err) {
      setTopicFeedback('Failed to generate topic. Please try again.');
      setTimeout(() => setTopicFeedback(null), 3500);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTopic = (topic) => {
    setActiveTopic(topic);
    localStorage.setItem('active_writing_topic_id', topic.id);
    localStorage.setItem('active_writing_topic_title', topic.title);
    setTopicFeedback(`Active daily topic set to "${topic.title}".`);
    setTimeout(() => setTopicFeedback(null), 3500);
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    try {
      const res = await fetch('/api/tasks/gemini-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setGeminiStatus(data);
        setKeyUpdateFeedback('✓ Gemini API key updated and active!');
        setApiKeyInput('');
        setTimeout(() => setKeyUpdateFeedback(null), 3500);
      }
    } catch (err) {
      setKeyUpdateFeedback('Failed to update key.');
      setTimeout(() => setKeyUpdateFeedback(null), 3000);
    }
  };

  const photosList = Array.isArray(writingTask.photos) ? writingTask.photos : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
      {notifications?.length > 0 && (
        <CyberNotificationPopup 
          notifications={notifications} 
          onCheckTask={checkTaskFromNotification} 
        />
      )}

      {/* Image Lightbox Modal */}
      {zoomPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomPhoto(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img 
              src={zoomPhoto} 
              alt="Handwriting zoom" 
              className="max-h-[85vh] max-w-full object-contain rounded-2xl border border-white/20 shadow-2xl" 
            />
            <p className="text-center text-xs text-slate-400 mt-2 font-mono">
              Click anywhere to close preview
            </p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        badge={
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/25 text-xs font-mono font-bold">
              <Edit3 className="w-3.5 h-3.5 text-teal-400" />
              <span>MODULE 03 CONTROL CONSOLE</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>GEMINI AI ACTIVE</span>
            </span>
          </div>
        }
        title="Module 3: Handwritten Writing Practice"
        subtitle="Manage daily pen-and-paper writing topics synthesized dynamically by Gemini AI. Inspect submitted handwritten photo sheets and record compliance verdicts."
        actions={
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleGenerateFreshTopic}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing Topic...' : '✨ Generate Fresh Gemini Topic'}</span>
            </button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Daily Topic"
          value={activeTopic.title.split(':')[0]}
          subtext={activeTopic.category}
          icon={<BookOpen className="w-4 h-4 text-teal-400" />}
        />
        <StatCard
          label="Time Window (Synced with Mod 2)"
          value={timeStatus?.isActive ? '7 PM – 10 PM Active' : 'Locked'}
          subtext={timeStatus?.isActive ? '7:00 PM – 10:00 PM Active' : `Opens at 7:00 PM (${timeStatus?.countdownOpen || '00:00:00'})`}
          variant={timeStatus?.isActive ? 'success' : 'warning'}
          icon={<Clock className="w-4 h-4 text-amber-400" />}
        />
        <StatCard
          label="Submitted Photo Sheets"
          value={`${photosList.length} Uploaded`}
          subtext="Handwritten notebook photos"
          icon={<ImageIcon className="w-4 h-4 text-cyan-400" />}
        />
        <StatCard
          label="Module Status"
          value={writingTask.status || 'PENDING'}
          subtext={writingTask.auditorVerdict ? `Verdict: ${writingTask.auditorVerdict}` : 'Pending supervisor audit'}
          variant={writingTask.status === 'VERIFIED' ? 'success' : writingTask.status === 'FLAGGED' ? 'danger' : 'default'}
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Main Grid: Topic Manager & Handwriting Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Topic Selector & Points (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Generator Command Card */}
          <Card>
<CardHeader className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Dynamic AI Topic Generator</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/25">
                Never Repeats
              </span>
            </CardHeader>
<CardBody className="space-y-4">


            <p className="text-xs text-slate-300 leading-relaxed">
              Every click produces a <span className="text-teal-300 font-semibold">brand-new, completely different topic</span> and 10 bullet points. Topics are generated in simple English tailored for handwriting in a physical paper notebook.
            </p>

            <button
              type="button"
              onClick={handleGenerateFreshTopic}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 active:scale-[0.98] text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing Topic with Gemini AI...' : '✨ Generate Brand-New Different Topic'}</span>
            </button>

            {topicFeedback && (
              <div className="p-3 rounded-xl bg-teal-500/10 border  text-teal-300 text-xs font-mono flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{topicFeedback}</span>
              </div>
            )}
          
</CardBody></Card>

          {/* Points Preview Card for Current Active Topic */}
          <Card>
<CardHeader className="border-b border-white/[0.06] pb-3 flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                    {activeTopic.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {activeTopic.source === 'gemini-ai' ? '✨ Gemini AI' : 'Procedural AI'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                  "{activeTopic.title}"
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {activeTopic.description}
                </p>
              </div>
              <Badge variant="success">Active</Badge>
            </CardHeader>
<CardBody className="space-y-4">


            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                10 Handwriting Points (Physical Notebook Assignment):
              </span>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed max-h-[300px] overflow-y-auto pr-1 pt-1">
                {activeTopic.points.map((pt, idx) => (
                  <li key={idx} className="p-1.5 rounded-lg bg-slate-950/60 border border-white/[0.04]">
                    <span className="text-slate-200">{pt}</span>
                  </li>
                ))}
              </ol>
            </div>
          
</CardBody></Card>

          {/* Topic Catalog / History */}
          <Card>
<CardHeader className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-bold text-white">Topic Catalog & History</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{topicHistory.length} available</span>
            </CardHeader>
<CardBody className="space-y-4">


            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {topicHistory.map((topic, idx) => {
                const isSelected = topic.title === activeTopic.title;
                return (
                  <button
                    key={topic.id || idx}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-teal-950/30 border-teal-500/40 text-teal-300 ring-1 ring-teal-500/30 shadow-sm'
                        : 'bg-surface hover:bg-surface-elevated border-white/[0.07] text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400">
                          {topic.category}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-bold text-teal-400 flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>ACTIVE</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-semibold text-white mt-1 leading-snug line-clamp-1">
                        {topic.title}
                      </h4>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      10 Pts
                    </span>
                  </button>
                );
              })}
            </div>
          
</CardBody></Card>

        </div>

        {/* Right Column: Submitted Handwritten Photo Inspection (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          <Card>
<CardHeader className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Submitted Notebook Photos</h3>
                <p className="text-xs text-slate-400 mt-0.5">Physical handwritten answer sheets photographed by candidate</p>
              </div>
              <Badge variant={photosList.length > 0 ? "success" : "neutral"}>
                {photosList.length} Photos Uploaded
              </Badge>
            </CardHeader>
<CardBody className="space-y-4">


            {/* Photos Grid */}
            {photosList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {photosList.map((photoUri, index) => (
                  <div 
                    key={index} 
                    className="relative group rounded-xl overflow-hidden border border-white/[0.1] bg-surface-card border-surface-border shadow-sm aspect-[4/3] flex items-center justify-center shadow-md cursor-pointer"
                    onClick={() => setZoomPhoto(photoUri)}
                  >
                    <img 
                      src={photoUri} 
                      alt={`Handwriting Page ${index + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                      <Maximize2 className="w-6 h-6 text-white mb-1" />
                      <span className="text-xs font-bold text-white">Click to Enlarge Page {index + 1}</span>
                    </div>

                    <div className="absolute top-2 left-2 bg-surface-elevated border-surface-border px-2 py-0.5 rounded-md border border-white/10 text-[10px] font-mono text-cyan-300 font-bold">
                      Page {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-950 border border-white/[0.08] p-8 text-center text-slate-500 py-16 flex flex-col items-center justify-center">
                <ImageIcon className="w-10 h-10 text-slate-600 mb-2" />
                <p className="font-semibold text-slate-400">No handwritten photos uploaded yet</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  When the candidate photographs and uploads their handwritten notebook pages, they will appear here for visual audit.
                </p>
              </div>
            )}

            {/* Auditor Verdict Action Bar */}
            <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Auditor Action: Inspect handwriting legibility & completeness against the 10 points.
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => approveTask('mod-3-writing', 'Handwritten notes verified, legible, and compliance approved.')}
                  disabled={photosList.length === 0}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Handwriting</span>
                </button>

                <button
                  type="button"
                  onClick={() => flagTask('mod-3-writing', 'Handwriting illegible or incomplete notebook pages.')}
                  disabled={photosList.length === 0}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 disabled:opacity-40 disabled:cursor-not-allowed text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Request Rewrite</span>
                </button>
              </div>
            </div>

          
</CardBody></Card>

          {/* Gemini AI Engine Configuration Card */}
          <Card className="p-4 border-white/[0.08]  space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Google Gemini AI Engine Telemetry
                </h4>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                geminiStatus?.keyConfigured 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}>
                {geminiStatus?.keyConfigured ? 'Live Key Connected' : 'Procedural AI Mode'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Topics are synthesized dynamically using Gemini flash models with rotating prompts and anti-repetition memory so topics are never the same.
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/[0.05] pt-2">
              <span>Status: <span className="text-white font-mono">{geminiStatus?.keyConfigured ? 'Online (Gemini AI API)' : 'High-Entropy Procedural Bank (20+ Topics)'}</span></span>
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-cyan-400 hover:text-cyan-300 font-mono text-[10px] underline cursor-pointer"
              >
                {showKeyInput ? 'Hide Key Config' : 'Configure Gemini API Key'}
              </button>
            </div>

            {showKeyInput && (
              <form onSubmit={handleSaveApiKey} className="pt-2 border-t border-white/[0.05] space-y-2">
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Paste GEMINI_API_KEY (AIzaSy...)"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Save Key
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-cyan-400 underline">aistudio.google.com</a></span>
                  {keyUpdateFeedback && <span className="text-emerald-400 font-mono">{keyUpdateFeedback}</span>}
                </div>
              </form>
            )}
          </Card>

        </div>

      </div>

    </div>
  );
};

export default AdminModule3Page;
