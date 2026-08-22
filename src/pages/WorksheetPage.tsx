import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Link, Navigate, useParams } from 'react-router-dom';
import { DigitalWorkspace } from '@/components/labs/DigitalWorkspace';
import { MathText } from '@/components/math/MathText';
import { ProgressiveSolution } from '@/components/lesson/ProgressiveSolution';

interface WorksheetExercise {
  number: number;
  title: string;
  type: string;
  difficulty: string;
  prompt: string;
}

const sheetOne: WorksheetExercise[] = [
  { number: 1, title: 'Rapporto incrementale', type: 'Per definizione', difficulty: 'Base', prompt: 'Per \\(f(x)=x^2-3x+2\\), calcola e semplifica il rapporto incrementale nel punto \\(x_0=2\\), poi determina \\(f′(2)\\).' },
  { number: 2, title: 'Tre derivate per definizione', type: 'Per definizione', difficulty: 'Base', prompt: 'Calcola dal limite del rapporto incrementale le derivate di: a) \\(3x+5\\); b) \\(x^3\\); c) \\(1/x\\). Indica il dominio.' },
  { number: 3, title: 'Rette tangenti', type: 'Geometrico', difficulty: '★★', prompt: 'Per \\(f(x)=x^2\\): a) trova la tangente in \\(x_0=3\\); b) cerca i punti con tangente parallela all’asse x; c) cerca i punti con tangente che forma un angolo di 45° con l’asse x.' },
  { number: 4, title: 'Valore assoluto', type: 'Derivabilità', difficulty: '★★', prompt: 'Studia la derivabilità di \\(f(x)=|x-2|\\) in \\(x_0=2\\) calcolando separatamente le derivate destra e sinistra. Disegna il grafico.' },
  { number: 5, title: 'Una sfida di derivabilità', type: 'Sfida', difficulty: '★★★', prompt: 'Studia la derivabilità di \\(f(x)=x|x|\\) in \\(x_0=0\\). Scrivi la funzione a tratti e fai uno schizzo del grafico prima di calcolare.' },
];

const sheetTwo: WorksheetExercise[] = [
  { number: 1, title: 'Tabella fondamentale', type: 'Regole base', difficulty: 'Base', prompt: 'Deriva: a) \\(5x^4-3x^2+7\\); b) \\(\\sqrt{x}+1/x^2\\); c) \\(2e^x-4\\ln x\\); d) \\(3\\sin x-\\cos x\\).' },
  { number: 2, title: 'Prodotti', type: 'Prodotto', difficulty: 'Base', prompt: 'Calcola la derivata di: a) \\(x^2\\sin x\\); b) \\(e^x\\cos x\\). Indica chiaramente i due fattori e le loro derivate.' },
  { number: 3, title: 'Quozienti', type: 'Quoziente', difficulty: 'Medio', prompt: 'Calcola la derivata di: a) \\((x^2+1)/(x-1)\\); b) \\(\\tan x\\), riscrivendola come \\(\\sin x/\\cos x\\).' },
  { number: 4, title: 'Funzioni composte', type: 'Catena', difficulty: '★★', prompt: 'Deriva: a) \\(\\sin(x^2)\\); b) \\(e^{3x-1}\\); c) \\((x^3+5)^4\\); d) \\(\\ln(\\cos x)\\). Evidenzia interno ed esterno.' },
  { number: 5, title: 'Derivata seconda', type: 'Seconda derivata', difficulty: '★★', prompt: 'Data \\(f(x)=x^4-6x^2+1\\), calcola \\(f′′(x)\\) e determina i candidati punti di flesso.' },
  { number: 6, title: 'Regole combinate', type: 'Sfida', difficulty: '★★★', prompt: 'Per \\(f(x)=e^x\\sin(2x)\\), calcola \\(f′(x)\\) e determina i punti stazionari nell’intervallo \\([0,\\pi]\\).' },
];

interface GuidedSolution {
  steps: string[];
  result: string;
}

