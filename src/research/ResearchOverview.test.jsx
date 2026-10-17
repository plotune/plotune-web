import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ResearchOverview from './ResearchOverview';

jest.mock('../components/research/ScatterMetricChart', () => () => <div aria-label="Performance chart" />);

global.IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => jest.spyOn(window, 'scrollTo').mockImplementation(() => {}));
afterAll(() => jest.restoreAllMocks());

const LocationProbe = () => <output data-location>{useLocation().hash}</output>;

test('keeps the benchmark graphs while presenting only final-data metrics', async () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  document.body.appendChild(container);

  await act(async () => {
    root.render(<HelmetProvider><MemoryRouter initialEntries={['/research#benchmark-explorer']}><ResearchOverview /><LocationProbe /></MemoryRouter></HelmetProvider>);
    await Promise.resolve();
  });

  expect(container.textContent).toContain('Performance landscape');
  expect(container.textContent).toContain('13 models');
  expect(container.textContent).not.toContain('Reliability');

  act(() => root.unmount());
  document.body.removeChild(container);
});

test('reranks visibly, expands workflow evidence, and preserves the selected workflow', async () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  document.body.appendChild(container);
  await act(async () => {
    root.render(<HelmetProvider><MemoryRouter initialEntries={['/research?task=V-cycle#benchmark-explorer']}><ResearchOverview /><LocationProbe /></MemoryRouter></HelmetProvider>);
  });
  const click = async (element) => {
    await act(async () => { element.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  };
  const previousScene = container.querySelector('#workflow-results');
  expect(container.querySelector('#workflow-scene-title').textContent).toBe('V-cycle');
  await click([...container.querySelectorAll('.explorer-workflows button')].find(button => button.textContent.includes('Automated test flows')));
  expect(container.querySelector('#workflow-results')).not.toBe(previousScene);
  expect(container.querySelector('#workflow-scene-title').textContent).toBe('Automated test flows');
  await click(container.querySelectorAll('.explorer-metric')[1]);
  expect(container.querySelector('.explorer-ranking-header h3').textContent).toBe('Ranked by cost per task');
  expect(container.querySelector('[data-location]').textContent).toBe('#benchmark-explorer');
  expect(container.querySelector('.explorer-model-name b').textContent).toBe('big-pickle');
  expect(container.querySelector('.explorer-workflows button[aria-pressed="true"]').textContent).toContain('Automated test flows');
  await click(container.querySelector('.explorer-model-toggle'));
  expect(container.querySelector('.explorer-model-toggle').getAttribute('aria-expanded')).toBe('true');
  expect(container.querySelectorAll('.explorer-task-scores > div')).toHaveLength(6);
  expect(container.querySelector('.explorer-task-scores .current').textContent).toContain('Automated test flows');
  await click(container.querySelector('.explorer-show-all'));
  expect(container.querySelectorAll('.explorer-model-toggle')).toHaveLength(13);
  act(() => root.unmount());
  document.body.removeChild(container);
});
