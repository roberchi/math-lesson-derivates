import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Link } from 'react-router-dom';
import { glossaryTerms } from '@/data/glossary';

export function GlossaryPage() {
  return <Box sx={{ maxWidth: 800, mx: 'auto' }}><Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />} color="inherit" sx={{ mb: 3 }}>Panoramica</Button><Typography variant="h4" color="primary.main" mb={1}>Parole del corso</Typography><Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', sm: '4rem' }, mb: 3 }}>Glossario</Typography><Stack spacing={1.5}>{glossaryTerms.map(([term, definition]) => <Paper component="article" elevation={0} key={term} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider' }}><Typography variant="h3" sx={{ fontSize: '1.35rem', mb: .75 }}>{term}</Typography><Typography color="text.secondary">{definition}</Typography></Paper>)}</Stack></Box>;
}
