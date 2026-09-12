import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trash2, Plus, Pencil, X, Check } from 'lucide-react';

const EMPTY_FORM = { name: '', category: '', description: '', basePrice: '', estimatedTime: '' };
const CATEGORIES = ['Plumber', 'House Cleaning', 'Water Tank Cleaning', 'Electrical Services', 'Haircut', 'Mutton Cutter', "Women's Haircut"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').then(r => setStats(r.data.stats)).catch(() => {}),
      api.get('/services').then(r => setServices(r.data.services || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModal('add'); };
  const openEdit = (s) => { setForm({ name: s.name, category: s.category, description: s.description, basePrice: s.basePrice, estimatedTime: s.estimatedTime || '' }); setEditId(s._id); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') {
        const { data } = await api.post('/services', form);
        setServices(prev => [data.service, ...prev]);
      } else {
        const { data } = await api.put(`/services/${editId}`, form);
        setServices(prev => prev.map(s => s._id === editId ? data.service : s));
      }
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting service');
    }
  };

  const tabs = ['stats', 'services'];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container-custom py-10">
        <h1 className="text-3xl font-black text-white mb-1">Admin Control Panel</h1>
        <p className="text-slate-400 mb-8">Manage all platform operations</p>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800 p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm capitalize transition-all ${
                activeTab === tab ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}>
              {tab === 'stats' ? 'Dashboard' : 'Manage Services'}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          loading ? <p className="text-slate-400">Loading...</p> : stats ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Customers', value: stats.customerCount || 0, color: 'text-blue-400' },
                  { label: 'Providers', value: stats.providerCount || 0, color: 'text-green-400' },
                  { label: 'Bookings', value: stats.totalBookings || 0, color: 'text-amber-400' },
                  { label: 'Revenue', value: `₹${stats.totalRevenue || 0}`, color: 'text-purple-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="card-shadow p-6">
                    <p className="text-slate-400 text-sm mb-1">{label}</p>
                    <p className={`text-3xl font-black ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {stats.bookingsByStatus && (
                <div className="card-shadow p-6 max-w-md">
                  <h2 className="text-white font-bold text-lg mb-4">Bookings by Status</h2>
                  <div className="space-y-3">
                    {Object.entries(stats.bookingsByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-slate-300 capitalize">{status}</span>
                        <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : <p className="text-red-400">Error loading dashboard</p>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">All Services ({services.length})</h2>
              <button onClick={openAdd}
                className="btn-primary flex items-center space-x-2 py-2 text-sm">
                <Plus size={18} />
                <span>Add Service</span>
              </button>
            </div>

            <div className="card-shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800 border-b border-slate-700">
                    <tr>
                      {['Service Name', 'Category', 'Price', 'Rating', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {services.length > 0 ? services.map((s) => (
                      <tr key={s._id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-4 text-white font-semibold">{s.name}</td>
                        <td className="px-5 py-4">
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold">{s.category}</span>
                        </td>
                        <td className="px-5 py-4 text-amber-400 font-bold">₹{s.basePrice}</td>
                        <td className="px-5 py-4 text-slate-300">⭐ {s.rating || '4.8'}</td>
                        <td className="px-5 py-4">
                          <div className="flex space-x-2">
                            <button onClick={() => openEdit(s)}
                              className="flex items-center space-x-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                              <Pencil size={13} /><span>Edit</span>
                            </button>
                            <button onClick={() => deleteService(s._id)}
                              className="flex items-center space-x-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                              <Trash2 size={13} /><span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-500">No services found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-white font-bold text-lg">{modal === 'add' ? 'Add New Service' : 'Edit Service'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Service Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" placeholder="e.g. Basic Plumbing" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="input-field" required>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="input-field resize-none" rows={3} placeholder="Service description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Base Price (₹)</label>
                  <input type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })}
                    className="input-field" placeholder="499" required min="0" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Est. Time</label>
                  <input value={form.estimatedTime} onChange={e => setForm({ ...form, estimatedTime: e.target.value })}
                    className="input-field" placeholder="1-2 hours" />
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2">
                  <Check size={16} />
                  <span>{saving ? 'Saving...' : modal === 'add' ? 'Add Service' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
