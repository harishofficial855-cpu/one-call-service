import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock3, ClipboardList, MapPin } from 'lucide-react';
import api from '../services/api';

const STATUSES = ['Pending', 'Confirmed', 'Provider Assigned', 'On The Way', 'Service Started', 'Completed', 'Cancelled'];

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const query = filter ? `?status=${encodeURIComponent(filter)}` : '';
    api.get(`/bookings/my-bookings${query}`)
      .then(({ data }) => {
        if (active) setBookings(data.bookings || []);
      })
      .catch(() => {
        if (active) setError('Your bookings could not be loaded. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [filter, reloadKey]);

  return (
    <section className="min-h-[60vh] bg-slate-50 py-8 sm:py-12">
      <div className="container-custom">
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Customer account</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">My bookings</h1>
          <p className="mt-2 text-slate-600">Bookings created through your account appear here.</p>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {[['', 'All'], ...STATUSES.map((status) => [status, status])].map(([value, label]) => (
            <button
              key={value || 'all'}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === value ? 'bg-blue-700 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-800'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {error ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
            <p>{error}</p>
            <button type="button" onClick={() => setReloadKey((current) => current + 1)} className="mt-4 rounded-xl bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-800">Try again</button>
          </div>
        ) : loading ? (
          <div className="space-y-4">{[1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl bg-slate-200" />)}</div>
        ) : bookings.length ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <article key={booking._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{booking.category}</p>
                    <h2 className="mt-1 text-xl font-extrabold text-slate-900">{booking.serviceName}</h2>
                    <p className="mt-1 text-xs text-slate-500">Booking ID: {booking.bookingId}</p>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {booking.status}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5 text-blue-600" />Date</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-800">{new Date(booking.date).toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5 text-blue-600" />Time</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-800">{booking.timeSlot}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Amount</dt>
                    <dd className="mt-1 text-sm font-bold text-blue-800">{booking.finalAmount != null ? `₹${booking.finalAmount}` : '—'}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-blue-600" />Location</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-800">{booking.location?.city || booking.location?.area || '—'}</dd>
                  </div>
                </dl>
                {booking.paymentStatus && <p className="mt-4 text-xs text-slate-500">Payment status: <span className="font-semibold text-slate-700">{booking.paymentStatus}</span></p>}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-blue-200 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><ClipboardList className="h-7 w-7" aria-hidden="true" /></div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{filter ? 'No bookings for this status' : 'No bookings yet'}</h2>
            <p className="mt-2 text-sm text-slate-600">{filter ? 'Choose another status to check your bookings.' : 'Your real bookings will appear here after you place one.'}</p>
            {!filter && <Link to="/services" className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">Browse services</Link>}
          </div>
        )}
      </div>
    </section>
  );
}
