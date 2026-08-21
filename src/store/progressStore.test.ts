import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_PROGRESS } from '@/types/progress';
import { useProgressStore } from './progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useProgressStore.setState({ progress: { ...DEFAULT_PROGRESS, classes: {} } });
  });

  it('registra il punteggio senza bonus di lettura', () => {
    const store = useProgressStore.getState();
    store.initializeClasses(['classe']);
    store.unlockClass('classe');
    store.recordAttempt('classe', 'esercizio', 'correct');
    store.finalizeExercise('classe', 'esercizio', 3);
    store.markProofViewed('classe', 'esercizio', 1);
    store.markProofViewed('classe', 'esercizio', 1);

    const progress = useProgressStore.getState().progress;
    expect(progress.totalPoints).toBe(3);
    expect(progress.classes.classe.attempts.esercizio.proofViewed).toBe(true);
  });

  it('rimuove il vecchio punteggio quando si ripete un esercizio', () => {
    const store = useProgressStore.getState();
    store.initializeClasses(['classe']);
    store.finalizeExercise('classe', 'esercizio', 2);
    store.markProofViewed('classe', 'esercizio', 1);
    store.resetExercise('classe', 'esercizio');

    const progress = useProgressStore.getState().progress;
    expect(progress.totalPoints).toBe(0);
    expect(progress.classes.classe.attempts.esercizio.done).toBe(false);
  });
});
