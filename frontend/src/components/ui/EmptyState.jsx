import React from 'react';

export const EmptyState = ({ icon, title, description, action, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
    {icon && (
      <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-white/[0.07] flex items-center justify-center text-slate-500 mb-4">
        {icon}
      </div>
    )}
    <p className="text-sm font-medium text-slate-300 mb-1">{title}</p>
    {description && <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-4">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
