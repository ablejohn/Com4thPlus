import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { useProperties } from "../services/propertyContext";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
} from "react-icons/fa";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { properties, loading } = useProperties();

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h2>Loading property details...</h2>
      </Container>
    );
  }

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <Container className="py-5 text-center">
        <h2>Property not found</h2>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={
                property.images && property.images[0]
                  ? property.images[0]
                  : "https://via.placeholder.com/600x400"
              }
              alt={property.title}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x400";
              }}
            />
          </Card>
        </Col>
        <Col md={6}>
          <h2>{property.title}</h2>
          <Badge bg="primary">{property.availability}</Badge>
          <p className="mt-3">
            <FaMapMarkerAlt className="text-info" /> {property.location}
          </p>
          <p>
            <FaBed className="text-info" /> {property.beds ?? "N/A"} Beds |
            <FaBath className="text-info" /> {property.baths ?? "N/A"} Baths |
            <FaRulerCombined className="text-info" />{" "}
            {(property.sqft ?? 0).toLocaleString()} sqft
          </p>
          <p>
            <FaCalendarAlt className="text-info" /> Added on{" "}
            {new Date().toLocaleDateString()}
          </p>
          <h4 className="text-success">
            ₦{(property.priceNaira ?? 0).toLocaleString()}
          </h4>
          <Button variant="primary" className="mt-3">
            Contact Agent
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PropertyDetailPage;
