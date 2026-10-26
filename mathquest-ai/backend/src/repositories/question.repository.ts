import { query, isDbConnected } from '../db/pool';
import { SQL } from '../db/queries';
import { StoredQuestion } from '../types/quiz';

const inMemoryQuestions = new Map<string, StoredQuestion>();

export const QuestionRepository = {
  async saveQuestion(q: StoredQuestion, topicUuid?: string): Promise<StoredQuestion> {
    inMemoryQuestions.set(q.id, q);

    if (isDbConnected() && topicUuid) {
      try {
        await query(SQL.INSERT_QUESTION, [
          topicUuid,
          q.question,
          JSON.stringify(q.options),
          q.correctIndex,
          q.explanation,
          q.difficulty,
          'generated',
          q.validationStatus,
        ]);
      } catch (err) {
        console.warn('Postgres error saving question:', err);
      }
    }

    return q;
  },

  async getQuestionById(id: string): Promise<StoredQuestion | null> {
    if (inMemoryQuestions.has(id)) {
      return inMemoryQuestions.get(id)!;
    }

    if (isDbConnected()) {
      try {
        const res = await query(SQL.GET_QUESTION_BY_ID, [id]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            topicId: row.topic_id,
            question: row.question_text,
            options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
            correctIndex: row.correct_index,
            explanation: row.explanation,
            difficulty: row.difficulty,
            validationStatus: row.validation_status,
          };
        }
      } catch (err) {
        console.warn('Postgres error getting question:', err);
      }
    }

    return null;
  },
};
