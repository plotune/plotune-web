import React, { useState, useEffect } from 'react';
import { Link as ScrollLink, Element } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

const Legal = () => {
  const [activeSection, setActiveSection] = useState('terms');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.legal-section');
      let current = 'terms';
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
      <section className="design-container page-intro">
        <div className="section-index"><span>Plotune / Legal</span><span>Terms · Privacy · License</span></div>
        <h1>Legal <span>Information</span></h1>
        <p>
          Understanding the terms, licenses, and policies that govern the use of Plotune and its extensions
        </p>
      </section>
      <div className="design-container legal-layout">
        <nav className="faq-index legal-index" aria-label="Legal sections">
          <p className="technical-label">Sections</p>
            <ul>
              {[
                { id: 'terms', label: 'Terms of Service' },
                { id: 'privacy', label: 'Privacy Policy' },
                { id: 'software-license', label: 'Software License' },
              ].map((item) => (
                <li key={item.id}>
                  <ScrollLink
                    to={item.id}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    className={activeSection === item.id ? 'is-active' : ''}
                  >
                    {item.label}
                  </ScrollLink>
                </li>
              ))}
            </ul>
        </nav>
        <div className="legal-body">
          <Element name="terms" className="legal-section">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-ink/15 pb-4">Terms of Service</h2>
            <p className="text-gray-text mb-4">These Terms of Service ("Terms") govern your access to and use of Plotune software, services, and extensions. By accessing or using Plotune, you agree to be bound by these Terms.</p>
            <h3 className="text-2xl font-semibold text-light-text mt-8 mb-3">Acceptance of Terms</h3>
            <p className="text-gray-text mb-4">By installing, accessing, or using Plotune software, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not use Plotune.</p>
            <h3 className="text-2xl font-semibold text-light-text mt-8 mb-3">Account Registration</h3>
            <p className="text-gray-text mb-4">To access certain features of Plotune, you may be required to register for an account. You agree to provide accurate and complete information and keep your account information updated.</p>
            <h3 className="text-2xl font-semibold text-light-text mt-8 mb-3">User Responsibilities</h3>
            <p className="text-gray-text mb-4">You agree not to:</p>
            <ul className="list-disc ml-5 space-y-2 text-gray-text">
              <li>Reverse engineer, decompile, or disassemble Plotune software</li>
              <li>Use Plotune for any illegal or unauthorized purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Upload or transmit viruses or any malicious code</li>
              <li>Interfere with or disrupt the integrity or performance of Plotune</li>
            </ul>
            <div className="legal-note">
              <p className="text-gray-text"><strong>Important:</strong> Plotune reserves the right to modify or terminate the service for any reason, without notice at any time.</p>
            </div>
          </Element>
          <Element name="privacy" className="legal-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-ink/15 pb-4">Privacy Policy</h2>
            <p className="text-gray-text mb-4">
              Plotune is committed to protecting your privacy. For details on what information we collect, how we use it, and your rights, please read our full Privacy Policy.
            </p>
            <RouterLink
              to="/privacy"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Read the full Privacy Policy <span aria-hidden="true">→</span>
            </RouterLink>
          </Element>
          <Element name="software-license" className="legal-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-ink/15 pb-4">Software License</h2>
            <p className="text-gray-text mb-4">Plotune is proprietary software provided under the following license terms:</p>
            <h3 className="text-2xl font-semibold text-light-text mt-8 mb-3">License Grant</h3>
            <p className="text-gray-text mb-4">Subject to your compliance with these Terms, Plotune grants you a limited, non-exclusive, non-transferable, non-sublicensable license to:</p>
            <ul className="list-disc ml-5 space-y-2 text-gray-text">
              <li>Download and install Plotune on computers you own or control</li>
              <li>Use Plotune for your personal or internal business purposes</li>
              <li>Use Plotune extensions as permitted by their respective licenses</li>
            </ul>
            <h3 className="text-2xl font-semibold text-light-text mt-8 mb-3">License Restrictions</h3>
            <p className="text-gray-text mb-4">You may not:</p>
            <ul className="list-disc ml-5 space-y-2 text-gray-text">
              <li>Copy, modify, or create derivative works of Plotune</li>
              <li>Rent, lease, lend, sell, redistribute, or sublicense Plotune</li>
              <li>Use Plotune to build a competitive product or service</li>
              <li>Remove, circumvent, or disable any copyright notices or protections</li>
            </ul>
            <h3 className="text-2xl font-semibold text-light-text mt-8 mb-3">Subscription Plans</h3>
            <p className="text-gray-text mb-4">Plotune offers different licensing options:</p>
            <div className="legal-editions">
              <div>
                <h4>Lite Edition
                </h4>
                <p className="text-gray-text">Free for personal and non-commercial use. Includes basic functionality with limited features.</p>
              </div>
              <div>
                <h4>Pro Edition
                </h4>
                <p className="text-gray-text">Subscription-based license for individual professionals. Includes all features and priority support.</p>
              </div>
              <div>
                <h4>Enterprise Edition
                </h4>
                <p className="text-gray-text">Custom licensing for organizations. Includes team management, advanced security, and dedicated support.</p>
              </div>
            </div>
          </Element>
        </div>
      </div>
    </>
  );
};

export default Legal;
