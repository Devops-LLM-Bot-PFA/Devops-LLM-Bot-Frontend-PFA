
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';
import './index.css';

// Create the root first to ensure React is properly initialized
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Then render the app
root.render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
