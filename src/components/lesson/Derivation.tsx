import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { BlockMath, InlineMath } from 'react-katex';
import { MathText } from '@/components/math/MathText';

export interface DerivationStep {
  label: string;
  formula: string;
  explanation: string;
}

export function Derivation({ title, formula, steps, conclusion, defaultExpanded = false }: { title: string; formula: string; steps: DerivationStep[]; conclusion: string; defaultExpanded?: boolean }) {
  return (
    <Accordion defaultExpanded={defaultExpanded} sx={{ border: '1px solid', borderColor: 'rgba(65,88,208,.28)', borderRadius: '10px !important', overflow: 'hidden' }}>
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ px: { xs: 2, sm: 2.5 }, py: .75 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="primary.main" fontWeight={800}>VERSIONE DIMOSTRATIVA</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1} mt={.5}>
            <Typography variant="h3" sx={{ fontSize: '1.35rem' }}>{title}</Typography>
            <Box sx={{ color: 'primary.main', pr: 2 }}><InlineMath math={formula} /></Box>
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
      </AccordionDetails>
    </Accordion>
  );
}
