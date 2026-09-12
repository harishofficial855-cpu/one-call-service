import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Star, ArrowRight } from 'lucide-react';
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
  "Women's Haircut": { icon: '💇♀️', color: 'from-purple-500 to-pink-500' },
};

const categories = ['Plumber', 'House Cleaning', 'Water Tank Cleaning', 'Electrical Services', 'Haircut', 'Mutton Cutter', "Women's Haircut"];

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

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

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
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 py-12">
        <div className="container-custom">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-2">What We Offer</p>
          <h1 className="text-4xl font-black text-white mb-6">All Services</h1>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              !category
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-amber-500/50 hover:text-amber-400'
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                category === cat
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-amber-500/50 hover:text-amber-400'
              }`}
            >
              {categoryIcons[cat]?.icon} {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-shadow h-72 animate-pulse bg-slate-800 rounded-2xl" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const cat = categoryIcons[service.category] || { icon: '🛠️', color: 'from-slate-500 to-slate-600' };
              return (
                <div key={service._id} className="card-shadow overflow-hidden group">
                  {/* Card Image */}
                  <div className={`h-44 bg-gradient-to-br ${cat.color} flex items-center justify-center relative`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                      {cat.icon}
                    </span>

                    {/* Rating badge */}
                    <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-white text-xs font-bold">{service.rating || '4.8'}</span>
                    </div>

                    {/* 3-dot menu — top right */}
                    <div className="absolute top-3 right-3 z-20">
                      <ServiceCardMenu
                        service={service}
                        onDeleted={handleDeleted}
                        onEdit={setEditService}
                      />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {service.category}
                    </span>
                    <h3 className="text-white font-bold text-lg mt-1 mb-2">{service.name}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{service.description}</p>

                    {/* Phone number display */}
                    <p className="text-slate-500 text-xs mb-3 flex items-center space-x-1">
                      <span>📞</span>
                      <span>+91 98765 43210</span>
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-amber-400">₹{service.basePrice}</span>
                        <span className="text-slate-500 text-xs ml-1">starting</span>
                      </div>
                      <Link
                        to={`/services/${service._id}`}
                        className="flex items-center space-x-1 bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-amber-500 text-amber-400 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-slate-400 text-lg">No services found</p>
            <button
              onClick={() => { setSearch(''); setCategory(''); }}
              className="mt-4 btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editService && (
        <EditServiceModal
          service={editService}
          onClose={() => setEditService(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
