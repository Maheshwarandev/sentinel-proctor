import React from 'react';

/**
 * Page and section headers with consistent hierarchy.
 */
export const PageHeader = ({ title, subtitle, badge, actions, className = '' }) => (
  <div className={`flex flex-col md:flex-row md:items-start md:justify-between gap-4 ${className}`}>
    <div>
      {badge && <div className="mb-2">{badge}</div>}
      <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-2xl">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);

export const SectionHeader = ({ title, subtitle, actions, className = '' }) => (
  <div className={`flex items-center justify-between gap-4 ${className}`}>
    <div>
      <h2 className="text-base font-semibold text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
