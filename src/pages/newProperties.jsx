import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Placeholder,
  Badge,
  ListGroup,
} from "react-bootstrap";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/properties`
      );
      setProperties(response.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to fetch properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `₦${Number(price).toLocaleString()}`;

  if (loading) {
    return (
      <Container fluid className="py-5 bg-light min-vh-100">
        <h1 className="text-center mb-5 fw-bold display-4">Our Properties</h1>
        <Row xs={1} md={2} className="g-5 justify-content-center">
          {[...Array(4)].map((_, index) => (
            <Col key={index}>
              <Card className="shadow-lg border-0">
                <Placeholder as={Card.Img} style={{ height: "400px" }} />
                <Card.Body>
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={8} />
                    <Placeholder xs={4} />
                  </Placeholder>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <p className="text-danger fs-4">{error}</p>
        <Button onClick={fetchProperties} variant="primary" size="lg">
          Retry
        </Button>
      </Container>
    );
  }

  if (properties.length === 0) {
    return (
      <Container className="text-center mt-5">
        <p className="fs-3 text-muted">
          No properties available at the moment.
        </p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5 bg-light min-vh-100">
      <h1 className="text-center mb-5 fw-bold display-4 text-dark">
        Our Exclusive Properties
      </h1>
      <Row xs={1} md={2} className="g-5 justify-content-center">
        {properties.map((property) => (
          <Col key={property.id} className="d-flex">
            <Card
              className="shadow-lg border-0 w-100"
              style={{ maxWidth: "600px" }}
            >
              {/* Image */}
              <Card.Img
                variant="top"
                src={
                  property.images?.[0]
                    ? `${import.meta.env.VITE_API_BASE_URL}${
                        property.images[0]
                      }`
                    : "/placeholder-property.jpg"
                }
                style={{
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "15px 15px 0 0",
                }}
                alt={property.title}
                onError={(e) => {
                  e.target.src = "/placeholder-property.jpg";
                  e.target.onerror = null;
                }}
              />

              <Card.Body className="p-4">
                {/* Title and Availability */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Card.Title className="fw-bold fs-3 mb-0">
                    {property.title || "Untitled Property"}
                  </Card.Title>
                  <Badge
                    bg={property.availability ? "success" : "danger"}
                    className="fs-6 px-3 py-2"
                  >
                    {property.availability ? "Available Now" : "Not Available"}
                  </Badge>
                </div>

                {/* Location */}
                <Card.Text className="mb-3 fs-5 text-muted">
                  <i className="bi bi-geo-alt me-2"></i>
                  {property.location || "N/A"}
                </Card.Text>

                {/* Description */}
                <Card.Text className="mb-4 text-secondary">
                  {property.description || "No description available"}
                </Card.Text>

                {/* Pricing Options */}
                {property.pricing_options?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="fw-semibold text-dark">Pricing Options</h5>
                    <ListGroup variant="flush">
                      {property.pricing_options.map((option, idx) => (
                        <ListGroup.Item key={idx} className="border-0 p-0 mb-2">
                          <span className="fw-medium">
                            {option.label ||
                              `${option.bedrooms} Bedroom${
                                option.bedrooms !== "1" ? "s" : ""
                              }`}
                          </span>
                          :{" "}
                          <span className="text-primary">
                            {formatPrice(option.price)}
                          </span>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}

                {/* Additional Details */}
                <div className="mb-4">
                  <h5 className="fw-semibold text-dark">Property Details</h5>
                  <p className="mb-1">
                    <strong>Type:</strong> {property.type || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Bathrooms:</strong> {property.bathrooms || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Size:</strong>{" "}
                    {property.size ? `${property.size} sq ft` : "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Contact:</strong> {property.contact_phone || "N/A"}
                  </p>
                  <p className="mb-0">
                    <strong>Superhost:</strong>{" "}
                    {property.superhost ? "Yes" : "No"}
                  </p>
                </div>

                {/* Featured Highlights */}
                {property.featured_highlights?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="fw-semibold text-dark">
                      Featured Highlights
                    </h5>
                    <ListGroup variant="flush">
                      {property.featured_highlights.map((highlight, idx) => (
                        <ListGroup.Item
                          key={idx}
                          className="border-0 p-0 mb-2 text-secondary"
                        >
                          <i className="bi bi-check-circle-fill me-2 text-success"></i>
                          {highlight}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}
              </Card.Body>

              {/* Party Details */}
              {property.party_details && (
                <Card.Footer className="bg-white p-4 border-top">
                  <h5 className="fw-semibold text-dark mb-3">Party Details</h5>
                  <p className="mb-1">
                    <strong>Max Guests:</strong>{" "}
                    {property.party_details.max_guests || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Price Range:</strong>{" "}
                    {property.party_details.price_range || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Caution Fee:</strong>{" "}
                    {formatPrice(property.party_details.caution_fee) || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Cooking Allowed:</strong>{" "}
                    {property.party_details.cooking_allowed ? "Yes" : "No"}
                  </p>
                  <p className="mb-0">
                    <strong>Notes:</strong>{" "}
                    {property.party_details.notes || "None"}
                  </p>
                </Card.Footer>
              )}

              {/* Action Button */}
              <div className="p-4 pt-0">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={!property.availability}
                >
                  {property.availability ? "Book Now" : "Currently Unavailable"}
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Properties;
