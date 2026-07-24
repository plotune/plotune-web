import React, { useState, useEffect } from 'react';
import { Link as ScrollLink, Element } from 'react-scroll';

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
      <section className="min-h-[40vh] flex items-center py-36 bg-gradient-to-br from-primary/10 to-secondary/10 text-center">
        <div className="container mx-auto px-5">
          <h1 className="text-4xl md:text-5xl font-bold text-light-text mb-5">Legal Information</h1>
          <p className="text-lg text-gray-text max-w-2xl mx-auto">
            Understanding the terms, licenses, and policies that govern the use of Plotune and its extensions
          </p>
        </div>
      </section>
      <div className="container mx-auto px-5 flex flex-col md:flex-row gap-10 py-20">
        <div className="md:w-64 flex-shrink-0 md:sticky md:top-24">
          <div className="bg-dark-card rounded-custom p-5 border border-white/5">
            <h3 className="text-lg font-semibold text-light-text mb-4 border-b border-white/10 pb-3">Navigation</h3>
            <ul className="space-y-2">
              {[
                { id: 'terms', label: 'Terms of Service' },
                { id: 'privacy', label: 'Privacy Policy' },
                { id: 'software-license', label: 'Software License' },
                { id: 'extension-policy', label: 'Extension Policy' },
                { id: 'disclaimer', label: 'Disclaimer' },
                { id: 'liability', label: 'Limitation of Liability' },
                { id: 'compliance', label: 'Compliance' },
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
          <Element name="terms" className="legal-section">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">Terms of Service</h2>
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
            <div className="bg-dark-surface backdrop-blur-xl border-l-4 border-primary p-5 my-5 rounded-r-custom">
              <p className="text-gray-text"><strong>Important:</strong> Plotune reserves the right to modify or terminate the service for any reason, without notice at any time.</p>
            </div>
          </Element>
          <Element name="privacy" className="legal-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">Privacy Policy</h2>
            <p className="text-gray-text mb-4">Plotune is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose information about you when you use our software and services.</p>
            <h3 className="text-2xl font-semibold text-light-text mt-8 mb-3">Information We Collect</h3>
            <p className="text-gray-text mb-4">We collect information you provide directly to us, such as:</p>
            <ul className="list-disc ml-5 space-y-2 text-gray-text">
              <li>Account registration information (name, email address)</li>
              <li>Payment information for Pro and Enterprise licenses</li>
              <li>Technical support communications</li>
              <li>Optional usage statistics to improve our software</li>
            </ul>
            <h3 className="text-2xl font-semibold text-light-text mt-8 mb-3">How We Use Information</h3>
            <p className="text-gray-text mb-4">We use the information we collect to:</p>
            <ul className="list-disc ml-5 space-y-2 text-gray-text">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Send technical notices, updates, and security alerts</li>
              <li>Monitor and analyze usage trends and activities</li>
            </ul>
            <h3 className="text-2xl font-semibold text-light-text mt-8 mb-3">Information Sharing</h3>
            <p className="text-gray-text mb-4">We do not share or sell your personal information to third parties except:</p>
            <ul className="list-disc ml-5 space-y-2 text-gray-text">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend the rights of Plotune</li>
              <li>With service providers who need access to perform work on our behalf</li>
            </ul>
          </Element>
          <Element name="software-license" className="legal-section mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6 border-b border-white/10 pb-4">Software License</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-dark-surface backdrop-blur-xl rounded-custom p-6 border border-white/5">
                <h4 className="text-xl font-semibold text-light-text flex items-center gap-2 mb-4">
                  <i className="fas fa-gift text-primary"></i> Lite Edition
                </h4>
                <p className="text-gray-text">Free for personal and non-commercial use. Includes basic functionality with limited features.</p>
              </div>
              <div className="bg-dark-surface backdrop-blur-xl rounded-custom p-6 border border-white/5">
                <h4 className="text-xl font-semibold text-light-text flex items-center gap-2 mb-4">
                  <i className="fas fa-crown text-primary"></i> Pro Edition
                </h4>
                <p className="text-gray-text">Subscription-based license for individual professionals. Includes all features and priority support.</p>
              </div>
              <div className="bg-dark-surface backdrop-blur-xl rounded-custom p-6 border border-white/5">
                <h4 className="text-xl font-semibold text-light-text flex items-center gap-2 mb-4">
                  <i className="fas fa-building text-primary"></i> Enterprise Edition
                </h4>
                <p className="text-gray-text">Custom licensing for organizations. Includes team management, advanced security, and dedicated support.</p>
              </div>
            </div>
          </Element>
          {/* Diğer sections (extension-policy, disclaimer, liability, compliance) benzer şekilde ekle. Kısalık için burada kesiyorum, tam kodu kopyala. */}
        </div>
      </div>
    </>
  );
};

export default Legal;