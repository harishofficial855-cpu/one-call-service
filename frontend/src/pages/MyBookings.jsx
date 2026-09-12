import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const response = await api.get(`/bookings/my-bookings${params}`);
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['Pending', 'Confirmed', 'Provider Assigned', 'On The Way', 'Service Started', 'Completed', 'Cancelled'];

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-lg transition ${
            !filter ? 'bg-indigo-600 text-white' : 'bg-gray-200'
          }`}
        >
          All
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === status ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{booking.serviceName}</h3>
                  <p className="text-gray-600">ID: {booking.bookingId}</p>
                </div>
                <span className={`px-4 py-2 rounded-lg font-semibold ${
                  booking.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'Cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold">{booking.timeSlot}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold text-indigo-600">₹{booking.finalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment</p>
                  <p className={`font-semibold ${
                    booking.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {booking.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                  <button className="btn-primary">Track</button>
                )}
                {booking.status === 'Completed' && !booking.rating && (
                  <button className="btn-primary">Write Review</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card-shadow p-8">
          <p className="text-xl text-gray-600">No bookings found</p>
        </div>
      )}
    </div>
  );
}
