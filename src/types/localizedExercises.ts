export interface GuidedSolution {
  steps: string[];
  result: string;
}

export interface WorksheetExercise {
  number: number;
  title: string;
  type: string;
  difficulty: string;
  prompt: string;
  solution: GuidedSolution;
}

export interface WorksheetData {
  sheets: Record<'1' | '2', { exercises: WorksheetExercise[] }>;
}

export interface VerificationProblem extends GuidedSolution {
  number: number;
  points: number;
  title: string;
  prompt: string;
  rubric: string;
}

export interface VerificationData {
  problems: VerificationProblem[];
}
