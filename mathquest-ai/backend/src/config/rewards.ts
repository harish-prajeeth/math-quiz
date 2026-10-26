export const STAR_THRESHOLDS = {
  THREE_STARS: 0.9,
  TWO_STARS: 0.7,
  ONE_STAR: 0.01,
};

export function calculateBossHp(correctCount: number, totalQuestions: number): number {
  const defeatHits = Math.ceil(0.7 * totalQuestions);
  if (defeatHits <= 0) return 0;
  return Math.max(0, Math.round(100 * (1 - correctCount / defeatHits)));
}

export function pickHiddenOptions(correctIndex: number, rng: () => number = Math.random): number[] {
  const wrong = [0, 1, 2, 3].filter((i) => i !== correctIndex);
  for (let i = wrong.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
  }
  return wrong.slice(0, 2).sort((a, b) => a - b);
}
