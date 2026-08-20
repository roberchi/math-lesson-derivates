import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      ink: string;
      paper: string;
      paper2: string;
      rule: string;
      gold: string;
      goldLight: string;
      purple: string;
      purpleLight: string;
    };
  }
  interface PaletteOptions {
    custom?: Partial<Palette['custom']>;
  }
}

type Mode = 'light' | 'dark';
const ModeContext = createContext<{ mode: Mode; toggleMode: () => void }>({
  mode: 'light',
  toggleMode: () => undefined,
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem('derivate_color_mode');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const theme = useMemo(() => {
    const dark = mode === 'dark';
    return createTheme({
      palette: {
        mode,
        primary: { main: '#4158D0', light: '#EEF0FF', dark: '#2D3A96' },
        secondary: { main: '#13795B', light: '#E6F5F0', dark: '#0F6149' },
        error: { main: '#B42318', light: '#FDECEA' },
        warning: { main: '#B65C14', light: '#FFF2E4' },
        success: { main: '#13795B', light: '#E6F5F0' },
        background: dark
          ? { default: '#10141D', paper: '#181D29' }
          : { default: '#F8F6F1', paper: '#FFFFFF' },
        text: dark
          ? { primary: '#F0F2F7', secondary: '#A8B0C0' }
          : { primary: '#172033', secondary: '#596174' },
        divider: dark ? '#2A3140' : '#DEDAD0',
        custom: {
          ink: dark ? '#0A0E15' : '#17243F',
          paper: dark ? '#10141D' : '#F8F6F1',
          paper2: dark ? '#151A25' : '#EFECE4',
          rule: dark ? '#2A3140' : '#DEDAD0',
          gold: '#B88A1D',
          goldLight: dark ? '#292412' : '#FBF5DF',
          purple: '#7448C8',
          purpleLight: dark ? '#241B38' : '#F2EDFC',
        },
      },
      typography: {
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        h1: { fontFamily: '"Crimson Pro", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', lineHeight: 0.98 },
        h2: { fontFamily: '"Crimson Pro", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08 },
        h3: { fontFamily: '"Crimson Pro", Georgia, serif', fontWeight: 650, fontSize: '1.7rem', lineHeight: 1.15 },
        h4: { fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.14em' },
        h5: { fontFamily: '"Crimson Pro", Georgia, serif', fontWeight: 700, fontSize: '1.35rem' },
        body1: { fontSize: '1rem', lineHeight: 1.7 },
        body2: { fontSize: '0.875rem', lineHeight: 1.65 },
        caption: { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.02em' },
        button: { fontWeight: 700, textTransform: 'none' },
      },
      shape: { borderRadius: 10 },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: { backgroundImage: dark ? 'none' : 'radial-gradient(circle at 80% 0%, rgba(65,88,208,.06), transparent 28%)' },
            '::selection': { background: alpha('#4158D0', 0.22) },
            '.katex': { fontSize: '1.08em' },
            '@media print': {
              '.app-chrome, .no-print, .digital-workspace': { display: 'none !important' },
              '.print-writing-space': { display: 'block !important' },
              '#main-content': { marginLeft: '0 !important', paddingTop: '0 !important' },
              '.print-document': { maxWidth: 'none !important' },
              body: { background: '#fff !important', color: '#111 !important' },
              '@page': { size: 'A4', margin: '14mm' },
            },
          },
        },
        MuiButton: { styleOverrides: { root: { borderRadius: 8, minHeight: 42 } } },
        MuiCard: { styleOverrides: { root: { boxShadow: 'none' } } },
        MuiChip: { styleOverrides: { root: { borderRadius: 5, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '.04em' } } },
        MuiLinearProgress: { styleOverrides: { root: { height: 5, borderRadius: 5 } } },
        MuiAccordion: { styleOverrides: { root: { boxShadow: 'none', '&:before': { display: 'none' } } } },
      },
    });
  }, [mode]);

  const toggleMode = () => {
    setMode((current) => {
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('derivate_color_mode', next);
      return next;
    });
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ModeContext.Provider>
  );
}

export const useColorMode = () => useContext(ModeContext);
