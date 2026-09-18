import React from 'react';

// A labeled stat-card grid for MDX articles — pulls a burst of numbers out of paragraph prose
// (a cluster of measurements, example-run results) into a scannable figure instead of a
// number-heavy sentence.
const StatFigure = ({ title, stats }) => (
  <figure className="stat-figure">
    {title && <figcaption>{title}</figcaption>}
    <div className="stat-figure-grid">
      {stats.map(([label, value]) => (
        <div className="stat-cell" key={label}>
          <span className="stat-label">{label}</span>
          <strong className="stat-value">{value}</strong>
        </div>
      ))}
    </div>
  </figure>
);

export default StatFigure;
