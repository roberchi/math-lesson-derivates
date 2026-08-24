# Derivate — Corso Interattivo Adattivo

**App web per l'apprendimento adattivo delle derivate**, rivolta a studenti di fine quarta superiore scientifico. Costruita con React + TypeScript + MUI v6, deployata su Vercel.

## Quick start per Codex

```
derivate-app-spec/
├── README.md                  ← questo file
├── docs/
│   ├── SPEC.md                ← specifiche funzionali complete
│   ├── UI.md                  ← specifiche UI/UX dettagliate (layout, colori, componenti)
│   ├── DATA.md                ← struttura dati JSON e TypeScript types
│   ├── ADAPTIVE.md            ← logica di progressione adattiva
│   └── DEPLOYMENT.md          ← configurazione Vercel, env vars
├── exercises/
│   └── esercizi.json          ← libreria esercizi (fonte dati)
└── src/                       ← struttura directory React suggerita
    ├── components/
    ├── pages/
    ├── hooks/
    ├── store/
    ├── types/
    ├── utils/
    └── theme/
```

## Stack tecnologico

| Layer | Scelta | Versione |
|-------|--------|----------|
| Framework | React | 18.x |
| Linguaggio | TypeScript | 5.x |
| UI Library | MUI (Material UI) | v6 |
| Rendering matematico | KaTeX | 0.16.x |
| State management | Zustand | 4.x |
| Routing | React Router | 6.x |
| Build tool | Vite | 5.x |
| Deploy | Vercel | — |
| Test | Vitest + Testing Library | — |

## Comandi

```bash
npm create vite@latest derivate-app -- --template react-ts
cd derivate-app
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install katex react-katex
npm install zustand
npm install react-router-dom
npm install -D @types/katex
```

## Leggere le spec

1. Inizia da **`docs/SPEC.md`** — panoramica funzionale, user stories, flussi
2. Poi **`docs/UI.md`** — layout, palette, componenti MUI specifici, responsive
3. Poi **`docs/DATA.md`** — tipi TypeScript, struttura store, JSON schema
4. Poi **`docs/ADAPTIVE.md`** — algoritmo di progressione adattiva
5. Infine **`docs/DEPLOYMENT.md`** — vercel.json, variabili d'ambiente
