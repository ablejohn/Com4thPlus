import React, { useState, useEffect, useCallback } from "react";
import { MdHome, MdLocationOn, MdPhone } from "react-icons/md";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for active link tracking
import logo from "../assets/logo.png";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Track current route for active link

  // Handle scroll event to toggle navbar background
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Navbar items
  const navItems = [
    { icon: <MdHome size={22} />, label: "Properties", href: "/properties" },
    { icon: <MdLocationOn size={22} />, label: "Locations", href: "/location" },
    { icon: <MdPhone size={22} />, label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg fixed-top ${
          scrolled ? "shadow-lg" : ""
        }`}
        style={{
          background: scrolled
            ? "rgba(0,48,135,0.98)"
            : "linear-gradient(180deg, rgba(0,48,135,0.98) 0%, rgba(0,48,135,0.85) 100%)",
          transition: "all 0.3s ease-in-out",
          padding: scrolled ? "0.75rem 0" : "1.25rem 0",
        }}
        aria-label="Main navigation"
      >
        <div className="container">
          {/* Logo and Brand */}
          <Link
            className="navbar-brand d-flex align-items-center"
            to="/"
            aria-label="Go to homepage"
            style={{ transform: "translateY(2px)" }}
          >
            <img
              src={logo}
              alt="Com4thPlus Logo"
              style={{
                height: scrolled ? "55px" : "65px",
                transition: "all 0.3s ease-in-out",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
              className="me-3"
            />
            <div className="d-flex flex-column">
              <span
                className="fs-2 fw-bold mb-0 lh-1"
                style={{
                  letterSpacing: "-0.5px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <span className="text-white">Com4th</span>
                <span
                  style={{
                    color: "#FFD700",
                    textShadow: "0 2px 4px rgba(255,215,0,0.2)",
                  }}
                >
                  Plus
                </span>
              </span>
              <span
                className="text-white-50 fs-6 fw-light"
                style={{
                  fontSize: "0.9rem",
                  opacity: scrolled ? 0 : 1,
                  transition: "opacity 0.3s ease-in-out",
                  transform: "translateY(-2px)",
                }}
              >
                Your Home Away from Home
              </span>
            </div>
          </Link>

          {/* Navbar Toggler */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ padding: "0.5rem" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div
            className={`collapse navbar-collapse ${
              isMobileMenuOpen ? "show" : ""
            }`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto">
              {navItems.map((item, index) => (
                <li className="nav-item mx-1" key={index}>
                  <Link
                    className={`nav-link d-flex align-items-center px-3 py-2 position-relative ${
                      location.pathname === item.href ? "active" : ""
                    }`}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      color: "white",
                      transition: "all 0.3s ease",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.transform = "translateY(0)";
                    }}
                    aria-current={location.pathname === item.href ? "page" : undefined}
                  >
                    <span
                      className="me-2 d-flex align-items-center"
                      style={{
                        color: "#FFD700",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="fw-medium">{item.label}</span>
                    {location.pathname === item.href && (
                      <span
                        className="position-absolute bottom-0 start-0"
                        style={{
                          height: "2px",
                          width: "100%",
                          backgroundColor: "#FFD700",
                          transition: "all 0.3s ease",
                        }}
                      ></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div
        style={{
          height: scrolled ? "75px" : "90px",
          transition: "height 0.3s ease-in-out",
          marginBottom: "1.5rem",
        }}
      ></div>
    </>
  );
};

export default Navigation;