import React from 'react';
import { Users, Target, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">About One Call Service</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At One Call Service, we believe that quality home services should be accessible to everyone.
            Our mission is to connect customers with skilled, verified service providers, making it easy
            to get professional services delivered right to your doorstep.
          </p>
          <p className="text-gray-700 mb-4">
            We started with a simple vision: eliminate the hassle of finding reliable service providers.
            Today, we serve thousands of customers and providers across multiple cities.
          </p>
        </div>
        <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg h-80 flex items-center justify-center text-white">
          <p className="text-6xl">🏠</p>
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-shadow p-6">
            <Users className="w-12 h-12 text-indigo-600 mb-3" />
            <h3 className="text-xl font-bold mb-2">Customer First</h3>
            <p className="text-gray-700">
              Your satisfaction is our priority. We ensure every service meets the highest standards.
            </p>
          </div>
          <div className="card-shadow p-6">
            <Target className="w-12 h-12 text-indigo-600 mb-3" />
            <h3 className="text-xl font-bold mb-2">Quality Assurance</h3>
            <p className="text-gray-700">
              All our providers are verified and trained to deliver excellence in their services.
            </p>
          </div>
          <div className="card-shadow p-6">
            <Zap className="w-12 h-12 text-indigo-600 mb-3" />
            <h3 className="text-xl font-bold mb-2">Quick & Reliable</h3>
            <p className="text-gray-700">
              Fast booking, quick provider assignment, and reliable service delivery every time.
            </p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Our Team</h2>
        <p className="text-gray-700 mb-8">
          We're a dedicated team of professionals passionate about solving the home services problem.
          Our team combines expertise in technology, operations, and customer service to create the best
          experience for both customers and service providers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'John Doe', role: 'Founder & CEO' },
            { name: 'Jane Smith', role: 'COO' },
            { name: 'Mike Johnson', role: 'CTO' },
            { name: 'Sarah Wilson', role: 'Head of Customer Service' },
          ].map((member, idx) => (
            <div key={idx} className="card-shadow p-6 text-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
              <h3 className="font-bold">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
