import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

import ExtensionIcon from '../assets/icons/extensions.svg';
import DownloadIcon from '../assets/icons/download.svg';
import StreamIcon from '../assets/icons/stream.svg';

import { useAddToHomeScreen } from '../hooks/useAddToHomeScreen';

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [premiumStatus, setPremiumStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);
  const [stats, setStats] = useState({
    extensions: 0,
    projects: 0,
    apiCalls: 0,
    storage: '0MB'
  });
  
  // PWA "Add to Home Screen" functionality
  const { isSupported, isStandalone, promptInstall, showManualInstallInstructions } = useAddToHomeScreen();
  const [isMobile, setIsMobile] = useState(false);
  const [showPWAInstall, setShowPWAInstall] = useState(false);

  // Quick links configuration - hardcoded enable/disable
  const quickLinks = [
    {
      id: 'support',
      label: 'Support Center',
      icon: 'support_agent',
      link: 'https://support.plotune.net',
      external: true,
      enabled: true 
    },
    {
      id: 's3',
      label: 'Storage Management',
      icon: 'dns',
      link: '/storage',
      external: false,
      enabled: true 
    },
    {
      id: 'partnership',
      label: 'Partnership',
      icon: 'handshake',
      link: '/partners',
      external: false,
      enabled: true 
    },
    {
      id: 'partner-portal',
      label: 'Partner Portal',
      icon: 'business_center',
      link: '/partner-portal',
      external: false,
      enabled: true 
    },
    {
      id: 'flow-designer',
      label: 'Flow Designer',
      icon: 'account_tree',
      link: 'https://flow.plotune.net',
      external: true,
      enabled: true 
    }
  ];

  // Filter only enabled links
  const enabledQuickLinks = quickLinks.filter(link => link.enabled);

  const fetchData = async () => {
    setStatsError(false);
    try {
      const premiumResponse = await api.get('/user/premium', {
        headers: { Authorization: token },
      });
      setPremiumStatus(premiumResponse.data.is_premium || false);

      const statsResponse = await api.get('/user/stats', {
        headers: { Authorization: token },
      });
      setStats(statsResponse.data);
    } catch (err) {
      setStatsError(true);
      toast.error('Failed to load dashboard data');
      if (err.response?.status === 401) logout();
    }
  };

  useEffect(() => {
    setLoading(false);

    // Mobil cihaz kontrolü - geliştirilmiş versiyon
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent);
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(isMobileDevice || hasTouchScreen);
      
      // PWA kurulum banner'ını göstermek için kontrol
      // Zaten PWA olarak yüklü değilse ve mobil cihazdaysa göster
      if ((isMobileDevice || hasTouchScreen) && !isStandalone) {
        setShowPWAInstall(true);
      }
    };
    
    checkIfMobile();
    
    if (token) fetchData();
  }, [token, logout, isStandalone]);

  const handleUpgradePremium = () => {
    toast.info('Upgrade not available currently');
  };

  const handlePWAInstall = () => {
    promptInstall();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-light-text">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 pb-12">
      <div className="container mx-auto px-4">

        <div className="space-y-6">
          {/* Truthful failure state (Doherty/Postel): a failed load must not read as
              "0 extensions / 0 api calls" — say what happened and offer a retry. */}
          {statsError && (
            <div
              className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-6 sm:flex-row sm:items-center"
              role="alert"
            >
              <div>
                <h2 className="text-lg font-semibold text-light-text">Couldn&apos;t load your dashboard data.</h2>
                <p className="text-gray-text text-sm mt-1">Check your connection and try again.</p>
              </div>
              <button
                onClick={fetchData}
                className="inline-flex min-h-[44px] items-center rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-primary-dark transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl">
            <h2 className="text-xl font-semibold text-light-text mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/extensions"
                className="p-4 bg-white/5 backdrop-blur-xl rounded-lg border border-white/5 hover:border-primary/50 transition group"
              >
                <div className="text-2xl mb-2">
                  <img 
                    src={ExtensionIcon} 
                    alt="Extensions" 
                    className="mx-auto mb-2 w-8 h-8 opacity-70 group-hover:opacity-100 transition"
                  />
                </div>
                <h3 className="text-light-text font-medium">Browse Marketplace</h3>
                <p className="text-gray-text text-sm mt-1">Discover new extensions</p>
              </Link>
              <Link
                to="/download"
                className="p-4 bg-white/5 backdrop-blur-xl rounded-lg border border-white/5 hover:border-primary/50 transition group"
              >
                <div className="text-2xl mb-2">
                  <img 
                    src={DownloadIcon} 
                    alt="Download" 
                    className="mx-auto mb-2 w-8 h-8 opacity-70 group-hover:opacity-100 transition"
                  />
                </div>
                <h3 className="text-light-text font-medium">Download App</h3>
                <p className="text-gray-text text-sm mt-1">Get the latest version</p>
              </Link>
              <Link
                to="/streams"
                className="p-4 bg-white/5 backdrop-blur-xl rounded-lg border border-white/5 hover:border-primary/50 transition group text-left"
              >
                <div className="text-2xl mb-2">
                  <img 
                    src={StreamIcon} 
                    alt="Streams" 
                    className="mx-auto mb-2 w-8 h-8 opacity-70 group-hover:opacity-100 transition"
                  />
                </div>
                <h3 className="text-light-text font-medium">Plotune Streams</h3>
                <p className="text-gray-text text-sm mt-1">Manage your streams</p>
              </Link>
            </div>
          </div>

          {/* Quick Links - Only show if there are enabled links */}
          {enabledQuickLinks.length > 0 && (
            <div className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl">
              <h2 className="text-xl font-semibold text-light-text mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {enabledQuickLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.id}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-white/5 backdrop-blur-xl rounded-lg border border-white/5 hover:border-primary/50 transition group text-center"
                    >
                      <div className="text-2xl mb-2">
                        <span className="material-icons text-3xl text-gray-400 group-hover:text-primary transition">
                          {link.icon}
                        </span>
                      </div>
                      <h3 className="text-light-text font-medium text-sm">{link.label}</h3>
                    </a>
                  ) : (
                    <Link
                      key={link.id}
                      to={link.link}
                      className="block p-4 bg-white/5 backdrop-blur-xl rounded-lg border border-white/5 hover:border-primary/50 transition group text-center"
                    >
                      <div className="text-2xl mb-2">
                        <span className="material-icons text-3xl text-gray-400 group-hover:text-primary transition">
                          {link.icon}
                        </span>
                      </div>
                      <h3 className="text-light-text font-medium text-sm">{link.label}</h3>
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Add to Home Screen - Daha akıllı gösterim */}
          {showPWAInstall && !isStandalone && (
            <div className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-light-text mb-1">Install Plotune App</h3>
                  <p className="text-gray-text text-sm">
                    {isSupported 
                      ? 'Add to home screen for quick access and better experience'
                      : 'For best experience, install as an app'}
                  </p>
                </div>
                <button
                  onClick={handlePWAInstall}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors border border-primary/20 flex items-center gap-2"
                >
                  <span className="material-icons text-sm">add_to_home_screen</span>
                  {isSupported ? 'Install Now' : 'Show Instructions'}
                </button>
              </div>
              
              {/* Manuel kurulum talimatları (gizlenebilir) */}
              {!isSupported && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <details className="text-gray-text text-sm">
                    <summary className="cursor-pointer hover:text-light-text">Manual Installation Guide</summary>
                    <div className="mt-2 pl-4 space-y-2">
                      <p><strong>For Android/Chrome:</strong></p>
                      <ol className="list-decimal pl-5">
                        <li>Tap the menu button (⋮) in the top right</li>
                        <li>Select "Add to Home screen" or "Install app"</li>
                        <li>Confirm the installation</li>
                      </ol>
                      
                      <p className="mt-2"><strong>For iOS/Safari:</strong></p>
                      <ol className="list-decimal pl-5">
                        <li>Tap the share button (⬆️)</li>
                        <li>Scroll down and tap "Add to Home Screen"</li>
                        <li>Tap "Add" in the top right</li>
                      </ol>
                    </div>
                  </details>
                </div>
              )}
            </div>
          )}

          {/* Premium Banner */}
          {!premiumStatus && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Unlock Premium Features</h3>
                  <p className="text-purple-100">
                    Get access to advanced extensions, priority support, and enhanced capabilities.
                  </p>
                </div>
                <button
                  onClick={handleUpgradePremium}
                  className="mt-4 md:mt-0 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;