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
  FaUsers,
  FaPhone,
  FaMoneyBillWave,
  FaUtensils,
  FaHome
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
  Tab,
  Nav
} from "react-bootstrap";
import Newsletter from "../sections/newsletter";

// Theme configuration
const theme = {
  colors: {
    primary: "#0044cc",
    primaryDark: "#003399",
    primaryLight: "#e6eeff",
    accent: "#FF385C",
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
    circle: "50%"
  },
  boxShadow: {
    sm: "0 4px 12px rgba(0, 0, 0, 0.05)",
    md: "0 8px 24px rgba(0, 0, 0, 0.08)",
    lg: "0 16px 32px rgba(0, 0, 0, 0.1)"
  },
  transition: "all 0.3s ease",
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "2.5rem"
  }
};

const PropertiesPage = () => {
  // Enhanced property data
  const property = {
    id: 1,
    images: [
      "appartment1.jpg",
      "appartment1-living.jpg",
      "appartment1-bedroom.jpg",
      "appartment1-kitchen.jpg",
      "appartment1-bathroom.jpg",
    ],
    title: "COM4TH PLUS LIMITED Apartment",
    description:
      "Experience modern living in this stylish apartment located at 6c Oduduwa Street, Near bon hotel/ insight communications opposite police special unit, GRA IKEJA. Perfect for both short and long stays, with flexible options for regular stays or social gatherings.",
    location: "6c Oduduwa Street, GRA IKEJA",
    contactPhone: "0814 318 3494",
    pricingOptions: [
      { bedrooms: 5, price: 350000, label: "5 Bedrooms" },
      { bedrooms: 4, price: 300000, label: "4 Bedrooms" },
      { bedrooms: 3, price: 250000, label: "3 Bedrooms" },
    ],
    defaultBedrooms: 5,
    bathrooms: 4,
    rating: 4.8,
    reviews: 124,
    type: "Apartment",
    amenities: [
      "Free Parking",
      "Fitness Center",
      "Swimming Pool",
      "High-Speed WiFi",
      "Air Conditioning",
      "24/7 Security",
      "Smart Home Features",
      "Elevator Access",
    ],
    superhost: true,
    size: "1,200 sq ft",
    availability: "Available Now",
    featuredHighlights: [
      "Spacious living areas with modern furnishings",
      "Fully equipped kitchen with premium appliances",
      "24/7 security service with CCTV monitoring",
      "Exclusive rooftop terrace with panoramic views",
      "Central location with easy access to major attractions"
    ],
    partyDetails: {
      maxGuests: 30,
      priceRange: "500k to 550k",
      cautionFee: 100000,
      cookingAllowed: false,
      notes: "All rooms included. Strictly enforced guest limit."
    },
  };

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedBedrooms, setSelectedBedrooms] = useState(property.defaultBedrooms);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get current price based on selected bedrooms
  const getCurrentPrice = () => {
    const option = property.pricingOptions.find(opt => opt.bedrooms === selectedBedrooms);
    return option ? option.price : property.pricingOptions[0].price;
  };

  const toggleFavorite = (event) => {
    event.preventDefault();
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
        <Card className="property-card border-0 h-100" style={{
          boxShadow: theme.boxShadow.md,
          borderRadius: theme.borderRadius.md,
        }}>
          <Placeholder as="div" animation="glow">
            <Placeholder xs={12} style={{ height: "400px", borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0` }} />
          </Placeholder>
          <Card.Body className="p-4">
            <Placeholder as="h5" animation="glow">
              <Placeholder xs={8} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={6} /> <Placeholder xs={4} />
            </Placeholder>
            <Placeholder as="div" animation="glow" className="d-flex gap-2 mb-3">
              <Placeholder xs={2} /> <Placeholder xs={2} /> <Placeholder xs={2} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={12} /> <Placeholder xs={10} />
            </Placeholder>
          </Card.Body>
        </Card>
      );
    }

    return (
      <Card
        className="property-card border-0 h-100"
        style={{
          transition: theme.transition,
          borderRadius: theme.borderRadius.md,
          boxShadow: theme.boxShadow.md,
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
                backgroundColor: theme.colors.primary,
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
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <FaHeart
              size={20}
              color={isFavorite ? theme.colors.accent : theme.colors.gray}
            />
          </Button>
          <Button
            variant="primary"
            className="position-absolute rounded-pill px-3 py-2"
            style={{
              bottom: "20px",
              right: "20px",
              zIndex: 1,
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
              boxShadow: theme.boxShadow.sm,
            }}
            onClick={(e) => openGallery(e)}
          >
            <FaImages className="me-2" />
            <span className="d-none d-sm-inline">View All Photos</span>
          </Button>
          <div
            className="image-container"
            style={{ cursor: "pointer" }}
            onClick={(e) => openGallery(e)}
            role="button"
            aria-label="Open photo gallery"
          >
            <img
              src={property.images[0]}
              alt={property.title}
              className="card-img-top"
              style={{
                height: "400px",
                objectFit: "cover",
                borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`,
              }}
            />
            <div className="image-overlay"></div>
          </div>
        </div>
        <Card.Body className="p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-start mb-3">
            <h2 className="card-title mb-2 mb-md-0 fw-bold h3">{property.title}</h2>
            <div className="d-flex align-items-center">
              <FaStar className="text-warning me-1" />
              <span className="fw-bold">{property.rating}</span>
              <span className="text-muted ms-1">
                ({property.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center mb-3">
            <p className="card-text me-4 mb-2 mb-md-0" style={{ color: theme.colors.primary }}>
              <FaMapMarkerAlt className="me-2" />
              {property.location}
            </p>
            <p className="card-text mb-2 mb-md-0" style={{ color: theme.colors.dark }}>
              <FaPhone className="me-2" style={{ color: theme.colors.accent }} />
              {property.contactPhone}
            </p>
          </div>

          {/* Tab Navigation */}
          <Nav 
            variant="tabs" 
            className="mb-4 flex-nowrap" 
            style={{ borderBottom: `1px solid ${theme.colors.grayLight}` }}
          >
            <Nav.Item>
              <Nav.Link 
                active={activeTab === "details"} 
                onClick={() => setActiveTab("details")}
                style={{ 
                  color: activeTab === "details" ? theme.colors.primary : theme.colors.dark,
                  fontWeight: activeTab === "details" ? "600" : "400"
                }}
              >
                Property Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === "party"} 
                onClick={() => setActiveTab("party")}
                style={{ 
                  color: activeTab === "party" ? theme.colors.primary : theme.colors.dark,
                  fontWeight: activeTab === "party" ? "600" : "400"
                }}
              >
                Party/Get-Together
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === "amenities"} 
                onClick={() => setActiveTab("amenities")}
                style={{ 
                  color: activeTab === "amenities" ? theme.colors.primary : theme.colors.dark,
                  fontWeight: activeTab === "amenities" ? "600" : "400"
                }}
              >
                Amenities
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Tab Content */}
          <div className="tab-content mb-4">
            {/* Property Details Tab */}
            <div className={`tab-pane ${activeTab === "details" ? "active" : ""}`}>
              <p className="mb-4 text-muted">{property.description}</p>
              
              <div className="status-badge d-flex flex-wrap gap-2 mb-4">
                <span
                  className="badge rounded-pill px-3 py-2"
                  style={{
                    backgroundColor: theme.colors.primaryLight,
                    color: theme.colors.primary,
                  }}
                >
                  <FaRegCalendarAlt className="me-2" />
                  {property.availability}
                </span>
                <span
                  className="badge rounded-pill px-3 py-2"
                  style={{
                    backgroundColor: theme.colors.grayLight,
                    color: theme.colors.dark,
                  }}
                >
                  <FaHome className="me-2" />
                  {property.type}
                </span>
              </div>

              <div
                className="d-flex flex-wrap text-muted mb-4 p-3 rounded"
                style={{ backgroundColor: theme.colors.light }}
              >
                <div className="me-4 mb-2 mb-md-0 d-flex align-items-center">
                  <FaBed
                    className="me-2"
                    style={{ color: theme.colors.primary }}
                    size={20}
                  />
                  <span>{selectedBedrooms} Bedrooms</span>
                </div>
                <div className="me-4 mb-2 mb-md-0 d-flex align-items-center">
                  <FaBath
                    className="me-2"
                    style={{ color: theme.colors.primary }}
                    size={18}
                  />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="d-flex align-items-center">
                  <FaStopwatch
                    className="me-2"
                    style={{ color: theme.colors.primary }}
                    size={18}
                  />
                  <span>{property.size}</span>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="mb-3 fw-bold">Select Bedroom Option:</h5>
                <div className="d-flex flex-wrap gap-2">
                  {property.pricingOptions.map((option) => (
                    <Badge
                      key={option.bedrooms}
                      bg={selectedBedrooms === option.bedrooms ? "primary" : "light"}
                      text={selectedBedrooms === option.bedrooms ? "white" : "dark"}
                      className="py-2 px-3 pricing-option"
                      onClick={() => setSelectedBedrooms(option.bedrooms)}
                      style={{
                        borderRadius: "20px",
                        backgroundColor: selectedBedrooms === option.bedrooms 
                          ? theme.colors.primary 
                          : theme.colors.grayLight,
                        cursor: "pointer",
                        transition: theme.transition,
                      }}
                    >
                      {option.label}: ₦{option.price.toLocaleString()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div
                className="featured-section p-4 mb-4 rounded"
                style={{ backgroundColor: theme.colors.primaryLight }}
              >
                <h5 className="mb-3 fw-bold" style={{ color: theme.colors.primaryDark }}>
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
            </div>

            {/* Party/Get-Together Tab */}
            <div className={`tab-pane ${activeTab === "party" ? "active" : ""}`}>
              <div
                className="party-details p-4 mb-4 rounded"
                style={{ backgroundColor: theme.colors.primaryLight }}
              >
                <h5 className="mb-3 fw-bold" style={{ color: theme.colors.primaryDark }}>
                  Party/Get-Together Details
                </h5>
                <ul className="mb-0 feature-list">
                  <li className="mb-3 d-flex align-items-start">
                    <FaUsers className="me-3 mt-1" style={{ color: theme.colors.primary }} />
                    <div>
                      <strong>Maximum Guests:</strong> 
                      <p className="mb-0">Strictly limited to {property.partyDetails.maxGuests} people</p>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <FaMoneyBillWave className="me-3 mt-1" style={{ color: theme.colors.primary }} />
                    <div>
                      <strong>Pricing:</strong>
                      <p className="mb-0">₦{property.partyDetails.priceRange} for all rooms</p>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <FaMoneyBillWave className="me-3 mt-1" style={{ color: theme.colors.success }} />
                    <div>
                      <strong>Refundable Caution Fee:</strong>
                      <p className="mb-0">₦{property.partyDetails.cautionFee.toLocaleString()} for all categories</p>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <FaUtensils className="me-3 mt-1" style={{ color: theme.colors.accent }} />
                    <div>
                      <strong>Cooking Policy:</strong>
                      <p className="mb-0" style={{ color: property.partyDetails.cookingAllowed ? theme.colors.success : theme.colors.accent }}>
                        {property.partyDetails.cookingAllowed ? "Large cooking allowed" : "No large cooking is allowed for any get together or party"}
                      </p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                  <p className="mb-0 text-center fw-bold" style={{ color: theme.colors.primaryDark }}>
                    {property.partyDetails.notes}
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities Tab */}
            <div className={`tab-pane ${activeTab === "amenities" ? "active" : ""}`}>
              <h5 className="mb-3 fw-bold">Property Amenities</h5>
              <Row className="row-cols-1 row-cols-md-2 g-4 mb-4">
                {property.amenities.map((amenity, index) => (
                  <Col key={index}>
                    <div className="d-flex align-items-center p-3 rounded" style={{ backgroundColor: theme.colors.grayLight }}>
                      {amenity.includes("WiFi") && <FaWifi className="me-3" style={{ color: theme.colors.primary }} />}
                      {amenity.includes("Parking") && <FaCar className="me-3" style={{ color: theme.colors.primary }} />}
                      {amenity.includes("Pool") && <FaSwimmingPool className="me-3" style={{ color: theme.colors.primary }} />}
                      {amenity.includes("Fitness") && <FaDumbbell className="me-3" style={{ color: theme.colors.primary }} />}
                      <span>{amenity}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>

          <div
            className="price-section p-4 rounded"
            style={{ backgroundColor: theme.colors.light }}
          >
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div className="mb-3 mb-md-0">
                <span className="h3 fw-bold" style={{ color: theme.colors.primary }}>
                  ₦{getCurrentPrice().toLocaleString()}
                </span>
                <span className="text-muted">/month</span>
              </div>
              <div className="d-flex flex-wrap gap-3">
                <Button
                  variant="outline-primary"
                  as={Link}
                  to="/propertydetail"
                  style={{
                    borderRadius: theme.borderRadius.sm,
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary,
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant="primary"
                  style={{
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.sm,
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
    <div className="min-vh-40 property-container" style={{ backgroundColor: theme.colors.light }}>
      {/* Header with clean background */}
      <div
        style={{
          backgroundColor: theme.colors.light,
          color: theme.colors.primaryDark,
          marginTop: "-120px",
          marginBottom: "10px",
          position: "relative",
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

      <Container className="py-3 py-md-5">
        {/* Property Card */}
        <Row className="justify-content-center">
          <Col xl={10} lg={12}>
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
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.white }}
        >
          <Modal.Title>{property.title} - Photo Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Carousel
            activeIndex={activeIndex}
            onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
            interval={null}
            indicators={true}
            style={{ backgroundColor: theme.colors.dark }}
          >
            {property.images.map((image, index) => (
              <Carousel.Item key={index}>
                <div
                  style={{
                    height: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.colors.dark,
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
        <Modal.Footer style={{ backgroundColor: theme.colors.primaryLight }}>
          <div className="text-muted">
            Image {activeIndex + 1} of {property.images.length}
          </div>
        </Modal.Footer>
      </Modal>

      {/* More Properties Coming Soon Section */}
      <Container className="py-5">
        <div
          className="rounded-4 shadow p-4 p-md-5 text-center mb-5"
          style={{ backgroundColor: theme.colors.white }}
        >
          <div className="mb-4">
            <span
              className="d-inline-block p-3 rounded-circle mb-3"
              style={{ backgroundColor: theme.colors.primaryLight }}
            >
              <FaRegCalendarAlt size={32} style={{ color: theme.colors.primary }} />
            </span>
          </div>
          <h2 className="mb-3" style={{ color: theme.colors.primary }}>
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
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
              borderRadius: theme.borderRadius.sm,
            }}
          >
            Subscribe for Updates
          </Button>
        </div>
      </Container>

      {/* Custom CSS */}
      <style jsx>{`
        .property-container {
          margin-top: 150px;
        }

        .property-card {
          background: ${theme.colors.white};
          border-radius: ${theme.borderRadius.md};
          overflow: hidden;
          box-shadow: ${theme.boxShadow.md};
        }

        .property-card:hover {
          transform: translateY(-8px);
          box-shadow: ${theme.boxShadow.lg};
        }

        .btn-primary:hover {
          background-color: ${theme.colors.primaryDark} !important;
          border-color: ${theme.colors.primaryDark} !important;
        }

        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 2px rgba(0, 68, 204, 0.25);
          border-color: ${theme.colors.primary};
        }

        .gallery-modal .carousel-control-prev,
        .gallery-modal .carousel-control-next {
          width: 10%;
          background: rgba(0, 0, 0, 0.2);
          height: 100px;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 8px;
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
          color: ${theme.colors.primary};
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
          border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
        }

        .pricing-option:hover {
          transform: translateY(-2px);
          box-shadow: ${theme.boxShadow.sm};
        }

        .tab-pane {
          display: none;
        }

        .tab-pane.active {
          display: block;
        }

        @media (max-width: 768px) {
          .property-container {
            margin-top: 120px;
          }
          
          .card-title {
            font-size: 1.5rem;
          }
          
          .image-container img {
            height: 300px !important;
          }
        }

        @media (max-width: 576px) {
          .image-container img {
            height: 250px !important;
          }
          
          .price-section {
            text-align: center;
          }
          
          .price-section .d-flex {
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertiesPage;