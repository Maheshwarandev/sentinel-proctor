import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * KPI stat card for dashboards.
 */
export const StatCard = ({
  label,
  value,
  subtext,
  icon,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger'
  onClick,
  progress,   // 0-100
  progressColor = 'bg-cyan-500',
  className = ''
}) => {
  const variantStyles = {
    default: 'border-white/[0.07] bg-slate-900/60 hover:border-white/[0.13]',
    success: 'border-emerald-500/25 bg-emerald-950/10 hover:border-emerald-500/40',
    warning: 'border-amber-500/25 bg-amber-950/10 hover:border-amber-500/40',
    danger:  'border-rose-500/30 bg-rose-950/15 hover:border-rose-500/50',
  };

  const iconStyles = {
    default: 'bg-slate-800 text-slate-300 border-white/[0.08]',
    success: 'bg-emerald-500/12 text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/12 text-amber-400 border-amber-500/25',
    danger:  'bg-rose-500/12 text-rose-400 border-rose-500/25',
  };

  const valueStyles = {
    default: 'text-white',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    danger:  'text-rose-400',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 transition-all duration-150 ${variantStyles[variant]} ${onClick ? 'cursor-pointer hover:-translate-y-px group shadow-card' : 'shadow-card'} ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-slate-400 tracking-wide">{label}</span>
        {icon && (
          <span className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${iconStyles[variant]} ${onClick ? 'group-hover:scale-105 transition-transform' : ''}`}>
            {icon}
          </span>
        )}
      </div>

      <div className={`text-2xl font-bold tracking-tight mb-1 ${valueStyles[variant]}`}>
        {value}
      </div>

      {progress !== undefined && (
        <div className="mt-2 mb-1">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Progress</span>
            <span className="font-mono text-cyan-400">{progress}%</span>
          </div>
          <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {subtext && (
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-slate-400">{subtext}</p>
          {onClick && <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />}
        </div>
      )}
    </div>
  );
};

export default StatCard;
