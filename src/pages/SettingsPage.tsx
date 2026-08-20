import { ChangeEvent, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Link } from 'react-router-dom';
import { useColorMode } from '@/theme/ThemeContext';
import { useProgressStore } from '@/store/progressStore';
import { useUIStore } from '@/store/uiStore';
import { useLessonStore } from '@/store/lessonStore';

export function SettingsPage() {
  const { mode, toggleMode } = useColorMode();
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const exportProgress = useProgressStore((state) => state.exportProgress);
  const importProgress = useProgressStore((state) => state.importProgress);
  const notify = useUIStore((state) => state.showSnackbar);
  const completedSections = useLessonStore((state) => state.completedSections);
  const lastSectionId = useLessonStore((state) => state.lastSectionId);
  const resetLessons = useLessonStore((state) => state.resetLessons);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importError, setImportError] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const download = () => {
    const payload = JSON.stringify({
      version: 1,
      lessonProgress: { completedSections, lastSectionId },
      exerciseProgress: JSON.parse(exportProgress()) as unknown,
    }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `progresso-derivate-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    let valid = false;
    try {
      const parsed = JSON.parse(text) as { lessonProgress?: { completedSections?: string[]; lastSectionId?: string | null }; exerciseProgress?: unknown };
      if (parsed.exerciseProgress) {
        valid = importProgress(JSON.stringify(parsed.exerciseProgress));
        if (valid && Array.isArray(parsed.lessonProgress?.completedSections)) {
          useLessonStore.setState({
            completedSections: parsed.lessonProgress.completedSections,
            lastSectionId: parsed.lessonProgress.lastSectionId ?? null,
          });
        }
      } else {
        valid = importProgress(text);
      }
    } catch {
      valid = false;
    }
    setImportError(!valid);
    if (valid) notify('Progresso importato correttamente');
    event.target.value = '';
  };

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto' }}>
      <Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />} color="inherit" sx={{ mb: 3 }}>Torna alla dashboard</Button>
      <Typography variant="h4" color="primary.main" mb={1}>Preferenze</Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', sm: '3.8rem' }, mb: 1 }}>Impostazioni</Typography>
      <Typography color="text.secondary" mb={4}>Personalizza la lettura e gestisci il tuo progresso locale.</Typography>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <SettingRow
          icon={mode === 'dark' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          title="Tema scuro"
          description="Riduce la luminosità e mantiene alto il contrasto delle formule."
          action={<Switch checked={mode === 'dark'} onChange={toggleMode} inputProps={{ 'aria-label': 'Tema scuro' }} />}
        />
        <Divider />
        <SettingRow
          icon={<DownloadOutlinedIcon />}
          title="Esporta progresso"
          description="Scarica una copia JSON dei tuoi risultati."
          action={<Button onClick={download} startIcon={<DownloadOutlinedIcon />}>Esporta</Button>}
        />
        <Divider />
        <SettingRow
          icon={<UploadOutlinedIcon />}
          title="Importa progresso"
          description="Ripristina un file esportato da questa app (schema v3)."
          action={<><input ref={fileInput} hidden type="file" accept="application/json" onChange={upload} /><Button onClick={() => fileInput.current?.click()} startIcon={<UploadOutlinedIcon />}>Importa</Button></>}
        />
      </Paper>
      {importError && <Alert severity="error" sx={{ mb: 3 }}>Il file non è un progresso valido o usa una versione non compatibile.</Alert>}

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'error.light', borderRadius: 2, p: 3, mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: '1.35rem', mb: .5 }}>Ricomincia il percorso</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>Cancella sezioni lette, punti, tentativi e classi completate da questo browser.</Typography>
        <Button color="error" variant="outlined" startIcon={<RestartAltRoundedIcon />} onClick={() => setConfirmOpen(true)}>Resetta progresso</Button>
      </Paper>

      <Typography variant="caption" color="text.secondary">DERIVATE · VERSIONE 1.0.0 · I DATI RESTANO NEL TUO BROWSER</Typography>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Azzerare tutto il progresso?</DialogTitle>
        <DialogContent><DialogContentText>L’operazione rimuoverà definitivamente sezioni lette, punti, risposte e classi completate. Puoi esportare prima una copia di sicurezza.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setConfirmOpen(false)}>Annulla</Button><Button color="error" variant="contained" onClick={() => { resetProgress(); resetLessons(); setConfirmOpen(false); notify('Progresso azzerato', 'info'); }}>Azzera tutto</Button></DialogActions>
      </Dialog>
    </Box>
  );
}

function SettingRow({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action: React.ReactNode }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} gap={2} p={2.5}>
      <Box sx={{ color: 'primary.main', width: 30 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}><Typography fontWeight={700}>{title}</Typography><Typography variant="body2" color="text.secondary">{description}</Typography></Box>
      {action}
    </Stack>
  );
}
