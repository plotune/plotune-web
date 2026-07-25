import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ReactComponent as ImpactTrend } from '../assets/businessimpact-trend.svg';

const BusinessImpact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  const benefits = [
    {
      icon: 'fa-chart-line',
      title: 'Accelerate Time to Insight',
      desc: 'Go from raw data to actionable insights in hours, not weeks. Streamline your entire data operations pipeline.'
    },
    {
      icon: 'fa-cogs',
      title: 'Simplify Complex Workflows',
      desc: 'Orchestrate multiple data sources and processes through a unified interface that your team can actually use.'
    },
    {
      icon: 'fa-shield-alt',
      title: 'Enterprise-Grade Governance',
      desc: 'Maintain compliance and data quality while scaling your operations with built-in governance and security.'
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-dark-surface backdrop-blur-xl" ref={ref}>
      <div className="container mx-auto px-5">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-4">
            Transform Your Data Operations
          </h2>
          <p className="text-gray-text max-w-2xl mx-auto text-lg">
            Join forward-thinking companies that use Plotune to modernize their data infrastructure and drive better business outcomes.
          </p>
        </div>

        <div className="mx-auto mb-12 max-w-2xl rounded-[2rem] bg-dark-card/60 p-6 shadow-custom ring-1 ring-white/5 md:mb-16">
          <ImpactTrend className="h-auto w-full" />
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