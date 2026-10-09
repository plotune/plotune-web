import React from 'react';
import { Link } from 'react-router-dom';

const principles = [
  ['Bounded', 'Agents and scripts act through defined operations with access and execution limits, not open shells on the bench.'],
  ['Local-first', 'Hardware interaction and first-write data stay on your side. Cloud services support routing, identity and export.'],
  ['Evidence', 'A run should leave results, logs and artifacts that an engineer can inspect and a reviewer can approve.'],
];

const Mission = () => {
  return (
    <section id="mission" className="about-mission">
      <div className="design-container">
        <div className="section-index"><span>02 / Mission</span><span>How we build</span></div>
        <div className="about-mission-grid">
          <div>
            <h2>Make physical engineering work inspectable.</h2>
            <p>
              Engineering teams already have the hardware, the scripts and the data. What is usually missing is a
              controlled way to connect them. Plotune builds that connection and keeps the operator in charge of it.
            </p>
          </div>
          <ol className="about-principles">
            {principles.map(([title, copy], i) => (
              <li key={title}>
                <span className="technical-label">{String(i + 1).padStart(2, '0')}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <div className="design-actions">
          <Link to="/contact" className="design-button">Talk to the team <span aria-hidden="true">→</span></Link>
          <Link to="/partners" className="text-link">Partnership →</Link>
        </div>
      </div>
    </section>
  );
};

export default Mission;
