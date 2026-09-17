import React, { lazy, Suspense, useEffect, useState } from 'react';

const InteractivePlotly = lazy(() => import('./InteractivePlotly'));

const ResearchPlot = ({ chart, title, caption }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <figure className="research-plot" aria-labelledby="research-plot-title">
      <div className="research-plot__header">
        <h2 id="research-plot-title">{title}</h2>
        <span>Interactive figure</span>
      </div>
      <div className="research-plot__canvas">
        {!isMounted ? (
          <div className="research-plot__fallback" role="img" aria-label={chart.summary}>
            <div className="research-plot__bars"><i /><i /><i /><i /></div>
            <p>{chart.fallbackLabel}</p>
          </div>
        ) : (
          <Suspense fallback={<div className="research-plot__fallback" role="status">Loading interactive figure?</div>}>
            <InteractivePlotly chart={chart} />
          </Suspense>
        )}
      </div>
      <figcaption>{caption}</figcaption>
      <p className="sr-only">{chart.summary}</p>
    </figure>
  );
};

export default ResearchPlot;
