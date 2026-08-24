# ADAPTIVE.md — Logica di Progressione Adattiva

## 1. Principi del sistema adattivo

Il sistema non è un motore di AI: è un **algoritmo deterministico basato su regole** che:

1. **Ordina** gli esercizi in base allo stato dello studente
2. **Sblocca** le classi successive al completamento dei prerequisiti
3. **Suggerisce** il ripasso quando il punteggio è basso
4. **Incentiva** la comprensione profonda (bonus per leggere la dimostrazione)

Non raccoglie dati sul server. Tutto è in localStorage.

---

## 2. Grafo delle dipendenze tra classi

```
rapporto_incrementale
        │
        ├──────────────────────┐
        ▼                      ▼
    potenze           funzioni_elementari
        │                      │
        └──────────┬───────────┘
                   ▼
          regola_prodotto
                   │
                   ├──────────────────────┐
                   ▼                      ▼
          regola_quoziente        regola_catena
                   │                      │
                   └──────────┬───────────┘
                              ▼
                        applicazioni
```

**Regola sblocco:** una classe si sblocca quando **tutte** le classi prerequisito sono `completed: true`.

**Definizione "completed":** tutti gli esercizi della classe hanno `done: true` (anche quelli con score 0).

---

## 3. Scoring per esercizio

```typescript
// src/utils/scoring.ts

export function calculateScore(
  tries: AttemptResult[],
  solutionViewed: boolean,
  rules: ScoringRules
): number {
  const firstCorrectIndex = tries.indexOf('correct');

  if (firstCorrectIndex === -1) {
    // Mai corretto
    return rules.wrong_all; // 0
  }

  let score: number;
  switch (firstCorrectIndex) {
    case 0: score = rules.first_attempt_correct;  break; // 3 pt
    case 1: score = rules.second_attempt_correct; break; // 2 pt
    default: score = rules.third_attempt_correct; break; // 1 pt
  }

  if (solutionViewed) {
    score = Math.max(0, score + rules.viewed_solution_penalty); // -1 pt
  }

  return score;
}

export function calculateProofBonus(rules: ScoringRules): number {
  return rules.viewed_proof_bonus; // +1 pt
}
```

**Tabella score:**

| Scenario | Punti |
|---------|-------|
| Corretto al 1° tentativo | 3 |
| Corretto al 2° tentativo | 2 |
| Corretto al 3° tentativo | 1 |
| Tutti sbagliati / soluzione mostrata | 0 |
| Soluzione mostrata poi corretto | max(0, score − 1) |
| + Apre dimostrazione (bonus, una volta) | +1 |

---

## 4. Ordine adattivo degli esercizi

```typescript
// src/utils/adaptiveOrder.ts

export function buildAdaptiveOrder(
  exercises: Exercise[],
  classId: string,
  getAttempt: (classId: string, exId: string) => ExerciseAttempt
): Exercise[] {
  return [...exercises].sort((a, b) => {
    const attA = getAttempt(classId, a.id);
    const attB = getAttempt(classId, b.id);

    // PRIORITÀ 1: Non completati PRIMA dei completati
    if (attA.done !== attB.done) return attA.done ? 1 : -1;

    // PRIORITÀ 2: Tra non completati → difficoltà crescente (facile prima)
    if (!attA.done && !attB.done) return a.difficulty - b.difficulty;

    // PRIORITÀ 3: Tra completati → score crescente (ripeti quelli con score basso)
    const scoreA = attA.score ?? 0;
    const scoreB = attB.score ?? 0;
    if (scoreA !== scoreB) return scoreA - scoreB;

    // PRIORITÀ 4: A parità → difficoltà crescente
    return a.difficulty - b.difficulty;
  });
}
```

**Esempio concreto:**

| Esercizio | Done | Score | Difficoltà | → Posizione |
|-----------|------|-------|-----------|------------|
| es_A | ✗ | null | 1 | 1° |
| es_B | ✗ | null | 2 | 2° |
| es_C | ✗ | null | 3 | 3° |
| es_D | ✓ | 0 | 1 | 4° (ripasso!) |
| es_E | ✓ | 1 | 2 | 5° |
| es_F | ✓ | 3 | 1 | 6° |

---

## 5. Sblocco classi — effetto `useClassUnlocker`

```typescript
// src/utils/classUnlock.ts

export function getClassesToUnlock(
  db: ExerciseDB,
  progress: UserProgress
): string[] {
  return db.classes
    .filter(cls => {
      // Già sbloccata → skip
      if (progress.classes[cls.id]?.unlocked) return false;
      // Tutti i prerequisiti completati?
      return cls.prerequisite_classes.every(pid =>
        progress.classes[pid]?.completed === true
      );
    })
    .map(cls => cls.id);
}
```

