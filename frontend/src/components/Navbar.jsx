import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Menu, X, LogOut, LayoutDashboard, Briefcase, Settings } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const dashboardLink =
    user?.role === 'admin' ? '/admin/dashboard' :
    user?.role === 'provider' ? '/provider/dashboard' : '/dashboard';

  const navLinks = [
    ['/', 'Home'], ['/services', 'Services'],
    ['/offers', 'Offers'], ['/about', 'About'], ['/contact', 'Contact'],
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#faf8f3] border-b border-[#e8e0cc] shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="https://static.vecteezy.com/system/resources/previews/004/697/926/original/modern-and-professional-call-center-logo-design-free-vector.jpg"
              alt="One Call Service"
              className="h-11 w-11 rounded-xl object-cover shadow-sm border border-[#e8e0cc]"
            />
            <div>
              <span className="text-lg font-black text-amber-700 tracking-tight">ONE CALL</span>
              <p className="text-xs text-amber-500 font-semibold tracking-widest uppercase">Premium Services</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(([path, label]) => (
              <Link key={path} to={path}
                className="px-4 py-2 text-[#5c4a2a] hover:text-amber-700 font-medium transition-colors rounded-lg hover:bg-amber-50 text-sm">
                {label}
              </Link>
            ))}
            <Link to="/register-provider"
              className="ml-2 px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-all shadow-sm">
              🔧 Register Service
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {!user ? (
              <>
                <Link to="/login" className="px-4 py-2 text-[#5c4a2a] hover:text-amber-700 font-semibold text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to={dashboardLink}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 hover:border-amber-400 transition-all">
                  <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-xs font-black text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[#2c2416] text-sm font-semibold">{user.name?.split(' ')[0]}</span>
                  {user.role === 'admin' && <Settings className="w-4 h-4 text-amber-500" />}
                  {user.role === 'provider' && <Briefcase className="w-4 h-4 text-amber-500" />}
                  {user.role === 'customer' && <LayoutDashboard className="w-4 h-4 text-amber-500" />}
                </Link>
                <button onClick={handleLogout}
                  className="p-2 text-[#b8a98a] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 text-amber-700" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[#e8e0cc] py-4 space-y-1 bg-[#faf8f3]">
            {navLinks.map(([path, label]) => (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-[#5c4a2a] hover:text-amber-700 hover:bg-amber-50 rounded-lg font-medium">
                {label}
              </Link>
            ))}
            <Link to="/register-provider" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-amber-600 font-bold">🔧 Register Service</Link>
            <div className="pt-2 border-t border-[#e8e0cc] space-y-2">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-[#5c4a2a] font-semibold">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block mx-4 btn-primary text-center">Get Started</Link>
                </>
              ) : (
                <>
                  <Link to={dashboardLink} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-amber-700 font-semibold">Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-500 font-semibold">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
