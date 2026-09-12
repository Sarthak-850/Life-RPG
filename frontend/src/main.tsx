import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { AuthProvider } from './context/AuthContext.js';
import { SoundProvider } from './context/SoundContext.js';
import { ToastProvider } from './context/ToastContext.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SoundProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SoundProvider>
    </AuthProvider>
  </React.StrictMode>
);
