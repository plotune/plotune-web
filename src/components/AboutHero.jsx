import React from 'react';

const AboutHero = () => {
  return (
    <section className="py-32 md:py-36 bg-dark-bg">
      <div className="container mx-auto px-5 flex flex-col md:flex-row items-center gap-12">
        {/* Left: Text Content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-light-text leading-tight">
            Building the Future of <span className="text-primary">Data Operations</span>
          </h1>

          <p className="text-gray-text text-lg leading-relaxed">
            Plotune was founded in <strong>2025</strong> to solve a critical challenge: modern data teams needed a unified platform to orchestrate, process, and govern their entire data lifecycle. We saw the gap between complex data infrastructure and the need for simple, powerful operations.
          </p>

          <p className="text-gray-text text-lg leading-relaxed">
            Our platform brings together <strong>orchestration, real-time processing, and data governance</strong> into one seamless experience. Every component is designed for scalability, performance, and enterprise-grade reliability.
          </p>

          <p className="text-gray-text text-lg leading-relaxed font-medium">
            We empower organizations to transform raw data into strategic assets, enabling faster decisions and driving business innovation through superior DataOps practices.
          </p>

          <div className="pt-4 flex gap-4">
            <a
              href="/partners"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark hover:-translate-y-1 hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Partner With Us
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/about#mission"
              className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary/10 hover:-translate-y-1 transition-all duration-300 font-semibold"
            >
              Our Mission
            </a>
          </div>
        </div>

        {/* Right: Visual Card */}
        <div className="flex-1 w-full max-w-lg">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-start mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2 mt-1"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2 mt-1"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-4 mt-1"></div>
              <h3 className="text-light-text font-semibold text-xl">Our DataOps Philosophy</h3>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start bg-primary/10 rounded-xl p-4 border-l-4 border-primary">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-puzzle-piece text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-light-text font-semibold text-sm mb-1">Modular by Design</p>
                  <p className="text-gray-text text-xs">Every component connects seamlessly, building your perfect data workflow</p>
                </div>
              </div>
              
              <div className="flex items-start bg-blue-500/10 rounded-xl p-4 border-l-4 border-blue-500">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-rocket text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-light-text font-semibold text-sm mb-1">Real-Time Native</p>
                  <p className="text-gray-text text-xs">Built for streaming data and instant insights from day one</p>
                </div>
              </div>
              
              <div className="flex items-start bg-green-500/10 rounded-xl p-4 border-l-4 border-green-500">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-expand-arrows-alt text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-light-text font-semibold text-sm mb-1">Enterprise Scalable</p>
                  <p className="text-gray-text text-xs">Grow from startup to enterprise without changing platforms</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex justify-between items-center text-xs text-gray-text">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Trusted by data teams worldwide</span>
                </div>
                <div className="text-light-text/40 font-mono">
                  v1.0
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements for visual consistency */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500/20 rounded-full animate-pulse delay-1000"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;