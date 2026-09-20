import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import ResearchOverview from './ResearchOverview';

jest.mock('../components/research/ScatterMetricChart', () => () => <div aria-label="Performance chart" />);

global.IS_REACT_ACT_ENVIRONMENT = true;

test('keeps the benchmark graphs while presenting only final-data metrics', async () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  document.body.appendChild(container);

  await act(async () => {
    root.render(<HelmetProvider><MemoryRouter><ResearchOverview /></MemoryRouter></HelmetProvider>);
    await Promise.resolve();
  });

  expect(container.textContent).toContain('Performance landscape');
  expect(container.textContent).toContain('13 models');
  expect(container.textContent).not.toContain('Reliability');

  act(() => root.unmount());
  document.body.removeChild(container);
});
