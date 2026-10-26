import React, { useState, useEffect } from 'react';
import { ClientQuestion, AnswerResult, QuizResults, Topic, Difficulty } from '../types';
import { submitAnswer, getCurrentQuestion, fetchResults } from '../api';
import { Scratchpad } from './Scratchpad';
import { sounds } from '../utils/audio';
import { ArrowRight, Check, X, AlertCircle, PenTool, Lightbulb } from 'lucide-react';

interface QuizEngineProps {
  sessionId: string;
  topic: Topic;
  initialQuestion: ClientQuestion;
  onFinish: (results: QuizResults) => void;
  onExit: () => void;
}

const getTopicHint = (topicId: string): string => {
  if (topicId.includes('fractions')) {
    return 'Find a common denominator first, rewrite each fraction, then add or subtract only the numerators.';
  }
  if (topicId.includes('decimals')) {
    return 'Line up the decimal points strictly vertically to ensure you add or subtract matching place values.';
  }
  if (topicId.includes('multiplication')) {
    return 'Break into place values or multiply digit by digit, remembering to place a zero for the tens place.';
  }
  if (topicId.includes('division')) {
    return 'Check your answer: Quotient × Divisor + Remainder must equal the dividend.';
  }
  if (topicId.includes('ratios')) {
    return 'Ratios compare two quantities. Multiply or divide both terms by the same non-zero number to find equivalent ratios.';
  }
  if (topicId.includes('integers')) {
    return 'On a horizontal number line, negative numbers lie to the left of zero and positive numbers lie to the right.';
  }
  if (topicId.includes('expressions')) {
    return 'Substitute the given value for the variable and follow the standard order of operations.';
  }
  return 'Read the problem statement carefully and identify what the question asks you to calculate.';
};

