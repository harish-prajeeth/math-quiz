import { describe, it, expect } from 'vitest';
import { updateAdaptiveState, createInitialAdaptiveState } from '../services/adaptive.service';

describe('Adaptive Service', () => {
  it('creates default initial state at medium difficulty', () => {
    const initial = createInitialAdaptiveState();
    expect(initial.currentDifficulty).toBe('medium');
    expect(initial.consecutiveCorrect).toBe(0);
  });

  it('increments streak on correct answer before threshold', () => {
    const state = { currentDifficulty: 'medium' as const, consecutiveCorrect: 0 };
    const next = updateAdaptiveState(state, true);
    expect(next.currentDifficulty).toBe('medium');
    expect(next.consecutiveCorrect).toBe(1);
  });

  it('levels up difficulty from medium to hard after 2 consecutive correct answers', () => {
    const state = { currentDifficulty: 'medium' as const, consecutiveCorrect: 1 };
    const next = updateAdaptiveState(state, true);
    expect(next.currentDifficulty).toBe('hard');
    expect(next.consecutiveCorrect).toBe(0);
  });

  it('levels up from easy to medium after 2 consecutive correct answers', () => {
    const state = { currentDifficulty: 'easy' as const, consecutiveCorrect: 1 };
    const next = updateAdaptiveState(state, true);
    expect(next.currentDifficulty).toBe('medium');
    expect(next.consecutiveCorrect).toBe(0);
  });

  it('caps streak at threshold when already at hard difficulty', () => {
    const state = { currentDifficulty: 'hard' as const, consecutiveCorrect: 1 };
    const next = updateAdaptiveState(state, true);
    expect(next.currentDifficulty).toBe('hard');
    expect(next.consecutiveCorrect).toBe(2);
  });

  it('drops difficulty and resets streak on incorrect answer from medium to easy', () => {
    const state = { currentDifficulty: 'medium' as const, consecutiveCorrect: 1 };
    const next = updateAdaptiveState(state, false);
    expect(next.currentDifficulty).toBe('easy');
    expect(next.consecutiveCorrect).toBe(0);
  });

  it('drops difficulty from hard to medium on incorrect answer', () => {
    const state = { currentDifficulty: 'hard' as const, consecutiveCorrect: 2 };
    const next = updateAdaptiveState(state, false);
    expect(next.currentDifficulty).toBe('medium');
    expect(next.consecutiveCorrect).toBe(0);
  });

  it('remains at easy when incorrect answer given at easy', () => {
    const state = { currentDifficulty: 'easy' as const, consecutiveCorrect: 0 };
    const next = updateAdaptiveState(state, false);
    expect(next.currentDifficulty).toBe('easy');
    expect(next.consecutiveCorrect).toBe(0);
  });
});
