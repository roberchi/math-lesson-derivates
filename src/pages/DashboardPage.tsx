import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { useNavigate } from 'react-router-dom';
import { useDBStore } from '@/store/dbStore';
import { useProgressStore } from '@/store/progressStore';
import { computeGlobalStats, getClassMetrics, getResumeTarget, stripLatex } from '@/utils/learning';
import { MathText } from '@/components/math/MathText';

const accents = ['#4158D0', '#13795B', '#B88A1D', '#7448C8', '#D45B5B', '#287CA8', '#637088'];

export function DashboardPage() {
  const db = useDBStore((state) => state.db);
  const loading = useDBStore((state) => state.loading);
  const error = useDBStore((state) => state.error);
  const progress = useProgressStore((state) => state.progress);
  const navigate = useNavigate();

  if (loading || !db) {
    return <Box sx={{ py: 12, textAlign: 'center' }}><Typography>{error ? `Impossibile caricare gli esercizi: ${error}` : 'Preparo il percorso…'}</Typography></Box>;
  }
  const stats = computeGlobalStats(db, progress);
  const resume = getResumeTarget(db, progress);

  return (
    <>
      <Box component="section" sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'custom.ink', color: 'white', borderRadius: 2.5, p: { xs: 3, sm: 5 }, mb: 5 }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 2 }}>Allenamento adattivo</Typography>
        <Typography variant="h1" sx={{ maxWidth: 680 }}>Dalla lezione<br /><Box component="span" sx={{ color: '#F0C95A', fontStyle: 'italic' }}>alla padronanza.</Box></Typography>
        <Typography sx={{ color: '#C4CDDC', maxWidth: 590, mt: 2.5, mb: 3.5, fontSize: '1.05rem' }}>
          Esercizi organizzati per prerequisiti e difficoltà. Gli argomenti da consolidare tornano per primi, mentre nuove classi si sbloccano con i tuoi progressi.
        </Typography>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={() => resume ? navigate(`/class/${resume.classId}/exercise/${resume.exId}`) : navigate(`/class/${db.classes[0].id}`)}
          sx={{ bgcolor: '#F2C94C', color: '#17243F', '&:hover': { bgcolor: '#FFD968' } }}
        >
          {stats.exercisesCompleted ? 'Continua gli esercizi' : 'Inizia gli esercizi'}
        </Button>
        <Box aria-hidden sx={{ position: 'absolute', right: { xs: -75, md: 45 }, bottom: -105, width: 310, height: 310, border: '1px solid rgba(255,255,255,.12)', borderRadius: '50%', '&:before': { content: '"f′(x)"', position: 'absolute', left: 65, top: 65, fontFamily: 'Crimson Pro', fontStyle: 'italic', fontSize: '4.6rem', color: 'rgba(255,255,255,.08)' } }} />
      </Box>

      <Grid container spacing={2.5} mb={5}>
        {[
          { icon: <TaskAltRoundedIcon />, value: `${stats.exercisesCompleted}/${stats.exercisesTotal}`, label: 'esercizi completati' },
          { icon: <InsightsOutlinedIcon />, value: `${stats.firstAttemptSuccessRate}%`, label: 'corretti al primo colpo' },
          { icon: <AutoStoriesOutlinedIcon />, value: stats.proofViewedCount, label: 'dimostrazioni lette' },
        ].map((item) => (
          <Grid item xs={12} sm={4} key={item.label}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
              <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
              <Box><Typography sx={{ fontFamily: 'Crimson Pro', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{item.value}</Typography><Typography variant="body2" color="text.secondary">{item.label}</Typography></Box>
            </Stack>
          </Grid>
        ))}
      </Grid>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'end' }} mb={2.5}>
        <Box>
          <Typography variant="h4" color="primary.main" mb={1}>Le classi di problemi</Typography>
          <Typography variant="h2">Il tuo percorso</Typography>
        </Box>
        <Typography color="text.secondary" sx={{ maxWidth: 380, mt: { xs: 1, sm: 0 } }}>Completa una classe per sbloccare i concetti che dipendono da essa.</Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {db.classes.map((cls, index) => {
          const classProgress = progress.classes[cls.id];
          const unlocked = classProgress?.unlocked ?? false;
          const completed = classProgress?.completed ?? false;
          const metrics = getClassMetrics(cls, progress);
          const prerequisite = cls.prerequisite_classes.map((id) => stripLatex(db.classes.find((item) => item.id === id)?.title ?? id)).join(', ');
          const card = (
            <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderTop: `3px solid ${accents[index % accents.length]}`, opacity: unlocked ? 1 : .58, transition: 'transform .2s, box-shadow .2s', '&:hover': unlocked ? { transform: 'translateY(-3px)', boxShadow: '0 14px 32px rgba(23,36,63,.10)' } : undefined }}>
              <CardActionArea disabled={!unlocked} onClick={() => navigate(`/class/${cls.id}`)} sx={{ height: '100%', alignItems: 'stretch' }}>
                <CardContent sx={{ p: 2.75, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box sx={{ width: 44, height: 44, bgcolor: `${accents[index]}15`, color: accents[index], borderRadius: 1.5, display: 'grid', placeItems: 'center', fontFamily: 'Crimson Pro', fontSize: '1.25rem', fontWeight: 700 }}>{unlocked ? cls.icon : <LockRoundedIcon fontSize="small" />}</Box>
                    <Typography variant="caption" color="text.secondary">0{index + 1}</Typography>
                  </Stack>
                  <Typography variant="h5" mb={.75}><MathTitle text={cls.title} /></Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>{cls.description}</Typography>
                  <Stack direction="row" spacing={.75} flexWrap="wrap" useFlexGap mb={2}>
                    {[...new Set(cls.exercises.map((exercise) => exercise.difficulty))].map((difficulty) => (
                      <Chip key={difficulty} size="small" variant="outlined" label={db.difficulty_levels[String(difficulty)]?.label} />
                    ))}
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" mb={.75}>
                    <Typography variant="caption">{cls.exercises.length} ESERCIZI · {cls.exercises.length * 3} PT</Typography>
                    <Typography variant="caption">{metrics.progressPercent}%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={metrics.progressPercent} sx={{ mb: 1.5 }} />
                  <Typography variant="caption" sx={{ color: completed ? 'success.main' : unlocked ? 'primary.main' : 'text.disabled', fontWeight: 700 }}>
                    {completed ? '✓ COMPLETATA' : unlocked ? metrics.completed ? '● IN CORSO' : index === 0 ? 'INIZIA DA QUI →' : 'DISPONIBILE →' : '🔒 BLOCCATA'}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
          return <Grid item xs={12} sm={6} md={4} key={cls.id}>{unlocked ? card : <Tooltip title={`Completa prima: ${prerequisite}`}><span style={{ display: 'block', height: '100%' }}>{card}</span></Tooltip>}</Grid>;
        })}
      </Grid>
    </>
  );
}

function MathTitle({ text }: { text: string }) {
  return <MathText text={text} />;
}
