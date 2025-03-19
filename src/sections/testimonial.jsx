import React, { useState, useEffect, useCallback, memo } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Reusable TestimonialCard Component with optimized props and animations
const TestimonialCard = memo(({ testimonial, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="h-100"
  >
    <div
      className="card h-100 border-0 bg-white shadow-sm position-relative overflow-hidden"
      style={{
        borderRadius: "16px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
          <Quote size={40} style={{ color: "#40E0D0" }} />
        </div>

        {/* Rating stars with proper aria-label */}
        <div 
          className="mb-3" 
          aria-label={`Rating: ${testimonial.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }, (_, i) => (
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

        <div className="mt-auto">
          <div className="d-flex flex-wrap">
            <p className="mb-1 w-100 fst-italic text-end">
              — <span className="fw-bold">{testimonial.name}, {testimonial.position}</span>
            </p>
            <p className="mb-0 w-100 text-muted small text-end" style={{ fontSize: "0.75rem" }}>
              {testimonial.location} – {testimonial.staying}
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
));

// Enhanced Navigation Button Component with improved accessibility
const NavButton = ({ direction, onClick, disabled }) => {
  const isLeft = direction === "left";
  const label = isLeft ? "Previous testimonial" : "Next testimonial";
  
  return (
    <button
      className="btn btn-nav shadow p-0 d-flex align-items-center justify-content-center"
      onClick={onClick}
      aria-label={label}
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

// Main TestimonialsSection Component with performance optimizations
const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(2);
  const [autoplay, setAutoplay] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Testimonial data - memoized to prevent unnecessary re-renders
  const testimonials = React.useMemo(() => [
    {
      id: 1,
      name: "Grace A.",
      location: "GRA, Lagos",
      rating: 5,
      text: "Com4thPlus provided the perfect space for our family trip. The extra comfort, clean environment, and great location made all the difference. The amenities were exactly what we needed.",
      position: "Family Vacationer",
      staying: "3-night stay",
    },
    {
      id: 2,
      name: "David O.",
      location: "GRA, Lagos",
      rating: 5,
      text: "The security and amenities exceeded my expectations. The workspace in the master bedroom was a great bonus for catching up on emails during my business trip. I'll definitely book again on my next visit.",
      position: "Business Traveler",
      staying: "5-night stay",
    }
  ], []);

  // Handle responsive layout with debounce
  const handleResize = useCallback(() => {
    if (window.innerWidth < 768) {
      setSlidesToShow(1);
    } else {
      setSlidesToShow(2);
    }
  }, []);

  // Initialize and clean up event listeners with proper cleanup
  useEffect(() => {
    // Initial call
    handleResize();
    
    // Debounced resize handler for better performance
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };
    
    window.addEventListener("resize", debouncedResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [handleResize]);

  // Navigation logic with keyboard support
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

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  }, [prevSlide, nextSlide]);

  // Get visible testimonials - memoized to prevent unnecessary calculations
  const visibleTestimonials = React.useMemo(() => {
    if (slidesToShow === 1) {
      return [testimonials[activeIndex]];
    }
    return testimonials;
  }, [activeIndex, slidesToShow, testimonials]);

  // Optimized autoplay with pause functionality and proper cleanup
  useEffect(() => {
    let timer;
    if (autoplay && slidesToShow === 1 && !isPaused) {
      timer = setInterval(() => {
        setActiveIndex(prev => prev === 0 ? 1 : 0);
      }, 6000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoplay, slidesToShow, isPaused]);

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
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
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
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onKeyDown={handleKeyDown}
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
              {visibleTestimonials.map((testimonial, idx) => (
                <div
                  key={testimonial.id}
                  className={`col-12 ${slidesToShow === 2 ? 'col-md-6' : ''}`}
                >
                  <TestimonialCard testimonial={testimonial} index={idx} />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {/* Improved pagination indicators with proper ARIA for accessibility */}
          {slidesToShow === 1 && (
            <div className="d-flex justify-content-center mt-4 gap-2" role="tablist">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  className={`pagination-indicator ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-selected={activeIndex === index}
                  role="tab"
                  tabIndex={activeIndex === index ? 0 : -1}
                />
              ))}
            </div>
          )}
        </div>
        
      </div>

      {/* Enhanced styles with performance optimizations */}
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
          pointer-events: none;
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
          pointer-events: none;
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
          transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
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
        
        @media (prefers-reduced-motion: reduce) {
          .btn-nav,
          .pagination-indicator,
          .card {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;