import React from 'react';

// The connection schematic on each product page, drawn from `product.diagram` in the catalog: what
// plugs in on each side, which connector it uses and how many of them, and the link up to the
// browser, Nexus and AI agents. Change the numbers in the catalog and the drawing follows.
const TOP = ['Browser', 'Plotune Nexus', 'AI agent'];
const SPAN = [134, 226]; // y range for ports and labels along the device edge

const spread = (n) => (n === 1 ? [180] : Array.from({ length: n }, (_, i) => SPAN[0] + (i * (SPAN[1] - SPAN[0])) / (n - 1)));

const Port = ({ kind, x, y, side }) => {
  const bx = (w) => (side === 'left' ? x - w : x); // the glyph sits outside the device edge
  if (kind === 'db9') {
    return <path className="bd-port" d={`M${bx(16)} ${y - 9} L${bx(16) + 16} ${y - 11} L${bx(16) + 16} ${y + 11} L${bx(16)} ${y + 9} Z`} />;
  }
  if (kind === 'rj45') {
    return <g><rect className="bd-port" x={bx(15)} y={y - 8} width="15" height="16" rx="1.5" /><rect className="bd-port-in" x={bx(15) + 5} y={y - 8} width="5" height="4" /></g>;
  }
  return <g><rect className="bd-port" x={bx(12)} y={y - 5.5} width="12" height="11" rx="1.5" /><circle className="bd-port-dot" cx={bx(12) + 4} cy={y} r="1.4" /><circle className="bd-port-dot" cx={bx(12) + 8} cy={y} r="1.4" /></g>;
};

const Side = ({ config, side }) => {
  if (!config) return null;
  const left = side === 'left';
  const edge = left ? 170 : 470;
  const nodeYs = spread(config.nodes.length);
  const portYs = spread(config.ports);
  const portW = config.kind === 'db9' ? 16 : config.kind === 'rj45' ? 15 : 12;
  return (
    <g>
      {config.nodes.map((label, i) => {
        const py = portYs[Math.min(i, config.ports - 1)];
        const ny = nodeYs[i];
        const start = left ? 116 : 524;
        const mid = left ? 134 : 506;
        const end = left ? edge - portW - 2 : edge + portW + 2;
        return <g key={`${label}-${i}`}>
          <text x={left ? 108 : 532} y={ny + 4} textAnchor={left ? 'end' : 'start'} className="bd-node-label">{label}</text>
          <path className="bd-line" d={`M${start} ${ny} H${mid} V${py} H${end}`} />
        </g>;
      })}
      {portYs.map((y) => <Port key={y} kind={config.kind} x={edge} y={y} side={side} />)}
      <text x={left ? 0 : 640} y="268" textAnchor={left ? 'start' : 'end'} className="bd-caption">{config.caption}</text>
    </g>
  );
};


// Phone layout: the device is a wide bar, ports run along its bottom edge and labels sit below
// them, so every label stays large enough to read at 360px.
const ports_ = { db9: 16, rj45: 15, terminal: 12 };
const spreadX = (n, [lo, hi]) => (n === 1 ? [(lo + hi) / 2] : Array.from({ length: n }, (_, i) => lo + (i * (hi - lo)) / (n - 1)));

const TallSide = ({ config, range }) => {
  if (!config) return null;
  const len = ports_[config.kind];
  const portXs = spreadX(config.ports, range);
  const nodeXs = spreadX(config.nodes.length, range);
  const centre = (range[0] + range[1]) / 2;
  return (
    <g>
      {config.nodes.map((label, i) => {
        const px = portXs[Math.min(i, config.ports - 1)];
        return <g key={`${label}-${i}`}>
          <path className="bd-line" d={`M${px} ${180 + len + 2} V${204} H${nodeXs[i]} V${212}`} />
          <text x={nodeXs[i]} y="226" textAnchor="middle" className="bd-node-label-t">
            <tspan x={nodeXs[i]} dy="0">{label.slice(0, label.lastIndexOf(' '))}</tspan>
            <tspan x={nodeXs[i]} dy="12">{label.slice(label.lastIndexOf(' ') + 1)}</tspan>
          </text>
        </g>;
      })}
      {portXs.map((x) => <g key={x} transform={`translate(${x} 180) rotate(-90)`}><Port kind={config.kind} x={0} y={0} side="left" /></g>)}
      <text x={centre} y="262" textAnchor="middle" className="bd-caption-t">{config.caption}</text>
    </g>
  );
};

