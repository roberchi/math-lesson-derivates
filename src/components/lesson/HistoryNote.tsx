import { useState, type ReactNode } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import HistoryEduRoundedIcon from '@mui/icons-material/HistoryEduRounded';
import { useTranslation } from 'react-i18next';

interface HistoryNoteProps {
  title: string;
  summary: string;
  children: ReactNode;
  href?: string;
}

export function HistoryNote({ title, summary, children, href }: HistoryNoteProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Paper elevation={0} sx={{ p: 2.25, border: '1px solid', borderColor: 'rgba(184,138,29,.35)', bgcolor: 'custom.goldLight' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} gap={2}>
          <Box sx={{ color: 'custom.gold' }}><HistoryEduRoundedIcon /></Box>
          <Box sx={{ flex: 1 }}><Typography variant="caption" sx={{ color: 'custom.gold', fontWeight: 800 }}>{t('common.storyOfIdeas')}</Typography><Typography fontWeight={750}>{summary}</Typography></Box>
          <Button color="warning" onClick={() => setOpen(true)}>{t('common.learnMore')}</Button>
        </Stack>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'Crimson Pro', fontSize: '2rem' }}>{title}</DialogTitle>
        <DialogContent dividers><Typography component="div" sx={{ lineHeight: 1.8 }}>{children}</Typography></DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          {href ? <Link href={href} target="_blank" rel="noreferrer" display="inline-flex" alignItems="center" gap={.5}>{t('common.externalSource')} <ArrowOutwardRoundedIcon fontSize="small" /></Link> : <span />}
          <Button onClick={() => setOpen(false)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
