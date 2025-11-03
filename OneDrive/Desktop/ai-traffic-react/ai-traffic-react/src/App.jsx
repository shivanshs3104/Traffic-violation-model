import { Routes, Route } from 'react-router-dom';
import Landing from './routes/Landing';
import Dashboard from './routes/Dashboard';
import Violations from './routes/Violations';
import Analysis from './routes/Analysis';
import Reports from './routes/Reports';
import NotFound from './routes/NotFound';
import AppLayout from './layouts/AppLayout';
import GuardedRoute from './layouts/GuardedRoute';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Landing />} />

      {/* Protected Routes inside AppLayout */}
      <Route
        element={
          <GuardedRoute>
            <AppLayout />
          </GuardedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/violations" element={<Violations />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;