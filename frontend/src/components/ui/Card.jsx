import React from 'react';

/**
 * Consistent card wrapper.
 * variant: 'default' | 'elevated' | 'bordered' | 'accent'
 */
export const Card = ({ children, variant = 'default', className = '', onClick, ...props }) => {
  const variants = {
    default:  'bg-slate-900/60 border border-white/[0.07] shadow-card',
    elevated: 'bg-slate-900/80 border border-white/[0.09] shadow-card-hover',
    bordered: 'bg-transparent border border-white/[0.1]',
    accent:   'bg-gradient-to-br from-cyan-950/30 via-slate-900/60 to-indigo-950/30 border border-cyan-500/20',
  };

  const interactive = onClick ? 'cursor-pointer hover:border-white/[0.14] hover:bg-slate-900/80 hover:-translate-y-px transition-all duration-150' : '';

  return (
    <div
      {...props}
      onClick={onClick}
      className={`rounded-2xl ${variants[variant]} ${interactive} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-5 pt-5 pb-4 border-b border-white/[0.06] ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-5 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-5 py-4 border-t border-white/[0.06] ${className}`}>
    {children}
  </div>
);

export default Card;
