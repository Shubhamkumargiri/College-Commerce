import { useEffect, useState } from 'react';
import { Edit3, Package, Star, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { formatCurrency, formatDate } from '../lib/utils';
import ProfileAvatar from '../components/ProfileAvatar';

export default function Profile() {
  const { user, updateProfile, notifications } = useAuth();
  const [formData, setFormData] = useState(user);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setFormData(user);
    setProfileImageFile(null);
    api.get('/orders').then(({ data }) => setOrders(data)).catch(console.error);
    api.get('/products').then(({ data }) => setProducts(data.filter((item) => item.seller?._id === user._id))).catch(console.error);
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', formData.name || '');
    payload.append('campus', formData.campus || '');
    payload.append('location', formData.location || '');
    payload.append('bio', formData.bio || '');

    if (!profileImageFile && formData.profileImage) {
      payload.append('profileImage', formData.profileImage);
    }

    if (profileImageFile) {
      payload.append('profileImage', profileImageFile);
    }

    const result = await updateProfile(payload);
    if (!result.success) {
      alert(result.message);
    }
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[40px] border border-slate-200 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.82))] px-8 py-10 text-white sm:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <ProfileAvatar user={user} size={92} fallbackClassName="bg-gradient-to-br from-emerald-500 to-slate-950 ring-4 ring-white/20" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">Student profile</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">{user.name}</h1>
                <p className="mt-2 text-slate-300">{user.email}</p>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{user.bio}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-slate-950 sm:min-w-[260px]">
              <div className="rounded-[24px] bg-white/90 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Campus</p>
                <p className="mt-2 font-semibold">{user.campus}</p>
              </div>
              <div className="rounded-[24px] bg-white/90 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Location</p>
                <p className="mt-2 font-semibold">{user.location}</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-6">
          <div className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-slate-950">Profile settings</h2>
            <p className="mt-2 text-sm text-slate-500">Update your photo, campus details, and bio.</p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <input className="input-field" placeholder="Name" value={formData?.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <label className="flex cursor-pointer flex-col gap-2 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50">
                <span className="font-semibold text-slate-700">Upload profile picture</span>
                <span className="text-xs text-slate-500">PNG, JPG, or WebP works best.</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)} />
              </label>
              <p className="text-xs text-slate-500">
                {profileImageFile ? `Selected file: ${profileImageFile.name}` : 'No new photo selected yet.'}
              </p>
              <input className="input-field" placeholder="Campus" value={formData?.campus || ''} onChange={(e) => setFormData({ ...formData, campus: e.target.value })} />
              <input className="input-field" placeholder="Location" value={formData?.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              <textarea className="input-field min-h-28 resize-none" placeholder="Bio" value={formData?.bio || ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
                  <Edit3 size={18} />
                  Save profile
                </button>
              </div>
            </form>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Package, label: 'My listings', value: products.length },
              { icon: Wallet, label: 'Orders', value: orders.length },
              { icon: Star, label: 'Notifications', value: notifications.length },
            ].map((item) => (
              <div key={item.label} className="rounded-[30px] border border-slate-200 bg-white/85 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                <item.icon className="text-emerald-500" size={20} />
                <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-semibold text-slate-950">Order history</h2>
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="flex flex-col gap-4 rounded-[24px] border border-slate-100 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{order.product?.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700">{order.status}</span>
                    <span className="font-semibold text-slate-950">{formatCurrency(order.agreedPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
