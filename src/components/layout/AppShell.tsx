import { type ReactNode } from 'react';
import {
  AppBar,
  Box,
  Chip,
  CssBaseline,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { lessonOneSections, lessonSections, lessonTwoSections, type CourseSection } from '@/data/course';
import { useLessonStore } from '@/store/lessonStore';
import { useProgressStore } from '@/store/progressStore';
import { useUIStore } from '@/store/uiStore';
import { GlobalSnackbar } from '@/components/common/GlobalSnackbar';

const drawerWidth = 286;

function SidebarContent({ close }: { close?: () => void }) {
  const completed = useLessonStore((state) => state.completedSections);
  const location = useLocation();
  const navigate = useNavigate();
  const percent = completed.length / lessonSections.length * 100;
  const go = (path: string) => { navigate(path); close?.(); };

  return (
    <Box sx={{ height: '100%', bgcolor: 'custom.ink', color: '#E7ECF5', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, pb: 2.5 }}>
        <Typography variant="caption" sx={{ color: '#9EABC0', textTransform: 'uppercase', letterSpacing: '.13em' }}>Il tuo percorso</Typography>
        <Stack direction="row" alignItems="baseline" gap={1} mt={1}>
          <Typography sx={{ fontFamily: 'Crimson Pro', fontSize: '2rem', fontWeight: 700 }}>{completed.length}</Typography>
          <Typography variant="body2" sx={{ color: '#9EABC0' }}>di {lessonSections.length} sezioni</Typography>
        </Stack>
        <LinearProgress variant="determinate" value={percent} sx={{ mt: 1, bgcolor: '#2A3854', '& .MuiLinearProgress-bar': { bgcolor: '#7F94F4' } }} />
      </Box>

      <List sx={{ px: 1.25, py: 0, flex: 1, overflowY: 'auto' }}>
        <NavItem title="Panoramica" icon={<HomeRoundedIcon />} active={location.pathname === '/'} onClick={() => go('/')} />
        <NavGroup label="Lezione 1" sections={lessonOneSections} completed={completed} pathname={location.pathname} onOpen={go} />
        <NavGroup label="Lezione 2" sections={lessonTwoSections} completed={completed} pathname={location.pathname} onOpen={go} />
        <Typography variant="caption" sx={{ px: 1.5, pt: 2, pb: .75, display: 'block', color: '#7F8BA1', textTransform: 'uppercase', letterSpacing: '.12em' }}>Materiali</Typography>
        <NavItem title="Scheda esercizi §1" icon={<AssignmentOutlinedIcon />} active={location.pathname === '/scheda/1'} onClick={() => go('/scheda/1')} />
        <NavItem title="Scheda esercizi §2" icon={<AssignmentOutlinedIcon />} active={location.pathname === '/scheda/2'} onClick={() => go('/scheda/2')} />
        <NavItem title="Verifica finale" icon={<QuizOutlinedIcon />} active={location.pathname === '/verifica'} onClick={() => go('/verifica')} />
        <NavItem title="Esercizi adattivi" icon={<RouteRoundedIcon />} active={location.pathname === '/esercizi' || location.pathname.startsWith('/class/')} onClick={() => go('/esercizi')} />
      </List>
      <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,.1)' }}><Typography variant="caption" sx={{ color: '#9EABC0' }}>2 LEZIONI · 4 ORE + APPENDICE · {Math.round(percent)}%</Typography></Box>
    </Box>
  );
}

