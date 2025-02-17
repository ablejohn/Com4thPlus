import React, { useState, useEffect, useCallback, memo } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

// Reusable TestimonialCard Component
const TestimonialCard = memo(({ testimonial }) => (
  <div
    className="card h-100 border-0 bg-white shadow-sm"
    style={{
      borderRadius: "16px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-10px)";
      e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    }}
  >
    <div className="card-body p-4">
      <Quote
        size={40}
        className="text-primary opacity-25 mb-3"
        style={{ position: "absolute", top: "20px", right: "20px" }}
        aria-hidden="true"
      />

      <div className="mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            size={18}
            fill="#FFD700"
            color="#FFD700"
            className="me-1"
          />
        ))}
      </div>

      <p className="card-text mb-4" style={{ lineHeight: "1.7", fontSize: "1.1rem" }}>
        "{testimonial.text}"
      </p>

      <div className="d-flex align-items-center">
        <img
          src={testimonial.image}
          className="rounded-circle me-3"
          alt={testimonial.name}
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
            border: "3px solid #fff",
            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
          }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/60";
          }}
        />
        <div>
          <h5 className="mb-1 fw-bold">{testimonial.name}</h5>
          <p className="mb-1 text-primary fw-semibold" style={{ fontSize: "0.9rem" }}>
            {testimonial.position}
          </p>
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted">{testimonial.location}</small>
            <span className="text-muted" aria-hidden="true">•</span>
            <small className="text-muted">{testimonial.staying}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
));

// Main TestimonialsSection Component
const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [isHovering, setIsHovering] = useState(false);

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
  ];

  const handleResize = useCallback(() => {
    if (window.innerWidth < 768) {
      setSlidesToShow(1);
    } else if (window.innerWidth < 1024) {
      setSlidesToShow(2);
    } else {
      setSlidesToShow(3);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visibleItems = [];
    for (let i = 0; i < slidesToShow; i++) {
      const index = (activeIndex + i) % testimonials.length;
      visibleItems.push(testimonials[index]);
    }
    return visibleItems;
  };

  const buttonStyles = {
    base: {
      width: "48px",
      height: "48px",
      border: "none",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      backgroundColor: "white",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      position: "absolute",
      top: "50%",
      zIndex: 2,
      opacity: isHovering ? 1 : 0,
    },
    left: {
      left: "-24px",
      transform: `translateY(-50%) translateX(${isHovering ? "0" : "10px"})`,
    },
    right: {
      right: "-24px",
      transform: `translateY(-50%) translateX(${isHovering ? "0" : "-10px"})`,
    },
    hover: {
      backgroundColor: "#0d6efd",
      color: "white",
      boxShadow: "0 6px 16px rgba(13, 110, 253, 0.2)",
    }
  };

  const indicatorStyles = {
    container: {
      display: "flex",
      gap: "8px",
      justifyContent: "center",
      marginTop: "2rem",
    },
    dot: {
      width: "32px",
      height: "4px",
      border: "none",
      borderRadius: "2px",
      backgroundColor: "#dee2e6",
      transition: "all 0.3s ease",
      cursor: "pointer",
      padding: 0,
    },
    activeDot: {
      backgroundColor: "#0d6efd",
      width: "48px",
    }
  };

  return (
    <section
      className="py-5 position-relative"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
      }}
    >
      <div className="container py-5">
        <div className="text-center mb-5">
          <h6 className="text-primary fw-semibold mb-2">TESTIMONIALS</h6>
          <h2 className="display-5 fw-bold mb-3">What Our Guests Say</h2>
          <div
            className="d-flex justify-content-center align-items-center gap-2"
            aria-label="5 out of 5 star rating"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                fill="#FFD700"
                color="#FFD700"
                className="mb-4"
              />
            ))}
          </div>
          <p className="text-muted col-lg-8 mx-auto">
            Discover why our properties consistently receive outstanding reviews from guests worldwide
          </p>
        </div>

        <div 
          className="position-relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <button
            style={{
              ...buttonStyles.base,
              ...buttonStyles.left,
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, buttonStyles.hover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = buttonStyles.base.backgroundColor;
              e.currentTarget.style.color = "inherit";
              e.currentTarget.style.boxShadow = buttonStyles.base.boxShadow;
            }}
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            style={{
              ...buttonStyles.base,
              ...buttonStyles.right,
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, buttonStyles.hover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = buttonStyles.base.backgroundColor;
              e.currentTarget.style.color = "inherit";
              e.currentTarget.style.boxShadow = buttonStyles.base.boxShadow;
            }}
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          <div className="row g-4 overflow-hidden">
            {getVisibleTestimonials().map((testimonial) => (
              <div
                key={testimonial.id}
                className={`col-12 col-md-${12 / slidesToShow}`}
                style={{
                  transition: "all 0.5s ease",
                }}
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>

          <div style={indicatorStyles.container}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                style={{
                  ...indicatorStyles.dot,
                  ...(index === activeIndex ? indicatorStyles.activeDot : {}),
                }}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === activeIndex ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;