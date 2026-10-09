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

  if (loading) {
    return (
      <div className="design-container catalog">
        <div className="grid grid-cols-1 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-dark-card rounded-sm p-6 animate-pulse">
              <div className="h-4 bg-dark-surface rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-dark-surface rounded w-1/2 mb-6"></div>
              <div className="space-y-2">
                <div className="h-3 bg-dark-surface rounded"></div>
                <div className="h-3 bg-dark-surface rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="design-container catalog">
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
    <div className="design-container catalog">
      {extensions.length === 0 ? (
        <div className="text-center py-12">
          <FaSearch className="mx-auto text-5xl text-gray-text/90 mb-5" />
          <h3 className="text-xl font-semibold text-light-text mb-2">No extensions found</h3>
          <p className="text-gray-text">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <ol className="catalog-list">
          {extensions.map((extension, index) => (
            <li key={extension.id} className="catalog-row">
              <span className="technical-label catalog-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="catalog-name">
                <h3>{extension.name}</h3>
                <p>by {extension.author}</p>
                <code>{extension.app_id}</code>
              </div>
              <div className="catalog-description">
                <p>{extension.description}</p>
                <ul className="catalog-tags" aria-label="Tags">
                  {extension.tags
                    .filter(tag => ['verified', 'core', 'package', 'stream', 'cloud'].includes(tag))
                    .map((tag) => <li key={tag} className={tag === 'verified' ? 'is-verified' : ''}>{tag}</li>)}
                </ul>
              </div>
              <dl className="catalog-meta">
                <div><dt>Platform</dt><dd>{extension.os.join(' · ')}</dd></div>
                <div><dt>Release</dt><dd>{extension.version || '—'}</dd></div>
                {extension.last_updated && <div><dt>Updated</dt><dd>{formatDate(extension.last_updated)}</dd></div>}
              </dl>
              <div className="catalog-actions">
                <button
                  onClick={() => installExtension(extension.id)}
                  disabled={!extension.repo}
                  className="design-button"
                >
                  {extension.repo ? <>Install <span aria-hidden="true">↓</span></> : 'Coming Soon'}
                </button>
                <div>
                  <button onClick={() => visitRepo(extension.repo)} disabled={!extension.repo} className="text-link">
                    {extension.repo ? 'Source ↗' : 'No source'}
                  </button>
                  <button onClick={() => visitWebsite(extension.web)} className="text-link">Web ↗</button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ExtensionsGrid;
