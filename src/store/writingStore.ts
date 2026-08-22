import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface SavedWritingSheet {
  dataUrl: string;
  height: number;
  updatedAt: string;
  checklist?: WritingChecklist;
}

export interface WritingChecklist {
  rule: boolean;
  steps: boolean;
  domain: boolean;
}

export type WritingChecklistItem = keyof WritingChecklist;

interface WritingStore {
  sheets: Record<string, SavedWritingSheet>;
  saveSheet: (key: string, dataUrl: string, height: number) => void;
  clearDrawing: (key: string) => void;
  setChecklistAnswer: (key: string, item: WritingChecklistItem, checked: boolean) => void;
  clearSheet: (key: string) => void;
  resetWritingSheets: () => void;
}

export const useWritingStore = create<WritingStore>()(
  persist(
    (set) => ({
      sheets: {},
      saveSheet: (key, dataUrl, height) => set((state) => {
        const previous = state.sheets[key];
        return { sheets: { ...state.sheets, [key]: { dataUrl, height, updatedAt: new Date().toISOString(), checklist: previous?.checklist } } };
      }),
      clearDrawing: (key) => set((state) => {
        const previous = state.sheets[key];
        if (!previous) return state;
        return { sheets: { ...state.sheets, [key]: { ...previous, dataUrl: '', updatedAt: new Date().toISOString() } } };
      }),
      setChecklistAnswer: (key, item, checked) => set((state) => {
        const previous = state.sheets[key];
        const checklist = { rule: false, steps: false, domain: false, ...previous?.checklist, [item]: checked };
        return {
          sheets: {
            ...state.sheets,
            [key]: {
              dataUrl: previous?.dataUrl ?? '',
              height: previous?.height ?? 768,
              updatedAt: new Date().toISOString(),
              checklist,
            },
          },
        };
      }),
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
