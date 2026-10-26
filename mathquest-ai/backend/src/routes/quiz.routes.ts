import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { QuizService } from '../services/quiz.service';
import { getTopicById } from '../config/topics';

const startQuizSchema = z.object({
  topicId: z.string().min(1),
  grade: z.number().int().min(5).max(6),
});

const answerSchema = z.object({
  selectedIndex: z.number().int().min(0).max(3),
});

export function createQuizRouter(quizService: QuizService): Router {
  const router = Router();

  /**
   * POST /api/quiz/start - Start a new quiz
   */
  router.post('/start', async (req: Request, res: Response) => {
    try {
      const parsed = startQuizSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Invalid request',
          details: parsed.error.issues,
        });
        return;
      }

      const { topicId, grade } = parsed.data;

      // Verify topic exists
      const topic = getTopicById(topicId);
      if (!topic) {
        res.status(404).json({ error: 'Topic not found' });
        return;
      }

      const result = await quizService.startQuiz(topicId, grade);
      res.status(201).json(result);
    } catch (err: any) {
      if (err.message === 'INVALID_TOPIC') {
        res.status(404).json({ error: 'Topic not found' });
        return;
      }
      if (err.message === 'GRADE_MISMATCH') {
        res.status(400).json({ error: 'Topic does not belong to the specified grade' });
        return;
      }
      if (err.message === 'NO_QUESTIONS_AVAILABLE') {
        res.status(503).json({ error: 'Unable to generate questions. Please try again.' });
        return;
      }
      console.error('Error starting quiz:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/quiz/:sessionId/current - Get current question
   */
  router.get('/:sessionId/current', async (req: Request, res: Response) => {
    try {
      const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
      const question = await quizService.getCurrentQuestion(sessionId);
      res.json({ question });
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') {
        res.status(404).json({ error: 'SESSION_EXPIRED', message: 'Quiz session has expired. Please start a new quiz.' });
        return;
      }
      if (err.message === 'QUIZ_COMPLETED') {
        res.status(400).json({ error: 'QUIZ_COMPLETED', message: 'This quiz is already completed. View your results.' });
        return;
      }
      if (err.message === 'NO_MORE_QUESTIONS') {
        res.status(400).json({ error: 'NO_MORE_QUESTIONS' });
        return;
      }
      console.error('Error getting question:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/quiz/:sessionId/powerup - Use 50/50 powerup
   */
  router.post('/:sessionId/powerup', async (req: Request, res: Response) => {
    try {
      const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
      const questionId = req.body.questionId;
      if (!questionId || typeof questionId !== 'string') {
        res.status(400).json({ error: 'INVALID_QUESTION_ID' });
        return;
      }
      const data = await quizService.usePowerup(sessionId, questionId);
      res.json(data);
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') {
        res.status(404).json({ error: 'SESSION_EXPIRED', message: 'Quiz session expired.' });
        return;
      }
      if (err.message === 'POWERUP_USED') {
        res.status(400).json({ error: 'POWERUP_USED', message: 'Powerup already used in this quest.' });
        return;
      }
      if (err.message === 'ALREADY_ANSWERED') {
        res.status(400).json({ error: 'ALREADY_ANSWERED' });
        return;
      }
      console.error('Error using powerup:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/quiz/:sessionId/answer - Submit an answer
   */
  router.post('/:sessionId/answer', async (req: Request, res: Response) => {
    try {
      const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
      const parsed = answerSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          error: 'Invalid answer',
          details: parsed.error.issues,
        });
        return;
      }

      const result = await quizService.submitAnswer(sessionId, parsed.data.selectedIndex);
      res.json({ result });
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') {
        res.status(404).json({ error: 'SESSION_EXPIRED', message: 'Quiz session has expired. Please start a new quiz.' });
        return;
      }
      if (err.message === 'QUIZ_COMPLETED') {
        res.status(400).json({ error: 'QUIZ_COMPLETED' });
        return;
      }
      if (err.message === 'ALREADY_ANSWERED') {
        res.status(409).json({ error: 'ALREADY_ANSWERED', message: 'This question has already been answered.' });
        return;
      }
      if (err.message === 'QUESTION_NOT_FOUND') {
        res.status(404).json({ error: 'QUESTION_NOT_FOUND' });
        return;
      }
      if (err.message === 'INVALID_OPTION_INDEX') {
        res.status(400).json({ error: 'INVALID_OPTION_INDEX' });
        return;
      }
      console.error('Error submitting answer:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/quiz/:sessionId/results - Get quiz results
   */
  router.get('/:sessionId/results', async (req: Request, res: Response) => {
    try {
      const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
      const results = await quizService.getResults(sessionId);
      res.json({ results });
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') {
        res.status(404).json({ error: 'SESSION_EXPIRED', message: 'Quiz session has expired.' });
        return;
      }
      if (err.message === 'QUIZ_NOT_COMPLETED') {
        res.status(400).json({ error: 'QUIZ_NOT_COMPLETED', message: 'Complete all questions first.' });
        return;
      }
      console.error('Error getting results:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
