# DATA.md — Struttura Dati, TypeScript Types, Store

## 1. TypeScript Types (da `src/types/`)

### 1.1 Modello dati JSON (`src/types/exercise.ts`)

Questi types rispecchiano esattamente la struttura di `exercises/esercizi.json`.

```typescript
// src/types/exercise.ts

export type DifficultyLevel = 1 | 2 | 3 | 4;

export interface DifficultyInfo {
  label: string;        // "Base" | "Medio" | "Avanzato" | "Sfida"
  color: string;        // hex
  description: string;
}

export interface ProofStep {
  label: string;        // es. "Scrivi il rapporto incrementale"
  latex: string;        // formula KaTeX (display math)
  explanation: string;  // testo con eventuale \(...\) inline
}

export interface ProofFromLimit {
  title: string;
  steps: ProofStep[];
  conclusion: string;   // può contenere LaTeX inline
}

export interface SolutionStep {
  label: string;
  latex: string;
  explanation: string;
}

export interface ExerciseProblem {
  text: string;         // testo con LaTeX delimiters \(...\) e $$...$$
  hint?: string;        // opzionale
}

export interface ExerciseAnswer {
  latex: string;        // la risposta corretta in LaTeX
  text?: string;        // spiegazione testuale della risposta
}

export interface Exercise {
  id: string;                        // es. "ri_001"
  title: string;
  difficulty: DifficultyLevel;
  tags: string[];
  problem: ExerciseProblem;
  answer: ExerciseAnswer;
  proof_from_limit: ProofFromLimit | null;  // null se non disponibile
  solution_steps: SolutionStep[];
}

export interface ExerciseClass {
  id: string;                        // es. "rapporto_incrementale"
  title: string;                     // può contenere LaTeX \(...\)
  description: string;
  icon: string;                      // emoji o simbolo
  prerequisite_classes: string[];    // array di class id
  exercises: Exercise[];
}

export interface ScoringRules {
  first_attempt_correct: number;     // 3
  second_attempt_correct: number;    // 2
  third_attempt_correct: number;     // 1
  wrong_all: number;                 // 0
  viewed_solution_penalty: number;   // -1
  viewed_proof_bonus: number;        // 1
}

export interface ProgressionThresholds {
  advance_difficulty: {
    min_correct_in_class: number;
    min_score_pct: number;
  };
  remediation: {
    max_correct_in_class: number;
    trigger_review: boolean;
  };
  unlock_optional: {
    required_classes_done: string[];
    min_overall_score_pct: number;
  };
}

export interface ExerciseDB {
  meta: {
    version: string;
    subject: string;
    level: string;
    author: string;
    description: string;
  };
  difficulty_levels: Record<string, DifficultyInfo>;
  classes: ExerciseClass[];
  progression_rules: {
    description: string;
    thresholds: ProgressionThresholds;
    scoring: ScoringRules;
  };
}
```

### 1.2 Stato progresso utente (`src/types/progress.ts`)

```typescript
// src/types/progress.ts

export type AttemptResult = 'correct' | 'wrong';

export interface ExerciseAttempt {
  tries: AttemptResult[];          // max 3 elementi
  score: number | null;            // null se non ancora tentato
  done: boolean;
  proofViewed: boolean;            // ha aperto la dimostrazione dopo risposta
  solutionViewed: boolean;         // ha cliccato "Mostra soluzione"
  completedAt?: string;            // ISO date string
}

export interface ClassProgress {
  unlocked: boolean;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
  attempts: Record<string, ExerciseAttempt>;  // key = exercise.id
}

export interface UserProgress {
  version: number;                             // schema version, usato per migrations
  totalPoints: number;
  lastVisitedClassId: string | null;
  lastVisitedExerciseId: string | null;
  classes: Record<string, ClassProgress>;      // key = class.id
}

// Valori di default
export const DEFAULT_PROGRESS: UserProgress = {
  version: 3,
  totalPoints: 0,
  lastVisitedClassId: null,
  lastVisitedExerciseId: null,
  classes: {},
};
```

