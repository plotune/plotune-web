import React from 'react';
import { Link } from 'react-router-dom';

const Cta = () => {
  return (
    <section className="py-16 bg-dark-bg">
      <div className="container mx-auto px-5 text-center">
        <h2 className="text-3xl font-bold text-light-text mb-4">Join the Data Visualization Revolution</h2>
        <p className="text-gray-text max-w-2xl mx-auto mb-6">
          Become part of a growing community of engineers, researchers, and analysts who are transforming how we understand complex data.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/download"
            className="inline-flex min-h-[44px] items-center justify-center px-6 bg-primary text-white rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-primary-dark transition-all duration-300"
          >
            Download Plotune
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-h-[44px] items-center justify-center px-6 bg-dark-card border border-gray-text text-gray-text rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:border-light-text hover:text-light-text transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cta;