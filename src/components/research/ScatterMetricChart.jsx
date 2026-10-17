import React, { lazy, Suspense, useEffect, useState } from 'react';
import { formatMetricValue as format } from '../../research/content/benchmark';

const InteractivePlotly = lazy(() => import('./InteractivePlotly'));

const ScatterMetricChart = ({ chart, label }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selected, setSelected] = useState(null);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <div className="landscape-canvas" role="group" aria-label={label}>
      {!isMounted ? (
        <div className="landscape-fallback" role="img" aria-label={label} />
      ) : (
        <Suspense fallback={<div className="landscape-fallback" role="status">Loading chart…</div>}>
          <InteractivePlotly chart={chart} onPointSelect={(point) => { if (point?.model) setSelected(point); }} />
        </Suspense>
      )}
      {selected && <div className="explorer-point-detail" role="status"><div><strong>{selected.model}</strong><span>Validation index: {format(selected.score, 'performance')} · Cost: {format(selected.cost, 'cost')} / task · Time: {format(selected.time, 'latency')} / task</span></div><button type="button" onClick={() => setSelected(null)} aria-label="Close model chart details">×</button></div>}
    </div>
  );
};

export default ScatterMetricChart;
