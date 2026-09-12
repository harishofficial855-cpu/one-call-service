import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center py-12">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
          <Link to="/services" className="btn-secondary">
            Browse Services
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-gray-600 mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
            <Link to="/contact" className="text-indigo-600 hover:underline">
              Contact Us
            </Link>
            <Link to="/about" className="text-indigo-600 hover:underline">
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
