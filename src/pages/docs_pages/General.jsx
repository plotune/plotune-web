import React from "react";

export default function General() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-light-text mb-4">
          Plotune Overview
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          A modular, high-performance data visualization and signal analysis platform 
          built for researchers, engineers, and students.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="text-2xl font-bold text-primary mb-2">Real-time</div>
          <div className="text-gray-text">Data Visualization</div>
        </div>
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="text-2xl font-bold text-primary mb-2">Modular</div>
          <div className="text-gray-text">Architecture</div>
        </div>
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="text-2xl font-bold text-primary mb-2">Extensible</div>
          <div className="text-gray-text">Plugin System</div>
        </div>
      </div>

      {/* Introduction */}
      <section className="mb-12">
        <div className="bg-dark-surface  rounded-sm p-8 border border-ink/15">
          <h2 className="text-2xl font-bold text-light-text mb-4 flex items-center gap-3">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            Introduction
          </h2>
          <p className="text-gray-text leading-relaxed mb-4">
            <strong className="text-light-text">Plotune</strong> enables real-time and offline visualization 
            of streaming data from multiple sources such as UART, CAN, Bluetooth, and file-based logs. 
            Designed for performance and flexibility, it serves researchers, engineers, and students alike.
          </p>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-8 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Core Philosophy
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-lg">M</span>
            </div>
            <h3 className="text-xl font-semibold text-light-text mb-3">Modularity</h3>
            <p className="text-gray-text">
              Every visualization, source, and calculation component is isolated and extendable. 
              Drag, resize, or dock any element within the canvas.
            </p>
          </div>

          <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-lg">E</span>
            </div>
            <h3 className="text-xl font-semibold text-light-text mb-3">Extensibility</h3>
            <p className="text-gray-text">
              Through its SDK and API, developers can build custom plugins that integrate 
              seamlessly with the Plotune core ecosystem.
            </p>
          </div>

          <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-lg">P</span>
            </div>
            <h3 className="text-xl font-semibold text-light-text mb-3">Performance</h3>
            <p className="text-gray-text">
              Redis-powered backend and multi-process Python architecture ensure fast data 
              throughput, even for high-frequency streams.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-8 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Architecture Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Frontend */}
          <div className="bg-dark-surface  to-transparent rounded-sm p-6 border border-primary/20">
            <h3 className="text-2xl font-bold text-light-text mb-4 flex items-center gap-3">
              <i className="fas fa-desktop text-primary"></i>
              Frontend
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-text">
                <i className="fas fa-check text-primary mt-1 text-sm"></i>
                Built with <strong className="text-light-text ml-1">PyQt5</strong> for responsive desktop UI
              </li>
              <li className="flex items-start gap-3 text-gray-text">
                <i className="fas fa-check text-primary mt-1 text-sm"></i>
                Supports <strong className="text-light-text ml-1">drag-and-drop</strong> and docking layouts
              </li>
              <li className="flex items-start gap-3 text-gray-text">
                <i className="fas fa-check text-primary mt-1 text-sm"></i>
                Component-based views (Oscilloscope, Scatter, Bridge, Statistical)
              </li>
            </ul>
          </div>

          {/* Backend */}
          <div className="bg-dark-surface  to-transparent rounded-sm p-6 border border-secondary/20">
            <h3 className="text-2xl font-bold text-light-text mb-4 flex items-center gap-3">
              <i className="fas fa-server text-secondary"></i>
              Backend
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-text">
                <i className="fas fa-check text-secondary mt-1 text-sm"></i>
                Python with plugin-based data acquisition
              </li>
              <li className="flex items-start gap-3 text-gray-text">
                <i className="fas fa-check text-secondary mt-1 text-sm"></i>
                <strong className="text-light-text ml-1">Redis</strong> for fast in-memory streaming
              </li>
              <li className="flex items-start gap-3 text-gray-text">
                <i className="fas fa-check text-secondary mt-1 text-sm"></i>
                Handles source management and live stream distribution
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interface Layout */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Interface Layout
        </h2>

        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-light-text mb-3">Main Areas</h4>
              <ul className="space-y-2 text-gray-text">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <strong className="text-light-text">Top Menu:</strong> Home, Configuration, View, Help
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <strong className="text-light-text">Left Sidebar:</strong> File Explorer, Variable Explorer
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <strong className="text-light-text">Right Sidebar:</strong> Calculation, Plugins, Sources
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <strong className="text-light-text">Canvas Area:</strong> Central workspace
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-light-text mb-3">Data Sources</h4>
              <div className="flex flex-wrap gap-2">
                {['UART', 'CAN Bus', 'Bluetooth', 'CSV Files', 'Network Streams', 'Simulation'].map((source) => (
                  <span key={source} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extensibility */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Extensibility & Plugins
        </h2>

        <div className="bg-dark-surface  rounded-sm p-8 border border-ink/15">
          <p className="text-gray-text mb-6">
            Plotune offers a flexible <strong className="text-light-text">Extension SDK</strong> 
            for building plugins that extend both frontend and backend capabilities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-light-text mb-3">Plugin Capabilities</h4>
              <ul className="space-y-2 text-gray-text">
                <li className="flex items-center gap-2">
                  <i className="fas fa-plus text-primary text-sm"></i>
                  New data acquisition methods
                </li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-plus text-primary text-sm"></i>
                  Custom visualization panels
                </li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-plus text-primary text-sm"></i>
                  Mathematical computation nodes
                </li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-plus text-primary text-sm"></i>
                  Integration bridges (MATLAB, cloud APIs)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-light-text mb-3">Distribution</h4>
              <ul className="space-y-2 text-gray-text">
                <li className="flex items-center gap-2">
                  <i className="fas fa-store text-primary text-sm"></i>
                  Curated internal marketplace
                </li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-wifi text-primary text-sm"></i>
                  Online and offline modes
                </li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-shield-alt text-primary text-sm"></i>
                  Secure token-based licensing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases & Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Use Cases */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-rocket text-primary"></i>
            Typical Use Cases
          </h2>
          <div className="space-y-3">
            {[
              "Real-time sensor data visualization during field testing",
              "Offline log replay and comparative analysis",
              "Custom signal processing and algorithm validation",
              "Educational demonstrations for signal analytics"
            ].map((useCase, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-dark-surface  rounded-lg border border-ink/15">
                <i className="fas fa-check text-primary mt-1 text-sm"></i>
                <span className="text-gray-text">{useCase}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-map-marked-alt text-secondary"></i>
            Roadmap Highlights
          </h2>
          <div className="space-y-3">
            {[
              "AI-assisted data pattern recognition",
              "Web dashboard for stream management",
              "Distributed stream processing",
              "Advanced plugin store with auto-deployment"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-dark-surface  rounded-lg border border-ink/15">
                <i className="fas fa-road text-secondary mt-1 text-sm"></i>
                <span className="text-gray-text">{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-ink/15">
        <p className="text-gray-text italic">
          Last updated: November 2025 — Plotune Core v1.0.0
        </p>
      </div>
    </div>
  );
}