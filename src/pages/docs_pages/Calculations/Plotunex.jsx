import React from "react";

export default function Plotunex() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-light-text mb-4">
          PLTX File Format (v2)
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          Plotune's specialized asynchronous, chunked, compressed timeseries container — 
          engineered for real-time signal data with minimal overhead and maximum performance.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-bolt text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Async Recording</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-layer-group text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Chunked Storage</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-compress-alt text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">ZSTD Compression</div>
        </div>
        <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-search text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Fast Indexing</div>
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
            <code className="text-primary">PLTX</code> is Plotune's specialized <strong className="text-light-text">asynchronous, chunked, compressed timeseries container</strong>. 
            It was designed to efficiently record, store, and replay large volumes of real-time signal data from diverse sources 
            such as UART, CAN, TCP, Bluetooth, or virtual extensions — all without requiring global synchronization.
          </p>
        </div>
      </section>

      {/* Why Custom Format */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Why a Custom Format?
        </h2>

        <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-2xl p-6 border border-primary/20 mb-6">
          <h3 className="text-xl font-bold text-light-text mb-4 flex items-center gap-3">
            <i className="fas fa-exclamation-triangle text-primary"></i>
            Plotune's Data Characteristics
          </h3>
          <p className="text-gray-text mb-4">
            Plotune's data characteristics are <strong className="text-light-text">not</strong> a fit for standard timeseries formats. 
            We needed a format that could handle the unique demands of real-time signal processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: "fas fa-random",
              title: "Asynchronous Sources",
              description: "Different signals stream from independent extensions at unpredictable rates"
            },
            {
              icon: "fas fa-puzzle-piece",
              title: "Chunked Recording",
              description: "Data must be written incrementally without full-file locks or RAM accumulation"
            },
            {
              icon: "fas fa-tachometer-alt",
              title: "Low-Overhead Compression",
              description: "Compression and indexing occur inline during runtime, not post-processing"
            },
            {
              icon: "fas fa-stream",
              title: "Streaming-First Design",
              description: "Data comes from live WebSocket streams, not batch datasets"
            }
          ].map((reason, index) => (
            <div key={index} className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <i className={`${reason.icon} text-primary`}></i>
              </div>
              <h3 className="text-xl font-semibold text-light-text mb-3">{reason.title}</h3>
              <p className="text-gray-text">{reason.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Design Philosophy
        </h2>

        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5">
          <p className="text-gray-text mb-6">
            Each <code className="text-primary">.pltx</code> file represents one recording session and follows a clear, minimalistic structure:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-light-text font-semibold">Section</th>
                  <th className="text-left py-3 px-4 text-light-text font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  {
                    section: "Header",
                    purpose: "Metadata about recording session and signals"
                  },
                  {
                    section: "Chunks",
                    purpose: "Independently compressed signal data segments"
                  },
                  {
                    section: "Index Table",
                    purpose: "Fast lookup table mapping signals to chunk offsets"
                  },
                  {
                    section: "Footer",
                    purpose: "Final pointer to the index for integrity verification"
                  }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <code className="bg-black/50 text-light-text px-2 py-1 rounded text-sm">{row.section}</code>
                    </td>
                    <td className="py-3 px-4 text-gray-text">{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-black/30 rounded-lg border border-white/10">
            <p className="text-gray-text text-sm">
              Each <strong className="text-light-text">chunk</strong> corresponds to a signal segment — typically a few thousand records (timestamp, value). 
              Signals are written asynchronously as their own buffers fill up, so multiple devices can record concurrently without collisions.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Core Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: "fas fa-sync",
              title: "Asynchronous Write Model",
              description: "Each signal is independently buffered and flushed to disk. No shared locking, no global batching."
            },
            {
              icon: "fas fa-cube",
              title: "Per-Signal Chunking",
              description: "Every signal stored as isolated chunks with its own min/max timestamps and compressed payload."
            },
            {
              icon: "fas fa-compress-arrows-alt",
              title: "Adaptive Compression",
              description: "Supports multiple backends (zstd, lz4, zlib) with automatic fallback. Compression applied per-chunk."
            },
            {
              icon: "fas fa-search-location",
              title: "Indexed for Range Queries",
              description: "INDEX section allows jumping directly to relevant chunks without scanning the full file."
            },
            {
              icon: "fas fa-shield-alt",
              title: "Safe Finalization",
              description: "Written in two stages (temporary + final) for atomic save operations, preventing corruption."
            },
            {
              icon: "fas fa-forward",
              title: "Forward-Compatible",
              description: "Versioned binary layout ensures backward compatibility and structured evolution."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <i className={`${feature.icon} text-primary`}></i>
              </div>
              <h3 className="text-xl font-semibold text-light-text mb-3">{feature.title}</h3>
              <p className="text-gray-text text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Advantages for Plotune */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Advantages for Plotune
        </h2>

        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-light-text font-semibold">Need</th>
                <th className="text-left py-3 px-4 text-light-text font-semibold">How PLTX Solves It</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                {
                  need: "High-frequency data streams",
                  solution: "Chunked async writes prevent memory pressure"
                },
                {
                  need: "Multi-signal recording",
                  solution: "Independent buffers ensure no global locking"
                },
                {
                  need: "File safety under failure",
                  solution: "Atomic finalize + temporary buffer"
                },
                {
                  need: "Fast random access",
                  solution: "Indexed chunk offsets with min/max timestamps"
                },
                {
                  need: "Realtime compression",
                  solution: "Lightweight per-chunk compressors"
                },
                {
                  need: "Platform-neutral format",
                  solution: "Fully portable binary layout, endian-safe"
                }
              ].map((advantage, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-gray-text">{advantage.need}</td>
                  <td className="py-3 px-4 text-light-text">{advantage.solution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Why Not Existing Formats */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          Why Not Use Existing Formats?
        </h2>

        <div className="bg-dark-surface backdrop-blur-xl rounded-2xl p-6 border border-white/5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-light-text font-semibold">Format</th>
                <th className="text-left py-3 px-4 text-light-text font-semibold">Issue for Plotune</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                {
                  format: "CSV",
                  issue: "Slow writes, no compression, no time index"
                },
                {
                  format: "HDF5",
                  issue: "Requires schema + library bindings, poor async story"
                },
                {
                  format: "Parquet",
                  issue: "Batch-oriented; unsuitable for live appends"
                },
                {
                  format: "Feather / Arrow",
                  issue: "In-memory focus, no incremental disk writing"
                },
                {
                  format: "SQLite / TSDBs",
                  issue: "Adds complexity, slower at 100k+ writes/sec scale"
                }
              ].map((format, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <code className="bg-black/50 text-light-text px-2 py-1 rounded text-sm">{format.format}</code>
                  </td>
                  <td className="py-3 px-4 text-gray-text">{format.issue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* In Practice */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          In Practice
        </h2>

        <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-6 border border-secondary/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-light-text mb-4">Typical PLTX File</h3>
              <ul className="space-y-3 text-gray-text">
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-secondary mt-1"></i>
                  <span>12 signals streamed from extensions (Voltage, Current, RPM, Torque...)</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-secondary mt-1"></i>
                  <span>Recorded asynchronously for 10 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-secondary mt-1"></i>
                  <span>Saved atomically into a single ~30 MB file</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-secondary mt-1"></i>
                  <span>Read later by Plotune's backend or directly via SDK</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-light-text mb-4">Key Benefits</h3>
              <div className="space-y-2">
                {[
                  "Selective chunk re-reading without full decompression",
                  "Streaming playback to UI components",
                  "Re-export capabilities without data loss",
                  "Fast partial data access for analysis"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-black/30 rounded">
                    <i className="fas fa-star text-primary text-sm"></i>
                    <span className="text-light-text text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 border border-primary/30 text-center">
          <h3 className="text-2xl font-bold text-light-text mb-4">
            In Short
          </h3>
          <p className="text-gray-text text-lg italic max-w-3xl mx-auto">
            <strong className="text-light-text not-italic">PLTX is not a general-purpose file format.</strong><br />
            It's a <strong className="text-light-text not-italic">reliable, self-indexed container</strong> purpose-built for{" "}
            <strong className="text-light-text not-italic">Plotune's realtime signal ecosystem</strong> — 
            combining async safety, performance, and minimal overhead into one unified format.
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
          <a href="/docs?page=components-recorder" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-record-vinyl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Recorder Component
              </h3>
              <p className="text-gray-text text-sm">
                Create PLTX files by recording live signal data from extensions
              </p>
            </div>
          </a>

          <a href="/docs?page=extensions-offline" className="group">
            <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-file-import text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-light-text mb-2 group-hover:text-primary transition-colors">
                Offline Extensions
              </h3>
              <p className="text-gray-text text-sm">
                Playback and analyze PLTX files for post-processing and visualization
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
                Visualize PLTX signal data in real-time during file playback
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-gray-text italic">
          Last updated: November 2025 — PLTX File Format v2.0
        </p>
      </div>
    </div>
  );
}