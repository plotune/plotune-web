import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SolutionPage from './SolutionPage';
import { solutionSegments } from '../content/solutions';

global.IS_REACT_ACT_ENVIRONMENT = true;

const Where = () => <p id="where">{useLocation().pathname}</p>;
let container; let root;
const render = (url) => act(() => root.render(
  <HelmetProvider><MemoryRouter initialEntries={[url]}>
    <Routes><Route path="/solutions/:segment" element={<SolutionPage />} /><Route path="/nexus" element={<Where />} /></Routes>
  </MemoryRouter></HelmetProvider>,
));
beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });

describe.each(Object.keys(solutionSegments))('/solutions/%s', (slug) => {
  const config = solutionSegments[slug];
  beforeEach(() => render(`/solutions/${slug}`));

  test('hero carries the title, a workflow illustration and the example run', () => {
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1').textContent).toBe(config.heroTitle);
    expect(container.querySelector('.lx-run .lx-art svg')).not.toBeNull();
    expect(container.querySelector('.lx-run-head').textContent).toContain(config.exampleScenario.title);
    expect(container.querySelectorAll('.lx-run dl > div')).toHaveLength(config.exampleScenario.rows.length);
  });

  test('compares the workflow today with the Nexus workflow, item for item', () => {
    expect(container.querySelectorAll('.lx-before li')).toHaveLength(config.currentWorkflow.length);
    expect(container.querySelectorAll('.lx-after li')).toHaveLength(config.nexusWorkflow.length);
    expect(container.querySelector('.lx-after').textContent).toContain(config.nexusWorkflow[0]);
  });

  test('lists the supported integrations and links the other three workflows, never itself', () => {
    expect([...container.querySelectorAll('.lx-chiprow li')].map((li) => li.textContent)).toEqual(config.integrations);
    const hrefs = [...container.querySelectorAll('.lx-ugrid a')].map((a) => a.getAttribute('href').split('?')[0]);
    expect(hrefs).toHaveLength(3);
    expect(hrefs).not.toContain(`/solutions/${slug}`);
    hrefs.forEach((h) => expect(h).toMatch(/^\/solutions\//));
  });

  test('both calls to action keep the segment in the funnel link', () => {
    const contact = [...container.querySelectorAll('a')].filter((a) => a.getAttribute('href').startsWith('/contact'));
    expect(contact.length).toBeGreaterThanOrEqual(2);
    contact.forEach((a) => expect(a.getAttribute('href')).toContain(`segment=${slug}`));
  });
});

test('an unknown segment goes to the Nexus page', () => {
  render('/solutions/does-not-exist');
  expect(container.querySelector('#where').textContent).toBe('/nexus');
});
