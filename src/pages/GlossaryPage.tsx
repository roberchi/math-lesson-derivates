import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Link } from 'react-router-dom';
import { glossaryTerms } from '@/data/glossary';
import { useTranslation } from 'react-i18next';

export function GlossaryPage() {
  const { t } = useTranslation();
  return <Box sx={{ maxWidth: 800, mx: 'auto' }}><Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />} color="inherit" sx={{ mb: 3 }}>{t('common.overview')}</Button><Typography variant="h4" color="primary.main" mb={1}>{t('glossary.eyebrow')}</Typography><Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', sm: '4rem' }, mb: 3 }}>{t('glossary.title')}</Typography><Stack spacing={1.5}>{glossaryTerms.map(({ id }) => <Paper component="article" elevation={0} key={id} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider' }}><Typography variant="h3" sx={{ fontSize: '1.35rem', mb: .75 }}>{t(`glossary.terms.${id}.term`)}</Typography><Typography color="text.secondary">{t(`glossary.terms.${id}.definition`)}</Typography></Paper>)}</Stack></Box>;
}
