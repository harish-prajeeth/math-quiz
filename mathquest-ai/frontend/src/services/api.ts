import type { Question, AnswerResult, QuizResults, Progress, BadgeDef, Mission } from '../types/game';

export class ApiError extends Error {
  constructor(public code: string, message?: string) {
    super(message || code);
    this.name = 'ApiError';
  }
}

const envBase = (import.meta as any).env?.VITE_API_URL?.replace(/\/+$/, '');
const API_BASE = envBase ? `${envBase}/api` : '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(errorData.code || errorData.error || 'API_ERROR', errorData.message || errorData.error);
  }
  return res.json();
}

function post(body: any): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const api = {
  topics: async (grade?: number): Promise<Mission[]> => {
    const path = grade ? `/topics/grade/${grade}` : '/topics';
    const data = await request<{ topics: any[] }>(path);
    return data.topics.map((t) => ({
      id: t.id,
      grade: t.grade,
      title: t.title,
      objective: t.objective,
      orderIndex: t.orderIndex ?? 1,
    }));
  },

  createPlayer: (data: { grade: number; nickname?: string; avatarId?: number }) =>
    request<Progress>('/player', post(data)),

  progress: (playerId: string) =>
    request<Progress>(`/player/${playerId}/progress`),

  badges: () =>
    request<BadgeDef[]>('/badges'),

  startQuiz: async (playerId: string, topicId: string) => {
    // Start quiz with topicId and default grade 5 or derived
    const data = await request<{ sessionId: string; firstQuestion: any }>(
      '/quiz/start',
      post({ topicId, grade: 5, playerId })
    );
    return { sessionId: data.sessionId };
  },

  currentQuestion: async (sessionId: string): Promise<Question> => {
    const data = await request<{ question: any }>(`/quiz/${sessionId}/current`);
    const q = data.question;
    return {
      questionId: q.id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      questionNumber: q.questionNumber,
      totalQuestions: q.totalQuestions,
      powerupAvailable: q.powerupAvailable ?? true,
      hiddenOptions: q.hiddenOptions ?? [],
    };
  },

  answer: async (sessionId: string, _questionId: string, selectedIndex: number): Promise<AnswerResult> => {
    const data = await request<{ result: any }>(`/quiz/${sessionId}/answer`, post({ selectedIndex }));
    const r = data.result;
    return {
      correct: r.correct,
      correctIndex: r.correctIndex,
      pointsAwarded: r.pointsAwarded,
      score: r.totalScore ?? r.score ?? 0,
      streak: r.streak ?? 0,
      difficulty: r.currentDifficulty ?? r.difficulty ?? 'rookie',
      difficultyChanged: r.difficultyChanged ?? null,
      explanation: r.explanation,
      quizComplete: r.quizComplete ?? (r.questionsRemaining <= 0),
      combo: r.combo ?? 0,
      bossHp: r.bossHp ?? 100,
    };
  },

  powerup: (sessionId: string, questionId: string) =>
    request<{ hidden: number[] }>(`/quiz/${sessionId}/powerup`, post({ questionId })),

  results: async (sessionId: string): Promise<QuizResults> => {
    const data = await request<{ results: any }>(`/quiz/${sessionId}/results`);
    const res = data.results;
    return {
      missionId: res.topicId || res.missionId || '',
      scorePercent: res.scorePercent ?? 0,
      correctCount: res.correctAnswers ?? res.correctCount ?? 0,
      totalQuestions: res.totalQuestions ?? 10,
      stars: (res.stars ?? 0) as 0 | 1 | 2 | 3,
      xpEarned: res.xpEarned ?? res.score ?? 0,
      playerLevel: res.playerLevel ?? res.level ?? 1,
      newBadges: (res.newBadges || []).map((b: any) => typeof b === 'string' ? b : b.id),
      previousLevel: res.previousLevel ?? 1,
      bossDefeated: res.bossDefeated ?? (res.stars >= 2),
      bestCombo: res.bestCombo ?? 0,
    };
  },

  lesson: (topicId: string) =>
    request<{ lesson: any; topic: any }>(`/lesson/${topicId}`),
};
