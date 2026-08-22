import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import { Link } from 'react-router-dom';
import { DigitalWorkspace } from '@/components/labs/DigitalWorkspace';
import { MathText } from '@/components/math/MathText';
import { ProgressiveSolution } from '@/components/lesson/ProgressiveSolution';

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
    rubric: '2 pt definizione corretta · 3 pt sviluppo del rapporto · 1 pt limite e risultato',
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
    rubric: '2 pt derivata e pendenza · 2 pt tangente · 2 pt normale',
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
    rubric: '2,5 pt per ciascuna derivata: regola indicata, passaggi e risultato',
  },
  {
    number: 4,
    points: 8,
    title: 'Derivata seconda e concavità',
    prompt: 'Per \\(f(x)=xe^x\\): a) calcola \\(f′(x)\\) e \\(f′′(x)\\); b) trova e classifica il punto stazionario; c) individua dove cambia la concavità e il flesso.',
    steps: [
      'Con la regola del prodotto: \\(f^{\\prime}(x)=e^x+xe^x=e^x(x+1)\\). Derivando ancora: \\(f^{\\prime\\prime}(x)=e^x(x+1)+e^x=e^x(x+2)\\).',
      'I punti stazionari soddisfano \\(e^x(x+1)=0\\). Poiché \\(e^x>0\\), deve essere \\(x=-1\\); il punto è \\((-1,-e^{-1})\\).',
      'Classificazione: \\(f^{\\prime\\prime}(-1)=e^{-1}>0\\), quindi il punto stazionario è un minimo locale.',
      'Poiché \\(e^x>0\\), il segno di \\(f^{\\prime\\prime}(x)=e^x(x+2)\\) dipende da \\(x+2\\): è negativo per \\(x<-2\\) e positivo per \\(x>-2\\).',
      'La concavità cambia in \\(x=-2\\), quindi il flesso è \\((-2,-2e^{-2})\\).',
    ],
    result: '\\(\\boxed{f^{\\prime}=e^x(x+1),\\ f^{\\prime\\prime}=e^x(x+2)}\\), minimo in \\((-1,-e^{-1})\\), flesso in \\((-2,-2e^{-2})\\)',
    rubric: '2 pt derivate · 3 pt punto stazionario e classificazione · 3 pt segno di f″ e flesso',
  },
];

export function VerificationPage() {
  const [openSolutions, setOpenSolutions] = useState<number[]>([]);
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
          <Chip label="Correzione guidata · una soluzione alla volta" color="warning" variant="outlined" />
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
                <Alert severity="info" icon={false} sx={{ mb: 2 }}><strong>Rubrica:</strong> {problem.rubric}</Alert>
                <Box className="digital-workspace"><DigitalWorkspace workspaceKey={`verification-${problem.number}`} label={`Verifica · Problema ${problem.number}`} problemTitle={problem.title} problemText={problem.prompt} onShowSolution={() => revealSolution(problem.number)} /></Box>
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
                  <ProgressiveSolution storageKey={`verification-${problem.number}`} steps={problem.steps} result={problem.result} />
                </AccordionDetails>
              </Accordion>
            </Paper>
          );
        })}
      </Stack>
      <Paper elevation={0} sx={{ mt: 3, p: 3, border: '1px dashed', borderColor: 'warning.main', bgcolor: 'custom.goldLight' }}>
        <Typography variant="h3" mb={1}>Sfida bonus · Taylor (non inclusa nei 30 punti)</Typography>
        <Typography>Costruisci il polinomio di Taylor di ordine 3, centrato in zero, per <MathText text="\\(f(x)=xe^x\\)" />. Usalo come approfondimento dopo aver concluso la prova base.</Typography>
      </Paper>
    </Box>
  );
}
