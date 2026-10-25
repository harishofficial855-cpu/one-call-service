import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Pencil, Eye, Trash2, Phone, MessageCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store';
import { trackProviderClick } from '../services/tracking';

export default function ServiceCardMenu({ service, onDeleted, onEdit }) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/services/${service._id}`);
      setConfirmOpen(false);
      setOpen(false);
      onDeleted(service._id, 'Service deleted successfully.');
    } catch (err) {
      onDeleted(null, err.response?.data?.message || 'Failed to delete service.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const providerPhone = service.phone ? service.phone.replace(/\D/g, '').slice(-10) : null;
  const waMsg = encodeURIComponent(`Hi, I found your service "${service.name}" on One Call Service. I'd like to know more.`);

  const menuItemCls = 'w-full flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition-colors text-sm font-medium';

  return (
    <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/70 hover:bg-blue-100 backdrop-blur-sm text-slate-800 hover:text-blue-700 transition-all"
        title="Options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-10 right-0 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-blue-100 z-50 animate-fade-in">
          <button onClick={() => { setOpen(false); navigate(`/services/${service._id}`); }} className={menuItemCls}>
            <Eye className="w-4 h-4 text-blue-600" />
            <span>View Details</span>
          </button>

          {providerPhone && (
            <a href={`tel:${providerPhone}`} onClick={() => { trackProviderClick(service._id, 'call'); setOpen(false); }} className={menuItemCls}>
              <Phone className="w-4 h-4 text-green-500" />
              <span>Call Provider</span>
            </a>
          )}

          {providerPhone && (
            <a href={`https://wa.me/91${providerPhone}?text=${waMsg}`}
              target="_blank" rel="noopener noreferrer" onClick={() => { trackProviderClick(service._id, 'whatsapp'); setOpen(false); }} className={menuItemCls}>
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp</span>
            </a>
          )}

          <div className="mx-3 my-1 border-t border-slate-200" />

          {isAdmin && (
            <button onClick={() => { setOpen(false); onEdit(service); }} className={menuItemCls}>
              <Pencil className="w-4 h-4 text-blue-600" />
              <span>Edit Service</span>
            </button>
          )}

          {user && (
            <button
              onClick={() => { setOpen(false); setConfirmOpen(true); }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Service</span>
            </button>
          )}
        </div>
      )}

      {confirmOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9998] p-4"
          onClick={() => !deleting && setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900 mb-2">Delete Service</h3>
            <p className="mb-6 text-center text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-blue-700">"{service.name}"</span>? This cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-all hover:bg-slate-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Deleting...</span></> : <span>Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
