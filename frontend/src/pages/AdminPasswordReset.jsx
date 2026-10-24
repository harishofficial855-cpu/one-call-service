import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function AdminPasswordReset() {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requestCode = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/admin/password-reset/request', { email });
      setMessage(data.message);
      setStep('reset');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to request a reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmation) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/admin/password-reset/confirm', {
        email,
        code,
        newPassword,
      });
      setMessage(data.message);
      setStep('complete');
      setCode('');
      setNewPassword('');
      setConfirmation('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to reset the password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-slate-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500/15 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black text-white">Reset admin password</h1>
          <p className="text-slate-400 mt-2">
            {step === 'request' && 'Request a one-time code for the configured admin email.'}
            {step === 'reset' && 'Enter the code from your email and choose a new password.'}
            {step === 'complete' && 'Your password has been updated.'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-5">
          {message && (
            <p role="status" className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl text-sm">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
              {error}
            </p>
          )}

          {step === 'request' && (
            <form onSubmit={requestCode} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-semibold text-slate-300 mb-2">Admin email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="input-field pl-12"
                    required
                    maxLength={254}
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
                {loading ? 'Requesting code...' : 'Send reset code'}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={resetPassword} className="space-y-5">
              <div>
                <label htmlFor="reset-code" className="block text-sm font-semibold text-slate-300 mb-2">Six-digit code</label>
                <input
                  id="reset-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field"
                  required
                  pattern="\d{6}"
                  aria-describedby="reset-code-help"
                />
                <p id="reset-code-help" className="text-xs text-slate-400 mt-2">The code expires after 10 minutes.</p>
              </div>
              <div>
                <label htmlFor="new-admin-password" className="block text-sm font-semibold text-slate-300 mb-2">New password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="new-admin-password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="input-field pl-12"
                    required
                    minLength={12}
                    maxLength={128}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">Use at least 12 characters.</p>
              </div>
              <div>
                <label htmlFor="confirm-admin-password" className="block text-sm font-semibold text-slate-300 mb-2">Confirm new password</label>
                <input
                  id="confirm-admin-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  className="input-field"
                  required
                  minLength={12}
                  maxLength={128}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
                {loading ? 'Updating password...' : 'Update password'}
              </button>
              <button
                type="button"
                onClick={() => { setStep('request'); setMessage(''); setError(''); setCode(''); }}
                className="w-full text-sm text-amber-300 hover:text-amber-200"
              >
                Request another code
              </button>
            </form>
          )}

          {step === 'complete' && (
            <Link to="/admin" className="btn-primary flex items-center justify-center gap-2 w-full py-3">
              <ArrowLeft className="w-4 h-4" />
              Return to admin sign in
            </Link>
          )}

          {step !== 'complete' && (
            <Link to="/admin" className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to admin sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
