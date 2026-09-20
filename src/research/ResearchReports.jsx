import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { publishedResearchArticles } from './content/articles';
import { getTopicVisual } from './content/topicVisuals';

const ALL_TOPICS = 'All';

const ReportThumbnail = ({ topic }) => {
  const { from, to, Icon } = getTopicVisual(topic);
  return (
    <div className="report-visual" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} aria-hidden="true">
      <Icon />
    </div>
  );
};

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

const ResearchReports = () => {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState(ALL_TOPICS);
  const [sortOrder, setSortOrder] = useState('newest');

  // Local sort only — the shared `publishedResearchArticles` array (and its
  // existing consumers, e.g. article prev/next nav) keeps its own order.
  const sortedArticles = useMemo(() => {
    const copy = [...publishedResearchArticles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    return sortOrder === 'oldest' ? copy.reverse() : copy;
  }, [sortOrder]);

  const topics = useMemo(() => {
    const unique = Array.from(new Set(sortedArticles.map((article) => article.topic))).sort((a, b) => a.localeCompare(b));
    return [ALL_TOPICS, ...unique];
  }, [sortedArticles]);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sortedArticles.filter((article) => {
      if (topic !== ALL_TOPICS && article.topic !== topic) return false;
      if (!normalizedQuery) return true;
      return (
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.summary.toLowerCase().includes(normalizedQuery) ||
        article.topic.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [sortedArticles, query, topic]);

  return (
    <section className="research-page reports-page">
      <Seo title="Reports | Plotune Research" description="Monthly reports and reading for Plotune Research." path="/research/reports" />

      <header className="page-heading">
        <span className="section-label">Reports</span>
        <h1>Research reports</h1>
      </header>

      <div className="reports-toolbar">
        <div className="reports-controls">
          <label className="search-control">
            <span aria-hidden="true">Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search reports by title, topic, or summary"
              aria-label="Search reports"
            />
          </label>
          <label className="reports-sort">
            Sort
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Sort reports by date">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
        <div className="reports-tags" role="group" aria-label="Filter by tag">
          {topics.map((option) => (
            <button
              key={option}
              type="button"
              className={`reports-tag${topic === option ? ' active' : ''}`}
              onClick={() => setTopic(option)}
              aria-pressed={topic === option}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <section className="report-library">
        <div className="library-heading">
          <div>
            <span className="section-label">Library</span>
            <h2>Published reports</h2>
          </div>
          <span className="result-count">{filteredArticles.length} {filteredArticles.length === 1 ? 'report' : 'reports'}</span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="comparison-empty reports-empty">
            <span className="empty-mark" aria-hidden="true">?</span>
            <div>
              <strong>No reports match your search.</strong>
              <p>Try a different keyword, or clear the topic filter to see the full library.</p>
            </div>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <Link className="report-row" to={`/research/articles/${article.slug}`} key={article.slug}>
              <ReportThumbnail topic={article.topic} />
              <div className="report-body">
                <span className="report-meta">{article.publishedAt} · {article.readingTime} · {article.topic}</span>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
              </div>
              <span className="report-chevron" aria-hidden="true">
                <ChevronIcon />
              </span>
            </Link>
          ))
        )}
      </section>
    </section>
  );
};

export default ResearchReports;
