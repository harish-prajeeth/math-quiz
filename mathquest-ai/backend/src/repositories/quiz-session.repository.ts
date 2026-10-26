import { QuizSession } from '../types/quiz';

/**
 * Repository interface — implementation-agnostic.
 * Start with in-memory, swap to PostgreSQL later.
 */
export interface QuizSessionRepository {
  get(sessionId: string): Promise<QuizSession | null>;
  create(session: QuizSession): Promise<void>;
  update(session: QuizSession): Promise<void>;
  delete(sessionId: string): Promise<void>;
  cleanup(): Promise<number>; // returns count of expired sessions removed
}
