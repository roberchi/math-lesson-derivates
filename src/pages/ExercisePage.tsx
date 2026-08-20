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
  Collapse,
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
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
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
import { buildAdaptiveOrder, calculateScore, createSeededChoices, stripLatex } from '@/utils/learning';

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
`;

type Feedback = { type: 'success' | 'error' | 'info'; title: string; body: string; points?: number } | null;

export function ExercisePage() {
  const { classId = '', exId = '' } = useParams();
  const db = useDBStore((state) => state.db);
  const progress = useProgressStore((state) => state.progress);
  const visit = useProgressStore((state) => state.visitExercise);
  const recordAttempt = useProgressStore((state) => state.recordAttempt);
  const finalize = useProgressStore((state) => state.finalizeExercise);
  const markSolution = useProgressStore((state) => state.markSolutionViewed);
  const markProof = useProgressStore((state) => state.markProofViewed);
  const completeClass = useProgressStore((state) => state.completeClass);
  const resetExercise = useProgressStore((state) => state.resetExercise);
  const notify = useUIStore((state) => state.showSnackbar);
  const navigate = useNavigate();

  const cls = db?.classes.find((item) => item.id === classId);
  const exercise = cls?.exercises.find((item) => item.id === exId);
  const attempt = progress.classes[classId]?.attempts[exId];
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongChoices, setWrongChoices] = useState<number[]>([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [proofOpen, setProofOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const nextButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (classId && exId) visit(classId, exId);
  }, [classId, exId, visit]);

  useEffect(() => {
    setSelected(null);
    setWrongChoices([]);
    setHintOpen(false);
    setProofOpen(false);
    setSolutionOpen(false);
    setFeedback(null);
  }, [exId]);

  const choices = useMemo(
    () => (db && cls && exercise ? createSeededChoices(exercise, cls, db) : []),
    [db, cls, exercise],
  );

  if (!db || !cls || !exercise) return db ? <Navigate to="/" replace /> : null;
  const effectivelyUnlocked = progress.classes[classId]?.unlocked ||
    cls.prerequisite_classes.every((id) => progress.classes[id]?.completed);
  if (!effectivelyUnlocked) return <Navigate to="/" replace />;

  const ordered = buildAdaptiveOrder(cls.exercises, classId, progress);
  const currentIndex = ordered.findIndex((item) => item.id === exId);
  const previous = ordered[currentIndex - 1];
  const next = ordered[currentIndex + 1];
  const tries = attempt?.tries ?? [];
  const done = attempt?.done ?? false;
  const rules = db.progression_rules.scoring;

  const finishClassIfNeeded = () => {
    const everyOtherDone = cls.exercises.every(
      (item) => item.id === exId || progress.classes[classId]?.attempts[item.id]?.done,
    );
    if (everyOtherDone) completeClass(classId);
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
      setFeedback({ type: 'success', title: 'Corretto!', body: exercise.answer.text ?? 'Ottimo ragionamento.', points: score });
      notify(`⭐ +${score} punti guadagnati`);
      window.setTimeout(() => nextButton.current?.focus(), 50);
    } else {
      setWrongChoices((items) => [...new Set([...items, selected])]);
      setSelected(null);
      if (nextTries.length >= 3) {
        finalize(classId, exId, 0);
        finishClassIfNeeded();
        setFeedback({ type: 'error', title: 'Tentativi terminati', body: 'Osserva la risposta corretta e studia i passaggi della soluzione.' });
        setSolutionOpen(true);
      } else {
        setFeedback({ type: 'error', title: 'Non è corretto', body: `Riprova: ti ${3 - nextTries.length === 1 ? 'rimane' : 'rimangono'} ${3 - nextTries.length} ${3 - nextTries.length === 1 ? 'tentativo' : 'tentativi'}.` });
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
    setFeedback({ type: 'info', title: 'Soluzione mostrata', body: 'Studia i passaggi: potrai ripetere l’esercizio quando vuoi.' });
  };

  const toggleProof = (_event: React.SyntheticEvent, expanded: boolean) => {
    setProofOpen(expanded);
    if (expanded && done && !attempt?.proofViewed) {
      markProof(classId, exId, rules.viewed_proof_bonus);
      notify(`📐 +${rules.viewed_proof_bonus} punto per la dimostrazione`);
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
        <Typography variant="caption" color="text.secondary">ESERCIZIO {currentIndex + 1} / {ordered.length}</Typography>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1} mb={2}>
        <Box><Typography variant="h4" color="primary.main" mb={.7}>Esercizio</Typography><Typography variant="h2" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>{exercise.title}</Typography></Box>
        <Stack direction="row" spacing={1}><DifficultyChip level={exercise.difficulty} />{exercise.tags.slice(0, 2).map((tag) => <Chip key={tag} size="small" label={tag} variant="outlined" />)}</Stack>
      </Stack>

      <Paper elevation={0} sx={{ bgcolor: 'custom.ink', color: '#F2F5FA', borderRadius: 2, p: { xs: 2.5, sm: 4 }, mb: 3, overflow: 'hidden' }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 2 }}>Problema</Typography>
        <Typography id="problem-title" component="div" sx={{ fontSize: '1.15rem', lineHeight: 1.85 }}><MathText text={exercise.problem.text} /></Typography>
        {exercise.problem.hint && (
          <Box mt={3} pt={2.5} sx={{ borderTop: '1px solid rgba(255,255,255,.13)' }}>
            <Button color="inherit" startIcon={<LightbulbOutlinedIcon sx={{ color: '#F0C95A' }} />} onClick={() => setHintOpen((value) => !value)} aria-expanded={hintOpen}>
              {hintOpen ? 'Nascondi suggerimento' : 'Mostra suggerimento'}
            </Button>
            <Collapse in={hintOpen}>
              <Box sx={{ mt: 1.5, pl: 2, borderLeft: '2px solid #F0C95A', color: '#CCD4E1' }}><MathText text={exercise.problem.hint} /></Box>
            </Collapse>
          </Box>
        )}
      </Paper>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1} mb={2}>
        <Typography variant="h3" sx={{ fontSize: '1.35rem' }}>Scegli la risposta corretta</Typography>
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
          <Button variant="contained" size="large" disabled={selected === null} onClick={confirmAnswer} sx={{ flex: 1 }}>Conferma risposta</Button>
        ) : (
          <Button ref={nextButton} variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />} onClick={goForward} sx={{ flex: 1 }}>Prosegui</Button>
        )}
        <Button variant="outlined" size="large" color="inherit" startIcon={done ? <RefreshRoundedIcon /> : <VisibilityOutlinedIcon />} onClick={done ? retry : showSolution}>
          {done ? 'Riprova esercizio' : 'Mostra soluzione'}
        </Button>
      </Stack>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 3 }} action={feedback.points !== undefined ? <Chip label={`+${feedback.points} pt`} color="success" size="small" /> : undefined}>
          <AlertTitle>{feedback.title}</AlertTitle>{feedback.body}
        </Alert>
      )}

      {exercise.proof_from_limit && (
        <Accordion expanded={proofOpen} onChange={toggleProof} disabled={!done} sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(184,138,29,.45)', bgcolor: 'custom.goldLight', borderRadius: '10px !important', overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} gap={1}>
              <Typography fontWeight={800} sx={{ color: 'custom.gold' }}>📐 Dimostrazione dal limite</Typography>
              <Chip size="small" label={attempt?.proofViewed ? 'bonus ottenuto ✓' : `+${rules.viewed_proof_bonus} pt bonus`} color="warning" variant="outlined" />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
            <Typography variant="h3" mb={2}>{exercise.proof_from_limit.title}</Typography>
            <StepList steps={exercise.proof_from_limit.steps} color="gold" />
            <Box sx={{ mt: 2, p: 2, bgcolor: 'custom.goldLight', borderLeft: '3px solid', borderColor: 'custom.gold' }}><Typography variant="h4" sx={{ color: 'custom.gold', mb: 1 }}>Conclusione</Typography><MathText text={exercise.proof_from_limit.conclusion} /></Box>
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion expanded={solutionOpen} onChange={(_event, expanded) => setSolutionOpen(expanded)} sx={{ mb: 4, border: '1px solid', borderColor: 'rgba(65,88,208,.35)', borderRadius: '10px !important', overflow: 'hidden' }}>
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}><Typography fontWeight={800} color="primary.main">📖 Soluzione passo per passo</Typography></AccordionSummary>
        <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}><StepList steps={exercise.solution_steps} color="primary" /></AccordionDetails>
      </Accordion>

      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button disabled={!previous} startIcon={<ArrowBackRoundedIcon />} onClick={() => previous && navigate(`/class/${classId}/exercise/${previous.id}`)}>Precedente</Button>
        <Typography variant="caption">{currentIndex + 1} DI {ordered.length}</Typography>
        <Button disabled={!next && !done} endIcon={<ArrowForwardRoundedIcon />} onClick={done ? goForward : () => next && navigate(`/class/${classId}/exercise/${next.id}`)}>Successivo</Button>
      </Stack>
    </Box>
  );
}

function AttemptDots({ tries }: { tries: ('correct' | 'wrong')[] }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="caption" color="text.secondary">{Math.max(0, 3 - tries.length)} TENTATIVI RIMASTI</Typography>
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
