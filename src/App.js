import React, { lazy, Suspense, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Nexus from './pages/Nexus';
import NexusConnectivity from './pages/NexusConnectivity';
import NexusStream from './pages/NexusStream';
import NexusUseCases from './pages/NexusUseCases';
// Eager like the Nexus pages: /ai-readiness is a paid-ad landing page and is prerendered, so a
// lazy import would swap its prerendered markup for the blank Suspense fallback on load (see below).
import AiReadinessPage from './aiReadiness/AiReadinessPage';
import RedirectPage from './pages/RedirectPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ResearchLayout from './research/ResearchLayout';
import ScrollDepthTracker from './components/ScrollDepthTracker';

// Every other page is route-split: Home and the Nexus pages stay eager (all
// direct landing destinations for nav/ad traffic, and the Nexus pages are
// each small enough -- under 40KB -- that eager-importing them doesn't undo
// the bundle-size win below) so a fresh page load never suspends and swaps
// the prerendered markup for the Suspense fallback -- since index.js uses
// createRoot (no hydration), that swap is a full-page layout shift, not just
// a loading flash. Research pages hit the same failure mode in principle but
// pull in a much larger shared chart chunk (Plotly), so they're not eager-
// imported here; they were verified to already render without it (see
// npm run webvitals). Everything else was previously bundled together, so a
// homepage visitor was downloading and parsing the JS for Dashboard, Login,
// StorageManager, PackageMirror and every other page before React could paint
// the Hero -- that eager bundle was the main driver behind the site's FCP/LCP
// regression.
const Faq = lazy(() => import('./pages/Faq'));
const Extensions = lazy(() => import('./pages/Extensions'));
const Download = lazy(() => import('./pages/Download'));
const About = lazy(() => import('./pages/About'));
const Careers = lazy(() => import('./pages/Careers'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Legal = lazy(() => import('./pages/Legal'));
const Docs = lazy(() => import('./pages/Docs'));
const NexusDocsOverview = lazy(() => import('./pages/NexusDocsOverview'));
const NexusDocPage = lazy(() => import('./pages/NexusDocPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Privacy = lazy(() => import('./pages/Privacy'));
const ContactPage = lazy(() => import('./pages/Contact'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Streams = lazy(() => import('./pages/Streams'));
const StreamWorkspace = lazy(() => import('./StreamWorkspace/StreamWorkspace'));
const DnsPage = lazy(() => import('./pages/DnsPage'));
const Partnership = lazy(() => import('./pages/Partnership'));
const PartnerApplication = lazy(() => import('./pages/PartnerApplication'));
const PartnerPortal = lazy(() => import('./pages/PartnerPortal'));
const StorageManager = lazy(() => import('./pages/StorageManager'));
const PackageMirror = lazy(() => import('./pages/PackageMirror'));
const Embeddings = lazy(() => import('./pages/Embeddings'));
const SolutionPage = lazy(() => import('./pages/SolutionPage'));
const AgenticTestDevelopmentPage = lazy(() => import('./pages/AgenticTestDevelopmentPage'));
const StreamOverviewPage = lazy(() => import('./components/streams/StreamOverviewPage'));
const ResearchOverview = lazy(() => import('./research/ResearchOverview'));
const ResearchArticle = lazy(() => import('./research/ResearchArticle'));
const ResearchResults = lazy(() => import('./research/ResearchResults'));
const ResearchReports = lazy(() => import('./research/ResearchReports'));
const ResearchMethodology = lazy(() => import('./research/ResearchMethodology'));

// The pillar page moved from /agentic-test-development to /solutions/agentic-test-development
// so every funnel destination lives under /solutions/ — this keeps the old URL working.
const RedirectToSolutionsPillar = () => {
  const location = useLocation();
  return <Navigate to={`/solutions/agentic-test-development${location.search}`} replace />;
};

// Jakob: an unknown URL must not render as a silent blank page between Header and
// Footer — a real 404 with a way forward keeps navigation honest.
const NotFound = () => (
  <main className="flex min-h-[60vh] flex-col items-center justify-center bg-dark-bg px-5 py-20 text-center text-dark-text">
    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">404</p>
    <h1 className="mt-4 text-3xl font-semibold text-light-text md:text-4xl">
      We couldn&apos;t find that page.
    </h1>
    <p className="mt-4 max-w-md text-lg leading-8 text-gray-text">
      The link may be outdated or mistyped. Here are some places to start:
    </p>
    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Link
        to="/"
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Go to the homepage
      </Link>
      <Link
        to="/docs"
        className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold text-light-text transition-all duration-300 hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Read the docs
      </Link>
    </div>
  </main>
);

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname, hash]);

  return null;
};

const NavigationWrapper = ({ children }) => {
  const location = useLocation();
  // '/ai-readiness' is a standalone, chrome-free assessment flow (no site Header/Footer).
  const hideLayoutPaths = ['/streams/connect', '/ai-readiness', '/stream/workspace'];
  // GitHub Pages 301s a directory-style route to '/route/', and the Routes below match
  // either form, so the layout check has to as well.
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
  const shouldHide = hideLayoutPaths.includes(normalizedPath);

  if (location.pathname.startsWith('/research')) {
    return <ResearchLayout>{children}</ResearchLayout>;
  }

  return (
    <>
      {!shouldHide && <Header />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
      <Router>
        <div className="app">
          <ScrollToTop />
          <ScrollDepthTracker />
          <NavigationWrapper>
            <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/extensions" element={<Extensions />} />
              <Route path="/blog" element={<RedirectPage url="https://github.com/plotune/plotune-web/discussions" />} />
              <Route path="/community" element={<RedirectPage url="https://github.com/plotune/plotune-web/discussions" />} />
              <Route path="/tutorials" element={<RedirectPage url="https://github.com/plotune/plotune-web/discussions" />} />
              <Route path="/download" element={<Download />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/docs/nexus" element={<NexusDocsOverview />} />
              <Route path="/docs/nexus/:slug" element={<NexusDocPage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/streams" element={<Streams />} />
              <Route path="/stream/workspace" element={<StreamWorkspace />} />
              <Route path="/dns" element={<DnsPage />} />
              <Route path="/partners" element={<Partnership />} />
              <Route path="/partner-portal" element={<PartnerPortal />} />
              <Route path="/partners/apply" element={<PartnerApplication />} />
              <Route path="/storage" element={<StorageManager />} />
              <Route path="/mirror" element={<PackageMirror />} />
              <Route path="/embed" element={<Embeddings />} />
              <Route path="/nexus" element={<Nexus />} />
              <Route path="/solutions/agentic-test-development" element={<AgenticTestDevelopmentPage />} />
              <Route path="/solutions/:segment" element={<SolutionPage />} />
              <Route path="/agentic-test-development" element={<RedirectToSolutionsPillar />} />
              <Route path="/nexus/connectivity" element={<NexusConnectivity />} />
              <Route path="/nexus/stream" element={<NexusStream />} />
              <Route path="/nexus/use-cases" element={<NexusUseCases />} />
              <Route path="/research" element={<ResearchOverview />} />
              <Route path="/research/results" element={<ResearchResults />} />
              <Route path="/research/reports" element={<ResearchReports />} />
              <Route path="/research/methodology" element={<ResearchMethodology />} />
              <Route path="/research/articles/:slug" element={<ResearchArticle />} />
              <Route path="/streams/connect" element={<StreamOverviewPage />} />
              <Route path="/ai-readiness" element={<AiReadinessPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </NavigationWrapper>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;



