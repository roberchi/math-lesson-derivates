import { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { BlockMath, InlineMath } from 'react-katex';
import { HistoryNote } from '@/components/lesson/HistoryNote';
import { SectionBlock } from '@/components/lesson/LessonScaffold';
import { MathText } from '@/components/math/MathText';

type Sketch = 'fermat' | 'rolle' | 'lagrange' | 'monotone' | 'second-test' | 'convexity' | 'cauchy' | 'darboux' | 'lhopital' | 'inverse' | 'taylor-error';

interface TheoremInfo {
  title: string;
  subtitle: string;
  formula: string;
  hypotheses: string;
  geometry: string;
  use: string;
  caution: string;
  sketch: Sketch;
}

const existenceTheorems: TheoremInfo[] = [
  {
    title: 'Teorema di Fermat',
    subtitle: 'Dove cercare massimi e minimi',
    formula: "x_0\\text{ estremo interno e }f\\text{ derivabile}\\;\\Longrightarrow\\;f'(x_0)=0",
    hypotheses: 'Il punto \\(x_0\\) è interno al dominio, la funzione è derivabile in \\(x_0\\) e lì ha un massimo o minimo locale.',
    geometry: 'In un estremo regolare la curva non può continuare a salire o scendere: la tangente deve essere orizzontale.',
    use: 'Riduce la ricerca degli estremi ai punti stazionari e ai punti in cui la derivata non esiste.',
    caution: 'È una condizione necessaria, non sufficiente: \\(f(x)=x^3\\) ha \\(f^{\\prime}(0)=0\\), ma zero non è un estremo.',
    sketch: 'fermat',
  },
  {
    title: 'Teorema di Rolle',
    subtitle: 'Stessa quota, tangente orizzontale',
    formula: "f(a)=f(b)\\;\\Longrightarrow\\;\\exists c\\in(a,b):f'(c)=0",
    hypotheses: '\\(f\\) è continua su \\([a,b]\\), derivabile su \\((a,b)\\) e assume lo stesso valore agli estremi.',
    geometry: 'Se il percorso parte e arriva alla stessa altezza, in almeno un punto intermedio la tangente è orizzontale.',
    use: 'Permette di contare o separare gli zeri: tra due zeri distinti di \\(f\\) esiste almeno uno zero di \\(f^{\\prime}\\).',
    caution: 'Garantisce l’esistenza di almeno un punto, ma non dice dove sia né se sia unico.',
    sketch: 'rolle',
  },
  {
    title: 'Teorema di Lagrange',
    subtitle: 'Una velocità istantanea uguaglia quella media',
    formula: "\\exists c\\in(a,b):\\quad f'(c)=\\frac{f(b)-f(a)}{b-a}",
    hypotheses: '\\(f\\) è continua sull’intervallo chiuso \\([a,b]\\) e derivabile al suo interno.',
    geometry: 'Esiste almeno una tangente parallela alla corda che congiunge i due estremi del grafico.',
    use: 'Collega variazione totale e tasso istantaneo; permette anche di stimare quanto può cambiare una funzione.',
    caution: 'Il teorema garantisce \\(c\\), ma in generale non fornisce una formula per calcolarlo.',
    sketch: 'lagrange',
  },
];

const behaviorTheorems: TheoremInfo[] = [
  {
    title: 'Criterio di monotonia',
    subtitle: 'Il segno della derivata orienta il grafico',
    formula: "f'>0\\Rightarrow f\\text{ crescente},\\qquad f'<0\\Rightarrow f\\text{ decrescente}",
    hypotheses: '\\(f\\) è continua sull’intervallo e derivabile al suo interno; il segno di \\(f^{\\prime}\\) è controllato su tutto l’intervallo.',
    geometry: 'Tangenti con pendenza positiva accompagnano un grafico che sale; pendenze negative un grafico che scende.',
    use: 'Consente di confrontare valori della funzione senza calcolarli tutti e di leggere l’andamento locale.',
    caution: 'Uno zero isolato di \\(f^{\\prime}\\) non interrompe necessariamente la crescita: \\(x^3\\) resta crescente attraversando zero.',
    sketch: 'monotone',
  },
  {
    title: 'Test della derivata seconda',
    subtitle: 'Classificare un punto stazionario',
    formula: "f'(x_0)=0,\\quad f''(x_0)>0\\Rightarrow\\min,\\quad f''(x_0)<0\\Rightarrow\\max",
    hypotheses: 'La funzione è derivabile due volte vicino a \\(x_0\\) e \\(f^{\\prime}(x_0)=0\\).',
    geometry: 'Una tangente orizzontale dentro una coppa individua un minimo; dentro una cupola individua un massimo.',
    use: 'Classifica rapidamente molti punti stazionari senza costruire uno studio completo del segno di \\(f^{\\prime}\\).',
    caution: 'Se \\(f^{\\prime\\prime}(x_0)=0\\), il test non decide: \\(x^4\\), \\(-x^4\\) e \\(x^3\\) danno tre comportamenti diversi.',
    sketch: 'second-test',
  },
  {
    title: 'Criterio di convessità',
    subtitle: 'Il segno di f″ descrive la curvatura',
    formula: "f''>0\\Rightarrow\\text{concava verso l'alto},\\qquad f''<0\\Rightarrow\\text{concava verso il basso}",
    hypotheses: 'La derivata seconda esiste nell’intervallo considerato e mantiene lo stesso segno.',
    geometry: 'Con \\(f^{\\prime\\prime}>0\\) le tangenti restano sotto il grafico; con \\(f^{\\prime\\prime}<0\\) restano sopra.',
    use: 'Permette di capire verso dove piega la curva e di riconoscere possibili cambi di concavità.',
    caution: 'Il solo valore \\(f^{\\prime\\prime}(x_0)=0\\) non basta per affermare che \\(x_0\\) sia un flesso: serve un cambio di concavità.',
    sketch: 'convexity',
  },
];

const advancedTheorems: TheoremInfo[] = [
  {
    title: 'Teorema di Cauchy',
    subtitle: 'Due variazioni confrontate nello stesso punto',
    formula: "\\frac{f(b)-f(a)}{g(b)-g(a)}=\\frac{f'(c)}{g'(c)}",
    hypotheses: '\\(f\\) e \\(g\\) sono continue su \\([a,b]\\), derivabili in \\((a,b)\\) e \\(g^{\\prime}\\neq0\\).',
    geometry: 'La curva parametrica \\((g(t),f(t))\\) possiede una tangente parallela alla corda tra gli estremi.',
    use: 'Confronta due grandezze che cambiano insieme ed è la base teorica della regola di de l’Hôpital.',
    caution: 'Occorre controllare le ipotesi su entrambe le funzioni e che il denominatore del rapporto sia significativo.',
    sketch: 'cauchy',
  },
  {
    title: 'Teorema di Darboux',
    subtitle: 'Le pendenze non possono saltare',
    formula: "f'(a)<m<f'(b)\\;\\Longrightarrow\\;\\exists c:f'(c)=m",
    hypotheses: '\\(f\\) è derivabile su un intervallo; non è necessario supporre continua la funzione derivata.',
    geometry: 'Mentre la tangente ruota da una pendenza a un’altra, assume tutte le inclinazioni intermedie.',
    use: 'Permette di escludere che una funzione a gradino sia la derivata di qualche funzione.',
    caution: 'Avere tutti i valori intermedi non significa essere continua: una derivata può essere discontinua senza fare salti.',
    sketch: 'darboux',
  },
  {
    title: 'Regola di de l’Hôpital',
    subtitle: 'Confrontare velocità di annullamento o crescita',
    formula: "\\lim\\frac{f}{g}\\overset{0/0\\text{ o }\\infty/\\infty}{=}\\lim\\frac{f'}{g'}",
    hypotheses: 'Il rapporto presenta una forma \\(0/0\\) o \\(\\infty/\\infty\\), le funzioni sono derivabili vicino al punto e il limite del rapporto delle derivate esiste.',
    geometry: 'Vicino al punto comune, il rapporto tra le altezze viene sostituito dal rapporto tra le pendenze.',
    use: 'Semplifica limiti come \\(\\lim_{x\\to0}\\sin x/x\\) o confronti tra crescite esponenziali e polinomiali.',
    caution: 'Non si applica a qualunque frazione: prima va verificata la forma indeterminata e talvolta serve ripetere il procedimento.',
    sketch: 'lhopital',
  },
  {
    title: 'Derivata della funzione inversa',
    subtitle: 'Riflettere il grafico scambia le pendenze',
    formula: "(f^{-1})'(y_0)=\\frac{1}{f'(x_0)},\\qquad y_0=f(x_0)",
    hypotheses: '\\(f\\) è invertibile vicino a \\(x_0\\), derivabile e \\(f^{\\prime}(x_0)\\neq0\\).',
    geometry: 'I grafici di \\(f\\) e \\(f^{-1}\\) sono simmetrici rispetto a \\(y=x\\); le pendenze delle tangenti sono reciproche.',
    use: 'Ricava in modo naturale le derivate di logaritmo, radice e funzioni trigonometriche inverse.',
    caution: 'Se \\(f^{\\prime}(x_0)=0\\), l’inversa può avere una tangente verticale e la formula non produce un valore finito.',
    sketch: 'inverse',
  },
  {
    title: 'Taylor con resto di Lagrange',
    subtitle: 'Misurare l’errore dell’approssimazione',
    formula: "f(x)=T_n(x)+\\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}",
    hypotheses: '\\(f\\) possiede le derivate necessarie tra il centro \\(a\\) e il punto \\(x\\).',
    geometry: 'Il polinomio coincide localmente con valore e derivate; il resto misura la distanza verticale ancora visibile dalla curva.',
    use: 'Stabilisce quante cifre o quale precisione possiamo aspettarci da un’approssimazione di Taylor.',
    caution: 'L’errore dipende da una derivata di ordine superiore in un punto \\(\\xi\\) non noto: va stimata su tutto l’intervallo.',
    sketch: 'taylor-error',
  },
];

const meanValueFn = (x: number) => 0.35 * x * x - 0.8;

export function DerivativeTheoremsAppendix() {
  return (
    <Stack spacing={4.5}>
      <Alert severity="info">
        <strong>Come usare questa appendice.</strong> Non serve memorizzare le dimostrazioni: per ogni teorema chiediti quali ipotesi controllare, quale figura immaginare e quale problema pratico risolve.
      </Alert>

      <TheoremGroup eyebrow="Esistenza" title="Tre teoremi per trovare punti speciali" items={existenceTheorems} />

      <SectionBlock eyebrow="Laboratorio" title="La corda cerca una tangente parallela">
        <Typography paragraph>
          Muovi gli estremi sulla parabola. Lagrange garantisce un punto <InlineMath math="c" /> in cui la tangente è parallela alla corda; quando gli estremi hanno la stessa quota compare il caso particolare di Rolle.
        </Typography>
        <MeanValueLab />
      </SectionBlock>

      <Stack spacing={1.5}>
        <HistoryNote title="Fermat prima della notazione f′" summary="Fermat cercava massimi, minimi e tangenti con il metodo dell’adeguaglianza." href="https://mathshistory.st-andrews.ac.uk/Biographies/Fermat/">
          Negli anni Trenta del Seicento Pierre de Fermat sviluppò un metodo algebrico per massimi, minimi e tangenti. Non usava ancora limiti o la notazione moderna, ma l’idea anticipava la condizione di tangente orizzontale negli estremi regolari.
        </HistoryNote>
        <HistoryNote title="Rolle, Lagrange e Cauchy" summary="Da un risultato sulle radici delle equazioni nacque il teorema del valor medio." href="https://mathshistory.st-andrews.ac.uk/Biographies/Rolle/">
          Michel Rolle pubblicò nel 1691 il risultato oggi associato al suo nome, inizialmente nel contesto delle equazioni algebriche. Lagrange lo inserì nella nuova analisi; nell’Ottocento Cauchy diede al teorema del valor medio una formulazione e una dimostrazione rigorose.
        </HistoryNote>
      </Stack>

      <TheoremGroup eyebrow="Lettura del grafico" title="Dal segno delle derivate al comportamento" items={behaviorTheorems} />

      <Paper elevation={0} sx={{ p: 3, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}>
        <Typography variant="h3" mb={1}>Un uso pratico senza fare uno studio di funzione</Typography>
        <Typography color="text.secondary">
          Se conosci un intervallo in cui <InlineMath math="2\le f'(x)\le3" />, Lagrange ti permette già di concludere che, aumentando <InlineMath math="x" /> di 4, la funzione cresce tra 8 e 12. Non occorre disegnare tutto il grafico: basta controllare le pendenze possibili.
        </Typography>
      </Paper>

      <TheoremGroup eyebrow="Strumenti avanzati" title="Cinque idee da consultare quando servono" items={advancedTheorems} />

      <Stack spacing={1.5}>
        <HistoryNote title="Darboux e le derivate senza salti" summary="Nel 1875 Darboux dimostrò che una derivata assume sempre i valori intermedi." href="https://encyclopediaofmath.org/wiki/Darboux_property">
          Gaston Darboux mostrò che una derivata può anche essere discontinua, ma non può saltare direttamente da una pendenza a un’altra. Il risultato separò definitivamente due idee: continuità e proprietà dei valori intermedi.
        </HistoryNote>
        <HistoryNote title="Una regola, due nomi" summary="La regola di de l’Hôpital apparve nel primo manuale di calcolo, ma proveniva dalle lezioni di Johann Bernoulli." href="https://mathshistory.st-andrews.ac.uk/Biographies/De_LHopital/">
          Nel 1696 Guillaume de l’Hôpital pubblicò <em>Analyse des infiniment petits</em>, il primo manuale sistematico di calcolo differenziale. La regola porta il suo nome, ma i documenti storici mostrano che il risultato proveniva dalle lezioni di Johann Bernoulli, che l’Hôpital aveva sostenuto economicamente.
        </HistoryNote>
        <HistoryNote title="Lagrange, Cauchy e l’errore di Taylor" summary="Il resto trasforma una buona approssimazione in una stima controllabile." href="https://mathshistory.st-andrews.ac.uk/Biographies/Lagrange/">
          Lagrange formulò una delle espressioni più usate per il resto di Taylor; Cauchy ne sviluppò un’altra forma e contribuì a chiarire le ipotesi di convergenza. L’idea pratica è moderna e decisiva: non basta approssimare, bisogna sapere quanto possiamo sbagliare.
        </HistoryNote>
      </Stack>
    </Stack>
  );
}

function TheoremGroup({ eyebrow, title, items }: { eyebrow: string; title: string; items: TheoremInfo[] }) {
  return (
    <SectionBlock eyebrow={eyebrow} title={title}>
      <Stack spacing={1.5}>
        {items.map((item, index) => <TheoremAccordion key={item.title} item={item} defaultExpanded={index === 0} />)}
      </Stack>
    </SectionBlock>
  );
}

function TheoremAccordion({ item, defaultExpanded }: { item: TheoremInfo; defaultExpanded?: boolean }) {
  return (
    <Accordion defaultExpanded={defaultExpanded} disableGutters sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ px: { xs: 2, sm: 2.5 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 0.5, sm: 2 }} alignItems={{ sm: 'center' }} sx={{ width: '100%', pr: 1 }}>
          <Box sx={{ flex: 1 }}><Typography variant="h3" sx={{ fontSize: '1.35rem' }}>{item.title}</Typography><Typography variant="body2" color="text.secondary">{item.subtitle}</Typography></Box>
          <Chip label="Apri scheda" color="primary" variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: { xs: 2, sm: 2.5 }, pt: 0 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={5}><TheoremSketch type={item.sketch} title={item.title} /></Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{ overflowX: 'auto', color: 'primary.main', mb: 1.5 }}><BlockMath math={item.formula} /></Box>
            <InfoLine label="Ipotesi" text={item.hypotheses} />
            <InfoLine label="Figura mentale" text={item.geometry} color="success.main" />
            <InfoLine label="Quando usarlo" text={item.use} color="primary.main" />
            <InfoLine label="Attenzione" text={item.caution} color="warning.main" />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

function InfoLine({ label, text, color = 'text.secondary' }: { label: string; text: string; color?: string }) {
  return <Box sx={{ mb: 1.25 }}><Typography variant="caption" sx={{ color, fontWeight: 800 }}>{label.toUpperCase()}</Typography><Typography component="div" variant="body2" color="text.secondary"><MathText text={text} /></Typography></Box>;
}

function MeanValueLab() {
  const [a, setA] = useState(-2.7);
  const [b, setB] = useState(1.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const c = (a + b) / 2;
  const secantSlope = 0.35 * (a + b);
  const rolle = Math.abs(meanValueFn(a) - meanValueFn(b)) < 0.001;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const width = canvas.width;
    const height = canvas.height;
    const xMin = -3.5;
    const xMax = 3.5;
    const yMin = -1.2;
    const yMax = 3.8;
    const px = (x: number) => (x - xMin) / (xMax - xMin) * width;
    const py = (y: number) => height - (y - yMin) / (yMax - yMin) * height;
    context.fillStyle = '#101A30'; context.fillRect(0, 0, width, height);
    context.strokeStyle = 'rgba(255,255,255,.1)'; context.lineWidth = 1;
    for (let x = -3; x <= 3; x += 1) { context.beginPath(); context.moveTo(px(x), 0); context.lineTo(px(x), height); context.stroke(); }
    for (let y = -1; y <= 3; y += 1) { context.beginPath(); context.moveTo(0, py(y)); context.lineTo(width, py(y)); context.stroke(); }
    context.strokeStyle = 'rgba(255,255,255,.35)'; context.beginPath(); context.moveTo(px(0), 0); context.lineTo(px(0), height); context.stroke(); context.beginPath(); context.moveTo(0, py(0)); context.lineTo(width, py(0)); context.stroke();
    context.strokeStyle = '#AAB8FF'; context.lineWidth = 3; context.beginPath();
    for (let pixel = 0; pixel <= width; pixel += 2) {
      const x = xMin + pixel / width * (xMax - xMin);
      const y = meanValueFn(x);
      if (pixel === 0) context.moveTo(pixel, py(y));
      else context.lineTo(pixel, py(y));
    }
    context.stroke();
    const line = (x1: number, y1: number, x2: number, y2: number, color: string, dashed = false) => { context.save(); context.strokeStyle = color; context.lineWidth = 3; context.setLineDash(dashed ? [10, 7] : []); context.beginPath(); context.moveTo(px(x1), py(y1)); context.lineTo(px(x2), py(y2)); context.stroke(); context.restore(); };
    line(a, meanValueFn(a), b, meanValueFn(b), '#F4C84A');
    line(c - 1.2, meanValueFn(c) - 1.2 * secantSlope, c + 1.2, meanValueFn(c) + 1.2 * secantSlope, '#4DD4A4', true);
    const point = (x: number, y: number, color: string, label: string) => { context.fillStyle = color; context.beginPath(); context.arc(px(x), py(y), 7, 0, Math.PI * 2); context.fill(); context.strokeStyle = '#fff'; context.lineWidth = 2; context.stroke(); context.fillStyle = '#fff'; context.font = '600 15px Inter, sans-serif'; context.fillText(label, px(x) + 10, py(y) - 10); };
    point(a, meanValueFn(a), '#F4C84A', 'A'); point(b, meanValueFn(b), '#F4C84A', 'B'); point(c, meanValueFn(c), '#4DD4A4', 'c');
  }, [a, b, c, secantSlope]);

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: '#101A30', position: 'relative' }}><canvas ref={canvasRef} width={900} height={430} aria-label="Parabola con corda AB e tangente parallela nel punto c" style={{ width: '100%', height: 'auto', display: 'block' }} /><Stack direction="row" gap={1} sx={{ position: 'absolute', left: 12, top: 12 }}><Chip size="small" label="corda AB" sx={{ bgcolor: '#F4C84A', color: '#17243F' }} /><Chip size="small" label="tangente in c" sx={{ bgcolor: '#4DD4A4', color: '#17243F' }} /></Stack></Box>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" gap={1} mb={2} flexWrap="wrap"><Button size="small" variant="outlined" onClick={() => { setA(-2.7); setB(1.5); }}>Caso Lagrange</Button><Button size="small" variant="outlined" color="success" onClick={() => { setA(-2.2); setB(2.2); }}>Caso Rolle</Button></Stack>
        <Grid container spacing={2}><Grid item xs={12} sm={6}><Typography variant="caption">ESTREMO a = {a.toFixed(2)}</Typography><Slider min={-3} max={-0.2} step={0.05} value={a} onChange={(_event, value) => setA(value as number)} aria-label="Estremo sinistro a" /></Grid><Grid item xs={12} sm={6}><Typography variant="caption">ESTREMO b = {b.toFixed(2)}</Typography><Slider min={0.2} max={3} step={0.05} value={b} onChange={(_event, value) => setB(value as number)} aria-label="Estremo destro b" /></Grid></Grid>
        <Grid container spacing={1.5} mt={0.5}><Grid item xs={6} sm={4}><Metric label="Pendenza corda" value={secantSlope.toFixed(3)} /></Grid><Grid item xs={6} sm={4}><Metric label="Punto garantito c" value={c.toFixed(3)} /></Grid><Grid item xs={12} sm={4}><Metric label="Pendenza tangente" value={secantSlope.toFixed(3)} /></Grid></Grid>
        <Alert severity={rolle ? 'success' : 'info'} sx={{ mt: 2 }}>{rolle ? 'Rolle: A e B hanno la stessa quota, quindi la corda e la tangente garantita sono orizzontali.' : 'Lagrange: la tangente verde è parallela alla corda gialla; rappresentano la stessa variazione per unità di x.'}</Alert>
      </Box>
    </Paper>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Paper elevation={0} sx={{ p: 1.5, height: '100%', border: '1px solid', borderColor: 'divider' }}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="h3" sx={{ mt: 0.5, fontSize: '1.45rem', color: 'primary.main' }}>{value}</Typography></Paper>;
}

