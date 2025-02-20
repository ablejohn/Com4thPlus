import React, { useState, useEffect, useCallback } from "react";
import { MdHome, MdApartment, MdLocationOn, MdPhone } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo1.png";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Improved scroll handler with throttling for better performance
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setScrolled(scrollPosition > 30);
  }, []);

  // Close mobile menu when clicking outside
  const handleClickOutside = useCallback((event) => {
    const navbarCollapse = document.getElementById("navbarNav");
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    
    if (
      isMobileMenuOpen &&
      navbarCollapse &&
      !navbarCollapse.contains(event.target) &&
      !hamburgerMenu.contains(event.target)
    ) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleScroll, handleClickOutside]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Lock body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleResize = () => {
      if (window.innerWidth >= 992 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  const navItems = [
    { icon: <MdHome size={20} />, label: "Home", href: "/" },
    { icon: <MdApartment size={20} />, label: "Properties", href: "/properties" },
    { icon: <MdLocationOn size={20} />, label: "Locations", href: "/location" },
    { icon: <MdPhone size={20} />, label: "Contact", href: "/contact" },
  ];

  // Calculate the actual height of the navbar for the spacer
  const navbarHeight = scrolled ? 72 : 80; // Adjusted values based on padding

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg fixed-top ${scrolled ? "navbar-scrolled" : ""}`}
        style={{
          background: scrolled
            ? "rgba(0,48,135,0.97)"
            : "linear-gradient(180deg, rgb(0,48,135) 0%, rgba(0,48,135,0.9) 100%)",
          transition: "all 0.25s ease-in-out",
          padding: scrolled ? "0.6rem 0" : "0.8rem 0",
          boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.15)" : "none",
          height: "auto", // Let height adjust naturally
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
                  height: scrolled ? "48px" : "55px",
                  transition: "all 0.25s ease-in-out",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  marginRight: "12px",
                }}
                className="logo-image"
              />
              
              {/* Brand Text - Desktop */}
              <div className="brand-text d-none d-md-flex flex-column ms-2">
                <span
                  className="brand-name fw-bold lh-1"
                  style={{
                    fontSize: scrolled ? "1.6rem" : "1.75rem",
                    letterSpacing: "-0.5px",
                    textShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    transition: "all 0.25s ease-in-out",
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
                    opacity: scrolled ? 0.8 : 1,
                    transition: "all 0.25s ease-in-out",
                    marginTop: "-2px",
                  }}
                >
                  Your Home Away from Home
                </span>
              </div>
            </div>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            className={`hamburger-menu ${isMobileMenuOpen ? "active" : ""}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
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
              
              {/* CTA Button - visible on larger screens */}
              <li className="nav-item ms-lg-3 mt-3 mt-lg-0 d-none d-lg-block">
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

      {/* Spacer for fixed navbar - FIXED HEIGHT CALCULATION */}
      <div
        style={{
          height: `${navbarHeight}px`,
          transition: "height 0.25s ease-in-out",
          margin: 0,
          padding: 0,
          background: "transparent",
        }}
        aria-hidden="true"
        className="navbar-spacer"
      ></div>

      {/* Enhanced Styles */}
      <style>{`
        /* Navbar Base Styles */
        .navbar {
          z-index: 1030;
        }
        
        /* Spacer fix - ensures no background color shows */
        .navbar-spacer {
          display: block;
          visibility: hidden;
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
          font-size: 0.95rem;
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
        
        /* Hamburger Menu */
        .hamburger-menu {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 2rem;
          height: 1.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 10;
        }
        
        .hamburger-line {
          width: 2rem;
          height: 0.2rem;
          background: #40E0D0;
          border-radius: 10px;
          transition: all 0.3s cubic-bezier(0.68, -0.6, 0.32, 1.6);
          position: relative;
        }
        
        .hamburger-menu.active .hamburger-line:first-child {
          transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger-menu.active .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: translateX(-10px);
        }
        
        .hamburger-menu.active .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }
        
        /* Responsive Styles */
        @media (max-width: 991.98px) {
          .hamburger-menu {
            display: flex;
          }
          
          .navbar-collapse {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(0, 48, 135, 0.98);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
            border-radius: 0 0 16px 16px;
            margin-top: 0;
            transform: translateY(-10px);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          
          .navbar-collapse.show {
            max-height: calc(100vh - 80px);
            opacity: 1;
            transform: translateY(0);
            padding: 1rem 0;
            overflow-y: auto;
          }
          
          .navbar-nav {
            padding: 0.5rem 1rem 1.5rem;
          }
          
          .nav-item {
            margin: 0.25rem 0;
            width: 100%;
          }
          
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
          }
          
          /* Mobile CTA Button */
          .navbar-collapse.show .nav-item:last-child {
            display: block !important;
            margin-top: 0 !important;
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
            height: 42px !important;
          }
          
          .brand-name {
            font-size: 1.4rem !important;
          }
          
          .brand-tagline {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;