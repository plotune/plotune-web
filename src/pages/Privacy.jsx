import React, { useState, useEffect } from 'react';
import { Link as ScrollLink, Element } from 'react-scroll';

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.privacy-section');
      let current = 'overview';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          current = section.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <section className="min-h-[40vh] flex items-center py-36 bg-gradient-to-br from-primary/10 to-secondary/10 text-center">
        <div className="container mx-auto px-5">
          <h1 className="text-4xl md:text-5xl font-bold text-light-text mb-5">Privacy Policy</h1>
          <p className="text-lg text-gray-text max-w-2xl mx-auto">
            Plotune is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
          </p>
        </div>
      </section>
      <div className="container mx-auto px-5 flex flex-col md:flex-row gap-10 py-20">
        <div className="md:w-64 flex-shrink-0 md:sticky md:top-24">
          <div className="bg-dark-card rounded-custom p-5 border border-white/5">
            <h3 className="text-lg font-semibold text-light-text mb-4 border-b border-white/10 pb-3">Navigation</h3>
            <ul className="space-y-2">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'data-collection', label: 'Data We Collect' },
                { id: 'data-usage', label: 'How We Use Data' },
                { id: 'telemetry', label: 'Telemetry Data' },
                { id: 'data-sharing', label: 'Data Sharing' },
                { id: 'user-rights', label: 'Your Rights' },
                { id: 'security', label: 'Data Security' },
                { id: 'compliance', label: 'Compliance' },
                { id: 'contact', label: 'Contact Us' },
              ].map((item) => (
                <li key={item.id}>
                  <ScrollLink
                    to={item.id}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    className={`block py-2 px-3 rounded text-gray-text hover:bg-primary/10 hover:text-primary cursor-pointer transition-all duration-300 ${activeSection === item.id ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    {item.label}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-1 bg-dark-card rounded-custom p-10 border border-white/5 shadow-custom">
          <Element name="overview" className="privacy-section">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">Overview</h2>
            <p className="text-gray-text mb-4">
              At Plotune, we prioritize your privacy. This Privacy Policy outlines how we collect, use, store, and protect your information when you use our software, services, and website. This policy applies to all users, including those using the Lite, Pro, or Enterprise editions of Plotune.
            </p>
            <p className="text-gray-text mb-4">
              We are committed to compliance with applicable data protection laws, including the General Data Protection Regulation (GDPR) and the Kişisel Verilerin Korunması Kanunu (KVKK) in Turkey.
            </p>
          </Element>
          <Element name="data-collection" className="privacy-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">Data We Collect</h2>
            <p className="text-gray-text mb-4">We collect the following types of information:</p>
            <ul className="list-disc ml-5 space-y-2 text-gray-text">
              <li><strong>Account Information:</strong> Name, email address, username, and other details you provide during registration.</li>
              <li><strong>Payment Information:</strong> Billing details for Pro and Enterprise licenses, processed securely by our payment partners.</li>
              <li><strong>Usage Data:</strong> Anonymous telemetry data about how you interact with Plotune to improve performance and functionality.</li>
              <li><strong>Support Communications:</strong> Information you provide when contacting our support team.</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and other technical details for analytics and security.</li>
            </ul>
          </Element>
          <Element name="data-usage" className="privacy-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">How We Use Your Data</h2>
            <p className="text-gray-text mb-4">We use your information to:</p>
            <ul className="list-disc ml-5 space-y-2 text-gray-text">
              <li>Provide and maintain Plotune services, including account management and extension functionality.</li>
              <li>Process payments and send transactional communications.</li>
              <li>Respond to support requests and inquiries.</li>
              <li>Analyze anonymous usage patterns to enhance user experience and software performance.</li>
              <li>Send newsletters or updates if you opt-in (you can unsubscribe at any time).</li>
              <li>Ensure security and prevent fraud.</li>
            </ul>
          </Element>
          <Element name="telemetry" className="privacy-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">Telemetry Data</h2>
            <p className="text-gray-text mb-4">
              Plotune collects anonymous telemetry data to understand how our software is used and to identify areas for improvement. This data includes metrics like feature usage, performance statistics, and error reports, but does not include personally identifiable information.
            </p>
            <p className="text-gray-text mb-4">
              You can opt-out of telemetry data collection through your account settings. Disabling telemetry does not affect your ability to use Plotune.
            </p>
            <div className="bg-dark-surface backdrop-blur-xl border-l-4 border-primary p-5 my-5 rounded-r-custom">
              <p className="text-gray-text"><strong>Note:</strong> Telemetry data is anonymized and cannot be linked to individual users.</p>
            </div>
          </Element>
          <Element name="data-sharing" className="privacy-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">Data Sharing</h2>
            <p className="text-gray-text mb-4">
              Plotune does not share or sell your personal information with third parties, except in the following cases:
            </p>
            <ul className="list-disc ml-5 space-y-2 text-gray-text">
              <li>With your explicit consent.</li>
              <li>With trusted service providers (e.g., payment processors) who operate under strict confidentiality agreements.</li>
              <li>To comply with legal obligations, such as responding to lawful requests from authorities.</li>
              <li>To protect Plotune’s rights, property, or safety, or that of our users.</li>
            </ul>
            <p className="text-gray-text mb-4">
              Anonymous telemetry data is not shared with third parties and is used solely by Plotune for internal analysis.
            </p>
          </Element>
          <Element name="user-rights" className="privacy-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">Your Rights</h2>
            <p className="text-gray-text mb-4">
              Under GDPR, KVKK, and other applicable laws, you have the following rights regarding your personal data:
            </p>
            <ul className="list-disc ml-5 space-y-2 text-gray-text">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data.</li>
              <li><strong>Deletion:</strong> Request deletion of your data, subject to legal obligations.</li>
              <li><strong>Restriction:</strong> Limit how we process your data in certain circumstances.</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Objection:</strong> Object to processing for direct marketing or other purposes.</li>
            </ul>
            <p className="text-gray-text mb-4">
              To exercise these rights, contact us at <a href="mailto:contact@plotune.net" className="text-primary hover:underline">contact@plotune.net</a>.
            </p>
          </Element>
          <Element name="security" className="privacy-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">Data Security</h2>
            <p className="text-gray-text mb-4">
              We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no system is completely secure, and we cannot guarantee absolute security.
            </p>
            <p className="text-gray-text mb-4">
              In the event of a data breach, we will notify affected users promptly as required by law and take immediate steps to mitigate harm.
            </p>
          </Element>
          <Element name="compliance" className="privacy-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">Compliance</h2>
            <p className="text-gray-text mb-4">
              Plotune complies with GDPR, KVKK, and other applicable data protection regulations. We ensure that our data practices align with these standards, including obtaining explicit consent for data processing where required.
            </p>
            <p className="text-gray-text mb-4">
              For users in the EU or Turkey, we provide clear options to manage your data preferences, including opting out of non-essential data collection like telemetry.
            </p>
          </Element>
          <Element name="contact" className="privacy-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">Contact Us</h2>
            <p className="text-gray-text mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-gray-text mb-4">
              Email: <a href="mailto:contact@plotune.net" className="text-primary hover:underline">contact@plotune.net</a>
            </p>
            <p className="text-gray-text mb-4">
              Last updated: August 25, 2025
            </p>
            <div className="bg-dark-surface backdrop-blur-xl border-l-4 border-primary p-5 my-5 rounded-r-custom">
              <p className="text-gray-text"><strong>Effective Date:</strong> August 25, 2025</p>
            </div>
          </Element>
        </div>
      </div>
    </>
  );
};

export default Privacy;