export const QuizEngine: React.FC<QuizEngineProps> = ({
  sessionId,
  topic,
  initialQuestion,
  onFinish,
  onExit,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<ClientQuestion>(initialQuestion);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(initialQuestion.difficulty);
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const getDifficultyLabel = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 'Apprentice';
      case 'medium':
        return 'Adventurer';
      case 'hard':
        return 'Master';
    }
  };

  const handleSelectOption = async (index: number) => {
    if (selectedIndex !== null || isSubmitting || answerResult) return;

    sounds.playClick();
    setSelectedIndex(index);
    setIsSubmitting(true);
    setErrorMsg(null);
    setLevelUpMessage(null);

    try {
      const result = await submitAnswer(sessionId, index);
      setAnswerResult(result);
      setScore(result.totalScore);

      const diffRank: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };
      if (diffRank[result.currentDifficulty] > diffRank[currentDifficulty]) {
        sounds.playLevelUp();
        setLevelUpMessage(`Great problem solving! Advanced to ${getDifficultyLabel(result.currentDifficulty)} difficulty level.`);
      } else if (result.correct) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        if (nextStreak >= 3) {
          sounds.playStreak();
        } else {
          sounds.playCorrect();
        }
      } else {
        setStreak(0);
        sounds.playWrong();
      }

      setCurrentDifficulty(result.currentDifficulty);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error submitting answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    sounds.playClick();
    setErrorMsg(null);
    setLevelUpMessage(null);
    setShowHint(false);

    if (answerResult && answerResult.questionsRemaining <= 0) {
      setIsFinishing(true);
      try {
        const finalResults = await fetchResults(sessionId);
        sounds.playVictory();
        onFinish(finalResults);
      } catch (err: any) {
        console.error(err);
        setErrorMsg('Could not fetch quiz results');
      } finally {
        setIsFinishing(false);
      }
      return;
    }

    try {
      const nextQ = await getCurrentQuestion(sessionId);
      setCurrentQuestion(nextQ);
      setSelectedIndex(null);
      setAnswerResult(null);
    } catch (err: any) {
      if (err.message === 'QUIZ_COMPLETED') {
        setIsFinishing(true);
        const finalResults = await fetchResults(sessionId);
        sounds.playVictory();
        onFinish(finalResults);
      } else {
        setErrorMsg('Error loading next question');
      }
    }
  };

  // Keyboard accessibility for students
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (answerResult) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      const keyMap: Record<string, number> = {
        '1': 0, 'a': 0, 'A': 0,
        '2': 1, 'b': 1, 'B': 1,
        '3': 2, 'c': 2, 'C': 2,
        '4': 3, 'd': 3, 'D': 3,
      };

      if (e.key in keyMap) {
        e.preventDefault();
        handleSelectOption(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answerResult, selectedIndex, isSubmitting]);

  const progressPercent = ((currentQuestion.questionNumber - 1) / currentQuestion.totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-stone-900 font-sans-display">
                {topic.title}
              </span>
              <span className="text-sm px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                {topic.standardCode}
              </span>
            </div>
            <span className="text-sm text-stone-600">
              Question {currentQuestion.questionNumber} of {currentQuestion.totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Hint Button */}
            {!answerResult && (
              <button
                onClick={() => { sounds.playClick(); setShowHint(!showHint); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center gap-1.5 transition-colors ${
                  showHint ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
                title="View mathematical thinking hint"
              >
                <Lightbulb className="w-4 h-4 text-amber-700" />
                <span>Hint</span>
              </button>
            )}

            {/* Scratchpad Toggle Button */}
            <button
              onClick={() => { sounds.playClick(); setShowScratchpad(!showScratchpad); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center gap-1.5 transition-colors ${
                showScratchpad ? 'bg-teal-50 border-teal-300 text-teal-900 font-semibold' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
              title="Toggle math scratchpad for rough calculations"
            >
              <PenTool className="w-4 h-4" />
              <span>Scratchpad</span>
            </button>

            {/* Difficulty Badge */}
            <span className="text-sm px-3 py-1.5 rounded bg-stone-100 text-stone-700 font-medium capitalize">
              {getDifficultyLabel(currentDifficulty)}
            </span>

            {/* Score */}
            <span className="text-sm px-3 py-1.5 rounded bg-teal-50 border border-teal-200 text-teal-800 font-semibold tabular-nums">
              {score} pts
            </span>

            {/* Exit */}
            <button
              onClick={() => {
                if (window.confirm('Exit the current quiz? Progress will be saved up to this point.')) {
                  sounds.playClick();
                  onExit();
                }
              }}
              className="text-sm text-stone-600 hover:text-stone-900 px-2 py-1.5 rounded hover:bg-stone-100 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-700 rounded-full transition-[width] duration-300"
            style={{ width: `${Math.max(progressPercent, 4)}%` }}
          />
        </div>
      </div>

      {/* Streak encouragement */}
      {streak >= 2 && !answerResult && (
        <div className="p-3 mb-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-teal-700" />
          <span>{streak} correct answers in a row! Great momentum.</span>
        </div>
      )}

      {/* Level-Up Notification */}
      {levelUpMessage && (
        <div className="p-3 mb-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-teal-700" />
          <span>{levelUpMessage}</span>
        </div>
      )}

      {/* Mathematical Thinking Hint */}
      {showHint && !answerResult && (
        <div className="p-4 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-stone-800 text-sm flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-900 block mb-0.5">Math Thinking Clue:</span>
            <p className="text-stone-700 leading-relaxed">{getTopicHint(topic.id)}</p>
          </div>
        </div>
      )}

      {/* Scratchpad if opened */}
      {showScratchpad && (
        <Scratchpad />
      )}

      {/* Question Card */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-8 font-sans-display leading-snug">
          {currentQuestion.question}
        </h2>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQuestion.options.map((option, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isSelected = selectedIndex === idx;

            let cardStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-400';

            if (answerResult) {
              if (idx === answerResult.correctIndex) {
                cardStyle = 'bg-teal-50 border-teal-600 text-teal-950 font-bold';
              } else if (isSelected && !answerResult.correct) {
                cardStyle = 'bg-red-50 border-red-300 text-red-950';
              } else {
                cardStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
              }
            } else if (isSelected) {
              cardStyle = 'bg-stone-100 border-teal-700 text-stone-900 font-semibold';
            }

            return (
              <button
                key={idx}
                disabled={selectedIndex !== null || isSubmitting}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-md bg-white border border-stone-300 flex items-center justify-center font-bold text-sm text-stone-700 shrink-0">
                    {letter}
                  </span>
                  <span className="text-base sm:text-lg font-medium tabular-nums">
                    {option}
                  </span>
                </div>

                {answerResult && idx === answerResult.correctIndex && (
                  <Check className="w-5 h-5 text-teal-700 shrink-0" />
                )}
                {answerResult && isSelected && !answerResult.correct && (
                  <X className="w-5 h-5 text-red-700 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-xs text-stone-500 text-right">
          Keyboard: Press A, B, C, D (or 1, 2, 3, 4) to select an option.
        </p>
      </div>

      {/* Answer Feedback Card */}
      {answerResult && (
        <div className={`p-6 rounded-xl border mb-6 ${
          answerResult.correct
            ? 'bg-teal-50 border-teal-200 text-teal-950'
            : 'bg-stone-100 border-stone-200 text-stone-900'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold font-sans-display">
                {answerResult.correct ? 'Correct solution' : 'Review solution'}
              </h3>
              <span className="text-sm font-medium text-stone-600">
                {answerResult.correct ? `+${answerResult.pointsAwarded} points awarded` : 'Read the explanation step below'}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={isFinishing}
              className="btn-primary text-sm font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 shrink-0"
            >
              <span>{answerResult.questionsRemaining > 0 ? 'Next question' : 'Complete quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 leading-relaxed">
            <span className="text-sm font-bold text-stone-900 block mb-1.5">
              Worked Mathematical Explanation:
            </span>
            {answerResult.explanation}
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
