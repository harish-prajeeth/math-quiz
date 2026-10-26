import crypto from 'crypto';
import {
  QuizSession,
  StoredQuestion,
  Difficulty,
  AnswerResult,
  QuizResults,
  ClientQuestion,
} from '../types/quiz';
import { QuizSessionRepository } from '../repositories/quiz-session.repository';
import { generateQuestionBatch, generateQuestion } from './question-generator.service';
import { validateBatch } from './question-validator.service';
import { updateAdaptiveState, createInitialAdaptiveState } from './adaptive.service';
import { scoreAnswer, calculateBadges } from './scoring.service';
import { getFallbackQuestions } from '../data/fallback-questions';
import { getTopicById } from '../config/topics';
import { calculateBossHp, pickHiddenOptions } from '../config/rewards';
import { ProgressRepository } from '../repositories/progress.repository';

const QUIZ_LENGTH = 10;
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

export class QuizService {
  constructor(private repository: QuizSessionRepository) {}

  /**
   * Start a new quiz session.
   */
  async startQuiz(
    topicId: string,
    grade: number,
    playerId?: string
  ): Promise<{ sessionId: string; firstQuestion: ClientQuestion }> {
    const topic = getTopicById(topicId);
    if (!topic) {
      throw new Error('INVALID_TOPIC');
    }

    if (topic.grade !== grade) {
      throw new Error('GRADE_MISMATCH');
    }

    // Generate questions
    const questions = this.prepareQuestions(topicId, QUIZ_LENGTH);

    if (questions.length < QUIZ_LENGTH) {
      console.warn(`Only prepared ${questions.length}/${QUIZ_LENGTH} questions for ${topicId}`);
    }

    if (questions.length === 0) {
      throw new Error('NO_QUESTIONS_AVAILABLE');
    }

    const adaptive = createInitialAdaptiveState();
    const session: QuizSession = {
      id: crypto.randomUUID(),
      topicId,
      grade,
      playerId,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      currentDifficulty: adaptive.currentDifficulty,
      consecutiveCorrect: adaptive.consecutiveCorrect,
      score: 0,
      completed: false,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS,
    };

    await this.repository.create(session);

    const firstQuestion = this.toClientQuestion(
      this.getNextQuestion(session),
      session
    );

    return { sessionId: session.id, firstQuestion };
  }

  /**
   * Get the current unanswered question.
   */
  async getCurrentQuestion(sessionId: string): Promise<ClientQuestion> {
    const session = await this.getSession(sessionId);

    if (session.completed) {
      throw new Error('QUIZ_COMPLETED');
    }

    const question = this.getNextQuestion(session);
    return this.toClientQuestion(question, session);
  }

  /**
   * Use 50/50 powerup to eliminate 2 incorrect options.
   * Allowed once per quest session on the current unanswered question.
   */
  async usePowerup(sessionId: string, questionId: string): Promise<{ hidden: number[] }> {
    const session = await this.getSession(sessionId);

    if (session.completed) {
      throw new Error('QUIZ_COMPLETED');
    }
    if (session.powerupUsed) {
      throw new Error('POWERUP_USED');
    }

    const currentQuestion = this.getNextQuestion(session);
    if (currentQuestion.id !== questionId) {
      throw new Error('ALREADY_ANSWERED');
    }

    const hidden = pickHiddenOptions(currentQuestion.correctIndex);
    session.powerupUsed = true;
    session.hiddenOptionsMap = {
      ...(session.hiddenOptionsMap || {}),
      [questionId]: hidden,
    };

    await this.repository.update(session);
    return { hidden };
  }

