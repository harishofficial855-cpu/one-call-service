import React from 'react';
import { Users, Target, Zap } from 'lucide-react';

const FOUNDER_IMG = 'https://1drv.ms/i/c/250f6a28e9ace4e2/IQCQulF9oh8ZSYysgUXk9CAIAZV42NDPY2u9Pk-em-BaQ2Y?e=kzDwpc';

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


      {/* Founder */}
      <div className="mt-12 card-shadow p-8 flex flex-col sm:flex-row items-center gap-8">
        <img
          src={FOUNDER_IMG}
          alt="Golanakonda Harish"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=Golanakonda+Harish&background=d97706&color=fff&size=200`; }}
          className="w-36 h-36 rounded-2xl object-cover border-4 border-amber-200 shadow-lg flex-shrink-0"
        />
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Founder & CEO</span>
          <h2 className="text-2xl font-black text-[#2c2416] mt-1 mb-2">Golanakonda Harish</h2>
          <p className="text-[#7a6a4a] mb-3">
            Passionate about solving the home services problem in India. Built One Call Service to connect
            skilled local professionals with customers who need them — quickly, reliably, and affordably.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="tel:+919989730775" className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-100 transition">📞 +91 9989730775</a>
            <a href="mailto:harishoffical855@gmail.com" className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-100 transition">✉️ Email</a>
            <span className="flex items-center gap-1 text-sm text-[#7a6a4a] px-4 py-2">📍 Warangal, Telangana</span>
          </div>
        </div>
      </div>
    </div>
  );
}
