// src/pages/docs_pages/Components/Scatter.jsx
import React from "react";

export default function Scatter() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-light-text mb-4">
          Scatter Component
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          Plots multiple Y-variables against a single X-axis reference using automatic interpolation — ideal for correlation analysis across signals.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-chart-scatter text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">X vs Y Plot</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-sync text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Auto Interpolation</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-layer-group text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Multi-Y Support</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-circle text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Fixed Markers</div>
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
            The Scatter component uses the first selected variable as the X-axis reference. All subsequent variables are plotted as Y-values, 
            automatically interpolated to align with the X-axis timestamps. Points are rendered with fixed circular markers in a single plot area.
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
              "First variable becomes X-axis reference",
              "Subsequent variables plotted against X-axis as Y-values",
              "Automatic interpolation to align Y-values with X-axis timestamps",
              "Fixed styling with circular markers",
              "Single plot area showing all Y-variables against common X-axis"
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
              "Drag the Scatter widget onto your canvas",
              "Select multiple signals (first = X, rest = Y)",
              "View all Y-values plotted against the X-axis",
              "Use system screenshot to export current view"
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

      {/* Displayed Behavior */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
          <i className="fas fa-chart-line text-secondary"></i>
          Plot Behavior
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "X-Axis", description: "First selected signal (timestamp-aligned)", icon: "fas fa-arrows-alt-h" },
            { title: "Y-Values", description: "All other signals, interpolated to X", icon: "fas fa-arrows-alt-v" },
            { title: "Markers", description: "Fixed circular points, no customization", icon: "fas fa-circle" },
            { title: "Updates", description: "Live refresh as new data arrives", icon: "fas fa-sync" }
          ].map((item, index) => (
            <div key={index} className="p-5 bg-dark-surface backdrop-blur-xl rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <i className={`${item.icon} text-secondary`}></i>
                </div>
                <div>
                  <h4 className="font-semibold text-light-text">{item.title}</h4>
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
            "Use a high-resolution timestamp signal as X-axis",
            "Group related Y-signals (e.g., sensor cluster) in one widget",
            "Combine with Statistical component for numerical insights",
            "Take screenshots during key correlation moments"
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
            { icon: "fas fa-thermometer-half", title: "Sensor Correlation", description: "Plot temperature vs pressure over time" },
            { icon: "fas fa-tachometer-alt", title: "Performance Analysis", description: "Speed vs load in real-time systems" },
            { icon: "fas fa-brain", title: "Signal Relationships", description: "Explore hidden patterns across channels" },
            { icon: "fas fa-search", title: "Data Validation", description: "Verify expected X-Y behavior in logs" }
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
            Simple. Direct. Effective.
          </h3>
          <p className="text-gray-text">
            Drop in signals, get instant X-Y visualization — no setup, no layers, just clean correlation plots.
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
              <p className="text-gray-text text-sm">Time-domain waveforms</p>
            </div>
          </a>

          <a href="/docs?page=components-statistical" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-table text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Statistical
              </h3>
              <p className="text-gray-text text-sm">Min/max/avg/std-dev table</p>
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
              <p className="text-gray-text text-sm">Math operations on signals</p>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-gray-text italic">
          Last updated: November 2025 — Scatter Component v1.0.0
        </p>
      </div>
    </div>
  );
}