const solutions: Record<string, GuidedSolution> = {
  '1-1': {
    steps: [
      'Calcoliamo \\(f(2)=0\\) e \\(f(2+h)=(2+h)^2-3(2+h)+2=h+h^2\\).',
      'Il rapporto incrementale è $$\\frac{f(2+h)-f(2)}{h}=\\frac{h+h^2}{h}=1+h,\\qquad h\\ne0.$$',
      'Passando al limite per \\(h\\to0\\) otteniamo la derivata nel punto.',
    ],
    result: '\\(\\boxed{f^{\\prime}(2)=1}\\)',
  },
  '1-2': {
    steps: [
      'a) Per \\(f(x)=3x+5\\): \\(\\frac{f(x+h)-f(x)}h=\\frac{3h}{h}=3\\), quindi \\(f^{\\prime}(x)=3\\).',
      'b) Per \\(f(x)=x^3\\): $$\\frac{(x+h)^3-x^3}{h}=3x^2+3xh+h^2\\longrightarrow3x^2.$$',
      'c) Per \\(f(x)=1/x\\), con \\(x\\ne0\\): $$\\frac{1/(x+h)-1/x}{h}=-\\frac{1}{x(x+h)}\\longrightarrow-\\frac1{x^2}.$$',
      'La funzione \\(1/x\\) e la sua derivata hanno dominio \\(\\mathbb R\\setminus\\{0\\}\\).',
    ],
    result: '\\(\\boxed{3}\\), \\(\\boxed{3x^2}\\), \\(\\boxed{-1/x^2}\\)',
  },
  '1-3': {
    steps: [
      'Poiché \\(f(x)=x^2\\), si ha \\(f^{\\prime}(x)=2x\\). In \\(x_0=3\\): \\(m=6\\) e \\(P=(3,9)\\), dunque \\(y-9=6(x-3)\\).',
      'Una tangente parallela all’asse x ha pendenza zero: \\(2x=0\\), quindi il punto è \\((0,0)\\).',
      'Un angolo di \\(45^\\circ\\) dà pendenza \\(\\tan45^\\circ=1\\): \\(2x=1\\), quindi \\(x=1/2\\) e \\(P=(1/2,1/4)\\).',
    ],
    result: '\\(\\boxed{y=6x-9}\\); punto \\((0,0)\\); \\(\\boxed{y=x-1/4}\\)',
  },
  '1-4': {
    steps: [
      'Scriviamo la funzione a tratti: \\(f(x)=2-x\\) se \\(x<2\\), mentre \\(f(x)=x-2\\) se \\(x\\ge2\\).',
      'La derivata sinistra vale \\(f_-^{\\prime}(2)=-1\\); la derivata destra vale \\(f_+^{\\prime}(2)=1\\).',
      'I due limiti sono finiti ma diversi: nel grafico compare un punto angoloso.',
    ],
    result: '\\(\\boxed{f\\text{ non è derivabile in }x=2}\\)',
  },
  '1-5': {
    steps: [
      'La forma a tratti è \\(x|x|=-x^2\\) per \\(x<0\\) e \\(x|x|=x^2\\) per \\(x\\ge0\\).',
      'Dal rapporto incrementale in zero: \\(\\frac{f(h)-f(0)}h=|h|\\).',
      'Sia da sinistra sia da destra \\(|h|\\to0\\), quindi i due limiti coincidono.',
    ],
    result: '\\(\\boxed{f^{\\prime}(0)=0}\\): la funzione è derivabile in zero.',
  },
  '2-1': {
    steps: [
      'a) Applichiamo la regola di potenza termine per termine: \\((5x^4-3x^2+7)^{\\prime}=20x^3-6x\\).',
      'b) Scriviamo \\(\\sqrt x=x^{1/2}\\) e \\(1/x^2=x^{-2}\\): la derivata è \\(1/(2\\sqrt x)-2/x^3\\), per \\(x>0\\).',
      'c) \\((2e^x-4\\ln x)^{\\prime}=2e^x-4/x\\), con \\(x>0\\).',
      'd) \\((3\\sin x-\\cos x)^{\\prime}=3\\cos x+\\sin x\\).',
    ],
    result: '\\(\\boxed{20x^3-6x}\\); \\(\\boxed{\\frac1{2\\sqrt x}-\\frac2{x^3}}\\); \\(\\boxed{2e^x-\\frac4x}\\); \\(\\boxed{3\\cos x+\\sin x}\\)',
  },
  '2-2': {
    steps: [
      'a) Con \\(u=x^2\\), \\(v=\\sin x\\): \\((uv)^{\\prime}=2x\\sin x+x^2\\cos x\\).',
      'b) Con \\(u=e^x\\), \\(v=\\cos x\\): \\((uv)^{\\prime}=e^x\\cos x-e^x\\sin x\\).',
    ],
    result: '\\(\\boxed{2x\\sin x+x^2\\cos x}\\); \\(\\boxed{e^x(\\cos x-\\sin x)}\\)',
  },
  '2-3': {
    steps: [
      'a) Regola del quoziente: $$\\left(\\frac{x^2+1}{x-1}\\right)^{\\prime}=\\frac{2x(x-1)-(x^2+1)}{(x-1)^2}=\\frac{x^2-2x-1}{(x-1)^2}.$$',
      'b) Scrivendo \\(\\tan x=\\sin x/\\cos x\\): $$\\frac{\\cos^2x+\\sin^2x}{\\cos^2x}=\\frac1{\\cos^2x}.$$',
    ],
    result: '\\(\\boxed{\\frac{x^2-2x-1}{(x-1)^2}}\\); \\(\\boxed{\\sec^2x}\\), dove \\(\\cos x\\ne0\\)',
  },
  '2-4': {
    steps: [
      'a) Esterna seno, interna \\(x^2\\): \\(2x\\cos(x^2)\\).',
      'b) Esterna esponenziale, interna \\(3x-1\\): \\(3e^{3x-1}\\).',
      'c) Esterna quarta potenza, interna \\(x^3+5\\): \\(4(x^3+5)^3\\cdot3x^2=12x^2(x^3+5)^3\\).',
      'd) Esterna logaritmo, interna \\(\\cos x\\): \\(-\\sin x/\\cos x=-\\tan x\\), nel dominio \\(\\cos x>0\\).',
    ],
    result: '\\(\\boxed{2x\\cos(x^2)}\\); \\(\\boxed{3e^{3x-1}}\\); \\(\\boxed{12x^2(x^3+5)^3}\\); \\(\\boxed{-\\tan x}\\)',
  },
  '2-5': {
    steps: [
      'Deriviamo due volte: \\(f^{\\prime}(x)=4x^3-12x\\) e \\(f^{\\prime\\prime}(x)=12x^2-12=12(x^2-1)\\).',
      'Ponendo \\(f^{\\prime\\prime}(x)=0\\) troviamo \\(x=-1\\) e \\(x=1\\). Il segno della derivata seconda cambia in entrambi.',
      'Calcolando le ordinate: \\(f(-1)=f(1)=-4\\).',
    ],
    result: '\\(\\boxed{(-1,-4)\\text{ e }(1,-4)}\\) sono punti di flesso.',
  },
  '2-6': {
    steps: [
      'Prodotto e catena danno \\(f^{\\prime}(x)=e^x\\sin(2x)+2e^x\\cos(2x)=e^x[\\sin(2x)+2\\cos(2x)]\\).',
      'Poiché \\(e^x>0\\), imponiamo \\(\\sin(2x)+2\\cos(2x)=0\\), cioè \\(\\tan(2x)=-2\\).',
      'Posto \\(\\alpha=\\arctan2\\), nell’intervallo \\([0,\\pi]\\) si ottengono \\(x=(\\pi-\\alpha)/2\\) e \\(x=\\pi-\\alpha/2\\).',
    ],
    result: '\\(\\boxed{x=\\frac{\\pi-\\arctan2}{2},\\quad x=\\pi-\\frac{\\arctan2}{2}}\\)',
  },
};

