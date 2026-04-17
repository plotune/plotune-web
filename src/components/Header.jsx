import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';

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
    { to: '/nexus', label: 'Nexus' },
    { to: '/extensions', label: 'Extensions' },
    { to: '/download', label: 'Download' },
    { to: '/about', label: 'About' },
    { to: '/docs', label: 'Docs' },
  ];

  // Navigation items for logged-in users with Material Icons
  const userNavItems = [
    { to: '/profile', label: 'Profile', icon: 'person' },
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/streams', label: 'Streams', icon: 'stream' },
    { to: '/mirror', label: 'Edge', icon: 'account_tree' },
    { to: '/storage', label: 'Storage', icon: 'dns' },
    { to: '/extensions', label: 'Extensions', icon: 'store' },
  ];

  const navItems = isLoggedIn ? userNavItems : guestNavItems;

  const renderNavLink = (item) => {
    const isActive = location.pathname === item.to;
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
          {item.icon && <span className="material-icons text-lg">{item.icon}</span>}
          {item.label}
        </a>
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
        {item.icon && <span className="material-icons text-lg">{item.icon}</span>}
        {item.label}
      </Link>
    );
  };

  return (
    <header className="bg-white/5 backdrop-blur-xl fixed w-full top-0 z-50 shadow-custom py-4">
      <div className="container mx-auto px-5 flex justify-between items-center">
          <Link  to="/#">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Plotune Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold text-light-text bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Plotune
          </h1>
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
                  <span className="material-icons text-lg">logout</span>
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
                <span className="material-icons text-2xl">account_circle</span>
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
                <span className="material-icons text-lg">logout</span>
              </button>
            ) : (
              // Login/Register for non-logged-in users (desktop)
              <>
                <Link
                  to="/login"
                  className="text-dark-text font-medium text-base hover:text-primary transition-colors duration-300"
                >
                <span className="material-icons text-2xl">account_circle</span>
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
            <span className="material-icons">menu</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
