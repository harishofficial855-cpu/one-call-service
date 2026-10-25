import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake, Search, UserCircle, Wrench } from 'lucide-react';

const FOUNDER_IMG = 'https://1drv.ms/i/c/250f6a28e9ace4e2/IQCQulF9oh8ZSYysgUXk9CAIAZV42NDPY2u9Pk-em-BaQ2Y?e=RKHlpG';

const values = [
  {
    icon: Search,
    title: 'Easy to explore',
    description: 'Browse service listings and use search and location filters to find relevant options.',
  },
  {
    icon: UserCircle,
    title: 'Provider details',
    description: 'Listings show provider and service information when those details are available.',
  },
  {
    icon: HeartHandshake,
    title: 'Booking connected',
    description: 'Choose a listing and continue through the existing One Call Service booking flow.',
  },
];

export default function About() {
  const [founderImageFailed, setFounderImageFailed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-14 text-white sm:py-20">
        <div className="container-custom">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-200">About One Call Service</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Home services, easier to find and book.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
            One Call Service brings service listings, provider details, and booking tools together in one place.
          </p>
          <Link to="/services" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-blue-900 transition hover:bg-blue-50">
            Explore services <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="container-custom py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Our purpose</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">A straightforward way to connect.</h2>
            <p className="mt-5 leading-7 text-slate-600">
              Finding the right help for a home or personal service can take time. One Call Service gives customers a place to explore available listings, review the information provided, and start a booking.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              Service details come from the platform’s existing listings. Information such as provider, price, availability, and images is shown when it has been provided; the site does not fill missing details with made-up information.
            </p>
          </div>
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 sm:p-9">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-200">
              <Wrench className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-extrabold text-slate-900">From discovery to booking</h3>
            <p className="mt-2 leading-7 text-slate-600">
              Search the current service catalog, open a listing for its details, and use the existing booking flow to submit a request.
            </p>
            <Link to="/services" className="mt-5 inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900">
              Browse available listings <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container-custom">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">What guides us</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Useful, clear, connected.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-custom py-12 sm:py-16">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative flex min-h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-slate-100 p-8">
              {!founderImageFailed ? (
                <img
                  src={FOUNDER_IMG}
                  alt="Golanakonda Harish, Founder and CEO of One Call Service"
                  onError={() => setFounderImageFailed(true)}
                  className="h-56 w-56 rounded-3xl border-4 border-white object-cover shadow-xl sm:h-64 sm:w-64"
                />
              ) : (
                <div className="flex h-56 w-56 items-center justify-center rounded-3xl border-4 border-white bg-blue-700 text-5xl font-extrabold text-white shadow-xl sm:h-64 sm:w-64" aria-label="Founder image unavailable">
                  GH
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Founder &amp; CEO</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Golanakonda Harish</h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-600">
                Building One Call Service around a simple idea: make it easier to discover local services and connect customers with the people offering them.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="tel:+919989730775" className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-800 transition hover:bg-blue-50">
                  Call +91 9989730775
                </a>
                <a href="mailto:harishoffical855@gmail.com" className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800">
                  Contact by email
                </a>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
