import { create } from 'zustand';
import type { ExerciseDB } from '@/types/exercise';
import type { SupportedLanguage } from '@/i18n';

interface DBStore {
  db: ExerciseDB | null;
  loading: boolean;
  error: string | null;
  language: SupportedLanguage | null;
  loadDB: (language: SupportedLanguage) => Promise<void>;
}

let requestId = 0;

export const useDBStore = create<DBStore>((set, get) => ({
  db: null,
  loading: false,
  error: null,
  language: null,
  loadDB: async (language) => {
    if (get().db && get().language === language) return;
    const currentRequest = ++requestId;
    set({ loading: true, error: null, language });
    try {
      const response = await fetch(`/exercises/${language}/esercizi.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const db = (await response.json()) as ExerciseDB;
      if (currentRequest === requestId) set({ db, loading: false });
    } catch (error) {
      if (currentRequest === requestId) set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },
}));
