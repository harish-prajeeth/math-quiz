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
    bgGradient: 'bg-emerald-950',
    cardBg: 'bg-emerald-900 border-2 border-emerald-600/60',
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
    bgGradient: 'bg-slate-950',
    cardBg: 'bg-slate-900 border-2 border-cyan-500/60',
    textColor: 'text-cyan-100',
    accentColor: '#06b6d4',
    accentBorder: '#0284c7',
    nodeType: 'planet',
  },
};