  /**
   * Submit an answer and get feedback.
   */
  async submitAnswer(
    sessionId: string,
    selectedIndex: number
  ): Promise<AnswerResult> {
    const session = await this.getSession(sessionId);

    if (session.completed) {
      throw new Error('QUIZ_COMPLETED');
    }

    const currentQuestion = this.getNextQuestion(session);

    // Reject answers that pick a hidden option
    const hidden = session.hiddenOptionsMap?.[currentQuestion.id] ?? [];
    if (hidden.includes(selectedIndex)) {
      throw new Error('HIDDEN_OPTION_SELECTED');
    }

    const result = scoreAnswer(session, currentQuestion.id, selectedIndex);

    if ('error' in result) {
      throw new Error(result.error);
    }

    // Award half points if 50/50 powerup was used on this question
    if (hidden.length > 0 && result.result.correct) {
      const halfAwarded = Math.round(result.result.pointsAwarded / 2);
      const diff = result.result.pointsAwarded - halfAwarded;
      result.result.pointsAwarded = halfAwarded;
      result.result.totalScore = session.score + halfAwarded;
    }

    // Update session score
    session.score = result.result.totalScore;
    session.answers.push({
      questionId: currentQuestion.id,
      selectedIndex,
      correct: result.result.correct,
      pointsAwarded: result.result.pointsAwarded,
      difficulty: session.currentDifficulty,
      answeredAt: Date.now(),
    });

    // Update combo (consecutive correct answers NOT reset by tier change)
    if (result.result.correct) {
      session.combo = (session.combo || 0) + 1;
      session.bestCombo = Math.max(session.bestCombo || 0, session.combo);
    } else {
      session.combo = 0;
    }

    const prevDifficulty = session.currentDifficulty;
    // Update adaptive state
    const newAdaptive = updateAdaptiveState(
      {
        currentDifficulty: session.currentDifficulty,
        consecutiveCorrect: session.consecutiveCorrect,
      },
      result.result.correct
    );
    session.currentDifficulty = newAdaptive.currentDifficulty;
    session.consecutiveCorrect = newAdaptive.consecutiveCorrect;

    // Move to next question
    session.currentQuestionIndex++;

    // Check completion
    if (session.answers.length >= QUIZ_LENGTH || session.currentQuestionIndex >= session.questions.length) {
      session.completed = true;
    }

    const diffRank: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
    let difficultyChanged: 'up' | 'down' | null = null;
    if (diffRank[session.currentDifficulty] > diffRank[prevDifficulty]) {
      difficultyChanged = 'up';
    } else if (diffRank[session.currentDifficulty] < diffRank[prevDifficulty]) {
      difficultyChanged = 'down';
    }

    // Calculate boss HP
    const correctCount = session.answers.filter(a => a.correct).length;
    const bossHp = calculateBossHp(correctCount, Math.min(session.questions.length, QUIZ_LENGTH));

    // Update the result with game metrics
    result.result.currentDifficulty = session.currentDifficulty;
    result.result.difficulty = session.currentDifficulty;
    result.result.difficultyChanged = difficultyChanged;
    result.result.score = session.score;
    result.result.streak = session.consecutiveCorrect;
    result.result.quizComplete = session.completed;
    result.result.questionsRemaining = Math.max(0, session.questions.length - session.answers.length);
    result.result.combo = session.combo || 0;
    result.result.bossHp = bossHp;

    await this.repository.update(session);

    return result.result;
  }

  /**
   * Get completed quiz results.
   */
  async getResults(sessionId: string): Promise<QuizResults> {
    const session = await this.getSession(sessionId);

    if (!session.completed) {
      throw new Error('QUIZ_NOT_COMPLETED');
    }

    const badges = calculateBadges(session, true, true);
    const correctAnswers = session.answers.filter(a => a.correct).length;
    const totalQuestions = session.questions.length;
    const scorePercent = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const stars = scorePercent >= 90 ? 3 : scorePercent >= 70 ? 2 : scorePercent > 0 ? 1 : 0;
    const xpEarned = session.score;
    const level = Math.floor(session.score / 150) + 1;
    const bossDefeated = stars >= 2;

    // Persist player progress & achievements if player is linked
    if (session.playerId) {
      try {
        const currentProgress = await ProgressRepository.getPlayerProgress(session.playerId);
        const prevXp = currentProgress?.xp ?? 0;
        const newTotalXp = prevXp + xpEarned;
        const newPlayerLevel = Math.max(1, Math.floor(newTotalXp / 100) + 1);
        const currentMissions = { ...(currentProgress?.completedMissions || {}) };
        currentMissions[session.topicId] = Math.max(currentMissions[session.topicId] || 0, stars);

        const badgeSlugs = new Set(currentProgress?.badges || ['first-quest']);
        for (const b of badges) {
          badgeSlugs.add(b.id);
          await ProgressRepository.awardBadge(session.playerId, b.id);
        }

        await ProgressRepository.savePlayerProgress({
          playerId: session.playerId,
          playerLevel: newPlayerLevel,
          xp: newTotalXp,
          xpIntoLevel: newTotalXp % 100,
          xpForNextLevel: 100,
          completedMissions: currentMissions,
          starsByTopic: currentMissions,
          badges: Array.from(badgeSlugs),
        });
      } catch (err) {
        console.warn('Could not persist player progress on quiz completion:', err);
      }
    }

    return {
      sessionId: session.id,
      topicId: session.topicId,
      grade: session.grade,
      score: session.score,
      totalQuestions,
      correctAnswers,
      answers: session.answers,
      badges,
      completed: session.completed,
      difficultyProgression: session.answers.map(a => a.difficulty),
      scorePercent,
      stars,
      xpEarned,
      level,
      playerLevel: level,
      previousLevel: Math.max(1, level - (stars >= 2 ? 1 : 0)),
      bossDefeated,
      bestCombo: session.bestCombo || 0,
      missionId: session.topicId,
      correctCount: correctAnswers,
      newBadges: badges,
    };
  }

