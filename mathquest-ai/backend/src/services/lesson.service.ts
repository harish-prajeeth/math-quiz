import { LessonContent, InfographicData } from '../types/quiz';
import { getTopicById } from '../config/topics';

/**
 * Curated lesson content for each topic.
 * In production, Gemini could enhance these — but the app works without it.
 */
const lessonContentMap: Record<string, LessonContent> = {
  'g5-fractions': {
    topicId: 'g5-fractions',
    title: 'Adding & Subtracting Fractions',
    grade: 5,
    objective: 'Add and subtract fractions with unlike denominators',
    explanation:
      'A fraction represents a part of a whole. When adding or subtracting fractions, the denominators (bottom numbers) must be the same. If they are different, we need to find a common denominator — a number that both denominators divide into evenly. We convert each fraction to an equivalent fraction with that common denominator, then add or subtract the numerators (top numbers).',
    workedExample: {
      problem: 'What is 1/3 + 1/4?',
      steps: [
        'Find the Least Common Denominator (LCD) of 3 and 4 → LCD = 12',
        'Convert 1/3: multiply top and bottom by 4 → 4/12',
        'Convert 1/4: multiply top and bottom by 3 → 3/12',
        'Add the numerators: 4/12 + 3/12 = 7/12',
        'Check if it simplifies → 7/12 is already in simplest form ✓',
      ],
      answer: '7/12',
    },
    commonMistake: {
      mistake: 'Adding both the numerators AND denominators: 1/3 + 1/4 = 2/7',
      correction:
        'Only add the numerators after making the denominators the same. Never add denominators together!',
    },
    practiceQuestion: {
      question: 'What is 2/5 + 1/3?',
      answer: '11/15 (LCD = 15, convert to 6/15 + 5/15 = 11/15)',
    },
    infographicData: {
      type: 'fraction-addition',
      title: 'How to Add Fractions with Unlike Denominators',
      visualElements: [
        { type: 'fraction-visual', content: '1/3', subContent: 'One third of a whole', highlight: true },
        { type: 'label', content: '+' },
        { type: 'fraction-visual', content: '1/4', subContent: 'One quarter of a whole', highlight: true },
        { type: 'step', content: 'Step 1: Find LCD = 12' },
        { type: 'equation', content: '1/3 = 4/12' },
        { type: 'equation', content: '1/4 = 3/12' },
        { type: 'step', content: 'Step 2: Add numerators' },
        { type: 'equation', content: '4/12 + 3/12 = 7/12', highlight: true },
      ],
    },
  },

  'g5-decimals': {
    topicId: 'g5-decimals',
    title: 'Decimal Operations',
    grade: 5,
    objective: 'Perform addition, subtraction, and multiplication with decimals',
    explanation:
      'Decimals are another way to write fractions based on powers of 10. The decimal point separates the whole number part from the fractional part. When adding or subtracting decimals, line up the decimal points. When multiplying, count the total decimal places in both numbers — your answer will have that many decimal places.',
    workedExample: {
      problem: 'What is 3.75 + 2.4?',
      steps: [
        'Line up the decimal points vertically',
        'Add a zero to 2.4 to make it 2.40 (this doesn\'t change its value)',
        'Add column by column from right to left:',
        '  5 + 0 = 5 (hundredths)',
        '  7 + 4 = 11 → write 1, carry 1 (tenths)',
        '  3 + 2 + 1 = 6 (ones)',
        'Result: 6.15',
      ],
      answer: '6.15',
    },
    commonMistake: {
      mistake: 'Not lining up the decimal points: treating 3.75 + 2.4 as 3.75 + 0.24',
      correction: 'Always align the decimal points vertically before adding. Fill empty places with zeros.',
    },
    practiceQuestion: {
      question: 'What is 5.6 − 2.35?',
      answer: '3.25 (line up decimals: 5.60 − 2.35 = 3.25)',
    },
    infographicData: {
      type: 'decimal-operations',
      title: 'Mastering Decimal Operations',
      visualElements: [
        { type: 'decimal-visual', content: '3.75', subContent: '3 ones, 7 tenths, 5 hundredths' },
        { type: 'label', content: '+' },
        { type: 'decimal-visual', content: '2.40', subContent: '2 ones, 4 tenths, 0 hundredths' },
        { type: 'step', content: 'Line up the decimal points!' },
        { type: 'equation', content: '3.75 + 2.40 = 6.15', highlight: true },
      ],
    },
  },

  'g5-multiplication': {
    topicId: 'g5-multiplication',
    title: 'Multi-Digit Multiplication',
    grade: 5,
    objective: 'Multiply multi-digit whole numbers using the standard algorithm',
    explanation:
      'The standard multiplication algorithm breaks a large multiplication into smaller, manageable steps. We multiply each digit of one number by each digit of the other, keeping track of place value. Then we add all the partial products together.',
    workedExample: {
      problem: 'What is 47 × 23?',
      steps: [
        'Multiply 47 by 3 (ones digit of 23): 47 × 3 = 141',
        'Multiply 47 by 20 (tens digit of 23): 47 × 20 = 940',
        'Add the partial products: 141 + 940 = 1,081',
      ],
      answer: '1,081',
    },
    commonMistake: {
      mistake: 'Forgetting to add a zero when multiplying by the tens digit',
      correction: 'When multiplying by the tens digit, remember it represents groups of 10. Always shift one place left (add a zero).',
    },
    practiceQuestion: {
      question: 'What is 36 × 14?',
      answer: '504 (36 × 4 = 144, 36 × 10 = 360, total = 504)',
    },
    infographicData: {
      type: 'multiplication',
      title: 'Standard Multiplication Algorithm',
      visualElements: [
        { type: 'equation', content: '47 × 23', highlight: true },
        { type: 'step', content: 'Step 1: 47 × 3 = 141' },
        { type: 'step', content: 'Step 2: 47 × 20 = 940' },
        { type: 'step', content: 'Step 3: Add partial products' },
        { type: 'equation', content: '141 + 940 = 1,081', highlight: true },
      ],
    },
  },

  'g5-division': {
    topicId: 'g5-division',
    title: 'Division with Remainders',
    grade: 5,
    objective: 'Divide multi-digit numbers and interpret remainders',
    explanation:
      'Division finds how many times one number fits into another. The dividend is what we divide, the divisor is what we divide by, the quotient is the answer, and the remainder is what\'s left over. Long division works through the dividend digit by digit.',
    workedExample: {
      problem: 'What is 157 ÷ 6?',
      steps: [
        'How many 6s in 15? → 2 (6 × 2 = 12, subtract: 15 − 12 = 3)',
        'Bring down the 7 → 37',
        'How many 6s in 37? → 6 (6 × 6 = 36, subtract: 37 − 36 = 1)',
        'No more digits to bring down',
        'Quotient = 26, Remainder = 1',
      ],
      answer: '26 R1',
    },
    commonMistake: {
      mistake: 'Forgetting the remainder or writing a remainder larger than the divisor',
      correction: 'The remainder must always be less than the divisor. If it\'s not, you can fit more groups in!',
    },
    practiceQuestion: {
      question: 'What is 89 ÷ 7?',
      answer: '12 R5 (7 × 12 = 84, 89 − 84 = 5)',
    },
    infographicData: {
      type: 'division',
      title: 'Long Division Step by Step',
      visualElements: [
        { type: 'equation', content: '157 ÷ 6', highlight: true },
        { type: 'step', content: 'Divide: 15 ÷ 6 = 2 R3' },
        { type: 'step', content: 'Bring down: 37' },
        { type: 'step', content: 'Divide: 37 ÷ 6 = 6 R1' },
        { type: 'equation', content: '= 26 R1', highlight: true },
      ],
    },
  },

  'g6-ratios': {
    topicId: 'g6-ratios',
    title: 'Ratios & Unit Rates',
    grade: 6,
    objective: 'Understand and calculate ratios and unit rates',
    explanation:
      'A ratio compares two quantities. It can be written as "3 to 2", "3:2", or "3/2". A unit rate is a ratio where the second quantity is 1 — for example, "$5 per item" or "60 miles per hour". To find a unit rate, divide the first quantity by the second.',
    workedExample: {
      problem: 'A store sells 8 oranges for $4. What is the unit price?',
      steps: [
        'We want the price for 1 orange',
        'Divide the total price by the number of oranges',
        '$4 ÷ 8 = $0.50',
        'The unit price is $0.50 per orange',
      ],
      answer: '$0.50 per orange',
    },
    commonMistake: {
      mistake: 'Dividing in the wrong order: 8 ÷ 4 = 2 instead of 4 ÷ 8 = 0.5',
      correction: 'For "price per item," divide the price by the number of items, not the other way around.',
    },
    practiceQuestion: {
      question: 'If 12 cookies weigh 360 grams, what is the weight per cookie?',
      answer: '30 grams per cookie (360 ÷ 12 = 30)',
    },
    infographicData: {
      type: 'ratio',
      title: 'Understanding Ratios & Unit Rates',
      visualElements: [
        { type: 'ratio-visual', content: '8 oranges : $4', subContent: 'Total cost for 8' },
        { type: 'step', content: 'To find unit rate, divide both by 8' },
        { type: 'ratio-visual', content: '1 orange : $0.50', subContent: 'Unit price', highlight: true },
        { type: 'equation', content: '$4 ÷ 8 = $0.50 per orange', highlight: true },
      ],
    },
  },

  'g6-fractions-decimals': {
    topicId: 'g6-fractions-decimals',
    title: 'Multiplying & Dividing Fractions',
    grade: 6,
    objective: 'Multiply and divide fractions and mixed numbers',
    explanation:
      'To multiply fractions, multiply the numerators together and the denominators together, then simplify. To divide fractions, multiply by the reciprocal (flip the second fraction). Always simplify your final answer.',
    workedExample: {
      problem: 'What is 3/4 ÷ 2/3?',
      steps: [
        'To divide by a fraction, multiply by its reciprocal',
        'The reciprocal of 2/3 is 3/2',
        '3/4 × 3/2 = (3×3)/(4×2) = 9/8',
        '9/8 = 1 1/8 as a mixed number',
      ],
      answer: '9/8 or 1 1/8',
    },
    commonMistake: {
      mistake: 'Dividing numerators and denominators separately: 3/4 ÷ 2/3 = (3÷2)/(4÷3)',
      correction: 'To divide fractions, flip the second fraction and multiply. Don\'t divide across!',
    },
    practiceQuestion: {
      question: 'What is 2/5 × 5/6?',
      answer: '1/3 (multiply: 10/30, simplify: 1/3)',
    },
    infographicData: {
      type: 'fraction-operations',
      title: 'Multiplying & Dividing Fractions',
      visualElements: [
        { type: 'equation', content: '3/4 ÷ 2/3', highlight: true },
        { type: 'step', content: 'Keep → Change → Flip' },
        { type: 'equation', content: '3/4 × 3/2' },
        { type: 'step', content: 'Multiply across' },
        { type: 'equation', content: '= 9/8 = 1 1/8', highlight: true },
      ],
    },
  },

  'g6-integers': {
    topicId: 'g6-integers',
    title: 'Integers & the Number Line',
    grade: 6,
    objective: 'Understand and order positive and negative integers',
    explanation:
      'Integers include all whole numbers and their negatives: ...−3, −2, −1, 0, 1, 2, 3... On a number line, numbers increase from left to right. Every negative number is less than every positive number. The absolute value of a number is its distance from zero — it\'s always positive or zero.',
    workedExample: {
      problem: 'Order −4, 2, −1, 0, 3 from least to greatest',
      steps: [
        'Picture a number line',
        '−4 is farthest left (smallest)',
        '−1 is next',
        '0 is in the middle',
        '2 is to the right of 0',
        '3 is farthest right (greatest)',
      ],
      answer: '−4, −1, 0, 2, 3',
    },
    commonMistake: {
      mistake: 'Thinking −4 is greater than −1 because 4 > 1',
      correction: 'With negative numbers, the one closer to zero is greater. −1 > −4 because −1 is closer to zero.',
    },
    practiceQuestion: {
      question: 'What is |−8| + |3|?',
      answer: '11 (absolute values: 8 + 3 = 11)',
    },
    infographicData: {
      type: 'number-line',
      title: 'The Integer Number Line',
      visualElements: [
        { type: 'label', content: '← Negative | Zero | Positive →' },
        { type: 'step', content: '...−4, −3, −2, −1, 0, 1, 2, 3, 4...' },
        { type: 'label', content: 'Numbers increase from left to right', highlight: true },
        { type: 'equation', content: '|−4| = 4 (distance from 0)' },
        { type: 'label', content: 'Absolute value = distance from zero' },
      ],
    },
  },

  'g6-expressions': {
    topicId: 'g6-expressions',
    title: 'Expressions & Equations',
    grade: 6,
    objective: 'Write and evaluate simple algebraic expressions',
    explanation:
      'An algebraic expression uses numbers, variables (like x), and operations. A variable represents an unknown number. To evaluate an expression, substitute the given value for the variable and calculate. An equation has an equals sign — you solve it by finding the value that makes both sides equal.',
    workedExample: {
      problem: 'Evaluate 2x + 5 when x = 7',
      steps: [
        'Replace x with 7: 2(7) + 5',
        'Multiply first: 14 + 5',
        'Add: 19',
      ],
      answer: '19',
    },
    commonMistake: {
      mistake: 'Adding before multiplying: 2x + 5 → 2(7+5) = 24',
      correction: 'Follow order of operations! Multiply 2×7 first, then add 5.',
    },
    practiceQuestion: {
      question: 'Solve: x + 9 = 15',
      answer: 'x = 6 (subtract 9 from both sides)',
    },
    infographicData: {
      type: 'algebra',
      title: 'Introduction to Expressions & Equations',
      visualElements: [
        { type: 'equation', content: '2x + 5, when x = 7', highlight: true },
        { type: 'step', content: 'Step 1: Substitute → 2(7) + 5' },
        { type: 'step', content: 'Step 2: Multiply → 14 + 5' },
        { type: 'step', content: 'Step 3: Add → 19' },
        { type: 'equation', content: '= 19', highlight: true },
      ],
    },
  },
};

/**
 * Get lesson content for a topic.
 */
export function getLessonContent(topicId: string): LessonContent | null {
  const topic = getTopicById(topicId);
  if (!topic) return null;

  return lessonContentMap[topicId] || null;
}

/**
 * Get all available lesson topic IDs.
 */
export function getAvailableLessons(): string[] {
  return Object.keys(lessonContentMap);
}
