import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, BadgeCheck, Clock3, MapPin, Phone, Star, UserCircle, Wrench } from 'lucide-react';

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [imageFailed, setImageFailed] = useState(false);
  const [profileImageFailed, setProfileImageFailed] = useState(false);

  useEffect(() => {
    let active = true;
    let serviceLoaded = false;
    setLoading(true);
    setError('');
    api.get(`/services/${id}`)
      .then(({ data }) => {
        serviceLoaded = true;
        if (active) setService(data.service);
        return api.get(`/reviews/service/${id}`);
      })
      .then(({ data }) => {
        if (active) setReviews(data.reviews || []);
      })
      .catch((requestError) => {
        if (!active) return;
        if (!serviceLoaded) {
          setError(requestError.response?.data?.message || 'We could not load this service. Please try again.');
        } else {
          console.error('Error fetching service reviews:', requestError);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return <div className="container-custom py-16 text-center text-slate-600">Loading service details...</div>;
  }

  if (error || !service) {
    return (
      <div className="container-custom py-16 text-center">
        <p role="alert" className="text-slate-600">{error || 'Service not found.'}</p>
        <button type="button" onClick={() => navigate('/services')} className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">Back to services</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="container-custom">
        <button type="button" onClick={() => navigate('/services')} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to services
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {service.image && !imageFailed ? (
              <img src={service.image} alt={service.name} onError={() => setImageFailed(true)} className="h-56 w-full object-cover sm:h-80" />
            ) : (
              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 text-blue-700 sm:h-80">
                <Wrench className="h-16 w-16" strokeWidth={1.5} aria-hidden="true" />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-800">{service.category}</span>
              <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">{service.name}</h1>
              {service.providerName && (
                <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                  {service.profilePhoto && !profileImageFailed
                    ? <img src={service.profilePhoto} alt="" onError={() => setProfileImageFailed(true)} className="h-8 w-8 rounded-full object-cover" />
                    : <UserCircle className="h-5 w-5 text-blue-600" aria-hidden="true" />}
                  {service.providerName}
                  <BadgeCheck className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </div>
              )}
              {service.description && <p className="mt-5 whitespace-pre-line leading-7 text-slate-600">{service.description}</p>}

              <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
                {service.serviceLocation && <p className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4 shrink-0 text-blue-600" />{service.serviceLocation}</p>}
                {service.estimatedTime && <p className="flex items-center gap-2 text-sm text-slate-600"><Clock3 className="h-4 w-4 shrink-0 text-blue-600" />{service.estimatedTime}</p>}
                {service.availableTime && <p className="flex items-center gap-2 text-sm text-slate-600"><Clock3 className="h-4 w-4 shrink-0 text-blue-600" />Availability: {service.availableTime}</p>}
                {service.experience && <p className="text-sm text-slate-600">Experience: {service.experience}</p>}
                {service.rating > 0 && service.reviewCount > 0 && (
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    {service.rating.toFixed(1)} ({service.reviewCount} {service.reviewCount === 1 ? 'review' : 'reviews'})
                  </p>
                )}
              </div>

              {service.phone && (
                <a href={`tel:${service.phone}`} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
                  <Phone className="h-4 w-4" aria-hidden="true" /> Call provider
                </a>
              )}
            </div>
          </article>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-sm font-semibold text-slate-500">Starting price</p>
            <p className="mt-1 text-3xl font-extrabold text-blue-800">₹{service.basePrice}</p>
            <button
              type="button"
              onClick={() => navigate('/booking', { state: { serviceId: id } })}
              className="mt-6 w-full rounded-xl bg-blue-700 px-5 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Book Now
            </button>
            <p className="mt-3 text-center text-xs leading-5 text-slate-500">Choose your preferred date and time in the booking form.</p>
          </aside>
        </div>

        {reviews.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-extrabold text-slate-900">Customer reviews</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <article key={review._id} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-900">{review.customerId?.name}</p>
                    {review.rating > 0 && <p className="flex items-center gap-1 text-sm font-semibold text-slate-700"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{review.rating}</p>}
                  </div>
                  {review.comment && <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
