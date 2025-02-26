import React, { useState, useEffect } from "react";
import { ChevronRight, Coffee, Wifi, Home, Check, Star, MapPin, Shield, Zap } from "lucide-react";
import Apartment1 from "../assets/appartment1.jpg";
import BookingModal from "../components/bookingModal";

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Set up testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <MapPin size={20} color="#40E0D0" />,
      title: "Prime GRA Location",
      description: "7 minutes from Murtala Muhammed Int'l Airport, walking distance to fine dining & upscale shopping"
    },
    {
      icon: <Home size={20} color="#40E0D0" />,
      title: "Designer Suites",
      description: "Italian marble bathrooms, Bang & Olufsen sound systems, bespoke furnishings imported from Milan"
    },
    {
      icon: <Shield size={20} color="#40E0D0" />,
      title: "Elite Security",
      description: "Gated compound with 24/7 armed security, biometric access, and AI-enhanced CCTV surveillance"
    },
    {
      icon: <Zap size={20} color="#40E0D0" />,
      title: "Premium Amenities",
      description: "Silent backup generators, 300Mbps fiber internet, Tesla-compatible EV charging stations"
    }
  ];

  const amenities = [
    { icon: <Coffee size={14} />, name: "Barista-Grade Coffee" },
    { icon: <Wifi size={14} />, name: "Gigabit WiFi" },
    { icon: <Home size={14} />, name: "Smart Home Controls" },
    { icon: <Star size={14} />, name: "Airport Pickup" }
  ];
  
  const testimonials = [
    {
      quote: "Absolutely stunning property. The interior design rivals 5-star hotels in Dubai. Perfect for our executive retreat.",
      name: "Michael Adeyemi",
      title: "CEO, Fintech Solutions Ltd"
    },
    {
      quote: "Com4thPLUS redefines luxury living in Lagos. The attention to detail in every suite is exceptional.",
      name: "Sarah Johnson",
      title: "Executive Director, Global Investments"
    },
    {
      quote: "My stay at Com4thPLUS exceeded all expectations. The concierge service and personal chef made it unforgettable.",
      name: "Dr. Oluwaseun Afolabi",
      title: "Medical Director, Wellness Group"
    }
  ];
  
  return (
    <section className="py-5" style={{ background: "#fafafa", borderBottom: "1px solid #eaeaea" }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Image Column */}
          <div className="col-md-6 mb-5 mb-md-0">
            <div className="position-relative">
              {/* Main Image */}
              <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}>
                <img
                  src={Apartment1}
                  alt="Luxury Apartment at Com4thPLUS GRA Ikeja"
                  className="w-100"
                  style={{ objectFit: "cover", height: "500px" }}
                  loading="lazy"
                />
              </div>
              
              {/* Rating Badge */}
              <div 
                className="position-absolute top-0 start-0 text-white py-2 px-3 m-4 rounded-pill d-flex align-items-center"
                style={{ background: "rgba(0, 0, 0, 0.7)" }}
              >
                <Star size={16} fill="#FFD700" stroke="#FFD700" className="me-2" />
                <span>4.9/5 on Booking.com</span>
              </div>
              
              {/* Testimonial Container - Fixed height to prevent layout shifts */}
              <div 
                className="bg-white rounded-3 shadow-sm p-4 ms-4 position-relative" 
                style={{ 
                  marginTop: "-60px", 
                  maxWidth: "85%", 
                  borderLeft: "4px solid #40E0D0",
                  minHeight: "180px" 
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index} 
                    className="w-100 p-2"
                    style={{
                      opacity: activeTestimonial === index ? 1 : 0,
                      position: "absolute",
                      top: "0",
                      left: "0",
                      transition: "opacity 0.5s ease",
                      visibility: activeTestimonial === index ? "visible" : "hidden",
                      padding: "1rem"
                    }}
                  >
                    <p className="mb-2">{testimonial.quote}</p>
                    <p className="mb-0 fw-medium">{testimonial.name}</p>
                    <p className="text-muted small mb-0">{testimonial.title}</p>
                  </div>
                ))}
                
                {/* Testimonial Navigation Dots */}
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-1">
                  {testimonials.map((_, index) => (
                    <button 
                      key={index}
                      className="btn p-0 m-0"
                      style={{
                        width: activeTestimonial === index ? "24px" : "8px",
                        height: "8px",
                        background: activeTestimonial === index ? "#40E0D0" : "#e0e0e0",
                        borderRadius: "4px",
                        border: "none"
                      }}
                      onClick={() => setActiveTestimonial(index)}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="col-md-6">
            <div className="text-center text-md-start">
              <div className="badge bg-light text-primary mb-3 px-3 py-2">DISCOVER COM4THPLUS</div>
              
              <h2 className="fw-bold mb-4">
                Elevated Lagos Living in GRA Ikeja
              </h2>
              
              <p className="lead mb-4">
                Com4thPLUS offers an unrivaled contemporary living experience in Lagos' most prestigious 
                neighborhood. Our meticulously crafted residences blend minimalist elegance 
                with cutting-edge technology, creating the ultimate urban sanctuary.
              </p>
              
              {/* Highlights */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {[
                  "Signature Design",
                  "Dedicated Concierge",
                  "Airport VIP Transfer",
                  "Private Chef Service"
                ].map((highlight, index) => (
                  <span key={index} className="badge bg-light text-dark p-2">{highlight}</span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="d-flex align-items-start mb-3 p-3 rounded"
                  style={{ 
                    background: index % 2 === 0 ? "#f5f5f5" : "transparent",
                    borderLeft: index % 2 === 0 ? "3px solid #40E0D0" : "none",
                    transition: "background-color 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f5f5f5" : "transparent";
                  }}
                >
                  <div className="me-3 p-2 rounded" style={{ backgroundColor: "rgba(64, 224, 208, 0.1)" }}>
                    {feature.icon}
                  </div>
                  <div>
                    <h5 className="mb-1 fs-6 fw-semibold">{feature.title}</h5>
                    <p className="mb-0 small text-muted">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Amenities with proper formatting */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {amenities.map((amenity, index) => (
                <div 
                  key={index} 
                  className="badge bg-light text-dark d-flex align-items-center p-2"
                  style={{ transition: "transform 0.2s ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span className="me-1">{amenity.icon}</span>
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Button with improved styling */}
            <div className="mt-4 text-center text-md-start">
              <button 
                className="btn px-4 py-2"
                style={{
                  background: "#40E0D0",
                  color: "white",
                  border: "none",
                  boxShadow: "0 4px 10px rgba(64, 224, 208, 0.2)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(64, 224, 208, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(64, 224, 208, 0.2)";
                }}
                onClick={() => setIsModalOpen(true)}
              >
                Book Your Stay Now <ChevronRight size={16} className="ms-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal onClose={() => setIsModalOpen(false)} />
      )}
    </section>
  );
};

export default AboutUs;