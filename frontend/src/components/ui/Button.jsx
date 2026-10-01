import React from 'react';

/**
 * Unified button component.
 * variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
 * size: 'sm' | 'md' | 'lg'
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 cursor-pointer select-none active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';
  
  const variants = {
    primary:   'bg-cyan-500 hover:bg-cyan-400 text-slate-950 focus-visible:ring-cyan-500 shadow-sm',
    secondary: 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] hover:border-white/[0.18] focus-visible:ring-slate-400',
    danger:    'bg-rose-600 hover:bg-rose-500 text-white focus-visible:ring-rose-500 shadow-sm',
    ghost:     'hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 focus-visible:ring-slate-400',
    success:   'bg-emerald-600 hover:bg-emerald-500 text-white focus-visible:ring-emerald-500 shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-7',
    md: 'text-sm px-4 py-2 h-9',
    lg: 'text-sm px-5 py-2.5 h-10',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="shrink-0 w-4 h-4 flex items-center justify-center">{iconRight}</span>
      )}
    </button>
  );
};

export default Button;
