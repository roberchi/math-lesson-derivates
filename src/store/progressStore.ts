import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  DEFAULT_PROGRESS,
  EMPTY_ATTEMPT,
  type AttemptResult,
  type ClassProgress,
  type ExerciseAttempt,
  type UserProgress,
} from '@/types/progress';

const emptyClass = (): ClassProgress => ({
  unlocked: false,
  completed: false,
  attempts: {},
});

interface ProgressStore {
  progress: UserProgress;
  initializeClasses: (classIds: string[]) => void;
  unlockClass: (classId: string) => void;
  visitExercise: (classId: string, exerciseId: string) => void;
  recordAttempt: (classId: string, exerciseId: string, result: AttemptResult) => void;
  finalizeExercise: (classId: string, exerciseId: string, score: number) => void;
  markSolutionViewed: (classId: string, exerciseId: string) => void;
  markProofViewed: (classId: string, exerciseId: string, bonus: number) => void;
  completeClass: (classId: string) => void;
  resetExercise: (classId: string, exerciseId: string) => void;
  resetProgress: () => void;
  importProgress: (json: string) => boolean;
  exportProgress: () => string;
}

function updateAttempt(
  progress: UserProgress,
  classId: string,
  exerciseId: string,
  updater: (attempt: ExerciseAttempt) => ExerciseAttempt,
) {
  const cls = progress.classes[classId] ?? emptyClass();
  const attempt = cls.attempts[exerciseId] ?? EMPTY_ATTEMPT;
  return {
    ...progress,
    classes: {
      ...progress.classes,
      [classId]: {
        ...cls,
        startedAt: cls.startedAt ?? new Date().toISOString(),
        attempts: { ...cls.attempts, [exerciseId]: updater(attempt) },
      },
    },
  };
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: DEFAULT_PROGRESS,
      initializeClasses: (classIds) =>
        set((state) => {
          const classes = { ...state.progress.classes };
          classIds.forEach((id) => {
            classes[id] ??= emptyClass();
          });
          return { progress: { ...state.progress, classes } };
        }),
      unlockClass: (classId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            classes: {
              ...state.progress.classes,
              [classId]: {
                ...(state.progress.classes[classId] ?? emptyClass()),
                unlocked: true,
              },
            },
          },
        })),
      visitExercise: (classId, exerciseId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            lastVisitedClassId: classId,
            lastVisitedExerciseId: exerciseId,
          },
        })),
      recordAttempt: (classId, exerciseId, result) =>
        set((state) => ({
          progress: updateAttempt(state.progress, classId, exerciseId, (attempt) => ({
            ...attempt,
            tries: [...attempt.tries.slice(0, 2), result],
          })),
        })),
      finalizeExercise: (classId, exerciseId, score) =>
        set((state) => {
          const previous = state.progress.classes[classId]?.attempts[exerciseId]?.score ?? 0;
          const next = updateAttempt(state.progress, classId, exerciseId, (attempt) => ({
            ...attempt,
            score,
            done: true,
            completedAt: new Date().toISOString(),
          }));
          return { progress: { ...next, totalPoints: Math.max(0, next.totalPoints + score - previous) } };
        }),
      markSolutionViewed: (classId, exerciseId) =>
        set((state) => ({
          progress: updateAttempt(state.progress, classId, exerciseId, (attempt) => ({
            ...attempt,
            solutionViewed: true,
          })),
        })),
      markProofViewed: (classId, exerciseId, bonus) =>
        set((state) => {
          const existing = state.progress.classes[classId]?.attempts[exerciseId];
          if (!existing?.done || existing.proofViewed) return state;
          const next = updateAttempt(state.progress, classId, exerciseId, (attempt) => ({
            ...attempt,
            proofViewed: true,
          }));
          return { progress: { ...next, totalPoints: next.totalPoints + bonus } };
        }),
      completeClass: (classId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            classes: {
              ...state.progress.classes,
              [classId]: {
                ...(state.progress.classes[classId] ?? emptyClass()),
                completed: true,
                completedAt: new Date().toISOString(),
              },
            },
          },
        })),
      resetExercise: (classId, exerciseId) =>
        set((state) => {
          const previous = state.progress.classes[classId]?.attempts[exerciseId];
          if (!previous) return state;
          const deduction = (previous.score ?? 0) + (previous.proofViewed ? 1 : 0);
          const next = updateAttempt(state.progress, classId, exerciseId, () => ({ ...EMPTY_ATTEMPT }));
          return {
            progress: {
              ...next,
              totalPoints: Math.max(0, next.totalPoints - deduction),
              classes: {
                ...next.classes,
                [classId]: { ...next.classes[classId], completed: false, completedAt: undefined },
              },
            },
          };
        }),
      resetProgress: () => set({ progress: { ...DEFAULT_PROGRESS, classes: {} } }),
      exportProgress: () => JSON.stringify(get().progress, null, 2),
      importProgress: (json) => {
        try {
          const parsed = JSON.parse(json) as UserProgress;
          if (parsed.version !== 3 || typeof parsed.classes !== 'object') return false;
          set({ progress: parsed });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'deriv_progress_v3',
      storage: createJSONStorage(() => localStorage),
      version: 3,
      partialize: (state) => ({ progress: state.progress }),
    },
  ),
);
