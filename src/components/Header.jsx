import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiLogOut, FiUser, FiGrid, FiActivity, FiShare2, FiServer, FiShoppingBag, FiBookOpen } from 'react-icons/fi';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const location = useLocation();

  // Lokasyon değiştiğinde mobile menüyü kapat
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
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
    const linkClass = `text-dark-text font-medium text-base hover:text-primary relative transition-colors duration-300 ${
      isActive 
        ? 'text-primary after:w-full after:h-0.5 after:bg-primary after:absolute after:bottom-[-5px] after:left-0' 
        : 'after:w-0 after:h-0.5 after:bg-primary after:absolute after:bottom-[-5px] after:left-0 after:transition-all after:duration-300 hover:after:w-full'
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
      return (
        <div className="group relative">
          <Link
            to={item.to}
            className={`flex items-center gap-2 ${linkClass}`}
          >
            {item.icon && <NavIcon name={item.icon} className="text-lg" />}
            {item.label}
          </Link>
          {/* Positioner carries a transparent top padding so the hover area
              bridges the gap between the parent and the menu (no dead zone). */}
          <div className="hidden md:absolute md:left-0 md:top-full md:pt-3 md:group-hover:block">
            <div className="min-w-48 rounded-xl border border-white/10 bg-dark-surface p-3 shadow-custom">
              {item.children.map((child) => (
                <Link
                  key={child.to}
                  to={child.to}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-300 hover:bg-primary/10 hover:text-primary ${
                    location.pathname === child.to ? 'text-primary' : 'text-dark-text'
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="mt-2 space-y-2 pl-4 md:hidden">
              {item.children.map((child) => (
                <Link
                  key={child.to}
                  to={child.to}
                  className={`block text-sm font-medium transition-colors duration-300 hover:text-primary ${
                    location.pathname === child.to ? 'text-primary' : 'text-gray-text'
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={item.to}
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
          <Link  to="/">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Plotune Logo" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-light-text bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Plotune
          </span>
        </div>
          </Link>
        <nav className="flex items-center">
          <ul className={`md:flex gap-8 ${isMobileMenuOpen ? 'flex flex-col absolute top-16 left-0 w-full bg-dark-surface backdrop-blur-xl p-5' : 'hidden md:flex'}`}>
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
                  className="flex items-center gap-2 w-full text-left text-dark-text font-medium text-base hover:text-primary transition-colors duration-300"
                >
                  <FiLogOut className="text-lg" />
                </button>
              </li>
            )}
            {/* Login/Register for non-logged-in users in mobile menu */}
            {!isLoggedIn && isMobileMenuOpen && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block text-dark-text font-medium text-base hover:text-primary transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                <FiUser className="text-2xl" />
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
                className="flex items-center gap-2 text-dark-text font-medium text-base hover:text-primary transition-colors duration-300"
              >
                <FiLogOut className="text-lg" />
              </button>
            ) : (
              // Login/Register for non-logged-in users (desktop)
              <>
                <Link
                  to="/login"
                  className="text-dark-text font-medium text-base hover:text-primary transition-colors duration-300"
                >
                <FiUser className="text-2xl" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-dark-text text-2xl ml-4" 
            onClick={toggleMobileMenu} 
            aria-label="Toggle mobile menu"
          >
            <FiMenu />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
