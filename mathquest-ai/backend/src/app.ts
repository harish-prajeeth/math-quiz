import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import lessonRoutes from './routes/lesson.routes';
import { createQuizRouter } from './routes/quiz.routes';
import { QuizService } from './services/quiz.service';
import { InMemoryQuizSessionRepository } from './repositories/in-memory-quiz-session.repository';
import { PlayerRepository } from './repositories/player.repository';
import { ProgressRepository } from './repositories/progress.repository';
import { isDbConnected, getDbDiagnostics } from './db/pool';
import path from 'path';
import fs from 'fs';

export function createApp() {
  const app = express();

  // ─── Middleware ───
  app.use(cors());
  app.use(express.json());

  // Rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per window
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', apiLimiter);

  // ─── Repository & Services ───
  const sessionRepository = new InMemoryQuizSessionRepository();
  const quizService = new QuizService(sessionRepository);

  // ─── API Routes ───
  app.use('/api', lessonRoutes);
  app.use('/api/quiz', createQuizRouter(quizService));

  // ─── Player & Badges Routes ───
  app.post('/api/player', async (req, res, next) => {
    try {
      const { grade, nickname, avatarId } = req.body || {};
      const playerRecord = await PlayerRepository.createPlayer({
        grade: grade || 5,
        nickname: nickname || 'Explorer',
        avatarId: avatarId ?? 0,
      });

      const initialProgress = {
        playerId: playerRecord.id,
        playerLevel: 1,
        xp: 0,
        xpIntoLevel: 0,
        xpForNextLevel: 100,
        completedMissions: {},
        starsByTopic: {},
        badges: ['first-quest'],
      };

      await ProgressRepository.savePlayerProgress(initialProgress);
      res.json(initialProgress);
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/player/:id/progress', async (req, res, next) => {
    try {
      const progress = await ProgressRepository.getPlayerProgress(req.params.id);
      if (!progress) {
        res.status(404).json({ error: 'PLAYER_NOT_FOUND', code: 'PLAYER_NOT_FOUND' });
        return;
      }
      res.json(progress);
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/badges', async (_req, res, next) => {
    try {
      const badges = await ProgressRepository.getBadges();
      res.json(badges);
    } catch (err) {
      next(err);
    }
  });

  // ─── Health & Root Check ───
  app.get('/', (_req, res) => {
    res.json({
      service: 'MathQuest AI Backend',
      status: 'ok',
      version: '1.0.0',
      health: '/api/health',
    });
  });

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      dbConnected: isDbConnected(),
    });
  });

  app.get('/api/db/status', async (_req, res) => {
    try {
      const diag = await getDbDiagnostics();
      res.json(diag);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Serve Frontend in Production (if bundled) ───
  if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    if (fs.existsSync(frontendPath)) {
      app.use(express.static(frontendPath));

      // SPA fallback — serve index.html for non-API routes
      app.get('{*path}', (req, res) => {
        if (req.path.startsWith('/api')) {
          res.status(404).json({ error: 'API endpoint not found' });
          return;
        }
        res.sendFile(path.join(frontendPath, 'index.html'));
      });
    }
  }

  // ─── 404 Handler for unmatched API routes ───
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  // ─── Central Error Handler ───
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { details: err.message }),
    });
  });

  return app;
}
