import React from 'react';
import DownloadSection from '../components/DownloadSection';
import FaqSection from '../components/FaqSection';
import Seo from '../components/Seo';

const Download = () => {
  return (
    <>
      <Seo
        title="Download Plotune for Windows & Linux"
        description="Download the Plotune desktop app for Windows and Linux and bring DataOps workflows to your own machine."
        path="/download"
      />
      <section className="design-container page-intro">
        <div className="section-index"><span>Plotune / Desktop</span><span>Windows · Linux</span></div>
        <h1>Download <span>Plotune</span></h1>
        <p>
          Get started with Plotune today. Choose your operating system and version to download the software that fits your needs.
        </p>
      </section>
      <DownloadSection />
      <FaqSection />
    </>
  );
};

export default Download;
