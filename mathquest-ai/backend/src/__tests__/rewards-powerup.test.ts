import { describe, it, expect } from 'vitest';
import { pickHiddenOptions, calculateBossHp } from '../config/rewards';

describe('Rewards & Power-up Logic', () => {
  it('pickHiddenOptions never hides the correct answer and always returns two distinct indexes', () => {
    for (let correctIndex = 0; correctIndex < 4; correctIndex++) {
      const hidden = pickHiddenOptions(correctIndex);
      expect(hidden).toHaveLength(2);
      expect(hidden).not.toContain(correctIndex);
      expect(hidden[0]).not.toEqual(hidden[1]);
      expect(hidden[0]).toBeGreaterThanOrEqual(0);
      expect(hidden[1]).toBeLessThan(4);
    }
  });

  it('boss HP and the 2-star rule agree: boss HP is 0 when defeat hits are met', () => {
    const totalQuestions = 10;
    // DEFEAT_HITS is ceil(0.7 * 10) = 7
    expect(calculateBossHp(0, totalQuestions)).toBe(100);
    expect(calculateBossHp(3, totalQuestions)).toBe(57);
    expect(calculateBossHp(7, totalQuestions)).toBe(0);
    expect(calculateBossHp(10, totalQuestions)).toBe(0);
  });
});
