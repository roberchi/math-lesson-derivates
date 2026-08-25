import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const getExistenceTheorems = (t: (key: string) => string): TheoremInfo[] => [
  {
    title: t('theorems.fermat.title'),
    subtitle: t('theorems.fermat.subtitle'),
    formula: "x_0\\text{ estremo interno e }f\\text{ derivabile}\\;\\Longrightarrow\\;f'(x_0)=0",
    hypotheses: t('theorems.fermat.hypotheses'),
    geometry: t('theorems.fermat.geometry'),
    use: t('theorems.fermat.use'),
    caution: t('theorems.fermat.caution'),
    sketch: 'fermat',
  },
  {
    title: t('theorems.rolle.title'),
    subtitle: t('theorems.rolle.subtitle'),
    formula: "f(a)=f(b)\\;\\Longrightarrow\\;\\exists c\\in(a,b):f'(c)=0",
    hypotheses: t('theorems.rolle.hypotheses'),
    geometry: t('theorems.rolle.geometry'),
    use: t('theorems.rolle.use'),
    caution: t('theorems.rolle.caution'),
    sketch: 'rolle',
  },
  {
    title: t('theorems.lagrange.title'),
    subtitle: t('theorems.lagrange.subtitle'),
    formula: "\\exists c\\in(a,b):\\quad f'(c)=\\frac{f(b)-f(a)}{b-a}",
    hypotheses: t('theorems.lagrange.hypotheses'),
    geometry: t('theorems.lagrange.geometry'),
    use: t('theorems.lagrange.use'),
    caution: t('theorems.lagrange.caution'),
    sketch: 'lagrange',
  },
];

const getBehaviorTheorems = (t: (key: string) => string): TheoremInfo[] => [
  {
    title: t('theorems.monotone.title'),
    subtitle: t('theorems.monotone.subtitle'),
    formula: "f'>0\\Rightarrow f\\text{ crescente},\\qquad f'<0\\Rightarrow f\\text{ decrescente}",
    hypotheses: t('theorems.monotone.hypotheses'),
    geometry: t('theorems.monotone.geometry'),
    use: t('theorems.monotone.use'),
    caution: t('theorems.monotone.caution'),
    sketch: 'monotone',
  },
  {
    title: t('theorems.secondTest.title'),
    subtitle: t('theorems.secondTest.subtitle'),
    formula: "f'(x_0)=0,\\quad f''(x_0)>0\\Rightarrow\\min,\\quad f''(x_0)<0\\Rightarrow\\max",
    hypotheses: t('theorems.secondTest.hypotheses'),
    geometry: t('theorems.secondTest.geometry'),
    use: t('theorems.secondTest.use'),
    caution: t('theorems.secondTest.caution'),
    sketch: 'second-test',
  },
  {
    title: t('theorems.convexity.title'),
    subtitle: t('theorems.convexity.subtitle'),
    formula: "f''>0\\Rightarrow\\text{concava verso l'alto},\\qquad f''<0\\Rightarrow\\text{concava verso il basso}",
    hypotheses: t('theorems.convexity.hypotheses'),
    geometry: t('theorems.convexity.geometry'),
    use: t('theorems.convexity.use'),
    caution: t('theorems.convexity.caution'),
    sketch: 'convexity',
  },
];

const getAdvancedTheorems = (t: (key: string) => string): TheoremInfo[] => [
  {
    title: t('theorems.cauchy.title'),
    subtitle: t('theorems.cauchy.subtitle'),
    formula: "\\frac{f(b)-f(a)}{g(b)-g(a)}=\\frac{f'(c)}{g'(c)}",
    hypotheses: t('theorems.cauchy.hypotheses'),
    geometry: t('theorems.cauchy.geometry'),
    use: t('theorems.cauchy.use'),
    caution: t('theorems.cauchy.caution'),
    sketch: 'cauchy',
  },
  {
    title: t('theorems.darboux.title'),
    subtitle: t('theorems.darboux.subtitle'),
    formula: "f'(a)<m<f'(b)\\;\\Longrightarrow\\;\\exists c:f'(c)=m",
    hypotheses: t('theorems.darboux.hypotheses'),
    geometry: t('theorems.darboux.geometry'),
    use: t('theorems.darboux.use'),
    caution: t('theorems.darboux.caution'),
    sketch: 'darboux',
  },
  {
    title: t('theorems.lhopital.title'),
    subtitle: t('theorems.lhopital.subtitle'),
    formula: "\\lim\\frac{f}{g}\\overset{0/0\\text{ o }\\infty/\\infty}{=}\\lim\\frac{f'}{g'}",
    hypotheses: t('theorems.lhopital.hypotheses'),
    geometry: t('theorems.lhopital.geometry'),
    use: t('theorems.lhopital.use'),
    caution: t('theorems.lhopital.caution'),
    sketch: 'lhopital',
  },
  {
    title: t('theorems.inverse.title'),
    subtitle: t('theorems.inverse.subtitle'),
    formula: "(f^{-1})'(y_0)=\\frac{1}{f'(x_0)},\\qquad y_0=f(x_0)",
    hypotheses: t('theorems.inverse.hypotheses'),
    geometry: t('theorems.inverse.geometry'),
    use: t('theorems.inverse.use'),
    caution: t('theorems.inverse.caution'),
    sketch: 'inverse',
  },
  {
    title: t('theorems.taylorError.title'),
    subtitle: t('theorems.taylorError.subtitle'),
    formula: "f(x)=T_n(x)+\\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}",
    hypotheses: t('theorems.taylorError.hypotheses'),
    geometry: t('theorems.taylorError.geometry'),
    use: t('theorems.taylorError.use'),
    caution: t('theorems.taylorError.caution'),
    sketch: 'taylor-error',
  },
];

