import React, { useState, useEffect } from "react";
import { Search, Calendar, MapPin } from "lucide-react";
import Navigation from "../components/navigation";
import Apartment1 from "../assets/appartment1.jpg";
import Apartment2 from "../assets/appartment2.jpg";
import Apartment3 from "../assets/appartment3.jpg";
import FeaturedProperties from "../sections/fproperties";
import WhyChooseUs from "../sections/whychooseus";
import TestimonialsSection from "../sections/testimonial";
import Footer from "../components/footer";
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
      <div className="position-relative vh-100">
        {images.map((img, index) => (
          <div
            key={index}
            className="position-absolute w-100 h-100"
            style={{
              opacity: currentImage === index ? 1 : 0,
              transition:
                "opacity 1.5s ease-in-out, transform 1.5s ease-in-out",
              transform: currentImage === index ? "scale(1.05)" : "scale(1)",
            }}
          >
            <img
              src={img}
              alt={`Luxury interior ${index + 1}`}
              className="w-100 h-100 object-fit-cover"
              style={{ filter: "brightness(0.8)" }}
            />
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7))",
              }}
            />
          </div>
        ))}
        <Navigation />
        <div className="container position-relative h-100">
          <div className="row h-75 align-items-center">
            <div className="col-lg-8 text-white">
              <h5
                className="text-uppercase fw-bold mb-4"
                style={{ color: "#FFD700", letterSpacing: "3px" }}
              >
                Welcome to COM4thPLUS
              </h5>
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
                Experience unparalleled comfort in our exclusive apartment,
                where luxury meets exceptional service.
              </p>
              <div
                className="bg-white p-4 rounded-4 shadow-lg mt-5 mb-5"
                style={{
                  backdropFilter: "blur(10px)",
                  background: "rgba(255, 255, 255, 0.95)",
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
                        value=""
                        onChange={(e) =>
                          e.target.setAttribute("value", e.target.value)
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
                        value=""
                        onChange={(e) =>
                          e.target.setAttribute("value", e.target.value)
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
      </div>
      <FeaturedProperties />
      <WhyChooseUs />
      <TestimonialsSection />
      <Newsletter />
      <Footer />
      <style jsx>{`
        .text-gradient {
          background: linear-gradient(to right, #ffd700, #ffa500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
