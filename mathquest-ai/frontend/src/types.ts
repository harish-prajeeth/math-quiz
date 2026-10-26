export type Difficulty = 'easy' | 'medium' | 'hard';

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

export interface ClientQuestion {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  questionNumber: number;
  totalQuestions: number;
}

export interface AnswerResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;
  pointsAwarded: number;
  totalScore: number;
  currentDifficulty: Difficulty;
  questionsRemaining: number;
  score?: number;
  streak?: number;
  difficulty?: Difficulty;
  difficultyChanged?: 'up' | 'down' | null;
  quizComplete?: boolean;
}

export interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  pointsAwarded: number;
  difficulty: Difficulty;
  answeredAt: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
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
  scorePercent?: number;
  stars?: number;
  xpEarned?: number;
  level?: number;
  newBadges?: Badge[];
}

export interface VisualElement {
  type: 'fraction-visual' | 'decimal-visual' | 'ratio-visual' | 'equation' | 'step' | 'label';
  content: string;
  subContent?: string;
  highlight?: boolean;
}

export interface InfographicData {
  type: string;
  title: string;
  visualElements: VisualElement[];
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
