import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiActivity, FiArrowUpRight, FiCpu, FiDownload, FiPackage } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const destinations = [
  {
    title: 'Plotune Nexus',
    description: 'Connect your engineering tools and AI agents to the test bench.',
    action: 'Set up Nexus',
    to: '/docs/nexus/quick-start',
    Icon: FiCpu,
  },
  {
    title: 'Plotune Stream',
    description: 'Capture engineering events and explore their history with your team.',
    action: 'Open workspace',
    to: '/stream/workspace',
    Icon: FiActivity,
  },
  {
    title: 'Plotune Desktop',
    description: 'Get the desktop app for your engineering workflows.',
    action: 'Download app',
    to: '/download',
    Icon: FiDownload,
  },
  {
    title: 'Extensions',
    description: 'Find tools and integrations for Plotune.',
    action: 'Browse extensions',
    to: '/extensions',
    Icon: FiPackage,
  },
];

export default function Dashboard() {
  const { user, token, isLoading } = useContext(AuthContext);
  if (isLoading) return <main className="min-h-[60vh] bg-dark-surface px-5 pt-32" role="status">Loading your account…</main>;
  if (!token) return <Navigate to="/login" replace />;

  return (
    <main className="min-h-screen bg-dark-surface pt-28 pb-16">
      <Helmet>
        <title>Dashboard · Plotune</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="container mx-auto max-w-5xl px-5">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Your Plotune account</p>
            <h1 className="mt-2 text-3xl font-semibold text-light-text">Dashboard</h1>
            <p className="mt-3 text-sm leading-7 text-gray-text">
              {user?.full_name || user?.username ? `Welcome back, ${user.full_name || user.username}. ` : ''}
              Choose a product to get started.
            </p>
          </div>
          <Link to="/profile" className="inline-flex min-h-[44px] items-center rounded-sm border border-ink/20 px-5 text-sm font-medium text-light-text hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Manage account</Link>
        </header>
        <section aria-label="Products and tools" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {destinations.map(({ title, description, action, to, Icon }) => (
            <Link key={to} to={to} className="group flex min-w-0 flex-col rounded-sm border border-ink/20 bg-dark-card p-6 transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              <Icon aria-hidden="true" className="mb-5 h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-light-text">{title}</h2>
              <p className="mt-2 mb-6 text-sm leading-7 text-gray-text">{description}</p>
              <span className="mt-auto inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-primary">{action}<FiArrowUpRight aria-hidden="true" /></span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
