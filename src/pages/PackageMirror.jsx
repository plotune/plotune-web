// components/packages/PackageMirror.jsx
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { 
  FaGithub, 
  FaDocker, 
  FaPlay, 
  FaStop, 
  FaTrash, 
  FaCopy,
  FaSync,
  FaCheckCircle,
  FaExternalLinkAlt ,
  FaClock,
  FaEye,
  FaBox,
  FaCogs,
  FaTerminal
} from 'react-icons/fa';

const PackageMirror = () => {
  const { user } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('mirror');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    packageUrl: '',
    token: '',
    tag: 'latest'
  });
  const [showTokenHelp, setShowTokenHelp] = useState(false);

  // Mock data for demonstration
  const mockPackages = [
    //{
    //  id: 1,
    //  name: 'plotune-stream-gateway',
    //  displayName: 'Stream Gateway',
    //  status: 'active',
    //  source: 'ghcr.io/plotune/plotune-stream-gateway',
    //  tag: 'latest',
    //  lastSynced: '2024-01-15T10:30:00Z',
    //  size: '245MB',
    //  logs: ['2024-01-15 10:30:15 - Successfully synced with latest version', '2024-01-15 10:30:10 - Pulling from GHCR...', '2024-01-15 10:30:05 - Authentication successful'],
    //  description: 'Real-time stream processing gateway'
    //}
  ];

  useEffect(() => {
    // Simulate loading packages
    setLoading(true);
    setTimeout(() => {
      setPackages(mockPackages);
      setLoading(false);
    }, 1000);
  }, []);

  const extractPackageInfo = (url) => {
    try {
      // Parse package URL to get the Docker pull command
      const urlParts = url.replace('https://', '').split('/');
      const orgIndex = urlParts.indexOf('orgs');
      const packageIndex = urlParts.indexOf('package');
      
      if (orgIndex !== -1 && packageIndex !== -1) {
        const org = urlParts[orgIndex + 1];
        const pkg = urlParts[packageIndex + 1];
        return `ghcr.io/${org}/${pkg}`;
      }
      
      // If URL format is different, try to extract from path
      const pathParts = url.split('/');
      const orgName = pathParts[pathParts.length - 3];
      const pkgName = pathParts[pathParts.length - 1];
      return `ghcr.io/${orgName}/${pkgName}`;
    } catch (error) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.packageUrl.trim()) {
      toast.error('Please enter a package URL');
      return;
    }

    const dockerPullCommand = extractPackageInfo(formData.packageUrl);
    if (!dockerPullCommand) {
      toast.error('Invalid package URL format');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPackage = {
        id: packages.length + 1,
        name: formData.packageUrl.split('/').pop(),
        displayName: formData.packageUrl.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        status: 'syncing',
        source: dockerPullCommand,
        tag: formData.tag,
        lastSynced: new Date().toISOString(),
        size: '0MB',
        logs: ['Starting sync process...', 'Authenticating with GitHub Container Registry...'],
        description: 'Syncing from GitHub Container Registry'
      };

      setPackages([newPackage, ...packages]);
      toast.success('Package sync started successfully!');
      
      // Simulate sync completion
      setTimeout(() => {
        setPackages(prev => prev.map(pkg => 
          pkg.id === newPackage.id 
            ? { 
                ...pkg, 
                status: 'active', 
                size: '210MB', 
                logs: [
                  ...pkg.logs, 
                  'Successfully authenticated',
                  'Pulling latest image from GHCR',
                  'Image verified and ready for Plotune ecosystem',
                  'Sync completed successfully'
                ] 
              }
            : pkg
        ));
      }, 2000);

      setFormData({
        packageUrl: '',
        token: '',
        tag: 'latest'
      });
      setActiveSection('manage');
      setLoading(false);
    }, 1500);
  };

  const handleAction = async (packageId, action) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId 
        ? { ...pkg, status: 'processing' }
        : pkg
    ));

    setTimeout(() => {
      switch(action) {
        case 'start':
          setPackages(prev => prev.map(pkg => 
            pkg.id === packageId 
              ? { 
                  ...pkg, 
                  status: 'active', 
                  logs: [...pkg.logs, `${new Date().toLocaleTimeString()} - Package activated`] 
                }
              : pkg
          ));
          toast.success('Package activated');
          break;
        case 'stop':
          setPackages(prev => prev.map(pkg => 
            pkg.id === packageId 
              ? { 
                  ...pkg, 
                  status: 'inactive', 
                  logs: [...pkg.logs, `${new Date().toLocaleTimeString()} - Package deactivated`] 
                }
              : pkg
          ));
          toast.success('Package deactivated');
          break;
        case 'delete':
          setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
          toast.success('Package removed');
          break;
        case 'sync':
          setPackages(prev => prev.map(pkg => 
            pkg.id === packageId 
              ? { ...pkg, status: 'syncing', lastSynced: new Date().toISOString() }
              : pkg
          ));
          setTimeout(() => {
            setPackages(prev => prev.map(pkg => 
              pkg.id === packageId 
                ? { 
                    ...pkg, 
                    status: 'active', 
                    logs: [...pkg.logs, `${new Date().toLocaleTimeString()} - Synced with latest version`] 
                  }
                : pkg
            ));
          }, 1500);
          toast.success('Sync started');
          break;
      }
    }, 800);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: { color: 'bg-green-500/20 text-green-400', label: 'Active', icon: '▶' },
      inactive: { color: 'bg-gray-500/20 text-gray-400', label: 'Inactive', icon: '⏸' },
      error: { color: 'bg-red-500/20 text-red-400', label: 'Error', icon: '⚠' },
      syncing: { color: 'bg-blue-500/20 text-blue-400', label: 'Syncing', icon: '↻' },
      processing: { color: 'bg-purple-500/20 text-purple-400', label: 'Processing', icon: '🔄' }
    };
    return configs[status] || configs.inactive;
  };

  const renderMirrorSection = () => (
    <div className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-primary/20 rounded-lg mr-4">
          <FaBox className="text-primary text-2xl" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-light-text">Sync GitHub Packages</h2>
          <p className="text-gray-text">Connect your private GitHub packages to Plotune ecosystem</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-text mb-2">
            GitHub Package URL
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            type="text"
            value={formData.packageUrl}
            onChange={(e) => setFormData({ ...formData, packageUrl: e.target.value })}
            placeholder="https://github.com/orgs/plotune/packages/container/package/plotune-stream-gateway"
            className="w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/10 text-light-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
            required
          />
          <p className="text-gray-text text-xs mt-2">
            Full GitHub Packages container URL from your repository
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-text mb-2">Tag</label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              placeholder="latest"
              className="w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/10 text-light-text focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-gray-text text-xs mt-2">Container tag (default: latest)</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-text">
                GitHub Token (Optional)
              </label>
              <button
                type="button"
                onClick={() => setShowTokenHelp(!showTokenHelp)}
                className="text-primary hover:text-primary-dark text-sm transition"
              >
                {showTokenHelp ? 'Hide info' : 'Need token?'}
              </button>
            </div>
            <input
              type="password"
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/10 text-light-text focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-gray-text text-xs mt-2">
              Required only for private packages
            </p>
          </div>
        </div>

        {showTokenHelp && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h4 className="text-light-text font-medium mb-2 flex items-center">
              <FaGithub className="mr-2" />
              GitHub Token Required?
            </h4>
            <div className="text-gray-text text-sm space-y-2">
              <p>Only needed if your package is <strong>private</strong>. Public packages work without token.</p>
              <div className="flex items-start mt-2">
                <FaCheckCircle className="text-green-400 mt-1 mr-2 flex-shrink-0" />
                <span>We only request <code className="bg-dark-surface backdrop-blur-xl px-1 rounded">read:packages</code> permission</span>
              </div>
              <a 
                href="https://github.com/settings/tokens/new?description=Plotune+access+for+private+packages&scopes=read:packages"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary-dark mt-2"
              >
                Create GitHub Token <FaExternalLinkAlt className="ml-1" />
              </a>
            </div>
          </div>
        )}

        <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-4 border border-white/5">
          <h4 className="text-light-text font-medium mb-3">How it works</h4>
          <div className="space-y-3 text-sm text-gray-text">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 flex-shrink-0">1</div>
              <span>We securely authenticate with GitHub Container Registry</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 flex-shrink-0">2</div>
              <span>Pull your container image using the provided tag</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 flex-shrink-0">3</div>
              <span>Make it available within the Plotune ecosystem</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium flex items-center justify-center"
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Starting Sync...
            </>
          ) : (
            'Start Package Sync'
          )}
        </button>
      </form>
    </div>
  );

  const renderManageSection = () => (
    <div className="bg-dark-card rounded-2xl border border-white/10 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-light-text">My Packages</h2>
            <p className="text-gray-text">Manage your synced packages in Plotune</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('mirror')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              + Add Package
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-h-[600px] overflow-y-auto">
        {loading && packages.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="text-5xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-light-text text-lg mb-2">No packages synced yet</h3>
            <p className="text-gray-text mb-4">Sync your first GitHub package to get started</p>
            <button
              onClick={() => setActiveSection('mirror')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Sync First Package
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg) => {
              const statusConfig = getStatusConfig(pkg.status);
              return (
                <div key={pkg.id} className="bg-dark-surface backdrop-blur-xl rounded-xl p-5 border border-white/5 hover:border-white/10 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-light-text font-semibold text-lg">{pkg.displayName}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.icon} {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-gray-text text-sm mb-3">{pkg.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        <div className="bg-dark-bg rounded-lg p-3">
                          <div className="text-gray-text text-xs mb-1">Docker Pull Command</div>
                          <div className="flex items-center justify-between">
                            <code className="text-sm text-light-text truncate">
                              docker pull {pkg.source}:{pkg.tag}
                            </code>
                            <button
                              onClick={() => copyToClipboard(`docker pull ${pkg.source}:${pkg.tag}`)}
                              className="text-primary hover:text-primary-dark ml-2 flex-shrink-0"
                            >
                              <FaCopy size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-dark-bg rounded-lg p-3">
                          <div className="text-gray-text text-xs mb-1">Last Synced</div>
                          <div className="text-sm text-light-text flex items-center">
                            <FaClock className="mr-2 text-gray-400" />
                            {formatDate(pkg.lastSynced)}
                          </div>
                        </div>
                        
                        <div className="bg-dark-bg rounded-lg p-3">
                          <div className="text-gray-text text-xs mb-1">Size</div>
                          <div className="text-sm text-light-text">{pkg.size}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition flex items-center"
                      >
                        <FaEye className="mr-2" />
                        View Logs
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(pkg.id, 'sync')}
                        disabled={pkg.status === 'processing'}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition"
                        title="Sync with latest version"
                      >
                        <FaSync className={pkg.status === 'syncing' ? 'animate-spin' : ''} />
                      </button>
                      <button
                        onClick={() => handleAction(pkg.id, pkg.status === 'active' ? 'stop' : 'start')}
                        disabled={pkg.status === 'processing' || pkg.status === 'syncing'}
                        className={`p-2 rounded-lg transition ${
                          pkg.status === 'active'
                            ? 'text-yellow-400 hover:text-yellow-300 hover:bg-white/5'
                            : 'text-green-400 hover:text-green-300 hover:bg-white/5'
                        }`}
                        title={pkg.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {pkg.status === 'active' ? <FaStop /> : <FaPlay />}
                      </button>
                      <button
                        onClick={() => handleAction(pkg.id, 'delete')}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition"
                        title="Remove Package"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderLogsSection = () => (
    <div className="bg-dark-card rounded-2xl border border-white/10 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-light-text">Package Logs</h2>
            <p className="text-gray-text">Container execution and sync logs</p>
          </div>
          <button
            onClick={() => setSelectedPackage(null)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
          >
            ← Back to Packages
          </button>
        </div>
      </div>

      <div className="p-6">
        {selectedPackage ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/20 rounded-lg">
                <FaTerminal className="text-primary text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-light-text">{selectedPackage.displayName}</h3>
                <p className="text-gray-text">{selectedPackage.source}:{selectedPackage.tag}</p>
              </div>
            </div>

            <div className="bg-dark-bg rounded-lg border border-white/10 overflow-hidden">
              <div className="px-4 py-3 bg-dark-surface backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
                <span className="text-light-text font-medium">Live Logs</span>
                <span className="text-gray-text text-sm">Updated: {formatDate(selectedPackage.lastSynced)}</span>
              </div>
              <div className="p-4 font-mono text-sm">
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {selectedPackage.logs.map((log, index) => (
                    <div key={index} className="text-gray-300 hover:text-light-text transition">
                      <span className="text-blue-400">$</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaTerminal className="text-5xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-light-text text-lg mb-2">No package selected</h3>
            <p className="text-gray-text">Select a package from the Manage section to view its logs</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-dark-card rounded-xl p-4 border border-white/10">
              <div className="text-gray-text text-sm mb-1">Synced Packages</div>
              <div className="text-2xl font-semibold text-light-text">{packages.length}</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-white/10">
              <div className="text-gray-text text-sm mb-1">Active</div>
              <div className="text-2xl font-semibold text-green-400">
                {packages.filter(p => p.status === 'active').length}
              </div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-white/10">
              <div className="text-gray-text text-sm mb-1">Last Activity</div>
              <div className="text-lg font-semibold text-light-text">
                {packages.length > 0 
                  ? formatDate(packages[0].lastSynced).split(',')[0]
                  : 'Never'
                }
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveSection('mirror')}
              className={`px-5 py-3 rounded-lg transition font-medium flex items-center ${
                activeSection === 'mirror'
                  ? 'bg-primary text-white'
                  : 'bg-dark-surface backdrop-blur-xl text-gray-text hover:text-light-text'
              }`}
            >
              <FaSync className="mr-2" />
              Sync Package
            </button>
            <button
              onClick={() => setActiveSection('manage')}
              className={`px-5 py-3 rounded-lg transition font-medium flex items-center ${
                activeSection === 'manage'
                  ? 'bg-primary text-white'
                  : 'bg-dark-surface backdrop-blur-xl text-gray-text hover:text-light-text'
              }`}
            >
              <FaCogs className="mr-2" />
              Manage ({packages.length})
            </button>
            <button
              onClick={() => setActiveSection('logs')}
              className={`px-5 py-3 rounded-lg transition font-medium flex items-center ${
                activeSection === 'logs'
                  ? 'bg-primary text-white'
                  : 'bg-dark-surface backdrop-blur-xl text-gray-text hover:text-light-text'
              }`}
            >
              <FaTerminal className="mr-2" />
              Logs
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Sync Form */}
            <div className="lg:col-span-6">
              {activeSection === 'mirror' && renderMirrorSection()}
              {activeSection === 'manage' && renderManageSection()}
              {activeSection === 'logs' && renderLogsSection()}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageMirror;