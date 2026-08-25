import { Alert, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { BlockMath, InlineMath } from 'react-katex';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Derivation } from '@/components/lesson/Derivation';
import { HistoryNote } from '@/components/lesson/HistoryNote';
import { LessonScaffold, PerspectiveCard, SectionBlock } from '@/components/lesson/LessonScaffold';
import { GeometryLab } from '@/components/labs/GeometryLab';
import { MathText } from '@/components/math/MathText';
import { VelocityInquiry } from '@/components/lesson/VelocityInquiry';
import { GlossaryTerm } from '@/components/lesson/GlossaryTerm';
import { lessonOneSections } from '@/data/course';

export function LessonOnePage() {
  const { sectionId = '' } = useParams();
  if (!lessonOneSections.some((section) => section.id === sectionId)) return <Navigate to="/" replace />;
  if (sectionId === 'velocita') return <VelocitySection />;
  if (sectionId === 'geometria') return <GeometrySection />;
  if (sectionId === 'definizione') return <DefinitionSection />;
  if (sectionId === 'derivabilita') return <DifferentiabilitySection />;
  return <InterpretationsSection />;
}

function VelocitySection() {
  const { t } = useTranslation();
  return (
    <LessonScaffold sectionId="velocita" eyebrow={t('lessonOne.velocity.eyebrow')} title={t('lesson.content.velocita.title')} lead={t('lesson.content.velocita.lead')}>
      <SectionBlock eyebrow={t('lessonOne.velocity.situationEyebrow')} title={t('lessonOne.velocity.fallingObject.title')}>
        <Typography paragraph>{t('lessonOne.velocity.fallingObject.body')}</Typography>
        <Grid container spacing={2} mt={1}>
          {[
            { label: t('lessonOne.velocity.observe.label'), value: t('lessonOne.velocity.observe.value'), body: t('lessonOne.velocity.observe.body') },
            { label: t('lessonOne.velocity.measure.label'), value: t('lessonOne.velocity.measure.value'), body: t('lessonOne.velocity.measure.body') },
            { label: t('lessonOne.velocity.ask.label'), value: t('lessonOne.velocity.ask.value'), body: t('lessonOne.velocity.ask.body') },
          ].map((item) => <Grid item xs={12} sm={4} key={item.label}><Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}><Typography variant="caption" color="primary.main">{item.label}</Typography><Typography variant="h3" sx={{ my: 1 }}>{item.value}</Typography><Typography variant="body2">{item.body}</Typography></Paper></Grid>)}
        </Grid>
      </SectionBlock>
      <VelocityInquiry />

      <Paper elevation={0} sx={{ bgcolor: 'custom.ink', color: '#F2F5FA', p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 2 }}>{t('lessonOne.velocity.bridge.title')}</Typography>
        <Typography sx={{ color: '#C9D2E0', mb: 2 }}><MathText text={t('lessonOne.velocity.bridge.body1')} /></Typography>
        <Box sx={{ overflowX: 'auto', '& .katex': { fontSize: '1.25em' } }}><BlockMath math="v_m=\frac{s(t+h)-s(t)}{h}" /></Box>
        <Typography sx={{ color: '#C9D2E0', mt: 2 }}><MathText text={t('lessonOne.velocity.bridge.body2')} /></Typography>
      </Paper>

      <HistoryNote title={t('lessonOne.velocity.historyNote.title')} summary={t('lessonOne.velocity.historyNote.summary')} href="https://mathshistory.st-andrews.ac.uk/Biographies/Galileo/">
        {t('lessonOne.velocity.historyNote.body')}
      </HistoryNote>

      <Alert severity="info"><strong>{t('lessonOne.velocity.alert.strong')}</strong> {t('lessonOne.velocity.alert.body')}</Alert>
    </LessonScaffold>
  );
}

