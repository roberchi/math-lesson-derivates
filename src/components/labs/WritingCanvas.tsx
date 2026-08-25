import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { Excalidraw } from '@excalidraw/excalidraw';
import type { AppState, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types';
import '@excalidraw/excalidraw/index.css';
import { useWritingStore } from '@/store/writingStore';
import { useTranslation } from 'react-i18next';

// Mirrors the 32px line height of the ruled paper used before switching to Excalidraw: the
// component has no notion of "numbered ruled lines", so its native dot grid is the closest
// built-in equivalent and keeps the same visual rhythm while writing.
const GRID_SIZE = 32;
const SAVE_DEBOUNCE_MS = 500;

// Maps the app's language codes to Excalidraw's own locale codes.
const EXCALIDRAW_LANGUAGE: Record<string, string> = { it: 'it-IT', en: 'en', fr: 'fr-FR', de: 'de-DE', es: 'es-ES' };

interface SavedScene {
  elements: ExcalidrawInitialDataState['elements'];
  appState: ExcalidrawInitialDataState['appState'];
}

function parseSavedScene(serialized: string | undefined): SavedScene | null {
  if (!serialized) return null;
  try {
    const parsed = JSON.parse(serialized);
    if (!parsed || typeof parsed !== 'object') return null;
    return { elements: parsed.elements ?? [], appState: parsed.appState ?? {} };
  } catch {
    return null;
  }
}

export function WritingCanvas({ storageKey, label }: { storageKey: string; label?: string }) {
  const { t, i18n } = useTranslation();
  const workspaceLabel = label ?? t('workspace.problem');
  const initialSheet = useRef(useWritingStore.getState().sheets[storageKey]);
  const saveSheet = useWritingStore((state) => state.saveSheet);
  const checklist = useWritingStore((state) => state.sheets[storageKey]?.checklist);
  const setChecklistAnswer = useWritingStore((state) => state.setChecklistAnswer);
  const saveTimer = useRef<number | null>(null);

  const initialScene = useMemo(() => parseSavedScene(initialSheet.current?.dataUrl), []);

  const persist = useCallback((elements: unknown, appState: AppState) => {
    const payload = JSON.stringify({
      elements,
      appState: { viewBackgroundColor: appState.viewBackgroundColor, scrollX: appState.scrollX, scrollY: appState.scrollY, zoom: appState.zoom, gridSize: appState.gridSize, gridModeEnabled: appState.gridModeEnabled },
    });
    saveSheet(storageKey, payload, 0);
  }, [saveSheet, storageKey]);

  const handleChange = useCallback((elements: unknown, appState: AppState) => {
    if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => persist(elements, appState), SAVE_DEBOUNCE_MS);
  }, [persist]);

  useEffect(() => () => { if (saveTimer.current !== null) window.clearTimeout(saveTimer.current); }, []);

  return <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: '#FFFEFA' }}>
    <Box role="region" aria-label={t('workspace.scrollableSheet', { label: workspaceLabel })} sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
      <Excalidraw
        initialData={{
          elements: initialScene?.elements ?? [],
          appState: {
            viewBackgroundColor: '#FFFEFA',
            currentItemStrokeColor: '#263B8F',
            gridSize: GRID_SIZE,
            gridModeEnabled: true,
            ...initialScene?.appState,
          },
          scrollToContent: true,
        }}
        onChange={handleChange}
        langCode={EXCALIDRAW_LANGUAGE[i18n.language] ?? 'en'}
        UIOptions={{ canvasActions: { loadScene: false, saveToActiveFile: false } }}
        name={workspaceLabel}
      />
    </Box>
    <Box sx={{ px: 1.5, py: .5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Typography variant="caption" color="success.main" display="block">● {t('workspace.autosave')}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' }, columnGap: 1 }}>
        <FormControlLabel sx={{ m: 0 }} control={<Checkbox size="small" checked={checklist?.rule ?? false} onChange={(_event, checked) => setChecklistAnswer(storageKey, 'rule', checked)} />} label={<Typography variant="caption">{t('workspace.ruleWritten')}</Typography>} />
        <FormControlLabel sx={{ m: 0 }} control={<Checkbox size="small" checked={checklist?.steps ?? false} onChange={(_event, checked) => setChecklistAnswer(storageKey, 'steps', checked)} />} label={<Typography variant="caption">{t('workspace.stepsShown')}</Typography>} />
        <FormControlLabel sx={{ m: 0 }} control={<Checkbox size="small" checked={checklist?.domain ?? false} onChange={(_event, checked) => setChecklistAnswer(storageKey, 'domain', checked)} />} label={<Typography variant="caption">{t('workspace.domainChecked')}</Typography>} />
      </Box>
    </Box>
  </Box>;
}
