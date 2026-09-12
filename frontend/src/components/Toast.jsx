import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-slide-up">
      <div className={`flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm ${
        type === 'success'
          ? 'bg-green-500/10 border-green-500/30 text-green-400'
          : 'bg-red-500/10 border-red-500/30 text-red-400'
      }`}>
        {type === 'success'
          ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
          : <XCircle className="w-5 h-5 flex-shrink-0" />
        }
        <span className="text-sm font-semibold text-white">{message}</span>
        <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
