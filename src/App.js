import React, { useLayoutEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
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
import StreamOverviewPage from './components/streams/StreamOverviewPage';

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
    <AuthProvider>
      <Router>
        <div className="app">
          <ScrollToTop />
          <NavigationWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
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
              <Route path="/streams/connect" element={<StreamOverviewPage />} />
            </Routes>
          </NavigationWrapper>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;