const TallDiagram = ({ product }) => {
  const d = product.diagram;
  const both = Boolean(d.right);
  return (
    <svg className="bd-tall" viewBox="0 0 360 306" role="img" aria-hidden="true">
      {TOP.map((label, i) => {
        const x = 8 + i * 118;
        return <g key={label}>
          <rect x={x} y="6" width="108" height="34" rx="17" className="bd-node bd-node-out" />
          <text x={x + 54} y="28" textAnchor="middle" className="bd-label bd-label-s">{label}</text>
          <path d={`M${x + 54} 40 C${x + 54} 60 180 56 180 76`} className="bd-flow" />
        </g>;
      })}
      <path d="M180 76 V104" className="bd-flow" />
      <text x="194" y="96" className="bd-sub">USB-C · Wi-Fi</text>
      <rect x="8" y="104" width="344" height="76" rx="14" className="bd-device" />
      <text x="180" y="149" textAnchor="middle" className="bd-name">{product.name.toUpperCase()}</text>
      <circle cx="330" cy="122" r="5" className="bd-led" />
      <TallSide config={d.left} range={both ? [20, 166] : [40, 320]} />
      <TallSide config={d.right} range={[194, 340]} />
      <text x="180" y="294" textAnchor="middle" className="bd-caption-t bd-caption-tc">{d.caption}</text>
    </svg>
  );
};

const ProductDiagram = ({ product }) => {
  const d = product.diagram;
  const upper = product.name.toUpperCase();
  const summary = [d.left && `${d.left.nodes.length} ${d.left.caption}`, d.right && `${d.right.nodes.length} ${d.right.caption}`].filter(Boolean).join(' and ');
  return (
    <figure className="bd bd-product">
      <svg className="bd-wide" viewBox="0 0 640 316" role="img" aria-labelledby={`pd-${product.id}-t pd-${product.id}-d`}>
        <title id={`pd-${product.id}-t`}>{product.name} connection diagram</title>
        <desc id={`pd-${product.id}-d`}>{`${product.name} connects your hardware (${summary}) and reaches a browser, Plotune Nexus and AI agents over USB-C or Wi-Fi. ${d.caption}.`}</desc>
        {TOP.map((label, i) => {
          const x = 100 + i * 160;
          return <g key={label}>
            <rect x={x} y="6" width="120" height="34" rx="17" className="bd-node bd-node-out" />
            <text x={x + 60} y="28" textAnchor="middle" className="bd-label bd-label-s">{label}</text>
            <path d={`M${x + 60} 40 C${x + 60} 62 320 56 320 80`} className="bd-flow" />
          </g>;
        })}
        <path d="M320 80 V110" className="bd-flow" />
        <text x="334" y="100" className="bd-sub">USB-C · Wi-Fi</text>
        <rect x="170" y="110" width="300" height="140" rx="14" className="bd-device" />
        <text x="320" y="184" textAnchor="middle" className="bd-name">{upper}</text>
        <circle cx="446" cy="128" r="4.5" className="bd-led" />
        <Side config={d.left} side="left" />
        <Side config={d.right} side="right" />
        <text x="320" y="302" textAnchor="middle" className="bd-caption bd-caption-c">{d.caption}</text>
      </svg>
      <TallDiagram product={product} />
    </figure>
  );
};

export default ProductDiagram;
