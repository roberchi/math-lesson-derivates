import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { BlockMath, InlineMath } from 'react-katex';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChainRuleLayers } from '@/components/lesson/ChainRuleLayers';
import { Derivation } from '@/components/lesson/Derivation';
import { DerivativeTheoremsAppendix } from '@/components/lesson/DerivativeTheoremsAppendix';
import { HistoryNote } from '@/components/lesson/HistoryNote';
import { LessonScaffold, PerspectiveCard, SectionBlock } from '@/components/lesson/LessonScaffold';
import { TaylorLab } from '@/components/labs/TaylorLab';
import { ConcavityExamples, SecondDerivativeLab } from '@/components/labs/SecondDerivativeLab';
import { MathText } from '@/components/math/MathText';
import { lessonTwoSections } from '@/data/course';
import { GlossaryTerm } from '@/components/lesson/GlossaryTerm';

export function LessonTwoPage() {
  const { sectionId = '' } = useParams();
  if (!lessonTwoSections.some((section) => section.id === sectionId)) return <Navigate to="/" replace />;
  if (sectionId === 'warmup') return <WarmupSection />;
  if (sectionId === 'fondamentali') return <FundamentalsSection />;
  if (sectionId === 'regole') return <RulesSection />;
  if (sectionId === 'derivata-seconda') return <SecondDerivativeSection />;
  if (sectionId === 'taylor') return <TaylorSection />;
  return <TheoremsSection />;
}

function WarmupSection() {
  const { t } = useTranslation();
  const questions = [
    { q: t('lessonTwo.warmup.q1'), a: t('lessonTwo.warmup.a1') },
    { q: t('lessonTwo.warmup.q2'), a: t('lessonTwo.warmup.a2') },
    { q: t('lessonTwo.warmup.q3'), a: t('lessonTwo.warmup.a3') },
  ];
  return (
    <LessonScaffold sectionId="warmup" eyebrow="" title="" lead="">
      <Stack spacing={1.5}>
        {questions.map((item, index) => <Accordion key={item.q} sx={{ border: '1px solid', borderColor: 'divider' }}><AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}><Stack direction="row" gap={2} alignItems="center"><Chip label={`0${index + 1}`} color="primary" variant="outlined" /><Typography fontWeight={750}>{item.q}</Typography></Stack></AccordionSummary><AccordionDetails><Alert severity="success">{item.a}</Alert></AccordionDetails></Accordion>)}
      </Stack>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'custom.ink', color: '#F2F5FA' }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 1 }}>{t('lessonTwo.warmup.objectiveTitle')}</Typography>
        <Typography variant="h2" sx={{ fontSize: '2.25rem', mb: 1 }}>{t('lessonTwo.warmup.objectiveHeading')}</Typography>
        <Typography sx={{ color: '#C9D2E0' }}>{t('lessonTwo.warmup.objectiveBody')}</Typography>
      </Paper>
      <SectionBlock eyebrow={t('lessonTwo.warmup.prereqEyebrow')} title={t('lessonTwo.warmup.prereqTitle')}>
        <Typography paragraph>{t('lessonTwo.warmup.prereqBody')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}><BlockMath math="\lim_{t\to0}\frac{\sin t}{t}=1" /><Typography variant="body2" color="text.secondary">{t('lessonTwo.warmup.limit1Note')}</Typography></Paper></Grid>
          <Grid item xs={12} sm={6}><Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}><BlockMath math="\lim_{t\to0}\frac{e^t-1}{t}=1" /><Typography variant="body2" color="text.secondary">{t('lessonTwo.warmup.limit2Note')}</Typography></Paper></Grid>
        </Grid>
      </SectionBlock>
    </LessonScaffold>
  );
}

