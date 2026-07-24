import React from "react";

export default function Bridge() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-light-text mb-4">
          Bridge Component
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          Transfer data between different extensions with lightweight connection management — 
          Plotune Core guides the routing while extensions handle their own I/O operations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-exchange-alt text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Data Routing</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-plug text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Extension Links</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-bolt text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Minimal Latency</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-sync text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Live Updates</div>
        </div>
      </div>

      {/* Introduction */}
      <section className="mb-12">
        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-light-text mb-4 flex items-center gap-3">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            Overview
          </h2>
          <p className="text-gray-text leading-relaxed">
            The <strong className="text-light-text">Bridge</strong> component provides a simple way to link a variable 
            from one extension (the <em>source</em>) to another extension (the <em>target</em>). Once linked, 
            the target extension automatically receives and processes data from the source.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              icon: "fas fa-mouse-pointer",
              title: "Select Target",
              description: "Choose the destination extension from the combobox"
            },
            {
              step: "2",
              icon: "fas fa-hand-pointer",
              title: "Drag & Drop",
              description: "Drag a variable from the source extension into the Bridge area"
            },
            {
              step: "3",
              icon: "fas fa-link",
              title: "Automatic Linking",
              description: "Bridge creates the connection and data flows between extensions"
            }
          ].map((item, index) => (
            <div key={index} className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary font-bold text-lg">{item.step}</span>
              </div>
              <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <i className={`${item.icon} text-secondary`}></i>
              </div>
              <h3 className="text-xl font-semibold text-light-text mb-3">{item.title}</h3>
              <p className="text-gray-text">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl p-6 border border-primary/20">
          <h4 className="text-lg font-semibold text-light-text mb-3 flex items-center gap-2">
            <i className="fas fa-info-circle text-primary"></i>
            Architecture Note
          </h4>
          <p className="text-gray-text">
            Plotune Core does not transform or store the data — it only maintains the routing metadata.
            Each extension handles its own I/O, ensuring minimal latency and a clear separation of responsibilities.
          </p>
        </div>
      </section>

      {/* Interface Elements */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Interface Elements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-semibold text-light-text mb-4 flex items-center gap-3">
              <i className="fas fa-sliders-h text-primary"></i>
              Control Elements
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: "fas fa-bullseye",
                  title: "Target Selector",
                  description: "Choose the destination extension for the bridge"
                },
                {
                  icon: "fas fa-sync",
                  title: "Refresh Button",
                  description: "Reloads the list of active extensions and variables"
                },
                {
                  icon: "fas fa-folder",
                  title: "Organization Tabs",
                  description: "Organize available extensions into collapsible groups"
                },
                {
                  icon: "fas fa-trash",
                  title: "Delete Buttons",
                  description: "Quickly remove existing bridge connections"
                }
              ].map((element, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-black/30 rounded-lg">
                  <i className={`${element.icon} text-primary mt-1 text-sm`}></i>
                  <div>
                    <h4 className="font-semibold text-light-text text-sm">{element.title}</h4>
                    <p className="text-gray-text text-xs">{element.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-semibold text-light-text mb-4 flex items-center gap-3">
              <i className="fas fa-project-diagram text-secondary"></i>
              Connection Flow
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <i className="fas fa-database text-primary"></i>
                  <span className="text-light-text text-sm">Source Extension</span>
                </div>
                <i className="fas fa-arrow-right text-gray-text"></i>
                <div className="flex items-center gap-2">
                  <i className="fas fa-bridge text-secondary"></i>
                  <span className="text-light-text text-sm">Bridge Component</span>
                </div>
                <i className="fas fa-arrow-right text-gray-text"></i>
                <div className="flex items-center gap-2">
                  <i className="fas fa-microchip text-primary"></i>
                  <span className="text-light-text text-sm">Target Extension</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-primary text-sm text-center">
                  Data flows directly between extensions with minimal overhead
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Use Cases
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "fas fa-desktop",
              title: "Simulation to Display",
              description: "Forwarding data from a simulation to a live display extension"
            },
            {
              icon: "fas fa-external-link-alt",
              title: "Processed Output",
              description: "Routing processed values to an external output or storage"
            },
            {
              icon: "fas fa-link",
              title: "Synchronized Analysis",
              description: "Connecting two independent data sources for synchronized analysis"
            }
          ].map((useCase, index) => (
            <div key={index} className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <i className={`${useCase.icon} text-primary`}></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-3">{useCase.title}</h3>
              <p className="text-gray-text text-sm">{useCase.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-8 border border-secondary/20 text-center">
          <h3 className="text-2xl font-bold text-light-text mb-4">
            Minimal Design, Maximum Flexibility
          </h3>
          <p className="text-gray-text text-lg max-w-3xl mx-auto">
            The Bridge component is intentionally minimal — designed for fast setup and clear data
            routing between any combination of extensions. It helps integrate simulation, online, and
            offline modules without additional configuration.
          </p>
        </div>
      </section>

      {/* Related Components */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Related Components
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/docs?page=components-oscilloscope" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-wave-square text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Oscilloscope
              </h3>
              <p className="text-gray-text text-sm">
                Visualize bridged data streams in real-time with waveform displays
              </p>
            </div>
          </a>

          <a href="/docs?page=components-scatter" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-chart-scatter text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Scatter
              </h3>
              <p className="text-gray-text text-sm">
                Plot relationships between bridged variables for correlation analysis
              </p>
            </div>
          </a>

          <a href="/docs?page=extensions-bridging" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-plug text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Bridging Extensions
              </h3>
              <p className="text-gray-text text-sm">
                Learn about extension types that work with the Bridge component
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-gray-text italic">
          Last updated: November 2025 — Bridge Component v1.0.0
        </p>
      </div>
    </div>
  );
}