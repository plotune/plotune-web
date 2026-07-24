import React from 'react';

const Mission = () => {
  return (
    <section id="mission" className="py-24 bg-dark-surface backdrop-blur-xl">
      <div className="container mx-auto px-5">
        <div className="max-w-4xl mx-auto">
          {/* Mission Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-4">
              Our Mission & Vision
            </h2>
            <p className="text-gray-text max-w-2xl mx-auto text-lg">
              Driving the future of data operations through innovation and partnership
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl mb-12">
            <div className="flex items-start mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2 mt-1"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2 mt-1"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-4 mt-1"></div>
              <h3 className="text-light-text font-semibold text-xl">Our Core Mission</h3>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-text text-lg leading-relaxed">
                At Plotune, our mission is to <strong className="text-primary">democratize DataOps excellence</strong> by providing organizations with the tools to orchestrate, process, and govern their data with unprecedented simplicity and power.
              </p>
              
              <p className="text-gray-text text-lg leading-relaxed">
                We believe that <strong>every organization deserves enterprise-grade data operations</strong>, regardless of size or technical maturity. Our platform bridges the gap between complex data infrastructure and the need for streamlined, actionable insights.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-bullseye text-primary text-sm"></i>
                  </div>
                  <div>
                    <h4 className="text-light-text font-semibold mb-2">Our Vision</h4>
                    <p className="text-gray-text text-sm">
                      A world where data operations are seamless, intelligent, and accessible to every organization driving innovation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-handshake text-blue-500 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="text-light-text font-semibold mb-2">Our Promise</h4>
                    <p className="text-gray-text text-sm">
                      To be your trusted DataOps partner, delivering solutions that grow and evolve with your business needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-card rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-universal-access text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-3">Accessibility</h3>
              <p className="text-gray-text text-sm">
                Making advanced DataOps capabilities accessible to teams of all sizes and technical backgrounds.
              </p>
            </div>

            <div className="bg-dark-card rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-shield-alt text-blue-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-3">Reliability</h3>
              <p className="text-gray-text text-sm">
                Building trust through robust, secure, and enterprise-ready data operations platforms.
              </p>
            </div>

            <div className="bg-dark-card rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-rocket text-green-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-3">Innovation</h3>
              <p className="text-gray-text text-sm">
                Continuously pushing boundaries to solve tomorrow's data challenges today.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-gray-text mb-6 max-w-2xl mx-auto">
              Ready to transform your data operations with a partner who shares your vision?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark hover:-translate-y-1 hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Start Your DataOps Journey
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;