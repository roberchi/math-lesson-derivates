import { useState } from 'react';
import { AppBar, Box, Button, Dialog, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import { MathText } from '@/components/math/MathText';
import { WritingCanvas } from './WritingCanvas';

interface DigitalWorkspaceProps {
  workspaceKey: string;
  label: string;
  problemTitle: string;
  problemText: string;
  onShowSolution?: () => void;
}

export function DigitalWorkspace({ workspaceKey, label, problemTitle, problemText, onShowSolution }: DigitalWorkspaceProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return <>
    <Button variant="outlined" startIcon={<DrawRoundedIcon />} onClick={() => setOpen(true)}>Apri il foglio digitale a tutto schermo</Button>
    <Dialog fullScreen open={open} onClose={close} aria-labelledby={`${workspaceKey}-title`}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <Stack sx={{ flex: 1, minWidth: 0 }}>
            <Typography id={`${workspaceKey}-title`} variant="h3" sx={{ fontSize: { xs: '1.1rem', sm: '1.35rem' } }}>{label}</Typography>
            <Typography variant="caption" color="text.secondary">Salvataggio automatico attivo</Typography>
          </Stack>
          <IconButton edge="end" onClick={close} aria-label="Chiudi il foglio digitale"><CloseRoundedIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="section"
        aria-label="Testo del problema"
        sx={{ px: { xs: 1.5, sm: 2.5 }, py: 1.5, bgcolor: 'custom.goldLight', borderBottom: '1px solid', borderColor: 'divider', maxHeight: '28vh', overflowY: 'auto', flexShrink: 0 }}
      >
        <Typography variant="overline" color="primary.main">Problema da svolgere</Typography>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.05rem', sm: '1.2rem' }, mb: .5 }}>{problemTitle}</Typography>
        <Typography component="div" variant="body2"><MathText text={problemText} /></Typography>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <WritingCanvas storageKey={workspaceKey} label={label} onShowSolution={onShowSolution ? () => { close(); onShowSolution(); } : undefined} />
      </Box>
    </Dialog>
  </>;
}
