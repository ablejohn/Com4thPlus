import React, { useState, useEffect } from "react";
import { Search, Calendar, MapPin, ChevronRight, Star } from "lucide-react";
import Apartment1 from "../assets/appartment1.jpg";
import Apartment2 from "../assets/appartment2.jpg";
import Apartment3 from "../assets/appartment3.jpg";
import FeaturedProperties from "../sections/fproperties";
import WhyChooseUs from "../sections/whychooseus";
import TestimonialsSection from "../sections/testimonial";
import Newsletter from "../sections/newsletter";

const LandingPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const images = [Apartment1, Apartment2, Apartment3];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="position-relative vh-100">
        {images.map((img, index) => (
          <div
            key={index}
            className="position-absolute w-100 h-100"
            style={{
              opacity: currentImage === index ? 1 : 0,
              transition: "opacity 1.5s ease-in-out, transform 1.5s ease-in-out",
              transform: currentImage === index ? "scale(1.05)" : "scale(1)",
            }}
          >
            <img
              src={img}
              alt={`Luxury interior ${index + 1}`}
              className="w-100 h-100 object-fit-cover"
              style={{ filter: "brightness(0.7)" }}
            />
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7))",
              }}
            />
          </div>
        ))}
        <div className="container position-relative h-100 d-flex justify-content-center align-items-center">
          <div className="text-center text-white">
            <div className="bg-primary bg-opacity-25 text-warning d-inline-block px-3 py-2 rounded-pill mb-4">
              <span className="text-uppercase fw-bold small">
                Welcome to COM4thPLUS
              </span>
            </div>
            <h1
              className="display-2 fw-bold mb-4"
              style={{ letterSpacing: "-1px" }}
            >
              Discover Your Perfect
              <br />
              <span className="text-gradient">Luxury Residence</span>
            </h1>
            <p
              className="lead mb-5 text-white-50"
              style={{ fontSize: "1.25rem" }}
            >
              Experience unparalleled comfort in our exclusive apartments,
              where luxury meets exceptional service.
            </p>
            {/* Search Form */}
            <div
              className="bg-white p-4 rounded-4 shadow-lg mt-5 mb-5 mx-auto"
              style={{
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.95)",
                maxWidth: "800px",
              }}
            >
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="input-group border rounded-3 overflow-hidden">
                    <span className="input-group-text border-0 bg-transparent">
                      <Calendar size={20} className="text-primary" />
                    </span>
                    <input
                      type="date"
                      className="form-control border-0 shadow-none py-3"
                      onFocus={(e) =>
                        e.target.showPicker && e.target.showPicker()
                      }
                      placeholder="Check-in"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="input-group border rounded-3 overflow-hidden">
                    <span className="input-group-text border-0 bg-transparent">
                      <Calendar size={20} className="text-primary" />
                    </span>
                    <input
                      type="date"
                      className="form-control border-0 shadow-none py-3"
                      onFocus={(e) =>
                        e.target.showPicker && e.target.showPicker()
                      }
                      placeholder="Check-out"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <button
                    className="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      background:
                        "linear-gradient(to right, #003087, #004299)",
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
                    <Search size={20} />
                    <span className="fw-semibold">Check Availability</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <FeaturedProperties />
     

      {/* Why Choose Us Section */}
      <WhyChooseUs />
      

      {/* Testimonials Section */}
      <TestimonialsSection />
      

      {/* Newsletter Section */}
      <Newsletter />
  

      {/* Custom Styles */}
      <style jsx>{`
        .text-gradient {
          background: linear-gradient(to right, #ffd700, #ffa500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .input-group:focus-within {
          border-color: #004299 !important;
          box-shadow: 0 0 0 0.2rem rgba(0, 66, 153, 0.25);
        }
        .btn-primary:hover {
          background: linear-gradient(to right, #004299, #003087) !important;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;