# Derivate — dal limite alla padronanza

Applicazione didattica interattiva per accompagnare lo studente dalla definizione di derivata fino al suo uso consapevole.

## Versione online

La piattaforma è disponibile qui:

**[Apri gli esercizi online](https://math-lesson-derivates.vercel.app/esercizi)**

## Obiettivo del progetto

Il progetto presenta la derivata come un concetto geometrico e operativo, evitando di ridurla a un semplice elenco di formule. Il percorso aiuta lo studente a:

- comprendere il passaggio dalla secante alla tangente e il significato del rapporto incrementale;
- interpretare graficamente derivata prima, derivata seconda e concavità;
- imparare le derivate fondamentali e le regole di derivazione;
- riconoscere gli strati di una funzione composta;
- esplorare Taylor e i principali teoremi legati alle derivate;
- esercitarsi con suggerimenti progressivi, verifiche e soluzioni svolte passo per passo.

L’app include simulatori interattivi, grafici, glossario, schede di lavoro e un foglio digitale compatibile con mouse e stilo. Disegni, autovalutazioni e avanzamento vengono salvati localmente nel browser.

## Come usare l’app

1. Parti dalla panoramica per seguire le lezioni nell’ordine consigliato.
2. Interagisci con grafici e simulatori per collegare formule e significato geometrico.
3. Completa gli esercizi proposti al termine delle sezioni.
4. Usa le schede e il foglio digitale a tutto schermo per scrivere i passaggi.
5. Confronta il procedimento con le soluzioni guidate.
6. Consulta la sezione **Esercizi** per allenarti per classe di difficoltà e monitorare la padronanza.

Il progresso è memorizzato nel browser utilizzato. Dalle impostazioni è possibile esportarlo, importarlo oppure azzerarlo.

## Avvio in locale

### Requisiti

- Node.js 20 consigliato;
- npm.

Se utilizzi NVM:

```bash
nvm use 20
```

Installa le dipendenze e avvia il server di sviluppo:

```bash
npm install
npm run dev
```

Vite mostrerà nel terminale l’indirizzo locale da aprire nel browser, normalmente `http://localhost:5173`.

## Comandi disponibili

```bash
npm run dev        # avvia il server di sviluppo
npm run build      # crea la build di produzione
npm run preview    # mostra localmente la build
npm run typecheck  # controlla i tipi TypeScript
npm run lint       # esegue ESLint
npm test           # esegue i test automatici
```

## Tecnologie principali

- Vite e TypeScript;
- React;
- Material UI;
- KaTeX per le formule matematiche;
- Zustand per stato, progresso e salvataggio locale;
- Vitest per i test automatici.

## Struttura essenziale

```text
src/
├── components/  componenti didattici, grafici e layout
├── data/        contenuti del corso ed esercizi
├── pages/       lezioni, schede, verifica e risultati
├── store/       stato e persistenza locale
├── types/       tipi TypeScript
└── utils/       funzioni di supporto e calcolo
```
