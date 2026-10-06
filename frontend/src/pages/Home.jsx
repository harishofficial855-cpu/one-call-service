import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Star, ArrowRight, Shield, Clock, Award, Users, Sparkles, ChevronRight, Phone, MapPin, MessageCircle } from 'lucide-react';
import ServiceCardMenu from '../components/ServiceCardMenu';
import EditServiceModal from '../components/EditServiceModal';
import Toast from '../components/Toast';

export const CATEGORY_META = {
  'Haircut':                   { icon: '✂️',  color: 'from-pink-400 to-rose-400' },
  'Women Haircut':             { icon: '💇♀️', color: 'from-purple-400 to-pink-400' },
  'Plumber':                   { icon: '🔧',  color: 'from-blue-400 to-cyan-400' },
  'Electrician':               { icon: '⚡',  color: 'from-yellow-400 to-amber-400' },
  'Water Tank Cleaning':       { icon: '💧',  color: 'from-cyan-400 to-blue-400' },
  'House Cleaning':            { icon: '🧹',  color: 'from-green-400 to-emerald-400' },
  'Painting Service':          { icon: '🎨',  color: 'from-amber-400 to-orange-400' },
  'Electronics Repair Service':{ icon: '🔌',  color: 'from-violet-400 to-indigo-400' },
  'Reels / Event Video Shoot': { icon: '🎬',  color: 'from-violet-400 to-purple-400' },
  'Chef':                      { icon: '👨🍳', color: 'from-orange-400 to-red-400' },
  'Security':                  { icon: '🛡️',  color: 'from-slate-400 to-slate-500' },
  'Water Can':                 { icon: '🪣',  color: 'from-teal-400 to-cyan-400' },
  'Tent Service':              { icon: '⛺',  color: 'from-amber-400 to-yellow-400' },
  'Goat Cutter':               { icon: '🐐',  color: 'from-lime-400 to-green-400' },
  'Chicken Cutter':            { icon: '🍗',  color: 'from-red-400 to-orange-400' },
  'Yoga & Diet Teacher':       { icon: '🧘',  color: 'from-emerald-400 to-teal-400' },
  'Nurse':                     { icon: '👩⚕️', color: 'from-blue-300 to-indigo-400' },
  'Physiotherapy':             { icon: '💪',  color: 'from-indigo-400 to-blue-500' },
  'Food Diet Teacher':         { icon: '🥗',  color: 'from-green-300 to-emerald-400' },
  'Caretaker':                 { icon: '🤝',  color: 'from-rose-300 to-pink-400' },
  'Other':                     { icon: '🛠️',  color: 'from-stone-400 to-stone-500' },
};

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Expert Providers' },
  { value: '50+',  label: 'Services' },
  { value: '4.9★', label: 'Average Rating' },
];

const features = [
  { icon: Shield, title: 'Verified Experts',    desc: 'All providers are background-checked and certified' },
  { icon: Clock,  title: 'On-Time Service',     desc: 'Punctual professionals who respect your time' },
  { icon: Award,  title: 'Quality Guaranteed',  desc: '100% satisfaction or we redo the service free' },
  { icon: Users,  title: '24/7 Support',        desc: 'Round-the-clock customer assistance' },
];

