import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDBStore } from './dbStore';

describe('dbStore localized loading', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    useDBStore.setState({ db: null, language: null, loading: false, error: null });
  });

  it('loads the exercise database for the selected language and reloads on change', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ classes: [] }) });
    vi.stubGlobal('fetch', fetchMock);

    await useDBStore.getState().loadDB('en');
    expect(fetchMock).toHaveBeenLastCalledWith('/exercises/en/esercizi.json');

    await useDBStore.getState().loadDB('en');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await useDBStore.getState().loadDB('fr');
    expect(fetchMock).toHaveBeenLastCalledWith('/exercises/fr/esercizi.json');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
