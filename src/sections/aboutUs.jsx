import React, { useState } from "react";
import { Star, MapPin, Home, Shield, Zap, ChevronRight } from "lucide-react";
import Apartment1 from "../assets/appartment1.jpg";
import BookingModal from "../components/bookingModal";

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-4 py-md-5 bg-light">
      <div className="container py-3 py-md-5">
        <div className="row align-items-center">
          {/* Image Column - Full width on mobile, half on larger screens */}
          <div className="col-12 col-lg-6 mb-5 mb-lg-0">
            <div className="position-relative">
              <img
                src={Apartment1}
                alt="Luxury Apartment Interior"
                className="img-fluid rounded-4 shadow w-100"
                style={{ objectFit: "cover", height: "auto" }}
              />
              <div
                className="position-absolute bottom-0 end-0 bg-white p-3 p-md-4 rounded-4 shadow-lg m-2 m-md-4"
                style={{
                  maxWidth: "180px",
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <Star className="text-warning me-2" size={18} />
                  <span className="text-dark fw-bold">Premium</span>
                </div>
                <h5 className="mb-0 fs-6 fs-md-5">Luxury Experience</h5>
                <p className="text-muted mb-0 small">Since 2020</p>
              </div>
            </div>
          </div>

          {/* Content Column - Full width on mobile, half on larger screens */}
          <div className="col-12 col-lg-6 px-4 px-lg-3">
            <div className="text-center text-lg-start">
              <div className="bg-primary bg-opacity-10 text-primary d-inline-block px-3 py-2 rounded-pill mb-4">
                <span className="text-uppercase fw-bold small">
                  About Com4thPLUS
                </span>
              </div>
              <h2 className="display-6 display-md-5 fw-bold mb-4">
                Experience Luxury Living in the Heart of GRA Ikeja
              </h2>
              <p className="lead mb-4">
                Com4thplus provides premier luxury apartments located in the
                prestigious GRA Ikeja, Lagos, Nigeria. Our meticulously designed
                3, 4, and 5-bedroom apartments offer an exquisite experience for
                short-term rentals and Airbnb stays.
              </p>
            </div>

            {/* Feature cards - More responsive spacing and sizing */}
            <div className="feature-cards">
              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start text-center text-md-start mb-4">
                <div className="bg-white rounded-circle p-3 shadow-sm mb-3 mb-md-0 me-md-4">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h5 className="mb-1 fs-5">Prime Location</h5>
                  <p className="text-muted mb-0 small">
                    Minutes from airports, restaurants, and entertainment
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start text-center text-md-start mb-4">
                <div className="bg-white rounded-circle p-3 shadow-sm mb-3 mb-md-0 me-md-4">
                  <Home className="text-primary" size={24} />
                </div>
                <div>
                  <h5 className="mb-1 fs-5">Luxury Accommodations</h5>
                  <p className="text-muted mb-0 small">
                    All en-suite rooms with elegant furnishings
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start text-center text-md-start mb-4">
                <div className="bg-white rounded-circle p-3 shadow-sm mb-3 mb-md-0 me-md-4">
                  <Shield className="text-primary" size={24} />
                </div>
                <div>
                  <h5 className="mb-1 fs-5">Premium Security</h5>
                  <p className="text-muted mb-0 small">
                    Gated estate with 24/7 security services
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start text-center text-md-start mb-4">
                <div className="bg-white rounded-circle p-3 shadow-sm mb-3 mb-md-0 me-md-4">
                  <Zap className="text-primary" size={24} />
                </div>
                <div>
                  <h5 className="mb-1 fs-5">Modern Amenities</h5>
                  <p className="text-muted mb-0 small">
                    24/7 power, high-speed internet, smart home tech
                  </p>
                </div>
              </div>
            </div>

            {/* Button - Centered on mobile, left-aligned on desktop */}
            <div className="text-center text-lg-start mt-4 mt-md-5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary py-2 py-md-3 px-4 px-md-5 d-inline-flex align-items-center justify-content-center gap-2"
                style={{
                  background: "linear-gradient(to right, #003087, #004299)",
                  border: "none",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                }}
              >
                Book Your Stay
                <ChevronRight size={18} />
              </button>
            </div>

            <BookingModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;