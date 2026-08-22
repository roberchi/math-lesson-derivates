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
});
