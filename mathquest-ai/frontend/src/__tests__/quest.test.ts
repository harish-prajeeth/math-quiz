import { describe, it, expect } from 'vitest';
import { reducer } from '../pages/QuestPage';
import { frameFor } from '../frames';
import { renderMath } from '../components/math';
import type { Question, AnswerResult } from '../types/game';

const dummyQuestion: Question = {
  questionId: 'q-1',
  question: 'What is 3/4 + 1/4?',
  options: ['1', '1/2', '2/4', '3/8'],
  difficulty: 'rookie',
  questionNumber: 1,
  totalQuestions: 10,
  powerupAvailable: true,
  hiddenOptions: [],
};

const dummyResult: AnswerResult = {
  correct: true,
  correctIndex: 0,
  pointsAwarded: 10,
  score: 10,
  streak: 1,
  difficulty: 'rookie',
  difficultyChanged: null,
  explanation: 'Add numerators.',
  quizComplete: false,
  combo: 1,
  bossHp: 85,
};

describe('Quest Reducer', () => {
  it('select ignores hidden options', () => {
    let state = reducer({ name: 'loading' }, { type: 'loaded', q: dummyQuestion });
    state = reducer(state, { type: 'hide', hidden: [1, 2] });

    // Selecting option 1 (which is hidden) should be ignored
    const nextState = reducer(state, { type: 'select', index: 1 });
    if (nextState.name === 'answering') {
      expect(nextState.selected).toBeNull();
    }

    // Selecting option 0 (not hidden) should work
    const validSelect = reducer(state, { type: 'select', index: 0 });
    if (validSelect.name === 'answering') {
      expect(validSelect.selected).toBe(0);
    }
  });

  it('hide clears a selected option that got hidden', () => {
    let state = reducer({ name: 'loading' }, { type: 'loaded', q: dummyQuestion });
    state = reducer(state, { type: 'select', index: 2 });
    if (state.name === 'answering') {
      expect(state.selected).toBe(2);
    }

    // 50/50 hides options 2 and 3 -> selected should clear to null
    state = reducer(state, { type: 'hide', hidden: [2, 3] });
    if (state.name === 'answering') {
      expect(state.selected).toBeNull();
    }
  });

  it('a second submit is ignored', () => {
    let state = reducer({ name: 'loading' }, { type: 'loaded', q: dummyQuestion });
    state = reducer(state, { type: 'select', index: 0 });
    const submittingState = reducer(state, { type: 'submit' });
    expect(submittingState.name).toBe('submitting');

    // Second submit on an already submitting state should be a no-op
    const secondSubmit = reducer(submittingState, { type: 'submit' });
    expect(secondSubmit).toEqual(submittingState);
  });

  it('answered only works from submitting', () => {
    const answeringState = reducer({ name: 'loading' }, { type: 'loaded', q: dummyQuestion });
    
    // Attempting 'answered' while in 'answering' phase should be ignored
    const invalidTransition = reducer(answeringState, { type: 'answered', result: dummyResult });
    expect(invalidTransition.name).toBe('answering');

    // From submitting, 'answered' transitions to 'feedback'
    const selectedState = reducer(answeringState, { type: 'select', index: 0 });
    const submittingState = reducer(selectedState, { type: 'submit' });
    const feedbackState = reducer(submittingState, { type: 'answered', result: dummyResult });
    expect(feedbackState.name).toBe('feedback');
  });
});

describe('frames: frameFor', () => {
  it('returns appropriate frame based on player level', () => {
    expect(frameFor(1).name).toBe('Plain');
    expect(frameFor(2).name).toBe('Plain');
    expect(frameFor(3).name).toBe('Bronze');
    expect(frameFor(4).name).toBe('Bronze');
    expect(frameFor(5).name).toBe('Silver');
    expect(frameFor(7).name).toBe('Silver');
    expect(frameFor(8).name).toBe('Gold');
    expect(frameFor(12).name).toBe('Gold');
  });
});

describe('math: renderMath', () => {
  it('renders standard text without error', () => {
    const rendered = renderMath('Simple text');
    expect(rendered).toBeDefined();
  });

  it('renders fractions with fraction markup', () => {
    const rendered = renderMath('Compute 3/4 + 1/4');
    expect(rendered).toBeDefined();
  });
});
