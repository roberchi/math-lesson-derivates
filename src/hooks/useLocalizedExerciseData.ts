import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveSupportedLanguage } from '@/i18n';

type ExerciseDataFile = 'worksheets.json' | 'verification.json';

interface LocalizedDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface InternalState<T> extends LocalizedDataState<T> {
  cacheKey: string;
}

const cache = new Map<string, unknown>();

export function useLocalizedExerciseData<T>(filename: ExerciseDataFile): LocalizedDataState<T> {
  const { i18n } = useTranslation();
  const language = resolveSupportedLanguage(i18n.resolvedLanguage);
  const cacheKey = `${language}/${filename}`;
  const cached = cache.get(cacheKey) as T | undefined;
  const [state, setState] = useState<InternalState<T>>({ cacheKey, data: cached ?? null, loading: !cached, error: null });

  useEffect(() => {
    let active = true;
    const existing = cache.get(cacheKey) as T | undefined;
    if (existing) {
      setState({ cacheKey, data: existing, loading: false, error: null });
      return () => { active = false; };
    }

    setState({ cacheKey, data: null, loading: true, error: null });
    void fetch(`/exercises/${cacheKey}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<T>;
      })
      .then((data) => {
        cache.set(cacheKey, data);
        if (active) setState({ cacheKey, data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) setState({ cacheKey, data: null, loading: false, error: error instanceof Error ? error.message : String(error) });
      });

    return () => { active = false; };
  }, [cacheKey]);

  return state.cacheKey === cacheKey ? state : { data: cached ?? null, loading: true, error: null };
}
