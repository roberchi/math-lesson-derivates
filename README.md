# Derivatives — from limits to mastery

An interactive educational application that guides students from the definition of the derivative through to its conscious use.

## Live version

The platform is available here:

**[Open the exercises online](https://math-lesson-derivates.vercel.app/esercizi)**

## Project goal

The project presents the derivative as a geometric and operational concept, avoiding the reduction of it to a simple list of formulas. The learning path helps students to:

- understand the transition from secant to tangent and the meaning of the difference quotient;
- interpret the first derivative, second derivative and concavity graphically;
- learn the fundamental derivatives and differentiation rules;
- recognise the layers of a composite function;
- explore Taylor series and the main theorems related to derivatives;
- practise with progressive hints, assessments and step-by-step worked solutions.

The app includes interactive simulators, graphs, a glossary, worksheets and a digital notepad compatible with mouse and stylus. Drawings, self-assessments and progress are saved locally in the browser.

## How to use the app

1. Start from the overview and follow the lessons in the recommended order.
2. Interact with graphs and simulators to connect formulas to their geometric meaning.
3. Complete the exercises proposed at the end of each section.
4. Use the worksheets and the full-screen digital notepad to write out your working.
5. Compare your working with the guided solutions.
6. Visit the **Exercises** section to practise by difficulty class and monitor your mastery.

Progress is stored in the browser being used. From the settings page it can be exported, imported or reset.

## Running locally

### Requirements

- Node.js 20 recommended;
- npm.

If you use NVM:

```bash
nvm use 20
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite will show the local address to open in the browser, normally `http://localhost:5173`.

## Available commands

```bash
npm run dev        # start the development server
npm run build      # create the production build
npm run preview    # preview the production build locally
npm run typecheck  # check TypeScript types
npm run lint       # run ESLint
npm test           # run automated tests
```

## Main technologies

- Vite and TypeScript;
- React;
- Material UI;
- KaTeX for mathematical formulas;
- Zustand for state, progress and local persistence;
- Vitest for automated tests.

## Essential structure

```text
src/
├── components/  educational components, graphs and layout
├── data/        course content and exercises
├── pages/       lessons, worksheets, test and results
├── store/       state and local persistence
├── types/       TypeScript types
└── utils/       helper and calculation functions
```

## Translations

The app is available in five languages: Italian (original), English, French, German and Spanish.

> **Note:** translations from Italian into English, French, German and Spanish were generated automatically using a local [Argos Translate](https://github.com/argosopentech/argos-translate) model and subsequently reviewed and corrected manually. Despite the review, some phrasing may still sound unnatural or contain minor inaccuracies. Contributions and corrections are welcome via pull request.
