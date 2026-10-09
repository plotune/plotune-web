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

  // Layout (mobile first): short intro -> form -> "Not ready to talk yet?" card -> "what happens
  // next" -> a quiet email line. On large screens the form and the card sit in the right column;
  // intro, steps and the email line stack on the left.
  // Laws of UX: the form's button is the only solid one (Von Restorff). The assessment card is the
  // second funnel, so it gets a large outline button right under the form, where a visitor who
  // isn't ready to write looks next (proximity, Fitts), without competing with "Send message".
  // The steps and the email line are plain text (Hick, selective attention).
  return (
    <section className="relative overflow-hidden bg-dark-bg pb-16 pt-28 text-dark-text md:pb-28 md:pt-32">
      <Seo
        title="Contact Plotune"
        description="Tell us about your test environment and we'll walk you through how Plotune Nexus fits, including integration details, timeline, and next steps."
        path="/contact"
      />
      <div className="absolute inset-0 bg-dark-surface" />

      <div className="relative container mx-auto max-w-6xl px-5">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[auto_auto_1fr] lg:gap-x-16 lg:gap-y-10">
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

            {/* Second funnel: visitors not ready to talk take the assessment instead of leaving. */}
            <div className="mt-5 rounded-sm border border-primary/30 bg-primary/[0.07] p-5 md:p-6">
              <p className="text-base font-semibold text-light-text">Not ready to talk yet?</p>
              <p className="mt-1 text-sm leading-6 text-gray-text">
                See how AI-ready your test bench is first: 4 questions, about 30 seconds, no sign-up.
              </p>
              <Link
                to={withFunnelParams('/ai-readiness')}
                onClick={() => posthog.capture('contact_assessment_clicked', { ...getFunnelContext(), path: '/contact', topic })}
                className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 border-primary px-5 text-base font-semibold text-primary transition-colors duration-100 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg"
              >
                Check your test bench
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
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

          <p className="flex flex-wrap items-center gap-x-1.5 border-t border-ink/15 pt-4 text-sm text-gray-text lg:col-start-1 lg:row-start-3 lg:self-start">
            Prefer email?
            <a href={mailto} className="inline-flex min-h-[44px] items-center font-medium text-light-text underline underline-offset-4 hover:text-primary">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <div className="mt-14 border-t border-ink/15 pt-12">
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
                className="group flex items-center gap-4 rounded-sm border border-ink/15 bg-dark-card/60 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-dark-card/90"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dark-card text-primary">
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
