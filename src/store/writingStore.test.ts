import { beforeEach, describe, expect, it } from 'vitest';
import { useWritingStore } from './writingStore';

describe('writingStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useWritingStore.setState({ sheets: {} });
  });

  it('saves the drawing and its current height under the workspace key', () => {
    useWritingStore.getState().saveSheet('worksheet-1', 'data:image/png;base64,drawing', 1152);

    expect(useWritingStore.getState().sheets['worksheet-1']).toMatchObject({
      dataUrl: 'data:image/png;base64,drawing',
      height: 1152,
    });
    expect(useWritingStore.getState().sheets['worksheet-1'].updatedAt).toBeTruthy();
  });

  it('clears one sheet without removing the others', () => {
    const store = useWritingStore.getState();
    store.saveSheet('worksheet-1', 'first', 768);
    store.saveSheet('worksheet-2', 'second', 768);
    useWritingStore.getState().clearSheet('worksheet-1');

    expect(useWritingStore.getState().sheets['worksheet-1']).toBeUndefined();
    expect(useWritingStore.getState().sheets['worksheet-2']).toBeDefined();
  });

  it('persists checklist answers and preserves them when the drawing changes', () => {
    const store = useWritingStore.getState();
    store.setChecklistAnswer('worksheet-1', 'steps', true);
    useWritingStore.getState().saveSheet('worksheet-1', 'updated-drawing', 1152);

    expect(useWritingStore.getState().sheets['worksheet-1'].checklist).toEqual({
      rule: false,
      steps: true,
      domain: false,
    });
  });

  it('can erase the drawing without losing checklist answers', () => {
    const store = useWritingStore.getState();
    store.saveSheet('worksheet-1', 'drawing', 768);
    useWritingStore.getState().setChecklistAnswer('worksheet-1', 'rule', true);
    useWritingStore.getState().clearDrawing('worksheet-1');

    expect(useWritingStore.getState().sheets['worksheet-1'].dataUrl).toBe('');
    expect(useWritingStore.getState().sheets['worksheet-1'].checklist?.rule).toBe(true);
  });
});
