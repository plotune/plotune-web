import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { FiArrowRight } from 'react-icons/fi';
import Seo from '../components/Seo';
import { getNexusDoc, nexusDocs } from '../content/nexusDocs';
import { Note, DocMeta } from '../nexusdocs/NexusDocBlocks';
import { captureFunnelTouch, withFunnelParams } from '../utils/funnel';
import '../nexusdocs/NexusDocs.css';

const components = { Note };

const NexusDocPage = () => {
  const { slug } = useParams();
  const doc = getNexusDoc(slug);
  const [Content, setContent] = useState(null);

  useEffect(() => {
    if (doc) doc.loader().then((module) => setContent(() => module.default));
  }, [doc]);

  useEffect(() => {
    if (doc) captureFunnelTouch({ article: doc.slug });
  }, [doc]);

  if (!doc) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-dark-bg px-5 py-20 text-center text-dark-text">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Docs</p>
        <h1 className="mt-4 text-3xl font-semibold text-light-text">We couldn&apos;t find that document.</h1>
        <Link to="/docs/nexus" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark">
          Back to Nexus docs
        </Link>
      </main>
    );
  }

  const otherDocs = nexusDocs.filter((d) => d.slug !== doc.slug);

  return (
    <main className="overflow-hidden bg-dark-bg text-dark-text">
      <Seo title={`${doc.title} | Plotune Nexus Docs`} description={doc.summary} path={`/docs/nexus/${doc.slug}`} />
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(38,166,154,0.16),transparent_40%),linear-gradient(180deg,#101112_0%,#121212_100%)]" />
        <div className="relative container mx-auto max-w-3xl px-5">
          <Link to="/docs/nexus" className="text-sm text-gray-text transition-colors hover:text-primary">
            &larr; Nexus documentation
          </Link>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.28em] text-primary">{doc.topic}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-light-text md:text-5xl">{doc.title}</h1>
          <p className="mt-6 text-lg leading-8 text-gray-text">{doc.summary}</p>
          <div className="mt-6">
            <DocMeta doc={doc} />
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto max-w-3xl px-5">
          <div className="nexus-doc-body">
            {Content ? (
              <MDXProvider components={components}>
                <Content />
              </MDXProvider>
            ) : (
              <p className="text-gray-text">Loading document&hellip;</p>
            )}
          </div>
        </div>
      </section>

      {doc.cta && (
        <section className="pb-16">
          <div className="container mx-auto max-w-3xl px-5">
            <div className="rounded-[2rem] bg-[linear-gradient(145deg,rgba(38,166,154,0.16),rgba(63,81,181,0.08))] p-8 shadow-custom">
              <p className="text-gray-text">{doc.cta.summary}</p>
              <Link
                to={withFunnelParams(doc.cta.path, { article: doc.slug })}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"
              >
                {doc.cta.label}
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="pb-24">
        <div className="container mx-auto max-w-3xl px-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-text">More Nexus documentation</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {otherDocs.map((other) => (
              <Link
                key={other.slug}
                to={`/docs/nexus/${other.slug}`}
                className="group rounded-2xl border border-white/10 bg-dark-card/60 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-dark-card/90"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{other.topic}</p>
                <p className="mt-2 font-semibold text-light-text group-hover:text-primary">{other.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NexusDocPage;
