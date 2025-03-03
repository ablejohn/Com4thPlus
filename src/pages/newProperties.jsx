import React from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { useProperties } from "../services/propertyContext";
import { FaMapMarkerAlt, FaCalendarAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { motion } from "framer-motion";

const PropertyListingPage = () => {
  const { properties, loading } = useProperties();

  // Function to determine badge color based on availability
  const getBadgeVariant = (availability) => {
    switch (availability) {
      case "Available Now":
        return "success";
      case "Coming Soon":
        return "warning";
      case "Sold Out":
        return "danger";
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
      <Container className="py-md-4">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <div 
              className="d-inline-block px-3 py-2 rounded-pill mb-3" 
              style={{ background: "rgba(64, 224, 208, 0.1)", color: "#40E0D0" }}
            >
              <span className="fw-semibold" style={{ fontSize: "0.85rem", letterSpacing: "0.05em" }}>
                PREMIUM PROPERTIES
              </span>
            </div>
            <h2 className="display-5 fw-bold mb-3">Our Properties</h2>
            <p 
              className="text-muted" 
              style={{ fontSize: "1.1rem", maxWidth: "80%", margin: "0 auto" }}
            >
              Discover our exclusive selection of premium properties in desirable
              locations. Each property has been carefully selected to meet our high
              standards of quality and comfort.
            </p>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="text-center my-5">
            <h3>No properties available at the moment</h3>
            <p>Please check back soon for new listings!</p>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {properties.map((property, index) => (
              <Col key={property.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="h-100"
                >
                  <Card
                    className="h-100 border-0 shadow-sm position-relative overflow-hidden"
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
                    {/* Decorative accent */}
                    <div 
                      className="position-absolute" 
                      style={{ 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        height: "6px", 
                        background: "linear-gradient(90deg, #40E0D0, #20B2AA)",
                        zIndex: 1
                      }} 
                    />
                    
                    <Badge
                      bg={getBadgeVariant(property.availability)}
                      style={{ 
                        position: "absolute", 
                        top: "20px", 
                        right: "20px", 
                        zIndex: 2,
                        padding: "0.5rem 0.75rem",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        borderRadius: "8px"
                      }}
                    >
                      {property.availability}
                    </Badge>
                    
                    <div 
                      style={{ 
                        height: "220px", 
                        overflow: "hidden",
                        position: "relative"
                      }}
                    >
                      <Card.Img
                        src={property.images[0]}
                        alt={property.title}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        onError={(e) => {
                          e.target.src = "/api/placeholder/600/400";
                        }}
                      />
                    </div>
                    
                    <Card.Body className="p-4">
                      <Card.Title
                        className="mb-3 fw-bold"
                        style={{ fontSize: "1.2rem" }}
                      >
                        {property.title}
                      </Card.Title>
                      
                      <div className="d-flex align-items-center mb-3">
                        <FaMapMarkerAlt
                          style={{
                            color: "#40E0D0",
                            marginRight: "8px",
                          }}
                        />
                        <span style={{ color: "#495057" }}>{property.location}</span>
                      </div>
                      
                      {/* Property features */}
                      <div className="d-flex justify-content-between mb-4">
                        <div className="d-flex align-items-center">
                          <FaBed 
                            style={{
                              color: "#40E0D0",
                              marginRight: "6px",
                            }}
                          />
                          <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                            {property.bedrooms || 3} Beds
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <FaBath 
                            style={{
                              color: "#40E0D0",
                              marginRight: "6px",
                            }}
                          />
                          <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                            {property.bathrooms || 2} Baths
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <FaRulerCombined 
                            style={{
                              color: "#40E0D0",
                              marginRight: "6px",
                            }}
                          />
                          <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                            {property.area || "1,200"} sqft
                          </span>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt
                          style={{
                            color: "#40E0D0",
                            marginRight: "8px",
                          }}
                        />
                        <span style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                          Added on {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </Card.Body>
                    
                    <div
                      className="p-4 pt-0"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span style={{ fontSize: "0.85rem", color: "#6c757d" }}>Starting at</span>
                          <p className="mb-0 fw-bold" style={{ color: "#40E0D0", fontSize: "1.4rem" }}>
                            ${property.price || "250"}<span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>/night</span>
                          </p>
                        </div>
                        <Button
                          variant="outline-primary"
                          style={{
                            borderColor: "#40E0D0",
                            color: "#40E0D0",
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                            padding: "0.5rem 1.25rem"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#40E0D0";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#40E0D0";
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
        
        {/* CTA Button */}
        <div className="text-center mt-5">
          <Button 
            variant="outline-primary"
            className="px-4 py-2"
            style={{ 
              borderColor: "#40E0D0", 
              color: "#40E0D0",
              borderRadius: "8px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#40E0D0";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#40E0D0";
            }}
          >
            View All Properties
          </Button>
        </div>
      </Container>
      
      {/* Background decorative elements */}
      <div 
        className="position-absolute" 
        style={{ 
          width: "300px", 
          height: "300px", 
          background: "radial-gradient(circle, rgba(64, 224, 208, 0.08) 0%, rgba(255,255,255,0) 70%)",
          top: "10%",
          left: "-100px",
          borderRadius: "50%",
          zIndex: 0
        }}
      />
      
      <div 
        className="position-absolute" 
        style={{ 
          width: "350px", 
          height: "350px", 
          background: "radial-gradient(circle, rgba(64, 224, 208, 0.05) 0%, rgba(255,255,255,0) 70%)",
          bottom: "5%",
          right: "-150px",
          borderRadius: "50%",
          zIndex: 0
        }}
      />
      
      {/* Responsive styles */}
      <style jsx="true">{`
        @media (max-width: 768px) {
          .card-body {
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default PropertyListingPage;