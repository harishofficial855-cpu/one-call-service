import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store';
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, MapPin, Wrench } from 'lucide-react';

const STEPS = ['Choose service', 'Date & time', 'Your details'];

export default function Booking() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const user = useAuthStore((state) => state.user);

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: routeLocation.state?.serviceId || '',
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

  useEffect(() => {
    let active = true;
    api.get('/services')
      .then(({ data }) => {
        if (active) setServices(data.services || []);
      })
      .catch(() => {
        if (active) setServicesError('Available services could not be loaded. Please try again.');
      })
      .finally(() => {
        if (active) setServicesLoading(false);
      });
    return () => { active = false; };
  }, []);

  const selectedService = services.find((service) => service._id === formData.serviceId);

  useEffect(() => {
    if (servicesLoading || !formData.serviceId || services.some((service) => service._id === formData.serviceId)) return;
    setFormData((current) => ({ ...current, serviceId: '' }));
    setFormError('The selected service is no longer available. Please choose an available listing.');
  }, [formData.serviceId, services, servicesLoading]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormError('');
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((current) => ({
        ...current,
        [parent]: { ...current[parent], [child]: value },
      }));
    } else {
      setFormData((current) => ({ ...current, [name]: value }));
    }
  };

  const advanceStep = () => {
    setFormError('');
    if (step === 1 && !selectedService) {
      setFormError('Choose an available service before continuing.');
      return;
    }
    if (step === 2) {
      if (!formData.date || !formData.timeSlot) {
        setFormError('Choose a preferred date and time to continue.');
        return;
      }
      const selectedDate = new Date(`${formData.date}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setFormError('Choose today or a future date.');
        return;
      }
    }
    setStep((current) => Math.min(current + 1, STEPS.length));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!selectedService) {
      setStep(1);
      setFormError('Choose an available service before submitting your booking.');
      return;
    }
    if (!formData.date || !formData.timeSlot) {
      setStep(2);
      setFormError('Choose a preferred date and time before submitting your booking.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', {
        ...formData,
        serviceAmount: selectedService.basePrice,
        discount: 0,
        finalAmount: selectedService.basePrice,
      });
      navigate(`/booking/confirmation/${data.bookingId}`, {
        state: { booking: data.booking },
      });
    } catch (error) {
      setFormError(error.response?.data?.message || 'Your booking could not be submitted. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[65vh] bg-slate-50 py-8 sm:py-12">
      <div className="container-custom max-w-6xl">
        <Link to="/services" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to services
        </Link>
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Booking request</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Book a real service</h1>
          <p className="mt-2 text-slate-600">Choose from active listings and submit your details to create a booking.</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Booking progress">
              {STEPS.map((label, index) => {
                const stepNumber = index + 1;
                const active = stepNumber === step;
                const complete = stepNumber < step;
                return (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => {
                        if (stepNumber < step) {
                          setStep(stepNumber);
                          setFormError('');
                        }
                      }}
                      disabled={stepNumber > step}
                      aria-current={active ? 'step' : undefined}
                      className={`flex w-full items-center gap-2 rounded-xl px-2 py-3 text-left text-xs font-bold sm:px-3 sm:text-sm ${active ? 'bg-blue-700 text-white' : complete ? 'bg-blue-50 text-blue-800' : 'bg-slate-100 text-slate-400'}`}
                    >
                      {complete ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">{stepNumber}</span>}
                      <span className="leading-tight">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {formError && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{formError}</p>}

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Select an available service</h2>
                  <p className="mb-5 mt-1 text-sm text-slate-500">Listings and prices are loaded from One Call Service.</p>
                  {servicesError ? (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{servicesError}</div>
                  ) : (
                    <label htmlFor="serviceId" className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Service</span>
                      <select
                        id="serviceId"
                        name="serviceId"
                        value={formData.serviceId}
                        onChange={handleChange}
                        className="input-field"
                        required
                        disabled={servicesLoading || services.length === 0}
                      >
                        <option value="">{servicesLoading ? 'Loading available services…' : 'Choose a service'}</option>
                        {services.map((service) => (
                          <option key={service._id} value={service._id}>
                            {service.name} — ₹{service.basePrice}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {!servicesLoading && !servicesError && services.length === 0 && (
                    <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No services available right now.</p>
                  )}
                  {selectedService && (
                    <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                      <p className="font-bold text-slate-900">{selectedService.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{selectedService.category}</p>
                      {selectedService.providerName && <p className="mt-2 text-sm text-slate-600">Provider: {selectedService.providerName}</p>}
                      {selectedService.serviceLocation && <p className="mt-1 text-sm text-slate-600">Location: {selectedService.serviceLocation}</p>}
                      <p className="mt-3 font-extrabold text-blue-800">Starting price: ₹{selectedService.basePrice}</p>
                    </div>
                  )}
                  <button type="button" onClick={advanceStep} disabled={!selectedService || servicesLoading || Boolean(servicesError)} className="btn-primary mt-6 inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50">
                    Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Choose date and time</h2>
                  <p className="mb-5 mt-1 text-sm text-slate-500">Select when you would like the service.</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><CalendarDays className="h-4 w-4 text-blue-600" /> Preferred date</span>
                      <input type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toLocaleDateString('en-CA')} className="input-field" required />
                    </label>
                    <label>
                      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><Clock3 className="h-4 w-4 text-blue-600" /> Preferred time</span>
                      <input type="time" name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="input-field" required />
                    </label>
                  </div>
                  {selectedService?.availableTime && <p className="mt-4 text-sm text-slate-600">Provider availability: {selectedService.availableTime}</p>}
                  <div className="mt-6 flex gap-3">
                    <button type="button" onClick={() => { setStep(1); setFormError(''); }} className="btn-secondary inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Back</button>
                    <button type="button" onClick={advanceStep} className="btn-primary inline-flex items-center gap-2">Continue <ArrowRight className="h-4 w-4" /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Your contact and address</h2>
                  <p className="mb-5 mt-1 text-sm text-slate-500">These details will be included with your booking request.</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
                      <input type="text" name="customerDetails.fullName" value={formData.customerDetails.fullName} onChange={handleChange} autoComplete="name" className="input-field" required />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Phone</span>
                      <input type="tel" name="customerDetails.phone" value={formData.customerDetails.phone} onChange={handleChange} autoComplete="tel" className="input-field" required />
                    </label>
                    <label className="sm:col-span-2">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
                      <input type="email" name="customerDetails.email" value={formData.customerDetails.email} onChange={handleChange} autoComplete="email" className="input-field" required />
                    </label>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900"><MapPin className="h-5 w-5 text-blue-600" /> Service address</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label><span className="sr-only">Street</span><input type="text" name="location.street" placeholder="Street" value={formData.location.street} onChange={handleChange} autoComplete="street-address" className="input-field" required /></label>
                      <label><span className="sr-only">Area</span><input type="text" name="location.area" placeholder="Area" value={formData.location.area} onChange={handleChange} className="input-field" required /></label>
                      <label><span className="sr-only">City</span><input type="text" name="location.city" placeholder="City" value={formData.location.city} onChange={handleChange} autoComplete="address-level2" className="input-field" required /></label>
                      <label><span className="sr-only">Pincode</span><input type="text" name="location.pincode" placeholder="Pincode" value={formData.location.pincode} onChange={handleChange} autoComplete="postal-code" inputMode="numeric" className="input-field" required /></label>
                    </div>
                    <label className="mt-4 block"><span className="sr-only">Landmark (optional)</span><input type="text" name="location.landmark" placeholder="Landmark (optional)" value={formData.location.landmark} onChange={handleChange} className="input-field" /></label>
                  </div>

                  <label className="mt-5 block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Instructions (optional)</span>
                    <textarea name="instructions" value={formData.instructions} onChange={handleChange} className="input-field" rows="3" placeholder="Add any details that may help the provider" />
                  </label>

                  <label className="mt-5 block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Payment method</span>
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="input-field">
                      <option value="Cash on Service">Cash on Service</option>
                      <option value="Online Payment">Online Payment</option>
                    </select>
                  </label>

                  <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                    <button type="button" onClick={() => { setStep(2); setFormError(''); }} className="btn-secondary inline-flex items-center justify-center gap-2"><ArrowLeft className="h-4 w-4" /> Back</button>
                    <button type="submit" disabled={submitting || !selectedService} className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60">
                      {submitting ? 'Submitting booking…' : 'Confirm booking'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="font-extrabold text-slate-900">Booking summary</h2>
            {selectedService ? (
              <>
                <div className="mt-4 flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-blue-50">
                  {selectedService.image
                    ? <img src={selectedService.image} alt={selectedService.name} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                    : <Wrench className="h-10 w-10 text-blue-600" aria-hidden="true" />}
                </div>
                <p className="mt-4 font-bold text-slate-900">{selectedService.name}</p>
                <p className="mt-1 text-sm text-slate-500">{selectedService.category}</p>
                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex justify-between gap-3"><span className="text-slate-500">Starting price</span><span className="font-bold text-slate-900">₹{selectedService.basePrice}</span></div>
                  {formData.date && <div className="flex justify-between gap-3"><span className="text-slate-500">Preferred date</span><span className="font-medium text-slate-800">{formData.date}</span></div>}
                  {formData.timeSlot && <div className="flex justify-between gap-3"><span className="text-slate-500">Preferred time</span><span className="font-medium text-slate-800">{formData.timeSlot}</span></div>}
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">The displayed price comes from the service listing. Final booking details are confirmed by the backend.</p>
              </>
            ) : (
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-8 text-center">
                <Wrench className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
                <p className="mt-3 text-sm text-slate-600">{servicesLoading ? 'Loading live services…' : 'Select a listing to see its booking details.'}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