function NavGroup({ label, sections, completed, pathname, onOpen }: { label: string; sections: CourseSection[]; completed: string[]; pathname: string; onOpen: (path: string) => void }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ px: 1.5, pt: 2, pb: .75, display: 'block', color: '#7F8BA1', textTransform: 'uppercase', letterSpacing: '.12em' }}>{label}</Typography>
      {sections.map((section, index) => {
        const done = completed.includes(section.id);
        const active = pathname === section.path;
        return (
          <ListItemButton key={section.id} selected={active} onClick={() => onOpen(section.path)} sx={{ mb: .25, borderRadius: 1.25, minHeight: 42, color: 'inherit', '&.Mui-selected': { bgcolor: 'rgba(127,148,244,.17)', '&:hover': { bgcolor: 'rgba(127,148,244,.22)' } }, '&:hover': { bgcolor: 'rgba(255,255,255,.06)' } }}>
            <ListItemIcon sx={{ minWidth: 34, color: done ? '#55C59A' : '#9EABC0' }}>{done ? <CheckCircleRoundedIcon sx={{ fontSize: 17 }} /> : <Box sx={{ width: 20, height: 20, border: '1px solid rgba(255,255,255,.2)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '.62rem' }}>{index + 1}</Box>}</ListItemIcon>
            <ListItemText primary={<Typography noWrap sx={{ fontSize: '.78rem', fontWeight: active ? 700 : 500 }}>{section.shortTitle}</Typography>} />
          </ListItemButton>
        );
      })}
    </Box>
  );
}

function NavItem({ title, icon, active, onClick }: { title: string; icon: ReactNode; active: boolean; onClick: () => void }) {
  return (
    <ListItemButton selected={active} onClick={onClick} sx={{ mb: .25, borderRadius: 1.25, minHeight: 42, color: 'inherit', '&.Mui-selected': { bgcolor: 'rgba(127,148,244,.17)' }, '&:hover': { bgcolor: 'rgba(255,255,255,.06)' } }}>
      <ListItemIcon sx={{ minWidth: 34, color: '#9EABC0', '& svg': { fontSize: 18 } }}>{icon}</ListItemIcon>
      <ListItemText primary={<Typography noWrap sx={{ fontSize: '.78rem', fontWeight: active ? 700 : 500 }}>{title}</Typography>} />
    </ListItemButton>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('lg'));
  const completed = useLessonStore((state) => state.completedSections);
  const points = useProgressStore((state) => state.progress.totalPoints);
  const drawerOpen = useUIStore((state) => state.sidebarOpen);
  const setDrawerOpen = useUIStore((state) => state.setSidebarOpen);
  const globalProgress = completed.length / lessonSections.length * 100;

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <CssBaseline />
      <Box component="a" href="#main-content" sx={{ position: 'fixed', left: 12, top: -80, zIndex: 2000, bgcolor: 'background.paper', p: 1, '&:focus': { top: 8 } }}>Vai al contenuto</Box>
      <AppBar className="app-chrome" position="fixed" elevation={0} color="inherit" sx={{ zIndex: theme.zIndex.drawer + 1, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: 1.5, sm: 3 } }}>
          {!desktop && <IconButton aria-label="Apri il percorso" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}><MenuRoundedIcon /></IconButton>}
          <Stack component={Link} to="/" direction="row" alignItems="center" spacing={1.2} sx={{ textDecoration: 'none', color: 'inherit', minWidth: { sm: 240 } }}>
            <Box sx={{ width: 35, height: 35, bgcolor: 'custom.ink', color: 'white', borderRadius: 1, display: 'grid', placeItems: 'center', fontFamily: 'Crimson Pro', fontSize: '1.35rem', fontStyle: 'italic' }}>f′</Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}><Typography sx={{ fontFamily: 'Crimson Pro', fontWeight: 700, fontSize: '1.15rem', lineHeight: 1 }}>Derivate</Typography><Typography variant="caption" color="text.secondary">dal limite alla padronanza</Typography></Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ ml: 'auto' }}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, width: 180 }}><Stack direction="row" justifyContent="space-between" mb={.5}><Typography variant="caption" color="text.secondary">LEZIONI</Typography><Typography variant="caption">{Math.round(globalProgress)}%</Typography></Stack><LinearProgress aria-label="Progresso lezioni" variant="determinate" value={globalProgress} /></Box>
            <Chip label={`★ ${points} pt`} variant="outlined" sx={{ borderColor: 'custom.gold', color: 'custom.gold', bgcolor: 'custom.goldLight' }} />
            <Tooltip title="Impostazioni"><IconButton component={Link} to="/settings" aria-label="Impostazioni"><SettingsOutlinedIcon /></IconButton></Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer className="app-chrome" variant={desktop ? 'permanent' : 'temporary'} open={desktop || drawerOpen} onClose={() => setDrawerOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: drawerWidth, top: desktop ? 64 : 0, height: desktop ? 'calc(100% - 64px)' : '100%', border: 0 } }}><SidebarContent close={desktop ? undefined : () => setDrawerOpen(false)} /></Drawer>
      <Box component="main" id="main-content" sx={{ ml: { lg: `${drawerWidth}px` }, pt: '64px', minHeight: '100vh' }}><Box sx={{ width: '100%', maxWidth: 1180, mx: 'auto', px: { xs: 2, sm: 4, lg: 5 }, py: { xs: 3, sm: 5, lg: 6 }, pb: 10 }}>{children}</Box></Box>
      <GlobalSnackbar />
    </Box>
  );
}
