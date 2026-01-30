import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../services/authApi';
import { validateEmail, validatePassword } from '../utils/validation';

type Step = 'email' | 'otp' | 'reset-password' | 'success';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; otp?: string; newPassword?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();

  // Step 1: Request OTP
  async function handleRequestOTP(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setFieldErrors({ email: emailValidation.error });
      return;
    }

    setLoading(true);
    try {
      await authApi.requestPasswordReset(email);
      setStep('otp');
      setResendCountdown(60);
      const countdown = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP
  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!otp.trim()) {
      setFieldErrors({ otp: 'OTP is required' });
      return;
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setFieldErrors({ otp: 'OTP must be 6 digits' });
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyOTP(email, otp);
      setStep('reset-password');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // Step 3: Reset Password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors: { newPassword?: string; confirmPassword?: string } = {};

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      errors.newPassword = passwordValidation.error;
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(email, otp, newPassword);
      setStep('success');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleResendOTP() {
    setLoading(true);
    authApi.requestPasswordReset(email)
      .then(() => {
        setError('');
        setResendCountdown(60);
        const countdown = setInterval(() => {
          setResendCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="container-sm">
      <h1>Forgot Password</h1>

      {error && <p className="error-message">{error}</p>}

      {step === 'email' && (
        <form onSubmit={handleRequestOTP}>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Enter your email address and we'll send you an OTP to reset your password
          </p>
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
          <button type="submit" disabled={loading} style={{ marginRight: 8 }}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
          <Link to="/login">Back to Login</Link>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP}>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            We've sent a 6-digit OTP to <strong>{email}</strong>
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <label>One-Time Password (OTP)</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                setFieldErrors({ ...fieldErrors, otp: undefined });
              }}
              placeholder="000000"
              maxLength={6}
              required
              aria-invalid={!!fieldErrors.otp}
            />
            {fieldErrors.otp && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{fieldErrors.otp}</p>}
          </div>
          <button type="submit" disabled={loading} style={{ marginRight: 8 }}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            type="button"
            disabled={resendCountdown > 0 || loading}
            onClick={handleResendOTP}
            style={{ marginRight: 8, opacity: resendCountdown > 0 ? 0.5 : 1 }}
          >
            {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend OTP'}
          </button>
          <Link to="/login">Back to Login</Link>
        </form>
      )}

      {step === 'reset-password' && (
        <form onSubmit={handleResetPassword}>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Enter your new password
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setFieldErrors({ ...fieldErrors, newPassword: undefined });
              }}
              required
              aria-invalid={!!fieldErrors.newPassword}
            />
            {fieldErrors.newPassword && (
              <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{fieldErrors.newPassword}</p>
            )}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
              }}
              required
              aria-invalid={!!fieldErrors.confirmPassword}
            />
            {fieldErrors.confirmPassword && (
              <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{fieldErrors.confirmPassword}</p>
            )}
          </div>
          <button type="submit" disabled={loading} style={{ marginRight: 8 }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {step === 'success' && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</p>
          <h2>Password Reset Successful!</h2>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            Your password has been reset successfully. You can now login with your new password.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}
