import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import Seo from '../components/Seo';
import {editions} from './catalog';
import ChangelogMedia from './ChangelogMedia';
import './Changelog.css';

export const weekLabel = date=>new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
export default function Changelog() {
  const {slug} = useParams();
  const edition = editions.find(e=>e.slug === slug);
  const [Content,setContent] = useState(null), [error,setError] = useState(false), [attempt,setAttempt] = useState(0);
  useEffect(()=>{
    let active = true; setContent(null);setError(false);
    if (edition) edition.load().then(m=>{if(active)setContent(()=>m.default);}).catch(()=>{if(active)setError(true);});
    return ()=>{active=false;};
  },[edition,attempt]);
  const title = slug ? edition?.title || 'Edition not found' : 'What’s new';
  return <main className="changelog-page design-container">
    <Seo title={`${title} | Plotune`} description={edition?.summary || 'Weekly updates from Plotune Nexus and Stream. Explore product improvements, fixes and clearly marked previews.'} path={edition ? `/changelog/${slug}` : '/changelog'} />
    <Helmet><link rel="alternate" type="application/rss+xml" title="Plotune product updates" href="https://www.plotune.net/changelog/rss.xml" />{slug && !edition && <meta name="robots" content="noindex" />}</Helmet>
    {slug && <Link className="text-link" to="/changelog">← All updates</Link>}
    <header className="changelog-head"><p className="technical-label">Plotune / Product updates</p><h1>{title}</h1><p>{edition ? edition.summary : 'The latest improvements to Nexus and Stream, with practical walkthroughs and a look at what’s coming next.'}</p>{edition ? <time dateTime={edition.publishedAt}>Published {weekLabel(edition.publishedAt)} · Week of {weekLabel(edition.weekStart)}</time> : <a className="text-link" href="/changelog/rss.xml">Subscribe with RSS ↗</a>}</header>
    {!slug && (editions.length ? <ol className="changelog-index">{editions.map(e=><li key={e.slug}><time dateTime={e.weekStart}>Week of {weekLabel(e.weekStart)}</time><div><p className="technical-label">{e.products.join(' / ')}</p><h2><Link to={`/changelog/${e.slug}`}>{e.title}</Link></h2><p>{e.summary}</p><Link className="text-link" to={`/changelog/${e.slug}`}>Read this week’s update →</Link></div></li>)}</ol> : <section className="changelog-empty"><h2>Our first weekly update is on its way.</h2><p>This is where we’ll share useful changes, fixes and previews. Published editions will appear here after review.</p><Link className="text-link" to="/nexus">Explore Nexus →</Link><Link className="text-link" to="/stream">Explore Stream →</Link></section>)}
    {slug && !edition && <section className="changelog-empty"><h2>We couldn’t find that edition.</h2><p>It may not have been published yet. Browse the available weekly updates instead.</p></section>}
    {edition && <><article className="changelog-article">{Content ? <Content /> : error ? <div role="alert"><p>We couldn’t load this edition.</p><button className="design-button secondary" onClick={()=>setAttempt(a=>a+1)}>Retry</button></div> : <p role="status">Loading update…</p>}{Content && edition.media.map(m=><ChangelogMedia key={m.id} media={m} />)}</article><nav className="changelog-edition-nav" aria-label="Weekly editions">{editions[editions.indexOf(edition)+1] && <Link className="text-link" to={`/changelog/${editions[editions.indexOf(edition)+1].slug}`}>← Previous edition</Link>}{editions[editions.indexOf(edition)-1] && <Link className="text-link" to={`/changelog/${editions[editions.indexOf(edition)-1].slug}`}>Next edition →</Link>}</nav></>}
  </main>;
}
