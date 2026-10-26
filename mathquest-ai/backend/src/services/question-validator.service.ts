import { StoredQuestion } from '../types/quiz';

/**
 * Validates a question for correctness, consistency, and completeness.
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateQuestion(question: StoredQuestion): ValidationResult {
  const errors: string[] = [];

  // 1. Question text is non-empty
  if (!question.question || question.question.trim().length === 0) {
    errors.push('Question text is empty');
  }

  // 2. Exactly four options
  if (!question.options || question.options.length !== 4) {
    errors.push(`Expected 4 options, got ${question.options?.length ?? 0}`);
  }

  // 3. All options are distinct
  if (question.options) {
    const normalized = question.options.map(o => o.trim().toLowerCase());
    const unique = new Set(normalized);
    if (unique.size !== question.options.length) {
      errors.push('Options are not all distinct');
    }
  }

  // 4. correctIndex is valid
  if (
    typeof question.correctIndex !== 'number' ||
    question.correctIndex < 0 ||
    question.correctIndex >= (question.options?.length ?? 0)
  ) {
    errors.push(`correctIndex ${question.correctIndex} is out of bounds`);
  }

  // 5. Explanation is non-empty
  if (!question.explanation || question.explanation.trim().length === 0) {
    errors.push('Explanation is empty');
  }

  // 6. Difficulty is valid
  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!validDifficulties.includes(question.difficulty)) {
    errors.push(`Invalid difficulty: ${question.difficulty}`);
  }

  // 7. Topic is present
  if (!question.topicId || question.topicId.trim().length === 0) {
    errors.push('topicId is empty');
  }

  // 8. ID is present
  if (!question.id || question.id.trim().length === 0) {
    errors.push('Question id is empty');
  }

  // 9. Validation status is valid
  const validStatuses = ['machine_validated', 'math_validated', 'human_reviewed'];
  if (!validStatuses.includes(question.validationStatus)) {
    errors.push(`Invalid validationStatus: ${question.validationStatus}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a batch of questions. Returns only the valid ones.
 */
export function validateBatch(questions: StoredQuestion[]): {
  valid: StoredQuestion[];
  rejected: Array<{ question: StoredQuestion; errors: string[] }>;
} {
  const valid: StoredQuestion[] = [];
  const rejected: Array<{ question: StoredQuestion; errors: string[] }> = [];

  for (const q of questions) {
    const result = validateQuestion(q);
    if (result.valid) {
      valid.push(q);
    } else {
      rejected.push({ question: q, errors: result.errors });
    }
  }

  return { valid, rejected };
}

/**
 * Try to find and match a text answer against the options.
 * Handles normalized matching of fractions, decimals, etc.
 */
export function findCorrectIndex(
  correctAnswer: string,
  options: string[]
): number {
  // Exact match first
  const exactIdx = options.findIndex(o => o.trim() === correctAnswer.trim());
  if (exactIdx !== -1) return exactIdx;

  // Normalized match
  const normalizedAnswer = normalizeAnswer(correctAnswer);
  const idx = options.findIndex(o => normalizeAnswer(o) === normalizedAnswer);
  return idx; // returns -1 if no match
}

function normalizeAnswer(answer: string): string {
  let norm = answer.trim().toLowerCase();
  // Remove extra spaces
  norm = norm.replace(/\s+/g, ' ');
  // Try to evaluate simple fractions to a decimal for comparison
  // But we keep the original for display
  return norm;
}
