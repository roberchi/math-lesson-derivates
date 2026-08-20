export type ChoiceState = 'idle' | 'selected' | 'correct' | 'wrong' | 'revealed';

export interface Choice {
  label: 'A' | 'B' | 'C' | 'D';
  latex: string;
  isCorrect: boolean;
  state: ChoiceState;
}
