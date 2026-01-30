/**
 * User and admin login page.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    // Validate form
    const validation = validateLoginForm(email, password);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-sm">
      <h1>Login</h1>
      <p>Sign in as user or admin (admin@example.com / admin123)</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors({ ...fieldErrors, email: undefined });
            }} 
            required 
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{fieldErrors.email}</p>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors({ ...fieldErrors, password: undefined });
            }} 
            required 
            aria-invalid={!!fieldErrors.password}
          />
          {fieldErrors.password && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{fieldErrors.password}</p>}
        </div>
        <button type="submit" disabled={loading} style={{ marginRight: 8 }}>{loading ? 'Signing in...' : 'Sign in'}</button>
        <Link to="/register">Register</Link>
      </form>
    </div>
  );
}
