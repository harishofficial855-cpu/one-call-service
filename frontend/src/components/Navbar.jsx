import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Menu, X, LogOut, LayoutDashboard, Briefcase, Settings } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink =
    user?.role === 'admin' ? '/admin/dashboard' :
    user?.role === 'provider' ? '/provider/dashboard' : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/20 shadow-xl shadow-black/20">
      <div className="container-custom">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="https://static.vecteezy.com/system/resources/previews/004/697/926/original/modern-and-professional-call-center-logo-design-free-vector.jpg"
              alt="One Call Service"
              className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all"
            />
            <div>
              <span className="text-xl font-black text-white tracking-tight">ONE CALL</span>
              <p className="text-xs text-amber-400 font-semibold tracking-widest uppercase">Premium Services</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {['/', '/services', '/offers', '/about', '/contact'].map((path, i) => {
              const labels = ['Home', 'Services', 'Offers', 'About', 'Contact'];
              return (
                <Link key={path} to={path}
                  className="px-4 py-2 text-slate-300 hover:text-amber-400 font-medium transition-colors rounded-lg hover:bg-amber-500/10 text-sm">
                  {labels[i]}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center space-x-3">
            {!user ? (
              <>
                <Link to="/login" className="px-4 py-2 text-slate-300 hover:text-amber-400 font-semibold transition-colors text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {user.role === 'customer' && (
                  <Link to="/booking" className="btn-primary text-sm py-2">
                    Book Now
                  </Link>
                )}
                <Link to={dashboardLink}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition-all">
                  <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-semibold">{user.name?.split(' ')[0]}</span>
                  {user.role === 'admin' && <Settings className="w-4 h-4 text-amber-400" />}
                  {user.role === 'provider' && <Briefcase className="w-4 h-4 text-amber-400" />}
                  {user.role === 'customer' && <LayoutDashboard className="w-4 h-4 text-amber-400" />}
                </Link>
                <button onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-700 py-4 space-y-1">
            {[['/', 'Home'], ['/services', 'Services'], ['/offers', 'Offers'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg font-medium transition-colors">
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-700 space-y-2">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-amber-400 font-semibold">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block mx-4 btn-primary text-center">Get Started</Link>
                </>
              ) : (
                <>
                  {user.role === 'customer' && <Link to="/booking" onClick={() => setMobileOpen(false)} className="block mx-4 btn-primary text-center">Book Now</Link>}
                  <Link to={dashboardLink} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-amber-400 font-semibold">Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-400 font-semibold">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
