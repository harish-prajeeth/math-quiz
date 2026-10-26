import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

export type MascotMood = 'idle' | 'cheer' | 'encourage';

interface MascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MascotReaction: React.FC<MascotProps> = ({
  mood = 'idle',
  size = 'md',
  className = '',
}) => {
  const { grade, reducedMotion } = useGame();

  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
  };

  const animations = {
    idle: !reducedMotion ? { y: [0, -4, 0] } : {},
    cheer: !reducedMotion ? { y: [0, -12, 0], scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] } : {},
    encourage: !reducedMotion ? { rotate: [0, -6, 6, 0] } : {},
  };

  return (
    <motion.div
      animate={animations[mood]}
      transition={{
        duration: mood === 'cheer' ? 0.6 : 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`relative inline-block select-none ${dimensions[size]} ${className}`}
      aria-label={`Mascot: ${grade === 5 ? 'Jungle Scout' : 'Orbit the Bot'} feeling ${mood}`}
    >
      {grade === 5 ? (
        /* Grade 5: Leo the Friendly Jungle Scout (Lion cub) */
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Mane */}
          <circle cx="50" cy="50" r="42" fill="#d97706" />
          <circle cx="50" cy="50" r="40" fill="#f59e0b" />
          {/* Ears */}
          <circle cx="24" cy="24" r="12" fill="#f59e0b" />
          <circle cx="24" cy="24" r="7" fill="#fbbf24" />
          <circle cx="76" cy="24" r="12" fill="#f59e0b" />
          <circle cx="76" cy="24" r="7" fill="#fbbf24" />
          {/* Face */}
          <circle cx="50" cy="54" r="32" fill="#fef3c7" />
          {/* Cheeks */}
          <circle cx="32" cy="62" r="6" fill="#f87171" opacity="0.4" />
          <circle cx="68" cy="62" r="6" fill="#f87171" opacity="0.4" />
          {/* Eyes */}
          {mood === 'cheer' ? (
            <>
              {/* Happy squint arches */}
              <path d="M 32 50 Q 38 42 44 50" stroke="#78350f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 56 50 Q 62 42 68 50" stroke="#78350f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="38" cy="48" r="4.5" fill="#78350f" />
              <circle cx="40" cy="46" r="1.5" fill="#ffffff" />
              <circle cx="62" cy="48" r="4.5" fill="#78350f" />
              <circle cx="64" cy="46" r="1.5" fill="#ffffff" />
            </>
          )}
          {/* Nose */}
          <polygon points="50,56 45,52 55,52" fill="#b45309" />
          {/* Mouth */}
          {mood === 'cheer' ? (
            <path d="M 42 62 Q 50 74 58 62 Z" fill="#b91c1c" />
          ) : mood === 'encourage' ? (
            <path d="M 44 63 Q 50 68 56 63" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M 44 60 Q 50 66 56 60" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          {/* Scout Bandana */}
          <path d="M 28 80 Q 50 94 72 80 L 50 96 Z" fill="#0f766e" />
        </svg>
      ) : (
        /* Grade 6: Orbit the Friendly Space Robot */
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Antenna */}
          <line x1="50" y1="20" x2="50" y2="8" stroke="#a78bfa" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="50" cy="7" r="5" fill="#38bdf8" />
          {/* Ears / Side Bolts */}
          <rect x="14" y="42" width="6" height="18" rx="3" fill="#6366f1" />
          <rect x="80" y="42" width="6" height="18" rx="3" fill="#6366f1" />
          {/* Head Container */}
          <rect x="18" y="20" width="64" height="60" rx="18" fill="#1e1b4b" stroke="#6366f1" strokeWidth="3" />
          {/* Visor Screen */}
          <rect x="26" y="30" width="48" height="34" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Eyes on Screen */}
          {mood === 'cheer' ? (
            <>
              {/* Joyful Star eyes */}
              <text x="38" y="54" fontSize="16" fill="#38bdf8" textAnchor="middle" fontWeight="bold">^</text>
              <text x="62" y="54" fontSize="16" fill="#38bdf8" textAnchor="middle" fontWeight="bold">^</text>
            </>
          ) : mood === 'encourage' ? (
            <>
              {/* Focused round glowing cyan eyes */}
              <circle cx="38" cy="46" r="5" fill="#38bdf8" />
              <circle cx="62" cy="46" r="5" fill="#38bdf8" />
              {/* Friendly smile line */}
              <path d="M 44 56 Q 50 60 56 56" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Normal friendly idle eyes */}
              <circle cx="38" cy="46" r="4.5" fill="#38bdf8" />
              <circle cx="62" cy="46" r="4.5" fill="#38bdf8" />
              <line x1="45" y1="56" x2="55" y2="56" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
          {/* Chest Collar / Badge */}
          <path d="M 32 82 L 68 82 L 58 94 L 42 94 Z" fill="#7c5cff" />
        </svg>
      )}
    </motion.div>
  );
};
