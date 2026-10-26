import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface StreakFlameProps {
  count: number;
  className?: string;
}

export const StreakFlame: React.FC<StreakFlameProps> = ({ count, className = '' }) => {
  const { reducedMotion } = useGame();
  const isActive = count > 0;

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition-colors select-none ${
        isActive
          ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
          : 'bg-stone-800/40 border-stone-700/40 text-stone-400'
      } ${className}`}
      title={`${count} correct answers in a row!`}
    >
      <motion.div
        animate={isActive && !reducedMotion ? { scale: [1, 1.25, 1], rotate: [0, -5, 5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <Flame
          className={`w-4 h-4 ${
            isActive ? 'text-amber-400 fill-amber-400' : 'text-stone-500'
          }`}
        />
      </motion.div>
      <span className="font-extrabold text-sm tabular-nums">
        {count}
      </span>
      <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline opacity-80">
        Streak
      </span>
    </div>
  );
};
