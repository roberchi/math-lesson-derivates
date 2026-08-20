import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Link } from 'react-router-dom';
import { WritingCanvas } from '@/components/labs/WritingCanvas';
import { MathText } from '@/components/math/MathText';

const problems = [
  {
    number: 1,
    points: 6,
    title: 'Definizione e calcolo dal limite',
    prompt: 'Enuncia la definizione formale di derivata in un punto. Poi calcola, esclusivamente dal rapporto incrementale, la derivata di \\(f(x)=2x^2-x\\).',
    steps: [
      'Definizione: \\(f^{\\prime}(a)=\\displaystyle\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}\\), purché il limite esista e sia finito.',
      'Calcoliamo i due valori: \\(f(a+h)=2(a+h)^2-(a+h)\\) e \\(f(a)=2a^2-a\\).',
      'Sostituiamo e sviluppiamo: $$\\frac{f(a+h)-f(a)}{h}=\\frac{2a^2+4ah+2h^2-a-h-2a^2+a}{h}.$$ ',
      'Raccogliamo \\(h\\) al numeratore e semplifichiamo, con \\(h\\neq0\\): $$\\frac{h(4a+2h-1)}{h}=4a+2h-1.$$ ',
      'Passando al limite per \\(h\\to0\\) otteniamo \\(f^{\\prime}(a)=4a-1\\), quindi \\(f^{\\prime}(x)=4x-1\\).',
    ],
    result: '\\(\\boxed{f^{\\prime}(x)=4x-1}\\)',
  },
  {
    number: 2,
    points: 6,
    title: 'Tangente e normale',
    prompt: 'Data \\(f(x)=x^3-3x\\) e il punto \\(P=(2,2)\\), trova le equazioni della retta tangente e della retta normale al grafico in P.',
    steps: [
      'Deriviamo: \\(f^{\\prime}(x)=3x^2-3\\). Nel punto \\(x=2\\), il coefficiente angolare della tangente è \\(m_t=f^{\\prime}(2)=12-3=9\\).',
      'Usiamo la forma punto–pendenza: \\(y-2=9(x-2)\\). Sviluppando si ottiene \\(y=9x-16\\).',
      'La normale è perpendicolare alla tangente, quindi il suo coefficiente angolare è il reciproco cambiato di segno: \\(m_n=-1/9\\).',
      'Ancora con la forma punto–pendenza: \\(y-2=-\\frac19(x-2)\\), cioè \\(y=-\\frac19x+\\frac{20}{9}\\).',
    ],
    result: '\\(\\boxed{t:y=9x-16}\\) e \\(\\boxed{n:y=-\\frac19x+\\frac{20}{9}}\\)',
  },
  {
    number: 3,
    points: 10,
    title: 'Regole di derivazione',
    prompt: 'Calcola le derivate mostrando la regola usata: a) \\(x^2e^x\\); b) \\((x^2+1)/(x-1)\\); c) \\(\\sin(3x^2)\\); d) \\(\\ln(1+x^2)\\).',
    steps: [
      'a) Regola del prodotto: \\((uv)^{\\prime}=u^{\\prime}v+uv^{\\prime}\\). Quindi \\((x^2e^x)^{\\prime}=2xe^x+x^2e^x=e^x(x^2+2x)\\).',
      'b) Regola del quoziente: $$\\left(\\frac{x^2+1}{x-1}\\right)^{\\prime}=\\frac{2x(x-1)-(x^2+1)}{(x-1)^2}=\\frac{x^2-2x-1}{(x-1)^2}.$$ ',
      'c) Regola della funzione composta: la derivata esterna è \\(\\cos(3x^2)\\), quella interna è \\(6x\\). Dunque \\((\\sin(3x^2))^{\\prime}=6x\\cos(3x^2)\\).',
      'd) Ancora funzione composta: \\((\\ln u)^{\\prime}=u^{\\prime}/u\\), con \\(u=1+x^2\\). Quindi \\((\\ln(1+x^2))^{\\prime}=\\frac{2x}{1+x^2}\\).',
    ],
    result: '\\(\\boxed{e^x(x^2+2x)}\\); \\(\\boxed{\\frac{x^2-2x-1}{(x-1)^2}}\\); \\(\\boxed{6x\\cos(3x^2)}\\); \\(\\boxed{\\frac{2x}{1+x^2}}\\)',
  },
  {
    number: 4,
    points: 8,
    title: 'Sfida',
    prompt: 'Per \\(f(x)=xe^x\\): a) calcola \\(f′(x)\\) e \\(f′′(x)\\); b) trova e classifica i punti stazionari; c) costruisci il polinomio di Taylor di ordine 3 centrato in zero.',
    steps: [
      'Con la regola del prodotto: \\(f^{\\prime}(x)=e^x+xe^x=e^x(x+1)\\). Derivando ancora: \\(f^{\\prime\\prime}(x)=e^x(x+1)+e^x=e^x(x+2)\\).',
      'I punti stazionari soddisfano \\(e^x(x+1)=0\\). Poiché \\(e^x>0\\), deve essere \\(x=-1\\); il punto è \\((-1,-e^{-1})\\).',
      'Classificazione: \\(f^{\\prime\\prime}(-1)=e^{-1}>0\\), quindi il punto stazionario è un minimo locale.',
      'Per Taylor servono i valori in zero: \\(f(0)=0\\), \\(f^{\\prime}(0)=1\\), \\(f^{\\prime\\prime}(0)=2\\). Inoltre \\(f^{\\prime\\prime\\prime}(x)=e^x(x+3)\\), quindi \\(f^{\\prime\\prime\\prime}(0)=3\\).',
      'Applichiamo la formula: $$T_3(x)=f(0)+f^{\\prime}(0)x+\\frac{f^{\\prime\\prime}(0)}{2!}x^2+\\frac{f^{\\prime\\prime\\prime}(0)}{3!}x^3=x+x^2+\\frac{x^3}{2}.$$ ',
    ],
    result: '\\(\\boxed{f^{\\prime}=e^x(x+1),\\ f^{\\prime\\prime}=e^x(x+2)}\\), minimo in \\((-1,-e^{-1})\\), \\(\\boxed{T_3(x)=x+x^2+\\frac12x^3}\\)',
  },
];