function FundamentalsSection() {
  const { t } = useTranslation();
  const rows = [
    ['c', 'Δy = 0', '0'],
    ['x^n', t('lessonTwo.fundamentals.toolNewtonBinomial'), 'nx^{n-1}'],
    ['e^x', '\\lim (e^h-1)/h=1', 'e^x'],
    ['\\sin x', '\\lim \\sin h/h=1', '\\cos x'],
    ['\\cos x', t('lessonTwo.fundamentals.toolAdditionFormulas'), '-\\sin x'],
  ];
  return (
    <LessonScaffold sectionId="fondamentali" eyebrow="" title="" lead="">
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table><TableHead><TableRow><TableCell>{t('lessonTwo.fundamentals.colFunction')}</TableCell><TableCell>{t('lessonTwo.fundamentals.colTool')}</TableCell><TableCell>{t('lessonTwo.fundamentals.colDerivative')}</TableCell></TableRow></TableHead><TableBody>{rows.map((row) => <TableRow key={row[0]}><TableCell><InlineMath math={row[0]} /></TableCell><TableCell><MathText text={`\\(${row[1]}\\)`} /></TableCell><TableCell sx={{ color: 'primary.main', fontWeight: 800 }}><InlineMath math={row[2]} /></TableCell></TableRow>)}</TableBody></Table>
      </TableContainer>

      <SectionBlock eyebrow={t('lessonTwo.fundamentals.demoEyebrow')} title={t('lessonTwo.fundamentals.demoTitle')}>
        <Stack spacing={2}>
          <Derivation title={t('lessonTwo.fundamentals.powerTitle')} formula="(x^n)'=nx^{n-1}" meaning={t('lessonTwo.fundamentals.powerMeaning')} steps={[
            { label: t('lessonTwo.fundamentals.stepDefinition'), formula: "\\frac{(x+h)^n-x^n}{h}", explanation: t('lessonTwo.fundamentals.powerStep1') },
            { label: t('lessonTwo.fundamentals.stepNewton'), formula: "(x+h)^n=x^n+nx^{n-1}h+\\binom n2x^{n-2}h^2+\\cdots+h^n", explanation: t('lessonTwo.fundamentals.powerStep2') },
            { label: t('lessonTwo.fundamentals.stepDivideH'), formula: "nx^{n-1}+\\binom n2x^{n-2}h+\\cdots+h^{n-1}", explanation: t('lessonTwo.fundamentals.powerStep3') },
            { label: t('lessonTwo.fundamentals.stepLimit'), formula: "\\lim_{h\\to0}(nx^{n-1}+h\\cdot\\ldots)=nx^{n-1}", explanation: t('lessonTwo.fundamentals.powerStep4') },
          ]} conclusion={t('lessonTwo.fundamentals.powerConclusion')} />
          <Derivation title={t('lessonTwo.fundamentals.sineTitle')} formula="(\sin x)'=\cos x" meaning={t('lessonTwo.fundamentals.sineMeaning')} defaultExpanded conceptId="proof-sine" checkpoint={{ question: t('lessonTwo.fundamentals.sineCheckQ'), choices: [t('lessonTwo.fundamentals.sineCheckC0'), t('lessonTwo.fundamentals.sineCheckC1'), t('lessonTwo.fundamentals.sineCheckC2')], correctIndex: 0, explanation: t('lessonTwo.fundamentals.sineCheckExp') }} steps={[
            { label: t('lessonTwo.fundamentals.stepDiffQuotient'), formula: "\\frac{\\sin(x+h)-\\sin x}{h}", explanation: t('lessonTwo.fundamentals.sineStep1') },
            { label: t('lessonTwo.fundamentals.stepProsthaphaeresis'), formula: "\\sin(x+h)-\\sin x=2\\cos(x+h/2)\\sin(h/2)", explanation: t('lessonTwo.fundamentals.sineStep2') },
            { label: t('lessonTwo.fundamentals.stepNotableLimit'), formula: "\\cos(x+h/2)\\frac{\\sin(h/2)}{h/2}\\to\\cos x", explanation: t('lessonTwo.fundamentals.sineStep3') },
          ]} conclusion={t('lessonTwo.fundamentals.sineConclusion')} />
          <Derivation title={t('lessonTwo.fundamentals.cosineTitle')} formula="(\cos x)'=-\sin x" meaning={t('lessonTwo.fundamentals.cosineMeaning')} steps={[
            { label: t('lessonTwo.fundamentals.stepAdditionFormula'), formula: "\\cos(x+h)=\\cos x\\cos h-\\sin x\\sin h", explanation: t('lessonTwo.fundamentals.cosineStep1') },
            { label: t('lessonTwo.fundamentals.stepSeparate'), formula: "\\cos x\\frac{\\cos h-1}{h}-\\sin x\\frac{\\sin h}{h}", explanation: t('lessonTwo.fundamentals.cosineStep2') },
            { label: t('lessonTwo.fundamentals.stepNotableLimits'), formula: "\\cos x\\cdot0-\\sin x\\cdot1=-\\sin x", explanation: t('lessonTwo.fundamentals.cosineStep3') },
          ]} conclusion={t('lessonTwo.fundamentals.cosineConclusion')} />
        </Stack>
      </SectionBlock>

      <Paper elevation={0} sx={{ p: 3, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}>
        <Typography variant="h3" mb={1}>{t('lessonTwo.fundamentals.expInsightTitle')}</Typography>
        <Typography>{t('lessonTwo.fundamentals.expInsightBody')}</Typography>
      </Paper>
      <HistoryNote title={t('lessonTwo.fundamentals.historyTitle')} summary={t('lessonTwo.fundamentals.historySummary')} href="https://www.khanacademy.org/math/differential-calculus/dc-chain/dc-exponential-functions/v/exponential-functions-differentiation-intro">
        {t('lessonTwo.fundamentals.historyBody')}
      </HistoryNote>
    </LessonScaffold>
  );
}

function RulesSection() {
  const { t } = useTranslation();
  return (
    <LessonScaffold sectionId="regole" eyebrow="" title="" lead="">
      <Stack spacing={2}>
        <Derivation title={t('lessonTwo.rules.linearityTitle')} formula="(\alpha f+\beta g)'=\alpha f'+\beta g'" meaning={t('lessonTwo.rules.linearityMeaning')} defaultExpanded steps={[
          { label: t('lessonTwo.fundamentals.stepDiffQuotient'), formula: "\\frac{\\alpha[f(x+h)-f(x)]+\\beta[g(x+h)-g(x)]}{h}", explanation: t('lessonTwo.rules.linearityStep1') },
          { label: t('lessonTwo.rules.stepSeparateLimit'), formula: "\\alpha\\lim_{h\\to0}\\frac{f(x+h)-f(x)}h+\\beta\\lim_{h\\to0}\\frac{g(x+h)-g(x)}h", explanation: t('lessonTwo.rules.linearityStep2') },
        ]} conclusion={t('lessonTwo.rules.linearityConclusion')} />
        <Derivation title={t('lessonTwo.rules.productTitle')} formula="(fg)'=f'g+fg'" meaning={t('lessonTwo.rules.productMeaning')} conceptId="proof-product" checkpoint={{ question: t('lessonTwo.rules.productCheckQ'), choices: [t('lessonTwo.rules.productCheckC0'), t('lessonTwo.rules.productCheckC1'), t('lessonTwo.rules.productCheckC2')], correctIndex: 0, explanation: t('lessonTwo.rules.productCheckExp') }} steps={[
          { label: t('lessonTwo.fundamentals.stepDefinition'), formula: "\\frac{f(x+h)g(x+h)-f(x)g(x)}h", explanation: t('lessonTwo.rules.productStep1') },
          { label: t('lessonTwo.rules.stepAddZero'), formula: "\\frac{f(x+h)g(x+h)-f(x)g(x+h)+f(x)g(x+h)-f(x)g(x)}h", explanation: t('lessonTwo.rules.productStep2') },
          { label: t('lessonTwo.rules.stepFactor'), formula: "g(x+h)\\frac{f(x+h)-f(x)}h+f(x)\\frac{g(x+h)-g(x)}h", explanation: t('lessonTwo.rules.productStep3') },
          { label: t('lessonTwo.fundamentals.stepLimit'), formula: "g(x)f'(x)+f(x)g'(x)", explanation: t('lessonTwo.rules.productStep4') },
        ]} conclusion={t('lessonTwo.rules.productConclusion')} />
        <Derivation title={t('lessonTwo.rules.quotientTitle')} formula="\left(\frac fg\right)'=\frac{f'g-fg'}{g^2}" meaning={t('lessonTwo.rules.quotientMeaning')} steps={[
          { label: t('lessonTwo.rules.stepRewriteProduct'), formula: "f=\\frac fg\\cdot g", explanation: t('lessonTwo.rules.quotientStep1') },
          { label: t('lessonTwo.rules.stepDerive'), formula: "f'=\\left(\\frac fg\\right)'g+\\frac fg\\,g'", explanation: t('lessonTwo.rules.quotientStep2') },
          { label: t('lessonTwo.rules.stepIsolate'), formula: "\\left(\\frac fg\\right)'=\\frac{f'g-fg'}{g^2}", explanation: t('lessonTwo.rules.quotientStep3') },
        ]} conclusion={t('lessonTwo.rules.quotientConclusion')} />
        <Derivation title={t('lessonTwo.rules.chainTitle')} formula="(f\circ g)'=f'(g)\,g'" meaning={t('lessonTwo.rules.chainMeaning')} steps={[
          { label: t('lessonTwo.rules.stepCompositeRatio'), formula: "\\frac{f(g(x+h))-f(g(x))}{h}", explanation: t('lessonTwo.rules.chainStep1') },
          { label: t('lessonTwo.rules.stepIntroduceK'), formula: "\\varphi(k)\\frac{g(x+h)-g(x)}h,\\quad k=g(x+h)-g(x)", explanation: t('lessonTwo.rules.chainStep2') },
          { label: t('lessonTwo.rules.stepPassLimit'), formula: "f'(g(x))\\cdot g'(x)", explanation: t('lessonTwo.rules.chainStep3') },
        ]} conclusion={t('lessonTwo.rules.chainConclusion')} />
      </Stack>

      <SectionBlock eyebrow={t('lessonTwo.rules.canonicalEyebrow')} title={t('lessonTwo.rules.canonicalTitle')}>
        <ChainRuleLayers />
      </SectionBlock>
      <SectionBlock eyebrow={t('lessonTwo.rules.afterChainEyebrow')} title={t('lessonTwo.rules.afterChainTitle')}>
        <Derivation title={t('lessonTwo.rules.lnTitle')} formula="(\ln x)'=1/x" meaning={t('lessonTwo.rules.lnMeaning')} steps={[
          { label: t('lessonTwo.rules.stepInverseFunctions'), formula: "y=\\ln x\\iff e^y=x", explanation: t('lessonTwo.rules.lnStep1') },
          { label: t('lessonTwo.rules.stepDeriveChain'), formula: "e^y\\frac{dy}{dx}=1", explanation: t('lessonTwo.rules.lnStep2') },
          { label: t('lessonTwo.rules.stepSolve'), formula: "\\frac{dy}{dx}=\\frac1{e^y}=\\frac1x", explanation: t('lessonTwo.rules.lnStep3') },
        ]} conclusion={t('lessonTwo.rules.lnConclusion')} />
      </SectionBlock>

      <HistoryNote title={t('lessonTwo.rules.historyProductTitle')} summary={t('lessonTwo.rules.historyProductSummary')} href="https://en.wikipedia.org/wiki/Product_rule">
        {t('lessonTwo.rules.historyProductBody')}
      </HistoryNote>
      <HistoryNote title="Chain rule: intuizione e rigore" summary="dy/dx = dy/du · du/dx è un’intuizione eccellente, ma il limite spiega perché funziona." href="https://www.3blue1brown.com/lessons/chain-rule-and-product-rule">
        La notazione di Leibniz fa sembrare i differenziali frazioni che si semplificano. La dimostrazione rigorosa sostituisce questa cancellazione con due rapporti incrementali e usa la continuità della funzione interna.
      </HistoryNote>
    </LessonScaffold>
  );
}

function SecondDerivativeSection() {
  const { t } = useTranslation();
  return (
    <LessonScaffold sectionId="derivata-seconda" eyebrow="" title="" lead="">
      <Paper elevation={0} sx={{ bgcolor: 'custom.ink', color: '#F2F5FA', p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 1 }}>{t('lessonTwo.secondDerivative.heading')}</Typography>
        <Box sx={{ overflowX: 'auto', '& .katex': { fontSize: '1.35em' } }}><BlockMath math="f''(x)=(f'(x))'=\frac{d^2y}{dx^2}=D^2f(x)" /></Box>
      </Paper>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}><PerspectiveCard icon="⌣" label="f″ > 0" title={t('lessonTwo.secondDerivative.concaveUpTitle')}>{t('lessonTwo.secondDerivative.concaveUpBody')}</PerspectiveCard></Grid>
        <Grid item xs={12} md={4}><PerspectiveCard icon="⌢" label="f″ < 0" title={t('lessonTwo.secondDerivative.concaveDownTitle')}>{t('lessonTwo.secondDerivative.concaveDownBody')}</PerspectiveCard></Grid>
        <Grid item xs={12} md={4}><PerspectiveCard icon="a" label={t('lessonTwo.secondDerivative.physicsLabel')} title={t('lessonTwo.secondDerivative.accelerationTitle')}><MathText text={t('lessonTwo.secondDerivative.accelerationBody')} /></PerspectiveCard></Grid>
      </Grid>
      <SectionBlock eyebrow={t('lessonTwo.secondDerivative.lookFirstEyebrow')} title={t('lessonTwo.secondDerivative.lookFirstTitle')}>
        <Typography paragraph>
          <MathText text={t('lessonTwo.secondDerivative.lookFirstBody')} />
        </Typography>
        <ConcavityExamples />
      </SectionBlock>
      <SectionBlock eyebrow={t('lessonTwo.secondDerivative.labEyebrow')} title={t('lessonTwo.secondDerivative.labTitle')}>
        <Typography paragraph>
          <MathText text={t('lessonTwo.secondDerivative.labBody')} /> <GlossaryTerm term={t('lessonTwo.secondDerivative.osculatingCircleTerm')} />
          {t('lessonTwo.secondDerivative.labBodyEnd')}
        </Typography>
        <SecondDerivativeLab />
      </SectionBlock>
      <SectionBlock eyebrow={t('lessonTwo.secondDerivative.stationaryEyebrow')} title={t('lessonTwo.secondDerivative.stationaryTitle')}>
        <Typography paragraph><MathText text={t('lessonTwo.secondDerivative.stationaryBody')} /></Typography>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}><BlockMath math="f(x)=x^3-3x\quad\Rightarrow\quad f'(x)=3x^2-3\quad\Rightarrow\quad x=\pm1" /><Typography variant="body2" color="text.secondary"><MathText text={t('lessonTwo.secondDerivative.stationaryNote')} /></Typography></Paper>
      </SectionBlock>
      <Alert severity="info">{t('lessonTwo.secondDerivative.alert')}</Alert>
    </LessonScaffold>
  );
}

