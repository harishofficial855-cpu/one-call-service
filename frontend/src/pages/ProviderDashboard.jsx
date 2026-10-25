import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Clock3, MapPin, UserCircle } from 'lucide-react';
import api from '../services/api';

const ACTIVE_STATUSES = ['Provider Assigned', 'On The Way', 'Service Started'];

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ProviderDashboard() {
  const [bookings, setBookings] = useState([]);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      api.get('/providers/bookings'),
      api.get('/providers/profile'),
    ]).then(([bookingsResult, providerResult]) => {
      if (!active) return;
      if (bookingsResult.status === 'fulfilled') {
        setBookings(bookingsResult.value.data.bookings || []);
      } else {
        setError(bookingsResult.reason.response?.data?.message || 'We could not load your assigned bookings.');
      }
      if (providerResult.status === 'fulfilled') {
        setProvider(providerResult.value.data.provider || null);
      } else if (providerResult.reason.response?.status !== 404) {
        setError((current) => current || 'We could not load your provider profile.');
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const pendingCount = bookings.filter((booking) => booking.status === 'Pending' || booking.status === 'Confirmed').length;
  const activeCount = bookings.filter((booking) => ACTIVE_STATUSES.includes(booking.status)).length;
  const completedCount = bookings.filter((booking) => booking.status === 'Completed').length;

  return (
    <section className="container-custom min-h-[60vh] py-8 sm:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Provider account</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Your dashboard</h1>
          <p className="mt-2 text-slate-600">Bookings and profile details from your One Call Service account.</p>
        </div>
        <Link to="/notifications" className="text-sm font-bold text-blue-700 hover:text-blue-900">View notifications</Link>
      </div>

      {error && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}

      {provider && (
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm"><UserCircle className="h-6 w-6" /></div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900">{provider.serviceCategory}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              {provider.location && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-blue-600" />{provider.location}</span>}
              {provider.experience && <span>{provider.experience} experience</span>}
            </div>
          </div>
          {provider.isVerified && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Verified</span>}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { title: 'Pending', value: pendingCount, icon: Clock3 },
          { title: 'In progress', value: activeCount, icon: CalendarDays },
          { title: 'Completed', value: completedCount, icon: CheckCircle2 },
        ].map(({ title, value, icon: Icon }) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">{title}</p>
              <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-extrabold text-slate-900">Your assigned bookings</h2>
          <p className="mt-1 text-sm text-slate-500">Bookings assigned to your provider account.</p>
        </div>
        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-xl bg-slate-100" />)}</div>
        ) : bookings.length ? (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <article key={booking._id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{booking.serviceName || booking.serviceId?.name || 'Service booking'}</h3>
                    <p className="mt-1 text-xs text-slate-500">Booking ID: {booking.bookingId}</p>
                    {booking.customerDetails?.fullName && <p className="mt-2 text-sm text-slate-600">Customer: {booking.customerDetails.fullName}</p>}
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                  {booking.date && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-blue-600" />{formatDate(booking.date)}</span>}
                  {booking.timeSlot && <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-blue-600" />{booking.timeSlot}</span>}
                  {booking.location?.city && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-blue-600" />{booking.location.city}</span>}
                  {booking.customerDetails?.phone && <a href={`tel:${booking.customerDetails.phone}`} className="font-semibold text-blue-700 hover:text-blue-900">{booking.customerDetails.phone}</a>}
                  {booking.finalAmount != null && <span className="font-bold text-slate-800">₹{booking.finalAmount}</span>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-blue-600" aria-hidden="true" />
            <h3 className="mt-3 font-bold text-slate-900">No assigned bookings yet</h3>
            <p className="mt-1 text-sm text-slate-600">When a booking is assigned to your provider account, it will appear here.</p>
          </div>
        )}
      </section>
    </section>
  );
}
