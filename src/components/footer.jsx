import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Clock,
  Star,
  Home
} from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { label: "About Us", href: "#" },
    { label: "Properties", href: "#" },
    { label: "Contact", href: "#" },
  ];

  // Hidden admin access - triple-click functionality
  const handleCopyrightClick = (() => {
    let clickCount = 0;
    let lastClickTime = 0;

    return () => {
      const currentTime = new Date().getTime();

      // Reset count if too much time has passed between clicks
      if (currentTime - lastClickTime > 500) {
        clickCount = 0;
      }

      clickCount++;
      lastClickTime = currentTime;

      // If triple-clicked, navigate to admin login
      if (clickCount === 3) {
        clickCount = 0;
        navigate("/admin/login");
      }
    };
  })();

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        color: "#ffffff",
        paddingTop: "4rem",
        paddingBottom: "1.5rem",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Subtle background pattern */}
      <div 
        className="position-absolute w-100 h-100" 
        style={{ 
          top: 0, 
          left: 0, 
          backgroundImage: "radial-gradient(circle at 20% 25%, rgba(64, 224, 208, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 75%, rgba(64, 224, 208, 0.02) 0%, transparent 50%)",
          zIndex: 0
        }}
      />
      
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row g-5">
          {/* Brand Column */}
          <div className="col-lg-5 col-md-6">
            <div className="pe-lg-5">
              <h3 className="mb-3 d-inline-flex align-items-center">
                <span 
                  className="text-white"
                  style={{ 
                    fontWeight: 600, 
                    letterSpacing: "-0.02em" 
                  }}
                >
                  Com4th
                </span>
                <span 
                  style={{ 
                    color: "#40E0D0", 
                    fontWeight: 700, 
                    letterSpacing: "-0.02em" 
                  }}
                >
                  Plus
                </span>
              </h3>
              
              <h5 
                className="mb-3" 
                style={{ 
                  fontSize: "1.05rem", 
                  fontWeight: 500, 
                  color: "rgba(255, 255, 255, 0.85)",
                  letterSpacing: "0.01em",
                  marginTop: "0.5rem"
                }}
              >
                Redefining Luxury Stays Worldwide
              </h5>
              
              <p 
                className="mb-4" 
                style={{ 
                  color: "rgba(255, 255, 255, 0.65)", 
                  lineHeight: 1.6,
                  fontSize: "0.95rem"
                }}
              >
                Experience <span style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}>unparalleled comfort</span> and <span style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}>exceptional service</span> with our carefully curated properties across the globe.
              </p>
              
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle me-3" 
                    style={{ 
                      width: "32px", 
                      height: "32px", 
                      backgroundColor: "rgba(64, 224, 208, 0.1)",
                      flexShrink: 0
                    }}
                  >
                    <Mail size={16} style={{ color: "#40E0D0" }} />
                  </div>
                  <span style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.95rem" }}>
                    <strong style={{ color: "#ffffff", fontWeight: 500 }}>info@com4thplus.com</strong>
                  </span>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle me-3" 
                    style={{ 
                      width: "32px", 
                      height: "32px", 
                      backgroundColor: "rgba(64, 224, 208, 0.1)",
                      flexShrink: 0
                    }}
                  >
                    <Phone size={16} style={{ color: "#40E0D0" }} />
                  </div>
                  <span style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.95rem" }}>
                    <strong style={{ color: "#ffffff", fontWeight: 500 }}>0814 318 3494</strong>
                  </span>
                </div>
                
                <div className="d-flex align-items-start mb-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle me-3 mt-1" 
                    style={{ 
                      width: "32px", 
                      height: "32px", 
                      backgroundColor: "rgba(64, 224, 208, 0.1)",
                      flexShrink: 0
                    }}
                  >
                    <MapPin size={16} style={{ color: "#40E0D0" }} />
                  </div>
                  <span style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                    <strong style={{ color: "#ffffff", fontWeight: 500 }}>6C Oduduwa Street, Near Bon Hotel, GRA Ikeja, Lagos</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Column */}
          <div className="col-lg-4 col-md-6">
            <h6 
              className="mb-4" 
              style={{ 
                fontSize: "1.05rem", 
                color: "#ffffff", 
                fontWeight: 600,
                letterSpacing: "0.01em"
              }}
            >
              Our Promise
            </h6>
            
            <div className="mb-4">
              <div 
                className="d-flex align-items-start p-3 mb-3 rounded" 
                style={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle me-3 mt-1" 
                  style={{ 
                    width: "36px", 
                    height: "36px", 
                    backgroundColor: "rgba(64, 224, 208, 0.1)",
                    flexShrink: 0
                  }}
                >
                  <Clock size={18} style={{ color: "#40E0D0" }} />
                </div>
                <div>
                  <span 
                    style={{ 
                      color: "#ffffff", 
                      fontWeight: 500, 
                      fontSize: "0.95rem", 
                      display: "block",
                      marginBottom: "0.25rem"
                    }}
                  >
                    24/7 Customer Support
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.85rem" }}>
                    Always available to assist you
                  </span>
                </div>
              </div>
              
              <div 
                className="d-flex align-items-start p-3 mb-3 rounded" 
                style={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle me-3 mt-1" 
                  style={{ 
                    width: "36px", 
                    height: "36px", 
                    backgroundColor: "rgba(64, 224, 208, 0.1)",
                    flexShrink: 0
                  }}
                >
                  <Home size={18} style={{ color: "#40E0D0" }} />
                </div>
                <div>
                  <span 
                    style={{ 
                      color: "#ffffff", 
                      fontWeight: 500, 
                      fontSize: "0.95rem", 
                      display: "block",
                      marginBottom: "0.25rem"
                    }}
                  >
                    Premium Short-Term Rentals
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.85rem" }}>
                    Luxury accommodations worldwide
                  </span>
                </div>
              </div>
              
              <div 
                className="d-flex align-items-start p-3 rounded" 
                style={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle me-3 mt-1" 
                  style={{ 
                    width: "36px", 
                    height: "36px", 
                    backgroundColor: "rgba(64, 224, 208, 0.1)",
                    flexShrink: 0
                  }}
                >
                  <Star size={18} style={{ color: "#40E0D0" }} />
                </div>
                <div>
                  <span 
                    style={{ 
                      color: "#ffffff", 
                      fontWeight: 500, 
                      fontSize: "0.95rem", 
                      display: "block",
                      marginBottom: "0.25rem"
                    }}
                  >
                    Exceptional Service
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.85rem" }}>
                    Personalized attention to detail
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links and Social */}
          <div className="col-lg-3 col-md-12">
            <h6 
              className="mb-4" 
              style={{ 
                fontSize: "1.05rem", 
                color: "#ffffff", 
                fontWeight: 600,
                letterSpacing: "0.01em"
              }}
            >
              Quick Links
            </h6>
            
            <div className="mb-4 d-flex flex-wrap gap-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="d-inline-flex align-items-center justify-content-center px-4 py-2 rounded"
                  style={{ 
                    transition: "all 0.25s ease",
                    backgroundColor: "rgba(64, 224, 208, 0.08)",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    border: "1px solid rgba(64, 224, 208, 0.15)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(64, 224, 208, 0.15)";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(64, 224, 208, 0.08)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            
            <h6 
              className="mb-3" 
              style={{ 
                fontSize: "1.05rem", 
                color: "#ffffff", 
                fontWeight: 600,
                letterSpacing: "0.01em"
              }}
            >
              Connect With Us
            </h6>
            
            <div className="d-flex gap-2 mb-4">
              <a
                href="#"
                className="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: "38px",
                  height: "38px",
                  transition: "all 0.25s ease",
                  backgroundColor: "rgba(64, 224, 208, 0.08)",
                  color: "#ffffff",
                  border: "1px solid rgba(64, 224, 208, 0.15)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(64, 224, 208, 0.15)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(64, 224, 208, 0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: "38px",
                  height: "38px",
                  transition: "all 0.25s ease",
                  backgroundColor: "rgba(64, 224, 208, 0.08)",
                  color: "#ffffff",
                  border: "1px solid rgba(64, 224, 208, 0.15)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(64, 224, 208, 0.15)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(64, 224, 208, 0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: "38px",
                  height: "38px",
                  transition: "all 0.25s ease",
                  backgroundColor: "rgba(64, 224, 208, 0.08)",
                  color: "#ffffff",
                  border: "1px solid rgba(64, 224, 208, 0.15)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(64, 224, 208, 0.15)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(64, 224, 208, 0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>

        <hr
          style={{ 
            margin: "2rem 0 1.5rem",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "none",
            height: "1px"
          }}
        />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p 
              className="mb-0" 
              style={{ 
                color: "rgba(255, 255, 255, 0.5)", 
                fontSize: "0.85rem"
              }}
            >
              <span
                onClick={handleCopyrightClick}
                style={{ cursor: "default" }}
              >
                © 2025 <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>Com4thPlus</strong>. All rights reserved.
              </span>
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a 
                href="#" 
                style={{ 
                  color: "rgba(255, 255, 255, 0.5)", 
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  transition: "color 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#40E0D0";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "rgba(255, 255, 255, 0.5)";
                }}
              >
                Privacy Policy
              </a>
              <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>•</span>
              <a 
                href="#" 
                style={{ 
                  color: "rgba(255, 255, 255, 0.5)", 
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  transition: "color 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#40E0D0";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "rgba(255, 255, 255, 0.5)";
                }}
              >
                Terms of Service
              </a>
              <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>•</span>
              <a 
                href="#" 
                style={{ 
                  color: "rgba(255, 255, 255, 0.5)", 
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  transition: "color 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#40E0D0";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "rgba(255, 255, 255, 0.5)";
                }}
              >
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;