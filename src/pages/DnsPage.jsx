import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DnsPage = () => {
  const { user } = useContext(AuthContext);
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const maxDomains = user?.isPlusUser ? 5 : 2;

  const handleAddDomain = (e) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    const domainName = newDomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const newDomainEntry = {
      id: Date.now(),
      name: domainName,
      fullDomain: `${domainName}.dns.plotune.net`,
      ip: 'Waiting for update...',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setDomains([...domains, newDomainEntry]);
    setNewDomain('');
    setIsAdding(false);
  };

  const handleDeleteDomain = (domain) => {
    // Irreversible action: name the target and require confirmation (Occam/Tesler).
    if (!window.confirm(`Delete ${domain.fullDomain}? This cannot be undone.`)) return;
    setDomains(domains.filter((item) => item.id !== domain.id));
  };

  const copyCurlCommand = async (domain) => {
    try {
      await navigator.clipboard.writeText(generateCurlCommand(domain.name));
      setCopiedId(domain.id);
      window.setTimeout(() => setCopiedId((current) => (current === domain.id ? null : current)), 2000);
    } catch {
      // Clipboard can be unavailable (http, denied permission) — say so instead of failing silently.
      window.alert('Copy failed. Select the command text and copy it manually.');
    }
  };

  const generateCurlCommand = (domainName) => {
    return `curl -X POST "https://api.plotune.net/dns/update" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"domain": "${domainName}.dns.plotune.net", "ip": "$(curl -s ifconfig.me)"}'`;
  };

  return (
    <div className="min-h-screen bg-dark-surface backdrop-blur-xl pt-20 pb-10">
      <div className="container mx-auto px-5 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mt-4 p-4 bg-dark-card rounded-custom border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-light-text mb-1">DNS Limits</h3>
                <p className="text-gray-text text-sm">
                  {user?.isPlusUser ? 'Plus User' : 'Regular User'}: {domains.length}/{maxDomains} domains
                </p>
              </div>
              {!user?.isPlusUser && (
                <Link
                  to="/partners"
                  className="inline-flex min-h-[44px] items-center px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-custom text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Upgrade to Plus
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Add Domain Section */}
        <div className="mb-8">
          {isAdding ? (
            <div className="bg-dark-card rounded-custom p-6 border border-white/5">
              <h3 className="text-xl font-semibold text-light-text mb-4">Add New Domain</h3>
              <form onSubmit={handleAddDomain}>
                <div className="mb-4">
                  <label className="block text-gray-text text-sm font-medium mb-2">
                    Subdomain Name
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      placeholder="Enter subdomain name"
                      className="flex-1 px-4 py-2 bg-dark-surface backdrop-blur-xl border border-white/10 rounded-l-custom text-light-text placeholder-gray-text focus:outline-none focus:border-primary transition-colors"
                    />
                    <div className="px-4 py-2 bg-dark-surface backdrop-blur-xl border border-l-0 border-white/10 rounded-r-custom text-gray-text">
                      .dns.plotune.net
                    </div>
                  </div>
                  <p className="text-xs text-gray-text mt-2">
                    Only letters, numbers, and hyphens are allowed
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={domains.length >= maxDomains}
                    className="px-6 py-2 bg-primary text-white rounded-custom font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Domain
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-2 bg-dark-surface backdrop-blur-xl border border-white/10 text-gray-text rounded-custom font-medium hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              disabled={domains.length >= maxDomains}
              className="w-full p-6 bg-dark-card border border-dashed border-white/10 rounded-custom text-gray-text hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="material-icons">add</span>
                Add New Domain ({domains.length}/{maxDomains})
              </div>
            </button>
          )}
        </div>

        {/* Domains List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-light-text mb-4">Your Domains</h2>
          
          {domains.length === 0 ? (
            <div className="text-center py-12 text-gray-text">
              <span className="material-icons text-6xl mb-4 opacity-50">dns</span>
              <p>No domains configured yet</p>
            </div>
          ) : (
            domains.map((domain) => (
              <div key={domain.id} className="bg-dark-card rounded-custom p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-light-text">{domain.fullDomain}</h3>
                    <p className="text-gray-text text-sm mt-1">
                      Created on {domain.createdAt} • IP: <span className="text-primary">{domain.ip}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDomain(domain)}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-red-400 hover:bg-red-400/10 rounded-custom transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    aria-label={`Delete domain ${domain.fullDomain}`}
                  >
                    <span className="material-icons" aria-hidden="true">delete</span>
                  </button>
                </div>

                {/* Curl Command */}
                <div className="bg-dark-surface backdrop-blur-xl rounded-custom p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-text text-sm font-medium">Update IP with cURL</label>
                    <button
                      onClick={() => copyCurlCommand(domain)}
                      className="inline-flex min-h-[44px] items-center gap-1 px-2 text-xs text-primary hover:text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      <span className="material-icons text-sm" aria-hidden="true">content_copy</span>
                      {copiedId === domain.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="text-xs text-gray-text bg-black/20 p-3 rounded-custom overflow-x-auto">
                    {generateCurlCommand(domain.name)}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-dark-card rounded-custom p-6 border border-white/5">
          <h3 className="text-lg font-semibold text-light-text mb-4">How to Use</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-primary font-medium mb-2">Dynamic DNS Updates</h4>
              <p className="text-gray-text text-sm">
                Use the provided cURL command to update your domain's IP address automatically.
                You can set up a cron job to run this command periodically.
              </p>
            </div>
            <div>
              <h4 className="text-primary font-medium mb-2">Usage Limits</h4>
              <ul className="text-gray-text text-sm space-y-1">
                <li>• Regular users: 2 domains</li>
                <li>• Plus users: 5 domains</li>
                <li>• Updates allowed every 5 minutes</li>
                <li>• Subdomains must be unique</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DnsPage;