import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Chip, Paper, Slider, Stack, Typography } from '@mui/material';
import { InlineMath } from 'react-katex';

type TaylorId = 'exp' | 'sin' | 'cos';

const models: Record<TaylorId, { label: string; math: string; fn: (x: number) => number; coefficient: (k: number) => number }> = {
  exp: { label: 'Esponenziale', math: 'e^x', fn: Math.exp, coefficient: () => 1 },
  sin: { label: 'Seno', math: '\\sin x', fn: Math.sin, coefficient: (k) => [0, 1, 0, -1][k % 4] },
  cos: { label: 'Coseno', math: '\\cos x', fn: Math.cos, coefficient: (k) => [1, 0, -1, 0][k % 4] },
};

const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);
const polynomial = (id: TaylorId, order: number, x: number) => {
  const model = models[id];
  let value = 0;
  for (let k = 0; k <= order; k += 1) value += model.coefficient(k) * x ** k / factorial(k);
  return value;
};

export function TaylorLab() {
  const [functionId, setFunctionId] = useState<TaylorId>('exp');
  const [order, setOrder] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const model = useMemo(() => models[functionId], [functionId]);
  const error = Math.abs(model.fn(1) - polynomial(functionId, order, 1));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = canvas.width;
    const height = canvas.height;
    const xMin = -3;
    const xMax = 3;
    const yMin = functionId === 'exp' ? -2 : -2;
    const yMax = functionId === 'exp' ? 10 : 2;
    const px = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const py = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    context.fillStyle = '#101A30'; context.fillRect(0, 0, width, height);
    context.strokeStyle = 'rgba(255,255,255,.08)'; context.lineWidth = 1;
    for (let x = -3; x <= 3; x += 1) { context.beginPath(); context.moveTo(px(x), 0); context.lineTo(px(x), height); context.stroke(); }
    for (let y = Math.ceil(yMin); y <= yMax; y += 1) { context.beginPath(); context.moveTo(0, py(y)); context.lineTo(width, py(y)); context.stroke(); }
    context.strokeStyle = 'rgba(255,255,255,.35)'; context.beginPath(); context.moveTo(px(0), 0); context.lineTo(px(0), height); context.stroke(); context.beginPath(); context.moveTo(0, py(0)); context.lineTo(width, py(0)); context.stroke();

    const plot = (fn: (x: number) => number, color: string, lineWidth: number, alpha = 1) => {
      context.save(); context.strokeStyle = color; context.lineWidth = lineWidth; context.globalAlpha = alpha; context.beginPath();
      let begun = false;
      for (let pixel = 0; pixel <= width; pixel += 2) {
        const x = xMin + pixel / width * (xMax - xMin);
        const y = fn(x);
        if (!Number.isFinite(y) || y < yMin - 3 || y > yMax + 3) { begun = false; continue; }
        if (!begun) { context.moveTo(pixel, py(y)); begun = true; } else context.lineTo(pixel, py(y));
      }
      context.stroke(); context.restore();
    };
    for (let prior = 0; prior < order; prior += 1) plot((x) => polynomial(functionId, prior, x), '#B2A3E8', 1.4, .12 + prior / Math.max(order, 1) * .22);
    plot(model.fn, '#F2F5FA', 2.5, .9);
    plot((x) => polynomial(functionId, order, x), '#F4C84A', 3);
    context.fillStyle = '#4DD4A4'; context.beginPath(); context.arc(px(1), py(model.fn(1)), 5.5, 0, Math.PI * 2); context.fill();
  }, [functionId, order, model]);

  const message = order === 0
    ? 'Conosciamo solo il valore della funzione in 0.'
    : order === 1
      ? 'Ora coincidono valore e pendenza: compare la retta tangente.'
      : order === 2
        ? 'La derivata seconda aggiunge la curvatura.'
        : `Con ${order + 1} informazioni locali, l’approssimazione aderisce sempre più a lungo.`;

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Stack direction="row" gap={1} p={2.5} flexWrap="wrap" useFlexGap>
        {(Object.keys(models) as TaylorId[]).map((id) => <Button key={id} variant={id === functionId ? 'contained' : 'outlined'} onClick={() => setFunctionId(id)}><InlineMath math={models[id].math} /></Button>)}
      </Stack>
      <Box sx={{ bgcolor: '#101A30', position: 'relative' }}>
        <canvas ref={canvasRef} width={900} height={440} aria-label="Grafico della funzione e delle approssimazioni di Taylor" style={{ width: '100%', height: 'auto', display: 'block' }} />
        <Stack direction="row" gap={1} sx={{ position: 'absolute', left: 14, top: 14 }}><Chip size="small" label="funzione" sx={{ bgcolor: '#F2F5FA' }} /><Chip size="small" label={`P${order}`} sx={{ bgcolor: '#F4C84A' }} /></Stack>
      </Box>
      <Box p={{ xs: 2, sm: 3 }}>
        <Typography variant="caption">ORDINE DEL POLINOMIO · {order}</Typography>
        <Slider min={0} max={7} step={1} marks value={order} onChange={(_event, value) => setOrder(value as number)} aria-label="Ordine del polinomio di Taylor" />
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="space-between" mt={1}>
          <Typography color="text.secondary" sx={{ maxWidth: 590 }}>{message}</Typography>
          <Box sx={{ textAlign: { sm: 'right' } }}><Typography variant="caption" color="text.secondary">ERRORE IN x = 1</Typography><Typography variant="h3" color="primary.main">{error.toExponential(2)}</Typography></Box>
        </Stack>
      </Box>
    </Paper>
  );
}
