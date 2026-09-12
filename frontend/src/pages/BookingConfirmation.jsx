import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Copy } from 'lucide-react';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const location = useLocation();
  const booking = location.state?.booking;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingId);
    alert('Booking ID copied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container-custom max-w-2xl">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Your service booking has been successfully created
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Booking ID</p>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-3xl font-bold text-indigo-600">{bookingId}</p>
                <button
                  onClick={copyToClipboard}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              {booking ? (
                <div className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Service</p>
                      <p className="font-semibold">{booking.serviceName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold">₹{booking.finalAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold">{booking.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-semibold text-yellow-600">{booking.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment</p>
                      <p className="font-semibold">{booking.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Booking details loading...</p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>✓ A service provider will be assigned within 2 hours</li>
              <li>✓ You'll receive updates via SMS & email</li>
              <li>✓ Provider will call you before arriving</li>
              <li>✓ Rate and review the service after completion</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/my-bookings" className="btn-primary flex-1">
              View My Bookings
            </Link>
            <Link to="/" className="btn-secondary flex-1">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
