import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Chip, Paper, Slider, Stack, Typography } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import { InlineMath } from 'react-katex';
import { equalScaleYRange } from '@/utils/plot';

interface FunctionModel {
  id: string;
  label: string;
  math: string;
  fn: (x: number) => number;
  derivative: (x: number) => number;
  singular?: boolean;
}

const functions: FunctionModel[] = [
  { id: 'square', label: 'Quadratica', math: 'x^2', fn: (x) => x * x, derivative: (x) => 2 * x },
  { id: 'cube', label: 'Cubica', math: 'x^3', fn: (x) => x ** 3, derivative: (x) => 3 * x * x },
  { id: 'sin', label: 'Seno', math: '\\sin x', fn: Math.sin, derivative: Math.cos },
  { id: 'exp', label: 'Esponenziale', math: 'e^x', fn: Math.exp, derivative: Math.exp },
  { id: 'abs', label: 'Punto angoloso', math: '|x|', fn: Math.abs, derivative: (x) => x === 0 ? Number.NaN : Math.sign(x), singular: true },
  { id: 'cusp', label: 'Cuspide', math: 'x^{2/3}', fn: (x) => Math.abs(x) ** (2 / 3), derivative: (x) => x === 0 ? Number.POSITIVE_INFINITY : (2 / 3) * Math.sign(x) / Math.abs(x) ** (1 / 3), singular: true },
  { id: 'vertical', label: 'Tangente verticale', math: '\\sqrt[3]{x}', fn: Math.cbrt, derivative: (x) => x === 0 ? Number.POSITIVE_INFINITY : 1 / (3 * Math.cbrt(x) ** 2), singular: true },
];

