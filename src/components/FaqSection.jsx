import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FaqSection = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: 'What are the system requirements for Plotune?',
      answer: (
        <>
          <p>Plotune runs on Windows 10/11 (64-bit) and most modern Linux distributions. Minimum requirements:</p>
          <ul className="ml-5 mt-2 list-disc">
            <li><strong>Processor:</strong> 2 GHz dual-core</li>
            <li><strong>Memory:</strong> 4 GB RAM</li>
            <li><strong>Storage:</strong> 500 MB available space</li>
            <li><strong>Graphics:</strong> OpenGL 3.3 compatible</li>
          </ul>
        </>
      ),
    },
    {
      question: "What's the difference between stable and alpha versions?",
      answer: (
        <>
          <p><strong>Stable releases</strong> are production-ready versions that have been thoroughly tested. These are recommended for most users.</p>
          <p><strong>Alpha previews</strong> are early access releases that include experimental features. These may be unstable and are intended for testing and development purposes only.</p>
        </>
      ),
    },
    {
      question: "How do I install the Linux version?",
      answer: (
        <>
          <p>Choose the Linux tab above. Debian and Ubuntu users can install the .deb package or run the install script, Arch users can install <code>plotune-bin</code> from the AUR, and the Snap package and standalone binary work on most other distributions.</p>
          <pre><code>$ sudo snap install plotune</code></pre>
          <p>After installation, run Plotune from your applications menu or with <code>plotune</code>.</p>
        </>
      ),

    },
    {
      question: 'Where can I get older versions of Plotune?',
      answer: (
        <p>
          Need an older version of Plotune?{' '}
          <Link to="/contact" className="text-primary hover:underline">
            Contact us
          </Link>{' '}
          and we&apos;ll help you find the right release for your setup. We recommend always
          using the latest stable version unless you have specific compatibility requirements.
        </p>
      ),
    },
  ];

  return (
    <section className="design-container download-faq">
      <div className="section-index"><span>Download / Questions</span><span>{faqs.length} answers</span></div>
      <h2>Download FAQs</h2>
      <div>
        {faqs.map((faq, index) => (
          <article key={faq.question} className="faq-item">
            <button
              type="button"
              aria-expanded={activeFaq === index}
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
            >
              <h3>{faq.question}</h3>
              <i className={`fas fa-chevron-down ${activeFaq === index ? 'rotate-180' : ''}`} aria-hidden="true"></i>
            </button>
            {activeFaq === index && <div className="faq-answer">{faq.answer}</div>}
          </article>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
