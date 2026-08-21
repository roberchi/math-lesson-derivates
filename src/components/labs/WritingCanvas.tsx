import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, IconButton, Slider, Stack, Tooltip, Typography } from '@mui/material';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import CleaningServicesRoundedIcon from '@mui/icons-material/CleaningServicesRounded';
import CloseFullscreenRoundedIcon from '@mui/icons-material/CloseFullscreenRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import HighlightRoundedIcon from '@mui/icons-material/HighlightRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import PanToolAltRoundedIcon from '@mui/icons-material/PanToolAltRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

type Tool = 'pen' | 'highlight' | 'eraser' | 'pan';

const SURFACE_WIDTH = 1200;
const INITIAL_SURFACE_HEIGHT = 680;
const MAX_SURFACE_HEIGHT = 1760;
const HEIGHT_INCREMENT = 360;

export function WritingCanvas({ label = 'Spazio di lavoro', onShowSolution }: { label?: string; onShowSolution?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const drawingPointer = useRef<number | null>(null);
  const pageUnlock = useRef<(() => void) | null>(null);
  const unlockTimer = useRef<number | null>(null);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#263B8F');
  const [size, setSize] = useState(4);
  const [expanded, setExpanded] = useState(false);
  const [surfaceHeight, setSurfaceHeight] = useState(INITIAL_SURFACE_HEIGHT);

  const releasePageLock = useCallback(() => {
    if (unlockTimer.current !== null) {
      window.clearTimeout(unlockTimer.current);
      unlockTimer.current = null;
    }
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
    // Il palmo può restare sul display per qualche istante dopo il sollevamento della Pencil.
    unlockTimer.current = window.setTimeout(releasePageLock, 300);
  };

  useEffect(() => () => releasePageLock(), [releasePageLock]);

  const coordinates = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === 'pan') return;

    // In modalità disegno il dito è sempre ignorato: serve da palm rejection.
    if (event.pointerType === 'touch') {
      event.preventDefault();
      return;
    }
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
    context.globalAlpha = tool === 'highlight' ? 0.28 : 1;
    context.strokeStyle = color;
    const pressure = event.pressure > 0 ? event.pressure : 0.5;
    context.lineWidth = tool === 'eraser' ? size * 5 : tool === 'highlight' ? size * 4 : size * (0.75 + pressure * 0.5);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stop = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerId !== drawingPointer.current) return;
    drawing.current = false;
    drawingPointer.current = null;
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      context.closePath();
      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';
    }
    if (event.pointerType !== 'mouse') releasePageLockAfterPalm();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const addSpace = () => {
    const canvas = canvasRef.current;
    if (!canvas || surfaceHeight >= MAX_SURFACE_HEIGHT) return;

    const snapshot = document.createElement('canvas');
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    snapshot.getContext('2d')?.drawImage(canvas, 0, 0);

    const nextHeight = Math.min(surfaceHeight + HEIGHT_INCREMENT, MAX_SURFACE_HEIGHT);
    canvas.height = nextHeight;
    canvas.getContext('2d')?.drawImage(snapshot, 0, 0);
    setSurfaceHeight(nextHeight);
    setExpanded(true);

    window.requestAnimationFrame(() => {
      const viewport = scrollRef.current;
      if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    });
  };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden', bgcolor: '#FFFEFA' }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ md: 'center' }}
        gap={1}
        px={1.5}
        py={1}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            {label.toUpperCase()} · PENCIL/STILO COMPATIBILE
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {tool === 'pan'
              ? 'MODALITÀ SPOSTA · trascina il foglio con un dito'
              : 'MODALITÀ DISEGNO · foglio bloccato e protezione palmo attiva'}
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" gap={0.5} flexWrap="wrap">
          <Tooltip title="Penna"><IconButton size="small" color={tool === 'pen' ? 'primary' : 'default'} onClick={() => setTool('pen')} aria-label="Penna"><BorderColorRoundedIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Evidenziatore"><IconButton size="small" color={tool === 'highlight' ? 'primary' : 'default'} onClick={() => setTool('highlight')} aria-label="Evidenziatore"><HighlightRoundedIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Gomma"><IconButton size="small" color={tool === 'eraser' ? 'primary' : 'default'} onClick={() => setTool('eraser')} aria-label="Gomma"><CleaningServicesRoundedIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Sposta il foglio">
            <IconButton size="small" color={tool === 'pan' ? 'primary' : 'default'} onClick={() => setTool('pan')} aria-label="Sposta il foglio" aria-pressed={tool === 'pan'}>
              <PanToolAltRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <input type="color" value={color} onChange={(event) => setColor(event.target.value)} aria-label="Colore tratto" style={{ width: 28, height: 28, border: 0, padding: 0, background: 'transparent' }} />
          <Box sx={{ width: 70, px: 1 }}><Slider size="small" min={2} max={12} value={size} onChange={(_event, value) => setSize(value as number)} aria-label="Dimensione tratto" /></Box>
          <Tooltip title={expanded ? 'Riduci la vista' : 'Allarga la vista'}>
            <IconButton size="small" color={expanded ? 'primary' : 'default'} onClick={() => setExpanded((value) => !value)} aria-label={expanded ? 'Riduci area di scrittura' : 'Allarga area di scrittura'}>
              {expanded ? <CloseFullscreenRoundedIcon fontSize="small" /> : <OpenInFullRoundedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Aggiungi spazio in fondo al foglio">
            <span>
              <IconButton size="small" onClick={addSpace} disabled={surfaceHeight >= MAX_SURFACE_HEIGHT} aria-label="Aggiungi spazio al foglio">
                <AddBoxRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          {onShowSolution && (
            <Button size="small" color="warning" startIcon={<VisibilityRoundedIcon />} onClick={onShowSolution}>Soluzione</Button>
          )}
          <Button size="small" color="error" startIcon={<DeleteSweepRoundedIcon />} onClick={clear}>Cancella</Button>
        </Stack>
      </Stack>

      <Box
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label={`${label}: foglio scorrevole`}
        sx={{
          height: expanded ? { xs: '65vh', sm: 620 } : { xs: 270, sm: 390 },
          maxHeight: expanded ? 720 : 420,
          overflow: 'auto',
          overscrollBehaviorX: 'contain',
          overscrollBehaviorY: 'auto',
          WebkitOverflowScrolling: 'touch',
          backgroundColor: '#FFFEFA',
        }}
      >
        <Box
          sx={{
            width: SURFACE_WIDTH,
            height: surfaceHeight,
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #C9D5E8 32px)',
          }}
        >
          <canvas
            ref={canvasRef}
            width={SURFACE_WIDTH}
            height={INITIAL_SURFACE_HEIGHT}
            aria-label={`${label}: area di scrittura libera`}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={stop}
            onPointerCancel={stop}
            style={{
              width: SURFACE_WIDTH,
              height: surfaceHeight,
              display: 'block',
              cursor: tool === 'pan' ? 'grab' : tool === 'eraser' ? 'cell' : 'crosshair',
              touchAction: tool === 'pan' ? 'pan-x pan-y' : 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
