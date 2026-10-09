import React from 'react';

const MarketplaceHero = () => {
  return (
    <section className="min-h-[50vh] flex flex-col justify-center py-36 relative overflow-hidden bg-dark-surface   text-center">
      <div className="container mx-auto px-5">
        <h1 className="text-4xl md:text-5xl font-bold text-light-text mb-5">Extensions Marketplace</h1>
        <p className="text-lg text-gray-text max-w-2xl mx-auto">
          Enhance your Plotune experience with powerful extensions. Add new capabilities, connect to more data sources, and customize your workflow.
        </p>
      </div>
    </section>
  );
};

export default MarketplaceHero;
