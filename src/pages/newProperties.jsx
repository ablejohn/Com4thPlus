import React from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { useProperties } from "../services/propertyContext"; // Adjust path based on your project structure
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { theme } from "../styling/theme"; // Adjust path as needed

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
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1
          style={{
            color: theme.colors?.primary || "#007bff",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Our Properties
        </h1>
        <p className="lead" style={{ maxWidth: "800px", margin: "0 auto" }}>
          Discover our exclusive selection of premium properties in desirable
          locations. Each property has been carefully selected to meet our high
          standards of quality and comfort.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="text-center my-5">
          <h3>No properties available at the moment</h3>
          <p>Please check back soon for new listings!</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {properties.map((property) => (
            <Col key={property.id}>
              <Card
                className="h-100 shadow-sm"
                style={{
                  borderRadius: theme.borderRadius?.md || "8px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 12px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
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
                      e.target.src =
                        "https://placehold.co/600x400?text=Property+Image";
                    }}
                  />
                </div>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title
                      style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                    >
                      {property.title}
                    </Card.Title>
                    <Badge
                      bg={getBadgeVariant(property.availability)}
                      style={{ padding: "0.5rem 0.75rem" }}
                    >
                      {property.availability}
                    </Badge>
                  </div>
                  <Card.Text className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FaMapMarkerAlt
                        style={{
                          color: theme.colors?.primary || "#007bff",
                          marginRight: "8px",
                        }}
                      />
                      <span>{property.location}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt
                        style={{
                          color: theme.colors?.primary || "#007bff",
                          marginRight: "8px",
                        }}
                      />
                      <span>Added on {new Date().toLocaleDateString()}</span>
                    </div>
                  </Card.Text>
                </Card.Body>
                <Card.Footer
                  style={{
                    background: "transparent",
                    borderTop: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    style={{
                      borderColor: theme.colors?.primary || "#007bff",
                      color: theme.colors?.primary || "#007bff",
                    }}
                  >
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default PropertyListingPage;
