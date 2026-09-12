import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://static.vecteezy.com/system/resources/previews/004/697/926/original/modern-and-professional-call-center-logo-design-free-vector.jpg"
                alt="One Call Service"
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div>
                <p className="text-white font-black text-lg">ONE CALL</p>
                <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Premium Services</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your trusted platform for verified home service professionals. Quality guaranteed.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[['/services', 'Services'], ['/offers', 'Offers'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([path, label]) => (
                <li key={path}>
                  <Link to={path} className="text-slate-400 hover:text-amber-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-3 text-sm">
              {['Plumbing', 'House Cleaning', 'Electrical', 'Haircut', 'Water Tank'].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-slate-400 hover:text-amber-400 transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3 text-slate-400">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>support@onecallservice.com</span>
              </li>
              <li className="flex items-start space-x-3 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2024 One Call Service. All rights reserved.</p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
