// pages/Streams.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import PlotuneStreams from '../components/streams/PlotuneStreams';
import PlotuneNetworks from '../components/networks/PlotuneNetworks';

const Streams = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('streams'); // 'streams' or 'networks'

  return (
    <div className="min-h-screen bg-dark-surface pt-24 pb-12">
      <div className="container mx-auto px-4">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Account tools</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-light-text">Streams &amp; Networks</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-text">Manage stream connections and peer networks from one workspace.</p>
        </header>

        {/* Main Tabs */}
        <div className="flex overflow-x-auto border-b border-ink/15 mb-8" role="tablist" aria-label="Streams and networks">
          <button
            role="tab"
            aria-selected={activeTab === 'streams'}
            className={`shrink-0 px-4 sm:px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
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
            role="tab"
            aria-selected={activeTab === 'networks'}
            className={`shrink-0 px-4 sm:px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
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

        <div className="bg-dark-card rounded-sm p-4 sm:p-6 border border-ink/15 ">
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
