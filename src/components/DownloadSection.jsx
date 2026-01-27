import React, { useState, useEffect } from 'react';

const DownloadSection = () => {
  const [activeTab, setActiveTab] = useState('windows');
  const [latestRelease, setLatestRelease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detect user's OS on component mount
  useEffect(() => {
    let os = 'windows';
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('win')) {
      os = 'windows';
    } else if (ua.includes('linux')) {
      os = 'linux';
    }
    
    // Only set if we have download options for this OS
    if (['windows', 'linux'].includes(os)) {
      setActiveTab(os);
    }
  }, []);

  // Fetch latest release from GitHub
  useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.github.com/repos/plotune/plotune-dl/releases/latest');
        
        if (!response.ok) {
          throw new Error(`GitHub API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setLatestRelease(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching latest release:', err);
        setError('Failed to load latest release information. Please check the GitHub releases page directly.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestRelease();
  }, []);

  // Helper function to find asset by pattern
  const findAsset = (pattern) => {
    if (!latestRelease || !latestRelease.assets) return null;
    return latestRelease.assets.find(asset => 
      asset.name.toLowerCase().includes(pattern)
    );
  };

  // Get download URL for Windows
  const getWindowsDownloadUrl = () => {
    if (!latestRelease) return 'https://github.com/plotune/plotune-dl/releases/latest';
    
    // Look for Windows-specific asset
    const windowsAsset = findAsset('plotune-windows') || findAsset('windows');
    if (windowsAsset) return windowsAsset.browser_download_url;
    
    // Fallback to latest release page
    return latestRelease.html_url;
  };

  // Get download URL for Linux
  const getLinuxDownloadUrl = (type) => {
    if (!latestRelease) return 'https://github.com/plotune/plotune-dl/releases/latest';
    
    switch(type) {
      case 'deb':
        const debAsset = findAsset('.deb');
        if (debAsset) return debAsset.browser_download_url;
        break;
      case 'tar':
        const tarAsset = findAsset('plotune-linux') || findAsset('linux');
        if (tarAsset) return tarAsset.browser_download_url;
        break;
      case 'snap':
        return 'https://snapcraft.io/plotune';
      case 'aur':
        return 'https://aur.archlinux.org/packages/plotune-bin';
    }
    
    return latestRelease.html_url;
  };

  // Get asset size for display
  const getAssetSize = (pattern) => {
    const asset = findAsset(pattern);
    if (!asset) return 'N/A';
    
    // Convert bytes to MB
    const sizeMB = (asset.size / (1024 * 1024)).toFixed(1);
    return `${sizeMB} MB`;
  };

  const downloadOptions = {
    windows: {
      icon: 'fab fa-windows',
      title: 'Windows',
      downloads: [
        {
          name: 'Windows Installer',
          description: 'Recommended for most Windows users. Complete setup package with automatic updates.',
          version: latestRelease ? latestRelease.tag_name : 'Latest',
          size: getAssetSize('plotune-windows') || '~57 MB',
          type: 'zip',
          getDownloadUrl: () => getWindowsDownloadUrl(),
          instructions: [
            'Click the Download button below',
            'Extract the downloaded .zip file',
            'Run setup.exe to install',
            'Launch Plotune from Start Menu'
          ]
        }
      ]
    },
    linux: {
      icon: 'fab fa-linux',
      title: 'Linux',
      downloads: [
        {
          name: 'Debian/Ubuntu (.deb)',
          description: 'Recommended for Debian-based distributions. Easy installation with APT package manager.',
          version: latestRelease ? latestRelease.tag_name : 'Latest',
          size: getAssetSize('.deb') || '~81 MB',
          type: 'deb',
          getDownloadUrl: () => getLinuxDownloadUrl('deb'),
          command: 'curl -fsSL https://plotune.net/install.sh | bash',
          installScript: true,
          instructions: [
            'Option 1: Click Download for .deb package',
            'Option 2: Run install script: curl -fsSL https://plotune.net/install.sh | bash',
            'Install with: sudo dpkg -i plotune*.deb',
            'Fix dependencies: sudo apt-get install -f'
          ]
        },
        {
          name: 'Arch Linux (AUR)',
          description: 'For Arch and Arch-based distributions. Install via AUR helper with automatic updates.',
          version: latestRelease ? latestRelease.tag_name : 'Latest',
          size: 'Auto',
          type: 'aur',
          getDownloadUrl: () => getLinuxDownloadUrl('aur'),
          command: 'yay -S plotune-bin',
          instructions: [
            'Using AUR helper (recommended): yay -S plotune-bin',
            'Manual install: git clone https://aur.archlinux.org/plotune-bin.git',
            'cd plotune-bin && makepkg -si',
            'Run: plotune'
          ]
        },
        {
          name: 'Snap Package',
          description: 'Universal package for most Linux distributions. Sandboxed and auto-updating.',
          version: latestRelease ? latestRelease.tag_name : 'Latest',
          size: '~78 MB',
          type: 'snap',
          getDownloadUrl: () => getLinuxDownloadUrl('snap'),
          command: 'sudo snap install plotune',
          instructions: [
            'Open terminal',
            'Run: sudo snap install plotune',
            'Or click below for Snap Store',
            'Launch from applications menu'
          ]
        },
        {
          name: 'Standalone Binary',
          description: 'Generic Linux binary. No installation needed - download and run directly.',
          version: latestRelease ? latestRelease.tag_name : 'Latest',
          size: getAssetSize('plotune-linux') || '~88 MB',
          type: 'binary',
          getDownloadUrl: () => "https://github.com/plotune/plotune-dl/tree/main",
          command: './plotune',
          instructions: [
            'wget https://github.com/plotune/plotune-dl/releases/latest/download/plotune-linux-x86_64.tar.gz',
            'Extract: tar -xzf plotune-linux-x86_64.tar.gz',
            'cd plotune-linux-x86_64',
            'Run: chmod +x plotune && ./plotune'
          ]
        }
      ]
    }
  };

  const currentPlatform = downloadOptions[activeTab];

  return (
    <section className="py-20 bg-dark-bg">
      <div className="container mx-auto px-5 max-w-6xl">
        {/* Platform Selector */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {Object.entries(downloadOptions).map(([key, platform]) => (
            <button
              key={key}
              className={`flex flex-col items-center p-6 rounded-2xl transition-all duration-300 border-2 min-w-[140px] ${
                activeTab === key
                  ? 'border-primary scale-105 bg-primary/10'
                  : 'border-white/10 hover:border-white/30 hover:scale-102'
              }`}
              onClick={() => setActiveTab(key)}
            >
              <i className={`${platform.icon} text-5xl mb-4 ${
                activeTab === key ? 'text-primary' : 'text-gray-text'
              }`}></i>
              <span className={`font-semibold text-lg ${
                activeTab === key ? 'text-primary' : 'text-gray-text'
              }`}>
                {platform.title}
              </span>
            </button>
          ))}
        </div>

        {/* Loading/Error State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-text">Fetching latest release from GitHub...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <p className="text-gray-text mb-6">{error}</p>
            <a
              href="https://github.com/plotune/plotune-dl/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
            >
              <i className="fab fa-github"></i>
              View Releases Directly
            </a>
          </div>
        )}

        {/* Download Cards */}
        {!loading && !error && (
          <>
            <div className="max-w-4xl mx-auto space-y-8 mb-16">
              {currentPlatform.downloads.map((download, index) => (
                <div
                  key={index}
                  className="bg-dark-card rounded-2xl p-8 border-2 border-white/5 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-2xl font-bold text-light-text group-hover:text-primary transition-colors">
                          {download.name}
                        </h3>
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                          {download.type.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-text mb-4">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-tag"></i>
                          {download.version}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fas fa-weight-hanging"></i>
                          {download.size}
                        </span>
                        {download.command && (
                          <span className="flex items-center gap-1 font-mono text-xs bg-black/30 px-3 py-1.5 rounded-lg">
                            <i className="fas fa-terminal"></i>
                            {download.command}
                          </span>
                        )}
                      </div>
                    </div>
                    <i className={`${currentPlatform.icon} text-3xl text-primary/50 group-hover:text-primary transition-colors ml-4`}></i>
                  </div>

                  <p className="text-gray-text mb-6 leading-relaxed">
                    {download.description}
                  </p>

                  {/* Installation Instructions */}
                  <div className="bg-black/20 rounded-xl p-6 mb-6">
                    <h4 className="text-light-text font-semibold mb-4 flex items-center gap-2">
                      <i className="fas fa-list-ol text-primary"></i>
                      Installation Steps:
                    </h4>
                    <ol className="text-gray-text space-y-2">
                      {download.instructions.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full text-sm flex items-center justify-center mt-0.5">
                            {stepIndex + 1}
                          </span>
                          <span className="flex-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={download.getDownloadUrl()}
                      className="flex-1 py-4 px-6 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all duration-300 font-semibold text-center group/download-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-download mr-2"></i>
                      Download Now
                    </a>
                    
                    {download.installScript && (
                      <button
                        onClick={() => {
                          if (window.confirm('This will open the installation script. Run this in your terminal: curl -fsSL https://plotune.net/install.sh | bash\n\nContinue to script page?')) {
                            window.open('https://plotune.net/install.sh', '_blank');
                          }
                        }}
                        className="py-4 px-6 border border-primary/50 text-primary rounded-xl hover:bg-primary/10 transition-all duration-300 font-medium text-center"
                      >
                        <i className="fas fa-terminal mr-2"></i>
                        View Install Script
                      </button>
                    )}
                    
                    {download.type === 'snap' && (
                      <a
                        href="https://snapcraft.io/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-4 px-6 border border-white/20 text-gray-text rounded-xl hover:border-primary hover:text-primary transition-all duration-300 font-medium text-center"
                      >
                        <i className="fas fa-book mr-2"></i>
                        Snap Guide
                      </a>
                    )}
                    
                    {download.type === 'aur' && (
                      <a
                        href="https://wiki.archlinux.org/title/Arch_User_Repository"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-4 px-6 border border-white/20 text-gray-text rounded-xl hover:border-primary hover:text-primary transition-all duration-300 font-medium text-center"
                      >
                        <i className="fas fa-question-circle mr-2"></i>
                        AUR Help
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Release Info Banner */}
            {latestRelease && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <i className="fas fa-rocket text-2xl text-primary"></i>
                    <div>
                      <h4 className="text-light-text font-semibold mb-1">
                        Latest Release: {latestRelease.tag_name}
                      </h4>
                      <p className="text-gray-text text-sm">
                        Released {new Date(latestRelease.published_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        {latestRelease.assets?.length > 0 && ` • ${latestRelease.assets.length} packages available`}
                      </p>
                    </div>
                  </div>
                  <a
                    href={latestRelease.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-dark-surface backdrop-blur-xl border border-white/10 rounded-lg hover:border-primary hover:text-primary transition-colors text-sm"
                  >
                    <i className="fab fa-github"></i>
                    View Release Notes
                  </a>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="text-center pt-8 border-t border-white/10">
              <div className="inline-flex flex-wrap justify-center gap-8 text-gray-text mb-12">
                <div className="flex items-center gap-2">
                  <i className="fas fa-shield-alt text-primary"></i>
                  <span>Secure & Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-bolt text-primary"></i>
                  <span>Fast Installation</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-sync-alt text-primary"></i>
                  <span>Auto Updates</span>
                </div>
              </div>

              <div className="max-w-md mx-auto mb-8">
                <a
                  href="https://github.com/plotune/plotune-dl/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 bg-dark-surface backdrop-blur-xl border border-white/10 rounded-xl hover:border-primary hover:text-primary transition-all duration-300 group"
                >
                  <i className="fab fa-github text-lg"></i>
                  <span className="font-medium">All Releases on GitHub</span>
                  <i className="fas fa-external-link-alt text-sm opacity-70"></i>
                </a>
              </div>

              <div className="mt-12 text-sm text-gray-text max-w-2xl mx-auto">
                <p className="mb-4">
                  <strong>Need help?</strong> Check out our{' '}
                  <a href="#/docs" className="text-primary hover:underline">documentation</a>{' '}
                  or join our{' '}
                  <a href="https://discord.gg/plotune" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    community Discord
                  </a> for support.
                </p>
                  <p className="text-xs text-gray-text/70 border-t border-white/10 pt-4 mt-4">
                    <i className="fas fa-info-circle mr-1"></i>
                    Linux is the primary supported platform. Windows builds are provided on a best-effort basis.
                    <br />
                    © {new Date().getFullYear()} Plotune. All rights reserved.
                  </p>


              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DownloadSection;