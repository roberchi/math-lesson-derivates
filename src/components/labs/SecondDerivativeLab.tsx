import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Box, Button, Chip, Grid, Paper, Slider, Stack, Typography } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import { InlineMath } from 'react-katex';

interface CurvatureModel {
  id: string;
  label: string;
  math: string;
  fn: (x: number) => number;
  first: (x: number) => number;
  second: (x: number) => number;
  min: number;
  max: number;
  start: number;
}

const models: CurvatureModel[] = [
  {
    id: 'cubic',
    label: 'Cambio di concavità',
    math: '\\frac{x^3}{6}-x',
    fn: (x) => x ** 3 / 6 - x,
    first: (x) => x ** 2 / 2 - 1,
    second: (x) => x,
    min: -2.8,
    max: 2.8,
    start: -1.8,
  },
  {
    id: 'cup',
    label: 'Coppa',
    math: '0{,}35x^2-1',
    fn: (x) => 0.35 * x ** 2 - 1,
    first: (x) => 0.7 * x,
    second: () => 0.7,
    min: -2.8,
    max: 2.8,
    start: -1.6,
  },
  {
    id: 'cap',
    label: 'Cupola',
    math: '1-0{,}35x^2',
    fn: (x) => 1 - 0.35 * x ** 2,
    first: (x) => -0.7 * x,
    second: () => -0.7,
    min: -2.8,
    max: 2.8,
    start: -1.6,
  },
  {
    id: 'sine',
    label: 'Concavità alternata',
    math: '1{,}4\\sin x',
    fn: (x) => 1.4 * Math.sin(x),
    first: (x) => 1.4 * Math.cos(x),
    second: (x) => -1.4 * Math.sin(x),
    min: -3.1,
    max: 3.1,
    start: -2.1,
  },
];

const COLORS = {
  curve: '#AAB8FF',
  tangent: '#F4C84A',
  positive: '#4DD4A4',
  negative: '#FF8A65',
  zero: '#F4C84A',
  circle: '#E6A8FF',
  ink: '#101A30',
};

export function ConcavityExamples() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <ConcavityCard
          kind="up"
          formula="f''(x)>0"
          title="Concava verso l’alto"
          text="Procedendo da sinistra a destra, le pendenze aumentano: da negative diventano nulle e poi positive."
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ConcavityCard
          kind="down"
          formula="f''(x)<0"
          title="Concava verso il basso"
          text="Procedendo da sinistra a destra, le pendenze diminuiscono: da positive diventano nulle e poi negative."
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ConcavityCard
          kind="inflection"
          formula="f''(x_0)=0"
          title="Possibile flesso"
          text="Se la derivata seconda cambia segno, anche la concavità cambia. Il solo valore zero, però, non basta."
        />
      </Grid>
    </Grid>
  );
}

function ConcavityCard({ kind, formula, title, text }: { kind: 'up' | 'down' | 'inflection'; formula: string; title: string; text: string }) {
  const positive = kind === 'up';
  const path = kind === 'up'
    ? 'M 28 40 Q 120 164 212 40'
    : kind === 'down'
      ? 'M 28 140 Q 120 16 212 140'
      : 'M 28 145 C 76 145 78 86 120 86 C 162 86 164 27 212 27';

  return (
    <Paper elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: COLORS.ink, p: 1 }}>
        <svg viewBox="0 0 240 175" role="img" aria-label={`Grafico: ${title}`} style={{ width: '100%', display: 'block' }}>
          <line x1="18" y1="86" x2="224" y2="86" stroke="rgba(255,255,255,.2)" />
          <line x1="120" y1="12" x2="120" y2="160" stroke="rgba(255,255,255,.2)" />
          <path d={path} fill="none" stroke={kind === 'inflection' ? COLORS.zero : positive ? COLORS.positive : COLORS.negative} strokeWidth="4" strokeLinecap="round" />
          {kind === 'up' && <>
            <line x1="35" y1="66" x2="78" y2="124" stroke={COLORS.tangent} strokeWidth="2.5" />
            <line x1="98" y1="150" x2="142" y2="150" stroke={COLORS.tangent} strokeWidth="2.5" />
            <line x1="162" y1="124" x2="205" y2="66" stroke={COLORS.tangent} strokeWidth="2.5" />
          </>}
          {kind === 'down' && <>
            <line x1="35" y1="114" x2="78" y2="56" stroke={COLORS.tangent} strokeWidth="2.5" />
            <line x1="98" y1="30" x2="142" y2="30" stroke={COLORS.tangent} strokeWidth="2.5" />
            <line x1="162" y1="56" x2="205" y2="114" stroke={COLORS.tangent} strokeWidth="2.5" />
          </>}
          {kind === 'inflection' && <>
            <circle cx="120" cy="86" r="6" fill={COLORS.zero} />
            <line x1="78" y1="116" x2="162" y2="56" stroke={COLORS.tangent} strokeWidth="2.5" />
            <text x="128" y="105" fill="#F4C84A" fontSize="11">cambio di concavità</text>
          </>}
        </svg>
      </Box>
      <Box sx={{ p: 2.25 }}>
        <Typography variant="caption" color={kind === 'inflection' ? 'warning.main' : positive ? 'success.main' : 'error.main'} fontWeight={800}><InlineMath math={formula} /></Typography>
        <Typography variant="h3" sx={{ fontSize: '1.3rem', mt: 0.75, mb: 1 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{text}</Typography>
      </Box>
    </Paper>
  );
}

