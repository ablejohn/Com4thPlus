import React, { useState, useEffect, useCallback, memo } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Reusable TestimonialCard Component
const TestimonialCard = memo(({ testimonial, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="h-100"
  >
    <div
      className="card h-100 border-0 bg-white shadow-sm position-relative overflow-hidden"
      style={{
        borderRadius: "16px",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "0 15px 30px rgba(0, 48, 135, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
      }}
    >
      {/* Decorative accent */}
      <div 
        className="position-absolute" 
        style={{ 
          top: 0, 
          left: 0, 
          right: 0, 
          height: "6px", 
          background: "linear-gradient(90deg, #40E0D0, #20B2AA)" 
        }} 
      />
      
      <div className="card-body p-4">
        <div 
          className="position-absolute" 
          style={{ top: "24px", right: "24px", opacity: 0.15 }}
          aria-hidden="true"
        >
          <Quote size={40} className="text-primary" style={{ color: "#40E0D0" }} />
        </div>

        <div 
          className="mb-3" 
          aria-label={`Rating: ${testimonial.rating} out of 5 stars`}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              fill={i < testimonial.rating ? "#40E0D0" : "#e9ecef"}
              color={i < testimonial.rating ? "#40E0D0" : "#e9ecef"}
              className="me-1"
            />
          ))}
        </div>

        <p 
          className="card-text mb-4 fw-normal" 
          style={{ 
            lineHeight: "1.7", 
            fontSize: "1rem",
            color: "#495057",
            minHeight: "110px",
            position: "relative",
            zIndex: 1
          }}
        >
          "{testimonial.text}"
        </p>

        <div className="d-flex align-items-center mt-auto">
          <div 
            className="rounded-circle overflow-hidden me-3 border border-2 border-white shadow-sm"
            style={{ width: "56px", height: "56px", flexShrink: 0 }}
          >
            <img
              src={testimonial.image}
              className="w-100 h-100"
              alt=""
              style={{ objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/56";
              }}
            />
          </div>
          <div>
            <h5 className="mb-1 fw-bold" style={{ fontSize: "1rem" }}>{testimonial.name}</h5>
            <p className="mb-1" style={{ fontSize: "0.85rem", color: "#40E0D0", fontWeight: "600" }}>
              {testimonial.position}
            </p>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <small className="text-muted" style={{ fontSize: "0.75rem" }}>{testimonial.location}</small>
              {testimonial.staying && (
                <>
                  <span className="text-muted d-none d-sm-inline" aria-hidden="true">•</span>
                  <small className="text-muted" style={{ fontSize: "0.75rem" }}>{testimonial.staying}</small>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
));

// Enhanced Navigation Button Component
const NavButton = ({ direction, onClick, disabled }) => {
  const isLeft = direction === "left";
  
  return (
    <button
      className="btn btn-nav shadow p-0 d-flex align-items-center justify-content-center"
      onClick={onClick}
      aria-label={isLeft ? "Previous testimonial" : "Next testimonial"}
      disabled={disabled}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        left: isLeft ? "5px" : "auto",
        right: isLeft ? "auto" : "5px",
        border: "none",
        background: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease"
      }}
    >
      {isLeft ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
};

