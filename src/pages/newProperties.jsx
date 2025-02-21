import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Placeholder,
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
      <Container className="py-5">
        <h2 className="mb-4">Available Properties</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {[...Array(6)].map((_, index) => (
            <Col key={index}>
              <Card className="h-100 shadow-sm">
                <Placeholder as={Card.Img} style={{ height: "200px" }} />
                <Card.Body>
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={8} />
                    <Placeholder xs={4} />
                  </Placeholder>
                </Card.Body>
                <Card.Footer>
                  <Placeholder.Button variant="secondary" xs={4} />
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <p className="text-danger">{error}</p>
        <Button onClick={fetchProperties} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center mt-5">
        <p>No properties available at the moment.</p>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Available Properties</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {properties.map((property) => (
          <Col key={property.id}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={
                  property.images?.[0]
                    ? `${import.meta.env.VITE_API_BASE_URL}${
                        property.images[0]
                      }`
                    : "/placeholder-property.jpg"
                }
                style={{ height: "200px", objectFit: "cover" }}
                alt={property.title}
                onError={(e) => {
                  e.target.src = "/placeholder-property.jpg";
                  e.target.onerror = null;
                }}
              />
              <Card.Body>
                <Card.Title>{property.title}</Card.Title>
                <Card.Text>{property.location}</Card.Text>
                {property.pricing_options?.[0] && (
                  <div className="small text-muted">
                    From {formatPrice(property.pricing_options[0].price)} |{" "}
                    {property.pricing_options[0].bedrooms} Bedroom
                    {property.pricing_options[0].bedrooms !== "1" ? "s" : ""}
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span
                    className={`badge ${
                      property.availability === "Available Now"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    {property.availability}
                  </span>
                  {property.superhost && (
                    <span className="badge bg-primary">Superhost</span>
                  )}
                </div>
              </Card.Body>
              {property.featured_highlights?.length > 0 && (
                <Card.Footer className="bg-white">
                  <small className="text-muted">
                    {property.featured_highlights[0]}
                  </small>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Properties;
