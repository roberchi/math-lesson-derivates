import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { BlockMath, InlineMath } from 'react-katex';

type BuildLayer = {
  label: string;
  action: string;
  formula: string;
  color: string;
};

const buildLayers: BuildLayer[] = [
  { label: 'Ingresso', action: 'parti dalla variabile', formula: 'x', color: '#91A3FA' },
  { label: 'Strato interno', action: 'eleva al quadrato', formula: 'x^2', color: '#4DD4A4' },
  { label: 'Strato esterno', action: 'applica il seno', formula: '\\sin(x^2)', color: '#F4C84A' },
];

const derivativeLayers = [
  {
    number: 1,
    label: 'PARTI DALL’ESTERNO',
    title: 'Deriva il seno, ma lascia fermo ciò che contiene',
    formula: '\\sin(\\boxed{x^2})\\;\\longrightarrow\\;\\cos(\\boxed{x^2})',
    explanation: 'La derivata di seno è coseno. In questo primo passaggio x² resta dentro le parentesi, identico: non lo abbiamo ancora derivato.',
    color: '#F4C84A',
  },
  {
    number: 2,
    label: 'ENTRA NELLO STRATO SUCCESSIVO',
    title: 'Ora deriva la parte interna',
    formula: '(x^2)\' = 2x',
    explanation: 'Tolto lo strato del seno, incontriamo la funzione elementare x². La sua derivata è 2x.',
    color: '#4DD4A4',
  },
  {
    number: 3,
    label: 'COLLEGA GLI EFFETTI',
    title: 'Moltiplica le derivate raccolte lungo il percorso',
    formula: '(\\sin(x^2))\'=\\cos(x^2)\\cdot 2x',
    explanation: 'Il primo fattore racconta come reagisce il seno; il secondo racconta quanto velocemente cambia il suo ingresso x².',
    color: '#91A3FA',
  },
];

const deepLayers = [
  {
    number: 1,
    layer: 'Esterno',
    before: 'e^{\\boxed{\\sin(x^2)}}',
    after: 'e^{\\sin(x^2)}',
    reading: 'L’esponenziale rimane esponenziale. Tutto ciò che sta nell’esponente resta fermo per ora.',
  },
  {
    number: 2,
    layer: 'Intermedio',
    before: '\\sin(\\boxed{x^2})',
    after: '\\cos(x^2)',
    reading: 'Entriamo nell’esponente: il seno diventa coseno, mantenendo x² come argomento.',
  },
  {
    number: 3,
    layer: 'Interno',
    before: 'x^2',
    after: '2x',
    reading: 'Arriviamo all’ultimo strato, la potenza, e la deriviamo.',
  },
];

export function ChainRuleLayers() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography paragraph>
          Una funzione composta è una funzione <strong>dentro</strong> un’altra. Il valore di <InlineMath math="x" /> non arriva direttamente al seno: prima viene trasformato in <InlineMath math="x^2" />, poi il risultato entra nel seno. Ogni trasformazione è uno <strong>strato</strong>.
        </Typography>
        <Typography color="text.secondary">
          Pensa a una cipolla: la formula esterna avvolge quelle interne. Per derivare correttamente togliamo uno strato alla volta, senza saltarne nessuno.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'custom.ink', color: '#F2F5FA', overflow: 'hidden' }}>
        <Typography variant="overline" sx={{ color: '#91A3FA' }}>PRIMA: COME SI COSTRUISCE LA FUNZIONE</Typography>
        <Typography variant="h3" mt={.5} mb={1}>Dall’interno verso l’esterno</Typography>
        <Typography sx={{ color: '#C9D2E0', mb: 2.5 }}>Segui il viaggio del valore di x: l’uscita di uno strato diventa l’ingresso del successivo.</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="stretch" spacing={{ xs: 1, sm: 1.5 }} aria-label="Costruzione a strati di seno di x quadrato">
          {buildLayers.map((layer, index) => (
            <Stack key={layer.label} direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={{ xs: 1, sm: 1.5 }} sx={{ flex: index === buildLayers.length - 1 ? 1.15 : 1 }}>
              <Paper elevation={0} sx={{ width: '100%', minHeight: 132, p: 2, bgcolor: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.16)', color: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: layer.color, fontWeight: 850 }}>{layer.label.toUpperCase()}</Typography>
                  <Typography variant="body2" sx={{ color: '#C9D2E0', mt: .35 }}>{layer.action}</Typography>
                </Box>
                <Box sx={{ fontSize: { xs: '1.15rem', sm: '1.3rem' }, overflowX: 'auto', '& .katex-display': { m: 0 } }}><BlockMath math={layer.formula} /></Box>
              </Paper>
              {index < buildLayers.length - 1 && <ArrowForwardRoundedIcon sx={{ color: '#91A3FA', fontSize: 32, transform: { xs: 'rotate(90deg)', sm: 'none' }, flexShrink: 0 }} />}
            </Stack>
          ))}
        </Stack>
        <Box sx={{ mt: 2.5, p: 2, borderLeft: '3px solid #F4C84A', bgcolor: 'rgba(244,200,74,.08)' }}>
          <Typography fontWeight={750}>In simboli: <InlineMath math="u=x^2" />, poi <InlineMath math="y=\sin u" />. Quindi <InlineMath math="y=\sin(x^2)" />.</Typography>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="overline" color="primary.main">POI: COME SI DERIVA</Typography>
        <Typography variant="h3" mt={.5}>Dall’esterno verso l’interno</Typography>
        <Typography color="text.secondary" mt={1} mb={3}>
          Ora invertiamo lo sguardo: partiamo dall’ultimo strato applicato, quello più esterno. Dopo averlo derivato entriamo nello strato successivo e moltiplichiamo il nuovo fattore.
        </Typography>

        <Stack>
          {derivativeLayers.map((step, index) => (
            <Box key={step.number} sx={{ position: 'relative', display: 'grid', gridTemplateColumns: '48px minmax(0,1fr)', columnGap: { xs: 1.5, sm: 2 } }}>
              {index < derivativeLayers.length - 1 && <Box sx={{ position: 'absolute', left: 23, top: 45, bottom: -5, width: 2, bgcolor: 'rgba(65,88,208,.22)' }} />}
              <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: step.color, color: '#101A30', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '1.1rem', zIndex: 1 }}>{step.number}</Box>
              <Box sx={{ pb: index < derivativeLayers.length - 1 ? 3.5 : 0, minWidth: 0 }}>
                <Typography variant="caption" color="primary.main" fontWeight={850}>{step.label}</Typography>
                <Typography variant="h4" mt={.25}>{step.title}</Typography>
                <Paper elevation={0} sx={{ my: 1.25, px: 2, py: 1.25, bgcolor: 'rgba(65,88,208,.07)', overflowX: 'auto', fontSize: { xs: '1.05rem', sm: '1.22rem' }, '& .katex-display': { m: 0 } }}>
                  <BlockMath math={step.formula} />
                </Paper>
                <Typography variant="body2" color="text.secondary">{step.explanation}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}>
        <Typography variant="h3" mb={1}>Perché le derivate si moltiplicano?</Typography>
        <Typography paragraph>
          Una piccola variazione di <InlineMath math="x" /> viene prima moltiplicata dallo strato <InlineMath math="x^2" /> per il fattore <InlineMath math="2x" />: il valore assoluto indica quanto cambia, il segno anche in quale verso. Quella variazione arriva poi al seno e viene moltiplicata ancora per <InlineMath math="\cos(x^2)" />.
        </Typography>
        <Typography fontWeight={750}>L’effetto totale è il prodotto degli effetti attraversati:</Typography>
        <Box sx={{ overflowX: 'auto', fontSize: { xs: '1.05rem', sm: '1.22rem' }, '& .katex-display': { mb: 0 } }}>
          <BlockMath math="\underbrace{\frac{dy}{du}}_{\text{effetto del seno}}\cdot\underbrace{\frac{du}{dx}}_{\text{effetto del quadrato}}=\cos(x^2)\cdot2x" />
        </Box>
      </Paper>

      <Box>
        <Typography variant="overline" color="primary.main">UNA CIPOLLA CON TRE STRATI</Typography>
        <Typography variant="h3" mt={.5}>E se la funzione fosse <InlineMath math="e^{\sin(x^2)}" />?</Typography>
        <Typography color="text.secondary" mt={1} mb={2.5}>
          Il metodo non cambia. Continuiamo a entrare finché arriviamo a x, raccogliendo un fattore per ogni strato.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) 310px' }, gap: 2.5, alignItems: 'stretch' }}>
          <Stack spacing={1.25}>
            {deepLayers.map((step) => (
              <Paper key={step.number} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Chip label={step.number} color="primary" sx={{ fontWeight: 850 }} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="caption" color="primary.main" fontWeight={850}>STRATO {step.layer.toUpperCase()}</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={1} sx={{ my: .75, fontSize: '1.05rem' }}>
                      <Box sx={{ overflowX: 'auto' }}><InlineMath math={step.before} /></Box>
                      <ArrowForwardRoundedIcon color="primary" sx={{ transform: { xs: 'rotate(90deg)', sm: 'none' } }} />
                      <Box sx={{ color: 'primary.main', overflowX: 'auto' }}><InlineMath math={step.after} /></Box>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{step.reading}</Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'custom.ink', color: '#F2F5FA', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#91A3FA', fontWeight: 850 }}>MOLTIPLICA I TRE FATTORI</Typography>
            <Box sx={{ my: 1.5, overflowX: 'auto', fontSize: { xs: '1rem', sm: '1.12rem' }, '& .katex-display': { m: 0 } }}>
              <BlockMath math="\left(e^{\sin(x^2)}\right)'=e^{\sin(x^2)}\cdot\cos(x^2)\cdot2x" />
            </Box>
            <Stack spacing={.75} sx={{ color: '#C9D2E0', textAlign: 'left' }}>
              <Typography variant="body2">1. derivata dell’esponenziale</Typography>
              <ArrowDownwardRoundedIcon sx={{ alignSelf: 'center', color: '#91A3FA' }} />
              <Typography variant="body2">2. derivata del seno</Typography>
              <ArrowDownwardRoundedIcon sx={{ alignSelf: 'center', color: '#91A3FA' }} />
              <Typography variant="body2">3. derivata del quadrato</Typography>
            </Stack>
          </Paper>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, border: '1px solid', borderColor: 'rgba(65,88,208,.3)' }}>
        <Typography variant="h3" mb={2}>La procedura da riutilizzare sempre</Typography>
        <Stack spacing={1.5}>
          {[
            ['1', 'Cerchia mentalmente gli strati', 'Individua quale funzione avvolge tutte le altre, poi quali sono contenute al suo interno.'],
            ['2', 'Deriva lo strato esterno', 'Lascia invariato tutto ciò che è dentro le sue parentesi.'],
            ['3', 'Entra di uno strato e moltiplica', 'Ripeti: deriva il nuovo strato, conserva ciò che contiene e aggiungi il fattore al prodotto.'],
            ['4', 'Fermati quando raggiungi x', 'A quel punto hai attraversato tutti gli strati; puoi riordinare e semplificare il prodotto.'],
          ].map(([number, title, text]) => (
            <Box key={number} sx={{ display: 'grid', gridTemplateColumns: '36px minmax(0,1fr)', gap: 1.5, alignItems: 'start' }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 850 }}>{number}</Box>
              <Box><Typography fontWeight={800}>{title}</Typography><Typography variant="body2" color="text.secondary">{text}</Typography></Box>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
