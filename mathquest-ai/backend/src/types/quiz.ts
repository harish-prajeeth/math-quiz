// ─── Core Types for MathQuest AI ───

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ValidationStatus =
  | 'machine_validated'
  | 'math_validated'
  | 'human_reviewed';

export interface StoredQuestion {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  validationStatus: ValidationStatus;
}

/** Question sent to the frontend — no correctIndex */
export interface ClientQuestion {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  questionNumber: number;
  totalQuestions: number;
  powerupAvailable?: boolean;
  hiddenOptions?: number[];
}

export interface AnswerSubmission {
  selectedIndex: number;
}

export interface AnswerResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;
  pointsAwarded: number;
  totalScore: number;
  currentDifficulty: Difficulty;
  questionsRemaining: number;
  // Game fields
  score?: number;
  streak?: number;
  difficulty?: Difficulty;
  difficultyChanged?: 'up' | 'down' | null;
  quizComplete?: boolean;
  combo?: number;
  bossHp?: number;
}

export interface QuizSession {
  id: string;
  topicId: string;
  grade: number;
  questions: StoredQuestion[];
  currentQuestionIndex: number;
  answers: AnswerRecord[];
  currentDifficulty: Difficulty;
  consecutiveCorrect: number;
  score: number;
  completed: boolean;
  createdAt: number;
  expiresAt: number;
  powerupUsed?: boolean;
  hiddenOptionsMap?: Record<string, number[]>;
  combo?: number;
  bestCombo?: number;
  playerId?: string;
}

export interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  pointsAwarded: number;
  difficulty: Difficulty;
  answeredAt: number;
}

export interface QuizResults {
  sessionId: string;
  topicId: string;
  grade: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: AnswerRecord[];
  badges: Badge[];
  completed: boolean;
  difficultyProgression: Difficulty[];
  // Game fields
  scorePercent?: number;
  stars?: number;
  xpEarned?: number;
  level?: number;
  playerLevel?: number;
  previousLevel?: number;
  bossDefeated?: boolean;
  bestCombo?: number;
  missionId?: string;
  correctCount?: number;
  newBadges?: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface Topic {
  id: string;
  grade: number;
  title: string;
  objective: string;
  summary: string;
  difficulties: Difficulty[];
  standardCode: string;
  standardDescription: string;
  icon: string;
  orderIndex?: number;
}

export interface LessonContent {
  topicId: string;
  title: string;
  grade: number;
  objective: string;
  explanation: string;
  workedExample: {
    problem: string;
    steps: string[];
    answer: string;
  };
  commonMistake: {
    mistake: string;
    correction: string;
  };
  practiceQuestion: {
    question: string;
    answer: string;
  };
  infographicData: InfographicData;
}

export interface InfographicData {
  type: string;
  title: string;
  visualElements: VisualElement[];
}

export interface VisualElement {
  type: 'fraction-visual' | 'decimal-visual' | 'ratio-visual' | 'equation' | 'step' | 'label';
  content: string;
  subContent?: string;
  highlight?: boolean;
}

export interface AdaptiveState {
  currentDifficulty: Difficulty;
  consecutiveCorrect: number;
}
