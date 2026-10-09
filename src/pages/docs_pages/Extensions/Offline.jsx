import React from "react";

export default function ExtensionsOffline() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-light-text mb-4">
          Offline Extensions
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          Plotune add-ons for static or pre-recorded data sources — perfect for log replay, 
          post-processing, and batch analytics without live data feeds.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-file-csv text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">CSV/TSV Files</div>
        </div>
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-database text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Binary Logs</div>
        </div>
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-chart-line text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Batch Analytics</div>
        </div>
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-vial text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Testing & Debugging</div>
        </div>
      </div>

      {/* Introduction */}
      <section className="mb-12">
        <div className="bg-dark-surface  rounded-sm p-8 border border-ink/15">
          <h2 className="text-2xl font-bold text-light-text mb-4 flex items-center gap-3">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            Overview
          </h2>
          <p className="text-gray-text leading-relaxed">
            <strong className="text-light-text">Offline Extensions</strong> operate on static or 
            pre-recorded data sources like CSV files, binary logs, or other file formats. They are 
            designed for log replay, post-processing, and batch analytics without requiring a live 
            data feed.
          </p>
        </div>
      </section>

      {/* Use Cases & Characteristics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* When to Use */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-play-circle text-primary"></i>
            When to Use Offline Extensions
          </h2>
          <div className="space-y-3">
            {[
              "Replaying recorded vehicle or sensor logs for debugging and analysis",
              "Running large batch calculations (long-term statistical analysis)",
              "Converting proprietary binary logs into Plotune-friendly channels",
              "Testing visualizations and calculations without physical hardware"
            ].map((useCase, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-dark-surface  rounded-lg border border-ink/15">
                <i className="fas fa-check text-primary mt-1 text-sm"></i>
                <span className="text-gray-text">{useCase}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Key Characteristics */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-star text-secondary"></i>
            Key Characteristics
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-dark-surface  rounded-lg border border-ink/15">
              <h4 className="font-semibold text-light-text mb-2 flex items-center gap-2">
                <i className="fas fa-redo text-primary"></i>
                Deterministic
              </h4>
              <p className="text-gray-text text-sm">
                Same input file produces same outputs every run.
              </p>
            </div>
            <div className="p-4 bg-dark-surface  rounded-lg border border-ink/15">
              <h4 className="font-semibold text-light-text mb-2 flex items-center gap-2">
                <i className="fas fa-clock text-primary"></i>
                Non-realtime
              </h4>
              <p className="text-gray-text text-sm">
                Data processed as fast as resources allow or at configurable playback rate.
              </p>
            </div>
            <div className="p-4 bg-dark-surface  rounded-lg border border-ink/15">
              <h4 className="font-semibold text-light-text mb-2 flex items-center gap-2">
                <i className="fas fa-shield-alt text-primary"></i>
                Isolated
              </h4>
              <p className="text-gray-text text-sm">
                Runs in extension sandbox and emits into Plotune's data bus.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Supported Formats */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Supported Formats
        </h2>

        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['CSV/TSV', 'JSON Lines', 'Binary Formats', 'Proprietary Logs'].map((format, index) => (
              <div key={index} className="text-center p-4 bg-black/30 rounded-lg border border-ink/15">
                <div className="text-light-text font-semibold mb-2">{format}</div>
                <div className="text-gray-text text-sm">
                  {format === 'CSV/TSV' && 'Timestamped or indexed rows'}
                  {format === 'JSON Lines' && 'NDJSON format support'}
                  {format === 'Binary Formats' && 'Custom conversion layer'}
                  {format === 'Proprietary Logs' && 'Plugin-based conversion'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extension Manifest */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Extension Manifest
        </h2>

        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-light-text">Example Manifest</h3>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              JSON
            </span>
          </div>
          <p className="text-gray-text mb-4">
            The manifest advertises identity, supported formats, and the extension entry point.
          </p>
          <div className="bg-black/50 rounded-lg p-4 border border-ink/15">
            <pre className="text-light-text font-mono text-sm">
{`{
  "name": "plotune-extension-offline-csv",
  "version": "0.3.0",
  "category": "offline",
  "author": "Your Name",
  "description": "Plays back CSV telemetry files into Plotune streams.",
  "entry_point": "offline_csv:CSVOfflineExtension",
  "supported_formats": ["csv", "tsv", "ndjson"],
  "dependencies": ["plotune-sdk>=1.0.0", "pandas>=1.3.0"]
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Example Implementation
        </h2>

        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-light-text">CSV Offline Extension</h3>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Python
            </span>
          </div>
          <p className="text-gray-text mb-4">
            Minimal skeleton for a CSV offline extension. Production plugins should include proper 
            error handling, validation, and configurable buffering.
          </p>
          
        </div>
      </section>

      {/* Best Practices & Playback Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-graduation-cap text-primary"></i>
            Best Practices
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: "fas fa-memory",
                title: "Memory vs Streaming",
                desc: "For large logs, stream files instead of loading fully into memory"
              },
              {
                icon: "fas fa-clock",
                title: "Timestamp Normalization",
                desc: "Normalize all timestamps to unix epoch seconds for alignment"
              },
              {
                icon: "fas fa-exchange-alt",
                title: "Channel Mapping",
                desc: "Allow users to map file columns to Plotune stream names"
              },
              {
                icon: "fas fa-layer-group",
                title: "Batch Emit",
                desc: "Emit in small batches to reduce IPC overhead at high throughput"
              }
            ].map((practice, index) => (
              <div key={index} className="p-4 bg-dark-surface  rounded-lg border border-ink/15">
                <div className="flex items-center gap-3 mb-2">
                  <i className={`${practice.icon} text-primary`}></i>
                  <h4 className="font-semibold text-light-text">{practice.title}</h4>
                </div>
                <p className="text-gray-text text-sm">{practice.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Playback Controls */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-gamepad text-secondary"></i>
            Playback Controls
          </h2>
          <div className="space-y-4">
            {[
              { control: "Play / Pause", icon: "fas fa-play" },
              { control: "Seek to Timestamp / Percent", icon: "fas fa-search-location" },
              { control: "Playback Rate (0.25x - 2x)", icon: "fas fa-tachometer-alt" },
              { control: "Loop / Repeat", icon: "fas fa-redo" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-dark-surface  rounded-lg border border-ink/15">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <i className={`${item.icon} text-secondary`}></i>
                </div>
                <span className="text-light-text font-medium">{item.control}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Testing & Deployment */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Testing & Deployment
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Testing */}
          <div className="bg-dark-surface  to-transparent rounded-sm p-6 border border-primary/20">
            <h3 className="text-xl font-bold text-light-text mb-4 flex items-center gap-3">
              <i className="fas fa-vial text-primary"></i>
              Testing Strategy
            </h3>
            <ol className="space-y-3 text-gray-text">
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                Unit tests for parsing logic (CSV, custom binary parser)
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                Integration tests with local Plotune dev instance
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                Large file stress test for memory usage and throughput
              </li>
            </ol>
          </div>

          {/* Deployment */}
          <div className="bg-dark-surface  to-transparent rounded-sm p-6 border border-secondary/20">
            <h3 className="text-xl font-bold text-light-text mb-4 flex items-center gap-3">
              <i className="fas fa-rocket text-secondary"></i>
              Deployment Options
            </h3>
            <ul className="space-y-2 text-gray-text">
              <li className="flex items-center gap-2">
                <i className="fas fa-folder text-secondary text-sm"></i>
                <code className="bg-black/50 px-2 py-1 rounded text-sm">~/.plotune/extensions</code>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-store text-secondary text-sm"></i>
                Internal marketplace via Plotune UI
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-building text-secondary text-sm"></i>
                Enterprise deployment tools
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              question: "Can offline extensions write back processed files?",
              answer: "Yes — include an optional export feature to save processed streams as CSV, HDF5, or other formats."
            },
            {
              question: "Can I mix offline and online data?",
              answer: "Absolutely. Plotune allows mixing streams: replay offline logs while live sensors continue emitting."
            },
            {
              question: "How do I provide metadata for offline logs?",
              answer: "Include a companion JSON manifest or embed metadata headers. Expose through get_metadata() hook."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-dark-surface  rounded-sm p-6 border border-ink/15">
              <h4 className="text-lg font-semibold text-light-text mb-3 flex items-center gap-2">
                <i className="fas fa-question-circle text-primary"></i>
                {faq.question}
              </h4>
              <p className="text-gray-text">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-ink/15">
        <p className="text-gray-text italic">
          Last updated: November 2025 — Offline Extensions v1.0.0
        </p>
      </div>
    </div>
  );
}