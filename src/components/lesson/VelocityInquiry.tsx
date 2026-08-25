import { useState } from 'react';
import { Alert, Button, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { InlineMath } from 'react-katex';
import { useTranslation } from 'react-i18next';

const samples = [1, .5, .1, .01];

export function VelocityInquiry() {
  const { t } = useTranslation();
  const [prediction, setPrediction] = useState('');
  const [revealed, setRevealed] = useState(false);
  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h3" mb={1}>{t('velocityInquiry.title')}</Typography>
      <Typography color="text.secondary" mb={2}>{t('velocityInquiry.lead.pre')} <InlineMath math="s(t)=5t^2" /> {t('velocityInquiry.lead.mid')} <InlineMath math="t=2" /> {t('velocityInquiry.lead.post')}</Typography>
      <TextField fullWidth label={t('velocityInquiry.predictionLabel')} value={prediction} onChange={(event) => setPrediction(event.target.value)} sx={{ mb: 2 }} />
      <Button variant="contained" disabled={!prediction.trim()} onClick={() => setRevealed(true)}>{t('velocityInquiry.calculateButton')}</Button>
      {revealed && <>
        <Table size="small" sx={{ mt: 2 }}><TableHead><TableRow><TableCell>{t('velocityInquiry.table.h')}</TableCell><TableCell>{t('velocityInquiry.table.interval')}</TableCell><TableCell align="right">{t('velocityInquiry.table.avgVelocity')}</TableCell></TableRow></TableHead><TableBody>{samples.map((h) => <TableRow key={h}><TableCell>{h}</TableCell><TableCell>{t('velocityInquiry.table.intervalValue', { from: 2, to: 2 + h })}</TableCell><TableCell align="right">{(20 + 5 * h).toFixed(h < .1 ? 2 : 1)}</TableCell></TableRow>)}</TableBody></Table>
        <Stack spacing={1.5} mt={2}>
          <Alert severity="success">{t('velocityInquiry.result.pre')} <InlineMath math="v_m=20+5h" /> {t('velocityInquiry.result.post')}</Alert>
          <Alert severity="info">{t('velocityInquiry.warning.pre')} <InlineMath math="h=0" /> {t('velocityInquiry.warning.post')}</Alert>
        </Stack>
      </>}
    </Paper>
  );
}
