import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'jungle' | 'space';
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className = '',
  variant = 'light',
}) => {
  const variants = {
    light: 'bg-white/95 border-2 border-stone-200 shadow-sm text-stone-900',
    jungle: 'bg-emerald-950/80 border-2 border-emerald-600/40 text-emerald-50 backdrop-blur-sm',
    space: 'bg-slate-950/80 border-2 border-indigo-600/40 text-indigo-50 backdrop-blur-sm',
  };

  return (
    <div className={`rounded-3xl p-6 sm:p-8 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
