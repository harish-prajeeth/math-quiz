import { Topic, LessonContent, ClientQuestion, AnswerResult, QuizResults } from './types';

const API_BASE = '/api';

export async function fetchTopics(grade?: number): Promise<Topic[]> {
  const url = grade ? `${API_BASE}/topics/grade/${grade}` : `${API_BASE}/topics`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch topics');
  const data = await res.json();
  return data.topics;
}

export async function fetchLesson(topicId: string): Promise<{ lesson: LessonContent; topic: Topic }> {
  const res = await fetch(`${API_BASE}/lesson/${topicId}`);
  if (!res.ok) throw new Error('Failed to fetch lesson');
  return res.json();
}

export async function startQuiz(topicId: string, grade: number): Promise<{ sessionId: string; firstQuestion: ClientQuestion }> {
  const res = await fetch(`${API_BASE}/quiz/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topicId, grade }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to start quiz');
  }
  return res.json();
}

export async function getCurrentQuestion(sessionId: string): Promise<ClientQuestion> {
  const res = await fetch(`${API_BASE}/quiz/${sessionId}/current`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to load question');
  }
  const data = await res.json();
  return data.question;
}

export async function submitAnswer(sessionId: string, selectedIndex: number): Promise<AnswerResult> {
  const res = await fetch(`${API_BASE}/quiz/${sessionId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selectedIndex }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit answer');
  }
  const data = await res.json();
  return data.result;
}

export async function fetchResults(sessionId: string): Promise<QuizResults> {
  const res = await fetch(`${API_BASE}/quiz/${sessionId}/results`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch results');
  }
  const data = await res.json();
  return data.results;
}
