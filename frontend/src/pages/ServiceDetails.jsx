import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, MapPin, Clock, Users } from 'lucide-react';

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      const response = await api.get(`/services/${id}`);
      setService(response.data.service);

      // Fetch reviews for this service
      const reviewsResponse = await api.get(`/reviews/service/${id}`);
      setReviews(reviewsResponse.data.reviews || []);
    } catch (error) {
      console.error('Error fetching service:', error);
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12 text-center">
        <p>Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container-custom py-12 text-center">
        <p>Service not found</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <button
        onClick={() => navigate('/services')}
        className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Services</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Service Info */}
        <div className="md:col-span-2">
          <div className="card-shadow p-8">
            <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
            <p className="text-gray-600 mb-6">{service.description}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-lg">₹{service.basePrice}</span>
                <span className="text-gray-500">(Starting price)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock size={20} className="text-gray-400" />
                <span>{service.estimatedTime}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">{service.rating} ⭐</span>
                <span className="text-gray-500">({service.reviewCount} reviews)</span>
              </div>
            </div>

            {service.subservices && service.subservices.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-3">Sub-services:</h3>
                <ul className="space-y-2">
                  {service.subservices.map((sub, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div className="card-shadow p-6 h-fit">
          <h3 className="text-2xl font-bold mb-4">Book This Service</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Service Price</p>
              <p className="text-3xl font-bold text-indigo-600">₹{service.basePrice}</p>
            </div>
            <button
              onClick={() => navigate('/booking', { state: { serviceId: id } })}
              className="btn-primary w-full"
            >
              Book Now
            </button>
            <p className="text-xs text-gray-500 text-center">
              Proceed to booking page to select date and time
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="card-shadow p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold">{review.customerId?.name}</p>
                    <p className="text-sm text-gray-500">{'⭐'.repeat(review.rating)}</p>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
