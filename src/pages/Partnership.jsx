import React from 'react';
import { Link } from 'react-router-dom';

const Partnership = () => {
  const partnershipTiers = [
    {
      name: 'Technology Partner',
      icon: 'fa-code',
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
      icon: 'fa-puzzle-piece',
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
      icon: 'fa-store',
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
      description: 'Access new revenue streams with competitive margins and recurring revenue models',
      icon: 'fa-chart-line'
    },
    {
      title: 'Technical Enablement',
      description: 'Get comprehensive training, certification, and technical resources for your team',
      icon: 'fa-graduation-cap'
    },
    {
      title: 'Market Expansion',
      description: 'Reach new customers and markets with our joint go-to-market strategies',
      icon: 'fa-globe'
    },
    {
      title: 'Product Innovation',
      description: 'Influence our product roadmap and get early access to new features',
      icon: 'fa-rocket'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-dark-bg to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-light-text mb-6">
            Plotune Partner Network
          </h1>
          <p className="text-xl text-gray-text max-w-3xl mx-auto mb-8 leading-relaxed">
            Join our ecosystem of technology leaders and drive DataOps transformation together. 
            Build, deliver, and grow with Plotune.
          </p>
          <Link
            to="/partners/apply"
            className="inline-block bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-dark hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            Become a Partner
          </Link>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="py-20 bg-dark-surface backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-4">
              Partnership Programs
            </h2>
            <p className="text-gray-text max-w-2xl mx-auto text-lg">
              Choose the partnership model that aligns with your business goals and technical expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {partnershipTiers.map((tier, index) => (
              <div key={index} className="bg-dark-card rounded-2xl p-8 border border-white/5 hover:border-primary/30 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className={`fas ${tier.icon} text-primary text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-bold text-light-text mb-4">{tier.name}</h3>
                <p className="text-gray-text mb-6 leading-relaxed">{tier.description}</p>
                <ul className="space-y-3">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-light-text/80">
                      <i className="fas fa-check text-primary mr-3 text-sm"></i>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-4">
              Why Partner With Plotune?
            </h2>
            <p className="text-gray-text max-w-2xl mx-auto text-lg">
              Join a growing ecosystem of technology innovators and data experts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-6 p-6 bg-dark-card rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${benefit.icon} text-primary text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-light-text mb-3">{benefit.title}</h3>
                  <p className="text-gray-text leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-dark-surface backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-4">
              See Our Partnership in Action
            </h2>
            <p className="text-gray-text max-w-2xl mx-auto text-lg">
              Discover how our partner program drives success and innovation
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/uudw-lsUGC4"
                title="Plotune Partnership Program"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-96 md:h-[500px]"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-blue-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-6">
            Ready to Transform DataOps Together?
          </h2>
          <p className="text-gray-text text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the Plotune Partner Network and help organizations unlock the full potential of their data operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/partners/apply"
              className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-dark hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              Apply Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary/10 hover:-translate-y-1 transition-all duration-300"
            >
              Contact Partnerships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partnership;