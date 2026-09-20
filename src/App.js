import React, { useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Faq from './pages/Faq';
import Extensions from './pages/Extensions';
import RedirectPage from './pages/RedirectPage';
import Download from './pages/Download';
import About from './pages/About';
import Careers from './pages/Careers';
import Header from './components/Header';
import DevBanner from './components/DevBanner';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Legal from './pages/Legal';
import Docs from './pages/Docs';
import Dashboard from './pages/Dashboard';
import Privacy from './pages/Privacy';
import ContactPage from './pages/Contact';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Streams from './pages/Streams';
import DnsPage from './pages/DnsPage';
import Partnership from './pages/Partnership';
import PartnerApplication from './pages/PartnerApplication';
import PartnerPortal from './pages/PartnerPortal';
import StorageManager from './pages/StorageManager';
import PackageMirror from './pages/PackageMirror';
import Embeddings from './pages/Embeddings';
import Nexus from './pages/Nexus';
import SolutionPage from './pages/SolutionPage';
import AgenticTestDevelopmentPage from './pages/AgenticTestDevelopmentPage';
import NexusConnectivity from './pages/NexusConnectivity';
import NexusStream from './pages/NexusStream';
import NexusUseCases from './pages/NexusUseCases';
import StreamOverviewPage from './components/streams/StreamOverviewPage';
import ResearchLayout from './research/ResearchLayout';
import ResearchOverview from './research/ResearchOverview';
import ResearchArticle from './research/ResearchArticle';
import ResearchResults from './research/ResearchResults';
import ResearchReports from './research/ResearchReports';
import ResearchMethodology from './research/ResearchMethodology';

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
      The link may be outdated or mistyped. Here are the places people usually need:
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
  const hideLayoutPaths = ['/streams/connect'];
  const shouldHide = hideLayoutPaths.includes(location.pathname);

  if (location.pathname.startsWith('/research')) {
    return <ResearchLayout>{children}</ResearchLayout>;
  }

  return (
    <>
      {!shouldHide && <DevBanner />}
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
          <NavigationWrapper>
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
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/streams" element={<Streams />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NavigationWrapper>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;



