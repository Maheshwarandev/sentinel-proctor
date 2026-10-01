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
    strikes,
    resetStrikes,
    isRedLockdownActive,
    activeBreach,
    alarmHistory = [],
    clearAlarmHistory,
    disarmRedLockdown,
    triggerRedLockdown
  } = useForensics();

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Real-time floating popup */}
      <CyberNotificationPopup />

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-teal-500/12 text-teal-400 border-teal-500/25">
              Anti-Cheat Surveillance
            </span>
            {isRedLockdownActive && (
              <button
                type="button"
                onClick={disarmRedLockdown}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-sm animate-pulse cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Disarm Active Siren
              </button>
            )}
            {strikes > 0 && (
              <button
                type="button"
                onClick={resetStrikes}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Clear Strikes ({strikes})
              </button>
            )}
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Anti-Paste: <strong className="text-emerald-400">Active</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
              <span className="text-slate-400">Rate: <strong className="text-cyan-400">100Hz</strong></span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Anti-Cheat & Telemetry Inspector</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Forensic validation console. Inspect keystroke cadence, focus loss counters, paste interceptions, and camera EXIF metadata.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.07] text-center min-w-[90px]">
            <div className="text-[10px] uppercase text-slate-500 font-semibold">Active Strikes</div>
            <div className={`text-xl font-bold mt-0.5 ${strikes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{strikes}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.07] text-center min-w-[90px]">
            <div className="text-[10px] uppercase text-slate-500 font-semibold">Audit Status</div>
            <div className="text-xl font-bold text-cyan-400 mt-0.5">Live</div>
          </div>
        </div>
      </div>

      {/* Real-Time Candidate Webcam Proctoring CCTV Surveillance Feed */}
      <LiveProctorCCTV />



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
