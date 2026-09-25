import React from 'react';

// A visible callout for a stated limitation, qualification-pending claim, or open
// engineering decision, rendered rather than hidden, since the internal source docs treat
// this kind of honesty as a feature. See NexusDocs.css for .nexus-doc-note styling.
export const Note = ({ children }) => (
  <div className="nexus-doc-note">
    <p>{children}</p>
  </div>
);

export const DocMeta = ({ doc }) => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-text" aria-label="Document metadata">
    <span>{doc.topic}</span>
    <span aria-hidden="true">&middot;</span>
    <span>{doc.readingTime}</span>
    <span aria-hidden="true">&middot;</span>
    <span>Updated {doc.updatedAt}</span>
  </div>
);
