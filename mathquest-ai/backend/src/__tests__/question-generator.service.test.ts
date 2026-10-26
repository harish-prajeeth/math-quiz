import { describe, it, expect } from 'vitest';
import { generateQuestion, generateQuestionBatch } from '../services/question-generator.service';
import { topics } from '../config/topics';
import { validateQuestion } from '../services/question-validator.service';

describe('Question Generator Service', () => {
  it('generates valid questions across all defined topics and difficulties', () => {
    for (const topic of topics) {
      for (const difficulty of ['easy', 'medium', 'hard'] as const) {
        const question = generateQuestion(topic.id, difficulty);
        expect(question).toBeDefined();
        if (question) {
          const validation = validateQuestion(question);
          expect(validation.valid, `Topic ${topic.id} difficulty ${difficulty} failed: ${validation.errors.join(', ')}`).toBe(true);
          expect(question.options[question.correctIndex]).toBeDefined();
          expect(question.options.length).toBe(4);
        }
      }
    }
  });

  it('generates a question batch with unique options and correct answer matching', () => {
    const topic = topics[0];
    const batch = generateQuestionBatch(topic.id, 12);
    expect(batch.length).toBeGreaterThanOrEqual(10);
    for (const q of batch) {
      const validation = validateQuestion(q);
      expect(validation.valid).toBe(true);
    }
  });
});
