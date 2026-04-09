import { Bell, LayoutDashboard, LogOut, MessageSquareText, Plus, Search, ShoppingBag, UserCircle2 } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { classNames } from '../lib/utils';
import ProfileAvatar from './ProfileAvatar';
import api from '../lib/api';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Marketplace' },
  { to: '/chat', label: 'Chat' },
];

const searchSuggestions = [
  'Books',
  'Electronics',
  'Clothing',
  'Furniture',
  'Stationery',
  'Services',
  'Laptop',
  'Phone',
  'Notes',
];

export default function Navbar() {
  const { user, logout, notifications, unreadCount, markNotificationRead, liveNotification, dismissLiveNotification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('keyword') || '');
  }, [location.search]);

  useEffect(() => {
    const query = searchTerm.trim();

    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      return undefined;
    }

    setSearchLoading(true);
    const timer = window.setTimeout(() => {
      api.get(`/products?keyword=${encodeURIComponent(query)}&sort=popular`)
        .then(({ data }) => setSearchResults(data.slice(0, 6)))
        .catch((error) => console.error(error))
        .finally(() => setSearchLoading(false));
    }, 220);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const filteredSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];
    const staticMatches = searchSuggestions.filter((item) => item.toLowerCase().includes(query));
    const productMatches = searchResults.map((item) => item.title);
    return Array.from(new Set([searchTerm.trim(), ...staticMatches, ...productMatches])).slice(0, 6);
  }, [searchResults, searchTerm]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const query = searchTerm.trim();
    setSearchOpen(false);
    navigate(query ? `/products?keyword=${encodeURIComponent(query)}` : '/products');
  }

  return (
    <>
      {liveNotification ? (
        <div className="fixed right-4 top-4 z-[70] w-[min(92vw,24rem)] rounded-[28px] border border-emerald-200 bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <MessageSquareText size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-950">{liveNotification.title || 'New message'}</p>
              <p className="mt-1 text-sm text-slate-600">{liveNotification.message || 'You have a new notification.'}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    if (liveNotification.link) {
                      navigate(liveNotification.link);
                    }
                    dismissLiveNotification();
                  }}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Open
                </button>
                <button
                  onClick={dismissLiveNotification}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-white/30 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[90rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-emerald-200/40">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-none text-slate-950">CommerceHub</p>
            <p className="mt-1 text-xs uppercase tracking-[0.26em] text-slate-500">Campus reuse marketplace</p>
          </div>
        </Link>

        <div className="hidden min-w-0 items-center gap-4 xl:flex">
          <nav className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white/85 p-1 shadow-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative min-w-0 flex-1">
            <form onSubmit={handleSearchSubmit} className="flex min-w-0 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => {
                  window.setTimeout(() => setSearchOpen(false), 120);
                }}
                placeholder="Search products, sellers, or keywords"
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Search
              </button>
            </form>

            {searchOpen && filteredSuggestions.length ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-[24px] border border-slate-200 bg-white p-2 shadow-2xl">
                <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Suggestions</p>
                <div className="grid gap-1">
                  {filteredSuggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearchTerm(item);
                        setSearchOpen(false);
                        navigate(`/products?keyword=${encodeURIComponent(item)}`);
                      }}
                      className="rounded-2xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {searchResults.length === 0 ? (
                  <p className="px-3 pb-1 pt-2 text-xs text-slate-400">No exact product match yet. Search for this term to keep filtering the marketplace.</p>
                ) : null}
              </div>
            ) : searchOpen && searchLoading ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-[24px] border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-2xl">
                Searching products...
              </div>
            ) : searchOpen && searchTerm.trim() ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-[24px] border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-2xl">
                No matching products found.
              </div>
            ) : null}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Link to="/chat" className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex sm:items-center sm:gap-2">
                Chat
              </Link>
              <Link to="/add-listing" className="hidden rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 sm:inline-flex sm:items-center sm:gap-2">
                <Plus size={16} />
                Add Listing
              </Link>
              <div className="group relative">
                <button className="relative rounded-full p-3 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                  <Bell size={20} />
                  {unreadCount > 0 ? (
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
                  ) : null}
                </button>
                <div className="invisible absolute right-0 top-14 w-80 translate-y-2 rounded-3xl border border-slate-200 bg-white p-4 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-950">Notifications</h3>
                    <span className="text-xs text-slate-500">{notifications.length} total</span>
                  </div>
                  <div className="max-h-80 space-y-3 overflow-auto">
                    {notifications.length ? (
                      notifications.slice(0, 6).map((item) => (
                        <button
                          key={item._id}
                          onClick={() => {
                            markNotificationRead(item._id);
                            navigate(item.link || '/');
                          }}
                          className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                        >
                          <p className="font-medium text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                        </button>
                      ))
                    ) : (
                      <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No new notifications yet.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="group relative">
                <button className="flex max-w-[220px] items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-emerald-200 hover:shadow">
                  <ProfileAvatar user={user} size={36} fallbackClassName="bg-gradient-to-br from-slate-950 to-emerald-600" />
                  <div className="hidden min-w-0 flex-1 text-left sm:block">
                    <p className="truncate text-sm font-semibold text-slate-950">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.role}</p>
                  </div>
                </button>
                <div className="invisible absolute right-0 top-14 w-60 translate-y-2 rounded-3xl border border-slate-200 bg-white p-3 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <Link to="/profile" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50">
                    <UserCircle2 size={18} />
                    Profile
                  </Link>
                  {user.role === 'admin' ? (
                    <Link to="/admin" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50">
                      <LayoutDashboard size={18} />
                      Admin dashboard
                    </Link>
                  ) : null}
                  <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-rose-600 transition hover:bg-rose-50">
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                Create account
              </Link>
            </>
          )}
        </div>
        </div>
      </header>
    </>
  );
}
