import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import MD5 from 'crypto-js/md5';
import { v4 as uuidv4 } from 'uuid';

const Profile = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [apiToken, setApiToken] = useState('');
  const [premiumStatus, setPremiumStatus] = useState(false);

  const getGravatarUrl = (email, size = 80) => {
    if (!email) {
      const seed = userData.username || 'unknown';
      return `https://robohash.org/${seed}?set=set2&size=${size}x${size}`;
    }
    
    const hash = MD5(email.trim().toLowerCase()).toString();
    return `https://www.gravatar.com/avatar/${hash}?d=retro&s=${size}`;
  };

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    try {
      // Her istek için kesinlikle unique UUID
      const cachebuster = uuidv4();

      const profileResponse = await api.get(`/profile?cb=${cachebuster}`, {
        headers: { Authorization: token },
      });
      setUserData(profileResponse.data);

      const premiumResponse = await api.get(
        `/user/premium?cb=${cachebuster}`,
        { headers: { Authorization: token } }
      );
      setPremiumStatus(premiumResponse.data.is_premium || false);
    } catch (err) {
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  if (token) fetchData();
}, [token]);



  const handleUpdate = async () => {
    try {
      await api.put('/profile', userData, {
        headers: { Authorization: token },
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleGenerateToken = async () => {
    let r = confirm("This action will suspend the earlier generated token")
    if (!r){
        return;
    }
    try {
      const response = await api.post('/generate-api-token', {}, {
        headers: { Authorization: token },
      });
      setApiToken(response.data.api_token);
      toast.success('API token generated successfully');
    } catch (err) {
      toast.error('Token generation failed');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-light-text">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center mb-6">
                <img
                  src={getGravatarUrl(userData.email)}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                  onError={(e) => {
                    const seed = userData.username || 'unknown';
                    e.target.src = `https://robohash.org/${seed}?set=set2&size=80x80`;
                  }}
                />
                <div className="ml-4">
                  <h3 className="text-light-text font-semibold">{userData.full_name || userData.username}</h3>
                  <p className="text-gray-text text-sm">{userData.email}</p>
                  <div className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                    premiumStatus 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {premiumStatus ? 'PREMIUM' : 'FREE'}
                  </div>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile Information', icon: '👤' },
                  { id: 'api', label: 'API Access', icon: '🔑' },
                  { id: 'security', label: 'Security', icon: '🔒' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center ${
                      activeSection === item.id
                        ? 'bg-primary/20 text-primary border-l-4 border-primary'
                        : 'text-gray-text hover:text-light-text hover:bg-white/5'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Profile Information */}
            {activeSection === 'profile' && (
              <div className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-light-text">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center mb-6">
                  <img
                    src={getGravatarUrl(userData.email, 120)}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/30 mr-6"
                    onError={(e) => {
                      const seed = userData.username || 'unknown';
                      e.target.src = `https://robohash.org/${seed}?set=set2&size=120x120`;
                    }}
                  />
                  <div>
                    <h3 className="text-light-text font-semibold text-lg">Profile Picture</h3>
                    <p className="text-gray-text text-sm">
                      Your profile picture is managed through Gravatar. 
                      <a 
                        href="https://gravatar.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline ml-1"
                      >
                        Change on Gravatar
                      </a>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-text mb-2">Username</label>
                    <input
                      type="text"
                      value={userData.username || ''}
                      disabled
                      className="w-full p-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 text-light-text opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-text mb-2">Email Address</label>
                    <input
                      type="email"
                      value={userData.email || ''}
                      disabled
                      className="w-full p-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 text-light-text opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-text mb-2">Full Name</label>
                    <input
                      type="text"
                      value={userData.full_name || ''}
                      onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full p-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 text-light-text disabled:opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-text mb-2">Company</label>
                    <input
                      type="text"
                      value={userData.company || ''}
                      onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                      disabled={!isEditing}
                      className="w-full p-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 text-light-text disabled:opacity-70"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-text mb-2">Sector</label>
                    <input
                      type="text"
                      value={userData.sector || ''}
                      disabled
                      className="w-full p-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 text-light-text opacity-70"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* API Access */}
            {activeSection === 'api' && (
              <div className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl">
                <h2 className="text-xl font-semibold text-light-text mb-6">API Access</h2>
                
                <div className="bg-white/5 backdrop-blur-xl rounded-lg p-6 border border-white/5 mb-6">
                  <h3 className="text-lg font-medium text-light-text mb-4">API Token</h3>
                  <p className="text-gray-text mb-4">
                    Generate an API token to integrate Plotune with your applications and scripts.
                    Keep this token secure and never share it publicly.
                  </p>
                  
                  <button
                    onClick={handleGenerateToken}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
                  >
                    Generate New Token
                  </button>

                  {apiToken && (
                    <div className="mt-6 p-4 bg-dark-bg rounded-lg border border-yellow-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-yellow-400 font-medium">Your API Token</p>
                        <button
                          onClick={() => copyToClipboard(apiToken)}
                          className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center"
                        >
                          📋 Copy
                        </button>
                      </div>
                      <p className="text-light-text break-all font-mono text-sm bg-black/30 p-3 rounded">
                        {apiToken}
                      </p>
                      <p className="text-red-400 text-sm mt-3 flex items-center">
                        ⚠️ Copy this token now! It won't be shown again.
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-lg p-6 border border-white/5">
                  <h3 className="text-lg font-medium text-light-text mb-4">API Documentation</h3>
                  <p className="text-gray-text mb-4">
                    Learn how to use the Plotune API with our comprehensive documentation.
                  </p>
                  <button className="px-6 py-3 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition font-medium">
                    View API Docs
                  </button>
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl">
                <h2 className="text-xl font-semibold text-light-text mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-xl rounded-lg p-6 border border-white/5">
                    <h3 className="text-lg font-medium text-light-text mb-4">Password</h3>
                    <p className="text-gray-text mb-4">Change your password to keep your account secure.</p>
                    <a href='#/reset-password'>
                    <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium">
                      Change Password
                    </button>
                    </a>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl rounded-lg p-6 border border-white/5">
                    <h3 className="text-lg font-medium text-light-text mb-4">Two-Factor Authentication</h3>
                    <p className="text-gray-text mb-4">Add an extra layer of security to your account.</p>
                    <button className="px-6 py-3 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition font-medium">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl rounded-lg p-6 border border-white/5">
                    <h3 className="text-lg font-medium text-light-text mb-4">Login History</h3>
                    <p className="text-gray-text mb-4">Review your recent account activity.</p>
                    <div className="text-sm text-gray-text space-y-2">
                      <p>Last login: {new Date().toLocaleDateString()} from your current device</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;