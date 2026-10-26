import { useGame } from '../context/GameContext';

export function useMotionAllowed(): boolean {
  const { state } = useGame();
  return state.motionOn;
}
