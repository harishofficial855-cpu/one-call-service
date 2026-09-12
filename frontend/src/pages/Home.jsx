import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Star, ArrowRight, Shield, Clock, Award, Users, Sparkles, ChevronRight } from 'lucide-react';
import ServiceCardMenu from '../components/ServiceCardMenu';
import EditServiceModal from '../components/EditServiceModal';
import Toast from '../components/Toast';

const categoryIcons = {
  'Plumber': { icon: '🔧', color: 'from-blue-500 to-cyan-500' },
  'House Cleaning': { icon: '🧹', color: 'from-green-500 to-emerald-500' },
  'Electrical Services': { icon: '⚡', color: 'from-yellow-500 to-amber-500' },
  'Haircut': { icon: '✂️', color: 'from-pink-500 to-rose-500' },
  'Water Tank Cleaning': { icon: '💧', color: 'from-cyan-500 to-blue-500' },
  'Mutton Cutter': { icon: '🥩', color: 'from-red-500 to-orange-500' },
  "Women's Haircut": { icon: '💇‍♀️', color: 'from-purple-500 to-pink-500' },
};

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Expert Providers' },
  { value: '50+', label: 'Services' },
  { value: '4.9★', label: 'Average Rating' },
];

const features = [
  { icon: Shield, title: 'Verified Experts', desc: 'All providers are background-checked and certified' },
  { icon: Clock, title: 'On-Time Service', desc: 'Punctual professionals who respect your time' },
  { icon: Award, title: 'Quality Guaranteed', desc: '100% satisfaction or we redo the service free' },
  { icon: Users, title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
];

export default function Home() {
  const [services, setServices] = useState([]);
  const [editService, setEditService] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.services?.slice(0, 6) || [])).catch(() => {});
  }, []);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  const handleDeleted = useCallback((deletedId, message, type = 'success') => {
    if (deletedId) setServices(prev => prev.filter(s => s._id !== deletedId));
    showToast(message, type);
  }, [showToast]);

  const handleSaved = useCallback((updated) => {
    setServices(prev => prev.map(s => s._id === updated._id ? updated : s));
    setEditService(null);
    showToast('Service updated successfully.');
  }, [showToast]);

  return (
    <div className="w-full bg-slate-900">
      {/* Hero */}
      <section className="relative hero-gradient overflow-hidden min-h-screen flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-semibold">Premium Home Services Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Expert Services
              <br />
              <span className="gradient-text">At Your Door</span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
              Book verified professionals for all your home needs. Fast, reliable, and affordable services with real-time tracking.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/booking" className="btn-primary flex items-center justify-center space-x-2 text-base">
                <span>Book a Service</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/services" className="btn-secondary flex items-center justify-center space-x-2 text-base">
                <span>Explore Services</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-black text-amber-400">{s.value}</p>
                  <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-800/30">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl font-black text-white">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', title: 'Choose Service', desc: 'Browse our wide range of professional services' },
              { n: '02', title: 'Pick Schedule', desc: 'Select your preferred date and time slot' },
              { n: '03', title: 'Add Details', desc: 'Provide your address and specific requirements' },
              { n: '04', title: 'Get It Done', desc: 'Expert arrives on time and completes the job' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="card-shadow p-6 text-center h-full">
                  <div className="text-5xl font-black text-amber-500/20 mb-3">{step.n}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.desc}</p>
                </div>
                {i < 3 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 text-amber-500/40 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
              <h2 className="text-4xl font-black text-white">Our Services</h2>
            </div>
            <Link to="/services" className="hidden md:flex items-center space-x-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const cat = categoryIcons[service.category] || { icon: '🛠️', color: 'from-slate-500 to-slate-600' };
                return (
                  <div key={service._id} className="card-shadow overflow-hidden group service-card">
                    <div className={`h-44 bg-gradient-to-br ${cat.color} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <span className="service-icon text-6xl relative z-10 transition-transform duration-300">{cat.icon}</span>
                      <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-white text-xs font-bold">{service.rating || '4.8'}</span>
                      </div>
                      <div className="absolute top-3 right-3 z-20">
                        <ServiceCardMenu service={service} onDeleted={handleDeleted} onEdit={setEditService} />
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{service.category}</span>
                      <h3 className="text-white font-bold text-lg mt-1 mb-2">{service.name}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-black text-amber-400">₹{service.basePrice}</span>
                          <span className="text-slate-500 text-xs ml-1">starting</span>
                        </div>
                        <Link to={`/services/${service._id}`}
                          className="flex items-center space-x-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                          <span>Book Now</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <p>Loading services...</p>
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link to="/services" className="btn-secondary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-800/30">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Why Us</p>
            <h2 className="text-4xl font-black text-white">The One Call Difference</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-shadow p-6 text-center group">
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-all">
                  <Icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Banner */}
      <section className="py-20">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 p-10 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-orange-100 font-semibold mb-2">Limited Time Offer</p>
                <h2 className="text-4xl font-black text-white mb-2">20% OFF Your First Booking</h2>
                <p className="text-orange-100">Use code <span className="font-black bg-white/20 px-2 py-1 rounded">FIRST20</span> at checkout</p>
              </div>
              <Link to="/booking" className="flex-shrink-0 bg-white text-orange-600 font-black px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all shadow-xl text-lg">
                Claim Offer →
              </Link>
            </div>
          </div>
        </div>
      </section>
      {editService && (
        <EditServiceModal service={editService} onClose={() => setEditService(null)} onSaved={handleSaved} />
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
