import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BusinessImpact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  const benefits = [
    {
      icon: 'fa-chart-line',
      title: 'Faster triage',
      desc: 'Inspect interfaces, capture bounded traces, and share evidence without stitching local tools together by hand each time.'
    },
    {
      icon: 'fa-cogs',
      title: 'Repeatable validation',
      desc: 'Move recurring capture and stimulation from ad-hoc operator steps into reusable jobs and test sequences.'
    },
    {
      icon: 'fa-shield-alt',
      title: 'Approvable AI-assisted work',
      desc: 'A narrower execution layer than raw shell or one-off scripts, so AI-assisted workflows are easier to approve — with the data path staying customer-controlled.'
    },
  ];

  return (
    <section className="py-24 bg-dark-surface backdrop-blur-xl" ref={ref}>
      <div className="container mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-4">
            Why teams put Nexus on the bench.
          </h2>
          <p className="text-gray-text max-w-2xl mx-auto text-lg">
            Start with one real workflow — not a platform migration.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.2 } },
              }}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className={`fas ${benefit.icon} text-white text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-light-text mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-text">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessImpact;