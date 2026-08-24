import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import { Link, useNavigate } from 'react-router-dom';
import { coreSections, enrichmentSections, lessonOneSections, lessonSections, lessonTwoSections } from '@/data/course';
import { useLessonStore } from '@/store/lessonStore';
import { PerspectiveCard } from '@/components/lesson/LessonScaffold';
import { useProgressStore } from '@/store/progressStore';
import { useDBStore } from '@/store/dbStore';
import { useTranslation } from 'react-i18next';

export function OverviewPage() {
  const { t } = useTranslation();
  const completed = useLessonStore((state) => state.readSections);
  const lastSectionId = useLessonStore((state) => state.lastSectionId);
  const verifiedConcepts = useLessonStore((state) => state.verifiedConcepts);
  const progress = useProgressStore((state) => state.progress);
  const db = useDBStore((state) => state.db);
  const navigate = useNavigate();
  const lastSection = lessonSections.find((section) => section.id === lastSectionId);
  const nextSection = (lastSection && !completed.includes(lastSection.id) ? lastSection : undefined)
    ?? coreSections.find((section) => !completed.includes(section.id))
    ?? lessonSections[0];
  const coreRead = coreSections.filter((section) => completed.includes(section.id)).length;
  const optionalRead = enrichmentSections.filter((section) => completed.includes(section.id)).length;
  const percent = Math.round(coreRead / coreSections.length * 100);
  const adaptiveVerified = Object.values(progress.classes).flatMap((cls) => Object.values(cls.attempts)).filter((attempt) => attempt.proofCheckpointPassed).length;
  const masteredClasses = Object.values(progress.classes).filter((cls) => cls.mastered).length;

  return (
    <>
      <Box component="section" sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'custom.ink', color: 'white', borderRadius: 2.5, p: { xs: 3, sm: 5, md: 6 }, mb: 5 }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 2 }}>{t('overview.eyebrow')}</Typography>
        <Typography variant="h1" sx={{ maxWidth: 800 }}>{t('overview.title')}<br /><Box component="span" sx={{ color: '#F0C95A', fontStyle: 'italic' }}>{t('overview.titleAccent')}</Box></Typography>
        <Typography sx={{ color: '#C4CDDC', maxWidth: 650, mt: 2.5, mb: 3.5, fontSize: '1.08rem' }}>
          {t('overview.intro')}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} alignItems={{ sm: 'center' }}>
          <Button component={Link} to={percent === 100 ? '/conclusione' : nextSection.path} variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />} sx={{ position: 'relative', zIndex: 1, bgcolor: '#F2C94C', color: '#17243F', '&:hover': { bgcolor: '#FFD968' } }}>
            {percent === 100 ? t('overview.openSummary') : completed.length ? t('overview.resume') : t('overview.start')}
          </Button>
          <Typography variant="caption" sx={{ color: '#9EABC0' }}>{t('overview.coreRead', { read: coreRead, total: coreSections.length, optional: optionalRead, optionalTotal: enrichmentSections.length })}</Typography>
        </Stack>
        <Box aria-hidden sx={{ pointerEvents: 'none', position: 'absolute', right: { xs: -90, md: 45 }, bottom: -115, width: 330, height: 330, border: '1px solid rgba(255,255,255,.12)', borderRadius: '50%', '&:before': { content: '"dy/dx"', position: 'absolute', left: 55, top: 80, fontFamily: 'Crimson Pro', fontStyle: 'italic', fontSize: '4.3rem', color: 'rgba(255,255,255,.08)' } }} />
      </Box>

      <Box mb={5}>
        <Stack direction="row" justifyContent="space-between" mb={1}><Typography variant="caption" color="text.secondary">{t('overview.progress')}</Typography><Typography variant="caption">{percent}%</Typography></Stack>
        <LinearProgress variant="determinate" value={percent} />
        <Grid container spacing={1.5} mt={1}>
          {[
            [`${coreRead}/${coreSections.length}`, t('overview.coreSections')],
            [`${verifiedConcepts.length + adaptiveVerified}`, t('overview.verified')],
            [`${masteredClasses}/${db?.classes.length ?? 7}`, t('overview.mastered')],
            [`${optionalRead}/${enrichmentSections.length}`, t('overview.enrichment')],
          ].map(([value, label]) => <Grid item xs={6} md={3} key={label}><Paper elevation={0} sx={{ p: 1.75, border: '1px solid', borderColor: 'divider', height: '100%' }}><Typography variant="h3" color="primary.main">{value}</Typography><Typography variant="caption" color="text.secondary">{label}</Typography></Paper></Grid>)}
        </Grid>
      </Box>

      <Box mb={6}>
        <Typography variant="h4" color="primary.main" mb={1}>{t('overview.oneQuestion')}</Typography>
        <Typography variant="h2" mb={2.5}>{t('overview.what')}</Typography>
        <Grid container spacing={2}>
          {[
            { section: 'geometria', key: 'geometry', icon: '◢' },
            { section: 'definizione', key: 'analytic', icon: 'lim' },
            { section: 'interpretazioni', key: 'application', icon: '↗' },
          ].map((item, index) => {
            const revealed = completed.includes(item.section);
            const sectionTitle = t(`course.${item.section}.short`);
            return <Grid item xs={12} md={4} key={item.section}><PerspectiveCard icon={revealed ? item.icon : '?'} label={revealed ? t(`overview.cards.${item.key}.label`) : t('overview.question', { number: index + 1 })} title={revealed ? t(`overview.cards.${item.key}.title`) : t(`overview.cards.${item.key}.q`)}>{revealed ? t(`overview.cards.${item.key}.answer`) : t('overview.unlock', { section: sectionTitle })}</PerspectiveCard></Grid>;
          })}
        </Grid>
      </Box>

      <CourseLesson
        number="01"
        title={t('overview.lesson1.title')}
        subtitle={t('overview.lesson1.subtitle')}
        duration={t('overview.lesson1.duration')}
        objective={t('overview.lesson1.objective')}
        sections={lessonOneSections}
        completed={completed}
        onOpen={(path) => navigate(path)}
      />
      <CourseLesson
        number="02"
        title={t('overview.lesson2.title')}
        subtitle={t('overview.lesson2.subtitle')}
        duration={t('overview.lesson2.duration')}
        objective={t('overview.lesson2.objective')}
        sections={lessonTwoSections}
        completed={completed}
        onOpen={(path) => navigate(path)}
      />

      <Box mt={7}>
        <Typography variant="h4" color="primary.main" mb={1}>{t('overview.associated')}</Typography>
        <Typography variant="h2" mb={2.5}>{t('overview.train')}</Typography>
        <Grid container spacing={2}>
          {[
            { icon: <DrawOutlinedIcon />, title: t('overview.material.sheet1'), body: t('overview.material.sheet1Body'), path: '/scheda/1' },
            { icon: <AssignmentOutlinedIcon />, title: t('overview.material.sheet2'), body: t('overview.material.sheet2Body'), path: '/scheda/2' },
            { icon: <QuizOutlinedIcon />, title: t('overview.material.test'), body: t('overview.material.testBody'), path: '/verifica' },
            { icon: <RouteRoundedIcon />, title: t('overview.material.adaptive'), body: t('overview.material.adaptiveBody'), path: '/esercizi' },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.path}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}><CardActionArea onClick={() => navigate(item.path)} sx={{ height: '100%' }}><CardContent><Box color="primary.main" mb={2}>{item.icon}</Box><Typography variant="h5" mb={.75}>{item.title}</Typography><Typography variant="body2" color="text.secondary">{item.body}</Typography></CardContent></CardActionArea></Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Paper elevation={0} sx={{ mt: 5, p: { xs: 2.5, sm: 3 }, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h3" sx={{ fontSize: '1.35rem', mb: .5 }}>{t('overview.source')}</Typography>
            <Typography variant="body2" color="text.secondary">{t('overview.sourceBody')}</Typography>
          </Box>
          <Button
            component="a"
            href="https://github.com/roberchi/math-lesson-derivates"
            target="_blank"
            rel="noreferrer"
            variant="outlined"
            startIcon={<GitHubIcon />}
            sx={{ flexShrink: 0 }}
          >
            {t('overview.openRepo')}
          </Button>
        </Stack>
      </Paper>
    </>
  );
}

