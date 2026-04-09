import { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, Star } from 'lucide-react';
import api from '../lib/api';
import { formatDate } from '../lib/utils';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    refreshData();
  }, []);

  async function refreshData() {
    try {
      const [dashboardRes, usersRes, listingsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/listings'),
      ]);
      setDashboard(dashboardRes.data);
      setUsers(usersRes.data);
      setListings(listingsRes.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteUser(id) {
    await api.delete(`/admin/users/${id}`);
    refreshData();
  }

  async function deleteListing(id) {
    await api.delete(`/admin/listings/${id}`);
    refreshData();
  }

  const statCards = dashboard ? [
    { icon: Users, label: 'Users', value: dashboard.stats.users },
    { icon: Package, label: 'Listings', value: dashboard.stats.products },
    { icon: ShoppingCart, label: 'Orders', value: dashboard.stats.orders },
    { icon: Star, label: 'Reviews', value: dashboard.stats.reviews },
  ] : [];

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200 bg-slate-950 px-8 py-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Admin dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold">Moderate users, listings, and campus activity.</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.label} className="rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <item.icon className="text-emerald-500" size={20} />
            <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-950">Manage users</h2>
          <div className="mt-6 space-y-4">
            {users.map((item) => (
              <div key={item._id} className="flex flex-col gap-4 rounded-[24px] border border-slate-100 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.email} • {item.role}</p>
                  <p className="mt-1 text-xs text-slate-400">Joined {formatDate(item.createdAt)}</p>
                </div>
                <button onClick={() => deleteUser(item._id)} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-950">Moderate listings</h2>
          <div className="mt-6 space-y-4">
            {listings.map((item) => (
              <div key={item._id} className="flex flex-col gap-4 rounded-[24px] border border-slate-100 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.seller?.name} • {item.category} • {item.status}</p>
                </div>
                <button onClick={() => deleteListing(item._id)} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
