import { lazy, Suspense, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Button, CircularProgress, Dialog, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { MathText } from '@/components/math/MathText';
import { useTranslation } from 'react-i18next';

// Excalidraw is a heavy dependency: load it lazily so it's only fetched once the workspace dialog actually opens.
const WritingCanvas = lazy(() => import('./WritingCanvas').then((module) => ({ default: module.WritingCanvas })));

interface DigitalWorkspaceProps {
  workspaceKey: string;
  label: string;
  problemTitle: string;
  problemText: string;
  onShowSolution?: () => void;
}

export function DigitalWorkspace({ workspaceKey, label, problemTitle, problemText, onShowSolution }: DigitalWorkspaceProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return <>
    <Button variant="outlined" startIcon={<DrawRoundedIcon />} onClick={() => setOpen(true)}>{t('workspace.open')}</Button>
    <Dialog fullScreen open={open} onClose={close} aria-labelledby={`${workspaceKey}-title`}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <Stack sx={{ flex: 1, minWidth: 0 }}>
            <Typography id={`${workspaceKey}-title`} variant="h3" sx={{ fontSize: { xs: '1.1rem', sm: '1.35rem' } }}>{label}</Typography>
            <Typography variant="caption" color="text.secondary">{t('workspace.autosave')}</Typography>
          </Stack>
          <IconButton edge="end" onClick={close} aria-label={t('workspace.close')}><CloseRoundedIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <Accordion disableGutters elevation={0} sx={{ flexShrink: 0, bgcolor: 'custom.goldLight', borderBottom: '1px solid', borderColor: 'divider', '&::before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} aria-controls={`${workspaceKey}-problem-content`} id={`${workspaceKey}-problem-header`} sx={{ minHeight: 48, '& .MuiAccordionSummary-content': { my: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }}>
          <Typography fontWeight={700}>{t('workspace.problem')} · {problemTitle}</Typography>
          {onShowSolution && <Button size="small" color="warning" startIcon={<VisibilityRoundedIcon />} onClick={(event) => { event.stopPropagation(); close(); onShowSolution(); }} sx={{ mr: 1 }}>{t('workspace.solution')}</Button>}
        </AccordionSummary>
        <AccordionDetails id={`${workspaceKey}-problem-content`} sx={{ pt: 0, maxHeight: '28vh', overflowY: 'auto' }}>
          <Typography component="div" variant="body2"><MathText text={problemText} /></Typography>
        </AccordionDetails>
      </Accordion>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Suspense fallback={<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><CircularProgress /></Box>}>
          <WritingCanvas storageKey={workspaceKey} label={label} />
        </Suspense>
      </Box>
    </Dialog>
  </>;
}