function TheoremSketch({ type, title }: { type: Sketch; title: string }) {
  return (
    <Box sx={{ bgcolor: '#101A30', borderRadius: 1.5, overflow: 'hidden' }}>
      <svg viewBox="0 0 360 220" role="img" aria-label={`Interpretazione geometrica: ${title}`} style={{ width: '100%', display: 'block' }}>
        <line x1="22" y1="178" x2="338" y2="178" stroke="rgba(255,255,255,.22)" /><line x1="180" y1="18" x2="180" y2="198" stroke="rgba(255,255,255,.14)" />
        {(type === 'fermat' || type === 'rolle') && <><path d={type === 'rolle' ? 'M51 145 C92 139 103 43 180 64 C248 82 262 145 309 145' : 'M35 164 C90 156 95 42 180 64 C246 82 264 154 326 148'} fill="none" stroke="#AAB8FF" strokeWidth="4" /><line x1={type === 'fermat' ? 128 : 139} y1={type === 'fermat' ? 57 : 60} x2={type === 'fermat' ? 218 : 221} y2={type === 'fermat' ? 57 : 60} stroke="#4DD4A4" strokeWidth="3" />{type === 'rolle' && <><circle cx="51" cy="145" r="6" fill="#F4C84A" /><circle cx="309" cy="145" r="6" fill="#F4C84A" /><line x1="51" y1="145" x2="309" y2="145" stroke="#F4C84A" strokeWidth="2" strokeDasharray="8 6" /></>}</>}
        {type === 'lagrange' && <><path d="M35 160 C105 145 119 50 196 75 C252 92 274 132 328 112" fill="none" stroke="#AAB8FF" strokeWidth="4" /><line x1="45" y1="153" x2="320" y2="112" stroke="#F4C84A" strokeWidth="3" /><line x1="106" y1="104" x2="237" y2="84" stroke="#4DD4A4" strokeWidth="3" strokeDasharray="8 6" /></>}
        {type === 'monotone' && <><path d="M35 164 C90 154 110 126 159 120 C218 112 254 60 326 42" fill="none" stroke="#4DD4A4" strokeWidth="4" /><line x1="67" y1="155" x2="115" y2="129" stroke="#F4C84A" strokeWidth="3" /><line x1="213" y1="104" x2="263" y2="70" stroke="#F4C84A" strokeWidth="3" /><text x="245" y="42" fill="#4DD4A4" fontSize="16">f′ &gt; 0</text></>}
        {type === 'second-test' && <><path d="M28 58 Q100 184 172 58" fill="none" stroke="#4DD4A4" strokeWidth="4" /><line x1="68" y1="150" x2="132" y2="150" stroke="#F4C84A" strokeWidth="3" /><path d="M188 160 Q260 34 332 160" fill="none" stroke="#FF8A65" strokeWidth="4" /><line x1="228" y1="68" x2="292" y2="68" stroke="#F4C84A" strokeWidth="3" /></>}
        {type === 'convexity' && <><path d="M28 56 Q100 184 172 56" fill="none" stroke="#4DD4A4" strokeWidth="4" /><line x1="51" y1="103" x2="151" y2="144" stroke="#F4C84A" strokeWidth="2.5" /><path d="M188 160 Q260 34 332 160" fill="none" stroke="#FF8A65" strokeWidth="4" /><line x1="211" y1="113" x2="311" y2="72" stroke="#F4C84A" strokeWidth="2.5" /></>}
        {type === 'cauchy' && <><path d="M48 164 C90 132 119 62 176 74 C238 87 258 128 326 84" fill="none" stroke="#AAB8FF" strokeWidth="4" /><line x1="48" y1="164" x2="326" y2="84" stroke="#F4C84A" strokeWidth="3" /><line x1="117" y1="105" x2="235" y2="71" stroke="#4DD4A4" strokeWidth="3" strokeDasharray="8 6" /><text x="40" y="32" fill="#C9D2E0" fontSize="14">curva parametrica (g(t), f(t))</text></>}
        {type === 'darboux' && <><path d="M32 160 C94 150 95 64 174 84 C235 100 274 55 328 42" fill="none" stroke="#AAB8FF" strokeWidth="4" /><line x1="52" y1="157" x2="102" y2="128" stroke="#F4C84A" strokeWidth="3" /><line x1="146" y1="77" x2="204" y2="91" stroke="#F4C84A" strokeWidth="3" /><line x1="254" y1="72" x2="310" y2="45" stroke="#F4C84A" strokeWidth="3" /><text x="108" y="32" fill="#4DD4A4" fontSize="14">tutte le inclinazioni intermedie</text></>}
        {type === 'lhopital' && <><path d="M35 165 Q180 172 326 42" fill="none" stroke="#AAB8FF" strokeWidth="4" /><path d="M35 156 Q180 170 326 92" fill="none" stroke="#4DD4A4" strokeWidth="4" /><circle cx="180" cy="170" r="6" fill="#F4C84A" /><line x1="126" y1="181" x2="236" y2="151" stroke="#F4C84A" strokeWidth="2.5" strokeDasharray="8 6" /><text x="190" y="196" fill="#F4C84A" fontSize="14">0/0</text></>}
        {type === 'inverse' && <><line x1="38" y1="184" x2="326" y2="24" stroke="rgba(255,255,255,.3)" strokeWidth="2" strokeDasharray="7 6" /><path d="M48 169 C92 148 141 114 184 75 C230 33 272 29 320 22" fill="none" stroke="#AAB8FF" strokeWidth="4" /><path d="M42 178 C62 136 103 104 153 75 C208 43 270 29 324 22" fill="none" stroke="#4DD4A4" strokeWidth="4" /><line x1="115" y1="132" x2="194" y2="65" stroke="#F4C84A" strokeWidth="3" /><line x1="134" y1="118" x2="219" y2="83" stroke="#F4C84A" strokeWidth="3" /></>}
        {type === 'taylor-error' && <><path d="M34 164 C94 154 106 73 174 84 C246 96 265 37 330 45" fill="none" stroke="#AAB8FF" strokeWidth="4" /><path d="M34 164 Q179 51 330 63" fill="none" stroke="#4DD4A4" strokeWidth="3" strokeDasharray="9 6" /><path d="M230 86 L230 76" stroke="#F4C84A" strokeWidth="4" /><text x="240" y="84" fill="#F4C84A" fontSize="15">resto = errore</text></>}
      </svg>
    </Box>
  );
}
