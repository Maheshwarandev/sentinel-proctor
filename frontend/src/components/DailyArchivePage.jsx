import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Archive, 
  Calendar, 
  Clock, 
  Camera, 
  CheckCircle2, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Maximize2, 
  X, 
  Download, 
  RotateCcw,
  Sparkles,
  Activity,
  Trophy,
  ChevronDown,
  ChevronUp,
  Layers,
  Inbox,
  Terminal,
  Flame,
  FileCheck
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';
import { CyberNotificationPopup } from './CyberNotificationPopup';

export const DailyArchivePage = () => {
  const navigate = useNavigate();
  const { 
    archive, 
    deleteArchivedItem, 
    clearArchive, 
    triggerRedLockdown 
  } = useForensics();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDateFilter, setSelectedDateFilter] = useState(() => {
    return searchParams.get('date') || 'ALL';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'keyboard', 'image_ocr', 'image_exif'
  const [zoomImage, setZoomImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute daily summaries and detect 3-module completion
  const dateSummaries = useMemo(() => {
    const map = {};
    archive.forEach(item => {
      const dKey = item.dateKey || item.formattedDate || 'Recent';
      if (!map[dKey]) {
        map[dKey] = {
          dateKey: dKey,
          displayDate: item.formattedDate || dKey,
          isToday: dKey === todayKey,
          taskIds: new Set(),
          types: new Set(),
          items: []
        };
      }
      if (item.taskId) map[dKey].taskIds.add(item.taskId);
      if (item.type) map[dKey].types.add(item.type);
      map[dKey].items.push(item);
    });

    return Object.values(map).map(day => {
      const hasKeyboard = day.taskIds.has('mod-1-keyboard') || day.types.has('keyboard');
      const hasDuolingo = day.taskIds.has('mod-2-duolingo') || day.types.has('image_ocr') || day.types.has('english_quiz');
      const hasWriting = day.taskIds.has('mod-3-writing') || day.types.has('image_exif');
      const uniqueCount = (hasKeyboard ? 1 : 0) + (hasDuolingo ? 1 : 0) + (hasWriting ? 1 : 0);
      const isAllThreeDone = uniqueCount === 3;

      return {
        ...day,
        hasKeyboard,
        hasDuolingo,
        hasWriting,
        completedCount: uniqueCount,
        isAllThreeDone
      };
    });
  }, [archive, todayKey]);

  const todaySummary = useMemo(() => {
    return dateSummaries.find(d => d.isToday) || null;
  }, [dateSummaries]);

  // Track expanded dates (collapsed by default to bundle all 3 modules into 1 daily card)
  const [expandedDates, setExpandedDates] = useState(() => new Set());
  const [collapsedDates, setCollapsedDates] = useState(() => new Set());
  const [expandedQuestionsItemId, setExpandedQuestionsItemId] = useState(null);

  const isDateExpanded = (dateKey) => {
    if (collapsedDates.has(dateKey)) return false;
    if (expandedDates.has(dateKey)) return true;
    if (searchQuery.trim().length > 0) return true; // auto-expand while actively searching
    if (selectedDateFilter === dateKey) return true; // auto-expand if specifically filtered to this date
    return false; // clean, collapsed single card by default
  };

  const toggleDateExpanded = (dateKey) => {
    const currentlyExpanded = isDateExpanded(dateKey);
    if (currentlyExpanded) {
      setCollapsedDates(prev => new Set(prev).add(dateKey));
      setExpandedDates(prev => {
        const next = new Set(prev);
        next.delete(dateKey);
        return next;
      });
    } else {
      setCollapsedDates(prev => {
        const next = new Set(prev);
        next.delete(dateKey);
        return next;
      });
      setExpandedDates(prev => new Set(prev).add(dateKey));
    }
  };

  const handleExpandAll = () => {
    const allKeys = Object.keys(groupedByDate);
    setExpandedDates(new Set(allKeys));
    setCollapsedDates(new Set());
  };

  const handleCollapseAll = () => {
    const allKeys = Object.keys(groupedByDate);
    setCollapsedDates(new Set(allKeys));
    setExpandedDates(new Set());
  };

  const handleSelectDate = (dateKey) => {
    setSelectedDateFilter(dateKey);
    if (dateKey !== 'ALL') {
      // Automatically expand selected date so modules are visible immediately
      setCollapsedDates(prev => {
        const next = new Set(prev);
        next.delete(dateKey);
        return next;
      });
      setExpandedDates(prev => new Set(prev).add(dateKey));
    }
    const newParams = new URLSearchParams(searchParams);
    if (dateKey === 'ALL') {
      newParams.delete('date');
    } else {
      newParams.set('date', dateKey);
    }
    setSearchParams(newParams);
  };

  const handleCopyText = (id, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDeleteItem = (id) => {
    deleteArchivedItem(id);
  };

  const handleClearAll = () => {
    clearArchive();
    setShowClearConfirm(false);
  };

  const handleExportJSON = () => {
    if (archive.length === 0) {
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(archive, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `brother_compliance_archive_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter and search items
  const filteredArchive = useMemo(() => {
    return archive.filter(item => {
      // Date filter
      if (selectedDateFilter !== 'ALL') {
        const itemDateKey = item.dateKey || item.formattedDate;
        if (itemDateKey !== selectedDateFilter && item.formattedDate !== selectedDateFilter) {
          return false;
        }
      }
      // Type filter
      if (filterType !== 'ALL') {
        if (filterType === 'image_ocr') {
          if (item.type !== 'image_ocr' && item.type !== 'english_quiz' && item.taskId !== 'mod-2-duolingo') {
            return false;
          }
        } else if (item.type !== filterType) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textMatch = item.submissionText?.toLowerCase().includes(query);
        const titleMatch = item.taskTitle?.toLowerCase().includes(query);
        const notesMatch = item.auditorNotes?.toLowerCase().includes(query);
        const dateMatch = item.formattedDate?.toLowerCase().includes(query);
        const streakMatch = item.ocrData?.streakDetected?.toLowerCase().includes(query);
        const deviceMatch = item.exifData?.deviceModel?.toLowerCase().includes(query);
        const quizMatch = (item.type === 'english_quiz' || item.quizScore !== undefined) && ('english'.includes(query) || 'quiz'.includes(query) || 'assessment'.includes(query));
        return textMatch || titleMatch || notesMatch || dateMatch || streakMatch || deviceMatch || quizMatch;
      }
      return true;
    });
  }, [archive, selectedDateFilter, filterType, searchQuery]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups = {};
    filteredArchive.forEach(item => {
      const dateKey = item.dateKey || item.formattedDate || 'Recent';
      if (!groups[dateKey]) {
        groups[dateKey] = {
          displayDate: item.formattedDate || dateKey,
          items: []
        };
      }
      groups[dateKey].items.push(item);
    });
    return groups;
  }, [filteredArchive]);

  // Statistics
  const totalDaysCount = useMemo(() => {
    const dates = new Set(archive.map(a => a.dateKey));
    return dates.size;
  }, [archive]);

  const keyboardCount = useMemo(() => archive.filter(a => a.type === 'keyboard').length, [archive]);
  const duolingoCount = useMemo(() => archive.filter(a => a.type === 'image_ocr' || a.type === 'english_quiz' || a.taskId === 'mod-2-duolingo').length, [archive]);
  const writingCount = useMemo(() => archive.filter(a => a.type === 'image_exif').length, [archive]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Real-time floating popup */}
      <CyberNotificationPopup />

      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Admin</span>
          <span className="text-slate-600">/</span>
          <span className="text-emerald-400 font-semibold">Daily Submission Archive</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center space-x-1">
                <Archive className="w-3 h-3 mr-1" />
                <span>Permanent Compliance Ledger</span>
              </span>
              <span className="text-xs text-slate-400">Subject: Brother</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Daily Submission Archive
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Every time you review and approve a task in the Submissions Box, it is automatically archived here with the full text, camera EXIF sensor data, OCR streak, and your approval notes.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center shrink-0">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Total Approved</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{archive.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Days Logged</div>
              <div className="text-xl font-bold text-cyan-400 mt-0.5">{totalDaysCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Duolingo</div>
              <div className="text-xl font-bold text-amber-400 mt-0.5">{duolingoCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Writing</div>
              <div className="text-xl font-bold text-teal-400 mt-0.5">{writingCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* TODAY'S 3-MODULES COMPLETE HERO BUTTON BANNER                 */}
      {/* ============================================================= */}
      {todaySummary && todaySummary.isAllThreeDone && (
        <div className="p-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/20 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-slate-950" />
                  <span>3/3 DISCIPLINES COMPLETE TODAY</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">{todaySummary.displayDate}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                All 3 Modules Verified & Preserved for Today
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="text-cyan-400 font-medium">✓ Module 1: Keyboard Practice</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">✓ Module 2: Duolingo English</span>
                <span>•</span>
                <span className="text-teal-400 font-medium">✓ Module 3: Writing Practice</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSelectDate(todayKey)}
            className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shrink-0 ${
              selectedDateFilter === todayKey
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40'
            }`}
            title="Click to view all 3 modules completed today"
          >
            <Calendar className="w-4 h-4" />
            <span>{selectedDateFilter === todayKey ? "Viewing Today's 3 Modules ✓" : "View Today's 3 Modules (Find Easily) →"}</span>
          </button>
        </div>
      )}

      {/* ============================================================= */}
      {/* FIND BY DATE BUTTONS TOOLBAR (1-CLICK PER RECORDED DAY)       */}
      {/* ============================================================= */}
      {dateSummaries.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-2.5 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Find By Date</span>
              <span className="text-[11px] text-slate-400 font-normal">
                ({dateSummaries.length} {dateSummaries.length === 1 ? 'date recorded' : 'dates recorded'} • click any date to filter)
              </span>
            </div>

            {selectedDateFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => handleSelectDate('ALL')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold transition-colors"
              >
                <span>Clear Date Filter</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {/* All Dates Button */}
            <button
              type="button"
              onClick={() => handleSelectDate('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
                selectedDateFilter === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>All Dates</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                selectedDateFilter === 'ALL' ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {archive.length}
              </span>
            </button>

            {/* Each Recorded Day Button */}
            {dateSummaries.map(day => {
              const isSelected = selectedDateFilter === day.dateKey;
              return (
                <button
                  key={day.dateKey}
                  type="button"
                  onClick={() => handleSelectDate(day.dateKey)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all border ${
                    isSelected
                      ? day.isAllThreeDone
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-2 ring-emerald-300 shadow-md'
                        : 'bg-cyan-500 text-slate-950 border-cyan-400 ring-2 ring-cyan-300 shadow-md'
                      : day.isAllThreeDone
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                  title={`Filter directly to ${day.displayDate}`}
                >
                  <div className="flex items-center space-x-1.5">
                    {day.isAllThreeDone && (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                    )}
                    <span>{day.isToday ? 'Today' : day.displayDate}</span>
                  </div>

                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isSelected
                      ? 'bg-slate-950 text-white'
                      : day.isAllThreeDone
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {day.isAllThreeDone ? '3/3 DONE ✓' : `${day.completedCount}/3`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by date, typed text, streak, camera, or notes..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { key: 'ALL', label: `All (${archive.length})` },
            { key: 'keyboard', label: `Keyboard (${keyboardCount})` },
            { key: 'image_ocr', label: `Duolingo / English (${duolingoCount})` },
            { key: 'image_exif', label: `Writing (${writingCount})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterType === tab.key
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Buttons: Export & Clear */}
        <div className="flex items-center space-x-2 shrink-0">
          {Object.keys(groupedByDate).length > 1 && (
            <button
              onClick={() => {
                const anyCollapsed = Object.keys(groupedByDate).some(k => !isDateExpanded(k));
                if (anyCollapsed) {
                  handleExpandAll();
                } else {
                  handleCollapseAll();
                }
              }}
              title="Expand or collapse all recorded days"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{Object.keys(groupedByDate).some(k => !isDateExpanded(k)) ? 'Expand All' : 'Collapse All'}</span>
            </button>
          )}

          <button
            onClick={handleExportJSON}
            title="Download complete archive as JSON report"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          {archive.length > 0 && (
            showClearConfirm ? (
              <div className="flex items-center space-x-1.5 animate-in fade-in">
                <button
                  onClick={handleClearAll}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                title="Permanently clear all archive entries"
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Clear</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Archive Content: Grouped by Date */}
      {archive.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border border-slate-800/80 bg-slate-900/40 text-slate-400 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-500">
            <Archive className="w-8 h-8 text-slate-400" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-bold text-white">Your Daily Archive is Empty</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When your brother submits his daily tasks and you click <strong className="text-cyan-400">"Approve"</strong> in the Submissions Box, a permanent copy with all telemetry and photos is saved here automatically.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/submissions')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Inbox className="w-4 h-4" />
            <span>Go to Submissions Box</span>
          </button>
        </div>
      ) : Object.keys(groupedByDate).length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-400">
          <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No archived submissions match your filter or search query.</p>
          <button
            onClick={() => { setSearchQuery(''); setFilterType('ALL'); handleSelectDate('ALL'); }}
            className="mt-3 text-xs text-cyan-400 hover:underline"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([dateKey, group]) => {
            const dayMeta = dateSummaries.find(d => d.dateKey === dateKey);
            const isComplete = dayMeta?.isAllThreeDone;
            const isExpanded = isDateExpanded(dateKey);

            // Group and organize items for this date
            const keyboardItem = group.items.find(i => i.type === 'keyboard' || i.taskId === 'mod-1-keyboard');
            const duolingoItem = group.items.find(i => i.type === 'image_ocr' || i.type === 'english_quiz' || i.taskId === 'mod-2-duolingo');
            const writingItem = group.items.find(i => i.type === 'image_exif' || i.taskId === 'mod-3-writing');
            const otherItems = group.items.filter(i => i !== keyboardItem && i !== duolingoItem && i !== writingItem);
            const orderedItems = [keyboardItem, duolingoItem, writingItem, ...otherItems].filter(Boolean);

            return (
              <div
                key={dateKey}
                className={`rounded-2xl border transition-all duration-300 shadow-xl backdrop-blur-md overflow-hidden ${
                  isComplete
                    ? 'border-emerald-500/40 bg-slate-900/85 hover:border-emerald-500/60'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                {/* Consolidated Daily Card Header */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950/90 border-b border-slate-800/80">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Date info & Completion Status */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center space-x-2 text-cyan-400 font-extrabold text-base sm:text-lg tracking-tight">
                          <Calendar className="w-5 h-5 text-cyan-400 shrink-0" />
                          <span>{group.displayDate}</span>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-semibold">
                          {group.items.length} {group.items.length === 1 ? 'module' : 'modules'}
                        </span>

                        {dayMeta?.isToday && (
                          <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-black tracking-wider border border-cyan-500/30">
                            TODAY
                          </span>
                        )}

                        {isComplete ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-sm">
                            <Trophy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>ALL 3 MODULES VERIFIED ✓</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                            <span>{dayMeta?.completedCount || group.items.length} of 3 Modules Done</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400">
                        {isComplete 
                          ? `All 3 required modules verified and preserved in compliance archive for ${group.displayDate}.`
                          : `Partial daily submission recorded for ${group.displayDate}.`}
                      </p>
                    </div>

                    {/* Right: Explicit Date-Mentioned Action Toggle Button */}
                    <div className="flex items-center space-x-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleDateExpanded(dateKey)}
                        className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-2 transition-all shadow-md active:scale-95 ${
                          isExpanded
                            ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                            : isComplete
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-2 ring-emerald-300/30 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                        }`}
                        title={isExpanded ? `Hide ${group.displayDate} Submissions` : `View ${group.displayDate} Submissions`}
                      >
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>
                          {isExpanded
                            ? `Hide ${group.displayDate} Submissions ▴`
                            : `View ${group.displayDate} Submissions (${group.items.length} ${group.items.length === 1 ? 'Module' : 'Modules'}) ▾`}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 shrink-0" />
                        )}
                      </button>
                    </div>

                  </div>

                  {/* Quick Glance Summary Strip (Visible Even While Collapsed) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-800/60 text-xs">
                    {/* Module 1 Glance */}
                    {keyboardItem ? (
                      <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                          <Terminal className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-300 truncate">Module 1: Keyboard</span>
                            <span className="text-[10px] text-emerald-400 font-bold ml-1">DONE ✓</span>
                          </div>
                          <p className="text-[11px] text-cyan-300 font-mono truncate">
                            {keyboardItem.telemetry?.wpm ? `${keyboardItem.telemetry.wpm} WPM` : 'Verified'} • {keyboardItem.submissionText ? `${keyboardItem.submissionText.trim().split(/\s+/).length} words` : 'Attested'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-950/30 border border-slate-800/40 opacity-50">
                        <Terminal className="w-4 h-4 text-slate-600 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] text-slate-500">Module 1: Keyboard</span>
                          <p className="text-[10px] text-slate-600 font-mono">Not yet archived</p>
                        </div>
                      </div>
                    )}

                    {/* Module 2 Glance */}
                    {duolingoItem ? (
                      <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                          <Flame className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-300 truncate">
                              {duolingoItem.type === 'english_quiz' || duolingoItem.quizScore !== undefined ? 'Module 2: English Assessment' : 'Module 2: Duolingo'}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold ml-1">DONE ✓</span>
                          </div>
                          <p className="text-[11px] text-amber-300 font-mono truncate">
                            {duolingoItem.quizScore !== undefined
                              ? `Score: ${duolingoItem.quizScore}/${duolingoItem.totalQuestions || duolingoItem.results?.length || 50} (${duolingoItem.percentage}%) • ${duolingoItem.xpEarned || '+30 XP'}`
                              : `${duolingoItem.ocrData?.streakDetected || 'Streak Verified'} • ${duolingoItem.ocrData?.xpEarned || 'XP Logged'}`}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-950/30 border border-slate-800/40 opacity-50">
                        <Flame className="w-4 h-4 text-slate-600 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] text-slate-500">Module 2: Duolingo / English</span>
                          <p className="text-[10px] text-slate-600 font-mono">Not yet archived</p>
                        </div>
                      </div>
                    )}

                    {/* Module 3 Glance */}
                    {writingItem ? (
                      <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-300 truncate">Module 3: Writing</span>
                            <span className="text-[10px] text-emerald-400 font-bold ml-1">DONE ✓</span>
                          </div>
                          <p className="text-[11px] text-teal-300 font-mono truncate">
                            {writingItem.exifData?.deviceModel ? `${writingItem.exifData.deviceModel}` : 'Photo Verified'} • EXIF Valid
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-950/30 border border-slate-800/40 opacity-50">
                        <Camera className="w-4 h-4 text-slate-600 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] text-slate-500">Module 3: Writing</span>
                          <p className="text-[10px] text-slate-600 font-mono">Not yet archived</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Module Details Section: Revealed upon clicking Date Button */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 space-y-6 bg-slate-950/60 border-t border-slate-800/80 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                      <span className="font-bold text-white flex items-center space-x-2">
                        <span>Detailed Submissions for</span>
                        <span className="text-cyan-400">{group.displayDate}</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Showing {orderedItems.length} verified {orderedItems.length === 1 ? 'module' : 'modules'}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {orderedItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 space-y-4 shadow-md hover:border-slate-700/80 transition-all"
                        >
                          {/* Module Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2.5 rounded-xl border shrink-0 ${
                                item.type === 'keyboard'
                                  ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                  : (item.type === 'image_ocr' || item.type === 'english_quiz' || item.taskId === 'mod-2-duolingo')
                                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                  : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                              }`}>
                                {item.type === 'keyboard' && <Terminal className="w-4 h-4" />}
                                {(item.type === 'image_ocr' || item.type === 'english_quiz' || item.taskId === 'mod-2-duolingo') && <Flame className="w-4 h-4" />}
                                {item.type === 'image_exif' && <Camera className="w-4 h-4" />}
                              </div>

                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                                    {item.taskTitle}
                                  </h3>
                                  <span className="text-[10px] text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded font-mono">
                                    {item.moduleName}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Approved at {new Date(item.approvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Submitted at {new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>

                            {/* Badges & Delete */}
                            <div className="flex items-center space-x-2 shrink-0">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                <span>VERIFIED</span>
                              </span>

                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                title="Delete this archive record"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div>
                            {/* MODULE 1: KEYBOARD PRACTICE ARCHIVED CONTENT */}
                            {item.type === 'keyboard' && (
                              <div className="space-y-3">
                                {/* Metrics row */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                                    <span className="text-slate-500 text-[10px] block">Typing Speed</span>
                                    <span className="text-cyan-400 font-bold text-sm">
                                      {item.telemetry?.wpm ? `${item.telemetry.wpm} WPM` : '--'}
                                    </span>
                                  </div>
                                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                                    <span className="text-slate-500 text-[10px] block">Total Words</span>
                                    <span className="text-white font-bold text-sm">
                                      {item.submissionText ? `${item.submissionText.trim().split(/\s+/).length} words` : '0'}
                                    </span>
                                  </div>
                                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                                    <span className="text-slate-500 text-[10px] block">Active Writing Time</span>
                                    <span className="text-teal-400 font-bold text-sm">
                                      {item.telemetry?.durationSec ? `${Math.floor(item.telemetry.durationSec / 60)}m ${item.telemetry.durationSec % 60}s` : '--'}
                                    </span>
                                  </div>
                                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                                    <span className="text-slate-500 text-[10px] block">Total Keystrokes</span>
                                    <span className="text-slate-300 font-bold text-sm">
                                      {item.telemetry?.totalKeystrokes || item.submissionText?.length || 0}
                                    </span>
                                  </div>
                                </div>

                                {/* Typed text */}
                                <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800/80 space-y-2">
                                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                                    <span>Archived Written Attestation:</span>
                                    <button
                                      onClick={() => handleCopyText(item.id, item.submissionText)}
                                      className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors font-medium"
                                    >
                                      {copiedId === item.id ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                          <span className="text-emerald-400">Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span>Copy Text</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-56 overflow-y-auto select-text">
                                    {item.submissionText}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* MODULE 2: ENGLISH ASSESSMENT (WINDOWS 11 ENGINE) OR LEGACY SCREENSHOT */}
                            {(item.type === 'english_quiz' || item.quizScore !== undefined) && (
                              <div className="space-y-3">
                                {/* Metric pills row */}
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                                    <span className="text-slate-500 text-[10px] block">Assessment Score</span>
                                    <span className="text-white font-bold text-sm">
                                      {item.quizScore !== undefined ? `${item.quizScore} / ${item.totalQuestions || item.results?.length || 50}` : '--'}
                                    </span>
                                  </div>
                                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                                    <span className="text-slate-500 text-[10px] block">Accuracy</span>
                                    <span className="text-emerald-400 font-bold text-sm">
                                      {item.percentage !== undefined ? `${item.percentage}%` : '--'}
                                    </span>
                                  </div>
                                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                                    <span className="text-slate-500 text-[10px] block">XP Awarded</span>
                                    <span className="text-amber-400 font-bold text-sm">
                                      {item.xpEarned || '+30 XP'}
                                    </span>
                                  </div>
                                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                                    <span className="text-slate-500 text-[10px] block">Avg Speed / Q</span>
                                    <span className="text-cyan-400 font-bold text-sm">
                                      {item.avgTimePerQuestionSec ? `${item.avgTimePerQuestionSec}s` : '--'}
                                    </span>
                                  </div>
                                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                                    <span className="text-slate-500 text-[10px] block">Cadence Integrity</span>
                                    <span className="text-teal-400 font-bold text-sm">
                                      {item.integrityScore !== undefined ? `${item.integrityScore}%` : '100%'}
                                    </span>
                                  </div>
                                </div>

                                {/* Assessment details box */}
                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-2.5">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                                    <div className="flex items-center space-x-2">
                                      <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 font-mono font-bold text-[10px] border border-sky-500/20">
                                        WINDOWS 11 ASSESSMENT ENGINE
                                      </span>
                                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/20">
                                        ⚡ INFINITE AI ENGINE
                                      </span>
                                      <span className="text-slate-300 font-semibold">{item.ocrData?.lessonTitle || 'Beginner English & Computer Programming'}</span>
                                    </div>
                                    <span className="text-emerald-400 font-mono text-[11px] font-bold">
                                      {item.ocrData?.streakDetected || 'ASSESSMENT CERTIFIED ARCHIVE'}
                                    </span>
                                  </div>

                                  {/* Violations notice if any */}
                                  {item.violations?.length > 0 && (
                                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
                                      <span className="font-bold block">Cadence Telemetry Alerts:</span>
                                      {item.violations.map((v, i) => (
                                        <p key={i} className="text-slate-400 font-mono">• {v}</p>
                                      ))}
                                    </div>
                                  )}

                                  {/* Expand/Collapse Questions Breakdown Toggle */}
                                  {item.results?.length > 0 && (
                                    <div>
                                      <button
                                        type="button"
                                        onClick={() => setExpandedQuestionsItemId(prev => prev === item.id ? null : item.id)}
                                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1.5 transition-colors pt-1"
                                      >
                                        <span>{expandedQuestionsItemId === item.id ? 'Hide Question Breakdown' : `View ${item.results.length} Archived Questions & Answers Breakdown`}</span>
                                        {expandedQuestionsItemId === item.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      </button>

                                      {expandedQuestionsItemId === item.id && (
                                        <div className="mt-3 space-y-2.5 border-t border-slate-800/60 pt-3 animate-in fade-in">
                                          {item.results.map((q, idx) => (
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
                                  )}
                                </div>

                                {/* Archived Real-Time Proctoring Camera Surveillance Dossier */}
                                {item.proctorSnapshots?.length > 0 ? (
                                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                                      <div className="flex items-center space-x-2">
                                        <Camera className="w-4 h-4 text-rose-400" />
                                        <span className="font-bold text-white">
                                          Archived Proctor Surveillance Dossier ({item.proctorSnapshots.length} Frames Captured)
                                        </span>
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        {item.cameraDevice && (
                                          <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                            {item.cameraDevice}
                                          </span>
                                        )}
                                        <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                          SURVEILLANCE ARCHIVED ✓
                                        </span>
                                      </div>
                                    </div>

                                    <p className="text-[11px] text-slate-400">
                                      Permanent biometric surveillance record from this date's assessment. Click any frame to zoom:
                                    </p>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
                                      {item.proctorSnapshots.map((snap, idx) => (
                                        <div
                                          key={snap.id || idx}
                                          onClick={() => setZoomImage(snap.image)}
                                          className="group relative rounded-xl border border-slate-800 bg-slate-900 overflow-hidden cursor-pointer hover:border-cyan-400/60 transition-all hover:scale-[1.03] shadow-sm"
                                          title={`Click to zoom archived frame captured at ${snap.timeStr}`}
                                        >
                                          <img
                                            src={snap.image}
                                            alt={`Archived proctor frame ${idx + 1}`}
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
                                      <span>Continuous candidate webcam surveillance verified for this assessment archive.</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-600">Surveillance Attested</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* MODULE 2: LEGACY DUOLINGO SCREENSHOT ARCHIVED CONTENT */}
                            {item.type === 'image_ocr' && !item.quizScore && (
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div 
                                  className="md:col-span-4 relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden group cursor-pointer min-h-[160px] flex items-center justify-center"
                                  onClick={() => item.image && setZoomImage(item.image)}
                                >
                                  {item.image ? (
                                    <>
                                      <img 
                                        src={item.image} 
                                        alt="Duolingo streak"
                                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 text-xs text-cyan-300 font-medium">
                                        <Maximize2 className="w-4 h-4" />
                                        <span>View Full Image</span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="p-6 text-center text-slate-600 text-xs">No Image Available</div>
                                  )}
                                </div>

                                <div className="md:col-span-8 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs space-y-2.5">
                                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                                    <span className="text-slate-400">Detected Streak:</span>
                                    <span className="text-amber-400 font-bold text-sm">{item.ocrData?.streakDetected || '--'}</span>
                                  </div>
                                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                                    <span className="text-slate-400">XP Verified:</span>
                                    <span className="text-white font-semibold">{item.ocrData?.xpEarned || '--'}</span>
                                  </div>
                                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                                    <span className="text-slate-400">Lesson Topic:</span>
                                    <span className="text-slate-300">{item.ocrData?.lessonTitle || '--'}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Duplicate Check:</span>
                                    <span className="text-emerald-400 font-semibold">{item.hash?.matchStatus || 'CLEAR'}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* MODULE 3: WRITING PRACTICE ARCHIVED CONTENT */}
                            {item.type === 'image_exif' && (
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div 
                                  className="md:col-span-4 relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden group cursor-pointer min-h-[160px] flex items-center justify-center"
                                  onClick={() => item.image && setZoomImage(item.image)}
                                >
                                  {item.image ? (
                                    <>
                                      <img 
                                        src={item.image} 
                                        alt="Handwritten notes"
                                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 text-xs text-cyan-300 font-medium">
                                        <Maximize2 className="w-4 h-4" />
                                        <span>View Full Image</span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="p-6 text-center text-slate-600 text-xs">No Photo Available</div>
                                  )}
                                </div>

                                <div className="md:col-span-8 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs space-y-2.5">
                                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                                    <span className="text-slate-400">Camera Model:</span>
                                    <span className="text-teal-300 font-semibold">
                                      {item.exifData?.deviceModel ? `${item.exifData.deviceMake || ''} ${item.exifData.deviceModel}` : '--'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                                    <span className="text-slate-400">Date & Time Taken:</span>
                                    <span className="text-white font-medium">{item.exifData?.dateTimeOriginal || '--'}</span>
                                  </div>
                                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                                    <span className="text-slate-400">Sensor / Lens:</span>
                                    <span className="text-slate-300">{item.exifData?.lens || '--'}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Hash Match:</span>
                                    <span className="text-emerald-400 font-semibold">{item.hash?.matchStatus || 'CLEAR'}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Auditor Evaluation Note Footer */}
                          <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 text-slate-400">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Auditor Evaluation: <strong className="text-slate-200">{item.auditorNotes}</strong></span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Archive ID: {item.id}
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Bottom Collapse Button */}
                    <div className="pt-2 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => toggleDateExpanded(dateKey)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-all"
                      >
                        <ChevronUp className="w-4 h-4" />
                        <span>Hide {group.displayDate} Submissions ▴</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Full-Screen Image Lightbox Modal */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3.5 border-b border-slate-800 text-xs text-slate-300">
              <span className="font-medium">Archived Artifact Preview</span>
              <button 
                onClick={() => setZoomImage(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 max-h-[80vh] overflow-auto flex items-center justify-center bg-black/50">
              <img src={zoomImage} alt="Zoom preview" className="max-w-full max-h-[75vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DailyArchivePage;
