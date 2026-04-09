import { useState } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await login(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(location.state?.from || '/');
  }

  return (
    <div className="mx-auto max-w-md rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.1)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Welcome back</p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-950">Login to continue buying and selling.</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="input-shell">
          <Mail size={18} className="text-slate-400" />
          <input type="email" className="input-plain" placeholder="College email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </label>
        <label className="input-shell">
          <Lock size={18} className="text-slate-400" />
          <input type="password" className="input-plain" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        </label>
        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
        <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
          Login
          <ArrowRight size={18} />
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        No account yet? <Link to="/register" className="font-semibold text-emerald-600">Create one</Link>
      </p>
    </div>
  );
}
