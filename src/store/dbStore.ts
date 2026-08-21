import { create } from 'zustand';
import type { ExerciseDB } from '@/types/exercise';
import { addConceptExercises } from '@/data/conceptExercises';

interface DBStore {
  db: ExerciseDB | null;
  loading: boolean;
  error: string | null;
  loadDB: () => Promise<void>;
}

export const useDBStore = create<DBStore>((set, get) => ({
  db: null,
  loading: false,
  error: null,
  loadDB: async () => {
    if (get().db || get().loading) return;
    set({ loading: true, error: null });
    try {
      const response = await fetch('/exercises/esercizi.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      set({ db: addConceptExercises((await response.json()) as ExerciseDB), loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Errore sconosciuto', loading: false });
    }
  },
}));
