import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';

const Plot = createPlotlyComponent(Plotly);

const InteractivePlotly = ({ chart }) => (
  <Plot
    data={chart.data}
    layout={{ ...chart.layout, autosize: true }}
    config={chart.config}
    useResizeHandler
    style={{ width: '100%', height: '100%' }}
  />
);

export default InteractivePlotly;
