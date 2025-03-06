import React, { useState, useEffect, useCallback } from "react";
import { Search, Calendar, Shield, Wifi, Battery, Home } from "lucide-react";
import Apartment1 from "../assets/appartment1.jpg";
import Apartment2 from "../assets/appartment2.jpg";
import Apartment3 from "../assets/appartment3.jpg";
import Apartment4 from "../assets/appartment4.jpeg";
import FeaturedProperties from "../sections/fproperties";
import WhyChooseUs from "../sections/whychooseus";
import TestimonialsSection from "../sections/testimonial";
import Newsletter from "../sections/newsletter";
import AboutUs from "../sections/aboutUs";

const HomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [Apartment1, Apartment2, Apartment3, Apartment4];
  
  // Image carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  // Features displayed in quick stats section
  const quickStats = [
    { icon: <Shield size={24} />, count: "100%", label: "Secure Premises" },
    { icon: <Wifi size={24} />, count: "1 Gbps", label: "High-Speed WiFi" },
    { icon: <Battery size={24} />, count: "24/7", label: "Power Backup" },
    { icon: <Home size={24} />, count: "15+", label: "Premium Locations" },
  ];

  return (
    <div className="min-vh-100 overflow-hidden m-0 p-0">
      {/* Hero Section with Image Carousel */}
      <section id="home" className="position-relative vh-100">
        {/* Image Carousel */}
        {images.map((img, index) => (
          <div
            key={index}
            className="position-absolute w-100 h-100 top-0 start-0"
            style={{
              opacity: currentImage === index ? 1 : 0,
              transition: "opacity 1.5s ease-in-out, transform 2s ease-in-out",
              transform: `scale(${currentImage === index ? 1 : 1})`,
              zIndex: 1,
            }}
          >
            <img
              src={img}
              alt={`Luxury apartment ${index + 1}`}
              className="w-100 h-100 object-fit-cover"
              style={{ filter: "brightness(0.6)" }}
            />
          </div>
        ))}
        {/* Gradient Overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7))",
            zIndex: 2
          }}
        ></div>

        {/* Hero Content */}
        <div className="container position-relative h-100 d-flex flex-column justify-content-center align-items-center" style={{ zIndex: 3 }}>
          <div className="text-center">
            <div className="bg-primary bg-opacity-25 text-info d-inline-block px-3 py-2 rounded-pill mb-4 upp">
              <span className="text-uppercase fw-bold small " style={{ color: "#40E0D0" }}>
                Welcome to COM4thPLUS
              </span>
            </div>
            
            <h1 className="display-3 fw-bold text-white mb-4">
              A Stay That Feels Like Home -
              <br />
              <span style={{ color: "#40E0D0" }}>
                Extra Comfort
              </span>
            </h1>
            
            <p className="lead text-white-50 mb-5 mx-auto" style={{ maxWidth: "800px" }}>
              Fully furnished apartments with 24/7 electricity, high-speed WiFi, and top-tier security for a hassle-free stay
            </p>

            {/* Quick Stats */}
            

            {/* Search Form */}
            <div className="bg-white p-4 rounded-4 shadow-lg mx-auto" style={{ maxWidth: "800px" }}>
             
              
              <div className="row g-3">
                {/* Check-in Date */}
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-bold text-secondary mb-2">Check-in Date</label>
                  <div className="input-group">
                    <span className="input-group-text border-0 bg-light">
                      <Calendar size={18} className="text-primary" />
                    </span>
                    <input
                      type="date"
                      className="form-control border-0 bg-light"
                      placeholder="mm/dd/yyyy"
                    />
                  </div>
                </div>
                
                {/* Check-out Date */}
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-bold text-secondary mb-2">Check-out Date</label>
                  <div className="input-group">
                    <span className="input-group-text border-0 bg-light">
                      <Calendar size={18} className="text-primary" />
                    </span>
                    <input
                      type="date"
                      className="form-control border-0 bg-light"
                      placeholder="mm/dd/yyyy"
                    />
                  </div>
                </div>
                
                {/* Search Button */}
                <div className="col-12 col-md-4">
                  <label className="form-label opacity-0 d-none d-md-block small mb-2">Submit</label>
                  <button
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      background: "linear-gradient(to right, #003087, #004299)",
                      border: "none",
                      transition: "all 0.3s ease",
                      height: "40px"
                    }}
                  >
                    <Search size={18} />
                    <span className="fw-semibold">Check Availability</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Down Indicator */}
       
      </section>

      {/* About Us Section */}
      <section id="about" className=" bg-light">
        <AboutUs />
      </section>

      {/* Why Choose Us Section */}
      <section id="features" className="">
        <WhyChooseUs />
      </section>


      {/* Testimonials Section */}
      <section id="testimonials" className="">
        <TestimonialsSection />
      </section>

      {/* Newsletter Section */}
      <section id="contact" className=" text-white">
        <Newsletter />
      </section>

      {/* Global Styles */}
      <style jsx global>{`
        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
        
        .bg-opacity-25 {
          --bs-bg-opacity: 0.25;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
        
        .animate__bounce {
          animation: bounce 2s infinite;
        }
        
        .btn-primary {
          background-color: #003087;
          border-color: #003087;
        }
        
        .btn-primary:hover {
          background-color: #002366;
          border-color: #002366;
          transform: translateY(-2px);
        }
        
        .text-info {
          color: #40E0D0 !important;
        }
        
        .object-fit-cover {
          object-fit: cover;
        }
           @media (max-width: 767.98px) {
          
          
          /* Add space for fixed mobile navigation */
          .upp {
            margin-top: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;