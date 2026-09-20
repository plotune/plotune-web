import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiLogOut, FiUser, FiGrid, FiActivity, FiShare2, FiServer, FiShoppingBag, FiBookOpen, FiChevronDown } from 'react-icons/fi';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';

// SVG icons instead of the Material Icons ligature font: that font is an external Google Fonts
// load, and when it fails (slow network, ad blocker, offline) the ligature falls back to its
// literal name as visible text (e.g. a login link showing "account_circle").
const navIconMap = {
  person: FiUser, dashboard: FiGrid, stream: FiActivity, account_tree: FiShare2,
  dns: FiServer, store: FiShoppingBag, science: FiBookOpen,
};
const NavIcon = ({ name, className }) => {
  const Icon = navIconMap[name];
  return Icon ? <Icon className={className} /> : null;
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const location = useLocation();

  // Lokasyon değiştiğinde mobile menüyü kapat
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  // Doherty/Occam: Escape and outside clicks close the open dropdown, instead of
  // requiring a precise second click on the same chevron.
  useEffect(() => {
    if (!openDropdown) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpenDropdown(null);
    };
    const onMouseDown = (event) => {
      if (event.target instanceof Element && !event.target.closest('[data-nav-dropdown]')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [openDropdown]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (itemPath) => {
    setOpenDropdown((current) => current === itemPath ? null : itemPath);
  };

  const handleLogout = () => {
    logout();
    setOpenDropdown(null);
  };

  // Navigation items for non-logged-in users
  const guestNavItems = [
    { to: '/', label: 'Home' },
    {
      to: '/nexus',
      label: 'Nexus',
      children: [
        { to: '/nexus/connectivity', label: 'Connectivity' },
        { to: '/nexus/stream', label: 'Stream' },
        { to: '/nexus/use-cases', label: 'Use Cases' },
      ],
    },
    { to: '/extensions', label: 'Extensions' },
    { to: '/download', label: 'Download' },
    { to: '/about', label: 'About' },
    {
      to: '/docs',
      label: 'Docs',
      children: [
        { to: '/faq', label: 'FAQ' },
      ],
    },
    { to: '/research', label: 'Research' },
  ];

  // Navigation items for logged-in users with Material Icons
  const userNavItems = [
    { to: '/profile', label: 'Profile', icon: 'person' },
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/streams', label: 'Streams', icon: 'stream' },
    { to: '/mirror', label: 'Edge', icon: 'account_tree' },
    { to: '/storage', label: 'Storage', icon: 'dns' },
    { to: '/extensions', label: 'Extensions', icon: 'store' },
    { to: '/research', label: 'Research', icon: 'science' },
  ];

  const navItems = isLoggedIn ? userNavItems : guestNavItems;

  const renderNavLink = (item) => {
    const isActive = location.pathname === item.to || item.children?.some((child) => location.pathname === child.to);
    const linkClass = `min-h-[44px] rounded-lg text-dark-text font-medium text-base hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary relative transition-colors duration-300 ${
      isActive 
        ? 'text-primary after:w-full after:h-0.5 after:bg-primary after:absolute after:bottom-[-5px] after:left-0' 
        : 'after:w-0 after:h-0.5 after:bg-primary after:absolute after:bottom-[-5px] after:left-0 after:transition-all after:duration-300 hover:after:w-full focus-visible:after:w-full'
    }`;

    if (item.isExternal) {
      return (
        <a
          href={item.to}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 ${linkClass}`}
          onClick={() => setIsMobileMenuOpen(false)} // External link tıklandığında menüyü kapat
        >
          {item.icon && <NavIcon name={item.icon} className="text-lg" />}
          {item.label}
        </a>
      );
    }

    if (item.children) {
      const dropdownId = `${item.label.toLowerCase().replace(/\s+/g, '-')}-submenu`;
      const isOpen = openDropdown === item.to;

      return (
        <div className="relative" data-nav-dropdown>
          <div className="flex items-center">
            <Link
              to={item.to}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2 ${linkClass}`}
            >
              {item.icon && <NavIcon name={item.icon} className="text-lg" />}
              {item.label}
            </Link>
            <button
              type="button"
              className="ml-1 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-dark-text hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`${isOpen ? 'Hide' : 'Show'} ${item.label} navigation`}
              aria-controls={dropdownId}
              aria-expanded={isOpen}
              onClick={() => toggleDropdown(item.to)}
            >
              <FiChevronDown aria-hidden="true" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div id={dropdownId} className={`${isOpen ? 'block' : 'hidden'} mt-2 md:absolute md:left-0 md:top-full md:mt-3 md:min-w-48`}>
            <div className="min-w-48 rounded-xl border border-white/10 bg-dark-surface p-3 shadow-custom">
              {item.children.map((child) => (
                <Link
                  key={child.to}
                  to={child.to}
                  aria-current={location.pathname === child.to ? 'page' : undefined}
                  className={`flex min-h-[44px] items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-300 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    location.pathname === child.to ? 'text-primary' : 'text-dark-text'
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        to={item.to}
        aria-current={isActive ? 'page' : undefined}
        className={`flex items-center gap-2 ${linkClass}`}
        // Internal linkler için de tıklanınca menüyü kapatmak istiyorsak:
        // onClick={() => setIsMobileMenuOpen(false)}
        // Ancak useEffect zaten kapatıyor, bu nedenle gerek yok.
      >
        {item.icon && <NavIcon name={item.icon} className="text-lg" />}
        {item.label}
      </Link>
    );
  };

  return (
    <header className="bg-white/5 backdrop-blur-xl fixed w-full top-0 z-50 shadow-custom py-4">
      <div className="container mx-auto px-5 flex justify-between items-center">
          <Link to="/" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Plotune Logo" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-light-text bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Plotune
          </span>
        </div>
          </Link>
        <nav className="flex items-center" aria-label="Main navigation">
          <ul id="main-navigation" className={`md:flex gap-8 ${isMobileMenuOpen ? 'flex flex-col absolute top-16 left-0 w-full bg-dark-surface backdrop-blur-xl p-5' : 'hidden md:flex'}`}>
            {navItems.map((item) => (
              <li key={item.to}>
                {renderNavLink(item)}
              </li>
            ))}
            {/* Logout button for logged-in users in mobile menu */}
            {isLoggedIn && isMobileMenuOpen && (
              <li>
                <button
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="flex min-h-[44px] min-w-[44px] items-center gap-2 text-left text-dark-text font-medium text-base hover:text-primary transition-colors duration-300"
                >
                  <FiLogOut className="text-lg" />
                  <span>Log out</span>
                </button>
              </li>
            )}
            {/* Login/Register for non-logged-in users in mobile menu */}
            {!isLoggedIn && isMobileMenuOpen && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="flex min-h-[44px] items-center gap-2 rounded-lg text-dark-text font-medium text-base hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiUser className="text-xl" />
                    <span>Log in</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="flex min-h-[44px] items-center rounded-lg text-primary font-semibold text-base hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          {/* Desktop view - Auth buttons */}
          <div className="hidden md:flex items-center gap-4 ml-8">
            {isLoggedIn ? (
              // Logout button for logged-in users (desktop)
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg text-dark-text font-medium text-base hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-300"
              >
                <FiLogOut className="text-lg" />
              </button>
            ) : (
              // Login/Register for non-logged-in users (desktop)
              <>
                <Link
                  to="/login"
                  aria-label="Log in"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-dark-text font-medium text-base hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-300"
                >
                <FiUser className="text-2xl" />
                </Link>
                <Link
                  to="/register"
                  className="flex min-h-[44px] items-center justify-center rounded-lg px-3 text-primary font-semibold text-base hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden ml-4 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-dark-text text-2xl hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={toggleMobileMenu} 
            aria-label={isMobileMenuOpen ? 'Close main navigation' : 'Open main navigation'}
            aria-controls="main-navigation"
            aria-expanded={isMobileMenuOpen}
          >
            <FiMenu />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
