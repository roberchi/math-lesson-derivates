import { beforeEach, describe, expect, it } from 'vitest';
import { useLessonStore } from './lessonStore';

describe('lessonStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useLessonStore.setState({ readSections: [], verifiedConcepts: [], lastSectionId: null });
  });

  it('registra una sezione una sola volta', () => {
    useLessonStore.getState().markRead('geometria');
    useLessonStore.getState().markRead('geometria');
    expect(useLessonStore.getState().readSections).toEqual(['geometria']);
  });
});