export function GeometryLab({ singularMode = false }: { singularMode?: boolean }) {
  const available = singularMode ? functions : functions.slice(0, 4);
  const [functionId, setFunctionId] = useState(singularMode ? 'abs' : 'square');
  const [x0, setX0] = useState(singularMode ? 0 : 1);
  const [h, setH] = useState(1.5);
  const [prediction, setPrediction] = useState<'same' | 'different' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showNormal, setShowNormal] = useState(false);
  const [animating, setAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const model = useMemo(() => functions.find((item) => item.id === functionId) ?? functions[0], [functionId]);
  const rightSlope = (model.fn(x0 + h) - model.fn(x0)) / h;
  const leftSlope = (model.fn(x0 - h) - model.fn(x0)) / -h;
  const tangentSlope = model.derivative(x0);

  useEffect(() => {
    if (!animating) return;
    const timer = window.setInterval(() => {
      setH((current) => {
        if (current <= 0.055) {
          setAnimating(false);
          return 0.05;
        }
        return Math.max(0.05, current * 0.86);
      });
    }, 90);
    return () => window.clearInterval(timer);
  }, [animating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = canvas.width;
    const height = canvas.height;
    const xMin = -4;
    const xMax = 4;
    const yCenter = singularMode ? 0 : model.fn(x0);
    const { yMin, yMax } = equalScaleYRange(width, height, xMin, xMax, yCenter);
    const px = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const py = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

    context.clearRect(0, 0, width, height);
    context.fillStyle = '#101A30';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'rgba(255,255,255,.08)';
    context.lineWidth = 1;
    for (let x = Math.ceil(xMin); x <= xMax; x += 1) {
      context.beginPath(); context.moveTo(px(x), 0); context.lineTo(px(x), height); context.stroke();
    }
    for (let y = Math.ceil(yMin); y <= yMax; y += 1) {
      context.beginPath(); context.moveTo(0, py(y)); context.lineTo(width, py(y)); context.stroke();
    }
    context.strokeStyle = 'rgba(255,255,255,.35)';
    context.beginPath(); context.moveTo(px(0), 0); context.lineTo(px(0), height); context.stroke();
    context.beginPath(); context.moveTo(0, py(0)); context.lineTo(width, py(0)); context.stroke();

    const drawFunction = () => {
      context.strokeStyle = '#AAB8FF';
      context.lineWidth = 3;
      context.beginPath();
      let started = false;
      for (let pixel = 0; pixel <= width; pixel += 2) {
        const x = xMin + (pixel / width) * (xMax - xMin);
        const y = model.fn(x);
        if (!Number.isFinite(y) || y < yMin - 5 || y > yMax + 5) { started = false; continue; }
        if (!started) { context.moveTo(pixel, py(y)); started = true; } else context.lineTo(pixel, py(y));
      }
      context.stroke();
    };
    drawFunction();

    const y0 = model.fn(x0);
    const y1 = model.fn(x0 + h);
    const yLeft = model.fn(x0 - h);
    const drawLine = (slope: number, color: string, dashed: boolean) => {
      if (!Number.isFinite(slope)) return;
      context.save();
      context.strokeStyle = color;
      context.lineWidth = 2.5;
      context.setLineDash(dashed ? [10, 7] : []);
      context.beginPath();
      context.moveTo(px(xMin), py(y0 + slope * (xMin - x0)));
      context.lineTo(px(xMax), py(y0 + slope * (xMax - x0)));
      context.stroke();
      context.restore();
    };
    drawLine(rightSlope, '#F4C84A', true);
    drawLine(leftSlope, '#FF8A65', true);
    drawLine(tangentSlope, '#4DD4A4', false);
    if (showNormal) {
      if (!Number.isFinite(tangentSlope)) drawLine(0, '#E6A8FF', false);
      else if (Math.abs(tangentSlope) < 0.0001) {
        context.strokeStyle = '#E6A8FF'; context.lineWidth = 2.5;
        context.beginPath(); context.moveTo(px(x0), 0); context.lineTo(px(x0), height); context.stroke();
      } else drawLine(-1 / tangentSlope, '#E6A8FF', false);
    }

    const point = (x: number, y: number, color: string) => {
      context.fillStyle = color;
      context.beginPath(); context.arc(px(x), py(y), 6, 0, Math.PI * 2); context.fill();
      context.strokeStyle = '#101A30'; context.lineWidth = 2; context.stroke();
    };
    point(x0, y0, '#4DD4A4');
    if (Number.isFinite(y1)) point(x0 + h, y1, '#F4C84A');
    if (Number.isFinite(yLeft)) point(x0 - h, yLeft, '#FF8A65');

    if (Number.isFinite(y1)) {
      context.strokeStyle = 'rgba(244,200,74,.65)';
      context.lineWidth = 1.5;
      context.setLineDash([4, 4]);
      context.beginPath(); context.moveTo(px(x0), py(y0)); context.lineTo(px(x0 + h), py(y0)); context.lineTo(px(x0 + h), py(y1)); context.stroke();
      context.setLineDash([]);
      context.fillStyle = '#F4C84A'; context.font = '15px Inter, sans-serif';
      context.fillText('Δx = h', (px(x0) + px(x0 + h)) / 2 - 22, py(y0) + 24);
      context.fillText('Δy', px(x0 + h) + 9, (py(y0) + py(y1)) / 2);
    }
  }, [model, x0, h, rightSlope, leftSlope, tangentSlope, showNormal, singularMode]);

  const format = (value: number) => Number.isFinite(value) ? value.toFixed(4) : 'non finita';

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: 'background.paper' }}>
        <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
          {available.map((item) => (
            <Button key={item.id} size="small" variant={functionId === item.id ? 'contained' : 'outlined'} color={item.singular ? 'warning' : 'primary'} onClick={() => { setFunctionId(item.id); if (item.singular) setX0(0); }}>
              <InlineMath math={`f(x)=${item.math}`} />
            </Button>
          ))}
        </Stack>
      </Box>
      <Box sx={{ bgcolor: '#101A30', position: 'relative' }}>
        <canvas ref={canvasRef} width={900} height={600} aria-label="Grafico cartesiano in scala uniforme con rette secanti, tangente e normale" style={{ width: '100%', height: 'auto', display: 'block' }} />
        <Stack direction="row" gap={1} sx={{ position: 'absolute', left: 14, top: 14 }}>
          <Chip size="small" label="secante destra" sx={{ bgcolor: '#F4C84A', color: '#17243F' }} />
          <Chip size="small" label="secante sinistra" sx={{ bgcolor: '#FF8A65', color: '#17243F' }} />
          <Chip size="small" label="tangente" sx={{ bgcolor: '#4DD4A4', color: '#17243F' }} />
          {showNormal && <Chip size="small" label="normale" sx={{ bgcolor: '#E6A8FF', color: '#17243F' }} />}
        </Stack>
      </Box>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={3}>
          <Box sx={{ flex: 1 }}><Typography variant="caption">PUNTO BASE · x₀ = {x0.toFixed(2)}</Typography><Slider value={x0} min={-2.5} max={2.5} step={0.05} onChange={(_event, value) => setX0(value as number)} aria-label="Punto base x zero" /></Box>
          <Box sx={{ flex: 1 }}><Typography variant="caption">DISTANZA · |h| = {h.toFixed(2)}</Typography><Slider value={h} min={0.05} max={3} step={0.05} onChange={(_event, value) => { setAnimating(false); setRevealed(false); setH(value as number); }} aria-label="Valore assoluto dell'incremento h" /></Box>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }} justifyContent="space-between" mt={1}>
          <Stack direction="row" gap={3}>
            <Box><Typography variant="caption" color="text.secondary">da sinistra</Typography><Typography variant="h3" sx={{ color: '#D45B5B' }}>{revealed ? format(leftSlope) : '?'}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary">da destra</Typography><Typography variant="h3" sx={{ color: '#B88A1D' }}>{revealed ? format(rightSlope) : '?'}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary">f′(x₀)</Typography><Typography variant="h3" color="success.main">{format(tangentSlope)}</Typography></Box>
          </Stack>
          <Button variant="contained" startIcon={animating ? <StopRoundedIcon /> : <PlayArrowRoundedIcon />} onClick={() => { if (!animating && h <= .06) setH(2.5); setAnimating((value) => !value); }}>
            {animating ? 'Ferma' : 'Anima h → 0'}
          </Button>
          <Button variant={showNormal ? 'contained' : 'outlined'} color="secondary" onClick={() => setShowNormal((value) => !value)}>{showNormal ? 'Nascondi normale' : 'Mostra normale'}</Button>
        </Stack>
        <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: 'action.hover' }}>
          <Typography fontWeight={700} mb={1}>Prima di rivelare: avvicinandosi da sinistra e da destra, le pendenze tenderanno allo stesso valore?</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
            <Button variant={prediction === 'same' ? 'contained' : 'outlined'} onClick={() => setPrediction('same')}>Sì, coincidono</Button>
            <Button variant={prediction === 'different' ? 'contained' : 'outlined'} onClick={() => setPrediction('different')}>No, restano diverse</Button>
            <Button color="warning" disabled={!prediction} onClick={() => setRevealed(true)}>Rivela e confronta</Button>
          </Stack>
          {revealed && <Typography variant="body2" color="text.secondary" mt={1.5}>{Math.abs(leftSlope - rightSlope) < .12 ? 'Le due pendenze sono ormai molto vicine: il limite bilaterale è compatibile con una derivata.' : 'Le pendenze laterali non coincidono ancora. Riduci |h|; se restano diverse, la derivata non esiste.'} h non diventa mai zero: il rapporto sarebbe indefinito.</Typography>}
        </Paper>
      </Box>
    </Paper>
  );
}
