import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './pages/pages.css';
import './pages/specialties.css';
import './pages/insights.css';
import './pages/about.css';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
