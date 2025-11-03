import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

export const AUTH_STORAGE_KEY = 'ai-traffic-auth';
const DEMO_USER = 'admin@traffic.ai';
const DEMO_PASS = 'admin123';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useLocalStorage(AUTH_STORAGE_KEY, null);
  const navigate = useNavigate();

  const login = (email, password) => {
    // Simulate API call and validation
    if (email === DEMO_USER && password === DEMO_PASS) {
      const authData = {
        email: email,
        token: 'dummy-jwt-token-12345',
        ts: new Date().getTime(),
      };
      setAuth(authData);
      navigate('/dashboard');
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const logout = () => {
    setAuth(null);
    navigate('/');
  };

  const value = {
    auth,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};