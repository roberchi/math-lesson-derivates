import { describe, expect, it } from 'vitest';
import { buildAdaptiveOrder, calculateScore, getClassMetrics } from './learning';
import type { Exercise, ExerciseClass } from '@/types/exercise';
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

describe('mastery', () => {
  const exercise = (id: string): Exercise => ({ id, difficulty: 1, title: id, tags: [], problem: { text: id }, answer: { latex: id }, proof_from_limit: null, solution_steps: [] });
  const cls: ExerciseClass = { id: 'c', title: 'c', description: '', icon: '', prerequisite_classes: [], exercises: [exercise('a'), exercise('b'), exercise('c')] };
  const progress = (scores: number[]): UserProgress => ({
    version: 4, totalPoints: scores.reduce((sum, score) => sum + score, 0), lastVisitedClassId: null, lastVisitedExerciseId: null,
    classes: { c: { unlocked: true, seen: true, completed: true, mastered: false, consultation: false, attempts: Object.fromEntries(scores.map((score, index) => [cls.exercises[index].id, { tries: score ? ['correct'] : ['wrong', 'wrong', 'wrong'], score, done: true, proofViewed: true, proofCheckpointPassed: true, solutionViewed: false }])) } },
  });

  it('richiede il 70% e almeno due risposte corrette, escludendo la lettura delle prove', () => {
    expect(getClassMetrics(cls, progress([3, 3, 1])).mastered).toBe(true);
    expect(getClassMetrics(cls, progress([3, 3, 0])).mastered).toBe(false);
    expect(getClassMetrics(cls, progress([3, 0, 0])).mastered).toBe(false);
    expect(getClassMetrics(cls, progress([3, 3, 1])).bonus).toBe(0);
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
      version: 4,
      totalPoints: 0,
      lastVisitedClassId: null,
      lastVisitedExerciseId: null,
      classes: {
        c: {
          unlocked: true,
          seen: true,
          completed: false,
          mastered: false,
          consultation: false,
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
