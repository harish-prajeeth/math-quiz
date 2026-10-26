import { GradeLevel } from '../context/GameContext';

export interface WorldThemeConfig {
  grade: GradeLevel;
  worldName: string;
  worldSubtitle: string;
  mascotName: string;
  bgGradient: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  accentBorder: string;
  nodeType: 'island' | 'planet';
}

export const WORLD_THEMES: Record<GradeLevel, WorldThemeConfig> = {
  5: {
    grade: 5,
    worldName: 'Jungle Quest',
    worldSubtitle: 'Islands & Ancient Temples of Math',
    mascotName: 'Leo the Jungle Scout',
    bgGradient: 'from-emerald-950 via-teal-900 to-emerald-900',
    cardBg: 'bg-emerald-900/60 border-emerald-600/40',
    textColor: 'text-emerald-100',
    accentColor: '#22a06b',
    accentBorder: '#15803d',
    nodeType: 'island',
  },
  6: {
    grade: 6,
    worldName: 'Space Mission',
    worldSubtitle: 'Cosmic Stations & Orbiting Planets',
    mascotName: 'Orbit the Space Bot',
    bgGradient: 'from-slate-950 via-indigo-950 to-violet-950',
    cardBg: 'bg-indigo-900/60 border-indigo-600/40',
    textColor: 'text-indigo-100',
    accentColor: '#7c5cff',
    accentBorder: '#4f46e5',
    nodeType: 'planet',
  },
};