**Quando viene eseguito:** ogni volta che `progress` cambia nel store (Zustand subscription), non solo al caricamento.

**Notifica UI:** `Snackbar` MUI con messaggio "🔓 Nuova classe sbloccata: [nome]" e pulsante "Vai →".

---

## 6. Completamento classe

```typescript
// src/utils/scoring.ts

export function isClassComplete(
  cls: ExerciseClass,
  classProgress: ClassProgress
): boolean {
  return cls.exercises.every(ex => classProgress.attempts[ex.id]?.done === true);
}

export function getClassScorePercent(
  cls: ExerciseClass,
  classProgress: ClassProgress,
  scoringRules: ScoringRules
): number {
  const totalScore = cls.exercises.reduce((sum, ex) => {
    return sum + (classProgress.attempts[ex.id]?.score ?? 0);
  }, 0);
  const maxScore = cls.exercises.length * scoringRules.first_attempt_correct;
  return maxScore > 0 ? Math.round(totalScore / maxScore * 100) : 0;
}
```

---

## 7. Messaggi adattativi — Results page

```typescript
// src/utils/adaptiveMessages.ts

export interface ResultMessage {
  emoji: string;
  title: string;
  body: string;
  severity: 'success' | 'warning' | 'info';
  suggestReview: boolean;
}

export function getResultMessage(scorePct: number): ResultMessage {
  if (scorePct >= 80) return {
    emoji: '🏆',
    title: 'Eccellente!',
    body: 'Hai padroneggiato questa classe. Procedi con fiducia alla successiva.',
    severity: 'success',
    suggestReview: false,
  };

  if (scorePct >= 55) return {
    emoji: '👍',
    title: 'Buon lavoro!',
    body: 'Puoi proseguire. Considera di ripassare gli esercizi dove hai guadagnato meno punti.',
    severity: 'info',
    suggestReview: false,
  };

  return {
    emoji: '📚',
    title: 'Ripasso consigliato',
    body: 'Hai completato la classe, ma il punteggio è basso. Ti consiglio di rivedere gli esercizi con score 0 prima di passare alla successiva.',
    severity: 'warning',
    suggestReview: true,
  };
}
```

---

## 8. "Continua da dove hai lasciato"

```typescript
// src/utils/resumeLogic.ts

export function getResumeTarget(
  db: ExerciseDB,
  progress: UserProgress
): { classId: string; exId: string } | null {
  // 1. Usa lastVisited se ancora non completato
  if (progress.lastVisitedClassId && progress.lastVisitedExerciseId) {
    const att = progress.classes[progress.lastVisitedClassId]
      ?.attempts[progress.lastVisitedExerciseId];
    if (!att?.done) {
      return {
        classId: progress.lastVisitedClassId,
        exId: progress.lastVisitedExerciseId,
      };
    }
  }

  // 2. Altrimenti: primo esercizio non completato della prima classe non finita
  for (const cls of db.classes) {
    const clsProg = progress.classes[cls.id];
    if (!clsProg?.unlocked) continue;
    if (clsProg.completed) continue;

    const ordered = buildAdaptiveOrder(cls.exercises, cls.id,
      (cid, eid) => clsProg.attempts[eid] ?? { tries: [], score: null, done: false, proofViewed: false, solutionViewed: false }
    );

    const nextEx = ordered.find(ex => !clsProg.attempts[ex.id]?.done);
    if (nextEx) return { classId: cls.id, exId: nextEx.id };
  }

  return null; // tutto completato
}
```

---

## 9. Statistiche globali

```typescript
// src/utils/globalStats.ts

export interface GlobalStats {
  totalPoints: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  firstAttemptSuccessRate: number;  // %
  proofViewedCount: number;
  classesCompleted: number;
  classesTotal: number;
}

export function computeGlobalStats(db: ExerciseDB, progress: UserProgress): GlobalStats {
  let completed = 0, total = 0, firstAttemptCorrect = 0, proofViewed = 0;

  db.classes.forEach(cls => {
    total += cls.exercises.length;
    cls.exercises.forEach(ex => {
      const att = progress.classes[cls.id]?.attempts[ex.id];
      if (!att) return;
      if (att.done) completed++;
      if (att.tries[0] === 'correct') firstAttemptCorrect++;
      if (att.proofViewed) proofViewed++;
    });
  });

  return {
    totalPoints: progress.totalPoints,
    exercisesCompleted: completed,
    exercisesTotal: total,
    firstAttemptSuccessRate: completed > 0
      ? Math.round(firstAttemptCorrect / completed * 100)
      : 0,
    proofViewedCount: proofViewed,
    classesCompleted: db.classes.filter(c => progress.classes[c.id]?.completed).length,
    classesTotal: db.classes.length,
  };
}
```
