import { describe, it, expect } from 'vitest';
import { validateQuestion, validateBatch, findCorrectIndex } from '../services/question-validator.service';
import { StoredQuestion } from '../types/quiz';

describe('Question Validator Service', () => {
  const validQuestion: StoredQuestion = {
    id: 'valid-q-1',
    topicId: 'g5-fractions-add-sub',
    grade: 5,
    difficulty: 'easy',
    question: 'What is 1/3 + 1/3?',
    options: ['2/3', '1/3', '2/6', '1/6'],
    correctIndex: 0,
    explanation: 'Same denominator, so 1 + 1 = 2 over 3 = 2/3.',
    validationStatus: 'machine_validated',
    isAiGenerated: false,
    createdAt: new Date(),
  };

  it('validates a well-formed question', () => {
    const result = validateQuestion(validQuestion);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('flags missing question text', () => {
    const invalid = { ...validQuestion, question: '' };
    const result = validateQuestion(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Question text is empty');
  });

  it('flags option count not equal to 4', () => {
    const invalid = { ...validQuestion, options: ['1', '2', '3'] };
    const result = validateQuestion(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Expected 4 options, got 3');
  });

  it('flags duplicate options', () => {
    const invalid = { ...validQuestion, options: ['2/3', '2/3', '1/3', '4/3'] };
    const result = validateQuestion(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Options are not all distinct');
  });

  it('flags out-of-bounds correctIndex', () => {
    const invalid = { ...validQuestion, correctIndex: 4 };
    const result = validateQuestion(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('correctIndex 4 is out of bounds');
  });

  it('flags empty explanation', () => {
    const invalid = { ...validQuestion, explanation: '   ' };
    const result = validateQuestion(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Explanation is empty');
  });

  it('validates a batch and separates valid from rejected', () => {
    const badQuestion = { ...validQuestion, id: 'bad-q', question: '' };
    const batch = validateBatch([validQuestion, badQuestion]);
    expect(batch.valid).toHaveLength(1);
    expect(batch.rejected).toHaveLength(1);
    expect(batch.rejected[0].question.id).toBe('bad-q');
  });

  it('finds correct index by exact and normalized match', () => {
    const options = ['3/4', '1/2', '2/3', '5/8'];
    expect(findCorrectIndex('1/2', options)).toBe(1);
    expect(findCorrectIndex(' 3/4 ', options)).toBe(0);
    expect(findCorrectIndex('not-here', options)).toBe(-1);
  });
});
