import React from 'react';

export const Insight = ({ eyebrow, title, children }) => (
  <aside className="research-insight">
    <span>{eyebrow}</span>
    <h2>{title}</h2>
    <div>{children}</div>
  </aside>
);

export const StudyMeta = ({ article }) => (
  <div className="research-meta" aria-label="Study metadata">
    <span>{article.topic}</span>
    <span>{article.readingTime}</span>
    <span>Published {article.publishedAt}</span>
  </div>
);
