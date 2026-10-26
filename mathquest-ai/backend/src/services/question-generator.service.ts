import { StoredQuestion, Difficulty, ValidationStatus } from '../types/quiz';
import crypto from 'crypto';

// ─── Utility: Greatest Common Divisor ───
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

// ─── Utility: Least Common Multiple ───
function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

// ─── Utility: Simplify Fraction ───
function simplifyFraction(num: number, den: number): [number, number] {
  if (den === 0) throw new Error('Denominator cannot be zero');
  const sign = den < 0 ? -1 : 1;
  num *= sign;
  den *= sign;
  const d = gcd(Math.abs(num), den);
  return [num / d, den / d];
}

// ─── Utility: Format Fraction ───
function formatFraction(num: number, den: number): string {
  const [sn, sd] = simplifyFraction(num, den);
  if (sd === 1) return `${sn}`;
  return `${sn}/${sd}`;
}

// ─── Utility: Shuffle Array ───
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ─── Utility: Generate Distinct Wrong Fraction Answers ───
function generateWrongFractionAnswers(
  correctNum: number,
  correctDen: number,
  count: number = 3
): string[] {
  const correctStr = formatFraction(correctNum, correctDen);
  const wrongs: Set<string> = new Set();
  const attempts = [
    // Common mistakes students make
    () => formatFraction(correctNum + 1, correctDen),
    () => formatFraction(correctNum - 1, correctDen),
    () => formatFraction(correctNum, correctDen + 1),
    () => formatFraction(correctNum, correctDen - 1),
    () => formatFraction(correctNum + correctDen, correctDen),
    () => formatFraction(correctNum * 2, correctDen),
    () => formatFraction(correctNum, correctDen * 2),
    // Random nearby fractions
    () => formatFraction(correctNum + Math.floor(Math.random() * 3) + 1, correctDen),
    () => formatFraction(correctNum - Math.floor(Math.random() * 3) - 1, correctDen + 1),
    () => formatFraction(correctNum + 2, correctDen + 2),
  ];

  for (const attempt of attempts) {
    if (wrongs.size >= count) break;
    try {
      const val = attempt();
      if (val !== correctStr && !val.includes('0/') && !wrongs.has(val)) {
        // Avoid negative denominators or zero results for young students
        const parts = val.split('/');
        if (parts.length === 1 || (parseInt(parts[1]) > 0)) {
          wrongs.add(val);
        }
      }
    } catch {
      // Skip invalid fractions
    }
  }

  // Fill remaining with simple variants
  let offset = 2;
  while (wrongs.size < count) {
    const w = formatFraction(correctNum + offset, correctDen);
    if (w !== correctStr && !wrongs.has(w)) wrongs.add(w);
    offset++;
    if (offset > 20) break;
  }

  return Array.from(wrongs).slice(0, count);
}

// ═══════════════════════════════════════════
// FRACTION QUESTION GENERATORS
// ═══════════════════════════════════════════

