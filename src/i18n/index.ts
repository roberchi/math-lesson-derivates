import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

export const supportedLanguages = ['it', 'en', 'fr', 'de', 'es'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];
export const languageStorageKey = 'derivate_language';

export function resolveSupportedLanguage(language?: string): SupportedLanguage {
  const normalized = language?.split('-')[0] as SupportedLanguage;
  return supportedLanguages.includes(normalized) ? normalized : 'it';
}

const savedLanguage = localStorage.getItem(languageStorageKey);
const browserLanguage = navigator.language.split('-')[0];
const initialLanguage = supportedLanguages.includes(savedLanguage as SupportedLanguage)
  ? savedLanguage!
  : supportedLanguages.includes(browserLanguage as SupportedLanguage) ? browserLanguage : 'it';

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'it',
    supportedLngs: [...supportedLanguages],
    load: 'languageOnly',
    interpolation: { escapeValue: false },
  });

function syncDocumentLanguage(language: string) {
  document.documentElement.lang = resolveSupportedLanguage(language);
  document.documentElement.dir = 'ltr';
  localStorage.setItem(languageStorageKey, document.documentElement.lang);
}

syncDocumentLanguage(initialLanguage);
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
