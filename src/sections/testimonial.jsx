import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Reusable TestimonialCard Component with accessibility improvements
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
      {/* Decorative accent - using #40E0D0 as accent color */}
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
              <span className="text-muted d-none d-sm-inline" aria-hidden="true">•</span>
              <small className="text-muted" style={{ fontSize: "0.75rem" }}>{testimonial.staying}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
));

// Enhanced Navigation Button Component - Always visible on mobile
const NavButton = ({ direction, onClick }) => {
  const isLeft = direction === "left";
  
  return (
    <button
      className="btn btn-nav shadow p-0 d-flex align-items-center justify-content-center"
      onClick={onClick}
      aria-label={isLeft ? "Previous testimonial" : "Next testimonial"}
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
        opacity: 1,
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
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [autoplay, setAutoplay] = useState(true);
  const sliderRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "Manhattan, New York",
      rating: 5,
      text: "The property exceeded all our expectations! From the stunning views to the impeccable service, everything was absolutely perfect. The attention to detail and the luxurious amenities made our stay unforgettable.",
      image: "/api/placeholder/60/60",
      position: "Business Executive",
      staying: "Luxury Penthouse",
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "San Francisco, CA",
      rating: 5,
      text: "A truly remarkable experience! The location was prime, and the smart home features were cutting-edge. The property management team went above and beyond to ensure our comfort. Highly recommended!",
      image: "/api/placeholder/60/60",
      position: "Tech Entrepreneur",
      staying: "Smart Villa",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      location: "Miami, Florida",
      rating: 5,
      text: "We couldn't have chosen a better place for our family vacation. The beachfront property was absolutely stunning, and the concierge service made everything seamless. We're already planning our next stay!",
      image: "/api/placeholder/60/60",
      position: "Interior Designer",
      staying: "Beachfront Estate",
    },
    {
      id: 4,
      name: "David Smith",
      location: "Los Angeles, CA",
      rating: 5,
      text: "An absolutely amazing experience from start to finish. The rooftop pool was a highlight, and the views of the city were breathtaking. The staff made us feel like royalty!",
      image: "/api/placeholder/60/60",
      position: "Film Producer",
      staying: "Skyline Suite",
    },
    {
      id: 5,
      name: "Jasmine Patel",
      location: "Chicago, IL",
      rating: 5,
      text: "The attention to detail in this property is extraordinary. From the curated artwork to the premium fixtures, everything speaks luxury. The concierge service anticipated our needs before we even asked.",
      image: "/api/placeholder/60/60",
      position: "Art Curator",
      staying: "Urban Loft",
    },
  ];

  // Handle responsive layout
  const handleResize = useCallback(() => {
    if (window.innerWidth < 768) {
      setSlidesToShow(1);
    } else if (window.innerWidth < 1200) {
      setSlidesToShow(2);
    } else {
      setSlidesToShow(3);
    }
  }, []);

  // Initialize and clean up event listeners
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, activeIndex]);

  // Navigation functions
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % (testimonials.length - slidesToShow + 1));
  }, [testimonials.length, slidesToShow]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + (testimonials.length - slidesToShow + 1)) % (testimonials.length - slidesToShow + 1));
  }, [testimonials.length, slidesToShow]);

  // Get the testimonials to display
  const getVisibleTestimonials = useCallback(() => {
    return testimonials.slice(activeIndex, activeIndex + slidesToShow);
  }, [activeIndex, slidesToShow, testimonials]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (sliderRef.current && sliderRef.current.contains(document.activeElement)) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Touch events for mobile swipe functionality
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setAutoplay(false);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum distance to be considered a swipe
    
    if (diff > threshold) {
      // Swiped left, go to next
      nextSlide();
    } else if (diff < -threshold) {
      // Swiped right, go to previous
      prevSlide();
    }
    
    // Reset touch positions
    touchStartX.current = null;
    touchEndX.current = null;
    
    // Resume autoplay after a delay
    setTimeout(() => setAutoplay(true), 3000);
  };

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
          ref={sliderRef}
          tabIndex="0"
          aria-label="Testimonials carousel"
          role="region"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <NavButton direction="left" onClick={prevSlide} />
          <NavButton direction="right" onClick={nextSlide} />

          <div className="row g-4 position-relative px-4 px-md-2">
            <AnimatePresence mode="wait">
              {getVisibleTestimonials().map((testimonial, idx) => (
                <div
                  key={testimonial.id}
                  className={`col-12 col-md-${12 / Math.min(slidesToShow, 2)} col-lg-${12 / slidesToShow}`}
                >
                  <TestimonialCard testimonial={testimonial} index={idx} />
                </div>
              ))}
            </AnimatePresence>
          </div>

          <div className="d-flex justify-content-center mt-4 gap-2">
            {Array.from({ length: testimonials.length - slidesToShow + 1 }).map((_, index) => (
              <button
                key={index}
                className={`pagination-indicator ${activeIndex === index ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial group ${index + 1}`}
                aria-current={activeIndex === index ? "true" : "false"}
              />
            ))}
          </div>
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
        
        .btn-nav:hover {
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