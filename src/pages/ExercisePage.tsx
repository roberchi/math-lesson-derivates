import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
  keyframes,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import { DifficultyChip } from '@/components/common/DifficultyChip';
import { MathFormula, MathText } from '@/components/math/MathText';
import { useDBStore } from '@/store/dbStore';
import { useProgressStore } from '@/store/progressStore';
import { useUIStore } from '@/store/uiStore';
import type { SolutionStep } from '@/types/exercise';
import { arePrerequisitesMastered, buildAdaptiveOrder, calculateScore, createSeededChoices, stripLatex } from '@/utils/learning';
import { getClassMetrics } from '@/utils/learning';
import { useTranslation } from 'react-i18next';

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
`;

type Feedback = { type: 'success' | 'error' | 'info'; title: string; body: string; points?: number } | null;

export function ExercisePage() {
  const { t } = useTranslation();
  const { classId = '', exId = '' } = useParams();
  const db = useDBStore((state) => state.db);
  const progress = useProgressStore((state) => state.progress);
  const visit = useProgressStore((state) => state.visitExercise);
  const recordAttempt = useProgressStore((state) => state.recordAttempt);
  const finalize = useProgressStore((state) => state.finalizeExercise);
  const markSolution = useProgressStore((state) => state.markSolutionViewed);
  const markProof = useProgressStore((state) => state.markProofViewed);
  const passProofCheckpoint = useProgressStore((state) => state.passProofCheckpoint);
  const completeClass = useProgressStore((state) => state.completeClass);
  const resetExercise = useProgressStore((state) => state.resetExercise);
  const notify = useUIStore((state) => state.showSnackbar);
  const navigate = useNavigate();

  const cls = db?.classes.find((item) => item.id === classId);
  const exercise = cls?.exercises.find((item) => item.id === exId);
  const attempt = progress.classes[classId]?.attempts[exId];
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongChoices, setWrongChoices] = useState<number[]>([]);
  const [proofOpen, setProofOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [helpLevel, setHelpLevel] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [proofChoice, setProofChoice] = useState<number | null>(null);
  const nextButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (classId && exId) visit(classId, exId);
  }, [classId, exId, visit]);

  useEffect(() => {
    setSelected(null);
    setWrongChoices([]);
    setProofOpen(false);
    setSolutionOpen(false);
    setHelpLevel(0);
    setFeedback(null);
    setProofChoice(null);
  }, [exId]);

  const choices = useMemo(
    () => (db && cls && exercise ? createSeededChoices(exercise, cls, db) : []),
    [db, cls, exercise],
  );

  if (!db || !cls || !exercise) return db ? <Navigate to="/" replace /> : null;
  const effectivelyUnlocked = progress.classes[classId]?.unlocked || progress.classes[classId]?.consultation || arePrerequisitesMastered(cls.prerequisite_classes, progress);
  if (!effectivelyUnlocked) return <Navigate to="/" replace />;

  const ordered = buildAdaptiveOrder(cls.exercises, classId, progress);
  const currentIndex = ordered.findIndex((item) => item.id === exId);
  const previous = ordered[currentIndex - 1];
  const next = ordered[currentIndex + 1];
  const tries = attempt?.tries ?? [];
  const done = attempt?.done ?? false;
  const rules = db.progression_rules.scoring;
  const isRepresentativeProof = cls.exercises.find((item) => item.proof_from_limit)?.id === exId;
  const checkpoint = exercise.proof_from_limit?.checkpoint ?? {
    prompt: 'Qual è il passaggio che rende valida questa dimostrazione?',
    choices: ['Semplificare per h quando h è diverso da zero e solo dopo passare al limite', 'Porre subito h uguale a zero', 'Copiare la formula finale senza il rapporto incrementale'],
    correctIndex: 0,
    explanation: 'Nel rapporto h resta diverso da zero; soltanto il limite descrive che cosa accade quando h si avvicina a zero.',
  };

  const finishClassIfNeeded = () => {
    const currentProgress = useProgressStore.getState().progress;
    const everyOtherDone = cls.exercises.every(
      (item) => currentProgress.classes[classId]?.attempts[item.id]?.done,
    );
    if (everyOtherDone) completeClass(classId, getClassMetrics(cls, currentProgress).mastered);
    return everyOtherDone;
  };

  const confirmAnswer = () => {
    if (selected === null || done) return;
    const correct = choices[selected].isCorrect;
    const nextTries = [...tries, correct ? 'correct' as const : 'wrong' as const].slice(0, 3);
    recordAttempt(classId, exId, correct ? 'correct' : 'wrong');
    if (correct) {
      const score = calculateScore(nextTries, attempt?.solutionViewed ?? false, rules);
      finalize(classId, exId, score);
      finishClassIfNeeded();
      setFeedback({ type: 'success', title: t('exercisePage.correct'), body: exercise.answer.text ?? t('exercisePage.great'), points: score });
      notify(t('exercisePage.earned', { points: score }));
      window.setTimeout(() => nextButton.current?.focus(), 50);
    } else {
      setWrongChoices((items) => [...new Set([...items, selected])]);
      setSelected(null);
      if (nextTries.length >= 3) {
        finalize(classId, exId, 0);
        finishClassIfNeeded();
        setFeedback({ type: 'error', title: t('exercisePage.attemptsEnded'), body: t('exercisePage.attemptsEndedBody') });
        setSolutionOpen(true);
      } else {
        setFeedback({ type: 'error', title: t('exercisePage.incorrect'), body: `${choices[selected].feedback} ${t('exercisePage.attemptsSentence', { count: 3 - nextTries.length })}` });
      }
    }
  };

  const showSolution = () => {
    if (!done) {
      markSolution(classId, exId);
      finalize(classId, exId, 0);
      finishClassIfNeeded();
    }
    setSolutionOpen(true);
    setFeedback({ type: 'info', title: t('exercisePage.solutionShown'), body: t('exercisePage.solutionShownBody') });
  };

  const advanceHelp = () => {
    if (helpLevel < 3) {
      setHelpLevel((value) => value + 1);
      return;
    }
    showSolution();
  };

  const toggleProof = (_event: React.SyntheticEvent, expanded: boolean) => {
    setProofOpen(expanded);
    if (expanded && done && !attempt?.proofViewed) {
      markProof(classId, exId, 0);
    }
  };

  const goForward = () => {
    const updated = useProgressStore.getState().progress;
    const allDone = cls.exercises.every((item) => updated.classes[classId]?.attempts[item.id]?.done);
    if (allDone && (!next || currentIndex === ordered.length - 1)) {
      navigate(`/class/${classId}/results`);
      return;
    }
    const nextIncomplete = buildAdaptiveOrder(cls.exercises, classId, updated).find((item) => !updated.classes[classId]?.attempts[item.id]?.done);
    navigate(`/class/${classId}/exercise/${nextIncomplete?.id ?? next?.id ?? cls.exercises[0].id}`);
  };

  const retry = () => {
    resetExercise(classId, exId);
    setSelected(null);
    setWrongChoices([]);
    setFeedback(null);
    setProofOpen(false);
    setSolutionOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Button component={Link} to={`/class/${classId}`} startIcon={<ArrowBackRoundedIcon />} color="inherit">{stripLatex(cls.title)}</Button>
        <Typography variant="caption" color="text.secondary">{t('exercisePage.counter', { current: currentIndex + 1, total: ordered.length })}</Typography>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1} mb={2}>
        <Box><Typography variant="h4" color="primary.main" mb={.7}>{t('exercisePage.exercise')}</Typography><Typography variant="h2" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>{exercise.title}</Typography></Box>
        <Stack direction="row" spacing={1}><DifficultyChip level={exercise.difficulty} />{exercise.tags.slice(0, 2).map((tag) => <Chip key={tag} size="small" label={tag} variant="outlined" />)}</Stack>
      </Stack>

      <Paper elevation={0} sx={{ bgcolor: 'custom.ink', color: '#F2F5FA', borderRadius: 2, p: { xs: 2.5, sm: 4 }, mb: 3, overflow: 'hidden' }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 2 }}>{t('exercisePage.problem')}</Typography>
        <Typography id="problem-title" component="div" sx={{ fontSize: '1.15rem', lineHeight: 1.85 }}><MathText text={exercise.problem.text} /></Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,.13)', color: '#CCD4E1' }}>{t('exercisePage.helpAvailable')}</Typography>
      </Paper>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1} mb={2}>
        <Typography variant="h3" sx={{ fontSize: '1.35rem' }}>{t('exercisePage.choose')}</Typography>
        <AttemptDots tries={tries} />
      </Stack>

      <Stack role="radiogroup" aria-labelledby="problem-title" spacing={1.25} mb={2.5}>
        {choices.map((choice, index) => {
          const isSelected = selected === index;
          const isWrong = wrongChoices.includes(index);
          const revealCorrect = done && choice.isCorrect;
          const revealWrong = done && isWrong;
          const state = revealCorrect ? 'correct' : revealWrong || isWrong ? 'wrong' : isSelected ? 'selected' : 'idle';
          const palette = state === 'correct' ? { bg: 'success.light', border: 'success.main', avatar: 'success.main' } : state === 'wrong' ? { bg: 'error.light', border: 'error.main', avatar: 'error.main' } : state === 'selected' ? { bg: 'rgba(65,88,208,.09)', border: 'primary.main', avatar: 'primary.main' } : { bg: 'background.paper', border: 'divider', avatar: 'action.selected' };
          return (
            <ButtonBase
              key={choice.latex}
              role="radio"
              aria-checked={isSelected}
              disabled={done || isWrong}
              onClick={() => { setSelected(index); if (feedback?.type === 'error' && !done) setFeedback(null); }}
              sx={{ width: '100%', p: 2, borderRadius: 1.5, border: '1px solid', borderColor: palette.border, bgcolor: palette.bg, justifyContent: 'flex-start', gap: 2, textAlign: 'left', transition: 'all .15s', animation: isWrong ? `${shake} .4s ease` : 'none', '&:hover': { borderColor: 'primary.main', transform: 'translateX(2px)' }, '&.Mui-disabled': { opacity: done ? 1 : .55 } }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: palette.avatar, color: state === 'idle' ? 'text.primary' : 'white', fontSize: '.75rem', fontWeight: 700 }}>
                {state === 'correct' ? <CheckRoundedIcon fontSize="small" /> : state === 'wrong' ? <CloseRoundedIcon fontSize="small" /> : String.fromCharCode(65 + index)}
              </Avatar>
              <Box sx={{ flex: 1, overflowX: 'auto', py: .5 }}><MathFormula math={choice.latex} /></Box>
            </ButtonBase>
          );
        })}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} mb={3}>
        {!done ? (
          <Button variant="contained" size="large" disabled={selected === null} onClick={confirmAnswer} sx={{ flex: 1 }}>{t('exercisePage.confirm')}</Button>
        ) : (
          <Button ref={nextButton} variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />} onClick={goForward} sx={{ flex: 1 }}>{t('exercisePage.proceed')}</Button>
        )}
        <Button variant="outlined" size="large" color="inherit" startIcon={done ? <RefreshRoundedIcon /> : <VisibilityOutlinedIcon />} onClick={done ? retry : advanceHelp}>
          {done ? t('exercisePage.retry') : helpLevel === 0 ? t('exercisePage.hint') : helpLevel === 1 ? t('exercisePage.recall') : helpLevel === 2 ? t('exercisePage.firstStep') : t('exercisePage.fullSolution')}
        </Button>
      </Stack>

      {!done && helpLevel > 0 && <Alert severity="info" sx={{ mb: 2 }}>
        {helpLevel === 1 && <MathText text={exercise.problem.hint ?? t('exercisePage.defaultHint')} />}
        {helpLevel === 2 && <>{t('exercisePage.recallBody')}</>}
        {helpLevel >= 3 && <><strong>{t('exercisePage.firstStepLabel')}</strong> <MathText text={`\\(${exercise.solution_steps[0]?.latex ?? exercise.answer.latex}\\) — ${exercise.solution_steps[0]?.explanation ?? ''}`} /></>}
      </Alert>}

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 3 }} action={feedback.points !== undefined ? <Chip label={`+${feedback.points} pt`} color="success" size="small" /> : undefined}>
          <AlertTitle>{feedback.title}</AlertTitle>{feedback.body}
        </Alert>
      )}

      {exercise.proof_from_limit && (
        <Accordion expanded={proofOpen} onChange={toggleProof} disabled={!done} sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(184,138,29,.45)', bgcolor: 'custom.goldLight', borderRadius: '10px !important', overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} gap={1}>
              <Typography fontWeight={800} sx={{ color: 'custom.gold' }}>{t('exercisePage.proof')}</Typography>
              <Chip size="small" label={attempt?.proofViewed ? t('exercisePage.read') : t('exercisePage.guidedReading')} color="warning" variant="outlined" />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
            <Typography variant="h3" mb={2}>{isRepresentativeProof ? exercise.proof_from_limit.title : t('exercisePage.proofIdea')}</Typography>
            <StepList steps={isRepresentativeProof ? exercise.proof_from_limit.steps : exercise.proof_from_limit.steps.slice(0, 2)} color="gold" />
            <Box sx={{ mt: 2, p: 2, bgcolor: 'custom.goldLight', borderLeft: '3px solid', borderColor: 'custom.gold' }}><Typography variant="h4" sx={{ color: 'custom.gold', mb: 1 }}>{isRepresentativeProof ? t('exercisePage.conclusion') : t('exercisePage.recognize')}</Typography><MathText text={exercise.proof_from_limit.conclusion} /></Box>
            {isRepresentativeProof && <Paper elevation={0} sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'warning.light' }}>
              <Typography fontWeight={800} mb={1}>{t('exercisePage.checkpoint')}</Typography>
              <Typography variant="body2" mb={1.5}>{checkpoint.prompt}</Typography>
              <Stack gap={1}>{checkpoint.choices.map((choice, index) => <Button key={choice} variant={proofChoice === index ? 'contained' : 'outlined'} color={proofChoice !== null && index === checkpoint.correctIndex ? 'success' : 'warning'} onClick={() => { setProofChoice(index); if (index === checkpoint.correctIndex) passProofCheckpoint(classId, exId); }}>{choice}</Button>)}</Stack>
              {proofChoice !== null && <Alert severity={proofChoice === checkpoint.correctIndex ? 'success' : 'warning'} sx={{ mt: 1.5 }}>{proofChoice === checkpoint.correctIndex ? checkpoint.explanation : t('exercisePage.checkpointRetry')}</Alert>}
            </Paper>}
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion expanded={solutionOpen} onChange={(_event, expanded) => setSolutionOpen(expanded)} sx={{ mb: 4, border: '1px solid', borderColor: 'rgba(65,88,208,.35)', borderRadius: '10px !important', overflow: 'hidden' }}>
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}><Typography fontWeight={800} color="primary.main">{t('exercisePage.solution')}</Typography></AccordionSummary>
        <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}><StepList steps={exercise.solution_steps} color="primary" /></AccordionDetails>
      </Accordion>

      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button disabled={!previous} startIcon={<ArrowBackRoundedIcon />} onClick={() => previous && navigate(`/class/${classId}/exercise/${previous.id}`)}>{t('exercisePage.previous')}</Button>
        <Typography variant="caption">{currentIndex + 1} DI {ordered.length}</Typography>
        <Button disabled={!next && !done} endIcon={<ArrowForwardRoundedIcon />} onClick={done ? goForward : () => next && navigate(`/class/${classId}/exercise/${next.id}`)}>{t('exercisePage.next')}</Button>
      </Stack>
    </Box>
  );
}

function AttemptDots({ tries }: { tries: ('correct' | 'wrong')[] }) {
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="caption" color="text.secondary">{t('exercisePage.remaining', { count: Math.max(0, 3 - tries.length) })}</Typography>
      {[0, 1, 2].map((index) => (
        <Tooltip key={index} title={tries[index] ? `Tentativo ${index + 1}: ${tries[index] === 'correct' ? 'corretto' : 'sbagliato'}` : `Tentativo ${index + 1}`}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: tries[index] === 'correct' ? 'success.main' : tries[index] === 'wrong' ? 'error.main' : 'action.disabledBackground', border: '1px solid', borderColor: tries[index] ? 'transparent' : 'divider' }} />
        </Tooltip>
      ))}
    </Stack>
  );
}

function StepList({ steps, color }: { steps: SolutionStep[]; color: 'gold' | 'primary' }) {
  const accent = color === 'gold' ? 'custom.gold' : 'primary.main';
  return (
    <Stack spacing={0}>
      {steps.map((step, index) => (
        <Box key={`${step.label}-${index}`} sx={{ display: 'grid', gridTemplateColumns: '30px minmax(0, 1fr)', gap: 1.5, py: 2, borderBottom: index === steps.length - 1 ? 0 : '1px solid', borderColor: 'divider' }}>
          <Avatar sx={{ width: 27, height: 27, bgcolor: accent, fontSize: '.72rem' }}>{index + 1}</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: accent, fontWeight: 800, textTransform: 'uppercase' }}>{step.label}</Typography>
            <Paper elevation={0} sx={{ bgcolor: 'custom.ink', color: '#F2F5FA', px: 1.5, py: .5, my: 1, overflowX: 'auto', '& .katex-display': { margin: '.5em 0' } }}><BlockMath math={step.latex} /></Paper>
            <Typography component="div" variant="body2" color="text.secondary"><MathText text={step.explanation} /></Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