function CourseLesson({ number, title, subtitle, duration, objective, sections, completed, onOpen }: { number: string; title: string; subtitle: string; duration: string; objective: string; sections: typeof lessonSections; completed: string[]; onOpen: (path: string) => void }) {
  const { t } = useTranslation();
  const done = sections.filter((section) => completed.includes(section.id)).length;
  return (
    <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Grid container>
        <Grid item xs={12} md={4} sx={{ bgcolor: 'custom.ink', color: 'white', p: { xs: 3, sm: 4 } }}>
          <Stack direction="row" justifyContent="space-between" mb={3}><Typography variant="caption" sx={{ color: '#91A3FA' }}>{t('common.lesson')} {number}</Typography><Chip size="small" label={duration} sx={{ color: 'white', borderColor: 'rgba(255,255,255,.3)' }} variant="outlined" /></Stack>
          <Typography variant="h2" sx={{ fontSize: '2.35rem', mb: 1 }}>{title}</Typography>
          <Typography sx={{ color: '#C4CDDC', mb: 3 }}>{subtitle}</Typography>
          <Typography variant="caption" sx={{ color: '#91A3FA' }}>{t('common.objective')}</Typography><Typography variant="body2" sx={{ color: '#C4CDDC', mt: .75 }}>{objective}</Typography>
        </Grid>
        <Grid item xs={12} md={8} sx={{ p: { xs: 2, sm: 3 } }}>
          {sections.map((section, index) => {
            const isDone = completed.includes(section.id);
            return (
              <Box key={section.id}>
                <Button fullWidth color="inherit" onClick={() => onOpen(section.path)} sx={{ justifyContent: 'flex-start', textAlign: 'left', py: 1.35, px: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ width: 28, height: 28, flexShrink: 0, borderRadius: '50%', bgcolor: isDone ? 'success.main' : 'action.selected', color: isDone ? 'white' : 'text.secondary', display: 'grid', placeItems: 'center', mr: 1.5, fontSize: '.72rem' }}>{isDone ? '✓' : index + 1}</Box>
                  <Box sx={{ flex: 1 }}><Typography fontWeight={700}>{t(`course.${section.id}.title`)}</Typography><Typography variant="caption" color="text.secondary">{section.duration}</Typography></Box>
                  <ArrowForwardRoundedIcon fontSize="small" />
                </Button>
                {index === 2 && <Stack direction="row" gap={1} alignItems="center" sx={{ mx: 1.5, px: 1.5, py: 1, bgcolor: 'custom.goldLight', color: 'custom.gold', borderBottom: '1px solid', borderColor: 'divider' }}><Typography>☕</Typography><Typography variant="caption" fontWeight={800}>{t('overview.break', { sheet: number === '01' ? '1' : '2' })}</Typography></Stack>}
              </Box>
            );
          })}
          <Typography variant="caption" color="text.secondary" display="block" mt={2}>{done}/{sections.length} {t('common.readSections')}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
