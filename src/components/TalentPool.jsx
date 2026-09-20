import React from 'react';

const TalentPool = () => {
  const email = 'contact@plotune.net';

  return (
    <section className="py-20 bg-dark-bg">
      <div className="container mx-auto py-12  px-5 min-h-[5vh] ">
      </div>
      <div className="container mx-auto px-5 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50"></div>
            <span className="text-sm font-medium text-primary tracking-wider uppercase">JOIN US</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/50"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-light-text mb-6">
            Be Part of Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Journey</span>
          </h2>
          
          <p className="text-lg text-gray-text/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Interested in shaping the future of data streaming with Plotune? Join our talent pool to get notified about opportunities matching your expertise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`mailto:${email}?subject=Talent Pool Interest | Plotune`}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden"
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Shine effect */}
              <div className="absolute -inset-full top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-paper-plane text-white text-sm"></i>
                </div>
                <div className="text-left">
                  <div className="text-light-text font-semibold text-lg">Express Interest</div>
                  <div className="text-gray-text/70 text-sm">We'll review your profile</div>
                </div>
                <i className="fas fa-arrow-right text-primary ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
              </div>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center min-h-[44px] px-6 py-2.5 text-gray-text hover:text-light-text underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              or use the contact form
            </a>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default TalentPool;