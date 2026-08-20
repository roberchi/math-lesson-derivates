import { describe, expect, it } from 'vitest';
import { buildAdaptiveOrder, calculateScore } from './learning';
import type { Exercise } from '@/types/exercise';
import type { UserProgress } from '@/types/progress';

const rules = {
  first_attempt_correct: 3,
  second_attempt_correct: 2,
  third_attempt_correct: 1,
  wrong_all: 0,
  viewed_solution_penalty: -1,
  viewed_proof_bonus: 1,
};

describe('calculateScore', () => {
  it('premia il primo tentativo e applica la penalità soluzione', () => {
    expect(calculateScore(['correct'], false, rules)).toBe(3);
    expect(calculateScore(['wrong', 'correct'], true, rules)).toBe(1);
  });

  it('restituisce zero quando non c’è risposta corretta', () => {
    expect(calculateScore(['wrong', 'wrong', 'wrong'], false, rules)).toBe(0);
  });
});

describe('buildAdaptiveOrder', () => {
  it('mette prima gli incompleti e poi i completati con score basso', () => {
    const exercise = (id: string, difficulty: 1 | 2 | 3): Exercise => ({
      id,
      difficulty,
      title: id,
      tags: [],
      problem: { text: id },
      answer: { latex: id },
      proof_from_limit: null,
      solution_steps: [],
    });
    const exercises = [exercise('done-high', 1), exercise('todo-hard', 3), exercise('done-low', 2), exercise('todo-easy', 1)];
    const progress: UserProgress = {
      version: 3,
      totalPoints: 0,
      lastVisitedClassId: null,
      lastVisitedExerciseId: null,
      classes: {
        c: {
          unlocked: true,
          completed: false,
          attempts: {
            'done-high': { tries: ['correct'], score: 3, done: true, proofViewed: false, solutionViewed: false },
            'done-low': { tries: ['wrong', 'wrong', 'correct'], score: 1, done: true, proofViewed: false, solutionViewed: false },
          },
        },
      },
    };
    expect(buildAdaptiveOrder(exercises, 'c', progress).map((item) => item.id)).toEqual([
      'todo-easy', 'todo-hard', 'done-low', 'done-high',
    ]);
  });
});
