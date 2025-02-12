import React from "react";

const Newsletter = () => {
  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#003087",
        backgroundImage: "linear-gradient(135deg, #003087 0%, #004299 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            {/* Section Header */}
            <h2 className="text-white mb-4 display-5 fw-bold">
              Get Special Offers
            </h2>
            <p className="text-white-50 mb-5 lead">
              Subscribe to our newsletter and receive exclusive deals on luxury
              stays
            </p>

            {/* Newsletter Form */}
            <div
              className="input-group mb-3 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              <input
                type="email"
                className="form-control form-control-lg border-0 shadow-none"
                placeholder="Enter your email"
                style={{
                  borderRadius: "12px 0 0 12px",
                  padding: "1rem",
                  fontSize: "1.1rem",
                }}
              />
              <button
                className="btn btn-warning btn-lg px-5 fw-bold"
                style={{
                  borderRadius: "0 12px 12px 0",
                  transition: "all 0.3s ease",
                  backgroundColor: "#FFD700",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFA500";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFD700";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Subscribe
              </button>
            </div>

            {/* Additional Text */}
            <p className="text-white-50 small mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;