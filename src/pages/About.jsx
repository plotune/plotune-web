import React from 'react';
import AboutHero from '../components/AboutHero';
import Mission from '../components/Mission';
import Cta from '../components/Cta';
import Seo from '../components/Seo';

const About = () => {
  return (
    <>
      <Seo
        title="About Plotune"
        description="Plotune helps engineering teams orchestrate, process, and govern their data, and builds Plotune Nexus for controlled, AI-ready work on real test hardware."
        path="/about"
      />
      <AboutHero />
      <Mission />
    </>
  );
};

export default About;