const meanValueFn = (x: number) => 0.35 * x * x - 0.8;

export function DerivativeTheoremsAppendix() {
  const { t } = useTranslation();
  const existenceTheorems = getExistenceTheorems(t);
  const behaviorTheorems = getBehaviorTheorems(t);
  const advancedTheorems = getAdvancedTheorems(t);
  return (
    <Stack spacing={4.5}>
      <Alert severity="info">
        <strong>{t('theorems.appendixNote.strong')}</strong> {t('theorems.appendixNote.body')}
      </Alert>

      <TheoremGroup eyebrow={t('theorems.groups.existence.eyebrow')} title={t('theorems.groups.existence.title')} items={existenceTheorems} />

      <SectionBlock eyebrow={t('theorems.mvtLab.eyebrow')} title={t('theorems.mvtLab.title')}>
        <Typography paragraph>
          {t('theorems.mvtLab.body')} <InlineMath math="c" /> {t('theorems.mvtLab.bodyTail')}
        </Typography>
        <MeanValueLab />
      </SectionBlock>

      <Stack spacing={1.5}>
        <HistoryNote title={t('theorems.history.fermat.title')} summary={t('theorems.history.fermat.summary')} href="https://mathshistory.st-andrews.ac.uk/Biographies/Fermat/">
          {t('theorems.history.fermat.body')}
        </HistoryNote>
        <HistoryNote title={t('theorems.history.rolleEtAl.title')} summary={t('theorems.history.rolleEtAl.summary')} href="https://mathshistory.st-andrews.ac.uk/Biographies/Rolle/">
          {t('theorems.history.rolleEtAl.body')}
        </HistoryNote>
      </Stack>

      <TheoremGroup eyebrow={t('theorems.groups.behavior.eyebrow')} title={t('theorems.groups.behavior.title')} items={behaviorTheorems} />

      <Paper elevation={0} sx={{ p: 3, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}>
        <Typography variant="h3" mb={1}>{t('theorems.practicalBox.title')}</Typography>
        <Typography color="text.secondary">
          {t('theorems.practicalBox.bodyPre')} <InlineMath math="2\le f'(x)\le3" /> {t('theorems.practicalBox.bodyMid')} <InlineMath math="x" /> {t('theorems.practicalBox.bodyPost')}
        </Typography>
      </Paper>

      <TheoremGroup eyebrow={t('theorems.groups.advanced.eyebrow')} title={t('theorems.groups.advanced.title')} items={advancedTheorems} />

      <Stack spacing={1.5}>
        <HistoryNote title={t('theorems.history.darboux.title')} summary={t('theorems.history.darboux.summary')} href="https://encyclopediaofmath.org/wiki/Darboux_property">
          {t('theorems.history.darboux.body')}
        </HistoryNote>
        <HistoryNote title={t('theorems.history.lhopital.title')} summary={t('theorems.history.lhopital.summary')} href="https://mathshistory.st-andrews.ac.uk/Biographies/De_LHopital/">
          {t('theorems.history.lhopital.body')}
        </HistoryNote>
        <HistoryNote title={t('theorems.history.taylorError.title')} summary={t('theorems.history.taylorError.summary')} href="https://mathshistory.st-andrews.ac.uk/Biographies/Lagrange/">
          {t('theorems.history.taylorError.body')}
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
  const { t } = useTranslation();
  return (
    <Accordion defaultExpanded={defaultExpanded} disableGutters sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ px: { xs: 2, sm: 2.5 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 0.5, sm: 2 }} alignItems={{ sm: 'center' }} sx={{ width: '100%', pr: 1 }}>
          <Box sx={{ flex: 1 }}><Typography variant="h3" sx={{ fontSize: '1.35rem' }}>{item.title}</Typography><Typography variant="body2" color="text.secondary">{item.subtitle}</Typography></Box>
          <Chip label={t('theorems.accordion.openCard')} color="primary" variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: { xs: 2, sm: 2.5 }, pt: 0 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={5}><TheoremSketch type={item.sketch} title={item.title} /></Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{ overflowX: 'auto', color: 'primary.main', mb: 1.5 }}><BlockMath math={item.formula} /></Box>
            <InfoLine label={t('theorems.accordion.hypotheses')} text={item.hypotheses} />
            <InfoLine label={t('theorems.accordion.geometry')} text={item.geometry} color="success.main" />
            <InfoLine label={t('theorems.accordion.use')} text={item.use} color="primary.main" />
            <InfoLine label={t('theorems.accordion.caution')} text={item.caution} color="warning.main" />
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
  const { t } = useTranslation();
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
      <Box sx={{ bgcolor: '#101A30', position: 'relative' }}><canvas ref={canvasRef} width={900} height={430} aria-label={t('theorems.mvtLab.canvasAriaLabel')} style={{ width: '100%', height: 'auto', display: 'block' }} /><Stack direction="row" gap={1} sx={{ position: 'absolute', left: 12, top: 12 }}><Chip size="small" label={t('theorems.mvtLab.chordChip')} sx={{ bgcolor: '#F4C84A', color: '#17243F' }} /><Chip size="small" label={t('theorems.mvtLab.tangentChip')} sx={{ bgcolor: '#4DD4A4', color: '#17243F' }} /></Stack></Box>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" gap={1} mb={2} flexWrap="wrap"><Button size="small" variant="outlined" onClick={() => { setA(-2.7); setB(1.5); }}>{t('theorems.mvtLab.caseLagrange')}</Button><Button size="small" variant="outlined" color="success" onClick={() => { setA(-2.2); setB(2.2); }}>{t('theorems.mvtLab.caseRolle')}</Button></Stack>
        <Grid container spacing={2}><Grid item xs={12} sm={6}><Typography variant="caption">{t('theorems.mvtLab.endpointA', { a: a.toFixed(2) })}</Typography><Slider min={-3} max={-0.2} step={0.05} value={a} onChange={(_event, value) => setA(value as number)} aria-label={t('theorems.mvtLab.endpointAAriaLabel')} /></Grid><Grid item xs={12} sm={6}><Typography variant="caption">{t('theorems.mvtLab.endpointB', { b: b.toFixed(2) })}</Typography><Slider min={0.2} max={3} step={0.05} value={b} onChange={(_event, value) => setB(value as number)} aria-label={t('theorems.mvtLab.endpointBAriaLabel')} /></Grid></Grid>
        <Grid container spacing={1.5} mt={0.5}><Grid item xs={6} sm={4}><Metric label={t('theorems.mvtLab.slopeChord')} value={secantSlope.toFixed(3)} /></Grid><Grid item xs={6} sm={4}><Metric label={t('theorems.mvtLab.pointC')} value={c.toFixed(3)} /></Grid><Grid item xs={12} sm={4}><Metric label={t('theorems.mvtLab.slopeTangent')} value={secantSlope.toFixed(3)} /></Grid></Grid>
        <Alert severity={rolle ? 'success' : 'info'} sx={{ mt: 2 }}>{rolle ? t('theorems.mvtLab.alertRolle') : t('theorems.mvtLab.alertLagrange')}</Alert>
      </Box>
    </Paper>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Paper elevation={0} sx={{ p: 1.5, height: '100%', border: '1px solid', borderColor: 'divider' }}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="h3" sx={{ mt: 0.5, fontSize: '1.45rem', color: 'primary.main' }}>{value}</Typography></Paper>;
}

function TheoremSketch({ type, title }: { type: Sketch; title: string }) {
  const { t } = useTranslation();
  return (
    <Box sx={{ bgcolor: '#101A30', borderRadius: 1.5, overflow: 'hidden' }}>
      <svg viewBox="0 0 360 220" role="img" aria-label={t('theorems.sketch.ariaLabel', { title })} style={{ width: '100%', display: 'block' }}>
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
