import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DigitalWorkspace } from '@/components/labs/DigitalWorkspace';
import { MathText } from '@/components/math/MathText';
import { ProgressiveSolution } from '@/components/lesson/ProgressiveSolution';
import { useLocalizedExerciseData } from '@/hooks/useLocalizedExerciseData';
import type { VerificationData } from '@/types/localizedExercises';

export function VerificationPage() {
  const { t } = useTranslation();
  const [openSolutions, setOpenSolutions] = useState<number[]>([]);
  const { data, loading, error } = useLocalizedExerciseData<VerificationData>('verification.json');

  if (loading || !data) {
    return <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>{error ? <Alert severity="error">{t('exerciseFiles.loadError', { error })}</Alert> : <CircularProgress aria-label={t('common.loadingPage')} />}</Box>;
  }

  const toggleSolution = (problemNumber: number) => {
    setOpenSolutions((current) => current.includes(problemNumber) ? current.filter((number) => number !== problemNumber) : [...current, problemNumber]);
  };

  const revealSolution = (problemNumber: number) => {
    setOpenSolutions((current) => current.includes(problemNumber) ? current : [...current, problemNumber]);
    window.requestAnimationFrame(() => {
      document.getElementById(`solution-problem-${problemNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <Box sx={{ maxWidth: 940, mx: 'auto' }} className="print-document">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1.5} mb={4} className="no-print">
        <Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />} color="inherit">{t('common.overview')}</Button>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
          <Chip label={t('worksheet.correction')} color="warning" variant="outlined" />
          <Button variant="outlined" startIcon={<PrintRoundedIcon />} onClick={() => window.print()}>{t('verification.print')}</Button>
        </Stack>
      </Stack>

      <Box component="header" sx={{ mb: 4, borderBottom: '2px solid', borderColor: 'text.primary', pb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h4" color="primary.main" mb={1}>{t('verification.eyebrow')}</Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', sm: '4rem' } }}>{t('verification.title')}</Typography>
            <Typography color="text.secondary" mt={1}>{t('verification.intro')}</Typography>
          </Box>
          <Stack alignItems={{ sm: 'flex-end' }} gap={1}>
            <Chip label={t('verification.time')} variant="outlined" />
            <Chip label={t('verification.points')} color="primary" />
            <Typography variant="body2">{t('worksheet.name')}</Typography>
          </Stack>
        </Stack>
      </Box>

      <Stack spacing={2.5}>
        {data.problems.map((problem) => {
          const solutionOpen = openSolutions.includes(problem.number);
          return (
            <Paper key={problem.number} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden', breakInside: 'avoid' }}>
              <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Stack direction="row" justifyContent="space-between" gap={2} mb={1.5}>
                  <Typography variant="h3" sx={{ fontSize: '1.45rem' }}>{problem.number}. {problem.title}</Typography>
                  <Chip label={`${problem.points} pt`} color="primary" variant="outlined" />
                </Stack>
                <Typography component="div" mb={2.5}><MathText text={problem.prompt} /></Typography>
                <Alert severity="info" icon={false} sx={{ mb: 2 }}><strong>{t('verification.rubric')}:</strong> {problem.rubric}</Alert>
                <Box className="digital-workspace"><DigitalWorkspace workspaceKey={`verification-${problem.number}`} label={t('workspace.verificationLabel', { problem: problem.number })} problemTitle={problem.title} problemText={problem.prompt} onShowSolution={() => revealSolution(problem.number)} /></Box>
                <Box className="print-writing-space" sx={{ display: 'none', height: 250, backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #C9D5E8 32px)' }} />
              </Box>

              <Accordion id={`solution-problem-${problem.number}`} className="digital-workspace" expanded={solutionOpen} onChange={() => toggleSolution(problem.number)} disableGutters elevation={0} sx={{ borderTop: '1px solid', borderColor: solutionOpen ? 'success.light' : 'divider', bgcolor: solutionOpen ? 'rgba(46, 125, 50, 0.045)' : 'background.paper', '&::before': { display: 'none' }, scrollMarginTop: 84 }}>
                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ px: { xs: 2.5, sm: 3 } }}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <CheckCircleOutlineRoundedIcon color={solutionOpen ? 'success' : 'disabled'} />
                    <Typography fontWeight={700}>{solutionOpen ? t('verification.solution') : t('verification.check')}</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 2.5, sm: 3 }, pb: 3 }}>
                  <ProgressiveSolution storageKey={`verification-${problem.number}`} steps={problem.steps} result={problem.result} />
                </AccordionDetails>
              </Accordion>
            </Paper>
          );
        })}
      </Stack>
      <Paper elevation={0} sx={{ mt: 3, p: 3, border: '1px dashed', borderColor: 'warning.main', bgcolor: 'custom.goldLight' }}>
        <Typography variant="h3" mb={1}>{t('verification.bonus')}</Typography>
        <Typography>{t('verification.bonusBody')}</Typography>
      </Paper>
    </Box>
  );
}
