import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/theme.css';
import { Toaster } from 'react-hot-toast';
import './styles/equalizer.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <>
    <App />
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 1500,
        style: {
          background: 'rgba(30, 30, 30, 0.6)',
          color: '#ffffff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          width: '100%',
          maxWidth: '600px',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#1e1e1e',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#1e1e1e',
          },
        },
      }}
    />
  </>
);
