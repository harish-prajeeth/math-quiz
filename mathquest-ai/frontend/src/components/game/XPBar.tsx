import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface XPBarProps {
  xp: number;
  level?: number;
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({ xp, level, className = '' }) => {
  const { reducedMotion } = useGame();
  const calculatedLevel = level ?? Math.floor(xp / 150) + 1;
  const currentLevelBase = (calculatedLevel - 1) * 150;
  const progressInLevel = Math.max(0, xp - currentLevelBase);
  const percent = Math.min(100, Math.round((progressInLevel / 150) * 100));

  return (
    <div className={`flex items-center gap-2.5 bg-stone-900/40 border border-stone-700/50 rounded-2xl px-3 py-1.5 backdrop-blur-xs select-none ${className}`}>
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-7 h-7 rounded-xl bg-amber-400 text-stone-950 font-extrabold flex items-center justify-center text-xs shadow-xs">
          {calculatedLevel}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80 leading-none">
            Level
          </span>
          <span className="text-xs font-bold text-white leading-tight">
            {xp} <span className="text-[10px] text-stone-300 font-normal">XP</span>
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-20 sm:w-28 h-2.5 bg-stone-800/80 rounded-full overflow-hidden p-0.5 border border-stone-700/40">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
          initial={reducedMotion ? false : { width: 0 }}
          animate={{ width: `${Math.max(percent, 6)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