### 1.3 Stato UI locale (`src/types/ui.ts`)

```typescript
// src/types/ui.ts

export type ChoiceState = 'idle' | 'selected' | 'correct' | 'wrong' | 'revealed';

export interface Choice {
  label: 'A' | 'B' | 'C' | 'D';
  latex: string;
  isCorrect: boolean;
  state: ChoiceState;
}

export interface ExerciseUIState {
  choices: Choice[];
  selectedChoiceIndex: number | null;
  answered: boolean;
  proofOpen: boolean;
  stepsOpen: boolean;
  hintOpen: boolean;
  feedbackType: 'correct' | 'wrong' | 'info' | null;
  feedbackMessage: string;
  scorePopVisible: boolean;
  scorePopValue: number;
}
```

---

## 2. Zustand Store (`src/store/`)

### 2.1 Progress Store (`src/store/progressStore.ts`)

```typescript
// src/store/progressStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProgressStore {
  progress: UserProgress;

  // Actions
  initClass: (classId: string) => void;
  unlockClass: (classId: string) => void;
  recordAttempt: (classId: string, exId: string, result: AttemptResult) => void;
  finalizeExercise: (classId: string, exId: string, score: number) => void;
  markProofViewed: (classId: string, exId: string) => void;
  markSolutionViewed: (classId: string, exId: string) => void;
  addPoints: (n: number) => void;
  setLastVisited: (classId: string, exId: string) => void;
  completeClass: (classId: string) => void;
  resetProgress: () => void;
  exportProgress: () => string;  // JSON string
  importProgress: (json: string) => void;

  // Selectors (computed, memoizzabili con useShallow)
  getClassProgress: (classId: string) => ClassProgress;
  getExAttempt: (classId: string, exId: string) => ExerciseAttempt;
  getClassScore: (classId: string, db: ExerciseDB) => number;
  getClassMaxScore: (classId: string, db: ExerciseDB) => number;
  isClassUnlocked: (classId: string) => boolean;
  isClassCompleted: (classId: string) => boolean;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: DEFAULT_PROGRESS,

      initClass: (classId) => set(state => {
        if (state.progress.classes[classId]) return state;
        return {
          progress: {
            ...state.progress,
            classes: {
              ...state.progress.classes,
              [classId]: { unlocked: false, completed: false, attempts: {} },
            },
          },
        };
      }),

      unlockClass: (classId) => set(state => ({
        progress: {
          ...state.progress,
          classes: {
            ...state.progress.classes,
            [classId]: { ...get().getClassProgress(classId), unlocked: true },
          },
        },
      })),

      recordAttempt: (classId, exId, result) => set(state => {
        const att = get().getExAttempt(classId, exId);
        return {
          progress: {
            ...state.progress,
            classes: {
              ...state.progress.classes,
              [classId]: {
                ...get().getClassProgress(classId),
                attempts: {
                  ...get().getClassProgress(classId).attempts,
                  [exId]: { ...att, tries: [...att.tries, result] },
                },
              },
            },
          },
        };
      }),

      // ... altri actions

      addPoints: (n) => set(state => ({
        progress: { ...state.progress, totalPoints: state.progress.totalPoints + n },
      })),

      resetProgress: () => set({ progress: DEFAULT_PROGRESS }),

      exportProgress: () => JSON.stringify(get().progress, null, 2),

      importProgress: (json) => {
        try {
          const parsed = JSON.parse(json) as UserProgress;
          if (parsed.version !== 3) throw new Error('Version mismatch');
          set({ progress: parsed });
        } catch { /* mostra errore UI */ }
      },

      getClassProgress: (classId) => {
        const cls = get().progress.classes[classId];
        return cls ?? { unlocked: false, completed: false, attempts: {} };
      },

      getExAttempt: (classId, exId) => {
        const cls = get().getClassProgress(classId);
        return cls.attempts[exId] ?? {
          tries: [], score: null, done: false,
          proofViewed: false, solutionViewed: false,
        };
      },

      // ... altri selectors
    }),
    {
      name: 'deriv_progress_v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 2.2 DB Store (`src/store/dbStore.ts`)

```typescript
// src/store/dbStore.ts
// Carica il JSON degli esercizi e lo mette in store globale

