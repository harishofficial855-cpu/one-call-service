import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store';
import {
  User, Phone, Mail, Briefcase, MapPin, Clock,
  Lock, ChevronDown, CheckCircle, Upload, X,
} from 'lucide-react';

const SERVICE_CATEGORIES = [
  'Haircut','Women Haircut','Plumber','Electrician',
  'Water Tank Cleaning','House Cleaning','Reels / Event Video Shoot',
  'Chef','Security','Water Can','Tent Service',
  'Goat Cutter','Chicken Cutter','Yoga & Diet Teacher',
  'Nurse','Physiotherapy','Food Diet Teacher','Caretaker','Other',
];

const CATEGORY_ICONS = {
  'Haircut':'✂️','Women Haircut':'💇♀️','Plumber':'🔧','Electrician':'⚡',
  'Water Tank Cleaning':'💧','House Cleaning':'🧹','Reels / Event Video Shoot':'🎬',
  'Chef':'👨‍🍳','Security':'🛡️','Water Can':'🪣','Tent Service':'⛺',
  'Goat Cutter':'🐐','Chicken Cutter':'🍗','Yoga & Diet Teacher':'🧘',
  'Nurse':'👩‍⚕️','Physiotherapy':'💪','Food Diet Teacher':'🥗',
  'Caretaker':'🤝','Other':'🛠️',
};

const INIT = {
  email:'', password:'', confirmPassword:'',
  providerName:'', phone:'', serviceCategory:'', serviceName:'',
  experience:'', serviceLocation:'', address:'',
  availableTime:'', description:'',
};

