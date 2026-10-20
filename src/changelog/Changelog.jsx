import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import Seo from '../components/Seo';
import {editions} from './catalog';
import ChangelogMedia from './ChangelogMedia';
import './Changelog.css';

export const weekLabel = date=>new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const headingId = text=>String(text).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export default function Changelog() {
  const {slug} = useParams();
  const edition = slug ? editions.find(e=>e.slug === slug) : editions[0];
  const [Content,setContent] = useState(null), [error,setError] = useState(false), [attempt,setAttempt] = useState(0);
  useEffect(()=>{
    let active = true; setContent(null);setError(false);
    if (edition) Promise.resolve().then(()=>edition.load()).then(m=>{if(active)setContent(()=>m.default);}).catch(()=>{if(active)setError(true);});
    return ()=>{active=false;};
  },[edition,attempt]);
  const components = {
    h2:({children,...props})=><h2 id={headingId(children)} {...props}>{children}</h2>,
    p:({children,...props})=>{
      const match=typeof children==='string' && /^:::media ([a-z0-9-]+)$/.exec(children);
      const media=match && edition?.media.find(m=>m.id===match[1]);
      return media ? <ChangelogMedia media={media}/> : <p {...props}>{children}</p>;
    },
  };
  const title = edition?.title || (slug ? 'Edition not found' : 'Changelog');
  return <main className="changelog-page design-container">
    <Seo title={`${title} | Plotune`} description={edition?.summary || 'Technical release notes for Plotune Nexus, Cloud and Stream.'} path={slug && edition ? `/changelog/${slug}` : '/changelog'} />
    <Helmet><link rel="alternate" type="application/rss+xml" title="Plotune product updates" href="https://www.plotune.net/changelog/rss.xml" />{slug && !edition && <meta name="robots" content="noindex" />}</Helmet>
    <div className="changelog-layout">
      <aside className="changelog-sidebar"><Link className="changelog-brand" to="/changelog">Changelog</Link><nav aria-label="Weekly editions">{editions.map(e=><Link key={e.slug} to={`/changelog/${e.slug}`} aria-current={e===edition?'page':undefined}>Week of {weekLabel(e.weekStart)}<span>{e.products.join(' / ')}</span></Link>)}</nav><a href="/changelog/rss.xml">RSS feed ↗</a></aside>
      <div className="changelog-main">
        <header className="changelog-head"><h1>{title}</h1>{edition && <><time dateTime={edition.publishedAt}>Published {weekLabel(edition.publishedAt)} · Week of {weekLabel(edition.weekStart)}</time><p>{edition.summary}</p></>}</header>
        {edition ? <article className="changelog-article">{Content ? <Content components={components}/> : error ? <div role="alert"><p>We couldn’t load this edition.</p><button className="design-button secondary" onClick={()=>setAttempt(a=>a+1)}>Retry</button></div> : <p role="status">Loading update…</p>}</article> : <section className="changelog-empty"><h2>{slug ? 'We couldn’t find that edition.' : 'Our first weekly update is on its way.'}</h2><p>Published technical updates will appear here after review.</p><Link to="/changelog">Browse updates →</Link></section>}
      </div>
      {edition && <nav className="changelog-contents" aria-label="On this page"><strong>In this update</strong>{(edition.sections||[]).map(s=><a key={s.id} href={`#${s.id}`}>{s.title}</a>)}</nav>}
    </div>
  </main>;
}
