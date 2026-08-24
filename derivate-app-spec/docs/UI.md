# UI.md — Specifiche UI/UX Dettagliate

## 1. Design Language

**Stile:** Editorial academic — ispirato ai libri di testo di alta qualità, con tocchi di modernità. Non "gamificato", non scolastico. Pulito, tipografico, con enfasi sulla leggibilità matematica.

**Principi:**
- La matematica è protagonista: formule grandi, spazio bianco generoso
- Gerarchia visiva forte: il problema è sempre in evidenza
- Feedback esplicito e immediato
- Nessuna decorazione fine a sé stessa

---

## 2. Palette colori

### Theme tokens (MUI `createTheme`)

```typescript
// src/theme/tokens.ts

export const palette = {
  // Brand
  primary:   { main: '#3B4CB8', light: '#EEF0FB', dark: '#2D3A96', contrastText: '#fff' },
  secondary: { main: '#1B7A5E', light: '#E6F5F0', dark: '#166B52', contrastText: '#fff' },

  // Semantic
  error:   { main: '#B81C1C', light: '#FBECEC' },
  warning: { main: '#B85C1A', light: '#FBF0E8' },
  success: { main: '#1B7A5E', light: '#E6F5F0' },
  info:    { main: '#3B4CB8', light: '#EEF0FB' },

  // Custom (accessibili via theme.palette.custom)
  custom: {
    gold:       '#C49A2A',
    goldLight:  '#FBF7E8',
    purple:     '#6B3FB8',
    purpleLight:'#F2EEFB',
    ink:        '#1C1C2E',   // sfondo scuro pannello problema
    paper:      '#F9F7F2',   // sfondo pagina (leggero avorio)
    paper2:     '#F1EEE6',   // sfondo alternato
    rule:       '#DDD9CE',   // bordi e divisori
  },

  // MUI standard
  background: { default: '#F9F7F2', paper: '#FFFFFF' },
  text: { primary: '#1C1C2E', secondary: '#3A3A52', disabled: '#8A8A9A' },
};

// Dark mode overrides
export const darkPalette = {
  background: { default: '#0F1117', paper: '#181C27' },
  text: { primary: '#E2E8F0', secondary: '#94A3B8' },
  custom: {
    ink:    '#0D1117',
    paper:  '#12151F',
    paper2: '#1A1E2E',
    rule:   '#252B3B',
  },
};
```

### Mappa difficoltà → colore

| Livello | Label | Colore MUI | Hex |
|---------|-------|-----------|-----|
| 1 | Base | `success` | `#1B7A5E` |
| 2 | Medio | `primary` | `#3B4CB8` |
| 3 | Avanzato | `warning` | `#B85C1A` |
| 4 | Sfida | `custom.purple` | `#6B3FB8` |

---

## 3. Tipografia

```typescript
// src/theme/typography.ts
export const typography = {
  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
  
  // Titoli — serif per richiamo editoriale
  h1: { fontFamily: '"Crimson Pro", Georgia, serif', fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.1 },
  h2: { fontFamily: '"Crimson Pro", Georgia, serif', fontWeight: 700, fontSize: '2rem', lineHeight: 1.15 },
  h3: { fontFamily: '"Crimson Pro", Georgia, serif', fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.2 },
  h4: { fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.875rem',
        textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#8A8A9A' },
  
  // Body
  body1: { fontSize: '1rem', lineHeight: 1.7 },
  body2: { fontSize: '0.875rem', lineHeight: 1.65, color: '#3A3A52' },
  
  // Monospace per formule inline
  caption: { fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '0.75rem' },
};
```

**Google Fonts da includere in `index.html`:**
```html
<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css">
```

---

## 4. Layout globale

### 4.1 Shell dell'applicazione

```
┌─────────────────────────────────────────────────────────┐
│  TOPBAR  (height: 56px, position: fixed, z: 1100)       │
│  [logo f'] [titolo]      [⭐ 42 pt] [━━━━━] [⚙ Settings]│
└─────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────────┐
│          │                                              │
│ SIDEBAR  │  MAIN CONTENT                                │
│ 260px    │  max-width: 860px, mx: auto                  │
│ (fixed)  │  padding: 32px 40px 80px                     │
│          │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

**Topbar — `AppBar` MUI:**
- `position="fixed"` con `color="default"` (usa `background.paper` in dark, `custom.ink` in light)
- `elevation={0}` + bottom border `1px solid divider`
- **Left:** `IconButton` hamburger (mobile) + `Typography` logo
- **Center:** `LinearProgress` globale animato (% esercizi completati su totale)
- **Right:** Score chip (`Chip` con icon ⭐), `IconButton` settings

**Sidebar — `Drawer` MUI:**
- `variant="permanent"` su desktop (≥lg), `variant="temporary"` su mobile
- Width: `260px`
- Background: `custom.ink` (dark navy)
- Contiene: lista classi con `List` / `ListItem` MUI
- Ogni `ListItem` mostra: icona, titolo (truncato), badge stato, mini progress bar

### 4.2 Responsive breakpoints (MUI defaults)

| Breakpoint | Layout |
|------------|--------|
| `xs` 0–599px | Sidebar nascosta (hamburger), content full width, padding 16px |
| `sm` 600–899px | Sidebar nascosta, content max 600px centrato |
| `md` 900–1199px | Sidebar a scomparsa (drawer), content max 720px |
| `lg` 1200px+ | Sidebar permanente 260px, content max 860px |

---

## 5. Componenti MUI — Specifiche dettagliate

### 5.1 `ClassCard` — Card classe nella dashboard

```
┌──────────────────────────────────────┐
│ ▌ (3px accent left border)           │ ← colore primario/secondario/ecc.
│                                      │
│  [icon 32px]  Rapporto Incrementale  │ ← Typography h5 Crimson Pro
│               7 esercizi · 21 pt max │ ← Typography caption
│                                      │
│  ████████░░░░░░  57%  ✓ 4/7         │ ← LinearProgress + label
│                                      │
│  [Base] [Medio] [Avanzato]           │ ← Chip difficoltà
│                                      │
│  🔒 Bloccato / ● In corso / ✓ Fatto │ ← status chip
└──────────────────────────────────────┘
```

**MUI specifiche:**
```tsx
<Card
  elevation={0}
  sx={{
    border: '1px solid',
    borderColor: 'divider',
    borderLeft: `3px solid ${accentColor}`,
    borderRadius: 2,
    cursor: locked ? 'not-allowed' : 'pointer',
    opacity: locked ? 0.5 : 1,
    transition: 'all 0.2s ease',
    '&:hover:not([disabled])': {
      boxShadow: 3,
      transform: 'translateY(-2px)',
    },
  }}
>
  <CardActionArea disabled={locked} onClick={() => navigate(`/class/${cls.id}`)}>
    <CardContent>
      {/* contenuto */}
    </CardContent>
  </CardActionArea>
</Card>
```

### 5.2 `ExerciseListItem` — Riga esercizio in vista classe

```
┌──────────────────────────────────────────────────────────────┐
│ [○/✓/~/✗]  Derivata di x²             [Base] [📐]  +3pt    │
│            Definizione · potenza · classico                  │
└──────────────────────────────────────────────────────────────┘
```

**MUI specifiche:**
- Componente: `ListItem` con `ListItemButton`
- Icon status: `Avatar` 28px (colore dinamico in base a stato)
- Titolo: `ListItemText` primary con `Typography` variant `body1`
- Secondario: tag come `Typography` variant `caption` color `text.secondary`
- Right: `Box` flex con `Chip` difficoltà + badge 📐 + `Typography` punti

### 5.3 `ProblemPanel` — Pannello problema

```
┌──────────────────────────────────────────────────────────────┐
│  PROBLEMA                        (label uppercase blu piccolo)│
│                                                              │
│  Calcola f′(x) per f(x) = x²                               │
│  usando la definizione.          (testo + KaTeX, font 1rem)  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [💡] Mostra suggerimento                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  (Collapse MUI con hint text)                               │
└──────────────────────────────────────────────────────────────┘
```

**MUI specifiche:**
- Container: `Paper` con `sx={{ bgcolor: 'custom.ink', color: 'white', p: 3, borderRadius: 2 }}`
- Label: `Typography variant="overline"` color `primary.light`
- Testo problema: `Typography variant="body1"` con parser KaTeX inline
- Hint: `Button` variant `text` con `Collapse` MUI. Il testo del hint ha `Paper` con border-left `primary`

### 5.4 `ChoiceButton` — Risposta a scelta multipla

```
┌─────────────────────────────────────────────────┐
│  [A]   f′(x) = 2x              (KaTeX)          │
└─────────────────────────────────────────────────┘
```

**Stati:**
| Stato | Background | Border | Lettera bg |
|-------|-----------|--------|-----------|
| Idle | `background.paper` | `divider` | `action.selected` |
| Hover | `action.hover` | `primary.main` | `primary.light` |
| Selected | `primary.light` | `primary.main` | `primary.main` |
| Correct | `success.light` | `success.main` | `success.main` (icon ✓) |
| Wrong | `error.light` | `error.main` | `error.main` (icon ✗) |
| Disabled | opacità 0.5 | — | — |

**Animazione wrong:** `keyframes shake` 0.4s su asse X (±4px, 3 oscillazioni)

**MUI specifiche:**
```tsx
<ButtonBase
  component="div"
  onClick={handleSelect}
  disabled={answered || disabled}
  sx={{
    width: '100%',
    p: 2, borderRadius: 2,
    border: '1px solid',
    borderColor: getBorderColor(state),
    bgcolor: getBgColor(state),
    display: 'flex', alignItems: 'flex-start', gap: 1.5,
    textAlign: 'left',
    transition: 'all 0.15s ease',
    animation: state === 'wrong' ? `${shake} 0.4s ease` : 'none',
  }}
