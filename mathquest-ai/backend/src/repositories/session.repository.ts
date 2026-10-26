import { query, isDbConnected } from '../db/pool';
import { SQL } from '../db/queries';
import { QuizSession } from '../types/quiz';

const inMemorySessions = new Map<string, QuizSession>();

export const SessionRepository = {
  async saveSession(session: QuizSession): Promise<QuizSession> {
    inMemorySessions.set(session.id, session);

    if (isDbConnected() && session.playerId) {
      try {
        const correctAnswers = session.answers.filter((a) => a.correct).length;
        const currentQ = session.questions[session.currentQuestionIndex];
        const currentQId = currentQ?.id || null;
        const hiddenOptions = currentQId && session.hiddenOptionsMap ? session.hiddenOptionsMap[currentQId] || [] : [];

        await query(SQL.UPDATE_SESSION_PROGRESS, [
          session.id,
          session.currentQuestionIndex,
          session.currentDifficulty,
          session.score,
          correctAnswers,
          session.consecutiveCorrect,
          session.combo ?? 0,
          session.bestCombo ?? 0,
          session.powerupUsed ?? false,
          currentQId,
          hiddenOptions,
          session.completed ? 'completed' : 'active',
          session.score,
          0,
          session.completed,
          session.completed ? new Date() : null,
        ]);
      } catch (err) {
        console.warn('Postgres error updating session progress:', err);
      }
    }

    return session;
  },

  async getSessionById(sessionId: string): Promise<QuizSession | null> {
    if (inMemorySessions.has(sessionId)) {
      return inMemorySessions.get(sessionId)!;
    }

    if (isDbConnected()) {
      try {
        const res = await query(SQL.GET_SESSION_BY_ID, [sessionId]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          const session: QuizSession = {
            id: row.id,
            topicId: row.topic_id,
            grade: 5,
            playerId: row.player_id,
            questions: [],
            currentQuestionIndex: row.current_position,
            currentDifficulty: row.current_difficulty,
            answers: [],
            consecutiveCorrect: row.adaptive_streak,
            score: row.score,
            completed: row.status === 'completed',
            createdAt: new Date(row.created_at).getTime(),
            expiresAt: new Date(row.expires_at).getTime(),
            powerupUsed: row.powerup_used,
            hiddenOptionsMap: {},
            combo: row.combo,
            bestCombo: row.best_combo,
          };
          inMemorySessions.set(session.id, session);
          return session;
        }
      } catch (err) {
        console.warn('Postgres error fetching session:', err);
      }
    }

    return null;
  },

  async recordAnswer(
    sessionId: string,
    questionId: string,
    selectedIndex: number,
    isCorrect: boolean,
    pointsAwarded: number,
    difficulty: string,
    usedPowerup: boolean
  ): Promise<void> {
    if (isDbConnected()) {
      try {
        await query(SQL.INSERT_ANSWER, [
          sessionId,
          questionId,
          selectedIndex,
          isCorrect,
          pointsAwarded,
          difficulty,
          usedPowerup,
        ]);
      } catch (err) {
        console.warn('Postgres error recording answer:', err);
      }
    }
  },
};
