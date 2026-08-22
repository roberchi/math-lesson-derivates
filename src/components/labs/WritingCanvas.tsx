import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, IconButton, Slider, Stack, Tooltip, Typography } from '@mui/material';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import CleaningServicesRoundedIcon from '@mui/icons-material/CleaningServicesRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import HighlightRoundedIcon from '@mui/icons-material/HighlightRounded';
import PanToolAltRoundedIcon from '@mui/icons-material/PanToolAltRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useWritingStore } from '@/store/writingStore';
import { shouldExtendWritingSheet } from '@/utils/writingSheet';

type Tool = 'pen' | 'highlight' | 'eraser' | 'pan';

const SURFACE_WIDTH = 1200;
const INITIAL_SURFACE_HEIGHT = 768;
const MAX_SURFACE_HEIGHT = 12000;
const HEIGHT_INCREMENT = 384;
const LINE_HEIGHT = 32;
const GUTTER_WIDTH = 52;

export function WritingCanvas({ storageKey, label = 'Spazio di lavoro', onShowSolution }: { storageKey: string; label?: string; onShowSolution?: () => void }) {
  const initialSheet = useRef(useWritingStore.getState().sheets[storageKey]);
  const saveSheet = useWritingStore((state) => state.saveSheet);
  const clearStoredSheet = useWritingStore((state) => state.clearSheet);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const drawingPointer = useRef<number | null>(null);
  const pageUnlock = useRef<(() => void) | null>(null);
  const unlockTimer = useRef<number | null>(null);
  const pendingSnapshot = useRef<string | null>(null);
  const extending = useRef(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#263B8F');
  const [size, setSize] = useState(4);
  const [surfaceHeight, setSurfaceHeight] = useState(() => Math.max(INITIAL_SURFACE_HEIGHT, initialSheet.current?.height ?? 0));

  const drawSnapshot = useCallback((dataUrl: string | undefined, afterDraw?: () => void) => {
    const canvas = canvasRef.current;
    if (!canvas || !dataUrl) { afterDraw?.(); return; }
    const image = new Image();
    image.onload = () => {
      canvas.getContext('2d')?.drawImage(image, 0, 0);
      afterDraw?.();
    };
    image.onerror = () => afterDraw?.();
    image.src = dataUrl;
  }, []);

  useEffect(() => {
    drawSnapshot(initialSheet.current?.dataUrl);
  }, [drawSnapshot, storageKey]);

  useEffect(() => {
    const snapshot = pendingSnapshot.current;
    if (!snapshot) return;
    pendingSnapshot.current = null;
    drawSnapshot(snapshot, () => {
      const canvas = canvasRef.current;
      if (canvas) saveSheet(storageKey, canvas.toDataURL('image/png'), surfaceHeight);
      extending.current = false;
    });
  }, [drawSnapshot, saveSheet, storageKey, surfaceHeight]);

  const persistDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) saveSheet(storageKey, canvas.toDataURL('image/png'), surfaceHeight);
  }, [saveSheet, storageKey, surfaceHeight]);

  const releasePageLock = useCallback(() => {
    if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current);
    unlockTimer.current = null;
    pageUnlock.current?.();
    pageUnlock.current = null;
  }, []);

  const lockPageForPencil = () => {
    if (pageUnlock.current) return;
    const preventPalmScroll = (event: TouchEvent) => event.preventDefault();
    const viewport = scrollRef.current;
    const previousOverflow = viewport?.style.overflow ?? '';
    const previousOverscroll = document.documentElement.style.overscrollBehavior;
    document.addEventListener('touchmove', preventPalmScroll, { passive: false, capture: true });
    document.documentElement.style.overscrollBehavior = 'none';
    if (viewport) viewport.style.overflow = 'hidden';
    pageUnlock.current = () => {
      document.removeEventListener('touchmove', preventPalmScroll, true);
      document.documentElement.style.overscrollBehavior = previousOverscroll;
      if (viewport) viewport.style.overflow = previousOverflow;
    };
  };

  const releasePageLockAfterPalm = () => {
    if (!pageUnlock.current) return;
    if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(releasePageLock, 300);
  };

  useEffect(() => () => releasePageLock(), [releasePageLock]);

  const coordinates = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * (canvas.width / rect.width), y: (event.clientY - rect.top) * (canvas.height / rect.height) };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === 'pan') return;
    if (event.pointerType === 'touch') { event.preventDefault(); return; }
    if (drawingPointer.current !== null) return;
    event.preventDefault();
    if (event.pointerType !== 'mouse') lockPageForPencil();
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    drawingPointer.current = event.pointerId;
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    const point = coordinates(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === 'pan' || !drawing.current || event.pointerId !== drawingPointer.current) return;
    event.preventDefault();
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    const point = coordinates(event);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    context.globalAlpha = tool === 'highlight' ? .28 : 1;
    context.strokeStyle = color;
    const pressure = event.pressure > 0 ? event.pressure : .5;
    context.lineWidth = tool === 'eraser' ? size * 5 : tool === 'highlight' ? size * 4 : size * (.75 + pressure * .5);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stop = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerId !== drawingPointer.current) return;
    drawing.current = false;
    drawingPointer.current = null;
    const context = canvasRef.current?.getContext('2d');
    if (context) { context.closePath(); context.globalAlpha = 1; context.globalCompositeOperation = 'source-over'; }
    if (event.pointerType !== 'mouse') releasePageLockAfterPalm();
    window.requestAnimationFrame(persistDrawing);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    clearStoredSheet(storageKey);
  };

  const extendSurface = () => {
    const canvas = canvasRef.current;
    if (!canvas || extending.current || surfaceHeight >= MAX_SURFACE_HEIGHT) return;
    extending.current = true;
    pendingSnapshot.current = canvas.toDataURL('image/png');
    setSurfaceHeight((height) => Math.min(height + HEIGHT_INCREMENT, MAX_SURFACE_HEIGHT));
  };

  const handleScroll = () => {
    const viewport = scrollRef.current;
    if (viewport && shouldExtendWritingSheet(viewport.scrollTop, viewport.clientHeight, viewport.scrollHeight)) extendSurface();
  };

  const lineCount = Math.ceil(surfaceHeight / LINE_HEIGHT);

  return <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: '#FFFEFA' }}>
    <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} gap={1} px={1.5} py={1} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ mr: 'auto' }}><Typography variant="caption" color="text.secondary" display="block">{label.toUpperCase()} · PENCIL/STILO COMPATIBILE</Typography><Typography variant="caption" color="text.secondary">{tool === 'pan' ? 'MODALITÀ SPOSTA · trascina con un dito' : 'MODALITÀ DISEGNO · protezione palmo attiva'} · si allunga scorrendo verso il fondo</Typography></Box>
      <Stack direction="row" alignItems="center" gap={.5} flexWrap="wrap">
        <Tooltip title="Penna"><IconButton size="small" color={tool === 'pen' ? 'primary' : 'default'} onClick={() => setTool('pen')} aria-label="Penna"><BorderColorRoundedIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Evidenziatore"><IconButton size="small" color={tool === 'highlight' ? 'primary' : 'default'} onClick={() => setTool('highlight')} aria-label="Evidenziatore"><HighlightRoundedIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Gomma"><IconButton size="small" color={tool === 'eraser' ? 'primary' : 'default'} onClick={() => setTool('eraser')} aria-label="Gomma"><CleaningServicesRoundedIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Sposta il foglio"><IconButton size="small" color={tool === 'pan' ? 'primary' : 'default'} onClick={() => setTool('pan')} aria-label="Sposta il foglio" aria-pressed={tool === 'pan'}><PanToolAltRoundedIcon fontSize="small" /></IconButton></Tooltip>
        <input type="color" value={color} onChange={(event) => setColor(event.target.value)} aria-label="Colore tratto" style={{ width: 28, height: 28, border: 0, padding: 0, background: 'transparent' }} />
        <Box sx={{ width: 70, px: 1 }}><Slider size="small" min={2} max={12} value={size} onChange={(_event, value) => setSize(value as number)} aria-label="Dimensione tratto" /></Box>
        {onShowSolution && <Button size="small" color="warning" startIcon={<VisibilityRoundedIcon />} onClick={onShowSolution}>Soluzione</Button>}
        <Button size="small" color="error" startIcon={<DeleteSweepRoundedIcon />} onClick={clear}>Cancella</Button>
      </Stack>
    </Stack>
    <Box ref={scrollRef} tabIndex={0} role="region" aria-label={`${label}: foglio scorrevole con righe numerate`} onScroll={handleScroll} sx={{ flex: 1, minHeight: 0, overflow: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', bgcolor: '#FFFEFA' }}>
      <Box sx={{ width: GUTTER_WIDTH + SURFACE_WIDTH, height: surfaceHeight, display: 'flex', backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #C9D5E8 32px)' }}>
        <Box aria-hidden sx={{ width: GUTTER_WIDTH, height: surfaceHeight, flexShrink: 0, position: 'sticky', left: 0, zIndex: 1, bgcolor: '#F5F1E8', borderRight: '1px solid #D7CFC0' }}>{Array.from({ length: lineCount }, (_item, index) => <Typography key={index} variant="caption" sx={{ position: 'absolute', top: index * LINE_HEIGHT + LINE_HEIGHT / 2, right: 8, transform: 'translateY(-50%)', color: '#8A8173', fontVariantNumeric: 'tabular-nums' }}>{index + 1}</Typography>)}</Box>
        <canvas ref={canvasRef} width={SURFACE_WIDTH} height={surfaceHeight} aria-label={`${label}: area di scrittura libera`} onPointerDown={start} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} style={{ width: SURFACE_WIDTH, height: surfaceHeight, display: 'block', cursor: tool === 'pan' ? 'grab' : tool === 'eraser' ? 'cell' : 'crosshair', touchAction: tool === 'pan' ? 'pan-x pan-y' : 'none', userSelect: 'none', WebkitUserSelect: 'none' }} />
      </Box>
    </Box>
    <Box sx={{ px: 1.5, py: 1, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}><Typography variant="caption" color="success.main" display="block">● Disegno e lunghezza salvati automaticamente</Typography><Stack direction={{ xs: 'column', sm: 'row' }} gap={{ sm: 2 }}><FormControlLabel control={<Checkbox size="small" />} label="Ho scritto la regola usata" /><FormControlLabel control={<Checkbox size="small" />} label="Ho mostrato i passaggi" /><FormControlLabel control={<Checkbox size="small" />} label="Ho controllato segni e dominio" /></Stack></Box>
  </Box>;
}
