import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component protects routes that require authentication
export default function GuardedRoute({ children }) {
  const { auth } = useAuth();

  if (!auth) {
    // If user is not logged in, redirect to the landing/login page
    return <Navigate to="/" replace />;
  }

  // If user is logged in, render the requested page
  return children;
}