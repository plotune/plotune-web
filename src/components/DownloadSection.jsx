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

  // Get asset size for display (null when unknown — never fabricate)
  const getAssetSize = (pattern) => {
    const asset = findAsset(pattern);
    if (!asset) return null;

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
          description: 'Works on Windows. Linux is our primary supported platform; Windows builds are provided with less testing than Linux.',
          version: latestRelease ? latestRelease.tag_name : 'Latest',
          size: getAssetSize('plotune-windows'),
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
          size: getAssetSize('.deb'),
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
          size: null,
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
          size: getAssetSize('plotune-linux'),
          type: 'binary',
          getDownloadUrl: () => "https://github.com/plotune/plotune-dl/releases/latest/download/plotune-linux-x86_64.tar.gz",
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

  const releaseDate = latestRelease?.published_at ? new Date(latestRelease.published_at) : null;
  const hasReleaseDate = releaseDate && !Number.isNaN(releaseDate.getTime());
  const helpLinks = {
    snap: ['https://snapcraft.io/docs', 'Snap Guide'],
    aur: ['https://wiki.archlinux.org/title/Arch_User_Repository', 'AUR Help'],
  };

  return (
    <section className="design-container download-section">
      <div className="download-platforms" role="tablist" aria-label="Operating system">
        {Object.entries(downloadOptions).map(([key, platform]) => (
          <button key={key} role="tab" aria-selected={activeTab === key} onClick={() => setActiveTab(key)}>
            <i className={platform.icon} aria-hidden="true"></i>
            {platform.title}
            <span className="technical-label">{platform.downloads.length} {platform.downloads.length === 1 ? 'package' : 'packages'}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="download-status" role="status">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p>Fetching latest release from GitHub...</p>
        </div>
      )}

      {error && !loading && (
        <div className="download-status" role="alert">
          <p>{error}</p>
          <a href="https://github.com/plotune/plotune-dl/releases" target="_blank" rel="noopener noreferrer" className="design-button">
            View Releases Directly <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}

      {!loading && !error && (
        <>
          <ol className="download-list">
            {currentPlatform.downloads.map((download, index) => (
              <li key={download.name} className="download-row">
                <div className="download-summary">
                  <span className="technical-label">{String(index + 1).padStart(2, '0')} / {download.type}</span>
                  <h3>{download.name}</h3>
                  <p>{download.description}</p>
                  <dl className="product-specs">
                    <div><dt>Version</dt><dd>{download.version}</dd></div>
                    {download.size && <div><dt>Size</dt><dd>{download.size}</dd></div>}
                  </dl>
                </div>
                <div className="download-steps">
                  {download.command && <pre aria-label="Install command"><code>$ {download.command}</code></pre>}
                  <p className="technical-label">Installation steps</p>
                  <ol>
                    {download.instructions.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                </div>
                <div className="download-actions">
                  <a href={download.getDownloadUrl()} className="design-button" target="_blank" rel="noopener noreferrer">
                    Download Now <span aria-hidden="true">↓</span>
                  </a>
                  {download.installScript && (
                    <a href="https://plotune.net/install.sh" target="_blank" rel="noopener noreferrer" className="text-link">View Install Script ↗</a>
                  )}
                  {helpLinks[download.type] && (
                    <a href={helpLinks[download.type][0]} target="_blank" rel="noopener noreferrer" className="text-link">{helpLinks[download.type][1]} ↗</a>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {latestRelease && (
            <div className="download-release">
              <div>
                <span className="technical-label">Latest release</span>
                <strong>{latestRelease.tag_name}</strong>
                <span>
                  {hasReleaseDate && `Released ${releaseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
                  {latestRelease.assets?.length > 0 && `${hasReleaseDate ? ' · ' : ''}${latestRelease.assets.length} packages available`}
                </span>
              </div>
              <div className="download-release-links">
                <a href={latestRelease.html_url} target="_blank" rel="noopener noreferrer" className="text-link">View Release Notes ↗</a>
                <a href="https://github.com/plotune/plotune-dl/releases" target="_blank" rel="noopener noreferrer" className="text-link">All Releases on GitHub ↗</a>
              </div>
            </div>
          )}

          <div className="download-notes">
            <p>
              <strong>Need help?</strong> Check out our <a href="/docs">documentation</a> or join our{' '}
              <a href="https://discord.gg/plotune" target="_blank" rel="noopener noreferrer">community Discord</a> for support.
              Installer scripts are open source.
            </p>
            <p>Linux is the primary supported platform. Windows builds are provided on a best-effort basis.</p>
          </div>
        </>
      )}
    </section>
  );
};

export default DownloadSection;
