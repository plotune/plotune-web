import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import MarketplaceHero from '../components/MarketplaceHero';
import MarketplaceControls from '../components/MarketplaceControls';
import ExtensionsGrid from '../components/ExtensionsGrid';

const Extensions = () => {
  const [extensions, setExtensions] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSearch, setCurrentSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Cache configuration
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  const CACHE_KEY = 'plotune_extensions_cache';

  const baseExtensions = [
    {
      id: 'plotune_sandbox_extension',
      app_id: 'plotune_sandbox_extension',
      name: 'Plotune SandBox Extension',
      description: 'Random data generator for SandBox environment in Plotune',
      tags: ['verified', 'core'],
      os: ["Linux", "Windows"],
      repo: 'https://github.com/plotune/plotune-sandbox-ext',
      deployment: 'https://github.com/plotune/plotune-sandbox-ext/releases',
      web: 'https://plotune.net/',
      documentation: 'https://github.com/plotune/plotune-sandbox-ext',
      is_verified: true,
      author: 'Plotune SDK Team',
      logo: 'https://www.gravatar.com/avatar/5ff75ad1008fe01582efcae23b54f175a947461a3aee3e14ac77c13c0b0c51d3?d=monsterid'
    },
    {
      id: 'plotune_relay_ext',
      app_id: 'plotune_relay_ext',
      name: 'Plotune Relay Extension',
      description: 'Universal data relay extension for Plotune Core. Supports WebSocket and HTTP polling sources.',
      tags: ['verified', 'core'],
      os: ["Linux", "Windows"],
      repo: 'https://github.com/plotune/plotune-relay-ext',
      deployment: 'https://github.com/plotune/plotune-relay-ext/releases',
      web: 'https://plotune.net/',
      documentation: 'https://github.com/plotune/plotune-relay-ext',
      is_verified: true,
      author: 'Plotune SDK Team',
      logo: 'https://www.gravatar.com/avatar/eeec87c03bb42a9817b1feeeae3448bf7378381fcc0abc4428d259ee4ebd80ee?d=monsterid'
    },
    {
      id: 'plotune_arduino_ext',
      app_id: 'plotune_arduino_ext',
      name: 'Plotune Arduino Extension',
      description: 'Plug-and-play Arduino serial data acquisition and real-time streaming for Plotune Core.',
      tags: ['verified', 'core'],
      os: ["Linux", "Windows"],
      repo: 'https://github.com/plotune/plotune-arduino-ext',
      deployment: 'https://github.com/plotune/plotune-arduino-ext/releases',
      web: 'https://plotune.net/',
      documentation: 'https://github.com/plotune/plotune-arduino-ext',
      is_verified: true,
      author: 'Plotune SDK Team',
      logo: 'https://www.gravatar.com/avatar/c1b5f34e4a0335ace8cc4184e1f5a07b71b1b1dad77933276c646c43a0a83389?d=monsterid'
    },
    {
      id: 'plotune_simple_reader_ext',
      app_id: 'plotune_simple_reader_ext',
      name: 'Plotune Simple Reader',
      description: 'File reader, PLTX, HDF5, Arrow, CSV, XLSX',
      tags: ['verified', 'core'],
      os: ["Linux", "Windows"],
      repo: 'https://github.com/plotune/plotune-simple-reader-ext',
      deployment: 'https://github.com/plotune/plotune-simple-reader-ext/releases',
      web: 'https://plotune.net/',
      documentation: 'https://github.com/plotune/plotune-simple-reader-ext',
      is_verified: true,
      author: 'Plotune SDK Team',
      logo: 'https://www.gravatar.com/avatar/bf5360a203eea8e897bd60e34c52ac18090ae79464fd56b4800ee1ce9136397e?d=monsterid'
    },
    {
      id: 'plotune_stream_ext',
      app_id: 'plotune_stream_ext',
      name: 'Plotune Stream Extension',
      description: 'Plotune Stream - Producer and Consumer Extension',
      tags: ['verified', 'core', 'stream'],
      os: ["Linux", "Windows"],
      repo: 'https://github.com/plotune/plotune-stream-ext',
      deployment: 'https://github.com/plotune/plotune-stream-ext/releases',
      web: 'https://plotune.net/',
      documentation: 'https://github.com/plotune/plotune-stream-ext',
      is_verified: true,
      author: 'Plotune SDK Team',
      logo: 'https://www.gravatar.com/avatar/c77effdc1f7d8389bf8515b2182de17627b60ce1b9a8cbda007a9aeae091c730?d=monsterid'
    },
    {
      id: 'plotune_mqtt_extension',
      app_id: 'plotune_mqtt_extension',
      name: 'Plotune MQTT Extension',
      description: 'Industrial MQTT data bridge and monitor for Plotune industrial data flows',
      tags: ['verified', 'core'],
      os: ["Linux", "Windows"],
      repo: 'https://github.com/plotune/mqtt-ext',
      deployment: 'https://github.com/plotune/mqtt-ext/releases',
      web: 'https://plotune.net/',
      documentation: 'https://github.com/plotune/mqtt-ext',
      is_verified: true,
      author: 'Plotune SDK Team',
      logo: 'https://www.gravatar.com/avatar/4e4ae00dddde96abc03647234ef79ace1c5fb8f9147de8f04f7e773571f55732?d=monsterid'
    },
    {
      id: 'plotune_file_automotive_ext',
      app_id: 'plotune_file_automotive_ext',
      name: 'Automotive File Extension',
      description: 'CAN / MDF Data Reader and Converter Extension',
      tags: ['verified', 'core'],
      os: ["Linux", "Windows"],
      repo: '',
      deployment: '',
      web: 'https://plotune.net/',
      documentation: '',
      is_verified: false,
      author: 'Plotune SDK Team',
      logo: 'https://www.gravatar.com/avatar/067c83890c9bc78057c8398397e1d9abac27b5184ce9aedc43be3d37cbfceb29?d=monsterid'
    }
  ];

  useEffect(() => {
    console.log("Initializing Extensions component...");
    loadExtensions();
  }, []);

  // Get cached data if available and not expired
  const getCachedRelease = (repoUrl) => {
    try {
      const cacheKey = `github_release_${btoa(repoUrl)}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        if (now - timestamp < CACHE_DURATION) {
          console.log(`Using cached data for ${repoUrl}`);
          return data;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  };

  // Cache release data
  const setCachedRelease = (repoUrl, data) => {
    try {
      const cacheKey = `github_release_${btoa(repoUrl)}`;
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error writing cache:', error);
    }
  };

  const fetchLatestRelease = async (repoUrl) => {
    // Check cache first
    const cachedData = getCachedRelease(repoUrl);
    if (cachedData) {
      return cachedData;
    }

    // If no repo URL, return null
    if (!repoUrl || repoUrl.trim() === '') {
      return null;
    }

    try {
      const urlParts = repoUrl.split('/');
      const owner = urlParts[urlParts.length - 2];
      const repo = urlParts[urlParts.length - 1];
      
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
      
      console.log(`Fetching latest release from: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`No releases found for ${owner}/${repo}`);
          const nullResult = null;
          setCachedRelease(repoUrl, nullResult);
          return nullResult;
        }
        throw new Error(`GitHub API returned ${response.status}`);
      }
      
      const releaseData = await response.json();
      console.log(`Release data for ${owner}/${repo}:`, releaseData);
      
      const result = {
        version: releaseData.tag_name,
        last_updated: releaseData.published_at,
        download_url: releaseData.html_url,
        assets: releaseData.assets
      };
      
      // Cache the result
      setCachedRelease(repoUrl, result);
      
      return result;
    } catch (error) {
      console.error(`Error fetching release for ${repoUrl}:`, error);
      const nullResult = null;
      setCachedRelease(repoUrl, nullResult);
      return nullResult;
    }
  };

  const loadExtensions = async () => {
    console.log("Loading extensions...");
    setLoading(true);
    
    try {
      // Check for cached extensions data
      const cachedExtensions = localStorage.getItem(CACHE_KEY);
      if (cachedExtensions) {
        const { data, timestamp } = JSON.parse(cachedExtensions);
        const now = Date.now();
        
        if (now - timestamp < CACHE_DURATION) {
          console.log("Using cached extensions data");
          setExtensions(data);
          setLoading(false);
          return;
        }
      }
      
      // If no cache or expired, load fresh data
      const extensionsWithReleases = await loadBaseExtensions();
      setExtensions(extensionsWithReleases);
      
      // Cache the full extensions data
      try {
        const cacheData = {
          data: extensionsWithReleases,
          timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch (cacheError) {
        console.error('Error caching extensions:', cacheError);
      }
      
    } catch (error) {
      console.error("Error loading extensions:", error);
      toast.error("Failed to load extensions");
    } finally {
      setLoading(false);
    }
  };

  const loadBaseExtensions = async () => {
    try {
      console.log("Fetching release information for extensions...");
      
      const extensionsWithReleases = await Promise.all(
        baseExtensions.map(async (ext) => {
          try {
            const releaseInfo = await fetchLatestRelease(ext.repo);
            
            return {
              ...ext,
              version: releaseInfo?.version || 'v0.0.0',
              last_updated: releaseInfo?.last_updated || new Date().toISOString().split('T')[0],
              core_version: '>=1.0.0',
              deployment: ext.deployment
            };
          } catch (error) {
            console.error(`Error processing extension ${ext.name}:`, error);
            return {
              ...ext,
              version: 'v0.0.0',
              last_updated: new Date().toISOString().split('T')[0],
              core_version: '>=1.0.0',
            };
          }
        })
      );
      
      console.log("Extensions with release info:", extensionsWithReleases);
      return extensionsWithReleases;
    } catch (error) {
      console.log("Error fetching releases, using base extension data:", error.message);
      
      return baseExtensions.map(ext => ({
        ...ext,
        version: 'v0.0.0',
        last_updated: new Date().toISOString().split('T')[0],
        core_version: '>=1.0.0',
      }));
    }
  };

  const matchesFilter = (extension) => {
    if (currentSearch) {
      const searchLower = currentSearch.toLowerCase();
      const matchesSearch = 
        extension.name.toLowerCase().includes(searchLower) ||
        extension.description.toLowerCase().includes(searchLower) ||
        (extension.tags && extension.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
        extension.author.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    switch (currentFilter) {
      case 'verified':
        return extension.is_verified;
      case 'core':
        return extension.tags?.includes('core');
      case 'package':
        return extension.tags?.includes('package');
      case 'stream':
        return extension.tags?.includes('stream');
      case 'cloud':
        return extension.tags?.includes('cloud');
      default:
        return true;
    }
  };

  const installExtension = async (id) => {
    const extension = extensions.find(ext => ext.id === id);
    if (!extension) {
      toast.error('Extension not found');
      return;
    }

    const customUrl = `plotune://install?method=github&source=github&repo=${encodeURIComponent(extension.deployment)}&uid=${extension.id}`;
    
    console.log("Attempting to install via custom URL:", customUrl);
    
    // Store the timestamp when we try to open the app
    localStorage.setItem('plotune_install_attempt', Date.now().toString());
    
    // Create a hidden iframe to handle the protocol launch
    // This is a common workaround for custom protocol handlers
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = customUrl;
    document.body.appendChild(iframe);
    
    // Show toast immediately
    toast.info(
      <div>
        <p>Attempting to open Plotune...</p>
        <p>If the app doesn't open, make sure Plotune is installed and try again.</p>
      </div>,
      {
        autoClose: 5000,
        closeButton: true,
      }
    );
    
    // Remove the iframe after a short delay
    setTimeout(() => {
      document.body.removeChild(iframe);
      
      // Check if we should show a download link (only if extension has a deployment URL)
      if (extension.deployment) {
        toast.info(
          <div>
            <p>You can also manually download from:</p>
            <a 
              href={extension.deployment} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#61dafb', textDecoration: 'underline' }}
            >
              {extension.deployment}
            </a>
          </div>,
          {
            autoClose: 8000,
            closeButton: true,
          }
        );
      }
    }, 1000);
  };

  const visitWebsite = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('No website available for this extension.');
    }
  };

  const visitRepo = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('No repository available for this extension.');
    }
  };

  // Clear cache function (optional, could be exposed via UI if needed)
  const clearCache = () => {
    // Clear all GitHub release caches
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('github_release_')) {
        localStorage.removeItem(key);
      }
    });
    // Clear extensions cache
    localStorage.removeItem(CACHE_KEY);
    toast.info('Cache cleared. Reloading extensions...');
    loadExtensions();
  };

  const filteredExtensions = extensions.filter(matchesFilter);

  console.log("Current state:", { 
    extensionsCount: extensions.length, 
    filteredCount: filteredExtensions.length,
    loading
  });

  return (
    <>
      <MarketplaceHero />
      <MarketplaceControls
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        currentSearch={currentSearch}
        setCurrentSearch={setCurrentSearch}
        extensionCount={filteredExtensions.length}
        totalCount={extensions.length}
        onClearCache={clearCache} // Optional: add a clear cache button
      />
      <ExtensionsGrid
        extensions={filteredExtensions}
        loading={loading}
        installExtension={installExtension}
        visitWebsite={visitWebsite}
        visitRepo={visitRepo}
      />
    </>
  );
};

export default Extensions;