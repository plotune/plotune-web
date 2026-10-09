// pages/Streams.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PlotuneStreams from '../components/streams/PlotuneStreams';
import PlotuneNetworks from '../components/networks/PlotuneNetworks';

const Streams = () => {
  const [activeTab, setActiveTab] = useState('streams'); // 'streams' or 'networks'

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <section aria-labelledby="stream-projects-heading" className="mb-8 flex flex-col gap-5 rounded-2xl border border-primary/30 bg-dark-card p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Plotune Stream</p>
            <h1 id="stream-projects-heading" className="text-2xl font-semibold text-light-text">Event projects</h1>
            <p className="mt-2 text-sm leading-6 text-gray-text">
              Collect, explore, and visualize engineering events from your devices, tests, and simulations.
              Create or select a project in the Stream workspace.
            </p>
          </div>
          <Link to="/stream/workspace" className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg">
            Open Stream workspace <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </section>
        <h2 className="mb-3 text-sm font-medium text-gray-text">Realtime streams &amp; networks</h2>

        {/* Main Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'streams' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-text hover:text-light-text'
            }`}
            onClick={() => setActiveTab('streams')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Streams
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'networks' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-text hover:text-light-text'
            }`}
            onClick={() => setActiveTab('networks')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Networks
          </button>
        </div>

        <div className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl">
          {activeTab === 'streams' ? (
            <PlotuneStreams />
          ) : (
            <PlotuneNetworks />
          )}
        </div>
      </div>
    </div>
  );
};

export default Streams;