import { useState } from 'react';
import { Alert, Button, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { InlineMath } from 'react-katex';

const samples = [1, .5, .1, .01];

export function VelocityInquiry() {
  const [prediction, setPrediction] = useState('');
  const [revealed, setRevealed] = useState(false);
  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h3" mb={1}>Un piccolo esperimento numerico</Typography>
      <Typography color="text.secondary" mb={2}>La posizione è <InlineMath math="s(t)=5t^2" />. Vogliamo stimare la velocità esattamente a <InlineMath math="t=2" /> usando intervalli sempre più brevi.</Typography>
      <TextField fullWidth label="Prima di calcolare: verso quale velocità pensi che convergeremo?" value={prediction} onChange={(event) => setPrediction(event.target.value)} sx={{ mb: 2 }} />
      <Button variant="contained" disabled={!prediction.trim()} onClick={() => setRevealed(true)}>Calcola le velocità medie</Button>
      {revealed && <>
        <Table size="small" sx={{ mt: 2 }}><TableHead><TableRow><TableCell>h</TableCell><TableCell>Intervallo</TableCell><TableCell align="right">Velocità media</TableCell></TableRow></TableHead><TableBody>{samples.map((h) => <TableRow key={h}><TableCell>{h}</TableCell><TableCell>da 2 a {2 + h}</TableCell><TableCell align="right">{(20 + 5 * h).toFixed(h < .1 ? 2 : 1)}</TableCell></TableRow>)}</TableBody></Table>
        <Stack spacing={1.5} mt={2}>
          <Alert severity="success">I valori seguono <InlineMath math="v_m=20+5h" /> e si avvicinano a 20. La velocità istantanea è quindi 20 unità di spazio per unità di tempo.</Alert>
          <Alert severity="info">Non poniamo mai <InlineMath math="h=0" /> nel rapporto: divideremmo per zero. Calcoliamo invece il valore verso cui il rapporto tende quando h diventa piccolo.</Alert>
        </Stack>
      </>}
    </Paper>
  );
}