export function SecondDerivativeLab() {
  const [modelId, setModelId] = useState('cubic');
  const [x0, setX0] = useState(-1.8);
  const [animating, setAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const model = useMemo(() => models.find((item) => item.id === modelId) ?? models[0], [modelId]);
  const y0 = model.fn(x0);
  const first = model.first(x0);
  const second = model.second(x0);
  const curvature = second / (1 + first ** 2) ** 1.5;
  const radius = Math.abs(curvature) < 0.0001 ? Number.POSITIVE_INFINITY : 1 / Math.abs(curvature);
  const sign = second > 0.001 ? 'positive' : second < -0.001 ? 'negative' : 'zero';

  useEffect(() => {
    if (!animating) return;
    const timer = window.setInterval(() => {
      setX0((current) => current >= model.max ? model.min : Math.min(model.max, current + 0.035));
    }, 45);
    return () => window.clearInterval(timer);
  }, [animating, model]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const width = canvas.width;
    const height = canvas.height;
    const xMin = -4;
    const xMax = 4;
    const yMin = -2.3;
    const yMax = 2.3;
    const px = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const py = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    const unit = width / (xMax - xMin);
    const localColor = sign === 'positive' ? COLORS.positive : sign === 'negative' ? COLORS.negative : COLORS.zero;

    context.clearRect(0, 0, width, height);
    context.fillStyle = COLORS.ink;
    context.fillRect(0, 0, width, height);

    context.lineWidth = 1;
    context.strokeStyle = 'rgba(255,255,255,.08)';
    for (let x = xMin; x <= xMax; x += 1) {
      context.beginPath(); context.moveTo(px(x), 0); context.lineTo(px(x), height); context.stroke();
    }
    for (let y = -2; y <= 2; y += 1) {
      context.beginPath(); context.moveTo(0, py(y)); context.lineTo(width, py(y)); context.stroke();
    }
    context.strokeStyle = 'rgba(255,255,255,.35)';
    context.beginPath(); context.moveTo(px(0), 0); context.lineTo(px(0), height); context.stroke();
    context.beginPath(); context.moveTo(0, py(0)); context.lineTo(width, py(0)); context.stroke();

    const drawCurve = (from: number, to: number, color: string, lineWidth: number) => {
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      let started = false;
      for (let pixel = 0; pixel <= width; pixel += 2) {
        const x = xMin + (pixel / width) * (xMax - xMin);
        if (x < from || x > to) continue;
        const y = model.fn(x);
        if (!Number.isFinite(y) || y < yMin - 1 || y > yMax + 1) { started = false; continue; }
        if (!started) { context.moveTo(px(x), py(y)); started = true; } else context.lineTo(px(x), py(y));
      }
      context.stroke();
    };
    drawCurve(xMin, xMax, COLORS.curve, 3);
    drawCurve(Math.max(xMin, x0 - 0.5), Math.min(xMax, x0 + 0.5), localColor, 6);

    // La tangente mostra f′; il cerchio osculatore aggiunge l’informazione di f″.
    context.strokeStyle = COLORS.tangent;
    context.lineWidth = 2.5;
    context.setLineDash([10, 7]);
    context.beginPath();
    context.moveTo(px(x0 - 1.4), py(y0 - 1.4 * first));
    context.lineTo(px(x0 + 1.4), py(y0 + 1.4 * first));
    context.stroke();
    context.setLineDash([]);

    if (Math.abs(second) > 0.035 && radius < 18) {
      const factor = (1 + first ** 2) / second;
      const centerX = x0 - first * factor;
      const centerY = y0 + factor;
      context.save();
      context.strokeStyle = COLORS.circle;
      context.lineWidth = 2.25;
      context.globalAlpha = 0.82;
      context.setLineDash([8, 7]);
      context.beginPath();
      context.arc(px(centerX), py(centerY), radius * unit, 0, Math.PI * 2);
      context.stroke();
      context.setLineDash([]);
      context.strokeStyle = 'rgba(230,168,255,.55)';
      context.lineWidth = 1.5;
      context.beginPath(); context.moveTo(px(x0), py(y0)); context.lineTo(px(centerX), py(centerY)); context.stroke();
      if (centerX >= xMin && centerX <= xMax && centerY >= yMin && centerY <= yMax) {
        context.fillStyle = COLORS.circle;
        context.beginPath(); context.arc(px(centerX), py(centerY), 4, 0, Math.PI * 2); context.fill();
        context.font = '14px Inter, sans-serif';
        context.fillText('C', px(centerX) + 9, py(centerY) - 8);
      }
      context.restore();
    }

    context.fillStyle = localColor;
    context.beginPath(); context.arc(px(x0), py(y0), 7, 0, Math.PI * 2); context.fill();
    context.strokeStyle = '#FFFFFF'; context.lineWidth = 2; context.stroke();

    context.fillStyle = '#FFFFFF';
    context.font = '600 15px Inter, sans-serif';
    context.fillText(`P (${x0.toFixed(2)}, ${y0.toFixed(2)})`, Math.min(width - 150, px(x0) + 12), Math.max(24, py(y0) - 14));
  }, [model, x0, y0, first, second, radius, sign]);

  const chooseModel = (next: CurvatureModel) => {
    setAnimating(false);
    setModelId(next.id);
    setX0(next.start);
  };

  const format = (value: number) => Number.isFinite(value) ? value.toFixed(3) : '∞';
  const status = sign === 'positive'
    ? { title: 'Concava verso l’alto', body: 'Le pendenze stanno aumentando: la tangente ruota in senso antiorario mentre il punto avanza.', severity: 'success' as const }
    : sign === 'negative'
      ? { title: 'Concava verso il basso', body: 'Le pendenze stanno diminuendo: la tangente ruota in senso orario mentre il punto avanza.', severity: 'warning' as const }
      : { title: 'Curvatura nulla in questo punto', body: 'Il cerchio osculatore ha raggio infinito. Controlla i punti vicini: se f″ cambia segno, questo è un flesso.', severity: 'info' as const };

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: 'background.paper' }}>
        <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
          {models.map((item) => (
            <Button key={item.id} size="small" variant={modelId === item.id ? 'contained' : 'outlined'} onClick={() => chooseModel(item)}>
              <InlineMath math={`f(x)=${item.math}`} />
            </Button>
          ))}
        </Stack>
      </Box>

      <Box sx={{ bgcolor: COLORS.ink, position: 'relative' }}>
        <canvas ref={canvasRef} width={900} height={518} aria-label="Grafico interattivo della concavità con tangente e cerchio osculatore" style={{ width: '100%', height: 'auto', display: 'block' }} />
        <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap sx={{ position: 'absolute', left: 12, top: 12, right: 12 }}>
          <Chip size="small" label="funzione" sx={{ bgcolor: COLORS.curve, color: '#17243F' }} />
          <Chip size="small" label="tangente" sx={{ bgcolor: COLORS.tangent, color: '#17243F' }} />
          <Chip size="small" label="cerchio osculatore" sx={{ bgcolor: COLORS.circle, color: '#17243F' }} />
        </Stack>
      </Box>

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2.5} alignItems={{ md: 'center' }}>
          <Box sx={{ flex: 1, width: '100%' }}>
            <Typography variant="caption">SPOSTA IL PUNTO · x₀ = {x0.toFixed(2)}</Typography>
            <Slider value={x0} min={model.min} max={model.max} step={0.02} onChange={(_event, value) => { setAnimating(false); setX0(value as number); }} aria-label="Posizione del punto sulla funzione" />
          </Box>
          <Button variant="contained" startIcon={animating ? <StopRoundedIcon /> : <PlayArrowRoundedIcon />} onClick={() => setAnimating((value) => !value)}>
            {animating ? 'Ferma punto' : 'Anima il punto'}
          </Button>
        </Stack>

        <Grid container spacing={1.5} mt={0.5}>
          <Grid item xs={6} sm={3}><Metric label="Pendenza" formula="f'(x_0)" value={format(first)} color={COLORS.tangent} /></Grid>
          <Grid item xs={6} sm={3}><Metric label="Variazione pendenza" formula="f''(x_0)" value={format(second)} color={sign === 'positive' ? '#13795B' : sign === 'negative' ? '#B42318' : '#B88A1D'} /></Grid>
          <Grid item xs={6} sm={3}><Metric label="Curvatura" formula="\\kappa" value={format(curvature)} color="#7448C8" /></Grid>
          <Grid item xs={6} sm={3}><Metric label="Raggio del cerchio" formula="R" value={format(radius)} color="#7448C8" /></Grid>
        </Grid>

        <Alert severity={status.severity} sx={{ mt: 2.5 }}>
          <Typography fontWeight={800}>{status.title}</Typography>
          <Typography variant="body2">{status.body}</Typography>
        </Alert>

        <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: 'custom.purpleLight', borderLeft: '4px solid', borderColor: 'custom.purple' }}>
          <Typography variant="body2">
            <strong>Perché un cerchio?</strong> La tangente riproduce valore e pendenza; il <em>cerchio osculatore</em> riproduce anche la curvatura locale. Il suo raggio soddisfa{' '}
            <InlineMath math="R=1/|\\kappa|" />, con <InlineMath math="\\kappa=f''/(1+(f')^2)^{3/2}" />. Più il raggio è piccolo, più la curva piega.
          </Typography>
        </Paper>
      </Box>
    </Paper>
  );
}

function Metric({ label, formula, value, color }: { label: string; formula: string; value: string; color: string }) {
  return (
    <Paper elevation={0} sx={{ p: 1.5, height: '100%', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2"><InlineMath math={formula} /></Typography>
      <Typography variant="h3" sx={{ mt: 0.5, fontSize: '1.5rem', color }}>{value}</Typography>
    </Paper>
  );
}
