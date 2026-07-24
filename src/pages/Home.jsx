import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import BusinessImpact from '../components/BusinessImpact';
import NexusSpotlight from '../components/NexusSpotlight';
import NexusShowcase from '../components/NexusShowcase';
import NexusUseCasesTeaser from '../components/NexusUseCasesTeaser';
import MoreFromPlotune from '../components/MoreFromPlotune';

const ClosingCta = () => (
  <section className="py-16 md:py-24 bg-dark-bg">
    <div className="container mx-auto px-5">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-[linear-gradient(145deg,rgba(38,166,154,0.16),rgba(38,166,154,0.04))] p-8 text-center shadow-custom md:p-14">
        <h2 className="text-3xl font-bold text-light-text md:text-4xl">See what Plotune can do for your team.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-text">
          From data operations to the test bench, start with one real workflow and see the platform,
          and our flagship Nexus appliance, work for you.
        </p>
        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-lg"
          >
            Request a Demo
          </Link>
          <Link
            to="/nexus"
            className="inline-flex items-center justify-center rounded-full border-2 border-primary px-7 py-3 font-semibold text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-primary/10"
          >
            Explore Nexus
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const Home = () => {
  return (
    <>
      <Hero />
      <NexusSpotlight />
      <NexusShowcase />
      <NexusUseCasesTeaser />
      <Features />
      <BusinessImpact />
      <MoreFromPlotune />
      <ClosingCta />
    </>
  );
};

export default Home;
