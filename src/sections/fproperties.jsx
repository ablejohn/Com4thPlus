import React from "react";
import { Star, ArrowRight } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Apartment1 from "../assets/appartment1.jpg";
import Apartment2 from "../assets/appartment2.jpg";
import Apartment3 from "../assets/appartment3.jpg";

const FeaturedProperties = () => {
  const properties = [
    {
      id: 1,
      image: Apartment1,
      title: "5-Bedroom Luxury Apartment",
      description:
        "Spacious living areas with premium amenities and en-suite bathrooms",
      price: 399,
      rating: 4.9,
      rooms: 5,
      featured: true,
    },
    {
      id: 2,
      image: Apartment2,
      title: "4-Bedroom Premium Suite",
      description: "Elegant design with state-of-the-art smart home features",
      price: 349,
      rating: 4.8,
      rooms: 4,
      featured: true,
    },
    {
      id: 3,
      image: Apartment3,
      title: "3-Bedroom Deluxe Apartment",
      description: "Modern comfort with stunning views of GRA Ikeja",
      price: 299,
      rating: 4.7,
      rooms: 3,
      featured: true,
    },
  ];

  return (
    <section
      id="properties"
      className="py-5"
      style={{
        background:
          "linear-gradient(135deg, #f5f7fa 0%,rgb(182, 203, 243) 100%)",
        borderTop: "1px solid rgba(0,48,135,0.1)",
        borderBottom: "1px solid rgba(0,48,135,0.1)",
      }}
    >
      <div className="container py-4">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="bg-primary bg-opacity-10 text-primary d-inline-block px-3 py-2 rounded-pill mb-3">
            <span className="text-uppercase fw-bold small">
              Premium Accommodation
            </span>
          </div>
          <h2 className="display-5 fw-bold mb-3">Our Luxury Apartments</h2>
          <p className="text-muted lead mx-auto" style={{ maxWidth: "700px" }}>
            Experience exceptional comfort in our exclusive GRA Ikeja residences
          </p>
        </div>

        {/* Property Cards */}
        <div className="row g-4">
          {properties.map((property) => (
            <div key={property.id} className="col-md-4">
              <div
                className="card border-0 h-100 overflow-hidden"
                style={{
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0, 0, 0, 0.08)";
                }}
              >
                {/* Property Image */}
                <div className="position-relative" style={{ height: "250px" }}>
                  <img
                    src={property.image}
                    className="card-img-top w-100 h-100"
                    alt={property.title}
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span
                      className="badge rounded-pill"
                      style={{
                        background: "rgba(0, 48, 135, 0.85)",
                        backdropFilter: "blur(4px)",
                        padding: "0.5rem 1rem",
                      }}
                    >
                      {property.rooms} Bedrooms
                    </span>
                  </div>
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-3"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
                    }}
                  >
                    <h5 className="text-white mb-0 text-shadow">
                      {property.title}
                    </h5>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-4">
                  {/* Rating */}
                  <div className="d-flex align-items-center mb-3">
                    <span style={{ color: "#FFD700" }}>
                      {[...Array(Math.floor(property.rating))].map((_, i) => (
                        <Star key={i} className="me-1" />
                      ))}
                    </span>
                    <small className="text-muted ms-2">
                      {property.rating} Guest Rating
                    </small>
                  </div>

                  {/* Property Description */}
                  <p className="card-text text-muted mb-4">
                    {property.description}
                  </p>

                  {/* Price and Button */}
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0" style={{ color: "#003087" }}>
                      ${property.price}
                      <small className="text-muted">/night</small>
                    </span>
                    <Link
                      to="/propertydetail"
                      className="btn btn-outline-primary d-flex align-items-center gap-2"
                      style={{
                        transition: "all 0.3s ease",
                        borderColor: "#003087",
                        color: "#003087",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#003087";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#003087";
                      }}
                    >
                      <span>View Details</span>
                      <ArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-5">
          <Link
            to="/properties"
            className="btn btn-primary px-4 py-2"
            style={{
              background: "linear-gradient(to right, #003087, #004299)",
              border: "none",
              borderRadius: "50px",
              padding: "0.75rem 2rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(0, 48, 135, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(0, 48, 135, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 15px rgba(0, 48, 135, 0.2)";
            }}
          >
            Explore All Apartments
          </Link>
        </div>
      </div>

      <style jsx>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </section>
  );
};

export default FeaturedProperties;
