import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const KEY = 'mathquest_game_state_v2';

export type GradeLevel = 5 | 6;

export interface GameState {
  playerId: string | null;
  grade: GradeLevel;
  avatarId: number;
  nickname: string;
  soundOn: boolean;
  motionOn: boolean;
}

const DEFAULT_STATE: GameState = {
  playerId: null,
  grade: 5,
  avatarId: 0,
  nickname: 'Explorer',
  soundOn: true,
  motionOn: true,
};

export interface GameContextType {
  state: GameState;
  world: 'jungle' | 'space';
  update: (patch: Partial<GameState>) => void;
  // Convenience accessors
  grade: GradeLevel;
  setGrade: (grade: GradeLevel) => void;
  avatarId: number;
  setAvatarId: (avatarId: number) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  reducedMotion: boolean;
  toggleMotion: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.playerId) return { ...DEFAULT_STATE, ...parsed };
      }
    } catch {}
    return {
      ...DEFAULT_STATE,
      playerId: `explorer_${Math.random().toString(36).slice(2, 9)}`,
    };
  });

  const world = state.grade === 6 ? 'space' : 'jungle';

  const update = (patch: Partial<GameState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  useEffect(() => {
    document.documentElement.dataset.world = world;
    document.documentElement.dataset.motion = state.motionOn ? 'on' : 'off';
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, world]);

  const value: GameContextType = {
    state,
    world,
    update,
    grade: state.grade,
    setGrade: (grade: GradeLevel) => update({ grade }),
    avatarId: state.avatarId,
    setAvatarId: (avatarId: number) => update({ avatarId }),
    nickname: state.nickname,
    setNickname: (nickname: string) => update({ nickname }),
    soundEnabled: state.soundOn,
    toggleSound: () => update({ soundOn: !state.soundOn }),
    reducedMotion: !state.motionOn,
    toggleMotion: () => update({ motionOn: !state.motionOn }),
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
