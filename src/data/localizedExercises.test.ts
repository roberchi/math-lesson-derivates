import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ExerciseDB } from '@/types/exercise';
import type { VerificationData, WorksheetData } from '@/types/localizedExercises';

const languages = ['it', 'en', 'fr', 'de', 'es'] as const;

function readExerciseFile<T>(language: string, filename: string): T {
  return JSON.parse(readFileSync(resolve(process.cwd(), 'public', 'exercises', language, filename), 'utf8')) as T;
}

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('localized exercise files', () => {
  it('provides complete, non-empty content for every language', () => {
    for (const language of languages) {
      for (const filename of ['esercizi.json', 'worksheets.json', 'verification.json']) {
        const strings = allStrings(readExerciseFile(language, filename));
        expect(strings.length).toBeGreaterThan(0);
        expect(strings.every((value) => value.trim().length > 0)).toBe(true);
        expect(strings.some((value) => /ZX(?:MATH|TERM)/.test(value))).toBe(false);
      }
    }
  });

  it('keeps exercise identities and scoring data aligned across locales', () => {
    const italianDB = readExerciseFile<ExerciseDB>('it', 'esercizi.json');
    const italianWorksheets = readExerciseFile<WorksheetData>('it', 'worksheets.json');
    const italianVerification = readExerciseFile<VerificationData>('it', 'verification.json');
    const adaptiveIds = italianDB.classes.map((item) => [item.id, item.exercises.map((exercise) => exercise.id)]);
    const worksheetNumbers = Object.values(italianWorksheets.sheets).map((sheet) => sheet.exercises.map((exercise) => exercise.number));
    const verificationScores = italianVerification.problems.map((problem) => [problem.number, problem.points]);

    for (const language of languages.slice(1)) {
      const db = readExerciseFile<ExerciseDB>(language, 'esercizi.json');
      const worksheets = readExerciseFile<WorksheetData>(language, 'worksheets.json');
      const verification = readExerciseFile<VerificationData>(language, 'verification.json');
      expect(db.classes.map((item) => [item.id, item.exercises.map((exercise) => exercise.id)])).toEqual(adaptiveIds);
      expect(db.classes.flatMap((item) => item.exercises).every((exercise) => exercise.distractors?.length === 3)).toBe(true);
      expect(Object.values(worksheets.sheets).map((sheet) => sheet.exercises.map((exercise) => exercise.number))).toEqual(worksheetNumbers);
      expect(verification.problems.map((problem) => [problem.number, problem.points])).toEqual(verificationScores);
    }
  });
});
