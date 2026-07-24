import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import BusinessImpact from '../components/BusinessImpact';
import NexusSpotlight from '../components/NexusSpotlight';
import TechStack from '../components/TechStack';

const Home = () => {
  return (
    <>
      <Hero />
      <NexusSpotlight />
      <Features />
      <BusinessImpact/>
    </>
  );
};
      // <TechStack /> to show video
export default Home;
