import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, LayoutGrid, Menu, MoreHorizontal, Search, UserCircle,
  ClipboardList, Bell, LogOut, X, Briefcase, Settings, MapPin,
} from 'lucide-react';
import api from '../services/api';
import { useAuthStore, useNotificationStore } from '../store';

const navLinks = [
  ['/services', 'Services'],
  ['/offers', 'Offers'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

function DashboardLink({ user }) {
  if (!user) return '/login';
  if (user.role === 'admin') return '/admin/dashboard';
  if (user.role === 'provider') return '/provider/dashboard';
  return '/dashboard';
}

function MobileNavigation({ user, unreadCount }) {
  const bookingsPath = user?.role === 'admin'
    ? '/admin/dashboard'
    : user?.role === 'provider'
      ? '/provider/dashboard'
      : '/my-bookings';
  const items = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/services', label: 'Services', icon: LayoutGrid },
    { to: bookingsPath, label: 'Bookings', icon: ClipboardList },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/offers', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-2 shadow-[0_-6px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className={({ isActive }) => `flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition ${isActive ? 'text-blue-700' : 'text-slate-500 hover:text-blue-700'}`}
          >
            <span className="relative">
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label === 'Notifications' && unreadCount > 0 && <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
      {!user && <span className="sr-only">Sign in to view bookings and notifications.</span>}
    </nav>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { user, logout } = useAuthStore();
  const { unreadCount, setUnreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dashboardPath = DashboardLink({ user });
  const locationLabel = [user?.address?.area, user?.address?.city].filter(Boolean).join(', ');

  React.useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return undefined;
    }
    let active = true;
    api.get('/notifications/unread-count')
      .then(({ data }) => {
        if (active) setUnreadCount(data.unreadCount || 0);
      })
      .catch((error) => {
        console.error('Could not load unread notification count.', error);
      });
    return () => { active = false; };
  }, [user, pathname, setUnreadCount]);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/services?search=${encodeURIComponent(query)}` : '/services');
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur">
        <div className="container-custom">
          <div className="flex h-[4.5rem] items-center justify-between gap-4">
            <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="One Call Service home">
              <img src="/logo.png" alt="" className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200" />
              <span className="leading-tight">
                <span className="block text-base font-extrabold tracking-tight text-blue-950">ONE CALL</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-600">Home Services</span>
              </span>
            </Link>

            <Link to="/services" className="hidden min-w-[125px] items-center gap-2 rounded-xl px-2 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-800 lg:flex">
              <MapPin className="h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
              <span className="min-w-0 leading-tight">
                <span className="block text-[10px] text-slate-500">Your location</span>
                <span className="block max-w-32 truncate text-xs font-bold">{locationLabel || 'Choose location'}</span>
              </span>
            </Link>

            <form onSubmit={submitSearch} className="hidden max-w-xl flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 md:flex">
              <Search className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <label className="sr-only" htmlFor="header-service-search">Search services</label>
              <input
                id="header-service-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for a service"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button type="submit" className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-800">Search</button>
            </form>

            <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
              {navLinks.map(([path, label]) => (
                <NavLink key={path} to={path} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-800'}`}>
                  {label}
                </NavLink>
              ))}
              <Link to="/register-provider" className="ml-1 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800">
                Join as provider
              </Link>
            </nav>

            <div className="hidden shrink-0 items-center gap-3 md:flex">
              {user && (
                <Link
                  to="/notifications"
                  aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                  className="relative rounded-xl p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  <Bell className="h-5 w-5" aria-hidden="true" />
                  {unreadCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                </Link>
              )}
              {!user ? (
                <>
                  <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-800">Sign in</Link>
                  <Link to="/register" className="rounded-xl border border-blue-700 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50">Get started</Link>
                </>
              ) : (
                <>
                  <Link to={dashboardPath} aria-label="Open your account" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-blue-100 bg-blue-50 text-blue-700 transition hover:ring-2 hover:ring-blue-200">
                    {user.profilePhoto
                      ? <img src={user.profilePhoto} alt="" className="h-full w-full object-cover" />
                      : <UserCircle className="h-5 w-5" aria-hidden="true" />}
                  </Link>
                  <button type="button" onClick={handleLogout} aria-label="Sign out" className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600">
                    <LogOut className="h-5 w-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <Link to={user ? dashboardPath : '/login'} aria-label={user ? 'Open your account' : 'Sign in'} className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 md:hidden">
              {user?.profilePhoto ? <img src={user.profilePhoto} alt="" className="h-full w-full rounded-full object-cover" /> : <UserCircle className="h-5 w-5" aria-hidden="true" />}
            </Link>
            <button type="button" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <form onSubmit={submitSearch} className="flex items-center gap-2 pb-3 md:hidden">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
              <span className="sr-only">Search services</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for a service" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-400" />
            </label>
            <button type="submit" aria-label="Search" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white hover:bg-blue-800"><Search className="h-4 w-4" /></button>
          </form>

          {mobileOpen && (
            <div className="border-t border-slate-100 py-3 lg:hidden">
              <div className="grid gap-1">
                {navLinks.map(([path, label]) => (
                  <Link key={path} to={path} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800">{label}</Link>
                ))}
                <Link to="/register-provider" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">Register as a provider</Link>
                {user ? (
                  <>
                    <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50">
                      {user.role === 'admin' ? <Settings className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />} Account dashboard
                    </Link>
                    <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Sign out</button>
                  </>
                ) : (
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">Create an account</Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      <MobileNavigation user={user} unreadCount={unreadCount} />
    </>
  );
}
