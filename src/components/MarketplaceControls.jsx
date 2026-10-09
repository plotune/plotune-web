import React from 'react';

const MarketplaceControls = ({
  currentFilter,
  setCurrentFilter,
  currentSearch,
  setCurrentSearch,
  extensionCount,
  totalCount
}) => {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'verified', label: 'Verified' },
    { key: 'core', label: 'Core' },
    { key: 'stream', label: 'Stream' },
  ];

  return (
    <div className="design-container catalog-controls">
      <div className="catalog-search">
        <input
          type="text"
          placeholder="Search extensions..."
          aria-label="Search extensions"
          value={currentSearch}
          onChange={(e) => setCurrentSearch(e.target.value)}
        />
        {currentSearch && (
          <button onClick={() => setCurrentSearch('')} aria-label="Clear search">×</button>
        )}
      </div>
      <div className="catalog-filters" role="group" aria-label="Filter extensions">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setCurrentFilter(filter.key)}
            aria-pressed={currentFilter === filter.key}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <p className="technical-label catalog-count">
        Showing {extensionCount} of {totalCount} extensions
      </p>
    </div>
  );
};

export default MarketplaceControls;
