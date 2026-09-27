import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Pencil, Eye, Trash2, Phone, MessageCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store';

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

  const menuItemCls = 'w-full flex items-center space-x-3 px-4 py-3 text-[#5c4a2a] hover:bg-amber-50 hover:text-amber-700 transition-colors text-sm font-medium';

  return (
    <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/70 hover:bg-amber-100 backdrop-blur-sm text-[#2c2416] hover:text-amber-700 transition-all"
        title="Options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-10 right-0 w-52 bg-[#fffef9] border border-[#e8e0cc] rounded-2xl shadow-xl shadow-amber-100 overflow-hidden z-50 animate-fade-in">
          <button onClick={() => { setOpen(false); navigate(`/services/${service._id}`); }} className={menuItemCls}>
            <Eye className="w-4 h-4 text-amber-500" />
            <span>View Details</span>
          </button>

          {providerPhone && (
            <a href={`tel:${providerPhone}`} onClick={() => setOpen(false)} className={menuItemCls}>
              <Phone className="w-4 h-4 text-green-500" />
              <span>Call Provider</span>
            </a>
          )}

          {providerPhone && (
            <a href={`https://wa.me/91${providerPhone}?text=${waMsg}`}
              target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className={menuItemCls}>
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp</span>
            </a>
          )}

          <div className="border-t border-[#e8e0cc] mx-3 my-1" />

          {isAdmin && (
            <button onClick={() => { setOpen(false); onEdit(service); }} className={menuItemCls}>
              <Pencil className="w-4 h-4 text-amber-500" />
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
            className="bg-[#fffef9] border border-[#e8e0cc] rounded-2xl p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-[#2c2416] font-bold text-lg text-center mb-2">Delete Service</h3>
            <p className="text-[#7a6a4a] text-sm text-center mb-6">
              Are you sure you want to delete <span className="text-amber-600 font-semibold">"{service.name}"</span>? This cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-[#f0ebe0] hover:bg-[#e8e0cc] text-[#2c2416] rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
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
