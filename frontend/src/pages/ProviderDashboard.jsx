import React from 'react';

export default function ProviderDashboard() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Provider Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Pending Bookings', count: '5', color: 'yellow' },
          { title: 'Active Jobs', count: '2', color: 'blue' },
          { title: 'Completed', count: '48', color: 'green' },
          { title: 'Earnings', count: '₹15,000', color: 'purple' },
        ].map((stat, idx) => (
          <div key={idx} className={`card-shadow p-6 border-t-4 border-${stat.color}-500`}>
            <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
            <p className="text-3xl font-bold">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-shadow p-6">
          <h2 className="text-2xl font-bold mb-4">New Bookings</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border rounded-lg p-4">
                <h3 className="font-bold">Plumbing Service</h3>
                <p className="text-sm text-gray-600">Today at 3:00 PM</p>
                <div className="flex gap-2 mt-3">
                  <button className="btn-primary text-sm">Accept</button>
                  <button className="btn-secondary text-sm">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Rating</h2>
          <p className="text-4xl font-bold text-yellow-500 mb-2">4.8 ⭐</p>
          <p className="text-gray-600 text-sm mb-6">Based on 48 reviews</p>
          <h3 className="font-bold mb-3">Recent Reviews</h3>
          <div className="space-y-2 text-sm">
            <p>⭐⭐⭐⭐⭐ Excellent service!</p>
            <p>⭐⭐⭐⭐ Very professional</p>
            <p>⭐⭐⭐⭐⭐ Highly recommend</p>
          </div>
        </div>
      </div>
    </div>
  );
}
