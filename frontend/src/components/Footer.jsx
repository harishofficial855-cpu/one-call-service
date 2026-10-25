import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useAuthStore } from '../store';

export default function Footer() {
  const user = useAuthStore((state) => state.user);
  const accountPath = user?.role === 'admin'
    ? '/admin/dashboard'
    : user?.role === 'provider'
      ? '/provider/dashboard'
      : '/dashboard';
  const accountLinks = user
    ? [[accountPath, 'Dashboard'], ...(user.role === 'customer' ? [['/my-bookings', 'My bookings']] : []), ['/notifications', 'Notifications']]
    : [['/login', 'Sign in'], ['/register', 'Create an account']];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-custom py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 inline-flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-11 w-11 rounded-xl border border-slate-200 object-cover" />
              <span>
                <span className="block text-lg font-black text-blue-950">ONE CALL</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-600">Home Services</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600">
              Explore local home-service listings and book through One Call Service.
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <img
                src="https://1drv.ms/i/c/250f6a28e9ace4e2/IQCQulF9oh8ZSYysgUXk9CAIAZV42NDPY2u9Pk-em-BaQ2Y?e=chbc6O"
                alt="Golanakonda Harish"
                className="h-12 w-12 shrink-0 rounded-full border-2 border-blue-200 object-cover"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">Golanakonda Harish</p>
                <p className="text-xs font-semibold text-blue-700">Founder &amp; CEO</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-bold text-slate-900">Quick links</h2>
            <ul className="space-y-3 text-sm">
              {[['/services', 'Services'], ['/offers', 'Offers'], ['/about', 'About us'], ['/contact', 'Contact'], ['/register-provider', 'Register as a provider']].map(([path, label]) => (
                <li key={path}><Link to={path} className="text-slate-600 transition-colors hover:text-blue-700">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-bold text-slate-900">Your account</h2>
            <ul className="space-y-3 text-sm">
              {accountLinks.map(([path, label]) => (
                <li key={path}><Link to={path} className="text-slate-600 transition-colors hover:text-blue-700">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-bold text-slate-900">Contact</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-slate-600">
                <Phone className="h-4 w-4 shrink-0 text-blue-600" />
                <a href="tel:+919989730775" className="transition-colors hover:text-blue-700">+91 9989730775</a>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Mail className="h-4 w-4 shrink-0 text-blue-600" />
                <a href="mailto:harishoffical855@gmail.com" className="break-all transition-colors hover:text-blue-700">harishoffical855@gmail.com</a>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <span>Warangal, Telangana, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} One Call Service. All rights reserved.</p>
          <Link to="/contact" className="text-xs font-medium text-slate-400 transition-colors hover:text-blue-700">Contact us</Link>
        </div>
      </div>
    </footer>
  );
}
