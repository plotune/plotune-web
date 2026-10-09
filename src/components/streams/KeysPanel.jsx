// components/streams/KeysPanel.jsx
import React from 'react';
import {
  FaDatabase,
  FaFilter,
  FaCheck,
  FaRegCheckCircle,
  FaTimes,
  FaChartLine
} from 'react-icons/fa';

const KeysPanel = ({
  keys,
  activeKey,
  selectedKeys,
  onSelectKey,
  onToggleKey,
  onSelectAll,
  onClearSelections,
  dataBuffers
}) => {
  // Safely format numbers, show strings as-is
  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';

    // If it's already a number or can be converted to one
    const numValue = Number(value);
    if (!isNaN(numValue) && typeof value !== 'boolean') {
      return numValue.toFixed(2);
    }

    // Return string representation for non-numeric values
    return String(value);
  };

  const getSignalStats = (key) => {
    const buffer = dataBuffers[key] || [];
    if (buffer.length === 0) return null;

    // Extract numeric values only for stats
    const numericValues = buffer
      .map(p => Number(p.value))
      .filter(v => !isNaN(v));

    if (numericValues.length === 0) return null;

    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
    const latest = numericValues[numericValues.length - 1];

    return {
      min: formatValue(min),
      max: formatValue(max),
      avg: formatValue(avg),
      latest: formatValue(latest),
      count: buffer.length,
      isNumeric: true
    };
  };

  return (
    <div className="bg-dark-card rounded-sm border border-ink/15 p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaDatabase /> Signals
        </h3>
        <div className="text-xs text-gray-text bg-dark-bg px-2 py-1 rounded">
          {keys.length} found
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onSelectAll}
          className="flex-1 px-3 py-2 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition flex items-center justify-center gap-2"
        >
          <FaRegCheckCircle className="w-3 h-3" />
          Select All
        </button>
        <button
          onClick={onClearSelections}
          className="flex-1 px-3 py-2 bg-gray-600/20 text-gray-text rounded-lg text-sm hover:bg-gray-600/30 transition flex items-center justify-center gap-2"
        >
          <FaTimes className="w-3 h-3" />
          Clear
        </button>
      </div>

      {/* Keys List */}
      <div className="space-y-3 max-h-[calc(100%-120px)] overflow-y-auto pr-2">
        {keys.length === 0 ? (
          <div className="text-center py-8">
            <FaFilter className="w-8 h-8 mx-auto mb-2 text-gray-text" />
            <p className="text-sm text-gray-text">No signals received yet</p>
          </div>
        ) : (
          keys.map((key) => {
            const stats = getSignalStats(key);
            const isSelected = selectedKeys.has(key);
            const isActive = activeKey === key;

            return (
              <div
                key={key}
                className={`rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-primary/10 border-primary/30'
                    : isActive
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-dark-bg border-ink/15 hover:border-ink/15'
                }`}
              >
                {/* Key Header */}
                <button
                  onClick={() => onToggleKey(key)}
                  className="w-full p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected
                        ? 'bg-primary border-primary'
                        : 'border-gray-500'
                    }`}>
                      {isSelected && <FaCheck className="w-2.5 h-2.5 text-white" />}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="font-mono text-sm truncate">{key}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {isActive && (
                          <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                            Active
                          </span>
                        )}
                        {stats && (
                          <span className="text-xs text-gray-text">
                            {stats.count} points
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="text-primary">
                      <FaChartLine className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {/* Stats if available */}
                {stats && (
                  <div className="px-3 pb-3 pt-1 border-t border-ink/15">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-gray-text">Latest:</div>
                      <div className="font-semibold text-right">{stats.latest}</div>

                      <div className="text-gray-text">Min:</div>
                      <div className="font-semibold text-right">{stats.min}</div>

                      <div className="text-gray-text">Max:</div>
                      <div className="font-semibold text-right">{stats.max}</div>

                      <div className="text-gray-text">Avg:</div>
                      <div className="font-semibold text-right">{stats.avg}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-ink/15">
        <p className="text-xs text-gray-text">
          • Select multiple signals to compare
          <br />
          • Each signal stores last 2000 points
          <br />
          • Click signal name for detailed view
        </p>
      </div>
    </div>
  );
};

export default KeysPanel;