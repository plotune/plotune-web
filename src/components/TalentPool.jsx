import React from 'react';

const TalentPool = () => {
  const email = 'contact@plotune.net';

  return (
    <section className="design-container closing-section talent-pool">
      <p className="technical-label">Talent pool</p>
      <h2>Be part of the work.</h2>
      <p>
        Interested in shaping the future of data streaming with Plotune? Join our talent pool to get notified about opportunities matching your expertise.
      </p>
      <div className="design-actions">
        <a href={`mailto:${email}?subject=Talent Pool Interest | Plotune`} className="design-button">
          Express Interest <span aria-hidden="true">→</span>
        </a>
        <a href="/contact" className="text-link">or use the contact form →</a>
      </div>
      <p className="talent-note">We'll review your profile and keep it on file for matching roles.</p>
    </section>
  );
};

export default TalentPool;
