import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Button, Dialog, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { MathText } from '@/components/math/MathText';
import { WritingCanvas } from './WritingCanvas';
import { useTranslation } from 'react-i18next';

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
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} aria-controls={`${workspaceKey}-problem-content`} id={`${workspaceKey}-problem-header`} sx={{ minHeight: 48, '& .MuiAccordionSummary-content': { my: 1 } }}>
          <Typography fontWeight={700}>{t('workspace.problem')} · {problemTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails id={`${workspaceKey}-problem-content`} sx={{ pt: 0, maxHeight: '28vh', overflowY: 'auto' }}>
          <Typography component="div" variant="body2"><MathText text={problemText} /></Typography>
        </AccordionDetails>
      </Accordion>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <WritingCanvas storageKey={workspaceKey} label={label} onShowSolution={onShowSolution ? () => { close(); onShowSolution(); } : undefined} />
      </Box>
    </Dialog>
  </>;
}
