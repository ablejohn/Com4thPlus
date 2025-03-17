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
  Send,
} from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { label: "About Us", href: "" },
    { label: "Properties", href: "" },
    { label: "Contact", href: "" },
  ];

  const propertyTypes = [{ label: "Premium Apartments", href: "#" }];

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
      className="pb-4"
      style={{
        background: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        color: "#ffffff",
      }}
    >
      <div className="container">
        <div className="row g-4">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="pe-lg-5">
              <h3 className="mb-4">
                <span className="text-white">Com4th</span>
                <span style={{ color: "#40E0D0" }}>Plus</span>
              </h3>
              <p className="text-white-50 mb-4">
                Elevating the standard of luxury accommodation worldwide.
                Experience unparalleled comfort and exceptional service in our
                handpicked properties across the globe.
              </p>
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <Mail size={18} className="text-primary me-3" />
                  <span className="text-white-50">info@com4thplus.com</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Phone size={18} className="text-primary me-3" />
                  <span className="text-white-50">0814 318 3494</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <MapPin size={18} className="text-primary me-3" />
                  <span className="text-white-50">
                    6C Oduduwa Street, Near Bon Hotel, GRA Ikeja, Lagos
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <Clock size={18} className="text-primary me-3" />
                  <span className="text-white-50">24/7 Customer Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white mb-4 fs-5">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              {quickLinks.map((link, index) => (
                <li key={index} className="mb-3">
                  <a
                    href={link.href}
                    className="text-white-50 text-decoration-none"
                    style={{ transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#FFD700";
                      e.target.style.paddingLeft = "10px";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "";
                      e.target.style.paddingLeft = "0";
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white mb-4 fs-5">Our Properties</h6>
            <ul className="list-unstyled mb-0">
              {propertyTypes.map((type, index) => (
                <li key={index} className="mb-3">
                  <a
                    href={type.href}
                    className="text-white-50 text-decoration-none"
                    style={{ transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#FFD700";
                      e.target.style.paddingLeft = "10px";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "";
                      e.target.style.paddingLeft = "0";
                    }}
                  >
                    {type.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white mb-4 fs-5">Newsletter</h6>
            <p className="text-white-50 mb-4">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <div className="position-relative mb-4">
              <input
                type="email"
                className="form-control bg-dark border-0 text-white py-3"
                placeholder="Your email address"
                style={{ paddingRight: "50px" }}
              />
              <button
                className="btn position-absolute end-0 top-0 h-100 d-flex align-items-center"
                style={{ color: "#40E0D0" }}
              >
                <Send size={20} />
              </button>
            </div>
            <div className="d-flex gap-3">
              <a
                href="#"
                className="btn btn-dark d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#40E0D0";
                  e.currentTarget.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#212529";
                  e.currentTarget.style.color = "#fff";
                }}
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="btn btn-dark d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#40E0D0";
                  e.currentTarget.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#212529";
                  e.currentTarget.style.color = "#fff";
                }}
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="btn btn-dark d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#40E0D0";
                  e.currentTarget.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#212529";
                  e.currentTarget.style.color = "#fff";
                }}
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <hr
          className="my-5"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-white-50">
              <small
                onClick={handleCopyrightClick}
                style={{ cursor: "default" }}
              >
                &copy; {new Date().getFullYear()} Com4thPlus. All rights
                reserved.
              </small>
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="#" className="text-white-50 text-decoration-none small">
                Privacy Policy
              </a>
              <span className="text-white-50">•</span>
              <a href="#" className="text-white-50 text-decoration-none small">
                Terms of Service
              </a>
              <span className="text-white-50">•</span>
              <a href="#" className="text-white-50 text-decoration-none small">
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
