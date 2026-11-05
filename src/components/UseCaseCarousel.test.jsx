import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import UseCaseCarousel from './UseCaseCarousel';
import { USE_CASES } from '../content/useCases';

global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
const mount = (ui) => act(() => root.render(<MemoryRouter>{ui}</MemoryRouter>));
beforeEach(() => {
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  HTMLElement.prototype.scrollTo = jest.fn();
  HTMLElement.prototype.scrollBy = jest.fn();
  // jsdom has no layout: give each card a position so the strip can tell which group is in view
  Object.defineProperty(HTMLElement.prototype, 'offsetLeft', { configurable: true, get() { return this.parentElement ? [...this.parentElement.children].indexOf(this) * 400 : 0; } });
});
afterEach(() => {
  act(() => root.unmount()); container.remove();
  delete HTMLElement.prototype.scrollTo; delete HTMLElement.prototype.scrollBy;
  delete HTMLElement.prototype.scrollWidth; delete HTMLElement.prototype.clientWidth; delete HTMLElement.prototype.offsetLeft;
});

const all = USE_CASES.filter((u) => u.group !== 'Bridge' || u.home);

test('a mixed strip shows one chip per group and every card is a link with an inert illustration', () => {
  mount(<UseCaseCarousel items={all} label="Plotune use cases" />);
  const chips = [...container.querySelectorAll('.lx-chips button')].map((b) => b.textContent);
  expect(chips).toEqual(['Nexus', 'Bridge', 'Stream']);
  const cards = container.querySelectorAll('a.lx-ucard');
  expect(cards).toHaveLength(12);
  cards.forEach((card) => {
    expect(card.querySelector('.lx-art').getAttribute('aria-hidden')).toBe('true');
    expect(card.querySelector('.lx-art svg, .lx-art img[alt=""]')).not.toBeNull();
    expect(card.querySelector('h3').textContent.length).toBeGreaterThan(3);
  });
  expect(container.querySelector('[role="region"]').getAttribute('aria-label')).toBe('Plotune use cases');
});

test('a strip never mixes photographs and drawings', () => {
  const withPhotos = all.filter((u) => u.photo).slice(0, 3);
  mount(<UseCaseCarousel items={withPhotos} />);
  expect(container.querySelectorAll('.lx-photo img')).toHaveLength(3);
  mount(<UseCaseCarousel items={[...withPhotos, { ...withPhotos[0], title: 'No photo here', photo: undefined }]} />);
  expect(container.querySelectorAll('.lx-photo')).toHaveLength(0);
  expect(container.querySelectorAll('.lx-art svg')).toHaveLength(4);
});

test('the first group chip starts pressed and a chip jumps to the first card of its group', () => {
  mount(<UseCaseCarousel items={all} />);
  const chips = [...container.querySelectorAll('.lx-chips button')];
  expect(chips[0].getAttribute('aria-pressed')).toBe('true');
  act(() => { chips[2].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledTimes(1);
});

test('arrows stay hidden while nothing scrolls, and appear with Previous disabled when the strip overflows', () => {
  mount(<UseCaseCarousel items={all} />);
  expect(container.querySelector('.lx-arrows')).toBeNull();
  act(() => root.unmount());
  root = createRoot(container);
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, get: () => 2400 });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 900 });
  mount(<UseCaseCarousel items={all} />);
  const prev = container.querySelector('[aria-label="Previous use cases"]');
  const next = container.querySelector('[aria-label="Next use cases"]');
  expect(prev.disabled).toBe(true);
  expect(next.disabled).toBe(false);
  act(() => { next.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  expect(HTMLElement.prototype.scrollBy).toHaveBeenCalledTimes(1);
});

test('arrow keys on the strip scroll it', () => {
  mount(<UseCaseCarousel items={all} />);
  const strip = container.querySelector('.lx-car');
  act(() => { strip.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })); });
  expect(HTMLElement.prototype.scrollBy).toHaveBeenCalledTimes(1);
});

test('grid layout is a plain region with no chips or arrows, and records its card count', () => {
  mount(<UseCaseCarousel items={USE_CASES.filter((u) => u.model === 'can')} label="Bridge CAN use cases" layout="grid" />);
  const grid = container.querySelector('.lx-ugrid');
  expect(grid.getAttribute('data-n')).toBe('3');
  expect(grid.getAttribute('aria-label')).toBe('Bridge CAN use cases');
  expect(container.querySelector('.lx-chips')).toBeNull();
  expect(container.querySelector('.lx-arrows')).toBeNull();
  expect(container.querySelectorAll('a.lx-ucard')).toHaveLength(3);
});

test('clicking a card reports it', () => {
  const seen = [];
  mount(<UseCaseCarousel items={all} onCardClick={(u) => seen.push(u.title)} />);
  act(() => { container.querySelector('a.lx-ucard').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); });
  expect(seen).toEqual([all[0].title]);
});
