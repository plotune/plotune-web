import React, {useId} from 'react';
import diagrams from './diagrams.json';

export default function ChangelogDiagram({id}) {
  const label=useId();
  const diagram=diagrams[id];
  if(!diagram)return null;
  return <figure className="changelog-diagram" aria-labelledby={label}>
    <p id={label} className="changelog-diagram-title">{diagram.title}</p>
    <div className="changelog-diagram-flow">
      <div className="changelog-diagram-source">{diagram.source}</div>
      <span className="changelog-diagram-arrow" aria-hidden="true">→</span>
      <ul>{diagram.branches.map(branch=><li key={branch.title}>
        <strong>{branch.title}</strong><span>{branch.detail}</span><small>{branch.outcome}</small>
      </li>)}</ul>
    </div>
    <figcaption>{diagram.caption}</figcaption>
  </figure>;
}