>
  <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: getLetterBg(state) }}>
    {label}
  </Avatar>
  <Box sx={{ flex: 1 }}>
    <KaTeXRenderer latex={choice.latex} display={false} />
  </Box>
</ButtonBase>
```

### 5.5 `AttemptDots` — Pallini tentativi

3 `Box` circolari 10px con transizione colore:
- Grigio `action.disabled` → Verde `success.main` (corretto) o Rosso `error.main` (sbagliato)
- `Tooltip` su ognuno: "Tentativo N: [corretto/sbagliato]"

### 5.6 `ProofAccordion` — Dimostrazione dal limite

```
┌─────────────────────────────────────────────────────────────┐
│ 📐 Dimostrazione dal limite del rapporto incrementale  [▶]  │
│    [+1 pt bonus per aprirla dopo aver risposto]             │
└─────────────────────────────────────────────────────────────┘
```

**Espanso:**
```
┌─────────────────────────────────────────────────────────────┐
│ "Perché (xⁿ)′ = nxⁿ⁻¹ ?"     (titolo in Crimson Pro)      │
│                                                             │
│  ①  Scrivi il rapporto incrementale                        │
│     ┌──────────────────────────────────────────────────┐   │
│     │  $$ \frac{f(x+h)-f(x)}{h} $$                    │   │  ← Paper dark
│     └──────────────────────────────────────────────────┘   │
│     Forma standard per la definizione di derivata.          │
│                                                             │
│  ②  Sviluppa con il binomio di Newton                      │
│     ┌──────────────────────────────────────────────────┐   │
│     │  $$ (x+h)^n = x^n + nhx^{n-1} + \ldots $$      │   │
│     └──────────────────────────────────────────────────┘   │
│     Solo il termine nhxⁿ⁻¹ sopravvive...                   │
│                                                             │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║ Conclusione: ... (goldLight background, border-left)  ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────────┘
```

**MUI specifiche:**
```tsx
<Accordion
  sx={{
    border: '1px solid',
    borderColor: alpha(theme.palette.custom.gold, 0.3),
    borderRadius: '8px !important',
    '&:before': { display: 'none' },
    bgcolor: theme.palette.custom.goldLight,
  }}
>
  <AccordionSummary expandIcon={<ChevronRightIcon />}>
    <Box display="flex" alignItems="center" gap={1}>
      <Typography>📐</Typography>
      <Typography variant="overline" color="custom.gold">
        Dimostrazione dal limite del rapporto incrementale
      </Typography>
      <Chip label="+1 pt bonus" size="small" color="warning" variant="outlined" />
    </Box>
  </AccordionSummary>
  <AccordionDetails sx={{ bgcolor: 'background.paper' }}>
    {/* ProofSteps */}
  </AccordionDetails>
