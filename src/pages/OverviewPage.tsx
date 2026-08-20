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
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import { Link, useNavigate } from 'react-router-dom';
import { lessonOneSections, lessonSections, lessonTwoSections } from '@/data/course';
import { useLessonStore } from '@/store/lessonStore';
import { PerspectiveCard } from '@/components/lesson/LessonScaffold';

export function OverviewPage() {
  const completed = useLessonStore((state) => state.completedSections);
  const lastSectionId = useLessonStore((state) => state.lastSectionId);
  const navigate = useNavigate();
  const lastSection = lessonSections.find((section) => section.id === lastSectionId);
  const nextSection = (lastSection && !completed.includes(lastSection.id) ? lastSection : undefined)
    ?? lessonSections.find((section) => !completed.includes(section.id))
    ?? lessonSections[0];
  const percent = Math.round(completed.length / lessonSections.length * 100);

  return (
    <>
      <Box component="section" sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'custom.ink', color: 'white', borderRadius: 2.5, p: { xs: 3, sm: 5, md: 6 }, mb: 5 }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 2 }}>Corso guidato · 2 lezioni da 2 ore</Typography>
        <Typography variant="h1" sx={{ maxWidth: 800 }}>Derivate:<br /><Box component="span" sx={{ color: '#F0C95A', fontStyle: 'italic' }}>dal limite alla padronanza.</Box></Typography>
        <Typography sx={{ color: '#C4CDDC', maxWidth: 650, mt: 2.5, mb: 3.5, fontSize: '1.08rem' }}>
          Partiamo da una domanda concreta — come si misura una velocità in un singolo istante? — e costruiamo geometria, definizione e regole senza saltare i passaggi.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} alignItems={{ sm: 'center' }}>
          <Button component={Link} to={nextSection.path} variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />} sx={{ position: 'relative', zIndex: 1, bgcolor: '#F2C94C', color: '#17243F', '&:hover': { bgcolor: '#FFD968' } }}>
            {completed.length ? 'Riprendi la lezione' : 'Comincia dal problema'}
          </Button>
          <Typography variant="caption" sx={{ color: '#9EABC0' }}>{completed.length}/{lessonSections.length} SEZIONI COMPLETATE</Typography>
        </Stack>
        <Box aria-hidden sx={{ pointerEvents: 'none', position: 'absolute', right: { xs: -90, md: 45 }, bottom: -115, width: 330, height: 330, border: '1px solid rgba(255,255,255,.12)', borderRadius: '50%', '&:before': { content: '"dy/dx"', position: 'absolute', left: 55, top: 80, fontFamily: 'Crimson Pro', fontStyle: 'italic', fontSize: '4.3rem', color: 'rgba(255,255,255,.08)' } }} />
      </Box>

      <Box mb={5}>
        <Stack direction="row" justifyContent="space-between" mb={1}><Typography variant="caption" color="text.secondary">PROGRESSO DEL CORSO</Typography><Typography variant="caption">{percent}%</Typography></Stack>
        <LinearProgress variant="determinate" value={percent} />
      </Box>

      <Box mb={6}>
        <Typography variant="h4" color="primary.main" mb={1}>Una domanda, tre risposte</Typography>
        <Typography variant="h2" mb={2.5}>Cos’è la derivata?</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}><PerspectiveCard icon="◢" label="GEOMETRICA" title="Una pendenza">È la pendenza della retta tangente, ottenuta come limite delle rette secanti.</PerspectiveCard></Grid>
          <Grid item xs={12} md={4}><PerspectiveCard icon="lim" label="ANALITICA" title="Un limite">È il limite del rapporto incrementale quando l’incremento tende a zero.</PerspectiveCard></Grid>
          <Grid item xs={12} md={4}><PerspectiveCard icon="↗" label="FISICA" title="Un tasso istantaneo">È quanto rapidamente una grandezza cambia in un preciso istante.</PerspectiveCard></Grid>
        </Grid>
      </Box>

      <CourseLesson
        number="01"
        title="Il concetto di derivata"
        subtitle="Dal moto di un corpo alla definizione formale"
        duration="2 ore"
        objective="Costruire la derivata come oggetto geometrico, analitico e fisico."
        sections={lessonOneSections}
        completed={completed}
        onOpen={(path) => navigate(path)}
      />
      <CourseLesson
        number="02"
        title="Regole operative e Taylor"
        subtitle="Dalle dimostrazioni alla padronanza del calcolo"
        duration="2 ore"
        objective="Ricavare le regole dai limiti, applicarle e scoprire come le derivate ricostruiscono una funzione."
        sections={lessonTwoSections}
        completed={completed}
        onOpen={(path) => navigate(path)}
      />

      <Box mt={7}>
        <Typography variant="h4" color="primary.main" mb={1}>Materiali associati</Typography>
        <Typography variant="h2" mb={2.5}>Allenati e verifica</Typography>
        <Grid container spacing={2}>
          {[
            { icon: <DrawOutlinedIcon />, title: 'Scheda §1', body: 'Definizione e significato geometrico · 25 min', path: '/scheda/1' },
            { icon: <AssignmentOutlinedIcon />, title: 'Scheda §2', body: 'Regole di derivazione · 30 min', path: '/scheda/2' },
            { icon: <QuizOutlinedIcon />, title: 'Verifica finale', body: '4 problemi · 30 punti · 45 min', path: '/verifica' },
            { icon: <RouteRoundedIcon />, title: 'Esercizi adattivi', body: '27 esercizi con difficoltà progressiva', path: '/esercizi' },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.path}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}><CardActionArea onClick={() => navigate(item.path)} sx={{ height: '100%' }}><CardContent><Box color="primary.main" mb={2}>{item.icon}</Box><Typography variant="h5" mb={.75}>{item.title}</Typography><Typography variant="body2" color="text.secondary">{item.body}</Typography></CardContent></CardActionArea></Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

