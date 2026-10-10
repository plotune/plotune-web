import React, { act, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useLocation, useSearchParams } from 'react-router-dom';
import StreamDemoWrapper, { INVITATION_KEY } from './StreamDemoWrapper';
import LegacyStreamDemoRedirect from './LegacyStreamDemoRedirect';
import { posthog } from '../posthog';
import { postLead } from '../utils/leadSubmission';
import { trackGoogleAdsStreamEarlyAccessConversion } from '../utils/googleAds';
jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
jest.mock('../utils/googleAds', () => ({ trackGoogleAdsStreamEarlyAccessConversion: jest.fn(() => true) }));
jest.mock('../utils/leadSubmission', () => ({ ...jest.requireActual('../utils/leadSubmission'), postLead: jest.fn() }));
function Workspace() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  return <><button onClick={() => setParams({project:'created'})}>Create project</button>
    <button onClick={() => setParams({view:'dashboards',dashboard:'example'})}>Open dashboard</button><button onClick={() => setParams({filter:'all'})}>Filter events</button>
    <nav aria-label="Workspace navigation">{['events','dashboards','api','mcp','webhooks','settings'].map(view => <button key={view} onClick={() => setParams(view === 'events' ? {} : {view})}>{view}</button>)}</nav>
    <output>{location.pathname}{location.search}{location.hash}</output><h1>{params.get('view') || 'events'}</h1></>;
}
let container, root;
const render = (url='/stream/demo', strict=false) => {
  window.history.replaceState({}, '', url);
  const app=<MemoryRouter initialEntries={[url]}><StreamDemoWrapper><Workspace /></StreamDemoWrapper></MemoryRouter>;
  act(() => root.render(strict ? <StrictMode>{app}</StrictMode> : app));
};
const button = text => [...container.querySelectorAll('button')].find(b => b.textContent===text);
const click = el => act(() => { el.focus(); el.dispatchEvent(new MouseEvent('click',{bubbles:true})); });
const dialog = () => container.querySelector('dialog');
const reopen = () => container.querySelector('[aria-label="Reopen Stream early access invitation"]');
const events = () => posthog.capture.mock.calls.map(([event]) => event);
const type = value => act(() => { const input=container.querySelector('input[type=email]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value); input.dispatchEvent(new Event('input',{bubbles:true})); });
const submit = () => act(async () => { container.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); });
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); jest.clearAllMocks(); postLead.mockReset();
  HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open',''); this.querySelector('input[type=email]')?.focus();};
  HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  container=document.createElement('div'); document.body.append(container); root=createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });
test('initial and direct query load do not invite; project creation is preserved', () => {
  render('/stream/demo?view=dashboards'); expect(dialog()).toBeNull(); expect(container.querySelector('h1').textContent).toBe('dashboards');
  click(button('Create project')); expect(dialog()).toBeNull(); expect(events()).toEqual([]);
});
test('selected default Events pushes history and invites over Events only after navigation, once in Strict Mode', () => {
  render('/stream/demo',true); expect(dialog()).toBeNull(); click(button('events'));
  expect(dialog()).toBeTruthy(); expect(container.querySelector('h1').textContent).toBe('events'); expect(events()).toEqual(['stream_early_access_shown']);
});
test('first different navigation invites over the destination', () => {
  render(); click(button('dashboards')); expect(container.querySelector('h1').textContent).toBe('dashboards'); expect(dialog()).toBeTruthy();
  expect(posthog.capture).toHaveBeenCalledWith('stream_early_access_shown',{source:'stream_demo',view:'dashboards'});
});
test.each(['Dismiss early access invitation','Not now'])('%s dismisses; navigation stays usable; icon manually reopens', label => {
  render(); click(button('events')); click(label==='Not now'?button(label):container.querySelector(`[aria-label="${label}"]`));
  expect(dialog()).toBeNull(); expect(localStorage.getItem(INVITATION_KEY)).toBe('dismissed'); expect(reopen()).toBeTruthy();
  for(const view of ['dashboards','api','mcp','webhooks','settings']) { click(button(view)); expect(dialog()).toBeNull(); expect(container.querySelector('h1').textContent).toBe(view); }
  click(reopen()); expect(dialog()).toBeTruthy(); expect(events()).toEqual(['stream_early_access_shown','stream_early_access_dismissed','stream_early_access_reopened']);
});
test('Escape dismisses with focus restored to the invoking navigation', () => {
  render(); const nav=button('events'); click(nav); act(() => dialog().dispatchEvent(new Event('cancel',{bubbles:true,cancelable:true})));
  expect(dialog()).toBeNull(); expect(document.activeElement).toBe(nav); expect(reopen()).toBeTruthy();
});
test.each(['invited','dismissed','submitted'])('persisted %s does not automatically show on refresh', state => {
  localStorage.setItem(INVITATION_KEY,state); render(); click(button('dashboards')); expect(dialog()).toBeNull(); expect(Boolean(reopen())).toBe(state!=='submitted'); expect(events()).toEqual([]);
});
test('success uses existing Contact payload, never persists email, leaves view intact, converts exactly once', async () => {
  postLead.mockResolvedValue({status:'sent'}); render('/stream/demo?utm_source=ad'); click(button('dashboards')); type('  Engineer@example.test  '); await submit();
  expect(postLead).toHaveBeenCalledTimes(1); expect(postLead.mock.calls[0][0]).toMatchObject({kind:'contact',email:'Engineer@example.test',topic:'Plotune Stream Early Access',message:'Early access request submitted from the Plotune Stream interactive demo.',page:'/stream/demo',website:'',attribution:{source:'stream_demo'}});
  expect(postLead.mock.calls[0][0].submissionId).toBeTruthy(); expect(dialog()).toBeNull(); expect(reopen()).toBeNull(); expect(container.textContent).toContain('You’re on the early access list'); expect(container.querySelector('h1').textContent).toBe('dashboards');
  click(button('api')); expect(trackGoogleAdsStreamEarlyAccessConversion).toHaveBeenCalledTimes(1); expect(events()).toEqual(['stream_early_access_shown','stream_early_access_submitted']);
  expect(localStorage.getItem(INVITATION_KEY)).toBe('submitted'); expect(JSON.stringify(posthog.capture.mock.calls)).not.toContain('Engineer@example.test'); expect(JSON.stringify(localStorage)).not.toContain('Engineer@example.test');
});
test('failure preserves email and retry ID, emits no conversion until confirmed success', async () => {
  postLead.mockResolvedValueOnce({status:'error'}).mockResolvedValueOnce({status:'sent'}); render(); click(button('events')); type('engineer@example.test'); await submit();
  expect(dialog()).toBeTruthy(); expect(container.querySelector('input[type=email]').value).toBe('engineer@example.test'); expect(container.querySelector('[role=alert]')).toBeTruthy(); expect(trackGoogleAdsStreamEarlyAccessConversion).not.toHaveBeenCalled(); expect(events()).not.toContain('stream_early_access_submitted');
  await submit(); expect(postLead.mock.calls[1][0].submissionId).toBe(postLead.mock.calls[0][0].submissionId); expect(trackGoogleAdsStreamEarlyAccessConversion).toHaveBeenCalledTimes(1);
});
test('invalid email and an unconfigured build never claim conversion', async () => {
  render(); click(button('events')); type('invalid'); await submit(); expect(postLead).not.toHaveBeenCalled();
  postLead.mockResolvedValue({status:'not_configured'}); type('engineer@example.test'); await submit(); expect(container.textContent).toContain('Nothing was sent'); expect(trackGoogleAdsStreamEarlyAccessConversion).not.toHaveBeenCalled();
});
test('overlapping submits are locked until the backend responds', async () => {
  let finish; postLead.mockImplementation(() => new Promise(resolve => {finish=resolve;})); render(); click(button('events')); type('engineer@example.test');
  await submit(); await submit(); expect(postLead).toHaveBeenCalledTimes(1); await act(async () => finish({status:'sent'})); expect(trackGoogleAdsStreamEarlyAccessConversion).toHaveBeenCalledTimes(1);
});
test('legacy client redirect preserves query parameters and hash', () => {
  act(() => root.render(<MemoryRouter initialEntries={['/stream/workspace?view=api&project=p&dashboard=d&utm_source=ad#config']}><LegacyStreamDemoRedirect /><Workspace /></MemoryRouter>));
  expect(container.querySelector('output').textContent).toBe('/stream/demo?view=api&project=p&dashboard=d&utm_source=ad#config');
});
test('manual reopen and dismissal are counted once even with overlapping clicks', () => {
 render(); click(button('events')); click(button('Not now')); const icon=reopen();
 act(() => { icon.dispatchEvent(new MouseEvent('click',{bubbles:true})); icon.dispatchEvent(new MouseEvent('click',{bubbles:true})); });
 const dismissButton=button('Not now'); act(() => { dismissButton.dispatchEvent(new MouseEvent('click',{bubbles:true})); dismissButton.dispatchEvent(new MouseEvent('click',{bubbles:true})); });
 expect(events().filter(event=>event==='stream_early_access_reopened')).toHaveLength(1); expect(events().filter(event=>event==='stream_early_access_dismissed')).toHaveLength(2);
});

test('internal dashboard route changes invite, while event filters do not', () => {
 render(); click(button('Filter events')); expect(dialog()).toBeNull(); click(button('Open dashboard')); expect(dialog()).toBeTruthy(); expect(container.querySelector('h1').textContent).toBe('dashboards');
});
