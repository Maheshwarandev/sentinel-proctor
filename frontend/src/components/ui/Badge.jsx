import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Activity, Minus } from 'lucide-react';

/**
 * Unified status badge component.
 * variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending'
 * dot: show dot indicator
 * pulse: animate dot
 */
export const Badge = ({ 
  children, 
  variant = 'neutral', 
  dot = false, 
  pulse = false,
  className = '' 
}) => {
  const variants = {
    success: 'bg-emerald-500/12 text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/12 text-amber-400 border-amber-500/25',
    danger:  'bg-rose-500/12 text-rose-400 border-rose-500/25',
    info:    'bg-cyan-500/12 text-cyan-400 border-cyan-500/25',
    neutral: 'bg-slate-700/40 text-slate-300 border-slate-600/30',
    pending: 'bg-slate-800/60 text-slate-400 border-slate-700/40',
  };
  const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger:  'bg-rose-400',
    info:    'bg-cyan-400',
    neutral: 'bg-slate-400',
    pending: 'bg-slate-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide ${variants[variant]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]} ${pulse ? 'animate-pulse' : ''}`} />
      )}
      {children}
    </span>
  );
};

/**
 * Task/submission status badge — maps known status strings
 */
export const StatusBadge = ({ status, className = '' }) => {
  const map = {
    'VERIFIED':    { variant: 'success', label: '✓ Verified',     dot: true },
    'APPROVED':    { variant: 'success', label: '✓ Approved',     dot: true },
    'SUBMITTED':   { variant: 'info',    label: 'Processing',     dot: true, pulse: true },
    'PROCESSING':  { variant: 'info',    label: 'Processing',     dot: true, pulse: true },
    'PENDING':     { variant: 'pending', label: 'Not Started',    dot: true },
    'IN_PROGRESS': { variant: 'warning', label: 'In Progress',    dot: true, pulse: true },
    'FLAGGED':     { variant: 'danger',  label: '⚠ Flagged',      dot: false },
    'REJECTED':    { variant: 'danger',  label: '✕ Rejected',     dot: false },
    'RETRY':       { variant: 'warning', label: '↺ Retry Required', dot: false },
  };
  const cfg = map[status] || { variant: 'neutral', label: status || 'Unknown', dot: false };
  return <Badge variant={cfg.variant} dot={cfg.dot} pulse={cfg.pulse} className={className}>{cfg.label}</Badge>;
};

export default Badge;
