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

      {/* Decorative Elements */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.05) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.05) 0%, transparent 20%)",
          zIndex: -1,
        }}
      />
      
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            {/* Icon Container */}
            <div 
              className="d-inline-block mb-4 p-3 rounded-circle"
              style={{
                background: "linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.1) 100%)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,215,0,0.1)",
              }}
            >
              <MdEmail 
                size={32} 
                className="text-warning"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
              />
            </div>

            {/* Header Text */}
            <h2 
              className="text-white mb-3 display-5 fw-bold"
              style={{ 
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                letterSpacing: "-0.5px",
              }}
            >
              Discover Exceptional Properties
            </h2>
            <p 
              className="text-white-50 mb-5 lead px-3"
              style={{ 
                maxWidth: "550px", 
                margin: "0 auto",
                fontSize: "1.15rem",
                lineHeight: "1.6",
              }}
            >
              Join our exclusive newsletter and get first access to luxury properties, special offers, and expert insights.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div
                className="input-group input-group-lg mx-auto position-relative"
                style={{ 
                  maxWidth: "550px",
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                }}
              >
                <input
                  type="email"
                  className={`form-control border-0 ${status === "error" ? "is-invalid" : ""}`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") {
                      setStatus("idle");
                      setErrorMessage("");
                    }
                  }}
                  style={{
                    borderRadius: "16px 0 0 16px",
                    padding: "1.25rem 1.75rem",
                    fontSize: "1.1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                  }}
                  disabled={status === "loading" || status === "success"}
                />
                <button
                  className="btn btn-lg px-5 fw-bold d-flex align-items-center justify-content-center"
                  style={{
                    borderRadius: "0 16px 16px 0",
                    transition: "all 0.3s ease",
                    backgroundColor: status === "success" ? "#28a745" : "#FFD700",
                    border: "none",
                    minWidth: "180px",
                    color: "#000",
                    fontSize: "1.1rem",
                  }}
                  disabled={status === "loading" || status === "success"}
                  onMouseEnter={(e) => {
                    if (status !== "success") {
                      e.currentTarget.style.backgroundColor = "#FFC000";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (status !== "success") {
                      e.currentTarget.style.backgroundColor = "#FFD700";
                      e.currentTarget.style.transform = "translateY(0)";
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
                      <MdCheck size={24} className="me-2" />
                      Subscribed
                    </>
                  ) : (
                    <>
                      Subscribe
                      <MdArrowForward size={24} className="ms-2" />
                    </>
                  )}
                </button>
              </div>
              
              {/* Error Message */}
              {status === "error" && (
                <div 
                  className="mt-3 px-4 py-2 rounded-3"
                  style={{
                    backgroundColor: "rgba(220, 53, 69, 0.1)",
                    color: "#ff8888",
                    maxWidth: "550px",
                    margin: "0 auto",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(220, 53, 69, 0.2)",
                  }}
                >
                  <MdError className="me-2" size={18} />
                  {errorMessage}
                </div>
              )}
            </form>

            {/* Success Message */}
            {status === "success" && (
              <div 
                className="mt-3 px-4 py-3 rounded-3 d-inline-block"
                style={{
                  backgroundColor: "rgba(40, 167, 69, 0.1)",
                  color: "#98ff98",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(40, 167, 69, 0.2)",
                }}
              >
                <MdCheck className="me-2" size={20} />
                Welcome aboard! Check your inbox for exclusive property updates.
              </div>
            )}

            {/* Trust Indicators */}
            <div className="mt-4 pt-2">
              <div 
                className="d-flex align-items-center justify-content-center gap-4 text-white-50"
                style={{ fontSize: "0.9rem" }}
              >
                <span>
                  <MdCheck className="text-warning me-1" /> Weekly Updates
                </span>
                <span>
                  <MdCheck className="text-warning me-1" /> Exclusive Deals
                </span>
                <span>
                  <MdCheck className="text-warning me-1" /> No Spam
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