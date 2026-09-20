import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Research.css';

const RssIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="18" r="2" /><path d="M4 10a10 10 0 0 1 10 10M4 4a16 16 0 0 1 16 16" /></svg>;

const ResearchLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [rssOpen, setRssOpen] = useState(false);
  const [copyState, setCopyState] = useState('idle'); // idle | copied | failed
  const location = useLocation();
  const nav = [['/research', 'Overview'], ['/research/reports', 'Reports'], ['/research/methodology', 'Methodology']];
  const rssUrl = `${window.location.origin}/research/rss.xml`;
  const copyFeed = async () => {
    if (!navigator.clipboard) { setCopyState('failed'); return; }
    try {
      await navigator.clipboard.writeText(rssUrl);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    window.setTimeout(() => setCopyState('idle'), 2400);
  };
  return <div className="research-site"><header className="research-header"><Link className="research-brand" to="/research" aria-label="Plotune Research home"><span>Plotune</span><strong>Research</strong></Link><button className="research-menu" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button><nav className={open ? 'is-open' : ''}>{nav.map(([to, label]) => <Link key={to} to={to} className={location.pathname === to ? 'active' : ''} onClick={() => setOpen(false)}>{label}</Link>)}<div className="rss-control"><button className="rss-button" onClick={() => setRssOpen(!rssOpen)} aria-label="RSS options" aria-expanded={rssOpen}><RssIcon /></button>{rssOpen && <div className="rss-popover"><strong>Follow this research</strong><a href={`https://feedly.com/i/subscription/feed/${encodeURIComponent(rssUrl)}`} target="_blank" rel="noreferrer">Open in Feedly</a><button onClick={copyFeed}>{copyState === 'copied' ? 'Feed link copied' : copyState === 'failed' ? 'Copy unavailable — select the link below' : 'Copy feed link'}</button>{copyState === 'failed' && <input readOnly value={rssUrl} onFocus={(e) => e.target.select()} aria-label="RSS feed link" />}</div>}</div><a className="research-brand-home" href="https://www.plotune.net/" onClick={() => setOpen(false)}>Plotune.net</a><Link className="research-login" to="/login" onClick={() => setOpen(false)}>Log in</Link><Link className="research-register" to="/register" onClick={() => setOpen(false)}>Register</Link></nav></header><main>{children}</main><footer className="research-footer"><span>(c) {new Date().getFullYear()} Plotune Research</span><a href="/research/rss.xml">RSS feed</a></footer></div>;
};

export default ResearchLayout;
