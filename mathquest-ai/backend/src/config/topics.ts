import { Topic } from '../types/quiz';

/**
 * Topic catalogue aligned with Georgia Mathematics Standards.
 * 
 * Standards references:
 * - Grade 5: Georgia's K-12 Mathematics Standards (GSE)
 * - Grade 6: Georgia's K-12 Mathematics Standards (GSE)
 * 
 * Note: Standard codes below reference the Georgia Standards of Excellence (GSE).
 * Each has been selected to align with the topic's learning objective. Verify 
 * against the official Georgia DOE publication for your submission year.
 */
export const topics: Topic[] = [
  // ── Grade 5 Topics ──
  {
    id: 'g5-fractions',
    grade: 5,
    orderIndex: 1,
    title: 'Fractions',
    objective: 'Add and subtract fractions with unlike denominators',
    summary: 'Learn to find common denominators and perform fraction addition and subtraction. Master equivalent fractions and simplify your answers.',
    difficulties: ['easy', 'medium', 'hard'],
    standardCode: 'MGSE5.NF.1',
    standardDescription: 'Add and subtract fractions with unlike denominators (including mixed numbers) by replacing given fractions with equivalent fractions.',
    icon: '🍕',
  },
  {
    id: 'g5-decimals',
    grade: 5,
    orderIndex: 2,
    title: 'Decimals',
    objective: 'Perform addition, subtraction, and multiplication with decimals',
    summary: 'Understand decimal place value and perform operations. Learn to align decimal points and solve real-world problems with decimals.',
    difficulties: ['easy', 'medium', 'hard'],
    standardCode: 'MGSE5.NBT.7',
    standardDescription: 'Add, subtract, multiply, and divide decimals to hundredths using concrete models or drawings and strategies based on place value.',
    icon: '🔢',
  },
  {
    id: 'g5-multiplication',
    grade: 5,
    orderIndex: 3,
    title: 'Multi-Digit Multiplication',
    objective: 'Multiply multi-digit whole numbers using the standard algorithm',
    summary: 'Master the standard multiplication algorithm for multi-digit numbers. Practice estimation and check your answers for reasonableness.',
    difficulties: ['easy', 'medium', 'hard'],
    standardCode: 'MGSE5.NBT.5',
    standardDescription: 'Fluently multiply multi-digit whole numbers using the standard algorithm.',
    icon: '✖️',
  },
  {
    id: 'g5-division',
    grade: 5,
    orderIndex: 4,
    title: 'Division with Remainders',
    objective: 'Divide multi-digit numbers and interpret remainders',
    summary: 'Learn long division strategies and understand what remainders mean in context. Solve word problems that require division.',
    difficulties: ['easy', 'medium', 'hard'],
    standardCode: 'MGSE5.NBT.6',
    standardDescription: 'Find whole-number quotients of whole numbers with up to four-digit dividends and two-digit divisors.',
    icon: '➗',
  },

  // ── Grade 6 Topics ──
  {
    id: 'g6-ratios',
    grade: 6,
    orderIndex: 1,
    title: 'Ratios & Rates',
    objective: 'Understand and calculate ratios and unit rates',
    summary: 'Explore the relationship between two quantities using ratios. Calculate unit rates and use them to solve real-world problems.',
    difficulties: ['easy', 'medium', 'hard'],
    standardCode: 'MGSE6.RP.1',
    standardDescription: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.',
    icon: '⚖️',
  },
  {
    id: 'g6-fractions-decimals',
    grade: 6,
    orderIndex: 2,
    title: 'Fractions & Decimals',
    objective: 'Multiply and divide fractions and mixed numbers',
    summary: 'Build on fraction knowledge to multiply and divide fractions. Convert between fractions, decimals, and percentages.',
    difficulties: ['easy', 'medium', 'hard'],
    standardCode: 'MGSE6.NS.1',
    standardDescription: 'Interpret and compute quotients of fractions, and solve word problems involving division of fractions by fractions.',
    icon: '🧮',
  },
  {
    id: 'g6-integers',
    grade: 6,
    orderIndex: 3,
    title: 'Integers & Number Line',
    objective: 'Understand and order positive and negative integers',
    summary: 'Explore numbers below zero. Learn to place integers on the number line, compare them, and understand absolute value.',
    difficulties: ['easy', 'medium', 'hard'],
    standardCode: 'MGSE6.NS.5',
    standardDescription: 'Understand that positive and negative numbers are used together to describe quantities having opposite directions or values.',
    icon: '🔄',
  },
  {
    id: 'g6-expressions',
    grade: 6,
    orderIndex: 4,
    title: 'Expressions & Equations',
    objective: 'Write and evaluate simple algebraic expressions',
    summary: 'Begin your algebra journey! Learn to use variables, write expressions, and solve one-step equations.',
    difficulties: ['easy', 'medium', 'hard'],
    standardCode: 'MGSE6.EE.2',
    standardDescription: 'Write, read, and evaluate expressions in which letters stand for numbers.',
    icon: '📐',
  },
];

export function getTopicById(id: string): Topic | undefined {
  return topics.find(t => t.id === id);
}

export function getTopicsByGrade(grade: number): Topic[] {
  return topics.filter(t => t.grade === grade);
}
