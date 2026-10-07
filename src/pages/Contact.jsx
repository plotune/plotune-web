import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowRight, FiClock, FiMapPin } from 'react-icons/fi';
import Seo from '../components/Seo';
import ContactForm from '../components/ContactForm';
import { getSolutionSegment } from '../content/solutions';
import { posthog } from '../posthog';
import { getFunnelContext, withFunnelParams } from '../utils/funnel';

const nextSteps = [
  ['You tell us about your setup', 'What you’re testing, what’s already on your bench, and where the manual work is.'],
  ['We map it to Plotune Nexus', 'Which interfaces apply, what a first bounded workflow looks like on your equipment.'],
  ['You get a straight answer', 'Whether it fits, and what setting it up on your bench would actually take.'],
];

// The embedded Zammad ticket widget (support.plotune.net) is down and its
// script load hung this page on "Loading the support form..." indefinitely
// for every visitor. Removed in favor of a direct, always-working mailto
// until Zammad is redeployed. To restore it, see git history on this file
// (the widget's <script> loader, jQuery.fn.ZammadForm init, and its custom
// CSS block) from before this change.
// contact@ is the funnel-facing address for new inquiries; support@ is reserved
// for existing customers' issues and isn't the right destination for this page.
const CONTACT_EMAIL = 'contact@plotune.net';

// Builds a pre-filled mailto so a visitor arriving from a research article or
// solution page doesn't have to re-explain what they're reaching out about;
// the subject/body already name the workflow they were just reading about.
// Falls back to a plain, undirected inquiry when there's no funnel context.
const useContactContext = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const solutionSlug = params.get('solution') || params.get('segment');
  const solution = solutionSlug && getSolutionSegment(solutionSlug);

  const subject = solution ? `Inquiry: ${solution.label}` : 'Inquiry: Plotune Nexus';
  const body = solution
    ? `Hi Plotune team,\n\nI was reading about ${solution.label} and wanted to talk through how it would fit our setup.\n\n`
    : `Hi Plotune team,\n\nI wanted to talk through how Plotune Nexus would fit our setup.\n\n`;

  return {
    topic: solution ? solution.label : null,
    mailto: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
};

const otherChannels = [
  {
    icon: FiMapPin,
    title: 'Aydınlı Mah., 34485 Tuzla/İstanbul',
    subtitle: 'Mon - Fri: 9AM - 6PM',
    link: 'https://maps.google.com/?q=Ayd%C4%B1nl%C4%B1+Mahallesi,+34485+Tuzla+%C4%B0stanbul',
  },
  {
    icon: 'discord',
    title: 'Discord',
    subtitle: 'Join our Discord server',
    link: 'https://discord.gg/plotune',
  },
];

const ContactPage = () => {
  const { topic, mailto } = useContactContext();

  // Layout (mobile first): short intro -> form -> "what happens next" -> two quiet text links.
  // On large screens the form sits in the right column; intro, steps and links stack on the left.
  // Laws of UX: one boxed, solid-button element on the page -- the form (Von Restorff); the steps
  // and the alternatives are plain text so they don't compete with it (Hick, selective attention);
  // the form is reached with little scrolling on a phone (Fitts, goal-gradient).
  return (
    <section className="relative overflow-hidden bg-dark-bg pb-16 pt-28 text-dark-text md:pb-28 md:pt-32">
      <Seo
        title="Contact Plotune"
        description="Tell us about your test environment and we'll walk you through how Plotune Nexus fits, including integration details, timeline, and next steps."
        path="/contact"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(38,166,154,0.16),transparent_40%),linear-gradient(180deg,#101112_0%,#121212_100%)]" />

      <div className="relative container mx-auto max-w-6xl px-5">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-16 lg:gap-y-10">
          <div className="max-w-xl lg:col-start-1 lg:row-start-1">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Contact</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-light-text md:text-5xl">
              Tell us about your test environment.
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-text">
              We reply with integration details, a timeline, and clear next steps.
            </p>
          </div>

          <div className="lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-start">
            <ContactForm topic={topic} />
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-text">What happens next</h2>
            <ol className="mt-5 space-y-5">
              {nextSteps.map(([title, copy], index) => (
                <li key={title} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-light-text">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-text">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Quieter alternatives: plain text links, so the form stays the one primary action. */}
          <div className="space-y-1 border-t border-white/10 pt-6 text-sm text-gray-text lg:col-start-1 lg:row-start-3">
            <p className="flex flex-wrap items-center gap-x-1.5">
              Prefer email?
              <a href={mailto} className="inline-flex min-h-[44px] items-center font-medium text-light-text underline underline-offset-4 hover:text-primary">
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="flex flex-wrap items-center gap-x-1.5">
              Not ready to talk yet?
              <Link
                to={withFunnelParams('/ai-readiness')}
                onClick={() => posthog.capture('contact_assessment_clicked', { ...getFunnelContext(), path: '/contact', topic })}
                className="inline-flex min-h-[44px] items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Check your test bench
                <FiArrowRight aria-hidden="true" />
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-12">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-gray-text">
            Other ways to reach us
          </p>
          <div className="mx-auto mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
            {otherChannels.map((channel) => (
              <a
                key={channel.title}
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-dark-card/60 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-dark-card/90"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-primary">
                  {channel.icon === 'discord' ? (
                    <i className="fa-brands fa-discord text-lg" aria-hidden="true" />
                  ) : (
                    <channel.icon className="text-lg" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-light-text">{channel.title}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-text">
                    {channel.icon !== 'discord' && <FiClock className="shrink-0" />}
                    {channel.subtitle}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
