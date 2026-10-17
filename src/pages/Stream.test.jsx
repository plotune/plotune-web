import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Stream from './Stream';

global.IS_REACT_ACT_ENVIRONMENT = true;

const render = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(<HelmetProvider><MemoryRouter><Stream /></MemoryRouter></HelmetProvider>));
  return { container, cleanup: () => { act(() => root.unmount()); container.remove(); } };
};
const click = async (element) => {
  await act(async () => element.dispatchEvent(new MouseEvent('click', { bubbles: true })));
};

test('switches the entire sample scene and preserves the chosen inspector view', async () => {
  const { container, cleanup } = render();
  const previous = container.querySelector('#sl-sample-scene');
  await click(container.querySelectorAll('.sl-scenarios button')[1]);
  expect(container.querySelector('#sl-sample-scene')).not.toBe(previous);
  expect(container.querySelector('.sl-inspector-event h4').textContent).toBe('test.completed');
  expect(container.querySelector('.sl-property-list').textContent).toContain('passed');
  await click(container.querySelectorAll('.sl-inspector-tabs button')[1]);
  expect(JSON.parse(container.querySelector('.sl-inspector-json').textContent).properties.verdict).toBe('passed');
  await click(container.querySelectorAll('.sl-scenarios button')[2]);
  expect(container.querySelectorAll('.sl-inspector-tabs button')[1].getAttribute('aria-pressed')).toBe('true');
  expect(JSON.parse(container.querySelector('.sl-inspector-json').textContent).event).toBe('temperature.limit_exceeded');
  expect(container.querySelector('.sl-selection-status').textContent).toBe('Temperature limit selected');
  cleanup();
});

test('copies the selected payload and shows an immediate recovery message if copying fails', async () => {
  const previous = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  const { container, cleanup } = render();
  await click(container.querySelectorAll('.sl-scenarios button')[2]);
  await click(container.querySelector('.sl-inspector > header button'));
  expect(JSON.parse(writeText.mock.calls[0][0]).properties.limit).toBe(85);
  expect(container.querySelector('.sl-inspector > header button').textContent).toContain('Copied');
  writeText.mockRejectedValueOnce(new Error('Clipboard blocked'));
  await click(container.querySelector('.sl-inspector > header button'));
  expect(container.querySelector('.sl-copy-feedback').textContent).toContain('Select the JSON text');
  expect(JSON.parse(container.querySelector('.sl-inspector-json').textContent).event).toBe('temperature.limit_exceeded');
  cleanup();
  if (previous) Object.defineProperty(navigator, 'clipboard', previous);
  else delete navigator.clipboard;
});

test('offers the demo and workspace in the hero and at the end of the product story', () => {
  const { container, cleanup } = render();
  const goals = [...container.querySelectorAll('.sl-hero-actions a')].map(link => ({ label: link.textContent, href: link.getAttribute('href') }));
  expect(goals).toEqual([
    { label: 'Try the demo ', href: '/stream/demo' },
    { label: 'Open workspace ', href: '/stream/workspace' },
  ]);
  expect([...container.querySelectorAll('.sl-experience')].map(link => link.getAttribute('href'))).toEqual(['/stream/demo', '/stream/workspace']);
  expect(container.querySelector('.sl-inspector-json')).toBeNull();
  expect(container.querySelector('.sl-inspector-fields')).not.toBeNull();
  cleanup();
});

test('hero source choices update the connected event and keep its context together', async () => {
  const { container, cleanup } = render();
  const buttons = container.querySelectorAll('.shv-sources button');
  for (const [index, event, device, session] of [
    [1, 'test.completed', 'ecu-012', 'validation-042'],
    [2, 'device.connected', 'nexus-01', 'bench-session-09'],
    [0, 'motor.sample', 'motor-003', 'test-run-817'],
  ]) {
    await click(buttons[index]);
    expect(buttons[index].getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('.shv-record strong').textContent).toBe(event);
    expect(container.querySelector('.shv-record small').textContent).toBe(`${device} / ${session}`);
    expect(container.querySelectorAll('.shv-readings > div')).toHaveLength(3);
    expect(container.querySelector('.shv-status').textContent).toContain(event);
    expect(container.querySelector('.shv-history-stack').textContent).not.toContain(event);
  }
  cleanup();
});
