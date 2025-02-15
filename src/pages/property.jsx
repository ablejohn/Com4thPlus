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
  FaDumbbell,
  FaImages,
  FaRegCalendarAlt,
  FaStopwatch,
} from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Placeholder,
  Modal,
  Carousel,
  Card,
} from "react-bootstrap";
import Newsletter from "../sections/newsletter";

// Custom color variables
const colors = {
  primary: "#0044cc",
  primaryDark: "#003399",
  primaryLight: "#e6eeff",
  accent: "#FF385C",
  dark: "#333333",
  light: "#f8f9fa",
  white: "#ffffff",
  gray: "#6c757d",
  grayLight: "#e9ecef",
};

const PropertiesPage = () => {
  // Single property data with multiple images
  const property = {
    id: 1,
    images: [
      "appartment1.jpg",
      "appartment1-living.jpg",
      "appartment1-bedroom.jpg",
      "appartment1-kitchen.jpg",
      "appartment1-bathroom.jpg",
    ],
    title: "Luxury Apartment with City View",
    description:
      "Experience modern living with breathtaking city views in this stylish apartment. Featuring high-end finishes, an open floor plan, and premium amenities, this property offers the perfect blend of comfort and sophistication.",
    location: "Manhattan, New York",
    price: 2500,
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.8,
    reviews: 124,
    type: "Apartment",
    amenities: [
      "Parking",
      "Gym",
      "Pool",
      "WiFi",
      "Air Conditioning",
      "Heating",
      "Washer/Dryer",
      "Elevator",
    ],
    superhost: true,
    size: "1,200 sq ft",
    availability: "Available Now",
    featuredHighlights: [
      "Floor-to-ceiling windows with panoramic city views",
      "Modern kitchen with stainless steel appliances",
      "24/7 concierge service",
      "Rooftop terrace access",
    ],
  };

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (event) => {
    event.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const openGallery = (event, index = 0) => {
    event.preventDefault();
    setActiveIndex(index);
    setShowGallery(true);
  };

  const PropertyCard = ({ property, isLoading }) => {
    if (isLoading) {
      return (
        <Card className="property-card border-0 h-100 shadow">
          <Placeholder as="div" animation="glow">
            <Placeholder xs={12} style={{ height: "400px" }} />
          </Placeholder>
          <Card.Body className="p-4">
            <Placeholder as="h5" animation="glow">
              <Placeholder xs={8} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={6} /> <Placeholder xs={4} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={4} /> <Placeholder xs={3} />
            </Placeholder>
          </Card.Body>
        </Card>
      );
    }

    return (
      <Card
        className="property-card border-0 h-100 shadow"
        style={{
          transition: "all 0.3s ease",
          borderRadius: "16px",
        }}
      >
        <div className="position-relative">
          {property.superhost && (
            <Badge
              bg="primary"
              className="position-absolute"
              style={{
                top: "20px",
                left: "20px",
                zIndex: 1,
                backgroundColor: colors.primary,
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
            }}
            onClick={toggleFavorite}
          >
            <FaHeart
              size={20}
              color={isFavorite ? colors.accent : colors.gray}
            />
          </Button>
          <Button
            variant="primary"
            className="position-absolute rounded-pill px-3 py-2"
            style={{
              bottom: "20px",
              right: "20px",
              zIndex: 1,
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
            onClick={(e) => openGallery(e)}
          >
            <FaImages className="me-2" />
            View All Photos
          </Button>
          <div
            className="image-container"
            style={{ cursor: "pointer" }}
            onClick={(e) => openGallery(e)}
          >
            <img
              src={property.images[0]}
              alt={property.title}
              className="card-img-top"
              style={{
                height: "400px",
                objectFit: "cover",
                borderRadius: "16px 16px 0 0",
              }}
            />
            <div className="image-overlay"></div>
          </div>
        </div>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h3 className="card-title mb-0 fw-bold">{property.title}</h3>
            <div className="d-flex align-items-center">
              <FaStar className="text-warning me-1" />
              <span className="fw-bold">{property.rating}</span>
              <span className="text-muted ms-1">
                ({property.reviews} reviews)
              </span>
            </div>
          </div>

          <p className="card-text mb-3" style={{ color: colors.primary }}>
            <FaMapMarkerAlt className="me-2" />
            {property.location}
          </p>

          <p className="mb-4 text-muted">{property.description}</p>

          <div className="status-badge mb-4">
            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                backgroundColor: colors.primaryLight,
                color: colors.primary,
              }}
            >
              <FaRegCalendarAlt className="me-2" />
              {property.availability}
            </span>
          </div>

          <div
            className="d-flex flex-wrap text-muted mb-4 p-3 rounded"
            style={{ backgroundColor: colors.light }}
          >
            <div className="me-4 d-flex align-items-center">
              <FaBed
                className="me-2"
                style={{ color: colors.primary }}
                size={20}
              />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
            <div className="me-4 d-flex align-items-center">
              <FaBath
                className="me-2"
                style={{ color: colors.primary }}
                size={18}
              />
              <span>{property.bathrooms} Bathrooms</span>
            </div>
            <div className="d-flex align-items-center">
              <FaStopwatch
                className="me-2"
                style={{ color: colors.primary }}
                size={18}
              />
              <span>{property.size}</span>
            </div>
          </div>

          <div
            className="featured-section p-4 mb-4 rounded"
            style={{ backgroundColor: colors.primaryLight }}
          >
            <h5 className="mb-3 fw-bold" style={{ color: colors.primaryDark }}>
              Featured Highlights
            </h5>
            <ul className="mb-0 feature-list">
              {property.featuredHighlights.map((highlight, index) => (
                <li key={index} className="mb-2">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <h5 className="mb-3 fw-bold">Amenities</h5>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {property.amenities.map((amenity, index) => (
              <Badge
                bg="light"
                text="dark"
                className="py-2 px-3"
                key={index}
                style={{
                  borderRadius: "20px",
                  backgroundColor: colors.grayLight,
                }}
              >
                {amenity}
              </Badge>
            ))}
          </div>

          <div
            className="price-section p-4 rounded"
            style={{ backgroundColor: colors.light }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="h3 fw-bold" style={{ color: colors.primary }}>
                  ${property.price}
                </span>
                <span className="text-muted">/night</span>
              </div>
              <div className="d-flex gap-3">
                <Button
                  variant="outline-primary"
                  as={Link}
                  to="/propertydetail"
                  style={{
                    borderRadius: "8px",
                    borderColor: colors.primary,
                    color: colors.primary,
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant="primary"
                  style={{
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                    borderRadius: "8px",
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="min-vh-40 cont" style={{ backgroundColor: colors.light }}>
      {/* Header with blue background */}
      <div
        style={{
          backgroundColor: colors.light,
          color: colors.primaryDark,
          marginTop: "-120px",
          marginBottom: "10px",
        }}
      >
        <Container className="py-5">
          <h1 className="display-4 fw-bold text-center mb-2">
            Our Featured Property
          </h1>
          <p className="text-center mb-0 opacity-75">
            Experience luxury and comfort in our exceptional property
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Property Card */}
        <Row className="justify-content-center">
          <Col lg={10} md={12}>
            <PropertyCard property={property} isLoading={isLoading} />
          </Col>
        </Row>
      </Container>

      {/* Photo Gallery Modal */}
      <Modal
        show={showGallery}
        onHide={() => setShowGallery(false)}
        centered
        size="xl"
        className="gallery-modal"
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: colors.primary, color: colors.white }}
        >
          <Modal.Title>{property.title} - Photo Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Carousel
            activeIndex={activeIndex}
            onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
            interval={null}
            indicators={true}
            style={{ backgroundColor: colors.dark }}
          >
            {property.images.map((image, index) => (
              <Carousel.Item key={index}>
                <div
                  style={{
                    height: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.dark,
                  }}
                >
                  <img
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: colors.primaryLight }}>
          <div className="text-muted">
            Image {activeIndex + 1} of {property.images.length}
          </div>
        </Modal.Footer>
      </Modal>

      {/* More Properties Coming Soon Section */}
      <Container className="py-5">
        <div
          className="rounded-4 shadow p-5 text-center mb-5"
          style={{ backgroundColor: colors.white }}
        >
          <div className="mb-4">
            <span
              className="d-inline-block p-3 rounded-circle mb-3"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <FaRegCalendarAlt size={32} style={{ color: colors.primary }} />
            </span>
          </div>
          <h2 className="mb-3" style={{ color: colors.primary }}>
            More Properties Coming Soon!
          </h2>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "700px" }}>
            We're expanding our portfolio with new exceptional properties. Sign
            up for our newsletter to be the first to know when new listings
            become available.
          </p>
          <Button
            variant="primary"
            href="#newsletter"
            className="px-4 py-2"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              borderRadius: "8px",
            }}
          >
            Subscribe for Updates
          </Button>
        </div>
      </Container>

      {/* Newsletter Section */}
      <div id="newsletter">
        <Newsletter />
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .property-card {
          background: ${colors.white};
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .property-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
        }

        .btn-primary:hover {
          background-color: ${colors.primaryDark} !important;
          border-color: ${colors.primaryDark} !important;
        }

        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 2px rgba(0, 68, 204, 0.25);
          border-color: ${colors.primary};
        }

        .cont {
          margin-top: 150px;
        }

        .gallery-modal .carousel-control-prev,
        .gallery-modal .carousel-control-next {
          width: 10%;
        }

        .gallery-modal .carousel-indicators {
          bottom: 20px;
        }

        .feature-list {
          list-style-type: none;
          padding-left: 0;
        }

        .feature-list li {
          position: relative;
          padding-left: 24px;
        }

        .feature-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: ${colors.primary};
          font-weight: bold;
        }

        .image-container {
          position: relative;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0) 50%
          );
          border-radius: 16px 16px 0 0;
        }
      `}</style>
    </div>
  );
};

export default PropertiesPage;
