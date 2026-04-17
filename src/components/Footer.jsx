import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-dark-surface backdrop-blur-xl py-16 border-t border-white/5">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Plotune Logo" className="h-9 w-auto" />
              <h1 className="text-2xl font-bold text-light-text">Plotune</h1>
            </div>
            <p className="mt-5 text-gray-text max-w-xs">
              Empowering engineers, analysts, and researchers with real-time data visualization tools.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-light-text mb-5">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-text hover:text-primary transition-colors duration-300">Features</Link></li>
              <li><Link to="/nexus" className="text-gray-text hover:text-primary transition-colors duration-300">Nexus</Link></li>
              <li><Link to="/extensions" className="text-gray-text hover:text-primary transition-colors duration-300">Extensions</Link></li>
              <li><Link to="/download" className="text-gray-text hover:text-primary transition-colors duration-300">Download</Link></li>
              {/*<li><Link to="/pricing" className="text-gray-text hover:text-primary transition-colors duration-300">Pricing</Link></li>*/}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-light-text mb-5">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/docs" className="text-gray-text hover:text-primary transition-colors duration-300">Documentation</Link></li>
              <li><Link to="/tutorials" className="text-gray-text hover:text-primary transition-colors duration-300">Tutorials</Link></li>
              <li><Link to="/blog" className="text-gray-text hover:text-primary transition-colors duration-300">Blog</Link></li>
              <li><Link to="/community" className="text-gray-text hover:text-primary transition-colors duration-300">Community</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-light-text mb-5">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-text hover:text-primary transition-colors duration-300">About Us</Link></li>
              <li><Link to="/partners" className="text-gray-text hover:text-primary transition-colors duration-300">Partnership</Link></li>
              <li><Link to="/contact" className="text-gray-text hover:text-primary transition-colors duration-300">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-text hover:text-primary transition-colors duration-300">Careers</Link></li>
              <li><Link to="/legal" className="text-gray-text hover:text-primary transition-colors duration-300">Legal</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-white/5 text-gray-text text-sm">
          &copy; 2025 Plotune. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
