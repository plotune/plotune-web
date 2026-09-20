// components/streams/StreamOverviewPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import StreamVisualizer from './StreamVisualizer';
import KeysPanel from './KeysPanel';
import useStreamWebSocket from '../../hooks/useStreamWebSocket';
import { toast } from 'react-toastify';

const StreamOverviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Get ALL data from location state, including token
  const { stream, isShared, streamToken } = location.state || {};
  
  const [activeKey, setActiveKey] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  
  // Check permissions
  const canRead = !isShared || stream?.shared_permissions?.can_read;

  // Initialize WebSocket for consuming
  const {
    connectionStatus,
    messageMap, // This is key -> array of messages
    uniqueKeys,
    loading,
    connect,
    disconnect,
    clearMessages
  } = useStreamWebSocket(stream, isShared, user, streamToken, 'consumer');

  // Debug: Log data flow (dev only — never log full buffers in production)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('messageMap updated:', messageMap);
      console.log('uniqueKeys updated:', uniqueKeys);
    }
  }, [messageMap, uniqueKeys]);

  // Auto-connect on component mount if user has read access
  useEffect(() => {
    if (stream && streamToken && user?.username && canRead) {
      console.log('Auto-connecting to stream...');
      connect();
    }
  }, []); // Empty deps - only run once on mount

  // Handle missing data
  if (!stream || !streamToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg">
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold text-light-text mb-4">
            {streamToken ? 'No Stream Selected' : 'Authentication Required'}
          </h2>
          <p className="text-gray-text mb-6">
            {streamToken 
              ? 'Please go back and select a stream to connect to.'
              : 'Stream token is missing. Please go back to streams page.'
            }
          </p>
          <button
            onClick={() => navigate('/streams')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Go Back to Streams
          </button>
        </div>
      </div>
    );
  }

  const toggleKeySelection = (key) => {
    const newSelected = new Set(selectedKeys);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedKeys(newSelected);
    
    if (newSelected.size === 0) {
      setActiveKey(key);
    }
  };

  const selectAllKeys = () => {
    setSelectedKeys(new Set(uniqueKeys));
  };

  const clearSelections = () => {
    setSelectedKeys(new Set());
  };

  // Get total points across all buffers
  const getTotalPoints = () => {
    return Object.values(messageMap).reduce(
      (total, buffer) => total + (buffer?.length || 0), 
      0
    );
  };

  const totalPoints = getTotalPoints();

  return (
    <div className="min-h-screen bg-dark-bg text-light-text">
      {/* Header */}
      <div className="bg-dark-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => navigate('/streams')}
                className="flex items-center gap-2 text-gray-text hover:text-light-text mb-2 sm:mb-0 transition"
              >
                ← Back to Streams
              </button>
              <h1 className="text-2xl font-bold truncate">{stream.name}</h1>
              {isShared && (
                <p className="text-primary text-sm mt-1">
                  Shared by: {stream.owner_email || stream.owner}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                connectionStatus === 'connected' 
                  ? 'bg-green-500/20 text-green-400' 
                  : connectionStatus === 'connecting'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </div>
              
              <div className="flex gap-2">
                {connectionStatus === 'connected' ? (
                  <button
                    onClick={disconnect}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    ⏹️ Disconnect
                  </button>
                ) : (
                  <button
                    onClick={connectionStatus === 'connected' ? disconnect : connect}
                    disabled={loading || connectionStatus === 'connecting' || (!canRead && connectionStatus !== 'connected')}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {connectionStatus === 'connected' ? '⏹️ Disconnect' : 
                    connectionStatus === 'connecting' ? '🔄 Connecting...' : '▶️ Connect'}
                  </button>
                )}
                
                <button
                  onClick={() => {
                    if (totalPoints > 0 && !window.confirm('Clear all captured data points? This cannot be undone.')) return;
                    clearMessages();
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Clear Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-white/5 bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span>
                {connectionStatus === 'connected' ? 'Receiving real-time data' :
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            
            <div className="hidden sm:block text-gray-text">•</div>
            
            <div>
              <span className="text-gray-text">Keys:</span>{' '}
              <span className="font-semibold">{uniqueKeys.length}</span>
            </div>
            
            <div className="hidden sm:block text-gray-text">•</div>
            
            <div>
              <span className="text-gray-text">Data Points:</span>{' '}
              <span className="font-semibold">{totalPoints.toLocaleString()}</span>
            </div>
            
            <div className="hidden sm:block text-gray-text">•</div>
            
            <div>
              <span className="text-gray-text">Buffer:</span>{' '}
              <span className="font-semibold">2000 points/signal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Keys Selection */}
          <div className="lg:col-span-1">
            <KeysPanel 
              keys={uniqueKeys}
              activeKey={activeKey}
              selectedKeys={selectedKeys}
              onSelectKey={(key) => {
                setActiveKey(key);
                if (selectedKeys.size > 0) {
                  clearSelections();
                }
              }}
              onToggleKey={toggleKeySelection}
              onSelectAll={selectAllKeys}
              onClearSelections={clearSelections}
              dataBuffers={messageMap} // Directly pass messageMap
            />
          </div>

          {/* Right Panel - Visualization */}
          <div className="lg:col-span-3">
            <StreamVisualizer 
              data={messageMap}
              activeKey={activeKey}
              selectedKeys={Array.from(selectedKeys)}
              connectionStatus={connectionStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamOverviewPage;