export type DifficultyLevel = 1 | 2 | 3 | 4;

export interface DifficultyInfo {
  label: string;
  color: string;
  description: string;
}

export interface SolutionStep {
  label: string;
  latex: string;
  explanation: string;
}

export interface ProofFromLimit {
  title: string;
  steps: SolutionStep[];
  conclusion: string;
  checkpoint?: ProofCheckpoint;
}

export interface ProofCheckpoint {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface Distractor {
  latex: string;
  feedback: string;
  misconceptionId: string;
}

export interface Exercise {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  tags: string[];
  problem: { text: string; hint?: string };
  answer: { latex: string; text?: string };
  distractors?: [Distractor, Distractor, Distractor];
  proof_from_limit: ProofFromLimit | null;
  solution_steps: SolutionStep[];
}

export interface ExerciseClass {
  id: string;
  title: string;
  description: string;
  icon: string;
  prerequisite_classes: string[];
  exercises: Exercise[];
}

export interface ScoringRules {
  first_attempt_correct: number;
  second_attempt_correct: number;
  third_attempt_correct: number;
  wrong_all: number;
  viewed_solution_penalty: number;
  viewed_proof_bonus: number;
}

export interface ProgressionThresholds {
  advance_difficulty?: { min_correct_in_class: number; min_score_pct: number };
  remediation?: { max_correct_in_class: number };
}

export interface ExerciseDB {
  meta: {
    version: string;
    subject: string;
    level: string;
    author: string;
    description: string;
  };
  difficulty_levels: Record<string, DifficultyInfo>;
  classes: ExerciseClass[];
  progression_rules: {
    description: string;
    thresholds: ProgressionThresholds;
    scoring: ScoringRules;
  };
}
