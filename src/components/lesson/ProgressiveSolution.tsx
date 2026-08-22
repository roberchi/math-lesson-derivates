import { useState } from 'react';
import { Alert, Box, Button, Checkbox, FormControlLabel, Paper, Stack, Typography } from '@mui/material';
import { MathText } from '@/components/math/MathText';
import { useWritingStore, type WritingChecklistItem } from '@/store/writingStore';
import type { SolutionStep } from '@/types/exercise';

type Step = string | SolutionStep;

const checklistItems: Array<{ key: WritingChecklistItem; label: string }> = [
  { key: 'rule', label: 'Ho indicato la regola o la definizione usata' },
  { key: 'steps', label: 'Ho scritto i passaggi senza salti' },
  { key: 'domain', label: 'Ho controllato segni, dominio e unità' },
];

export function ProgressiveSolution({ steps, result, storageKey }: { steps: Step[]; result?: string; storageKey: string }) {
  const checklist = useWritingStore((state) => state.sheets[storageKey]?.checklist);
  const setChecklistAnswer = useWritingStore((state) => state.setChecklistAnswer);
  const [hintVisible, setHintVisible] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const selfChecked = checklistItems.every((item) => checklist?.[item.key] ?? false);
  const text = (step: Step) => typeof step === 'string' ? step : `${step.label}. $$${step.latex}$$ ${step.explanation}`;

  return <Stack spacing={2}>
    <Alert severity="info">Confronta il procedimento, non soltanto il risultato. La soluzione si apre un passaggio alla volta.</Alert>
    <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover' }}>
      <Typography fontWeight={800}>1. Controlla il tuo svolgimento</Typography>
      <Stack>{checklistItems.map((item) => <FormControlLabel key={item.key} control={<Checkbox checked={checklist?.[item.key] ?? false} onChange={(_event, checked) => setChecklistAnswer(storageKey, item.key, checked)} />} label={item.label} />)}</Stack>
    </Paper>
    <Box><Button variant="outlined" disabled={!selfChecked} onClick={() => setHintVisible(true)}>2. Mostra un indizio</Button>{hintVisible && <Alert severity="warning" sx={{ mt: 1.5 }}>Individua la struttura del problema e scrivi la formula generale prima di sostituire i dati.</Alert>}</Box>
    {visibleSteps > 0 && <Stack component="ol" spacing={1.5} sx={{ pl: 2.5, my: 0 }}>{steps.slice(0, visibleSteps).map((step, index) => <Typography component="li" key={index} color="text.secondary" sx={{ pl: .5 }}><MathText text={text(step)} /></Typography>)}</Stack>}
    {hintVisible && visibleSteps < steps.length && <Button variant="contained" onClick={() => setVisibleSteps((value) => value + 1)}>{visibleSteps === 0 ? '3. Mostra il primo passaggio' : 'Mostra il passaggio successivo'}</Button>}
    {visibleSteps === steps.length && result && <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: 'success.main', color: 'success.contrastText' }}><Typography variant="overline" fontWeight={800}>Risultato</Typography><Typography component="div"><MathText text={result} /></Typography></Box>}
  </Stack>;
}
