import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store';
import { User, Mail, Phone, Lock, Briefcase, MapPin, Clock, DollarSign, FileText, Image, ChevronDown } from 'lucide-react';

const SERVICE_CATEGORIES = [
  'Haircut', 'Women Haircut', 'Plumber', 'Electrician', 'Painting Service', 'Electronics Repair Service', 'Chef',
  'Nurse', 'Water Tank Cleaning', 'Reels / Event Video Shoot', 'Security', 'Tent Service',
  'Goat Cutter', 'Chicken Cutter', 'Yoga & Diet Teacher',
  'Physiotherapy', 'Food Diet Teacher', 'Caretaker', 'Other',
];

const INITIAL = {
  name: '', email: '', phone: '', password: '', confirmPassword: '',
  role: 'customer',
  serviceCategory: '', serviceName: '', experience: '',
  serviceLocation: '', address: '', servicePrice: '',
  availableTime: '', serviceDescription: '', profilePhoto: '', idProof: '',
};

export default function Register() {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);

  const isProvider = form.role === 'provider';

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      loginStore(data.user, data.token);
      const redirect = { admin: '/admin/dashboard', provider: '/provider/dashboard', customer: '/dashboard' };
      navigate(redirect[data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', icon: Icon, placeholder, required }) => (
    <div>
      <label className="block text-sm font-semibold text-blue-900 mb-1">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3.5 text-blue-400" size={18} />}
        <input
          type={type} name={name} value={form[name]}
          onChange={set} placeholder={placeholder} required={required}
          className="w-full pl-10 pr-4 py-3 border-2 border-blue-100 rounded-xl bg-white text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 transition-all text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <User className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-black text-blue-900">Create Account</h1>
          <p className="text-blue-500 mt-1">Join One Call Service today</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100 border border-blue-50 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Toggle */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-2">Register As</label>
              <div className="grid grid-cols-2 gap-3">
                {['customer', 'provider'].map((r) => (
                  <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                    className={`py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                      form.role === r
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                        : 'bg-white border-blue-100 text-blue-400 hover:border-blue-300'
                    }`}>
                    {r === 'customer' ? '👤 Customer' : '🔧 Service Provider'}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" name="name" icon={User} placeholder="Your full name" required />
              <Field label="Mobile Number" name="phone" type="tel" icon={Phone} placeholder="+91 9999999999" required />
            </div>
            <Field label="Email Address" name="email" type="email" icon={Mail} placeholder="you@example.com" required />

            {/* Provider-specific fields */}
            {isProvider && (
              <>
                <div className="border-t-2 border-blue-50 pt-5">
                  <p className="text-blue-700 font-bold text-sm mb-4 flex items-center gap-2">
                    <Briefcase size={16} /> Service Details
                  </p>
                  <div className="space-y-4">
                    {/* Service Category */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-1">Service Category</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 text-blue-400" size={18} />
                        <select name="serviceCategory" value={form.serviceCategory} onChange={set} required
                          className="w-full pl-10 pr-8 py-3 border-2 border-blue-100 rounded-xl bg-white text-blue-900 focus:outline-none focus:border-blue-500 transition-all text-sm appearance-none">
                          <option value="">Select a category</option>
                          {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-blue-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Service Name" name="serviceName" icon={Briefcase} placeholder="e.g. Home Haircut" required />
                      <Field label="Experience" name="experience" icon={Clock} placeholder="e.g. 3 years" required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Service Location" name="serviceLocation" icon={MapPin} placeholder="City / Area" required />
                      <Field label="Service Price (₹)" name="servicePrice" icon={DollarSign} placeholder="e.g. 500" required />
                    </div>

                    <Field label="Full Address" name="address" icon={MapPin} placeholder="Street, Area, City" required />
                    <Field label="Available Time" name="availableTime" icon={Clock} placeholder="e.g. 9 AM – 6 PM" required />

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-1">Description</label>
                      <textarea name="serviceDescription" value={form.serviceDescription} onChange={set}
                        rows={3} placeholder="Describe your service..." required
                        className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl bg-white text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 transition-all text-sm resize-none" />
                    </div>

                    {/* Profile Photo URL */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-1">Profile Photo URL</label>
                      <div className="relative">
                        <Image className="absolute left-3 top-3.5 text-blue-400" size={18} />
                        <input type="url" name="profilePhoto" value={form.profilePhoto} onChange={set}
                          placeholder="https://your-photo-url.com/photo.jpg"
                          className="w-full pl-10 pr-4 py-3 border-2 border-blue-100 rounded-xl bg-white text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 transition-all text-sm" />
                      </div>
                    </div>

                    {/* ID Proof URL */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-1">
                        ID Proof URL <span className="text-blue-300 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3.5 text-blue-400" size={18} />
                        <input type="url" name="idProof" value={form.idProof} onChange={set}
                          placeholder="https://drive.google.com/..."
                          className="w-full pl-10 pr-4 py-3 border-2 border-blue-100 rounded-xl bg-white text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 transition-all text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div className="border-t-2 border-blue-50 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Password" name="password" type="password" icon={Lock} placeholder="Min 6 characters" required />
                <Field label="Confirm Password" name="confirmPassword" type="password" icon={Lock} placeholder="Repeat password" required />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? 'Registering...' : isProvider ? '🔧 Register as Service Provider' : '👤 Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-blue-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-700 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
