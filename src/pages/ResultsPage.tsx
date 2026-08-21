import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDBStore } from '@/store/dbStore';
import { useProgressStore } from '@/store/progressStore';
import { getClassMetrics, getResultMessage, stripLatex } from '@/utils/learning';

export function ResultsPage() {
  const { classId = '' } = useParams();
  const db = useDBStore((state) => state.db);
  const progress = useProgressStore((state) => state.progress);
  const navigate = useNavigate();
  if (!db) return null;
  const cls = db.classes.find((item) => item.id === classId);
  if (!cls) return <Navigate to="/" replace />;
  const metrics = getClassMetrics(cls, progress);
  if (metrics.completed < metrics.total) return <Navigate to={`/class/${classId}`} replace />;
  const message = getResultMessage(metrics.percent);
  const classIndex = db.classes.findIndex((item) => item.id === classId);
  const nextClass = metrics.mastered ? db.classes.slice(classIndex + 1).find((item) => progress.classes[item.id]?.unlocked) : undefined;
  const recovery = cls.exercises.filter((exercise) => (progress.classes[classId]?.attempts[exercise.id]?.score ?? 0) < 2);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography sx={{ fontSize: '4rem', lineHeight: 1, mb: 2 }}>{message.emoji}</Typography>
        <Typography variant="h4" color="primary.main" mb={1}>{metrics.mastered ? 'Classe padroneggiata' : 'Classe completata · recupero necessario'}</Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', sm: '4rem' }, mb: 1 }}>{message.title}</Typography>
        <Typography color="text.secondary">{stripLatex(cls.title)}</Typography>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: { xs: 2.5, sm: 4 }, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" spacing={{ xs: 2, sm: 5 }} divider={<Divider orientation="vertical" flexItem />}>
          <Box textAlign="center"><Typography sx={{ fontFamily: 'Crimson Pro', fontWeight: 700, fontSize: '3.5rem', lineHeight: 1 }}>{metrics.score}</Typography><Typography variant="caption" color="text.secondary">PUNTI SU {metrics.maxScore}</Typography></Box>
          <Box textAlign="center"><Typography sx={{ fontFamily: 'Crimson Pro', fontWeight: 700, fontSize: '3.5rem', lineHeight: 1 }}>{metrics.percent}%</Typography><Typography variant="caption" color="text.secondary">RISULTATO</Typography></Box>
          <Box textAlign="center"><Typography sx={{ fontFamily: 'Crimson Pro', fontWeight: 700, fontSize: '3.5rem', lineHeight: 1, color: metrics.mastered ? 'success.main' : 'warning.main' }}>{metrics.correctCount}</Typography><Typography variant="caption" color="text.secondary">RISPOSTE CORRETTE</Typography></Box>
        </Stack>
      </Paper>
      <Alert severity={message.severity} sx={{ mb: 4 }}>{message.body}</Alert>

      <Typography variant="h3" mb={2}>Riepilogo esercizi</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 4 }}>
        <Table>
          <TableHead><TableRow><TableCell>Esercizio</TableCell><TableCell align="center">Tentativi</TableCell><TableCell align="center">Dimostrazione</TableCell><TableCell align="right">Punti</TableCell></TableRow></TableHead>
          <TableBody>
            {cls.exercises.map((exercise) => {
              const attempt = progress.classes[classId]?.attempts[exercise.id];
              return (
                <TableRow key={exercise.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/class/${classId}/exercise/${exercise.id}`)}>
                  <TableCell><Typography fontWeight={650}>{exercise.title}</Typography></TableCell>
                  <TableCell align="center">{attempt?.tries.length || '—'}</TableCell>
                  <TableCell align="center">{exercise.proof_from_limit ? attempt?.proofViewed ? <Chip size="small" color="warning" variant="outlined" label="📐 letta" /> : <Typography color="text.disabled">—</Typography> : <Typography color="text.disabled">n/d</Typography>}</TableCell>
                  <TableCell align="right"><Typography fontWeight={800} color={(attempt?.score ?? 0) > 0 ? 'success.main' : 'error.main'}>{attempt?.score ?? 0}{attempt?.proofViewed ? ' + 1' : ''}</Typography></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" gap={1.5}>
        {nextClass && <Button variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate(`/class/${nextClass.id}`)}>Prossima classe</Button>}
        {!metrics.mastered && recovery.length > 0 && <Button variant="contained" color="warning" size="large" startIcon={<RefreshRoundedIcon />} onClick={() => navigate(`/class/${classId}/exercise/${recovery[0].id}`)}>Avvia recupero ({recovery.length})</Button>}
        <Button variant="outlined" size="large" startIcon={<RefreshRoundedIcon />} onClick={() => navigate(`/class/${classId}`)}>Ripassa la classe</Button>
        <Button color="inherit" size="large" startIcon={<HomeRoundedIcon />} onClick={() => navigate('/')}>Dashboard</Button>
      </Stack>
    </Box>
  );
}
