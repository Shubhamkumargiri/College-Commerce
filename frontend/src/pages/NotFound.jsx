import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="rounded-[36px] border border-slate-200 bg-white/90 p-12 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">404</p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-950">This page wandered off campus.</h1>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
        Back home
      </Link>
    </div>
  );
}
