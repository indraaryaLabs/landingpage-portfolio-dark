import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../AuthContext';
import '../admin.css';

export default function LoginPage() {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (signInError) {
      setError(signInError.message || 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  }

  return <div className="admin-login-page"><div className="admin-login-card">
    <div className="admin-login-mark">IA <span>PORTFOLIO STUDIO</span></div>
    <p className="admin-eyebrow">PRIVATE EDITOR</p>
    <h1>Welcome back.</h1>
    <p className="login-subtitle">Sign in to update your landing page, project images, and contact details.</p>
    {error && <p className="login-error" role="alert">{error}</p>}
    <form onSubmit={handleSubmit} className="admin-login-form">
      <div className="admin-field"><label className="admin-label" htmlFor="cms-email">Email</label><input id="cms-email" className="admin-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required autoFocus /></div>
      <div className="admin-field"><label className="admin-label" htmlFor="cms-password">Password</label><div className="admin-password-field"><input id="cms-password" className="admin-input" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
      <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in to editor →'}</button>
    </form>
    <p className="admin-login-foot">Only the authorized portfolio owner can publish changes.</p>
  </div></div>;
}
