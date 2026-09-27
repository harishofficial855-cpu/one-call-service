import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store';
import { LogOut, Edit, Bookmark, Camera } from 'lucide-react';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.url) {
        updateUser({ profilePhoto: data.url });
        await api.put('/auth/profile', { profilePhoto: data.url }).catch(() => {});
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.name}!</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card-shadow p-6">
            <div className="relative w-full h-40 mb-4">
              <img
                src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'User')}&background=d97706&color=fff&size=200`}
                alt={user?.name}
                className="w-full h-40 rounded-lg object-cover"
              />
              <button onClick={() => fileRef.current.click()} disabled={uploading}
                className="absolute bottom-2 right-2 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-lg transition"
                title="Change photo">
                {uploading ? <span className="text-xs px-1">...</span> : <Camera size={16} />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </div>
            <h2 className="text-xl font-bold mb-2">{user?.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{user?.email}</p>
            <p className="text-gray-600 text-sm mb-6">{user?.phone}</p>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="btn-primary w-full mb-2 flex items-center justify-center space-x-2"
              >
                <Edit size={18} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
                <button
                  onClick={() => {
                    updateUser(formData);
                    setEditMode(false);
                  }}
                  className="btn-primary w-full mb-2"
                >
                  Save
                </button>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              to="/booking"
              className="card-shadow p-6 hover:shadow-lg transition"
            >
              <p className="text-2xl mb-2">📅</p>
              <h3 className="font-bold">Book a Service</h3>
              <p className="text-sm text-gray-600">Schedule a new service</p>
            </Link>
            <Link
              to="/services"
              className="card-shadow p-6 hover:shadow-lg transition"
            >
              <p className="text-2xl mb-2">🔍</p>
              <h3 className="font-bold">Browse Services</h3>
              <p className="text-sm text-gray-600">Explore available services</p>
            </Link>
          </div>

          {/* Bookings */}
          <div className="card-shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <Bookmark size={24} />
                <span>My Bookings</span>
              </h2>
              <Link to="/my-bookings" className="text-indigo-600 hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <p>Loading bookings...</p>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => (
                  <div key={booking._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{booking.serviceName}</h3>
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        booking.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(booking.date).toLocaleDateString()} - {booking.timeSlot}
                    </p>
                    <p className="text-lg font-bold text-indigo-600">₹{booking.finalAmount}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No bookings yet. Start by booking a service!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
