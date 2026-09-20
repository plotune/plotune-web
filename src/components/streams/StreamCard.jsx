// components/streams/StreamCard.jsx - Clean, responsive design
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCog, 
  FaTrash, 
  FaClock, 
  FaMemory, 
  FaEnvelope, 
  FaGlobe, 
  FaUser,
  FaEye,
  FaEdit,
  FaPlay,
} from 'react-icons/fa';
import StreamIcon from '../../assets/icons/stream.svg';

const StreamCard = ({ stream, onManage, onDelete, isShared = false, streamToken }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(stream.name);
    } catch (err) {
      // Failure toast is shown by the parent handler; just stop spinning.
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if user can connect (owner or has read access)
  const canConnect = !isShared || (stream.shared_permissions && stream.shared_permissions.can_read);

  return (
    <div className={`relative bg-gradient-to-br from-dark-card to-dark-surface rounded-2xl p-5 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden group ${
      isShared ? 'border-primary/20 hover:border-primary/40 hover:shadow-primary/5' : 'border-white/10 hover:border-primary/30 hover:shadow-primary/5'
    }`}>
      {/* Top Accent Bar */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-opacity ${
        isShared ? 'from-primary to-cyan-500 opacity-100' : 'from-primary to-primary-dark opacity-0 group-hover:opacity-100'
      }`}></div>
      
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Stream Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 ${
            isShared 
              ? 'bg-gradient-to-br from-primary/25 to-cyan-500/25 border-primary/40' 
              : 'bg-gradient-to-br from-primary/20 to-primary-dark/20 border-primary/30'
          }`}>
            <img 
              src={StreamIcon} 
              alt="Stream" 
              className="w-6 h-6 text-primary filter drop-shadow"
            />
          </div>
          
          {/* Title and Metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-light-text truncate group-hover:text-primary transition-colors mr-2">
                {stream.name}
              </h3>
              {/* Connect Button for Desktop */}
              {canConnect && (
                <Link
                  to="/streams/connect"
                  state={{ stream: stream, 
                            isShared: isShared, 
                            streamToken: streamToken
                  }}
                  className="hidden sm:block"
                >
                  <button
                    aria-label="Connect to stream"
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/20 group/connect"
                  >
                    <FaPlay className="w-4 h-4 ml-0.5" />
                  </button>
                </Link>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-text">
                <FaClock className="w-3 h-3" />
                <span>{formatDate(stream.created_at)}</span>
              </div>
              {isShared && stream.owner && (
                <div className="flex items-center gap-1 text-xs text-primary">
                  <FaUser className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{stream.owner.split('@')[0]}</span>
                </div>
              )}
              {isShared && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r from-primary/20 to-cyan-500/20 text-primary border border-primary/30">
                  Shared
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {stream.description && (
        <p className="text-gray-text text-sm mb-4 line-clamp-2 leading-relaxed group-hover:text-light-text transition-colors">
          {stream.description}
        </p>
      )}

      {/* Permissions for Shared Streams */}
      {isShared && stream.shared_permissions && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
              stream.shared_permissions.can_read 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
            }`}>
              <FaEye className="w-3 h-3" />
              {stream.shared_permissions.can_read ? 'Can Read' : 'No Read'}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
              stream.shared_permissions.can_write 
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
            }`}>
              <FaEdit className="w-3 h-3" />
              {stream.shared_permissions.can_write ? 'Can Write' : 'No Write'}
            </span>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Message Rate */}
        <div className="bg-dark-bg/10 backdrop-blur-xl rounded-lg p-3 border border-white/5 hover:border-primary/20 transition-all group-hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-text flex items-center gap-1.5">
              <FaEnvelope className="w-3 h-3" />
              <span className="hidden xs:inline">Max rate</span>
            </span>
            <span className="text-xs font-bold text-light-text">
              {stream.max_messages_per_second || 5}/s
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="h-1.5 bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-300"
              style={{ width: `${Math.min((stream.max_messages_per_second || 5) / 100 * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Message Size */}
        <div className="bg-dark-bg/10 backdrop-blur-xl rounded-lg p-3 border border-white/5 hover:border-primary/20 transition-all group-hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-text flex items-center gap-1.5">
              <FaMemory className="w-3 h-3" />
              <span className="hidden xs:inline">Size</span>
            </span>
            <span className="text-xs font-bold text-light-text">
              {formatBytes(stream.max_message_size_bytes || 1024)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 hidden xs:block">Max size</p>
        </div>

        {/* Retention */}
        <div className="bg-dark-bg/10 backdrop-blur-xl rounded-lg p-3 border border-white/5 hover:border-primary/20 transition-all group-hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-text flex items-center gap-1.5">
              <FaMemory className="w-3 h-3" />
              <span className="hidden xs:inline">Retention</span>
            </span>
            <span className="text-xs font-bold text-light-text">
              {stream.max_retention_messages || 1000}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 hidden xs:block">Messages</p>
        </div>
      </div>

      {/* Metadata Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Public Status - Only for owned streams */}
        {!isShared && stream.is_public !== undefined && (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
            stream.is_public 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
          }`}>
            <FaGlobe className="w-3 h-3" />
            <span className="hidden sm:inline">{stream.is_public ? 'Public' : 'Private'}</span>
          </span>
        )}
        
        {/* Message Count Estimate */}
        {stream.message_count !== undefined && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FaEnvelope className="w-3 h-3" />
            <span className="hidden sm:inline">{stream.message_count.toLocaleString()} msgs</span>
          </span>
        )}
      </div>

      {/* Action Buttons - Single responsive row */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-3">
        {/* Configure Button */}
        <button
          onClick={() => onManage(stream)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex-1 ${
            isShared
              ? 'bg-gradient-to-r from-primary/20 to-cyan-500/20 text-primary hover:from-primary/30 hover:to-cyan-500/30 hover:shadow-primary/20'
              : 'bg-gradient-to-r from-primary/20 to-primary-dark/20 text-primary hover:from-primary/30 hover:to-primary-dark/30 hover:shadow-primary/20'
          }`}
        >
          <FaCog className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">{isShared ? 'View Details' : 'Configure'}</span>
          <span className="sm:hidden">{isShared ? 'Details' : 'Config'}</span>
        </button>
        
        {/* Delete Button - only for owned streams */}
        {!isShared && onDelete && (
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500/20 to-rose-600/20 text-rose-400 rounded-lg text-sm font-medium hover:from-rose-500/30 hover:to-rose-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-rose-400 rounded-full animate-spin flex-shrink-0"></div>
                <span className="hidden sm:inline">Deleting...</span>
                <span className="sm:hidden">Delete...</span>
              </>
            ) : (
              <>
                <FaTrash className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Delete</span>
                <span className="sm:hidden">Del</span>
              </>
            )}
          </button>
        )}
        
        {/* Connect Button for Mobile */}
        {canConnect && (
          <Link
            to="/streams/connect"
              state={{ stream: stream, 
                isShared: isShared, 
                streamToken: streamToken
            }}
            className="sm:hidden"
          >
            <button className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/20">
              <FaPlay className="w-4 h-4 ml-0.5" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StreamCard;