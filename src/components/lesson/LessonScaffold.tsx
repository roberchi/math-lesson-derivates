import { useEffect, type ReactNode } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import { Link, useNavigate } from 'react-router-dom';
import { adjacentSection, lessonSections } from '@/data/course';
import { useLessonStore } from '@/store/lessonStore';
import { useTranslation } from 'react-i18next';

interface LessonScaffoldProps {
  sectionId: string;
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
}

export function LessonScaffold({ sectionId, children }: LessonScaffoldProps) {
  const { t } = useTranslation();
  const section = lessonSections.find((item) => item.id === sectionId);
  const previous = adjacentSection(sectionId, -1);
  const next = adjacentSection(sectionId, 1);
  const completed = useLessonStore((state) => state.readSections.includes(sectionId));
  const markComplete = useLessonStore((state) => state.markRead);
  const markIncomplete = useLessonStore((state) => state.markUnread);
  const setLastSection = useLessonStore((state) => state.setLastSection);
  const navigate = useNavigate();

  useEffect(() => setLastSection(sectionId), [sectionId, setLastSection]);

  const continueCourse = () => {
    markComplete(sectionId);
    if (sectionId === 'interpretazioni') {
      navigate('/scheda/1');
      return;
    }
    navigate(next?.path ?? '/scheda/2');
  };

  const forwardLabel = sectionId === 'interpretazioni'
    ? t('lesson.goSheet1')
    : next ? t(`course.${next.id}.short`) : t('lesson.goSheet2');
  const sectionKind = section?.kind === 'optional' ? ` · ${t('lesson.optional')}` : section?.kind === 'appendix' ? ` · ${t('lesson.appendix')}` : '';

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />} color="inherit">{t('common.overview')}</Button>
        <Chip icon={<ScheduleRoundedIcon />} label={section?.duration ?? '—'} variant="outlined" />
      </Stack>

      <Box component="header" sx={{ mb: 5 }}>
        <Typography variant="h4" color="primary.main" mb={1.5}>{t('common.lesson')} {section?.lesson} · {section?.duration}{sectionKind}</Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', sm: '4.25rem' }, maxWidth: 800, mb: 2 }}>{t(`lesson.content.${sectionId}.title`)}</Typography>
        <Typography sx={{ fontSize: '1.08rem', color: 'text.secondary', maxWidth: 720 }}>{t(`lesson.content.${sectionId}.lead`)}</Typography>
      </Box>

      <Stack spacing={4.5}>{children}</Stack>

      <Paper elevation={0} sx={{ mt: 6, p: { xs: 2.5, sm: 3.5 }, border: '1px solid', borderColor: completed ? 'success.main' : 'divider', bgcolor: completed ? 'success.light' : 'background.paper' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h3" sx={{ fontSize: '1.45rem' }}>{completed ? t('lesson.sectionRead') : t('lesson.didRead')}</Typography>
            <Typography variant="body2" color="text.secondary">{t('lesson.readNotice')}</Typography>
          </Box>
          <Button
            variant={completed ? 'outlined' : 'contained'}
            color={completed ? 'success' : 'primary'}
            startIcon={completed ? <CheckCircleRoundedIcon /> : <RadioButtonUncheckedRoundedIcon />}
            onClick={() => completed ? markIncomplete(sectionId) : markComplete(sectionId)}
          >
            {completed ? t('lesson.read') : t('lesson.markRead')}
          </Button>
        </Stack>
      </Paper>

      <Divider sx={{ my: 3 }} />
      <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mb={1.5}>
        {section && t(`course.${section.id}.short`)}{next ? ` · ${t('lesson.then', { section: t(`course.${next.id}.short`) })}` : ''}
      </Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
        <Button disabled={!previous} startIcon={<ArrowBackRoundedIcon />} onClick={() => previous && navigate(previous.path)}>{previous ? t(`course.${previous.id}.short`) : t('common.overview')}</Button>
        <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={continueCourse}>{forwardLabel}</Button>
      </Stack>
    </Box>
  );
}

export function SectionBlock({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children: ReactNode }) {
  return (
    <Box component="section">
      {eyebrow && <Typography variant="h4" color="primary.main" mb={1}>{eyebrow}</Typography>}
      <Typography variant="h2" sx={{ fontSize: { xs: '2rem', sm: '2.55rem' }, mb: 2 }}>{title}</Typography>
      <Box sx={{ color: 'text.secondary' }}>{children}</Box>
    </Box>
  );
}

export function PerspectiveCard({ icon, label, title, children }: { icon: string; label: string; title: string; children: ReactNode }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider', borderTop: '3px solid', borderTopColor: 'primary.main' }}>
      <Stack direction="row" alignItems="center" gap={1.25} mb={2}>
        <Box sx={{ width: 38, height: 38, display: 'grid', placeItems: 'center', bgcolor: 'rgba(65,88,208,.09)', borderRadius: 1.25, fontSize: '1.2rem' }}>{icon}</Box>
        <Typography variant="caption" color="primary.main" fontWeight={800}>{label}</Typography>
      </Stack>
      <Typography variant="h3" sx={{ fontSize: '1.35rem', mb: 1 }}>{title}</Typography>
      <Typography component="div" variant="body2" color="text.secondary">{children}</Typography>
    </Paper>
  );
}
