import { useState } from 'react';
import { Alert, Box, Button, Checkbox, FormControlLabel, Paper, Stack, Typography } from '@mui/material';
import { MathText } from '@/components/math/MathText';
import { useWritingStore, type WritingChecklistItem } from '@/store/writingStore';
import type { SolutionStep } from '@/types/exercise';
import { useTranslation } from 'react-i18next';

type Step = string | SolutionStep;

const checklistItems: WritingChecklistItem[] = ['rule', 'steps', 'domain'];

export function ProgressiveSolution({ steps, result, storageKey }: { steps: Step[]; result?: string; storageKey: string }) {
  const { t } = useTranslation();
  const checklist = useWritingStore((state) => state.sheets[storageKey]?.checklist);
  const setChecklistAnswer = useWritingStore((state) => state.setChecklistAnswer);
  const [hintVisible, setHintVisible] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const selfChecked = checklistItems.every((item) => checklist?.[item] ?? false);
  const text = (step: Step) => typeof step === 'string' ? step : `${step.label}. $$${step.latex}$$ ${step.explanation}`;

  return <Stack spacing={2}>
    <Alert severity="info">{t('solution.intro')}</Alert>
    <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover' }}>
      <Typography fontWeight={800}>{t('solution.check')}</Typography>
      <Stack>{checklistItems.map((item) => <FormControlLabel key={item} control={<Checkbox checked={checklist?.[item] ?? false} onChange={(_event, checked) => setChecklistAnswer(storageKey, item, checked)} />} label={t(`solution.${item}`)} />)}</Stack>
    </Paper>
    <Box><Button variant="outlined" disabled={!selfChecked} onClick={() => setHintVisible(true)}>{t('solution.hint')}</Button>{hintVisible && <Alert severity="warning" sx={{ mt: 1.5 }}>{t('solution.hintBody')}</Alert>}</Box>
    {visibleSteps > 0 && <Stack component="ol" spacing={1.5} sx={{ pl: 2.5, my: 0 }}>{steps.slice(0, visibleSteps).map((step, index) => <Typography component="li" key={index} color="text.secondary" sx={{ pl: .5 }}><MathText text={text(step)} /></Typography>)}</Stack>}
    {hintVisible && visibleSteps < steps.length && <Button variant="contained" onClick={() => setVisibleSteps((value) => value + 1)}>{visibleSteps === 0 ? t('solution.firstStep') : t('solution.nextStep')}</Button>}
    {visibleSteps === steps.length && result && <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: 'success.main', color: 'success.contrastText' }}><Typography variant="overline" fontWeight={800}>{t('common.result')}</Typography><Typography component="div"><MathText text={result} /></Typography></Box>}
  </Stack>;
}
