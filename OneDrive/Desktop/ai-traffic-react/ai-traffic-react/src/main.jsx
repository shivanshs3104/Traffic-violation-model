import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/globals.css';
import 'remixicon/fonts/remixicon.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { ViolationsProvider } from './context/ViolationsContext.jsx';
import './lib/charts.js'; // IMPORTANT: Register Chart.js components

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ViolationsProvider>
          <App />
        </ViolationsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);