import React from 'react';
import { FaSearch } from "react-icons/fa";

const ExtensionsGrid = ({ 
  extensions, 
  loading, 
  error,
  onRetry,
  installExtension, 
  visitWebsite, 
  visitRepo 
}) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTagColor = (tag) => {
    const colors = {
      'verified': 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
      'core': 'bg-primary/15 text-primary border border-primary/20',
      'package': 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
      'stream': 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
      'cloud': 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
    };
    return colors[tag] || 'bg-white/5 text-gray-300 border border-white/10';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-dark-card rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-5 py-8">
        <div className="text-center py-12" role="alert">
          <FaSearch className="mx-auto text-5xl text-gray-text/90 mb-5" />
          <h3 className="text-xl font-semibold text-light-text mb-2">Couldn't load extensions.</h3>
          <p className="text-gray-text mb-5">Something went wrong while loading the marketplace.</p>
          <button
            onClick={onRetry}
            className="min-h-[44px] px-6 py-2.5 rounded-lg font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 py-8">
      {extensions.length === 0 ? (
        <div className="text-center py-12">
          <FaSearch className="mx-auto text-5xl text-gray-text/90 mb-5" />
          <h3 className="text-xl font-semibold text-light-text mb-2">No extensions found</h3>
          <p className="text-gray-text">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {extensions.map((extension) => (
            <div
              key={extension.id}
              className="bg-dark-card/50 rounded-xl p-5 border border-white/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
            >
              {/* Logo and basic info */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-[#FFFDD0] flex items-center justify-center overflow-hidden">
                  <img 
                    src={extension.logo} 
                    alt={extension.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.nextElementSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div
                    aria-hidden="true"
                    style={{ display: 'none' }}
                    className="w-full h-full items-center justify-center text-lg font-semibold text-[#1A202C]"
                  >
                    {(extension.name || '?').charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-light-text truncate">
                      {extension.name}
                    </h3>
                    <span className="text-xs text-gray-text bg-white/5 px-2 py-1 rounded">
                      {extension.version || '—'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-text mt-1">by {extension.author}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-text text-sm mb-4 line-clamp-2">
                {extension.description}
              </p>

              {/* Tags - minimal display */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {extension.tags
                  .filter(tag => ['verified', 'core', 'package', 'stream', 'cloud'].includes(tag))
                  .map((tag, index) => (
                  <span 
                    key={index}
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* OS Support - minimal */}
              <div className="text-xs text-gray-text mb-4 flex items-center gap-1.5">
                <span className="opacity-50">🖥️</span>
                <span>{extension.os.join(' • ')}</span>
              </div>

              {/* Action Buttons - clean and minimal */}
              <div className="space-y-2">
              <button
                onClick={() => installExtension(extension.id)}
                disabled={!extension.repo}
                className={`
                  w-full min-h-[44px] py-2.5 px-4
                  rounded-lg font-medium
                  flex items-center justify-center gap-2
                  border transition-all duration-200
                  ${
                    extension.repo
                      ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                      : "bg-primary/5 text-primary/40 border-primary/10 cursor-not-allowed"
                  }
                `}
              >
                {extension.repo ? (
                  <>
                    <span className="text-sm">↓</span>
                    Install
                  </>
                ) : (
                  "Coming Soon"
                )}
              </button>


                <div className="flex gap-2">
                  <button
                    onClick={() => visitRepo(extension.repo)}
                    disabled={!extension.repo}
                    className={`flex-1 min-h-[44px] py-2 px-3 border border-gray-700 rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-1 ${
                      extension.repo
                        ? 'text-gray-300 hover:border-gray-500 hover:text-white'
                        : 'text-gray-text/50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <span></span>
                    {extension.repo ? 'Source' : 'No source'}
                  </button>
                  <button
                    onClick={() => visitWebsite(extension.web)}
                    className="flex-1 min-h-[44px] py-2 px-3 border border-gray-700 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-all duration-200 text-sm flex items-center justify-center gap-1"
                  >
                    <span></span>
                    Web
                  </button>
                </div>
              </div>

              {/* Last updated - subtle (hidden when unknown) */}
              {extension.last_updated && (
                <div className="text-xs text-gray-text/60 text-center mt-4 pt-3 border-t border-white/5">
                  Updated: {formatDate(extension.last_updated)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExtensionsGrid;