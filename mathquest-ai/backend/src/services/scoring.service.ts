import { AnswerResult, QuizSession, StoredQuestion, Badge } from '../types/quiz';

const POINTS_CORRECT = 10;
const POINTS_INCORRECT = 0;
const BONUS_STREAK_3 = 5;

/**
 * Score an answer submission.
 * Returns null if the question was already answered or session is invalid.
 */
export function scoreAnswer(
  session: QuizSession,
  questionId: string,
  selectedIndex: number
): { result: AnswerResult; question: StoredQuestion } | { error: string } {
  // Find the question in the session
  const question = session.questions.find(q => q.id === questionId);
  if (!question) {
    return { error: 'QUESTION_NOT_FOUND' };
  }

  // Check if already answered
  const alreadyAnswered = session.answers.find(a => a.questionId === questionId);
  if (alreadyAnswered) {
    return { error: 'ALREADY_ANSWERED' };
  }

  // Validate selected index
  if (
    typeof selectedIndex !== 'number' ||
    selectedIndex < 0 ||
    selectedIndex >= question.options.length
  ) {
    return { error: 'INVALID_OPTION_INDEX' };
  }

  // Determine correctness
  const correct = selectedIndex === question.correctIndex;
  let pointsAwarded = correct ? POINTS_CORRECT : POINTS_INCORRECT;

  // Streak bonus
  if (correct && session.consecutiveCorrect >= 2) {
    pointsAwarded += BONUS_STREAK_3;
  }

  return {
    result: {
      correct,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      pointsAwarded,
      totalScore: session.score + pointsAwarded,
      currentDifficulty: session.currentDifficulty,
      questionsRemaining: session.questions.length - session.answers.length - 1,
    },
    question,
  };
}

/**
 * Calculate badges based on quiz results.
 */
export function calculateBadges(
  session: QuizSession,
  isFirstQuiz: boolean = true,
  isNewTopic: boolean = true
): Badge[] {
  const badges: Badge[] = [];
  const correctCount = session.answers.filter(a => a.correct).length;
  const totalQuestions = session.questions.length;

  // First Quest
  if (isFirstQuiz) {
    badges.push({
      id: 'first-quest',
      name: 'First Quest',
      description: 'Completed your first quiz!',
      icon: '🎯',
      earned: true,
    });
  }

  // Perfect Score
  if (correctCount === totalQuestions && totalQuestions > 0) {
    badges.push({
      id: 'perfect-score',
      name: 'Perfect Score',
      description: 'Answered every question correctly!',
      icon: '⭐',
      earned: true,
    });
  }

  // Math Explorer
  if (isNewTopic) {
    badges.push({
      id: 'math-explorer',
      name: 'Math Explorer',
      description: 'Explored a new math topic!',
      icon: '🧭',
      earned: true,
    });
  }

  // Speed Demon - answered all questions
  if (session.completed) {
    badges.push({
      id: 'quest-complete',
      name: 'Quest Complete',
      description: 'Finished all 10 questions!',
      icon: '🏆',
      earned: true,
    });
  }

  // Rising Star - scored over 70%
  if (correctCount / totalQuestions >= 0.7) {
    badges.push({
      id: 'rising-star',
      name: 'Rising Star',
      description: 'Scored over 70% on the quiz!',
      icon: '🌟',
      earned: true,
    });
  }

  // Hard Mode Hero - answered a hard question correctly
  const hardCorrect = session.answers.some(
    a => a.correct && a.difficulty === 'hard'
  );
  if (hardCorrect) {
    badges.push({
      id: 'hard-mode-hero',
      name: 'Hard Mode Hero',
      description: 'Answered a hard question correctly!',
      icon: '💪',
      earned: true,
    });
  }

  // Combo Starter
  if ((session.bestCombo || 0) >= 5) {
    badges.push({
      id: 'combo-5',
      name: 'Combo Starter',
      description: 'Answer five questions correctly in a row.',
      icon: '⚡',
      earned: true,
    });
  }

  // Perfect Quest (canonical alias)
  if (correctCount === totalQuestions && totalQuestions > 0) {
    badges.push({
      id: 'perfect-quest',
      name: 'Perfect Quest',
      description: 'Answer all ten questions correctly.',
      icon: '⭐',
      earned: true,
    });
  }

  // World Explorers
  if (session.completed && session.grade === 5) {
    badges.push({
      id: 'jungle-explorer',
      name: 'Jungle Explorer',
      description: 'Complete a Grade 5 Jungle Quest.',
      icon: '🍃',
      earned: true,
    });
  }

  if (session.completed && session.grade === 6) {
    badges.push({
      id: 'space-explorer',
      name: 'Space Explorer',
      description: 'Complete a Grade 6 Space Mission.',
      icon: '🚀',
      earned: true,
    });
  }

  return badges;
}