function generateFractionAddition(difficulty: Difficulty): StoredQuestion {
  let num1: number, den1: number, num2: number, den2: number;

  switch (difficulty) {
    case 'easy':
      // Same denominator
      den1 = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
      den2 = den1;
      num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
      num2 = Math.floor(Math.random() * (den1 - 1)) + 1;
      break;
    case 'medium':
      // One denominator is a multiple of the other
      den1 = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      den2 = den1 * [2, 3][Math.floor(Math.random() * 2)];
      num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
      num2 = Math.floor(Math.random() * (den2 - 1)) + 1;
      break;
    case 'hard':
    default:
      // Unlike denominators
      den1 = [3, 4, 5, 6, 7, 8][Math.floor(Math.random() * 6)];
      den2 = [3, 4, 5, 6, 7, 8][Math.floor(Math.random() * 6)];
      if (den2 === den1) den2 = den1 + 1;
      num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
      num2 = Math.floor(Math.random() * (den2 - 1)) + 1;
      break;
  }

  // Calculate answer using integer arithmetic
  const commonDen = lcm(den1, den2);
  const resultNum = num1 * (commonDen / den1) + num2 * (commonDen / den2);
  const resultDen = commonDen;
  const [simpNum, simpDen] = simplifyFraction(resultNum, resultDen);

  const correctAnswer = formatFraction(simpNum, simpDen);
  const wrongAnswers = generateWrongFractionAnswers(simpNum, simpDen);

  const allOptions = shuffleArray([correctAnswer, ...wrongAnswers]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  // Build explanation
  const steps: string[] = [];
  if (den1 !== den2) {
    steps.push(`Find the common denominator: LCD of ${den1} and ${den2} = ${commonDen}`);
    steps.push(`Convert: ${num1}/${den1} = ${num1 * (commonDen / den1)}/${commonDen} and ${num2}/${den2} = ${num2 * (commonDen / den2)}/${commonDen}`);
  }
  steps.push(`Add the numerators: ${num1 * (commonDen / den1)} + ${num2 * (commonDen / den2)} = ${resultNum}`);
  if (resultNum !== simpNum || resultDen !== simpDen) {
    steps.push(`Simplify: ${resultNum}/${resultDen} = ${correctAnswer}`);
  }

  return {
    id: crypto.randomUUID(),
    topicId: 'g5-fractions',
    difficulty,
    question: `What is ${num1}/${den1} + ${num2}/${den2}?`,
    options: allOptions,
    correctIndex,
    explanation: steps.join('\n'),
    validationStatus: 'math_validated',
  };
}

function generateFractionSubtraction(difficulty: Difficulty): StoredQuestion {
  let num1: number, den1: number, num2: number, den2: number;

  switch (difficulty) {
    case 'easy':
      den1 = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
      den2 = den1;
      num1 = Math.floor(Math.random() * (den1 - 1)) + 2;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      break;
    case 'medium':
      den1 = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      den2 = den1 * 2;
      num1 = Math.floor(Math.random() * (den1 - 1)) + 2;
      num2 = Math.floor(Math.random() * (den2 - 1)) + 1;
      break;
    case 'hard':
    default:
      den1 = [3, 4, 5, 6, 7, 8][Math.floor(Math.random() * 6)];
      den2 = [3, 4, 5, 6, 7, 8][Math.floor(Math.random() * 6)];
      if (den2 === den1) den2 = den1 + 1;
      num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
      num2 = Math.floor(Math.random() * (den2 - 1)) + 1;
      break;
  }

  // Ensure positive result
  const commonDen = lcm(den1, den2);
  let resultNum = num1 * (commonDen / den1) - num2 * (commonDen / den2);
  
  // If result would be negative or zero, swap
  if (resultNum <= 0) {
    [num1, den1, num2, den2] = [num2, den2, num1, den1];
    resultNum = num1 * (commonDen / den1) - num2 * (commonDen / den2);
  }
  if (resultNum <= 0) {
    // Fallback: just make it addition
    return generateFractionAddition(difficulty);
  }

  const [simpNum, simpDen] = simplifyFraction(resultNum, commonDen);
  const correctAnswer = formatFraction(simpNum, simpDen);
  const wrongAnswers = generateWrongFractionAnswers(simpNum, simpDen);

  const allOptions = shuffleArray([correctAnswer, ...wrongAnswers]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  const steps: string[] = [];
  if (den1 !== den2) {
    steps.push(`Find the common denominator: LCD of ${den1} and ${den2} = ${commonDen}`);
    steps.push(`Convert: ${num1}/${den1} = ${num1 * (commonDen / den1)}/${commonDen} and ${num2}/${den2} = ${num2 * (commonDen / den2)}/${commonDen}`);
  }
  steps.push(`Subtract the numerators: ${num1 * (commonDen / den1)} - ${num2 * (commonDen / den2)} = ${resultNum}`);
  if (resultNum !== simpNum || commonDen !== simpDen) {
    steps.push(`Simplify: ${resultNum}/${commonDen} = ${correctAnswer}`);
  }

  return {
    id: crypto.randomUUID(),
    topicId: 'g5-fractions',
    difficulty,
    question: `What is ${num1}/${den1} − ${num2}/${den2}?`,
    options: allOptions,
    correctIndex,
    explanation: steps.join('\n'),
    validationStatus: 'math_validated',
  };
}

// ═══════════════════════════════════════════
// DECIMAL QUESTION GENERATORS
// ═══════════════════════════════════════════

function generateDecimalAddition(difficulty: Difficulty): StoredQuestion {
  let a: number, b: number, decimalPlaces: number;

  switch (difficulty) {
    case 'easy':
      decimalPlaces = 1;
      a = Math.floor(Math.random() * 90 + 10) / 10; // 1.0 - 9.9
      b = Math.floor(Math.random() * 90 + 10) / 10;
      break;
    case 'medium':
      decimalPlaces = 2;
      a = Math.floor(Math.random() * 900 + 100) / 100; // 1.00 - 9.99
      b = Math.floor(Math.random() * 900 + 100) / 100;
      break;
    case 'hard':
    default:
      decimalPlaces = 2;
      a = Math.floor(Math.random() * 9000 + 1000) / 100; // 10.00 - 99.99
      b = Math.floor(Math.random() * 9000 + 1000) / 100;
      break;
  }

  // Use integer arithmetic to avoid floating-point issues
  const factor = Math.pow(10, decimalPlaces);
  const aInt = Math.round(a * factor);
  const bInt = Math.round(b * factor);
  const resultInt = aInt + bInt;
  const result = resultInt / factor;

  const correctAnswer = result.toFixed(decimalPlaces);
  const wrongs = [
    (result + 0.1).toFixed(decimalPlaces),
    (result - 0.1).toFixed(decimalPlaces),
    ((aInt + bInt + Math.floor(Math.random() * 5 + 1)) / factor).toFixed(decimalPlaces),
  ];

  // Ensure distinct
  const wrongSet = new Set(wrongs.filter(w => w !== correctAnswer));
  let offset = 1;
  while (wrongSet.size < 3) {
    wrongSet.add(((resultInt + offset * 10) / factor).toFixed(decimalPlaces));
    offset++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g5-decimals',
    difficulty,
    question: `What is ${a.toFixed(decimalPlaces)} + ${b.toFixed(decimalPlaces)}?`,
    options: allOptions,
    correctIndex,
    explanation: `Line up the decimal points and add:\n${a.toFixed(decimalPlaces)} + ${b.toFixed(decimalPlaces)} = ${correctAnswer}`,
    validationStatus: 'math_validated',
  };
}

function generateDecimalSubtraction(difficulty: Difficulty): StoredQuestion {
  let a: number, b: number, decimalPlaces: number;

  switch (difficulty) {
    case 'easy':
      decimalPlaces = 1;
      a = Math.floor(Math.random() * 80 + 20) / 10;
      b = Math.floor(Math.random() * 15 + 5) / 10;
      break;
    case 'medium':
      decimalPlaces = 2;
      a = Math.floor(Math.random() * 800 + 200) / 100;
      b = Math.floor(Math.random() * 150 + 50) / 100;
      break;
    case 'hard':
    default:
      decimalPlaces = 2;
      a = Math.floor(Math.random() * 8000 + 2000) / 100;
      b = Math.floor(Math.random() * 1500 + 500) / 100;
      break;
  }

  if (b > a) [a, b] = [b, a]; // ensure positive result

  const factor = Math.pow(10, decimalPlaces);
  const aInt = Math.round(a * factor);
  const bInt = Math.round(b * factor);
  const resultInt = aInt - bInt;
  const result = resultInt / factor;

  const correctAnswer = result.toFixed(decimalPlaces);
  const wrongSet = new Set<string>();
  wrongSet.add((result + 0.1).toFixed(decimalPlaces));
  wrongSet.add(Math.abs(result - 0.1).toFixed(decimalPlaces));
  wrongSet.add(((resultInt + 5) / factor).toFixed(decimalPlaces));
  wrongSet.delete(correctAnswer);

  let offset = 2;
  while (wrongSet.size < 3) {
    wrongSet.add(((resultInt + offset * 3) / factor).toFixed(decimalPlaces));
    offset++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g5-decimals',
    difficulty,
    question: `What is ${a.toFixed(decimalPlaces)} − ${b.toFixed(decimalPlaces)}?`,
    options: allOptions,
    correctIndex,
    explanation: `Line up the decimal points and subtract:\n${a.toFixed(decimalPlaces)} − ${b.toFixed(decimalPlaces)} = ${correctAnswer}`,
    validationStatus: 'math_validated',
  };
}

function generateDecimalMultiplication(difficulty: Difficulty): StoredQuestion {
  let a: number, b: number;

  switch (difficulty) {
    case 'easy':
      a = Math.floor(Math.random() * 9 + 1); // whole number
      b = Math.floor(Math.random() * 90 + 10) / 10; // 1 decimal
      break;
    case 'medium':
      a = Math.floor(Math.random() * 90 + 10) / 10;
      b = Math.floor(Math.random() * 90 + 10) / 10;
      break;
    case 'hard':
    default:
      a = Math.floor(Math.random() * 900 + 100) / 100;
      b = Math.floor(Math.random() * 90 + 10) / 10;
      break;
  }

  // Integer arithmetic
  const aStr = a.toString();
  const bStr = b.toString();
  const aDecimals = aStr.includes('.') ? aStr.split('.')[1].length : 0;
  const bDecimals = bStr.includes('.') ? bStr.split('.')[1].length : 0;
  const totalDecimals = aDecimals + bDecimals;
  const factor = Math.pow(10, totalDecimals);
  const aInt = Math.round(a * Math.pow(10, aDecimals));
  const bInt = Math.round(b * Math.pow(10, bDecimals));
  const resultInt = aInt * bInt;
  const result = resultInt / factor;

  const decPlaces = totalDecimals > 0 ? Math.min(totalDecimals, 2) : 0;
  const correctAnswer = result.toFixed(decPlaces);
  const wrongSet = new Set<string>();
  
  // Common mistake: wrong decimal placement
  const w1 = (result * 10).toFixed(decPlaces);
  if (w1 !== correctAnswer) wrongSet.add(w1);
  const w2 = (result / 10).toFixed(Math.min(totalDecimals + 1, 3));
  if (w2 !== correctAnswer) wrongSet.add(w2);

  let offset = 1;
  while (wrongSet.size < 3) {
    const candidate = ((resultInt + offset * 7) / factor).toFixed(decPlaces);
    if (candidate !== correctAnswer) {
      wrongSet.add(candidate);
    }
    offset++;
  }

  const displayA = aDecimals > 0 ? a.toFixed(aDecimals) : a.toString();
  const displayB = bDecimals > 0 ? b.toFixed(bDecimals) : b.toString();

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g5-decimals',
    difficulty,
    question: `What is ${displayA} × ${displayB}?`,
    options: allOptions,
    correctIndex,
    explanation: `Multiply ${displayA} × ${displayB}:\nCount total decimal places (${totalDecimals}), then multiply as whole numbers and place the decimal: ${correctAnswer}`,
    validationStatus: 'math_validated',
  };
}

// ═══════════════════════════════════════════
// MULTIPLICATION QUESTION GENERATORS
// ═══════════════════════════════════════════

function generateMultiplication(difficulty: Difficulty): StoredQuestion {
  let a: number, b: number;

  switch (difficulty) {
    case 'easy':
      a = Math.floor(Math.random() * 9) + 2; // 2-10
      b = Math.floor(Math.random() * 90) + 10; // 10-99
      break;
    case 'medium':
      a = Math.floor(Math.random() * 90) + 10; // 10-99
      b = Math.floor(Math.random() * 90) + 10; // 10-99
      break;
    case 'hard':
    default:
      a = Math.floor(Math.random() * 900) + 100; // 100-999
      b = Math.floor(Math.random() * 90) + 10; // 10-99
      break;
  }

  const result = a * b;
  const correctAnswer = result.toString();

  const wrongSet = new Set<string>();
  wrongSet.add((result + a).toString());
  wrongSet.add((result - b).toString());
  wrongSet.add((result + Math.floor(Math.random() * 50) + 1).toString());
  wrongSet.delete(correctAnswer);

  let offset = 1;
  while (wrongSet.size < 3) {
    wrongSet.add((result + offset * 11).toString());
    offset++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g5-multiplication',
    difficulty,
    question: `What is ${a} × ${b}?`,
    options: allOptions,
    correctIndex,
    explanation: `${a} × ${b} = ${result}\nBreak it down: ${a} × ${Math.floor(b / 10) * 10} = ${a * Math.floor(b / 10) * 10}, then ${a} × ${b % 10} = ${a * (b % 10)}, total = ${result}`,
    validationStatus: 'math_validated',
  };
}

// ═══════════════════════════════════════════
// DIVISION QUESTION GENERATORS
// ═══════════════════════════════════════════

function generateDivision(difficulty: Difficulty): StoredQuestion {
  let divisor: number, quotient: number, remainder: number;

  switch (difficulty) {
    case 'easy':
      divisor = Math.floor(Math.random() * 8) + 2; // 2-9
      quotient = Math.floor(Math.random() * 9) + 2; // 2-10
      remainder = 0; // No remainder for easy
      break;
    case 'medium':
      divisor = Math.floor(Math.random() * 8) + 2; // 2-9
      quotient = Math.floor(Math.random() * 20) + 5; // 5-24
      remainder = Math.floor(Math.random() * (divisor - 1)) + 1;
      break;
    case 'hard':
    default:
      divisor = Math.floor(Math.random() * 10) + 11; // 11-20
      quotient = Math.floor(Math.random() * 30) + 10; // 10-39
      remainder = Math.floor(Math.random() * (divisor - 1)) + 1;
      break;
  }

  const dividend = divisor * quotient + remainder;

  let correctAnswer: string;
  let questionText: string;
  if (remainder === 0) {
    correctAnswer = quotient.toString();
    questionText = `What is ${dividend} ÷ ${divisor}?`;
  } else {
    correctAnswer = `${quotient} R${remainder}`;
    questionText = `What is ${dividend} ÷ ${divisor}? (Include the remainder)`;
  }

  const wrongSet = new Set<string>();
  if (remainder === 0) {
    wrongSet.add((quotient + 1).toString());
    wrongSet.add((quotient - 1).toString());
    wrongSet.add((quotient + divisor).toString());
  } else {
    wrongSet.add(`${quotient + 1} R${remainder}`);
    wrongSet.add(`${quotient} R${remainder + 1 < divisor ? remainder + 1 : 0}`);
    wrongSet.add(`${quotient - 1} R${remainder}`);
  }
  wrongSet.delete(correctAnswer);

  let offset = 2;
  while (wrongSet.size < 3) {
    if (remainder === 0) {
      wrongSet.add((quotient + offset).toString());
    } else {
      wrongSet.add(`${quotient + offset} R${Math.max(0, remainder - 1)}`);
    }
    offset++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  const explanation = remainder === 0
    ? `${dividend} ÷ ${divisor} = ${quotient} because ${divisor} × ${quotient} = ${dividend}`
    : `${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}\n${divisor} × ${quotient} = ${divisor * quotient}, and ${dividend} - ${divisor * quotient} = ${remainder}`;

  return {
    id: crypto.randomUUID(),
    topicId: 'g5-division',
    difficulty,
    question: questionText,
    options: allOptions,
    correctIndex,
    explanation,
    validationStatus: 'math_validated',
  };
}

// ═══════════════════════════════════════════
// RATIO QUESTION GENERATORS
// ═══════════════════════════════════════════

function generateRatioQuestion(difficulty: Difficulty): StoredQuestion {
  switch (difficulty) {
    case 'easy':
      return generateSimpleRatio();
    case 'medium':
      return generateUnitRate();
    case 'hard':
    default:
      return generateRatioProblem();
  }
}

function generateSimpleRatio(): StoredQuestion {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  const d = gcd(a, b);
  const simplifiedA = a / d;
  const simplifiedB = b / d;

  const items = [
    ['red marbles', 'blue marbles'],
    ['boys', 'girls'],
    ['apples', 'oranges'],
    ['cats', 'dogs'],
    ['pencils', 'pens'],
  ];
  const [item1, item2] = items[Math.floor(Math.random() * items.length)];

  const correctAnswer = `${simplifiedA}:${simplifiedB}`;
  const wrongSet = new Set<string>();
  wrongSet.add(`${simplifiedB}:${simplifiedA}`);
  wrongSet.add(`${a}:${a}`);
  wrongSet.add(`${simplifiedA + 1}:${simplifiedB}`);
  wrongSet.delete(correctAnswer);

  let offset = 1;
  while (wrongSet.size < 3) {
    wrongSet.add(`${simplifiedA}:${simplifiedB + offset}`);
    offset++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g6-ratios',
    difficulty: 'easy',
    question: `There are ${a} ${item1} and ${b} ${item2}. What is the simplified ratio of ${item1} to ${item2}?`,
    options: allOptions,
    correctIndex,
    explanation: `The ratio is ${a}:${b}. Divide both by the GCD (${d}): ${a}÷${d} : ${b}÷${d} = ${correctAnswer}`,
    validationStatus: 'math_validated',
  };
}

function generateUnitRate(): StoredQuestion {
  const quantity = Math.floor(Math.random() * 8) + 2; // 2-9 items
  const pricePerItem = Math.floor(Math.random() * 5) + 1; // $1-$5
  const totalPrice = quantity * pricePerItem;

  const items = ['books', 'notebooks', 'pens', 'erasers', 'folders'];
  const item = items[Math.floor(Math.random() * items.length)];

  const correctAnswer = `$${pricePerItem}`;
  const wrongSet = new Set<string>();
  wrongSet.add(`$${pricePerItem + 1}`);
  wrongSet.add(`$${Math.max(1, pricePerItem - 1)}`);
  wrongSet.add(`$${totalPrice}`);
  wrongSet.delete(correctAnswer);

  let offset = 2;
  while (wrongSet.size < 3) {
    wrongSet.add(`$${pricePerItem + offset}`);
    offset++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g6-ratios',
    difficulty: 'medium',
    question: `${quantity} ${item} cost $${totalPrice}. What is the unit price (cost per ${item.slice(0, -1)})?`,
    options: allOptions,
    correctIndex,
    explanation: `Unit price = Total cost ÷ Number of items\n$${totalPrice} ÷ ${quantity} = ${correctAnswer} per ${item.slice(0, -1)}`,
    validationStatus: 'math_validated',
  };
}

function generateRatioProblem(): StoredQuestion {
  const ratio1 = Math.floor(Math.random() * 4) + 2;
  const ratio2 = Math.floor(Math.random() * 4) + 2;
  const multiplier = Math.floor(Math.random() * 5) + 3;
  const total = (ratio1 + ratio2) * multiplier;
  const amount1 = ratio1 * multiplier;
  const amount2 = ratio2 * multiplier;

  const contexts = [
    { thing: 'fruit', type1: 'apples', type2: 'bananas' },
    { thing: 'candy', type1: 'chocolate bars', type2: 'lollipops' },
    { thing: 'beads', type1: 'red beads', type2: 'blue beads' },
  ];
  const ctx = contexts[Math.floor(Math.random() * contexts.length)];

  const correctAnswer = amount1.toString();
  const wrongSet = new Set<string>();
  wrongSet.add(amount2.toString());
  wrongSet.add(total.toString());
  wrongSet.add((amount1 + ratio1).toString());
  wrongSet.delete(correctAnswer);

  let offset = 1;
  while (wrongSet.size < 3) {
    wrongSet.add((amount1 + offset * 2).toString());
    offset++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g6-ratios',
    difficulty: 'hard',
    question: `A bag has ${total} ${ctx.thing} split between ${ctx.type1} and ${ctx.type2} in a ratio of ${ratio1}:${ratio2}. How many ${ctx.type1} are there?`,
    options: allOptions,
    correctIndex,
    explanation: `Total parts = ${ratio1} + ${ratio2} = ${ratio1 + ratio2}\nEach part = ${total} ÷ ${ratio1 + ratio2} = ${multiplier}\n${ctx.type1} = ${ratio1} × ${multiplier} = ${amount1}`,
    validationStatus: 'math_validated',
  };
}

// ═══════════════════════════════════════════
// GRADE 6: FRACTIONS & DECIMALS (multiply/divide)
// ═══════════════════════════════════════════

function generateFractionMultiplication(difficulty: Difficulty): StoredQuestion {
  let num1: number, den1: number, num2: number, den2: number;

  switch (difficulty) {
    case 'easy':
      num1 = Math.floor(Math.random() * 3) + 1;
      den1 = Math.floor(Math.random() * 4) + 2;
      num2 = Math.floor(Math.random() * 4) + 2; // whole number as n/1
      den2 = 1;
      break;
    case 'medium':
      num1 = Math.floor(Math.random() * 3) + 1;
      den1 = Math.floor(Math.random() * 5) + 2;
      num2 = Math.floor(Math.random() * 3) + 1;
      den2 = Math.floor(Math.random() * 5) + 2;
      break;
    case 'hard':
    default:
      num1 = Math.floor(Math.random() * 5) + 2;
      den1 = Math.floor(Math.random() * 6) + 3;
      num2 = Math.floor(Math.random() * 5) + 2;
      den2 = Math.floor(Math.random() * 6) + 3;
      break;
  }

  const resultNum = num1 * num2;
  const resultDen = den1 * den2;
  const [simpNum, simpDen] = simplifyFraction(resultNum, resultDen);

  const correctAnswer = formatFraction(simpNum, simpDen);
  const wrongAnswers = generateWrongFractionAnswers(simpNum, simpDen);

  const allOptions = shuffleArray([correctAnswer, ...wrongAnswers]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  const frac1Display = den1 === 1 ? `${num1}` : `${num1}/${den1}`;
  const frac2Display = den2 === 1 ? `${num2}` : `${num2}/${den2}`;

  return {
    id: crypto.randomUUID(),
    topicId: 'g6-fractions-decimals',
    difficulty,
    question: `What is ${frac1Display} × ${frac2Display}?`,
    options: allOptions,
    correctIndex,
    explanation: `Multiply numerators: ${num1} × ${num2} = ${resultNum}\nMultiply denominators: ${den1} × ${den2} = ${resultDen}\nResult: ${resultNum}/${resultDen}${resultNum !== simpNum || resultDen !== simpDen ? ` = ${correctAnswer}` : ''}`,
    validationStatus: 'math_validated',
  };
}

// ═══════════════════════════════════════════
// GRADE 6: INTEGERS
// ═══════════════════════════════════════════

function generateIntegerQuestion(difficulty: Difficulty): StoredQuestion {
  switch (difficulty) {
    case 'easy':
      return generateIntegerOrdering();
    case 'medium':
      return generateAbsoluteValue();
    case 'hard':
    default:
      return generateIntegerComparison();
  }
}

function generateIntegerOrdering(): StoredQuestion {
  const nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * 21) - 10);
  // Ensure distinct
  const unique = [...new Set(nums)];
  while (unique.length < 4) unique.push(unique.length * 2 - 7);
  
  const sorted = [...unique].sort((a, b) => a - b);
  const correctAnswer = sorted.join(', ');

  const wrongOptions = [
    [...unique].sort((a, b) => b - a).join(', '),
    [...unique].sort((a, b) => Math.abs(a) - Math.abs(b)).join(', '),
    shuffleArray([...unique]).join(', '),
  ];

  const wrongSet = new Set(wrongOptions.filter(w => w !== correctAnswer));
  let idx = 0;
  while (wrongSet.size < 3) {
    const variant = [...sorted];
    variant[idx] = variant[idx] + 1;
    wrongSet.add(variant.join(', '));
    idx++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g6-integers',
    difficulty: 'easy',
    question: `Order these integers from least to greatest: ${unique.join(', ')}`,
    options: allOptions,
    correctIndex,
    explanation: `On the number line, numbers increase from left to right.\nNegative numbers are always less than positive numbers.\nOrder: ${correctAnswer}`,
    validationStatus: 'math_validated',
  };
}

function generateAbsoluteValue(): StoredQuestion {
  const num = Math.floor(Math.random() * 19) - 9; // -9 to 9
  const absVal = Math.abs(num);

  const correctAnswer = absVal.toString();
  const wrongSet = new Set<string>();
  wrongSet.add((-absVal).toString());
  wrongSet.add((absVal + 1).toString());
  wrongSet.add((absVal > 0 ? absVal - 1 : absVal + 2).toString());
  wrongSet.delete(correctAnswer);

  let offset = 2;
  while (wrongSet.size < 3) {
    wrongSet.add((absVal + offset).toString());
    offset++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g6-integers',
    difficulty: 'medium',
    question: `What is |${num}| (the absolute value of ${num})?`,
    options: allOptions,
    correctIndex,
    explanation: `The absolute value of a number is its distance from 0 on the number line.\n|${num}| = ${absVal} because ${num} is ${absVal} units from 0.`,
    validationStatus: 'math_validated',
  };
}

function generateIntegerComparison(): StoredQuestion {
  const a = Math.floor(Math.random() * 21) - 10;
  let b = Math.floor(Math.random() * 21) - 10;
  if (b === a) b = a + 1;

  const correctAnswer = a > b ? `${a} > ${b}` : a < b ? `${a} < ${b}` : `${a} = ${b}`;
  
  const wrongSet = new Set<string>();
  wrongSet.add(a > b ? `${a} < ${b}` : `${a} > ${b}`);
  wrongSet.add(`${a} = ${b}`);
  wrongSet.add(`${b} > ${a + 1}`);
  wrongSet.delete(correctAnswer);

  let offset = 1;
  while (wrongSet.size < 3) {
    wrongSet.add(`${a + offset} < ${b}`);
    offset++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g6-integers',
    difficulty: 'hard',
    question: `Which comparison is correct for the integers ${a} and ${b}?`,
    options: allOptions,
    correctIndex,
    explanation: `On the number line, ${Math.min(a, b)} is to the left of ${Math.max(a, b)}.\nTherefore ${correctAnswer}`,
    validationStatus: 'math_validated',
  };
}

// ═══════════════════════════════════════════
// GRADE 6: EXPRESSIONS & EQUATIONS
// ═══════════════════════════════════════════

function generateExpressionQuestion(difficulty: Difficulty): StoredQuestion {
  switch (difficulty) {
    case 'easy':
      return generateEvaluateExpression();
    case 'medium':
      return generateSolveEquation();
    case 'hard':
    default:
      return generateWriteExpression();
  }
}

function generateEvaluateExpression(): StoredQuestion {
  const x = Math.floor(Math.random() * 8) + 2;
  const a = Math.floor(Math.random() * 5) + 2;
  const b = Math.floor(Math.random() * 10) + 1;
  const result = a * x + b;

  const correctAnswer = result.toString();
  const wrongSet = new Set<string>();
  wrongSet.add((a + x + b).toString()); // Common mistake: adding instead of multiplying
  wrongSet.add((a * x - b).toString());
  wrongSet.add((result + a).toString());
  wrongSet.delete(correctAnswer);

  let offset = 1;
  while (wrongSet.size < 3) {
    wrongSet.add((result + offset * 3).toString());
    offset++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g6-expressions',
    difficulty: 'easy',
    question: `Evaluate ${a}x + ${b} when x = ${x}`,
    options: allOptions,
    correctIndex,
    explanation: `Substitute x = ${x}:\n${a}(${x}) + ${b} = ${a * x} + ${b} = ${result}`,
    validationStatus: 'math_validated',
  };
}

function generateSolveEquation(): StoredQuestion {
  const answer = Math.floor(Math.random() * 12) + 1;
  const a = Math.floor(Math.random() * 5) + 2;
  const result = a * answer;

  const correctAnswer = answer.toString();
  const wrongSet = new Set<string>();
  wrongSet.add((answer + 1).toString());
  wrongSet.add((answer - 1 > 0 ? answer - 1 : answer + 2).toString());
  wrongSet.add(result.toString());
  wrongSet.delete(correctAnswer);

  let offset = 2;
  while (wrongSet.size < 3) {
    wrongSet.add((answer + offset).toString());
    offset++;
  }

  const allOptions = shuffleArray([correctAnswer, ...Array.from(wrongSet).slice(0, 3)]);
  const correctIndex = allOptions.indexOf(correctAnswer);

  return {
    id: crypto.randomUUID(),
    topicId: 'g6-expressions',
    difficulty: 'medium',
    question: `Solve for x: ${a}x = ${result}`,
    options: allOptions,
    correctIndex,
    explanation: `Divide both sides by ${a}:\nx = ${result} ÷ ${a} = ${answer}`,
    validationStatus: 'math_validated',
  };
}

function generateWriteExpression(): StoredQuestion {
  const n = Math.floor(Math.random() * 8) + 3;
  const operations = [
    {
      text: `${n} more than a number x`,
      correct: `x + ${n}`,
      wrongs: [`${n}x`, `x - ${n}`, `${n} - x`],
    },
    {
      text: `${n} times a number x`,
      correct: `${n}x`,
      wrongs: [`x + ${n}`, `x/${n}`, `x - ${n}`],
    },
    {
      text: `a number x divided by ${n}`,
      correct: `x/${n}`,
      wrongs: [`${n}x`, `${n}/x`, `x - ${n}`],
    },
    {
      text: `${n} less than a number x`,
      correct: `x - ${n}`,
      wrongs: [`${n} - x`, `x + ${n}`, `${n}x`],
    },
  ];

  const op = operations[Math.floor(Math.random() * operations.length)];
  const allOptions = shuffleArray([op.correct, ...op.wrongs]);
  const correctIndex = allOptions.indexOf(op.correct);

  return {
    id: crypto.randomUUID(),
    topicId: 'g6-expressions',
    difficulty: 'hard',
    question: `Which expression represents "${op.text}"?`,
    options: allOptions,
    correctIndex,
    explanation: `"${op.text}" translates to ${op.correct}\nThe key word tells us which operation to use.`,
    validationStatus: 'math_validated',
  };
}

// ═══════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════

/** Map of topic ID to generator functions */
const generators: Record<string, (difficulty: Difficulty) => StoredQuestion> = {
  'g5-fractions': (d) => Math.random() > 0.5 ? generateFractionAddition(d) : generateFractionSubtraction(d),
  'g5-decimals': (d) => {
    const r = Math.random();
    if (r < 0.33) return generateDecimalAddition(d);
    if (r < 0.66) return generateDecimalSubtraction(d);
    return generateDecimalMultiplication(d);
  },
  'g5-multiplication': generateMultiplication,
  'g5-division': generateDivision,
  'g6-ratios': generateRatioQuestion,
  'g6-fractions-decimals': (d) => generateFractionMultiplication(d),
  'g6-integers': generateIntegerQuestion,
  'g6-expressions': generateExpressionQuestion,
};

/**
 * Generate a single math question for a topic and difficulty.
 * Uses pure arithmetic — no AI needed.
 */
export function generateQuestion(topicId: string, difficulty: Difficulty): StoredQuestion | null {
  const generator = generators[topicId];
  if (!generator) return null;
  return generator(difficulty);
}

/**
 * Generate a batch of questions for a quiz.
 */
export function generateQuestionBatch(
  topicId: string,
  count: number = 15,
  difficulties: Difficulty[] = ['easy', 'medium', 'hard']
): StoredQuestion[] {
  const questions: StoredQuestion[] = [];
  const perDifficulty = Math.ceil(count / difficulties.length);

  for (const difficulty of difficulties) {
    for (let i = 0; i < perDifficulty && questions.length < count; i++) {
      const q = generateQuestion(topicId, difficulty);
      if (q) {
        // Ensure no duplicate question text
        const isDuplicate = questions.some(existing => existing.question === q.question);
        if (!isDuplicate) {
          questions.push(q);
        } else {
          // Try once more
          const retry = generateQuestion(topicId, difficulty);
          if (retry && !questions.some(existing => existing.question === retry.question)) {
            questions.push(retry);
          }
        }
      }
    }
  }

  return questions;
}
