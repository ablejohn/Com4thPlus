import React, { useState } from "react";
import { MdEmail, MdCheck, MdError, MdArrowForward } from "react-icons/md";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="position-relative py-5">
      {/* Gradient Background */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "linear-gradient(135deg, #001f52 0%, #003087 50%, #004299 100%)",
          zIndex: -2,
        }}
      />

      {/* Subtle Decorative Elements */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.03) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.03) 0%, transparent 20%)",
          zIndex: -1,
        }}
      />
      
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            {/* Icon Container with Envelope */}
            <div 
              className="d-inline-block mb-4 p-3 rounded-circle"
              style={{
                background: "rgba(64,224,208,0.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(64,224,208,0.18)",
              }}
            >
              <MdEmail 
                size={32} 
                className="text-white"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
              />
            </div>

            {/* Header - Updated with new content */}
            <h2 
              className="text-white mb-3 display-5 fw-bold"
              style={{ 
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                letterSpacing: "-0.02em",
              }}
            >
              Stay Updated – Subscribe to Our Exclusive Newsletter!
            </h2>
            <p 
              className="text-white-50 mb-4 lead"
              style={{ 
                maxWidth: "600px", 
                margin: "0 auto",
                fontSize: "1.1rem",
                lineHeight: "1.6",
              }}
            >
              Get early access to luxury listings, special offers, and expert insights.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div
                className="input-group input-group-lg mx-auto position-relative"
                style={{ 
                  maxWidth: "580px",
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
                }}
              >
                <input
                  type="email"
                  className={`form-control border-0 ${status === "error" ? "is-invalid" : ""}`}
                  placeholder="Enter your email address"
                  aria-label="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") {
                      setStatus("idle");
                      setErrorMessage("");
                    }
                  }}
                  style={{
                    borderRadius: "8px 0 0 8px",
                    padding: "1.25rem 1.5rem",
                    fontSize: "1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                    letterSpacing: "0.01em",
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.05), 0 0 0 2px rgba(64,224,208,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.05)";
                  }}
                  disabled={status === "loading" || status === "success"}
                />
                <button
                  className="btn btn-lg px-4 fw-bold d-flex align-items-center justify-content-center"
                  type="submit"
                  style={{
                    borderRadius: "0 8px 8px 0",
                    transition: "all 0.2s ease",
                    backgroundColor: status === "success" ? "#28a745" : "#40E0D0",
                    border: "none",
                    minWidth: "160px",
                    color: "#003060",
                    fontSize: "1rem",
                    fontWeight: "600",
                    padding: "0.75rem 1.25rem",
                  }}
                  disabled={status === "loading" || status === "success"}
                  onMouseEnter={(e) => {
                    if (status !== "success") {
                      e.currentTarget.style.backgroundColor = "#36CFC0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (status !== "success") {
                      e.currentTarget.style.backgroundColor = "#40E0D0";
                    }
                  }}
                >
                  {status === "loading" && (
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  {status === "success" ? (
                    <>
                      <MdCheck size={20} className="me-2" />
                      Subscribed
                    </>
                  ) : (
                    <>
                      Subscribe Now
                      <MdArrowForward size={20} className="ms-2" />
                    </>
                  )}
                </button>
              </div>
              
              {/* Error Message */}
              {status === "error" && (
                <div 
                  className="mt-3 px-3 py-2 rounded-2 d-flex align-items-center justify-content-center"
                  role="alert"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "#ff8888",
                    maxWidth: "580px",
                    margin: "0 auto",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255, 136, 136, 0.15)",
                    fontSize: "0.9rem",
                  }}
                >
                  <MdError className="me-2" size={16} />
                  {errorMessage}
                </div>
              )}
            </form>

            {/* Success Message */}
            {status === "success" && (
              <div 
                className="mt-3 px-3 py-2 rounded-2 d-inline-flex align-items-center"
                role="alert"
                style={{
                  backgroundColor: "rgba(64, 224, 208, 0.08)",
                  color: "#40E0D0",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(64, 224, 208, 0.15)",
                  fontSize: "0.9rem",
                }}
              >
                <MdCheck className="me-2" size={18} />
                Welcome aboard! Check your inbox for exclusive property updates.
              </div>
            )}

            {/* Trust Indicators with checkmarks */}
            <div className="mt-4 pt-1">
              <div 
                className="d-flex align-items-center justify-content-center gap-4 text-white-50"
                style={{ fontSize: "0.9rem", letterSpacing: "0.02em" }}
              >
                <span>
                  <MdCheck className="text-info me-1" size={16} /> Weekly Updates
                </span>
                <span>
                  <MdCheck className="text-info me-1" size={16} /> Exclusive Deals
                </span>
                <span>
                  <MdCheck className="text-info me-1" size={16} /> No Spam
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;