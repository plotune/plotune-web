import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import BusinessImpact from '../components/BusinessImpact';
import NexusSpotlight from '../components/NexusSpotlight';
import TechStack from '../components/TechStack';
import Pricing from '../components/Pricing';

const Home = () => {
  return (
    <>
      <Hero />
      <NexusSpotlight />
      <Features />
      <BusinessImpact/>
      <Pricing />
    </>
  );
};
      // <TechStack /> to show video
export default Home;
