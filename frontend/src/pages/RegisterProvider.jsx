import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store';
import {
  User, Phone, Mail, Briefcase, MapPin, Clock,
  DollarSign, FileText, Lock, Image, ChevronDown, CheckCircle,
} from 'lucide-react';

const SERVICE_CATEGORIES = [
  'Haircut', 'Women Haircut', 'Plumber', 'Electrician',
  'Water Tank Cleaning', 'House Cleaning', 'Reels / Event Video Shoot',
  'Chef', 'Security', 'Water Can', 'Tent Service',
  'Goat Cutter', 'Chicken Cutter', 'Yoga & Diet Teacher',
  'Nurse', 'Physiotherapy', 'Food Diet Teacher', 'Caretaker', 'Other',
];

const CATEGORY_ICONS = {
  'Haircut': '✂️', 'Women Haircut': '💇‍♀️', 'Plumber': '🔧', 'Electrician': '⚡',
  'Water Tank Cleaning': '💧', 'House Cleaning': '🧹', 'Reels / Event Video Shoot': '🎬',
  'Chef': '👨‍🍳', 'Security': '🛡️', 'Water Can': '🪣', 'Tent Service': '⛺',
  'Goat Cutter': '🐐', 'Chicken Cutter': '🍗', 'Yoga & Diet Teacher': '🧘',
  'Nurse': '👩‍⚕️', 'Physiotherapy': '💪', 'Food Diet Teacher': '🥗',
  'Caretaker': '🤝', 'Other': '🛠️',
};

const INIT = {
  // Auth fields
  email: '', password: '', confirmPassword: '',
  // Provider fields
  providerName: '', phone: '', serviceCategory: '', serviceName: '',
  experience: '', serviceLocation: '', address: '',
  servicePrice: '', availableTime: '', description: '', profilePhoto: '',
};

export default function RegisterProvider() {
  const [form, setForm] = useState(INIT);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const existingUser = useAuthStore((s) => s.user);

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!existingUser) {
      if (form.password !== form.confirmPassword)
        return setError('Passwords do not match');
      if (form.password.length < 6)
        return setError('Password must be at least 6 characters');
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
      return setError('Enter a valid 10-digit Indian mobile number');
    if (isNaN(Number(form.servicePrice)) || Number(form.servicePrice) <= 0)
      return setError('Enter a valid service price');

    setLoading(true);
    try {
      let token = useAuthStore.getState().token;

      // Step 1: Register user account if not logged in
      if (!existingUser) {
        const authRes = await api.post('/auth/register', {
          name: form.providerName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          confirmPassword: form.confirmPassword,
          role: 'provider',
        });
        loginStore(authRes.data.user, authRes.data.token);
        token = authRes.data.token;
      }

      // Step 2: Register the service
      await api.post('/services', {
        name: form.serviceName,
        category: form.serviceCategory,
        description: form.description,
        basePrice: Number(form.servicePrice),
        providerName: form.providerName || existingUser?.name,
        phone: form.phone,
        experience: form.experience,
        serviceLocation: form.serviceLocation,
        address: form.address,
        availableTime: form.availableTime,
        profilePhoto: form.profilePhoto,
      }, {
        headers: { Authorization: `Bearer ${token || useAuthStore.getState().token}` },
      });

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md w-full border border-blue-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-blue-900 mb-2">Service Registered Successfully!</h2>
          <p className="text-blue-500 mb-4">Your service is now live on the Home Page.</p>
          <p className="text-blue-300 text-sm">Redirecting to Home Page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <Briefcase className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-black text-blue-900">Register Your Service</h1>
          <p className="text-blue-500 mt-1">Join One Call Service — reach thousands of customers</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-blue-50 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Info */}
            <SectionTitle icon={User} title="Personal Information" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" name="providerName" value={form.providerName} onChange={set}
                icon={User} placeholder="Your full name" required />
              <Field label="Mobile Number" name="phone" value={form.phone} onChange={set}
                icon={Phone} placeholder="9999999999" type="tel" required />
            </div>

            {!existingUser && (
              <Field label="Email Address" name="email" value={form.email} onChange={set}
                icon={Mail} placeholder="you@example.com" type="email" required />
            )}

            {/* Service Info */}
            <div className="border-t-2 border-blue-50 pt-5">
              <SectionTitle icon={Briefcase} title="Service Details" />

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-blue-900 mb-1">Service Category</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3.5 text-blue-400" size={18} />
                  <select name="serviceCategory" value={form.serviceCategory} onChange={set} required
                    className="w-full pl-10 pr-8 py-3 border-2 border-blue-100 rounded-xl bg-white text-blue-900 focus:outline-none focus:border-blue-500 transition-all text-sm appearance-none">
                    <option value="">Select a category</option>
                    {SERVICE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-blue-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Service Name" name="serviceName" value={form.serviceName} onChange={set}
                  icon={Briefcase} placeholder="e.g. Home Haircut" required />
                <Field label="Experience" name="experience" value={form.experience} onChange={set}
                  icon={Clock} placeholder="e.g. 3 years" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Field label="Service Location" name="serviceLocation" value={form.serviceLocation} onChange={set}
                  icon={MapPin} placeholder="City / Area" required />
                <Field label="Service Price (₹)" name="servicePrice" value={form.servicePrice} onChange={set}
                  icon={DollarSign} placeholder="e.g. 500" type="number" required />
              </div>

              <div className="mt-4">
                <Field label="Full Address" name="address" value={form.address} onChange={set}
                  icon={MapPin} placeholder="Street, Area, City, Pincode" required />
              </div>

              <div className="mt-4">
                <Field label="Available Time" name="availableTime" value={form.availableTime} onChange={set}
                  icon={Clock} placeholder="e.g. Mon–Sat, 9 AM – 6 PM" required />
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-blue-900 mb-1">
                  Service Description
                  <span className={`ml-2 text-xs font-normal ${form.description.length > 8500 ? 'text-red-500' : 'text-blue-300'}`}>
                    {form.description.length} / 9000
                  </span>
                </label>
                <textarea name="description" value={form.description} onChange={set}
                  rows={4} maxLength={9000} required
                  placeholder="Describe your service, skills, and what customers can expect..."
                  className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl bg-white text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 transition-all text-sm resize-none" />
              </div>

              {/* Profile Photo */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-blue-900 mb-1">
                  Profile Photo URL <span className="text-blue-300 font-normal">(optional)</span>
                </label>
                <div className="flex gap-3 items-start">
                  <div className="relative flex-1">
                    <Image className="absolute left-3 top-3.5 text-blue-400" size={18} />
                    <input type="url" name="profilePhoto" value={form.profilePhoto} onChange={set}
                      placeholder="https://your-photo-url.com/photo.jpg"
                      className="w-full pl-10 pr-4 py-3 border-2 border-blue-100 rounded-xl bg-white text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 transition-all text-sm" />
                  </div>
                  {form.profilePhoto && (
                    <img src={form.profilePhoto} alt="preview"
                      onError={(e) => { e.target.style.display = 'none'; }}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-blue-100 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>

            {/* Password — only if not logged in */}
            {!existingUser && (
              <div className="border-t-2 border-blue-50 pt-5">
                <SectionTitle icon={Lock} title="Account Password" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Password" name="password" value={form.password} onChange={set}
                    icon={Lock} placeholder="Min 6 characters" type="password" required />
                  <Field label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={set}
                    icon={Lock} placeholder="Repeat password" type="password" required />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Registering...
                </span>
              ) : '🔧 Register Service'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <p className="text-blue-700 font-bold text-sm mb-4 flex items-center gap-2">
      <Icon size={16} /> {title}
    </p>
  );
}

function Field({ label, name, value, onChange, icon: Icon, placeholder, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-blue-900 mb-1">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3.5 text-blue-400" size={18} />}
        <input type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          className="w-full pl-10 pr-4 py-3 border-2 border-blue-100 rounded-xl bg-white text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 transition-all text-sm" />
      </div>
    </div>
  );
}
