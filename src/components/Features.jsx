import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { ReactComponent as CoreVisual } from '../assets/features-core.svg';
import { ReactComponent as StreamVisual } from '../assets/features-stream.svg';
import { ReactComponent as CloudVisual } from '../assets/features-cloud.svg';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  // Doherty/Aesthetic-Usability: honor reduced-motion instead of animating cards in
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const services = [
    {
      Visual: CoreVisual,
      title: 'Plotune Core',
      subtitle: 'Control Plane',
      desc: 'Orchestrate, monitor, and manage your entire data ecosystem through a unified interface. The brain of your data operations.',
      features: ['Data Orchestration', 'Unified UI/UX', 'Real-time Monitoring', 'Workflow Management']
    },
    {
      Visual: StreamVisual,
      title: 'Plotune Stream',
      subtitle: 'Execution Plane',
      desc: 'Real-time ETL and event operations with lightning-fast data processing. Transform and move data as it happens.',
      features: ['Real-time ETL', 'Event Operations', 'Stream Processing', 'Low-latency Execution']
    },
    {
      Visual: CloudVisual,
      title: 'Plotune Cloud',
      subtitle: 'Data Governance Plane',
      desc: 'Scalable storage, comprehensive metadata management, and enterprise-grade data governance policies.',
      features: ['Data Storage', 'Metadata Management', 'Policy Enforcement', 'Scalable Infrastructure']
    },
  ];

  return (
    <section id="features" className="scroll-mt-24 py-16 md:py-24 bg-dark-card/30" ref={ref}>
      <div className="container mx-auto px-5">

        <div className="text-center mb-10 md:mb-16 max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">The Plotune platform</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-light-text">
            A complete DataOps platform.
          </h2>
          <p className="mt-4 text-gray-text text-lg">
            Beyond the bench, Plotune helps teams orchestrate, process, and govern their data across
            three planes that work together as one.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-dark-card rounded-custom p-8 border border-white/5 hover:border-primary/30 hover:-translate-y-2 hover:shadow-custom transition-all duration-300 group"
              variants={variants}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate={isInView || prefersReducedMotion ? 'visible' : 'hidden'}
              transition={{ delay: index * 0.2 }}
            >
              <div className="mb-6 rounded-2xl bg-dark-bg/50 p-4 ring-1 ring-white/5">
                <service.Visual className="h-auto w-full" />
              </div>

              <div className="mb-4">
                <h3 className="text-2xl font-bold text-light-text mb-1">
                  {service.title}
                </h3>
                <p className="text-primary font-semibold text-sm uppercase tracking-wide">
                  {service.subtitle}
                </p>
              </div>
              
              <p className="text-gray-text mb-6 leading-relaxed">
                {service.desc}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-light-text/80 text-sm">
                    <FiCheck aria-hidden="true" className="text-primary mr-3 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Additional call-to-action */}
        <motion.div 
          className="text-center mt-16"
          variants={variants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate={isInView || prefersReducedMotion ? 'visible' : 'hidden'}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-text mb-6 max-w-2xl mx-auto">
            Ready to modernize your data operations? See how the integrated platform can work for your team.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full border-2 border-primary px-8 py-3 font-semibold text-primary hover:bg-primary/10 hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:-translate-y-1"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;