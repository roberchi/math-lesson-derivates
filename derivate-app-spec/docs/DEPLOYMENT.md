# DEPLOYMENT.md — Deploy su Vercel

## 1. Setup progetto

### 1.1 Inizializzazione

```bash
npm create vite@latest derivate-app -- --template react-ts
cd derivate-app

# UI e math
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install katex react-katex
npm install @types/katex -D

# State management e routing
npm install zustand
npm install react-router-dom

# Dev deps
npm install -D vitest @testing-library/react @testing-library/user-event @vitest/coverage-v8
```

### 1.2 `package.json` (sezioni rilevanti)

```json
{
  "name": "derivate-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev":        "vite",
    "build":      "tsc -b && vite build",
    "preview":    "vite preview",
    "test":       "vitest run",
    "test:watch": "vitest",
    "coverage":   "vitest run --coverage",
    "typecheck":  "tsc --noEmit",
    "lint":       "eslint src --ext ts,tsx --report-unused-disable-directives"
  },
  "engines": { "node": ">=18" }
}
```

---

## 2. `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Plugin per copiare esercizi.json in public/ durante il build
function copyExercises() {
  return {
    name: 'copy-exercises',
    buildStart() {
      const destDir = resolve(__dirname, 'public/exercises');
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(
        resolve(__dirname, 'exercises/esercizi.json'),
        resolve(destDir, 'esercizi.json')
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), copyExercises()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk separato per MUI (riduce initial bundle)
          mui:    ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          katex:  ['katex', 'react-katex'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand'],
        },
      },
    },
  },
  // Per i test
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
  },
});
```

---

## 3. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 4. `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/((?!exercises|assets|favicon|og-image|manifest).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/exercises/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400" },
        { "key": "Content-Type",  "value": "application/json" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

**Note sul rewrite:** la regola esclude `/exercises/` dal rewrite SPA così il JSON viene servito direttamente da Vercel CDN.

---

## 5. `public/index.html` (template Vite)

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Corso interattivo adattivo sulle derivate per il liceo scientifico" />

  <!-- Open Graph -->
  <meta property="og:title"       content="Derivate — Corso Interattivo" />
  <meta property="og:description" content="Esercizi adattivi con dimostrazioni dal limite del rapporto incrementale." />
  <meta property="og:image"       content="/og-image.png" />
  <meta property="og:type"        content="website" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet" />

  <!-- KaTeX CSS -->
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css"
        integrity="sha384-wcIxkf4k558AjM3Yz3BBFQUbk/zgIYC2R0QpeeYb+TwlBVMrlgLqwRjRtGZiK7ww"
        crossorigin="anonymous" />

  <title>Derivate — Corso Interattivo</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

## 6. `src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AppThemeProvider } from '@/theme/ThemeContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppThemeProvider>
        <CssBaseline />
        <App />
      </AppThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## 7. `src/App.tsx`

```tsx
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { ClassPage }     from '@/pages/ClassPage';
import { ExercisePage }  from '@/pages/ExercisePage';
import { ResultsPage }   from '@/pages/ResultsPage';
import { SettingsPage }  from '@/pages/SettingsPage';
import { useDBStore }    from '@/store/dbStore';
import { useClassUnlocker } from '@/hooks/useClassUnlocker';
import { useEffect } from 'react';

export default function App() {
  const { loadDB } = useDBStore();
  useClassUnlocker(); // Effetto globale sblocco classi

  useEffect(() => { loadDB(); }, [loadDB]);

  return (
    <AppShell>
      <Routes>
        <Route path="/"                                     element={<DashboardPage />} />
        <Route path="/class/:classId"                       element={<ClassPage />} />
        <Route path="/class/:classId/exercise/:exId"        element={<ExercisePage />} />
        <Route path="/class/:classId/results"               element={<ResultsPage />} />
        <Route path="/settings"                             element={<SettingsPage />} />
      </Routes>
    </AppShell>
  );
}
```

---

## 8. Variabili d'ambiente

Nessuna variabile d'ambiente richiesta per la v1 (tutto statico).

Per feature future (analytics):
```bash
# .env.local (non committare)
VITE_PLAUSIBLE_DOMAIN=derivate.example.com
```

---

## 9. Deploy su Vercel — step by step

1. **Push su GitHub** (repo pubblico o privato)

2. **Import su Vercel:**
   - Vai su vercel.com → New Project → Import da GitHub
   - Framework preset: **Vite** (rilevato automaticamente)
   - Build command: `npm run build`
   - Output dir: `dist`

3. **Configurazione automatica:** Vercel rileva `vercel.json` nella root e applica rewrites e headers.

4. **Deploy:** ogni push su `main` → deploy automatico.

5. **Preview:** ogni PR → preview deployment su URL unico.

---

## 10. Testing

### Setup

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem:    (key: string) => store[key] ?? null,
    setItem:    (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear:      () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch per esercizi.json
vi.mock('./store/dbStore', () => ({
  useDBStore: () => ({ db: mockDB, loading: false, error: null }),
}));
```

### Esempi test

```typescript
// src/utils/scoring.test.ts
import { calculateScore } from './scoring';

describe('calculateScore', () => {
  const rules = { first_attempt_correct: 3, second_attempt_correct: 2,
    third_attempt_correct: 1, wrong_all: 0, viewed_solution_penalty: -1, viewed_proof_bonus: 1 };

  it('3 pts on first correct attempt', () =>
    expect(calculateScore(['correct'], false, rules)).toBe(3));

  it('2 pts on second attempt', () =>
    expect(calculateScore(['wrong', 'correct'], false, rules)).toBe(2));

  it('penalty for solution viewed', () =>
    expect(calculateScore(['correct'], true, rules)).toBe(2));

  it('0 pts when all wrong', () =>
    expect(calculateScore(['wrong', 'wrong', 'wrong'], false, rules)).toBe(0));
});
```

---

## 11. Performance checklist pre-deploy

- [ ] Bundle size: `npm run build` → controllare `dist/assets/` chunk sizes
- [ ] MUI tree-shaking: importare componenti singoli `@mui/material/Button`, non `@mui/material`
- [ ] KaTeX: viene caricato come CSS da CDN (non nel bundle JS)
- [ ] JSON esercizi: servito da Vercel CDN con cache 24h
- [ ] Immagini: og-image.png compresso (max 150KB)
- [ ] Fonts: `display=swap` per non bloccare il render
- [ ] Lighthouse score target: Performance ≥ 85, Accessibility ≥ 95
