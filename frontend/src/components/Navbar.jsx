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

  const navLinks = [['/', 'Home'], ['/services', 'Services'], ['/offers', 'Offers'], ['/about', 'About'], ['/contact', 'Contact']];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-md shadow-blue-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="https://static.vecteezy.com/system/resources/previews/004/697/926/original/modern-and-professional-call-center-logo-design-free-vector.jpg"
              alt="One Call Service"
              className="h-11 w-11 rounded-xl object-cover shadow-md shadow-blue-200"
            />
            <div>
              <span className="text-lg font-black text-blue-800 tracking-tight">ONE CALL</span>
              <p className="text-xs text-blue-500 font-semibold tracking-widest uppercase">Premium Services</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(([path, label]) => (
              <Link key={path} to={path}
                className="px-4 py-2 text-blue-700 hover:text-blue-900 font-medium transition-colors rounded-lg hover:bg-blue-50 text-sm">
                {label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center space-x-3">
            {!user ? (
              <>
                <Link to="/login" className="px-4 py-2 text-blue-700 hover:text-blue-900 font-semibold transition-colors text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {user.role === 'customer' && (
                  <Link to="/booking" className="btn-primary text-sm py-2">Book Now</Link>
                )}
                <Link to={dashboardLink}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-400 transition-all">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-blue-800 text-sm font-semibold">{user.name?.split(' ')[0]}</span>
                  {user.role === 'admin' && <Settings className="w-4 h-4 text-blue-500" />}
                  {user.role === 'provider' && <Briefcase className="w-4 h-4 text-blue-500" />}
                  {user.role === 'customer' && <LayoutDashboard className="w-4 h-4 text-blue-500" />}
                </Link>
                <button onClick={handleLogout}
                  className="p-2 text-blue-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-blue-700" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-blue-100 py-4 space-y-1 bg-white">
            {navLinks.map(([path, label]) => (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-blue-100 space-y-2">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-blue-700 font-semibold">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block mx-4 btn-primary text-center">Get Started</Link>
                </>
              ) : (
                <>
                  {user.role === 'customer' && <Link to="/booking" onClick={() => setMobileOpen(false)} className="block mx-4 btn-primary text-center">Book Now</Link>}
                  <Link to={dashboardLink} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-blue-700 font-semibold">Dashboard</Link>
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
