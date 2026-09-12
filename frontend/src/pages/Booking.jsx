import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store';
import { ArrowRight, MapPin } from 'lucide-react';

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceId: location.state?.serviceId || '',
    date: '',
    timeSlot: '',
    location: {
      street: user?.address?.street || '',
      area: user?.address?.area || '',
      city: user?.address?.city || '',
      pincode: user?.address?.pincode || '',
      landmark: '',
    },
    customerDetails: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
    },
    instructions: '',
    paymentMethod: 'Cash on Service',
  });

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.serviceId) {
      alert('Please select a service');
      return;
    }

    try {
      // First, get service details to calculate amount
      const serviceResponse = await api.get(`/services/${formData.serviceId}`);
      const service = serviceResponse.data.service;

      const bookingData = {
        ...formData,
        serviceAmount: service.basePrice,
        discount: 0,
        finalAmount: service.basePrice,
      };

      const response = await api.post('/bookings', bookingData);
      navigate(`/booking/confirmation/${response.data.bookingId}`, {
        state: { booking: response.data.booking },
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Book a Service</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress */}
        <div className="lg:col-span-1">
          <div className="card-shadow p-6 sticky top-20">
            <h3 className="font-bold text-lg mb-4">Booking Steps</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    s <= step
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <p className="font-semibold">
                    Step {s}: {s === 1 ? 'Select Service' : s === 2 ? 'Choose Date & Time' : 'Enter Details'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 card-shadow p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service ID
                </label>
                <input
                  type="text"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  placeholder="Enter Service ID or select from services page"
                  className="input-field"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary mt-6 flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Choose Date & Time</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select time slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Enter Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="customerDetails.fullName"
                      value={formData.customerDetails.fullName}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="customerDetails.phone"
                      value={formData.customerDetails.phone}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customerDetails.email"
                    value={formData.customerDetails.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-4 flex items-center space-x-2">
                    <MapPin size={20} />
                    <span>Service Address</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="location.street"
                      placeholder="Street"
                      value={formData.location.street}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                    <input
                      type="text"
                      name="location.area"
                      placeholder="Area"
                      value={formData.location.area}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                    <input
                      type="text"
                      name="location.city"
                      placeholder="City"
                      value={formData.location.city}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                    <input
                      type="text"
                      name="location.pincode"
                      placeholder="Pincode"
                      value={formData.location.pincode}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    name="location.landmark"
                    placeholder="Landmark (Optional)"
                    value={formData.location.landmark}
                    onChange={handleChange}
                    className="input-field mt-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="Any special instructions for the service provider..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Cash on Service">Cash on Service</option>
                    <option value="Online Payment">Online Payment</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
