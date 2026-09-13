import React, { useState } from 'react';
import { Mail, Phone, MapPin, User } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setLoading(false);
      setTimeout(() => setSubmitted(false), 4000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 py-12">
        <div className="container-custom">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-2">Get In Touch</p>
          <h1 className="text-4xl font-black text-white">Contact Us</h1>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Contact Info */}
          <div className="space-y-4">

            {/* Founder Card */}
            <div className="card-shadow p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-amber-400" />
                <span>Our Founder</span>
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src="https://1drv.ms/i/c/250f6a28e9ace4e2/IQCQulF9oh8ZSYysgUXk9CAIAZV42NDPY2u9Pk-em-BaQ2Y?e=7CqMkU"
                  alt="Golanakonda Harish"
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=Golanakonda+Harish&background=f59e0b&color=fff&size=64';
                  }}
                />
                <div>
                  <p className="text-white font-bold">Golanakonda Harish</p>
                  <p className="text-amber-400 text-sm font-semibold">Founder & CEO</p>
                  <p className="text-slate-400 text-xs mt-1">One Call Service</p>
                </div>
              </div>
            </div>

            <div className="card-shadow p-6">
              <Phone className="w-8 h-8 text-amber-400 mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">Phone</h3>
              <a href="tel:+919989730775" className="text-amber-400 hover:text-amber-300 transition-colors">
                +91 9989730775
              </a>
            </div>

            <div className="card-shadow p-6">
              <Mail className="w-8 h-8 text-amber-400 mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">Email</h3>
              <a href="mailto:harishoffical855@gmail.com" className="text-amber-400 hover:text-amber-300 transition-colors break-all">
                harishoffical855@gmail.com
              </a>
            </div>

            <div className="card-shadow p-6">
              <MapPin className="w-8 h-8 text-amber-400 mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">Address</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                One Call Service<br />
                Warangal, Telangana<br />
                India — 506001
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card-shadow p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

              {submitted && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm">
                  ✓ Thank you! Your message has been sent successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="name" placeholder="Your Name"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field" required />
                  <input type="tel" name="phone" placeholder="Your Phone"
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field" required />
                </div>
                <input type="email" name="email" placeholder="Your Email"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field" required />
                <input type="text" name="subject" placeholder="Subject"
                  value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field" required />
                <textarea name="message" placeholder="Your Message"
                  value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="6" className="input-field resize-none" required />
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="card-shadow p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: 'How do I book a service?', a: 'Browse our services, select one, and follow the simple 3-step booking process.' },
              { q: 'Are service providers verified?', a: 'Yes, all our providers go through a thorough verification process to ensure quality.' },
              { q: 'What if I need to cancel a booking?', a: 'You can cancel bookings up to 2 hours before the scheduled time with full refund.' },
              { q: 'How can I become a service provider?', a: 'Register as a provider, complete verification, and start accepting bookings.' },
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                <h3 className="text-white font-bold mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