function CourseLesson({ number, title, subtitle, duration, objective, sections, completed, onOpen }: { number: string; title: string; subtitle: string; duration: string; objective: string; sections: typeof lessonSections; completed: string[]; onOpen: (path: string) => void }) {
  const done = sections.filter((section) => completed.includes(section.id)).length;
  return (
    <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Grid container>
        <Grid item xs={12} md={4} sx={{ bgcolor: 'custom.ink', color: 'white', p: { xs: 3, sm: 4 } }}>
          <Stack direction="row" justifyContent="space-between" mb={3}><Typography variant="caption" sx={{ color: '#91A3FA' }}>LEZIONE {number}</Typography><Chip size="small" label={duration} sx={{ color: 'white', borderColor: 'rgba(255,255,255,.3)' }} variant="outlined" /></Stack>
          <Typography variant="h2" sx={{ fontSize: '2.35rem', mb: 1 }}>{title}</Typography>
          <Typography sx={{ color: '#C4CDDC', mb: 3 }}>{subtitle}</Typography>
          <Typography variant="caption" sx={{ color: '#91A3FA' }}>OBIETTIVO</Typography><Typography variant="body2" sx={{ color: '#C4CDDC', mt: .75 }}>{objective}</Typography>
        </Grid>
        <Grid item xs={12} md={8} sx={{ p: { xs: 2, sm: 3 } }}>
          {sections.map((section, index) => {
            const isDone = completed.includes(section.id);
            return (
              <Box key={section.id}>
                <Button fullWidth color="inherit" onClick={() => onOpen(section.path)} sx={{ justifyContent: 'flex-start', textAlign: 'left', py: 1.35, px: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ width: 28, height: 28, flexShrink: 0, borderRadius: '50%', bgcolor: isDone ? 'success.main' : 'action.selected', color: isDone ? 'white' : 'text.secondary', display: 'grid', placeItems: 'center', mr: 1.5, fontSize: '.72rem' }}>{isDone ? '✓' : index + 1}</Box>
                  <Box sx={{ flex: 1 }}><Typography fontWeight={700}>{section.title}</Typography><Typography variant="caption" color="text.secondary">{section.duration}</Typography></Box>
                  <ArrowForwardRoundedIcon fontSize="small" />
                </Button>
                {index === 2 && <Stack direction="row" gap={1} alignItems="center" sx={{ mx: 1.5, px: 1.5, py: 1, bgcolor: 'custom.goldLight', color: 'custom.gold', borderBottom: '1px solid', borderColor: 'divider' }}><Typography>☕</Typography><Typography variant="caption" fontWeight={800}>PAUSA + SCHEDA ESERCIZI §{number === '01' ? '1' : '2'} · 10 MIN</Typography></Stack>}
              </Box>
            );
          })}
          <Typography variant="caption" color="text.secondary" display="block" mt={2}>{done}/{sections.length} SEZIONI COMPLETATE</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