  // ─── Private Helpers ───

  private async getSession(sessionId: string): Promise<QuizSession> {
    const session = await this.repository.get(sessionId);
    if (!session) {
      throw new Error('SESSION_EXPIRED');
    }
    return session;
  }

  private getNextQuestion(session: QuizSession): StoredQuestion {
    // Find the next unanswered question at the best difficulty
    const answeredIds = new Set(session.answers.map(a => a.questionId));
    
    // First, try current difficulty
    let candidate = session.questions.find(
      q => !answeredIds.has(q.id) && q.difficulty === session.currentDifficulty
    );

    if (!candidate) {
      // Try nearest difficulty
      const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
      const currentIdx = difficulties.indexOf(session.currentDifficulty);
      
      // Try adjacent difficulties
      for (let offset = 1; offset <= 2; offset++) {
        if (!candidate && currentIdx + offset < difficulties.length) {
          candidate = session.questions.find(
            q => !answeredIds.has(q.id) && q.difficulty === difficulties[currentIdx + offset]
          );
        }
        if (!candidate && currentIdx - offset >= 0) {
          candidate = session.questions.find(
            q => !answeredIds.has(q.id) && q.difficulty === difficulties[currentIdx - offset]
          );
        }
      }
    }

    if (!candidate) {
      // Take any unanswered question
      candidate = session.questions.find(q => !answeredIds.has(q.id));
    }

    if (!candidate) {
      throw new Error('NO_MORE_QUESTIONS');
    }

    return candidate;
  }

  private toClientQuestion(question: StoredQuestion, session: QuizSession): ClientQuestion {
    const hidden = session.hiddenOptionsMap?.[question.id] ?? [];
    return {
      id: question.id,
      topicId: question.topicId,
      difficulty: question.difficulty,
      question: question.question,
      options: question.options,
      questionNumber: session.answers.length + 1,
      totalQuestions: Math.min(session.questions.length, QUIZ_LENGTH),
      powerupAvailable: !session.powerupUsed,
      hiddenOptions: hidden,
    };
  }

  /**
   * Prepare a set of validated questions for a quiz.
   * Priority: generated → fallback
   */
  private prepareQuestions(topicId: string, count: number): StoredQuestion[] {
    const questions: StoredQuestion[] = [];
    const seenTexts = new Set<string>();

    // 1. Generate arithmetic questions
    const generated = generateQuestionBatch(topicId, count + 5); // generate extras
    const { valid } = validateBatch(generated);
    
    for (const q of valid) {
      if (!seenTexts.has(q.question) && questions.length < count) {
        seenTexts.add(q.question);
        questions.push(q);
      }
    }

    // 2. Fill with fallback questions if needed
    if (questions.length < count) {
      const fallbacks = getFallbackQuestions(topicId);
      for (const fb of fallbacks) {
        if (!seenTexts.has(fb.question) && questions.length < count) {
          seenTexts.add(fb.question);
          // Give fallback a fresh ID
          questions.push({ ...fb, id: crypto.randomUUID() });
        }
      }
    }

    // 3. If still short, generate more one by one
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    let attempts = 0;
    while (questions.length < count && attempts < 20) {
      const diff = difficulties[attempts % 3];
      const q = generateQuestion(topicId, diff);
      if (q && !seenTexts.has(q.question)) {
        const { valid: v } = validateBatch([q]);
        if (v.length > 0) {
          seenTexts.add(q.question);
          questions.push(v[0]);
        }
      }
      attempts++;
    }

    return questions;
  }
}