export function WorksheetPage() {
  const { sheetId = '' } = useParams();
  const [openSolutions, setOpenSolutions] = useState<string[]>([]);
  if (sheetId !== '1' && sheetId !== '2') return <Navigate to="/" replace />;
  const first = sheetId === '1';
  const exercises = first ? sheetOne : sheetTwo;
  const title = first ? 'Definizione e significato geometrico' : 'Regole di derivazione';
  const time = first ? '25 minuti' : '30 minuti';

  const revealSolution = (key: string) => {
    setOpenSolutions((current) => current.includes(key) ? current : [...current, key]);
    window.requestAnimationFrame(() => {
      document.getElementById(`solution-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <Box sx={{ maxWidth: 940, mx: 'auto' }} className="print-document">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1.5} mb={4} className="no-print">
        <Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />} color="inherit">Panoramica</Button>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
          <Chip label="Correzione guidata · una soluzione alla volta" color="warning" variant="outlined" />
          <Button variant="outlined" startIcon={<PrintRoundedIcon />} onClick={() => window.print()}>Stampa scheda</Button>
        </Stack>
      </Stack>
      <Box component="header" sx={{ mb: 4, borderBottom: '2px solid', borderColor: 'text.primary', pb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
          <Box><Typography variant="h4" color="primary.main" mb={1}>Scheda esercizi §{sheetId}</Typography><Typography variant="h1" sx={{ fontSize: { xs: '2.7rem', sm: '3.7rem' } }}>{title}</Typography></Box>
          <Box sx={{ textAlign: { sm: 'right' } }}><Chip label={time} variant="outlined" /><Typography variant="body2" color="text.secondary" mt={1}>Nome ____________________</Typography></Box>
        </Stack>
      </Box>
      <Typography color="text.secondary" mb={3}>Mostra tutti i passaggi. Nei calcoli per definizione, scrivi il rapporto incrementale prima di eseguire le semplificazioni.</Typography>

      <Stack spacing={2}>
        {exercises.map((exercise) => {
          const key = `${sheetId}-${exercise.number}`;
          const solutionOpen = openSolutions.includes(key);
          const solution = solutions[key];

          return (
            <Paper key={exercise.number} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden', breakInside: 'avoid' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '36px minmax(0,1fr)', sm: '44px minmax(0,1fr)' }, gap: { xs: 1.25, sm: 2 }, p: { xs: 2, sm: 2.5 } }}>
                <Box sx={{ width: { xs: 34, sm: 40 }, height: { xs: 34, sm: 40 }, borderRadius: '50%', bgcolor: 'custom.ink', color: 'white', display: 'grid', placeItems: 'center', fontFamily: 'Crimson Pro', fontSize: '1.25rem', fontWeight: 700 }}>{exercise.number}</Box>
                <Box>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
                    <Typography variant="h3" sx={{ fontSize: '1.35rem' }}>{exercise.title}</Typography>
                    <Stack direction="row" gap={1} flexWrap="wrap"><Chip size="small" label={exercise.type} variant="outlined" /><Chip size="small" label={exercise.difficulty} color={exercise.difficulty === 'Base' ? 'success' : exercise.difficulty === '★★★' ? 'warning' : 'primary'} variant="outlined" /></Stack>
                  </Stack>
                  <Typography component="div" sx={{ mt: 1.5 }}><MathText text={exercise.prompt} /></Typography>
                  <Button
                    color="warning"
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityRoundedIcon />}
                    onClick={() => revealSolution(key)}
                    sx={{ display: { xs: 'inline-flex', sm: 'none' }, mt: 2 }}
                  >
                    Vedi soluzione svolta
                  </Button>
                  <Box className="digital-workspace" sx={{ mt: 2 }}><DigitalWorkspace workspaceKey={`worksheet-${key}`} label={`Scheda ${sheetId} · Esercizio ${exercise.number}`} problemTitle={exercise.title} problemText={exercise.prompt} onShowSolution={() => revealSolution(key)} /></Box>
                </Box>
              </Box>

              <Accordion
                id={`solution-${key}`}
                className="digital-workspace"
                expanded={solutionOpen}
                onChange={() => setOpenSolutions((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])}
                disableGutters
                elevation={0}
                sx={{ borderTop: '1px solid', borderColor: solutionOpen ? 'warning.main' : 'divider', bgcolor: solutionOpen ? 'rgba(237, 166, 20, 0.07)' : 'background.paper', borderRadius: '0 !important', '&::before': { display: 'none' }, scrollMarginTop: 84 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                  <Stack direction="row" gap={1} alignItems="center"><VisibilityRoundedIcon color="warning" /><Typography fontWeight={700}>Soluzione guidata con i passaggi</Typography></Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
                  <ProgressiveSolution steps={solution.steps} result={solution.result} />
                </AccordionDetails>
              </Accordion>

              <Box className="print-writing-space" sx={{ display: 'none', height: 190, backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #C9D5E8 32px)' }} />
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
