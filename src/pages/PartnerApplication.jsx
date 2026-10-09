import React from 'react';
import { Link } from 'react-router-dom';

const PartnerApplication = () => {
  return (
    <div className="min-h-screen bg-dark-bg pb-12">
      <section className="design-container page-intro">
        <div className="section-index"><Link to="/partners">← Back to Partnership</Link><span>Partners / Apply</span></div>
        <h1>Partner <span>Application</span></h1>
        <p>
          Complete the form below to start your partnership journey with Plotune.
          We'll review your application and get back to you within 2 business days.
        </p>
      </section>
      <div className="design-container">
        {/* Google Form */}
        <div className="bg-white border-t border-ink overflow-hidden">
          <div className="p-6 md:p-8">
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