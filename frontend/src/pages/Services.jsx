import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Navigation, Search, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import { ServiceCard } from './Home';
import EditServiceModal from '../components/EditServiceModal';
import Toast from '../components/Toast';

export default function Services() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(() => searchParams.get('category') || '');
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [location, setLocation] = useState(() => searchParams.get('location') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editService, setEditService] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let active = true;
    api.get('/services')
      .then(({ data }) => {
        if (active) {
          setCategories([...new Set((data.services || []).map((service) => service.category).filter(Boolean))]);
        }
      })
      .catch(() => {
        if (active) setError('We could not load the service categories. Please try again shortly.');
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search.trim()) params.set('search', search.trim());
    if (location.trim()) params.set('location', location.trim());
    const queryString = params.toString();

    api.get(`/services${queryString ? `?${queryString}` : ''}`)
      .then(({ data }) => {
        if (active) setServices(data.services || []);
      })
      .catch(() => {
        if (active) setError('We could not load services right now. Please try again shortly.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [category, search, location]);

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

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-12 text-white sm:py-16">
        <div className="container-custom">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-200">One Call Service</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Find a service</h1>
          <p className="mt-3 max-w-xl text-blue-100">Browse real listings and connect with a service provider that fits your needs.</p>
          <div className="mt-7 grid max-w-4xl gap-3 rounded-2xl bg-white p-3 shadow-xl sm:grid-cols-[1fr_1fr_auto]">
            <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 px-3">
              <Search className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
              <span className="sr-only">Search services and providers</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Service or provider"
                className="min-w-0 flex-1 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
            <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 px-3">
              <Navigation className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
              <span className="sr-only">Filter by location</span>
              <input
                type="search"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
                className="min-w-0 flex-1 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
            <button type="button" onClick={clearFilters} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Clear
            </button>
          </div>
        </div>
      </section>

      <section className="container-custom py-8 sm:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Available services</h2>
            {!loading && !error && <p className="mt-1 text-sm text-slate-500">{services.length} {services.length === 1 ? 'listing' : 'listings'}</p>}
          </div>
          <Link to="/register-provider" className="text-sm font-bold text-blue-700 hover:text-blue-900">Are you a provider? Register here</Link>
        </div>

        <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setCategory('')}
            aria-pressed={!category}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${!category ? 'bg-blue-700 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-800'}`}
          >
            All services
          </button>
          {categories.map((name) => (
            <button
              type="button"
              key={name}
              onClick={() => setCategory(name)}
              aria-pressed={category === name}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${category === name ? 'bg-blue-700 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-800'}`}
            >
              {name}
            </button>
          ))}
        </div>

        {error ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{error}</div>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200" />)}
          </div>
        ) : services.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => <ServiceCard key={service._id} service={service} onDeleted={handleDeleted} onEdit={setEditService} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-blue-200 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><MapPin className="h-7 w-7" /></div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">No services available right now.</h3>
            <p className="mt-2 text-sm text-slate-600">Try another search or clear your filters.</p>
            {(category || search || location) && <button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">Clear filters</button>}
          </div>
        )}
      </section>

      {editService && <EditServiceModal service={editService} onClose={() => setEditService(null)} onSaved={handleSaved} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