</Accordion>
```

### 5.7 `ProofStep` — Singolo passo della dimostrazione

```tsx
<Box display="grid" gridTemplateColumns="28px 1fr" gap={1.5} py={1.5}
     borderBottom="1px solid" borderColor="divider">
  
  {/* Numero cerchio */}
  <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'custom.gold', mt: 0.5 }}>
    {stepNumber}
  </Avatar>

  <Box>
    {/* Label passo */}
    <Typography variant="caption" color="custom.gold" fontWeight={700} display="block" mb={0.5}>
      {step.label}
    </Typography>

    {/* Formula */}
    <Paper sx={{ bgcolor: 'custom.ink', p: '8px 14px', borderRadius: 1, my: 0.75, overflow: 'auto' }}>
      <BlockMath math={step.latex} />
    </Paper>

    {/* Spiegazione */}
    <Typography variant="body2" color="text.secondary">
      <KaTeXInlineRenderer text={step.explanation} />
    </Typography>
  </Box>
</Box>
```

### 5.8 `SolutionAccordion` — Soluzione passo per passo

Identico a `ProofAccordion` ma:
- Colori: `primary` invece di `gold`
- Icona: 📖
- Titolo: "Soluzione passo per passo"
- Nessun bonus punti

### 5.9 `FeedbackAlert` — Feedback risposta

```tsx
// Corretto
<Alert
  severity="success"
  icon={<CheckCircleIcon />}
  sx={{ borderRadius: 2, animation: `${fadeIn} 0.3s ease` }}
  action={<Chip label="+3 pt" color="success" size="small" />}
>
  <AlertTitle>Corretto!</AlertTitle>
  {ex.answer.text}
</Alert>

// Sbagliato
<Alert severity="error" ...>
  <AlertTitle>Non è corretto</AlertTitle>
  Riprova — ti rimangono {remaining} tentativi.
</Alert>

// Soluzione mostrata
<Alert severity="info" ...>
  <AlertTitle>📖 Soluzione mostrata</AlertTitle>
  Studia i passaggi. Il prossimo esercizio ti darà la possibilità di guadagnare punti.
</Alert>
```

### 5.10 `ScoreSnackbar` — Notifica punti

```tsx
<Snackbar
  open={showScore}
  autoHideDuration={2000}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
>
  <Alert severity="success" variant="filled" icon="⭐">
    +{points} punti guadagnati!
  </Alert>
</Snackbar>
```

### 5.11 `GlobalStatsDrawer` — Statistiche sidebar

```
┌────────────────────────────────────────┐
│  Il tuo progresso                      │
│                                        │
│  ⭐  42 punti totali                   │
│  ✓  14 / 27 esercizi                  │
│  📈  67% successo al 1° tentativo      │
│  📐  5 dimostrazioni lette             │
│                                        │
│  ──── Classi ────                      │
│  [Class list with progress]            │
└────────────────────────────────────────┘
```

---

## 6. Pagine (Routes)

| Path | Componente | Descrizione |
|------|-----------|-------------|
| `/` | `DashboardPage` | Home con griglia classi e stats |
| `/class/:classId` | `ClassPage` | Lista esercizi di una classe |
| `/class/:classId/exercise/:exId` | `ExercisePage` | Vista esercizio |
| `/class/:classId/results` | `ResultsPage` | Risultati fine classe |
| `/settings` | `SettingsPage` | Impostazioni |

---

## 7. Animazioni e transizioni

### 7.1 Transizioni di pagina
Usare `Fade` MUI tra le routes:
```tsx
<Fade in={true} timeout={250}>
  <Box>{children}</Box>
</Fade>
```

### 7.2 Feedback risposta sbagliata — shake
```typescript
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
`;
```

### 7.3 Score pop — punti guadagnati
```typescript
const popIn = keyframes`
  0%   { transform: scale(0.5) translateY(10px); opacity: 0; }
  70%  { transform: scale(1.15) translateY(-2px); opacity: 1; }
  100% { transform: scale(1) translateY(0); }
`;
```

### 7.4 Unlock classe — pulse
```typescript
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 76, 184, 0.4); }
  50%       { box-shadow: 0 0 0 12px rgba(59, 76, 184, 0); }
`;
```

### 7.5 Accordion expand
MUI gestisce in automatico. Assicurarsi `TransitionProps={{ unmountOnExit: true }}` per performance.

---

## 8. Icone MUI (`@mui/icons-material`)

```
CheckCircleOutlineIcon    — esercizio corretto ✓
CancelOutlinedIcon        — esercizio sbagliato ✗
RemoveCircleOutlineIcon   — esercizio parziale ~
RadioButtonUncheckedIcon  — esercizio non fatto ○
LockIcon                  — classe bloccata
StarIcon / StarBorderIcon — punti
ExpandMoreIcon            — accordion
ChevronRightIcon          — navigazione
NavigateBeforeIcon        — esercizio precedente
NavigateNextIcon          — esercizio successivo
RefreshIcon               — riprova
HomeIcon                  — dashboard
SettingsIcon              — impostazioni
MenuIcon                  — hamburger mobile
LightModeIcon             — tema chiaro
DarkModeIcon              — tema scuro
SchoolIcon                — header/logo
```

---

## 9. KaTeX — Componenti wrapper

### 9.1 `KaTeXInline` — formula inline nel testo
```tsx
// src/components/math/KaTeXInline.tsx
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface Props { math: string; }

export const KaTeXInline: React.FC<Props> = ({ math }) => (
  <InlineMath math={math} renderError={(err) => <code>{err.name}</code>} />
);
```

### 9.2 `KaTeXBlock` — formula display
```tsx
// src/components/math/KaTeXBlock.tsx
import { BlockMath } from 'react-katex';

export const KaTeXBlock: React.FC<{ math: string }> = ({ math }) => (
  <Box sx={{ overflow: 'auto', py: 0.5, '& .katex': { fontSize: '1.1em' } }}>
    <BlockMath math={math} renderError={(err) => <code>{err.name}</code>} />
  </Box>
);
```

### 9.3 `RichText` — testo misto con formule inline
Parser che sostituisce `\(...\)` con `<KaTeXInline>` e `$$...$$` con `<KaTeXBlock>`:

```tsx
// src/components/math/RichText.tsx
export const RichText: React.FC<{ text: string }> = ({ text }) => {
  // Splitti per \(...\) e $$...$$
  // Per ogni segmento: se è math → KaTeXInline/Block, altrimenti Typography span
  const parts = parseLatexDelimiters(text);
  return (
    <Box component="span" sx={{ '& .katex': { color: 'inherit' } }}>
      {parts.map((part, i) =>
        part.type === 'inline' ? <KaTeXInline key={i} math={part.content} /> :
        part.type === 'block'  ? <KaTeXBlock  key={i} math={part.content} /> :
        <span key={i}>{part.content}</span>
      )}
    </Box>
  );
};
```

---

## 10. Accessibilità (WCAG 2.1 AA)

- Tutti i `IconButton` hanno `aria-label`
- Le choice buttons hanno `role="radio"` e `aria-checked`
- Il gruppo choice ha `role="radiogroup"` con `aria-labelledby` che punta al titolo del problema
- `Accordion` MUI è già accessibile (usa `button` con `aria-expanded`)
- Focus management: dopo la conferma risposta, il focus va al pulsante "Prossimo"
- Contrasto colori verificato: body text su paper ≥ 7:1, testo secondario ≥ 4.5:1
- `LinearProgress` ha `aria-label="Progresso globale"` e `aria-valuenow`
- Nessun contenuto solo per colore (icone affiancate ai colori di stato)
- Skip link `<a href="#main-content">` per keyboard navigation

---

## 11. Dark mode

Usare `ThemeProvider` con `useColorScheme` (MUI v6):

```tsx
// src/theme/ThemeContext.tsx
import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDark ? 'dark' : 'light');

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? lightPaletteOptions : darkPaletteOptions),
    },
    typography,
    components: componentOverrides,
  }), [mode]);

  return (
    <ColorModeContext.Provider value={{ toggleColorMode: () => setMode(m => m === 'light' ? 'dark' : 'light') }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
```

In dark mode:
- `ProblemPanel` background: `#0D1117` (più scuro)
- Formula blocks: `#0A0C12`
- Card backgrounds: `#181C27`
- Testo formula (KaTeX): sempre `#E2E8F0`

---

## 12. Component overrides globali MUI

```typescript
// src/theme/components.ts
export const componentOverrides: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 4, fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.08em' },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: { borderRadius: 8, boxShadow: 'none', border: '1px solid', borderColor: 'divider' },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: '8px !important',
        '&:before': { display: 'none' },
        boxShadow: 'none',
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: { borderRadius: 2, height: 4 },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: { borderRadius: 8 },
    },
  },
};
```
