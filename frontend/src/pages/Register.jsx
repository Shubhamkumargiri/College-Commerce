import { useState } from 'react';
import { ArrowRight, Lock, Mail, MapPin, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    campus: '',
    location: '',
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    payload.append('password', formData.password);
    payload.append('campus', formData.campus);
    payload.append('location', formData.location);

    if (profileImageFile) {
      payload.append('profileImage', profileImageFile);
    }

    const result = await register(payload);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate('/');
  }

  return (
    <div className="mx-auto max-w-xl rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.1)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Join the network</p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-950">Create your student marketplace profile.</h1>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
        <label className="input-shell md:col-span-2">
          <User size={18} className="text-slate-400" />
          <input type="text" className="input-plain" placeholder="Full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </label>
        <label className="input-shell md:col-span-2">
          <Mail size={18} className="text-slate-400" />
          <input type="email" className="input-plain" placeholder="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </label>
        <label className="input-shell">
          <MapPin size={18} className="text-slate-400" />
          <input type="text" className="input-plain" placeholder="Campus" value={formData.campus} onChange={(e) => setFormData({ ...formData, campus: e.target.value })} />
        </label>
        <label className="input-shell">
          <MapPin size={18} className="text-slate-400" />
          <input type="text" className="input-plain" placeholder="Pickup area / hostel" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
        </label>
        <label className="input-shell md:col-span-2">
          <Lock size={18} className="text-slate-400" />
          <input type="password" className="input-plain" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        </label>
        <label className="flex cursor-pointer flex-col gap-2 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 md:col-span-2">
          <span className="font-semibold text-slate-700">Upload profile picture</span>
          <span className="text-xs text-slate-500">PNG, JPG, or WebP works best.</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)} />
        </label>
        <p className="text-xs text-slate-500 md:col-span-2">
          {profileImageFile ? `Selected file: ${profileImageFile.name}` : 'No profile photo selected yet.'}
        </p>
        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 md:col-span-2">{error}</p> : null}
        <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 md:col-span-2">
          Create account
          <ArrowRight size={18} />
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        Already registered? <Link to="/login" className="font-semibold text-emerald-600">Login here</Link>
      </p>
    </div>
  );
}
