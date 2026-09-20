// components/networks/NetworkCard.jsx - GÜNCELLENMİŞ
import React, { useState } from 'react';
import { 
  FaCog, 
  FaTrash, 
  FaUsers,
  FaGlobe,
  FaLock,
  FaUser,
  FaEye,
  FaCloudUploadAlt,
  FaCalendar,
  FaNetworkWired,
  FaToggleOn,
  FaToggleOff,
  FaPowerOff,
  FaExclamationTriangle
} from 'react-icons/fa';

const NetworkCard = ({ 
  network, 
  onManage, 
  onDelete, 
  onToggleStatus,
  isAuthorized = false,
  isUpdating = false,
  currentUserEmail 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
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
    await onDelete(network.name);
    setIsDeleting(false);
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    if (onToggleStatus) {
      onToggleStatus();
    }
  };

  // Count connected peers (auths)
  const connectedPeers = network.auths ? network.auths.length : 0;

  // Check if network is disabled for security
  const isDisabledForSecurity = isAuthorized && !network.enabled;

  return (
    <div className={`relative bg-gradient-to-br from-dark-card to-dark-surface rounded-2xl p-5 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden group ${
      isDisabledForSecurity 
        ? 'border-amber-500/20 hover:border-amber-500/40 hover:shadow-amber-500/5' 
        : isAuthorized 
          ? 'border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/5' 
          : 'border-white/10 hover:border-primary/30 hover:shadow-primary/5'
    } ${isDisabledForSecurity ? 'opacity-80' : ''}`}>
      
      {/* Top Accent Bar */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-opacity ${
        isDisabledForSecurity 
          ? 'from-amber-500 to-orange-500 opacity-100' 
          : isAuthorized 
            ? 'from-cyan-500 to-blue-500 opacity-100' 
            : 'from-primary to-primary-dark opacity-0 group-hover:opacity-100'
      }`}></div>
      
      {/* Disabled Overlay for Security */}
      {isDisabledForSecurity && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 pointer-events-none"></div>
      )}
      
      {/* Security Warning Badge */}
      {isDisabledForSecurity && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-lg border border-amber-500/30 text-xs font-medium backdrop-blur-sm">
            <FaExclamationTriangle className="w-3 h-3" />
            Disabled
          </div>
        </div>
      )}
      
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Network Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 ${
            isDisabledForSecurity
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/40' 
              : isAuthorized 
                ? 'bg-gradient-to-br from-cyan-500/25 to-blue-500/25 border-cyan-500/40' 
                : 'bg-gradient-to-br from-primary/20 to-primary-dark/20 border-primary/30'
          }`}>
            <FaNetworkWired className={`w-6 h-6 ${
              isDisabledForSecurity ? 'text-amber-400' : 'text-primary'
            }`} />
          </div>
          
          {/* Title and Metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold truncate group-hover:text-primary transition-colors mr-2 ${
                isDisabledForSecurity ? 'text-amber-300' : 'text-light-text'
              }`}>
                {network.name}
              </h3>
              {/* Status Badge */}
              {!isAuthorized && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  network.is_active 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {network.is_active ? 'Active' : 'Inactive'}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-text">
                <FaCalendar className="w-3 h-3" />
                <span>{formatDate(network.created_at)}</span>
              </div>
              {isAuthorized && (
                <div className="flex items-center gap-1 text-xs text-cyan-400">
                  <FaUser className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{network.owner_email?.split('@')[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {network.description && (
        <p className={`text-sm mb-4 line-clamp-2 leading-relaxed group-hover:text-light-text transition-colors ${
          isDisabledForSecurity ? 'text-amber-200/70' : 'text-gray-text'
        }`}>
          {network.description}
        </p>
      )}

      {/* Network Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {/* Connected Peers */}
        <div className={`backdrop-blur-xl rounded-lg p-3 border transition-all group-hover:-translate-y-0.5 ${
          isDisabledForSecurity
            ? 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20'
            : 'bg-dark-bg/10 border-white/5 hover:border-primary/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDisabledForSecurity
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
                  : 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20'
              }`}>
                <FaUsers className={`w-3 h-3 ${
                  isDisabledForSecurity ? 'text-amber-400' : 'text-cyan-400'
                }`} />
              </div>
              <div>
                <p className="text-xs text-gray-text">Peers</p>
                <p className={`text-sm font-bold ${
                  isDisabledForSecurity ? 'text-amber-300' : 'text-light-text'
                }`}>{connectedPeers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className={`backdrop-blur-xl rounded-lg p-3 border transition-all group-hover:-translate-y-0.5 ${
          isDisabledForSecurity
            ? 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20'
            : 'bg-dark-bg/10 border-white/5 hover:border-primary/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDisabledForSecurity
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
                  : network.is_public 
                    ? 'bg-gradient-to-br from-primary/20 to-cyan-500/20' 
                    : 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20'
              }`}>
                {network.is_public ? (
                  <FaGlobe className={`w-3 h-3 ${
                    isDisabledForSecurity ? 'text-amber-400' : 'text-primary'
                  }`} />
                ) : (
                  <FaLock className={`w-3 h-3 ${
                    isDisabledForSecurity ? 'text-amber-400' : 'text-purple-400'
                  }`} />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-text">Visibility</p>
                <p className={`text-sm font-bold ${
                  isDisabledForSecurity ? 'text-amber-300' : 'text-light-text'
                }`}>
                  {network.is_public ? 'Public' : 'Private'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions (for authorized networks) */}
      {isAuthorized && network.user_auth && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {network.user_auth.can_publish && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                isDisabledForSecurity
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                <FaCloudUploadAlt className="w-3 h-3" />
                Can Publish
              </span>
            )}
            {network.user_auth.can_subscribe && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                isDisabledForSecurity
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                <FaEye className="w-3 h-3" />
                Can Subscribe
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-3">
        {/* Configure/View Button */}
        <button
          onClick={() => onManage(network)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex-1 ${
            isDisabledForSecurity
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 hover:from-amber-500/30 hover:to-orange-500/30 hover:shadow-amber-500/20'
              : isAuthorized
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 hover:shadow-cyan-500/20'
                : 'bg-gradient-to-r from-primary/20 to-primary-dark/20 text-primary hover:from-primary/30 hover:to-primary-dark/30 hover:shadow-primary/20'
          }`}
        >
          <FaCog className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">{isAuthorized ? 'View Details' : 'Manage'}</span>
          <span className="sm:hidden">{isAuthorized ? 'Details' : 'Manage'}</span>
        </button>
        
        {/* Toggle Status Button for authorized networks */}
        {isAuthorized && onToggleStatus && (
          <button
            onClick={handleToggleClick}
            disabled={isUpdating}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex-1 ${
              network.enabled
                ? 'bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-400 hover:from-rose-500/30 hover:to-red-500/30 hover:shadow-rose-500/20'
                : 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 hover:from-emerald-500/30 hover:to-green-500/30 hover:shadow-emerald-500/20'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-current rounded-full animate-spin flex-shrink-0"></div>
                <span className="hidden sm:inline">Updating...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : network.enabled ? (
              <>
                <FaToggleOff className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Disable</span>
                <span className="sm:hidden">Off</span>
              </>
            ) : (
              <>
                <FaToggleOn className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Enable</span>
                <span className="sm:hidden">On</span>
              </>
            )}
          </button>
        )}
        
        {/* Delete Button - only for owned networks */}
        {!isAuthorized && onDelete && (
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
      </div>
    </div>
  );
};

export default NetworkCard;