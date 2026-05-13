import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import loginIllustration from '../assets/login_illustration_1776524155268.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.user?.name || 'Investor');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <div className="auth-container">
      <motion.div
        className="glass-card auth-two-col"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Left — Illustration */}
        <div className="auth-illustration">
          <img
            src={loginIllustration}
            alt="AI Trading"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="animate-pulse-subtle"
          />
        </div>

        {/* Right — Form */}
        <div className="auth-form-side">
          {/* Brand mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{
              background: 'var(--gradient-primary)', padding: '0.4rem',
              borderRadius: 'var(--radius-md)', display: 'flex',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.1rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AITrade</span>
          </div>

          <div className="auth-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.75rem' }}>Welcome back</h1>
            <p>Sign in to your trading dashboard</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              style={{
                background: 'var(--color-sell-bg)', color: 'var(--color-sell)',
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem', fontSize: '0.875rem',
                border: '1px solid rgba(255,82,82,0.2)',
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Google OAuth */}
          <button type="button" onClick={handleGoogleLogin} className="btn-google" style={{ marginBottom: '1.25rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider" style={{ marginBottom: '1.25rem' }}>or sign in with email</div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }} />
                <input
                  type="email" required placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.625rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }} />
                <input
                  type="password" required placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.625rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.25rem' }}>
              {loading ? <Loader className="animate-spin" size={19} /> : <LogIn size={19} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Create account</Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
