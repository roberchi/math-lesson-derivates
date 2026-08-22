import { useState } from 'react';
import { AppBar, Box, Button, Dialog, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import { WritingCanvas } from './WritingCanvas';

export function DigitalWorkspace({ workspaceKey, label, onShowSolution }: { workspaceKey: string; label: string; onShowSolution?: () => void }) {
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
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <WritingCanvas storageKey={workspaceKey} label={label} onShowSolution={onShowSolution ? () => { close(); onShowSolution(); } : undefined} />
      </Box>
    </Dialog>
  </>;
}
