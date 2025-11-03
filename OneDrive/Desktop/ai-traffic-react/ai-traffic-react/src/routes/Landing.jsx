import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_TITLE } from '../lib/constants';
import Button from '../components/ui/Button';

export default function Landing() {
  const { auth, login } = useAuth();
  const [email, setEmail] = useState('admin@traffic.ai');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  // If user is already logged in, redirect to dashboard
  if (auth) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-primary-dark">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 h-full w-full bg-login-bg bg-cover bg-center"></div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-primary-dark/80 backdrop-blur-sm"></div>

      {/* Content */}
      <main className="relative z-20 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl shadow-xl md:grid-cols-2">
        {/* Left Side: Intro Text */}
        <div className="hidden flex-col justify-center bg-primary-medium/70 p-12 text-white backdrop-blur-lg md:flex">
          <div className="flex items-center mb-6">
            <i className="ri-camera-lens-line text-accent-violet text-5xl"></i>
            <h1 className="ml-4 font-display text-4xl font-bold">
              {APP_TITLE}
            </h1>
          </div>
          <p className="text-lg text-gray-300">
            Welcome to the future of traffic management. Our AI-powered system
            monitors and detects:
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-gray-300">
            <li>
              <span className="font-semibold text-accent-cyan">
                ANPR & Overspeeding
              </span>
            </li>
            <li>
              <span className="font-semibold text-accent-cyan">
                Red Light Jumps
              </span>
            </li>
            <li>
              <span className="font-semibold text-accent-cyan">
                Helmet & Seatbelt Violations
              </span>
            </li>
            <li>
              <span className="font-semibold text-accent-cyan">
                Wrong Lane Detection
              </span>
            </li>
          </ul>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col justify-center bg-primary-dark/80 p-8 md:p-12">
          <h2 className="mb-6 font-display text-3xl font-bold text-white">
            Admin Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-primary-light bg-primary-medium p-3 text-white
                           placeholder-gray-500 focus:border-accent-violet focus:ring-accent-violet"
                placeholder="admin@traffic.ai"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-primary-light bg-primary-medium p-3 text-white
                           placeholder-gray-500 focus:border-accent-violet focus:ring-accent-violet"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" variant="gradient" className="w-full">
              Sign In
            </Button>
            <p className="text-center text-xs text-gray-500">
              Demo: admin@traffic.ai / admin123
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}