import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CountryField from './CountryField';

global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root; let latest;
const Harness = () => {
  const [value, setValue] = useState('');
  latest = value;
  return <form><CountryField id="c" value={value} onChange={setValue} /><button type="submit">Send</button></form>;
};
beforeEach(() => {
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  act(() => root.render(<Harness />));
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

const input = () => container.querySelector('#c');
const options = () => [...container.querySelectorAll('[role="option"]')].map((o) => o.textContent);
const type = (v) => act(() => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input(), v);
  input().dispatchEvent(new Event('input', { bubbles: true }));
});
const key = (k) => act(() => { input().dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })); });
const focus = () => act(() => { input().focus(); });
const blur = () => act(() => { input().blur(); });

test('focusing shows a few suggestions right away', () => {
  focus();
  expect(input().getAttribute('aria-expanded')).toBe('true');
  expect(options().length).toBeGreaterThan(0);
  expect(options().length).toBeLessThanOrEqual(6);
});

test('typing filters; Enter picks the top match without submitting the form', () => {
  const onSubmit = jest.fn((e) => e.preventDefault());
  container.querySelector('form').addEventListener('submit', onSubmit);
  focus(); type('uk');
  expect(options()[0]).toBe('United Kingdom');
  expect(input().getAttribute('aria-activedescendant')).toBe('c-suggestions-0');
  key('Enter');
  expect(latest).toBe('United Kingdom');
  expect(onSubmit).not.toHaveBeenCalled();
  expect(input().getAttribute('aria-expanded')).toBe('false');
});

test('arrow keys move through the suggestions and Escape closes them', () => {
  focus(); type('un');
  const [first, second] = options(); // order depends on the browser language (its country comes first)
  expect([first, second].sort()).toEqual(['United Kingdom', 'United States']);
  key('ArrowDown');
  key('Enter');
  expect(latest).toBe(second);
  focus(); key('Escape');
  expect(input().getAttribute('aria-expanded')).toBe('false');
});

test('tapping a suggestion picks it', () => {
  focus(); type('ger');
  const option = container.querySelector('[role="option"]');
  act(() => { option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true })); });
  expect(latest).toBe('Germany');
});

test('leaving the field snaps an alias or a single match to the proper name, and leaves nonsense alone', () => {
  focus(); type('turkey'); blur();
  expect(latest).toBe('Türkiye');
  focus(); type('luxem'); blur();
  expect(latest).toBe('Luxembourg');
  focus(); type('Recep200789'); blur();
  expect(latest).toBe('Recep200789');
});
