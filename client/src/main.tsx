import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import ErrorBoundary from './components/ui/ErrorBoundary';
//import ScrollToTop from './components/ScrollToTop';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      
      <App />
    </ErrorBoundary>
  </StrictMode>
);