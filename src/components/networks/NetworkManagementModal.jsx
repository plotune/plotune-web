// components/networks/NetworkManagementModal.jsx
import React, { useState, useRef } from 'react';
import { 
  FaTimes, 
  FaUsers,
  FaGlobe ,
  FaTrash,
  FaUserPlus,
  FaCloudUploadAlt,
  FaEye,
  FaUser,
  FaNetworkWired,
  FaCopy,
  FaCheck,
  FaLock
} from 'react-icons/fa';
import useModalDismiss from '../../hooks/useModalDismiss';

const NetworkManagementModal = ({ 
  network, 
  onClose, 
  onUpdate, 
  onShare, 
  onUnshare,
  user,
  isAuthorized = false 
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermissions, setSharePermissions] = useState({
    can_publish: true,
    can_subscribe: true
  });
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const panelRef = useRef(null);
  useModalDismiss(true, onClose, panelRef);

  // Filter out owner from auths list
  const peerAuths = network.auths ? network.auths.filter(auth => 
    auth.user_email !== network.owner_email
  ) : [];

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (shareEmail && onShare) {
      setIsSharing(true);
      try {
        await onShare(network.name, shareEmail, sharePermissions);
        // Only clear the email once the share succeeded, so a failure
        // keeps the typed value for an easy retry.
        setShareEmail('');
      } catch (err) {
        // Failure toast is shown by the parent; keep the typed email.
      } finally {
        setIsSharing(false);
      }
    }
  };

  const handleUnshare = (userEmail) => {
    if (onUnshare && window.confirm(`Remove ${userEmail} from this network?`)) {
      onUnshare(network.name, userEmail);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div ref={panelRef} className="bg-dark-card rounded-2xl border border-white/10 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-light-text">{network.name}</h3>
              <p className="text-gray-text text-sm mt-1">
                {isAuthorized ? 'Joined Network' : 'Network Management'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-text hover:text-light-text transition p-2 hover:bg-white/5 rounded-lg"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 -mx-6 px-6">
            <button
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'details' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-text hover:text-light-text'
              }`}
              onClick={() => setActiveTab('details')}
            >
              <FaNetworkWired className="w-4 h-4" />
              Details
            </button>
            {!isAuthorized && (
              <button
                className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'sharing' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-text hover:text-light-text'
                }`}
                onClick={() => setActiveTab('sharing')}
              >
                <FaUsers className="w-4 h-4" />
                Peers ({peerAuths.length})
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Network Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-4 border border-white/5">
                  <h4 className="text-light-text font-medium mb-3">Network Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-text">Owner</p>
                      <p className="text-sm text-light-text">{network.owner_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-text">Created</p>
                      <p className="text-sm text-light-text">
                        {new Date(network.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-text">Status</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                        network.is_active 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {network.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-4 border border-white/5">
                  <h4 className="text-light-text font-medium mb-3">Visibility & Access</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {network.is_public ? (
                          <>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                              <FaGlobe className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-light-text">Public Network</p>
                              <p className="text-xs text-gray-text">Anyone can discover</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                              <FaLock className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm text-light-text">Private Network</p>
                              <p className="text-xs text-gray-text">Invite only</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {isAuthorized && (
                      <div className="pt-3 border-t border-white/5">
                        <p className="text-xs text-gray-text mb-2">Your Permissions</p>
                        <div className="flex gap-2">
                          {network.auths?.find(a => a.user_email === user?.email)?.can_publish && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <FaCloudUploadAlt className="w-3 h-3" />
                              Can Publish
                            </span>
                          )}
                          {network.auths?.find(a => a.user_email === user?.email)?.can_subscribe && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <FaEye className="w-3 h-3" />
                              Can Subscribe
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {network.description && (
                <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-4 border border-white/5">
                  <h4 className="text-light-text font-medium mb-2">Description</h4>
                  <p className="text-gray-text text-sm leading-relaxed">
                    {network.description}
                  </p>
                </div>
              )}

              {/* Network ID */}
              <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-light-text font-medium">Network ID</h4>
                  <button
                    onClick={() => copyToClipboard(network.name)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition"
                  >
                    {copied ? (
                      <>
                        <FaCheck className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FaCopy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <code className="text-sm text-gray-text bg-black/30 px-3 py-2 rounded-lg block break-all">
                  {network.name}
                </code>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Share Form */}
              <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-4 border border-white/5">
                <h4 className="text-light-text font-medium mb-4">Add Peer</h4>
                <form onSubmit={handleShareSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-text mb-2 text-sm">Email Address</label>
                    <input
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      className="w-full p-3 bg-dark-bg rounded-lg border border-white/10 text-light-text focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      placeholder="peer@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-text mb-2 text-sm">Permissions</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg border border-white/10 hover:border-primary/30 transition cursor-pointer">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={sharePermissions.can_publish}
                            onChange={(e) => setSharePermissions(prev => ({
                              ...prev,
                              can_publish: e.target.checked
                            }))}
                            className="w-4 h-4 text-primary bg-dark-surface border-white/10 rounded focus:ring-primary/20"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCloudUploadAlt className="w-4 h-4 text-blue-400" />
                          <div>
                            <p className="text-sm text-light-text">Can Publish</p>
                            <p className="text-xs text-gray-text">Send data to streams</p>
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg border border-white/10 hover:border-primary/30 transition cursor-pointer">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={sharePermissions.can_subscribe}
                            onChange={(e) => setSharePermissions(prev => ({
                              ...prev,
                              can_subscribe: e.target.checked
                            }))}
                            className="w-4 h-4 text-primary bg-dark-surface border-white/10 rounded focus:ring-primary/20"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEye className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="text-sm text-light-text">Can Subscribe</p>
                            <p className="text-xs text-gray-text">Receive data from streams</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSharing}
                    className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    {isSharing ? 'Inviting…' : 'Invite Peer'}
                  </button>
                </form>
              </div>

              {/* Connected Peers List */}
              <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-light-text font-medium">Connected Peers ({peerAuths.length})</h4>
                </div>
                
                {peerAuths.length > 0 ? (
                  <div className="space-y-3">
                    {peerAuths.map((auth) => (
                      <div key={auth.user_email} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                            <FaUser className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-sm text-light-text">{auth.user_email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {auth.can_publish && (
                                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                  Publish
                                </span>
                              )}
                              {auth.can_subscribe && (
                                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                                  Subscribe
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnshare(auth.user_email)}
                          className="flex items-center gap-2 px-3 min-h-[44px] text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          aria-label="Remove peer"
                        >
                          <FaTrash className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-500/20 to-gray-600/20 flex items-center justify-center">
                      <FaUsers className="w-8 h-8 text-gray-500" />
                    </div>
                    <h4 className="text-light-text font-medium mb-2">No peers yet</h4>
                    <p className="text-gray-text text-sm">
                      Invite peers to join your network using the form above
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-dark-surface/50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-text">
              {activeTab === 'details' 
                ? 'Manage network details and settings' 
                : 'Manage peer connections and permissions'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
              {activeTab === 'sharing' && onUpdate && (
                <button
                  onClick={onUpdate}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                  Refresh List
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkManagementModal;