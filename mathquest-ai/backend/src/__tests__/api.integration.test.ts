import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

describe('MathQuest API Endpoints Integration', () => {
  const app = createApp();

  it('GET /api/health returns ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.uptime).toBeDefined();
  });

  it('GET /api/topics returns list of topics', async () => {
    const res = await request(app).get('/api/topics');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.topics)).toBe(true);
    expect(res.body.topics.length).toBeGreaterThan(0);
  });

  it('GET /api/topics/grade/5 returns only grade 5 topics', async () => {
    const res = await request(app).get('/api/topics/grade/5');
    expect(res.status).toBe(200);
    expect(res.body.topics.every((t: any) => t.grade === 5)).toBe(true);
  });

  it('GET /api/lesson/g5-fractions returns lesson with visual infographic data', async () => {
    const res = await request(app).get('/api/lesson/g5-fractions');
    expect(res.status).toBe(200);
    expect(res.body.lesson).toBeDefined();
    expect(res.body.lesson.workedExample).toBeDefined();
    expect(res.body.lesson.infographicData).toBeDefined();
    expect(res.body.topic).toBeDefined();
  });

  it('runs a full quiz lifecycle: start, answer questions, and fetch results', async () => {
    // 1. Start quiz
    const startRes = await request(app)
      .post('/api/quiz/start')
      .send({ topicId: 'g5-fractions', grade: 5 });

    expect(startRes.status).toBe(201);
    expect(startRes.body.sessionId).toBeDefined();
    expect(startRes.body.firstQuestion).toBeDefined();
    expect(startRes.body.firstQuestion.options.length).toBe(4);

    const sessionId = startRes.body.sessionId;

    // 2. Get current question
    const currRes = await request(app).get(`/api/quiz/${sessionId}/current`);
    expect(currRes.status).toBe(200);
    expect(currRes.body.question).toBeDefined();

    // 3. Submit 10 answers
    for (let i = 0; i < 10; i++) {
      const answerRes = await request(app)
        .post(`/api/quiz/${sessionId}/answer`)
        .send({ selectedIndex: 0 });

      expect(answerRes.status).toBe(200);
      expect(answerRes.body.result).toBeDefined();
      expect(typeof answerRes.body.result.correct).toBe('boolean');
      expect(answerRes.body.result.totalScore).toBeDefined();

      if (i < 9) {
        // Fetch next question
        const nextQ = await request(app).get(`/api/quiz/${sessionId}/current`);
        expect(nextQ.status).toBe(200);
      }
    }

    // 4. Fetch final results
    const resultsRes = await request(app).get(`/api/quiz/${sessionId}/results`);
    expect(resultsRes.status).toBe(200);
    expect(resultsRes.body.results.completed).toBe(true);
    expect(resultsRes.body.results.totalQuestions).toBe(10);
    expect(Array.isArray(resultsRes.body.results.badges)).toBe(true);
  });
});
