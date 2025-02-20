// src/pages/Properties.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Container, Row, Col } from "react-bootstrap";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/properties` // Add /api here
      );
      setProperties(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching properties:", err); // Add error logging
      setError("Failed to fetch properties");
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <Container className="py-5">
      <h2 className="mb-4">Available Properties</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {properties.map((property) => (
          <Col key={property.id}>
            <Card className="h-100 shadow-sm">
              {property.images && property.images[0] && (
                <Card.Img
                  variant="top"
                  src={`${import.meta.env.VITE_API_BASE_URL}/api${
                    property.images[0]
                  }`}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title>{property.title}</Card.Title>
                <Card.Text className="mb-2">{property.location}</Card.Text>
                <div className="small text-muted mb-2">
                  {property.pricing_options && property.pricing_options[0] && (
                    <div>
                      From ${property.pricing_options[0].price} |{" "}
                      {property.pricing_options[0].bedrooms} Bedrooms
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-between align-items-center">
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
              <Card.Footer className="bg-white">
                <small className="text-muted">
                  {property.featured_highlights &&
                    property.featured_highlights[0]}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Properties;