import { create } from 'zustand';

interface DBStore {
  db: ExerciseDB | null;
  loading: boolean;
  error: string | null;
  loadDB: () => Promise<void>;

  // Selectors
  getClass: (classId: string) => ExerciseClass | undefined;
  getExercise: (classId: string, exId: string) => Exercise | undefined;
  getAllExercises: () => Exercise[];
}

export const useDBStore = create<DBStore>((set, get) => ({
  db: null,
  loading: false,
  error: null,

  loadDB: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/exercises/esercizi.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const db: ExerciseDB = await res.json();
      set({ db, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  getClass: (classId) => get().db?.classes.find(c => c.id === classId),
  getExercise: (classId, exId) => get().getClass(classId)?.exercises.find(e => e.id === exId),
  getAllExercises: () => get().db?.classes.flatMap(c => c.exercises) ?? [],
}));
```

### 2.3 UI Store (`src/store/uiStore.ts`)

```typescript
// src/store/uiStore.ts
// Stato UI temporaneo (non persisto in localStorage)

interface UIStore {
  sidebarOpen: boolean;
  colorMode: 'light' | 'dark';
  snackbar: { open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' };

  setSidebarOpen: (open: boolean) => void;
  toggleColorMode: () => void;
  showSnackbar: (message: string, severity?: 'success' | 'info') => void;
  hideSnackbar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  colorMode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  snackbar: { open: false, message: '', severity: 'success' },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleColorMode: () => set(s => ({ colorMode: s.colorMode === 'light' ? 'dark' : 'light' })),
  showSnackbar: (message, severity = 'success') =>
    set({ snackbar: { open: true, message, severity } }),
  hideSnackbar: () => set(s => ({ snackbar: { ...s.snackbar, open: false } })),
}));
```

---

## 3. Custom Hooks (`src/hooks/`)

### 3.1 `useAdaptiveOrder`

```typescript
// src/hooks/useAdaptiveOrder.ts
// Restituisce gli esercizi di una classe in ordine adattivo

export function useAdaptiveOrder(classId: string): Exercise[] {
  const { getClass } = useDBStore();
  const { getExAttempt } = useProgressStore();
  const cls = getClass(classId);

  return useMemo(() => {
    if (!cls) return [];
    return [...cls.exercises].sort((a, b) => {
      const attA = getExAttempt(classId, a.id);
      const attB = getExAttempt(classId, b.id);
      // Non completati prima
      if (attA.done !== attB.done) return attA.done ? 1 : -1;
      // Tra non completati: difficoltà crescente
      if (!attA.done) return a.difficulty - b.difficulty;
      // Tra completati: score crescente (ripeti quelli con score basso)
      return (attA.score ?? 0) - (attB.score ?? 0);
    });
  }, [cls, classId, getExAttempt]);
}
```

### 3.2 `useChoiceGenerator`

```typescript
// src/hooks/useChoiceGenerator.ts
// Genera 4 scelte (1 corretta + 3 distrattori) per un esercizio

export function useChoiceGenerator(exercise: Exercise, classId: string): Choice[] {
  const { getAllExercises } = useDBStore();

  return useMemo(() => {
    const correct = exercise.answer.latex;

    // Pool distrattori: risposte di altri esercizi, escludendo la corretta
    const pool = getAllExercises()
      .filter(e => e.id !== exercise.id)
      .map(e => e.answer.latex)
      .filter(latex => latex !== correct);

    // Distrattori specifici per difficoltà (stessa classe preferita)
    const sameClassPool = getAllExercises()
      .filter(e => e.id !== exercise.id)  // stessa difficulty ± 1
      .map(e => e.answer.latex)
      .filter(latex => latex !== correct);

    const uniquePool = [...new Set([...sameClassPool, ...pool])];
    const shuffled = uniquePool.sort(() => Math.random() - 0.5);
    const distractors = shuffled.slice(0, 3);

    // Fallback se non ci sono abbastanza distrattori nel DB
    const genericFallbacks = ['f\'(x) = 0', 'f\'(x) = x', 'f\'(x) = 1', 'f\'(x) = -f(x)'];
    while (distractors.length < 3) {
      const fb = genericFallbacks.find(f => f !== correct && !distractors.includes(f));
      if (fb) distractors.push(fb);
      else break;
    }

    const choices = [correct, ...distractors].map((latex, i) => ({
      label: (['A', 'B', 'C', 'D'] as const)[i],
      latex,
      isCorrect: latex === correct,
      state: 'idle' as ChoiceState,
    }));

    // Shuffle
    return choices.sort(() => Math.random() - 0.5);
  }, [exercise.id]);  // Ricalcola solo se l'esercizio cambia
}
```

### 3.3 `useClassUnlocker`

```typescript
// src/hooks/useClassUnlocker.ts
// Effetto: controlla e sblocca classi quando i prerequisiti sono soddisfatti

export function useClassUnlocker() {
  const { db } = useDBStore();
  const { progress, unlockClass, isClassCompleted } = useProgressStore();
  const { showSnackbar } = useUIStore();

  useEffect(() => {
    if (!db) return;
    db.classes.forEach(cls => {
      const prereqsDone = cls.prerequisite_classes.every(pid => isClassCompleted(pid));
      if (prereqsDone && !progress.classes[cls.id]?.unlocked) {
        unlockClass(cls.id);
        showSnackbar(`🔓 Sbloccata: ${stripLatex(cls.title)}`, 'success');
      }
    });
  }, [db, progress, unlockClass, isClassCompleted, showSnackbar]);
}
```

---

## 4. Struttura directory `src/`

```
src/
├── main.tsx                    # Entry point, ThemeProvider, Router
├── App.tsx                     # Routes + Shell layout
│
├── types/
│   ├── exercise.ts             # DB types
│   ├── progress.ts             # Progress types
│   └── ui.ts                   # UI state types
│
├── store/
│   ├── progressStore.ts        # Zustand persist
│   ├── dbStore.ts              # JSON loader
│   └── uiStore.ts              # UI ephemeral state
│
├── hooks/
│   ├── useAdaptiveOrder.ts
│   ├── useChoiceGenerator.ts
│   ├── useClassUnlocker.ts
│   ├── useExerciseScoring.ts   # Calcola score, chiama store
│   └── useProgress.ts          # Aggregated progress selectors
│
├── theme/
│   ├── tokens.ts               # Palette, typography tokens
│   ├── components.ts           # MUI component overrides
│   ├── lightTheme.ts
│   ├── darkTheme.ts
│   └── ThemeContext.tsx        # Provider + useColorMode hook
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx        # Topbar + Sidebar + main
│   │   ├── Topbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── SidebarClassItem.tsx
│   │
│   ├── math/
│   │   ├── KaTeXInline.tsx
│   │   ├── KaTeXBlock.tsx
│   │   └── RichText.tsx        # Parser testo + LaTeX misto
│   │
│   ├── exercise/
│   │   ├── ProblemPanel.tsx    # Pannello sfondo scuro
│   │   ├── ChoiceButton.tsx    # Singola opzione risposta
│   │   ├── ChoiceGroup.tsx     # Gruppo 4 opzioni (radiogroup)
│   │   ├── AttemptDots.tsx     # 3 pallini tentativo
│   │   ├── FeedbackAlert.tsx   # Alert success/error/info
│   │   ├── ProofAccordion.tsx  # Dimostrazione dal limite
│   │   ├── ProofStep.tsx       # Singolo passo dimostrazione
│   │   ├── SolutionAccordion.tsx
│   │   ├── SolutionStep.tsx
│   │   └── ScoreChip.tsx       # Badge punti con animazione
│   │
│   ├── class/
│   │   ├── ClassCard.tsx       # Card dashboard
│   │   ├── ClassHeader.tsx     # Header vista classe
│   │   └── ExerciseListItem.tsx
│   │
│   └── common/
│       ├── DifficultyChip.tsx  # Chip colorato per difficoltà
│       ├── StatusIcon.tsx      # ○ ✓ ~ ✗
│       ├── GlobalSnackbar.tsx
│       └── ConfirmDialog.tsx   # Dialog per reset, ecc.
│
├── pages/
│   ├── DashboardPage.tsx
│   ├── ClassPage.tsx
│   ├── ExercisePage.tsx
│   ├── ResultsPage.tsx
│   └── SettingsPage.tsx
│
└── utils/
    ├── latexParser.ts          # Parse \(...\) e $$...$$ in testo
    ├── stripLatex.ts           # Rimuove LaTeX per testo puro (sidebar)
    ├── adaptiveOrder.ts        # Sort algorithm (pure function)
    ├── scoring.ts              # Calcolo score puro
    └── classUnlock.ts          # Logica sblocco classi (pure function)
```

---

## 5. File pubblici (`public/`)

```
public/
├── exercises/
│   └── esercizi.json           # Copiato da exercises/ — fetch('/exercises/esercizi.json')
├── favicon.ico
├── og-image.png                # 1200×630 per Open Graph
└── manifest.json
```

**IMPORTANTE:** Il file `esercizi.json` deve essere in `public/exercises/` per essere servito staticamente da Vercel. Nel `vite.config.ts` aggiungere il copy:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-exercises',
      buildStart() {
        fs.mkdirSync('public/exercises', { recursive: true });
        fs.copyFileSync('exercises/esercizi.json', 'public/exercises/esercizi.json');
      },
    },
  ],
});
```

---

## 6. JSON Schema validazione (per aggiungere esercizi)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "required": ["id", "title", "difficulty", "problem", "answer", "solution_steps"],
  "properties": {
    "id": { "type": "string", "pattern": "^[a-z_0-9]+$" },
    "title": { "type": "string", "minLength": 3 },
    "difficulty": { "type": "integer", "minimum": 1, "maximum": 4 },
    "tags": { "type": "array", "items": { "type": "string" } },
    "problem": {
      "type": "object",
      "required": ["text"],
      "properties": {
        "text": { "type": "string" },
        "hint": { "type": "string" }
      }
    },
    "answer": {
      "type": "object",
      "required": ["latex"],
      "properties": {
        "latex": { "type": "string" },
        "text":  { "type": "string" }
      }
    },
    "proof_from_limit": {
      "oneOf": [
        { "type": "null" },
        {
          "type": "object",
          "required": ["title", "steps", "conclusion"],
          "properties": {
            "title": { "type": "string" },
            "steps": {
              "type": "array",
              "items": {
                "required": ["label", "latex", "explanation"],
                "properties": {
                  "label":       { "type": "string" },
                  "latex":       { "type": "string" },
                  "explanation": { "type": "string" }
                }
              }
            },
            "conclusion": { "type": "string" }
          }
        }
      ]
    },
    "solution_steps": {
      "type": "array",
      "minItems": 1,
      "items": {
        "required": ["label", "latex", "explanation"],
        "properties": {
          "label":       { "type": "string" },
          "latex":       { "type": "string" },
          "explanation": { "type": "string" }
        }
      }
    }
  }
}
```
