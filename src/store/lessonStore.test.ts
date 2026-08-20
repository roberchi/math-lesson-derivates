import { beforeEach, describe, expect, it } from 'vitest';
import { useLessonStore } from './lessonStore';

describe('lessonStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useLessonStore.setState({ completedSections: [], lastSectionId: null });
  });

  it('registra una sezione una sola volta', () => {
    useLessonStore.getState().markComplete('geometria');
    useLessonStore.getState().markComplete('geometria');
    expect(useLessonStore.getState().completedSections).toEqual(['geometria']);
  });
});
