import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { glossaryTerms } from '@/data/glossary';

export function GlossaryTerm({ term, children }: { term: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const entry = glossaryTerms.find(([label]) => label.toLocaleLowerCase() === term.toLocaleLowerCase());
  if (!entry) return <>{children ?? term}</>;
  return <>
    <Button size="small" variant="text" onClick={() => setOpen(true)} sx={{ minWidth: 0, p: 0, mx: .25, verticalAlign: 'baseline', textDecoration: 'underline dotted', textTransform: 'none', font: 'inherit' }} aria-label={`Apri definizione di ${entry[0]}`}>{children ?? term}</Button>
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth><DialogTitle>{entry[0]}</DialogTitle><DialogContent><Typography color="text.secondary">{entry[1]}</Typography></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Chiudi</Button><Button component={Link} to="/glossario" onClick={() => setOpen(false)}>Apri il glossario</Button></DialogActions></Dialog>
  </>;
}
