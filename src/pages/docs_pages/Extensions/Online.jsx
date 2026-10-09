import React from "react";

export default function ExtensionsOnline() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-light-text mb-4">
          Online Extensions
        </h1>
        <p className="text-xl text-gray-text max-w-3xl mx-auto">
          Real-time data acquisition extensions for live data streams — connect to sensors, 
          devices, and network protocols for immediate visualization and analysis.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-satellite-dish text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Real-time Streams</div>
        </div>
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-microchip text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Hardware Interfaces</div>
        </div>
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-network-wired text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Network Protocols</div>
        </div>
        <div className="bg-dark-surface  rounded-sm p-6 border border-ink/15 text-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
            <i className="fas fa-bolt text-primary"></i>
          </div>
          <div className="text-sm font-semibold text-light-text">Live Monitoring</div>
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
            <strong className="text-light-text">Online Extensions</strong> handle real-time data 
            acquisition from live sources such as UART, CAN bus, Bluetooth, network streams, and 
            other hardware interfaces. They are designed for immediate data processing, live 
            monitoring, and interactive control of connected devices.
          </p>
        </div>
      </section>

      {/* Use Cases & Characteristics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* When to Use */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-play-circle text-primary"></i>
            When to Use Online Extensions
          </h2>
          <div className="space-y-3">
            {[
              "Live monitoring of sensor data during experiments or testing",
              "Real-time control systems for industrial automation",
              "Network data acquisition from TCP/UDP streams or WebSockets",
              "Hardware-in-the-loop (HIL) testing and validation"
            ].map((useCase, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-dark-surface  rounded-lg border border-ink/15">
                <i className="fas fa-bolt text-primary mt-1 text-sm"></i>
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
                <i className="fas fa-clock text-primary"></i>
                Real-time
              </h4>
              <p className="text-gray-text text-sm">
                Processes data as it arrives with minimal latency for immediate feedback.
              </p>
            </div>
            <div className="p-4 bg-dark-surface  rounded-lg border border-ink/15">
              <h4 className="font-semibold text-light-text mb-2 flex items-center gap-2">
                <i className="fas fa-exchange-alt text-primary"></i>
                Bidirectional
              </h4>
              <p className="text-gray-text text-sm">
                Many online extensions support both data acquisition and device control.
              </p>
            </div>
            <div className="p-4 bg-dark-surface  rounded-lg border border-ink/15">
              <h4 className="font-semibold text-light-text mb-2 flex items-center gap-2">
                <i className="fas fa-heartbeat text-primary"></i>
                Stateful
              </h4>
              <p className="text-gray-text text-sm">
                Maintains connection state and handles reconnection automatically.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Supported Protocols */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-light-text mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          Supported Protocols & Interfaces
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { name: 'UART/Serial', icon: 'fas fa-port' },
            { name: 'CAN Bus', icon: 'fas fa-bus' },
            { name: 'Bluetooth', icon: 'fab fa-bluetooth' },
            { name: 'TCP/UDP', icon: 'fas fa-wifi' },
            { name: 'WebSocket', icon: 'fas fa-globe' },
            { name: 'MQTT', icon: 'fas fa-broadcast-tower' },
            { name: 'GPIO', icon: 'fas fa-plug' },
            { name: 'I2C/SPI', icon: 'fas fa-project-diagram' }
          ].map((protocol, index) => (
            <div key={index} className="text-center p-4 bg-dark-surface  rounded-lg border border-ink/15 hover:border-primary/30 transition-all duration-300">
              <i className={`${protocol.icon} text-2xl text-primary mb-2`}></i>
              <div className="text-light-text font-semibold text-sm">{protocol.name}</div>
            </div>
          ))}
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
            Online extensions include real-time capabilities and connection configuration.
          </p>
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
            <h3 className="text-xl font-semibold text-light-text">UART Serial Extension</h3>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Python
            </span>
          </div>
          <p className="text-gray-text mb-4">
            Real-time UART extension with connection management and error handling.
          </p>
        </div>
      </section>

      {/* Best Practices & Features */}
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
                icon: "fas fa-heartbeat",
                title: "Connection Management",
                desc: "Implement automatic reconnection with exponential backoff"
              },
              {
                icon: "fas fa-shield-alt",
                title: "Error Handling",
                desc: "Gracefully handle disconnections, timeouts, and protocol errors"
              },
              {
                icon: "fas fa-tachometer-alt",
                title: "Backpressure Management",
                desc: "Handle data bursts without overwhelming the system"
              },
              {
                icon: "fas fa-memory",
                title: "Resource Efficiency",
                desc: "Use non-blocking I/O and appropriate buffer sizes"
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

        {/* Real-time Features */}
        <section>
          <h2 className="text-2xl font-bold text-light-text mb-6 flex items-center gap-3">
            <i className="fas fa-sliders-h text-secondary"></i>
            Real-time Features
          </h2>
          <div className="space-y-4">
            {[
              { feature: "Connection Status Monitoring", icon: "fas fa-link" },
              { feature: "Data Rate Statistics", icon: "fas fa-chart-bar" },
              { feature: "Bidirectional Control", icon: "fas fa-exchange-alt" },
              { feature: "Quality of Service Metrics", icon: "fas fa-chart-line" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-dark-surface  rounded-lg border border-ink/15">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <i className={`${item.icon} text-secondary`}></i>
                </div>
                <span className="text-light-text font-medium">{item.feature}</span>
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
                Unit tests with mocked hardware interfaces
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                Integration tests with virtual serial ports or loopback
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                Hardware-in-the-loop testing with actual devices
              </li>
            </ol>
          </div>

          {/* Performance Considerations */}
          <div className="bg-dark-surface  to-transparent rounded-sm p-6 border border-secondary/20">
            <h3 className="text-xl font-bold text-light-text mb-4 flex items-center gap-3">
              <i className="fas fa-tachometer-alt text-secondary"></i>
              Performance Considerations
            </h3>
            <ul className="space-y-2 text-gray-text">
              <li className="flex items-center gap-2">
                <i className="fas fa-clock text-secondary text-sm"></i>
                Latency requirements for real-time applications
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-stream text-secondary text-sm"></i>
                Data throughput and buffer management
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-cogs text-secondary text-sm"></i>
                CPU usage optimization for high-frequency data
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
              question: "How do online extensions handle disconnections?",
              answer: "Extensions should implement automatic reconnection logic with configurable retry intervals and exponential backoff."
            },
            {
              question: "Can online extensions work with multiple devices simultaneously?",
              answer: "Yes, extensions can manage multiple connections by creating separate instances or using connection pooling."
            },
            {
              question: "What's the maximum data rate supported?",
              answer: "Data rate depends on hardware, protocol, and system resources. Most extensions can handle several thousand messages per second."
            },
            {
              question: "How do I add custom configuration for my hardware?",
              answer: "Extensions can define custom configuration parameters in their manifest that appear in the Plotune UI settings."
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
          Last updated: November 2025 — Online Extensions v1.0.0
        </p>
      </div>
    </div>
  );
}