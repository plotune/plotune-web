// components/streams/PlotuneStreams.jsx
import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import api, { streamApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import CreateStreamModal from './CreateStreamModal';
import StreamManagementModal from './StreamManagementModal';
import StreamCard from './StreamCard';
import StreamIcon from '../../assets/icons/stream.svg';
import { 
  FaPlus,
  FaUsers,
  FaStream
} from 'react-icons/fa';

const PlotuneStreams = () => {
  const { user, token } = useContext(AuthContext);
  const [myStreams, setMyStreams] = useState([]);
  const [sharedStreams, setSharedStreams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingShared, setLoadingShared] = useState(false);
  const [activeStream, setActiveStream] = useState(null);
  const [streamToken, setStreamToken] = useState(null);
  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'shared'
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    fetchStreamToken();
  }, []);

  // Premium status lives in the /user/premium endpoint (see Dashboard/Profile),
  // not on the user object — fetch it so plan limits display truthfully.
  useEffect(() => {
    const fetchPremiumStatus = async () => {
      if (!token) return;
      try {
        const response = await api.get('/user/premium', {
          headers: { Authorization: token },
        });
        setIsPremium(response.data.is_premium || false);
      } catch (err) {
        setIsPremium(false);
      }
    };
    fetchPremiumStatus();
  }, [token]);

  // Get stream token from backend first
  const fetchStreamToken = async () => {
    try {
      const cacheBuster = Math.floor(Date.now() / (1000 * 60 * 20));
      const response = await api.get(`/auth/stream?q=${cacheBuster}&user=${user?.username}`, {
        headers: { Authorization: token },
      });
      
      if (response.data && response.data.token) {
        setStreamToken(response.data.token);
        fetchMyStreams(response.data.token);
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Error fetching stream token:', err);
      toast.error('Failed to get stream access');
      setLoading(false);
    }
  };

  const fetchMyStreams = async (tokenToUse = streamToken) => {
    if (!tokenToUse) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await streamApi.post('/streams/list', {}, {
        headers: { Authorization: tokenToUse },
      });
      
      setMyStreams(response.data.streams || []);
      
    } catch (err) {
      console.error('Error fetching streams:', err);
      toast.error('Failed to load your streams');
      setMyStreams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSharedStreams = async (tokenToUse = streamToken) => {
    if (!tokenToUse) {
      return;
    }

    try {
      setLoadingShared(true);
      const response = await streamApi.get('/streams/shared-streams', {
        headers: { Authorization: tokenToUse },
      });
      
      // Map shared streams to match StreamCard structure
      const mappedStreams = (response.data.shared_streams || []).map(stream => ({
        ...stream,
        id: stream.name, // Use name as ID since shared streams don't have ID
        is_shared: true,
        owner: stream.owner_email,
        shared_permissions: {
          can_read: stream.can_read,
          can_write: stream.can_write
        }
      }));
      
      setSharedStreams(mappedStreams);
      
    } catch (err) {
      console.error('Error fetching shared streams:', err);
      toast.error('Failed to load shared streams');
      setSharedStreams([]);
    } finally {
      setLoadingShared(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'shared' && sharedStreams.length === 0 && streamToken) {
      fetchSharedStreams();
    }
  };

  const handleCreateStream = async (streamData) => {
    if (!streamToken) {
      toast.error('Stream access not available');
      return;
    }

    setIsCreatingStream(true);
    try {
      const createData = {
        name: streamData.name,
        owner: user?.username,
        max_messages_per_second: 1000,
        max_message_size_bytes: 1000,
        max_retention_messages: 1000,
        max_consumers_per_group: 1000,
        max_consumer_group: 1000
      };

      const response = await streamApi.post('/streams/create', createData, {
        headers: { Authorization: streamToken },
      });
      
      setShowCreateModal(false);
      toast.success('Stream created successfully!');
      fetchMyStreams();
    } catch (err) {
      console.error('Create error:', err);
      if (err.response?.status === 422) {
        toast.error('Invalid stream data. Please check the stream name.');
      } else {
        toast.error('Failed to create stream');
      }
    } finally {
      setIsCreatingStream(false);
    }
  };

  const handleDeleteStream = async (streamName, skipConfirm = false) => {
    if (!streamToken) {
      toast.error('Stream access not available');
      return;
    }

    if (!skipConfirm && !window.confirm(`Delete stream "${streamName}"? All messages will be permanently removed.`)) {
      return;
    }

    try {
      await streamApi.post('/streams/delete', {
        name: streamName,
        owner: user?.username,
        max_messages_per_second: 0,
        max_message_size_bytes: 0,
        max_retention_messages: 0,
        max_consumers_per_group: 0,
        max_consumer_group: 0
      }, {
        headers: { Authorization: streamToken },
      });

      toast.success('Stream deleted successfully');
      fetchMyStreams();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete stream');
    }
  };

  const handleShareStream = async (streamName, shareEmail, permissions) => {
    if (!streamToken) {
      toast.error('Stream access not available');
      return;
    }

    try {
      await streamApi.post('/streams/share', 
        {
          stream_name: streamName,
          user_email: shareEmail,
          can_read: permissions.can_read,
          can_write: permissions.can_write
        },
        { headers: { Authorization: streamToken } }
      );
      toast.success(`Stream shared with ${shareEmail}`);
      fetchMyStreams();
    } catch (err) {
      toast.error('Failed to share stream');
    }
  };

  const handleUnshareStream = async (streamName, userEmail) => {
    if (!streamToken) {
      toast.error('Stream access not available');
      return;
    }

    try {
      await streamApi.post('/streams/unshare', 
        {
          stream_name: streamName,
          user_email: userEmail
        },
        { headers: { Authorization: streamToken } }
      );
      toast.success('User removed from stream');
      fetchMyStreams();
    } catch (err) {
      toast.error('Failed to remove user');
    }
  };

  if (loading && activeTab === 'my') {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!streamToken && !loading) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/20 text-red-400 p-6 rounded-lg max-w-md mx-auto">
          <h3 className="text-lg font-medium mb-2">Access Required</h3>
          <p className="text-sm mb-4">
            Unable to access stream services.
          </p>
          <button
            onClick={fetchStreamToken}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentStreams = activeTab === 'my' ? myStreams : sharedStreams;
  const isLoading = activeTab === 'my' ? loading : loadingShared;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-light-text">Streams</h3>
          <p className="text-gray-text text-sm">Manage your data streams and access shared streams</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2
                      px-4 py-2 min-h-[44px] rounded-lg
                      bg-blue-600 hover:bg-blue-700
                      text-white text-sm font-medium
                      transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          New Stream
        </button>

        
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'my' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-text hover:text-light-text'
          }`}
          onClick={() => handleTabChange('my')}
        >
          <FaStream className="w-4 h-4" />
          My Streams
          {myStreams.length > 0 && (
            <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
              {myStreams.length}
            </span>
          )}
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'shared' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-text hover:text-light-text'
          }`}
          onClick={() => handleTabChange('shared')}
        >
          <FaUsers className="w-4 h-4" />
          Shared With Me
          {sharedStreams.length > 0 && (
            <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
              {sharedStreams.length}
            </span>
          )}
        </button>
      </div>

      {/* Streams Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentStreams.map((stream) => (
            <StreamCard
              key={stream.id}
              stream={stream}
              onManage={() => setActiveStream(stream)}
              onDelete={stream.is_shared ? null : () => handleDeleteStream(stream.name)}
              isShared={stream.is_shared}
              streamToken={streamToken}
            />
          ))}
          
          {currentStreams.length === 0 && (
            <div className="col-span-full text-center py-12">
              <img src={StreamIcon} alt="Streams" className="mx-auto mb-4 w-16 h-16 opacity-50" />
              <h3 className="text-lg font-medium text-light-text mb-2">
                {activeTab === 'my' ? 'No streams yet' : 'No shared streams'}
              </h3>
              <p className="text-gray-text mb-4">
                {activeTab === 'my' 
                  ? 'Create your first stream to get started' 
                  : 'No one has shared any streams with you yet'}
              </p>
              {activeTab === 'my' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Create Your First Stream
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Connection Information */}
      <div className="rounded-xl p-6 border border-white/10">
        <h4 className="text-light-text font-medium mb-4">Connection Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-text">Producer Endpoint</p>
            <code className="text-primary bg-dark-card px-2 py-1 rounded break-all">
              wss://stream.plotune.net/ws/producer/{activeTab === 'shared' ? '[owner_username]' : user?.username}/[stream_name]
            </code>
          </div>
          <div>
            <p className="text-gray-text">Consumer Endpoint</p>
            <code className="text-primary bg-dark-card px-2 py-1 rounded break-all">
              wss://stream.plotune.net/ws/consumer/{activeTab === 'shared' ? '[owner_username]' : user?.username}/[stream_name]/[group_name]
            </code>
          </div>
          {activeTab === 'shared' && (
            <div className="col-span-full">
              <p className="text-gray-text text-xs mt-2">
                Note: For shared streams, replace <code className="bg-dark-card px-1 rounded">[owner_username]</code> with the stream owner's username
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateStreamModal 
          onClose={() => setShowCreateModal(false)} 
          onSubmit={handleCreateStream}
          isPremium={isPremium}
          isSubmitting={isCreatingStream}
        />
      )}
      {activeStream && (
        <StreamManagementModal
          stream={activeStream}
          onClose={() => setActiveStream(null)}
          onUpdate={() => activeTab === 'my' ? fetchMyStreams() : fetchSharedStreams()}
          onShare={activeStream.is_shared ? null : handleShareStream}
          onUnshare={activeStream.is_shared ? null : handleUnshareStream}
          onDeleteStream={handleDeleteStream}
          user={user}
          isShared={activeStream.is_shared}
        />
      )}
    </div>
  );
};

export default PlotuneStreams;