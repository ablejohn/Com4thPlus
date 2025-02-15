import React from "react";
import { Star, MapPin, Home, Shield, Zap, ChevronRight } from "lucide-react";
import Apartment1 from "../assets/appartment1.jpg";

const AboutUs = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="position-relative">
              <img
                src={Apartment1}
                alt="Luxury Apartment Interior"
                className="img-fluid rounded-4 shadow"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
              <div
                className="position-absolute bottom-0 end-0 bg-white p-4 rounded-4 shadow-lg m-4"
                style={{
                  maxWidth: "200px",
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <Star className="text-warning me-2" size={20} />
                  <span className="text-dark fw-bold">Premium</span>
                </div>
                <h5 className="mb-0">Luxury Experience</h5>
                <p className="text-muted mb-0">Since 2020</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="bg-primary bg-opacity-10 text-primary d-inline-block px-3 py-2 rounded-pill mb-4">
              <span className="text-uppercase fw-bold small">
                About Com4thPLUS
              </span>
            </div>
            <h2 className="display-5 fw-bold mb-4">
              Experience Luxury Living in the Heart of GRA Ikeja
            </h2>
            <p className="lead mb-4">
              Com4thplus provides premier luxury apartments located in the
              prestigious GRA Ikeja, Lagos, Nigeria. Our meticulously designed
              3, 4, and 5-bedroom apartments offer an exquisite experience for
              short-term rentals and Airbnb stays.
            </p>

            <div className="d-flex align-items-center mb-4">
              <div className="bg-white rounded-circle p-3 shadow-sm me-4">
                <MapPin className="text-primary" size={24} />
              </div>
              <div>
                <h5 className="mb-1">Prime Location</h5>
                <p className="text-muted mb-0">
                  Minutes from airports, restaurants, and entertainment
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center mb-4">
              <div className="bg-white rounded-circle p-3 shadow-sm me-4">
                <Home className="text-primary" size={24} />
              </div>
              <div>
                <h5 className="mb-1">Luxury Accommodations</h5>
                <p className="text-muted mb-0">
                  All en-suite rooms with elegant furnishings
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center mb-4">
              <div className="bg-white rounded-circle p-3 shadow-sm me-4">
                <Shield className="text-primary" size={24} />
              </div>
              <div>
                <h5 className="mb-1">Premium Security</h5>
                <p className="text-muted mb-0">
                  Gated estate with 24/7 security services
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <div className="bg-white rounded-circle p-3 shadow-sm me-4">
                <Zap className="text-primary" size={24} />
              </div>
              <div>
                <h5 className="mb-1">Modern Amenities</h5>
                <p className="text-muted mb-0">
                  24/7 power, high-speed internet, smart home tech
                </p>
              </div>
            </div>

            <a
              href="#contact"
              className="btn btn-primary mt-5 py-3 px-5 d-inline-flex align-items-center gap-2"
              style={{
                background: "linear-gradient(to right, #003087, #004299)",
                border: "none",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              Book Your Stay
              <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