export function VerificationPage() {
  const [openSolutions, setOpenSolutions] = useState<number[]>([]);
  const allSolutionsOpen = openSolutions.length === problems.length;

  const toggleAllSolutions = () => {
    setOpenSolutions(allSolutionsOpen ? [] : problems.map((problem) => problem.number));
  };

  const toggleSolution = (problemNumber: number) => {
    setOpenSolutions((current) => (
      current.includes(problemNumber)
        ? current.filter((number) => number !== problemNumber)
        : [...current, problemNumber]
    ));
  };

  const revealSolution = (problemNumber: number) => {
    setOpenSolutions((current) => current.includes(problemNumber) ? current : [...current, problemNumber]);
    window.requestAnimationFrame(() => {
      document.getElementById(`solution-problem-${problemNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <Box sx={{ maxWidth: 940, mx: 'auto' }} className="print-document">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1.5} mb={4} className="no-print">
        <Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />} color="inherit">Panoramica</Button>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
          <Button
            variant={allSolutionsOpen ? 'outlined' : 'contained'}
            color="warning"
            startIcon={allSolutionsOpen ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
            onClick={toggleAllSolutions}
          >
            {allSolutionsOpen ? 'Nascondi tutte le soluzioni' : 'Mostra tutte le soluzioni'}
          </Button>
          <Button variant="outlined" startIcon={<PrintRoundedIcon />} onClick={() => window.print()}>Stampa verifica</Button>
        </Stack>
      </Stack>

      <Box component="header" sx={{ mb: 4, borderBottom: '2px solid', borderColor: 'text.primary', pb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h4" color="primary.main" mb={1}>Verifica finale</Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', sm: '4rem' } }}>Derivate</Typography>
            <Typography color="text.secondary" mt={1}>Svolgi prima la prova, poi apri le soluzioni guidate per correggerti.</Typography>
          </Box>
          <Stack alignItems={{ sm: 'flex-end' }} gap={1}>
            <Chip label="45 minuti" variant="outlined" />
            <Chip label="30 punti" color="primary" />
            <Typography variant="body2">Nome ____________________</Typography>
          </Stack>
        </Stack>
      </Box>

      <Stack spacing={2.5}>
        {problems.map((problem) => {
          const solutionOpen = openSolutions.includes(problem.number);
          return (
            <Paper key={problem.number} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden', breakInside: 'avoid' }}>
              <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Stack direction="row" justifyContent="space-between" gap={2} mb={1.5}>
                  <Typography variant="h3" sx={{ fontSize: '1.45rem' }}>{problem.number}. {problem.title}</Typography>
                  <Chip label={`${problem.points} pt`} color="primary" variant="outlined" />
                </Stack>
                <Typography component="div" mb={2.5}><MathText text={problem.prompt} /></Typography>
                <Box className="digital-workspace"><WritingCanvas label={`Problema ${problem.number}`} onShowSolution={() => revealSolution(problem.number)} /></Box>
                <Box className="print-writing-space" sx={{ display: 'none', height: 250, backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #C9D5E8 32px)' }} />
              </Box>

              <Accordion
                id={`solution-problem-${problem.number}`}
                className="digital-workspace"
                expanded={solutionOpen}
                onChange={() => toggleSolution(problem.number)}
                disableGutters
                elevation={0}
                sx={{
                  borderTop: '1px solid',
                  borderColor: solutionOpen ? 'success.light' : 'divider',
                  bgcolor: solutionOpen ? 'rgba(46, 125, 50, 0.045)' : 'background.paper',
                  '&::before': { display: 'none' },
                  scrollMarginTop: 84,
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ px: { xs: 2.5, sm: 3 } }}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <CheckCircleOutlineRoundedIcon color={solutionOpen ? 'success' : 'disabled'} />
                    <Typography fontWeight={700}>{solutionOpen ? 'Soluzione guidata' : 'Controlla la soluzione e i passaggi'}</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 2.5, sm: 3 }, pb: 3 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>Confronta ogni passaggio con il tuo svolgimento, non soltanto il risultato finale.</Alert>
                  <Stack component="ol" spacing={1.5} sx={{ pl: 2.5, my: 0 }}>
                    {problem.steps.map((step, index) => (
                      <Typography component="li" key={index} color="text.secondary" sx={{ pl: 0.5 }}>
                        <MathText text={step} />
                      </Typography>
                    ))}
                  </Stack>
                  <Box sx={{ mt: 2.5, p: 2, borderRadius: 1.5, bgcolor: 'success.main', color: 'success.contrastText' }}>
                    <Typography variant="overline" fontWeight={800}>Risultato</Typography>
                    <Typography component="div"><MathText text={problem.result} /></Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