function GeometrySection() {
  const { t } = useTranslation();
  return (
    <LessonScaffold sectionId="geometria" eyebrow={t('lessonOne.geometry.eyebrow')} title={t('lesson.content.geometria.title')} lead={t('lesson.content.geometria.lead')}>
      <GeometryLab />
      <SectionBlock eyebrow={t('lessonOne.geometry.guided.eyebrow')} title={<>{t('lessonOne.geometry.guided.titlePre')} <GlossaryTerm term="Rapporto incrementale" /> {t('lessonOne.geometry.guided.titlePost')}</>}>
        <Typography paragraph><MathText text={t('lessonOne.geometry.guided.para1')} /></Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(65,88,208,.07)', borderLeft: '3px solid', borderColor: 'primary.main', overflowX: 'auto' }}><BlockMath math="m_{\mathrm{sec}}=\frac{\Delta y}{\Delta x}=\frac{f(x_0+h)-f(x_0)}{h}" /></Paper>
        <Typography paragraph mt={2}><MathText text={t('lessonOne.geometry.guided.para2')} /></Typography>
      </SectionBlock>
      <SectionBlock eyebrow={t('lessonOne.geometry.example.eyebrow')} title={t('lessonOne.geometry.example.title')}>
        <Stack spacing={1.25}>
          <MathLine number="1" formula="\frac{f(1+h)-f(1)}{h}=\frac{(1+h)^2-1}{h}" text={t('lessonOne.geometry.example.step1')} />
          <MathLine number="2" formula="\frac{1+2h+h^2-1}{h}=\frac{2h+h^2}{h}=2+h" text={t('lessonOne.geometry.example.step2')} />
          <MathLine number="3" formula="\lim_{h\to0}(2+h)=2" text={t('lessonOne.geometry.example.step3')} />
        </Stack>
      </SectionBlock>
      <SectionBlock eyebrow={t('lessonOne.geometry.normal.eyebrow')} title={t('lessonOne.geometry.normal.title')}>
        <Typography paragraph><MathText text={t('lessonOne.geometry.normal.para')} /></Typography>
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}><BlockMath math="f(x)=x^2,\ x_0=1:\quad m_t=2,\quad t:y-1=2(x-1),\quad n:y-1=-\frac12(x-1)" /></Paper>
        <Typography variant="body2" color="text.secondary" mt={1.5}><MathText text={t('lessonOne.geometry.normal.note')} /></Typography>
      </SectionBlock>
      <HistoryNote title={t('lessonOne.geometry.historyNote.title')} summary={t('lessonOne.geometry.historyNote.summary')} href="https://mathshistory.st-andrews.ac.uk/Biographies/Leibniz/">
        {t('lessonOne.geometry.historyNote.body')}
      </HistoryNote>
    </LessonScaffold>
  );
}

function DefinitionSection() {
  const { t } = useTranslation();
  return (
    <LessonScaffold sectionId="definizione" eyebrow={t('lessonOne.definition.eyebrow')} title={t('lesson.content.definizione.title')} lead={t('lesson.content.definizione.lead')}>
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, bgcolor: 'custom.ink', color: '#F2F5FA', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 2 }}>{t('lessonOne.definition.box.heading')}</Typography>
        <Typography sx={{ color: '#C9D2E0' }}>{t('lessonOne.definition.box.line1')}</Typography>
        <Box sx={{ overflowX: 'auto', my: 2, '& .katex': { fontSize: '1.35em' } }}><BlockMath math="f'(x_0)=\lim_{h\to0}\frac{f(x_0+h)-f(x_0)}{h}" /></Box>
        <Typography sx={{ color: '#C9D2E0' }}>{t('lessonOne.definition.box.line2')}</Typography>
      </Paper>

      <SectionBlock title={t('lessonOne.definition.numberOrFunction.title')}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><PerspectiveCard icon="•" label={t('lessonOne.definition.atPoint.label')} title={t('lessonOne.definition.atPoint.title')}>{t('lessonOne.definition.atPoint.body')}</PerspectiveCard></Grid>
          <Grid item xs={12} sm={6}><PerspectiveCard icon="ƒ" label={t('lessonOne.definition.asFunction.label')} title={t('lessonOne.definition.asFunction.title')}>{t('lessonOne.definition.asFunction.body')}</PerspectiveCard></Grid>
        </Grid>
        <Paper component="details" elevation={0} sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider' }}><Typography component="summary" fontWeight={700} sx={{ cursor: 'pointer' }}>{t('lessonOne.definition.notations.summary')}</Typography><Stack direction="row" gap={1} flexWrap="wrap" useFlexGap mt={2}>{["f'(x)\\;\\text{(Lagrange)}", '\\frac{dy}{dx}\\;\\text{(Leibniz)}', 'Df\\;\\text{(operatoriale)}', '\\dot{x}\\;\\text{(Newton, nel tempo)}'].map((math) => <Paper key={math} elevation={0} sx={{ py: 1, px: 1.5, border: '1px solid', borderColor: 'divider' }}><InlineMath math={math} /></Paper>)}</Stack></Paper>
      </SectionBlock>

      <SectionBlock eyebrow={t('lessonOne.definition.proof.eyebrow')} title={t('lessonOne.definition.proof.title')}>
        <Stack spacing={2}>
          <Derivation title={t('lessonOne.definition.proof.derivationTitle')} formula="(x^2)'=2x" meaning={t('lessonOne.definition.proof.meaning')} defaultExpanded conceptId="proof-square" checkpoint={{ question: t('lessonOne.definition.proof.checkpoint.question'), choices: [t('lessonOne.definition.proof.checkpoint.choice0'), t('lessonOne.definition.proof.checkpoint.choice1'), t('lessonOne.definition.proof.checkpoint.choice2')], correctIndex: 0, explanation: t('lessonOne.definition.proof.checkpoint.explanation') }} steps={[
            { label: t('lessonOne.definition.proof.step1.label'), formula: "\\frac{(x+h)^2-x^2}{h}", explanation: t('lessonOne.definition.proof.step1.explanation') },
            { label: t('lessonOne.definition.proof.step2.label'), formula: "\\frac{x^2+2xh+h^2-x^2}{h}", explanation: t('lessonOne.definition.proof.step2.explanation') },
            { label: t('lessonOne.definition.proof.step3.label'), formula: "\\frac{h(2x+h)}{h}=2x+h", explanation: t('lessonOne.definition.proof.step3.explanation') },
            { label: t('lessonOne.definition.proof.step4.label'), formula: "\\lim_{h\\to0}(2x+h)=2x", explanation: t('lessonOne.definition.proof.step4.explanation') },
          ]} conclusion={t('lessonOne.definition.proof.conclusion')} />
        </Stack>
      </SectionBlock>

      <HistoryNote title={t('lessonOne.definition.historyNote.title')} summary={t('lessonOne.definition.historyNote.summary')} href="https://mathshistory.st-andrews.ac.uk/HistTopics/Newton_Leibniz/">
        {t('lessonOne.definition.historyNote.body')}
      </HistoryNote>
    </LessonScaffold>
  );
}

function DifferentiabilitySection() {
  const { t } = useTranslation();
  return (
    <LessonScaffold sectionId="derivabilita" eyebrow={t('lessonOne.differentiability.eyebrow')} title={t('lesson.content.derivabilita.title')} lead={t('lesson.content.derivabilita.lead')}>
      <SectionBlock eyebrow={t('lessonOne.differentiability.theorem.eyebrow')} title={t('lessonOne.differentiability.theorem.title')}>
        <Typography paragraph><MathText text={t('lessonOne.differentiability.theorem.para')} /></Typography>
        <Paper elevation={0} sx={{ bgcolor: 'custom.ink', color: '#F2F5FA', px: 2, py: 1, overflowX: 'auto' }}><BlockMath math="f(x_0+h)-f(x_0)=\frac{f(x_0+h)-f(x_0)}{h}\cdot h\longrightarrow f'(x_0)\cdot0=0" /></Paper>
        <Typography mt={2}><MathText text={t('lessonOne.differentiability.theorem.note')} /></Typography>
      </SectionBlock>
      <SectionBlock eyebrow={t('lessonOne.differentiability.lab.eyebrow')} title={t('lessonOne.differentiability.lab.title')}>
        <Typography paragraph>{t('lessonOne.differentiability.lab.para')}</Typography>
        <GeometryLab singularMode />
      </SectionBlock>
      <Grid container spacing={2}>
        {[
          { title: t('lessonOne.differentiability.cases.corner.title'), math: '|x|', body: t('lessonOne.differentiability.cases.corner.body') },
          { title: t('lessonOne.differentiability.cases.cusp.title'), math: 'x^{2/3}', body: t('lessonOne.differentiability.cases.cusp.body') },
          { title: t('lessonOne.differentiability.cases.vertical.title'), math: '\\sqrt[3]{x}', body: t('lessonOne.differentiability.cases.vertical.body') },
        ].map((item) => <Grid item xs={12} sm={4} key={item.title}><Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}><Typography variant="h3" sx={{ fontSize: '1.3rem' }}>{item.title}</Typography><Box sx={{ my: 1.5, color: 'primary.main' }}><InlineMath math={`f(x)=${item.math}`} /></Box><Typography variant="body2">{item.body}</Typography></Paper></Grid>)}
      </Grid>
    </LessonScaffold>
  );
}

