import React from "react";

export default function Recorder() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-light-text mb-4">
          Recorder Component
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          Record live variable data into .pltx files for later playback and analysis — 
          featuring drag-and-drop signal recording with asynchronous data writing.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-record-vinyl text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Live Recording</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-compress-alt text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">ZSTD Compression</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-bolt text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Async Writing</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-hand-pointer text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Drag & Drop</div>
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
            The <strong className="text-light-text">Recorder Component</strong> enables recording of live variable data 
            into compressed <code className="text-primary">.pltx</code> files for later playback and analysis. It operates 
            as a drag-and-drop enabled signal recorder with built-in asynchronous data writing, temporary file handling, 
            and user-friendly saving workflows.
          </p>
        </div>
      </section>

      {/* Key Responsibilities */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Key Responsibilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: "fas fa-mouse-pointer",
              title: "Signal Management",
              description: "Accept dropped variables from workspace or explorer and subscribe to their live updates"
            },
            {
              icon: "fas fa-waveform",
              title: "Data Logging",
              description: "Continuously log (x, y) data samples into asynchronous .pltx writer with compression"
            },
            {
              icon: "fas fa-play-circle",
              title: "Recording Control",
              description: "Manage complete recording lifecycle — start, pause, stop, and save operations"
            },
            {
              icon: "fas fa-eye",
              title: "Live Monitoring",
              description: "Display variable values and recording status with visual activity indicators"
            }
          ].map((responsibility, index) => (
            <div key={index} className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <i className={`${responsibility.icon} text-primary`}></i>
              </div>
              <h3 className="text-xl font-semibold text-light-text mb-3">{responsibility.title}</h3>
              <p className="text-gray-text">{responsibility.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UI Layout */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          UI Layout
        </h2>

        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-light-text flex items-center gap-2">
                <i className="fas fa-list text-primary"></i>
                Signal List
              </h4>
              <ul className="space-y-2 text-gray-text">
                <li className="flex items-center gap-2">
                  <i className="fas fa-circle text-primary text-xs"></i>
                  Displays all added variables
                </li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-circle text-primary text-xs"></i>
                  Shows last observed values
                </li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-circle text-primary text-xs"></i>
                  Visual activity indicators
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-light-text flex items-center gap-2">
                <i className="fas fa-sliders-h text-primary"></i>
                Control Buttons
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-black/30 rounded">
                  <i className="fas fa-record text-red-500"></i>
                  <span className="text-light-text text-sm">Record</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-black/30 rounded">
                  <i className="fas fa-pause text-yellow-500"></i>
                  <span className="text-light-text text-sm">Pause</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-black/30 rounded">
                  <i className="fas fa-stop text-green-500"></i>
                  <span className="text-light-text text-sm">Stop & Save</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-light-text flex items-center gap-2">
                <i className="fas fa-hand-pointer text-primary"></i>
                Drop Zone
              </h4>
              <p className="text-gray-text text-sm">
                The entire widget acts as a drag-and-drop area. Dropping variables automatically subscribes to their updates and adds them to the recording session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifecycle & Behavior */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Lifecycle & Behavior
        </h2>

        <div className="space-y-6">
          {/* Adding Variables */}
          <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-2xl p-6 border border-primary/20">
            <h3 className="text-xl font-bold text-light-text mb-4 flex items-center gap-3">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
              Adding Variables
            </h3>
            <p className="text-gray-text mb-4">
              Users drag variables into the Recorder panel. When dropped, the component registers with the async writer and 
              connects to the parent extension's data stream.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <i className="fas fa-download text-primary mb-2"></i>
                <div className="text-light-text">Drag & Drop</div>
              </div>
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <i className="fas fa-link text-primary mb-2"></i>
                <div className="text-light-text">Auto-Subscribe</div>
              </div>
              <div className="text-center p-3 bg-black/30 rounded-lg">
                <i className="fas fa-registered text-primary mb-2"></i>
                <div className="text-light-text">Writer Registration</div>
              </div>
            </div>
          </div>

          {/* Recording Samples */}
          <div className="bg-gradient-to-r from-secondary/10 to-transparent rounded-2xl p-6 border border-secondary/20">
            <h3 className="text-xl font-bold text-light-text mb-4 flex items-center gap-3">
              <span className="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
              Recording Samples
            </h3>
            <p className="text-gray-text mb-4">
              Each variable callback extracts the most recent (x, y) data, stores it for display, and schedules 
              asynchronous writing when recording is active.
            </p>
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div className="flex items-center gap-2">
                <i className="fas fa-database text-secondary"></i>
                <span className="text-light-text">Extension Data</span>
              </div>
              <i className="fas fa-arrow-right text-gray-text"></i>
              <div className="flex items-center gap-2">
                <i className="fas fa-memory text-secondary"></i>
                <span className="text-light-text">Memory Buffer</span>
              </div>
              <i className="fas fa-arrow-right text-gray-text"></i>
              <div className="flex items-center gap-2">
                <i className="fas fa-hdd text-secondary"></i>
                <span className="text-light-text">Async Write</span>
              </div>
            </div>
          </div>

          {/* Asynchronous Writing */}
          <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-2xl p-6 border border-primary/20">
            <h3 className="text-xl font-bold text-light-text mb-4 flex items-center gap-3">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
              Asynchronous Writing
            </h3>
            <p className="text-gray-text mb-4">
              Uses <code className="text-primary">AsyncPltWriter</code> with ZSTD compression, chunking, and periodic 
              flushing to ensure minimal UI impact during high-frequency updates.
            </p>
            <div className="flex flex-wrap gap-2">
              {['ZSTD Compression', 'Chunked Writing', 'Background Thread', 'Auto Flushing'].map((feature, index) => (
                <span key={index} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Threading Model */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Threading Model
        </h2>

        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-light-text font-semibold">Thread</th>
                <th className="text-left py-3 px-4 text-light-text font-semibold">Responsibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                {
                  thread: "UI Thread (Qt)",
                  responsibility: "Handles layout, button interactions, timers, and UI refresh"
                },
                {
                  thread: "RecorderAsyncLoop",
                  responsibility: "Runs asyncio event loop for background write scheduling"
                },
                {
                  thread: "Extension Threads",
                  responsibility: "Push data to recorder via callbacks, invoking record_sample()"
                }
              ].map((row, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <code className="bg-black/50 text-light-text px-2 py-1 rounded text-sm">{row.thread}</code>
                  </td>
                  <td className="py-3 px-4 text-gray-text">{row.responsibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Data Flow */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Data Flow Summary
        </h2>

        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {[
              { icon: "fas fa-plug", label: "Extension" },
              { icon: "fas fa-arrow-right", label: "" },
              { icon: "fas fa-record-vinyl", label: "record_sample()" },
              { icon: "fas fa-arrow-right", label: "" },
              { icon: "fas fa-memory", label: "Memory Buffer" },
              { icon: "fas fa-arrow-right", label: "" },
              { icon: "fas fa-hdd", label: ".pltx File" }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  step.label ? 'bg-primary/20' : 'bg-transparent'
                }`}>
                  <i className={`${step.icon} ${step.label ? 'text-primary' : 'text-gray-text'}`}></i>
                </div>
                {step.label && (
                  <span className="text-light-text text-sm mt-2 text-center">{step.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example User Flow */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Example User Flow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: "1", icon: "fas fa-hand-pointer", action: "Drag signals into Recorder" },
            { step: "2", icon: "fas fa-record", action: "Press Record to start" },
            { step: "3", icon: "fas fa-eye", action: "Monitor live updates" },
            { step: "4", icon: "fas fa-pause", action: "Pause/Resume as needed" },
            { step: "5", icon: "fas fa-save", action: "Stop & save .pltx file" }
          ].map((item, index) => (
            <div key={index} className="bg-dark-surface backdrop-blur-xl rounded-xl p-4 border border-white/5 text-center">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-primary font-bold text-sm">{item.step}</span>
              </div>
              <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <i className={`${item.icon} text-secondary text-sm`}></i>
              </div>
              <p className="text-light-text text-xs">{item.action}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Components */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Related Components
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/docs?page=extensions-offline" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-file-import text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Offline Extensions
              </h3>
              <p className="text-gray-text text-sm">
                Playback recorded .pltx files for analysis and visualization
              </p>
            </div>
          </a>

          <a href="/docs?page=components-oscilloscope" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-wave-square text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Oscilloscope
              </h3>
              <p className="text-gray-text text-sm">
                Visualize recorded signals in real-time during playback
              </p>
            </div>
          </a>

          <a href="/docs?page=components-statistical" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-chart-bar text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Statistical
              </h3>
              <p className="text-gray-text text-sm">
                Analyze statistical properties of recorded signal data
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-gray-text italic">
          Last updated: November 2025 — Recorder Component v1.0.0
        </p>
      </div>
    </div>
  );
}