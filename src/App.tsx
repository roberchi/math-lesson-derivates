import { lazy, Suspense, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useClassUnlocker } from '@/hooks/useLearningProgress';
import { useDBStore } from '@/store/dbStore';
import { useUIStore } from '@/store/uiStore';

const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const OverviewPage = lazy(() => import('@/pages/OverviewPage').then((module) => ({ default: module.OverviewPage })));
const LessonOnePage = lazy(() => import('@/pages/LessonOnePage').then((module) => ({ default: module.LessonOnePage })));
const LessonTwoPage = lazy(() => import('@/pages/LessonTwoPage').then((module) => ({ default: module.LessonTwoPage })));
const WorksheetPage = lazy(() => import('@/pages/WorksheetPage').then((module) => ({ default: module.WorksheetPage })));
const VerificationPage = lazy(() => import('@/pages/VerificationPage').then((module) => ({ default: module.VerificationPage })));
const ClassPage = lazy(() => import('@/pages/ClassPage').then((module) => ({ default: module.ClassPage })));
const ExercisePage = lazy(() => import('@/pages/ExercisePage').then((module) => ({ default: module.ExercisePage })));
const ResultsPage = lazy(() => import('@/pages/ResultsPage').then((module) => ({ default: module.ResultsPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const ConclusionPage = lazy(() => import('@/pages/ConclusionPage').then((module) => ({ default: module.ConclusionPage })));
const GlossaryPage = lazy(() => import('@/pages/GlossaryPage').then((module) => ({ default: module.GlossaryPage })));

export default function App() {
  const loadDB = useDBStore((state) => state.loadDB);
  const notify = useUIStore((state) => state.showSnackbar);
  useClassUnlocker();
  useEffect(() => { void loadDB(); }, [loadDB]);
  useEffect(() => {
    const key = 'derivate_progress_v4_notice';
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, 'shown');
      notify('Nuovo modello di padronanza: il progresso degli esercizi riparte da zero.', 'info');
    }
  }, [notify]);

  return (
    <AppShell>
      <ScrollToTop />
      <Suspense fallback={<Box sx={{ minHeight: 360, display: 'grid', placeItems: 'center' }}><CircularProgress aria-label="Caricamento pagina" /></Box>}>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/lezione-1/:sectionId" element={<LessonOnePage />} />
          <Route path="/lezione-2/:sectionId" element={<LessonTwoPage />} />
          <Route path="/scheda/:sheetId" element={<WorksheetPage />} />
          <Route path="/verifica" element={<VerificationPage />} />
          <Route path="/esercizi" element={<DashboardPage />} />
          <Route path="/class/:classId" element={<ClassPage />} />
          <Route path="/class/:classId/exercise/:exId" element={<ExercisePage />} />
          <Route path="/class/:classId/results" element={<ResultsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/conclusione" element={<ConclusionPage />} />
          <Route path="/glossario" element={<GlossaryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.getElementById('main-content')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, search, hash]);

  return null;
}
