import React, { useState, useEffect, useCallback, useRef } from "react";
import { MdHome, MdApartment, MdLocationOn, MdPhone } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo1.png";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 992);
  
  const navbarRef = useRef(null);
  const location = useLocation();
  const resizeTimeoutRef = useRef(null);

  // Calculate actual navbar height for better spacing
  const updateNavbarHeight = useCallback(() => {
    if (navbarRef.current) {
      const height = navbarRef.current.getBoundingClientRect().height;
      setNavbarHeight(height);
    }
  }, []);

  // Enhanced scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setScrolled(scrollPosition > 30);
  }, []);

  // Enhanced resize handler with debouncing
  const handleResize = useCallback(() => {
    // Clear any pending timeouts
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    // Debounce resize events to prevent excessive updates
    resizeTimeoutRef.current = setTimeout(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Update screen size state
      setScreenSize({ width, height });
      
      // Update mobile view state
      const newIsMobileView = width < 992;
      setIsMobileView(newIsMobileView);
      
      // Close mobile menu if we resize to desktop
      if (!newIsMobileView && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      
      // Recalculate navbar height
      updateNavbarHeight();
      
      // Additional functionality based on screen size
      if (width < 768) {
        // Handle extra small devices
        document.documentElement.style.setProperty('--nav-font-size', '0.9rem');
      } else {
        document.documentElement.style.setProperty('--nav-font-size', '0.95rem');
      }
    }, 150); // Debounce time: 150ms
  }, [isMobileMenuOpen, updateNavbarHeight]);

  // Close mobile menu when clicking outside
  const handleClickOutside = useCallback((event) => {
    const navbarCollapse = document.getElementById("navbarNav");
    const hamburgerMenu = document.querySelector(".toggle-menu");
    
    if (
      isMobileMenuOpen &&
      navbarCollapse &&
      !navbarCollapse.contains(event.target) &&
      !hamburgerMenu?.contains(event.target)
    ) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Handle screen orientation changes
  const handleOrientationChange = useCallback(() => {
    // Force a resize handler call on orientation change
    handleResize();
  }, [handleResize]);

  // Initial setup and event listeners
  useEffect(() => {
    // Calculate height once on initial render
    updateNavbarHeight();
    
    // Initial resize handling
    handleResize();
    
    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    document.addEventListener("mousedown", handleClickOutside);
    
    // Media query listener for dark mode changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = (e) => {
      // You can adjust navbar styling based on dark/light mode preference
      const isDarkMode = e.matches;
      // Example: adjust navbar background for dark mode
      document.documentElement.style.setProperty(
        '--navbar-gradient', 
        isDarkMode 
          ? 'linear-gradient(180deg, rgb(0,38,105) 0%, rgba(0,38,105,0.8) 90%)'
          : 'linear-gradient(180deg, rgb(0,48,135) 0%, rgba(0,48,135,0.8) 90%)'
      );
    };
    
    darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);
    
    // Run once after initial render to ensure accurate height calculation
    const initialHeightTimer = setTimeout(() => {
      updateNavbarHeight();
    }, 100);
    
    return () => {
      // Clean up all event listeners
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      document.removeEventListener("mousedown", handleClickOutside);
      darkModeMediaQuery.removeEventListener('change', handleColorSchemeChange);
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      clearTimeout(initialHeightTimer);
    };
  }, [handleScroll, handleClickOutside, handleResize, updateNavbarHeight, handleOrientationChange]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  // Log screen size changes for debugging
  useEffect(() => {
    console.log("Screen size changed:", screenSize);
    console.log("Is mobile view:", isMobileView);
  }, [screenSize, isMobileView]);

  const navItems = [
    { icon: <MdHome size={20} />, label: "Home", href: "/" },
    { icon: <MdApartment size={20} />, label: "Properties", href: "/properties" },
    { icon: <MdLocationOn size={20} />, label: "Locations", href: "/location" },
    { icon: <MdPhone size={20} />, label: "Contact", href: "/contact" },
  ];

  // Use constants for height instead of dynamically changing values
  const NAVBAR_HEIGHT = "70px";
  const LOGO_HEIGHT = isMobileView ? "42px" : "52px";
  const BRAND_FONT_SIZE = isMobileView ? "1.5rem" : "1.7rem";
  const NAVBAR_PADDING = "0.7rem 0";

  return (
    <>
      <nav
        ref={navbarRef}
        className={`navbar navbar-expand-lg fixed-top ${scrolled ? "navbar-scrolled" : ""}`}
        style={{
          background: scrolled
            ? "rgba(0,48,135,0.97)"
            : "var(--navbar-gradient, linear-gradient(180deg, rgb(0,48,135) 0%, rgba(0,48,135,0.8) 90%))",
          transition: "background 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          padding: NAVBAR_PADDING,
          boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.15)" : "none",
          height: NAVBAR_HEIGHT,
        }}
        aria-label="Main navigation"
      >
        <div className="container">
          {/* Logo and Brand */}
          <Link
            className="navbar-brand d-flex align-items-center"
            to="/"
            aria-label="Go to homepage"
          >
            <div className="logo-container position-relative">
              <img
                src={logo}
                alt="Com4thPlus Logo"
                style={{
                  height: LOGO_HEIGHT,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  marginRight: "10px",
                }}
                className="logo-image"
              />
              
              {/* Brand Text - Desktop */}
              <div className="brand-text d-none d-md-flex flex-column ms-2">
                <span
                  className="brand-name fw-bold lh-1"
                  style={{
                    fontSize: BRAND_FONT_SIZE,
                    letterSpacing: "-0.5px",
                    textShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                >
                  <span className="text-white">Com4th</span>
                  <span
                    style={{
                      color: "#40E0D0",
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    Plus
                  </span>
                </span>
                <span
                  className="brand-tagline text-white-50"
                  style={{
                    fontSize: "0.85rem",
                    opacity: 1,
                    marginTop: "-2px",
                    display: screenSize.width < 768 ? "none" : "block"
                  }}
                >
                  Your Home Away from Home
                </span>
              </div>
            </div>
          </Link>

          {/* Modern Toggle Menu Button */}
          <button
            className={`toggle-menu ${isMobileMenuOpen ? "active" : ""}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="toggle-icon">
              <span className="toggle-line toggle-line-1"></span>
              <span className="toggle-line toggle-line-2"></span>
              <span className="toggle-line toggle-line-3"></span>
            </div>
          </button>

          {/* Navigation Menu */}
          <div
            className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto align-items-center">
              {navItems.map((item, index) => (
                <li className="nav-item mx-lg-2" key={index}>
                  <Link
                    className={`nav-link d-flex align-items-center ${
                      location.pathname === item.href ? "active" : ""
                    }`}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={
                      location.pathname === item.href ? "page" : undefined
                    }
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {location.pathname === item.href && (
                      <span className="active-indicator"></span>
                    )}
                  </Link>
                </li>
              ))}
              
              {/* CTA Button - visible on larger screens or in mobile menu */}
              <li className={`nav-item ms-lg-3 mt-3 mt-lg-0 ${isMobileView && !isMobileMenuOpen ? 'd-none' : ''}`}>
                <Link
                  to="/properties"
                  className="btn btn-cta"
                >
                  Book Now
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Dynamic spacer for fixed navbar that properly matches actual navbar height */}
      <div
        style={{
          height: `${navbarHeight}px`,
          margin: 0,
          padding: 0,
          background: "transparent",
        }}
        aria-hidden="true"
        className="navbar-spacer"
      ></div>

      {/* Enhanced Styles */}
      <style>{`
        :root {
          --nav-font-size: 0.95rem;
          --navbar-gradient: linear-gradient(180deg, rgb(0,48,135) 0%, rgba(0,48,135,0.8) 90%);
          --toggle-icon-color: #40E0D0;
          --toggle-active-color: #4ceadf;
          --toggle-animation-speed: 0.5s;
        }
        
        /* Navbar Base Styles */
        .navbar {
          z-index: 1030;
          will-change: transform;
          display: flex;
          align-items: center;
        }
        
        /* Spacer fix - ensures no background color shows */
        .navbar-spacer {
          display: block;
          visibility: hidden;
          pointer-events: none;
        }
        
        /* Logo Styles */
        .logo-container {
          display: flex;
          align-items: center;
        }
        
        /* Navigation Link Styles */
        .nav-link {
          color: white !important;
          font-weight: 500;
          padding: 0.6rem 0.8rem;
          margin: 0 0.1rem;
          border-radius: 6px;
          position: relative;
          transition: all 0.25s ease;
          font-size: var(--nav-font-size);
          letter-spacing: 0.2px;
        }
        
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .nav-icon {
          color: #40E0D0;
          margin-right: 8px;
          display: flex;
          align-items: center;
          transition: transform 0.25s ease;
        }
        
        .nav-link:hover .nav-icon {
          transform: scale(1.1);
        }
        
        .active-indicator {
          position: absolute;
          height: 3px;
          width: 100%;
          background-color: #40E0D0;
          bottom: -2px;
          left: 0;
          border-radius: 1px;
          transition: all 0.25s ease;
        }
        
        .nav-link.active {
          font-weight: 600;
          background-color: rgba(255, 255, 255, 0.08);
        }
        
        /* CTA Button */
        .btn-cta {
          background: linear-gradient(45deg, #40E0D0, #32b8aa);
          color: #003087;
          font-weight: 600;
          padding: 0.6rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 3px 8px rgba(64, 224, 208, 0.3);
          transition: all 0.25s ease;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: none;
        }
        
        .btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 12px rgba(64, 224, 208, 0.4);
          background: linear-gradient(45deg, #4ceadf, #40E0D0);
          color: #00256e;
        }
        
        /* Modern Toggle Menu */
        .toggle-menu {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 10px;
          height: 44px;
          width: 44px;
          position: relative;
          z-index: 10;
          transition: transform var(--toggle-animation-speed) ease-in-out;
        }
        
        .toggle-menu.active {
          transform: translateY(4px);
        }
        
        .toggle-icon {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
        
        .toggle-line {
          width: 100%;
          height: 2px;
          background-color: var(--toggle-icon-color);
          border-radius: 10px;
          display: block;
          position: absolute;
          left: 0;
          transition: all var(--toggle-animation-speed) cubic-bezier(0.68, -0.6, 0.32, 1.6);
        }
        
        .toggle-line-1 {
          top: 0;
          transform-origin: top left;
        }
        
        .toggle-line-2 {
          top: 50%;
          margin-top: -1px;
          transform-origin: center;
        }
        
        .toggle-line-3 {
          bottom: 0;
          transform-origin: bottom left;
        }
        
        /* Active toggle state animation */
        .toggle-menu.active .toggle-line {
          background-color: var(--toggle-active-color);
        }
        
        .toggle-menu.active .toggle-line-1 {
          transform: rotate(45deg) translate(1px, -2px);
          width: 110%;
        }
        
        .toggle-menu.active .toggle-line-2 {
          opacity: 0;
          transform: scale(0);
        }
        
        .toggle-menu.active .toggle-line-3 {
          transform: rotate(-45deg) translate(1px, 2px);
          width: 110%;
        }
        
        /* Responsive Styles */
        @media (max-width: 991.98px) {
          .toggle-menu {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .navbar-collapse {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(0, 48, 135, 0.98);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
            border-radius: 0 0 16px 16px;
            margin-top: 0;
            transform: translateY(-20px);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          
          .navbar-collapse.show {
            max-height: calc(100vh - 70px);
            opacity: 1;
            transform: translateY(0);
            padding: 1rem 0;
            overflow-y: auto;
            animation: slideDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          
          @keyframes slideDown {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            30% {
              opacity: 1;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          .navbar-nav {
            padding: 0.5rem 1rem 1.5rem;
          }
          
          .nav-item {
            margin: 0.25rem 0;
            width: 100%;
            opacity: 0;
            transform: translateY(10px);
            animation: fadeInUp 0.4s ease forwards;
            animation-delay: calc(0.1s * var(--item-index, 0));
          }
          
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .navbar-collapse.show .nav-item:nth-child(1) { --item-index: 1; }
          .navbar-collapse.show .nav-item:nth-child(2) { --item-index: 2; }
          .navbar-collapse.show .nav-item:nth-child(3) { --item-index: 3; }
          .navbar-collapse.show .nav-item:nth-child(4) { --item-index: 4; }
          .navbar-collapse.show .nav-item:nth-child(5) { --item-index: 5; }
          
          .nav-link {
            padding: 0.8rem 1rem;
            border-radius: 8px;
            justify-content: flex-start;
            width: 100%;
          }
          
          .active-indicator {
            width: 4px;
            height: 100%;
            left: 0;
            top: 0;
            border-radius: 0 2px 2px 0;
          }
          
          /* Show CTA button on mobile */
          .navbar-collapse.show .navbar-nav::after {
            content: "";
            display: block;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            margin: 1rem 0;
            animation: fadeIn 0.6s ease forwards;
            animation-delay: 0.6s;
            opacity: 0;
          }
          
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
          
          .navbar-collapse.show .navbar-nav::before {
            content: "Menu";
            display: block;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.8rem;
            font-weight: 500;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            animation: fadeIn 0.6s ease forwards;
            opacity: 0;
          }
          
          .navbar-nav .nav-item:last-child::before {
            content: "Actions";
            display: block;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.8rem;
            font-weight: 500;
            letter-spacing: 1px;
            margin: 1rem 0 0.5rem 1rem;
            text-transform: uppercase;
            animation: fadeIn 0.6s ease forwards;
            animation-delay: 0.5s;
            opacity: 0;
          }
          
          /* Mobile CTA Button */
          .navbar-collapse.show .nav-item:last-child {
            display: block !important;
            margin-top: 0 !important;
            animation-delay: 0.6s;
          }
          
          .navbar-collapse.show .btn-cta {
            width: 100%;
            text-align: center;
            margin-top: 0.5rem;
          }
        }
        
        /* Extra small devices */
        @media (max-width: 575.98px) {
          .logo-image {
            height: 40px !important;
          }
          
          .brand-name {
            font-size: 1.4rem !important;
          }
          
          .brand-tagline {
            display: none;
          }
        }
        
        /* Handle landscape orientation on mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .navbar-collapse.show {
            max-height: 85vh;
          }
          
          .nav-link {
            padding: 0.6rem 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;