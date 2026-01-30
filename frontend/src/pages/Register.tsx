import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm } from '../utils/validation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    // Validate form
    const validation = validateRegisterForm(email, password, name);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-sm">
      <h1>Register</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors({ ...fieldErrors, name: undefined });
            }} 
            required 
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{fieldErrors.name}</p>}
        </div>
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
        <button type="submit" disabled={loading} style={{ marginRight: 8 }}>Register</button>
        <Link to="/login">Already have an account? Login</Link>
      </form>
    </div>
  );
}
