// components/streams/ConnectionPanel.jsx - Updated
import React, { useState } from 'react';
import { FaCopy, FaLink, FaUser, FaCalendar, FaEye, FaEyeSlash, FaEdit } from 'react-icons/fa';

const ConnectionPanel = ({ stream, isShared, user, connectionStatus, onCopyConnection, streamToken }) => {
  const [showToken, setShowToken] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOwnerUsername = () => {
    if (isShared) {
      return stream.owner_email?.split('@')[0] || 'owner';
    }
    return user?.username || 'user';
  };

  const consumerUrl = `wss://stream.plotune.net/ws/consumer/${getOwnerUsername()}/${stream.name}/${user?.username}?token=${encodeURIComponent(streamToken)}`;

  // Masked display copy: the real URL (with the full stream token) is only
  // shown via the explicit show/hide toggle; Copy always uses the real URL.
  const displayUrl = showToken
    ? consumerUrl
    : consumerUrl.replace(/(token=)[^&]+/, '$1••••••••');

  return (
    <div className="bg-dark-card rounded-xl border border-white/10 p-5">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaLink /> Connection Details
      </h3>
      
      <div className="space-y-4">
        {/* Consumer URL */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-text text-sm">Consumer Endpoint</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowToken(!showToken)}
                aria-label={showToken ? 'Hide token in URL' : 'Show token in URL'}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-gray-text hover:text-light-text text-sm transition"
              >
                {showToken ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
              </button>
              <button
                onClick={onCopyConnection}
                className="inline-flex min-h-[44px] items-center justify-center text-primary hover:text-primary-dark text-sm transition"
              >
                <FaCopy className="w-3 h-3" /> Copy
              </button>
            </div>
          </div>
          <code className="bg-dark-bg text-xs p-3 rounded-lg block break-all font-mono">
            {displayUrl}
          </code>
        </div>

        {/* Stream Info */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-text">
              <FaUser className="w-4 h-4" />
              <span className="text-sm">Owner</span>
            </div>
            <span className="text-sm font-medium">
              {getOwnerUsername()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-text">
              <FaCalendar className="w-4 h-4" />
              <span className="text-sm">Created</span>
            </div>
            <span className="text-sm font-medium">
              {formatDate(stream.created_at)}
            </span>
          </div>
          
          {/* Permissions for shared streams */}
          {isShared && stream.shared_permissions && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-text">
                  <FaEye className="w-4 h-4" />
                  <span className="text-sm">Read</span>
                </div>
                <span className={`text-sm font-medium ${stream.shared_permissions.can_read ? 'text-green-400' : 'text-red-400'}`}>
                  {stream.shared_permissions.can_read ? '✓ Allowed' : '✗ Denied'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-text">
                  <FaEdit className="w-4 h-4" />
                  <span className="text-sm">Write</span>
                </div>
                <span className={`text-sm font-medium ${stream.shared_permissions.can_write ? 'text-green-400' : 'text-red-400'}`}>
                  {stream.shared_permissions.can_write ? '✓ Allowed' : '✗ Denied'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Connection Status */}
        <div className={`p-3 rounded-lg mt-4 ${
          connectionStatus === 'connected' ? 'bg-green-500/10 border border-green-500/20' :
          connectionStatus === 'connecting' ? 'bg-yellow-500/10 border border-yellow-500/20' :
          'bg-red-500/10 border border-red-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium">
              {connectionStatus === 'connected' ? 'Live connection active' :
               connectionStatus === 'connecting' ? 'Connecting to stream...' :
               connectionStatus === 'error' ? 'Connection failed — check your connection and try again' :
               'Disconnected from stream'}
            </span>
          </div>
          <p className="text-xs text-gray-text mt-1">
            {connectionStatus === 'connected' ? 'Receiving real-time messages' :
             connectionStatus === 'connecting' ? 'Establishing WebSocket connection' :
             connectionStatus === 'error' ? 'The connection attempt did not succeed' :
             'Click Connect to start consuming messages'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPanel;