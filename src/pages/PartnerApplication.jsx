import React from 'react';
import { Link } from 'react-router-dom';

const PartnerApplication = () => {
  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/partners" 
            className="inline-flex items-center text-primary hover:text-primary-dark mb-6 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Partnership
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-light-text mb-4">
            Partner Application
          </h1>
          <p className="text-gray-text text-lg max-w-2xl mx-auto">
            Complete the form below to start your partnership journey with Plotune. 
            We'll review your application and get back to you within 2 business days.
          </p>
        </div>

        {/* Google Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-primary to-blue-500"></div>
          <div className="p-8">
            <iframe 
              src="https://docs.google.com/forms/d/e/1FAIpQLSc2xQCMnvMH-_nHptO7cBudN5c9GrX79FpowISPhtp5puihHw/viewform?embedded=true" 
              width="100%" 
              height="1200" 
              frameBorder="0"
              className="min-h-[800px]"
              title="Partner application form"
            >
              Loading…
            </iframe>
            <p className="text-center text-gray-text mt-4">
              Form not loading?{' '}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSc2xQCMnvMH-_nHptO7cBudN5c9GrX79FpowISPhtp5puihHw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Open it in a new tab
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <p className="text-gray-text">
            Having trouble with the form?{' '}
            <a href="mailto:contact@plotune.net" className="text-primary hover:underline">
              Contact us directly
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerApplication;