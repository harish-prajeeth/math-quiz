import React, { useState } from 'react';
import { Volume2, VolumeX, BookOpen, Award, Flame } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  selectedGrade: number | null;
  onSelectGrade: (grade: number | null) => void;
  xp: number;
  streak: number;
  onOpenStandardsInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedGrade,
  onSelectGrade,
  xp,
  streak,
  onOpenStandardsInfo,
}) => {
  const [soundActive, setSoundActive] = useState(sounds.isEnabled());

  const handleToggleSound = () => {
    const next = sounds.toggleSound();
    setSoundActive(next);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 overflow-x-hidden">
        {/* Brand */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0" 
          onClick={() => onSelectGrade(null)}
        >
          <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-sm">
            M
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-stone-900 font-sans-display">
              MathQuest
            </span>
            <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
              Georgia Standards
            </span>
          </div>
        </div>

        {/* Grade Filter Pills */}
        <nav aria-label="Grade selection" className="flex items-center bg-stone-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => { sounds.playClick(); onSelectGrade(null); }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedGrade === null
                ? 'bg-white text-stone-900 border border-stone-200 font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => { sounds.playClick(); onSelectGrade(5); }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedGrade === 5
                ? 'bg-white text-stone-900 border border-stone-200 font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Grade 5
          </button>
          <button
            onClick={() => { sounds.playClick(); onSelectGrade(6); }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedGrade === 6
                ? 'bg-white text-stone-900 border border-stone-200 font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Grade 6
          </button>
        </nav>

        {/* Actions & Stats */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-900 text-sm font-medium">
            <Flame className="w-4 h-4 text-amber-700" />
            <span className="tabular-nums font-semibold">{streak}</span>
            <span className="text-stone-700 hidden sm:inline">streak</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-900 text-sm font-medium">
            <Award className="w-4 h-4 text-teal-800" />
            <span className="tabular-nums font-semibold">{xp}</span>
            <span className="text-stone-700 hidden sm:inline">pts</span>
          </div>

          {/* Standards Guide (hidden on tablet to prevent edge overflow) */}
          <button
            onClick={() => { sounds.playClick(); onOpenStandardsInfo(); }}
            className="p-1.5 rounded-md text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors hidden lg:flex items-center gap-1 text-xs font-medium"
            title="Georgia Curriculum Standards"
          >
            <BookOpen className="w-4 h-4 text-stone-700" />
            <span>Standards</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundActive ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-1.5 rounded-md text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label={soundActive ? 'Mute audio' : 'Unmute audio'}
          >
            {soundActive ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
