import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaWifi,
  FaCar,
  FaSwimmingPool,
  FaRegCalendarAlt,
  FaPhone,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Placeholder,
  Card,
} from "react-bootstrap";

// Theme configuration with testimonial-inspired colors
const theme = {
  colors: {
    primary: "#40E0D0",
    primaryDark: "#20B2AA",
    primaryLight: "rgba(64, 224, 208, 0.1)",
    accent: "#40E0D0",
    dark: "#333333",
    light: "#f8f9fa",
    white: "#ffffff",
    gray: "#6c757d",
    grayLight: "#e9ecef",
    success: "#28a745",
    warning: "#ffc107",
  },
  borderRadius: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    circle: "50%",
  },
  boxShadow: {
    sm: "0 4px 12px rgba(0, 0, 0, 0.05)",
    md: "0 8px 24px rgba(0, 0, 0, 0.08)",
    lg: "0 16px 32px rgba(0, 0, 0, 0.1)",
  },
  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "2.5rem",
  },
};

const PropertiesPage = () => {
  // Enhanced property data - now with two properties
  const properties = [
    {
      id: 1,
      images: ["appartment1.jpg"],
      title: "COM4TH PLUS LIMITED Apartment",
      description:
        "Experience modern living in this stylish apartment located at 6c Oduduwa Street, GRA IKEJA. Perfect for both short and long stays.",
      location: "6c Oduduwa Street, GRA IKEJA",
      contactPhone: "0814 318 3494",
      price: 350000,
      bedrooms: 5,
      bathrooms: 4,
      rating: 4.8,
      reviews: 124,
      type: "Apartment",
      amenities: [
        "Free Parking",
        "Fitness Center",
        "Swimming Pool",
        "High-Speed WiFi",
      ],
      superhost: true,
      availability: "Available Now",
    },
  ];

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (event, propertyId) => {
    event.preventDefault();
    event.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  const PropertyCard = ({ property, isLoading }) => {
    if (isLoading) {
      return (
        <Card
          className="property-card border-0 h-100 mb-4"
          style={{
            boxShadow: theme.boxShadow.md,
            borderRadius: theme.borderRadius.md,
          }}
        >
          <Placeholder as="div" animation="glow">
            <Placeholder
              xs={12}
              style={{
                height: "250px",
                borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`,
              }}
            />
          </Placeholder>
          <Card.Body className="p-4">
            <Placeholder as="h5" animation="glow">
              <Placeholder xs={8} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={6} /> <Placeholder xs={4} />
            </Placeholder>
            <Placeholder
              as="div"
              animation="glow"
              className="d-flex gap-2 mb-3"
            >
              <Placeholder xs={2} /> <Placeholder xs={2} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={12} />
            </Placeholder>
          </Card.Body>
        </Card>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          className="property-card border-0 h-100 mb-4 position-relative overflow-hidden"
          style={{
            transition: theme.transition,
            borderRadius: theme.borderRadius.md,
            boxShadow: theme.boxShadow.md,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-10px)";
            e.currentTarget.style.boxShadow =
              "0 15px 30px rgba(64, 224, 208, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = theme.boxShadow.md;
          }}
        >
          {/* Decorative accent - inspired by testimonial cards */}
          <div
            className="position-absolute"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: "linear-gradient(90deg, #40E0D0, #20B2AA)",
            }}
          />

          <div className="position-relative">
            {property.superhost && (
              <Badge
                bg="primary"
                className="position-absolute"
                style={{
                  top: "20px",
                  left: "20px",
                  zIndex: 1,
                  backgroundColor: theme.colors.primaryDark,
                  padding: "8px 12px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                SUPERHOST
              </Badge>
            )}
            <Button
              variant="light"
              className="position-absolute rounded-circle p-2"
              style={{
                top: "20px",
                right: "20px",
                zIndex: 1,
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: theme.boxShadow.sm,
              }}
              onClick={(e) => toggleFavorite(e, property.id)}
              aria-label={
                favorites[property.id]
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <FaHeart
                size={20}
                color={
                  favorites[property.id]
                    ? theme.colors.accent
                    : theme.colors.gray
                }
              />
            </Button>
            <div
              className="image-container"
              style={{ cursor: "pointer" }}
              role="button"
              aria-label="Property image"
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="card-img-top"
                style={{
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`,
                }}
              />
            </div>
          </div>
          <Card.Body className="p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-start mb-3">
              <h2 className="card-title mb-2 mb-md-0 fw-bold h5">
                {property.title}
              </h2>
              <div className="d-flex align-items-center">
                <FaStar
                  style={{ color: theme.colors.primary }}
                  className="me-1"
                />
                <span className="fw-bold">{property.rating}</span>
                <span className="text-muted ms-1">({property.reviews})</span>
              </div>
            </div>

            <div className="d-flex flex-wrap align-items-center mb-3">
              <p
                className="card-text me-4 mb-2 mb-md-0"
                style={{ color: theme.colors.primaryDark }}
              >
                <FaMapMarkerAlt className="me-2" />
                {property.location}
              </p>
            </div>

            <p
              className="text-muted mb-3"
              style={{ lineHeight: "1.7", fontSize: "1rem", color: "#495057" }}
            >
              {property.description}
            </p>

            <div
              className="d-flex flex-wrap text-muted mb-3 p-3 rounded"
              style={{ backgroundColor: theme.colors.primaryLight }}
            >
              <div className="me-4 mb-2 mb-md-0 d-flex align-items-center">
                <FaBed
                  className="me-2"
                  style={{ color: theme.colors.primary }}
                  size={18}
                />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="me-4 mb-2 mb-md-0 d-flex align-items-center">
                <FaBath
                  className="me-2"
                  style={{ color: theme.colors.primary }}
                  size={16}
                />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
            </div>

            <div className="mb-3">
              <span
                className="badge rounded-pill px-3 py-2 me-2"
                style={{
                  backgroundColor: theme.colors.primaryLight,
                  color: theme.colors.primaryDark,
                }}
              >
                <FaRegCalendarAlt className="me-2" />
                {property.availability}
              </span>
              {property.amenities.slice(0, 2).map((amenity, index) => (
                <span
                  key={index}
                  className="badge rounded-pill px-3 py-2 me-2 mb-2"
                  style={{
                    backgroundColor: theme.colors.grayLight,
                    color: theme.colors.dark,
                  }}
                >
                  {amenity.includes("WiFi") && <FaWifi className="me-1" />}
                  {amenity.includes("Parking") && <FaCar className="me-1" />}
                  {amenity.includes("Pool") && (
                    <FaSwimmingPool className="me-1" />
                  )}
                  {amenity}
                </span>
              ))}
            </div>

            <div
              className="price-section p-3 rounded d-flex justify-content-between align-items-center"
              style={{ backgroundColor: theme.colors.primaryLight }}
            >
              <div>
                <span
                  className="h4 fw-bold"
                  style={{ color: theme.colors.primaryDark }}
                >
                  ₦{property.price.toLocaleString()}
                </span>
                <span className="text-muted">/month</span>
              </div>
              <div>
                <Link
                  to={`/property/${property.id}`}
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    color: "#fff",
                    textDecoration: "none",
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.sm,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.primaryDark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.primary;
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    );
  };

  return (
    <div
      className="property-container"
      style={{ backgroundColor: theme.colors.light }}
    >
      {/* Header with gradients and decorative elements inspired by the testimonial section */}
      <div
        style={{
          color: theme.colors.primaryDark,
          marginTop: "",
          marginBottom: "10px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements from testimonial section */}
        <div
          className="position-absolute"
          style={{
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(64, 224, 208, 0.08) 0%, rgba(255,255,255,0) 70%)",
            top: "",
            left: "-100px",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        <div
          className="position-absolute"
          style={{
            width: "350px",
            height: "350px",
            background:
              "radial-gradient(circle, rgba(64, 224, 208, 0.05) 0%, rgba(255,255,255,0) 70%)",
            bottom: "5%",
            right: "-150px",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        <Container className="py-5 position-relative">
          <div className="text-center">
            <div
              className="d-inline-block px-3 py-2 rounded-pill mb-3"
              style={{
                background: "rgba(64, 224, 208, 0.1)",
                color: "#40E0D0",
              }}
            >
              <span
                className="fw-semibold"
                style={{ fontSize: "0.85rem", letterSpacing: "0.05em" }}
              >
                FEATURED PROPERTIES
              </span>
            </div>
            <h1 className="display-5 fw-bold mb-3">
              Our Exceptional Properties
            </h1>
            <div
              className="d-flex justify-content-center align-items-center gap-2 mb-3"
              aria-label="5 out of 5 star average rating"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} size={24} color="#40E0D0" />
              ))}
            </div>
            <p
              className="text-muted"
              style={{ fontSize: "1.1rem", maxWidth: "80%", margin: "0 auto" }}
            >
              Experience luxury and comfort in our carefully curated selection
              of premium accommodations
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-3 py-md-4">
        {/* Property Cards */}
        <Row>
          {properties.map((property) => (
            <Col lg={6} key={property.id}>
              <PropertyCard property={property} isLoading={isLoading} />
            </Col>
          ))}
        </Row>
      </Container>

      {/* Custom CSS */}
      <style jsx>{`
        .property-container {
          margin-top: ;
        }

        .property-card {
          background: ${theme.colors.white};
          border-radius: ${theme.borderRadius.md};
          overflow: hidden;
          box-shadow: ${theme.boxShadow.md};
        }

        .image-container {
          position: relative;
        }

        @media (max-width: 768px) {
          .property-container {
            margin-top: ;
          }
        }

        @media (max-width: 576px) {
          .image-container img {
            height: 200px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertiesPage;
