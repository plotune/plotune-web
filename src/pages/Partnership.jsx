import React from 'react';
import { Link } from 'react-router-dom';

const Partnership = () => {
  const partnershipTiers = [
    {
      name: 'Technology Partner',
      description: 'Integrate Plotune into your solutions and build complementary technologies',
      benefits: [
        'API Early Access',
        'Technical Support',
        'Co-marketing Opportunities',
        'Solution Certification'
      ]
    },
    {
      name: 'Solution Partner',
      description: 'Deliver Plotune-powered solutions to your clients with implementation services',
      benefits: [
        'Sales & Technical Training',
        'Deal Registration',
        'Marketing Development Funds',
        'Joint Customer Engagements'
      ]
    },
    {
      name: 'Reseller Partner',
      description: 'Resell Plotune products and services to your customer base',
      benefits: [
        'Competitive Margins',
        'Sales Enablement',
        'Lead Sharing',
        'Territory Protection'
      ]
    }
  ];

  const benefits = [
    {
      title: 'Revenue Growth',
      description: 'Access new revenue streams with competitive margins and recurring revenue models'
    },
    {
      title: 'Technical Enablement',
      description: 'Get comprehensive training, certification, and technical resources for your team'
    },
    {
      title: 'Market Expansion',
      description: 'Reach new customers and markets with our joint go-to-market strategies'
    },
    {
      title: 'Product Innovation',
      description: 'Influence our product roadmap and get early access to new features'
    }
  ];

  return (
    <main className="partner-page">
      <section className="design-container page-intro">
        <div className="section-index"><span>Plotune / Partners</span><span>Technology · Solution · Reseller</span></div>
        <h1>Plotune <span>Partner Network</span></h1>
        <p>
          Join our ecosystem of technology leaders and drive DataOps transformation together.
          Build, deliver, and grow with Plotune.
        </p>
        <div className="design-actions">
          <Link to="/partners/apply" className="design-button">Become a Partner <span aria-hidden="true">→</span></Link>
          <Link to="/contact" className="text-link">Contact Partnerships →</Link>
        </div>
      </section>

      <section className="design-container partner-section">
        <div className="section-index"><span>01 / Partnership programs</span><span>Choose a model</span></div>
        <h2>Choose the partnership model that aligns with your business goals and technical expertise.</h2>
        <div className="partner-programs">
          {partnershipTiers.map((tier, index) => (
            <article key={tier.name}>
              <span className="technical-label">{String(index + 1).padStart(2, '0')}</span>
              <h3>{tier.name}</h3>
              <p>{tier.description}</p>
              <ul>
                {tier.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="design-container partner-section">
        <div className="section-index"><span>02 / Why partner with Plotune</span><span>Shared work</span></div>
        <dl className="partner-benefits">
          {benefits.map((benefit) => (
            <div key={benefit.title}>
              <dt>{benefit.title}</dt>
              <dd>{benefit.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="design-container partner-section">
        <div className="section-index"><span>03 / See the partnership in action</span><span>Video</span></div>
        <div className="partner-video">
          <iframe
            src="https://www.youtube.com/embed/uudw-lsUGC4"
            title="Plotune Partnership Program"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <a className="text-link" href="https://www.youtube.com/watch?v=uudw-lsUGC4" target="_blank" rel="noopener noreferrer">Watch the partnership video on YouTube ↗</a>
      </section>

      <section className="design-container closing-section partner-closing">
        <p className="technical-label">Apply</p>
        <h2>Build with Plotune.</h2>
        <p>Join the Plotune Partner Network and help organizations unlock the full potential of their data operations.</p>
        <div className="design-actions">
          <Link to="/partners/apply" className="design-button">Apply Now <span aria-hidden="true">→</span></Link>
          <Link to="/contact" className="text-link">Contact Partnerships →</Link>
        </div>
      </section>
    </main>
  );
};

export default Partnership;
