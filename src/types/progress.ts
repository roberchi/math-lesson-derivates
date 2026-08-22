export type AttemptResult = 'correct' | 'wrong';

export interface ExerciseAttempt {
  tries: AttemptResult[];
  score: number | null;
  done: boolean;
  proofViewed: boolean;
  proofCheckpointPassed?: boolean;
  solutionViewed: boolean;
  completedAt?: string;
}

export interface ClassProgress {
  unlocked: boolean;
  seen: boolean;
  completed: boolean;
  mastered: boolean;
  consultation: boolean;
  startedAt?: string;
  completedAt?: string;
  attempts: Record<string, ExerciseAttempt>;
}

export interface UserProgress {
  version: number;
  totalPoints: number;
  lastVisitedClassId: string | null;
  lastVisitedExerciseId: string | null;
  classes: Record<string, ClassProgress>;
}

export const EMPTY_ATTEMPT: ExerciseAttempt = {
  tries: [],
  score: null,
  done: false,
  proofViewed: false,
  proofCheckpointPassed: false,
  solutionViewed: false,
};

export const DEFAULT_PROGRESS: UserProgress = {
  version: 4,
  totalPoints: 0,
  lastVisitedClassId: null,
  lastVisitedExerciseId: null,
  classes: {},
};
