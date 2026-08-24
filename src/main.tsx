import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import App from './App';
import { AppThemeProvider } from '@/theme/ThemeContext';
import '@/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>,
);
