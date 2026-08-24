import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DigitalWorkspace } from '@/components/labs/DigitalWorkspace';
import { MathText } from '@/components/math/MathText';
import { ProgressiveSolution } from '@/components/lesson/ProgressiveSolution';
import { useLocalizedExerciseData } from '@/hooks/useLocalizedExerciseData';
import type { WorksheetData } from '@/types/localizedExercises';

export function WorksheetPage() {
  const { t } = useTranslation();
  const { sheetId = '' } = useParams();
  const [openSolutions, setOpenSolutions] = useState<string[]>([]);
  const { data, loading, error } = useLocalizedExerciseData<WorksheetData>('worksheets.json');

  if (sheetId !== '1' && sheetId !== '2') return <Navigate to="/" replace />;
  if (loading || !data) {
    return <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>{error ? <Alert severity="error">{t('exerciseFiles.loadError', { error })}</Alert> : <CircularProgress aria-label={t('common.loadingPage')} />}</Box>;
  }

  const exercises = data.sheets[sheetId].exercises;
  const first = sheetId === '1';
  const title = t(first ? 'worksheet.title1' : 'worksheet.title2');
  const time = t(first ? 'worksheet.time1' : 'worksheet.time2');

  const revealSolution = (key: string) => {
    setOpenSolutions((current) => current.includes(key) ? current : [...current, key]);
    window.requestAnimationFrame(() => {
      document.getElementById(`solution-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <Box sx={{ maxWidth: 940, mx: 'auto' }} className="print-document">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1.5} mb={4} className="no-print">
        <Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />} color="inherit">{t('common.overview')}</Button>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
          <Chip label={t('worksheet.correction')} color="warning" variant="outlined" />
          <Button variant="outlined" startIcon={<PrintRoundedIcon />} onClick={() => window.print()}>{t('worksheet.print')}</Button>
        </Stack>
      </Stack>
      <Box component="header" sx={{ mb: 4, borderBottom: '2px solid', borderColor: 'text.primary', pb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
          <Box><Typography variant="h4" color="primary.main" mb={1}>{t('worksheet.eyebrow', { sheet: sheetId })}</Typography><Typography variant="h1" sx={{ fontSize: { xs: '2.7rem', sm: '3.7rem' } }}>{title}</Typography></Box>
          <Box sx={{ textAlign: { sm: 'right' } }}><Chip label={time} variant="outlined" /><Typography variant="body2" color="text.secondary" mt={1}>{t('worksheet.name')}</Typography></Box>
        </Stack>
      </Box>
      <Typography color="text.secondary" mb={3}>{t('worksheet.intro')}</Typography>

      <Stack spacing={2}>
        {exercises.map((exercise) => {
          const key = `${sheetId}-${exercise.number}`;
          const solutionOpen = openSolutions.includes(key);
          const isChallenge = exercise.difficulty.includes('★★★');
          const isBase = !exercise.difficulty.includes('★');

          return (
            <Paper key={exercise.number} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden', breakInside: 'avoid' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '36px minmax(0,1fr)', sm: '44px minmax(0,1fr)' }, gap: { xs: 1.25, sm: 2 }, p: { xs: 2, sm: 2.5 } }}>
                <Box sx={{ width: { xs: 34, sm: 40 }, height: { xs: 34, sm: 40 }, borderRadius: '50%', bgcolor: 'custom.ink', color: 'white', display: 'grid', placeItems: 'center', fontFamily: 'Crimson Pro', fontSize: '1.25rem', fontWeight: 700 }}>{exercise.number}</Box>
                <Box>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
                    <Typography variant="h3" sx={{ fontSize: '1.35rem' }}>{exercise.title}</Typography>
                    <Stack direction="row" gap={1} flexWrap="wrap"><Chip size="small" label={exercise.type} variant="outlined" /><Chip size="small" label={exercise.difficulty} color={isBase ? 'success' : isChallenge ? 'warning' : 'primary'} variant="outlined" /></Stack>
                  </Stack>
                  <Typography component="div" sx={{ mt: 1.5 }}><MathText text={exercise.prompt} /></Typography>
                  <Box className="digital-workspace" sx={{ mt: 2 }}><DigitalWorkspace workspaceKey={`worksheet-${key}`} label={t('workspace.worksheetLabel', { sheet: sheetId, exercise: exercise.number })} problemTitle={exercise.title} problemText={exercise.prompt} onShowSolution={() => revealSolution(key)} /></Box>
                </Box>
              </Box>

              <Accordion id={`solution-${key}`} className="digital-workspace" expanded={solutionOpen} onChange={() => setOpenSolutions((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])} disableGutters elevation={0} sx={{ borderTop: '1px solid', borderColor: solutionOpen ? 'warning.main' : 'divider', bgcolor: solutionOpen ? 'rgba(237, 166, 20, 0.07)' : 'background.paper', borderRadius: '0 !important', '&::before': { display: 'none' }, scrollMarginTop: 84 }}>
                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                  <Stack direction="row" gap={1} alignItems="center"><VisibilityRoundedIcon color="warning" /><Typography fontWeight={700}>{t('worksheet.guidedSolution')}</Typography></Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
                  <ProgressiveSolution storageKey={`worksheet-${key}`} steps={exercise.solution.steps} result={exercise.solution.result} />
                </AccordionDetails>
              </Accordion>

              <Box className="print-writing-space" sx={{ display: 'none', height: 190, backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #C9D5E8 32px)' }} />
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
