import { describe, it, expect } from 'vitest';
import { scoreAnswer, calculateBadges } from '../services/scoring.service';
import { QuizSession, StoredQuestion } from '../types/quiz';

describe('Scoring Service', () => {
  const mockQuestion: StoredQuestion = {
    id: 'q1',
    topicId: 'g5-fractions-add-sub',
    grade: 5,
    difficulty: 'medium',
    question: 'What is 1/2 + 1/4?',
    options: ['3/4', '2/6', '1/6', '2/4'],
    correctIndex: 0,
    explanation: '1/2 = 2/4. 2/4 + 1/4 = 3/4',
    validationStatus: 'machine_validated',
    isAiGenerated: false,
    createdAt: new Date(),
  };

  const createMockSession = (overrides?: Partial<QuizSession>): QuizSession => ({
    id: 'test-session',
    topicId: 'g5-fractions-add-sub',
    grade: 5,
    questions: [mockQuestion],
    answers: [],
    currentQuestionIndex: 0,
    score: 0,
    consecutiveCorrect: 0,
    currentDifficulty: 'medium',
    completed: false,
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 3600000),
    ...overrides,
  });

  it('correctly scores a right answer with standard points', () => {
    const session = createMockSession();
    const result = scoreAnswer(session, 'q1', 0);

    expect('result' in result).toBe(true);
    if ('result' in result) {
      expect(result.result.correct).toBe(true);
      expect(result.result.pointsAwarded).toBe(10);
      expect(result.result.totalScore).toBe(10);
      expect(result.result.correctIndex).toBe(0);
    }
  });

  it('correctly scores an incorrect answer with 0 points', () => {
    const session = createMockSession();
    const result = scoreAnswer(session, 'q1', 1);

    expect('result' in result).toBe(true);
    if ('result' in result) {
      expect(result.result.correct).toBe(false);
      expect(result.result.pointsAwarded).toBe(0);
      expect(result.result.totalScore).toBe(0);
    }
  });

  it('awards streak bonus when consecutive correct >= 2', () => {
    const session = createMockSession({ consecutiveCorrect: 2, score: 20 });
    const result = scoreAnswer(session, 'q1', 0);

    expect('result' in result).toBe(true);
    if ('result' in result) {
      expect(result.result.correct).toBe(true);
      expect(result.result.pointsAwarded).toBe(15); // 10 base + 5 streak bonus
      expect(result.result.totalScore).toBe(35);
    }
  });

  it('returns error if question is not found', () => {
    const session = createMockSession();
    const result = scoreAnswer(session, 'non-existent', 0);
    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error).toBe('QUESTION_NOT_FOUND');
    }
  });

  it('returns error if question is already answered', () => {
    const session = createMockSession({
      answers: [
        {
          questionId: 'q1',
          selectedIndex: 0,
          correct: true,
          difficulty: 'medium',
          pointsAwarded: 10,
          answeredAt: new Date(),
        },
      ],
    });
    const result = scoreAnswer(session, 'q1', 0);
    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error).toBe('ALREADY_ANSWERED');
    }
  });

  it('returns error if selectedIndex is out of range', () => {
    const session = createMockSession();
    const result = scoreAnswer(session, 'q1', 4);
    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error).toBe('INVALID_OPTION_INDEX');
    }
  });

  it('calculates badges correctly', () => {
    const session = createMockSession({
      completed: true,
      questions: [mockQuestion],
      answers: [
        {
          questionId: 'q1',
          selectedIndex: 0,
          correct: true,
          difficulty: 'hard',
          pointsAwarded: 10,
          answeredAt: new Date(),
        },
      ],
    });

    const badges = calculateBadges(session, true, true);
    const badgeIds = badges.map(b => b.id);
    expect(badgeIds).toContain('first-quest');
    expect(badgeIds).toContain('perfect-score');
    expect(badgeIds).toContain('math-explorer');
    expect(badgeIds).toContain('quest-complete');
    expect(badgeIds).toContain('rising-star');
    expect(badgeIds).toContain('hard-mode-hero');
  });
});