function InterpretationsSection() {
  const { t } = useTranslation();
  return (
    <LessonScaffold sectionId="interpretazioni" eyebrow={t('lessonOne.interpretations.eyebrow')} title={t('lesson.content.interpretazioni.title')} lead={t('lesson.content.interpretazioni.lead')}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}><PerspectiveCard icon="◢" label={t('lessonOne.interpretations.geometric.label')} title={t('lessonOne.interpretations.geometric.title')}>{t('lessonOne.interpretations.geometric.body')}</PerspectiveCard></Grid>
        <Grid item xs={12} md={4}><PerspectiveCard icon="lim" label={t('lessonOne.interpretations.analytic.label')} title={t('lessonOne.interpretations.analytic.title')}><MathText text={'\\(f′(x_0)=\\lim_{h\\to0}[f(x_0+h)-f(x_0)]/h\\).'} /></PerspectiveCard></Grid>
        <Grid item xs={12} md={4}><PerspectiveCard icon="↗" label={t('lessonOne.interpretations.physical.label')} title={t('lessonOne.interpretations.physical.title')}>{t('lessonOne.interpretations.physical.body')}</PerspectiveCard></Grid>
      </Grid>
      <SectionBlock eyebrow={t('lessonOne.interpretations.realWorld.eyebrow')} title={t('lessonOne.interpretations.realWorld.title')}>
        <Grid container spacing={2}>
          {[
            { icon: '🚗', title: t('lessonOne.interpretations.realWorld.velocity.title'), formula: "v(t)=s'(t)", body: t('lessonOne.interpretations.realWorld.velocity.body') },
            { icon: '⚡', title: t('lessonOne.interpretations.realWorld.current.title'), formula: 'i(t)=\\frac{dq}{dt}', body: t('lessonOne.interpretations.realWorld.current.body') },
            { icon: '🦠', title: t('lessonOne.interpretations.realWorld.growth.title'), formula: "N'(t)", body: t('lessonOne.interpretations.realWorld.growth.body') },
            { icon: '€', title: t('lessonOne.interpretations.realWorld.cost.title'), formula: "C'(q)", body: t('lessonOne.interpretations.realWorld.cost.body') },
          ].map((item) => <Grid item xs={12} sm={6} key={item.title}><Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}><Stack direction="row" gap={2}><Typography fontSize="1.6rem">{item.icon}</Typography><Box><Typography variant="h3" sx={{ fontSize: '1.3rem' }}>{item.title}</Typography><Box my={1} color="primary.main"><InlineMath math={item.formula} /></Box><Typography variant="body2">{item.body}</Typography></Box></Stack></Paper></Grid>)}
        </Grid>
      </SectionBlock>
      <SectionBlock eyebrow={t('lessonOne.interpretations.problem.eyebrow')} title={t('lessonOne.interpretations.problem.title')}>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography paragraph><MathText text={t('lessonOne.interpretations.problem.para')} /></Typography>
          <BlockMath math="C'(q)=0{,}04q+8\quad\Rightarrow\quad C'(100)=12" />
          <Typography><strong>{t('lessonOne.interpretations.problem.interpretationLabel')}</strong> <MathText text={t('lessonOne.interpretations.problem.interpretationBody')} /></Typography>
        </Paper>
      </SectionBlock>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}>
        <Typography variant="h4" sx={{ color: 'custom.gold', mb: 1 }}>{t('lessonOne.interpretations.closing.heading')}</Typography>
        <Typography variant="h3">{t('lessonOne.interpretations.closing.question')}</Typography>
        <Typography mt={1}>{t('lessonOne.interpretations.closing.body')}</Typography>
      </Paper>
      <HistoryNote title={t('lessonOne.interpretations.historyNote.title')} summary={t('lessonOne.interpretations.historyNote.summary')} href="https://www.3blue1brown.com/lessons/essence-of-calculus">
        {t('lessonOne.interpretations.historyNote.body')}
      </HistoryNote>
    </LessonScaffold>
  );
}

function MathLine({ number, formula, text }: { number: string; formula: string; text: string }) {
  return (
    <Paper elevation={0} sx={{ display: 'grid', gridTemplateColumns: '32px minmax(0,1fr)', gap: 1.5, p: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center', fontSize: '.75rem' }}>{number}</Box>
      <Box sx={{ minWidth: 0 }}><Box sx={{ overflowX: 'auto' }}><BlockMath math={formula} /></Box><Typography variant="body2" color="text.secondary">{text}</Typography></Box>
    </Paper>
  );
}