// Main TestimonialsSection Component
const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(2);
  const [autoplay, setAutoplay] = useState(true);

  // Extended testimonial data with more user details
  const testimonials = [
    {
      id: 1,
      name: "Grace A.",
      location: "GRA, Lagos",
      rating: 5,
      text: "Com4th Plus provided the perfect space for our family trip. The extra comfort, clean environment, and great location made all the difference. The amenities were exactly what we needed for our stay.",
      image: "/api/placeholder/60/60",
      position: "Family Vacationer",
      staying: "3-night stay",
    },
    {
      id: 2,
      name: "David O.",
      location: "GRA, Lagos",
      rating: 5,
      text: "The security and amenities exceeded my expectations. The workspace in the master bedroom was a great bonus for catching up on emails during my business trip. I'll definitely book again on my next visit.",
      image: "/api/placeholder/60/60",
      position: "Business Traveler",
      staying: "5-night stay",
    }
  ];

  // Handle responsive layout - optimized for two testimonials
  const handleResize = useCallback(() => {
    if (window.innerWidth < 768) {
      setSlidesToShow(1);
    } else {
      setSlidesToShow(2); // Always show 2 testimonials on larger screens since we only have 2
    }
  }, []);

  // Initialize and clean up event listeners
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Simplified navigation logic for just two testimonials
  const nextSlide = useCallback(() => {
    if (slidesToShow === 1 && activeIndex === 0) {
      setActiveIndex(1);
    }
  }, [activeIndex, slidesToShow]);

  const prevSlide = useCallback(() => {
    if (slidesToShow === 1 && activeIndex === 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, slidesToShow]);

  // Get the testimonials to display
  const getVisibleTestimonials = useCallback(() => {
    if (slidesToShow === 1) {
      return [testimonials[activeIndex]];
    }
    return testimonials; // Show both testimonials when slidesToShow is 2
  }, [activeIndex, slidesToShow, testimonials]);

  // Simplified autoplay for two testimonials
  useEffect(() => {
    let timer;
    if (autoplay && slidesToShow === 1) {
      timer = setInterval(() => {
        setActiveIndex(prev => prev === 0 ? 1 : 0);
      }, 6000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoplay, slidesToShow]);

  return (
    <section
      className="py-5 position-relative testimonials-section"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
      }}
    >
      <div className="container py-md-4">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <div className="d-inline-block px-3 py-2 rounded-pill mb-3" 
                 style={{ background: "rgba(64, 224, 208, 0.1)", color: "#40E0D0" }}>
              <span className="fw-semibold" style={{ fontSize: "0.85rem", letterSpacing: "0.05em" }}>
                GUEST EXPERIENCES
              </span>
            </div>
            <h2 className="display-5 fw-bold mb-3">What Our Guests Say</h2>
            <div
              className="d-flex justify-content-center align-items-center gap-2 mb-3"
              aria-label="5 out of 5 star average rating"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  fill="#40E0D0"
                  color="#40E0D0"
                />
              ))}
            </div>
            <p className="text-muted" style={{ fontSize: "1.1rem", maxWidth: "80%", margin: "0 auto" }}>
              Discover why our properties consistently receive outstanding reviews from guests worldwide
            </p>
          </div>
        </div>

        <div 
          className="position-relative testimonial-slider"
          tabIndex="0"
          aria-label="Testimonials showcase"
          role="region"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          {/* Only show navigation buttons on mobile when we have multiple slides */}
          {slidesToShow === 1 && (
            <>
              <NavButton 
                direction="left" 
                onClick={prevSlide} 
                disabled={activeIndex === 0}
              />
              <NavButton 
                direction="right" 
                onClick={nextSlide} 
                disabled={activeIndex === 1}
              />
            </>
          )}

          <div className="row g-4 position-relative px-md-2">
            <AnimatePresence mode="wait">
              {getVisibleTestimonials().map((testimonial, idx) => (
                <div
                  key={testimonial.id}
                  className={`col-12 ${slidesToShow === 2 ? 'col-md-6' : ''}`}
                >
                  <TestimonialCard testimonial={testimonial} index={idx} />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {/* Show pagination indicators only on mobile */}
          {slidesToShow === 1 && (
            <div className="d-flex justify-content-center mt-4 gap-2">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  className={`pagination-indicator ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={activeIndex === index ? "true" : "false"}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Add a CTA button for additional social proof */}
        <div className="text-center mt-5">
          <a 
            href="#view-more-reviews" 
            className="btn btn-outline-primary px-4 py-2"
            style={{ 
              borderColor: "#40E0D0", 
              color: "#40E0D0",
              borderRadius: "8px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#40E0D0";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#40E0D0";
            }}
          >
            View All Reviews
          </a>
        </div>
      </div>

      {/* Enhanced styles */}
      <style jsx="true">{`
        .testimonials-section {
          overflow: hidden;
          position: relative;
        }
        
        .testimonials-section::before {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(64, 224, 208, 0.08) 0%, rgba(255,255,255,0) 70%);
          top: 10%;
          left: -100px;
          border-radius: 50%;
          z-index: 0;
        }
        
        .testimonials-section::after {
          content: '';
          position: absolute;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(64, 224, 208, 0.05) 0%, rgba(255,255,255,0) 70%);
          bottom: 5%;
          right: -150px;
          border-radius: 50%;
          z-index: 0;
        }
        
        .testimonial-slider {
          padding: 20px 36px;
          overflow: visible;
        }
        
        .pagination-indicator {
          width: 32px;
          height: 4px;
          background-color: #dee2e6;
          border: none;
          border-radius: 2px;
          padding: 0;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .pagination-indicator.active {
          width: 48px;
          background-color: #40E0D0;
        }
        
        .btn-nav {
          transition: all 0.2s ease;
        }
        
        .btn-nav:hover:not(:disabled) {
          background: #40E0D0 !important;
          color: white;
          transform: translateY(-50%) scale(1.05) !important;
          box-shadow: 0 6px 16px rgba(64, 224, 208, 0.25) !important;
        }
        
        @media (max-width: 768px) {
          .testimonial-slider {
            padding: 20px 0;
          }
          
          .btn-nav {
            width: 36px !important;
            height: 36px !important;
            top: calc(50% - 20px);
            z-index: 1000;
            opacity: 0.9 !important;
          }
          
          .card-body {
            padding: 1.25rem !important;
          }
          
          .card-text {
            min-height: 80px !important;
            font-size: 0.95rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;