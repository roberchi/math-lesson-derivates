import { useEffect, useMemo, useRef, useState } from 'react';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import { Box, Button, Chip, IconButton, Paper, Slider, Stack, Tooltip, Typography } from '@mui/material';
import { BlockMath, InlineMath } from 'react-katex';

type TaylorId = 'exp' | 'sin' | 'cos';
type View = { xMin: number; xMax: number; yMin: number; yMax: number };

const models: Record<TaylorId, { label: string; math: string; fn: (x: number) => number; derivative: (order: number, x: number) => number }> = {
  exp: { label: 'Esponenziale', math: 'e^x', fn: Math.exp, derivative: (_order, x) => Math.exp(x) },
  sin: { label: 'Seno', math: '\\sin x', fn: Math.sin, derivative: (order, x) => Math.sin(x + order * Math.PI / 2) },
  cos: { label: 'Coseno', math: '\\cos x', fn: Math.cos, derivative: (order, x) => Math.cos(x + order * Math.PI / 2) },
};

const defaultView = (id: TaylorId): View => id === 'exp'
  ? { xMin: -3, xMax: 3, yMin: -2, yMax: 10 }
  : { xMin: -3, xMax: 3, yMin: -2, yMax: 2 };

const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);

const polynomial = (id: TaylorId, order: number, x: number, x0: number) => {
  const model = models[id];
  let value = 0;
  for (let k = 0; k <= order; k += 1) {
    value += model.derivative(k, x0) * (x - x0) ** k / factorial(k);
  }
  return value;
};

const rounded = (value: number, digits = 3) => {
  if (Math.abs(value) < 10 ** -(digits + 1)) return '0';
  return Number(value.toFixed(digits)).toString();
};

const centeredPower = (x0: number, order: number) => {
  const center = Math.abs(x0) < 0.0001
    ? 'x'
    : `\\left(x${x0 < 0 ? '+' : '-'}${rounded(Math.abs(x0), 2)}\\right)`;
  return order === 1 ? center : `${center}^{${order}}`;
};

const polynomialMath = (id: TaylorId, order: number, x0: number) => {
  const terms: string[] = [];
  for (let k = 0; k <= order; k += 1) {
    const coefficient = models[id].derivative(k, x0) / factorial(k);
    if (Math.abs(coefficient) < 0.0005) continue;
    const magnitude = rounded(Math.abs(coefficient));
    const factor = k === 0 ? magnitude : `${magnitude}\\,${centeredPower(x0, k)}`;
    if (terms.length === 0) terms.push(coefficient < 0 ? `-${factor}` : factor);
    else terms.push(`${coefficient < 0 ? '-' : '+'}${factor}`);
  }
  return `P_{${order}}(x)\\approx ${terms.join('') || '0'}`;
};

const niceStep = (range: number) => {
  const rough = range / 7;
  const power = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / power;
  const multiplier = normalized < 1.5 ? 1 : normalized < 3.5 ? 2 : normalized < 7.5 ? 5 : 10;
  return multiplier * power;
};

export function TaylorLab() {
  const [functionId, setFunctionId] = useState<TaylorId>('exp');
  const [order, setOrder] = useState(2);
  const [x0, setX0] = useState(0);
  const [view, setView] = useState<View>(() => defaultView('exp'));
  const [isPanning, setIsPanning] = useState(false);
  const [challengeChecked, setChallengeChecked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const model = useMemo(() => models[functionId], [functionId]);
  const errorX = x0 + 0.75;
  const error = Math.abs(model.fn(errorX) - polynomial(functionId, order, errorX, x0));
  const challengeThreshold = 0.005;
  const minimumOrder = Array.from({ length: 8 }, (_item, index) => index).find((candidate) => Math.abs(model.fn(errorX) - polynomial(functionId, candidate, errorX, x0)) < challengeThreshold);

  const resetView = (id = functionId) => setView(defaultView(id));

  const zoom = (factor: number, centerX = (view.xMin + view.xMax) / 2, centerY = (view.yMin + view.yMax) / 2) => {
    setView((current) => ({
      xMin: centerX - (centerX - current.xMin) * factor,
      xMax: centerX + (current.xMax - centerX) * factor,
      yMin: centerY - (centerY - current.yMin) * factor,
      yMax: centerY + (current.yMax - centerY) * factor,
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = canvas.width;
    const height = canvas.height;
    const { xMin, xMax, yMin, yMax } = view;
    const px = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const py = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    const xStep = niceStep(xMax - xMin);
    const yStep = niceStep(yMax - yMin);

    context.fillStyle = '#101A30';
    context.fillRect(0, 0, width, height);
    context.font = '18px system-ui, sans-serif';
    context.textBaseline = 'top';
    context.strokeStyle = 'rgba(255,255,255,.09)';
    context.fillStyle = 'rgba(255,255,255,.52)';
    context.lineWidth = 1;

    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      const screenX = px(x);
      context.beginPath(); context.moveTo(screenX, 0); context.lineTo(screenX, height); context.stroke();
      if (Math.abs(x) > xStep / 10) context.fillText(rounded(x, 2), screenX + 5, Math.min(Math.max(py(0) + 5, 5), height - 24));
    }
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      const screenY = py(y);
      context.beginPath(); context.moveTo(0, screenY); context.lineTo(width, screenY); context.stroke();
      if (Math.abs(y) > yStep / 10) context.fillText(rounded(y, 2), Math.min(Math.max(px(0) + 5, 5), width - 55), screenY + 4);
    }
    context.strokeStyle = 'rgba(255,255,255,.42)';
    if (xMin <= 0 && xMax >= 0) { context.beginPath(); context.moveTo(px(0), 0); context.lineTo(px(0), height); context.stroke(); }
    if (yMin <= 0 && yMax >= 0) { context.beginPath(); context.moveTo(0, py(0)); context.lineTo(width, py(0)); context.stroke(); }

    const plot = (fn: (x: number) => number, color: string, lineWidth: number, alpha = 1) => {
      context.save(); context.strokeStyle = color; context.lineWidth = lineWidth; context.globalAlpha = alpha; context.beginPath();
      let begun = false;
      for (let pixel = 0; pixel <= width; pixel += 2) {
        const x = xMin + pixel / width * (xMax - xMin);
        const y = fn(x);
        if (!Number.isFinite(y) || y < yMin - (yMax - yMin) || y > yMax + (yMax - yMin)) { begun = false; continue; }
        if (!begun) { context.moveTo(pixel, py(y)); begun = true; } else context.lineTo(pixel, py(y));
      }
      context.stroke(); context.restore();
    };

    for (let prior = 0; prior < order; prior += 1) {
      plot((x) => polynomial(functionId, prior, x, x0), '#B2A3E8', 1.4, .12 + prior / Math.max(order, 1) * .22);
    }
    plot(model.fn, '#F2F5FA', 2.5, .92);
    plot((x) => polynomial(functionId, order, x, x0), '#F4C84A', 3);

    const centerY = model.fn(x0);
    context.fillStyle = '#91A3FA'; context.beginPath(); context.arc(px(x0), py(centerY), 7, 0, Math.PI * 2); context.fill();
    context.fillStyle = '#C9D2E0'; context.fillText('x₀', px(x0) + 10, py(centerY) - 28);

    const actualY = model.fn(errorX);
    const approximateY = polynomial(functionId, order, errorX, x0);
    context.save();
    context.strokeStyle = '#4DD4A4'; context.lineWidth = 3; context.setLineDash([8, 6]);
    context.beginPath(); context.moveTo(px(errorX), py(actualY)); context.lineTo(px(errorX), py(approximateY)); context.stroke();
    context.setLineDash([]);
    context.fillStyle = '#4DD4A4';
    for (const y of [actualY, approximateY]) { context.beginPath(); context.arc(px(errorX), py(y), 5.5, 0, Math.PI * 2); context.fill(); }
    context.restore();
  }, [errorX, functionId, model, order, view, x0]);

  const message = order === 0
    ? `Conosciamo soltanto il valore della funzione in x₀ = ${rounded(x0, 2)}.`
    : order === 1
      ? 'Ora coincidono valore e pendenza: il polinomio è la retta tangente.'
      : order === 2
        ? 'La derivata seconda aggiunge la curvatura: le due curve si assomigliano più a lungo.'
        : `Usiamo ${order + 1} informazioni locali: valore e derivate fino all’ordine ${order}.`;

  const selectFunction = (id: TaylorId) => {
    setFunctionId(id);
    resetView(id);
    setChallengeChecked(false);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const x = view.xMin + (event.clientX - rect.left) / rect.width * (view.xMax - view.xMin);
    const y = view.yMax - (event.clientY - rect.top) / rect.height * (view.yMax - view.yMin);
    zoom(event.deltaY < 0 ? 0.82 : 1.22, x, y);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    setIsPanning(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const previous = lastPointerRef.current;
    if (!previous) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    setView((current) => {
      const shiftX = -dx / rect.width * (current.xMax - current.xMin);
      const shiftY = dy / rect.height * (current.yMax - current.yMin);
      return { xMin: current.xMin + shiftX, xMax: current.xMax + shiftX, yMin: current.yMin + shiftY, yMax: current.yMax + shiftY };
    });
  };

  const stopPanning = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    lastPointerRef.current = null;
    setIsPanning(false);
  };

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Stack direction="row" gap={1} p={2.5} flexWrap="wrap" useFlexGap>
        {(Object.keys(models) as TaylorId[]).map((id) => <Button key={id} variant={id === functionId ? 'contained' : 'outlined'} onClick={() => selectFunction(id)}><InlineMath math={models[id].math} /></Button>)}
      </Stack>
      <Box sx={{ bgcolor: '#101A30', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={900}
          height={440}
          aria-label="Grafico interattivo della funzione e del suo polinomio di Taylor. Trascina per spostare il piano e usa la rotella per lo zoom."
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopPanning}
          onPointerCancel={stopPanning}
          style={{ width: '100%', height: 'auto', display: 'block', cursor: isPanning ? 'grabbing' : 'grab', touchAction: 'none' }}
        />
        <Stack direction="row" gap={1} sx={{ position: 'absolute', left: 14, top: 14, pointerEvents: 'none' }}>
          <Chip size="small" label="funzione" sx={{ bgcolor: '#F2F5FA' }} />
          <Chip size="small" label={`P${order}`} sx={{ bgcolor: '#F4C84A' }} />
          <Chip size="small" label="errore" sx={{ bgcolor: '#4DD4A4' }} />
        </Stack>
        <Paper elevation={0} sx={{ position: 'absolute', right: 12, top: 12, display: 'flex', bgcolor: 'rgba(255,255,255,.94)' }}>
          <Tooltip title="Zoom avanti"><IconButton size="small" aria-label="Zoom avanti" onClick={() => zoom(.8)}><ZoomInRoundedIcon /></IconButton></Tooltip>
          <Tooltip title="Zoom indietro"><IconButton size="small" aria-label="Zoom indietro" onClick={() => zoom(1.25)}><ZoomOutRoundedIcon /></IconButton></Tooltip>
          <Tooltip title="Ripristina coordinate"><IconButton size="small" aria-label="Ripristina coordinate" onClick={() => resetView()}><RestartAltRoundedIcon /></IconButton></Tooltip>
        </Paper>
        <Typography variant="caption" sx={{ position: 'absolute', right: 14, bottom: 10, color: '#C9D2E0', bgcolor: 'rgba(16,26,48,.78)', px: 1, py: .4, borderRadius: 1, pointerEvents: 'none' }}>
          Trascina per spostare · rotella o pulsanti per zoomare
        </Typography>
      </Box>
      <Box p={{ xs: 2, sm: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2.5, md: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption">PUNTO CENTRALE · x₀ = {rounded(x0, 2)}</Typography>
            <Slider min={-1.5} max={1.5} step={0.25} marks value={x0} onChange={(_event, value) => { setChallengeChecked(false); setX0(value as number); }} aria-label="Punto centrale x zero" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption">ORDINE DEL POLINOMIO · {order}</Typography>
            <Slider min={0} max={7} step={1} marks value={order} onChange={(_event, value) => { setChallengeChecked(false); setOrder(value as number); }} aria-label="Ordine del polinomio di Taylor" />
          </Box>
        </Stack>

        <Paper elevation={0} sx={{ mt: 2, p: { xs: 2, sm: 2.5 }, bgcolor: 'custom.goldLight', overflowX: 'auto', '& .katex-display': { my: 0 } }}>
          <Typography variant="caption" color="text.secondary">POLINOMIO VISUALIZZATO</Typography>
          <BlockMath math={polynomialMath(functionId, order, x0)} />
          <Typography variant="caption" color="text.secondary">I coefficienti sono arrotondati a tre cifre; il grafico usa i valori completi.</Typography>
        </Paper>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} mt={2}>
          <Box sx={{ maxWidth: 610 }}>
            <Typography color="text.secondary">{message}</Typography>
            <Typography variant="body2" color="text.secondary" mt={.75}>La linea verde misura la distanza tra funzione e polinomio in <InlineMath math={`x=x_0+0{,}75=${rounded(errorX, 2)}`} />.</Typography>
          </Box>
          <Box sx={{ textAlign: { sm: 'right' }, flexShrink: 0 }}>
            <Typography variant="caption" color="text.secondary">ERRORE IN x = {rounded(errorX, 2)}</Typography>
            <Typography variant="h3" color="primary.main">{error.toExponential(2)}</Typography>
          </Box>
        </Stack>
        <Paper elevation={0} sx={{ mt: 2.5, p: 2.5, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h3" sx={{ fontSize: '1.25rem' }} mb={1}>Sfida: il grado minimo</Typography>
          <Typography variant="body2" color="text.secondary" mb={1.5}>Sposta il cursore dell’ordine e trova il primo grado per cui l’errore nel punto verde è minore di {challengeThreshold}.</Typography>
          <Button variant="contained" onClick={() => setChallengeChecked(true)}>Controlla la mia scelta</Button>
          {challengeChecked && <Typography mt={1.5} color={order === minimumOrder ? 'success.main' : 'warning.main'} fontWeight={700}>{minimumOrder === undefined ? 'Con gli ordini disponibili la soglia non viene raggiunta: avvicina il punto al centro.' : order === minimumOrder ? `Esatto: P${order} è il primo polinomio che rispetta la soglia.` : error >= challengeThreshold ? `L’errore è ancora troppo grande. Prova ad aumentare l’ordine.` : `La soglia è rispettata, ma anche P${minimumOrder} bastava: cerca il grado minimo.`}</Typography>}
        </Paper>
      </Box>
    </Paper>
  );
}
