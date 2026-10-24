import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trash2, Plus, Pencil, X, Check } from 'lucide-react';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';

const EMPTY_FORM = { name: '', category: '', description: '', basePrice: '', estimatedTime: '' };
const CATEGORIES = ['Plumber', 'House Cleaning', 'Water Tank Cleaning', 'Electrical Services', 'Haircut', 'Mutton Cutter', "Women's Haircut"];

export default function AdminDashboard() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsError, setAnalyticsError] = useState('');
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsFrom, setAnalyticsFrom] = useState(() =>
    new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [analyticsTo, setAnalyticsTo] = useState(() => new Date().toISOString().slice(0, 10));
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

  useEffect(() => {
    if (activeTab !== 'analytics') return undefined;

    let isCurrentRequest = true;
    setAnalyticsLoading(true);
    setAnalyticsError('');
    api.get('/admin/analytics', { params: { from: analyticsFrom, to: analyticsTo } })
      .then(({ data }) => {
        if (isCurrentRequest) setAnalytics(data);
      })
      .catch((err) => {
        if (isCurrentRequest) {
          setAnalyticsError(err.response?.data?.message || 'Unable to load analytics report.');
        }
      })
      .finally(() => {
        if (isCurrentRequest) setAnalyticsLoading(false);
      });

    return () => { isCurrentRequest = false; };
  }, [activeTab, analyticsFrom, analyticsTo]);

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

  const tabs = ['stats', 'services', 'analytics'];
  const dailyRows = (analytics?.dailyTotals || []).reduce((rows, event) => {
    const row = rows.get(event.date) || { date: event.date, total: 0, pageViews: 0, calls: 0, whatsapp: 0 };
    row.total += event.count;
    if (event.eventType === 'page_view') row.pageViews += event.count;
    if (event.eventType === 'provider_click' && event.action === 'call') row.calls += event.count;
    if (event.eventType === 'provider_click' && event.action === 'whatsapp') row.whatsapp += event.count;
    rows.set(event.date, row);
    return rows;
  }, new Map());
  const providerRows = (analytics?.providerClicks || []).reduce((rows, click) => {
    const row = rows.get(click.providerId) || {
      providerId: click.providerId,
      providerName: click.providerName,
      serviceName: click.serviceName,
      calls: 0,
      whatsapp: 0,
    };
    if (click.action === 'call') row.calls = click.count;
    if (click.action === 'whatsapp') row.whatsapp = click.count;
    rows.set(click.providerId, row);
    return rows;
  }, new Map());

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container-custom py-10">
        <h1 className="text-3xl font-black text-white mb-1">Admin Control Panel</h1>
        <p className="text-slate-400 mb-8">Manage all platform operations</p>
        <button
          type="button"
          onClick={() => { logout(); navigate('/admin'); }}
          className="text-sm text-amber-300 hover:text-amber-200 underline underline-offset-4 mb-6"
        >
          Sign out
        </button>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800 p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm capitalize transition-all ${
                activeTab === tab ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}>
              {tab === 'stats' ? 'Dashboard' : tab === 'services' ? 'Manage Services' : 'Analytics'}
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

        {activeTab === 'analytics' && (
          <section aria-label="Website analytics">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
              <div>
                <label htmlFor="analytics-from" className="block text-sm font-semibold text-slate-300 mb-1">From</label>
                <input id="analytics-from" type="date" value={analyticsFrom}
                  onChange={(event) => setAnalyticsFrom(event.target.value)} className="input-field" />
              </div>
              <div>
                <label htmlFor="analytics-to" className="block text-sm font-semibold text-slate-300 mb-1">To</label>
                <input id="analytics-to" type="date" value={analyticsTo}
                  onChange={(event) => setAnalyticsTo(event.target.value)} className="input-field" />
              </div>
              <p className="text-xs text-slate-400 sm:ml-auto max-w-md">
                Contact metrics count button clicks only; they do not confirm calls, sent WhatsApp messages, or completed bookings.
              </p>
            </div>

            {analyticsLoading ? (
              <p role="status" className="text-slate-300 py-8">Loading analytics...</p>
            ) : analyticsError ? (
              <p role="alert" className="text-red-300 py-8">{analyticsError}</p>
            ) : analytics ? (
              <div className="space-y-8">
                <div className="card-shadow p-6">
                  <h2 className="text-white font-bold text-lg mb-4">Daily event totals (UTC)</h2>
                  {(dailyRows.size > 0) ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[620px]">
                        <thead><tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-700">
                          {['Date', 'All events', 'Page views', 'Call clicks', 'WhatsApp clicks'].map((heading) => (
                            <th key={heading} className="py-3 pr-4">{heading}</th>
                          ))}
                        </tr></thead>
                        <tbody className="divide-y divide-slate-700/50">
                          {[...dailyRows.values()].sort((a, b) => b.date.localeCompare(a.date)).map((row) => (
                            <tr key={row.date} className="text-slate-200">
                              <td className="py-3 pr-4">{row.date}</td><td className="py-3 pr-4">{row.total}</td>
                              <td className="py-3 pr-4">{row.pageViews}</td><td className="py-3 pr-4">{row.calls}</td>
                              <td className="py-3 pr-4">{row.whatsapp}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : <p className="text-slate-400">No events recorded for this date range.</p>}
                </div>

                <div className="card-shadow p-6">
                  <h2 className="text-white font-bold text-lg mb-4">Provider contact clicks</h2>
                  {providerRows.size > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[520px]">
                        <thead><tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-700">
                          {['Provider / service', 'Call clicks', 'WhatsApp clicks'].map((heading) => (
                            <th key={heading} className="py-3 pr-4">{heading}</th>
                          ))}
                        </tr></thead>
                        <tbody className="divide-y divide-slate-700/50">
                          {[...providerRows.values()].map((row) => (
                            <tr key={row.providerId} className="text-slate-200">
                              <td className="py-3 pr-4">{row.providerName ? `${row.providerName} — ` : ''}{row.serviceName}</td>
                              <td className="py-3 pr-4">{row.calls}</td><td className="py-3 pr-4">{row.whatsapp}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : <p className="text-slate-400">No provider contact clicks recorded for this date range.</p>}
                </div>

                <div className="card-shadow p-6">
                  <h2 className="text-white font-bold text-lg mb-4">Most-viewed service pages</h2>
                  {analytics.mostViewedServices.length > 0 ? (
                    <ol className="divide-y divide-slate-700/50">
                      {analytics.mostViewedServices.map((service) => (
                        <li key={service.pagePath} className="flex items-center justify-between gap-4 py-3 text-slate-200">
                          <span>{service.serviceName}</span><span className="text-amber-400 font-bold">{service.views} views</span>
                        </li>
                      ))}
                    </ol>
                  ) : <p className="text-slate-400">No service-page views recorded for this date range.</p>}
                </div>
              </div>
            ) : null}
          </section>
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
                  className="input-field" rows={6} maxLength={9000} placeholder="Service description (up to 9000 characters)..." />
                <p className={`text-xs mt-1 text-right ${form.description.length > 8500 ? 'text-red-400' : 'text-slate-500'}`}>
                  {form.description.length} / 9000
                </p>
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
