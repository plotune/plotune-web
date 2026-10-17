import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiCheck, FiCpu, FiLayers, FiTerminal } from 'react-icons/fi';
import './StreamHeroVisual.css';

const sources = [
  {
    id: 'python', name: 'Python', description: 'Scripts & tools', Icon: FiTerminal,
    event: 'motor.sample', device: 'motor-003', session: 'test-run-817',
    readings: [{ label: 'Temperature', value: '72.4', unit: '°C' }, { label: 'Speed', value: '1,840', unit: 'rpm' }, { label: 'State', value: 'Running', state: true }],
  },
  {
    id: 'bench', name: 'Test bench', description: 'Test systems', Icon: FiCpu,
    event: 'test.completed', device: 'ecu-012', session: 'validation-042',
    readings: [{ label: 'Checks', value: '18/18' }, { label: 'Duration', value: '842', unit: 'ms' }, { label: 'Verdict', value: 'Passed', state: true }],
  },
  {
    id: 'nexus', name: 'Nexus', description: 'Connected hardware', Icon: FiLayers,
    event: 'device.connected', device: 'nexus-01', session: 'bench-session-09',
    readings: [{ label: 'Interface', value: 'CAN FD' }, { label: 'Channel', value: 'can0' }, { label: 'State', value: 'Connected', state: true }],
  },
];
const paths = [
  'M70 0v18q0 10 10 10h130q10 0 10 10v18',
  'M220 0v56',
  'M370 0v18q0 10-10 10H230q-10 0-10 10v18',
];

export default function StreamHeroVisual() {
  const [selected, setSelected] = useState('python');
  const reduced = useReducedMotion();
  const source = sources.find(item => item.id === selected);
  const Icon = source.Icon;

  return <figure className="shv" aria-labelledby="shv-caption">
    <div className="shv-top"><span>Choose a source</span><span>Follow its event</span></div>
    <div className="shv-sources" role="group" aria-label="Explore event sources">
      {sources.map(item => <button type="button" key={item.id} aria-pressed={selected === item.id} aria-controls="shv-event-detail" onClick={() => setSelected(item.id)}>
        <item.Icon aria-hidden="true" /><b>{item.name}</b><small>{item.description}</small>{selected === item.id && <FiCheck className="shv-source-check" aria-hidden="true" />}
      </button>)}
    </div>
    <svg className="shv-join" viewBox="0 0 440 56" preserveAspectRatio="none" fill="none" aria-hidden="true">
      {paths.map((path, index) => <path key={index} d={path} stroke="#b4c4ab" />)}
      <path className="shv-active-path" key={selected} d={paths[sources.indexOf(source)]} pathLength="1" stroke="#00725a" strokeWidth="1.8" />
    </svg>
    <div className="shv-hub"><span className="shv-hub-icon"><FiLayers aria-hidden="true" /></span><div><strong translate="no">Plotune Stream</strong><small>Events, with their context.</small></div><span className="shv-http">HTTP</span></div>
    <div className="shv-trunk" aria-hidden="true"><i key={selected} /></div>
    <div className="shv-history">
      <div className="shv-history-top"><span>Event history</span><span>Device · session · properties</span></div>
      <motion.div key={selected} id="shv-event-detail" initial={reduced ? false : { opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.35 }}>
        <div className="shv-record"><span className="shv-event-mark"><Icon aria-hidden="true" /></span><div><small>{source.device} / {source.session}</small><strong>{source.event}</strong></div></div>
        <dl className="shv-readings">{source.readings.map(reading => <div key={reading.label}><dt>{reading.label}</dt><dd className={reading.state ? 'shv-state' : ''}>{reading.value}{reading.unit && <span>{reading.unit}</span>}</dd></div>)}</dl>
      </motion.div>
      <div className="shv-history-stack">{sources.filter(item => item.id !== selected).map(item => <span key={item.id}><item.Icon aria-hidden="true" />{item.event}</span>)}</div>
    </div>
    <div className="shv-status" role="status" aria-live="polite" aria-atomic="true">{source.name}: {source.event}, from {source.device}, session {source.session}.</div>
    <figcaption id="shv-caption">Different systems. One place to understand them.</figcaption>
  </figure>;
}
