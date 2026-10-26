import React from 'react';
import { motion } from 'framer-motion';
import { sounds } from '../../utils/audio';

type Tone = 'primary' | 'good' | 'bad' | 'secondary' | 'space';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  size?: 'md' | 'lg';
  loading?: boolean;
}

export const GameButton: React.FC<GameButtonProps> = ({
  tone = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  onClick,
  children,
  ...rest
}) => {
  const tones: Record<Tone, string> = {
    primary: 'bg-amber-400 text-stone-950 border-b-4 border-amber-600 hover:bg-amber-300 active:border-b-0',
    good: 'bg-emerald-500 text-white border-b-4 border-emerald-800 hover:bg-emerald-400 active:border-b-0',
    bad: 'bg-rose-500 text-white border-b-4 border-rose-800 hover:bg-rose-400 active:border-b-0',
    secondary: 'bg-stone-100 text-stone-900 border-b-4 border-stone-300 hover:bg-stone-200 active:border-b-0',
    space: 'bg-violet-600 text-white border-b-4 border-violet-900 hover:bg-violet-500 active:border-b-0',
  };

  const sizes = {
    md: 'min-h-12 px-6 py-2.5 text-base sm:text-lg',
    lg: 'min-h-14 px-8 py-3.5 text-lg sm:text-xl',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    sounds.playClick();
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileTap={{ y: 3 }}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`rounded-2xl font-bold font-sans tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizes[size]} ${tones[tone]} ${className}`}
      {...(rest as any)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
