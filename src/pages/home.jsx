import React, { useState, useEffect } from "react";
import { Search, Calendar, MapPin, ChevronRight, Star } from "lucide-react";
import Apartment1 from "../assets/appartment1.jpg";
import Apartment2 from "../assets/appartment2.jpg";
import Apartment3 from "../assets/appartment3.jpg";
import Apartment4 from "../assets/appartment4.jpeg";
import FeaturedProperties from "../sections/fproperties";
import WhyChooseUs from "../sections/whychooseus";
import TestimonialsSection from "../sections/testimonial";
import Newsletter from "../sections/newsletter";
import AboutUs from "../sections/aboutUs";

const LandingPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const images = [Apartment1, Apartment2, Apartment3, Apartment4];

  useEffect(() => {
    // Remove any default margins and padding from body and html
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Reset styles when component unmounts
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="overflow-hidden m-0 p-0" style={{ display: 'block' }}>
      {/* Hero Section */}
      <div className="position-relative vh-100 m-0 p-0" style={{ marginTop: 0, paddingTop: 0 }}>
        {images.map((img, index) => (
          <div
            key={index}
            className="position-absolute w-100 h-100 top-0 start-0"
            style={{
              opacity: currentImage === index ? 1 : 0,
              transition: "opacity 1.5s ease-in-out, transform 1.5s ease-in-out",
              transform: currentImage === index ? "scale(1)" : "scale(1)",
              zIndex: 1,
            }}
          >
            <img
              src={img}
              alt={`Luxury interior ${index + 1}`}
              className="w-100 h-100 object-fit-cover"
              style={{ 
                filter: "brightness(0.7)",
              }}
            />
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7))",
              }}
            />
          </div>
        ))}
        <div className="container position-relative h-100 d-flex justify-content-center align-items-center" style={{ zIndex: 2 }}>
          <div className="text-center text-white">
            <div className="bg-primary bg-opacity-25 text-warning d-inline-block px-3 py-2 rounded-pill mb-4">
              <span
                className="text-uppercase fw-bold small"
                style={{ color: "#40E0D0" }}
              >
                Welcome to COM4thPLUS
              </span>
            </div>
            <h1
              className="display-2 fw-bold mb-4"
              style={{ letterSpacing: "-1px" }}
            >
              Discover Your Perfect
              <br />
              <span className="gradient-text">
                Luxury Residence
              </span>
            </h1>
            <p
              className="lead mb-5 text-white-50"
              style={{ fontSize: "1.25rem" }}
            >
              Experience unparalleled comfort in our exclusive apartments, where
              luxury meets exceptional service.
            </p>

            {/* Search Form */}
            <div
              className="bg-white p-4 rounded-4 shadow-lg mx-auto"
              style={{
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.95)",
                maxWidth: "800px",
              }}
            >
              <div className="row g-3 align-items-end">
                {/* Check-in Date */}
                <div className="col-12 col-md-4">
                  <div className="d-flex flex-column">
                    <label className="small fw-bold text-dark mb-1">
                      Check-in
                    </label>
                    <div className="input-group border rounded-3 overflow-hidden">
                      <span className="input-group-text border-0 bg-transparent pe-0">
                        <Calendar size={20} className="text-primary" />
                      </span>
                      <input
                        type="date"
                        className="form-control border-0 shadow-none py-3 ps-2"
                        placeholder="mm/dd/yyyy"
                        id="checkin-date"
                      />
                    </div>
                  </div>
                </div>
                {/* Check-out Date */}
                <div className="col-12 col-md-4">
                  <div className="d-flex flex-column">
                    <label className="small fw-bold text-dark mb-1">
                      Check-out
                    </label>
                    <div className="input-group border rounded-3 overflow-hidden">
                      <span className="input-group-text border-0 bg-transparent pe-0">
                        <Calendar size={20} className="text-primary" />
                      </span>
                      <input
                        type="date"
                        className="form-control border-0 shadow-none py-3 ps-2"
                        placeholder="mm/dd/yyyy"
                        id="checkout-date"
                      />
                    </div>
                  </div>
                </div>
                {/* Search Button */}
                <div className="col-12 col-md-4">
                  <div className="d-flex flex-column">
                    {/* Empty label for spacing alignment */}
                    <label className="small fw-bold text-dark mb-1 d-none d-md-block">
                      &nbsp;
                    </label>
                    <button
                      className="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                      style={{
                        background: "linear-gradient(to right, #003087, #004299)",
                        border: "none",
                        transition: "transform 0.3s ease",
                        height: "56px", // Match input height
                      }}
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
      </div>
      
      {/* About us Section */}
      <AboutUs />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Featured Properties Section */}
      <FeaturedProperties />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Custom Styles */}
      <style jsx>{`
        .gradient-text {
          color: #40E0D0;
          background: linear-gradient(to right, #40E0D0, rgb(116, 128, 129));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .input-group:focus-within {
          border-color: #004299 !important;
          box-shadow: 0 0 0 0.2rem rgba(0, 66, 153, 0.25);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          background: linear-gradient(to right, #004299, #003087) !important;
        }
      `}</style>

      {/* Global styles to remove any default spacing */}
      <style jsx global>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        #root, #__next {
          margin: 0 !important;
          padding: 0 !important;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;