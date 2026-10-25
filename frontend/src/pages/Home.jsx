import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Clock3, MapPin, Search, ShieldCheck,
  Sparkles, Star, Wrench, Zap, Droplets, SprayCan, Scissors,
  Paintbrush, Computer, ChefHat, Shield, Tent, HeartPulse,
  HeartHandshake, Flower2, HelpCircle, UserCircle,
} from 'lucide-react';
import api from '../services/api';
import ServiceCardMenu from '../components/ServiceCardMenu';
import EditServiceModal from '../components/EditServiceModal';
import Toast from '../components/Toast';

const CATEGORY_ICONS = [
  [/haircut/i, Scissors],
  [/plumb/i, Wrench],
  [/electric/i, Zap],
  [/water/i, Droplets],
  [/clean/i, SprayCan],
  [/paint/i, Paintbrush],
  [/electronic|repair/i, Computer],
  [/chef|food/i, ChefHat],
  [/security/i, Shield],
  [/tent/i, Tent],
  [/nurse|physio/i, HeartPulse],
  [/care/i, HeartHandshake],
  [/yoga|diet/i, Flower2],
];

export function getCategoryIcon(category) {
  return CATEGORY_ICONS.find(([pattern]) => pattern.test(category))?.[1] || HelpCircle;
}

function Hero({ onSearch }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    onSearch(params.toString());
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#0b1d3b]">
      <img
        src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=2200&q=85"
        alt="Home-service professional working on an electrical repair"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071a3c]/95 via-[#0c2a59]/80 to-[#0c2a59]/25" />
      <div className="container-custom flex min-h-[520px] items-center py-16 sm:min-h-[600px] lg:min-h-[640px]">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Home services, made simple
          </div>
          <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your Home,
            <span className="block text-blue-200">Our Priority</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-blue-50/90 sm:text-lg">
            Find a service that fits your needs and connect with local professionals.
          </p>
          <form onSubmit={submitSearch} className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-blue-950/30 sm:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Search className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
              <span className="sr-only">Search services</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What service do you need?"
                className="min-w-0 flex-1 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>
            <button type="submit" className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Find a service
            </button>
          </form>
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition hover:text-white"
          >
            Browse all available services <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function ServiceCard({ service, onDeleted, onEdit }) {
  const CategoryIcon = getCategoryIcon(service.category || '');
  const image = service.image || '';
  const [imageFailed, setImageFailed] = useState(false);
  const [profileImageFailed, setProfileImageFailed] = useState(false);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10">
      <Link to={`/services/${service._id}`} className="relative block h-48 overflow-hidden bg-blue-50" aria-label={`View ${service.name}`}>
        {image && !imageFailed ? (
          <img src={image} alt={service.name} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
            <CategoryIcon className="h-14 w-14 text-blue-600" strokeWidth={1.5} aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-800 shadow-sm">
          {service.category}
        </span>
        {service.rating > 0 && service.reviewCount > 0 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-bold text-slate-800">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            {service.rating.toFixed(1)} <span className="font-medium text-slate-500">({service.reviewCount})</span>
          </span>
        )}
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/services/${service._id}`} className="text-lg font-bold text-slate-900 transition hover:text-blue-700">
              {service.name}
            </Link>
            {service.providerName && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                {service.profilePhoto && !profileImageFailed
                  ? <img src={service.profilePhoto} alt="" onError={() => setProfileImageFailed(true)} className="h-5 w-5 rounded-full object-cover" />
                  : <UserCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />}
                <span>{service.providerName}</span>
                <BadgeCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
              </p>
            )}
          </div>
          {service.basePrice != null && (
            <p className="shrink-0 text-right text-lg font-extrabold text-blue-800">
              ₹{service.basePrice}
              <span className="block text-[11px] font-medium text-slate-400">starting price</span>
            </p>
          )}
        </div>
        {service.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{service.description}</p>}
        {(service.serviceLocation || service.estimatedTime || service.availableTime) && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            {service.serviceLocation && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-blue-600" />{service.serviceLocation}</span>}
            {(service.estimatedTime || service.availableTime) && <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-blue-600" />{service.estimatedTime || service.availableTime}</span>}
          </div>
        )}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <Link to={`/services/${service._id}`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">
            View details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <ServiceCardMenu service={service} onDeleted={onDeleted} onEdit={onEdit} />
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editService, setEditService] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api.get('/services')
      .then(({ data }) => {
        if (active) setServices(data.services || []);
      })
      .catch(() => {
        if (active) setLoadError('We could not load services right now. Please try again shortly.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => [...new Set(services.map((service) => service.category).filter(Boolean))],
    [services]
  );

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const handleDeleted = useCallback((id, message, type = 'success') => {
    if (id) setServices((current) => current.filter((service) => service._id !== id));
    showToast(message, type);
  }, [showToast]);
  const handleSaved = useCallback((updated) => {
    setServices((current) => current.map((service) => service._id === updated._id ? updated : service));
    setEditService(null);
    showToast('Service updated successfully.');
  }, [showToast]);

  const goToSearch = (search) => navigate(search ? `/services?${search}` : '/services');

  return (
    <div className="w-full bg-slate-50">
      <Hero onSearch={goToSearch} />

      <section className="container-custom py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Explore</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Service categories</h2>
            <p className="mt-2 text-slate-600">Choose from categories with services currently available.</p>
          </div>
          <Link to="/services" className="hidden items-center gap-2 pb-1 text-sm font-bold text-blue-700 hover:text-blue-900 sm:inline-flex">
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-200" />)}
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{loadError}</div>
        ) : categories.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => {
              const CategoryIcon = getCategoryIcon(category);
              return (
                <Link
                  key={category}
                  to={`/services?category=${encodeURIComponent(category)}`}
                  className="group flex min-h-28 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                    <CategoryIcon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold leading-5 text-slate-800">{category}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center text-slate-600">No services available right now.</p>
        )}
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="container-custom">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Available now</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Services near you</h2>
            </div>
            <Link to="/services" className="hidden items-center gap-2 pb-1 text-sm font-bold text-blue-700 hover:text-blue-900 sm:inline-flex">
              Browse services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-100" />)}
            </div>
          ) : loadError ? (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{loadError}</div>
          ) : services.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((service) => (
                <ServiceCard key={service._id} service={service} onDeleted={handleDeleted} onEdit={setEditService} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/60 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
                <Wrench className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">No services available right now.</h3>
              <p className="mt-2 text-sm text-slate-600">Please check back later or browse all service listings.</p>
              <Link to="/services" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">
                Browse services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
          <Link to="/services" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50 sm:hidden">
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="container-custom py-14 sm:py-20">
        <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-800 to-blue-700 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-200">One Call Service</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">A simpler way to find the help you need.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-blue-100">Explore current listings, review the service details, and book directly through One Call Service.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-blue-800 transition hover:bg-blue-50">
                Find a service <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register-provider" className="inline-flex items-center justify-center rounded-xl border border-white/40 px-5 py-3 font-bold text-white transition hover:bg-white/10">
                Register as a provider
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 border-t border-white/15 pt-6 text-sm text-blue-100">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Real service listings</span>
            <span className="inline-flex items-center gap-2"><Search className="h-4 w-4" /> Search by service or location</span>
          </div>
        </div>
      </section>

      {editService && <EditServiceModal service={editService} onClose={() => setEditService(null)} onSaved={handleSaved} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
