import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LessonProgressStore {
  completedSections: string[];
  lastSectionId: string | null;
  markComplete: (sectionId: string) => void;
  markIncomplete: (sectionId: string) => void;
  setLastSection: (sectionId: string) => void;
  resetLessons: () => void;
}

export const useLessonStore = create<LessonProgressStore>()(
  persist(
    (set) => ({
      completedSections: [],
      lastSectionId: null,
      markComplete: (sectionId) =>
        set((state) => ({
          completedSections: state.completedSections.includes(sectionId)
            ? state.completedSections
            : [...state.completedSections, sectionId],
        })),
      markIncomplete: (sectionId) =>
        set((state) => ({
          completedSections: state.completedSections.filter((id) => id !== sectionId),
        })),
      setLastSection: (lastSectionId) => set({ lastSectionId }),
      resetLessons: () => set({ completedSections: [], lastSectionId: null }),
    }),
    {
      name: 'derivate_lesson_progress_v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
