import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

console.log('main.tsx: Starting application...');

const rootElement = document.getElementById('root');
console.log('main.tsx: Root element found:', !!rootElement);

if (!rootElement) {
  console.error('main.tsx: Root element not found!');
} else {
  try {
    const root = createRoot(rootElement);
    console.log('main.tsx: React root created successfully');
    
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );
    console.log('main.tsx: App rendered successfully');
  } catch (error) {
    console.error('main.tsx: Error rendering app:', error);
  }
}
