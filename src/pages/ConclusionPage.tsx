import { useState } from 'react';
import { Alert, Box, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { InlineMath } from 'react-katex';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import { coreSections } from '@/data/course';
import { useLessonStore } from '@/store/lessonStore';

const reflectionKey = 'derivate_conclusione_v1';

export function ConclusionPage() {
  const read = useLessonStore((state) => state.readSections);
  const complete = coreSections.every((section) => read.includes(section.id));
  const saved = (() => { try { return JSON.parse(localStorage.getItem(reflectionKey) ?? '{}') as Record<string, string>; } catch { return {}; } })();
  const [definition, setDefinition] = useState(saved.definition ?? '');
  const [geometry, setGeometry] = useState(saved.geometry ?? '');
  const [calculus, setCalculus] = useState(saved.calculus ?? '');
  const [applications, setApplications] = useState(saved.applications ?? '');
  const [savedNow, setSavedNow] = useState(false);

  const save = () => {
    localStorage.setItem(reflectionKey, JSON.stringify({ definition, geometry, calculus, applications }));
    setSavedNow(true);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" color="primary.main" mb={1}>Sintesi del nucleo fondamentale</Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', sm: '4rem' }, mb: 2 }}>Ora la domanda iniziale ha una risposta.</Typography>
      {!complete && <Alert severity="info" sx={{ mb: 3 }}>Puoi consultare la sintesi ora; risultano lette {read.filter((id) => coreSections.some((section) => section.id === id)).length} sezioni fondamentali su {coreSections.length}.</Alert>}

      <Paper elevation={0} sx={{ bgcolor: 'custom.ink', color: 'white', p: { xs: 3, sm: 4 }, mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#91A3FA', mb: 1.5 }}>La velocità nell’istante t = 2</Typography>
        <Typography sx={{ color: '#C9D2E0' }}>Per <InlineMath math="s(t)=5t^2" />, la velocità media vale <InlineMath math="20+5h" />. Facendo tendere h a zero otteniamo <InlineMath math="s'(2)=20" />: non abbiamo diviso per zero, abbiamo studiato a quale valore tende il rapporto.</Typography>
      </Paper>

      <Grid container spacing={2} mb={4}>
        {[
          ['Geometria', 'Leggere la derivata come pendenza della tangente e costruire la normale.'],
          ['Calcolo', 'Usare definizione, derivate fondamentali e regole senza perdere gli strati.'],
          ['Applicazioni', 'Interpretare segno, unità e significato di un tasso istantaneo.'],
        ].map(([title, body]) => <Grid item xs={12} md={4} key={title}><Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}><Typography variant="h3" mb={1}>{title}</Typography><Typography variant="body2" color="text.secondary">{body}</Typography></Paper></Grid>)}
      </Grid>

      <Typography variant="h2" mb={1}>Spiegala con parole tue</Typography>
      <Typography color="text.secondary" mb={2}>Scrivere una definizione personale rende visibile ciò che hai davvero collegato.</Typography>
      <Stack spacing={2}>
        <TextField multiline minRows={3} label="La derivata è…" value={definition} onChange={(event) => setDefinition(event.target.value)} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}><TextField fullWidth multiline minRows={2} label="Che cosa so vedere sul grafico?" value={geometry} onChange={(event) => setGeometry(event.target.value)} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth multiline minRows={2} label="Che cosa so calcolare?" value={calculus} onChange={(event) => setCalculus(event.target.value)} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth multiline minRows={2} label="Che cosa so interpretare?" value={applications} onChange={(event) => setApplications(event.target.value)} /></Grid>
        </Grid>
        <Button variant="contained" onClick={save}>Salva la mia sintesi</Button>
        {savedNow && <Alert severity="success">Sintesi salvata in questo browser.</Alert>}
      </Stack>

      <Paper elevation={0} sx={{ mt: 4, p: 3, bgcolor: 'custom.goldLight' }}><Typography variant="h3" mb={1}>Il passo successivo</Typography><Typography>Con queste basi potrai affrontare studio di funzione, ottimizzazione e modelli di crescita. Taylor e i teoremi restano approfondimenti consultabili senza incidere sul completamento.</Typography></Paper>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} mt={4}><Button component={Link} to="/esercizi" variant="contained" startIcon={<RouteRoundedIcon />}>Verifica la padronanza</Button><Button component={Link} to="/" startIcon={<HomeRoundedIcon />}>Torna alla panoramica</Button></Stack>
    </Box>
  );
}
