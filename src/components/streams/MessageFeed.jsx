// components/streams/MessageFeed.jsx
import React from 'react';
import { FaDatabase, FaTrash, FaFilter, FaEye, FaClock, FaKey, FaHashtag } from 'react-icons/fa';

const MessageFeed = ({ messages, activeKey, showAllMessages, connectionStatus, onClearMessages, onToggleView }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Convert Unix timestamp (seconds) to milliseconds
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const formatReceivedAt = (receivedAt) => {
    const date = new Date(receivedAt);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[400px] text-gray-text">
      <FaDatabase className="w-16 h-16 mb-4 opacity-50" />
      <p className="text-lg mb-2">No messages yet</p>
      <p className="text-sm text-center max-w-md">
        {connectionStatus === 'connected' 
          ? 'Messages will appear here as they arrive in real-time'
          : 'Connect to the stream to start receiving messages'}
      </p>
    </div>
  );

  return (
    <div className="bg-dark-card rounded-xl border border-white/10 h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaDatabase /> Live Message Feed
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {activeKey ? (
              <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded flex items-center gap-1">
                <FaFilter className="w-3 h-3" />
                Filtering by: <code className="ml-1 font-mono">{activeKey}</code>
              </span>
            ) : (
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded flex items-center gap-1">
                <FaEye className="w-3 h-3" />
                Showing all messages
              </span>
            )}
            <span className="text-xs text-gray-text">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all received messages?')) {
                  onClearMessages();
                }
              }}
              className="px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-sm flex items-center gap-2 transition"
            >
              <FaTrash className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
          
          <button
            onClick={onToggleView}
            className="px-3 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg text-sm flex items-center gap-2 transition"
          >
            <FaFilter className="w-4 h-4" />
            <span className="hidden sm:inline">
              {showAllMessages ? 'Filter' : 'Show All'}
            </span>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="p-5 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-dark-bg/50 rounded-lg p-4 border border-white/5 hover:border-primary/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded font-mono flex items-center gap-1">
                      <FaKey className="w-3 h-3" />
                      {msg.key}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded flex items-center gap-1">
                      <FaHashtag className="w-3 h-3" />
                      {msg.value}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-text">
                    <span className="flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      {formatTimestamp(msg.timestamp)}
                    </span>
                    <span>Received: {formatReceivedAt(msg.receivedAt)}</span>
                  </div>
                </div>
                
                {/* Raw JSON */}
                <div className="mt-2">
                  <pre className="text-xs bg-black/30 p-3 rounded overflow-x-auto font-mono">
                    {JSON.stringify({
                      key: msg.key,
                      timestamp: msg.timestamp,
                      value: msg.value,
                      receivedAt: msg.receivedAt
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
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
          <div className="text-gray-text text-xs">
            Messages update in real-time
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageFeed;