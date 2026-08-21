import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LessonProgressStore {
  readSections: string[];
  verifiedConcepts: string[];
  lastSectionId: string | null;
  markRead: (sectionId: string) => void;
  markUnread: (sectionId: string) => void;
  verifyConcept: (conceptId: string) => void;
  setLastSection: (sectionId: string) => void;
  resetLessons: () => void;
}

export const useLessonStore = create<LessonProgressStore>()(
  persist(
    (set) => ({
      readSections: [],
      verifiedConcepts: [],
      lastSectionId: null,
      markRead: (sectionId) =>
        set((state) => ({
          readSections: state.readSections.includes(sectionId)
            ? state.readSections
            : [...state.readSections, sectionId],
        })),
      markUnread: (sectionId) =>
        set((state) => ({
          readSections: state.readSections.filter((id) => id !== sectionId),
        })),
      verifyConcept: (conceptId) => set((state) => ({
        verifiedConcepts: state.verifiedConcepts.includes(conceptId) ? state.verifiedConcepts : [...state.verifiedConcepts, conceptId],
      })),
      setLastSection: (lastSectionId) => set({ lastSectionId }),
      resetLessons: () => set({ readSections: [], verifiedConcepts: [], lastSectionId: null }),
    }),
    {
      name: 'derivate_lesson_progress_v2',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
