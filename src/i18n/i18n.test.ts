import i18n, { languageStorageKey, supportedLanguages } from './index';
import { afterEach, describe, expect, it } from 'vitest';
import { resources } from './resources';

function translationKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object') return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    translationKeys(child, prefix ? `${prefix}.${key}` : key));
}

describe('i18n', () => {
  afterEach(async () => {
    await i18n.changeLanguage('it');
  });

  it('provides the five requested locales', () => {
    expect(supportedLanguages).toEqual(['it', 'en', 'fr', 'de', 'es']);
    for (const language of supportedLanguages) {
      expect(i18n.hasResourceBundle(language, 'translation')).toBe(true);
    }
  });

  it('changes the document language and persists the preference', async () => {
    await i18n.changeLanguage('es');

    expect(i18n.t('header.settings')).toBe('Ajustes');
    expect(document.documentElement.lang).toBe('es');
    expect(localStorage.getItem(languageStorageKey)).toBe('es');
  });

  it('has translated navigation labels in every locale', async () => {
    const labels: string[] = [];
    for (const language of supportedLanguages) {
      await i18n.changeLanguage(language);
      labels.push(i18n.t('nav.adaptive'));
    }

    expect(new Set(labels).size).toBe(5);
  });

  it('keeps every locale structurally complete', () => {
    const italianKeys = translationKeys(resources.it.translation).sort();
    for (const language of supportedLanguages.filter((item) => item !== 'it')) {
      expect(translationKeys(resources[language].translation).sort()).toEqual(italianKeys);
    }
  });
});
