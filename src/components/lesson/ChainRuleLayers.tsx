import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { BlockMath, InlineMath } from 'react-katex';
import { useTranslation } from 'react-i18next';
import { MathText } from '@/components/math/MathText';

type BuildLayer = {
  label: string;
  action: string;
  formula: string;
  color: string;
};

const buildLayerFormulas = ['x', 'x^2', '\\sin(x^2)'];
const buildLayerColors = ['#91A3FA', '#4DD4A4', '#F4C84A'];

const derivativeLayerFormulas = [
  '\\sin(\\boxed{x^2})\\;\\longrightarrow\\;\\cos(\\boxed{x^2})',
  "(x^2)' = 2x",
  "(\\sin(x^2))'=\\cos(x^2)\\cdot 2x",
];
const derivativeLayerColors = ['#F4C84A', '#4DD4A4', '#91A3FA'];

const deepLayerBefore = ['e^{\\boxed{\\sin(x^2)}}', '\\sin(\\boxed{x^2})', 'x^2'];
const deepLayerAfter = ['e^{\\sin(x^2)}', '\\cos(x^2)', '2x'];

export function ChainRuleLayers() {
  const { t } = useTranslation();

  const buildLayers: BuildLayer[] = [
    { label: t('chainRule.buildLayers.0.label'), action: t('chainRule.buildLayers.0.action'), formula: buildLayerFormulas[0], color: buildLayerColors[0] },
    { label: t('chainRule.buildLayers.1.label'), action: t('chainRule.buildLayers.1.action'), formula: buildLayerFormulas[1], color: buildLayerColors[1] },
    { label: t('chainRule.buildLayers.2.label'), action: t('chainRule.buildLayers.2.action'), formula: buildLayerFormulas[2], color: buildLayerColors[2] },
  ];

  const derivativeLayers = [
    { number: 1, label: t('chainRule.derivativeLayers.0.label'), title: t('chainRule.derivativeLayers.0.title'), formula: derivativeLayerFormulas[0], explanation: t('chainRule.derivativeLayers.0.explanation'), color: derivativeLayerColors[0] },
    { number: 2, label: t('chainRule.derivativeLayers.1.label'), title: t('chainRule.derivativeLayers.1.title'), formula: derivativeLayerFormulas[1], explanation: t('chainRule.derivativeLayers.1.explanation'), color: derivativeLayerColors[1] },
    { number: 3, label: t('chainRule.derivativeLayers.2.label'), title: t('chainRule.derivativeLayers.2.title'), formula: derivativeLayerFormulas[2], explanation: t('chainRule.derivativeLayers.2.explanation'), color: derivativeLayerColors[2] },
  ];

  const deepLayers = [
    { number: 1, layer: t('chainRule.deepLayers.0.layer'), before: deepLayerBefore[0], after: deepLayerAfter[0], reading: t('chainRule.deepLayers.0.reading') },
    { number: 2, layer: t('chainRule.deepLayers.1.layer'), before: deepLayerBefore[1], after: deepLayerAfter[1], reading: t('chainRule.deepLayers.1.reading') },
    { number: 3, layer: t('chainRule.deepLayers.2.layer'), before: deepLayerBefore[2], after: deepLayerAfter[2], reading: t('chainRule.deepLayers.2.reading') },
  ];

  const procedure: [string, string, string][] = [
    ['1', t('chainRule.procedure.0.title'), t('chainRule.procedure.0.text')],
    ['2', t('chainRule.procedure.1.title'), t('chainRule.procedure.1.text')],
    ['3', t('chainRule.procedure.2.title'), t('chainRule.procedure.2.text')],
    ['4', t('chainRule.procedure.3.title'), t('chainRule.procedure.3.text')],
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography paragraph>
          <MathText text={t('chainRule.intro.paragraph1')} />
        </Typography>
        <Typography color="text.secondary">
          {t('chainRule.intro.paragraph2')}
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'custom.ink', color: '#F2F5FA', overflow: 'hidden' }}>
        <Typography variant="overline" sx={{ color: '#91A3FA' }}>{t('chainRule.buildBox.overline')}</Typography>
        <Typography variant="h3" mt={.5} mb={1}>{t('chainRule.buildBox.title')}</Typography>
        <Typography sx={{ color: '#C9D2E0', mb: 2.5 }}>{t('chainRule.buildBox.subtitle')}</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="stretch" spacing={{ xs: 1, sm: 1.5 }} aria-label={t('chainRule.buildBox.ariaLabel')}>
          {buildLayers.map((layer, index) => (
            <Stack key={layer.label} direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={{ xs: 1, sm: 1.5 }} sx={{ flex: index === buildLayers.length - 1 ? 1.15 : 1 }}>
              <Paper elevation={0} sx={{ width: '100%', minHeight: 132, p: 2, bgcolor: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.16)', color: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: layer.color, fontWeight: 850 }}>{layer.label.toUpperCase()}</Typography>
                  <Typography variant="body2" sx={{ color: '#C9D2E0', mt: .35 }}>{layer.action}</Typography>
                </Box>
                <Box sx={{ fontSize: { xs: '1.15rem', sm: '1.3rem' }, overflowX: 'auto', '& .katex-display': { m: 0 } }}><BlockMath math={layer.formula} /></Box>
              </Paper>
              {index < buildLayers.length - 1 && <ArrowForwardRoundedIcon sx={{ color: '#91A3FA', fontSize: 32, transform: { xs: 'rotate(90deg)', sm: 'none' }, flexShrink: 0 }} />}
            </Stack>
          ))}
        </Stack>
        <Box sx={{ mt: 2.5, p: 2, borderLeft: '3px solid #F4C84A', bgcolor: 'rgba(244,200,74,.08)' }}>
          <Typography fontWeight={750}><MathText text={t('chainRule.buildBox.symbolsNote')} /></Typography>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="overline" color="primary.main">{t('chainRule.deriveBox.overline')}</Typography>
        <Typography variant="h3" mt={.5}>{t('chainRule.deriveBox.title')}</Typography>
        <Typography color="text.secondary" mt={1} mb={3}>
          {t('chainRule.deriveBox.subtitle')}
        </Typography>

        <Stack>
          {derivativeLayers.map((step, index) => (
            <Box key={step.number} sx={{ position: 'relative', display: 'grid', gridTemplateColumns: '48px minmax(0,1fr)', columnGap: { xs: 1.5, sm: 2 } }}>
              {index < derivativeLayers.length - 1 && <Box sx={{ position: 'absolute', left: 23, top: 45, bottom: -5, width: 2, bgcolor: 'rgba(65,88,208,.22)' }} />}
              <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: step.color, color: '#101A30', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '1.1rem', zIndex: 1 }}>{step.number}</Box>
              <Box sx={{ pb: index < derivativeLayers.length - 1 ? 3.5 : 0, minWidth: 0 }}>
                <Typography variant="caption" color="primary.main" fontWeight={850}>{step.label}</Typography>
                <Typography variant="h4" mt={.25}>{step.title}</Typography>
                <Paper elevation={0} sx={{ my: 1.25, px: 2, py: 1.25, bgcolor: 'rgba(65,88,208,.07)', overflowX: 'auto', fontSize: { xs: '1.05rem', sm: '1.22rem' }, '& .katex-display': { m: 0 } }}>
                  <BlockMath math={step.formula} />
                </Paper>
                <Typography variant="body2" color="text.secondary">{step.explanation}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}>
        <Typography variant="h3" mb={1}>{t('chainRule.whyMultiply.title')}</Typography>
        <Typography paragraph>
          <MathText text={t('chainRule.whyMultiply.paragraph')} />
        </Typography>
        <Typography fontWeight={750}>{t('chainRule.whyMultiply.totalEffect')}</Typography>
        <Box sx={{ overflowX: 'auto', fontSize: { xs: '1.05rem', sm: '1.22rem' }, '& .katex-display': { mb: 0 } }}>
          <BlockMath math="\underbrace{\frac{dy}{du}}_{\text{effetto del seno}}\cdot\underbrace{\frac{du}{dx}}_{\text{effetto del quadrato}}=\cos(x^2)\cdot2x" />
        </Box>
      </Paper>

      <Box>
        <Typography variant="overline" color="primary.main">{t('chainRule.deepSection.overline')}</Typography>
        <Typography variant="h3" mt={.5}><MathText text={t('chainRule.deepSection.title')} /></Typography>
        <Typography color="text.secondary" mt={1} mb={2.5}>
          {t('chainRule.deepSection.subtitle')}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) 310px' }, gap: 2.5, alignItems: 'stretch' }}>
          <Stack spacing={1.25}>
            {deepLayers.map((step) => (
              <Paper key={step.number} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Chip label={step.number} color="primary" sx={{ fontWeight: 850 }} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="caption" color="primary.main" fontWeight={850}>{t('chainRule.deepSection.layerLabel')} {step.layer.toUpperCase()}</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={1} sx={{ my: .75, fontSize: '1.05rem' }}>
                      <Box sx={{ overflowX: 'auto' }}><InlineMath math={step.before} /></Box>
                      <ArrowForwardRoundedIcon color="primary" sx={{ transform: { xs: 'rotate(90deg)', sm: 'none' } }} />
                      <Box sx={{ color: 'primary.main', overflowX: 'auto' }}><InlineMath math={step.after} /></Box>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{step.reading}</Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'custom.ink', color: '#F2F5FA', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#91A3FA', fontWeight: 850 }}>{t('chainRule.multiplyThreeFactors.overline')}</Typography>
            <Box sx={{ my: 1.5, overflowX: 'auto', fontSize: { xs: '1rem', sm: '1.12rem' }, '& .katex-display': { m: 0 } }}>
              <BlockMath math="\left(e^{\sin(x^2)}\right)'=e^{\sin(x^2)}\cdot\cos(x^2)\cdot2x" />
            </Box>
            <Stack spacing={.75} sx={{ color: '#C9D2E0', textAlign: 'left' }}>
              <Typography variant="body2">{t('chainRule.multiplyThreeFactors.factor1')}</Typography>
              <ArrowDownwardRoundedIcon sx={{ alignSelf: 'center', color: '#91A3FA' }} />
              <Typography variant="body2">{t('chainRule.multiplyThreeFactors.factor2')}</Typography>
              <ArrowDownwardRoundedIcon sx={{ alignSelf: 'center', color: '#91A3FA' }} />
              <Typography variant="body2">{t('chainRule.multiplyThreeFactors.factor3')}</Typography>
            </Stack>
          </Paper>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, border: '1px solid', borderColor: 'rgba(65,88,208,.3)' }}>
        <Typography variant="h3" mb={2}>{t('chainRule.procedureBox.title')}</Typography>
        <Stack spacing={1.5}>
          {procedure.map(([number, title, text]) => (
            <Box key={number} sx={{ display: 'grid', gridTemplateColumns: '36px minmax(0,1fr)', gap: 1.5, alignItems: 'start' }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 850 }}>{number}</Box>
              <Box><Typography fontWeight={800}>{title}</Typography><Typography variant="body2" color="text.secondary">{text}</Typography></Box>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
