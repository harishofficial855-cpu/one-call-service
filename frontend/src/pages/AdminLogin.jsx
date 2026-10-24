import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/admin/login', { email, password });
      login(data.user, data.token);
      navigate('/admin', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in. Please try again.');
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
          <h1 className="text-3xl font-black text-white">Admin sign in</h1>
          <p className="text-slate-400 mt-2">Authorized administrators only</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
          {error && (
            <p role="alert" className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="admin-email" className="block text-sm font-semibold text-slate-300 mb-2">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input id="admin-email" type="email" autoComplete="username" value={email}
                onChange={(event) => setEmail(event.target.value)} className="input-field pl-12" required />
            </div>
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input id="admin-password" type="password" autoComplete="current-password" value={password}
                onChange={(event) => setPassword(event.target.value)} className="input-field pl-12" required />
            </div>
          </div>
          <div className="text-right">
            <Link
              to="/admin/forgot-password"
              className="text-sm font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-4"
            >
              Forgot Password?
            </Link>
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60">
            <span>{loading ? 'Signing in...' : 'Sign in securely'}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
