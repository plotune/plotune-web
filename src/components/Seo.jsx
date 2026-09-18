import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE = 'https://www.plotune.net';
const DEFAULT_TITLE = 'Plotune: DataOps Platform & AI-Ready Test Systems';

/**
 * Per-route metadata. Owns the tags that vary by page (title, description,
 * canonical, og:title/description/url, twitter:title/description). The global,
 * non-varying tags (og:image, og:site_name, twitter:card, etc.) stay static in
 * public/index.html so they are not duplicated.
 */
const Seo = ({ title, description, path = '/', tag }) => {
  const url = `${SITE}${path}`;
  const pageTitle = title || DEFAULT_TITLE;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />

      <meta property="og:title" content={pageTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />

      <meta name="twitter:title" content={pageTitle} />
      {description && <meta name="twitter:description" content={description} />}

      {/* A page-level analytics tag (e.g. "can", "ros") for traffic-source tools that read
          meta tags — Cloudflare Zaraz's "Read from HTML" variable type, for one. */}
      {tag && <meta name="plotune:tag" content={tag} />}
    </Helmet>
  );
};

export default Seo;
