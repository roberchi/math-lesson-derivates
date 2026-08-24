import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { glossaryTerms } from '@/data/glossary';
import { useTranslation } from 'react-i18next';

export function GlossaryTerm({ term, children }: { term: string; children?: React.ReactNode }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const entry = glossaryTerms.find(({ italian }) => italian.toLocaleLowerCase() === term.toLocaleLowerCase());
  if (!entry) return <>{children ?? term}</>;
  const label = t(`glossary.terms.${entry.id}.term`);
  return <>
    <Button size="small" variant="text" onClick={() => setOpen(true)} sx={{ minWidth: 0, p: 0, mx: .25, verticalAlign: 'baseline', textDecoration: 'underline dotted', textTransform: 'none', font: 'inherit' }} aria-label={t('glossary.openDefinition', { term: label })}>{children ?? label}</Button>
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth><DialogTitle>{label}</DialogTitle><DialogContent><Typography color="text.secondary">{t(`glossary.terms.${entry.id}.definition`)}</Typography></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>{t('common.close')}</Button><Button component={Link} to="/glossario" onClick={() => setOpen(false)}>{t('common.openGlossary')}</Button></DialogActions></Dialog>
  </>;
}
