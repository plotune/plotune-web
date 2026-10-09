import React from "react";

export default function SDK() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-light-text mb-4">
          Plotune SDK
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          Python-based client library for extending Plotune with custom plugins, 
          data connectors, and automation workflows.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mt-4">
          <i className="fas fa-code"></i>
          pip install plotune-sdk
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <i className="fas fa-puzzle-piece text-primary"></i>
          </div>
          <div className="text-lg font-semibold text-light-text mb-2">Plugin Development</div>
          <div className="text-gray-text text-sm">Extend with custom data sources and visualizations</div>
        </div>
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <i className="fas fa-plug text-primary"></i>
          </div>
          <div className="text-lg font-semibold text-light-text mb-2">Seamless Integration</div>
          <div className="text-gray-text text-sm">Abstract communication between frontend and backend</div>
        </div>
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <i className="fas fa-share-alt text-primary"></i>
          </div>
          <div className="text-lg font-semibold text-light-text mb-2">Reusable Workflows</div>
          <div className="text-gray-text text-sm">Build once, deploy across multiple projects</div>
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
            The <strong className="text-light-text">Plotune SDK</strong> provides a clean and extensible API for 
            building plugins, data-connectors, and custom workflows. It enables developers to automate data ingestion, 
            extend visualizations, drive calculations, and manage connectivity between backend and frontend.
          </p>
        </div>
      </section>

      {/* Why Use SDK */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-8 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Why Use the SDK?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-cogs text-primary"></i>
            </div>
            <h3 className="text-xl font-semibold text-light-text mb-3">Plugin Development</h3>
            <p className="text-gray-text">
              Structured interface and lifecycle hooks for adding new data sources (UART, CAN, Bluetooth) 
              or creating custom computation nodes.
            </p>
          </div>

          <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-exchange-alt text-primary"></i>
            </div>
            <h3 className="text-xl font-semibold text-light-text mb-3">Seamless Integration</h3>
            <p className="text-gray-text">
              Abstracts communication layer between Python backend and PyQt5 frontend, 
              letting you focus on logic rather than plumbing.
            </p>
          </div>

          <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-boxes text-primary"></i>
            </div>
            <h3 className="text-xl font-semibold text-light-text mb-3">Reusable Workflows</h3>
            <p className="text-gray-text">
              Build one component and deploy it to multiple projects, or share in your internal 
              marketplace for others to consume.
            </p>
          </div>
        </div>
      </section>

      {/* Installation & Setup */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Installation & Setup
        </h2>

        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-light-text">Installation</h3>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Terminal
            </span>
          </div>
          <div className="bg-black/50 rounded-lg p-4 border border-ink/15">
            <code className="text-light-text font-mono">pip install plotune-sdk</code>
          </div>
        </div>

        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15">
          <h3 className="text-xl font-semibold text-light-text mb-4">Basic Setup</h3>
          <div className="bg-black/50 rounded-lg p-4 border border-ink/15 mb-4">
            <pre className="text-light-text font-mono text-sm">
{`from plotune_sdk import PlotuneClient, SourcePlugin, VisualPlugin

client = PlotuneClient(
    host="127.0.0.1",
    port=6379,
    api_key="YOUR_API_KEY"
)`}
            </pre>
          </div>
        </div>
      </section>

      {/* Core Concepts */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-8 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Core Concepts
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-surface  to-transparent rounded-sm p-6 border border-primary/20">
            <h3 className="text-xl font-bold text-light-text mb-4 flex items-center gap-3">
              <i className="fas fa-user text-primary"></i>
              Client
            </h3>
            <p className="text-gray-text">
              The main access point to Plotune services. Handles connection, session management, 
              and acts as a factory for plugins and streams.
            </p>
          </div>

          <div className="bg-dark-surface  to-transparent rounded-sm p-6 border border-primary/20">
            <h3 className="text-xl font-bold text-light-text mb-4 flex items-center gap-3">
              <i className="fas fa-database text-primary"></i>
              SourcePlugin
            </h3>
            <p className="text-gray-text">
              Extend this class to implement new data ingestion methods. Offers hooks like 
              <code className="mx-1 px-1 bg-black/50 rounded">on_start()</code>, 
              <code className="mx-1 px-1 bg-black/50 rounded">on_data()</code>, and 
              <code className="mx-1 px-1 bg-black/50 rounded">on_stop()</code>.
            </p>
          </div>

          <div className="bg-dark-surface  to-transparent rounded-sm p-6 border border-secondary/20">
            <h3 className="text-xl font-bold text-light-text mb-4 flex items-center gap-3">
              <i className="fas fa-eye text-secondary"></i>
              VisualPlugin
            </h3>
            <p className="text-gray-text">
              Use this to add custom visualization panels to the frontend. Defines metadata about 
              rendering, supported data types, and UI callbacks.
            </p>
          </div>

          <div className="bg-dark-surface  to-transparent rounded-sm p-6 border border-secondary/20">
            <h3 className="text-xl font-bold text-light-text mb-4 flex items-center gap-3">
              <i className="fas fa-calculator text-secondary"></i>
              CalculationNode
            </h3>
            <p className="text-gray-text">
              For implementing backend-calculation modules. Define input streams, output streams, 
              and compute logic for mathematical and statistical operations.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Example */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Quick Start Example
        </h2>

        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-light-text">Serial Source Plugin</h3>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Python
            </span>
          </div>
          <div className="bg-black/50 rounded-lg p-4 border border-ink/15">
            <pre className="text-light-text font-mono text-sm">
{`# Example: simple SourcePlugin implementation
from plotune_sdk import SourcePlugin, PlotuneClient
import time

class MySerialSource(SourcePlugin):
    def on_start(self):
        self.serial = open(self.config["port"], baudrate=self.config["baudrate"])

    def on_data(self):
        line = self.serial.readline()
        self.emit_payload({'timestamp': time.time(), 'value': float(line)})

    def on_stop(self):
        self.serial.close()

if __name__ == "__main__":
    client = PlotuneClient(host="localhost", api_key="ABC123")
    client.register_plugin(MySerialSource, name="SerialReader", version="0.1.0")
    client.start()`}
            </pre>
          </div>
        </div>
      </section>

      {/* Reference & Troubleshooting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Reference Documentation */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-book text-primary"></i>
            Reference Documentation
          </h2>
          <div className="space-y-3">
            {[
              "plotune_sdk.client — connection, session, plugin registry",
              "plotune_sdk.plugins.source — base classes for source ingestion",
              "plotune_sdk.plugins.visual — base classes for UI panel definitions",
              "plotune_sdk.nodes.calculation — base classes for calculation nodes"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-dark-surface  rounded-lg border border-ink/15">
                <i className="fas fa-code-branch text-primary mt-1 text-sm"></i>
                <code className="text-gray-text font-mono text-sm">{item}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-life-ring text-secondary"></i>
            Troubleshooting
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-dark-surface  rounded-lg border border-ink/15">
              <h4 className="font-semibold text-light-text mb-2">"Plugin fails to register"</h4>
              <p className="text-gray-text text-sm">
                Ensure your API key has the "Plugin Developer" role and that your plugin class 
                inherits from the correct SDK base class.
              </p>
            </div>
            <div className="p-4 bg-dark-surface  rounded-lg border border-ink/15">
              <h4 className="font-semibold text-light-text mb-2">"No data arriving in frontend"</h4>
              <p className="text-gray-text text-sm">
                Confirm that you called <code className="bg-black/50 px-1 rounded">emit_payload()</code> with the 
                correct stream channel name and that the frontend is subscribed to it.
              </p>
            </div>
            <div className="p-4 bg-dark-surface  rounded-lg border border-ink/15">
              <h4 className="font-semibold text-light-text mb-2">"Version compatibility error"</h4>
              <p className="text-gray-text text-sm">
                Check that your plugin version is compatible with the installed Plotune backend version.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Roadmap */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          SDK Roadmap
        </h2>

        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Asynchronous plugin support (async/await) for high-frequency streams",
              "Automatic plugin packaging and publishing via CLI",
              "Type-hints and better stubs for IDE support",
              "Example repository of fully built plugins"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-road text-primary text-sm"></i>
                </div>
                <span className="text-gray-text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-ink/15">
        <p className="text-gray-text italic">
          Last updated: November 2025 — Plotune SDK v1.0.0
        </p>
      </div>
    </div>
  );
}