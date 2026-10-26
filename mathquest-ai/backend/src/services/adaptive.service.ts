import { AdaptiveState, Difficulty } from '../types/quiz';

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard'];
const STREAK_THRESHOLD = 2; // 2 consecutive correct to level up

/**
 * Pure function: compute the next adaptive state after an answer.
 */
export function updateAdaptiveState(
  state: AdaptiveState,
  isCorrect: boolean
): AdaptiveState {
  const currentIdx = DIFFICULTY_ORDER.indexOf(state.currentDifficulty);

  if (isCorrect) {
    const newStreak = state.consecutiveCorrect + 1;

    if (newStreak >= STREAK_THRESHOLD && currentIdx < DIFFICULTY_ORDER.length - 1) {
      // Level up
      return {
        currentDifficulty: DIFFICULTY_ORDER[currentIdx + 1],
        consecutiveCorrect: 0,
      };
    }

    // Keep counting streak (but cap at threshold if already at max difficulty)
    return {
      currentDifficulty: state.currentDifficulty,
      consecutiveCorrect: currentIdx === DIFFICULTY_ORDER.length - 1 
        ? Math.min(newStreak, STREAK_THRESHOLD)
        : newStreak,
    };
  } else {
    // Incorrect: reset streak and lower difficulty
    const newIdx = Math.max(0, currentIdx - 1);
    return {
      currentDifficulty: DIFFICULTY_ORDER[newIdx],
      consecutiveCorrect: 0,
    };
  }
}

/**
 * Get the starting adaptive state.
 */
export function createInitialAdaptiveState(): AdaptiveState {
  return {
    currentDifficulty: 'medium',
    consecutiveCorrect: 0,
  };
}
