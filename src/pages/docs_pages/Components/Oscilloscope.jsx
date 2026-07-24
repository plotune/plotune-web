import React from "react";

export default function Oscilloscope() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-light-text mb-4">
          Oscilloscope Component
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          The primary real-time visualization tool for displaying streaming or recorded signal data 
          over time — fully software-driven and integrated into the Plotune canvas.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-wave-square text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Real-time Plotting</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-layer-group text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Multi-layer</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-ruler text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Dynamic Scaling</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-mouse-pointer text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Interactive Controls</div>
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
            Oscilloscope windows in Plotune are <strong className="text-light-text">layer-based</strong>, 
            <strong className="text-light-text"> multi-signal</strong>, and <strong className="text-light-text">dynamic</strong>. 
            Each layer can visualize one or more signals, support individual scaling, time shifting, 
            and style customization. Layers can be freely arranged, resized, and docked anywhere on the canvas.
          </p>
        </div>
      </section>

      {/* Features & Use Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Main Features */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-star text-primary"></i>
            Main Features
          </h2>
          <div className="space-y-3">
            {[
              "Real-time plotting with millisecond-level latency",
              "Multiple signal layers per view (strip mode)",
              "Dynamic scaling and autoscaling per axis",
              "Signal grouping and tagging",
              "Configurable color palette and grid density",
              "Mouse-based zoom, pan, and cursor measurements",
              "Export and snapshot functions"
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/5">
                <i className="fas fa-check text-primary mt-1 text-sm"></i>
                <span className="text-gray-text">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Typical Use Cases */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-rocket text-secondary"></i>
            Typical Use Cases
          </h2>
          <div className="space-y-4">
            {[
              {
                useCase: "Live Signal Monitoring",
                desc: "Monitoring live signals from Online Extensions"
              },
              {
                useCase: "Data Log Visualization",
                desc: "Visualizing logged datasets in Offline Extensions"
              },
              {
                useCase: "Multi-channel Comparison",
                desc: "Comparing multiple time-synchronized channels"
              },
              {
                useCase: "Event Analysis",
                desc: "Inspecting transient events or anomalies"
              },
              {
                useCase: "Calibration & Validation",
                desc: "Calibrating sensors or verifying firmware behavior"
              }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/5">
                <h4 className="font-semibold text-light-text mb-2">{item.useCase}</h4>
                <p className="text-gray-text text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Structure and Layers */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Structure and Layers
        </h2>

        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5">
          <p className="text-gray-text mb-6">
            Each oscilloscope view consists of one or more <strong className="text-light-text">layers</strong>. 
            A layer defines the visualization properties and signal assignments for a group of related data streams.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-light-text mb-3">Layer Components</h4>
              <ul className="space-y-2 text-gray-text">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  List of attached signals
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Timebase configuration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Visual settings (color, line style)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Processing filters
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-light-text mb-3">Layer Management</h4>
              <div className="flex flex-wrap gap-2">
                {['Show/Hide', 'Reorder', 'Individual Reset', 'Layout Persistence'].map((action) => (
                  <span key={action} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                    {action}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Example Usage
        </h2>

        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-light-text">Signal Attachment</h3>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Drag & Drop
            </span>
          </div>
          <p className="text-gray-text mb-4">
            Attaching a signal stream to an Oscilloscope layer using the Plotune SDK.
          </p>
        </div>
      </section>

      {/* Interaction & Controls */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Interaction & Controls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: "fas fa-search",
              title: "Zoom / Pan",
              description: "Scroll or drag horizontally to adjust the time window"
            },
            {
              icon: "fas fa-arrows-alt-h",
              title: "Cursor Measurement",
              description: "Enable cursors to inspect delta-time or delta-value between points"
            },
            {
              icon: "fas fa-expand-alt",
              title: "Autoscale",
              description: "Double-click on an axis to rescale automatically to visible data"
            },
            {
              icon: "fas fa-sliders-h",
              title: "Layer Menu",
              description: "Right-click a layer to edit color, gain, or signal assignment"
            }
          ].map((control, index) => (
            <div key={index} className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <i className={`${control.icon} text-primary`}></i>
              </div>
              <h3 className="text-xl font-semibold text-light-text mb-3">{control.title}</h3>
              <p className="text-gray-text">{control.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Configuration Options */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Configuration Options
        </h2>

        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-light-text font-semibold">Option</th>
                <th className="text-left py-3 px-4 text-light-text font-semibold">Description</th>
                <th className="text-left py-3 px-4 text-light-text font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { option: "timebase", description: "Visible time window in seconds", default: "10" },
                { option: "autoscale", description: "Automatically adjust Y-axis range to visible data", default: "true" },
                { option: "update_rate", description: "Redraw interval in milliseconds", default: "33 (≈30 FPS)" },
                { option: "grid_density", description: "Number of grid divisions per axis", default: "8" },
                { option: "cursor_mode", description: "Enables dual cursor measurement tools", default: "false" }
              ].map((config, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <code className="bg-black/50 text-light-text px-2 py-1 rounded text-sm">{config.option}</code>
                  </td>
                  <td className="py-3 px-4 text-gray-text">{config.description}</td>
                  <td className="py-3 px-4">
                    <span className="text-light-text font-medium">{config.default}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Performance & Developer Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Performance Tips */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-tachometer-alt text-primary"></i>
            Performance Tips
          </h2>
          <div className="space-y-4">
            {[
              "Use thin line styles for high-frequency data",
              "Limit the visible timebase for smoother frame rates",
              "Prefer numeric (float) signals — avoid heavy JSON payloads",
              "Disable autoscale for signals with stable amplitude"
            ].map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/5">
                <i className="fas fa-lightbulb text-primary mt-1 text-sm"></i>
                <span className="text-gray-text">{tip}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Developer Notes */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-code text-secondary"></i>
            Developer Notes
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/5">
              <h4 className="font-semibold text-light-text mb-2">GPU Acceleration</h4>
              <p className="text-gray-text text-sm">
                The oscilloscope renderer uses GPU-accelerated drawing (via PyQtGraph) and performs 
                incremental updates for minimal latency.
              </p>
            </div>
            <div className="p-4 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/5">
              <h4 className="font-semibold text-light-text mb-2">Extensibility</h4>
              <p className="text-gray-text text-sm">
                Developers can subclass or extend oscilloscope behavior using Plotune's component SDK, 
                or inject custom visualization layers through the plugin interface.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Related Components */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Related Components
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/docs?page=components-scatter" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-chart-scatter text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Scatter Component
              </h3>
              <p className="text-gray-text text-sm">
                XY plotting for correlation analysis and 2D data visualization
              </p>
            </div>
          </a>

          <a href="/docs?page=extensions-online" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-satellite-dish text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Online Extensions
              </h3>
              <p className="text-gray-text text-sm">
                Real-time data sources for live oscilloscope visualization
              </p>
            </div>
          </a>

          <a href="/docs?page=sdk" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-code text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                SDK Integration
              </h3>
              <p className="text-gray-text text-sm">
                Programmatic control and customization of oscilloscope components
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-gray-text italic">
          Last updated: November 2025 — Oscilloscope Component v1.0.0
        </p>
      </div>
    </div>
  );
}