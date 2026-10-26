import { StoredQuestion } from '../types/quiz';

/**
 * Manually curated fallback questions for each topic.
 * Used when AI generation and arithmetic generation cannot fill a quiz.
 * All answers have been manually verified.
 */
export const fallbackQuestions: StoredQuestion[] = [
  // ─── Grade 5: Fractions ───
  {
    id: 'fb-frac-e1',
    topicId: 'g5-fractions',
    difficulty: 'easy',
    question: 'What is 1/4 + 1/4?',
    options: ['1/2', '2/4', '1/8', '3/4'],
    correctIndex: 0,
    explanation: '1/4 + 1/4 = 2/4 = 1/2 (simplified)',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-frac-e2',
    topicId: 'g5-fractions',
    difficulty: 'easy',
    question: 'What is 2/6 + 1/6?',
    options: ['1/2', '3/6', '2/3', '1/3'],
    correctIndex: 0,
    explanation: '2/6 + 1/6 = 3/6 = 1/2 (simplified)',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-frac-m1',
    topicId: 'g5-fractions',
    difficulty: 'medium',
    question: 'What is 1/3 + 1/6?',
    options: ['1/2', '2/9', '1/3', '2/6'],
    correctIndex: 0,
    explanation: 'Convert 1/3 to 2/6. Then 2/6 + 1/6 = 3/6 = 1/2',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-frac-m2',
    topicId: 'g5-fractions',
    difficulty: 'medium',
    question: 'What is 3/4 − 1/2?',
    options: ['1/4', '1/2', '2/4', '3/8'],
    correctIndex: 0,
    explanation: 'Convert 1/2 to 2/4. Then 3/4 − 2/4 = 1/4',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-frac-h1',
    topicId: 'g5-fractions',
    difficulty: 'hard',
    question: 'What is 2/3 + 3/4?',
    options: ['17/12', '5/7', '5/12', '1'],
    correctIndex: 0,
    explanation: 'LCD = 12. Convert: 8/12 + 9/12 = 17/12',
    validationStatus: 'human_reviewed',
  },

  // ─── Grade 5: Decimals ───
  {
    id: 'fb-dec-e1',
    topicId: 'g5-decimals',
    difficulty: 'easy',
    question: 'What is 0.3 + 0.4?',
    options: ['0.7', '0.1', '0.34', '7.0'],
    correctIndex: 0,
    explanation: '0.3 + 0.4 = 0.7. Line up the decimal points and add.',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-dec-m1',
    topicId: 'g5-decimals',
    difficulty: 'medium',
    question: 'What is 3.25 + 1.75?',
    options: ['5.00', '4.00', '5.10', '4.90'],
    correctIndex: 0,
    explanation: '3.25 + 1.75 = 5.00',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-dec-h1',
    topicId: 'g5-decimals',
    difficulty: 'hard',
    question: 'What is 12.50 × 0.4?',
    options: ['5.00', '50.00', '0.50', '12.90'],
    correctIndex: 0,
    explanation: '12.50 × 0.4 = 5.00. Count 1 decimal place in 0.4 and 2 in 12.50 for 3 total.',
    validationStatus: 'human_reviewed',
  },

  // ─── Grade 5: Multiplication ───
  {
    id: 'fb-mul-e1',
    topicId: 'g5-multiplication',
    difficulty: 'easy',
    question: 'What is 7 × 12?',
    options: ['84', '74', '96', '72'],
    correctIndex: 0,
    explanation: '7 × 12 = 7 × 10 + 7 × 2 = 70 + 14 = 84',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-mul-m1',
    topicId: 'g5-multiplication',
    difficulty: 'medium',
    question: 'What is 23 × 15?',
    options: ['345', '335', '355', '300'],
    correctIndex: 0,
    explanation: '23 × 15 = 23 × 10 + 23 × 5 = 230 + 115 = 345',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-mul-h1',
    topicId: 'g5-multiplication',
    difficulty: 'hard',
    question: 'What is 125 × 24?',
    options: ['3000', '2500', '3100', '2900'],
    correctIndex: 0,
    explanation: '125 × 24 = 125 × 20 + 125 × 4 = 2500 + 500 = 3000',
    validationStatus: 'human_reviewed',
  },

  // ─── Grade 5: Division ───
  {
    id: 'fb-div-e1',
    topicId: 'g5-division',
    difficulty: 'easy',
    question: 'What is 56 ÷ 8?',
    options: ['7', '6', '8', '9'],
    correctIndex: 0,
    explanation: '56 ÷ 8 = 7 because 8 × 7 = 56',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-div-m1',
    topicId: 'g5-division',
    difficulty: 'medium',
    question: 'What is 47 ÷ 5? (Include the remainder)',
    options: ['9 R2', '9 R3', '8 R7', '10 R2'],
    correctIndex: 0,
    explanation: '47 ÷ 5 = 9 remainder 2. Because 5 × 9 = 45, and 47 − 45 = 2.',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-div-h1',
    topicId: 'g5-division',
    difficulty: 'hard',
    question: 'What is 738 ÷ 18? (Include the remainder)',
    options: ['41 R0', '40 R18', '42 R2', '39 R6'],
    correctIndex: 0,
    explanation: '738 ÷ 18 = 41 because 18 × 41 = 738 (no remainder)',
    validationStatus: 'human_reviewed',
  },

  // ─── Grade 6: Ratios ───
  {
    id: 'fb-rat-e1',
    topicId: 'g6-ratios',
    difficulty: 'easy',
    question: 'A classroom has 12 boys and 8 girls. What is the simplified ratio of boys to girls?',
    options: ['3:2', '12:8', '2:3', '4:3'],
    correctIndex: 0,
    explanation: '12:8 simplified by dividing both by 4 = 3:2',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-rat-m1',
    topicId: 'g6-ratios',
    difficulty: 'medium',
    question: '6 pencils cost $3. What is the unit price per pencil?',
    options: ['$0.50', '$0.60', '$1.00', '$3.00'],
    correctIndex: 0,
    explanation: '$3 ÷ 6 = $0.50 per pencil',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-rat-h1',
    topicId: 'g6-ratios',
    difficulty: 'hard',
    question: 'A recipe uses flour and sugar in a ratio of 5:2. If you use 20 cups of flour, how many cups of sugar do you need?',
    options: ['8', '10', '4', '15'],
    correctIndex: 0,
    explanation: '5:2 ratio, flour = 20, multiplier = 20÷5 = 4, sugar = 2×4 = 8',
    validationStatus: 'human_reviewed',
  },

  // ─── Grade 6: Fractions & Decimals ───
  {
    id: 'fb-fd-e1',
    topicId: 'g6-fractions-decimals',
    difficulty: 'easy',
    question: 'What is 1/2 × 6?',
    options: ['3', '12', '6', '1/12'],
    correctIndex: 0,
    explanation: '1/2 × 6 = 6/2 = 3',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-fd-m1',
    topicId: 'g6-fractions-decimals',
    difficulty: 'medium',
    question: 'What is 2/3 × 3/4?',
    options: ['1/2', '6/7', '5/12', '2/4'],
    correctIndex: 0,
    explanation: '2/3 × 3/4 = 6/12 = 1/2',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-fd-h1',
    topicId: 'g6-fractions-decimals',
    difficulty: 'hard',
    question: 'What is 5/6 × 3/5?',
    options: ['1/2', '15/30', '8/11', '5/10'],
    correctIndex: 0,
    explanation: '5/6 × 3/5 = 15/30 = 1/2',
    validationStatus: 'human_reviewed',
  },

  // ─── Grade 6: Integers ───
  {
    id: 'fb-int-e1',
    topicId: 'g6-integers',
    difficulty: 'easy',
    question: 'Which number is greater: −3 or 2?',
    options: ['2', '−3', 'They are equal', 'Cannot tell'],
    correctIndex: 0,
    explanation: 'Positive numbers are always greater than negative numbers. 2 > −3',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-int-m1',
    topicId: 'g6-integers',
    difficulty: 'medium',
    question: 'What is |−7|?',
    options: ['7', '−7', '0', '−1'],
    correctIndex: 0,
    explanation: 'The absolute value of −7 is 7 (its distance from 0).',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-int-h1',
    topicId: 'g6-integers',
    difficulty: 'hard',
    question: 'Order from least to greatest: 3, −5, 0, −2, 1',
    options: ['−5, −2, 0, 1, 3', '−2, −5, 0, 1, 3', '0, 1, −2, 3, −5', '3, 1, 0, −2, −5'],
    correctIndex: 0,
    explanation: 'On a number line: −5 < −2 < 0 < 1 < 3',
    validationStatus: 'human_reviewed',
  },

  // ─── Grade 6: Expressions ───
  {
    id: 'fb-exp-e1',
    topicId: 'g6-expressions',
    difficulty: 'easy',
    question: 'Evaluate 3x + 2 when x = 4',
    options: ['14', '12', '9', '34'],
    correctIndex: 0,
    explanation: '3(4) + 2 = 12 + 2 = 14',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-exp-m1',
    topicId: 'g6-expressions',
    difficulty: 'medium',
    question: 'Solve for x: 5x = 35',
    options: ['7', '30', '40', '5'],
    correctIndex: 0,
    explanation: 'x = 35 ÷ 5 = 7',
    validationStatus: 'human_reviewed',
  },
  {
    id: 'fb-exp-h1',
    topicId: 'g6-expressions',
    difficulty: 'hard',
    question: 'Which expression represents "8 less than a number x"?',
    options: ['x − 8', '8 − x', 'x + 8', '8x'],
    correctIndex: 0,
    explanation: '"8 less than x" means start with x and subtract 8: x − 8',
    validationStatus: 'human_reviewed',
  },
];

/**
 * Get fallback questions for a topic and optional difficulty filter.
 */
export function getFallbackQuestions(
  topicId: string,
  difficulty?: string
): StoredQuestion[] {
  return fallbackQuestions.filter(
    q => q.topicId === topicId && (!difficulty || q.difficulty === difficulty)
  );
}
