import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ProductDiagram from './ProductDiagram';
import SystemDiagram from './SystemDiagram';
import { PRODUCTS } from '../../content/bridgeCatalog';

// Count the glyphs and labels in the wide drawing only (the phone drawing repeats them).
const wide = (markup) => markup.slice(markup.indexOf('class="bd-wide"'), markup.indexOf('class="bd-tall"'));
const count = (markup, cls) => (markup.match(new RegExp(`class="${cls}"`, 'g')) || []).length;

test('each product schematic draws the connectors and signals the catalog describes', () => {
  const expected = { can: { ports: 1, labels: 2 }, serial: { ports: 2, labels: 2 }, daq: { ports: 7, labels: 7 }, io: { ports: 12, labels: 12 } };
  PRODUCTS.forEach((product) => {
    const w = wide(renderToStaticMarkup(<ProductDiagram product={product} />));
    expect(count(w, 'bd-port')).toBe(expected[product.id].ports);
    expect(count(w, 'bd-node-label')).toBe(expected[product.id].labels);
    expect(w).toContain(product.name.toUpperCase());
    expect(w).toContain('Plotune Nexus');
  });
});

test('schematics are accessible: one labelled image, the phone copy hidden from assistive tech', () => {
  PRODUCTS.forEach((product) => {
    const markup = renderToStaticMarkup(<ProductDiagram product={product} />);
    expect(markup).toContain(`<title id="pd-${product.id}-t">${product.name} connection diagram</title>`);
    expect(markup).toMatch(/class="bd-tall"[^>]*aria-hidden="true"/);
  });
});

test('the family diagram shows what plugs in and what uses it', () => {
  const markup = renderToStaticMarkup(<SystemDiagram />);
  ['CAN bus', 'Serial devices', 'Analog signals', 'Digital I/O', 'USB-C', 'Wi-Fi', 'Browser', 'Plotune Nexus', 'AI agent'].forEach((label) => expect(markup).toContain(label));
});
