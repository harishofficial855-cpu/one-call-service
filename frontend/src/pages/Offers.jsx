import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await api.get('/offers');
      setOffers(response.data.offers || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Special Offers & Deals</h1>

      {loading ? (
        <p>Loading offers...</p>
      ) : offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer._id} className="card-shadow p-6 border-l-4 border-indigo-600">
              <h3 className="text-2xl font-bold text-indigo-600 mb-2">
                {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`} OFF
              </h3>
              <p className="text-gray-600 mb-4">{offer.description}</p>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Code:</p>
                <p className="font-bold text-lg">{offer.code}</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Valid until: {new Date(offer.validUntil).toLocaleDateString()}
              </p>
              <button className="btn-primary w-full">Apply Offer</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No offers available right now</p>
        </div>
      )}

      {/* Featured Offers */}
      {!loading && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-shadow p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <h3 className="text-3xl font-bold mb-2">20% OFF</h3>
              <p className="text-lg mb-4">All Services This Week</p>
              <p className="mb-4">Use code: SAVE20</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold">
                Book Now
              </button>
            </div>
            <div className="card-shadow p-8 bg-gradient-to-br from-green-500 to-teal-600 text-white">
              <h3 className="text-3xl font-bold mb-2">₹549/Month</h3>
              <p className="text-lg mb-4">Unlimited Services Subscription</p>
              <p className="mb-4">Use code: PREMIUM</p>
              <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-bold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