const SLIDES = [
  {
    video: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
    tag: 'Professional Home Services',
    title: 'Expert Services',
    highlight: 'At Your Door',
    sub: 'Book verified professionals for all your home needs. Fast, reliable, and affordable.',
  },
  {
    video: 'https://videos.pexels.com/video-files/4253925/4253925-uhd_2560_1440_25fps.mp4',
    tag: 'Trusted & Verified Experts',
    title: 'Quality Work,',
    highlight: 'Guaranteed Results',
    sub: 'All our service providers are background-checked, trained, and certified professionals.',
  },
  {
    video: 'https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4',
    tag: 'Book in 60 Seconds',
    title: 'One Call,',
    highlight: 'All Solutions',
    sub: 'From plumbing to cleaning, electrical to haircuts — we cover every home service need.',
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (isPaused) return undefined;

    const t = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [isPaused]);
  const slide = SLIDES[current];
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {SLIDES.map((s, i) => (
        <video key={i} src={s.video} autoPlay muted loop playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="container-custom relative z-10 py-24">
        <div className="max-w-3xl">
          <div key={current} className="animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-400/40 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-amber-200 text-sm font-semibold">{slide.tag}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 drop-shadow-2xl">
              {slide.title}<br />
              <span className="gradient-text">{slide.highlight}</span>
            </h1>
            <p className="text-xl text-stone-200 mb-10 max-w-xl leading-relaxed drop-shadow-lg">{slide.sub}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link to="/services" className="btn-primary flex items-center justify-center space-x-2 text-base">
              <span>Explore Services</span><ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/register-provider" className="btn-secondary flex items-center justify-center space-x-2 text-base backdrop-blur-sm">
              <span>Register Your Service</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-amber-300 drop-shadow-lg">{s.value}</p>
                <p className="text-stone-300 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <div className="flex items-center space-x-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show slide ${i + 1}: ${SLIDES[i].tag}`}
              aria-current={i === current ? 'true' : undefined}
              className={`transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#1c1408] ${i === current
                  ? 'w-8 h-2 bg-amber-400'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-label={isPaused ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation'}
          className="text-xs font-semibold text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-300 rounded"
        >
          {isPaused ? 'Resume slides' : 'Pause slides'}
        </button>
      </div>
    </section>
  );
}

function ProviderCard({ service, onDeleted, onEdit }) {
  const cat = CATEGORY_META[service.category] || CATEGORY_META['Other'];
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(service.providerName || service.name)}&background=d97706&color=fff&size=128`;

  return (
    <div className="card-shadow overflow-hidden group flex flex-col">
      <div className={`h-28 bg-gradient-to-br ${cat.color} flex items-center justify-center relative`}>
        <div className="absolute inset-0 bg-white/10" />
        <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
        {service.rating > 0 && (
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-[#2c2416] text-xs font-bold">{service.rating.toFixed(1)}</span>
          </div>
        )}
        <div className="absolute top-3 right-3 z-20">
          <ServiceCardMenu service={service} onDeleted={onDeleted} onEdit={onEdit} />
        </div>
        <div className="absolute -bottom-8 left-5 z-10">
          <img
            src={service.profilePhoto || fallbackAvatar}
            alt={service.providerName || service.name}
            onError={(e) => { e.target.src = fallbackAvatar; }}
            className="w-16 h-16 rounded-2xl object-cover border-4 border-[#fffef9] shadow-md"
          />
        </div>
      </div>

      <div className="pt-10 px-5 pb-5 flex flex-col flex-1">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{service.category}</span>
        <h3 className="text-[#2c2416] font-black text-lg mt-0.5 mb-1">{service.name}</h3>
        {service.providerName && (
          <p className="text-[#5c4a2a] text-sm font-semibold mb-2">👤 {service.providerName}</p>
        )}
        <p className="text-[#7a6a4a] text-sm mb-3 line-clamp-2 flex-1">{service.description}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#b8a98a] mb-4">
          {service.serviceLocation && (
            <span className="flex items-center gap-1"><MapPin size={12} className="text-amber-500" />{service.serviceLocation}</span>
          )}
          {service.experience && (
            <span className="flex items-center gap-1"><Clock size={12} className="text-amber-500" />{service.experience}</span>
          )}
          {service.availableTime && (
            <span className="flex items-center gap-1">🕐 {service.availableTime}</span>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 mt-auto">
          <div className="flex gap-2">
            {service.phone && (
              <>
                <a href={`tel:${service.phone}`}
                  className="flex items-center gap-1 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs font-bold transition-all">
                  <Phone size={12} /> Call
                </a>
                <a href={`https://wa.me/91${service.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hi, I found your service "${service.name}" on One Call Service. I'd like to know more.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">
                  <MessageCircle size={12} /> WhatsApp
                </a>
              </>
            )}
            <Link to={`/services/${service._id}`}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-xs font-black transition-all">
              View <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editService, setEditService] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/services')
      .then(r => setServices(r.data.services?.slice(0, 6) || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const handleDeleted = useCallback((id, message, type = 'success') => {
    if (id) setServices(prev => prev.filter(s => s._id !== id));
    showToast(message, type);
  }, [showToast]);
  const handleSaved = useCallback((updated) => {
    setServices(prev => prev.map(s => s._id === updated._id ? updated : s));
    setEditService(null);
    showToast('Service updated successfully.');
  }, [showToast]);

  return (
    <div className="w-full bg-[#faf8f3]">
      <HeroSlider />

      {/* How It Works */}
      <section className="py-20 bg-[#f5f0e8]">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl font-black text-[#2c2416]">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', title: 'Choose Service', desc: 'Browse our wide range of professional services' },
              { n: '02', title: 'Call Provider',  desc: 'Directly call or WhatsApp the service provider' },
              { n: '03', title: 'Confirm Details', desc: 'Share your address and specific requirements' },
              { n: '04', title: 'Get It Done',    desc: 'Expert arrives on time and completes the job' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="card-shadow p-6 text-center h-full">
                  <div className="text-5xl font-black text-amber-200 mb-3">{step.n}</div>
                  <h3 className="text-[#2c2416] font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-[#7a6a4a] text-sm">{step.desc}</p>
                </div>
                {i < 3 && <ChevronRight className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 text-amber-300 z-10" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-[#faf8f3]">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
              <h2 className="text-4xl font-black text-[#2c2416]">Our Services</h2>
            </div>
            <Link to="/services" className="hidden md:flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors">
              <span>View All</span><ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-shadow h-72 animate-pulse bg-[#f0ebe0] rounded-2xl" />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ProviderCard key={service._id} service={service} onDeleted={handleDeleted} onEdit={setEditService} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🛠️</p>
              <p className="text-[#7a6a4a] text-lg mb-4">No services registered yet.</p>
              <Link to="/register-provider" className="btn-primary inline-flex">Be the first to register!</Link>
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link to="/services" className="btn-secondary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#f5f0e8]">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">Why Us</p>
            <h2 className="text-4xl font-black text-[#2c2416]">The One Call Difference</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-shadow p-6 text-center group">
                <div className="w-14 h-14 bg-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-all">
                  <Icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-[#2c2416] font-bold mb-2">{title}</h3>
                <p className="text-[#7a6a4a] text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register CTA */}
      <section className="py-20 bg-[#faf8f3]">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 p-10 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-amber-100 font-semibold mb-2">Are you a service professional?</p>
                <h2 className="text-4xl font-black text-white mb-2">Register Your Service Today</h2>
                <p className="text-amber-100">Reach thousands of customers in your area — it's free to register.</p>
              </div>
              <Link to="/register-provider"
                className="flex-shrink-0 bg-white text-amber-700 font-black px-8 py-4 rounded-2xl hover:bg-amber-50 transition-all shadow-xl text-lg whitespace-nowrap">
                Register Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {editService && <EditServiceModal service={editService} onClose={() => setEditService(null)} onSaved={handleSaved} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
