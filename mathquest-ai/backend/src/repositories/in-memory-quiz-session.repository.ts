import { QuizSession } from '../types/quiz';
import { QuizSessionRepository } from './quiz-session.repository';

/**
 * In-memory session store with automatic cleanup.
 */
export class InMemoryQuizSessionRepository implements QuizSessionRepository {
  private sessions: Map<string, QuizSession> = new Map();
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor(cleanupIntervalMs: number = 5 * 60 * 1000) {
    // Periodic cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, cleanupIntervalMs);
  }

  async get(sessionId: string): Promise<QuizSession | null> {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Check expiry
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  async create(session: QuizSession): Promise<void> {
    this.sessions.set(session.id, session);
  }

  async update(session: QuizSession): Promise<void> {
    this.sessions.set(session.id, session);
  }

  async delete(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  async cleanup(): Promise<number> {
    const now = Date.now();
    let removed = 0;
    for (const [id, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(id);
        removed++;
      }
    }
    if (removed > 0) {
      console.log(`[Cleanup] Removed ${removed} expired sessions`);
    }
    return removed;
  }

  /** For testing */
  size(): number {
    return this.sessions.size;
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.sessions.clear();
  }
}
