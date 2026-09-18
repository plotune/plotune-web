import React from 'react';

// A numbered step-sequence diagram for MDX articles — reuses the same visual language as the
// Methodology page's protocol-flow (numbered circle + label), generalized to an arbitrary list
// of steps so each article can describe its own acquire/act/gate/release-shaped flow visually
// instead of as a dense paragraph.
const FlowDiagram = ({ title, steps }) => (
  <figure className="flow-diagram">
    {title && <figcaption>{title}</figcaption>}
    <div className="flow-diagram-row">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flow-step">
            <i>{index + 1}</i>
            <span>{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="flow-arrow" aria-hidden="true">
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path d="M1 5H16M16 5L11 1M16 5L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  </figure>
);

export default FlowDiagram;
