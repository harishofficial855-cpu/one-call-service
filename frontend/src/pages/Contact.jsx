import React, { useState } from 'react';
import api from '../services/api';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send to backend or email service
      await api.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Contact Info */}
        <div className="space-y-4">
          <div className="card-shadow p-6">
            <Mail className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <a href="mailto:support@onecallservice.com" className="text-indigo-600 hover:underline">
              support@onecallservice.com
            </a>
          </div>

          <div className="card-shadow p-6">
            <Phone className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Phone</h3>
            <a href="tel:+919876543210" className="text-indigo-600 hover:underline">
              +91 9876 543 210
            </a>
          </div>

          <div className="card-shadow p-6">
            <MapPin className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Address</h3>
            <p className="text-gray-700">
              One Call Service
              <br />
              Tech Park, Innovation Street
              <br />
              Warangal, Telangana 506001
              <br />
              India
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="card-shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

            {submitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                ✓ Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="input-field"
                required
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="input-field"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card-shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: 'How do I book a service?',
              a: 'Browse our services, select one, and follow the simple 3-step booking process.',
            },
            {
              q: 'Are service providers verified?',
              a: 'Yes, all our providers go through a thorough verification process to ensure quality.',
            },
            {
              q: 'What if I need to cancel a booking?',
              a: 'You can cancel bookings up to 2 hours before the scheduled time with full refund.',
            },
            {
              q: 'How can I become a service provider?',
              a: 'Register as a provider, complete verification, and start accepting bookings.',
            },
          ].map((faq, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
              <p className="text-gray-700">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
