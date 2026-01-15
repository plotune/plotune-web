// components/networks/PlotuneNetworks.jsx - GÜNCELLENMİŞ
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api, { streamApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import CreateNetworkModal from './CreateNetworkModal';
import NetworkManagementModal from './NetworkManagementModal';
import NetworkCard from './NetworkCard';
import { 
  FaPlus,
  FaUsers,
  FaUser,
  FaNetworkWired,
  FaShareAlt,
  FaUserFriends
} from 'react-icons/fa';

const PlotuneNetworks = () => {
  const { user, token, ensureUserEmail } = useContext(AuthContext);
  const [myNetworks, setMyNetworks] = useState([]);
  const [authorizedNetworks, setAuthorizedNetworks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAuthorized, setLoadingAuthorized] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState(null);
  const [streamToken, setStreamToken] = useState(null);
  const [activeTab, setActiveTab] = useState('my');
  const [userEmail, setUserEmail] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchStreamToken();
  }, []);

  // Get user email on component mount
  useEffect(() => {
    const loadUserEmail = async () => {
      if (token) {
        const email = await ensureUserEmail();
        setUserEmail(email);
      }
    };
    loadUserEmail();
  }, [token, ensureUserEmail]);

  // Get stream token from backend
  const fetchStreamToken = async () => {
    try {
      const cacheBuster = Math.floor(Date.now() / (1000 * 60 * 20));
      const response = await api.get(`/auth/stream?q=${cacheBuster}&user=${user?.username}`, {
        headers: { Authorization: token },
      });
      
      if (response.data && response.data.token) {
        setStreamToken(response.data.token);
        fetchMyNetworks(response.data.token);
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Error fetching stream token:', err);
      toast.error('Failed to get stream access');
      setLoading(false);
    }
  };

  const fetchMyNetworks = async (tokenToUse = streamToken) => {
    if (!tokenToUse) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await streamApi.get('/networks', {
        headers: { Authorization: tokenToUse },
      });
      
      setMyNetworks(response.data || []);
      
    } catch (err) {
      console.error('Error fetching networks:', err);
      toast.error('Failed to load your networks');
      setMyNetworks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorizedNetworks = async (tokenToUse = streamToken) => {
    if (!tokenToUse || !userEmail) {
      return;
    }

    try {
      setLoadingAuthorized(true);
      const response = await streamApi.get('/networks/authorized', {
        headers: { Authorization: tokenToUse },
      });
      
      // Filter out networks owned by the current user
      const filteredNetworks = (response.data || []).filter(network => 
        network.owner_email !== userEmail
      );
      
      // Map authorized networks
      const mappedNetworks = filteredNetworks.map(network => {
        // Find current user's auth in the network
        const userAuth = network.auths?.find(auth => auth.user_email === userEmail);
        return {
          ...network,
          is_authorized: true,
          current_user_email: userEmail,
          enabled: userAuth ? userAuth.enabled : false,
          user_auth: userAuth // Store the full auth object
        };
      });
      
      setAuthorizedNetworks(mappedNetworks);
      
    } catch (err) {
      console.error('Error fetching authorized networks:', err);
      toast.error('Failed to load authorized networks');
      setAuthorizedNetworks([]);
    } finally {
      setLoadingAuthorized(false);
    }
  };

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'authorized' && authorizedNetworks.length === 0 && streamToken && userEmail) {
      fetchAuthorizedNetworks();
    }
  }, [streamToken, userEmail, authorizedNetworks.length]);

  const handleCreateNetwork = async (networkData) => {
    if (!streamToken || !userEmail) {
      toast.error('Network access not available');
      return;
    }

    try {
      const createData = {
        name: networkData.name,
        owner_email: userEmail,
        description: networkData.description || '',
        is_public: networkData.is_public || false
      };

      const response = await streamApi.post('/network/create', createData, {
        headers: { Authorization: streamToken },
      });
      
      setShowCreateModal(false);
      toast.success('Network created successfully!');
      fetchMyNetworks();
    } catch (err) {
      console.error('Create error:', err);
      if (err.response?.status === 422) {
        toast.error('Invalid network data. Please check the network name.');
      } else {
        toast.error('Failed to create network');
      }
    }
  };

  const handleDeleteNetwork = async (networkName) => {
    if (!streamToken || !userEmail) {
      toast.error('Network access not available');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this network? This action cannot be undone.')) {
      return;
    }

    try {
      await streamApi.post('/network/delete', {
        name: networkName,
        owner_email: userEmail,
        description: '',
        is_public: false
      }, {
        headers: { Authorization: streamToken },
      });

      toast.success('Network deleted successfully');
      fetchMyNetworks();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete network');
    }
  };

  const handleShareNetwork = async (networkName, shareEmail, permissions) => {
    if (!streamToken) {
      toast.error('Network access not available');
      return;
    }

    try {
      await streamApi.post('/network/share', 
        {
          name: networkName,
          user_email: shareEmail,
          can_publish: permissions.can_publish,
          can_subscribe: permissions.can_subscribe
        },
        { headers: { Authorization: streamToken } }
      );
      toast.success(`Network shared with ${shareEmail}`);
      fetchMyNetworks();
    } catch (err) {
      toast.error('Failed to share network');
    }
  };

  const handleUnshareNetwork = async (networkName, userEmail) => {
    if (!streamToken) {
      toast.error('Network access not available');
      return;
    }

    try {
      await streamApi.post('/network/unshare', 
        {
          name: networkName,
          user_email: userEmail
        },
        { headers: { Authorization: streamToken } }
      );
      toast.success('User removed from network');
      fetchMyNetworks();
    } catch (err) {
      toast.error('Failed to remove user');
    }
  };

  // Toggle network enabled status
  const handleToggleNetworkStatus = async (networkName, currentStatus) => {
    if (!streamToken || !userEmail) {
      toast.error('Network access not available');
      return;
    }

    setUpdatingStatus(prev => ({ ...prev, [networkName]: true }));

    try {
      const newStatus = !currentStatus;
      
      const response = await streamApi.post('/network/auth/status', 
        {
          network_name: networkName,
          user_email: userEmail,
          enabled: newStatus
        },
        { headers: { Authorization: streamToken } }
      );

      toast.success(`Network ${newStatus ? 'enabled' : 'disabled'} successfully`);
      
      // Update the specific network in state
      if (activeTab === 'authorized') {
        setAuthorizedNetworks(prev => prev.map(network => 
          network.name === networkName 
            ? { 
                ...network, 
                enabled: newStatus,
                user_auth: { ...network.user_auth, enabled: newStatus }
              }
            : network
        ));
      }
      
    } catch (err) {
      console.error('Toggle status error:', err);
      toast.error(`Failed to ${currentStatus ? 'disable' : 'enable'} network`);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [networkName]: false }));
    }
  };

  // Refresh when userEmail becomes available
  useEffect(() => {
    if (userEmail && streamToken && activeTab === 'authorized' && authorizedNetworks.length === 0) {
      fetchAuthorizedNetworks();
    }
  }, [userEmail, streamToken, activeTab]);

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
            Unable to access network services.
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

  const currentNetworks = activeTab === 'my' ? myNetworks : authorizedNetworks;
  const isLoading = activeTab === 'my' ? loading : loadingAuthorized;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-light-text">Peer Networks</h3>
          <p className="text-gray-text text-sm">Create and manage peer-to-peer data networks for stream sharing</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!userEmail}
          className={`px-4 py-2 rounded-lg transition flex items-center ${
            userEmail 
              ? 'bg-primary text-white hover:bg-primary-dark' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span className="mr-2"><FaPlus className="w-3 h-3" /></span> New Network
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
          <FaNetworkWired className="w-4 h-4" />
          My Networks
          {myNetworks.length > 0 && (
            <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
              {myNetworks.length}
            </span>
          )}
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'authorized' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-gray-text hover:text-light-text'
          }`}
          onClick={() => handleTabChange('authorized')}
        >
          <FaUserFriends className="w-4 h-4" />
          Joined Networks
          {authorizedNetworks.length > 0 && (
            <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
              {authorizedNetworks.length}
            </span>
          )}
        </button>
      </div>

      {/* Networks Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentNetworks.map((network) => (
            <NetworkCard
              key={network.id}
              network={network}
              onManage={() => setActiveNetwork(network)}
              onDelete={network.is_authorized ? null : () => handleDeleteNetwork(network.name)}
              onToggleStatus={network.is_authorized ? 
                () => handleToggleNetworkStatus(network.name, network.enabled) : null}
              isAuthorized={network.is_authorized}
              isUpdating={updatingStatus[network.name]}
              currentUserEmail={userEmail}
            />
          ))}
          
          {currentNetworks.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="mx-auto mb-4 w-16 h-16 opacity-50 flex items-center justify-center">
                <FaNetworkWired className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-light-text mb-2">
                {activeTab === 'my' ? 'No networks yet' : 'No joined networks'}
              </h3>
              <p className="text-gray-text mb-4">
                {activeTab === 'my' 
                  ? 'Create your first network to start connecting peers' 
                  : 'You have not joined any networks yet'}
              </p>
              {activeTab === 'my' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  disabled={!userEmail}
                  className={`px-6 py-3 rounded-lg ${
                    userEmail 
                      ? 'bg-primary text-white hover:bg-primary-dark' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {userEmail ? 'Create Your First Network' : 'Loading user information...'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Security Note for Authorized Networks */}
      {activeTab === 'authorized' && authorizedNetworks.length > 0 && (
        <div className="rounded-xl p-4 border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            </div>
            <div>
              <h4 className="text-amber-400 font-medium mb-1">Security Notice</h4>
              <p className="text-amber-300/80 text-sm">
                Shared networks are disabled by default to prevent metadata leakage. 
                Enable a network only when you trust the owner and intend to use it.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateNetworkModal 
          onClose={() => setShowCreateModal(false)} 
          onSubmit={handleCreateNetwork}
          user={{ ...user, email: userEmail }}
          isLoading={!userEmail}
        />
      )}
      {activeNetwork && (
        <NetworkManagementModal
          network={activeNetwork}
          onClose={() => setActiveNetwork(null)}
          onUpdate={() => activeTab === 'my' ? fetchMyNetworks() : fetchAuthorizedNetworks()}
          onToggleStatus={activeNetwork.is_authorized ? 
            () => handleToggleNetworkStatus(activeNetwork.name, activeNetwork.enabled) : null}
          isUpdating={updatingStatus[activeNetwork.name]}
          onShare={activeNetwork.is_authorized ? null : handleShareNetwork}
          onUnshare={activeNetwork.is_authorized ? null : handleUnshareNetwork}
          user={{ ...user, email: userEmail }}
          currentUserEmail={userEmail}
          isAuthorized={activeNetwork.is_authorized}
        />
      )}
    </div>
  );
};

export default PlotuneNetworks;