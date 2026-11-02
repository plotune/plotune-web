import React from 'react';
import { ICONS } from './BridgeIcon';

// The family in one picture: what plugs into a Bridge, how it reaches you, and what uses it.
// Two drawings of the same diagram (wide for desktop, tall for phones; CSS shows one), so the
// labels stay readable at every width instead of shrinking.
const SOURCES = ['CAN bus', 'Serial devices', 'Analog signals', 'Digital I/O'];
const DESTINATIONS = [['Browser', 'browser'], ['Plotune Nexus', 'modules'], ['AI agent', 'ai']];

const Icon = ({ name, x, y, s = 22 }) => (
  <g className="bd-icon" transform={`translate(${x} ${y}) scale(${s / 24})`} fill="none" stroke="currentColor" strokeWidth={1.5 * 24 / s} strokeLinecap="round" strokeLinejoin="round">
    <path d={ICONS[name]} />
  </g>
);

const SystemDiagram = () => (
  <figure className="bd">
    <svg className="bd-wide" viewBox="0 0 760 310" role="img" aria-labelledby="sd-title sd-desc">
      <title id="sd-title">How Plotune Bridge connects</title>
      <desc id="sd-desc">CAN buses, serial devices, analog signals and digital I/O plug into a Plotune Bridge. It connects over USB-C or Wi-Fi to a browser, to Plotune Nexus and to AI agents.</desc>
      {SOURCES.map((label, i) => {
        const y = 14 + i * 74;
        return <g key={label}>
          <rect x="0" y={y} width="170" height="56" rx="8" className="bd-node" />
          <text x="20" y={y + 33} className="bd-label">{label}</text>
          <path d={`M170 ${y + 28} H250`} className="bd-line" />
          <circle cx="250" cy={y + 28} r="3.5" className="bd-dot" />
        </g>;
      })}
      <rect x="250" y="14" width="180" height="282" rx="16" className="bd-device" />
      <text x="340" y="150" textAnchor="middle" className="bd-name">PLOTUNE</text>
      <text x="340" y="176" textAnchor="middle" className="bd-name">BRIDGE</text>
      <circle cx="340" cy="204" r="5" className="bd-led" />
      <path d="M430 155 H520" className="bd-flow" />
      <text x="475" y="136" textAnchor="middle" className="bd-sub">USB-C</text>
      <text x="475" y="180" textAnchor="middle" className="bd-sub">Wi-Fi</text>
      {DESTINATIONS.map(([label, icon], i) => {
        const cy = 68 + i * 92;
        return <g key={label}>
          <path d={`M520 155 C540 155 540 ${cy} 560 ${cy}`} className="bd-flow" />
          <rect x="560" y={cy - 28} width="200" height="56" rx="8" className="bd-node bd-node-out" />
          <Icon name={icon} x={578} y={cy - 11} />
          <text x="612" y={cy + 5} className="bd-label">{label}</text>
        </g>;
      })}
    </svg>

    <svg className="bd-tall" viewBox="0 0 360 380" role="img" aria-hidden="true">
      {SOURCES.map((label, i) => {
        const x = 8 + i * 88;
        return <g key={label}>
          <rect x={x} y="6" width="80" height="54" rx="8" className="bd-node" />
          {label.split(' ').map((word, j, all) => <text key={word} x={x + 40} y={33 + (j - (all.length - 1) / 2) * 14} textAnchor="middle" className="bd-label bd-label-s">{word}</text>)}
          <path d={`M${x + 40} 60 V104`} className="bd-line" />
        </g>;
      })}
      <rect x="8" y="104" width="344" height="76" rx="14" className="bd-device" />
      <text x="180" y="150" textAnchor="middle" className="bd-name">PLOTUNE BRIDGE</text>
      <circle cx="328" cy="124" r="5" className="bd-led" />
      <path d="M180 180 V252" className="bd-flow" />
      <text x="196" y="204" className="bd-sub">USB-C</text>
      <text x="196" y="228" className="bd-sub">Wi-Fi</text>
      {DESTINATIONS.map(([label, icon], i) => {
        const x = 8 + i * 118;
        return <g key={label}>
          <path d={`M180 252 C180 266 ${x + 54} 262 ${x + 54} 286`} className="bd-flow" />
          <rect x={x} y="286" width="108" height="84" rx="8" className="bd-node bd-node-out" />
          <Icon name={icon} x={x + 41} y={300} />
          <text x={x + 54} y="352" textAnchor="middle" className="bd-label bd-label-s">{label}</text>
        </g>;
      })}
    </svg>
  </figure>
);

export default SystemDiagram;
