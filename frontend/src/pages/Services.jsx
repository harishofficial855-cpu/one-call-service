import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Star, ArrowRight, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { CATEGORY_META } from './Home';
import ServiceCardMenu from '../components/ServiceCardMenu';
import EditServiceModal from '../components/EditServiceModal';
import Toast from '../components/Toast';

const ALL_CATEGORIES = Object.keys(CATEGORY_META);

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

export default function Services() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editService, setEditService] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    api.get(`/services?${params}`)
      .then(r => setServices(r.data.services || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search]);

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
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}
      <div className="bg-[#f5f0e8] border-b border-[#e8e0cc] py-12">
        <div className="container-custom">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">What We Offer</p>
          <h1 className="text-4xl font-black text-[#2c2416] mb-6">All Services</h1>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b8a98a] w-5 h-5" />
            <input type="text" placeholder="Search services, providers, locations..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12" />
          </div>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              !category
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-[#fffef9] text-[#7a6a4a] border border-[#e8e0cc] hover:border-amber-400 hover:text-amber-700'
            }`}>
            All
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                category === cat
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                  : 'bg-[#fffef9] text-[#7a6a4a] border border-[#e8e0cc] hover:border-amber-400 hover:text-amber-700'
              }`}>
              {CATEGORY_META[cat]?.icon} {cat}
            </button>
          ))}
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
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-[#7a6a4a] text-lg mb-4">No services found</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setSearch(''); setCategory(''); }} className="btn-secondary">Clear Filters</button>
              <Link to="/register-provider" className="btn-primary">Register a Service</Link>
            </div>
          </div>
        )}
      </div>

      {editService && <EditServiceModal service={editService} onClose={() => setEditService(null)} onSaved={handleSaved} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
