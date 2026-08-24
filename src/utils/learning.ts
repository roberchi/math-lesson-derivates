import type { Exercise, ExerciseClass, ExerciseDB, ScoringRules } from '@/types/exercise';
import type { ExerciseAttempt, UserProgress } from '@/types/progress';
import { EMPTY_ATTEMPT } from '@/types/progress';

export function calculateScore(
  tries: ExerciseAttempt['tries'],
  solutionViewed: boolean,
  rules: ScoringRules,
) {
  const firstCorrect = tries.indexOf('correct');
  if (firstCorrect < 0) return rules.wrong_all;
  const scores = [
    rules.first_attempt_correct,
    rules.second_attempt_correct,
    rules.third_attempt_correct,
  ];
  const score = scores[Math.min(firstCorrect, 2)];
  return solutionViewed ? Math.max(0, score + rules.viewed_solution_penalty) : score;
}

export function arePrerequisitesMastered(prerequisiteIds: string[], progress: UserProgress) {
  return prerequisiteIds.every((id) => progress.classes[id]?.mastered && progress.classes[id]?.unlocked);
}

export function buildAdaptiveOrder(
  exercises: Exercise[],
  classId: string,
  progress: UserProgress,
) {
  const attempt = (id: string) =>
    progress.classes[classId]?.attempts[id] ?? EMPTY_ATTEMPT;

  return [...exercises].sort((a, b) => {
    const aAttempt = attempt(a.id);
    const bAttempt = attempt(b.id);
    if (aAttempt.done !== bAttempt.done) return aAttempt.done ? 1 : -1;
    if (!aAttempt.done && !bAttempt.done) return a.difficulty - b.difficulty;
    if ((aAttempt.score ?? 0) !== (bAttempt.score ?? 0)) {
      return (aAttempt.score ?? 0) - (bAttempt.score ?? 0);
    }
    return a.difficulty - b.difficulty;
  });
}

export function isClassComplete(cls: ExerciseClass, progress: UserProgress) {
  return cls.exercises.every(
    (exercise) => progress.classes[cls.id]?.attempts[exercise.id]?.done,
  );
}

export function getClassMetrics(cls: ExerciseClass, progress: UserProgress) {
  const attempts = progress.classes[cls.id]?.attempts ?? {};
  const completed = cls.exercises.filter((exercise) => attempts[exercise.id]?.done).length;
  const score = cls.exercises.reduce(
    (sum, exercise) => sum + (attempts[exercise.id]?.score ?? 0),
    0,
  );
  const bonus = 0;
  const maxScore = cls.exercises.length * 3;
  const correctCount = cls.exercises.filter((exercise) => (attempts[exercise.id]?.score ?? 0) > 0).length;
  const percent = maxScore ? Math.round((score / maxScore) * 100) : 0;
  return {
    completed,
    total: cls.exercises.length,
    score,
    bonus,
    maxScore,
    percent,
    correctCount,
    mastered: (maxScore === 0 || score / maxScore >= 0.7) && correctCount >= Math.min(2, cls.exercises.length),
    progressPercent: cls.exercises.length
      ? Math.round((completed / cls.exercises.length) * 100)
      : 0,
  };
}

export function computeGlobalStats(db: ExerciseDB, progress: UserProgress) {
  const all = db.classes.flatMap((cls) =>
    cls.exercises.map((exercise) => ({ cls, exercise })),
  );
  const completed = all.filter(
    ({ cls, exercise }) => progress.classes[cls.id]?.attempts[exercise.id]?.done,
  );
  const firstTry = completed.filter(
    ({ cls, exercise }) =>
      progress.classes[cls.id]?.attempts[exercise.id]?.tries[0] === 'correct',
  ).length;
  return {
    totalPoints: progress.totalPoints,
    exercisesCompleted: completed.length,
    exercisesTotal: all.length,
    firstAttemptSuccessRate: completed.length
      ? Math.round((firstTry / completed.length) * 100)
      : 0,
    proofViewedCount: all.filter(
      ({ cls, exercise }) =>
        progress.classes[cls.id]?.attempts[exercise.id]?.proofViewed,
    ).length,
    classesCompleted: db.classes.filter((cls) => progress.classes[cls.id]?.mastered)
      .length,
    classesTotal: db.classes.length,
  };
}

export function getResumeTarget(db: ExerciseDB, progress: UserProgress) {
  const lastClass = progress.lastVisitedClassId;
  const lastExercise = progress.lastVisitedExerciseId;
  if (
    lastClass &&
    lastExercise &&
    !progress.classes[lastClass]?.attempts[lastExercise]?.done
  ) {
    return { classId: lastClass, exId: lastExercise };
  }

  for (const cls of db.classes) {
    const classProgress = progress.classes[cls.id];
    if ((!classProgress?.unlocked && !classProgress?.consultation) || classProgress.mastered) continue;
    const next = buildAdaptiveOrder(cls.exercises, cls.id, progress).find(
      (exercise) => !classProgress.attempts[exercise.id]?.done,
    );
    if (next) return { classId: cls.id, exId: next.id };
  }
  return null;
}

export function getResultMessage(percent: number) {
  if (percent >= 70) {
    return {
      emoji: '🏆',
      title: 'Eccellente!',
      body: 'Hai padroneggiato questa classe. Procedi con fiducia alla successiva.',
      severity: 'success' as const,
    };
  }
  return {
    emoji: '📚',
    title: 'Ripasso consigliato',
    body: 'Hai completato la classe, ma il punteggio è basso. Rivedi gli esercizi con 0 punti prima di proseguire.',
    severity: 'warning' as const,
  };
}

export function stripLatex(text: string) {
  return text
    .replace(/\\\((.*?)\\\)/g, '$1')
    .replace(/\\(?:left|right|dfrac|frac|cdot|circ)/g, '')
    .replace(/[{}]/g, '');
}

export function createSeededChoices(exercise: Exercise, cls: ExerciseClass, db: ExerciseDB) {
  const correct = exercise.answer.latex;
  void cls; void db;
  const authored = exercise.distractors ?? [];
  let seed = [...exercise.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const uniqueDistractors = authored.filter((item, index, items) => item.latex !== correct && items.findIndex((candidate) => candidate.latex === item.latex) === index);
  const distractors = uniqueDistractors.slice(0, 3);
  return [
    { latex: correct, isCorrect: true, feedback: exercise.answer.text ?? '', misconceptionId: null },
    ...distractors.map((item) => ({ ...item, isCorrect: false })),
  ].sort(() => random() - 0.5);
}
