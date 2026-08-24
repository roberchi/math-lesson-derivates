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
import { useWritingStore } from '@/store/writingStore';
import { useTranslation } from 'react-i18next';

export function SettingsPage() {
  const { t } = useTranslation();
  const { mode, toggleMode } = useColorMode();
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const exportProgress = useProgressStore((state) => state.exportProgress);
  const importProgress = useProgressStore((state) => state.importProgress);
  const notify = useUIStore((state) => state.showSnackbar);
  const readSections = useLessonStore((state) => state.readSections);
  const verifiedConcepts = useLessonStore((state) => state.verifiedConcepts);
  const lastSectionId = useLessonStore((state) => state.lastSectionId);
  const resetLessons = useLessonStore((state) => state.resetLessons);
  const resetWritingSheets = useWritingStore((state) => state.resetWritingSheets);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importError, setImportError] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const download = () => {
    const payload = JSON.stringify({
      version: 2,
      lessonProgress: { readSections, verifiedConcepts, lastSectionId },
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
      const parsed = JSON.parse(text) as { lessonProgress?: { readSections?: string[]; verifiedConcepts?: string[]; lastSectionId?: string | null }; exerciseProgress?: unknown };
      if (parsed.exerciseProgress) {
        valid = importProgress(JSON.stringify(parsed.exerciseProgress));
        if (valid && Array.isArray(parsed.lessonProgress?.readSections)) {
          useLessonStore.setState({
            readSections: parsed.lessonProgress.readSections,
            verifiedConcepts: parsed.lessonProgress.verifiedConcepts ?? [],
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
    if (valid) notify(t('settings.imported'));
    event.target.value = '';
  };

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto' }}>
      <Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />} color="inherit" sx={{ mb: 3 }}>{t('settings.back')}</Button>
      <Typography variant="h4" color="primary.main" mb={1}>{t('settings.eyebrow')}</Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', sm: '3.8rem' }, mb: 1 }}>{t('settings.title')}</Typography>
      <Typography color="text.secondary" mb={4}>{t('settings.intro')}</Typography>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <SettingRow
          icon={mode === 'dark' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          title={t('settings.dark')}
          description={t('settings.darkBody')}
          action={<Switch checked={mode === 'dark'} onChange={toggleMode} inputProps={{ 'aria-label': t('settings.dark') }} />}
        />
        <Divider />
        <SettingRow
          icon={<DownloadOutlinedIcon />}
          title={t('settings.export')}
          description={t('settings.exportBody')}
          action={<Button onClick={download} startIcon={<DownloadOutlinedIcon />}>{t('settings.exportAction')}</Button>}
        />
        <Divider />
        <SettingRow
          icon={<UploadOutlinedIcon />}
          title={t('settings.import')}
          description={t('settings.importBody')}
          action={<><input ref={fileInput} hidden type="file" accept="application/json" onChange={upload} /><Button onClick={() => fileInput.current?.click()} startIcon={<UploadOutlinedIcon />}>{t('settings.importAction')}</Button></>}
        />
      </Paper>
      {importError && <Alert severity="error" sx={{ mb: 3 }}>{t('settings.invalid')}</Alert>}

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'error.light', borderRadius: 2, p: 3, mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: '1.35rem', mb: .5 }}>{t('settings.restart')}</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>{t('settings.restartBody')}</Typography>
        <Button color="error" variant="outlined" startIcon={<RestartAltRoundedIcon />} onClick={() => setConfirmOpen(true)}>{t('settings.reset')}</Button>
      </Paper>

      <Typography variant="caption" color="text.secondary">{t('settings.footer')}</Typography>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{t('settings.confirmTitle')}</DialogTitle>
        <DialogContent><DialogContentText>{t('settings.confirmBody')}</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setConfirmOpen(false)}>{t('common.cancel')}</Button><Button color="error" variant="contained" onClick={() => { resetProgress(); resetLessons(); resetWritingSheets(); localStorage.removeItem('deriv_progress_v3'); localStorage.removeItem('deriv_progress_v4'); localStorage.removeItem('derivate_lesson_progress_v1'); localStorage.removeItem('derivate_lesson_progress_v2'); localStorage.removeItem('derivate_writing_sheets_v1'); localStorage.removeItem('derivate_conclusione_v1'); setConfirmOpen(false); notify(t('settings.resetDone'), 'info'); }}>{t('settings.resetAll')}</Button></DialogActions>
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
