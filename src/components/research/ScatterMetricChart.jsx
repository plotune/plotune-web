import React, { lazy, Suspense, useEffect, useState } from 'react';

const InteractivePlotly = lazy(() => import('./InteractivePlotly'));

const ScatterMetricChart = ({ chart, label }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <div className="landscape-canvas">
      {!isMounted ? (
        <div className="landscape-fallback" role="img" aria-label={label} />
      ) : (
        <Suspense fallback={<div className="landscape-fallback" role="status">Loading chart…</div>}>
          <InteractivePlotly chart={chart} />
        </Suspense>
      )}
    </div>
  );
};

export default ScatterMetricChart;
