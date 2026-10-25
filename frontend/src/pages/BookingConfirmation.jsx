import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Copy } from 'lucide-react';
import api from '../services/api';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState('');

  useEffect(() => {
    if (booking) return undefined;
    let active = true;
    api.get('/bookings/my-bookings')
      .then(({ data }) => {
        if (!active) return;
        const matchedBooking = (data.bookings || []).find((item) => item.bookingId === bookingId);
        if (matchedBooking) {
          setBooking(matchedBooking);
        } else {
          setError('We could not find this booking in your account.');
        }
      })
      .catch(() => {
        if (active) setError('We could not load this booking. Please check your bookings and try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [booking, bookingId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookingId);
      alert('Booking ID copied!');
    } catch {
      setError('Could not copy the booking ID. You can select and copy it manually.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="container-custom max-w-2xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <CheckCircle className="mx-auto mb-5 h-16 w-16 text-blue-600" aria-hidden="true" />
          <h1 className="text-3xl font-extrabold text-slate-900">Booking received</h1>
          <p className="mb-7 mt-2 text-slate-600">Your booking details and status are available below.</p>

          <div className="mb-6 rounded-2xl bg-slate-50 p-5">
            <p className="mb-2 text-sm text-slate-500">Booking ID</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <p className="break-all text-xl font-extrabold text-blue-800 sm:text-2xl">{bookingId}</p>
              <button type="button" onClick={copyToClipboard} aria-label="Copy booking ID" className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700">
                <Copy size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          {loading ? (
            <p className="py-5 text-sm text-slate-600">Loading booking details...</p>
          ) : booking ? (
            <dl className="mb-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-left">
              <div><dt className="text-sm text-slate-500">Service</dt><dd className="mt-1 font-semibold text-slate-900">{booking.serviceName}</dd></div>
              <div><dt className="text-sm text-slate-500">Amount</dt><dd className="mt-1 font-semibold text-slate-900">₹{booking.finalAmount}</dd></div>
              <div><dt className="text-sm text-slate-500">Date</dt><dd className="mt-1 font-semibold text-slate-900">{new Date(booking.date).toLocaleDateString()}</dd></div>
              <div><dt className="text-sm text-slate-500">Time</dt><dd className="mt-1 font-semibold text-slate-900">{booking.timeSlot}</dd></div>
              {booking.status && <div><dt className="text-sm text-slate-500">Status</dt><dd className="mt-1 font-semibold text-blue-800">{booking.status}</dd></div>}
              {booking.paymentMethod && <div><dt className="text-sm text-slate-500">Payment</dt><dd className="mt-1 font-semibold text-slate-900">{booking.paymentMethod}</dd></div>}
            </dl>
          ) : !error ? (
            <p className="py-5 text-sm text-slate-600">Booking details are not available.</p>
          ) : null}

          <div className="mb-7 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-left">
            <h2 className="font-bold text-blue-950">What next?</h2>
            <p className="mt-1 text-sm leading-6 text-blue-900">Check My Bookings for status updates. Notifications from One Call Service appear in your notifications.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/my-bookings" className="btn-primary flex-1 text-center">View my bookings</Link>
            <Link to="/" className="btn-secondary flex-1 text-center">Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
