import React, { useState } from 'react';

/** A conceptual request/response path, not a live connection or execution demo. */
export default function EngineeringDiagram({ interactive = false }) {
  const [step, setStep] = useState(0);
  const stages = [
    ['01', 'AI agent', 'Requests a bounded operation', 'MCP'],
    ['02', 'Plotune Nexus', 'Applies access and execution controls', 'Local appliance'],
    ['03', 'Physical test system', 'Interfaces with connected equipment', 'CAN · UART · ROS 2 / DDS'],
  ];
  return <figure className="engineering-diagram">
    <figcaption className="technical-label">Architecture / request → result</figcaption>
    <div className="architecture-path">{stages.map(([number, title, copy, detail], i) => <React.Fragment key={title}>
      {i > 0 && <span className="architecture-arrow" aria-hidden="true">→</span>}
      <div className={`architecture-node ${interactive && step === i + 1 ? 'is-active' : ''}`}>
        <span className="technical-label">{number} / {detail}</span><strong>{title}</strong><p>{copy}</p>
      </div>
    </React.Fragment>)}</div>
    <div className="architecture-return"><span aria-hidden="true">←</span> Structured results &amp; recorded evidence</div>
    {interactive && <div className="architecture-control"><button className="design-button secondary" onClick={() => setStep(s => s >= 4 ? 1 : s + 1)}>{step === 0 ? 'Trace the workflow' : step === 4 ? 'Trace again' : 'Next step'} <span aria-hidden="true">→</span></button><p aria-live="polite">{['Conceptual workflow. No hardware is connected.', 'The agent requests an operation through MCP.', 'Nexus checks access and bounds before execution.', 'The connected interface performs the operation.', 'The agent receives structured results and evidence.'][step]}</p></div>}
  </figure>;
}
