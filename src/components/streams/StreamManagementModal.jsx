// components/streams/StreamManagementModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { streamApi } from '../../services/api';
import useModalDismiss from '../../hooks/useModalDismiss';

const StreamManagementModal = ({ 
  stream, 
  onClose, 
  onUpdate, 
  onShare, 
  onUnshare, 
  onDeleteStream,
  streamToken,
  user,
  isShared = false  // Add this prop
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isSharing, setIsSharing] = useState(false);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [loadingShared, setLoadingShared] = useState(false);
  const [shareForm, setShareForm] = useState({
    email: '',
    can_read: true,
    can_write: false
  });

  // Fetch shared users - only for owned streams
  const fetchSharedUsers = async () => {
    if (!streamToken || isShared) return;
    
    setLoadingShared(true);
    try {
      const response = await streamApi.get('/streams/shared-with', {
        params: { stream_name: stream.name },
        headers: { Authorization: streamToken },
      });
      
      setSharedUsers(response.data.shared_with || []);
    } catch (err) {
      console.error('Error fetching shared users:', err);
      toast.error('Failed to load shared users');
    } finally {
      setLoadingShared(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'sharing' && streamToken && !isShared) {
      fetchSharedUsers();
    }
  }, [activeTab, streamToken, isShared]);

  // Doherty/consistent dismissal: Escape and outside mousedown close the modal.
  // Suppressed while a share request is in flight so an accidental dismiss
  // can't orphan a pending request.
  useModalDismiss(!isSharing, onClose);

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!shareForm.email.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    if (isSharing) return;

    setIsSharing(true);
    try {
      await onShare(stream.name, shareForm.email, {
        can_read: shareForm.can_read,
        can_write: shareForm.can_write
      });

      // Only reset the form on success so a failed share keeps the typed email.
      setShareForm({ email: '', can_read: true, can_write: false });
      fetchSharedUsers(); // Refresh the list
    } catch (err) {
      // Error handled in parent
    } finally {
      setIsSharing(false);
    }
  };

  const handleUnshareUser = async (userEmail) => {
    if (!window.confirm(`Remove ${userEmail} from this stream?`)) {
      return;
    }

    try {
      await onUnshare(stream.name, userEmail);
      fetchSharedUsers(); // Refresh the list
    } catch (err) {
      // Error handled in parent
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div data-modal-root className="bg-dark-card rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-light-text">
              {isShared ? 'View Stream' : 'Manage Stream'}
            </h2>
            <p className="text-gray-text text-sm mt-1">{stream.name}</p>
            {isShared && stream.owner_email && (
              <p className="text-primary text-xs mt-1">
                Owned by: {stream.owner_email}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-text hover:text-light-text text-2xl transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs - Only show Sharing tab for owned streams */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-4 text-center font-medium transition ${
              activeTab === 'details'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-text hover:text-light-text'
            }`}
          >
            Details
          </button>
          {!isShared && (
            <button
              onClick={() => setActiveTab('sharing')}
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'sharing'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-text hover:text-light-text'
              }`}
            >
              Sharing
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Stream Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-light-text font-medium mb-2">Stream Information</h3>
                  <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-text">Name</span>
                      <span className="text-light-text font-mono">{stream.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-text">Owner</span>
                      <span className="text-light-text">
                        <a 
                          href={`mailto:${isShared ? stream.owner_email : user?.email}`}
                          className="hover:underline"
                          style={{
                            cursor: 'pointer'
                          }}
                        >
                          {isShared ? stream.owner_email : user?.email}
                        </a>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-text">Created</span>
                      <span className="text-light-text">{formatDate(stream.created_at)}</span>
                    </div>
                    {/* Show permissions for shared streams */}
                    {isShared && stream.shared_permissions && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-text">Read Access</span>
                          <span className={stream.shared_permissions.can_read ? 'text-green-400' : 'text-red-400'}>
                            {stream.shared_permissions.can_read ? '✓ Allowed' : '✗ Not Allowed'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-text">Write Access</span>
                          <span className={stream.shared_permissions.can_write ? 'text-green-400' : 'text-red-400'}>
                            {stream.shared_permissions.can_write ? '✓ Allowed' : '✗ Not Allowed'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Limits */}
                <div>
                  <h3 className="text-light-text font-medium mb-2">Limits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-4">
                      <div className="text-gray-text text-sm mb-1">Max Messages/Sec</div>
                      <div className="text-light-text font-semibold text-lg">
                        {stream.max_messages_per_second}
                      </div>
                    </div>
                    <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-4">
                      <div className="text-gray-text text-sm mb-1">Max Message Size</div>
                      <div className="text-light-text font-semibold text-lg">
                        {stream.max_message_size_bytes} bytes
                      </div>
                    </div>
                    <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-4">
                      <div className="text-gray-text text-sm mb-1">Max Retention</div>
                      <div className="text-light-text font-semibold text-lg">
                        {stream.max_retention_messages} messages
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Details */}
                <div>
                  <h3 className="text-light-text font-medium mb-2">Connection Details</h3>
                  <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-gray-text text-sm mb-1">Producer Endpoint</p>
                      <code className="text-primary bg-dark-bg px-3 py-2 rounded block break-all text-sm">
                        wss://stream.plotune.net/ws/producer/
                        {isShared ? stream.owner_email?.split('@')[0] : user?.username}/
                        {stream.name}
                      </code>
                    </div>
                    <div>
                      <p className="text-gray-text text-sm mb-1">Consumer Endpoint</p>
                      <code className="text-primary bg-dark-bg px-3 py-2 rounded block break-all text-sm">
                        wss://stream.plotune.net/ws/consumer/
                        {isShared ? stream.owner_email?.split('@')[0] : user?.username}/
                        {stream.name}/[group_name]
                      </code>
                    </div>
                    {isShared && (
                      <p className="text-xs text-gray-text mt-2">
                        Note: Use the owner's username in the connection URLs
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Danger Zone - Only for owned streams */}
              {!isShared && (
                <div className="border border-red-500/30 rounded-lg p-4">
                  <h3 className="text-red-400 font-medium mb-3">Danger Zone</h3>
                  <p className="text-gray-text text-sm mb-4">
                    Deleting this stream will permanently remove all messages and cannot be undone.
                  </p>
                  <button
                    onClick={async () => {
                      if (window.confirm(`Delete stream "${stream.name}"? All messages will be permanently removed.`)) {
                        try {
                          await onDeleteStream(stream.name, true); // confirmed here; parent skips its own confirm
                          // Only close on success — a failed delete already showed a
                          // toast; keep the modal open so the user sees it and can retry.
                          onClose();
                        } catch (err) {
                          // Failure toast is shown by the parent handler.
                        }
                      }
                    }}
                    className="inline-flex min-h-[44px] items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    Delete Stream
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sharing Tab - Only for owned streams */}
          {activeTab === 'sharing' && !isShared && (
            <div className="space-y-6">
              {/* Add User Form */}
              <div className="bg-dark-surface backdrop-blur-xl rounded-xl p-5 border border-white/5">
                <h3 className="text-light-text font-medium mb-4">Share with New User</h3>
                <form onSubmit={handleShareSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-text mb-2">Email Address</label>
                    <input
                      type="email"
                      value={shareForm.email}
                      onChange={(e) => setShareForm({ ...shareForm, email: e.target.value })}
                      placeholder="user@example.com"
                      className="w-full p-3 bg-dark-bg rounded-lg border border-white/10 text-light-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="can_read"
                        checked={shareForm.can_read}
                        onChange={(e) => setShareForm({ ...shareForm, can_read: e.target.checked })}
                        className="mr-2 h-4 w-4 text-primary bg-dark-bg border-white/20 rounded focus:ring-primary/50"
                      />
                      <label htmlFor="can_read" className="text-light-text text-sm">
                        Can Read
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="can_write"
                        checked={shareForm.can_write}
                        onChange={(e) => setShareForm({ ...shareForm, can_write: e.target.checked })}
                        className="mr-2 h-4 w-4 text-primary bg-dark-bg border-white/20 rounded focus:ring-primary/50"
                      />
                      <label htmlFor="can_write" className="text-light-text text-sm">
                        Can Write
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSharing}
                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSharing ? 'Sharing…' : 'Share Stream'}
                  </button>
                </form>
              </div>

              {/* Shared Users List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-light-text font-medium">Shared With</h3>
                  <button
                    onClick={fetchSharedUsers}
                    className="text-sm text-primary hover:text-primary-dark transition"
                    disabled={loadingShared}
                  >
                    {loadingShared ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>

                {loadingShared ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : sharedUsers.length === 0 ? (
                  <div className="text-center py-8 bg-dark-surface backdrop-blur-xl/50 rounded-lg">
                    <div className="text-gray-text mb-2">No users have been shared with yet</div>
                    <div className="text-sm text-gray-text">Share this stream with others above</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sharedUsers.map((sharedUser, index) => (
                      <div
                        key={index}
                        className="bg-dark-surface backdrop-blur-xl rounded-lg p-4 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-light-text font-medium">{sharedUser.email}</div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              sharedUser.can_read 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {sharedUser.can_read ? 'Can Read' : 'Cannot Read'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              sharedUser.can_write 
                                ? 'bg-blue-500/20 text-blue-400' 
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {sharedUser.can_write ? 'Can Write' : 'Cannot Write'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnshareUser(sharedUser.email)}
                          className="text-red-400 hover:text-red-300 transition p-2 hover:bg-white/10 rounded-lg"
                          title="Remove access"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sharing Info */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h4 className="text-light-text font-medium mb-2">Sharing Information</h4>
                <ul className="text-gray-text text-sm space-y-1">
                  <li>• Shared users can access this stream using their own credentials</li>
                  <li>• Read permission allows consuming messages from the stream</li>
                  <li>• Write permission allows publishing messages to the stream</li>
                  <li>• Owner always has full read and write access</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreamManagementModal;