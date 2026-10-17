import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiArrowLeft, FiArrowRight, FiArrowUpRight, FiLayers, FiLock, FiSearch, FiShield } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import './WorkspaceEntry.css';

export default function WorkspaceEntry({ loginTo, loading = false, unavailable = false, sharedLink = false }) {
  return <div className="stream-entry">
    <header className="stream-entry-header"><Link to="/" className="stream-entry-brand" aria-label="Plotune home"><img src={logo} alt="" /><span translate="no">Plotune</span><span translate="no">Stream</span></Link><Link to="/stream" className="stream-entry-back"><FiArrowLeft aria-hidden="true" /> About Stream</Link></header>
    <main className="stream-entry-main">
      <section className="stream-entry-story" aria-labelledby="stream-entry-title"><span className="stream-entry-eyebrow">Engineering event workspace</span><h1 id="stream-entry-title">Your events.<br />Your context.<br /><em>Your workspace.</em></h1><p>A place to investigate what happened across your systems, with the details that make it meaningful.</p><div className="stream-entry-features">{[
        [FiActivity, 'Event history', 'Find the moments your systems recorded.'],
        [FiLayers, 'Project context', 'Keep devices, sessions, and event properties together.'],
        [FiSearch, 'A clearer investigation', 'Search and filter your way to the events that matter.'],
      ].map(([Icon, title, text]) => <div key={title}><span><Icon aria-hidden="true" /></span><div><h2>{title}</h2><p>{text}</p></div></div>)}</div><span className="stream-entry-story-note"><i /> Built for the tools and systems you already use.</span></section>
      <section className="stream-entry-card" aria-labelledby="stream-entry-card-title">
        <span className="stream-entry-lock"><FiLock aria-hidden="true" /></span><span className="stream-entry-eyebrow">Plotune Stream / Workspace</span>
        {loading ? <><h2 id="stream-entry-card-title">Getting things ready.</h2><div className="stream-entry-checking" role="status"><span aria-hidden="true" />Checking your session…</div><p>We’re checking whether you’re already signed in.</p></> : unavailable ? <><h2 id="stream-entry-card-title">Explore Stream<br />with sample data.</h2><p>The authenticated workspace is awaiting backend activation. You can explore event history and dashboards in the interactive demo.</p><Link className="stream-entry-primary" to="/stream/demo">Explore the interactive demo <FiArrowUpRight aria-hidden="true" /></Link></> : <><h2 id="stream-entry-card-title">Open your<br />Stream workspace.</h2><p>Sign in with your Plotune account to open your Stream workspace and access your projects.</p>{sharedLink && <div className="stream-entry-shared"><FiShield aria-hidden="true" /><span>Your workspace link is saved. Sign in to continue to the requested view.</span></div>}<Link className="stream-entry-primary" to={loginTo}>Sign in to your workspace <FiArrowRight aria-hidden="true" /></Link><div className="stream-entry-register">New to Plotune? <Link to="/register">Create an account <FiArrowUpRight aria-hidden="true" /></Link></div><div className="stream-entry-divider"><span />Or explore first<span /></div><Link className="stream-entry-demo" to="/stream/demo"><span><strong>Try the interactive demo</strong><small>Sample events · no account needed</small></span><FiArrowUpRight aria-hidden="true" /></Link></>}
        <div className="stream-entry-card-note"><FiShield aria-hidden="true" /><span>{unavailable ? 'Demo data stays in your browser.' : 'Sign-in is required to access your projects.'}</span></div>
      </section>
    </main>
    <footer className="stream-entry-footer"><span><span translate="no">Plotune Stream</span> · Context for engineering systems.</span><div><Link to="/contact">Need a hand?</Link><Link to="/privacy">Privacy</Link></div></footer>
  </div>;
}
