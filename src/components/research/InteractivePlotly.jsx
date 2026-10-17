import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';

const Plot = createPlotlyComponent(Plotly);

const touchDevice = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

const InteractivePlotly = ({ chart, onPointSelect }) => (
  <Plot
    data={chart.data}
    layout={{ ...chart.layout, autosize: true, ...(touchDevice ? { dragmode: false } : {}) }}
    config={chart.config}
    onClick={onPointSelect ? (event) => onPointSelect(event.points?.[0]?.customdata) : undefined}
    useResizeHandler
    style={{ width: '100%', height: '100%' }}
  />
);

export default InteractivePlotly;