function TaylorSection() {
  const { t } = useTranslation();
  const developments = [
    ['e^x', '1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\cdots'],
    ['\\sin x', 'x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\cdots'],
    ['\\cos x', '1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\cdots'],
  ];
  return (
    <LessonScaffold sectionId="taylor" eyebrow="" title="" lead="">
      <Alert severity="warning" icon="★"><strong>{t('lessonTwo.taylor.advancedLabel')}</strong> {t('lessonTwo.taylor.advancedNote')}</Alert>
      <SectionBlock eyebrow={t('lessonTwo.taylor.beforeFormulaEyebrow')} title={t('lessonTwo.taylor.beforeFormulaTitle')}>
        <Typography paragraph>
          <MathText text={t('lessonTwo.taylor.beforeFormulaP1')} />
        </Typography>
        <Typography paragraph>
          <MathText text={t('lessonTwo.taylor.beforeFormulaP2')} />
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" color="primary.main">{t('lessonTwo.taylor.card1Eyebrow')}</Typography>
              <Typography variant="h3" mb={1}>{t('lessonTwo.taylor.card1Title')}</Typography>
              <Typography variant="body2" color="text.secondary">{t('lessonTwo.taylor.card1Body')}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" color="primary.main">{t('lessonTwo.taylor.card2Eyebrow')}</Typography>
              <Typography variant="h3" mb={1}>{t('lessonTwo.taylor.card2Title')}</Typography>
              <Typography variant="body2" color="text.secondary">{t('lessonTwo.taylor.card2Body')}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" color="primary.main">{t('lessonTwo.taylor.card3Eyebrow')}</Typography>
              <Typography variant="h3" mb={1}>{t('lessonTwo.taylor.card3Title')}</Typography>
              <Typography variant="body2" color="text.secondary"><MathText text={t('lessonTwo.taylor.card3Body')} /></Typography>
            </Paper>
          </Grid>
        </Grid>
        <Paper elevation={0} sx={{ mt: 2, p: 3, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}>
          <Typography variant="h3" mb={1}>{t('lessonTwo.taylor.simpleExampleTitle')}</Typography>
          <Typography>
            <MathText text={t('lessonTwo.taylor.simpleExampleBody')} />
          </Typography>
        </Paper>
      </SectionBlock>
      <SectionBlock eyebrow={t('lessonTwo.taylor.buildEyebrow')} title={t('lessonTwo.taylor.buildTitle')}>
        <Stack spacing={1.5}>
          <TaylorStep number="0" title={t('lessonTwo.taylor.step0Title')} formula="P_0(x)=f(x_0)" text={t('lessonTwo.taylor.step0Text')} />
          <TaylorStep number="1" title={t('lessonTwo.taylor.step1Title')} formula="P_1(x)=f(x_0)+f'(x_0)(x-x_0)" text={t('lessonTwo.taylor.step1Text')} />
          <TaylorStep number="2" title={t('lessonTwo.taylor.step2Title')} formula="P_2(x)=f(x_0)+f'(x_0)(x-x_0)+\frac{f''(x_0)}{2!}(x-x_0)^2" text={t('lessonTwo.taylor.step2Text')} />
        </Stack>
        <Paper elevation={0} sx={{ mt: 2, p: 3, bgcolor: 'custom.ink', color: '#F2F5FA', overflowX: 'auto' }}><BlockMath math="P_n(x)=\sum_{k=0}^{n}\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k" /></Paper>
        <Typography variant="body2" color="text.secondary" mt={1.5}><MathText text={t('lessonTwo.taylor.summaryNote')} /></Typography>
      </SectionBlock>
      <SectionBlock eyebrow={t('lessonTwo.taylor.labEyebrow')} title={t('lessonTwo.taylor.labTitle')}>
        <TaylorLab />
      </SectionBlock>
      <SectionBlock title={t('lessonTwo.taylor.developsTitle')}>
        <Stack spacing={1}>{developments.map(([fn, series]) => <Paper key={fn} elevation={0} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '120px 1fr' }, gap: 2, p: 2, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}><Box color="primary.main"><InlineMath math={fn} /></Box><InlineMath math={series} /></Paper>)}</Stack>
        <Typography variant="body2" color="text.secondary" mt={2}>{t('lessonTwo.taylor.macLaurinNote')}</Typography>
      </SectionBlock>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}><Typography variant="h3" mb={1}>{t('lessonTwo.taylor.insightTitle')}</Typography><Typography>{t('lessonTwo.taylor.insightBody')}</Typography></Paper>
      <HistoryNote title={t('lessonTwo.taylor.historyTitle')} summary={t('lessonTwo.taylor.historySummary')} href="https://mathshistory.st-andrews.ac.uk/Biographies/Taylor/">
        {t('lessonTwo.taylor.historyBody')}
      </HistoryNote>
    </LessonScaffold>
  );
}

function TheoremsSection() {
  return (
    <LessonScaffold
      sectionId="teoremi"
      eyebrow=""
      title=""
      lead=""
    >
      <DerivativeTheoremsAppendix />
    </LessonScaffold>
  );
}

function TaylorStep({ number, title, formula, text }: { number: string; title: string; formula: string; text: string }) {
  return <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider' }}><Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }}><Box sx={{ width: 42, height: 42, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 800 }}>P{number}</Box><Box sx={{ flex: 1 }}><Typography variant="h3" sx={{ fontSize: '1.25rem' }}>{title}</Typography><Typography variant="body2" color="text.secondary">{text}</Typography></Box><Box color="primary.main"><InlineMath math={formula} /></Box></Stack></Paper>;
}
