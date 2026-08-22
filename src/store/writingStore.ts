import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface SavedWritingSheet {
  dataUrl: string;
  height: number;
  updatedAt: string;
}

interface WritingStore {
  sheets: Record<string, SavedWritingSheet>;
  saveSheet: (key: string, dataUrl: string, height: number) => void;
  clearSheet: (key: string) => void;
  resetWritingSheets: () => void;
}

export const useWritingStore = create<WritingStore>()(
  persist(
    (set) => ({
      sheets: {},
      saveSheet: (key, dataUrl, height) => set((state) => ({
        sheets: { ...state.sheets, [key]: { dataUrl, height, updatedAt: new Date().toISOString() } },
      })),
      clearSheet: (key) => set((state) => {
        const sheets = { ...state.sheets };
        delete sheets[key];
        return { sheets };
      }),
      resetWritingSheets: () => set({ sheets: {} }),
    }),
    { name: 'derivate_writing_sheets_v1', storage: createJSONStorage(() => localStorage) },
  ),
);
