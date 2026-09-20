import React from 'react';

const CareersHero = () => {
  return (
    <section className="min-h-[1vh] flex flex-col justify-center py-12 bg-gradient-to-br from-primary/10 to-secondary/10 text-center">
        <h1 className="text-4xl font-bold text-light-text max-w-2xl mx-auto mb-4">
          Careers at Plotune
        </h1>
        <p className="text-lg text-gray-text max-w-2xl mx-auto">
          We’re not actively hiring at the moment, but we’re always on the lookout for passionate individuals to help shape the future of real-time data visualization. Check back soon for new opportunities!
        </p>
    </section>
  );
};

export default CareersHero;