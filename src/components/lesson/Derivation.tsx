import { useState } from 'react';
import {
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { BlockMath } from 'react-katex';
import { MathText } from '@/components/math/MathText';
import { useLessonStore } from '@/store/lessonStore';

export interface DerivationStep {
  label: string;
  formula: string;
  explanation: string;
}

interface DerivationProps {
  title: string;
  formula: string;
  meaning: string;
  steps: DerivationStep[];
  conclusion: string;
  defaultExpanded?: boolean;
  conceptId?: string;
  checkpoint?: { question: string; choices: string[]; correctIndex: number; explanation: string };
}

export function Derivation({ title, formula, meaning, steps, conclusion, defaultExpanded = false, conceptId, checkpoint }: DerivationProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const verify = useLessonStore((state) => state.verifyConcept);
  return (
    <Accordion defaultExpanded={defaultExpanded} sx={{ border: '1px solid', borderColor: 'rgba(65,88,208,.28)', borderRadius: '10px !important', overflow: 'hidden' }}>
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ px: { xs: 2, sm: 2.5 }, py: 1.25, '& .MuiAccordionSummary-content': { minWidth: 0 } }}>
        <Box sx={{ flex: 1, minWidth: 0, pr: { xs: .5, sm: 1.5 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'stretch' }} gap={{ xs: 2, md: 3 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" color="primary.main" fontWeight={800}>VERSIONE DIMOSTRATIVA</Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.3rem', sm: '1.45rem' }, mt: .5 }}>{title}</Typography>
              <Box sx={{ mt: 1.25 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>COME SI LEGGE E QUANDO SI USA</Typography>
                <Typography component="div" variant="body2" color="text.secondary" sx={{ mt: .35, maxWidth: 650 }}>
                  <MathText text={meaning} />
                </Typography>
              </Box>
            </Box>
            <Box sx={{
              alignSelf: { md: 'center' },
              minWidth: { md: 330 },
              maxWidth: '100%',
              px: { xs: 1.5, sm: 2.25 },
              py: 1.25,
              color: 'primary.main',
              bgcolor: 'rgba(65,88,208,.07)',
              border: '1px solid rgba(65,88,208,.18)',
              borderRadius: 2,
              overflowX: 'auto',
              fontSize: { xs: '1.08rem', sm: '1.28rem', lg: '1.38rem' },
              '& .katex-display': { m: 0, textAlign: 'center' },
            }}>
              <Typography variant="caption" color="primary.main" fontWeight={800} sx={{ display: 'block', mb: .5 }}>FORMULA</Typography>
              <BlockMath math={formula} />
            </Box>
          </Stack>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
        <Stack>
          {steps.map((step, index) => (
            <Box key={`${step.label}-${index}`} sx={{ display: 'grid', gridTemplateColumns: '30px minmax(0,1fr)', gap: 1.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Avatar sx={{ width: 27, height: 27, fontSize: '.75rem', bgcolor: 'primary.main' }}>{index + 1}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="primary.main" fontWeight={800}>{step.label.toUpperCase()}</Typography>
                <Paper elevation={0} sx={{ my: 1, px: 1.5, py: .5, bgcolor: 'custom.ink', color: '#F2F5FA', overflowX: 'auto', '& .katex-display': { margin: '.55em 0' } }}><BlockMath math={step.formula} /></Paper>
                <Typography component="div" variant="body2" color="text.secondary"><MathText text={step.explanation} /></Typography>
              </Box>
            </Box>
          ))}
        </Stack>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(65,88,208,.07)', borderLeft: '3px solid', borderColor: 'primary.main' }}>
          <Typography variant="caption" color="primary.main" fontWeight={800}>CONCLUSIONE</Typography>
          <Typography component="div" sx={{ mt: .5 }}><MathText text={conclusion} /></Typography>
        </Box>
        {checkpoint && conceptId && <Paper elevation={0} sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'warning.light' }}>
          <Typography variant="caption" color="warning.main" fontWeight={800}>CHECKPOINT OBBLIGATORIO</Typography>
          <Typography fontWeight={700} my={1}>{checkpoint.question}</Typography>
          <Stack gap={1}>{checkpoint.choices.map((choice, index) => <Button key={choice} variant={selected === index ? 'contained' : 'outlined'} color={selected !== null && index === checkpoint.correctIndex ? 'success' : 'warning'} onClick={() => { setSelected(index); if (index === checkpoint.correctIndex) verify(conceptId); }}>{choice}</Button>)}</Stack>
          {selected !== null && <Alert severity={selected === checkpoint.correctIndex ? 'success' : 'warning'} sx={{ mt: 1.5 }}>{selected === checkpoint.correctIndex ? checkpoint.explanation : 'Rileggi i passaggi e riprova.'}</Alert>}
        </Paper>}
      </AccordionDetails>
    </Accordion>
  );
}
