import { Router, Request, Response } from 'express';
import { topics, getTopicById, getTopicsByGrade } from '../config/topics';
import { getLessonContent } from '../services/lesson.service';

const router = Router();

/**
 * GET /api/topics - Get all topics
 */
router.get('/topics', (_req: Request, res: Response) => {
  res.json({ topics });
});

/**
 * GET /api/topics/grade/:grade - Get topics by grade
 */
router.get('/topics/grade/:grade', (req: Request, res: Response) => {
  const gradeParam = Array.isArray(req.params.grade) ? req.params.grade[0] : req.params.grade;
  const grade = parseInt(gradeParam, 10);
  if (isNaN(grade) || (grade !== 5 && grade !== 6)) {
    res.status(400).json({ error: 'Grade must be 5 or 6' });
    return;
  }
  const gradeTopics = getTopicsByGrade(grade);
  res.json({ topics: gradeTopics });
});

/**
 * GET /api/lesson/:topicId - Get lesson content
 */
router.get('/lesson/:topicId', (req: Request, res: Response) => {
  const topicId = Array.isArray(req.params.topicId) ? req.params.topicId[0] : req.params.topicId;
  
  const topic = getTopicById(topicId);
  if (!topic) {
    res.status(404).json({ error: 'Topic not found' });
    return;
  }

  const lesson = getLessonContent(topicId);
  if (!lesson) {
    res.status(404).json({ error: 'Lesson content not available for this topic' });
    return;
  }

  res.json({ lesson, topic });
});

export default router;
