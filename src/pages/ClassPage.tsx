import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { DifficultyChip } from '@/components/common/DifficultyChip';
import { MathText } from '@/components/math/MathText';
import { useDBStore } from '@/store/dbStore';
import { useProgressStore } from '@/store/progressStore';
import { arePrerequisitesMastered, buildAdaptiveOrder, getClassMetrics, stripLatex } from '@/utils/learning';
import { useTranslation } from 'react-i18next';

export function ClassPage() {
  const { t } = useTranslation();
  const { classId = '' } = useParams();
  const db = useDBStore((state) => state.db);
  const progress = useProgressStore((state) => state.progress);
  const navigate = useNavigate();
  if (!db) return null;
  const cls = db.classes.find((item) => item.id === classId);
  if (!cls) return <Navigate to="/" replace />;
  const effectivelyUnlocked = progress.classes[classId]?.unlocked || progress.classes[classId]?.consultation || arePrerequisitesMastered(cls.prerequisite_classes, progress);
  if (!effectivelyUnlocked) return <Navigate to="/" replace />;
  const ordered = buildAdaptiveOrder(cls.exercises, cls.id, progress);
  const metrics = getClassMetrics(cls, progress);
  const next = ordered.find((exercise) => !progress.classes[classId]?.attempts[exercise.id]?.done) ?? ordered[0];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />} color="inherit" sx={{ mb: 3 }}>{t('classPage.back')}</Button>
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 4, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'flex-start' }}>
          <Box sx={{ width: 70, height: 70, flexShrink: 0, bgcolor: 'primary.main', color: 'white', borderRadius: 2, display: 'grid', placeItems: 'center', fontFamily: 'Crimson Pro', fontSize: '2rem', fontWeight: 700 }}>{cls.icon}</Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" color="primary.main" mb={1}>{t('classPage.classOf', { current: db.classes.findIndex((item) => item.id === cls.id) + 1, total: db.classes.length })}</Typography>
            <Typography variant="h2" mb={1} component="div"><MathText text={cls.title} /></Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 700 }}>{cls.description}</Typography>
            {!!cls.prerequisite_classes.length && <Stack direction="row" spacing={1} mt={2} alignItems="center"><Typography variant="caption" color="text.secondary">{t('classPage.prerequisites')}</Typography>{cls.prerequisite_classes.map((id) => <Chip key={id} size="small" icon={<CheckRoundedIcon />} color="success" variant="outlined" label={stripLatex(db.classes.find((item) => item.id === id)?.title ?? id)} />)}</Stack>}
          </Box>
          <Box sx={{ minWidth: 115, textAlign: { sm: 'right' } }}><Typography sx={{ fontFamily: 'Crimson Pro', fontWeight: 700, fontSize: '2rem' }}>{metrics.completed}/{metrics.total}</Typography><Typography variant="caption" color="text.secondary">{t('classPage.completed')}</Typography></Box>
        </Stack>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2} mb={2}>
        <Box><Typography variant="h3">{t('common.exercises')}</Typography><Typography variant="body2" color="text.secondary">{t('classPage.intro')}</Typography></Box>
        <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate(`/class/${classId}/exercise/${next.id}`)}>
          {metrics.completed ? metrics.completed === metrics.total ? t('classPage.review') : t('classPage.continue') : t('classPage.start')}
        </Button>
      </Stack>
      <LinearProgress variant="determinate" value={metrics.progressPercent} sx={{ mb: 2.5 }} />

      <List disablePadding sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
        {ordered.map((exercise, index) => {
          const attempt = progress.classes[classId]?.attempts[exercise.id];
          const status = !attempt?.done ? 'idle' : attempt.score === 0 ? 'wrong' : (attempt.score ?? 0) < 3 ? 'partial' : 'correct';
          const icon = status === 'correct' ? <CheckRoundedIcon /> : status === 'wrong' ? <CloseRoundedIcon /> : status === 'partial' ? <RemoveRoundedIcon /> : <RadioButtonUncheckedRoundedIcon />;
          const color = status === 'correct' ? 'success.main' : status === 'wrong' ? 'error.main' : status === 'partial' ? 'warning.main' : 'text.disabled';
          return (
            <Box key={exercise.id}>
              {index > 0 && <Divider />}
              <ListItemButton onClick={() => navigate(`/class/${classId}/exercise/${exercise.id}`)} sx={{ py: 2, px: { xs: 1.5, sm: 2.5 }, gap: 1.5 }}>
                <Avatar sx={{ width: 31, height: 31, bgcolor: 'transparent', color, border: '1px solid', borderColor: color }}>{icon}</Avatar>
                <ListItemText
                  primary={<Typography fontWeight={650}>{exercise.title}</Typography>}
                  secondary={<Typography variant="caption" color="text.secondary">{exercise.tags.slice(0, 3).join(' · ')}</Typography>}
                />
                <Stack direction="row" alignItems="center" spacing={1} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <DifficultyChip level={exercise.difficulty} />
                  {exercise.proof_from_limit && <Chip size="small" label="📐" title={t('classPage.proofAvailable')} sx={{ bgcolor: 'custom.goldLight', color: 'custom.gold' }} />}
                  <Typography variant="caption" sx={{ minWidth: 35, textAlign: 'right' }}>{attempt?.done ? `${attempt.score ?? 0} pt` : '—'}</Typography>
                </Stack>
              </ListItemButton>
            </Box>
          );
        })}
      </List>

      {metrics.completed === metrics.total && (
        <Stack mt={3} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ bgcolor: metrics.mastered ? 'success.light' : 'warning.light', color: metrics.mastered ? 'success.dark' : 'warning.dark', p: 2.5, borderRadius: 2 }}>
          <Typography fontWeight={700}>{metrics.mastered ? t('classPage.mastered') : t('classPage.recovery')}</Typography>
          <Button endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate(`/class/${classId}/results`)}>{t('classPage.results')}</Button>
        </Stack>
      )}
    </Box>
  );
}
