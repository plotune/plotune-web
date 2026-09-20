import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  const location = useLocation();
  const linkClass = (path) => `flex min-h-[44px] items-center text-gray-text hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-300 ${location.pathname === path ? 'text-primary' : ''}`;

  return (
    <footer className="bg-dark-surface backdrop-blur-xl py-16 border-t border-white/5">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Plotune home">
              <img src={logo} alt="Plotune Logo" className="h-9 w-auto" />
              <span className="text-2xl font-bold text-light-text">Plotune</span>
            </Link>
            <p className="mt-5 text-gray-text max-w-xs">
              Empowering engineers, analysts, and researchers with real-time data visualization tools.
            </p>
          </div>
          <div>
            <h3 id="footer-product" className="text-xl font-semibold text-light-text mb-5">Product</h3>
            <nav aria-labelledby="footer-product"><ul className="space-y-3">
              <li><Link to="/#features" className={linkClass('/')}>Features</Link></li>
              <li><Link to="/nexus" aria-current={location.pathname === '/nexus' ? 'page' : undefined} className={linkClass('/nexus')}>Nexus</Link></li>
              <li><Link to="/extensions" aria-current={location.pathname === '/extensions' ? 'page' : undefined} className={linkClass('/extensions')}>Extensions</Link></li>
              <li><Link to="/download" aria-current={location.pathname === '/download' ? 'page' : undefined} className={linkClass('/download')}>Download</Link></li>
            </ul>
            </nav>
          </div>
          <div>
            <h3 id="footer-resources" className="text-xl font-semibold text-light-text mb-5">Resources</h3>
            <nav aria-labelledby="footer-resources"><ul className="space-y-3">
              <li><Link to="/docs" aria-current={location.pathname === '/docs' ? 'page' : undefined} className={linkClass('/docs')}>Documentation</Link></li>
              <li><Link to="/faq" aria-current={location.pathname === '/faq' ? 'page' : undefined} className={linkClass('/faq')}>FAQ</Link></li>
              <li>
                <a
                  href="https://github.com/plotune/plotune-web/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex min-h-[44px] items-center gap-2 text-gray-text hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-300 ${location.pathname === '/community' ? 'text-primary' : ''}`}
                >
                  Community
                  <span aria-hidden="true" className="text-xs">↗</span>
                  <span className="sr-only">(opens GitHub in a new tab)</span>
                </a>
              </li>
            </ul>
            </nav>
          </div>
          <div>
            <h3 id="footer-company" className="text-xl font-semibold text-light-text mb-5">Company</h3>
            <nav aria-labelledby="footer-company"><ul className="space-y-3">
              <li><Link to="/about" aria-current={location.pathname === '/about' ? 'page' : undefined} className={linkClass('/about')}>About Us</Link></li>
              <li><Link to="/partners" aria-current={location.pathname === '/partners' ? 'page' : undefined} className={linkClass('/partners')}>Partnership</Link></li>
              <li><Link to="/contact" aria-current={location.pathname === '/contact' ? 'page' : undefined} className={linkClass('/contact')}>Contact</Link></li>
              <li><Link to="/careers" aria-current={location.pathname === '/careers' ? 'page' : undefined} className={linkClass('/careers')}>Careers</Link></li>
              <li><Link to="/legal" aria-current={location.pathname === '/legal' ? 'page' : undefined} className={linkClass('/legal')}>Legal</Link></li>
            </ul>
            </nav>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-white/5 text-gray-text text-sm">
          &copy; {new Date().getFullYear()} Plotune. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
