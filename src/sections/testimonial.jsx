import React from "react";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Manhattan, New York",
      rating: 5,
      text: "The property exceeded all our expectations! From the stunning views to the impeccable service, everything was absolutely perfect. The attention to detail and the luxurious amenities made our stay unforgettable.",
      image: "https://via.placeholder.com/60", // Replace with actual image URL
      position: "Business Executive",
      staying: "Luxury Penthouse",
    },
    {
      name: "Michael Chen",
      location: "San Francisco, CA",
      rating: 5,
      text: "A truly remarkable experience! The location was prime, and the smart home features were cutting-edge. The property management team went above and beyond to ensure our comfort. Highly recommended!",
      image: "https://via.placeholder.com/60", // Replace with actual image URL
      position: "Tech Entrepreneur",
      staying: "Smart Villa",
    },
    {
      name: "Emma Rodriguez",
      location: "Miami, Florida",
      rating: 5,
      text: "We couldn't have chosen a better place for our family vacation. The beachfront property was absolutely stunning, and the concierge service made everything seamless. We're already planning our next stay!",
      image: "https://via.placeholder.com/60", // Replace with actual image URL
      position: "Interior Designer",
      staying: "Beachfront Estate",
    },
  ];

  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
      }}
    >
      <div className="container py-5">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h6 className="text-primary fw-semibold mb-2">TESTIMONIALS</h6>
          <h2 className="display-5 fw-bold mb-3">What Our Guests Say</h2>
          <div className="d-flex justify-content-center align-items-center gap-2">
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
            Discover why our properties consistently receive outstanding reviews
            from guests worldwide
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="row g-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-md-4">
              <div
                className="card h-100 border-0 bg-white shadow-sm"
                style={{
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div className="card-body p-4">
                  {/* Quote Icon */}
                  <Quote
                    size={40}
                    className="text-primary opacity-25 mb-3"
                    style={{ position: "absolute", top: "20px", right: "20px" }}
                  />

                  {/* Rating Stars */}
                  <div className="mb-4">
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

                  {/* Testimonial Text */}
                  <p
                    className="card-text mb-4"
                    style={{ lineHeight: "1.7", fontSize: "1.1rem" }}
                  >
                    "{testimonial.text}"
                  </p>

                  {/* Testimonial Author */}
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
                    />
                    <div>
                      <h5 className="mb-1 fw-bold">{testimonial.name}</h5>
                      <p
                        className="mb-1 text-primary fw-semibold"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {testimonial.position}
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted">
                          {testimonial.location}
                        </small>
                        <span className="text-muted">•</span>
                        <small className="text-muted">
                          {testimonial.staying}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;