import React from "react";
import { Star } from "react-bootstrap-icons";

const FeaturedProperties = () => {
  const properties = [
    {
      id: 1,
      image: "appartment1.jpg", // Replace with actual image URL
      title: "Luxury Suite in Downtown",
      description: "Modern amenities with stunning city views",
      price: 299,
      rating: 4.9,
      featured: true,
    },
    {
      id: 2,
      image: "appartment1.jpg", // Replace with actual image URL
      title: "Beachfront Villa",
      description: "Private beach access with ocean views",
      price: 499,
      rating: 4.8,
      featured: true,
    },
    {
      id: 3,
      image: "appartment1.jpg", // Replace with actual image URL
      title: "Mountain Retreat",
      description: "Secluded cabin with panoramic mountain views",
      price: 399,
      rating: 4.7,
      featured: true,
    },
  ];

  return (
    <section id="properties" className="py-5 bg-light">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">
            <span className="border-bottom border-primary border-3 pb-2">
              Featured Properties
            </span>
          </h2>
          <p className="text-muted lead">
            Explore our handpicked selection of luxury properties
          </p>
        </div>

        {/* Property Cards */}
        <div className="row g-4">
          {properties.map((property) => (
            <div key={property.id} className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100"
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
                {/* Property Image */}
                <div
                  className="position-relative"
                  style={{ overflow: "hidden", height: "250px" }}
                >
                  <img
                    src={property.image}
                    className="card-img-top w-100 h-100"
                    alt={property.title}
                    style={{
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  {property.featured && (
                    <span
                      className="badge bg-primary position-absolute top-0 start-0 m-3"
                      style={{ zIndex: 1 }}
                    >
                      Featured
                    </span>
                  )}
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-3"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
                    }}
                  >
                    <h5 className="text-white mb-0">{property.title}</h5>
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
                      {property.rating} Rating
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
                    <button
                      className="btn btn-primary"
                      style={{
                        transition: "all 0.3s ease",
                        backgroundColor: "#003087",
                        border: "none",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#004299";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#003087";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      View Details
                    </button>
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

export default FeaturedProperties;