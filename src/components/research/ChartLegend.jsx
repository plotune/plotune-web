import React from 'react';

// Matches the marker shapes/colors used in the decision-model scenario trace charts
// (decisionModelCharts.js) exactly, so the key means something rather than being generic
// colored dots -- shape doubles the color encoding, so it still reads without color.
const SHAPES = {
  circle: <circle cx="7" cy="7" r="6" />,
  'triangle-up': <path d="M7 0.8 L13.4 12.4 L0.6 12.4 Z" />,
  diamond: <path d="M7 0.8 L13.2 7 L7 13.2 L0.8 7 Z" />,
};

const Swatch = ({ color, symbol }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill={color} aria-hidden="true">{SHAPES[symbol]}</svg>
);

// A persistent, visible key for the outcome markers and the "was the model actually
// consulted" ring, placed once before the first chart in a section rather than only
// explained in passing prose -- readers jumping straight to a later chart need it too.
export const ChartLegend = ({ items, ringNote }) => (
  <div className="chart-legend">
    <div className="chart-legend__row">
      {items.map((item) => (
        <span className="chart-legend__item" key={item.label}>
          <Swatch color={item.color} symbol={item.symbol} />
          {item.label}
        </span>
      ))}
    </div>
    {ringNote && (
      <div className="chart-legend__row chart-legend__row--ring">
        <span className="chart-legend__item">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="#9ca3af" stroke="#1f2937" strokeWidth="2" />
          </svg>
          {ringNote}
        </span>
      </div>
    )}
  </div>
);

export default ChartLegend;
