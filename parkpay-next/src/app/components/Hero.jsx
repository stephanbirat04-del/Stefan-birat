import React from "react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          ParkPay – Smart Parking Management
        </h1>
        <p className="text-lg md:text-xl mb-6 opacity-90">
          Seamlessly manage parking lots, handle payments, and gain insightful analytics—all in one sleek platform.
        </p>
        <a
          href="/signup"
          className="inline-block bg-white text-indigo-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
        >
          Get Started
        </a>
      </div>
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover" aria-hidden="true" />
    </section>
  );
}
