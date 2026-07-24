// src/pages/docs_pages/Components/Statistical.jsx
import React from "react";

export default function Statistical() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-light-text mb-4">
          Statistical Component
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          Real-time statistical table display showing min, max, average, and standard deviation for each connected signal — perfect for quick monitoring and numerical summaries.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-table text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Real-time Table</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-sync text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Auto Updates</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-layer-group text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Multi-Signal</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-ruler-horizontal text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Fixed Precision</div>
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
            The Statistical component provides a compact tabular format for easy monitoring of key signal metrics. 
            It automatically updates values as data streams change, displaying minimum, maximum, average, and standard deviation 
            for each selected signal with a fixed precision of 4 decimal places.
          </p>
        </div>
      </section>

      {/* Features & How to Use */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Key Features */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-star text-primary"></i>
            Key Features
          </h2>
          <div className="space-y-3">
            {[
              "Real-time statistical table display",
              "Shows min, max, average, and standard deviation for each signal",
              "Automatically updates values as data streams change",
              "Compact tabular format for easy monitoring",
              "Supports multiple signals in a single view"
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/5">
                <i className="fas fa-check text-primary mt-1 text-sm"></i>
                <span className="text-gray-text">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How to Use */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-play-circle text-secondary"></i>
            How to Use
          </h2>
          <ol className="space-y-4">
            {[
              "Drag the Statistical widget onto your canvas",
              "Connect one or more signals from your data source",
              "View live-updating min, max, mean, and std-dev in the table",
              "Use system screenshot to capture current values"
            ].map((step, index) => (
              <li key={index} className="flex items-start gap-3 p-4 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/5">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-text">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Displayed Metrics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
          <i className="fas fa-chart-line text-secondary"></i>
          Displayed Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { metric: "Min", description: "Lowest recorded value", icon: "fas fa-arrow-down" },
            { metric: "Max", description: "Highest recorded value", icon: "fas fa-arrow-up" },
            { metric: "Average", description: "Arithmetic mean of all samples", icon: "fas fa-balance-scale" },
            { metric: "Std Dev", description: "Measure of variation/spread", icon: "fas fa-expand-arrows-alt" }
          ].map((item, index) => (
            <div key={index} className="p-5 bg-dark-surface backdrop-blur-xl rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <i className={`${item.icon} text-secondary`}></i>
                </div>
                <div>
                  <h4 className="font-semibold text-light-text">{item.metric}</h4>
                  <p className="text-gray-text text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
          <i className="fas fa-graduation-cap text-secondary"></i>
          Best Practices
        </h2>
        <div className="space-y-4">
          {[
            "Use alongside Oscilloscope for visual + numerical insight",
            "Monitor multiple signals at once for quick comparisons",
            "Take screenshots at key moments for reporting",
            "Place in dashboard corner for continuous health checks"
          ].map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/5">
              <i className="fas fa-lightbulb text-secondary mt-1 text-sm"></i>
              <span className="text-gray-text">{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: "fas fa-heartbeat", title: "Live Monitoring", description: "Track signal health in real time" },
            { icon: "fas fa-microchip", title: "Sensor Validation", description: "Verify min/max bounds and stability" },
            { icon: "fas fa-flask", title: "Test Summary", description: "Quick numerical snapshot of experiments" },
            { icon: "fas fa-shield-alt", title: "Anomaly Detection", description: "Spot drift using mean and std-dev" }
          ].map((useCase, index) => (
            <div key={index} className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <i className={`${useCase.icon} text-primary`}></i>
                </div>
                <h3 className="text-lg font-semibold text-light-text">{useCase.title}</h3>
              </div>
              <p className="text-gray-text">{useCase.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integration Note */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20 text-center">
          <h3 className="text-xl font-bold text-light-text mb-3">
            Simple. Instant. Reliable.
          </h3>
          <p className="text-gray-text">
            Drop in the Statistical component and get live min/max/avg/std-dev — no setup, no modes, just accurate numbers.
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
              <p className="text-gray-text text-sm">Waveform visualization</p>
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
              <p className="text-gray-text text-sm">X-Y correlation plots</p>
            </div>
          </a>

          <a href="/docs?page=calculations-aggregations" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-calculator text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Aggregations
              </h3>
              <p className="text-gray-text text-sm">Custom math operations</p>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-gray-text italic">
          Last updated: November 2025 — Statistical Component v1.0.0
        </p>
      </div>
    </div>
  );
}