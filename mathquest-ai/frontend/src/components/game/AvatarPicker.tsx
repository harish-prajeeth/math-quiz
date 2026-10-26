import React from 'react';
import { motion } from 'framer-motion';

export interface AvatarOption {
  id: number;
  name: string;
  renderSvg: () => React.ReactNode;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 1,
    name: 'Jungle Tiger',
    renderSvg: () => (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="18" fill="#f59e0b" />
        <circle cx="10" cy="10" r="4.5" fill="#d97706" />
        <circle cx="30" cy="10" r="4.5" fill="#d97706" />
        <circle cx="20" cy="23" r="12" fill="#fef3c7" />
        <circle cx="16" cy="19" r="2" fill="#78350f" />
        <circle cx="24" cy="19" r="2" fill="#78350f" />
        <polygon points="20,22 17,20 23,20" fill="#b45309" />
        <path d="M 18 24 Q 20 26 22 24" stroke="#78350f" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Cosmic Astro',
    renderSvg: () => (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="18" fill="#e2e8f0" />
        <rect x="8" y="10" width="24" height="18" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="15" cy="19" r="2.5" fill="#38bdf8" />
        <circle cx="25" cy="19" r="2.5" fill="#38bdf8" />
        <line x1="18" y1="24" x2="22" y2="24" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Panda Scout',
    renderSvg: () => (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="9" cy="9" r="4" fill="#0f172a" />
        <circle cx="31" cy="9" r="4" fill="#0f172a" />
        <ellipse cx="15" cy="18" rx="3.5" ry="4.5" fill="#0f172a" />
        <ellipse cx="25" cy="18" rx="3.5" ry="4.5" fill="#0f172a" />
        <circle cx="15" cy="18" r="1.5" fill="#ffffff" />
        <circle cx="25" cy="18" r="1.5" fill="#ffffff" />
        <ellipse cx="20" cy="24" rx="2" ry="1.5" fill="#0f172a" />
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Orbit Bot',
    renderSvg: () => (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect x="6" y="8" width="28" height="24" rx="8" fill="#4338ca" />
        <rect x="10" y="12" width="20" height="14" rx="4" fill="#090d16" />
        <circle cx="15" cy="19" r="2.5" fill="#a78bfa" />
        <circle cx="25" cy="19" r="2.5" fill="#a78bfa" />
        <line x1="20" y1="8" x2="20" y2="4" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="3" r="2" fill="#38bdf8" />
      </svg>
    ),
  },
  {
    id: 5,
    name: 'Fox Pathfinder',
    renderSvg: () => (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="18" fill="#ea580c" />
        <polygon points="6,6 16,14 8,16" fill="#c2410c" />
        <polygon points="34,6 24,14 32,16" fill="#c2410c" />
        <path d="M 8 20 Q 20 36 32 20 Q 20 32 8 20" fill="#fef3c7" />
        <circle cx="15" cy="19" r="2" fill="#431407" />
        <circle cx="25" cy="19" r="2" fill="#431407" />
        <circle cx="20" cy="24" r="1.5" fill="#431407" />
      </svg>
    ),
  },
  {
    id: 6,
    name: 'Star Captain',
    renderSvg: () => (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="18" fill="#0284c7" />
        <path d="M 6 12 Q 20 2 34 12 L 32 18 Q 20 10 8 18 Z" fill="#fbbf24" />
        <circle cx="15" cy="21" r="2.5" fill="#ffffff" />
        <circle cx="25" cy="21" r="2.5" fill="#ffffff" />
        <path d="M 16 26 Q 20 30 24 26" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface AvatarPickerProps {
  selectedId: number;
  onSelect: (id: number) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {AVATAR_OPTIONS.map((avatar) => {
        const isSelected = selectedId === avatar.id;

        return (
          <motion.button
            key={avatar.id}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(avatar.id)}
            className={`p-2 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border-2 ${
              isSelected
                ? 'bg-amber-400/20 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-white/10 border-white/20 hover:border-white/40'
            }`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14">
              {avatar.renderSvg()}
            </div>
            <span className="text-[11px] font-bold text-white tracking-wide truncate max-w-full">
              {avatar.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
