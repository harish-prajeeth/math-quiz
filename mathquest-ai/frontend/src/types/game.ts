export type Difficulty = "rookie" | "pro" | "champion";

export interface Question {
  questionId: string;
  question: string;
  options: string[];
  difficulty: Difficulty;
  questionNumber: number;
  totalQuestions: number;
  powerupAvailable: boolean;
  hiddenOptions?: number[];
}

export interface AnswerResult {
  correct: boolean;
  correctIndex: number;
  pointsAwarded: number;
  score: number;
  streak: number;
  difficulty: Difficulty;
  difficultyChanged: "up" | "down" | null;
  explanation: string;
  quizComplete: boolean;
  combo: number;
  bossHp: number;
}

export interface QuizResults {
  missionId: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  stars: 0 | 1 | 2 | 3;
  xpEarned: number;
  playerLevel: number;
  newBadges: string[];
  previousLevel: number;
  bossDefeated: boolean;
  bestCombo: number;
}

export interface Progress {
  playerId: string;
  playerLevel: number;
  xp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  completedMissions: Record<string, number>;
  starsByTopic?: Record<string, number>;
  badges: string[];
}

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  hint?: string;
  icon?: string;
}

export interface Mission {
  id: string;
  grade: number;
  title: string;
  objective: string;
  orderIndex: number;
}
