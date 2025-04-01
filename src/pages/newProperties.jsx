import React from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { useProperties } from "../services/propertyContext";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
} from "react-icons/fa";
import { motion } from "framer-motion";

const PropertyListingPage = () => {
  const { properties, loading } = useProperties();

  // Function to determine badge color based on availability
  const getBadgeVariant = (availability) => {
    switch (availability) {
      case "Available Now":
        return "success";
      case "Coming Soon":
        return "danger";
      case "Not Available":
        return "warning";
      default:
        return "primary";
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h2>Loading properties...</h2>
      </Container>
    );
  }

  return (
    <section
      className="py-5 position-relative"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
        overflow: "hidden",
      }}
    >
      <Container className="py-md-5">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <div
              className="d-inline-block px-4 py-2 rounded-pill mb-4"
              style={{
                background: "rgba(64, 224, 208, 0.15)",
                color: "#20B2AA",
                boxShadow: "0 2px 8px rgba(32, 178, 170, 0.15)",
              }}
            >
              <span
                className="fw-semibold"
                style={{ fontSize: "0.9rem", letterSpacing: "0.08em" }}
              >
                PREMIUM PROPERTIES
              </span>
            </div>
            <h2 className="display-4 fw-bold mb-4" style={{ color: "#2c3e50" }}>Our Properties</h2>
            <p
              className="text-muted"
              style={{ fontSize: "1.15rem", maxWidth: "85%", margin: "0 auto", lineHeight: "1.6" }}
            >
              Discover our exclusive selection of premium properties in
              desirable locations. Each property has been carefully selected to
              meet our high standards of quality and comfort.
            </p>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="text-center my-5">
            <h3>No properties available at the moment</h3>
            <p>Please check back soon for new listings!</p>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4 mb-4">
            {properties.map((property, index) => (
              <Col key={property.id} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="h-100"
                >
                  <Card
                    className="h-100 border-0 shadow-sm position-relative overflow-hidden"
                    style={{
                      borderRadius: "20px",
                      transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)",
                      backgroundColor: "#ffffff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-12px)";
                      e.currentTarget.style.boxShadow =
                        "0 18px 35px rgba(0, 48, 135, 0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(0, 0, 0, 0.06)";
                    }}
                  >
                    <div
                      className="position-absolute"
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "8px",
                        background: "linear-gradient(90deg, #40E0D0, #20B2AA, #5f9ea0)",
                        zIndex: 1,
                        borderTopLeftRadius: "20px",
                        borderTopRightRadius: "20px",
                      }}
                    />

                    <Badge
                      bg={getBadgeVariant(property.availability)}
                      style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        zIndex: 2,
                        padding: "0.6rem 1rem",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        borderRadius: "12px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em"
                      }}
                    >
                      {property.availability}
                    </Badge>

                    <div
                      style={{
                        height: "240px",
                        overflow: "hidden",
                        position: "relative",
                        borderTopLeftRadius: "20px",
                        borderTopRightRadius: "20px",
                      }}
                    >
                      <div 
                        className="position-absolute"
                        style={{
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4))",
                          zIndex: 1,
                          pointerEvents: "none"
                        }}
                      />
                      <Card.Img
                        src={
                          property.images && property.images[0]
                            ? property.images[0]
                            : "https://via.placeholder.com/600x400"
                        }
                        alt={property.title}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          transition: "transform 0.6s ease",
                          filter: "brightness(1.02)",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.08)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/600x400";
                        }}
                      />
                    </div>

                    <Card.Body className="p-4">
                      <Card.Title
                        className="mb-3 fw-bold"
                        style={{ fontSize: "1.25rem", color: "#2c3e50" }}
                      >
                        {property.title}
                      </Card.Title>

                      <div className="d-flex align-items-center mb-4">
                        <div 
                          style={{
                            backgroundColor: "rgba(64, 224, 208, 0.15)",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "12px"
                          }}
                        >
                          <FaMapMarkerAlt
                            style={{
                              color: "#20B2AA",
                              fontSize: "14px"
                            }}
                          />
                        </div>
                        <span style={{ color: "#495057", fontWeight: "500" }}>
                          {property.location}
                        </span>
                      </div>

                      {/* Property features */}
                      <div className="d-flex justify-content-between mb-4 flex-wrap">
                        <div className="d-flex align-items-center me-3 mb-3">
                          <div 
                            style={{
                              backgroundColor: "rgba(64, 224, 208, 0.1)",
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "10px"
                            }}
                          >
                            <FaBed
                              style={{
                                color: "#20B2AA",
                                fontSize: "16px"
                              }}
                            />
                          </div>
                          <span
                            style={{ fontSize: "0.95rem", color: "#495057", fontWeight: "500" }}
                          >
                            {property.beds ?? "N/A"} Beds
                          </span>
                        </div>
                        <div className="d-flex align-items-center me-3 mb-3">
                          <div 
                            style={{
                              backgroundColor: "rgba(64, 224, 208, 0.1)",
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "10px"
                            }}
                          >
                            <FaBath
                              style={{
                                color: "#20B2AA",
                                fontSize: "16px"
                              }}
                            />
                          </div>
                          <span
                            style={{ fontSize: "0.95rem", color: "#495057", fontWeight: "500" }}
                          >
                            {property.baths ?? "N/A"} Baths
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <div 
                            style={{
                              backgroundColor: "rgba(64, 224, 208, 0.1)",
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "10px"
                            }}
                          >
                            <FaRulerCombined
                              style={{
                                color: "#20B2AA",
                                fontSize: "16px"
                              }}
                            />
                          </div>
                          <span
                            style={{ fontSize: "0.95rem", color: "#495057", fontWeight: "500" }}
                          >
                            {(property.sqft ?? 0).toLocaleString()} sqft
                          </span>
                        </div>
                      </div>
                     
                    </Card.Body>

                    <div className="p-4 pt-0">
                      <hr style={{ border: "none", height: "1px", background: "rgba(0,0,0,0.06)", margin: "0 0 20px 0" }} />
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div className="mb-3 mb-md-0">
                          <span
                            style={{ fontSize: "0.9rem", color: "#6c757d", fontWeight: "500" }}
                          >
                            Starting at
                          </span>
                          <p
                            className="mb-0 fw-bold"
                            style={{ color: "#20B2AA", fontSize: "1.5rem", letterSpacing: "-0.02em" }}
                          >
                            ₦{(property.priceNaira ?? 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="mt-0 mt-md-0">
                          <Link
                            to={`/property/${property.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Button
                              variant="outline-primary"
                              style={{
                                borderColor: "#20B2AA",
                                color: "#20B2AA",
                                borderRadius: "12px",
                                transition: "all 0.3s ease",
                                padding: "0.6rem 1.5rem",
                                fontWeight: "600",
                                fontSize: "0.95rem",
                                boxShadow: "0 4px 10px rgba(32, 178, 170, 0.15)",
                                borderWidth: "2px",
                                minWidth: "140px"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#20B2AA";
                                e.currentTarget.style.color = "white";
                                e.currentTarget.style.boxShadow = "0 6px 15px rgba(32, 178, 170, 0.25)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#20B2AA";
                                e.currentTarget.style.boxShadow = "0 4px 10px rgba(32, 178, 170, 0.15)";
                              }}
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}

        {/* Removed "View All Properties" button */}
      </Container>

      <div
        className="position-absolute"
        style={{
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(64, 224, 208, 0.08) 0%, rgba(255,255,255,0) 70%)",
          top: "10%",
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

      <style jsx="true">{`
        @media (max-width: 992px) {
          .card-body {
            padding: 1.5rem !important;
          }
        }
        
        @media (max-width: 767px) {
          .display-4 {
            font-size: 2.5rem !important;
          }
          
          .card {
            margin-bottom: 1rem;
          }
          
          .property-feature {
            margin-right: 1rem;
          }
          
          button {
            width: 100%;
          }
        }
        
        .card {
          will-change: transform;
        }
        
        .card-img {
          will-change: transform;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .card, .card-img {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default PropertyListingPage;