export default function RegisterProvider() {
  const [form, setForm] = useState(INIT);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const existingUser = useAuthStore((s) => s.user);

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError('Image must be under 5MB');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!existingUser) {
      if (form.password !== form.confirmPassword) return setError('Passwords do not match');
      if (form.password.length < 6) return setError('Password must be at least 6 characters');
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
      return setError('Enter a valid 10-digit Indian mobile number');

    setLoading(true);
    try {
      let token = useAuthStore.getState().token;

      // Step 1: register account if not logged in
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

      // Step 2: upload photo if selected
      let profilePhoto = '';
      if (photoFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append('image', photoFile);
        const upRes = await api.post('/upload', fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token || useAuthStore.getState().token}`,
          },
        });
        profilePhoto = upRes.data.url;
        setUploading(false);
      }

      // Step 3: register service
      await api.post('/services', {
        name: form.serviceName,
        category: form.serviceCategory,
        description: form.description,
        basePrice: 0,
        providerName: form.providerName || existingUser?.name,
        phone: form.phone,
        experience: form.experience,
        serviceLocation: form.serviceLocation,
        address: form.address,
        availableTime: form.availableTime,
        profilePhoto,
      }, {
        headers: { Authorization: `Bearer ${token || useAuthStore.getState().token}` },
      });

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
        <div className="bg-[#fffef9] rounded-3xl shadow-xl p-12 text-center max-w-md w-full border border-[#e8e0cc]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-[#2c2416] mb-2">Service Registered Successfully!</h2>
          <p className="text-amber-600 mb-4">Your service is now live on the Home Page.</p>
          <p className="text-[#b8a98a] text-sm">Redirecting to Home Page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4 shadow-lg shadow-amber-200">
            <Briefcase className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-black text-[#2c2416]">Register Your Service</h1>
          <p className="text-[#7a6a4a] mt-1">Join One Call Service — reach thousands of customers</p>
        </div>

        <div className="bg-[#fffef9] rounded-3xl shadow-lg border border-[#e8e0cc] p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Info */}
            <Section title="Personal Information" icon={User} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" name="providerName" value={form.providerName} onChange={set} icon={User} placeholder="Your full name" required />
              <Field label="Mobile Number" name="phone" value={form.phone} onChange={set} icon={Phone} placeholder="9999999999" type="tel" required />
            </div>
            {!existingUser && (
              <Field label="Email Address" name="email" value={form.email} onChange={set} icon={Mail} placeholder="you@example.com" type="email" required />
            )}

            {/* Service Details */}
            <div className="border-t-2 border-[#f0ebe0] pt-5">
              <Section title="Service Details" icon={Briefcase} />

              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#2c2416] mb-1">Service Category</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3.5 text-amber-400" size={18} />
                  <select name="serviceCategory" value={form.serviceCategory} onChange={set} required
                    className="w-full pl-10 pr-8 py-3 border-2 border-[#e8e0cc] rounded-xl bg-[#fffef9] text-[#2c2416] focus:outline-none focus:border-amber-400 transition-all text-sm appearance-none">
                    <option value="">Select a category</option>
                    {SERVICE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-amber-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Service Name" name="serviceName" value={form.serviceName} onChange={set} icon={Briefcase} placeholder="e.g. Home Haircut" required />
                <Field label="Experience" name="experience" value={form.experience} onChange={set} icon={Clock} placeholder="e.g. 3 years" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Field label="Service Location" name="serviceLocation" value={form.serviceLocation} onChange={set} icon={MapPin} placeholder="City / Area" required />
                <Field label="Available Time" name="availableTime" value={form.availableTime} onChange={set} icon={Clock} placeholder="e.g. 9 AM – 6 PM" required />
              </div>

              <div className="mt-4">
                <Field label="Full Address" name="address" value={form.address} onChange={set} icon={MapPin} placeholder="Street, Area, City, Pincode" required />
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-[#2c2416] mb-1">
                  Service Description
                  <span className={`ml-2 text-xs font-normal ${form.description.length > 8500 ? 'text-red-500' : 'text-[#b8a98a]'}`}>
                    {form.description.length} / 9000
                  </span>
                </label>
                <textarea name="description" value={form.description} onChange={set}
                  rows={4} maxLength={9000} required
                  placeholder="Describe your service, skills, and what customers can expect..."
                  className="w-full px-4 py-3 border-2 border-[#e8e0cc] rounded-xl bg-[#fffef9] text-[#2c2416] placeholder-[#b8a98a] focus:outline-none focus:border-amber-400 transition-all text-sm resize-none" />
              </div>

              {/* Profile Photo Upload */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-[#2c2416] mb-2">
                  Profile Photo <span className="text-[#b8a98a] font-normal">(optional)</span>
                </label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />

                {photoPreview ? (
                  <div className="flex items-center gap-4">
                    <img src={photoPreview} alt="preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-200 shadow-sm" />
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => fileRef.current.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-all">
                        <Upload size={14} /> Change Photo
                      </button>
                      <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(''); }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all">
                        <X size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-[#e8e0cc] rounded-2xl hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Upload className="text-amber-500" size={22} />
                    </div>
                    <p className="text-[#5c4a2a] font-semibold text-sm">Click to upload from gallery</p>
                    <p className="text-[#b8a98a] text-xs">JPG, PNG, WEBP — max 5MB</p>
                  </button>
                )}
              </div>
            </div>

            {/* Password */}
            {!existingUser && (
              <div className="border-t-2 border-[#f0ebe0] pt-5">
                <Section title="Account Password" icon={Lock} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Password" name="password" value={form.password} onChange={set} icon={Lock} placeholder="Min 6 characters" type="password" required />
                  <Field label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={set} icon={Lock} placeholder="Repeat password" type="password" required />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading || uploading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-200 transition-all text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading || uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {uploading ? 'Uploading photo...' : 'Registering...'}
                </span>
              ) : '🔧 Register Service'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon }) {
  return (
    <p className="text-amber-700 font-bold text-sm mb-4 flex items-center gap-2">
      <Icon size={16} /> {title}
    </p>
  );
}

function Field({ label, name, value, onChange, icon: Icon, placeholder, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#2c2416] mb-1">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3.5 text-amber-400" size={18} />}
        <input type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          className="w-full pl-10 pr-4 py-3 border-2 border-[#e8e0cc] rounded-xl bg-[#fffef9] text-[#2c2416] placeholder-[#b8a98a] focus:outline-none focus:border-amber-400 transition-all text-sm" />
      </div>
    </div>
  );
}
